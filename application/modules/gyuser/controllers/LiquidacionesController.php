<?php

class Gyuser_LiquidacionesController extends Zend_Controller_Action {

    public function init() {
        /* Initialize action controller here */
        //mumin svn test
        $sessionNamespace = new Zend_Session_Namespace();
        if ($sessionNamespace->loginAuth == true) {
            $authDetail = $sessionNamespace->authDetail;
            $this->view->authDetail = $authDetail;
        }
    }

    public function providersAction() 
    {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) 
            {   
                $request = $this->getRequest();
                if ($this->getRequest()->isPost() || isset($request->provider_id)) 
                {                
                    $provider_id = (int) $request->provider_id;                
                    if ($provider_id) 
                    {           
                        $this->view->selectedProvider = $provider_id;
                        
                        $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                        $this->view->lqList = $cMapper->GetLiquidacionesByProvId($provider_id);

                        $opMapper = new Gyuser_Model_OperationsDataMapper();
                        $this->view->operationList = $opMapper->GetOperationsByProviderId($provider_id);

                        $provMapper = new Gyuser_Model_ProvidersDataMapper();
                        $this->view->provList = $provMapper->fetchAll();                        
                        $this->view->provDetails = $provMapper->GetProviderById($provider_id);

                        $cMapper = new Gyuser_Model_ChequesDataMapper();
                        //$cList = $cMapper->GetChequeForLiquidaciones($cObj);
                        $this->view->rejectedCheques = $cMapper->RejectedChequeByProviderId($provider_id);

                        /*
                        $provMapper = new Gyuser_Model_ProvidersDataMapper();
                        $provObj = new Gyuser_Model_Providers();
                        $provObj->setId(1);
                        $admin = $provMapper->GetProviderById($provObj);
                        */
                        
                        //$this->view->cList = $cList;
                        //$this->view->rejectedCheques = $rejectedCheques;                        
                        //$this->view->selectedProvider = $provider_id;
                        //$this->view->selectedProviderTasa = $selectedProv->getTasa_anual();
                        //$this->view->tasa = 
                        //$this->view->admin = $admin;
                        $this->view->currentDate = date('d/m/Y');                       
                        $this->view->providerFlag = true;
                        //$this->view->currentDate = date(DATE_RFC822);
                    }
                }
                $provMapper = new Gyuser_Model_ProvidersDataMapper ();
                $prov = $provMapper->fetchAll();
                $this->view->provList = $prov;
                $this->view->sharedOps = true;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    /*
    public function indexAction() {
        try {

            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {

                $request = $this->getRequest();
                if ($this->getRequest()->isPost() || isset($request->cave_id)) {
                    $cave_id = (int) $request->cave_id;
                }
                else
                    $cave_id = 1;

                $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                $lObj = new Gyuser_Model_Liquidaciones();
                $lObj->setCave_id($cave_id);
                $cList = $cMapper->GetLiquidacionesByCaveId($lObj);
                $this->view->lqList = $cList;

                $oprObj = new Gyuser_Model_Operations();
                $oprObj->setCave_id($cave_id);
                $opMapper = new Gyuser_Model_OperationsDataMapper ();
                $opList = $opMapper->GetOperationsByCaveId($oprObj);
                $this->view->operationList = $opList;

                $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
                $cObj = new Gyuser_Model_OtherCaves();
                $cObj->setId($cave_id);
                $selectedCave = $caveMapper->GetCaveById($cObj);
                $cave = $caveMapper->fetchAll();
                $this->view->cave = $cave;

                $cObj = new Gyuser_Model_Cheques();
                $cObj->setCave_id($cave_id);
                $cMapper = new Gyuser_Model_ChequesDataMapper ();
                $cList = $cMapper->GetChequeForLiquidaciones($cObj);
                $rejectedCheques = $cMapper->RejectedChequeByCaveId($cObj);

                $aMapper = new Gyuser_Model_OtherCavesDataMapper();
                $aObj = new Gyuser_Model_OtherCaves();
                $aObj->setId(1);
                $admin = $aMapper->GetCaveById($aObj);

                $this->view->cList = $cList;
                $this->view->rejectedCheques = $rejectedCheques;
                $this->view->caveFlag = true;
                $this->view->selectedCave = $cave_id;
                $this->view->selectedCaveTasa = $selectedCave->getTasa_anual();
                $this->view->tasa = 
                $this->view->admin = $admin;
                $this->view->currentDate = date('d/m/Y');
                //$this->view->currentDate = date(DATE_RFC822);

                $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
                $cave = $caveMapper->fetchAll();
                $this->view->cave = $cave;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function createliquidacionAction() 
    {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) 
            {                  
                $liqDataId = 0;
                $liqId = (int) $request->id; //if there's an empty string it defaults to 0             
                $liqDate = $request->date;                
                $variableDate = false;
                
                $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
                $liq = new Gyuser_Model_Liquidaciones();                
                $liq->setProvider_id($request->provider_id);
                $liq->setCommitted((int) $request->committed);
                
                $pMapper = new Gyuser_Model_ProvidersDataMapper();
                $prov = $pMapper->GetProviderById($liq->getProvider_id());
                $cMapper = new Gyuser_Model_ChequesDataMapper();
                $oMapper = new Gyuser_Model_OperationsDataMapper();
                
                //if liq has already been submitted then cleanup previous 
                //selected cheques, rejected cheques and operations
                if ($liqId) { 
                    $chequesList = $cMapper->UpdateLiquidacionDeleted($liqId);
                    $opertationsList = $oMapper->UpdateLiquidacionDeleted($liqId);                    
                } //$liqId is 0
                else 
                    $liqId = $lMapper->createNewLiq();                
                
                //check liq id has been created.
                if ($liqId) {     
                    $liq->setId($liqId);
                    //depending on the status of the liquidacion
                    //set the appropriate dates and/or liq data
                    if($liq->getCommitted() == 0) { //set current date and current prov values
                        list($Day, $Month, $Year) = explode('/', $liqDate);
                        $liqDate = mktime(12, 0, 0, $Month, $Day, $Year);   
                        $liqDate = date("Y-m-d", $liqDate);
                        $today = date("Y-m-d");
                        if ($liqDate != $today) {
                            $liq->setDate($liqDate);
                            $variableDate = true;
                        } else 
                            $liq->setDate($today); //even if this date won't be stored in db, we needed to calculate checks today value
                        $provData = $prov; //set the current provider values as prov data
                    }
                    elseif($liq->getCommitted() == 2) { //status is en camino. save date and prov values
                        $liqData = $lMapper->GetLiquidacionesById($liq);
                        //set date as today or as date selected by user
                        if($liqData['variable_date']) {
                            $liq->setDate($liqData['date']);
                            $variableDate = true;
                        }
                        else
                            $liq->setDate(date('Y-m-d'));  
                        
                        //set current prov values into liq for db save                        
                        $liq->setTasa_anual($prov->getTasa_anual());
                        $liq->setImpuesto_al_cheque($prov->getImpuesto_al_cheque());
                        $liq->setAcreditacion_capital($prov->getAcreditacion_capital());
                        $liq->setAcreditacion_interior($prov->getAcreditacion_interior());
                        $liq->setGastos_general($prov->getGastos_general());
                        $liq->setGastos_interior($prov->getGastos_interior());
                        $liq->setGastos_cheque_a_1($prov->getGastos_cheque_a_1());
                        $liq->setGastos_cheque_menor_a_1($prov->getGastos_cheque_menor_a_1());
                        $liq->setGastos_cheque_a_2($prov->getGastos_cheque_a_2());
                        $liq->setGastos_cheque_menor_a_2($prov->getGastos_cheque_menor_a_2());
                        $liq->setDate_delivered(date("Y-m-d"));
                        
                        $provData = $prov; //set the current provider values as prov data
                    }
                    elseif($liq->getCommitted() == 1) { //to be consolidated get the prov values stored in liq
                        $liqData = $lMapper->GetLiquidacionesById($liq);
                        //set date as date saved on step 2
                        $liq->setDate($liqData['date']);
                        $provData = $lMapper->getProvData($liqId); //set the saved prov data on liq to calculate checks values
                    }

                    /* update Liquidacion id in cheques */
                    $checksJson = json_decode($request->cheques_json);
                    $checkObj = new Gyuser_Model_Cheques();
                    $checkObj->setLiquidacion_id($liqId);
                    $checkObj->setProvider_id($liq->getProvider_id());
                    
                    foreach ($checksJson as $check) {
                        $checkObj->setId($check->cheque_id);
                        if($check->acreditacion_hrs)
                            $checkObj->setAcreditacion_hrs($check->acreditacion_hrs);
                        $cMapper->UpdateLiquidacion($checkObj);
                    }

                    /* update Liquidacion id in rejected cheques */
                    $rejected_cheques_json = json_decode($request->rejected_cheques_json);
                    $rejCheckTotal = 0;
                    foreach ($rejected_cheques_json as $check) {
                        $checkDetails = $cMapper->getCheckDetails($check->rejected_cheque_id);
                        $gastos_type = $checkDetails->getRejected_type();
                        if ($gastos_type == "Denuncia")
                            $checkDetails->setRejected_cost_prov($prov->getGastos_denuncia());
                        elseif ($gastos_type == "Sin Fondos")
                            $checkDetails->setRejected_cost_prov($prov->getGastos_rechazo());
                        //set the current liq id as the liq id where the rejected check was payed
                        $checkDetails->setRejected_liq_id($liqId);
                        //add the check total to the rej checks total
                        $rejCheckTotal += $checkDetails->getAmount() + $checkDetails->getRejected_cost_prov();
                        $cMapper->UpdateRejectedCheques($checkDetails);
                    }
                    $opsTotal = 0;
                    /* update Liquidacion id in operations */           
                    $operations_json = json_decode($request->operations_json);
                    $opDetails = new Gyuser_Model_Operations();
                    $opDetails->setLiquidacion_id($liqId);
                    $commissionRate = $prov->getComisionRate();
                    foreach ($operations_json as $operation) {
                        $opDetails->setId($operation->operation_id);
                        $oMapper->UpdateLiquidacion($opDetails);
                        $amount = (float) $oMapper->GetAmount($operation->operation_id);
                        $commissionAmt = (float) $pMapper->calculateComisionAmt($amount, $commissionRate);
                        $opsTotal += (float) $pMapper->calculateProvPayment($amount, $commissionAmt);
                    }
                    $checksTotals = $cMapper->GetChequesTotalsJson($liq->getProvider_id(), $checksJson, $provData, $liq->getDate());
                    $acreditacion = floatval($request->acreditacion);
                    $amountDebt = $rejCheckTotal + $opsTotal - $acreditacion;
                    $accountBalance = $checksTotals['payingAmount'] - $amountDebt;
                    
                    $liq->setId($liqId);                
                    $liq->setAcreditacion($acreditacion);
                    $liq->setAmount_debt($amountDebt);
                    $liq->setAmount_payed($checksTotals['payingAmount']);
                    $liq->setPrevious_account_balance($prov->getBalance());
                    $liq->setCurrent_account_balance($accountBalance);
                    
                    $liq->setChecks_qty($checksTotals['chequeChkCount']);
                    $liq->setAverage_days($checksTotals['dayAvg']);
                    $liq->setTotal_bruto($checksTotals['bruto']);
                    $liq->setImpuesto_al_cheque_amt($checksTotals['impuestoAlCheque']); //the amount for impuesto al cheque
                    $liq->setIntereses($checksTotals['intereses']); //also called descuento
                    $liq->setGastos_interior_fee($checksTotals['gastosInterior']); //the amount for interior gastos
                    $liq->setGastos_general_fee($checksTotals['gastosGeneral']); //the amount for general gastos
                    $liq->setGastos_varios($checksTotals['gastosOtros']);
                    $liq->setTotal_neto($checksTotals['payingAmount']);
                    
                    $lMapper->createLiq($liq, $variableDate);
                    
                    //update current balance
                    $prov->setBalance($accountBalance);
                    $pMapper->UpdateBalance($prov);
                }
                else 
                    throw new Exception('error inserting new liquidacion');
                
                $this->_helper->redirector('providers', 'liquidaciones', 'gyuser', array('provider_id' => $request->provider_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    
    
    /*
    public function liquidacionespaychequesAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                //collect cave info
                $cMapper = new Gyuser_Model_OtherCavesDataMapper();
                $cave = new Gyuser_Model_OtherCaves;
                $cave->setId($request->cave_id);
                $cave = $cMapper->GetCaveById($cave);
                
                $mapper = new Gyuser_Model_LiquidacionesDataMapper();
                $pdlObj = new Gyuser_Model_Liquidaciones();
                $pdlObj->setDate($request->date);
                $pdlObj->setCurrent_account_balance($request->current_account_balance);
                $pdlObj->setAmount_payed($request->amount_payed);
                $pdlObj->setPrevious_account_balance(floatval($request->previous_account_balance));
                $pdlObj->setCave_id($request->cave_id);
                $pdlObj->setCheques_json($request->cheques_json);
                $pdlObj->setOperations_json($request->operations_json);
                $pdlObj->setRejected_cheques_json($request->rejected_cheques_json);
                $pdlObj->setAcreditacion(floatval($request->acreditacion));
                                
                $pdlObj->setTasa_anual($cave->getTasa_anual());
                $pdlObj->setImpuesto_al_cheque($cave->getImpuesto_al_cheque());
                $pdlObj->setAcreditacion_capital($cave->getAcreditacion_capital());
                $pdlObj->setAcreditacion_interior($cave->getAcreditacion_interior());
                $pdlObj->setGastos_general($cave->getGastos_general());
                $pdlObj->setGastos_interior($cave->getGastos_interior());

                $mapper->payChecques($pdlObj);

                $this->_helper->redirector('index', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function consolidateAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
                $pdlObj = new Gyuser_Model_Liquidaciones();

                $liquidaciones_id = (int) $request->id;
                if ($liquidaciones_id) {
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $chequesList = $cMapper->UpdateLiquidacionDeleted($cObj);

                    $cMapper = new Gyuser_Model_OperationsDataMapper();
                    $pObj = new Gyuser_Model_Operations();
                    $pObj->setLiquidacion_id($liquidaciones_id);
                    $opertationsList = $cMapper->UpdateLiquidacionDeleted($pObj);
                }

                $pdlObj->setId($liquidaciones_id);
                $pdlObj->setDate($request->date);
                $pdlObj->setCurrent_account_balance($request->current_account_balance);
                $pdlObj->setAmount_payed($request->amount_payed);
                $pdlObj->setPrevious_account_balance(floatval($request->previous_account_balance));
                $pdlObj->setProvider_id($request->provider_id);
                $pdlObj->setCheques_json($request->cheques_json);
                $pdlObj->setOperations_json($request->operations_json);
                $pdlObj->setRejected_cheques_json($request->rejected_cheques_json);
                $pdlObj->setAcreditacion($request->acreditacion);
                $pdlObj->setTasa_anual($request->tasa_anual);
                $pdlObj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $pdlObj->setAcreditacion_capital($request->acreditacion_capital);
                $pdlObj->setAcreditacion_interior($request->acreditacion_interior);
                $pdlObj->setGastos_general($request->gastos_general);
                $pdlObj->setGastos_interior($request->gastos_interior);
                
                if ($request->committed) {
                    $pdlObj->setCommitted($request->committed);
                }

                $lMapper->consolidate($pdlObj);

                $this->_helper->redirector('index', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    /*
    //FUTURE DELETE
    public function editliquidacionespaychequesAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_LiquidacionesDataMapper();
                $pdlObj = new Gyuser_Model_Liquidaciones();

                $liquidaciones_id = (int) $request->id;
                if ($liquidaciones_id) {
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $chequesList = $cMapper->UpdateLiquidacionDeleted($cObj);

                    $cMapper = new Gyuser_Model_OperationsDataMapper();
                    $pObj = new Gyuser_Model_Operations();
                    $pObj->setLiquidacion_id($liquidaciones_id);
                    $opertationsList = $cMapper->UpdateLiquidacionDeleted($pObj);
                }

                $pdlObj->setId($liquidaciones_id);
                $pdlObj->setDate($request->date);
                $pdlObj->setCurrent_account_balance($request->current_account_balance);
                $pdlObj->setAmount_payed($request->amount_payed);
                $pdlObj->setPrevious_account_balance(floatval($request->previous_account_balance));
                $pdlObj->setCave_id($request->cave_id);
                $pdlObj->setCheques_json($request->cheques_json);
                $pdlObj->setOperations_json($request->operations_json);
                $pdlObj->setRejected_cheques_json($request->rejected_cheques_json);
                $pdlObj->setAcreditacion($request->acreditacion);
                $pdlObj->setTasa_anual($request->tasa_anual);
                $pdlObj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $pdlObj->setAcreditacion_capital($request->acreditacion_capital);
                $pdlObj->setAcreditacion_interior($request->acreditacion_interior);
                $pdlObj->setGastos_general($request->gastos_general);
                $pdlObj->setGastos_interior($request->gastos_interior);
                
                if ($request->committed) {
                    $pdlObj->setCommitted($request->committed);
                }

                $mapper->payChecques($pdlObj);

                $this->_helper->redirector('index', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function getliquidacionesdetailsforprovajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $liqId = (int) $request->liquidaciones_id;
                
                if ($liqId) {                    
                    $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
                    $lObj = new Gyuser_Model_Liquidaciones();
                    $lObj->setId($liqId);
                    $lqList = $lMapper->GetLiquidacionesById($lObj);
                    
                    $liquidacion = array(
                        'id' => $lqList['id'],
                        'date' => $lqList['date'],
                        'committed' => $lqList['committed'],                        
                        'acreditacion' => $lqList['acreditacion'],
                        'checks_qty' => $lqList['checks_qty'],
                        'average_days' => $lqList['average_days'],
                        'total_bruto' => $lqList['total_bruto'],
                        'impuesto_al_cheque_amt' => $lqList['impuesto_al_cheque_amt'],
                        'intereses' => $lqList['intereses'],
                        'gastos_interior_fee' => $lqList['gastos_interior_fee'],
                        'gastos_general_fee' => $lqList['gastos_general_fee'],                        
                        'gastos_varios' => $lqList['gastos_varios'],
                        'total_neto' => $lqList['total_neto']
                    );
                    
                    $status = $lqList['committed'];                    
                    if($status == 0) { //not committed, get provider data for today 
                        $pMapper = new Gyuser_Model_ProvidersDataMapper();
                        $provData = $pMapper->GetProviderByIdSimple($lqList['provider_id']);
                        $provDataJson = array(
                            'id' => $provData->getId(),                            
                            'tasa_anual' => $provData->getTasa_anual(),
                            'impuesto_al_cheque' => $provData->getImpuesto_al_cheque(),
                            'gastos_general' => $provData->getGastos_general(),
                            'gastos_interior' => $provData->getGastos_interior(),
                            'acreditacion_capital' => $provData->getAcreditacion_capital(),
                            'acreditacion_interior' => $provData->getAcreditacion_interior(),
                            'gastos_menor_a_monto_1' => $provData->getGastos_cheque_menor_a_1(),
                            'gastos_menor_a_1' => $provData->getGastos_cheque_a_1(),
                            'gastos_menor_a_monto_2' => $provData->getGastos_cheque_menor_a_2(),
                            'gastos_menor_a_2' => $provData->getGastos_cheque_a_2()
                        );
                    }
                    else { //if committed or en camino, get prov data stored in liquidacion at delivery time                        
                        $provDataJson = array(                            
                            'id' => $lqList['id'],                            
                            'tasa_anual' => $lqList['tasa_anual'],
                            'impuesto_al_cheque' => $lqList['impuesto_al_cheque'],
                            'gastos_general' => $lqList['gastos_general'],
                            'gastos_interior' => $lqList['gastos_interior'],
                            'acreditacion_capital' => $lqList['acreditacion_capital'],
                            'acreditacion_interior' => $lqList['acreditacion_interior'],
                            'gastos_menor_a_monto_1' => $lqList['gastos_menor_a_monto_1'],
                            'gastos_menor_a_1' => $lqList['gastos_menor_a_1'],
                            'gastos_menor_a_monto_2' => $lqList['gastos_menor_a_monto_2'],
                            'gastos_menor_a_2' => $lqList['gastos_menor_a_2']     
                        );
                        $provData = $lMapper->getProvData($liqId);
                    }
                        
                    $oMapper = new Gyuser_Model_OperationsDataMapper();
                    $oObj = new Gyuser_Model_Operations();
                    $oObj->setLiquidacion_id($liqId);
                    $opertationsList = $oMapper->GetOperationsByLiquidacionIdJson($oObj);
                    
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liqId);
                    $rejectedCheques = $cMapper->RejectedChequeByLiquidacionesIdForProv($cObj);
                    
                    if($status == 2 || $status == 1) 
                        $liqDate = $lqList['date'];
                    else //is 0 = not committed. Set date as today
                        $liqDate = date('Y-m-d');
                    $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($liqId, $provData, $liqDate);
                    
                    $result = array(
                        'provData' => $provDataJson,
                        'liquidacion' => $liquidacion,
                        'chequesList' => $chequesList,
                        'opertationsList' => $opertationsList,
                        'rejectedCheques' => $rejectedCheques,                        
                    );

                    if ($result)
                        echo json_encode($result);
                    else
                        echo 'f';                    
                }
            }

            $pMapper = new Gyuser_Model_ProvidersDataMapper();
            $this->view->provider = $pMapper->fetchAll();            
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    /*
    public function getliquidacionesdetailsajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $liquidaciones_id = (int) $request->liquidaciones_id;
                if ($liquidaciones_id) {
                    $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                    $lObj = new Gyuser_Model_Liquidaciones();
                    $lObj->setId($liquidaciones_id);
                    $lqList = $cMapper->GetLiquidacionesById($lObj);

                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);
                    $rejectedCheques = $cMapper->RejectedChequeByLiquidacionesId($cObj);

                    $cMapper = new Gyuser_Model_OperationsDataMapper();
                    $cObj = new Gyuser_Model_Operations();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $opertationsList = $cMapper->GetOperationsIdByLiquidacionIdJson($cObj);
                    
                    $result = array(
                        'liquidacion' => $lqList,
                        'chequesList' => $chequesList,
                        'opertationsList' => $opertationsList,
                        'rejectedCheques' => $rejectedCheques,                        
                    );

                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }

            $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
            $cave = $caveMapper->fetchAll();
            $this->view->cave = $cave;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function getliquidacionesdetailssupplierajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $liquidaciones_id = (int) $request->liquidaciones_id;
                if ($liquidaciones_id) {
                    $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                    $lObj = new Gyuser_Model_Liquidaciones();
                    $lObj->setId($liquidaciones_id);
                    $lqList = $cMapper->GetLiquidacionesById($lObj);

                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);
                    $rejectedCheques = $cMapper->RejectedChequeBySupplierLiquidacionesId($cObj);                    

                    $cMapper = new Gyuser_Model_OperationsDataMapper();
                    $cObj = new Gyuser_Model_Operations();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $opertationsList = $cMapper->GetOperationsIdByLiquidacionIdJson($cObj);

                    $result = array(
                        'liquidacion' => $lqList,
                        'chequesList' => $chequesList,
                        'opertationsList' => $opertationsList,
                        'rejectedCheques' => $rejectedCheques,
                    );

                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }

            $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
            $cave = $caveMapper->fetchAll();
            $this->view->cave = $cave;
        } catch (Exception $e) {
            echo $e;
        }
    }
     * 
     */


    public function deleteliquidacionesAction() {
        try {
            $request = $this->getRequest();

            $liquidaciones_id = (int) $request->liquidaciones_id;
            if ($liquidaciones_id) {
                $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
                $lObj = new Gyuser_Model_Liquidaciones();
                $lObj->setId($liquidaciones_id);
                $lList = $lMapper->GetLiquidacionesById($lObj);
                $provider_id = $lList['provider_id'];
                $pMapper = new Gyuser_Model_ProvidersDataMapper();
                $prov = new Gyuser_Model_Providers();
                $prov->setId($provider_id);
                $prov->setBalance(floatval($lList['previous_account_balance']));
                $pMapper->UpdateBalanceByReject($prov);
                
                $cMapper = new Gyuser_Model_ChequesDataMapper();
                $chequesList = $cMapper->UpdateLiquidacionDeleted($liquidaciones_id);

                $oMapper = new Gyuser_Model_OperationsDataMapper();
                $opertationsList = $oMapper->UpdateLiquidacionDeleted($liquidaciones_id);

                $cList = $lMapper->delete($lObj);
                
                if ($cList && $chequesList && $opertationsList)
                    $result = '1';
                else
                    $result = '0';
                
                $this->_helper->redirector('providers', 'liquidaciones', 'gyuser', array('provider_id' => $request->provider_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    /*
    public function deleteliquidacionessupplierAction() {
        try {
            $request = $this->getRequest();

            $liquidaciones_id = (int) $request->liquidaciones_id;
            if ($liquidaciones_id) {
                $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                $lObj = new Gyuser_Model_Liquidaciones();
                $lObj->setId($liquidaciones_id);

                $lic = $cMapper->GetLiquidacionesById($lObj);
                $Amount_payed = floatval($lic['amount_payed']);
                $Acreditacion = floatval($lic['acreditacion']);
                $reduceAmount = $Amount_payed - $Acreditacion;
                $Credit_provider_id = $lic['credit_provider_id'];


                $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                $supObj = new Gyuser_Model_SupplierOperations();
                $supObj->setId($Credit_provider_id);
                $supObj->setBalance($reduceAmount);
                $supMapper->UpdateCurrentBalance($supObj);

                $cList = $cMapper->delete($lObj);

                $cMapper = new Gyuser_Model_ChequesDataMapper();
                $cObj = new Gyuser_Model_Cheques();
                $cObj->setLiquidacion_id($liquidaciones_id);
                $chequesList = $cMapper->UpdateLiquidacionDeleted($cObj);

                /*
                  $cMapper = new Gyuser_Model_OperationsDataMapper();
                  $pObj	=	new Gyuser_Model_Operations();
                  $pObj->setLiquidacion_id($liquidaciones_id);
                  $opertationsList =	$cMapper->UpdateLiquidacionDeleted($pObj);
                 */
    /*
                if ($cList && $chequesList) {
                    $result = '1';
                } else {
                    $result = '0';
                }
                $this->_helper->redirector('supplieroperations', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    
    public function printliquidacionAction() {

        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $liqId = $request->liquidacion_id;
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->PrintLiquidacion($liqId);            
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function generatepdfforliquidacionesAction() {

        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $liqId = $request->liquidacion_id;
            $status = (int) $request->status;
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreatePDFforLiquidaciones($status, $liqId);
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function sendmailofliquidacionesexcelAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $liqId = $request->liquidacion_id;
            $status = (int) $request->status;
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $result = $pdf->SendExcelByMail($status, $liqId);
            //$pdf->CreateAndSendMailExcelforLiquidaciones($obj, $status, $liquidacion_id);
            echo $result;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function generateexcelforliquidacionesAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();

            $request = $this->getRequest();
            $liqId = $request->liquidacion_id;
            $status = (int) $request->status;
            
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreateExcelforLiquidaciones($status, $liqId);
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function generateexcelforsupplierliquidacionesAction() {

        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();

            $request = $this->getRequest();
            $liquidacion_id = $request->liquidacion_id;
            $status = (int) $request->status;
            $obj = new Gyuser_Model_Liquidaciones();
            $obj->setId($liquidacion_id);
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreateExcelforSupplierLiquidaciones($obj, $status, $liquidacion_id);
        } catch (Exception $e) {
            echo $e;
        }
    }

    //this ajax function is only called before submitting liquidacion
    //so it uses current date and current prov values for calculating checks today value
    public function getchequestotalsajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $provId = (int) $request->provId;
                $checksList = json_decode($request->checks);
                
                if ($provId) {                    
                    $pMapper = new Gyuser_Model_ProvidersDataMapper();                    
                    $provData = $pMapper->GetProviderByIdSimple($provId);
                    $liqDate = date('Y-m-d');
                    $cMapper = new Gyuser_Model_ChequesDataMapper ();
                    $result = $cMapper->GetChequesTotalsJson($provId, $checksList, $provData, $liqDate);

                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function getchequesbyprovidfilterajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $provId = (int) $request->prov_id;
                $pos = (int) $request->pos;
                $liqDate = $request->liqDate;
                if ($provId) {
                    $cMapper = new Gyuser_Model_ChequesDataMapper ();
                    $result = $cMapper->GetChequeDetailsByProvIdJson($provId, $pos, $liqDate);
                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function getchequesbycaveidfilterajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $cave_id = (int) $request->cave_id;
                $pos = (int) $request->pos;
                $liqDate = $request->liqDate;
                if ($cave_id) {
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setCave_id($cave_id);
                    $cMapper = new Gyuser_Model_ChequesDataMapper ();
                    $result = $cMapper->GetChequeDetailsByCaveIdJson($cObj, $pos, $liqDate);

                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    /*
    public function getchequesbysupplieridfilterajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $cave_id = (int) $request->cave_id;
                $pos = (int) $request->pos;
                $liqDate = $request->liqDate;
                if ($cave_id) {
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setCredit_provider_id($cave_id);
                    $cMapper = new Gyuser_Model_ChequesDataMapper ();
                    $result = $cMapper->GetChequeDetailsBySupplierIdJson($cObj, $pos, $liqDate);

                    if ($result) {
                        echo json_encode($result);
                    } else {
                        echo 'f';
                    }
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
     * 
     */
/*
    public function supplieroperationsAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {


                $request = $this->getRequest();
                if ($this->getRequest()->isPost() || isset($request->cave_id)) {

                    $cave_id = (int) $request->cave_id;
                    if ($cave_id) {
                        $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
                        $lObj = new Gyuser_Model_Liquidaciones();
                        $lObj->setCredit_provider_id($cave_id);
                        $cList = $cMapper->GetLiquidacionesBySupplierId($lObj);
                        $this->view->lqList = $cList;

                        $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                        $supObj = new Gyuser_Model_SupplierOperations();
                        $supObj->setId($cave_id);
                        $supList = $supMapper->GetCaveById($supObj);
                        $this->view->supList = $supList;

                        /*$oprObj = new Gyuser_Model_Operations();
                        $oprObj->setCave_id($cave_id);
                        $opMapper = new Gyuser_Model_OperationsDataMapper ();
                        $opList = $opMapper->GetOperationsByCaveId($oprObj);
                        $this->view->operationList = null; //$opList;
                        */
    /*
    
                        $caveMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                        $cave = $caveMapper->fetchAll();
                        $this->view->cave = $cave;

                        $cObj = new Gyuser_Model_Cheques();
                        $cObj->setCredit_provider_id($cave_id);
                        $cMapper = new Gyuser_Model_ChequesDataMapper ();
                        //$cList = $cMapper->GetChequeForLiquidacionesForSupplier($cObj);
                        $cList = null;
                        $rejectedCheques = $cMapper->RejectedChequeBySupplierId($cObj);
                        
                        $this->view->cList = $cList;
                        $this->view->rejectedCheques = $rejectedCheques;
                        $this->view->caveFlag = true;
                        $this->view->selectedCave = $cave_id;
                        $this->view->currentDate = date('d/m/Y');
                    }
                }

                $caveMapper = new Gyuser_Model_SupplierOperationsDataMapper ();
                $cave = $caveMapper->fetchAll();
                $this->view->cave = $cave;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    */
    
    /*
    public function liquidacionespaysupplierchequesAction() 
    {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) 
            {
                //collect prov info and update current balance
                $cMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                $prov = new Gyuser_Model_SupplierOperations();
                $prov->setId($request->cave_id);
                $prov = $cMapper->GetCaveById($prov);
                $prov->setBalance($request->current_account_balance);
                $cMapper->UpdateBalance($prov);
                
                $mapper = new Gyuser_Model_LiquidacionesDataMapper();
                $pdlObj = new Gyuser_Model_Liquidaciones();

                $pdlObj->setDate($request->date);
                $pdlObj->setCurrent_account_balance($request->current_account_balance);
                $pdlObj->setAmount_payed($request->amount_payed);
                $pdlObj->setPrevious_account_balance(floatval($request->previous_account_balance));
                $pdlObj->setCredit_provider_id($request->cave_id);
                $pdlObj->setCheques_json($request->cheques_json);
                $pdlObj->setOperations_json($request->operations_json);
                $pdlObj->setRejected_cheques_json($request->rejected_cheques_json);
                $pdlObj->setAcreditacion(floatval($request->acreditacion));

                $pdlObj->setChecks_qty($request->checks_qty);
                $pdlObj->setAverage_days($request->average_days);
                $pdlObj->setTotal_bruto($request->total_bruto);
                $pdlObj->setImpuesto_al_cheque_amt($request->impuesto_al_cheque_amt); //the amount for impuesto al cheque
                $pdlObj->setIntereses($request->intereses);
                $pdlObj->setGastos_interior_fee($request->gastos_interior); //the amount for interior gastos
                $pdlObj->setGastos_general_fee($request->gastos_general); //the amount for general gastos
                $pdlObj->setGastos_varios($request->gastos_varios);
                $pdlObj->setTotal_neto($request->total_neto);
                
                $pdlObj->setTasa_anual($prov->getTasa_anual());
                $pdlObj->setImpuesto_al_cheque($prov->getImpuesto_al_cheque());
                $pdlObj->setAcreditacion_capital($prov->getAcreditacion_capital());
                $pdlObj->setAcreditacion_interior($prov->getAcreditacion_interior());
                $pdlObj->setGastos_general($prov->getGastos_general());
                $pdlObj->setGastos_interior($prov->getGastos_interior());

                $mapper->payChequesForSupplier($pdlObj);

                $this->_helper->redirector('supplieroperations', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    /*
    public function editliquidacionespaychequessupplierAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) 
            {
                $mapper = new Gyuser_Model_LiquidacionesDataMapper();
                $pdlObj = new Gyuser_Model_Liquidaciones();
                $liquidaciones_id = (int) $request->id;
                
                if ($liquidaciones_id) {
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setLiquidacion_id($liquidaciones_id);
                    $chequesList = $cMapper->UpdateLiquidacionDeleted($cObj);

                    $cMapper = new Gyuser_Model_OperationsDataMapper();
                    $pObj = new Gyuser_Model_Operations();
                    $pObj->setLiquidacion_id($liquidaciones_id);
                    $opertationsList = $cMapper->UpdateLiquidacionDeleted($pObj);
                }
                
                //collect cave info and update current balance
                $cMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                $prov = new Gyuser_Model_SupplierOperations();
                $prov->setId($request->cave_id);
                $prov = $cMapper->GetCaveById($prov);
                $prov->setBalance($request->current_account_balance);
                $cMapper->UpdateBalance($prov);
                
                $pdlObj->setId($liquidaciones_id);
                $pdlObj->setDate($request->date);
                $pdlObj->setCurrent_account_balance($request->current_account_balance);
                $pdlObj->setAmount_payed($request->amount_payed);
                $pdlObj->setPrevious_account_balance(floatval($request->previous_account_balance));
                $pdlObj->setCredit_provider_id($request->cave_id);
                $pdlObj->setCheques_json($request->cheques_json);
                $pdlObj->setOperations_json($request->operations_json);
                $pdlObj->setRejected_cheques_json($request->rejected_cheques_json);
                $pdlObj->setAcreditacion(floatval($request->acreditacion));

                $pdlObj->setChecks_qty($request->checks_qty);
                $pdlObj->setAverage_days($request->average_days);
                $pdlObj->setTotal_bruto($request->total_bruto);
                $pdlObj->setImpuesto_al_cheque_amt($request->impuesto_al_cheque_amt); //the amount for impuesto al cheque
                $pdlObj->setIntereses($request->intereses);
                $pdlObj->setGastos_interior_fee($request->gastos_interior); //the amount for interior gastos
                $pdlObj->setGastos_general_fee($request->gastos_general); //the amount for general gastos
                $pdlObj->setGastos_varios($request->gastos_varios);
                $pdlObj->setTotal_neto($request->total_neto);
                
                $pdlObj->setTasa_anual($prov->getTasa_anual());
                $pdlObj->setImpuesto_al_cheque($prov->getImpuesto_al_cheque());
                $pdlObj->setAcreditacion_capital($prov->getAcreditacion_capital());
                $pdlObj->setAcreditacion_interior($prov->getAcreditacion_interior());
                $pdlObj->setGastos_general($prov->getGastos_general());
                $pdlObj->setGastos_interior($prov->getGastos_interior());
                
                if ($request->committed)
                    $pdlObj->setCommitted($request->committed);
                
                $mapper->payChequesForSupplier($pdlObj);

                $this->_helper->redirector('supplieroperations', 'liquidaciones', 'gyuser', array('cave_id' => $request->cave_id));
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    /*
    public function generatepdfforsupplierliquidacionesAction() {

        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $liquidacion_id = $request->liquidacion_id;
            $status = (int) $request->status;
            $obj = new Gyuser_Model_Liquidaciones();
            $obj->setId($liquidacion_id);
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreatePDFforSupplierLiquidaciones($obj, $status, $liquidacion_id);
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function sendmailofsupplierliquidacionesexcelAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $liquidacion_id = $request->liquidacion_id;
            $status = (int) $request->status;
            $obj = new Gyuser_Model_Liquidaciones();
            $obj->setId($liquidacion_id);
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreateAndSendMailExcelforSupplierLiquidaciones($obj, $status, $liquidacion_id);
        } catch (Exception $e) {
            echo $e;
        }
    }
     
     */
}

