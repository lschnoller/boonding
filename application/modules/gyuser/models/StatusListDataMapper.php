<?php

class Gyuser_Model_StatusListDataMapper
{
	protected $_dbTable;
 
    public function setDbTable($dbTable)
    {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }
 
    public function getDbTable()
    {
        if (null === $this->_dbTable) {
            $this->setDbTable('Gyuser_Model_DbTable_StatusList');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_StatusList $StatusList)
    {
       $data = array(
            'name'	=> $StatusList->getName()
        );
 
        if (null === ($id = $StatusList->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
 
    public function find($id, Gyuser_Model_StatusList $StatusList)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $StatusList->setId($row->id)
                  ->setEmail($row->email)
                  ->setComment($row->comment)
                  ->setCreated($row->created);*/
    }
 
    public function fetchAll()
    {
        $resultSet = $this->getDbTable()->fetchAll();
        $entries   = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_StatusList();
          	 $entry->setId($row->id);
          	 $entry->setStatus_list($row->status_list);
            	  
            $entries[] = $entry;
        }
        return $entries;
    }

}

