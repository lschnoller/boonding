<?php

class Gyuser_Model_LiquidacionesDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Liquidaciones');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Liquidaciones $obj) {
        if (trim($obj->getDate()) == '') {
            $date = date("d/m/Y");
        } else {
            list ( $Day, $Month, $Year ) = explode('/', $obj->getDate());
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);
        }

        $data = array(
            'date' => $date,
            'current_account_balance' => $obj->getCurrent_account_balance(),
            'amount_payed' => $obj->getAmount_payed(),
        );

        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['client_id']);
            unset($data['delivery_Liquidaciones']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find($id, Gyuser_Model_Liquidaciones $obj) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $obj->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'date',
            'current_account_balance',
            'amount_payed'
        ));
        $select->where('status = ?', true);
        $select->order('date ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_Liquidaciones();
            $entry->setId($row->id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setCurrent_account_balance($row->current_account_balance);
            $entry->setAmount_payed($row->amount_payed);

            $entries[] = $entry;
        }
        return $entries;
    }

    public function delete(Gyuser_Model_Liquidaciones $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function createNewLiq() 
    {
        $data = array();
        $liquidacion_id = $this->getDbTable()->insert($data);
        
        return $liquidacion_id;  
    }
    
    
    //PRE: requires a liq id with an already created row
    public function createLiq(Gyuser_Model_Liquidaciones $obj, $variableDate = false) 
    {
        if($obj->getId()) {            
            //set liq details
            $data = array(
                'current_account_balance' => floatval($obj->getCurrent_account_balance()),
                'amount_payed' => floatval($obj->getAmount_payed()),
                'amount_debt' => floatval($obj->getAmount_debt()),
                'provider_id' => $obj->getProvider_id(),
                'previous_account_balance' => $obj->getPrevious_account_balance(),
                'acreditacion' => $obj->getAcreditacion(),                  
                'committed' => $obj->getCommitted(),      
                'credit_provider_id' => $obj->getCredit_provider_id(),

                'checks_qty' => $obj->getChecks_qty(),
                'average_days' => $obj->getAverage_days(),
                'total_bruto' => $obj->getTotal_bruto(),
                'impuesto_al_cheque_amt' => $obj->getImpuesto_al_cheque_amt(),
                'intereses' => $obj->getIntereses(),            
                'gastos_interior_fee' => $obj->getGastos_interior_fee(),
                'gastos_general_fee' => $obj->getGastos_general_fee(),
                'gastos_varios' => $obj->getGastos_varios(),
                'total_neto' => $obj->getTotal_neto(),
            );
            if($obj->getCommitted() == 0) {//status not consolidated but there was a variable date set
                $data['date'] = $obj->getDate();            
                $data['variable_date'] = $variableDate;
            }
            
            if($obj->getCommitted() == 2) { //when setting 'en camino' status save the prov details on liq
                $data['date'] = $obj->getDate();     
                $data['variable_date'] = $variableDate;
                $data['date_delivered'] = $obj->getDate_delivered();
                
                $data['tasa_anual'] = $obj->getTasa_anual();
                $data['impuesto_al_cheque'] = $obj->getImpuesto_al_cheque();
                $data['acreditacion_capital'] = $obj->getAcreditacion_capital();
                $data['acreditacion_interior'] = $obj->getAcreditacion_interior();
                $data['gastos_interior'] = $obj->getGastos_interior();
                $data['gastos_general'] = $obj->getGastos_general();
                $data['gastos_menor_a_monto_1'] = $obj->getGastos_cheque_menor_a_1();
                $data['gastos_menor_a_1'] = $obj->getGastos_cheque_a_1();
                $data['gastos_menor_a_monto_2'] = $obj->getGastos_cheque_menor_a_2();
                $data['gastos_menor_a_2'] = $obj->getGastos_cheque_a_2();     
            }
            
            $liqId = $this->getDbTable()->update($data, array('id = ?' => $obj->getId()));
        }
        else
            throw new Exception('createLiq requires an existent liq row');
        
        return $liqId;
    }
    
    /*
    public function consolidate(Gyuser_Model_Liquidaciones $obj) {
        if (trim($obj->getDate()) == '') {
            $date = date("Y-m-d");
        } else {
            list ( $Day, $Month, $Year ) = explode('/', $obj->getDate());
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);
        }

        $data = array(
            'date' => $date,
            'current_account_balance' => floatval($obj->getCurrent_account_balance()),
            'amount_payed' => floatval($obj->getAmount_payed()),
            'previous_account_balance' => $obj->getPrevious_account_balance(),
            'committed' => (int) $obj->getCommitted() ? 1 : 0,
            'acreditacion' => $obj->getAcreditacion(),
            'provider_id' => $obj->getProvider_id(),
            'checks_qty' => $obj->getChecks_qty(),
            'average_days' => $obj->getAverage_days(),
            'total_bruto' => $obj->getTotal_bruto(),
            'impuesto_al_cheque_amt' => $obj->getImpuesto_al_cheque_amt(),
            'intereses' => $obj->getIntereses(),
            'gastos_interior' => $obj->getGastos_interior(),
            'gastos_general' => $obj->getGastos_general(),
            'gastos_interior_fee' => $obj->getGastos_interior_fee(),
            'gastos_general_fee' => $obj->getGastos_general_fee(),
            'gastos_varios' => $obj->getGastos_varios(),
            'total_neto' => $obj->getTotal_neto(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'tasa_anual' => $obj->getTasa_anual(),
            'acreditacion_capital' => $obj->getAcreditacion_capital(),
            'acreditacion_interior' => $obj->getAcreditacion_interior()
        );
        $liquidacion_id = $obj->getId();
        
        if (null === $liquidacion_id) { //new liquidacion
            unset($data['id']);
            $liquidacion_id = $this->getDbTable()->insert($data);           
        }
        else //already created liquidacion
            $id = $this->getDbTable()->update($data, array('id = ?' => $liquidacion_id));
        
        //update balance with provider
        if ($liquidacion_id) {
            $pMapper = new Gyuser_Model_ProvidersDataMapper();
            $provider = new Gyuser_Model_Providers();
            $provider->setId($obj->getProvider_id());
            $provider->setBalance($obj->getCurrent_account_balance());
            $pMapper->UpdateBalance($provider);
        }

        // update Liquidacion id in cheques
        $cheques_josn = json_decode($obj->getCheques_json());
        $chequesMapper = new Gyuser_Model_ChequesDataMapper();
        $chequeObj = new Gyuser_Model_Cheques();
        $chequeObj->setLiquidacion_id($liquidacion_id);
        $chequeObj->setProvider_id($obj->getProvider_id());
        foreach ($cheques_josn as $cheque) {
            $cheque_id = $cheque->cheque_id;
            $chequeObj->setId($cheque_id);
            $chequeObj->setAcreditacion_hrs($cheque->acreditacion_hrs);
            $chequesMapper->UpdateLiquidacion($chequeObj);
        }

        // update Liquidacion id in rejected cheques 
        $rejected_cheques_json = json_decode($obj->getRejected_cheques_json());
        foreach ($rejected_cheques_json as $cheque) {
            $cheque_id = $cheque->rejected_cheque_id;
            $chequeObj->setId($cheque_id);
            $cheque2 = $chequesMapper->FindWithOperationNames($chequeObj);
            $chequeObj->setRejected_cost_prov($chequesMapper->GetRejectionCost($cheque2));
            $chequesMapper->UpdateRejectedCheques($chequeObj);
        }

        // update Liquidacion id in operations
        $operations_json = json_decode($obj->getOperations_json());
        $operationsMapper = new Gyuser_Model_OperationsDataMapper();
        $operationsObj = new Gyuser_Model_Operations();
        $operationsObj->setLiquidacion_id($liquidacion_id);
        foreach ($operations_json as $operation) {
            $operation_id = $operation->operation_id;
            $operationsObj->setId($operation_id);
            $operationsMapper->UpdateLiquidacion($operationsObj);
        }
        
        return $liquidacion_id;
    }
    */
    /*
    public function payChecques(Gyuser_Model_Liquidaciones $obj) {
        if (trim($obj->getDate()) == '') {
            $date = date("Y-m-d");
        } else {
            list ( $Day, $Month, $Year ) = explode('/', $obj->getDate());
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);
        }

        $data = array(
            'date' => $date,
            'current_account_balance' => floatval($obj->getCurrent_account_balance()),
            'amount_payed' => floatval($obj->getAmount_payed()),
            'cave_id' => $obj->getCave_id(),
            'previous_account_balance' => $obj->getPrevious_account_balance(),
            'committed' => (int) $obj->getCommitted() ? 1 : 0,
            //'acreditacion'				=> $obj->getAcreditacion(),
            'credit_provider_id' => $obj->getCredit_provider_id(),
            'checks_qty' => $obj->getChecks_qty(),
            'average_days' => $obj->getAverage_days(),
            'total_bruto' => $obj->getTotal_bruto(),
            'impuesto_al_cheque_amt' => $obj->getImpuesto_al_cheque_amt(),
            'intereses' => $obj->getIntereses(),
            'gastos_interior' => $obj->getGastos_interior(),
            'gastos_general' => $obj->getGastos_general(),
            'gastos_interior_fee' => $obj->getGastos_interior_fee(),
            'gastos_general_fee' => $obj->getGastos_general_fee(),
            'gastos_varios' => $obj->getGastos_varios(),
            'total_neto' => $obj->getTotal_neto(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'tasa_anual' => $obj->getTasa_anual(),
            'acreditacion_capital' => $obj->getAcreditacion_capital(),
            'acreditacion_interior' => $obj->getAcreditacion_interior()
        );
        $liquidacion_id = $obj->getId();
        if (null === ($id = $liquidacion_id)) { //new liquidacion
            unset($data['id']);
            $liquidacion_id = $this->getDbTable()->insert($data);
            if ($liquidacion_id) {

                $otherCaveMapper = new Gyuser_Model_OtherCavesDataMapper();
                $otherCaveObj = new Gyuser_Model_OtherCaves();

                $otherCaveObj->setId($obj->getCave_id());
                $otherCaveObj->setBalance($obj->getCurrent_account_balance());
                $otherCaveMapper->UpdateBalance($otherCaveObj);

                //update Liquidacion id in cheques   
                $cheques_josn = json_decode($obj->getCheques_json());
                $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                $chequeObj = new Gyuser_Model_Cheques();
                $chequeObj->setLiquidacion_id($liquidacion_id);
                $chequeObj->setCredit_provider_id($obj->getCredit_provider_id());
                foreach ($cheques_josn as $cheque) {
                    $cheque_id = $cheque->cheque_id;
                    $chequeObj->setId($cheque_id);
                    $chequeObj->setAcreditacion_hrs($cheque->acreditacion_hrs);

                    $chequesMapper->UpdateLiquidacion($chequeObj);
                }

                //update Liquidacion id in rejected cheques
                $rejected_cheques_json = json_decode($obj->getRejected_cheques_json());
                foreach ($rejected_cheques_json as $cheque) {
                    $cheque_id = $cheque->rejected_cheque_id;
                    $chequeObj->setId($cheque_id);
                    $cheque2 = $chequesMapper->FindWithOperationNames($chequeObj);
                    $chequeObj->setRejected_cost_prov($chequesMapper->GetRejectionCost($cheque2));
                    $chequesMapper->UpdateRejectedCheques($chequeObj);
                }

                $operations_json = json_decode($obj->getOperations_json());
                $operationsMapper = new Gyuser_Model_OperationsDataMapper();
                $operationsObj = new Gyuser_Model_Operations();
                $operationsObj->setLiquidacion_id($liquidacion_id);
                foreach ($operations_json as $operation) {
                    $operation_id = $operation->operation_id;
                    $operationsObj->setId($operation_id);

                    $operationsMapper->UpdateLiquidacion($operationsObj);
                }
            }
            return $id;
        } else { //already created liquidacion
            $id = $this->getDbTable()->update($data, array('id = ?' => $liquidacion_id));

            $cheques_josn = json_decode($obj->getCheques_json());
            $chequesMapper = new Gyuser_Model_ChequesDataMapper();
            $chequeObj = new Gyuser_Model_Cheques();
            $chequeObj->setLiquidacion_id($liquidacion_id);
            $chequeObj->setCredit_provider_id($obj->getCredit_provider_id());
            foreach ($cheques_josn as $cheque) {
                $cheque_id = $cheque->cheque_id;
                $chequeObj->setId($cheque_id);

                $chequesMapper->UpdateLiquidacion($chequeObj);
            }

            //update Liquidacion id in rejected cheques
            $rejected_cheques_json = json_decode($obj->getRejected_cheques_json());
            foreach ($rejected_cheques_json as $cheque) {
                $cheque_id = $cheque->rejected_cheque_id;
                $chequeObj->setId($cheque_id);
                $cheque2 = $chequesMapper->FindWithOperationNames($chequeObj);
                $chequeObj->setRejected_cost_prov($chequesMapper->GetRejectionCost($cheque2));
                $chequesMapper->UpdateRejectedCheques($chequeObj);
            }
            
            $operations_json = json_decode($obj->getOperations_json());
            $operationsMapper = new Gyuser_Model_OperationsDataMapper();
            $operationsObj = new Gyuser_Model_Operations();
            $operationsObj->setLiquidacion_id($liquidacion_id);
            foreach ($operations_json as $operation) {
                $operation_id = $operation->operation_id;
                $operationsObj->setId($operation_id);

                $operationsMapper->UpdateLiquidacion($operationsObj);
            }

            return $liquidacion_id;
        }
    }
*/
    /*
    public function payChequesForSupplier(Gyuser_Model_Liquidaciones $obj) {
        if (trim($obj->getDate()) == '') {
            $date = date("Y-m-d");
        } else {
            list ( $Day, $Month, $Year ) = explode('/', $obj->getDate());
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);
        }

        $data = array(
            'date' => $date,
            'current_account_balance' => floatval($obj->getCurrent_account_balance()),
            'amount_payed' => floatval($obj->getAmount_payed()),
            'cave_id' => $obj->getCave_id(),
            'previous_account_balance' => $obj->getPrevious_account_balance(),
            'acreditacion' => $obj->getAcreditacion(),
            'committed' => (int) $obj->getCommitted() ? 1 : 0,            
            'credit_provider_id' => $obj->getCredit_provider_id(),
            'checks_qty' => $obj->getChecks_qty(),
            'average_days' => $obj->getAverage_days(),
            'total_bruto' => $obj->getTotal_bruto(),
            'impuesto_al_cheque_amt' => $obj->getImpuesto_al_cheque_amt(),
            'intereses' => $obj->getIntereses(),
            'gastos_interior' => $obj->getGastos_interior(),
            'gastos_general' => $obj->getGastos_general(),
            'gastos_interior_fee' => $obj->getGastos_interior_fee(),
            'gastos_general_fee' => $obj->getGastos_general_fee(),
            'gastos_varios' => $obj->getGastos_varios(),
            'total_neto' => $obj->getTotal_neto(),
            'tasa_anual' => $obj->getTasa_anual(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'acreditacion_capital' => $obj->getAcreditacion_capital(),
            'acreditacion_interior' => $obj->getAcreditacion_interior()
        );
        $liquidacion_id = $obj->getId();
        if (null === ($id = $liquidacion_id)) { //new liquidacion
            unset($data['id']);
            $liquidacion_id = $this->getDbTable()->insert($data);
            if ($liquidacion_id) {

                // update Liquidacion id in cheques
                $cheques_josn = json_decode($obj->getCheques_json()); 
                $chequesMapper = new Gyuser_Model_ChequesDataMapper();
                $chequeObj = new Gyuser_Model_Cheques();
                $chequeObj->setLiquidacion_id($liquidacion_id);
                $chequeObj->setCredit_provider_id($obj->getCredit_provider_id());
                foreach ($cheques_josn as $cheque) {
                    $cheque_id = $cheque->cheque_id;
                    $chequeObj->setId($cheque_id);
                    $chequeObj->setAcreditacion_hrs($cheque->acreditacion_hrs);
                    $chequesMapper->UpdateLiquidacion($chequeObj);
                }

                // update Liquidacion id in rejected cheques
                $rejected_cheques_json = json_decode($obj->getRejected_cheques_json());
                foreach ($rejected_cheques_json as $cheque) {
                    $cheque_id = $cheque->rejected_cheque_id;
                    $chequeObj->setId($cheque_id);
                    $cheque2 = $chequesMapper->FindWithOperationNames($chequeObj);
                    $chequeObj->setRejected_cost_prov($chequesMapper->GetRejectionCost($cheque2));
                    $chequesMapper->UpdateRejectedCheques($chequeObj);                    
                }
                $operations_json = json_decode($obj->getOperations_json());
                $operationsMapper = new Gyuser_Model_OperationsDataMapper();
                $operationsObj = new Gyuser_Model_Operations();
                $operationsObj->setLiquidacion_id($liquidacion_id);
                foreach ($operations_json as $operation) {
                    $operation_id = $operation->operation_id;
                    $operationsObj->setId($operation_id);

                    $operationsMapper->UpdateLiquidacion($operationsObj);
                }
            }
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $liquidacion_id));

            $cheques_josn = json_decode($obj->getCheques_json());
            $chequesMapper = new Gyuser_Model_ChequesDataMapper();
            $chequeObj = new Gyuser_Model_Cheques();
            $chequeObj->setLiquidacion_id($liquidacion_id);
            $chequeObj->setCredit_provider_id($obj->getCredit_provider_id());
            foreach ($cheques_josn as $cheque) {
                $cheque_id = $cheque->cheque_id;
                $chequeObj->setId($cheque_id);

                $chequesMapper->UpdateLiquidacion($chequeObj);
            }
            // update Liquidacion id in rejected cheques
            $rejected_cheques_json = json_decode($obj->getRejected_cheques_json());
            foreach ($rejected_cheques_json as $cheque) {                
                $cheque_id = $cheque->rejected_cheque_id;
                $chequeObj->setId($cheque_id);
                $cheque2 = $chequesMapper->FindWithOperationNames($chequeObj);
                $chequeObj->setRejected_cost_prov($chequesMapper->GetRejectionCost($cheque2));
                $chequesMapper->UpdateRejectedCheques($chequeObj);
            }
            $operations_json = json_decode($obj->getOperations_json());
            $operationsMapper = new Gyuser_Model_OperationsDataMapper();
            $operationsObj = new Gyuser_Model_Operations();
            $operationsObj->setLiquidacion_id($liquidacion_id);
            foreach ($operations_json as $operation) {
                $operation_id = $operation->operation_id;
                $operationsObj->setId($operation_id);

                $operationsMapper->UpdateLiquidacion($operationsObj);
            }

            return $liquidacion_id;
        }
    }
*/
    public function GetLiquidacionesByProvId($provider_id) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'date',
            'previous_account_balance',
            'amount_debt',
            'acreditacion',
            'amount_payed',
            'current_account_balance',
            'committed',
        ));
        $select->where('status = ?', true);
        $select->where('provider_id = ?', $provider_id);
        $select->order('date DESC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Liquidaciones();
            $entry->setId($row->id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setPrevious_account_balance($row->previous_account_balance);
            $entry->setAmount_debt($row->amount_debt);
            $entry->setAcreditacion($row->acreditacion);
            $entry->setAmount_payed($row->amount_payed);
            $entry->setCurrent_account_balance($row->current_account_balance);            
            $entry->setCommitted($row->committed);

            $entries[] = $entry;
        }
        return $entries;
    }
    
    public function GetLiquidacionesByCaveId(Gyuser_Model_Liquidaciones $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'date',
            'current_account_balance',
            'amount_payed',
            'previous_account_balance',
            'committed',
        ));
        $select->where('status = ?', true);
        $select->where('cave_id = ?', $obj->getCave_id());
        $select->order('date DESC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_Liquidaciones();
            $entry->setId($row->id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setCurrent_account_balance($row->current_account_balance);
            $entry->setAmount_payed($row->amount_payed);
            $entry->setPrevious_account_balance($row->previous_account_balance);
            $entry->setCommitted($row->committed);

            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetLiquidacionesBySupplierId(Gyuser_Model_Liquidaciones $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'date',
            'current_account_balance',
            'amount_payed',
            'previous_account_balance',
            'committed',
            'checks_qty',
            'average_days',
            'total_bruto',
            'impuesto_al_cheque_amt',
            'intereses',
            'gastos_interior',
            'gastos_general',
            'gastos_interior_fee',
            'gastos_general_fee',
            'gastos_varios',
            'total_neto',
            'impuesto_al_cheque',
            'tasa_anual',
            'acreditacion_capital',
            'acreditacion_interior'
        ));
        $select->where('status = ?', true);
        $select->where('credit_provider_id = ?', $obj->getCredit_provider_id());
        $select->order('date DESC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_Liquidaciones();
            $entry->setId($row->id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setCurrent_account_balance($row->current_account_balance);
            $entry->setAmount_payed($row->amount_payed);
            $entry->setPrevious_account_balance($row->previous_account_balance);
            $entry->setCommitted($row->committed);

            $entry->setChecks_qty($row->checks_qty);
            $entry->setAverage_days($row->average_days);
            $entry->setTotal_bruto($row->total_bruto);
            $entry->setImpuesto_al_cheque_amt($row->impuesto_al_cheque_amt);
            $entry->setIntereses($row->intereses);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior_fee($row->gastos_interior_fee);
            $entry->setGastos_general_fee($row->gastos_general_fee);
            $entry->setGastos_varios($row->gastos_varios);
            $entry->setTotal_neto($row->total_neto);
            
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setTasa_anual($row->tasa_anual);
            $entry->setAcreditacion_capital($row->acreditacion_capital);
            $entry->setAcreditacion_interior($row->acreditacion_interior);
            
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetLiquidacionesById(Gyuser_Model_Liquidaciones $obj) 
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'date',
            'variable_date',
            'current_account_balance',
            'previous_account_balance',
            'committed',
            'amount_payed',
            'amount_debt',
            'provider_id',
            'cave_id',
            'acreditacion',
            'credit_provider_id',
            'gastos_varios',
            'checks_qty',
            'average_days',
            'total_bruto',
            'impuesto_al_cheque_amt',
            'intereses',
            'gastos_interior',
            'gastos_general',
            'gastos_general_fee',
            'gastos_interior_fee',
            'total_neto',
            'impuesto_al_cheque',
            'tasa_anual',
            'acreditacion_capital',
            'acreditacion_interior',
            'gastos_menor_a_monto_1',
            'gastos_menor_a_1',
            'gastos_menor_a_monto_2',
            'gastos_menor_a_2'
        ));
        $select->where('id = ?', $obj->getId());
        $select->order('date DESC');
        $row = $table->fetchRow($select);

        if ($row) {
            $entry = array(
                'id' => $row->id,
                'date' => date("d/m/Y", strtotime($row->date)),
                'variable_date' => $row->variable_date, 
                'current_account_balance' => $row->current_account_balance,
                'amount_payed' => $row->amount_payed,
                'amount_debt' => $row->amount_debt,
                'provider_id' => $row->provider_id,
                'cave_id' => $row->cave_id,
                'previous_account_balance' => $row->previous_account_balance,
                'committed' => $row->committed,
                'acreditacion' => $row->acreditacion,
                'credit_provider_id' => $row->credit_provider_id,
                'gastos_varios' => $row->gastos_varios,
                'checks_qty' => $row->checks_qty,
                'average_days' => $row->average_days,
                'total_bruto' => $row->total_bruto,
                'impuesto_al_cheque_amt' => $row->impuesto_al_cheque_amt,
                'intereses' => $row->intereses,
                'gastos_interior' => $row->gastos_interior,
                'gastos_general' => $row->gastos_general,
                'gastos_interior_fee' => $row->gastos_interior_fee,
                'gastos_general_fee' => $row->gastos_general_fee,
                'total_neto' => $row->total_neto,
                'impuesto_al_cheque' => $row->impuesto_al_cheque,
                'tasa_anual' => $row->tasa_anual,
                'acreditacion_capital' => $row->acreditacion_capital,
                'acreditacion_interior' => $row->acreditacion_interior,
                'gastos_menor_a_monto_1' => $row->gastos_menor_a_monto_1,
                'gastos_menor_a_1' => $row->gastos_menor_a_1,
                'gastos_menor_a_monto_2' => $row->gastos_menor_a_monto_2,
                'gastos_menor_a_2' => $row->gastos_menor_a_2
            );
        }
        return $entry;
    }
    
    public function getProvData($liqId)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from($table, array(
            'id',
            'provider_id',
            'date',
            'impuesto_al_cheque',
            'tasa_anual',
            'acreditacion_capital',
            'acreditacion_interior',
            'gastos_general',
            'gastos_interior',
            'gastos_menor_a_monto_1',
            'gastos_menor_a_1',
            'gastos_menor_a_monto_2',
            'gastos_menor_a_2',
            'committed'
        ));
        $select->join(array('prov' => 'providers'), 'liquidaciones.provider_id = prov.id', array('name as provider_name', 'email'));
        $select->where('liquidaciones.id = ?', $liqId);
        $row = $table->fetchRow($select);
        if ($row) {
            $prov = new Gyuser_Model_Providers();
            $prov->setId($row->id);  
            $prov->setName($row->provider_name);
            $prov->setEmail($row->email);
            $prov->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $prov->setTasa_anual($row->tasa_anual);
            $prov->setAcreditacion_capital($row->acreditacion_capital);
            $prov->setAcreditacion_interior($row->acreditacion_interior);
            $prov->setGastos_general($row->gastos_general);
            $prov->setGastos_interior($row->gastos_interior);
            $prov->setGastos_cheque_menor_a_1($row->gastos_menor_a_monto_1);
            $prov->setGastos_cheque_a_1($row->gastos_menor_a_1);
            $prov->setGastos_cheque_menor_a_2($row->gastos_menor_a_monto_2);
            $prov->setGastos_cheque_a_2($row->gastos_menor_a_2);            
        }
        return $prov;
    }
    
    public function getLiquidacionesForPrint($liqId) 
    {    
        if ($liqId) {
            $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liqId);
            $lqList = $lMapper->GetLiquidacionesById($lObj);                  
            
            $html = '';
            $html .= '<h1>Liquidacion '.$lqList['id'].'</h1>
                        <table cellpadding="0" cellspacing="0" border="1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>FECHA</th>
                                        <th>DEBE</th>
                                        <th>ACREDITACIONES</th>
                                        <th>IMPORTE PAGADO</th>
                                        <th>SALDO</th>
                                    </tr>
                                </thead>
                                   <tbody>';

            $html .= "<tr>
                            <td>{$lqList['id']}</td>
                            <td>{$lqList['date']}</td>
                            <td>{$lqList['amount_debt']}</td>
                            <td>{$lqList['acreditacion']}</td>
                            <td>{$lqList['amount_payed']}</td>
                            <td>{$lqList['current_account_balance']}</td>
                    </tr>";


            $html .= '</tbody></table><br/>';
            $html .=
                    '
                        <table cellpadding="0" cellspacing="0" border="1" >
                        <thead>
                                <tr>
                                    <td colspan="6" style="text-align:center">OPERACIONES COMPARTIDAS</td>
                                </tr>
                                <tr>
                                        <th>FECHA OP.</th>
                                        <th>NOMBRE</th>
                                        <th>TOTAL</th>
                                        <th>GY</th>
                                        <th>COMISIONES</th>
                                        <th>SALDO</th>
                                </tr>
                        </thead>
                           <tbody class="gridtbody">';
                       
            $oMapper = new Gyuser_Model_OperationsDataMapper();
            $cObj = new Gyuser_Model_Operations();
            $cObj->setLiquidacion_id($liqId);
            $opertationsList = $oMapper->GetOperationsByLiquidacionIdJson($cObj);           
            $pArr = $opertationsList;
            $strBld = '';
            $pay_final_amount = 0;
            if (count($pArr)) {
                foreach ($pArr as $pRow) {
                    $pay_final_amount += $pRow['prov_payment'];
                    $halfAmt = number_format(($pRow['amount'] /2), 2, '.', '');

                    $html .= "<tr >
                                    <td>{$pRow['date']}</td>
                                    <td>{$pRow['first_name']} {$pRow['last_name']}</td>
                                    <td>{$pRow['amount']}</td>
                                    <td>{$halfAmt}</td>                                   
                                    <td>{$pRow['comision_amt']}</td>
                                    <td>{$pRow['prov_payment']}</td>
                            </tr>";
                }
            }
            
            $html .= '</tbody>
                            <tfoot>
                                <tr style="font-weight:bold"><td colspan="4">&nbsp;</td><td>TOTAL</td><td><span class="operationsTotal_span">'.$pay_final_amount.'/span></td></tr>
                            </tfoot>
                        </table><br />';
            
            $html .= '<table cellpadding="0" cellspacing="0" border="1" >
                        <thead>
                                <tr>
                                    <td colspan="6" style="text-align:center">CHEQUES RECHAZADOS</td>
                                </tr>
                                <tr>
                                        <th>TITULAR</th>
                                        <th>FECHA</th>
                                        <th>N. CHEQUE</th>
                                        <th>RECHAZOS</th>
                                        <th>GASTOS</th>
                                        <th>SALDO</th>
                                </tr>
                        </thead>
                        <tbody class="gridtbody">';
            
            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liqId);
            $cObj->setProvider_id($lqList['provider_id']);
            $pArr = $cMapper->RejectedChequeByLiquidacionesIdForProv($cObj);
            $strBld = '';
            $sName = '';
            $rejectedTotal = 0;
            //$rejectedChequesFee = number_format($rejectedChequesFee,2,'.','');
            if (count($pArr)) {
                foreach ($pArr as $pRow) {
                    $cObj->setRejected_type($pRow['rejected_type']);
                    $rejectedChequesFee = (int) $cMapper->GetRejectionCostForProv($cObj);
                    $amount = $pRow['amount'];
                    $rChequeWithFee = $amount + $rejectedChequesFee;
                    $rChequeWithFee = number_format($rChequeWithFee, 2, '.', '');
                    $rejectedTotal += $rChequeWithFee;
                    $pay_final_amount += $rChequeWithFee;

                    $rejectedChequesFee = number_format($rejectedChequesFee, 2, '.', '');

                    $strBld .= <<<EOT
                    <tr id="RejectedCheque_{$pRow['id']}" style="background:#E3E3E3;">
                        <td class="user_operation_id">{$pRow['first_name']} {$pRow['last_name']}</td>
                        <td class="user_check_n">{$pRow['date']}</td>
                        <td class="user_bank_name">{$pRow['check_n']}</td>
                        <td class="user_amount">{$amount}</td>
                        <td class="user_rejected_cheque_fee">{$rejectedChequesFee}</td>                                            
                        <td class="pay_amount_cls">{$rChequeWithFee}</td>
                    </tr>
EOT;
                }
            }
            $pay_final_amountInv = $pay_final_amount * -1;
            $pre_val = $pre_val * -1;

            $html .= $strBld;
            $html .= '  </tbody>
                        <tfoot>
                            <tr style="font-weight:bold"><td colspan="4">&nbsp;</td><td>TOTAL</td><td><span class="rejectedTotal_span">'.$rejectedTotal.'</span></td></tr>
                        </tfoot>
                    </table><br />';
            
            $html .= '<table id="operationGridADDst" class="totals-table">
                            <tr id="Acreditacion">
                                <td>Acreditaciones:</td>
                                <td>
                                    $ <input type="text" name="acreditacion" class="pay_amount_cls" value="" size="5" style="height:11px" />                                        
                                </td>
                            </tr>
                            <tr id="operationGridADDend">
                                <td>Importe a Liquidar:</td>
                                <td>
                                    <span class="pay_final_amount_span">'.$pay_final_amount.'</span>     
                                    <input type="hidden" id="pay_final_amount" value="'.$pay_final_amountInv.'" />
                                </td>
                            </tr>
                        </table><br />';         
            
            /*
            $rejectedCheques = $cMapper->RejectedChequeByLiquidacionesIdForProv($cObj);
            $pArr = $rejectedCheques;
            $rejectedChequesFee = 60.00;
            $rejectedChequesFee = number_format($rejectedChequesFee, 2, '.', '');

            if (count($pArr)) {
                $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';
                foreach ($pArr as $pRow) 
                {
                    //$pRow	=	new Gyuser_Model_Cheques();
                    $amount = $pRow['amount'];
                    $rChequeWithFee = $amount + $rejectedChequesFee;
                    $rChequeWithFee = number_format($rChequeWithFee, 2, '.', '');
                    $pay_final_amount += $rChequeWithFee;
                    $html .= "<tr  style='background:#E3E3E3;'>
					<td class='user_operation_id'>{$pRow['first_name']}<input type='hidden' value='}' name='operation_id'/></td>
					<td class='user_date'></td>
					<td class='user_check_n'></td>
					<td class='user_bank_name'></td>
					<td class='user_amount'>{$amount}</td>
					<td class='user_rejected_cheque_fee'>{$rejectedChequesFee}</td>
					<td class='user_bank_name'></td>
					<td class='user_bank_name'>$rChequeWithFee</td>
				</tr>";
                }                
                if (count($pArr)) 
                {
                    $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';
                    $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    $pay_final_amount = number_format($pay_final_amount, 2, '.', '');
                    $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO EN CHEQUES</td><td style='background:#CCCCCC;'><b>$pay_final_amount</b><input type='hidden' id='pay_final_amount' value='$pay_final_amount' /></td></tr>";
                    $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";
                }
            }
            $html .= '</tbody></table>';
             * 
             * 
             */
            $html .= '<br /><br />
    <h1>CALCULO DE DESCUENTO - <span class="currentDate"></span></h1>
    <table  cellpadding="0" cellspacing="0" border="1" >
	<thead>
		<tr>
			<th>TITULAR</th>
			<th>EMPRESA</th>
			<th>FECHA</th>
			<th>N. CHEQUE</th>
			<th>IMPORTE</th>
			<th>CANT. DIAS</th>
			<th>IMP. AL CHEQUE</th>
			<th>DESCUENTO</th>
			<th>SALDO A HOY</th>
		</tr>
	</thead>
	   <tbody class="gridtbody">';

            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liqId);
            $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($liqId, $provData, $liqDate);
            $totalFinalAmount = 0;
            foreach ($chequesList as $cheques) {
                $item = $cheques;
                $cave_name = $item['first_name'];
                $amount = floatval($item['amount']);
                $check_n = $item['check_n'];
                $bank_name = $item['bank_name'];
                $date = $item['date'];
                $l_date = $item['liquidacion_date'];

                $acreditacion_hr = (int) $item['acreditacion_hrs'];
                $date = $item['date'];

                $date_arc = add_days_by_hr($date, $acreditacion_hr);
                $date_diff = dateDiff($l_date, $date_arc);

                $chqPer = $amount * 2.1 / 100;
                $discount = ($amount * 0.17 / 100) * $date_diff;
                $finalAmount = $amount - $chqPer - $discount;


                $finalAmount = number_format($finalAmount, 2, '.', '');
                $amount = number_format($amount, 2, '.', '');
                $chqPer = number_format($chqPer, 2, '.', '');
                $discount = number_format($discount, 2, '.', '');
                $commision = number_format($commision, 2, '.', '');

                $totalFinalAmount += $finalAmount;

                $html .= "<tr>  
                            <td>$cave_name</td>
                            <td>$date</td>
                            <td>$amount</td>
                            <td>$check_n</td>
                            <td>$bank_name</td>
                            <td>$date_diff</td>
                            <td>$chqPer</td>
                            <td>$discount</td>
                            <td>$finalAmount</td>
                         </tr>";
            }
            $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";
            $html .= '</tbody></table>';
            echo $html;
        }
        
    }

}

