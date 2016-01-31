<?php

class Gyuser_Model_OperatorDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Operator');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Operator $Operator) {
        $pwd = "";
        $data = array(
            'type' => $Operator->getType(),
            'name' => $Operator->getName(),
            'last_name' => $Operator->getLast_name(),
            'email' => $Operator->getEmail()
        );
        if ($Operator->getPassword() != "" && $Operator->getPassword() != null) {
            $pwd = md5($Operator->getPassword());
            $data['password'] = $pwd;
        }
        if (null === ($id = $Operator->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find($id, Gyuser_Model_Operator $Operator) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $Operator->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select()->where('status = ?', 1);
        $resultSet = $this->getDbTable()->fetchall($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Operator();
            $entry->setId($row->id);
            $entry->setType($row->type);
            $entry->setName($row->name);
            $entry->setLast_name($row->last_name);
            $entry->setEmail($row->email);
            $entry->setPassword($row->password);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function delete(Gyuser_Model_Operator $obj) {
        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {
            echo $e;
        }
        /*
        $userObj = new Gyuser_Model_UserDataMapper();
        $userCount = $userObj->GetClientCountByOperatorId($obj);

        $result = 0;
        if (!$userCount) {
            $table = $this->getDbTable();
            $where = $table->getAdapter()->quoteInto('id = ?', $obj->getId());
            $result = $table->delete($where);
        }
        return $result;
         */
    }

    public function LoginAuth(Gyuser_Model_Operator $obj) {

        $table = $this->getDbTable();
        $select = $table->select($table, array('id', 'name', 'last_name', 'email', 'type'))
                ->where('email = ?', $obj->getEmail())
                ->where('password = ?', md5($obj->getPassword()))
                ->where('status = ?', true);
        $result = $table->fetchRow($select);
        $entry = new Gyuser_Model_Operator();
        if (@$result->id) {
            $entry->setId($result->id);
            $entry->setName($result->name);
            $entry->setLast_name($result->last_name);
            $entry->setEmail($result->email);
            $entry->setType($result->type);
        }

        return $entry;
    }

}
