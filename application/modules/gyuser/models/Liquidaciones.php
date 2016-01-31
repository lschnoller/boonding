<?php

class Gyuser_Model_Liquidaciones
{
	protected $_id;
  	protected $_date;
  	protected $_current_account_balance;
  	protected $_amount_debt;
        protected $_amount_payed;
        protected $_provider_id;
  	protected $_cave_id;
  	protected $_cheques_json;
  	protected $_operations_json;
  	protected $_rejected_cheques_json;
  	protected $_status;
  	protected $_previous_account_balance;
  	protected $_acreditacion;
  	protected $_credit_provider_id;
  	protected $_committed;
        protected $_date_delivered;
  	
        protected $_checks_qty;
  	protected $_average_days;
  	protected $_total_bruto;
  	protected $_impuesto_al_cheque_amt;
  	protected $_intereses;
  	protected $_gastos_interior;
  	protected $_gastos_general;
        protected $_gastos_interior_fee;
  	protected $_gastos_general_fee;
  	protected $_gastos_varios;
  	protected $_total_neto;
        protected $_gastos_cheque_menor_a_1;
        protected $_gastos_cheque_a_1;
        protected $_gastos_cheque_menor_a_2;
        protected $_gastos_cheque_a_2;
        
        protected $_impuesto_al_cheque;
        protected $_tasa_anual;
        protected $_acreditacion_capital;
        protected $_acreditacion_interior;
	
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

	public function getDate() {
		return $this->_date;
	}

	public function setDate($_date) {
		$this->_date = $_date;
	}

	public function getCurrent_account_balance() {
		return $this->_current_account_balance;
	}

	public function setCurrent_account_balance($_current_account_balance) {
		$this->_current_account_balance = $_current_account_balance;
	}

        public function getAmount_debt() {
		return $this->_amount_debt;
	}

	public function setAmount_debt($_amount_debt) {
		$this->_amount_debt = $_amount_debt;
	}
        
	public function getAmount_payed() {
		return $this->_amount_payed;
	}

	public function setAmount_payed($_amount_payed) {
		$this->_amount_payed = $_amount_payed;
	}

        public function getAcreditacion() {
		return $this->_acreditacion;
	}
	public function setAcreditacion($_acreditacion) {
		$this->_acreditacion = $_acreditacion;
	}
        
	public function getCheques_json() {
		return $this->_cheques_json;
	}
	public function setCheques_json($_cheques_json) {
		$this->_cheques_json = $_cheques_json;
	}

	public function getOperations_json() {
		return $this->_operations_json;
	}
	public function setOperations_json($_operations_json) {
		$this->_operations_json = $_operations_json;
	}

	public function getRejected_cheques_json() {
		return $this->_rejected_cheques_json;
	}
	public function setRejected_cheques_json($_rejected_cheques_json) {
		$this->_rejected_cheques_json = $_rejected_cheques_json;
	}

        public function getProvider_id() {
		return $this->_provider_id;
	}
	public function setProvider_id($_provider_id) {
		$this->_provider_id = $_provider_id;
	}
        
        public function getCave_id() {
		return $this->_cave_id;
	}
	public function setCave_id($_cave_id) {
		$this->_cave_id = $_cave_id;
	}

	public function getStatus() {
		return $this->_status;
	}
	public function setStatus($_status) {
		$this->_status = $_status;
	}
        
	public function getPrevious_account_balance() {
		return $this->_previous_account_balance;
	}
	public function setPrevious_account_balance($_previous_account_balance) {
		$this->_previous_account_balance = $_previous_account_balance;
	}
        
	public function getCommitted() {
		return $this->_committed;
	}
	public function setCommitted($_committed) {
		$this->_committed = $_committed;
	}        
	
        public function getDate_delivered() {
		return $this->_date_delivered;
	}
	public function setDate_delivered($_date_delivered) {
		$this->_date_delivered = $_date_delivered;
	}   
        
        public function getCredit_provider_id() { 
            return $this->_credit_provider_id; 
        } 
	public function setCredit_provider_id($x) { 
            $this->_credit_provider_id = $x; 
        }
        
	public function getChecks_qty() {
		return $this->_checks_qty;
	}

	public function setChecks_qty($_checks_qty) {
		$this->_checks_qty = $_checks_qty;
	}

	public function getAverage_days() {
		return $this->_average_days;
	}

	public function setAverage_days($_average_days) {
		$this->_average_days = $_average_days;
	}

	public function getTotal_bruto() {
		return $this->_total_bruto;
	}

	public function setTotal_bruto($_total_bruto) {
		$this->_total_bruto = $_total_bruto;
	}

	public function getIntereses() {
		return $this->_intereses;
	}
	public function setIntereses($_intereses) {
		$this->_intereses = $_intereses;
	}
        
        public function getImpuesto_al_cheque_amt() {
		return $this->_impuesto_al_cheque_amt;
	}
	public function setImpuesto_al_cheque_amt($_impuesto_al_cheque_amt) {
		$this->_impuesto_al_cheque_amt = $_impuesto_al_cheque_amt;
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
        
        public function getGastos_general_fee() {
		return $this->_gastos_general_fee;
	}
	public function setGastos_general_fee($_gastos_general_fee) {
		$this->_gastos_general_fee = $_gastos_general_fee;
	}
        
        public function getGastos_interior_fee() {
		return $this->_gastos_interior_fee;
	}
	public function setGastos_interior_fee($_gastos_interior_fee) {
		$this->_gastos_interior_fee = $_gastos_interior_fee;
	}	

	public function getGastos_varios() {
		return $this->_gastos_varios;
	}

	public function setGastos_varios($_gastos_varios) {
		$this->_gastos_varios = $_gastos_varios;
	}

	public function getTotal_neto() {
		return $this->_total_neto;
	}

	public function setTotal_neto($_total_neto) {
		$this->_total_neto = $_total_neto;
	}
        
        public function getImpuesto_al_cheque() {
		return $this->_impuesto_al_cheque;
	}
	public function setImpuesto_al_cheque($_impuesto_al_cheque) {
		$this->_impuesto_al_cheque = $_impuesto_al_cheque;
	}
        
        public function getTasa_anual() {
		return $this->_tasa_anual;
	}
	public function setTasa_anual($_tasa_anual) {
		$this->_tasa_anual = $_tasa_anual;
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

