<?php

class Gyuser_Model_PriorOperationsDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_PriorOperations');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_PriorOperations $obj) {

        $data = array(
            'date' => $obj->getDate(),
            'is_operation_completed' => $obj->getIs_operation_completed(),
            'cave_name' => $obj->getCave_name(),
            'amount' => $obj->getAmount(),
            'next_check_date' => $obj->getNext_check_date(),
            'pending_checks' => $obj->getPending_checks(),
            'is_last_operation' => $obj->getIs_last_operation(),
            'next_check_date' => $obj->getNext_check_date(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $data['client_id'] = $obj->getClient_id();
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function saveWithJson($json, $clientid) {
        $multiPrior = json_decode($json);
        $newPriorIdsArr = array();

        if ($multiPrior) {
            foreach ($multiPrior as $Prior) {
                $next_check_date = null;
                $date = null;
                if ($Prior->next_check_date) {
                    list($Day, $Month, $Year) = explode('/', $Prior->next_check_date);
                    $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                    $next_check_date = date("Y-m-d", $stampeddate);
                }
                if ($Prior->date) {
                    list($Day, $Month, $Year) = explode('/', $Prior->date);
                    $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                    $date = date("Y-m-d", $stampeddate);
                }
                $isOperationCompleted = 0;

                if (isset($Prior->is_operation_completed)) {
                    $isOperationCompleted = (int) $Prior->is_operation_completed;
                }

                $data = array(
                    'client_id' => $clientid,
                    'date' => $date,
                    'is_operation_completed' => $isOperationCompleted,
                    'cave_name' => $Prior->cave_name,
                    'amount' => $Prior->amount,
                    'next_check_date' => $next_check_date,
                    'pending_checks' => $Prior->pending_checks,
                    'is_last_operation' => $Prior->is_last_operation,
                );


                $id = $this->getDbTable()->insert($data);
                $newPriorIdsArr[$id] = $id;
            }
        }
        return $newPriorIdsArr;
    }

    public function find($id, Gyuser_Model_PriorOperations $obj) {
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

            $entry = new Gyuser_Model_PriorOperations();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetPriorByClientId(Gyuser_Model_PriorOperations $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('pos' => 'prior_operations'), array(
            'id',
            'date',
            'is_operation_completed',
            'cave_name',
            'amount',
            'next_check_date',
            'pending_checks',
            'is_last_operation',
        ));
        //$select->joinLeft(array('ocs'=>'other_caves'),'pos.cave_name = ocs.id',array('name as cave_name_db'));
        $select->joinLeft(array('prov' => 'providers'), 'pos.cave_name = prov.id', array('name as cave_name_db'));
        $select->where('pos.client_id = ?', $obj->getClient_id());
        $select->where('pos.status = ?', true);
        $select->order('pos.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $date = '';
            $next_check_date = '';
            if ($row->date) {
                $date = date("d/m/Y", strtotime($row->date));
            }
            if ($row->next_check_date) {
                $next_check_date = date("d/m/Y", strtotime($row->next_check_date));
            }

            $entry = array(
                'id' => $row->id,
                'date' => $date,
                'is_operation_completed' => $row->is_operation_completed,
                'cave_name' => $row->cave_name,
                'cave_name_db' => $row->cave_name_db,
                'amount' => $row->amount,
                'next_check_date' => $next_check_date,
                'pending_checks' => $row->pending_checks,
                'is_last_operation' => $row->is_last_operation,
            );

            $entries[] = $entry;
        }
        return $entries;
    }

    public function EditMultiPriorByClientId(Gyuser_Model_PriorOperations $obj) {

        $client_id = $obj->getClient_id();
        $multiPrior = json_decode($obj->getMulti_Prior_json());
        $newPriorIdsArr = array();
        foreach ($multiPrior as $Prior) {

            list($Day, $Month, $Year) = explode('/', $Prior->next_check_date);
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $next_check_date = date("Y-m-d", $stampeddate);

            list($Day, $Month, $Year) = explode('/', $Prior->date);
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);


            if ($Prior->is_operation_completed) {
                $isOperation = (int) $Prior->is_operation_completed;
            } else {
                $isOperation = 0;
            }

            $id = (int) $Prior->id;
            $data = array(
                'id' => $id,
                'client_id' => $client_id,
                'date' => $date,
                'is_operation_completed' => $isOperation,
                'cave_name' => $Prior->cave_name,
                'amount' => $Prior->amount,
                'next_check_date' => $next_check_date,
                'pending_checks' => $Prior->pending_checks,
                'is_last_operation' => $Prior->is_last_operation,
            );

            if (!$id) {
                unset($data['id']);
                $id = $this->getDbTable()->insert($data);
            } else {
                $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            }



            $newPriorIdsArr[$id] = $id;
        }
        return $newPriorIdsArr;
    }

    public function delete(Gyuser_Model_PriorOperations $obj) {


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

}

