<?php

class Gyuser_Model_BankAccounts
{
	protected $_id;
  	protected $_user_id;
	protected $_bank_name;
	protected $_account_n;
	protected $_branch;
	protected $_zip_code;
	protected $_opening_date;
	protected $_state;
	protected $_status;
	protected $_location_capital;
	
	
	
	
 	public function getState() {
		return $this->_state;
	}

	public function getStatus() {
		return $this->_status;
	}

	public function setState($_state) {
		$this->_state = $_state;
	}

	public function setStatus($_status) {
		$this->_status = $_status;
	}

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

	public function getUser_id() {
		return $this->_user_id;
	}

	public function setUser_id($_user_id) {
		$this->_user_id = $_user_id;
	}

	public function getBank_name() {
		return $this->_bank_name;
	}

	public function setBank_name($_bank_name) {
		$this->_bank_name = $_bank_name;
	}

	public function getAccount_n() {
		return $this->_account_n;
	}

	public function setAccount_n($_account_n) {
		$this->_account_n = $_account_n;
	}

	public function getBranch() {
		return $this->_branch;
	}

	public function setBranch($_branch) {
		$this->_branch = $_branch;
	}
	public function getZip_code() {
		return $this->_zip_code;
	}

	public function setZip_code($_zip_code) {
		$this->_zip_code = $_zip_code;
	}

	public function getOpening_date() {
		return $this->_opening_date;
	}

	public function setOpening_date($_opening_date) {
		$this->_opening_date = $_opening_date;
	}
	public function getLocation_capital() {
		return $this->_location_capital;
	}

	public function setLocation_capital($_location_capital) {
		$this->_location_capital = $_location_capital;
	}




}

