<?php

class Gyuser_Model_ContactPointDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_ContactPoint');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_ContactPoint $ContactPoint)
    {
       $data = array(
       		'title'			=> $ContactPoint->getTitle(),
            'description'	=> $ContactPoint->getDescription()	
        );
   	 	$id	=	(int)$ContactPoint->getId();
        if (!$id) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }        
    }
 
    public function find($id, Gyuser_Model_ContactPoint $ContactPoint)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $ContactPoint->setId($row->id)
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
    								'title',
									'description',
    							));
    	$select->where('status = ?', true);
		$select->order('id ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
        	
          $entry = new Gyuser_Model_ContactPoint();
          	 $entry->setId($row->id);
          	 $entry->setTitle(utf8_encode($row->title));
          	 $entry->setDescription($row->description);          	             	  
            $entries[] = $entry;
        }
        return $entries;
      
    }
	public function delete(Gyuser_Model_ContactPoint $obj)
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

