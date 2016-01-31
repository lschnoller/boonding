<?php
class Gyuser_Model_CrmEvents extends Zend_Db_Table_Abstract
{
	/**
	 * @var Zend_Db_Table_Abstract
	 */
	protected $_name = 'CRM_Events';
	//....
	
	public function getList()
	{
		$select = $this->select()->order("event_type");
		$stmt = $select->query();
		$result = $stmt->fetchAll();
		return $result;
	}	
	
	public function getNewForm(array $post)
	{
		$form = new CRM_EventsForm();
		return $form->process($post, $this->createRow());
	}
	
	function getLastInsertId()
	{
		return $this->getAdapter()->lastInsertId();
	}
	
	public function getEditForm(array $post, $id)
	{
		$row = $this->fetchRow($this->select()->where('id = ?', $id));
		$form = new CRM_EventsForm();
		return $form->process($post, $row);
	}
	
	public function getEvent($id)
	{
		return $this->fetchRow($this->select()->where('id = ?', $id));
	}
	
	public function deleteElemet($id)
	{
		$rows = $this->delete("id = $id");
		if($rows > 0)
			return true;
		else
			return false;
	}
	
	
	
	
	
}