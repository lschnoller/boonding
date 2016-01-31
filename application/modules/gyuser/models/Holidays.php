<?php

class Gyuser_Model_Holidays {

    protected $_id;
    protected $_holiday_date;
    protected $_holiday_json;
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

    public function getId() {
        return $this->_id;
    }

    public function setId($_id) {
        $this->_id = $_id;
    }

    public function getStatus() {
        return $this->_status;
    }

    public function setStatus($_status) {
        $this->_status = $_status;
    }

    public function getHoliday_date() {
        return $this->_holiday_date;
    }

    public function setHoliday_date($_holiday_date) {
        $this->_holiday_date = $_holiday_date;
    }

    public function getHoliday_json() {
        return $this->_holiday_json;
    }

    public function setHoliday_json($_holiday_json) {
        $this->_holiday_json = $_holiday_json;
    }

}

