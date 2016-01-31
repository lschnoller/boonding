<?php

class Gyuser_Model_PlansDataMapper
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
            $this->setDbTable('Gyuser_Model_DbTable_Plans');
        }					   
        return $this->_dbTable;
    }
 
    public function save(Gyuser_Model_Plans $Plans)
    {
        $data = array(
            'payments_qty'		=> $Plans->getPayments_qty(),
			'recurrence'		=> $Plans->getRecurrence()
        );
        if (null === ($id = $Plans->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
        	 unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
    public function find($id, Gyuser_Model_Plans $Plans)
    {
        /*$result = $this->getDbTable()->find($id);
        if (0 == count($result)) {
            return;
        }
        $row = $result->current();
        $Plans->setId($row->id)
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
    								'payments_qty',
    								'recurrence',
    							));
    	$select->where('status = ?', true);
		$select->order('payments_qty ASC');
    	$resultSet = $table->fetchAll($select);
        $entries   = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Plans();
          	$entry->setId($row->id);
          	$entry->setPayments_qty($row->payments_qty);
          	$entry->setRecurrence($row->recurrence);          	
            $entries[] = $entry;
        }
        return $entries;
    }
	
	public function delete(Gyuser_Model_Plans $obj)
    {
    	  $table = $this->getDbTable();
          $where = $table->getAdapter()->quoteInto('id = ?', $obj->getId());
          $result = $table->delete($where);
          return $result;
   }

}

