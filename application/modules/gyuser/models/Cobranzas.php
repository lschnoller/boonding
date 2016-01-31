<?php

class Gyuser_Model_Cobranzas
{
	protected $_id;
	protected $_client_id;
	protected $_operation_id;
	protected $_cheque_id;
	protected $_date_paid;
	protected $_paid_amount;
	protected $_previous_balance;
	protected $_current_balance;
	protected $_payment_type;
	protected $_cheques_obj;
	protected $_bank_accounts_obj;
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
	public function getId() { return $this->_id; } 
	public function getClient_id() { return $this->_client_id; } 
	public function getOperation_id() { return $this->_operation_id; } 
	public function getCheque_id() { return $this->_cheque_id; } 
	public function getDate_paid() { return $this->_date_paid; } 
	public function getPaid_amount() { return $this->_paid_amount; } 
	public function getPrevious_balance() { return $this->_previous_balance; } 
	public function getCurrent_balance() { return $this->_current_balance; } 
	public function getPayment_type() { return $this->_payment_type; } 
	public function getStatus() { return $this->_status; } 
	public function setId($x) { $this->_id = $x; } 
	public function setClient_id($x) { $this->_client_id = $x; } 
	public function setOperation_id($x) { $this->_operation_id = $x; } 
	public function setCheque_id($x) { $this->_cheque_id = $x; } 
	public function setDate_paid($x) { $this->_date_paid = $x; } 
	public function setPaid_amount($x) { $this->_paid_amount = $x; } 
	public function setPrevious_balance($x) { $this->_previous_balance = $x; } 
	public function setCurrent_balance($x) { $this->_current_balance = $x; } 
	public function setPayment_type($x) { $this->_payment_type = $x; } 
	public function setStatus($x) { $this->_status = $x; }
	public function getCheques_obj() { return $this->Cheques_obj; } 
	public function setCheques_obj($x) { $this->Cheques_obj = $x; }
	public function getBank_accounts_obj() { return $this->bank_accounts_obj; } 
	public function setBank_accounts_obj($x) { $this->bank_accounts_obj = $x; }   
}

