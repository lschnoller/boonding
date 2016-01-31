<?php

class Gyuser_Model_StateBDDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_StateBD');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_StateBD $StateBD)
    {
        /*$data = array(
            'operation_id'		=> $StateBD->getOperation_id(),
			'date'				=> $StateBD->getDate(),
			'check_n'			=> $StateBD->getCheck_n(),
			'amount'			=> $StateBD->getAmount(),
			'status'			=> $StateBD->getStatus()
        );
        if (null === ($id = $StateBD->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
        	 unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }*/
    }
 
    public function find($id, Gyuser_Model_StateBD $StateBD)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $StateBD->setId($row->id)
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
        	
            $entry = new Gyuser_Model_StateBD();
           	$entry->setId($row->id);
           	$entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }
	

}

