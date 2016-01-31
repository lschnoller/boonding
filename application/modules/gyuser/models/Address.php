<?php

class Gyuser_Model_Address
{
	protected $_id;
  	protected $_client_id;
  	protected $_street;
  	protected $_city;
  	protected $_zip_code;
  	protected $_state;
  	protected $_country;
  	protected $_address_type;
  	protected $_delivery_address;
  	protected $_multi_address_json;
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

	public function getClient_id() {
		return $this->_client_id;
	}

	public function setClient_id($_client_id) {
		$this->_client_id = $_client_id;
	}

	public function getStreet() {
		return $this->_street;
	}

	public function setStreet($_street) {
		$this->_street = $_street;
	}

	public function getCity() {
		return $this->_city;
	}

	public function setCity($_city) {
		$this->_city = $_city;
	}

	public function getZip_code() {
		return $this->_zip_code;
	}

	public function setZip_code($_zip_code) {
		$this->_zip_code = $_zip_code;
	}

	public function getState() {
		return $this->_state;
	}

	public function setState($_state) {
		$this->_state = $_state;
	}

	public function getCountry() {
		return $this->_country;
	}

	public function setCountry($_country) {
		$this->_country = $_country;
	}

	public function getAddress_type() {
		return $this->_address_type;
	}

	public function setAddress_type($_address_type) {
		$this->_address_type = $_address_type;
	}

	public function getDelivery_address() {
		return $this->_delivery_address;
	}

	public function setDelivery_address($_delivery_address) {
		$this->_delivery_address = $_delivery_address;
	}

	public function getMulti_address_json() {
		return $this->_multi_address_json;
	}

	public function setMulti_address_json($_multi_address_json) {
		$this->_multi_address_json = $_multi_address_json;
	}

	public function getStatus() {
		return $this->_status;
	}

	public function setStatus($_status) {
		$this->_status = $_status;
	}

	
}

