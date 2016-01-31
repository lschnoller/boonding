<?php

class Gyuser_Model_OperationsDataMapper {
 
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
            $this->setDbTable('Gyuser_Model_DbTable_Operations');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Operations $obj) {
        $data = array(
            'client_id' => $obj->getClient_id(),
            'date' => $obj->getDate(),
            'amount' => $obj->getAmount(),
            'state_order_id' => $obj->getState(),
            'observations' => $obj->getObservations(),
            'report' => $obj->getReport(),
            'date_added' => date('Y-m-d H:i:s'),
            'cave_id' => $obj->getCave_id() == 'null' ? null : $obj->getCave_id(),
            'bank_account_id' => (int) $obj->getBank_account_id(),
        );
        $id = (int) $obj->getId();
        if (!$id) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
    
    //PRE: 1. Operations object with client_id, date and amount of op
    //     2. the cheques terceros list in json format
    //POST: creates new op, add cheques and set client to active
    public function createTercerosOp(Gyuser_Model_Operations $obj, $chequesList = null) {
        try {
            //1. create operation
            $data = array(
                'type' => 2, //operacion con terceros
                'client_id' => $obj->getClient_id(),
                'date' => $obj->getDate(),
                'amount' => $obj->getAmount(),
                'state_order_id' => 2, //aguardando informes
                //'observations' => $obj->getObservations(),
                //'report' => $obj->getReport(),
                'tasa_porcentual' => $obj->getTasa_porcentual(),
                'date_added' => date('Y-m-d H:i:s'),
            );
            $opId = $this->getDbTable()->insert($data);
            if (!$opId)
                throw Exception("Hubo un error al crear la operación de cheques de terceros.");
            
            //2. insert checks
            $chequesMapper = new Gyuser_Model_ChequesDataMapper();
            $chequesMapper->addChequesTerceros($opId, $chequesList);     
            
            //3. set client to active
            $clientMapper = new Gyuser_Model_UserDataMapper();
            $clientObj = new Gyuser_Model_User();
            $clientObj->setId($obj->getClient_id());
            $clientObj->setClient_type(3); //active
            $clientMapper->UpdateUserType($clientObj);

            return $opId;
            
            //**********************************************************************
            /*
            $cheques = new Gyuser_Model_Cheques();
            $cheques->setOperation_id($obj->getId());
            $cheques->setCheques_list($chequesList);
            
            $mapper = new Gyuser_Model_OperationsDataMapper();
            $arc_hrs = $mapper->GetAcreditacionHrsByOperationId($obj);
            
            
            $result = $chequesMapper->SaveCheques($cheques);                    
            $iMapper = new Gyuser_Model_InterestsDataMapper();
            $interests = new Gyuser_Model_Interests();                    
            $interests = $iMapper->getInterestRate($obj->getInterests_id());

            $data = array(
                'state_order_id' => $obj->getState(),
                'amount' => $obj->getAmount(),                        
                'plan_id' => $obj->getPlan_id(),
                'interests_id' => $obj->getInterests_id(),
                'tasa_porcentual' => $interests->getRate()
            );
            */
            
            
            /*    
            $id = (int) $obj->getId();
            if (!$id) {
                unset($data['id']);

            } else {
                $id = $this->getDbTable()->update($data, array('id = ?' => $id));
                return $id;
            }
             * 
             */
        }catch(Exception $e) {
            
        }       
    }
    

    public function find($id, Gyuser_Model_Operations $Operations) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $Operations->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('opr' => 'operations'), array(
            'id',
            'client_id',
            'date',
            'amount',
            'observations',
            'report',
            'date_added',
            'state_order_id',
        ));
        $select->joinLeft(array('opts' => 'operations_state'), 'opr.state_order_id = opts.order_id', array('name as operations_state_name'));
        $select->order('opr.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Operations();
            $entry->setId($row->id);
            $entry->setClient_id($row->client_id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setAmount($row->amount);
            $entry->setState($row->state_order_id);
            $entry->setOperations_state_name(htmlentities($row->operations_state_name));
            $entry->setObservations($row->observations);
            $entry->setReport($row->report);

            $entries[] = $entry;
        }
        return $entries;

        /* $resultSet = $this->getDbTable()->fetchAll();
          $entries   = array();
          foreach ($resultSet as $row) {
          $entry = new Gyuser_Model_Operations();
          $entry->setId($row->id);
          $entry->setClient_id($row->client_id);

          $entry->setDate(date("d/m/Y",strtotime($row->date)));
          $entry->setAmount($row->amount);
          $entry->setObservations($row->observations);
          $entry->setReport($row->report);


          $entries[] = $entry;
          }
          return $entries; */
    }

    public function delete(Gyuser_Model_Operations $obj) {

        $table = $this->getDbTable();
        $where = $table->getAdapter()->quoteInto('id = ?', $obj->getId());
        $result = $table->delete($where);
        return $result;
    }

    public function GetAllOperations() {
        try {
            $entries = array();
            $table = $this->getDbTable();
            $select = $table->select();
            $select->setIntegrityCheck(false);

            $select->from(array('ope' => 'operations'), array('id', 'client_id', 'amount'))
                    ->join(array('us' => 'clients'), 'us.id = ope.client_id', array('first_name'));
            $resultSet = $table->fetchAll($select);


            foreach ($resultSet as $row) {
                $entry = new Gyuser_Model_Operations();
                $entry->setId($row->id);
                $entry->setClient_id($row->client_id);
                $entry->setAmount($row->amount);
                $entry->setOperations_first_name($row->first_name);
                $entries[] = $entry;
            }

            return $entries;
        } catch (Exception $ex) {
            
        }
    }

    public function GetOperationsCountByClientId(Gyuser_Model_User $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, 'COUNT(id) AS num');
        $select->where('client_id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        return $row->num;
    }

    public function GetOperationsIdByClientId(Gyuser_Model_User $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, 'id');
        $select->where('client_id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        return $row->id;
    }

    public function GetOperationsByClientId(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ope' => 'operations'), array('id', 'type', 'state_order_id', 'amount', 'tasa_porcentual','date', 'ac_date','state_change', 'cave_id', 'report'));
        $select->joinLeft(array('ope_s' => 'operations_state'), 'ope.state_order_id = ope_s.id', array('name as state_name', 'order_id'));
        //$select->joinLeft(array('ocvs' => 'other_caves'), 'ope.cave_id = ocvs.id', array('name as cave_name'));
        $select->joinLeft(array('provs' => 'providers'), 'ope.cave_id = provs.id', array('name as prov_name'));
        $select->where('ope.client_id = ?', $obj->getClient_id());
        $select->order('ope.id DESC');
        $resultSet = $table->fetchAll($select);
        if ($resultSet) {
            $entries = array();
            $mapper = new Gyuser_Model_ChequesDataMapper();
            foreach ($resultSet as $row) {
                $operationid = $row->id;
                $stateChange = date("d/m H:i", strtotime($row->state_change)).' hs';
                if($row->state_order_id == 99)
                    $stateChange = date("d/m/Y", strtotime($row->state_change));
                
                $entry = array('stateid' => $row->state_order_id,
                    'type' => $row->type,
                    'state_name' => $row->state_name,
                    'operationid' => $operationid,
                    'amount' => $row->amount,
                    'tasa' => $row->tasa_porcentual,
                    'date' => date("d/m/Y", strtotime($row->date)),
                    'ac_date' => date("d/m/Y", strtotime($row->ac_date)),
                    'state_change' => $stateChange,
                    'cave_id' => $row->cave_id,
                    'cave_name' => $row->prov_name,
                    'report' => $row->report,
                );
                $cheques = $mapper->GetChequeDetailsByOpId($operationid);
                $entry['cheques'] = $cheques;                
                $entries[$operationid] = $entry;
            }
            return $entries;
        } else {
            return null;
        }
    }

    public function GetStateByOperationId(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ope' => 'operations'), array('id', 'state_order_id', 'amount', 'date', 'state_change', 'client_id'));
        $select->joinLeft(array('ope_s' => 'operations_state'), 'ope.state_order_id = ope_s.order_id', array('name as state_name', 'order_id'));
        $select->where('ope.id = ?', $obj->getId());
        $row = $table->fetchRow($select);

        if ($row) {
            $entry = array('stateid' => $row->state_order_id,
                'state_name' => $row->state_name,
                'state_change' => $row->state_change,
                'client_id' => $row->client_id,
            );

            return $entry;
        } else {
            return null;
        }
    }
    
    public function getDetailsByOpId($opId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ope' => 'operations'), array('id', 'client_id', 'bank_account_id', 'date', 'ac_date', 'state_change', 'client_id'));
        $select->where('ope.id = ?', $opId);
        $row = $table->fetchRow($select);

        if ($row) {
            $op = new Gyuser_Model_Operations();
            $op->setId($opId);
            $op->setClient_id($row->client_id);
            $op->setBank_account_id($row->bank_account_id);
            $op->setAc_date($row->ac_date);
            
            return $op;
        } else {
            return null;
        }
    }
    
    public function OperationStateChange(Gyuser_Model_Operations $obj, $chequesList = null, $chequeId = null) 
    {
        $success = 0;
        $opResult = $this->GetStateByOperationId($obj);
        $currentStateId = (int)$opResult['stateid'];
        $newStateId = $obj->getState();
        
        //fix get op client_id and bank_account_id
        $op = $this->getDetailsByOpId($obj->getId());
        $obj->setClient_id($op->getClient_id());
        $obj->setBank_account_id($op->getBank_account_id());
                
        if ($currentStateId < $newStateId) //operataion new state is bigger than current state
        {
            switch ($newStateId) 
            {
                case 2:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                        'cave_id' => $obj->getCave_id()
                    );
                    break;
                case 3:
                case 4:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                        'report' => $obj->getReport()
                    );
                    break;
                case 5:                    
                    $mapper = new Gyuser_Model_OperationsDataMapper();
                    $arc_hrs = $mapper->GetAcreditacionHrsByOperationId($obj);
                    
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheques = new Gyuser_Model_Cheques();
                    $cheques->setOperation_id($obj->getId());
                    $cheques->setClient_id($obj->getClient_id());
                    $cheques->setBank_account_id($obj->getBank_account_id());
                    $cheques->setAcreditacion_hrs($arc_hrs);
                    $cheques->setCheques_list($chequesList);
                    
                    $result = $chequesMapper->SaveCheques($cheques);                    
                    $iMapper = new Gyuser_Model_InterestsDataMapper();
                    $interests = new Gyuser_Model_Interests();                    
                    $interests = $iMapper->getInterestRate($obj->getInterests_id());
                    
                    $data = array(
                        'state_order_id' => $obj->getState(),
                        'amount' => $obj->getAmount(),                        
                        'plan_id' => $obj->getPlan_id(),
                        'interests_id' => $obj->getInterests_id(),
                        'tasa_porcentual' => $interests->getRate()
                    );
                    break;
                
                case 8:
                case 9:
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheques = new Gyuser_Model_Cheques();
                    $cheques->setId($chequeId);                    
                    $cheques->setOperation_id($obj->getId());                    
                    $cheques->setClient_id($obj->getClient_id());
                    $cheques->setBank_account_id($obj->getBank_account_id());
                    $cheques->setCheques_list($chequesList);
                    
                    $chequesResult = $chequesMapper->SaveCheques($cheques);
                    
                    $data = array(
                        'amount' => $obj->getAmount(),
                        'plan_id' => $obj->getPlan_id(),
                        'state_order_id' => $obj->getState(),
                    );
                    break;
                
                case 6:
                case 7:
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheques = new Gyuser_Model_Cheques();
                    $cheques->setOperation_id($obj->getId());
                    $data = array(
                        'state_order_id' => $obj->getState(),
                    );                    
                    break;
                case 99:
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheques = new Gyuser_Model_Cheques();
                    $cheques->setOperation_id($obj->getId());
                    $result = $chequesMapper->deleteByOperationId($cheques);
                    $data = array(
                        'state_order_id' => $obj->getState(),
                    );
                    break;
                default:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                    );
                    break;
            }
            
            $id = (int) $obj->getId();
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            $success = 1;
            
        }
        elseif($currentStateId >= $newStateId) //new state is smaller or equal to current state
            $success = 2; //2 = the state has already been changed.  
        
        return $success;
    }

    public function OpTercerosStateChange($opId, $newStateId, $tasaAnual = null, $chequesListJson = null) 
    {
        $success = 0;
        $obj = new Gyuser_Model_Operations();
        $obj->setId($opId);
        $opResult = $this->GetStateByOperationId($obj);
        $currentStateId = (int)$opResult['stateid'];        
                
        if ($currentStateId < $newStateId) //operataion new state is bigger than current state
        {
            switch ($newStateId) 
            {
                case 2:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                        'cave_id' => $obj->getCave_id()
                    );
                    break;
                case 3:
                case 4:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                        'report' => $obj->getReport()
                    );
                    break;
                case 5: //cerrada    
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $informesCompletos = $chequesMapper->checkInformesCompletos($opId);
                    if($informesCompletos) {
                        $data = array(
                            'state_order_id' => $newStateId,
                        );                        
                    }
                    break;
                case 6: //op. en camino
                    $opAmount = 0;
                    $opTodayVal = 0;
                    
                    $adminMapper = new Gyuser_Model_AdminDataMapper();
                    $admin = $adminMapper->getAdminSettings();
                    
                    $prov = new Gyuser_Model_Providers();
                    $prov->setAcreditacion_capital($admin->getTiempo_ac_capital());
                    $prov->setAcreditacion_interior($admin->getTiempo_ac_interior());
                    $prov->setGastos_general($admin->getGastos_general());
                    $prov->setGastos_interior($admin->getGastos_interior());
                    $prov->setImpuesto_al_cheque($admin->getImpuesto_al_cheque());
                    $prov->setTasa_anual($tasaAnual);
                                        
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheque = new Gyuser_Model_Cheques();
                    $cheques = $chequesMapper->GetChequesByOpId($opId); //gets only cheques with status 7 (aprobados)
                    foreach ($cheques as $cheque) {                        
                        $cDetails = $chequesMapper->saveDetails($cheque->getId(), $prov);      
                        $opAmount += $cDetails['amount'];
                        $opTodayVal += $cDetails['terceros_today_value'];
                    }
                    $data = array(               
                        'amount' => $opAmount,
                        'amount_today' => $opTodayVal,
                        'ac_date' => date('Y-m-d'), //save today date as consolidated date.
                        'tasa_porcentual' => $tasaAnual,
                        'state_order_id' => $newStateId
                    );                        
                    
                    break;
                case 9: //consolidated / cheques en cartera
                    
                    $chequesList = json_decode($chequesListJson);
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $chequesTotals = $chequesMapper->consolidateCheques($chequesList);
                    
                    $data = array(
                        'amount' => $chequesTotals['amount'],
                        'amount_today' => $chequesTotals['todayValue'],
                        'state_order_id' => $newStateId,
                    );
                    break;
                case 99:
                    $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                    $cheques = new Gyuser_Model_Cheques();
                    $cheques->setOperation_id($obj->getId());
                    $result = $chequesMapper->deleteByOperationId($cheques);
                    $data = array(
                        'state_order_id' => $obj->getState(),
                    );
                    break;
                default:
                    $data = array(
                        'state_order_id' => $obj->getState(),
                    );
                    break;
            }
            
            if($data) {
                $id = (int) $obj->getId();
                $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            }
            $success = 1;
            
        }
        elseif($currentStateId >= $newStateId) //new state is smaller or equal to current state
            $success = 2; //2 = the state has already been changed.  
        
        return $success;
    }
    
    /*
    public function OperationStepTwo(Gyuser_Model_Operations $obj) {
        $success = 0;
        $opResult = $this->GetStateByOperationId($obj);
        
        if ((int)$opResult['stateid'] < 2) //operataion new state is more than current state
        {
            $data = array(
                'state_order_id' => 2,
                'cave_id' => $obj->getCave_id(),
            );
            $id = (int) $obj->getId();
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            $success = 1;
        }
        elseif((int)$opResult['stateid'] > 1) //state is already 2 or bigger
            $success = 2; //2=the state has already been changed.
        
        return $success;
    }

    public function CancelOperation(Gyuser_Model_Operations $obj) {
        $success = 0;
        $opResult = $this->GetStateByOperationId($obj);
        
        if ((int)$opResult['stateid'] != 99) //operataion new state is more than current state
        {
            $data = array(
                'state_order_id' => 99,
            );
            $id = (int) $obj->getId();
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            $success = 1;
        }
        elseif((int)$opResult['stateid'] == 99) //state is already 2 or bigger
            $success = 2; //2 = the state has already been changed.
        
        return $success;
    }

    public function OperationStepThree(Gyuser_Model_Operations $obj) {
        $success = 0;
        $opResult = $this->GetStateByOperationId($obj);
        $newState = $obj->getState();
        
        if ((int)$opResult['stateid'] < $newState) //operataion new state is bigger than current state
        {
            $data = array(
                'state_order_id' => $obj->getState(),
                'report' => $obj->getReport(),
            );
            $id = (int) $obj->getId();
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            $success = 1;
        }
        elseif((int)$opResult['stateid'] >= $newState) //new state is smaller or equal to current state
            $success = 2; //2 = the state has already been changed.  
        
        return $success;
    }

    public function OperationStepFour(Gyuser_Model_Operations $obj) {
        $data = array(
            'amount' => $obj->getAmount(),
            'state_order_id' => 5,
            'plan_id' => $obj->getPlan_id(),
            'interests_id' => $obj->getInterests_id(),
        );
        $id = (int) $obj->getId();
        $id = $this->getDbTable()->update($data, array('id = ?' => $id));
        return $id;
    }

    public function OperationStepFive(Gyuser_Model_Operations $obj) {
        $data = array(
            'state_order_id' => $obj->getState(),
        );
        $id = (int) $obj->getId();
        $id = $this->getDbTable()->update($data, array('id = ?' => $id));
        return $id;
    }
    */
    
    public function GetPlanIdByOperationId(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array('plan_id'));
        $select->where('id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        if (@$row->plan_id) {
            return $row->plan_id;
        } else {
            return null;
        }
    }

    public function GetInterestsIdByOperationId(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array('interests_id'));
        $select->where('id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        if (@$row->interests_id) {
            return $row->interests_id;
        } else {
            return null;
        }
    }
    
    public function GetAmount($opId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array('amount'));
        $select->where('id = ?', $opId);
        $row = $table->fetchRow($select);
        if (@$row->amount) {
            return $row->amount;
        } else {
            return null;
        }
    }
/*
    public function ChangePlanAndAmount(Gyuser_Model_Operations $obj) {
        $data = array(
            'amount' => $obj->getAmount(),
            'plan_id' => $obj->getPlan_id(),
            'state_order_id' => $obj->getState(),
        );
        $id = (int) $obj->getId();
        $id = $this->getDbTable()->update($data, array('id = ?' => $id));
        return $id;
    }
*/
    
    public function GetOperationsByProviderId($provider_id) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('opr' => 'operations'), array(
            'id',
            'client_id',
            'date',
            'amount',
            'observations',
            'report',
            'date_added',
            'state_order_id',
            'cave_id'
        ));
        $select->joinLeft(array('prov' => 'providers'), 'opr.cave_id = prov.id', array('name as cave_name', 'comision_rate'));
        $select->joinLeft(array('cls' => 'clients'), 'opr.client_id = cls.id', array('first_name', 'last_name'));
        $select->where('opr.cave_id = ?', $provider_id);
        $select->where('opr.liquidacion_id IS  NULL');
        //NOTE! gus also wants to show the operations with state "En Lavalle".
        $select->where('opr.state_order_id = 8 OR opr.state_order_id = 9 OR opr.state_order_id = 10 OR opr.state_order_id = 11');
        $select->order('opr.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Operations();
            $entry->setId($row->id);
            $entry->setClient_id($row->client_id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setAmount($row->amount);
            $entry->setState($row->state_order_id);
            $entry->setObservations($row->observations);
            $entry->setReport($row->report);
            $entry->setProv_name($row->cave_name);
            $entry->setProv_commission_rate($row->comision_rate);
            $pMapper = new Gyuser_Model_ProvidersDataMapper();
            $commissionAmt = $pMapper->calculateComisionAmt($row->amount, $row->comision_rate);            
            $entry->setProv_commission_amt($commissionAmt);
            $provPayment = $pMapper->calculateProvPayment($row->amount, $commissionAmt);
            $entry->setProv_payment($provPayment);
            
            /*
            $provider_obj = new Gyuser_Model_Providers();
            $provider_obj->setName($row->cave_name);
            $provider_obj->setComisionRate($row->comision_rate);            
            $pMapper = new Gyuser_Model_ProvidersDataMapper();
            $comisionAmt = $pMapper->calculateComisionAmt($row->amount, $row->comision_rate);
            $provPayment = $pMapper->calculateProvPayment($row->amount, $comisionAmt);
            $provider_obj->setComisionAmt($comisionAmt);
            $provider_obj->setProvPayment($provPayment);
            $entry->setProvider_obj($provider_obj);
             * 
             */

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $entry->setUser_obj($clientObj);

            $entries[] = $entry;
        }
        return $entries;
    }
    /*
    public function GetOperationsByCaveId(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('opr' => 'operations'), array(
            'id',
            'client_id',
            'date',
            'amount',
            'observations',
            'report',
            'date_added',
            'state_order_id',
            'cave_id'
        ));
        $select->joinLeft(array('ocvs' => 'other_caves'), 'opr.cave_id = ocvs.id', array('name as cave_name'));
        $select->joinLeft(array('cls' => 'clients'), 'opr.client_id = cls.id', array('first_name', 'last_name'));
        $select->where('opr.cave_id = ?', $obj->getCave_id());
        $select->where('opr.liquidacion_id IS  NULL');
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10');
        $select->order('opr.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Operations();
            $entry->setId($row->id);
            $entry->setClient_id($row->client_id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setAmount($row->amount);
            $entry->setState($row->state_order_id);
            $entry->setObservations($row->observations);
            $entry->setReport($row->report);

            $other_caves_obj = new Gyuser_Model_OtherCaves();
            $other_caves_obj->setName($row->cave_name);
            $entry->setOther_caves_obj($other_caves_obj);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $entry->setUser_obj($clientObj);



            $entries[] = $entry;
        }
        return $entries;
    }
*/
    public function updateOpAmount($opId) {
        $totAmount = 0;
        $chequesMapper = new Gyuser_Model_ChequesDataMapper();
        $chequesList = $chequesMapper->getApprovedCheckDetails($opId);                        
        foreach ($chequesList as $cheque) {
            $totAmount += $cheque->getAmount();                            
        }      
        $data = array(
            'amount' => $totAmount,
        );
        $id = $this->getDbTable()->update($data, array('id = ?' => $opId));
        return $id;
    }
    
    public function UpdateLiquidacion(Gyuser_Model_Operations $Cheques) {
        $data = array(
            'liquidacion_id' => $Cheques->getLiquidacion_id(),
        );
        $id = $this->getDbTable()->update($data, array('id = ?' => $Cheques->getId()));
        return $id;
    }

    public function UpdateLiquidacionDeleted($liquidaciones_id) {
        $data = array(
            'liquidacion_id' => null,
        );
        $id = $this->getDbTable()->update($data, array('liquidacion_id = ?' => $liquidaciones_id));
        return $id;
    }

    public function GetOperationsByLiquidacionIdJson(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array(
            'id',
            'client_id',
            'date',
            'amount',
            'observations',
            'report',
            'date_added',
            'state_order_id',
            'cave_id'
        ));
        $select->joinLeft(array('prov' => 'providers'), 'opr.cave_id = prov.id', array('name as prov_name', 'comision_rate'));
        $select->joinLeft(array('cls' => 'clients'), 'opr.client_id = cls.id', array('first_name', 'last_name'));
        $select->where('opr.liquidacion_id =?', $obj->getLiquidacion_id());
        $select->order('opr.id ASC');
        $resultSet = $table->fetchAll($select);
        if ($resultSet) {            
            $pMapper = new Gyuser_Model_ProvidersDataMapper();
            $entries = array();
            foreach ($resultSet as $row) {
                $operationid = $row->id;
                $comisionAmt = $pMapper->calculateComisionAmt($row->amount, $row->comision_rate);
                $provPayment = $pMapper->calculateProvPayment($row->amount, $comisionAmt);
                
                $entry = array('stateid' => $row->state_order_id,
                    'operationid' => $operationid,
                    'amount' => $row->amount,
                    'date' => date("d/m/Y", strtotime($row->date)),
                    'cave_id' => $row->cave_id,
                    'prov_name' => $row->prov_name,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'comision_rate' => $row->comision_rate,
                    'comision_amt' => $comisionAmt,
                    'prov_payment' => $provPayment                    
                );
                $entries[$operationid] = $entry;
            }
            return $entries;
        } else {
            return null;
        }
    }
    
    /* FUTURE DELETE */
    public function GetOperationsIdByLiquidacionIdJson(Gyuser_Model_Operations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array(
            'id',
            'client_id',
            'date',
            'amount',
            'observations',
            'report',
            'date_added',
            'state_order_id',
            'cave_id'
        ));
        $select->joinLeft(array('ocvs' => 'other_caves'), 'opr.cave_id = ocvs.id', array('name as cave_name'));
        $select->joinLeft(array('cls' => 'clients'), 'opr.client_id = cls.id', array('first_name', 'last_name'));
        $select->where('opr.liquidacion_id =?', $obj->getLiquidacion_id());
        $select->order('opr.id ASC');
        $resultSet = $table->fetchAll($select);
        if ($resultSet) {
            $entries = array();
            foreach ($resultSet as $row) {
                $operationid = $row->id;
                $entry = array('stateid' => $row->state_order_id,
                    'operationid' => $operationid,
                    'amount' => $row->amount,
                    'date' => date("d/m/Y", strtotime($row->date)),
                    'cave_id' => $row->cave_id,
                    'cave_name' => $row->cave_name,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                );
                $entries[$operationid] = $entry;
            }
            return $entries;
        } else {
            return null;
        }
    }

    public function GetAcreditacionHrsByOperationId(Gyuser_Model_Operations $obj) {
        $arc_hrs = 0;
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ops' => 'operations'), array(
            'id',
            'bank_account_id',
        ));
        $select->joinInner(array('bks' => 'bank_accounts'), 'ops.bank_account_id = bks.id', array('location_capital'));
        $select->where('ops.id = ?', $obj->getId());

        $row = $table->fetchRow($select);
        $location_capital = $row->location_capital;

        $adminMapper = new Gyuser_Model_AdminDataMapper();
        $adminObj = new Gyuser_Model_Admin();
        $adminObj->setId(1);
        $adminObj = $adminMapper->find($adminObj);

        if ($location_capital == 1) {
            $arc_hrs = $adminObj->getTiempo_ac_capital();
        } else if ($location_capital == 2) {
            $arc_hrs = $adminObj->getTiempo_ac_interior();
        }

        return $arc_hrs;
    }  
    

    /*     * ************************************ OPERACIONES WIDGET FUNCTIONS **************************************** */

    public function GetOperationsAmount($dates, $DivideCave, $includeLastDay = false) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $dates[0]);
        if ($includeLastDay)
            $select->where('opr.date <=?', $dates[1]); //if it's getting complete last month it includes last day
        else
            $select->where('opr.date <?', $dates[1]); //if it's getting to current date, it doesn't include it
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id && $DivideCave) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }
    
    public function GetOperationsAmountAvg($prevDates, $currentDates, $totalAmount) {
        $start = strtotime($prevDates[0]);
        $end = strtotime($prevDates[1]); 
        $totalPrevDays = ceil(abs($end - $start) / 86400) +1;
        
        $start = strtotime($currentDates[0]);
        $end = strtotime($currentDates[1]); 
        $totalCurrentDays = ceil(abs($end - $start) / 86400);
        
        $currentTotalAvg = $totalCurrentDays * $totalAmount / $totalPrevDays;
        
        return $currentTotalAvg;
    }
        
    public function GetOperationsAmountByCurrentMonth($date) {

        $flDatesArr = findFirstAndLastDay($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $date);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevMonthByHalfCaveAndOwn($date) {

        $flDatesArr = prevFirstAndCurrentDay($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevQuaterHalfCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevQuater($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevSemesterHalfCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevSemester($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevYearHalfCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevYear($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                if ($row->cave_id) {
                    $amount += ($row->amount) / 2;
                } else {
                    $amount += $row->amount;
                }
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByCurrentMonthByCaveAndOwn($date) {
        $flDatesArr = findFirstAndLastDay($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <?', $date);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $amount += $row->amount;
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevQuaterCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevQuater($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $amount += $row->amount;
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevSemesterCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevSemester($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $amount += $row->amount;
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevYearCaveAndOwn($date) {

        $flDatesArr = findFirstAndLastDatesOfPrevYear($date);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
        $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
        $select->where('opr.date >=?', $flDatesArr[0]);
        $select->where('opr.date <=?', $flDatesArr[1]);
        $resultSet = $table->fetchAll($select);
        $amount = 0;
        if ($resultSet) {
            foreach ($resultSet as $row) {
                $amount += $row->amount;
            }
        }
        return $amount;
    }

    public function GetOperationsAmountByPrevMonths($date, $monthCount) 
    {
        $table = $this->getDbTable();
        $result = array();
        for ($i = 0; $i < $monthCount; $i++) {
            if (!$i) {
                $flDatesArr = findFirstAndLastDay($date);
            } else {
                $flDatesArr = findPrevMonthFirstAndLastDay($date);
            }
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('opr' => 'operations'), array('amount', 'cave_id'));
            $select->where('opr.state_order_id = 11 OR opr.state_order_id = 9 OR opr.state_order_id = 10 ');
            $select->where('opr.date >=?', $flDatesArr[0]);
            if (!$i)
                $select->where('opr.date <?', $flDatesArr[1]);
            else
                $select->where('opr.date <=?', $flDatesArr[1]);
            $resultSet = $table->fetchAll($select);
            $caveAmount = 0;
            $soloAmount = 0;
            if ($resultSet) {
                foreach ($resultSet as $row) {
                    if ($row->cave_id) {
                        $caveAmount += ($row->amount) / 2;
                    } else {
                        $soloAmount += $row->amount;
                    }
                }
            }
            $result[month_lang($flDatesArr[2])] = array('cave' => $caveAmount, 'solo' => $soloAmount);
            $date = $flDatesArr[0];
        }
        return $result;
    }
    
    public function checkOperationSaldada($operationId) {      
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('id'));
        $select->joinLeft(array('ch' => 'cheques'), 'opr.id = ch.operation_id', array());
        $select->where('opr.id = ?', $operationId);        
        $select->where('ch.status = 1 or (ch.status = 3 and ch.balance > 1) or ch.status = 4 or ch.status = 6');
        $resultSet = $table->fetchAll($select);
        if (count($resultSet)) //more than 0 
            $saldada = false;
        else
            $saldada = true;
        return $saldada;        
    }
    
    public function checkOperationCobranza($operationId) {      
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('opr' => 'operations'), array('id'));
        $select->joinLeft(array('ch' => 'cheques'), 'opr.id = ch.operation_id', array());
        $select->where('opr.id = ?', $operationId);        
        $select->where('ch.status = 3 AND ch.balance > 1');
        $resultSet = $table->fetchAll($select);
        if (count($resultSet)) //more than 0 
            $cobranza = true;
        else
            $cobranza = false;
        return $cobranza;
    }       
    
    public function setOperationEnCartera($operationId) {        
        $id = $this->getDbTable()->update(array('state_order_id' => 9, 'state_change' => new Zend_Db_Expr('NOW()')), array('id = ?' => $operationId));
        return $id;        
    }
    
    public function setOperationSaldada($operationId) {        
        $id = $this->getDbTable()->update(array('state_order_id' => 10, 'state_change' => new Zend_Db_Expr('NOW()')), array('id = ?' => $operationId));
        return $id;        
    }
    
    public function setOperationEnCobranza($operationId) {        
        $id = $this->getDbTable()->update(array('state_order_id' => 11, 'state_change' => new Zend_Db_Expr('NOW()')), array('id = ?' => $operationId));
        return $id;        
    }
    
    //******************* DEPRECATED ********************
    public function updateOpAndClientsStatus() 
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('operations'), array('id', 'client_id'));
        $resultSet = $table->fetchAll($select);
        $opMapper = new Gyuser_Model_OperationsDataMapper();
        $clMapper = new Gyuser_Model_UserDataMapper();
        foreach ($resultSet as $row) {
            /// check if the operation has no pending checks, if it doesn't mark the whole operation as saldada     
            $operationPayed = $opMapper->checkOperationSaldada($row->id);
            if($operationPayed) {
                $id = $opMapper->setOperationSaldada($row->id);           
                /// check if the client has no pending operations, if it doesn't mark the client type as pasivo            
                $pasiveClient = $clMapper->checkPasiveClient($row->client_id);
                if($pasiveClient) {
                    $id = $clMapper->setPasiveClient($row->client_id);                     
                }
            }
            elseif($opMapper->checkOperationCobranza($row->id)) { //operation is en cobranza                           
                /// check if the client has no pending operations, if it doesn't mark the client type as pasivo            
                $id = $clMapper->setCobranzaClient($row->client_id);
            }
            else { //operation is not saldada and is not in cobranza (client active)
                $cobranzas = $clMapper->checkCobranzasOp($row->client_id);
                if(!$cobranzas) { /// check if the client has no other operations in cobranza and mark it as active
                    $id = $clMapper->setActiveClient($row->client_id);                     
                }
            }
        }
    }
}

/************************************** EOF OPERACIONES WIDGET FUNCTIONS *****************************************/
