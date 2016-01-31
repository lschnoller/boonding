<?php

class Gyuser_Model_EventTypeDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_EventType');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_EventType $obj)
    {
   		$data = array(
       		'id'	=> $obj->getId(),
            'name'	=> $obj->getName(),
        );
 		$id	=	(int)$obj->getId();
        if (!$id) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
 
    public function find($id, Gyuser_Model_EventType $EventType)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $EventType->setId($row->id)
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
    								'name',
    							));
    	$select->where('status = ?', true);
		$select->order('name ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
        	
            $entry = new Gyuser_Model_EventType();
           	$entry->setId($row->id);
           	$entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }
	public function delete(Gyuser_Model_EventType $obj)
    {
    	try{
    	  $table = $this->getDbTable();
    	  $set 	= array('status'	=> 0);
    	  $where 	= array('id = ?' => $obj->getId());
          $result = $table->update($set,$where);
          return $result;
    	}catch (Exception $e){
    		
    		echo $e;
    	}
    }

}

