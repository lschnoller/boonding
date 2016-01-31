<?php

class Gyuser_Model_ChequesDataMapper {

    protected $_dbTable;
    protected $_holidays;

    public function setDbTable($dbTable) {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }

    public function getDbTable() {
        if (null === $this->_dbTable) {
            $this->setDbTable('Gyuser_Model_DbTable_Cheques');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Cheques $Cheques) {
        $data = array(
            'operation_id' => $Cheques->getOperation_id(),
            'date' => $Cheques->getDate(),
            'check_n' => $Cheques->getCheck_n(),
            'amount' => $Cheques->getAmount(),
            //'status' => $Cheques->getStatus()
        );
        if (null === ($id = $Cheques->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }
    
    //PRE: chequeId and providerData 
    //POST: cheque details
    public function saveDetails($id, Gyuser_Model_Providers $provData) {
        
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'date',
            'amount',
            'bank_account_id'
        ));
        $select->joinLeft(array('bnk' => 'bank_accounts'), 'cqu.bank_account_id = bnk.id', array('location_capital as loc'));
        $select->where('cqu.id = ?', $id);
        $row = $table->fetchRow($select);
        
        $cDetails = $this->calculateCheckDetails((float) $row['amount'], $row['date'], (int) $row['loc'], $provData);  
        
        $cheque = new Gyuser_Model_Cheques();
        $cheque->setTerceros_tasa_anual($provData->getTasa_anual());
        $cheque->setTerceros_ac_date($cDetails['acreditationDate']);
        $cheque->setTerceros_today_value($cDetails['todayValue']);
        $cheque->setTerceros_days($cDetails['days']);                        
        $cheque->setTerceros_location($cDetails['locacionCapital']);
        $cheque->setTerceros_ac_hours($cDetails['acreditationHrs']);
        $cheque->setTerceros_imp_al_cheque($cDetails['impuestoAlCheque']);
        if ($cDetails['locacionCapital'] == 1) //capital
            $cheque->setTerceros_gastos_general($cDetails['gastos']);
        elseif ($cDetails['locacionCapital'] == 2) //interior
            $cheque->setTerceros_gastos_interior($cDetails['gastos']);
        $cheque->setTerceros_descuento($cDetails['daysDiscountFee']); // ($chequeAmt * $tasaDiaria / 100) * $dateDiff;
        
        $data = array(
            'terceros_tasa_anual' => $cheque->getTerceros_tasa_anual(),
            'terceros_ac_date' => $cheque->getTerceros_ac_date(),
            'terceros_today_value' => $cheque->getTerceros_today_value(),
            'terceros_days' => $cheque->getTerceros_days(),
            'terceros_location' => $cheque->getTerceros_location(),
            'terceros_ac_hours' => $cheque->getTerceros_ac_hours(),
            'terceros_imp_al_cheque' => $cheque->getTerceros_imp_al_cheque(),
            'terceros_gastos_general' => $cheque->getTerceros_gastos_general(),
            'terceros_gastos_interior' => $cheque->getTerceros_gastos_interior(),
            'terceros_descuento' => $cheque->getTerceros_descuento(),            
        );        
        $success = $this->getDbTable()->update($data, array('id = ?' => $id));            
        if(!$success)
            throw new Exception('Cheque de tercero update failed.');
        
        $data['amount'] = (float) $row['amount'];
        return $data;
    }

    public function find($id, Gyuser_Model_Cheques $Cheques) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $Cheques->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    /*
    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'operation_id'
        ));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('lqs' => 'liquidaciones'), 'cqu.liquidacion_id = lqs.id', array('cave_id'));
        $select->joinLeft(array('ocs' => 'other_caves'), 'lqs.cave_id = ocs.id', array('id', 'name as cave_name'));
        $select->joinLeft(array('cps' => 'credit_providers'), 'cqu.credit_provider_id = cps.id', array('id as sup_id', 'name as sup_name'));
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_state_id);

            $_other_caves_obj = new Gyuser_Model_OtherCaves();
            $_other_caves_obj->setId($row->cave_id);
            $_other_caves_obj->setName($row->cave_name);
            $entry->setOther_caves_obj($_other_caves_obj);

            $_credit_provider_obj = new Gyuser_Model_SupplierOperations();
            $_credit_provider_obj->setId($row->sup_id);
            $_credit_provider_obj->setName($row->sup_name);
            $entry->setCredit_provider_obj($_credit_provider_obj);


            $entries[] = $entry;
        }
        return $entries;
    }
*/
    public function GetChequesByOpId($opId) {
        try {
            $table = $this->getDbTable();
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('cqu' => 'cheques'), array(
                'id as cheque_id',
                'date as cheque_date',
                'check_n',
                'amount',
                'local',
                'liquidacion_id',
                'status as cheque_status',
                'operation_id'
            ));
            $select->where('cqu.operation_id = ?', $opId);
            $select->where('cqu.status = 7'); //only cheques aprobados
            $select->order('cqu.id ASC');

            $resultSet = $table->fetchAll($select);
            $entries = array();
            foreach ($resultSet as $row) {
                $entry = new Gyuser_Model_Cheques();
                $entry->setId($row->cheque_id);
                $entry->setOperation_id($row->operation_id);
                $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
                $entry->setCheck_n($row->check_n);
                $entry->setAmount($row->amount);
                $entry->setStatus($row->cheque_status);

                $entries[] = $entry;
            }
            return $entries;
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function GetChequesByOpIdJson($opId) {
        try {
            $table = $this->getDbTable();
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('cqu' => 'cheques'), array(
                'id as cheque_id',
                'operation_id',
                'client_id',
                'bank_account_id',                
                'date as cheque_date',
                'check_n',
                'amount',
                'status as cheque_status',
                'terceros_tasa_anual',
                'terceros_ac_date',
                'terceros_today_value',
                'terceros_days',
                'terceros_location',
                'terceros_ac_hours',
                'terceros_imp_al_cheque',
                'terceros_gastos_general',
                'terceros_gastos_interior',
                'terceros_descuento',  
                
            ));
            $select->joinLeft(array('cls' => 'clients'), 'cqu.client_id = cls.id', array('id as client_id', 'first_name', 'last_name', 'business'));
            $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('status_list'));
            $select->where('cqu.operation_id = ?', $opId);
            $select->where('cqu.status = 7'); //only cheques aprobados
            $select->order('cqu.id ASC');

            $resultSet = $table->fetchAll($select);
            $entries = array();
            foreach ($resultSet as $row) {                
                $entry = array(
                    'cheque_id' => $row->cheque_id,
                    'operation_id' => $row->operation_id,
                    'client_id' => $row->client_id,
                    'bank_account_id' => $row->bank_account_id,
                    'date' => date("d/m/Y", strtotime($row->cheque_date)),
                    'check_n' => $row->check_n,
                    'amount' => $row->amount,
                    'cheque_status' => $row->cheque_status,
                    'status_list' => $row->status_list,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'business' => $row->business,
                    'terceros_tasa_anual' => $row->terceros_tasa_anual,
                    'terceros_ac_date' => $row->terceros_ac_date,
                    'terceros_today_value' => $row->terceros_today_value,
                    'terceros_days' => $row->terceros_days,
                    'terceros_location' => $row->terceros_location,
                    'terceros_ac_hours' => $row->terceros_ac_hours,
                    'terceros_imp_al_cheque' => $row->terceros_imp_al_cheque,
                    'terceros_gastos_general' => $row->terceros_gastos_general,
                    'terceros_gastos_interior' => $row->terceros_gastos_interior,
                    'terceros_descuento' => $row->terceros_descuento,                    
                );
                $entries[] = $entry;
            }
            return $entries;
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function GetCheques()
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'balance',
            'amount as cheque_amount',
            'liquidacion_id',
            'status as cheque_status',
        ));
        $select->joinLeft(array('cls1' => 'clients'), 'cqu.client_id = cls1.id', array('id as tercero_client_id', 'first_name as tercero_first_name', 'last_name as tercero_last_name'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('amount as operation_amount', 'type as operation_type'));        
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('id as client_id', 'first_name', 'last_name', 'business'));
        //$select->joinLeft(array('cps' => 'credit_providers'), 'cqu.credit_provider_id = cps.id', array('name as sup_name'));
        $select->joinLeft(array('cps' => 'providers'), 'cqu.provider_id = cps.id', array('name as prov_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('status_list'));
        $select->joinLeft(array('liqs' => 'liquidaciones'), 'cqu.liquidacion_id = liqs.id', array('date as liq_date'));
        $select->where('cqu.status != ?', 5);
        $select->where('cqu.status != ?', 6);
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row)
        {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setOperation_type($row->operation_type);
            $entry->setClient_id($row->client_id);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setTercero_client_id($row->tercero_client_id);
            $entry->setTercero_first_name($row->tercero_first_name);
            $entry->setTercero_last_name($row->tercero_last_name);
            $entry->setEmpresa($row->business);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->cheque_amount);
            $entry->setBalance($row->balance);
            $entry->setStatus($row->cheque_status);
            $entry->setStatus_name($row->status_list);

            if ($row->liquidacion_id) { //the check was passed to a prov
                $entry->setLiquidacion_id ($row->liquidacion_id);
                $entry->setCave_name($row->prov_name);
                $entry->setLiq_date(date("d/m/Y", strtotime($row->liq_date)));
                /*
                if($row->sup_name) //it was passed to a credit provider
                    $entry->setCave_name($row->sup_name);
                else //otherwise if name is null it means it was passed to lavalle
                    $entry->setCave_name('Lavalle');
                */
            }
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetCobranzasCheques()
    {
        /*
        SELECT cheques.id, clients.first_name, clients.last_name, operations.amount, cheques.date, cheques.check_n, cheques.amount,
          cobranzas.current_balance, cheques_status.status_list, cheques.liquidacion_id, credit_providers.name, addresses.zip_code,
          addresses.city
          FROM cheques
          left join operations on cheques.operation_id = operations.id
          left join clients on operations.client_id = clients.id
          left join cheques_status on cheques.status = cheques_status.id
          left join credit_providers on cheques.credit_provider_id = credit_providers.id
          left join addresses on clients.id = addresses.client_id
          left join cobranzas on cheques.id = cobranzas.cheque_id
          WHERE cheques.status = 3 AND (cobranzas.previous_balance <> cobranzas.paid_amount OR cobranzas.current_balance is NULL)
          GROUP BY cheques.id
          ORDER BY cheques.id

         *
         * NEW QUERY
         *
          SELECT C.id, clients.first_name, clients.last_name, operations.amount, C.date, C.check_n, C.amount,
          cobranzas.current_balance, cheques_status.status_list, C.liquidacion_id, credit_providers.name, addresses.zip_code,
          addresses.city
          FROM cheques as C
          left join operations on C.operation_id = operations.id
          left join clients on operations.client_id = clients.id
          left join cheques_status on C.status = cheques_status.id
          left join credit_providers on C.credit_provider_id = credit_providers.id
          left join addresses on clients.id = addresses.client_id
          left join cobranzas on cobranzas.cheque_id = C.id and cobranzas.current_balance = (select min(current_balance) from cobranzas where cheque_id = C.id)
          WHERE C.status = 3 AND current_balance <> 0
          GROUP BY C.id
          ORDER BY C.id
        */
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'date as cheque_date',
            'check_n',
            'amount as cheque_amount',
            'balance',
            'liquidacion_id',
            'status as cheque_status',
        ));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('amount as operation_amount'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('id as client_id', 'first_name', 'last_name', 'business'));
        //$select->joinLeft(array('cps' => 'credit_providers'), 'cqu.credit_provider_id = cps.id', array('name as sup_name'));
        $select->joinLeft(array('cps' => 'providers'), 'cqu.provider_id = cps.id', array('name as prov_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('status_list'));
        $select->joinLeft(array('add' => 'addresses'), 'cls.id = add.client_id', array('zip_code', 'city'));
        //$select->joinLeft(array('cob' => 'cobranzas'), 'cqu.id = cob.cheque_id', array('current_balance', 'paid_amount', 'previous_balance'));
        $select->joinLeft(array('cob' => 'cobranzas'), 'cqu.id = cob.cheque_id AND cob.current_balance = (select min(current_balance) from cobranzas where cheque_id = cqu.id)', array('current_balance', 'paid_amount', 'previous_balance'));
        $select->where('cqu.status = 3');
        $select->where('cqu.balance > 0.00');
        //$select->where('cob.current_balance <> 0 OR cob.current_balance IS NULL');
        $select->group('cqu.id');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row)
        {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setClient_id($row->client_id);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setEmpresa($row->business);
            $entry->setZip($row->zip_code);
            $entry->setLocalidad($row->city);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->cheque_amount);
            $entry->setBalance($row->balance);
            $entry->setStatus($row->cheque_status);
            $entry->setStatus_name($row->status_list);
            //$entry->setRejected_balance($row->current_balance);

            if ($row->liquidacion_id) { //the check was passed to a prov
                $entry->setLiquidacion_id ($row->liquidacion_id);
                $entry->setCave_name($row->prov_name);
                /*
                if($row->prov_name) //it was passed to a credit provider
                    $entry->setCave_name($row->sup_name);
                else //otherwise if name is null it means it was passed to lavalle
                    $entry->setCave_name('Lavalle');
                */
            }
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetTercerosCheques()
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'balance',
            'amount as cheque_amount',
            'liquidacion_id',
            'status as cheque_status',
            'terceros_today_value',
            'terceros_tasa_anual',
            'terceros_days'
        ));
        $select->joinLeft(array('cls1' => 'clients'), 'cqu.client_id = cls1.id', array('id as tercero_client_id', 'first_name as tercero_first_name', 'last_name as tercero_last_name'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('amount as operation_amount', 'type as operation_type'));        
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('id as client_id', 'first_name', 'last_name', 'business'));
        //$select->joinLeft(array('cps' => 'credit_providers'), 'cqu.credit_provider_id = cps.id', array('name as sup_name'));
        $select->joinLeft(array('cps' => 'providers'), 'cqu.provider_id = cps.id', array('name as prov_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('status_list'));
        $select->joinLeft(array('liqs' => 'liquidaciones'), 'cqu.liquidacion_id = liqs.id', array('date as liq_date'));
        $select->where('ops.type = ?', 2); //op with terceros
        $select->where('cqu.status != ?', 5); //5=cheque fantasma
        $select->where('cqu.status != ?', 6); //6=en proceso
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row)
        {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setOperation_type($row->operation_type);
            $entry->setClient_id($row->client_id);
            $entry->setFirst_name($row->first_name);
            $entry->setLast_name($row->last_name);
            $entry->setTercero_client_id($row->tercero_client_id);
            $entry->setTercero_first_name($row->tercero_first_name);
            $entry->setTercero_last_name($row->tercero_last_name);
            $entry->setTerceros_today_value($row->terceros_today_value);
            $entry->setTerceros_tasa_anual($row->terceros_tasa_anual);
            $entry->setTerceros_days($row->terceros_days);
            $entry->setEmpresa($row->business);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->cheque_amount);
            $entry->setBalance($row->balance);
            $entry->setStatus($row->cheque_status);
            $entry->setStatus_name($row->status_list);

            if ($row->liquidacion_id) { //the check was passed to a prov
                $entry->setLiquidacion_id ($row->liquidacion_id);
                $entry->setCave_name($row->prov_name);
                $entry->setLiq_date(date("d/m/Y", strtotime($row->liq_date)));
                /*
                if($row->sup_name) //it was passed to a credit provider
                    $entry->setCave_name($row->sup_name);
                else //otherwise if name is null it means it was passed to lavalle
                    $entry->setCave_name('Lavalle');
                */
            }
            $entries[] = $entry;
        }
        return $entries;
    }
    
    public function GetChequeDetailsByOpId($opId)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'client_id',
            'bank_account_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'rejected_check_payment',
            'balance',
            'informe_report',
            'terceros_tasa_anual',
            'terceros_ac_date',
            'terceros_today_value',
            'terceros_days',
            'terceros_location',
            'terceros_ac_hours',
            'terceros_imp_al_cheque',
            'terceros_gastos_general',
            'terceros_gastos_interior',
            'terceros_descuento',            
        ));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('clients' => 'clients'), 'cqu.client_id = clients.id', array('first_name', 'last_name', 'DNI', 'CUIL', 'business'));
        $select->joinLeft(array('bank' => 'bank_accounts'), 'cqu.bank_account_id = bank.id', array('bank_name', 'account_n', 'branch', 'zip_code', 'opening_date'));
        $select->joinLeft(array('lqs' => 'liquidaciones'), 'cqu.liquidacion_id = lqs.id', array('cave_id', 'provider_id'));
        //$select->joinLeft(array('ocs' => 'other_caves'), 'lqs.cave_id = ocs.id', array('name as cave_name'));
        $select->joinLeft(array('provs' => 'providers'), 'lqs.provider_id = provs.id', array('name as prov_name'));
        //$select->joinLeft(array('cps' => 'credit_providers'), 'lqs.credit_provider_id = cps.id', array('name as supplier_name'));
        $select->joinLeft(array('cobz' => 'cobranzas'), 'cobz.cheque_id = cqu.id', array('count(cobz.id) as cobranzas_count'));
        $select->where('cqu.operation_id = ?', $opId);
        $select->order('cqu.id ASC');
        $select->group('cqu.id');
        $resultSet = $table->fetchAll($select);

        $entries = array();
        $eofList = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'id' => $row->id,
                'client_id' => $row->client_id,
                'bank_account_id' => $row->bank_account_id,
                'first_name' => $row->first_name,
                'last_name' => $row->last_name,                
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'informe_report' => $row->informe_report,
                'status' => $row->cheque_state_id,
                'status_name' => $row->status_list,
                'local' => $row->local,
                'rejected_check_payment' => $row->rejected_check_payment,
                'balance' => $row->balance,
                'cave_name' => $row->prov_name,
                //'supplier_name' => $row->supplier_name,
                'cobranzas_count' => $row->cobranzas_count,
                'DNI' => $row->DNI,
                'CUIL' => $row->CUIL,
                'business' => $row->business,
                'bank_name' => $row->bank_name,
                'account_n' => $row->account_n,
                'branch' => $row->branch,
                'zip_code' => $row->zip_code,
                'opening_date' => date("d/m/Y", strtotime($row->opening_date)),
                'tasa_anual' => $row->terceros_tasa_anual,
                'ac_date' => $row->terceros_ac_date,
                'today_value' => $row->terceros_today_value,
                'days' => $row->terceros_days,
                'location' => $row->terceros_location,
                'imp_al_cheque' => $row->terceros_imp_al_cheque,
                'gastos_general' => $row->terceros_gastos_general,
                'gastos_interior' => $row->terceros_gastos_interior,
                'descuento' => $row->terceros_descuento,
            );
            
            if ($row->cheque_state_id == 8 || $row->cheque_state_id == 9) {
                $eofList[] = $entry;
            }
            else {
                $entries[] = $entry;
            }            
        }
        $final = array_merge($entries, $eofList);
        return $final;
    }
    
    public function GetChequeDetailsByOpId2($opId)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'date as cheque_date',
            'check_n',
            'amount',
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('id as operation_id', 'client_id'));
        $select->joinLeft(array('clients' => 'clients'), 'ops.id = clients.id', array('id as client_id', 'first_name', 'last_name', 'DNI', 'CUIL', 'business'));
        $select->where('cqu.operation_id = ?', $opId);
        $select->order('last_name ASC');
        $select->group('cqu.id');
        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'id' => $row->id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'status' => $row->cheque_state_id,
                'status_name' => $row->status_list,
                'local' => $row->local,
                'rejected_check_payment' => $row->rejected_check_payment,
                'balance' => $row->balance,
                'cave_name' => $row->prov_name,
                //'supplier_name' => $row->supplier_name,
                'cobranzas_count' => $row->cobranzas_count,
            );
            $entries[] = $entry;
        }
        return $entries;
    }

    public function fetchAllWithOperationNames() {

        $db = $this->getDbTable();
        $select = $db->select()
                ->from(array('c' => 'cheques'), array('id', 'date as cheque_date', 'check_n', 'amount', 'status', 'operation_id'))
                ->join(array('o' => 'operations'), 'p.product_id = l.product_id');
        $resultSet = $this->getDbTable()->fetchAll();
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->status);

            $entries[] = $entry;
        }
        return $entries;
    }

    public function getCheckDetails($chequeId) {

        $db = $this->getDbTable();
        $select = $db->select()
                ->setIntegrityCheck(false)
                ->from(array('c' => 'cheques'), array('id', 'date as cheque_date', 'check_n', 'amount', 'terceros_today_value', 'status', 'operation_id', 'provider_id', 'liquidacion_id', 'rejected_type'))
                ->where("c.id =	?", $chequeId);

        $row = $this->getDbTable()->fetchRow($select);
        $entry = new Gyuser_Model_Cheques();
        if ($row) {
            $entry->setId($row->id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->status);
            $entry->setProvider_id($row->provider_id);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setRejected_type($row->rejected_type);
            $entry->setTerceros_today_value($row->terceros_today_value);
        }
        return $entry;
    }
    
    public function getApprovedCheckDetails($opId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from(array('c' => 'cheques'), array(
            'id', 
            'date as cheque_date', 
            'check_n', 
            'amount', 
            'terceros_today_value', 
            'status', 
            'operation_id', 
            'provider_id', 
            'liquidacion_id', 
            'rejected_type'));
        $select->where('c.operation_id = ?', $opId);
        $select->where('c.status != ?', 8);
        $select->where('c.status != ?', 9);
        
        $resultSet = $this->getDbTable()->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();            
            $entry->setId($row->id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->status);
            $entry->setProvider_id($row->provider_id);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setRejected_type($row->rejected_type);
            $entry->setTerceros_today_value($row->terceros_today_value);
            
            $entries[] = $entry;            
        }
        
        return $entries;
    }

    public function FindWithOperationNames(Gyuser_Model_Cheques $obj) {

        $db = $this->getDbTable();
        $select = $db->select()
                ->setIntegrityCheck(false)
                ->from(array('c' => 'cheques'), array('id', 'date as cheque_date', 'check_n', 'amount', 'status', 'operation_id', 'provider_id', 'liquidacion_id', 'rejected_type'))
                ->where("c.id =	?", $obj->getId());

        $row = $this->getDbTable()->fetchRow($select);
        $entry = new Gyuser_Model_Cheques();
        if ($row) {
            $entry->setId($row->id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->status);
            $entry->setProvider_id($row->provider_id);
            //$entry->setCave_id($row->credit_provider_id);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setRejected_type($row->rejected_type);
        }
        return $entry;
    }

    public function SaveCheques(Gyuser_Model_Cheques $obj) {
        $chequesList = $obj->getCheques_list();
        //$chequesList = utf8_encode($chequesList);//html_entity_decode($chequesList);
        $chequesList = json_decode($chequesList);
        $chequesFlag = false;
        $Acreditacion_hrs = $obj->getAcreditacion_hrs();

        foreach ($chequesList as $cheque) {
            if (@$cheque->id) {
                $id = $cheque->id;
            } else {
                $id = null;
            }
            list ( $Day, $Month, $Year ) = explode('/', $cheque->date);
            $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
            $date = date("Y-m-d", $stampeddate);
            $amount = floatval($cheque->amount);
            $data = array(
                'date' => $date,
                'amount' => $amount,
                'operation_id' => $obj->getOperation_id(),
                'client_id' => $obj->getClient_id(),
                'bank_account_id' => $obj->getBank_account_id(),
                'acreditacion_hrs' => $Acreditacion_hrs,
            );

            if (isset($cheque->local)) {
                $data['local'] = $cheque->local;
                if ((int) $data['local']) {
                    $data['status'] = 6;
                } else {
                    $data['status'] = 5;
                }
            } else {
                $data['local'] = true;
                $data['status'] = 6;
            }
            if (@$cheque->check_n) {
                $data['check_n'] = $cheque->check_n;
            } else {
                unset($data['check_n']);
            }

            if (@$cheque->check_n) {
                $data['status'] = 1;
            }
            if (@$cheque->check_zip_code) {
                $data['check_zip_code'] = $cheque->check_zip_code;
            }

            if (null === $id) {
                unset($data['id']);
                $rid = $this->getDbTable()->insert($data);
                if (!$chequesFlag)
                    $chequesFlag = true;
            } else {
                $rid = $this->getDbTable()->update($data, array('id = ?' => $id));
                if (!$chequesFlag)
                    $chequesFlag = true;
            }
        }
        return $chequesFlag;
    }
    
    //PRE: opId, cheques list with consolidated cheques id
    //POST: sets all the cheques in teh list to status 1 (en cartera) and the ones in the op. 
    //      but not in the list to status 9 (anulado). Returns an array with the sum of the checks amounts and today values.
    public function consolidateCheques($chequesList) {
        $totAmount = 0;
        $totTodayValue = 0;
        //$chequesList = $obj->getCheques_list();
        //$chequesList = utf8_encode($chequesList);//html_entity_decode($chequesList);
        
        //$chequesFlag = false;
        //$Acreditacion_hrs = $obj->getAcreditacion_hrs();

        foreach ($chequesList as $cheque) {
            $data = array(
                'status' => $cheque->status
            );
            $rid = $this->getDbTable()->update($data, array('id = ?' => $cheque->cheque_id));  
            
            if($cheque->status == 1) {//selected check
                $ch = $this->getCheckDetails($cheque->cheque_id);
                $totAmount += $ch->getAmount();
                $totTodayValue += $ch->getTerceros_today_value();
            }
        }
        $opTotals = array(
            'amount' => $totAmount,
            'todayValue' => $totTodayValue
        );
        return $opTotals;
    }

    public function delete(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $where = $table->getAdapter()->quoteInto('id = ?', $obj->getId());
        $result = $table->delete($where);
        return $result;
    }

    public function deleteByOperationId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $where = $table->getAdapter()->quoteInto('operation_id = ?', $obj->getOperation_id());
        $result = $table->delete($where);
        return $result;
    }

    public function RejectCheque(Gyuser_Model_Cheques $obj) {
        $amount = (int) $this->GetAmounByChequeId($obj);
        $gastos = (int) $this->GetGastos();
        $amount = $amount + $gastos;
        $data = array(
            'liquidacion_id' => null,
            'status' => 3,
            'balance' => $amount,
            'rejected_cost' => $gastos,
        );

        $id = $this->getDbTable()->update($data, array('id = ?' => $obj->getId()));
        return $id;
    }

    public function GetRejectionCostForProv(Gyuser_Model_Cheques $cheque) {
        try {
            $rejectedCost = 'null';
            $gastos_type = $cheque->getRejected_type();
            if ($cheque->getLiquidacion_id()) { //the cheque has been passed to a provider
                $pMapper = new Gyuser_Model_ProvidersDataMapper();
                $pList = $pMapper->GetProviderById($cheque->getProvider_id()); //looks for provider id (not cave)
                if ($gastos_type == "Denuncia")
                    $rejectedCost = $pList->getGastos_denuncia();
                elseif ($gastos_type == "Sin Fondos")
                    $rejectedCost = $pList->getGastos_rechazo();
            }
            return $rejectedCost;
        } catch (Exception $e) {
            echo $e;
        }
    }

    /*
    public function GetRejectionCost(Gyuser_Model_Cheques $cheque) {
        try {
            $rejectedCost = 'null';
            $gastos_type = $cheque->getRejected_type();
            if ($cheque->getLiquidacion_id()) { //the cheque has been passed to a provider
                if ($cheque->getCave_id()) { //the cave id property checks the provider_id field on DB, if it's not null then it's from a provider.
                    $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                    $supObj = new Gyuser_Model_SupplierOperations();
                    $supObj->setId($cheque->getCave_id());
                    $supList = $supMapper->GetCaveById($supObj); //looks for provider id (not cave)
                    if ($gastos_type == "Denuncia")
                        $rejectedCost = $supList->getGastos_denuncia();
                    elseif ($gastos_type == "Sin Fondos")
                        $rejectedCost = $supList->getGastos_rechazo();
                }
                else { //it's from lavalle
                    $caveMapper = new Gyuser_Model_OtherCavesDataMapper();
                    $caves = new Gyuser_Model_OtherCaves();
                    $caves->setId('1'); //lavalle
                    $lavalle = $caveMapper->GetCaveById($caves);
                    if ($gastos_type == "Denuncia")
                        $rejectedCost = $lavalle->getGastos_denuncia();
                    elseif ($gastos_type == "Sin Fondos")
                        $rejectedCost = $lavalle->getGastos_rechazo();
                }
            }
            return $rejectedCost;
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    
    public function RejectChequeWithGastos(Gyuser_Model_Cheques $obj) {
        try {
            $chequeDetails = $this->FindWithOperationNames($obj);
            $amount = (int) $this->GetAmounByChequeId($obj);
            $gastos = (int) $obj->getRejected_gastos();
            $gastos_type = $obj->getRejected_type();
            $rejectedCostProv = 'null';

            if ($chequeDetails->getLiquidacion_id()) { //the cheque has been passed to a provider
                $provMapper = new Gyuser_Model_ProvidersDataMapper();
                $prov = $provMapper->GetProviderByIdSimple($chequeDetails->getProvider_id());
                if ($gastos_type == "Denuncia")
                        $rejectedCostProv = $prov->getGastos_denuncia();
                    elseif ($gastos_type == "Sin Fondos")
                        $rejectedCostProv = $prov->getGastos_rechazo();
                /*  
                if ($chequeDetails->getCave_id()) { //the cave id property checks the provider_id field on DB, if it's not null then it's from a provider.
                    $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                    $supObj = new Gyuser_Model_SupplierOperations();
                    $supObj->setId($chequeDetails->getCave_id());
                    $supList = $supMapper->GetCaveById($supObj); //looks for provider id (not cave)
                    if ($gastos_type == "Denuncia")
                        $rejectedCostProv = $supList->getGastos_denuncia();
                    elseif ($gastos_type == "Sin Fondos")
                        $rejectedCostProv = $supList->getGastos_rechazo();
                }
                else { //it's from lavalle
                    $caveMapper = new Gyuser_Model_OtherCavesDataMapper();
                    $caves = new Gyuser_Model_OtherCaves();
                    $caves->setId('1'); //lavalle
                    $lavalle = $caveMapper->GetCaveById($caves);
                    $x = 1;
                    if ($gastos_type == "Denuncia") {
                        $x = 1;
                        $rejectedCostProv = $lavalle->getGastos_denuncia();
                    } elseif ($gastos_type == "Sin Fondos") {
                        $rejectedCostProv = $lavalle->getGastos_rechazo();
                    }
                }
                 * 
                 */
            }
            $amount = $amount + $gastos;
            $data = array(
                'status' => 3,
                'balance' => $amount,
                'rejected_cost' => $gastos,
                'rejected_type' => $gastos_type,
                'rejected_cost_prov' => $rejectedCostProv
            );

            $success = $this->getDbTable()->update($data, array('id = ?' => $obj->getId()));
            if ($success) {
                $opId = $this->GetChequeOpId($obj->getId());
                //update op status to 11 = 'En Cobranza'
                $opMapper = new Gyuser_Model_OperationsDataMapper();
                $opMapper->setOperationEnCobranza($opId);

                $clientMapper = new Gyuser_Model_UserDataMapper();
                $clientId = $clientMapper->getClientByChequeId($obj->getId());
                if($clientId) {
                    $client = new Gyuser_Model_User();
                    $client->setId($clientId);
                    $client->setClient_type(4);
                    $clientMapper->UpdateUserType($client);
                }
                else
                    throw new Exception('The cheque status was updated to rejected but the client type could not be updated (to 4 = cobranza)');


                //$chequeDetails = $this->FindWithOperationNames($obj);
                $mapper = new Gyuser_Model_NotificationsDataMapper();
                $obj = new Gyuser_Model_Notifications();
                $obj->setTitle('Cheque rechazado');
                $Operation_id = $chequeDetails->getOperation_id();
                $check_n = $chequeDetails->getCheck_n();
                $check_date = $chequeDetails->getDate();
                $operator_id = $request->operator_id;
                $obj->setOperator_id($Operation_id);
                $obj->setComment("El cheque $check_n con fecha $check_date op.$Operation_id fue rechazado por $gastos_type");
                $obj->setAction_date(date('Y-m-d h:i:s'));
                $result = $mapper->SaveWhenRejected($obj);
            }
            else
                throw new Exception('There was an error updating the cheques table');

            return $result;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function ChequePayed(Gyuser_Model_Cheques $obj) {
        $data = array(
            'status' => 2,
            'balance' => 0,
        );
        $id = $this->getDbTable()->update($data, array('id = ?' => $obj->getId()));
        return $id;
    }

    public function GetChequeForLiquidaciones(Gyuser_Model_Cheques $obj) {
        $rejClientIds = $this->RejectedChequesClientIdsByCave($obj);
        $suplChequeCount = $caveChequeCount = array();
        if ($obj->getCave_id()) {
            $caveChequeCount = $this->ChequesCountByCaveId($obj);
        }
        $chequeFCount = 2;
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name', 'business'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->where('ops.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.liquidacion_id IS  NULL');
        $select->where('cqu.date >= ?', date("Y-m-d"));
        $select->where('cqu.status = ?', 1);
        //$select->group('cqu.id');

        foreach ($caveChequeCount as $row) {
            if ((int) $row->cheque_count > $chequeFCount) {
                $select->where('cls.id != ?', $row->client_id);
            }
        }
        foreach ($rejClientIds as $row) {
            $select->where('cls.id != ?', $row->client_id);
        }

        $select->where('cqu.local = ?', true);
        $select->order('cqu.date ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_status);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $clientObj->setBusiness($row->business);
            $entry->setClients_obj($clientObj);

            $cheques_state_obj = new Gyuser_Model_ChequesStatus();
            $cheques_state_obj->setId($row->cheque_state_id);
            $cheques_state_obj->setStatus_list($row->status_list);
            $entry->setCheques_status_obj($cheques_state_obj);

            $_bank_accounts_obj = new Gyuser_Model_BankAccounts();
            $_bank_accounts_obj->setBank_name($row->bank_name);
            $entry->setBank_accounts_obj($_bank_accounts_obj);


            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetChequeForLiquidacionesForSupplier(Gyuser_Model_Cheques $obj) {
        $rejClientIds = $this->RejectedChequesClientIdsByDayCount($obj);
        $allRejClientIds = $this->RejectedChequesClientIds();
        $rejClientIdArr = array();
        foreach ($allRejClientIds as $row) {
            $rejClientIdArr[] = $row->client_id;
        }
        $suplChequeCount = $caveChequeCount = array();

        if ($obj->getCredit_provider_id()) {
            $suplChequeCount = $this->ChequesCountBySupplierId($obj);
        }
        $chequeFCount = 2;
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name', 'zip_code', 'state'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('add' => 'addresses'), 'cls.id = add.client_id', array('city', 'country'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        //$select->where('ops.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.liquidacion_id IS  NULL');
        $select->where('cqu.date >= ?', date("Y-m-d"));
        $select->where('cqu.status = ?', 1);
        $select->group('cqu.id');

        foreach ($caveChequeCount as $row) {
            if ((int) $row->cheque_count > $chequeFCount) {
                $select->where('cls.id != ?', $row->client_id);
            }
        }
        foreach ($suplChequeCount as $row) {
            if ((int) $row->cheque_count > $chequeFCount) {
                $select->where('cls.id != ?', $row->client_id);
            }
        }
        foreach ($rejClientIds as $row) {
            $select->where('cls.id != ?', $row->client_id);
        }

        $select->where('cqu.local = ?', true);
        $select->order('cqu.date ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_status);
            $entry->setRej_cheque_client_ids($rejClientIdArr);
            $entry->setCheck_zip_code($row->zip_code);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $clientObj->setId($row->client_id);
            $entry->setClients_obj($clientObj);

            $cheques_state_obj = new Gyuser_Model_ChequesStatus();
            $cheques_state_obj->setId($row->cheque_state_id);
            $cheques_state_obj->setStatus_list($row->status_list);
            $entry->setCheques_status_obj($cheques_state_obj);

            $address_obj = new Gyuser_Model_Address();
            $address_obj->setId($row->client_id);
            $address_obj->setCity($row->city);
            $address_obj->setCountry($row->country);
            $entry->setAddress_obj($address_obj);

            $_bank_accounts_obj = new Gyuser_Model_BankAccounts();
            $_bank_accounts_obj->setBank_name($row->bank_name);
            $_bank_accounts_obj->setState($row->state);
            $entry->setBank_accounts_obj($_bank_accounts_obj);


            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetChequeOpId($id) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array('operation_id'));
        $select->where('id = ?', $id);
        $row = $table->fetchRow($select);
        return $row->operation_id;
    }

    public function GetAmounByChequeId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'amount',
        ));
        $select->where('id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        if ($row) {
            return $row->amount;
        } else {
            return null;
        }
    }

    public function getClientsWithRejectedChecks($provId) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array());
        $select->distinct();
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('cqu.provider_id = ?', $provId);
        $select->where('cqu.status = ?', 3); //rechazado
        $select->where('DATE_ADD(cqu.date,INTERVAL 60 DAY) > CURRENT_DATE'); //hace mas de 60 dias
        $select->order('ops.client_id ASC');

        $resultSet = $table->fetchAll($select);
        $rejClientIdArr = array();
        foreach ($resultSet as $row) {
            $rejClientIdArr[] = $row->client_id;
        }

        return $rejClientIdArr;
    }

    public function getClientsWithMaxPassedChecks($provId, $max) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'));
        $select->distinct();
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('cqu.provider_id = ?', $provId);
        $select->where('cqu.status = ?', 4); //pasado a proveedor
        $select->group('ops.client_id');
        $select->having("count(*) > $max");
        $select->order('ops.client_id');

        $resultSet = $table->fetchAll($select);
        $excessedClientsIdsArr = array();
        foreach ($resultSet as $row) {
            $excessedClientsIdsArr[] = $row->client_id;
        }
        return $excessedClientsIdsArr;
    }


    public function RejectedChequesClientIds(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'operation_id',
        ));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('cqu.credit_provider_id = ?', $obj->getCredit_provider_id());
        $select->where('cqu.status = ?', 3);
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function RejectedChequesClientIdsByCave(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('lqs' => 'liquidaciones'), array(
            'id',
        ));
        $select->joinInner(array('cqu' => 'cheques'), 'cqu.liquidacion_id = lqs.id', array('check_n', 'id'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('lqs.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.status = ?', 3);

        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function RejectedChequesClientIdsByDayCountAndProvId(Gyuser_Model_Cheques $obj) {
        $flowhrs = mktime(0, 0, 0, date("m"), date("d") - 60, date("Y"));
        $flowhrs = date("Y-m-d", $flowhrs);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'operation_id',
        ));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('cqu.provider_id = ?', $obj->getProvider_id());
        $select->where('cqu.status = ?', 3);
        $select->where('cqu.date > ?', $flowhrs);
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function RejectedChequesClientIdsByDayCount(Gyuser_Model_Cheques $obj) {
        $flowhrs = mktime(0, 0, 0, date("m"), date("d") - 60, date("Y"));
        $flowhrs = date("Y-m-d", $flowhrs);
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'operation_id',
        ));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id'));
        $select->where('cqu.credit_provider_id = ?', $obj->getCredit_provider_id());
        $select->where('cqu.status = ?', 3);
        $select->where('cqu.date > ?', $flowhrs);
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function ChequesCountByProvId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('lqs' => 'liquidaciones'), array(
            'id',
        ));
        $select->joinInner(array('cqu' => 'cheques'), 'cqu.liquidacion_id = lqs.id', array('check_n', 'id'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('count(client_id) as cheque_count', 'id as ops_id', 'client_id'));
        $select->where('lqs.provider_id = ?', $obj->getProvider_id());
        $select->where('lqs.status = ?', true);
        $select->group('ops.client_id');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function ChequesCountByCaveId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('lqs' => 'liquidaciones'), array(
            'id',
        ));
        $select->joinInner(array('cqu' => 'cheques'), 'cqu.liquidacion_id = lqs.id', array('check_n', 'id'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('count(client_id) as cheque_count', 'id as ops_id', 'client_id'));
        $select->where('lqs.cave_id = ?', $obj->getCave_id());
        $select->where('lqs.status = ?', true);
        $select->group('ops.client_id');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function ChequesCountBySupplierId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('lqs' => 'liquidaciones'), array(
            'id',
        ));
        $select->joinInner(array('cqu' => 'cheques'), 'cqu.liquidacion_id = lqs.id', array('check_n', 'id'));
        $select->joinInner(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('count(client_id) as cheque_count', 'id as ops_id', 'client_id'));
        $select->where('lqs.credit_provider_id = ?', $obj->getCredit_provider_id());
        $select->where('lqs.status = ?', true);
        $select->group('ops.client_id');

        $resultSet = $table->fetchAll($select);

        return $resultSet;
    }

    public function RejectedChequeByProviderId($provider_id)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'provider_id',
            'rejected_cost',
            'rejected_type'
        ));
        $select->joinLeft(array('lqs' => 'liquidaciones'), 'lqs.id = cqu.liquidacion_id');
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->where('lqs.provider_id = ?', $provider_id);
        $select->where('cqu.status = ?', 3);
        $select->where('cqu.rejected_liquidacion_id IS NULL');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_status);
            $entry->setRejected_gastos($row->rejected_cost);
            $entry->setRejected_type($row->rejected_type);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setProvider_id($row->provider_id);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $entry->setClients_obj($clientObj);

            $cheques_state_obj = new Gyuser_Model_ChequesStatus();
            $cheques_state_obj->setId($row->cheque_state_id);
            $cheques_state_obj->setStatus_list($row->status_list);
            $entry->setCheques_status_obj($cheques_state_obj);

            $_bank_accounts_obj = new Gyuser_Model_BankAccounts();
            $_bank_accounts_obj->setBank_name($row->bank_name);
            $entry->setBank_accounts_obj($_bank_accounts_obj);

            $entries[] = $entry;
        }
        return $entries;
    }

    public function RejectedChequeByCaveId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'credit_provider_id',
            'rejected_cost',
            'rejected_type'
        ));
        $select->joinLeft(array('lqs' => 'liquidaciones'), 'lqs.id = cqu.liquidacion_id');
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->where('lqs.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.liquidacion_id IS NOT NULL');
        $select->where('cqu.credit_provider_id IS NULL'); //passed to lavalle
        $select->where('cqu.rejected_liquidacion_id IS NULL');
        $select->where('cqu.status = ?', 3);
        //$select->where('cqu.local = ?', 1);
        //$select->where('cqu.date <= ?', date("Y-m-d"));
        //$select->where('cqu.liquidacion_id IS NULL');
        //$select->where('cqu.status = ?', '');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_status);
            $entry->setRejected_gastos($row->rejected_cost);
            $entry->setRejected_type($row->rejected_type);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setCave_id($row->credit_provider_id);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $entry->setClients_obj($clientObj);

            $cheques_state_obj = new Gyuser_Model_ChequesStatus();
            $cheques_state_obj->setId($row->cheque_state_id);
            $cheques_state_obj->setStatus_list($row->status_list);
            $entry->setCheques_status_obj($cheques_state_obj);

            $_bank_accounts_obj = new Gyuser_Model_BankAccounts();
            $_bank_accounts_obj->setBank_name($row->bank_name);
            $entry->setBank_accounts_obj($_bank_accounts_obj);


            $entries[] = $entry;
        }
        return $entries;
    }

    public function RejectedChequeBySupplierId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'rejected_cost',
            'rejected_type',
            'check_zip_code',
            'credit_provider_id'
        ));
        $select->joinLeft(array('lqs' => 'liquidaciones'), 'lqs.id = cqu.liquidacion_id');
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->where('cqu.credit_provider_id = ?', $obj->getCredit_provider_id());
        //$select->where('ops.liquidacion_id IS NOT NULL');
        $select->where('cqu.status = ?', 3);
        //$select->where('cqu.local = ?', 1);
        //$select->where('cqu.date <= ?', date("Y-m-d"));
        $select->where('cqu.rejected_liquidacion_id IS NULL');
        //$select->where('cqu.status = ?', '');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Cheques();
            $entry->setId($row->cheque_id);
            $entry->setOperation_id($row->operation_id);
            $entry->setDate(date("d/m/Y", strtotime($row->cheque_date)));
            $entry->setCheck_n($row->check_n);
            $entry->setAmount($row->amount);
            $entry->setStatus($row->cheque_status);
            $entry->setRejected_gastos($row->rejected_cost);
            $entry->setRejected_type($row->rejected_type);
            $entry->setCheck_zip_code($row->check_zip_code);
            $entry->setLiquidacion_id($row->liquidacion_id);
            $entry->setCredit_provider_id($row->credit_provider_id);

            $clientObj = new Gyuser_Model_User();
            $clientObj->setFirst_name($row->first_name);
            $clientObj->setLast_name($row->last_name);
            $entry->setClients_obj($clientObj);

            $cheques_state_obj = new Gyuser_Model_ChequesStatus();
            $cheques_state_obj->setId($row->cheque_state_id);
            $cheques_state_obj->setStatus_list($row->status_list);
            $entry->setCheques_status_obj($cheques_state_obj);

            $_bank_accounts_obj = new Gyuser_Model_BankAccounts();
            $_bank_accounts_obj->setBank_name($row->bank_name);
            $entry->setBank_accounts_obj($_bank_accounts_obj);

            $entries[] = $entry;
        }
        return $entries;
    }

    public function UpdateLiquidacion(Gyuser_Model_Cheques $Cheques) {
        if($Cheques->getProvider_id()) {
            $data = array(
                'liquidacion_id' => $Cheques->getLiquidacion_id(),
                'provider_id' => $Cheques->getProvider_id(),
                'status' => 4,
            );
        } elseif ($Cheques->getCave_id()) { //usable for older sections
            $data = array(
                'liquidacion_id' => $Cheques->getLiquidacion_id(),
                'credit_provider_id' => $Cheques->getCave_id(),
                'status' => 4,
            );
        }

        if ($Cheques->getAcreditacion_hrs()) {
            $data['acreditacion_hrs'] = $Cheques->getAcreditacion_hrs();
        }
        $id = $this->getDbTable()->update($data, array('id = ?' => $Cheques->getId()));
        return $id;
    }

    public function UpdateLiquidacionDeleted($liqId) {
        $data = array(
            'liquidacion_id' => null,
            'provider_id' => null,
            'credit_provider_id' => null,
            'status' => 1,
        );
        $id = $this->getDbTable()->update($data, array('liquidacion_id = ?' => $liqId, 'status = ?' => 4));

        $data = array(
            'rejected_liquidacion_id' => null,
            'rejected_cost_prov' => null
        );
        $id = $this->getDbTable()->update($data, array('rejected_liquidacion_id = ?' => $liqId, 'status = ?' => 3));
        return $id;
    }

    public function UpdateLiquidacionDeletedByCave(Gyuser_Model_Cheques $Cheques) {
        $data = array(
            'liquidacion_id' => null,
            'status' => 1,
        );
        $id = $this->getDbTable()->update($data, array('liquidacion_id = ?' => $Cheques->getLiquidacion_id(), 'status = ?' => 4));
        $data = array(
            'rejected_liquidacion_id' => null,
        );
        $id = $this->getDbTable()->update($data, array('rejected_liquidacion_id = ?' => $Cheques->getLiquidacion_id(), 'status = ?' => 3));
        return $id;
    }

    public function UpdateRejectedCheques(Gyuser_Model_Cheques $Cheques) {
        //if($Cheques->getProvider_id()) {
            $data = array(
                'rejected_liquidacion_id' => $Cheques->getRejected_liq_id(),
                //'provider_id' => $Cheques->getProvider_id(),
                'rejected_cost_prov' => $Cheques->getRejected_cost_prov()
            );
        /*} elseif($Cheques->getCredit_provider_id()) {
            $data = array(
                'rejected_liquidacion_id' => $Cheques->getLiquidacion_id(),
                'credit_provider_id' => $Cheques->getCredit_provider_id(),
                'rejected_cost_prov' => $Cheques->getRejected_cost_prov()
            );
        }*/
        $id = $this->getDbTable()->update($data, array('id = ?' => $Cheques->getId()));
        return $id;
    }

    public function GetChequeDetailsByLiquidacionIdJson($liqId, Gyuser_Model_Providers $provData, $liqDate)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'bank_account_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'acreditacion_hrs',
        ));
        $select->where('cqu.liquidacion_id = ?', $liqId);
        //$select->where('cqu.status != ?',  3);
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'cqu.bank_account_id = bas.id', array('bank_name', 'zip_code', 'location_capital'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name', 'business'));
        $select->joinLeft(array('add' => 'addresses'), 'cls.id = add.client_id', array('city', 'state', 'country'));
        $select->joinLeft(array('lqd' => 'liquidaciones'), "lqd.id = $liqId", array('date as liquidacion_date'));
        $select->order('cqu.date ASC');
        $select->group('cqu.id');

        $resultSet = $table->fetchAll($select);

        $entries = array();
        foreach ($resultSet as $row)
        {
            if(!is_null($provData)) {
                $checkDetails = $this->calculateCheckDetails((float) $row['amount'], date("d/m/Y", strtotime($row['cheque_date'])), (int) $row['location_capital'], $provData, $liqDate);

                $entry = array(
                    'id' => $row->id,
                    'date' => date("d/m/Y", strtotime($row->cheque_date)),
                    'liquidacion_date' => date("d/m/Y", strtotime($row->liquidacion_date)),
                    'check_n' => $row->check_n,
                    'amount' => $row->amount,
                    'status' => $row->cheque_state_id,
                    'status_name' => $row->status_list,
                    'local' => $row->local,
                    'bank_name' => $row->bank_name,
                    'business' => $row->business,
                    'location_capital' => $row->location_capital,
                    'check_zip_code' => $row->zip_code,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'city' => $row->city,
                    'state' => $row->state,
                    'country' => $row->country,

                    'today_value' => $checkDetails['todayValue'],
                    'days' => $checkDetails['days'],
                    'ac_date' => $checkDetails['acreditationDate'],
                    'ac_hrs' => $checkDetails['acreditationHrs'],
                    'descuento' => $checkDetails['daysDiscountFee'],
                    'imp_al_cheque' => $checkDetails['impuestoAlCheque'],
                    'gastos' => $checkDetails['gastos'],
                    'gastos_otros' => $checkDetails['gastosOtros']
                );
            }
            else {
                $entry = array(
                    'id' => $row->id,
                    'date' => date("d/m/Y", strtotime($row->cheque_date)),
                    'liquidacion_date' => date("d/m/Y", strtotime($row->liquidacion_date)),
                    'check_n' => $row->check_n,
                    'amount' => $row->amount,
                    'status' => $row->cheque_state_id,
                    'status_name' => $row->status_list,
                    'local' => $row->local,
                    'bank_name' => $row->bank_name,
                    'business' => $row->business,
                    'location_capital' => $row->location_capital,
                    'check_zip_code' => $row->zip_code,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'city' => $row->city,
                    'state' => $row->state,
                    'country' => $row->country,
                    'acreditacion_hrs' => $row->acreditacion_hrs
                );
            }
            $entries[] = $entry;
        }
        return $entries;
    }

    public function RejectedChequeByLiquidacionesIdForProv(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $Liquidacion_id = $obj->getLiquidacion_id();
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'bank_account_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'rejected_cost',
            'check_zip_code',
            'rejected_cost_prov',
            'provider_id',
            'rejected_type'
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'cqu.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('lqd' => 'liquidaciones'), "lqd.id = $Liquidacion_id", array('date as liquidacion_date'));
        $select->where('cqu.status = ?', 3);
        //$select->where('cqu.date <= ?', date("Y-m-d"));
        $select->where('cqu.rejected_liquidacion_id = ?', $Liquidacion_id);
        //$select->where('cqu.credit_provider_id IS NULL');
        //$select->where('cqu.status = ?', '');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'id' => $row->cheque_id,
                'operation_id' => $row->operation_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'liquidacion_date' => date("d/m/Y", strtotime($row->liquidacion_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'status' => $row->cheque_state_id,
                'status_name' => $row->status_list,
                'local' => $row->local,
                'bank_name' => $row->bank_name,
                'first_name' => $row->first_name,
                'last_name' => $row->last_name,
                'rejected_cost' => $row->rejected_cost,
                'check_zip_code' => $row->check_zip_code,
                'rejected_type' => $row->rejected_type,
                'provider_id' => $row->provider_id,
                'rejected_cost_prov' => $row->rejected_cost_prov,
                //'cave_id' => $row->credit_provider_id
            );
            $entries[] = $entry;
        }
        return $entries;
    }

    public function RejectedChequeByLiquidacionesId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $Liquidacion_id = $obj->getLiquidacion_id();
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'bank_account_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'rejected_cost',
            'rejected_cost_prov',
            'credit_provider_id',
            'rejected_type'
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'cqu.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('lqd' => 'liquidaciones'), "lqd.id = $Liquidacion_id", array('date as liquidacion_date'));
        $select->where('cqu.status = ?', 3);
        //$select->where('cqu.date <= ?', date("Y-m-d"));
        $select->where('cqu.rejected_liquidacion_id = ?', $Liquidacion_id);
        $select->where('cqu.credit_provider_id IS NULL');
        //$select->where('cqu.status = ?', '');
        $select->order('cqu.id ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'id' => $row->cheque_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'liquidacion_date' => date("d/m/Y", strtotime($row->liquidacion_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'status' => $row->cheque_state_id,
                'status_name' => $row->status_list,
                'local' => $row->local,
                'bank_name' => $row->bank_name,
                'first_name' => $row->first_name,
                'last_name' => $row->last_name,
                'rejected_cost' => $row->rejected_cost,
                'rejected_type' => $row->rejected_type,
                'cave_id' => $row->credit_provider_id,
                'rejected_cost_prov' => $row->rejected_cost_prov
            );
            $entries[] = $entry;
        }
        return $entries;
    }

    /*
    public function RejectedChequeBySupplierLiquidacionesId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $Liquidacion_id = $obj->getLiquidacion_id();
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
            'rejected_cost',
            'check_zip_code',
            'rejected_cost_prov',
            'credit_provider_id',
            'rejected_type'
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        $select->joinLeft(array('lqd' => 'liquidaciones'), "lqd.id = $Liquidacion_id", array('date as liquidacion_date'));
        $select->where('cqu.status = ?', 3);
        //$select->where('cqu.date <= ?', date("Y-m-d"));
        $select->where('cqu.rejected_liquidacion_id = ?', $Liquidacion_id);
        //$select->where('cqu.credit_provider_id IS NULL');
        //$select->where('cqu.status = ?', '');
        $select->order('cqu.id ASC');


        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = array(
                'id' => $row->cheque_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'liquidacion_date' => date("d/m/Y", strtotime($row->liquidacion_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'status' => $row->cheque_state_id,
                'status_name' => $row->status_list,
                'local' => $row->local,
                'bank_name' => $row->bank_name,
                'first_name' => $row->first_name,
                'last_name' => $row->last_name,
                'rejected_cost' => $row->rejected_cost,
                'check_zip_code' => $row->check_zip_code,
                'rejected_type' => $row->rejected_type,
                'credit_provider_id' => $row->credit_provider_id,
                'rejected_cost_prov' => $row->rejected_cost_prov,
                'cave_id' => $row->credit_provider_id
            );
            $entries[] = $entry;
        }
        return $entries;
    }
*/
    
    //PRE: provId, checkslist, liqDataId: the id of the liquidacion where the calc values are to be taken from
    //      if liqDataId is 0 the value are taken from today. liqDate: the date of the liquidacion
    //POST: json object with checks total values
    public function GetChequesTotalsJson($provId, $checksList, Gyuser_Model_Providers $provData, $liqDate) {
        $checkCount = 0;
        $bruto = 0;
        $totalDays = 0;
        $payingAmount = 0;
        $impCheque = 0;
        $descuento = 0;
        $gastosGeneral = 0;
        $gastosInterior = 0;
        $gastosOtros = 0;

        foreach ($checksList as $check) {
            if(isset($check->cheque_id))
                $checkId = $check->cheque_id;
            else
                $checkId = $check['id'];
            $details = $this->getCheckTotalDetailsById($checkId, $provData, $liqDate);

            //calculate totals
            $checkCount++;
            $bruto += $details['amount'];
            $totalDays += $details['days'];
            $payingAmount += $details['todayValue'];
            $impCheque += $details['impuestoAlCheque'];
            $descuento += $details['daysDiscountFee'];

            if ((int)$details['locacionCapital'])
                $gastosGeneral += $details['gastos'];
            else
                $gastosInterior += $details['gastos'];

            $gastosOtros += $details['gastosOtros'];
        }
        $dayAvg = $totalDays / $checkCount;

        $totals = array(
            'chequeChkCount' => $checkCount,
            'dayAvg' => number_format($dayAvg,2,'.',''),
            'bruto' => number_format($bruto,2,'.',''),
            'totalDays' => $totalDays,
            'payingAmount'=> number_format($payingAmount,2,'.',''),
            'impuestoAlCheque'=> number_format($impCheque,2,'.',''),
            'intereses'=> number_format($descuento,2,'.',''),
            'gastosGeneral'=> number_format($gastosGeneral,2,'.',''),
            'gastosInterior'=> number_format($gastosInterior,2,'.',''),
            'gastosOtros'=> number_format($gastosOtros,2,'.','')
        );
        return $totals;
    }

    public function GetChequeDetailsByProvIdJson($provId, $dateFilter, $liqDate)
    {
        $passingLimit = 2;//max checks that can be send to same provider.
        
        if ($liqDate) { //format for mysql
            list($d, $m, $y) = preg_split('/\//', $liqDate);
            $liqDateSQL = sprintf('%4d%02d%02d', $y, $m, $d);
        }
        else
            $liqDateSQL = date("Y-m-d"); //set as today

        $table = $this->getDbTable();
        $db = Zend_Db_Table::getDefaultAdapter();
        $dateFilterWhere = '';
        //add amount of days of checks search
        if ($dateFilter) {
            $posDate = mktime(0, 0, 0, date("m"), date("d") + $dateFilter, date("Y"));
            $posDate = date("Y-m-d", $posDate) . '';
            $dateFilterWhere = "AND cheques.date < '$posDate'";
        }

        $sql = "
    	SELECT
            clients.id as 'client_id',
            cheques.id as 'cheque_id',
            cheques.status as 'cheque_state_id',
            cheques_status.status_list,
            cheques.operation_id,
            cheques.date as 'cheque_date',
            cheques.check_n,
            cheques.amount,
            cheques.bank_account_id,
            clients.first_name,
            clients.last_name,
            clients.business,
            bank_accounts.location_capital,
            bank_accounts.zip_code
	FROM
            cheques
	INNER JOIN
            operations ON operations.id = cheques.operation_id
	INNER JOIN
            bank_accounts ON cheques.bank_account_id = bank_accounts.id
	INNER JOIN
            cheques_status ON cheques.status = cheques_status.id
	INNER JOIN
            clients ON operations.client_id = clients.id
	WHERE
            cheques.local = true
            AND
            cheques.date >= '$liqDateSQL'
            $dateFilterWhere
            AND
            cheques.status = 1
        ORDER BY
            cheques.date
    	";
        $stmt = $db->query($sql);
        $resultSet = $stmt->fetchAll();
        
        $clientRejChecksArr = $this->getClientsWithRejectedChecks($provId);
        $clientsMaxChecksArr = $this->getClientsWithMaxPassedChecks($provId, $passingLimit);

        //in this case the liq is always in not-committed status so we get the prov values from prov.
        $pMapper = new Gyuser_Model_ProvidersDataMapper();
        $provData = $pMapper->GetProviderByIdSimple($provId);

        $entries = array();
        $entries['passingLimit'] = $passingLimit;
        foreach ($resultSet as $row)
        {
            $rejChecks = false;
            if(in_array($row['client_id'],$clientRejChecksArr))
                $rejChecks = true;
            
            $maxChecks = false;
            if(in_array($row['client_id'],$clientsMaxChecksArr))
                $maxChecks = true;
            
            $checkDetails = $this->calculateCheckDetails((float) $row['amount'], date("d/m/Y", strtotime($row['cheque_date'])), (int) $row['location_capital'], $provData, $liqDate);

            $entry = array(
                'client_id' => $row['client_id'],
                'cheque_id' => $row['cheque_id'],
                'operation_id' => $row['operation_id'],
                'date' => date("d/m/Y", strtotime($row['cheque_date'])),
                'check_n' => $row['check_n'],
                'amount' => $row['amount'],
                'today_value' => $checkDetails['todayValue'],
                'cheque_status' => $row['status_list'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'cheque_state_id' => $row['cheque_state_id'],
                'status_list' => $row['status_list'],
                'business' => $row['business'],
                'location_capital' => $row['location_capital'],
                'zip_code' => $row['zip_code'],
                'days' => $checkDetails['days'],
                'ac_date' => $checkDetails['acreditationDate'],
                'ac_hrs' => $checkDetails['acreditationHrs'],
                'descuento' => $checkDetails['daysDiscountFee'],
                'imp_al_cheque' => $checkDetails['impuestoAlCheque'],
                'gastos' => $checkDetails['gastos'],
                'gastos_otros' => $checkDetails['gastosOtros'],
                'rejChecks' => $rejChecks,
                'maxChecks' => $maxChecks
            );
            if($rejChecks || $maxChecks)//client is no good
                $entries['checksNoGood'][] = $entry;
            else
                $entries['chequesEnCartera'][] = $entry;
        }
        return $entries;
    }

    /*
    //future delete
    public function GetChequeDetailsByProvIdJson2(Gyuser_Model_Cheques $obj, $dateFilter, $liqDate)
    {
        if ($liqDate) { //format for mysql
            list($d, $m, $y) = preg_split('/\//', $liqDate);
            $liqDateSQL = sprintf('%4d%02d%02d', $y, $m, $d);
        }
        else
            $liqDateSQL = date("Y-m-d"); //set as today

        $rejClientIds = $this->RejectedChequesClientIdsByDayCountAndProvId($obj);
        $allRejClientIds = $this->RejectedChequesClientIdsByProvId($obj);
        $rejClientIdArr = array();
        foreach ($allRejClientIds as $row) {
            $rejClientIdArr[] = $row->client_id;
        }
        $suplChequeCount = $caveChequeCount = array();
        if ($obj->getProvider_id()) {
            $suplChequeCount = $this->ChequesCountByProvId($obj);
        }
        $provId = $obj->getProvider_id();
        $chequeFCount = 2;
        $table = $this->getDbTable();
        $db = Zend_Db_Table::getDefaultAdapter();
        $dateFilterWhere = '';

        //add amount of days of checks search
        if ($dateFilter) {
            $posDate = mktime(0, 0, 0, date("m"), date("d") + $dateFilter, date("Y"));
            $posDate = date("Y-m-d", $posDate) . '';
            $dateFilterWhere = "AND cheques.date < '$posDate'";
        }

        $sql = "
    	SELECT
            clients.id as 'client_id',
            cheques.id as 'cheque_id',
            cheques.status as 'cheque_state_id',
            cheques_status.status_list,
            cheques.operation_id,
            cheques.date as 'cheque_date',
            cheques.check_n,
            cheques.amount,
            clients.first_name,
            clients.last_name,
            clients.business,
            bank_accounts.location_capital,
            bank_accounts.zip_code
	FROM
            cheques
	INNER JOIN
            operations ON operations.id = cheques.operation_id
	INNER JOIN
            bank_accounts ON operations.bank_account_id = bank_accounts.id
	INNER JOIN
            cheques_status ON cheques.status = cheques_status.id
	INNER JOIN
            clients ON operations.client_id = clients.id
	WHERE
            cheques.local = true
            AND
            cheques.date >= '$liqDateSQL'
            $dateFilterWhere
            AND
            cheques.status = 1
            AND
            clients.id NOT IN
                (SELECT DISTINCT clients.id FROM cheques
                INNER JOIN operations ON operations.id = cheques.operation_id
                INNER JOIN clients ON operations.client_id = clients.id
                WHERE cheques.status = 3
                AND cheques.provider_id = $provId AND DATE_ADD(cheques.date,INTERVAL 60 DAY) > CURRENT_DATE ORDER BY clients.id)
            AND
            clients.id NOT IN
                (SELECT DISTINCT
                clients.id FROM cheques
                INNER JOIN operations ON operations.id = cheques.operation_id
                INNER JOIN clients ON operations.client_id = clients.id
                WHERE cheques.status = 4
                AND cheques.provider_id = $provId GROUP BY clients.id  having count(*) > $chequeFCount ORDER BY clients.id)
        ORDER BY
            cheques.date
    	";
        $stmt = $db->query($sql);
        $resultSet = $stmt->fetchAll();

        //in this case the liq is always in not-committed status so we get the prov values from prov.
        $pMapper = new Gyuser_Model_ProvidersDataMapper();
        $provData = $pMapper->GetProviderByIdSimple($provId);

        $entries = array();
        foreach ($resultSet as $row)
        {
            $checkDetails = $this->calculateCheckDetails((float) $row['amount'], date("d/m/Y", strtotime($row['cheque_date'])), (int) $row['location_capital'], $provData, $liqDate);

            $entry = array(
                'client_id' => $row['client_id'],
                'cheque_id' => $row['cheque_id'],
                'operation_id' => $row['operation_id'],
                'date' => date("d/m/Y", strtotime($row['cheque_date'])),
                'check_n' => $row['check_n'],
                'amount' => $row['amount'],
                'today_value' => $checkDetails['todayValue'],
                'cheque_status' => $row['status_list'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'cheque_state_id' => $row['cheque_state_id'],
                'status_list' => $row['status_list'],
                'business' => $row['business'],
                'location_capital' => $row['location_capital'],
                'zip_code' => $row['zip_code'],
                'days' => $checkDetails['days'],
                'ac_date' => $checkDetails['acreditationDate'],
                'ac_hrs' => $checkDetails['acreditationHrs'],
                'descuento' => $checkDetails['daysDiscountFee'],
                'imp_al_cheque' => $checkDetails['impuestoAlCheque'],
                'gastos' => $checkDetails['gastos'],
                'gastos_otros' => $checkDetails['gastosOtros']
            );
            $entries['chequesEnCartera'][] = $entry;
        }
        if ($resultSet) {
            $entries['rejClientIdArr'] = $rejClientIdArr;
        }
        return $entries;
    }
*/
    /*
    public function GetChequeDetailsByCaveIdJson(Gyuser_Model_Cheques $obj, $dateFilter, $liqDate) {
        if ($liqDate) { //format for mysql
            list($d, $m, $y) = preg_split('/\//', $liqDate);
            $liqDate = sprintf('%4d%02d%02d', $y, $m, $d);
        }
        else
            $liqDate = date("Y-m-d"); //set as today

        $rejClientIds = $this->RejectedChequesClientIdsByCave($obj);
        $suplChequeCount = $caveChequeCount = array();
        if ($obj->getCave_id()) {
            $caveChequeCount = $this->ChequesCountByCaveId($obj);
        }
        $chequeFCount = 2;
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'status as cheque_status',
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'ops.bank_account_id = bas.id', array('bank_name', 'zip_code as bank_zip_code', 'location_capital'));
        $select->joinLeft(array('cls' => 'clients'), 'ops.client_id = cls.id', array('first_name', 'last_name', 'business'));
        $select->joinLeft(array('chqs' => 'cheques_status'), 'cqu.status = chqs.id', array('id as cheque_state_id', 'status_list'));
        //$select->where('ops.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.liquidacion_id IS  NULL');
        $select->where('cqu.date >= ?', $liqDate);
        if ($dateFilter) {
            $posDate = mktime(0, 0, 0, date("m"), date("d") + $dateFilter, date("Y"));
            $posDate = date("Y-m-d", $posDate) . '';
            $select->where('cqu.date < ?', $posDate);
        }
        $select->where('cqu.status = ?', 1);
        //$select->group('cqu.id');

        foreach ($caveChequeCount as $row) {
            if ((int) $row->cheque_count > $chequeFCount) {
                $select->where('cls.id != ?', $row->client_id);
            }
        }
        foreach ($rejClientIds as $row) {
            $select->where('cls.id != ?', $row->client_id);
        }

        $select->where('cqu.local = ?', true);
        $select->order('cqu.date ASC');

        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'cheque_id' => $row->cheque_id,
                'operation_id' => $row->operation_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'cheque_status' => $row->cheque_status,
                'first_name' => $row->first_name,
                'last_name' => $row->last_name,
                'zip_code' => $row->bank_zip_code,
                'location_capital' => $row->location_capital,
                'bank_name' => $row->bank_name,
                'cheque_state_id' => $row->cheque_state_id,
                'business' => $row->business,
                'status_list' => $row->status_list
            );
            $entries[] = $entry;
        }
        return $entries;
    }
*/
    
    /*
    public function GetChequeDetailsBySupplierIdJson(Gyuser_Model_Cheques $obj, $dateFilter, $liqDate) {
        if ($liqDate) { //format for mysql
            list($d, $m, $y) = preg_split('/\//', $liqDate);
            $liqDate = sprintf('%4d%02d%02d', $y, $m, $d);
        }
        else
            $liqDate = date("Y-m-d"); //set as today

        $rejClientIds = $this->RejectedChequesClientIdsByDayCount($obj);
        $allRejClientIds = $this->RejectedChequesClientIds($obj);
        $rejClientIdArr = array();
        foreach ($allRejClientIds as $row) {
            $rejClientIdArr[] = $row->client_id;
        }
        $suplChequeCount = $caveChequeCount = array();
        if ($obj->getCredit_provider_id()) {
            $suplChequeCount = $this->ChequesCountBySupplierId($obj);
        }
        $credit_provider_id = $obj->getCredit_provider_id();
        $chequeFCount = 2;
        $table = $this->getDbTable();
        $db = Zend_Db_Table::getDefaultAdapter();
        $dateFilterWhere = '';


        //add amount of days of checks search
        if ($dateFilter) {
            $posDate = mktime(0, 0, 0, date("m"), date("d") + $dateFilter, date("Y"));
            $posDate = date("Y-m-d", $posDate) . '';
            $dateFilterWhere = "AND cheques.date < '$posDate'";
        }

        $sql = "
    	SELECT
            clients.id as 'client_id',
            cheques.id as 'cheque_id',
            cheques.status as 'cheque_state_id',
            cheques_status.status_list,
            cheques.operation_id,
            cheques.date as 'cheque_date',
            cheques.check_n,
            cheques.amount,
            clients.first_name,
            clients.last_name,
            clients.business,
            bank_accounts.location_capital,
            bank_accounts.zip_code
	FROM
            cheques
	INNER JOIN
            operations ON operations.id = cheques.operation_id
	INNER JOIN
            bank_accounts ON operations.bank_account_id = bank_accounts.id
	INNER JOIN
            cheques_status ON cheques.status = cheques_status.id
	INNER JOIN
            clients ON operations.client_id = clients.id
	WHERE
            cheques.date >= '$liqDate'
            AND
            cheques.status = 1
            $dateFilterWhere
            AND
            clients.id NOT IN
                (SELECT DISTINCT clients.id FROM cheques
                INNER JOIN operations ON operations.id = cheques.operation_id
                INNER JOIN clients ON operations.client_id = clients.id
                WHERE cheques.status = 3
                AND cheques.credit_provider_id = $credit_provider_id AND DATE_ADD(cheques.date,INTERVAL 60 DAY) > CURRENT_DATE ORDER BY clients.id)
            AND
            clients.id NOT IN
                (SELECT DISTINCT
                clients.id FROM cheques
                INNER JOIN operations ON operations.id = cheques.operation_id
                INNER JOIN clients ON operations.client_id = clients.id
                WHERE cheques.status = 4
                AND cheques.credit_provider_id = $credit_provider_id GROUP BY clients.id  having count(*) > $chequeFCount ORDER BY clients.id)
        ORDER BY
            cheques.date
    	";
        $stmt = $db->query($sql);

        $resultSet = $stmt->fetchAll();
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = array(
                'client_id' => $row['client_id'],
                'cheque_id' => $row['cheque_id'],
                'operation_id' => $row['operation_id'],
                'date' => date("d/m/Y", strtotime($row['cheque_date'])),
                'check_n' => $row['check_n'],
                'amount' => $row['amount'],
                'cheque_status' => $row['status_list'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'cheque_state_id' => $row['cheque_state_id'],
                'status_list' => $row['status_list'],
                'business' => $row['business'],
                'location_capital' => $row['location_capital'],
                'zip_code' => $row['zip_code'],
            );
            $entries['chequesEnCartera'][] = $entry;
        }
        if ($resultSet) {
            $entries['rejClientIdArr'] = $rejClientIdArr;
        }
        return $entries;
    }
*/
    public function RejectedChequeByClinetId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $client_id = $obj->getId();
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'bank_account_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'balance',
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('id as operation_id', 'client_id', 'bank_account_id'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'cqu.bank_account_id = bas.id', array('bank_name'));
        $select->where('cqu.status = ?', 3);
        $select->where('cqu.balance != ?', 0);
        $select->where('ops.client_id = ?', $client_id);
        $select->order('cqu.id ASC');
        
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = array(
                'id' => $row->cheque_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'local' => $row->local,
                'bank_name' => $row->bank_name,
                'balance' => $row->balance,
                'operation_id' => $row->operation_id,
            );
            $entries[] = $entry;
        }
        return $entries;
    }

    public function GetGastos() {
        $Gastos = 60;
        return $Gastos;
    }

    public function UpdateRejectedChequeBalance(Gyuser_Model_Cheques $obj) {
        $data = array(
            'balance' => $obj->getBalance(),
                //'rejected_check_payment'	=> $obj->getRejected_check_payment(),
        );
        $id = $this->getDbTable()->update($data, array('id = ?' => $obj->getId()));
        return $id;
    }

    public function InsertChequeForRejectedCheque(Gyuser_Model_Cheques $obj) {        
        list ( $Day, $Month, $Year ) = explode('/', $obj->getDate());
        $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
        $date = date("Y-m-d", $stampeddate);
        
        $data = array(
            'operation_id' => $obj->getOperation_id(),
            'client_id' => $obj->getClient_id(),
            'bank_account_id' => $obj->getRejected_bank_id(),
            'date' => $date,
            'check_n' => $obj->getCheck_n(),
            'check_zip_code' => $obj->getCheck_zip_code(),
            'amount' => $obj->getAmount(),
            'status' => $obj->getStatus(),
            'rejected_check_payment' => $obj->getRejected_check_payment(),
            'rejected_bank_id' => $obj->getRejected_bank_id(),
        );
        
        $id = $this->getDbTable()->insert($data);
        if (!$id)
            throw new Exception('Error inserting cheque for rejected cheque');
        
        return $id;        
    }

    public function GestionDetialsByClinetId(Gyuser_Model_Cheques $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $client_id = $obj->getId();
        $select->from(array('cqu' => 'cheques'), array(
            'id as cheque_id',
            'operation_id',
            'date as cheque_date',
            'check_n',
            'amount',
            'local',
            'liquidacion_id',
            'balance',
            'rejected_cost',
            'bank_account_id'
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('id as operation_id', 'client_id', 'bank_account_id', 'observations'));
        $select->joinLeft(array('bas' => 'bank_accounts'), 'cqu.bank_account_id = bas.id', array('bank_name'));
        $select->where('cqu.status = ?', 3);
        $select->where('cqu.balance != ?', 0);
        $select->where('ops.client_id = ?', $client_id);
        $select->order('cqu.id ASC');


        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = array(
                'id' => $row->cheque_id,
                'date' => date("d/m/Y", strtotime($row->cheque_date)),
                'check_n' => $row->check_n,
                'amount' => $row->amount,
                'local' => $row->local,
                'bank_name' => $row->bank_name,
                'balance' => $row->balance,
                'operation_id' => $row->operation_id,
                'observations' => $row->observations,
                'rejected_gastos' => $row->rejected_cost,
            );
            $entries[] = $entry;
        }
        return $entries;
    }

    public function ChangeStatusAsPaidByTimeOverFlow() {
        //Initialize admin obj
        $adminMapper = new Gyuser_Model_AdminDataMapper();
        $adminObj = new Gyuser_Model_Admin();
        $adminObj->setId(1);
        $adminObj = $adminMapper->find($adminObj);

        $acreditation_hrs = $adminObj->getTiempo_ac_sistema();
        $acreditation_days = round($acreditation_hrs / 24);
        $current_ac_date = mktime(0, 0, 0, date("m"), date("d") - $acreditation_days, date("Y"));
        $current_ac_date = date("Y-m-d", $current_ac_date);
        $currentDate = date("d/m/Y");
        //$Tiempo_ac_capital	=	$adminObj->getTiempo_ac_capital();
        //$Tiempo_ac_interior	=	$adminObj->getTiempo_ac_interior();

        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('sls' => 'cheques'), array('id', 'client_id', 'operation_id', 'date', 'status', 'liquidacion_id', 'check_zip_code'));
        $select->joinLeft('operations','operations.id = sls.operation_id', array('client_id'));
        $select->where('sls.status = 1 OR sls.status = 4');
        $select->where('operations.client_id IS NOT NULL'); //to avoid the checks that are not attached to an operation
        $select->where('sls.date <= ?', $current_ac_date);
        $resultSet = $table->fetchAll($select);
        foreach ($resultSet as $row) {
            if ($row->operation_id == 433)
                $varTemp = true;

            $this->setChequeStatusToPaid($row->id, $row->operation_id, $row->client_id);
        }
    }
    
    public function setChequeStatusToPaid($id, $operationId, $clientId) {
        $table = $this->getDbTable();
        //$chk_date = date("d/m/Y",strtotime($row->date));
        //$acrediation_date = add_days_by_hr2($chk_date,$acreditation_hrs);
        $set = array('status' => 2);
        $where = array('id = ?' => $id);
        $result = $table->update($set, $where);

        /// check if the operation has no pending checks, if it doesn't mark the whole operation as saldada
        $opMapper = new Gyuser_Model_OperationsDataMapper();
        $operationPayed = $opMapper->checkOperationSaldada($operationId);
        if($operationPayed) {
            $id = $opMapper->setOperationSaldada($operationId);
            //if(!$id)
            //    throw new Exception('There was an error updating the operation to operacion saldada');
            $clMapper = new Gyuser_Model_UserDataMapper();
            /// check if the client has no pending operations, if it doesn't mark the client type as pasivo
            /* //client no longer wants to have automatic pasive clients, only set manually throught the client edit
            $pasiveClient = $clMapper->checkPasiveClient($clientId);
            if($pasiveClient) {
                $id = $clMapper->setPasiveClient($clientId);
                //if(!$id)
                //    throw new Exception('There was an error updating the client to pasive');
            }

             */
        }
    }
    
    public function setChequeInforme($id, $approved, $report) {
        if ($approved == '1')
            $status = 7; //informe aprobado
        elseif ($approved == '0')
            $status = 8; //informe desaprobado

        $table = $this->getDbTable();
        $set = array('status' => $status, 'informe_report' => $report);
        $where = array('id = ?' => $id);
        $result = $table->update($set, $where);
        
        return $result;
    }

    public function checkInformesCompletos($operationId) {      
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ch' => 'cheques'), array('id'));
        $select->where('ch.operation_id = ?', $operationId);        
        $select->where('ch.status = 6'); //check if there are still cheques "en proceso"
        $resultSet = $table->fetchAll($select);
        if (count($resultSet)) //more than 0 
            $informesCompletos = false;
        else
            $informesCompletos = true;
        return $informesCompletos;        
    }
    
    public function GetTotalAmountByStats(Gyuser_Model_Cheques $obj) {

        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'sum(amount) as total_amount',
        ));
        if ($obj->getProvider_id()) {
            $select->where('cqu.provider_id = ?', $obj->getProvider_id());
        }
        elseif ($obj->getCredit_provider_id()) {
            $select->where('cqu.credit_provider_id = ?', $obj->getCredit_provider_id());
        }
        $select->where('cqu.status = ?', $obj->getStatus());
        $row = $table->fetchRow($select);

        return $row->total_amount;
    }

    public function GetTotalAmountByProvider(Gyuser_Model_Cheques $obj)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('ops' => 'operations'), array('cave_id', 'liquidacion_id'));
        $select->joinLeft(array('cqu' => 'cheques'), 'cqu.operation_id = ops.id', array(
            'sum(cqu.amount) as total_amount',
        ));
        $select->where('ops.cave_id = ?', $obj->getProvider_id());
        $select->where('cqu.status = ?', $obj->getStatus());
        $row = $table->fetchRow($select);

        return $row->total_amount;
    }

    public function GetTotalAmountByCave(Gyuser_Model_Cheques $obj) {

        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);


        $select->from(array('ops' => 'operations'), array('cave_id', 'liquidacion_id'));
        $select->joinLeft(array('cqu' => 'cheques'), 'cqu.operation_id = ops.id', array(
            'sum(cqu.amount) as total_amount',
        ));
        $select->where('ops.cave_id = ?', $obj->getCave_id());
        $select->where('cqu.status = ?', $obj->getStatus());
        $row = $table->fetchRow($select);

        return $row->total_amount;
    }

    public function GetAmounByPayedCheques() {
        $query = 'SELECT SUM(amount) as sum_amount FROM cheques WHERE status = 1';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetAmounByPayedCheques0To30Days() {
        $query = 'select SUM(amount)  as sum_amount from cheques where status = 1 and date > CURRENT_DATE AND date < date_add(CURRENT_DATE, INTERVAL 30 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetAmounByPayedCheques30To60Days() {
        $query = 'select SUM(amount)  as sum_amount from cheques where status = 1 and date > date_add(CURRENT_DATE, INTERVAL 30 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 60 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetAmounByPayedCheques60To90Days() {

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 1 and date > date_add(CURRENT_DATE, INTERVAL 60 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetAmounByPayedCheques120Days() {
        $query = 'select SUM(amount)  as sum_amount  from cheques where status = 1 and date > date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetAmounByChequesStatusAcredited($date) {
        $flDatesArr = findFirstAndLastDay($date);
        $query = "select SUM(amount)  as sum_amount  from cheques where status = 2 and date > '$flDatesArr[0]' AND date < '$flDatesArr[1]'";

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        return $row[0]['sum_amount'];
    }

    public function GetChequeAmountByPrevMonths($date, $monthCount) {


        $table = $this->getDbTable();
        $result = array();
        for ($i = 0; $i < $monthCount; $i++) {
            if (!$i) {
                $flDatesArr = findFirstAndLastDay($date);
            } else {
                $flDatesArr = findPrevMonthFirstAndLastDay($date);
            }
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('chk' => 'cheques'), array('amount'));
            $select->where('chk.status =?', 2);
            $select->where('chk.date >=?', $flDatesArr[0]);
            $select->where('chk.date <=?', $flDatesArr[1]);
            $resultSet = $table->fetchAll($select);
            $amount = 0;
            if ($resultSet) {
                foreach ($resultSet as $row) {
                    $amount += $row->amount;
                }
            }
            $result[month_lang($flDatesArr[2])] = $amount;
            $date = $flDatesArr[0];
        }
        return $result;
    }

    public function GetRejectedChequesBalanceByCal() {
        //$query = 'SELECT  sum(balance) as sum_balance, sum(rejected_cost) as sum_rejected_cost FROM cheques where status = 3 and balance > rejected_cost;';
        $query = 'SELECT  SUM(balance) AS sum_balance, SUM(rejected_cost) AS sum_rejected_cost FROM cheques WHERE status = 3 AND balance > 0.00';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        //return $row[0]['sum_balance'] - $row[0]['sum_rejected_cost'];
        return $row[0]['sum_balance'];
    }

    public function GetPrecOfRejectedChequesByPassed() {
        $query = 'SELECT SUM(amount) AS sum_amount FROM cheques WHERE status = 1 OR status = 2 OR status = 4 OR status = 3'; //total checks
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $sum_arcd_amount = $row[0]['sum_amount'];

        $query = 'SELECT SUM(balance) AS sum_amount FROM cheques WHERE status = 3 AND balance > 0.00'; //rejected checks that have not yet being payed
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $sum_rej_amount = $row[0]['sum_amount'];

        $prec = $sum_rej_amount * 100 / $sum_arcd_amount;

        return number_format($prec, 2, '.', '');
    }

    public function getRejectedChequesBalance() 
    {
        $provMapper = new Gyuser_Model_ProvidersDataMapper();
        $provs = $provMapper->GetAllProviders();
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $entries = array();
        foreach($provs as $prov) {         
            $query = "SELECT SUM(amount) AS sum_amount FROM cheques WHERE status = 2 AND provider_id = {$prov->id}";
            $stmt = $db->query($query);
            $row = $stmt->fetchAll();
            $sum_arcd_amount = $row[0]['sum_amount'];

            $query = "SELECT SUM(amount) AS sum_amount FROM cheques WHERE status = 3 AND provider_id = {$prov->id}";
            $stmt = $db->query($query);
            $row = $stmt->fetchAll();
            $sum_rej_amount = $row[0]['sum_amount'];

            @$prec_1 = ($sum_rej_amount / ($sum_rej_amount + $sum_arcd_amount)) * 100;
            $data = array(
              'name' => $prov->name,
              'rej_percentage' => $prec_1  
            );
            $entries[] = $data;
        }
        return $entries;
    }
    
    /*
    public function GetRejectedChequesBalanceByCaves() {
        $query = 'select SUM(amount) as sum_amount from cheques where status = 2 and credit_provider_id = 1';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $sum_arcd_amount = $row[0]['sum_amount'];

        $query = 'select SUM(amount)  as sum_amount  from cheques where status = 3 and credit_provider_id = 1';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $sum_rej_amount = $row[0]['sum_amount'];

        @$prec_1 = ($sum_rej_amount / ($sum_rej_amount + $sum_arcd_amount)) * 100;


        $query = 'select SUM(amount)  as sum_amount  from cheques where status = 2 and credit_provider_id = 2';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $sum_arcd_amount = $row[0]['sum_amount'];

        $query = 'select SUM(amount)  as sum_amount  from cheques where status = 3 and credit_provider_id = 2';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $sum_rej_amount = $row[0]['sum_amount'];

        @$prec_2 = ($sum_rej_amount / ($sum_rej_amount + $sum_arcd_amount)) * 100;

        $query = 'SELECT  SUM(chq.amount)  as sum_amount FROM liquidaciones as liq INNER JOIN cheques chq on chq.liquidacion_id  = liq.id where liq.cave_id = 1 and chq.status = 2';
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $sum_arcd_amount = $row[0]['sum_amount'];
        $query = 'SELECT  SUM(chq.amount)  as sum_amount FROM liquidaciones as liq INNER JOIN cheques chq on chq.liquidacion_id  = liq.id where liq.cave_id = 1 and chq.status = 3';
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $sum_rej_amount = $row[0]['sum_amount'];
        @$prec_3 = ($sum_rej_amount / ($sum_rej_amount + $sum_arcd_amount)) * 100;

        $result = array(
            1 => $prec_1,
            2 => $prec_2,
            3 => $prec_3,
        );
        return $result;
    }
*/
    
    public function GetRejectedChequesBalanceByCavesAndMonths($date, $monthCount) 
    {
        $provMapper = new Gyuser_Model_ProvidersDataMapper();
        $provs = $provMapper->GetAllProviders();
        $table = $this->getDbTable();
        $providers = array();
        $provider = array();
        $months = array();
        $monthsSet = false;
        
        foreach($provs as $prov) 
        {
            $tempDate = $date;
            $prec = array();
            for ($i = 0; $i < $monthCount; $i++) {
                $flDatesArr = findPrevMonthFirstAndLastDay($tempDate);
                $select = $table->select();
                $select->setIntegrityCheck(false);
                $select->from(array('chk' => 'cheques'), array('balance', 'rejected_cost'));
                $select->where('chk.status =?', 3);
                $select->where('chk.provider_id =?', $prov->id);
                $select->where('chk.date >=?', $flDatesArr[0]);
                $select->where('chk.date <=?', $flDatesArr[1]);
                $resultSet = $table->fetchAll($select);
                $balance = 0;
                if ($resultSet) {
                    foreach ($resultSet as $row) {
                        $balance += $row->balance - $row->rejected_cost;
                    }
                }
                $prec[] = $balance;
                $tempDate = $flDatesArr[0];
                if(!$monthsSet) {
                    $months[] = month_lang($flDatesArr[2]);
                }
            }
            $provider['name'] = $prov->name;
            $provider['data'] = array_reverse($prec);
            $providers[] = $provider;
            $monthsSet = true;
        }        
        $result['provs'] = $providers;
        $result['months'] = array_reverse($months);
        return $result;
    }
    /*
    public function GetRejectedChequesBalanceByCavesAndMonths($date, $monthCount) 
    {
        $saveDate = $date;
        $table = $this->getDbTable();
        $prec_1 = array();
        for ($i = 0; $i < $monthCount; $i++) {
            $flDatesArr = findPrevMonthFirstAndLastDay($date);
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('chk' => 'cheques'), array('balance', 'rejected_cost'));
            $select->where('chk.status =?', 3);
            $select->where('chk.credit_provider_id =?', 1);
            $select->where('chk.date >=?', $flDatesArr[0]);
            $select->where('chk.date <=?', $flDatesArr[1]);
            $resultSet = $table->fetchAll($select);
            $balance = 0;
            if ($resultSet) {
                foreach ($resultSet as $row) {
                    $balance += $row->balance - $row->rejected_cost;
                }
            }

            $prec_1[month_lang($flDatesArr[2])] = $balance;
            $date = $flDatesArr[0];
        }
        $prec_2 = array();
        $date = $saveDate;
        for ($i = 0; $i < $monthCount; $i++) {
            $flDatesArr = findPrevMonthFirstAndLastDay($date);
            $select = $table->select();
            $select->setIntegrityCheck(false);
            $select->from(array('chk' => 'cheques'), array('balance', 'rejected_cost'));
            $select->where('chk.status =?', 3);
            $select->where('chk.credit_provider_id =?', 2);
            $select->where('chk.date >=?', $flDatesArr[0]);
            $select->where('chk.date <=?', $flDatesArr[1]);
            $resultSet = $table->fetchAll($select);
            $balance = 0;
            if ($resultSet) {
                foreach ($resultSet as $row) {
                    $balance += $row->balance - $row->rejected_cost;
                }
            }

            $prec_2[month_lang($flDatesArr[2])] = $balance;
            $date = $flDatesArr[0];
        }
        $prec_3 = array();
        $date = $saveDate;
        for ($i = 0; $i < $monthCount; $i++) {
            $flDatesArr = findPrevMonthFirstAndLastDay($date);
            $query = "SELECT  SUM(chq.balance)  as sum_balance ,  SUM(chq.rejected_cost)  as sum_rejected_cost FROM liquidaciones as liq
			 			INNER JOIN cheques chq on chq.liquidacion_id  = liq.id where liq.cave_id = 1 and chq.status = 3
			 			and chq.date >= '$flDatesArr[0]' and chq.date <= '$flDatesArr[1]'";
            $db = Zend_Db_Table::getDefaultAdapter();
            $stmt = $db->query($query);
            $row = $stmt->fetchAll();
            $sum_rej_amount = $row[0]['sum_balance'] - $row[0]['sum_rejected_cost'];
            $prec_3[month_lang($flDatesArr[2])] = $sum_rej_amount;
            $date = $flDatesArr[0];
        }
        $finalresult = array(
            1 => $prec_1,
            2 => $prec_2,
            3 => $prec_3,
        );
        return $finalresult;
    }
     * 
     */
/*
    public function GetAmounByPayedCheques0To30DaysByCaves() {
        $query = 'select SUM(amount) as sum_amount from cheques where status = 4 and credit_provider_id = 1 and date > CURRENT_DATE AND date < date_add(CURRENT_DATE, INTERVAL 30 DAY)';
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $result[] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount) as sum_amount from cheques where status = 4 and credit_provider_id = 2 and date > CURRENT_DATE AND date < date_add(CURRENT_DATE, INTERVAL 30 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id IS NULL and date > CURRENT_DATE AND date < date_add(CURRENT_DATE, INTERVAL 30 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[] = floatval($row[0]['sum_amount']);

        return $result;
    }

    public function GetAmounByPayedCheques30To60DaysByCaves() {
        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 1 and date > date_add(CURRENT_DATE, INTERVAL 30 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 60 DAY)';
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();

        $result[0] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 2 and date > date_add(CURRENT_DATE, INTERVAL 30 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 60 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[1] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id IS NULL and date > date_add(CURRENT_DATE, INTERVAL 30 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 60 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[2] = floatval($row[0]['sum_amount']);

        return $result;
    }

    public function GetAmounByPayedCheques60To90DaysByCaves() {
        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 1 and  date > date_add(CURRENT_DATE, INTERVAL 60 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 90 DAY)';
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[0] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 2 and  date > date_add(CURRENT_DATE, INTERVAL 60 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[1] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id IS NULL and  date > date_add(CURRENT_DATE, INTERVAL 60 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[2] = floatval($row[0]['sum_amount']);

        return $result;
    }
*/
    public function getEachAmountPassedByDates() {
        $provMapper = new Gyuser_Model_ProvidersDataMapper();
        $provs = $provMapper->GetAllProviders();
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $provNames = array();
        $amounts1 = array();
        $amounts2 = array();
        $amounts3 = array();
        $amounts4 = array();
        
        foreach($provs as $prov) {
            $query = "SELECT SUM(amount) AS sum_amount FROM cheques WHERE status = 4 AND provider_id = {$prov->id} AND date > date_add(CURRENT_DATE, INTERVAL 90 DAY)";
            $stmt = $db->query($query);
            $row1 = $stmt->fetchAll();
            
            $query = "SELECT SUM(amount)  AS sum_amount FROM cheques WHERE status = 4 AND provider_id = {$prov->id} AND date > date_add(CURRENT_DATE, INTERVAL 60 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 90 DAY)";
            $stmt = $db->query($query);
            $row2 = $stmt->fetchAll();
            
            $query = "SELECT SUM(amount)  AS sum_amount FROM cheques WHERE status = 4 AND provider_id = {$prov->id} AND date > date_add(CURRENT_DATE, INTERVAL 30 DAY) AND date < date_add(CURRENT_DATE, INTERVAL 60 DAY)";
            $stmt = $db->query($query);
            $row3 = $stmt->fetchAll();
            
            $query = "SELECT SUM(amount)  AS sum_amount FROM cheques WHERE status = 4 AND provider_id = {$prov->id} AND date > CURRENT_DATE AND date < date_add(CURRENT_DATE, INTERVAL 30 DAY)";
            $stmt = $db->query($query);
            $row4 = $stmt->fetchAll();
            
            $provNames[] = $prov->name;            
            $amounts1[] = floatval($row1[0]['sum_amount']);
            $amounts2[] = floatval($row2[0]['sum_amount']);
            $amounts3[] = floatval($row3[0]['sum_amount']);
            $amounts4[] = floatval($row4[0]['sum_amount']);
        }
        $result['names'] = $provNames;
        $result['amounts1'] = $amounts1;
        $result['amounts2'] = $amounts2;
        $result['amounts3'] = $amounts3;
        $result['amounts4'] = $amounts4;
        
        /*
        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 1 and date > date_add(CURRENT_DATE, INTERVAL 90 DAY)';
        $result = array();
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[0] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id = 2 and date > date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[1] = floatval($row[0]['sum_amount']);

        $query = 'select SUM(amount)  as sum_amount from cheques where status = 4 and credit_provider_id IS NULL and date > date_add(CURRENT_DATE, INTERVAL 90 DAY)';

        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $row = $stmt->fetchAll();
        $result[2] = floatval($row[0]['sum_amount']);
        */
        return $result;
    }


    /*
    * PRE: when liqData is null, the values of the provider are taken as they are today.
    * Otherwise, the liqData need to be specified with the provider values at the liquidacion date.
    */
    public function getCheckTotalDetailsById($id, Gyuser_Model_Providers $provData, $liqDate = null)
    {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->setIntegrityCheck(false);

        $select->from(array('cqu' => 'cheques'), array(
            'id',
            'date',
            'amount',
            'bank_account_id'
        ));
        $select->joinLeft(array('ops' => 'operations'), 'cqu.operation_id = ops.id', array('id as operation_id', 'bank_account_id'));
        $select->joinLeft(array('bnk' => 'bank_accounts'), 'cqu.bank_account_id = bnk.id', array('location_capital as loc'));
        $select->where('cqu.id = ?', $id);
        $row = $table->fetchRow($select);

        $checkDetails = $this->calculateCheckDetails((float) $row['amount'], $row['date'], (int) $row['loc'], $provData, $liqDate);
        $checkDetails['amount'] = (float) $row['amount'];

        return $checkDetails;
    }

    /*
    * La formula para calcular el valor al dia es la siguiente:
    * valor al dia = importe - impuesto_al_cheque (% de importe) - descuento (importe * tasa_anual/360 (0.17%) * cantidad de dias) - gastos - cheque menor a
    *
    * PRE: when $provData is false, the values of the provider are taken as they are today. liqDate is totally optional
    *       only to be set when the user has manually set the liq date to another date other than the current date.
    * Otherwise, the prov details are taken from the liquidacion.
    */
    public function calculateCheckDetails($chequeAmt, $chequeDate, $chequeLocation, Gyuser_Model_Providers $provData, $liqDate = null)
    {
        $tasaDiaria = 0;
        $gastosOtros = 0;
        $date_diff = '';
        
        if(is_null($liqDate))
            $liqDate = date("d/m/Y"); //today
        
        /*if(!$liqDataId) {        
            $provMapper = new Gyuser_Model_ProvidersDataMapper();
            $provDetails = $provMapper->GetProviderById($provId);

            if(is_null($liqDate))
                $liqDate = date("d/m/Y");

            $liqData = array(
                'liqDate' => $liqDate, //global var with server current date or liquidacion date (if changed from current date);
                'impuestoAlCheque' => $provDetails->getImpuesto_al_cheque(),
                'tasaAnual' => $provDetails->getTasa_anual(),
                'acCapital' => $provDetails->getAcreditacion_capital(),
                'acInterior' => $provDetails->getAcreditacion_interior(),
                'gastosGeneral' => $provDetails->getGastos_general(),
                'gastosInterior' => $provDetails->getGastos_interior(),
                'gastosChequeMenorA1' => $provDetails->getGastos_cheque_menor_a_1(),
                'gastosFeeChequeMenorA1' => $provDetails->getGastos_cheque_a_1(),
                'gastosChequeMenorA2' => $provDetails->getGastos_cheque_menor_a_2(),
                'gastosFeeChequeMenorA2' => $provDetails->getGastos_cheque_a_2(),
            );
        }
        else {
            $liqMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $liqData = $liqMapper->getLiqData($liqDataId);
        }
        */

        if($chequeLocation == 1) { //cheque is from capital
            $acredHs = $provData->getAcreditacion_capital();
            $gastosFee = $provData->getGastos_general();
        }
        elseif($chequeLocation == 2) { //cheque is from interior
            $acredHs = $provData->getAcreditacion_interior();
            if($provData->getGastos_interior())
                $gastosFee = $provData->getGastos_interior();
            else
                $gastosFee = $provData->getGastos_general();
        }

        //theres's a fee for small cheques
        if ($provData->getGastos_cheque_menor_a_1())
        {
            //make sure cheque menor a 1 is smaller than 2
            if ($provData->getGastos_cheque_menor_a_1() > $provData->getGastos_cheque_menor_a_2()) {
                $temp1 = $provData->getGastos_cheque_menor_a_1();
                $temp2 = $provData->getGastos_cheque_a_1();
                $provData->setGastos_cheque_menor_a_1($provData->getGastos_cheque_menor_a_2());
                $provData->setGastos_cheque_a_1($provData->getGastos_cheque_a_2());
                $provData->setGastos_cheque_a_2($temp1);
                $provData->setGastos_cheque_menor_a_2($temp2);
            }

            if ($chequeAmt < $provData->getGastos_cheque_menor_a_1())
                $gastosOtros = $provData->getGastos_cheque_a_1();
            elseif ($chequeAmt < $provData->getGastos_cheque_menor_a_2())
                $gastosOtros = $provData->getGastos_cheque_a_2();
        }
        $tasaDiaria = $provData->getTasa_anual() / 360;
        $impuestoAlCheque = $chequeAmt * $provData->getImpuesto_al_cheque() / 100;
        $gastos = $chequeAmt * $gastosFee / 100;
        //gralDiscounts = (chequeAmt * (impuesto_al_cheque + gastos)) / 100; //impuesto al cheuqe and gastos are percentages.
        $acredDate = $this->getAcredDate($chequeDate, $acredHs);
        $dateDiff = $this->daysBetween($liqDate, $acredDate);

        $descuento = ($chequeAmt * $tasaDiaria / 100) * $dateDiff;
        //$descuento = number_format($descuento,2,'.','');
        $todayValue = $chequeAmt - $impuestoAlCheque - $descuento - $gastos - $gastosOtros;
        //$todayValue = number_format($todayValue,2,'.','');

        $chequeDetails = array(
            'days' => $dateDiff,
            'todayValue' => $todayValue,
            'impuestoAlCheque' => $impuestoAlCheque,
            'gastos' => $gastos,
            'gastosOtros' => $gastosOtros,
            'daysDiscountFee' => $descuento,
            'acreditationHrs' => $acredHs,
            'acreditationDate' => $acredDate,
            'locacionCapital' => $chequeLocation
        );

        return $chequeDetails;
    }


    //PRE: the check acreditation date in format dd/mm/yyyyy or yyyy-mm-dd and the amount of acreditation hours
    //POST: gets the real acreditation date adding holidays, saturdays and sundays in dd/mm/yyyy format
    public function getAcredDate($checkDate, $hours)
    {
        $acDays = (int) $hours / 24;
        if (strpos($checkDate,'/') !== false) {
            $checkDateArr = explode('/', $checkDate);
            $tempDate = mktime(0, 0, 0, $checkDateArr[1], $checkDateArr[0], $checkDateArr[2]);
        }
        elseif(strpos($checkDate,'-') !== false) {
            $checkDateArr = explode('-', $checkDate);
            $tempDate = mktime(0, 0, 0, $checkDateArr[1], $checkDateArr[2], $checkDateArr[0]);
        }
        else
            throw new Exception('invalid date to find acreditation date');

        $strDate = date('d/m/Y', $tempDate);

        //$tempDate = mktime(0, 0, 0, $checkDateArr[1], (int) $checkDateArr[0], $checkDateArr[2]);
        if($acDays > 0) {
            while($this->isHoliday($tempDate)) {//advance until next business day
                $tempDate = strtotime('+1 day', $tempDate);
                $strDate = date('d/m/Y', $tempDate);
            }
            //on first business day advance for acreditation days
            for ($i=0; $i < $acDays; $i++) {
                $tempDate = strtotime('+1 day', $tempDate);
                $strDate = date('d/m/Y', $tempDate);

                if($this->isHoliday($tempDate)) //if weekend or holiday needs a unix timestamp
                    $acDays++;
            }
        }
        return $strDate;
    }

    //PRE: a date in unix timestamp format
    //POST: checks weather the date falls on a weekend or holiday (non-working day)
    public function isHoliday($dateTemp) {
        $isHoliday = false;
        if (!isset($this->_holidays)) {
            $mapper = new Gyuser_Model_HolidaysDataMapper();
            $this->_holidays = $mapper->fetchAll(); //returns all dates from db format 'Y-m-d'
        }

        $date = date('Y-m-d', $dateTemp);
        if(in_array($date, $this->_holidays) || (date('N', strtotime($date)) >= 6)) //is in holidays array or is a weekend day ( 6 & 7 = saturday and sunday respectively)
            $isHoliday = true;

        return $isHoliday;
    }

    //PRE: a start and end date in format dd/mm/yyyyy or yyyy-mm-dd
    //POST: the number of days between the two dates.
    public function daysBetween($start, $end) {
        //("2011-03-07", "2011-06-06").'days';
        if(strpos($start, '/') !== false) { //it is in dd/mm/yyyy format
            $start = explode("/", $start);
            $start_ts = strtotime($start[2] . '-' . $start[1] . '-' . $start[0]);
        }elseif(strpos($start, '-') !== false) { //it's in yyyy-mm-dd format
            $start = explode("-", $start);
            $start_ts = strtotime($start[0] . '-' . $start[1] . '-' . $start[2]);
        }
        if(strpos($end, '/') !== false) {
            $end = explode('/', $end);
            $end_ts = strtotime($end[2] . '-' . $end[1] . '-' . $end[0]);
        }elseif(strpos($end, '-') !== false) {
            $end = explode('-', $end);
            $end_ts = strtotime($end[0] . '-' . $end[1] . '-' . $end[2]);
        }
        $diff = $end_ts - $start_ts;
        return round($diff / 86400);
    }


/*
function add_days(dateOne, days) {
    // The number of milliseconds in one day
    var dateOneArr	=  dateOne.split('/');
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateOne.setDate(dateOne.getDate()+days);
    var month	=	parseInt(dateOne.getMonth())+1;
    return dateOne.getDate()+'/'+month+'/'+dateOne.getFullYear();
}



function hours_between(dateOne, dateTwo)
{
    var weekendDays = parseInt(daysBetween(dateOne, dateTwo) );
    // The number of milliseconds in one day
    //var ONE_DAY = 1000 * 60 * 60 ;
    var dateOneArr	=  dateOne.split('/');
    var dateTwoArr	=  dateTwo.split('/');

    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateTwo = new Date(dateTwoArr[2], dateTwoArr[1], dateTwoArr[0]);

    var start = dateOne,
    finish = dateTwo,
    dayMilliseconds = 1000 * 60 * 60 * 24;

    while (start <= finish) {
        var day = start.getDay();
        if (day == 0 || day == 6) {
            weekendDays--;
        }
        start = new Date(+start + dayMilliseconds);
    }
    if(weekendDays){
        weekendDays	+=	1;
        weekendDays	=	weekendDays*24;
    }else{

    }
    return weekendDays;


 }*/
    
    
    //PRE: 1. the operation id where to add the cheques to. 
    //     2. the cheques list in json format
    //POST: it adds each cheque with the appropriate client and bank account
    public function addChequesTerceros($opId, $chequesListJson) {
        try {
            //$chequesList = utf8_encode($chequesList);//html_entity_decode($chequesList);
            $chequesList = json_decode($chequesListJson);
            $chequesFlag = false;
            $adminMapper = new Gyuser_Model_AdminDataMapper();
            $adminSettings = $adminMapper->getAdminSettings();

            foreach ($chequesList as $cheque) {     
                unset($clientId);
                unset($bankId);
                unset($chequeId);
                //1. add client
                $clientMapper = new Gyuser_Model_UserDataMapper();
                $client = new Gyuser_Model_User();
                $client->setFirst_name($cheque->first_name);
                $client->setLast_name($cheque->last_name);
                $client->setDNI($cheque->DNI);
                $client->setCUIL($cheque->CUIL);

                $clientId = $clientMapper->createTerceroClient($client);          
                if(!$clientId)
                    throw Exception('Error creating cheque tercero client on DB');

                //2. add bank account
                $bankMapper = new Gyuser_Model_BankAccountsDataMapper();
                $bank = new Gyuser_Model_BankAccounts();
                $bank->setUser_id($clientId);            
                $bank->setBank_name($cheque->bank_name);
                $bank->setAccount_n($cheque->account_n);
                $bank->setBranch($cheque->branch);
                $bank->setZip_code($cheque->zip_code);
                $bank->setLocation_capital($cheque->location_capital);
                $bank->setOpening_date($cheque->account_date);

                $bankId = $bankMapper->save($bank);
                if(!$bankId)
                    throw Exception('Error inserting bank account for cheque tercero on DB');

                //3. add cheque
                list ( $Day, $Month, $Year ) = explode('/', $cheque->check_date);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $date = date("Y-m-d", $stampeddate);
                $amount = floatval($cheque->check_amount);
                if($cheque->location_capital == '1')
                    $acreditacionHrs = $adminSettings->getTiempo_ac_capital();
                else
                    $acreditacionHrs = $adminSettings->getTiempo_ac_interior();

                $data = array(
                    'operation_id' => $opId,
                    'client_id' => $clientId,
                    'bank_account_id' => $bankId,
                    'date' => $date,
                    'check_n' => $cheque->check_n,
                    'amount' => $amount,
                    'acreditacion_hrs' => $acreditacionHrs,
                    'local' => 1,
                    'status' => 6, //en proceso
                );

                $chequeId = $this->getDbTable()->insert($data);
                if(!$chequeId)
                    throw Exception('Error inserting cheque tercero on DB');
            }        

            return $opId;
        } catch(Exception $e) {
            
        }        
    }
}



