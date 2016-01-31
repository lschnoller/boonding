<?php

class Gyuser_Model_Operations {

    protected $_id;
    protected $_type;
    protected $_client_id;
    protected $_date;
    protected $_ac_date;
    protected $_amount;
    protected $_amount_today;
    protected $_state;
    protected $_observations;
    protected $_report;
    protected $_operations_first_name;
    protected $_operations_last_name;
    protected $_operations_state_name;
    protected $_plan_id;
    protected $_interests_id;
    protected $_cave_id;
    protected $_prov_name;
    protected $_prov_commission_rate;
    protected $_prov_commission_amt;
    protected $_prov_payment; //the amount to be paid to the provider (total / our percentage - commission amt )
    protected $_bank_account_id;
    protected $_other_caves_obj;
    protected $_provider_obj;
    protected $_user_obj;
    protected $_liquidacion_id;
    protected $_tasa_porcentual;
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

    public function getType() {
        return $this->_type;
    }

    public function setType($_type) {
        $this->_type = $_type;
    }
    
    public function getClient_id() {
        return $this->_client_id;
    }

    public function setClient_id($_client_id) {
        $this->_client_id = $_client_id;
    }

    public function getDate() {
        return $this->_date;
    }
    public function setDate($_date) {
        $this->_date = $_date;
    }
    
    public function getAc_date() {
        return $this->_ac_date;
    }
    public function setAc_date($_ac_date) {
        $this->_ac_date = $_ac_date;
    }

    public function getAmount() {
        return $this->_amount;
    }
    public function setAmount($_amount) {
        $this->_amount = $_amount;
    }
    
    public function getAmount_today() {
        return $this->_amount_today;
    }
    public function setAmount_today($_amount_today) {
        $this->_amount_today = $_amount_today;
    }

    public function getState() {
        return $this->_state;
    }

    public function setState($_state) {
        $this->_state = $_state;
    }

    public function getObservations() {
        return $this->_observations;
    }

    public function setObservations($_observations) {
        $this->_observations = $_observations;
    }

    public function getReport() {
        return $this->_report;
    }

    public function setReport($_report) {
        $this->_report = $_report;
    }

    public function getOperations_first_name() {
        return $this->_operations_first_name;
    }

    public function setOperations_first_name($_operations_first_name) {
        $this->_operations_first_name = $_operations_first_name;
    }

    public function getOperations_last_name() {
        return $this->_operations_last_name;
    }

    public function setOperations_last_name($_operations_last_name) {
        $this->_operations_last_name = $_operations_last_name;
    }

    public function getOperations_state_name() {
        return $this->_operations_state_name;
    }

    public function setOperations_state_name($_operations_state_name) {
        $this->_operations_state_name = $_operations_state_name;
    }

    /**
     * @return the $_plan_id
     */
    public function getPlan_id() {
        return $this->_plan_id;
    }

    /**
     * @param field_type $_plan_id
     */
    public function setPlan_id($_plan_id) {
        $this->_plan_id = $_plan_id;
    }

    /**
     * @return the $_interests_id
     */
    public function getInterests_id() {
        return $this->_interests_id;
    }

    /**
     * @param field_type $_interests_id
     */
    public function setInterests_id($_interests_id) {
        $this->_interests_id = $_interests_id;
    }

    /**
     * @return the $_cave_id
     */
    public function getCave_id() {
        return $this->_cave_id;
    }

    /**
     * @param field_type $_cave_id
     */
    public function setCave_id($_cave_id) {
        $this->_cave_id = $_cave_id;
    }

    public function getBank_account_id() {
        return $this->_bank_account_id;
    }

    public function setBank_account_id($_bank_account_id) {
        $this->_bank_account_id = $_bank_account_id;
    }

    public function getProvider_obj() {
        return $this->_provider_obj;
    }
    public function setProvider_obj($_provider_obj) {
        $this->_provider_obj = $_provider_obj;
    }
    
    public function getOther_caves_obj() {
        return $this->_other_caves_obj;
    }

    public function setOther_caves_obj($_other_caves_obj) {
        $this->_other_caves_obj = $_other_caves_obj;
    }

    public function getLiquidacion_id() {
        return $this->_liquidacion_id;
    }

    public function setLiquidacion_id($_liquidacion_id) {
        $this->_liquidacion_id = $_liquidacion_id;
    }

    public function getUser_obj() {
        return $this->_user_obj;
    }

    public function setUser_obj($_user_obj) {
        $this->_user_obj = $_user_obj;
    }

    public function getStatus() {
        return $this->_status;
    }

    public function setStatus($_status) {
        $this->_status = $_status;
    }

    public function getProv_name() {
        return $this->_prov_name;
    }
    public function setProv_name($_prov_name) {
        $this->_prov_name = $_prov_name;
    }

    public function getProv_commission_amt() {
        return $this->_prov_commission_amt;
    }
    public function setProv_commission_amt($_prov_commission_amt) {
        $this->_prov_commission_amt = $_prov_commission_amt;
    }
    
    public function getProv_payment() {
        return $this->_prov_payment;
    }
    public function setProv_payment($_prov_payment) {
        $this->_prov_payment = $_prov_payment;
    }
    
    public function getProv_commission_rate() {
        return $this->_prov_commission_rate;
    }
    public function setProv_commission_rate($_prov_commission_rate) {
        $this->_prov_commission_rate = $_prov_commission_rate;
    }
    
    public function getTasa_porcentual() {
        return $this->_tasa_porcentual;
    }
    public function setTasa_porcentual($tasa_porcentual) {
        $this->_tasa_porcentual = $tasa_porcentual;
    }
}

