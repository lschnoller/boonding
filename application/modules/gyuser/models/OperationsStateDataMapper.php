<?php

class Gyuser_Model_OperationsStateDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_OperationsState');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_OperationsState $obj)
    {
       $data = array(
            'name'	=> $obj->getName()
        );
 
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
 
    public function find($id, Gyuser_Model_OperationsState $obj)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $obj->setId($row->id)
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
									'order_id',
    							));
    	$select->where('status = ?', true);
		$select->order('name ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
        	
            $entry = new Gyuser_Model_OperationsState();
           	$entry->setId($row->order_id);
           	$entry->setName(htmlentities($row->name));
           	$entry->setOrder_id($row->order_id);
            $entries[] = $entry;
        }
        return $entries;
    }
 	public function fetchAllArr()
    {
          $table = $this->getDbTable();
        $select = $table->select();
		$select->from($table,array(
    								'id',
    								'name',
									'order_id',
    							));
    	$select->where('status = ?', true);
		$select->order('name ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
        	
            $entry = array(
						    'id'		=>	$row->id,
            				'name'		=>	$row->name,
            				'order_id'	=>	$row->order_id,				           
						);
           	$entries[$row->order_id] = $entry;
        }
        return $entries;
    }

}

