<?php

class Gyuser_Model_Cheques {

    protected $_id;
    protected $_operation_id;
    protected $_operation_type;
    protected $_client_id;
    protected $_bank_account_id;
    protected $_date;
    protected $_check_n;
    protected $_amount;
    protected $_local;
    protected $_check_zip_code;
    protected $_liquidacion_id;
    protected $_provider_id;
    protected $_credit_provider_id;
    protected $_balance;
    protected $_rejected_check_payment;
    protected $_rejected_bank_id;
    protected $_rejected_comments;
    protected $_rejected_type;
    protected $_rejected_gastos;
    protected $_rejected_cost_prov;
    protected $_rejected_liq_id;
    protected $_informe_report;
    
    protected $_terceros_ac_date;
    protected $_terceros_today_value;
    protected $_terceros_days;
    protected $_terceros_location;
    protected $_terceros_ac_hours;
    protected $_terceros_imp_al_cheque;
    protected $_terceros_tasa_anual;
    protected $_terceros_gastos_general;
    protected $_terceros_gastos_interior;  
    protected $_terceros_descuento;    
    
    protected $_status;
    protected $_acreditacion_hrs;
    protected $_cheques_list;
    protected $_cheques_status_obj;
    protected $_bank_accounts_obj;
    protected $_provider_obj;
    protected $_other_caves_obj;
    protected $_cave_id;
    protected $_clients_obj;
    protected $_credit_provider_obj;
    protected $_rej_cheque_client_ids;
    protected $_address_obj;    
    
    protected $_first_name;
    protected $_last_name;
    protected $_tercero_first_name;
    protected $_tercero_last_name;
    protected $_tercero_client_id;
    protected $_empresa;
    protected $_zip;
    protected $_localidad;
    protected $_operation_amount;
    protected $_status_name;
    protected $_cave_name;
    protected $_rejected_balance;
    protected $_liq_date;
    
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
    
    public function getTercero_client_id() {
        return $this->_tercero_client_id;
    }
    public function setTercero_client_id($_tercero_client_id) {
        $this->_tercero_client_id = $_tercero_client_id;
    }
    
    public function getTercero_first_name() {
        return $this->_tercero_first_name;
    }
    public function setTercero_first_name($_tercero_first_name) {
        $this->_tercero_first_name = $_tercero_first_name;
    }
    
    public function getTercero_last_name() {
        return $this->_tercero_last_name;
    }
    public function setTercero_last_name($_tercero_last_name) {
        $this->_tercero_last_name = $_tercero_last_name;
    }
    
    public function getEmpresa() {
        return $this->_empresa;
    }
    public function setEmpresa($_empresa) {
        $this->_empresa = $_empresa;
    }
    
    public function getZip() {
        return $this->_zip;
    }
    public function setZip($_zip) {
        $this->_zip = $_zip;
    }    
    
    public function getLocalidad() {
        return $this->_localidad;
    }
    public function setLocalidad($_localidad) {
        $this->_localidad = $_localidad;
    }
    
    public function getOperation_amount() {
        return $this->_operation_amount;
    }
    public function setOperation_amount($_operation_amount) {
        $this->_operation_amount = $_operation_amount;
    }
    
    public function getStatus_name() {
        return $this->_status_name;
    }
    public function setStatus_name($_status_name) {
        $this->_status_name = $_status_name;
    }
    
    public function getCave_name() {
        return $this->_cave_name;
    }
    public function setCave_name($_cave_name) {
        $this->_cave_name = $_cave_name;
    }
    
    public function getRejected_balance() {
        return $this->_rejected_balance;
    }
    public function setRejected_balance($_rejected_balance) {
        $this->_rejected_balance = $_rejected_balance;
    }
/*
    * cheques.id, clients.first_name, clients.last_name, operations.amount, cheques.date, cheques.check_n, cheques.amount, 
    * cheques_status.status_list, cheques.liquidacion_id, credit_providers.name 
 * 
 */

    public function __construct(array $options = null) {
        if (is_array($options)) {
            $this->setOptions($options);
        }
    }

    public function __set($name, $value) {
        $method = 'set' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid property');
        }
        $this->$method($value);
    }

    public function __get($name) {
        $method = 'get' . $name;
        if (('mapper' == $name) || !method_exists($this, $method)) {
            throw new Exception('Invalid property');
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
     * @return the $_operation_id
     */
    public function getOperation_id() {
        return $this->_operation_id;
    }

    /**
     * @param field_type $_operation_id
     */
    public function setOperation_id($_operation_id) {
        $this->_operation_id = $_operation_id;
    }


    /**
     * @return the $_operation_id
     */
    public function getOperation_type() {
        return $this->_operation_type;
    }

    /**
     * @param field_type $_operation_id
     */
    public function setOperation_type($_operation_type) {
        $this->_operation_type = $_operation_type;
    }
    /**
     * @return the $_operation_id
     */
    public function getClient_id() {
        return $this->_client_id;
    }

    /**
     * @param field_type $_operation_id
     */
    public function setClient_id($_client_id) {
        $this->_client_id = $_client_id;
    }

    /**
     * @return the $_operation_id
     */
    public function getBank_account_id() {
        return $this->_bank_account_id;
    }

    /**
     * @param field_type $_operation_id
     */
    public function setBank_account_id($_bank_account_id) {
        $this->_bank_account_id = $_bank_account_id;
    }
    
    /**
     * @return the $_date
     */
    public function getDate() {
        return $this->_date;
    }

    /**
     * @param field_type $_date
     */
    public function setDate($_date) {
        $this->_date = $_date;
    }

    /**
     * @return the $_check_n
     */
    public function getCheck_n() {
        return $this->_check_n;
    }

    /**
     * @param field_type $_check_n
     */
    public function setCheck_n($_check_n) {
        $this->_check_n = $_check_n;
    }

    /**
     * @return the $_amount
     */
    public function getAmount() {
        return $this->_amount;
    }

    /**
     * @param field_type $_amount
     */
    public function setAmount($_amount) {
        $this->_amount = $_amount;
    }

    /**
     * @return the $_cheques_list
     */
    public function getCheques_list() {
        return $this->_cheques_list;
    }

    /**
     * @param field_type $_cheques_list
     */
    public function setCheques_list($_cheques_list) {
        $this->_cheques_list = $_cheques_list;
    }

    /**
     * @return the $_local
     */
    public function getLocal() {
        return $this->_local;
    }

    /**
     * @param field_type $_local
     */
    public function setLocal($_local) {
        $this->_local = $_local;
    }

    public function getCave_id() {
        return $this->_credit_provider_id;
    }

    public function setCave_id($_cave_id) {
        $this->_credit_provider_id = $_cave_id;
    }

    public function getClients_obj() {
        return $this->_clients_obj;
    }

    public function setClients_obj($_clients_obj) {
        $this->_clients_obj = $_clients_obj;
    }

    public function getCheques_status_obj() {
        return $this->_cheques_status_obj;
    }

    public function setCheques_status_obj($_cheques_status_obj) {
        $this->_cheques_status_obj = $_cheques_status_obj;
    }

    public function getBank_accounts_obj() {
        return $this->_bank_accounts_obj;
    }

    public function setBank_accounts_obj($_bank_accounts_obj) {
        $this->_bank_accounts_obj = $_bank_accounts_obj;
    }

    public function getLiquidacion_id() {
        return $this->_liquidacion_id;
    }

    public function setLiquidacion_id($liquidacion_id) {
        $this->_liquidacion_id = $liquidacion_id;
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

    public function getBalance() {
        return $this->balance;
    }

    public function getRejected_gastos() {
        return $this->rejected_gastos;
    }

    public function getRejected_check_payment() {
        return $this->rejected_check_payment;
    }

    public function getRejected_bank_id() {
        return $this->rejected_bank_id;
    }

    public function getRejected_comments() {
        return $this->rejected_comments;
    }

    public function setBalance($x) {
        $this->balance = $x;
    }

    public function setRejected_gastos($x) {
        $this->rejected_gastos = $x;
    }

    public function setRejected_check_payment($x) {
        $this->rejected_check_payment = $x;
    }

    public function setRejected_bank_id($x) {
        $this->rejected_bank_id = $x;
    }

    public function setRejected_comments($x) {
        $this->rejected_comments = $x;
    }

    public function getProvider_id() {
        return $this->_provider_id;
    }
    public function setProvider_id($x) {
        $this->_provider_id = $x;
    }
    
    public function getCredit_provider_id() {
        return $this->_credit_provider_id;
    }

    public function setCredit_provider_id($x) {
        $this->_credit_provider_id = $x;
    }

    public function getCredit_provider_obj() {
        return $this->_credit_provider_obj;
    }

    public function setCredit_provider_obj($x) {
        $this->_credit_provider_obj = $x;
    }

    public function getCheck_zip_code() {
        return $this->_check_zip_code;
    }

    public function setCheck_zip_code($_check_zip_code) {
        $this->_check_zip_code = $_check_zip_code;
    }

    public function getRej_cheque_client_ids() {
        return $this->_rej_cheque_client_ids;
    }

    public function setRej_cheque_client_ids($_rej_cheque_client_ids) {
        $this->_rej_cheque_client_ids = $_rej_cheque_client_ids;
    }

    public function getAddress_obj() {
        return $this->_address_obj;
    }

    public function setAddress_obj($_address_obj) {
        $this->_address_obj = $_address_obj;
    }

    public function getRejected_type() {
        return $this->_rejected_type;
    }

    public function setRejected_type($_rejected_type) {
        $this->_rejected_type = $_rejected_type;
    }

    public function getAcreditacion_hrs() {
        return $this->_acreditacion_hrs;
    }

    public function setAcreditacion_hrs($_acreditacion_hrs) {
        $this->_acreditacion_hrs = $_acreditacion_hrs;
    }

    public function setRejected_cost_prov($rejected_cost_prov) {
        $this->_rejected_cost_prov = $rejected_cost_prov;
    }

    public function getRejected_cost_prov() {
        return $this->_rejected_cost_prov;
    }
    
    public function setRejected_liq_id($rejected_liq_id) {
        $this->_rejected_liq_id = $rejected_liq_id;
    }

    public function getRejected_liq_id() {
        return $this->_rejected_liq_id;
    }
    
    public function setLiq_date($_liq_date) {
        $this->_liq_date = $_liq_date;
    }

    public function getLiq_date() {
        return $this->_liq_date;
    }
    
    public function setInforme_report($_informe_report) {
        $this->_informe_report = $_informe_report;
    }

    public function getInforme_report() {
        return $this->_informe_report;
    }
    
    public function setTerceros_ac_date($_terceros_ac_date) {
        $this->_terceros_ac_date = $_terceros_ac_date;
    }
    public function getTerceros_ac_date() {
        return $this->_terceros_ac_date;
    }
    
    public function setTerceros_today_value($_terceros_today_value) {
        $this->_terceros_today_value = $_terceros_today_value;
    }
    public function getTerceros_today_value() {
        return $this->_terceros_today_value;
    }
    
    public function setTerceros_days($_terceros_days) {
        $this->_terceros_days = $_terceros_days;
    }
    public function getTerceros_days() {
        return $this->_terceros_days;
    }
    
    public function setTerceros_location($_terceros_location) {
        $this->_terceros_location = $_terceros_location;
    }
    public function getTerceros_location() {
        return $this->_terceros_location;
    }

    public function setTerceros_ac_hours($_terceros_ac_hours) {
        $this->_terceros_ac_hours = $_terceros_ac_hours;
    }
    public function getTerceros_ac_hours() {
        return $this->_terceros_ac_hours;
    }
    
    public function setTerceros_imp_al_cheque($_terceros_imp_al_cheque) {
        $this->_terceros_imp_al_cheque = $_terceros_imp_al_cheque;
    }
    public function getTerceros_imp_al_cheque() {
        return $this->_terceros_imp_al_cheque;
    }

    public function setTerceros_tasa_anual($_terceros_tasa_anual) {
        $this->_terceros_tasa_anual = $_terceros_tasa_anual;
    }
    public function getTerceros_tasa_anual() {
        return $this->_terceros_tasa_anual;
    }

    public function setTerceros_gastos_general($_terceros_gastos_general) {
        $this->_terceros_gastos_general = $_terceros_gastos_general;
    }
    public function getTerceros_gastos_general() {
        return $this->_terceros_gastos_general;
    }

    public function setTerceros_gastos_interior($_terceros_gastos_interior) {
        $this->_terceros_gastos_interior = $_terceros_gastos_interior;
    }
    public function getTerceros_gastos_interior() {
        return $this->_terceros_gastos_interior;
    }    

    public function setTerceros_descuento($_terceros_descuento) {
        $this->_terceros_descuento = $_terceros_descuento;
    }
    public function getTerceros_descuento() {
        return $this->_terceros_descuento;
    }
}

