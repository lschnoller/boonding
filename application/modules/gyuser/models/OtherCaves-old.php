<?php

class Gyuser_Model_OtherCaves {

    protected $_id;
    protected $_name;
    protected $_balance;
    protected $_email;
    protected $_phone_1;
    protected $_phone_2;
    protected $_status;
    protected $_rej_check_amount;
    protected $_passed_amount;
    protected $_tasa_anual;
    protected $_impuesto_al_cheque;
    protected $_gastos_general;
    protected $_gastos_interior;
    protected $_acreditacion_capital;
    protected $_acreditacion_interior;
    protected $_gastos_denuncia;
    protected $_gastos_rechazo;
    protected $_gastos_cheque_menor_a_1;
    protected $_gastos_cheque_a_1;
    protected $_gastos_cheque_menor_a_2;
    protected $_gastos_cheque_a_2;

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

    public function getName() {
        return $this->_name;
    }

    public function getBalance() {
        return $this->_balance;
    }

    public function getEmail() {
        return $this->_email;
    }

    public function getPhone_1() {
        return $this->_phone_1;
    }

    public function getPhone_2() {
        return $this->_phone_2;
    }

    public function getStatus() {
        return $this->_status;
    }

    public function setId($x) {
        $this->_id = $x;
    }

    public function setName($x) {
        $this->_name = $x;
    }

    public function setBalance($x) {
        $this->_balance = $x;
    }

    public function setEmail($x) {
        $this->_email = $x;
    }

    public function setPhone_1($x) {
        $this->_phone_1 = $x;
    }

    public function setPhone_2($x) {
        $this->_phone_2 = $x;
    }

    public function setStatus($x) {
        $this->_status = $x;
    }

    public function getRej_check_amount() {
        return $this->_rej_check_amount;
    }

    public function setRej_check_amount($_rej_check_amount) {
        $this->_rej_check_amount = $_rej_check_amount;
    }

    public function getPassed_amount() {
        return $this->_passed_amount;
    }

    public function setPassed_amount($_passed_amount) {
        $this->_passed_amount = $_passed_amount;
    }

    public function getTasa_anual() {
        return $this->_tasa_anual;
    }

    public function setTasa_anual($_tasa_anual) {
        $this->_tasa_anual = $_tasa_anual;
    }

    public function getImpuesto_al_cheque() {
        return $this->_impuesto_al_cheque;
    }

    public function setImpuesto_al_cheque($_impuesto_al_cheque) {
        $this->_impuesto_al_cheque = $_impuesto_al_cheque;
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

    public function getAcreditacion_capital() {
        return $this->_acreditacion_capital;
    }

    public function setAcreditacion_capital($_acreditacion_capital) {
        $this->_acreditacion_capital = $_acreditacion_capital;
    }

    public function getAcreditacion_interior() {
        return $this->_acreditacion_interior;
    }

    public function setAcreditacion_interior($_acreditacion_interior) {
        $this->_acreditacion_interior = $_acreditacion_interior;
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

    public function getGastos_cheque_menor_a_1() {
        return $this->_gastos_cheque_menor_a_1;
    }

    public function setGastos_cheque_menor_a_1($_gastos_cheque_menor_a_1) {
        $this->_gastos_cheque_menor_a_1 = $_gastos_cheque_menor_a_1;
    }

    public function getGastos_cheque_a_1() {
        return $this->_gastos_cheque_a_1;
    }

    public function setGastos_cheque_a_1($_gastos_cheque_a_1) {
        $this->_gastos_cheque_a_1 = $_gastos_cheque_a_1;
    }

    public function getGastos_cheque_menor_a_2() {
        return $this->_gastos_cheque_menor_a_2;
    }

    public function setGastos_cheque_menor_a_2($_gastos_cheque_menor_a_2) {
        $this->_gastos_cheque_menor_a_2 = $_gastos_cheque_menor_a_2;
    }

    public function getGastos_cheque_a_2() {
        return $this->_gastos_cheque_a_2;
    }

    public function setGastos_cheque_a_2($_gastos_cheque_a_2) {
        $this->_gastos_cheque_a_2 = $_gastos_cheque_a_2;
    }

}

