<?php

class Gyuser_Model_InterestsDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_Interests');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_Interests $Interests)
    {
       $data = array(
       		'id'		=> $Interests->getId(),
            'rate'		=> $Interests->getRate(),
		);
        if (null === ($id = $Interests->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
        	$id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
 
    public function find($id, Gyuser_Model_Interests $Interests)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $Interests->setId($row->id)
                  ->setEmail($row->email)
                  ->setComment($row->comment)
                  ->setCreated($row->created);*/
    }
 
    public function fetchAll()
    {
        $table = $this->getDbTable();
        $select = $table->select();
		$select->from($table,array(
    								'id',
    								'rate',
    							));
    	$select->where('status = ?', true);
		$select->order('rate ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
        	
            $entry = new Gyuser_Model_Interests();
           	$entry->setId($row->id);
           	$entry->setRate($row->rate);
            $entries[] = $entry;
        }
        return $entries;
    }
    public function getInterestRate($id) 
    {
        try {
            $table = $this->getDbTable();
            $select = $table->select();
            $select->from($table,array(
                            'id',
                            'rate',
            ));
            $select->where('id = ?', $id);
            $resultSet = $table->fetchAll($select);
            $entries   = array();
            $entry = new Gyuser_Model_Interests();
            foreach ($resultSet as $row) {
                $entry = new Gyuser_Model_Interests();
                $entry->setId($row->id);
                $entry->setRate($row->rate);
                $entries[] = $entry;
            }
            return $entry;
            
        } catch(Exception $e){
            return $e;
        }
    }
	

}

