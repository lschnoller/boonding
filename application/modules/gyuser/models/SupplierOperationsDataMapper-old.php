<?php

class Gyuser_Model_SupplierOperationsDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_SupplierOperations');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_SupplierOperations $obj) {
        $data = array(
            'name' => $obj->getName(),
            'email' => $obj->getEmail(),
            'tasa_anual' => $obj->getTasa_anual(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'gastos_interior' => $obj->getGastos_interior(),
            'gastos_general' => $obj->getGastos_general(),
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

    public function find($id, Gyuser_Model_SupplierOperations $obj) {
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
        $select->order('name ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_SupplierOperations();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetCaveById(Gyuser_Model_SupplierOperations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
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
        $select->where('status = ?', true);
        $select->where('id = ?', $obj->getId());

        $select->order('name ASC');
        $row = $table->fetchRow($select);

        if ($row) {
            $entry = new Gyuser_Model_SupplierOperations();
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

    public function delete(Gyuser_Model_SupplierOperations $obj) {
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

    public function UpdateBalance(Gyuser_Model_SupplierOperations $obj) {
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

    public function UpdateCurrentBalance(Gyuser_Model_SupplierOperations $obj) {
        try {

            $lic = $this->GetCaveById($obj);
            $cancelledAmount = floatval($obj->getBalance());
            $currentAmount = floatval($lic->getBalance());
            $supAmount = $cancelledAmount * (-1) + $currentAmount;
            $table = $this->getDbTable();
            $set = array('balance' => $supAmount);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }

    public function GetAllSuppliers() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);



        $select->from(array('cps' => 'credit_providers'), array(
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

        $select->joinLeft(array('cqu' => 'cheques'), 'cqu.credit_provider_id = cps.id and cqu.status = 3 and cqu.rejected_liquidacion_id IS NULL', array(
            'sum(amount) as rej_amount',
            'sum(rejected_cost) as rej_cost',
        ));
        //$select->where('cqu.status = ?', 3);
        //$select->where('cqu.rejected_liquidacion_id IS NULL');

        $select->where('cps.status = ?', true);
        $select->group('cps.id');

        $select->order('name ASC');
        $resultset = $table->fetchAll($select);
        $entires = array();
        foreach ($resultset as $row) {
            $entry = new Gyuser_Model_SupplierOperations();
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
            $cObj->setCredit_provider_id($row->id);
            $cAmount = $cMapper->GetTotalAmountByStats($cObj);

            $entry->setPassed_amount($cAmount);
            $entires[] = $entry;
        }
        return $entires;
    }

}

