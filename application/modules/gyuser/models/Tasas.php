<?php

class Gyuser_Model_Tasas {

    protected $_id;
    protected $_rate;
    protected $_status;

    public function __construct(array $options = null) {
        if (is_array($options)) {
            $this->setOptions($options);
        }
    }

    public function __set($name, $value) {
        $method = 'set' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        $this->$method($value);
    }

    public function __get($name) {
        $method = 'get' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid guestbook property');
        }
        return $this->$method();
    }

    public function setOptions(array $options) {
        $methods = get_class_methods($this);
        foreach ($options as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (in_array($method, $methods)) {
                $this->$method($value);
            }
        }
        return $this;
    }

    /**
     * @return the $_id
     */
    public function getId() {
        return $this->_id;
    }

    /**
     * @param field_type $_id
     */
    public function setId($_id) {
        $this->_id = $_id;
    }

    /**
     * @return the $_rate
     */
    public function getRate() {
        return $this->_rate;
    }

    /**
     * @param field_type $_rate
     */
    public function setRate($_rate) {
        $this->_rate = $_rate;
    }

    /**
     * @return the $_status
     */
    public function getStatus() {
        return $this->_status;
    }

    /**
     * @param field_type $_status
     */
    public function setStatus($_status) {
        $this->_status = $_status;
    }

}

