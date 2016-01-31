<?php

class Gyuser_Model_User
{
    protected $_id;
    protected $_client_type;    
    protected $_client_type_name;
    protected $_first_name;
    protected $_last_name;
    protected $_DNI;
    protected $_CUIL;
    protected $_tel_part;
    protected $_tel_lab;
    protected $_tel_cell;
    protected $_tel_otro;
    protected $_tel_part_code;
    protected $_tel_lab_code;
    protected $_tel_cell_code;
    protected $_tel_otro_code;
    protected $_address_1;
    protected $_address_2;
    protected $_email;
    protected $_activity;
    protected $_date_added;
    protected $_operator;
    protected $_contact_point;
    protected $_extra_info;
    protected $_user_type_id;   
    protected $_business;
    protected $_business_CUIT;
    protected $_multi_address_json;
    protected $_multi_prior_json;
    protected $_status;
    protected $_type_change;  
 
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

	public function getClient_type() {
		return $this->_client_type;
	}

	public function setClient_type($_client_type) {
		$this->_client_type = $_client_type;
	}

	public function getClient_type_name() {
		return $this->_client_type_name;
	}

	public function setClient_type_name($_client_type_name) {
		$this->_client_type_name = $_client_type_name;
	}

	public function getFirst_name() {
		return $this->_first_name;
	}

	public function setFirst_name($_first_name) {
		$this->_first_name = $_first_name;
	}

	public function getLast_name() {
		return $this->_last_name;
	}

	public function setLast_name($_last_name) {
		$this->_last_name = $_last_name;
	}

	public function getDNI() {
		return $this->_DNI;
	}

	public function setDNI($_DNI) {
		$this->_DNI = $_DNI;
	}

	public function getCUIL() {
		return $this->_CUIL;
	}

	public function setCUIL($_CUIL) {
		$this->_CUIL = $_CUIL;
	}


	public function getTel_part() {
		return $this->_tel_part;
	}

	public function setTel_part($_tel_part) {
		$this->_tel_part = $_tel_part;
	}

	public function getTel_lab() {
		return $this->_tel_lab;
	}

	public function setTel_lab($_tel_lab) {
		$this->_tel_lab = $_tel_lab;
	}

	public function getTel_cell() {
		return $this->_tel_cell;
	}

	public function setTel_cell($_tel_cell) {
		$this->_tel_cell = $_tel_cell;
	}

	public function getTel_otro() {
		return $this->_tel_otro;
	}

	public function setTel_otro($_tel_otro) {
		$this->_tel_otro = $_tel_otro;
	}

	public function getTel_part_code() {
		return $this->_tel_part_code;
	}

	public function getTel_lab_code() {
		return $this->_tel_lab_code;
	}

	public function getTel_cell_code() {
		return $this->_tel_cell_code;
	}

	public function getTel_otro_code() {
		return $this->_tel_otro_code;
	}

	public function setTel_part_code($_tel_part_code) {
		$this->_tel_part_code = $_tel_part_code;
	}

	public function setTel_lab_code($_tel_lab_code) {
		$this->_tel_lab_code = $_tel_lab_code;
	}

	public function setTel_cell_code($_tel_cell_code) {
		$this->_tel_cell_code = $_tel_cell_code;
	}

	public function setTel_otro_code($_tel_otro_code) {
		$this->_tel_otro_code = $_tel_otro_code;
	}

	public function getAddress_1() {
		return $this->_address_1;
	}

	public function setAddress_1($_address_1) {
		$this->_address_1 = $_address_1;
	}

	public function getAddress_2() {
		return $this->_address_2;
	}

	public function setAddress_2($_address_2) {
		$this->_address_2 = $_address_2;
	}

	public function getEmail() {
		return $this->_email;
	}

	public function setEmail($_email) {
		$this->_email = $_email;
	}

	public function getActivity() {
		return $this->_activity;
	}

	public function setActivity($_activity) {
		$this->_activity = $_activity;
	}

	public function getDate_added() {
		return $this->_date_added;
	}

	public function setDate_added($_date_added) {
		$this->_date_added = $_date_added;
	}

	public function getOperator() {
		return $this->_operator;
	}

	public function setOperator($_operator) {
		$this->_operator = $_operator;
	}

	public function getContact_point() {
		return $this->_contact_point;
	}

	public function setContact_point($_contact_point) {
		$this->_contact_point = $_contact_point;
	}

	public function getExtra_info() {
		return $this->_extra_info;
	}

	public function setExtra_info($_extra_info) {
		$this->_extra_info = $_extra_info;
	}
	public function getUser_type_id() {
		return $this->_user_type_id;
	}

	public function setUser_type_id($_user_type_id) {
		$this->_user_type_id = $_user_type_id;
	}
	public function getBusiness() {
		return $this->_business;
	}

	public function setBusiness($_business) {
		$this->_business = $_business;
	}
	public function getBusiness_CUIT() {
		return $this->_business_CUIT;
	}

	public function setBusiness_CUIT($_business_CUIT) {
		$this->_business_CUIT = $_business_CUIT;
	}

	public function getMulti_address_json() {
		return $this->_multi_address_json;
	}

	public function setMulti_address_json($_multi_address_json) {
		$this->_multi_address_json = $_multi_address_json;
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
   
	public function getType_change() {
		return $this->_type_change;
	}
        public function setType_change($_type_change) {
		$this->_type_change = $_type_change;
	}
   	

}

