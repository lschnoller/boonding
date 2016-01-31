<?php

class Gyuser_Model_UserType
{
	protected $_id;
	protected $_user_type_code;
	protected $_user_type_description;
	protected $_user_type_status;	 	
	
	
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

	public function getUser_type_code() {
		return $this->_user_type_code;
	}

	public function setUser_type_code($_user_type_code) {
		$this->_user_type_code = $_user_type_code;
	}

	public function getUser_type_description() {
		return $this->_user_type_description;
	}

	public function setUser_type_description($_user_type_description) {
		$this->_user_type_description = $_user_type_description;
	}

	public function getUser_type_status() {
		return $this->_user_type_status;
	}

	public function setUser_type_status($_user_type_status) {
		$this->_user_type_status = $_user_type_status;
	}

	
	
	

}

