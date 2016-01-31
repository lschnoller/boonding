<?php

class Gyuser_Model_Events
{
	protected $_id;
	protected $_operation_id;
	protected $_operation_name;
	protected $_type_id;
	protected $_type_name;
	protected $_action_id;
	protected $_action_name;
	protected $_schedule;
	protected $_assigned_operator_id;
	protected $_assigned_operator_name;
	protected $_comments;
	protected $_status;
	
	
 	public function __construct(array $options = null)
    {
        if (is_array($options)) {
            $this->setOptions($options);
        }
    }
 
    public function __set($name, $value)
    {
        $method = 'set' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        $this->$method($value);
    }
 
    public function __get($name)
    {
        $method = 'get' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        return $this->$method();
    }
 
    public function setOptions(array $options)
    {
        $methods = get_class_methods($this);
        foreach ($options as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (in_array($method, $methods)) {
                $this->$method($value);
            }
        }
        return $this;
    }
	public function getId() {
		return $this->_id;
	}

	public function setId($_id) {
		$this->_id = $_id;
	}

	public function getOperation_id() {
		return $this->_operation_id;
	}

	public function setOperation_id($_operation_id) {
		$this->_operation_id = $_operation_id;
	}

	public function getOperation_name() {
		return $this->_operation_name;
	}

	public function setOperation_name($_operation_name) {
		$this->_operation_name = $_operation_name;
	}

	public function getType_id() {
		return $this->_type_id;
	}

	public function setType_id($_type_id) {
		$this->_type_id = $_type_id;
	}

	public function getType_name() {
		return $this->_type_name;
	}

	public function setType_name($_type_name) {
		$this->_type_name = $_type_name;
	}

	public function getAction_id() {
		return $this->_action_id;
	}

	public function setAction_id($_action_id) {
		$this->_action_id = $_action_id;
	}

	public function getAction_name() {
		return $this->_action_name;
	}

	public function setAction_name($_action_name) {
		$this->_action_name = $_action_name;
	}

	public function getSchedule() {
		return $this->_schedule;
	}

	public function setSchedule($_schedule) {
		$this->_schedule = $_schedule;
	}

	public function getAssigned_operator_id() {
		return $this->_assigned_operator_id;
	}

	public function setAssigned_operator_id($_assigned_operator_id) {
		$this->_assigned_operator_id = $_assigned_operator_id;
	}

	public function getAssigned_operator_name() {
		return $this->_assigned_operator_name;
	}

	public function setAssigned_operator_name($_assigned_operator_name) {
		$this->_assigned_operator_name = $_assigned_operator_name;
	}

	public function getComments() {
		return $this->_comments;
	}

	public function setComments($_comments) {
		$this->_comments = $_comments;
	}

	public function getStatus() {
		return $this->_status;
	}

	public function setStatus($_status) {
		$this->_status = $_status;
	}

	    
}

