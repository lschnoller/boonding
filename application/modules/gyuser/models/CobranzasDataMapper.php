<?php

class Gyuser_Model_CobranzasDataMapper {

    protected $_dbTable;

    public function setDbTable($dbTable) {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }

    public function getDbTable() {
        if (null === $this->_dbTable) {
            $this->setDbTable('Gyuser_Model_DbTable_Cobranzas');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Cobranzas $Cobranzas) {
        $data = array(
            'operation_id' => $Cobranzas->getOperation_id(),
            'date' => $Cobranzas->getDate(),
            'check_n' => $Cobranzas->getCheck_n(),
            'amount' => $Cobranzas->getAmount(),
            'status' => $Cobranzas->getStatus()
        );
        if (null === ($id = $Cobranzas->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find($id, Gyuser_Model_Cobranzas $Cobranzas) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $Cobranzas->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        
    }

    public function SavePaymentForRejectedCheque(Gyuser_Model_Cobranzas $obj) 
    {
        list ( $Day, $Month, $Year ) = explode('/', $obj->getDate_paid());
        $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
        $Date_paid = date("Y-m-d", $stampeddate);
        $paymentType = $obj->getPayment_type();
        $data = array(
            'client_id' => $obj->getClient_id(),
            'operation_id' => $obj->getOperation_id(),
            'cheque_id' => $obj->getCheque_id(),
            'date_paid' => $Date_paid,
            'paid_amount' => $obj->getPaid_amount(),
            'previous_balance' => $obj->getPrevious_balance(),
            'current_balance' => $obj->getCurrent_balance(),
            'payment_type' => $obj->getPayment_type(),
        );
        $id = (int) $this->getDbTable()->insert($data);
        if ($id) {
            $chqMapper = new Gyuser_Model_ChequesDataMapper();
            $chqObj = new Gyuser_Model_Cheques();
            $chqObj->setBalance($obj->getCurrent_balance());
            $chqObj->setId($obj->getCheque_id());
            //$chqObj->setRejected_check_payment(1);
            $updateRes = $chqMapper->UpdateRejectedChequeBalance($chqObj);
            
            if($paymentType == 2) {//cheque propio
                $newCheObj = $obj->getCheques_obj();
                $newCheRes = $chqMapper->InsertChequeForRejectedCheque($newCheObj);
                if(!$newCheRes)
                    throw Exception('Error inserting cheque for rejected check on DB');
            }
            elseif($paymentType == 3) {//cheque de tercero
                $BankMapper = new Gyuser_Model_BankAccountsDataMapper();
                $newBankObj = $obj->getBank_accounts_obj();
                $newBankId = $BankMapper->save($newBankObj);
                if(!$newBankId)
                    throw Exception('Error inserting bank account for rejected check on DB');

                $newCheObj = $obj->getCheques_obj();
                $newCheObj->setRejected_bank_id($newBankId);
                $newCheRes = $chqMapper->InsertChequeForRejectedCheque($newCheObj);    
                if(!$newCheRes)
                    throw Exception('Error inserting cheque for rejected check on DB');           
            }
            
            if ($updateRes) {                    
                /// check if the operation has no pending checks, if it doesn't mark the whole operation as saldada
                $opMapper = new Gyuser_Model_OperationsDataMapper();
                $operationPayed = $opMapper->checkOperationSaldada($obj->getOperation_id());
                if($operationPayed) {
                    $id = $opMapper->setOperationSaldada($obj->getOperation_id());
                    if(!$id)
                        throw new Exception('There was an error updating the operation to operacion saldada');
                }else { //op. not yet payed. Here we might have no checks in cobranza but we can still have pending checks because of date.
                  $operationInCobranza = $opMapper->checkOperationCobranza($obj->getOperation_id());                      
                  if(!$operationInCobranza) { //no checks in cobranza
                    $id = $opMapper->setOperationEnCartera($obj->getOperation_id()); //get operation back to "cheques en cartera" state
                    if(!$id)
                        throw new Exception('There was an error updating the operation to cheques en cartera');
                  }
                }

                /// check if the user has no more cobranzas ops, if it doesn't set it as active
                $clMapper = new Gyuser_Model_UserDataMapper();
                $cobranzasOp = $clMapper->checkCobranzasOp($obj->getClient_id());
                if(! $cobranzasOp) {                   
                    //FIX!! Gus asked to pass clients to active once they finish paying cobranzas 
                    $id = $clMapper->setActiveClient($obj->getClient_id());
                    //$id = $clMapper->setPasiveClient($obj->getClient_id());
                    if($id)
                        $id = -1;//when user status is changed set return value to -1
                    else
                        throw new Exception('There was an error setting the client to active');
                }                    
            }
            else                        
                throw new Exception('There was an error updating the rejected check balance');
        }
        else
            throw new Exception('There was an error adding the new payment for rejected check');
        return $id;
        
    }

/*
    public function SaveOwnChequeForRejectedCheque(Gyuser_Model_Cobranzas $obj) {

        list ( $Day, $Month, $Year ) = explode('/', $obj->getDate_paid());
        $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
        $Date_paid = date("Y-m-d", $stampeddate);

        $data = array(
            'client_id' => $obj->getClient_id(),
            'operation_id' => $obj->getOperation_id(),
            'cheque_id' => $obj->getCheque_id(),
            'date_paid' => $Date_paid,
            'paid_amount' => $obj->getPaid_amount(),
            'previous_balance' => $obj->getPrevious_balance(),
            'current_balance' => $obj->getCurrent_balance(),
            'payment_type' => $obj->getPayment_type(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            if ($id) {
                $chqMapper = new Gyuser_Model_ChequesDataMapper();
                $chqObj = new Gyuser_Model_Cheques();
                $chqObj->setBalance($obj->getCurrent_balance());
                $chqObj->setId($obj->getCheque_id());
                //$chqObj->setRejected_check_payment(1);
                $updateRes = $chqMapper->UpdateRejectedChequeBalance($chqObj);
                
                $newCheObj = $obj->getCheques_obj();
                $newCheRes = $chqMapper->InsertChequeForRejectedCheque($newCheObj);
                
                /// check if the operation has no pending checks, if it doesn't mark the whole operation as saldada
                $opMapper = new Gyuser_Model_OperationsDataMapper();
                $operationPayed = $opMapper->checkOperationSaldada($obj->getOperation_id());
                if($operationPayed) {
                    $id = $opMapper->setOperationSaldada($obj->getOperation_id());
                    if(!$id)
                        throw new Exception('There was an error updating the operation to operacion saldada');
                    
                    /// check if the user has no pending operations, if it doesn't mark it as pasive
                    $clMapper = new Gyuser_Model_UserDataMapper();
                    $pasiveClient = $clMapper->checkPasiveClient($obj->getClient_id());
                    if($pasiveClient) {
                        //FIX!! Gus asked to pass clients to active once they finish paying cobranzas 
                        $id = $clMapper->setActiveClient($obj->getClient_id());
                        //$id = $clMapper->setPasiveClient($obj->getClient_id());
                        if(!$id)
                            throw new Exception('There was an error updating the client to pasive');                      
                    }
                }
            }
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function SaveChequeWithNewBankForRejectedCheque(Gyuser_Model_Cobranzas $obj) {

        list ( $Day, $Month, $Year ) = explode('/', $obj->getDate_paid());
        $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
        $Date_paid = date("Y-m-d", $stampeddate);

        $data = array(
            'client_id' => $obj->getClient_id(),
            'operation_id' => $obj->getOperation_id(),
            'cheque_id' => $obj->getCheque_id(),
            'date_paid' => $Date_paid,
            'paid_amount' => $obj->getPaid_amount(),
            'previous_balance' => $obj->getPrevious_balance(),
            'current_balance' => $obj->getCurrent_balance(),
            'payment_type' => $obj->getPayment_type(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            if ($id) {
                $chqMapper = new Gyuser_Model_ChequesDataMapper();
                $chqObj = new Gyuser_Model_Cheques();
                $chqObj->setBalance($obj->getCurrent_balance());
                $chqObj->setId($obj->getCheque_id());
                //$chqObj->setRejected_check_payment(1);
                $updateRes = $chqMapper->UpdateRejectedChequeBalance($chqObj);

                $BankMapper = new Gyuser_Model_BankAccountsDataMapper();
                $newBankObj = $obj->getBank_accounts_obj();
                $newBankId = $BankMapper->save($newBankObj);

                $newCheObj = $obj->getCheques_obj();
                $newCheObj->setRejected_bank_id($newBankId);
                $newCheRes = $chqMapper->InsertChequeForRejectedCheque($newCheObj);
                
                /// check if the operation has no pending checks, if it doesn't mark the whole operation as saldada
                $opMapper = new Gyuser_Model_OperationsDataMapper();
                $operationPayed = $opMapper->checkOperationSaldada($obj->getOperation_id());
                if($operationPayed) {
                    $id = $opMapper->setOperationSaldada($obj->getOperation_id());
                    if(!$id)
                        throw new Exception('There was an error updating the operation to operacion saldada');
                    
                    /// check if the user has no pending operations, if it doesn't mark it as pasive
                    $clMapper = new Gyuser_Model_UserDataMapper();
                    $pasiveClient = $clMapper->checkPasiveClient($obj->getClient_id());
                    if($pasiveClient) {
                        //FIX!! Gus asked to pass clients to active once they finish paying cobranzas 
                        $id = $clMapper->setActiveClient($obj->getClient_id());
                        //$id = $clMapper->setPasiveClient($obj->getClient_id());
                        if(!$id)
                            throw new Exception('There was an error updating the client to pasive');                      
                    }
                }
            }
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
*/
    public function GestionDetialsByClinetId(Gyuser_Model_Cobranzas $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $client_id = $obj->getId();
        $select->from(array('cob' => 'cobranzas'), array(
            'id',
            'operation_id',
            'cheque_id',
            'date_paid',
            'paid_amount',
            'previous_balance',
            'current_balance',
            'payment_type',
        ));
        $select->joinLeft(array('cqu' => 'cheques'), 'cob.cheque_id = cqu.id', array('check_n','amount', 'rejected_cost'));
        $select->where('cob.client_id = ?', $client_id);
        $select->order('cob.id ASC');


        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = array(
                'id' => $row->id,
                'operation_id' => $row->operation_id,
                'cheque_id' => $row->cheque_id,
                'date_paid' => date("d/m/Y", strtotime($row->date_paid)),
                'paid_amount' => $row->paid_amount,
                'previous_balance' => $row->previous_balance,
                'current_balance' => $row->current_balance,
                'payment_type' => $row->payment_type,
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'rejected_cost' => $row->rejected_cost
            );
            $entries[] = $entry;
        }
        return $entries;
    }

}

