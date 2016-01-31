<?php

class Gyuser_Model_Operator
{
	protected $_id;
  	protected $_name;
	protected $_last_name;
	protected $_email;
	protected $_password;
	protected $_type;
	
	
	
	
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

	public function getName() {
		return $this->_name;
	}

	public function getLast_name() {
		return $this->_last_name;
	}

	public function getEmail() {
		return $this->_email;
	}

	public function getPassword() {
		return $this->_password;
	}
	public function getType() {
		return $this->_type;
	}

	public function setId($_id) {
		$this->_id = $_id;
	}

	public function setName($_name) {
		$this->_name = $_name;
	}

	public function setLast_name($_last_name) {
		$this->_last_name = $_last_name;
	}

	public function setEmail($_email) {
		$this->_email = $_email;
	}

	public function setPassword($_password) {
		$this->_password = $_password;
	}
	public function setType($_type) {
		$this->_type = $_type;
	}
	
}

