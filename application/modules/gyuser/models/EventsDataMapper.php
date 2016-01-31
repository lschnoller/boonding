<?php

class Gyuser_Model_EventsDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_Events');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_Events $Events)
    {
     	 $data = array(
		     	 	'operation_id'			=> $Events->getOperation_id(),
		     	 	'type_id'				=> $Events->getType_id(),
		     	 	'action_id'				=> $Events->getAction_id(),
		     	 	'schedule'				=> $Events->getSchedule(),
		     	 	'assigned_operator_id'	=> $Events->getAssigned_operator_id(),
		     	 	'comments'				=> $Events->getComments(),
     	 );
        if (null === ($id = $Events->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
 
    public function find($id, Gyuser_Model_Events $Events)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $Events->setId($row->id)
                  ->setEmail($row->email)
                  ->setComment($row->comment)
                  ->setCreated($row->created);*/
    }
 
    public function fetchAll()
    {
        $entries   = array();
			$table = $this->getDbTable();
			$select = $table->select();
			$select->setIntegrityCheck(false);

			$select->from(array('pvs'=>'events'),array('id', 'operation_id', 'type_id', 'action_id', 'schedule', 'assigned_operator_id', 'comments'));
			$select->join(array('ete'=>'event_type'),'pvs.type_id = ete.id',array('name as type_name'));
			$select->join(array('ean'=>'event_action'),'pvs.action_id = ean.id',array('name as action_name'));
			$select->where('pvs.status = ?', true);
    		$select->order('pvs.id ASC');
			$resultSet = $table->fetchAll($select);

			foreach ($resultSet as $row) {
	            
				$entry = new Gyuser_Model_Events();
				
	           	$entry->setId($row->id);
	           	$entry->setOperation_id($row->operation_id);
	           	$entry->setType_id($row->type_id);
	           	$entry->setType_name($row->type_name);
	           	$entry->setAction_id($row->action_id);
	           	$entry->setAction_name($row->action_name);
	           	$entry->setSchedule(date("d/m/Y",strtotime($row->schedule)));
	           	$entry->setAssigned_operator_id($row->assigned_operator_id);
	           	$entry->setComments($row->comments);
	           		                   
	            $entries[] = $entry;
	        }

		return $entries;
    }
	public function delete(Gyuser_Model_Events $obj)
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

