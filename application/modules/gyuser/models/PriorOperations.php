<?php

class Gyuser_Model_PriorOperations
{
	protected $_id;
	protected $_date;
	protected $_is_operation_completed;
	protected $_cave_name;
	protected $_amount;
	protected $_next_check_date;
	protected $_pending_checks;
	protected $_is_last_operation;
	protected $_client_id;
	protected $_multi_prior_json;
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

	public function getDate() {
		return $this->_date;
	}

	public function setDate($_date) {
		$this->_date = $_date;
	}

	public function getIs_operation_completed() {
		return $this->_is_operation_completed;
	}

	public function setIs_operation_completed($_is_operation_completed) {
		$this->_is_operation_completed = $_is_operation_completed;
	}


	public function getCave_name() {
		return $this->_cave_name;
	}

	public function setCave_name($_cave_name) {
		$this->_cave_name = $_cave_name;
	}

	public function getAmount() {
		return $this->_amount;
	}

	public function setAmount($_amount) {
		$this->_amount = $_amount;
	}

	public function getNext_check_date() {
		return $this->_next_check_date;
	}

	public function setNext_check_date($_next_check_date) {
		$this->_next_check_date = $_next_check_date;
	}

	public function getPending_checks() {
		return $this->_pending_checks;
	}

	public function setPending_checks($_pending_checks) {
		$this->_pending_checks = $_pending_checks;
	}

	public function getIs_last_operation() {
		return $this->_is_last_operation;
	}

	public function setIs_last_operation($_is_last_operation) {
		$this->_is_last_operation = $_is_last_operation;
	}

	public function getClient_id() {
		return $this->_client_id;
	}

	public function setClient_id($_client_id) {
		$this->_client_id = $_client_id;
	}

	public function getMulti_prior_json() {
		return $this->_multi_prior_json;
	}

	public function setMulti_prior_json($_multi_prior_json) {
		$this->_multi_prior_json = $_multi_prior_json;
	}

	public function getStatus() {
		return $this->_status;
	}

	public function setStatus($_status) {
		$this->_status = $_status;
	}

	
}

