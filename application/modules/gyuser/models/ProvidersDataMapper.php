<?php

class Gyuser_Model_ProvidersDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Providers');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Providers $obj) {
        $data = array(
            'id' => $obj->getId(),
            'name' => $obj->getName(),
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
    
    public function update(Gyuser_Model_Providers $obj) {
        $data = array(           
            'id' => $obj->getId(),
            'name' => $obj->getName(),
            'email' => $obj->getEmail(),
            'tasa_anual' => $obj->getTasa_anual(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'gastos_general' => $obj->getGastos_general(),
            'gastos_interior' => $obj->getGastos_interior(),
            'gastos_denuncia' => $obj->getGastos_denuncia(),
            'gastos_rechazo' => $obj->getGastos_rechazo(),
            'acreditacion_capital' => $obj->getAcreditacion_capital(),
            'acreditacion_interior' => $obj->getAcreditacion_interior(),
            'gastos_menor_a_monto_1' => $obj->getGastos_cheque_menor_a_1() ? $obj->getGastos_cheque_menor_a_1() : null,
            'gastos_menor_a_1' => $obj->getGastos_cheque_a_1() ? $obj->getGastos_cheque_a_1() : null,
            'gastos_menor_a_monto_2' => $obj->getGastos_cheque_menor_a_2() ? $obj->getGastos_cheque_menor_a_2() : null,
            'gastos_menor_a_2' => $obj->getGastos_cheque_a_2() ? $obj->getGastos_cheque_a_2() : null,
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

    public function find($id, Gyuser_Model_Providers $obj) {
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
            'name',
        ));
        $select->where('status = ?', true);
        //$select->order('name ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Providers();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetProviderByIdSimple($provId) 
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('prov' => 'providers'), array(
            'id',
            'name',
            'email',
            'balance',
            'tasa_anual',
            'impuesto_al_cheque',
            'gastos_general',
            'gastos_interior',
            'gastos_denuncia',
            'gastos_rechazo',
            'acreditacion_capital',
            'acreditacion_interior',
            'gastos_menor_a_monto_1',
            'gastos_menor_a_1',
            'gastos_menor_a_monto_2',
            'gastos_menor_a_2',
        ));
        $select->where('prov.id = ?', $provId);
        
        $row = $table->fetchRow($select);
        if ($row) {
            $entry = new Gyuser_Model_Providers();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entry->setEmail($row->email);
            $entry->setBalance($row->balance);
            
            $entry->setTasa_anual($row->tasa_anual);
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setGastos_denuncia($row->gastos_denuncia);
            $entry->setGastos_rechazo($row->gastos_rechazo);
            $entry->setAcreditacion_capital($row->acreditacion_capital);
            $entry->setAcreditacion_interior($row->acreditacion_interior);

            $entry->setGastos_cheque_menor_a_1($row->gastos_menor_a_monto_1);
            $entry->setGastos_cheque_a_1($row->gastos_menor_a_1);
            $entry->setGastos_cheque_menor_a_2($row->gastos_menor_a_monto_2);
            $entry->setGastos_cheque_a_2($row->gastos_menor_a_2);

            return $entry;
        } else {
            return null;
        }
    }
    
    public function GetProviderById($provId) 
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('prov' => 'providers'), array(
            'id',
            'name',
            'email',
            'balance',
            'tasa_anual',
            'impuesto_al_cheque',
            'gastos_general',
            'gastos_interior',
            'gastos_denuncia',
            'gastos_rechazo',
            'acreditacion_capital',
            'acreditacion_interior',
            'gastos_menor_a_monto_1',
            'gastos_menor_a_1',
            'gastos_menor_a_monto_2',
            'gastos_menor_a_2',
            'comision_rate'
        ));

        $select->joinLeft(array('ops' => 'operations'), 'ops.cave_id = prov.id', array('cave_id', 'liquidacion_id'));
        $select->joinLeft(array('cqu' => 'cheques'), 'cqu.operation_id = ops.id ', array(
            'sum(cqu.amount) as rej_amount',
            'sum(cqu.rejected_cost) as rej_cost',
        ));

        $select->where('cqu.status = ?', 3);
        $select->where('cqu.rejected_liquidacion_id is null');
        $select->where('prov.status = ?', true);
        $select->where('prov.id = ?', $provId);

        $select->order('name ASC');
        $row = $table->fetchRow($select);

        if ($row) {
            $entry = new Gyuser_Model_Providers();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entry->setEmail($row->email);
            $entry->setBalance($row->balance);
            $entry->setRej_check_amount(floatval($row->rej_amount) + floatval($row->rej_cost));

            $entry->setTasa_anual($row->tasa_anual);
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setGastos_denuncia($row->gastos_denuncia);
            $entry->setGastos_rechazo($row->gastos_rechazo);
            $entry->setAcreditacion_capital($row->acreditacion_capital);
            $entry->setAcreditacion_interior($row->acreditacion_interior);
            $entry->setGastos_cheque_menor_a_1($row->gastos_menor_a_monto_1);
            $entry->setGastos_cheque_a_1($row->gastos_menor_a_1);
            $entry->setGastos_cheque_menor_a_2($row->gastos_menor_a_monto_2);
            $entry->setGastos_cheque_a_2($row->gastos_menor_a_2);            
            $entry->setComisionRate($row->comision_rate);

            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setStatus(4);
            $cObj->setProvider_id($row->cave_id);
            if (!empty($row->cave_id)) {
                $cAmount = $cMapper->GetTotalAmountByProvider($cObj);
                $entry->setPassed_amount($cAmount);
            }
            return $entry;
        } else {
            return null;
        }
    }

    public function delete(Gyuser_Model_Providers $obj) {
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

    public function UpdateBalance(Gyuser_Model_Providers $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('balance' => $obj->getBalance());
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function UpdateBalanceByReject(Gyuser_Model_Providers $obj) {
        try {
            $table = $this->getDbTable();
            /*
            $prov = $this->GetProviderById($obj);            
            $previousBalance = floatval($prov->getBalance());
            $rejBalance = floatval($obj->getBalance());
            $currentBalance = $previousBalance - $rejBalance;             
             */
            $set = array('balance' => $obj->getBalance());
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);

            return $result;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function GetAllProviders() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'name',
            'email',
            'phone_1',
            'phone_2',
            'balance'
        ));
        $select->where('status = ?', true);
        $select->order('name ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Providers();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entry->setEmail($row->email);
            $entry->setPhone_1($row->phone_1);
            $entry->setPhone_2($row->phone_2);
            $entry->setBalance($row->balance);
            $entries[] = $entry;
        }
        return $entries;
    }
    
    
    public function getProviders() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from('providers', array(
            'id',
            'name',
            'email',
            'balance',
            'tasa_anual',
            'impuesto_al_cheque',
            'gastos_general',
            'gastos_interior',
            'gastos_denuncia',
            'gastos_rechazo',
            'acreditacion_capital',
            'acreditacion_interior',
            'gastos_menor_a_monto_1',
            'gastos_menor_a_1',
            'gastos_menor_a_monto_2',
            'gastos_menor_a_2',
        ));
        $select->joinLeft(array('cqu' => 'cheques'), 'cqu.provider_id = providers.id and cqu.status = 3 and cqu.rejected_liquidacion_id IS NULL', array(
            'sum(amount) as rej_amount',
            'sum(rejected_cost) as rej_cost',
        ));
        //$select->where('cqu.status = ?', 3);
        //$select->where('cqu.rejected_liquidacion_id IS NULL');
        $select->where('providers.status = ?', true);
        $select->group('providers.id');
        $select->order('id ASC');        
        $resultset = $table->fetchAll($select);
        
        $entires = array();
        foreach ($resultset as $row) {
            //$entry = new Gyuser_Model_SupplierOperations();
            $entry = new Gyuser_Model_Providers();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entry->setEmail($row->email);
            $entry->setBalance($row->balance);
            $entry->setTasa_anual($row->tasa_anual);
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setGastos_denuncia($row->gastos_denuncia);
            $entry->setGastos_rechazo($row->gastos_rechazo);
            $entry->setAcreditacion_capital($row->acreditacion_capital);
            $entry->setAcreditacion_interior($row->acreditacion_interior);

            $entry->setGastos_cheque_menor_a_1($row->gastos_menor_a_monto_1);
            $entry->setGastos_cheque_a_1($row->gastos_menor_a_1);
            $entry->setGastos_cheque_menor_a_2($row->gastos_menor_a_monto_2);
            $entry->setGastos_cheque_a_2($row->gastos_menor_a_2);

            $entry->setRej_check_amount(floatval($row->rej_amount) + floatval($row->rej_cost));
            
            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setStatus(4);
            $cObj->setProvider_id($row->id);
            $cAmount = $cMapper->GetTotalAmountByStats($cObj);

            $entry->setPassed_amount($cAmount);
            $entires[] = $entry;
        }
        return $entires;
    }
    
    
    
    public function calculateComisionAmt($totalAmt, $comisionRate) {
        $comisionAmount = ($totalAmt / 2) * $comisionRate / 100; //get comision amount;
        return number_format($comisionAmount, 2, '.', '');
    }
    
    public function calculateProvPayment($totalAmt, $comisionAmt) {
        $provPay = ($totalAmt /2) - $comisionAmt;
        return number_format($provPay, 2, '.', '');
    }
}

