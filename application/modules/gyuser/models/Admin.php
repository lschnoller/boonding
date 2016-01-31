<?php

class Gyuser_Model_Admin {

    protected $_id;
    protected $_rejected_type_1_name;
    protected $_rejected_type_1_cost;
    protected $_rejected_type_2_name;
    protected $_rejected_type_2_cost;
    protected $_tiempo_ac_capital;
    protected $_tiempo_ac_interior;
    protected $_tiempo_ac_sistema;
    protected $_gastos_denuncia;
    protected $_gastos_rechazo;
    protected $_gastos_general;
    protected $_gastos_interior;
    protected $_impuesto_al_cheque;
    protected $_crm_operation_notify_span;
    protected $_mail_informes;
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

    public function getRejected_type_1_name() {
        return $this->_rejected_type_1_name;
    }

    public function setRejected_type_1_name($_rejected_type_1_name) {
        $this->_rejected_type_1_name = $_rejected_type_1_name;
    }

    public function getRejected_type_1_cost() {
        return $this->_rejected_type_1_cost;
    }

    public function setRejected_type_1_cost($_rejected_type_1_cost) {
        $this->_rejected_type_1_cost = $_rejected_type_1_cost;
    }

    public function getRejected_type_2_name() {
        return $this->_rejected_type_2_name;
    }

    public function setRejected_type_2_name($_rejected_type_2_name) {
        $this->_rejected_type_2_name = $_rejected_type_2_name;
    }

    public function getRejected_type_2_cost() {
        return $this->_rejected_type_2_cost;
    }

    public function setRejected_type_2_cost($_rejected_type_2_cost) {
        $this->_rejected_type_2_cost = $_rejected_type_2_cost;
    }

    public function getTiempo_ac_capital() {
        return $this->_tiempo_ac_capital;
    }

    public function getCrm_operation_notify_span() {
        return $this->_crm_operation_notify_span;
    }

    public function setCrm_operation_notify_span($_crm_operation_notify_span) {
        $this->_crm_operation_notify_span = $_crm_operation_notify_span;
    }

    public function setTiempo_ac_capital($_tiempo_ac_capital) {
        $this->_tiempo_ac_capital = $_tiempo_ac_capital;
    }

    public function getTiempo_ac_interior() {
        return $this->_tiempo_ac_interior;
    }

    public function setTiempo_ac_interior($_tiempo_ac_interior) {
        $this->_tiempo_ac_interior = $_tiempo_ac_interior;
    }

    public function getTiempo_ac_sistema() {
        return $this->_tiempo_ac_sistema;
    }

    public function setTiempo_ac_sistema($_tiempo_ac_sistema) {
        $this->_tiempo_ac_sistema = $_tiempo_ac_sistema;
    }

    public function getGastos_denuncia() {
        return $this->_gastos_denuncia;
    }

    public function setGastos_denuncia($_gastos_denuncia) {
        $this->_gastos_denuncia = $_gastos_denuncia;
    }

    public function getGastos_rechazo() {
        return $this->_gastos_rechazo;
    }

    public function setGastos_rechazo($_gastos_rechazo) {
        $this->_gastos_rechazo = $_gastos_rechazo;
    }

    public function getGastos_general() {
        return $this->_gastos_general;
    }

    public function setGastos_general($_gastos_general) {
        $this->_gastos_general = $_gastos_general;
    }

    public function getGastos_interior() {
        return $this->_gastos_interior;
    }

    public function setGastos_interior($_gastos_interior) {
        $this->_gastos_interior = $_gastos_interior;
    }

    public function getImpuesto_al_cheque() {
        return $this->_impuesto_al_cheque;
    }

    public function setImpuesto_al_cheque($_impuesto_al_cheque) {
        $this->_impuesto_al_cheque = $_impuesto_al_cheque;
    }

    public function getMail_informes() {
        return $this->_mail_informes;
    }

    public function setMail_informes($_mail_informes) {
        $this->_mail_informes = $_mail_informes;
    }

    public function getStatus() {
        return $this->_status;
    }

    public function setStatus($_status) {
        $this->_status = $_status;
    }
}

