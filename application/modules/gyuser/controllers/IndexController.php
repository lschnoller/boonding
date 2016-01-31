<?php

class Gyuser_IndexController extends Zend_Controller_Action {

    public function init() {
        /* Initialize action controller here */
        //mumin svn test
        $sessionNamespace = new Zend_Session_Namespace();
        if ($sessionNamespace->loginAuth == true) {
            $authDetail = $sessionNamespace->authDetail;
            $this->view->authDetail = $authDetail;
        }
    }

    public function testAction() {
        //9/3/2011 - 7/2/2011
        $days = DaysGap("2011-02-07", "2011-03-09");
        echo $days;
    }

    public function loginAction() {
        try {
            $this->_helper->layout->disableLayout();
            $request = $this->getRequest();
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $this->_helper->redirector('index', 'index', 'gyuser');
            }
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_OperatorDataMapper();
                $Obj = new Gyuser_Model_Operator();
                if ($request->user_name) {
                    $Obj->setEmail($request->user_name);
                }
                if ($request->password) {
                    $Obj->setPassword($request->password);
                }
                $result = $mapper->LoginAuth($Obj);
                if ($result->getId()) {
                    $sessionNamespace = new Zend_Session_Namespace();
                    $sessionNamespace->loginAuth = true;
                    $sessionNamespace->authDetail = $result;
                    $sessionNamespace->setExpirationSeconds(7 * 24 * 60 * 60, 'a');
                    $this->_helper->redirector('dashboard', 'index', 'gyuser');
                } else {
                    $this->view->invalid = true;
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function logoutAction() 
    {
        try {
            $this->_helper->layout->disableLayout();
            $sessionNamespace = new Zend_Session_Namespace();
            $sessionNamespace->loginAuth = false;
            $sessionNamespace->authDetail = false;
            $this->_helper->redirector('login', 'index', 'gyuser');
        } catch (Exception $e) {
            echo $e;
        }
    }

    /*
    public function indexloadAction() 
    {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $this->_helper->layout->disableLayout();
                
                $request = $this->getRequest();
                
                //$userType = new Gyuser_Model_UserType ();
                $uMapper = new Gyuser_Model_UserDataMapper ();                
                
                if (!is_null($request->filter)) {
                    if($request->filter == 'activos')
                        $personArr = $uMapper->getClientsByType('activos');
                    elseif($request->filter == 'potenciales')
                        $personArr = $uMapper->getClientsByType('potenciales');
                    elseif($request->filter == 'todos')
                        $personArr = $uMapper->getClientsByType('todos');
                }
                else
                    $personArr = $uMapper->getClientsByType('activos');
                
            
                $cMapper = new Gyuser_Model_ClientTypesDataMapper ();
                $cList = $cMapper->fetchAll();

                $adminObj = new Gyuser_Model_Admin();
                $adminObj->setId(1);
                $adminMapper = new Gyuser_Model_AdminDataMapper();
                $adminObj = $adminMapper->find($adminObj);

                $contactMapper = new Gyuser_Model_ContactPointDataMapper ();
                $contactResult = $contactMapper->fetchAll();

                $oMapper = new Gyuser_Model_OperatorDataMapper ();
                $opeObj = $oMapper->fetchAll();

                $stateBDMapper = new Gyuser_Model_StateBDDataMapper ();
                $stateBD = $stateBDMapper->fetchAll();

                $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
                $cave = $caveMapper->fetchAll();

                $oprStMapper = new Gyuser_Model_OperationsStateDataMapper();
                $opsList = $oprStMapper->fetchAll();
                $this->view->operationsState = $opsList;

                $plansMapper = new Gyuser_Model_PlansDataMapper();
                $plansList = $plansMapper->fetchAll();
                $this->view->plans = $plansList;

                $interestsMapper = new Gyuser_Model_InterestsDataMapper();
                $interestsList = $interestsMapper->fetchAll();
                $this->view->interestsList = $interestsList;

                $this->view->contact = $contactResult;
                $this->view->opeArr = $opeObj;
                $this->view->pArr = $personArr;
                $this->view->cList = $cList;
                $this->view->stateBD = $stateBD;
                $this->view->cave = $cave;
                $this->view->admin = $adminObj;
                
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    */
    
    
    public function indexAction() 
    {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $request = $this->getRequest();
                
                //$userType = new Gyuser_Model_UserType ();
                $uMapper = new Gyuser_Model_UserDataMapper ();                
                
                if (!is_null($request->filter)) {
                    $filter = $request->filter;
                    if($request->filter == 'activos' || $request->filter == 'cobranza' || $request->filter == 'potenciales'
                            || $request->filter == 'todos')
                        $personArr = $uMapper->getClientsByType($request->filter);
                                      
                }
                else {
                    $filter = 'activos';
                    $personArr = $uMapper->getClientsByType('activos');
                }
                $this->view->filter = $filter; 
                $this->view->pArr = $personArr;
                
                $cMapper = new Gyuser_Model_ClientTypesDataMapper ();
                $cList = $cMapper->fetchAll();
                $this->view->cList = $cList;
                
                $contactMapper = new Gyuser_Model_ContactPointDataMapper ();
                $contactResult = $contactMapper->fetchAll();
                $this->view->contact = $contactResult;
                
                $oMapper = new Gyuser_Model_OperatorDataMapper ();
                $opeObj = $oMapper->fetchAll();
                $this->view->opeArr = $opeObj;
                
                $stateBDMapper = new Gyuser_Model_StateBDDataMapper ();
                $stateBD = $stateBDMapper->fetchAll();
                $this->view->stateBD = $stateBD;
                
                //$caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
                //$cave = $caveMapper->fetchAll();
                
                //$provMapper = new Gyuser_Model_ProvidersDataMapper();
                //$providers = $provMapper->getProviders();
                
                $adminObj = new Gyuser_Model_Admin();
                $adminObj->setId(1);
                $adminMapper = new Gyuser_Model_AdminDataMapper();
                $adminObj = $adminMapper->find($adminObj);
                $this->view->admin = $adminObj;
                
                $colMapper = new Gyuser_Model_ColegasDataMapper();
                $this->view->colegas = $colMapper->fetchAll();

                $oprStMapper = new Gyuser_Model_OperationsStateDataMapper();
                $this->view->operationsState = $oprStMapper->fetchAll();

                $plansMapper = new Gyuser_Model_PlansDataMapper();
                $this->view->plans = $plansMapper->fetchAll();                 

                $interestsMapper = new Gyuser_Model_InterestsDataMapper();
                $this->view->interestsList = $interestsMapper->fetchAll();
                
                $tasasMapper = new Gyuser_Model_TasasDataMapper();
                $this->view->tasasList = $tasasMapper->fetchAll();
                
                //$this->view->cave = $cave;
                //$this->view->providers = $providers;                
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    /*
    public function clientpotencialesAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {

                $authDetail = $sessionNamespace->authDetail;

                $cMapper = new Gyuser_Model_ClientTypesDataMapper ();
                $cList = $cMapper->fetchAll();


                $adminObj = new Gyuser_Model_Admin();
                $adminObj->setId(1);
                $adminMapper = new Gyuser_Model_AdminDataMapper();
                $adminObj = $adminMapper->find($adminObj);

                $userType = new Gyuser_Model_UserType ();

                $uMapper = new Gyuser_Model_UserDataMapper ();
                $personArr = $uMapper->fetchAllForPotenciales($userType);

                $contactMapper = new Gyuser_Model_ContactPointDataMapper ();
                $contactResult = $contactMapper->fetchAll();

                $oMapper = new Gyuser_Model_OperatorDataMapper ();
                $opeObj = $oMapper->fetchAll();

                $stateBDMapper = new Gyuser_Model_StateBDDataMapper ();
                $stateBD = $stateBDMapper->fetchAll();

                $caveMapper = new Gyuser_Model_OtherCavesDataMapper ();
                $cave = $caveMapper->fetchAll();

                $oprStMapper = new Gyuser_Model_OperationsStateDataMapper();
                $opsList = $oprStMapper->fetchAll();
                $this->view->operationsState = $opsList;

                $plansMapper = new Gyuser_Model_PlansDataMapper();
                $plansList = $plansMapper->fetchAll();
                $this->view->plans = $plansList;

                $interestsMapper = new Gyuser_Model_InterestsDataMapper();
                $interestsList = $interestsMapper->fetchAll();
                $this->view->interestsList = $interestsList;

                $this->view->contact = $contactResult;
                $this->view->opeArr = $opeObj;
                $this->view->pArr = $personArr;
                $this->view->cList = $cList;
                $this->view->stateBD = $stateBD;
                $this->view->cave = $cave;
                $this->view->admin = $adminObj;
                $this->view->authDetail = $authDetail;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    
    public function operatorAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_OperatorDataMapper ();
                $opeObj = $mapper->fetchAll();

                $this->view->pArr = $opeObj;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function contactpointAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_ContactPointDataMapper();
                $opeObj = $mapper->fetchAll();

                $this->view->pArr = $opeObj;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function contactpointformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ContactPointDataMapper();
                $Obj = new Gyuser_Model_ContactPoint();
                $Obj->setTitle($request->title);
                $Obj->setDescription($request->description);

                if ($request->id) {
                    $Obj->setId($request->id);
                }
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function contactpointdeleteajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ContactPointDataMapper();
                $Obj = new Gyuser_Model_ContactPoint();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function getclientsdetailsbyidajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_UserDataMapper ();
                $Obj = new Gyuser_Model_User ();
                $Obj->setId($request->client_id);
                //$result = $mapper->findClient($Obj);
                $result = $mapper->ClientDetailsById($Obj);
                if ($result) {
                    $strRes = str_replace('\u0000*\u0000_', "", json_encode((array) $result));
                    $jsonRes = $strRes;
                    echo $jsonRes;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function userformsteponeajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
                
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $id = null;
                $mapper = new Gyuser_Model_UserDataMapper();
                $pdlObj = new Gyuser_Model_User();
                if ($request->id) {
                    $pdlObj->setId($request->id);
                }
                $CUIL = $request->CUIL;
                $CUIL = str_replace('-', '', $CUIL);                                
                    
                $pdlObj->setClient_type($request->client_type);
                $pdlObj->setFirst_name($request->first_name);
                $pdlObj->setLast_name($request->last_name);
                $pdlObj->setDNI($request->DNI);
                $pdlObj->setCUIL($CUIL);
                $pdlObj->setTel_cell($request->tel_cell);
                $pdlObj->setTel_lab($request->tel_lab);
                $pdlObj->setTel_otro($request->tel_otro);
                $pdlObj->setTel_part($request->tel_part);
                //$pdlObj->setTel_cell_code($request->tel_cell_code);
                $pdlObj->setTel_lab_code($request->tel_lab_code);
                $pdlObj->setTel_otro_code($request->tel_otro_code);
                $pdlObj->setTel_part_code($request->tel_part_code);
                $pdlObj->setEmail($request->email);
                $pdlObj->setActivity($request->activity);
                $pdlObj->setBusiness($request->business);
                $pdlObj->setBusiness_CUIT($request->business_CUIT);
                $pdlObj->setMulti_address_json($request->multi_address_json);
                $pdlObj->setMulti_prior_json($request->multi_prior_json);

                list ( $Day, $Month, $Year ) = explode('/', $request->date_added);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $realDate = date("Y-m-d", $stampeddate);
                $pdlObj->setDate_added($realDate);
                $pdlObj->setOperator($request->operator);
                $pdlObj->setContact_point($request->contact_point);
                $pdlObj->setExtra_info($request->extra_info);
                
                //NOTE! if the type was changed or it is a new 
                //user then set type_change equal to today
                if($request->client_type != $request->original_type)
                    $pdlObj->setType_change(date("Y-m-d"));
                
                $ValidateDNI = $mapper->ValidateDNI($pdlObj);
                $ValidateEmail = $mapper->ValidateEmail($pdlObj);
                $ValidateCUIL = $mapper->ValidateCUIL($pdlObj);
                $ValidateCUIT = $mapper->ValidateCUIT($pdlObj);

                $error = array(
                    'DNI' => $ValidateDNI,
                    'email' => $ValidateEmail,
                    'CUIL' => $ValidateCUIL,
                    'business_CUIT' => $ValidateCUIT,
                );
                if ($ValidateDNI === true && $ValidateEmail === true && $ValidateCUIL === true && $ValidateCUIT === true) {
                    $id = $mapper->save($pdlObj);
                    $error['valid'] = true;
                    $error['client_id'] = $id;
                } else {
                    $error['valid'] = false;                    
                }
                echo json_encode($error);
            }
        } catch (Exception $e) {

            echo $e;
        }
    }

    public function userbankformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_BankAccountsDataMapper ();
                $Obj = new Gyuser_Model_BankAccounts ();
                $Obj->setUser_id($request->user_id);
                $Obj->setBank_name($request->bank_name);
                $Obj->setAccount_n($request->account_n);
                $Obj->setBranch($request->branch);
                $Obj->setOpening_date($request->opening_date);
                $Obj->setZip_code($request->zip_code);
                $Obj->setLocation_capital($request->location_capital);
                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deletebankaccountajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_BankAccountsDataMapper();
                $Obj = new Gyuser_Model_BankAccounts();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function userdeleteajaxAction() {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {
            $mapper = new Gyuser_Model_UserDataMapper ();
            $Obj = new Gyuser_Model_User ();
            $Obj->setId($request->id);            
            $result = $mapper->DeleteClientDetails($Obj);
            if ($result) {
                echo $result;
            } else {
                echo "f";
            }
        }
    }

    public function userlistdataAction() {

        $request = $this->getRequest();
        $uMapper = new Gyuser_Model_UserDataMapper ();
        $personArr = $uMapper->fetchAsJsonAll();
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $page = $request->page;

        echo $personArr;
    }

    public function getbankdetailsbyidajaxAction() {
        $request = $this->getRequest();
        $mapper = new Gyuser_Model_BankAccountsDataMapper ();
        $obj = new Gyuser_Model_BankAccounts ();
        $obj->setUser_id($request->user_id);
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $result = $mapper->GetBankDetailsByUserId($obj);
        $json = json_encode($result);
        echo $json;
    }

    public function operatorformajaxAction() {

        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_OperatorDataMapper ();
            $Obj = new Gyuser_Model_Operator ();
            $Obj->setType($request->type);
            $Obj->setName($request->name);
            $Obj->setLast_name($request->last_name);
            $Obj->setEmail($request->email);
            $Obj->setPassword($request->password);
            if ($request->id) {
                $Obj->setId($request->id);
            }
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $id = $mapper->save($Obj);
            if ($id) {
                echo $id;
            } else {
                echo "f";
            }
        }
    }

    public function operatordeleteajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_OperatorDataMapper ();
            $Obj = new Gyuser_Model_Operator ();
            $Obj->setId($request->id);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $result = $mapper->delete($Obj);
            if ($result) {
                echo $result;
            } else {
                echo 'f';
            }
        }
    }

    public function chequesformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ChequesDataMapper ();
                $Obj = new Gyuser_Model_Cheques ();
                if ($request->operation_id) {
                    $Obj->setOperation_id($request->operation_id);
                }

                list ( $Day, $Month, $Year ) = explode('/', $request->date);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $realDate = date("Y-m-d", $stampeddate);

                $Obj->setDate($realDate);
                $Obj->setCheck_n($request->check_n);
                $Obj->setAmount($request->amount);
                //$Obj->setStatus($request->status);
                if ($request->id) {
                    $Obj->setId($request->id);
                }
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function addnewclientajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_ClientTypesDataMapper ();
            $Obj = new Gyuser_Model_ClientTypes ();
            $Obj->setId($request->id);
            $Obj->setName($request->client);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $id = $mapper->save($Obj);
            if ($id) {
                echo $id;
            } else {
                echo "f";
            }
        }
    }

    public function deleteclienttypeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ClientTypesDataMapper();
                $Obj = new Gyuser_Model_ClientTypes();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationsAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {


                $cMapper = new Gyuser_Model_UserDataMapper ();
                $cList = $cMapper->fetchAllClientNames();
                $this->view->clientList = $cList;

                $opMapper = new Gyuser_Model_OperationsDataMapper ();
                $opList = $opMapper->fetchAll();
                $this->view->operationList = $opList;

                $statusMapper = new Gyuser_Model_StatusListDataMapper ();
                $sList = $statusMapper->fetchAll();
                $this->view->statusList = $sList;

                $oprStMapper = new Gyuser_Model_OperationsStateDataMapper();
                $opsList = $oprStMapper->fetchAll();
                $this->view->operationsState = $opsList;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationsformajaxAction() {
        try {            
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_OperationsDataMapper ();
                $Obj = new Gyuser_Model_Operations ();
                $Obj->setClient_id($request->client_id);

                date_default_timezone_set('Europe/Vienna');
                list ( $Day, $Month, $Year ) = explode('/', $request->date);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $realDate = date("Y-m-d", $stampeddate);

                $Obj->setDate($realDate);
                $Obj->setAmount($request->amount);
                $Obj->setState($request->state);
                $Obj->setObservations($request->observations);
                $Obj->setCave_id($request->cave);
                $Obj->setBank_account_id($request->bank_account_id);
                if ($request->id)
                    $Obj->setId($request->id);                
                $id = $mapper->save($Obj);
                
                if ($id) {                    
                    //set client type to active
                    $clientMapper = new Gyuser_Model_UserDataMapper();
                    $clientObj = new Gyuser_Model_User();
                    $clientObj->setId($request->client_id);
                    $clientObj->setClient_type(3); //active
                    $clientMapper->UpdateUserType($clientObj);
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationsdeleteajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_OperationsDataMapper ();
            $Obj = new Gyuser_Model_Operations ();
            $Obj->setId($request->id);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $result = $mapper->delete($Obj);
            if ($result) {
                echo $result;
            } else {
                echo "f";
            }
        }
    }

    public function getcheckdetailsbyidajaxAction() {
        $request = $this->getRequest();
        $mapper = new Gyuser_Model_ChequesDataMapper ();
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        $result = $mapper->GetChequeDetailsByOpId($request->operation_id);
        $json = json_encode($result);
        echo $json;
    }

    public function chequeAction() 
    {
        $sessionNamespace = new Zend_Session_Namespace();
        if ($sessionNamespace->loginAuth == true) {
            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $this->view->cList = $cMapper->GetCheques();            
            $this->view->cobranzasList = $cMapper->GetCobranzasCheques(); 
            $this->view->tercerosList = $cMapper->GetTercerosCheques(); 

            $adminObj = new Gyuser_Model_Admin();            
            $adminMapper = new Gyuser_Model_AdminDataMapper();
            $adminObj->setId(1);
            $this->view->admin = $adminMapper->find($adminObj);

            $statusMapper = new Gyuser_Model_StatusListDataMapper ();
            $this->view->statusList = $statusMapper->fetchAll();

            $opeMapper = new Gyuser_Model_OperationsDataMapper ();
            $this->view->operations = $opeMapper->GetAllOperations();
            $this->view->operationList = $opeMapper->fetchAll();
            
            $uMapper = new Gyuser_Model_UserDataMapper ();
            $this->view->clientList = $uMapper->fetchAllClientNames();
        } else {
            $this->_helper->redirector('login', 'index', 'gyuser');
        }
    }

    public function deletecontactpointajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ContactPointDataMapper();
                $Obj = new Gyuser_Model_ContactPoint();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function chequedeleteajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_ChequesDataMapper ();
            $Obj = new Gyuser_Model_Cheques ();
            $Obj->setId($request->id);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $result = $mapper->delete($Obj);
            if ($result) {
                echo $result;
            } else {
                echo "f";
            }
        }
    }

    public function getaddressbyclientidajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_AddressDataMapper ();
                $Obj = new Gyuser_Model_Address ();
                $Obj->setClient_id($request->client_id);
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->GetAddressByClientId($Obj);
                $result = json_encode($result);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function editmultiaddressajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_AddressDataMapper ();
                $Obj = new Gyuser_Model_Address ();
                $Obj->setClient_id($request->client_id);
                $Obj->setMulti_address_json($request->multi_address_json);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->EditMultiAddressByClientId($Obj);
                $result = json_encode($result);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deleteaddressajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_AddressDataMapper ();
                $Obj = new Gyuser_Model_Address ();
                $Obj->setId($request->address_id);
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
         } catch (Exception $e) {
            echo $e;
        }
    }

    public function addnewcolegaajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                //$mapper = new Gyuser_Model_OtherCavesDataMapper ();
                //$Obj = new Gyuser_Model_OtherCaves ();
                $mapper = new Gyuser_Model_ColegasDataMapper();
                $Obj = new Gyuser_Model_Colegas();
                $Obj->setId($request->id);
                $Obj->setName($request->name);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deletecolegaajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                //$mapper = new Gyuser_Model_OtherCavesDataMapper();
                //$Obj = new Gyuser_Model_OtherCaves();
                $mapper = new Gyuser_Model_ColegasDataMapper();
                $Obj = new Gyuser_Model_Colegas();
                $Obj->setId($request->id);
                
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function getpriorbyclientidajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_PriorOperationsDataMapper ();
                $Obj = new Gyuser_Model_PriorOperations ();
                $Obj->setClient_id($request->client_id);
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->GetPriorByClientId($Obj);
                $result = json_encode($result);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function editmultipriorajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_PriorOperationsDataMapper ();
                $Obj = new Gyuser_Model_PriorOperations ();
                $Obj->setClient_id($request->client_id);
                $Obj->setMulti_prior_json($request->multi_prior_json);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->EditMultiPriorByClientId($Obj);
                $result = json_encode($result);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deletepriorajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_PriorOperationsDataMapper ();
            $Obj = new Gyuser_Model_PriorOperations ();
            $Obj->setId($request->id);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $result = $mapper->delete($Obj);
            if ($result) {
                echo $result;
            } else {
                echo "f";
            }
        }
    }

    public function eventsAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $cMapper = new Gyuser_Model_EventsDataMapper ();
                $cList = $cMapper->fetchAll();
                $this->view->cList = $cList;

                $statusMapper = new Gyuser_Model_StatusListDataMapper ();
                $sList = $statusMapper->fetchAll();
                $this->view->statusList = $sList;

                $opeMapper = new Gyuser_Model_OperationsDataMapper ();
                $result = $opeMapper->GetAllOperations();
                $this->view->operations = $result;

                $cMapper = new Gyuser_Model_UserDataMapper ();
                $cList = $cMapper->fetchAllClientNames();
                $this->view->clientList = $cList;

                $eActionMapper = new Gyuser_Model_EventActionDataMapper ();
                $eAction = $eActionMapper->fetchAll();
                $this->view->eventAction = $eAction;

                $eTypeMapper = new Gyuser_Model_EventTypeDataMapper ();
                $eType = $eTypeMapper->fetchAll();
                $this->view->eventType = $eType;

                $oMapper = new Gyuser_Model_OperatorDataMapper ();
                $operator = $oMapper->fetchAll();
                $this->view->operator = $operator;

                $opMapper = new Gyuser_Model_OperationsDataMapper ();
                $opList = $opMapper->fetchAll();
                $this->view->operationList = $opList;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function addneweventtypeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_EventTypeDataMapper ();
                $Obj = new Gyuser_Model_EventType ();
                $Obj->setId($request->id);
                $Obj->setName($request->name);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deleteeventtypeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_EventTypeDataMapper();
                $Obj = new Gyuser_Model_EventType();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function addneweventactionajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_EventActionDataMapper ();
                $Obj = new Gyuser_Model_EventAction ();
                $Obj->setId($request->id);
                $Obj->setName($request->name);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function deleteeventactionajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_EventActionDataMapper();
                $Obj = new Gyuser_Model_EventAction();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function eventformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_EventsDataMapper ();
                $Obj = new Gyuser_Model_Events ();

                list ( $Day, $Month, $Year ) = explode('/', $request->schedule);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $realDate = date("Y-m-d", $stampeddate);

                $Obj->setOperation_id($request->operation_id);
                $Obj->setType_id($request->type_id);
                $Obj->setAction_id($request->action_id);
                $Obj->setSchedule($realDate);
                $Obj->setAssigned_operator_id($request->assigned_operator_id);
                $Obj->setComments($request->comments);

                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            
        }
    }

    public function eventdeleteajaxAction() {
        $request = $this->getRequest();
        if ($this->getRequest()->isPost()) {

            $mapper = new Gyuser_Model_EventsDataMapper();
            $Obj = new Gyuser_Model_Events();
            $Obj->setId($request->id);

            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $result = $mapper->delete($Obj);
            if ($result) {
                echo $result;
            } else {
                echo "f";
            }
        }
    }

    public function getalldetailsbyclientidajaxAction() {
        try {
            //echo "it works!";
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $clientid = $request->client_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_AddressDataMapper ();
                $Obj = new Gyuser_Model_Address ();
                $Obj->setClient_id($clientid);
                $addresses = $mapper->GetAddressByClientId($Obj);

                $mapper = new Gyuser_Model_BankAccountsDataMapper ();
                $obj = new Gyuser_Model_BankAccounts ();
                $obj->setUser_id($clientid);
                $bankdetails = $mapper->GetBankDetailsByUserId($obj);

                $mapper = new Gyuser_Model_PriorOperationsDataMapper();
                $obj = new Gyuser_Model_PriorOperations();
                $obj->setClient_id($clientid);
                $prior = $mapper->GetPriorByClientId($obj);

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setClient_id($clientid);
                $operations = $mapper->GetOperationsByClientId($obj);
                
                $mapper = new Gyuser_Model_UserDataMapper();
                $obj = new Gyuser_Model_User();
                $obj->setId($clientid);
                $clientInfo = $mapper->findContacto($obj);

                $clientDetails = array(
                    'bankdetails' => $bankdetails,
                    'addresses' => $addresses,
                    'prior' => $prior,
                    'operations' => $operations,
                    'clientInfo' => $clientInfo,
                );               
                
                if ($clientDetails) {
                    echo json_encode($clientDetails);
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function operationstatechangeajaxAction() {
        try {
            $mapper = new Gyuser_Model_OperationsDataMapper();
            $obj = new Gyuser_Model_Operations();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $operationId = $request->operation_id;
                $stateId = (int)$request->state_id;
                $obj->setId($operationId);
                $obj->setState($stateId);
                $chequesList = null;
                $chequeId = null;
                                
                switch($stateId) 
                {
                    //step2
                    case 2:
                        $obj->setCave_id($request->cave_id);
                        break;
                    
                    //step3
                    case 3: //report approved
                    case 4: //report denied
                        $obj->setReport($request->report);
                        break;
                    
                    //step 4
                    case 5:
                        $chequesList = $request->cheques_list;
                        $obj->setAmount($request->total_amount);
                        $obj->setPlan_id($request->plan_id);
                        $obj->setInterests_id($request->interests_id); 
                        break;
                    
                    case 8:
                    case 9:
                        $chequeId = $request->id;
                        $chequesList = $request->cheques_list;                       
                        $obj->setAmount($request->total_amount);
                        $obj->setPlan_id($request->plan_id);
                        break;                    
                    
                    //step 5
                    case 6: //en camino
                    case 7: //en camino lavalle
                    case 99: //cancel op.                        
                    default:                       
                        break;
                }
                
                $result = $mapper->OperationStateChange($obj, $chequesList, $chequeId);

                if ($result) {                    
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    
    
    /*
    public function operationsteptwoajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $operationid = $request->operation_id;
                $cave_id = $request->cave_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $obj->setCave_id($cave_id);
                $result = $mapper->OperationStepTwo($obj);

                if ($result) {                    
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function canceloperationAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $operationid = $request->operation_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $result = $mapper->CancelOperation($obj);

                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationstepthreeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $operationid = $request->operation_id;
                $report = $request->report;
                $approved = (int) $request->approved;
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $obj->setReport($report);
                if ($approved) {
                    $obj->setState(4);
                } else {
                    $obj->setState(3);
                }

                $result = $mapper->OperationStepThree($obj);

                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationstepfourajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $operationid = $request->operation_id;
                $chequesList = $request->cheques_list;
                $totalAmount = $request->total_amount;
                $planid = $request->plan_id;
                $interestId = $request->interests_id;

                $opsMapper = new Gyuser_Model_OperationsDataMapper();
                $opsObj = new Gyuser_Model_Operations();
                $opsObj->setId($operationid);
                $arc_hrs = $opsMapper->GetAcreditacionHrsByOperationId($opsObj);

                $mapper = new Gyuser_Model_ChequesDataMapper();
                $obj = new Gyuser_Model_Cheques();
                $obj->setOperation_id($operationid);
                $obj->setAcreditacion_hrs($arc_hrs);
                $obj->setCheques_list($chequesList);
                $result = $mapper->SaveCheques($obj);

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $obj->setAmount($totalAmount);
                $obj->setPlan_id($planid);
                $obj->setInterests_id($interestId);
                $result = $mapper->OperationStepFour($obj);

                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function operationstepfiveajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $operationid = $request->operation_id;
                $state_id = $request->state_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $obj->setState($state_id);
                $result = $mapper->OperationStepFive($obj);

                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    */
    public function getchecksbyoperationidajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $operationid = $request->operation_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $planid = $mapper->GetPlanIdByOperationId($obj);
                $interests_id = $mapper->GetInterestsIdByOperationId($obj);

                $mapper = new Gyuser_Model_ChequesDataMapper();
                $chequesList = $mapper->GetChequeDetailsByOpId($operationid);
                $result['planid'] = $planid;
                $result['interests_id'] = $interests_id;
                $result['cheques'] = $chequesList;
                if ($result) {
                    echo json_encode($result);
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
/*
    public function editplansandchequeajaAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $cheque_id = $request->id;
                $operationid = $request->operation_id;
                $chequesList = $request->cheques_list;
                $totalAmount = $request->total_amount;
                $planid = $request->plan_id;
                $state_id = $request->state_id;



                $mapper = new Gyuser_Model_ChequesDataMapper();
                $obj = new Gyuser_Model_Cheques();
                $obj->setId($cheque_id);
                $obj->setOperation_id($operationid);
                $obj->setCheques_list($chequesList);

                $chequesResult = $mapper->SaveCheques($obj);

                $mapper = new Gyuser_Model_OperationsDataMapper();
                $obj = new Gyuser_Model_Operations();
                $obj->setId($operationid);
                $obj->setAmount($totalAmount);
                $obj->setPlan_id($planid);
                $obj->setState($state_id);
                $planResult = $mapper->ChangePlanAndAmount($obj);

                if ($chequesResult || $planResult) {
                    echo 1;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function generatepdfAction() {

        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            $clientid = $request->clientid;
            $typeid = (int) $request->typeid;
            $status = (int) $request->status;
            $operationid = (int) $request->operationid;
            $obj = new Gyuser_Model_User();
            $obj->setId($clientid);
            $pdf = new Gyuser_Model_PdfGeneratorDataMapper();
            $pdf->CreatePDF($obj, $typeid, $status, $operationid);
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function useraddressformajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_AddressDataMapper();
                $Obj = new Gyuser_Model_Address();
                $Obj->setStreet($request->street);
                $Obj->setCity($request->city);
                $Obj->setZip_code($request->zip_code);
                $Obj->setState($request->state);
                $Obj->setAddress_type($request->address_type);
                $Obj->setDelivery_address((int)$request->delivery_address);
                $Obj->setClient_id($request->client_id);
                if ($request->id != '') {
                    $Obj->setId($request->id);
                }
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function userpriorformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_PriorOperationsDataMapper();
                $Obj = new Gyuser_Model_PriorOperations();
                if ($request->date) {
                    list($Day, $Month, $Year) = explode('/', $request->date);
                    $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                    $next_check_date = date("Y-m-d", $stampeddate);
                } else {
                    $next_check_date = null;
                }

                $Obj->setDate($next_check_date);
                $Obj->setIs_operation_completed($request->is_operation_completed);
                $Obj->setCave_name($request->cave_name);
                $Obj->setAmount($request->amount);
                $Obj->setNext_check_date($request->next_check_date);
                $Obj->setPending_checks($request->pending_checks);
                $Obj->setIs_last_operation($request->is_last_operation);


                if ($request->next_check_date) {
                    list($Day, $Month, $Year) = explode('/', $request->next_check_date);
                    $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                    $next_check_date = date("Y-m-d", $stampeddate);
                } else {
                    $next_check_date = null;
                }
                $Obj->setNext_check_date($next_check_date);
                $Obj->setClient_id($request->client_id);

                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function rejectchequeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ChequesDataMapper();
                $Obj = new Gyuser_Model_Cheques();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->RejectCheque($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function chequepayedajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_ChequesDataMapper();
                $Obj = new Gyuser_Model_Cheques();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->ChequePayed($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function getrejedchequescteyclientidajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $clientid = $request->client_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $cObj = new Gyuser_Model_Cheques();
                $cObj->setId($clientid);
                $cMapper = new Gyuser_Model_ChequesDataMapper ();
                $cList = $cMapper->RejectedChequeByClinetId($cObj);
                if ($cList)
                    echo json_encode($cList);                
                else                    
                    echo json_encode('');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function savepaymentforrejectedchequeajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();            
            if ($this->getRequest()->isPost()) {
                $paymentType = $request->payment_type;
                switch($paymentType) {
                    case 1:
                        $Obj = new Gyuser_Model_Cobranzas();                 
                        $Obj->setClient_id($request->client_id);
                        $Obj->setOperation_id($request->operation_id);
                        $Obj->setCheque_id($request->cheque_id);
                        $Obj->setDate_paid($request->date_paid);
                        $Obj->setPaid_amount($request->paid_amount);
                        $Obj->setPrevious_balance($request->previous_balance);
                        $Obj->setCurrent_balance($request->current_balance);
                        $Obj->setPayment_type($request->payment_type);
                        break;
                        
                    case 2:
                        $Obj = new Gyuser_Model_Cobranzas();
                        $Obj->setClient_id($request->client_id);
                        $Obj->setOperation_id($request->operation_id);
                        $Obj->setCheque_id($request->cheque_id);
                        $Obj->setDate_paid($request->date_paid);
                        $Obj->setPaid_amount($request->paid_amount);
                        $Obj->setPrevious_balance($request->previous_balance);
                        $Obj->setCurrent_balance($request->current_balance);
                        $Obj->setPayment_type($request->payment_type);

                        $chqObj = new Gyuser_Model_Cheques();
                        $chqObj->setAmount($request->paid_amount);
                        $chqObj->setStatus(1);
                        $chqObj->setRejected_bank_id($request->rejected_bank_id);
                        $chqObj->setOperation_id($request->operation_id);
                        $chqObj->setClient_id($request->client_id);
                        $chqObj->setCheck_n($request->new_cheque_n);
                        $chqObj->setDate($request->cheque_date);
                        $chqObj->setRejected_check_payment(1);
                        $Obj->setCheques_obj($chqObj);
                        break;
                    
                    case 3:                        
                        $Obj = new Gyuser_Model_Cobranzas();
                        $Obj->setClient_id($request->client_id);
                        $Obj->setOperation_id($request->operation_id);
                        $Obj->setCheque_id($request->cheque_id);
                        $Obj->setDate_paid($request->date_paid);
                        $Obj->setPaid_amount($request->paid_amount);
                        $Obj->setPrevious_balance($request->previous_balance);
                        $Obj->setCurrent_balance($request->current_balance);
                        $Obj->setPayment_type($request->payment_type);

                        $chqObj = new Gyuser_Model_Cheques();
                        $chqObj->setAmount($request->paid_amount);
                        $chqObj->setStatus(1);
                        $chqObj->setOperation_id($request->operation_id);
                        $chqObj->setClient_id($request->client_id);
                        $chqObj->setCheck_n($request->new_cheque_n);
                        $chqObj->setDate($request->cheque_date);
                        $chqObj->setRejected_check_payment(2);
                        $Obj->setCheques_obj($chqObj);

                        $bankObj = new Gyuser_Model_BankAccounts();
                        $bankObj->setUser_id($request->client_id);
                        $bankObj->setBank_name($request->bank_name);
                        $bankObj->setBranch($request->branch);
                        $bankObj->setAccount_n($request->account_n);
                        $bankObj->setOpening_date($request->opening_date);
                        $bankObj->setZip_code($request->check_zip_code);
                        $bankObj->setLocation_capital($request->location_capital);
                        $Obj->setBank_accounts_obj($bankObj); 
                        break;
                }
                $mapper = new Gyuser_Model_CobranzasDataMapper();
                $id = $mapper->SavePaymentForRejectedCheque($Obj);
                echo $id;
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    
    
/*
    public function saveownchequeforrejectedchequeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_CobranzasDataMapper();
                $Obj = new Gyuser_Model_Cobranzas();

                $Obj->setClient_id($request->client_id);
                $Obj->setOperation_id($request->operation_id);
                $Obj->setCheque_id($request->cheque_id);
                $Obj->setDate_paid($request->date_paid);
                $Obj->setPaid_amount($request->paid_amount);
                $Obj->setPrevious_balance($request->previous_balance);
                $Obj->setCurrent_balance($request->current_balance);
                $Obj->setPayment_type($request->payment_type);

                $chqObj = new Gyuser_Model_Cheques();
                $chqObj->setAmount($request->paid_amount);
                $chqObj->setStatus(1);
                $chqObj->setRejected_bank_id($request->rejected_bank_id);
                $chqObj->setOperation_id($request->operation_id);
                $chqObj->setCheck_n($request->new_cheque_n);

                $chqObj->setDate($request->cheque_date);
                $chqObj->setRejected_check_payment(1);

                $Obj->setCheques_obj($chqObj);

                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->SaveOwnChequeForRejectedCheque($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function savechequewithbankforrejectedchequeajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_CobranzasDataMapper();
                $Obj = new Gyuser_Model_Cobranzas();

                $Obj->setClient_id($request->client_id);
                $Obj->setOperation_id($request->operation_id);
                $Obj->setCheque_id($request->cheque_id);
                $Obj->setDate_paid($request->date_paid);
                $Obj->setPaid_amount($request->paid_amount);
                $Obj->setPrevious_balance($request->previous_balance);
                $Obj->setCurrent_balance($request->current_balance);
                $Obj->setPayment_type($request->payment_type);

                $chqObj = new Gyuser_Model_Cheques();
                $chqObj->setAmount($request->paid_amount);
                $chqObj->setStatus(1);
                $chqObj->setOperation_id($request->operation_id);
                $chqObj->setCheck_n($request->new_cheque_n);
                $chqObj->setDate($request->cheque_date);
                $chqObj->setRejected_check_payment(2);

                $Obj->setCheques_obj($chqObj);

                $bankObj = new Gyuser_Model_BankAccounts();
                $bankObj->setUser_id($request->client_id);
                $bankObj->setBank_name($request->bank_name);
                $bankObj->setBranch($request->branch);
                $bankObj->setAccount_n($request->account_n);
                $bankObj->setOpening_date($request->opening_date);
                $bankObj->setZip_code($request->check_zip_code);
                $bankObj->setLocation_capital($request->location_capital);

                $Obj->setBank_accounts_obj($bankObj);



                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->SaveChequeWithNewBankForRejectedCheque($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function getgestiondetailsajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $clientid = $request->client_id;

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();

                $cObj = new Gyuser_Model_Cheques();
                $cObj->setId($clientid);
                $cMapper = new Gyuser_Model_ChequesDataMapper ();
                $cList = $cMapper->GestionDetialsByClinetId($cObj);

                $cbObj = new Gyuser_Model_Cobranzas();
                $cbObj->setId($clientid);
                $coMapper = new Gyuser_Model_CobranzasDataMapper();
                $cbList = $coMapper->GestionDetialsByClinetId($cbObj);
                
                if ($cList || $cbList) {
                    $result = array(
                        'grcList' => $cList,
                        'gccList' => $cbList,
                    );
                    echo json_encode($result);
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function cronjobtasksAction() 
    {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            //create the daily tasks
            $model = new Gyuser_Model_NotificationsDataMapper();
            $model->createDailyTasks();
            
            $mail = new Zend_Mail('utf-8');       
            $mail->addTo('cronjobs@hoaworldwide.com', 'GY Cronjobs');    
            $mail->setSubject('Generador automático de tareas');
            $mail->setBodyHtml('<p>Se han generado las tareas del día.</p>');
            $mail->send();
        } 
        catch (Exception $e) {            
            $mail = new Zend_Mail('utf-8');       
            $mail->addTo('cronjobs@hoaworldwide.com', 'GY Cronjobs');    
            $mail->setSubject('ERROR: Generador automático de tareas');
            $mail->setBodyHtml('<p>Ha habido un error al generar las tareas del día.</p>'.$e);
            $mail->send();            
            echo $e;
        }
    }
    
    public function cronjobacreditacionesAction() 
    {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();

            $chequeMapper = new Gyuser_Model_ChequesDataMapper();
            $chequeMapper->ChangeStatusAsPaidByTimeOverFlow();

            $mail = new Zend_Mail('utf-8');       
            $mail->addTo('cronjobs@hoaworldwide.com', 'GY Cronjobs');    
            $mail->setSubject('Acreditacion automatica de cheques');
            $mail->setBodyHtml('<p>El estado de acreditacion de los cheques ha sido actualizado</p>');
            $mail->send();
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function changestatustopaidbytimeflowAction() 
    {
        $chequeMapper = new Gyuser_Model_ChequesDataMapper();
        $chequeMapper->ChangeStatusAsPaidByTimeOverFlow();
        /* DEPRECATED
        $opMapper = new Gyuser_Model_OperationsDataMapper();
        $opMapper->updateOpAndClientsStatus();
        $clMapper = new Gyuser_Model_UserDataMapper();
        $clMapper->updatePotencialClients();
        */
    }

    
    public function rejectchequewithgastosajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {                
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                
                $mapper = new Gyuser_Model_ChequesDataMapper();
                $Obj = new Gyuser_Model_Cheques();
                $Obj->setId($request->id);
                $Obj->setRejected_gastos($request->gastos);
                $Obj->setRejected_type($request->gastos_type);

                $result = $mapper->RejectChequeWithGastos($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    
    public function adminAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                /*
                $cMapper = new Gyuser_Model_OtherCavesDataMapper();
                $cObj = new Gyuser_Model_OtherCaves();
                $cObj->setId(1);
                $cList = $cMapper->GetCaveById($cObj);
                $this->view->cList = $cList;
                $sMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                $sList = $sMapper->GetAllSuppliers();
                */
                $provMapper = new Gyuser_Model_ProvidersDataMapper();
                $this->view->sList = $provMapper->getProviders();
                
                $aMapper = new Gyuser_Model_AdminDataMapper();
                $aObj = new Gyuser_Model_Admin();
                $aObj->setId(1);
                $this->view->admin = $aMapper->find($aObj);

                $cMapper = new Gyuser_Model_ChequesDataMapper();
                $cObj = new Gyuser_Model_Cheques();
                $cObj->setStatus(1);
                $this->view->ctAmount = $cMapper->GetTotalAmountByStats($cObj);
                $cObj->setStatus(4);
                $this->view->cpAmount = $cMapper->GetTotalAmountByStats($cObj);
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function providereditajaxAction() 
    {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_ProvidersDataMapper();
                $Obj = new Gyuser_Model_Providers();
                if ($request->id) {
                    $Obj->setId($request->id);
                }
                $Obj->setName($request->name);
                $Obj->setEmail($request->email);
                $Obj->setTasa_anual($request->tasa_anual);
                $Obj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $Obj->setGastos_interior($request->gastos_interior);
                $Obj->setGastos_general($request->gastos_general);
                $Obj->setGastos_denuncia($request->gastos_denuncia);
                $Obj->setGastos_rechazo($request->gastos_rechazo);
                $Obj->setAcreditacion_capital($request->acreditacion_capital);
                $Obj->setAcreditacion_interior($request->acreditacion_interior);
                $Obj->setGastos_cheque_menor_a_1($request->gastos_cheque_menor_a_1);
                $Obj->setGastos_cheque_a_1($request->gastos_cheque_a_1);
                $Obj->setGastos_cheque_menor_a_2($request->gastos_cheque_menor_a_2);
                $Obj->setGastos_cheque_a_2($request->gastos_cheque_a_2);
                $id = $mapper->update($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
/*    
    public function providereditajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {


                $mapper = new Gyuser_Model_SupplierOperationsDataMapper();
                $Obj = new Gyuser_Model_SupplierOperations();
                $Obj->setEmail($request->email);
                $Obj->setTasa_anual($request->tasa_anual);
                $Obj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $Obj->setGastos_interior($request->gastos_interior);
                $Obj->setGastos_general($request->gastos_general);
                $Obj->setGastos_denuncia($request->gastos_denuncia);
                $Obj->setGastos_rechazo($request->gastos_rechazo);
                $Obj->setAcreditacion_capital($request->acreditacion_capital);
                $Obj->setAcreditacion_interior($request->acreditacion_interior);
                $Obj->setGastos_cheque_menor_a_1($request->gastos_cheque_menor_a_1);
                $Obj->setGastos_cheque_a_1($request->gastos_cheque_a_1);
                $Obj->setGastos_cheque_menor_a_2($request->gastos_cheque_menor_a_2);
                $Obj->setGastos_cheque_a_2($request->gastos_cheque_a_2);

                $Obj->setName($request->name);

                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    /*
    public function caveeditajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {


                $mapper = new Gyuser_Model_OtherCavesDataMapper();
                $Obj = new Gyuser_Model_SupplierOperations();
                $Obj->setEmail($request->email);
                $Obj->setTasa_anual($request->tasa_anual);
                $Obj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $Obj->setGastos_general($request->gastos_general);
                $Obj->setGastos_denuncia($request->gastos_denuncia);
                $Obj->setGastos_rechazo($request->gastos_rechazo);
                $Obj->setAcreditacion_capital($request->acreditacion_capital);
                $Obj->setAcreditacion_interior($request->acreditacion_interior);
                $Obj->setGastos_cheque_menor_a_1($request->gastos_cheque_menor_a_1);
                $Obj->setGastos_cheque_a_1($request->gastos_cheque_a_1);
                $Obj->setGastos_cheque_menor_a_2($request->gastos_cheque_menor_a_2);
                $Obj->setGastos_cheque_a_2($request->gastos_cheque_a_2);
                
                $Obj->setName($request->name);
                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->update($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
*/
    public function gysaveajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $mapper = new Gyuser_Model_AdminDataMapper();
                $Obj = new Gyuser_Model_Admin();
                $Obj->setId($request->id);
                $Obj->setTiempo_ac_capital($request->tiempo_ac_capital);
                $Obj->setTiempo_ac_interior($request->tiempo_ac_interior);
                $Obj->setTiempo_ac_sistema($request->tiempo_ac_sistema);
                $Obj->setGastos_denuncia($request->gastos_denuncia);
                $Obj->setGastos_rechazo($request->gastos_rechazo);
                $Obj->setGastos_general($request->gastos_general);
                $Obj->setGastos_interior($request->gastos_interior);
                $Obj->setImpuesto_al_cheque($request->impuesto_al_cheque);
                $Obj->setCrm_operation_notify_span($request->crm_operation_notify_span);
                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function undercontructionAction() {
        //$this->_helper->layout->disableLayout ();
    }

    public function plansAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_PlansDataMapper();
                $opeObj = $mapper->fetchAll();

                $this->view->pArr = $opeObj;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function plansformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_PlansDataMapper();
                $Obj = new Gyuser_Model_Plans();
                $Obj->setPayments_qty($request->payments_qty);
                $Obj->setRecurrence($request->recurrence);

                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function plansdeleteajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_PlansDataMapper();
                $Obj = new Gyuser_Model_Plans();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function interestAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_InterestsDataMapper();
                $opeObj = $mapper->fetchAll();

                $this->view->pArr = $opeObj;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function interestformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_InterestsDataMapper();
                $Obj = new Gyuser_Model_Interests();
                $Obj->setRate($request->rate);


                if ($request->id) {
                    $Obj->setId($request->id);
                }

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function interestdeleteajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_InterestsDataMapper();
                $Obj = new Gyuser_Model_Interests();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function tasasAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_TasasDataMapper();
                $opeObj = $mapper->fetchAll();

                $this->view->pArr = $opeObj;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    public function tasasformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_TasasDataMapper();
                $Obj = new Gyuser_Model_Tasas();
                $Obj->setRate($request->rate);
                if ($request->id) {
                    $Obj->setId($request->id);
                }
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $id = $mapper->save($Obj);
                if ($id) {
                    echo $id;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    public function tasasdeleteajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_TasasDataMapper();
                $Obj = new Gyuser_Model_Tasas();
                $Obj->setId($request->id);

                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->delete($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function getoperationstatesAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $mapper = new Gyuser_Model_OperationsStateDataMapper();
                $result = $mapper->fetchAllArr();
                echo json_encode($result);
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function notificationbyopchangeAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $mapper = new Gyuser_Model_NotificationsDataMapper();
                $obj = new Gyuser_Model_Notifications();
                $obj->setTitle($request->title);
                $obj->setOperator_id($request->operator_id);
                $result = $mapper->SaveByOpChange($obj);

                echo 'tes';
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function dashboardAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $authDetail = $sessionNamespace->authDetail;

                $oprType = $authDetail->getType();                
                $this->view->oprType = $oprType;
                $this->view->oprId = $authDetail->getId();
                if ($oprType == 1) {
                    /*
                    $cMapper = new Gyuser_Model_OtherCavesDataMapper();
                    $cObj = new Gyuser_Model_OtherCaves();
                    $cObj->setId(1);
                    $cList = $cMapper->GetCaveById($cObj);
                    $this->view->cList = $cList;
                    $sMapper = new Gyuser_Model_SupplierOperationsDataMapper();
                    $sList = $sMapper->GetAllSuppliers();
                    */
                    
                    $pMapper = new Gyuser_Model_ProvidersDataMapper();
                    $this->view->pList = $pMapper->getProviders();
                    
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $cObj = new Gyuser_Model_Cheques();
                    $cObj->setStatus(1);
                    $this->view->ctAmount = $cMapper->GetTotalAmountByStats($cObj);
                    $cObj->setStatus(4);
                    $this->view->cpAmount = $cMapper->GetTotalAmountByStats($cObj);

                    $sMapper = new Gyuser_Model_OperationsDataMapper();
                    $current_date = date('Y-m-d');
                    
      /*************************************** Operaciones widget values   *****************************/
                    
                    $this->view->CurrentMonthHalfCave = $sMapper->GetOperationsAmount(findFirstAndLastDay($current_date), true);

                    $this->view->CurrentMonth = $sMapper->GetOperationsAmount(findFirstAndLastDay($current_date), true);
                    $this->view->CurrentQuarter = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfCurrentQuater($current_date), true);
                    $this->view->CurrentSemester = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfCurrentSemester($current_date), true);
                    $this->view->CurrentYear = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfCurrentYear($current_date), true);
                                        
                    $this->view->PrevMonthToDate = $sMapper->GetOperationsAmount(prevFirstAndCurrentDay($current_date), true);
                    $this->view->PrevQuaterToDate = $sMapper->GetOperationsAmount(findFirstAndLastCurrentDatesOfPrevQuater($current_date), true);
                    $this->view->PrevSemesterToDate = $sMapper->GetOperationsAmount(findFirstAndLastCurrentDatesOfPrevSemester($current_date), true);
                    $this->view->PrevYearToDate = $sMapper->GetOperationsAmount(findFirstAndLastCurrentDatesOfPrevYear($current_date), true);
                    
                    $PrevMonthTotal = $sMapper->GetOperationsAmount(findPrevMonthFirstAndLastDay($current_date), true, true);
                    $PrevQuaterTotal = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfPrevQuater($current_date), true, true);
                    $PrevSemesterTotal = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfPrevSemester($current_date), true, true);
                    $PrevYearTotal = $sMapper->GetOperationsAmount(findFirstAndLastDatesOfPrevYear($current_date), true, true);
                    
                    $this->view->PrevMonthTotal = $PrevMonthTotal;
                    $this->view->PrevQuaterTotal = $PrevQuaterTotal;
                    $this->view->PrevSemesterTotal = $PrevSemesterTotal;
                    $this->view->PrevYearTotal = $PrevYearTotal;
                    
                    $this->view->PrevMonthToDateAvg = $sMapper->GetOperationsAmountAvg(findPrevMonthFirstAndLastDay($current_date), findFirstAndLastDay($current_date), $PrevMonthTotal);
                    $this->view->PrevQuaterToDateAvg = $sMapper->GetOperationsAmountAvg(findFirstAndLastDatesOfPrevQuater($current_date), findFirstAndLastDatesOfCurrentQuater($current_date), $PrevQuaterTotal);
                    $this->view->PrevSemesterToDateAvg = $sMapper->GetOperationsAmountAvg(findFirstAndLastDatesOfPrevSemester($current_date), findFirstAndLastDatesOfCurrentSemester($current_date), $PrevSemesterTotal);
                    $this->view->PrevYearToDateAvg = $sMapper->GetOperationsAmountAvg(findFirstAndLastDatesOfPrevYear($current_date), findFirstAndLastDatesOfCurrentYear($current_date), $PrevYearTotal);

                    $OperationsAmountByPrevMonths = $sMapper->GetOperationsAmountByPrevMonths($current_date, 4);
                    $this->view->OperationsAmountByPrevMonths = json_encode($OperationsAmountByPrevMonths, JSON_FORCE_OBJECT);
                    
     /************************************ EOF Operaciones widget values   ***********************************/
                    
                    $AmounByPayedCheques = $cMapper->GetAmounByPayedCheques();
                    $AmounByPayedCheques0To30Days = $cMapper->GetAmounByPayedCheques0To30Days();
                    $AmounByPayedCheques30To60Days = $cMapper->GetAmounByPayedCheques30To60Days();
                    $AmounByPayedCheques60To90Days = $cMapper->GetAmounByPayedCheques60To90Days();
                    $AmounByPayedCheques120Days = $cMapper->GetAmounByPayedCheques120Days();

                    $this->view->AmounByPayedCheques = $AmounByPayedCheques;
                    $this->view->AmounByPayedCheques0To30Days = $AmounByPayedCheques0To30Days;
                    $this->view->AmounByPayedCheques30To60Days = $AmounByPayedCheques30To60Days;
                    $this->view->AmounByPayedCheques60To90Days = $AmounByPayedCheques60To90Days;
                    $this->view->AmounByPayedCheques120Days = $AmounByPayedCheques120Days;

                    $AmounByChequesStatusAcredited = $cMapper->GetAmounByChequesStatusAcredited($current_date);
                    $ChequeAmountByPrevMonths = $cMapper->GetChequeAmountByPrevMonths($current_date, 4);

                    $this->view->AmounByChequesStatusAcredited = $AmounByChequesStatusAcredited;
                    $this->view->ChequeAmountByPrevMonths = $ChequeAmountByPrevMonths;

                    $RejectedChequesBalanceByCal = $cMapper->GetRejectedChequesBalanceByCal();
                    $PrecOfRejectedChequesByPassed = $cMapper->GetPrecOfRejectedChequesByPassed();
                    $RejectedChequesBalanceByCaves = $cMapper->getRejectedChequesBalance();//GetRejectedChequesBalanceByCaves();
                    $RejectedChequesBalanceByCavesAndMonths = $cMapper->GetRejectedChequesBalanceByCavesAndMonths($current_date, 4);
                    
                    /*
                    $AmounByPayedCheques0To30DaysByCaves = $cMapper->GetAmounByPayedCheques0To30DaysByCaves();
                    $AmounByPayedCheques30To60DaysByCaves = $cMapper->GetAmounByPayedCheques30To60DaysByCaves();
                    $AmounByPayedCheques60To90DaysByCaves = $cMapper->GetAmounByPayedCheques60To90DaysByCaves();
                    $AmounByPayedChequesAfter90DaysByCaves = $cMapper->GetAmounByPayedChequesAfter90DaysByCaves();
                    $this->view->AmounByPayedCheques0To30DaysByCaves = $AmounByPayedCheques0To30DaysByCaves;
                    $this->view->AmounByPayedCheques30To60DaysByCaves = $AmounByPayedCheques30To60DaysByCaves;
                    $this->view->AmounByPayedCheques60To90DaysByCaves = $AmounByPayedCheques60To90DaysByCaves;
                    $this->view->AmounByPayedChequesAfter90DaysByCaves = $AmounByPayedChequesAfter90DaysByCaves;
                    */
                    $this->view->amountsPassedByDates = $cMapper->getEachAmountPassedByDates(); 

                    $this->view->RejectedChequesBalanceByCal = $RejectedChequesBalanceByCal;
                    $this->view->PrecOfRejectedChequesByPassed = $PrecOfRejectedChequesByPassed;
                    $this->view->RejectedChequesBalanceByCaves = $RejectedChequesBalanceByCaves;
                    $this->view->RejectedChequesBalanceByCavesAndMonths = $RejectedChequesBalanceByCavesAndMonths;
                }

                /* notification tasks starts */
                $tasksModel = new Gyuser_Model_CRMTasks();

                $this->view->myTasks = $tasksModel->getMyTasks();
                //$this->view->pending = $tasksModel->getMyPendingTasks();
                if ($oprType == 1) {
                    $this->view->adminPending = $tasksModel->getMyPendingTasks(true);
                    $this->view->adminMonitor = $tasksModel->getAdminMonitor();
                    $this->view->completedTasks = FALSE;
                } else {
                    $this->view->adminPending = FALSE;
                    $this->view->adminMonitor = FALSE;
                    $this->view->completedTasks = $tasksModel->getCompletedTasks();
                }
                $this->view->oprType = $oprType;
                /* notification tasks ends */
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function holidaysAction() {
        try {
            $sessionNamespace = new Zend_Session_Namespace();
            if ($sessionNamespace->loginAuth == true) {
                $mapper = new Gyuser_Model_HolidaysDataMapper();
                $cList = $mapper->fetchAll();
                $this->view->clist = $cList;
            } else {
                $this->_helper->redirector('login', 'index', 'gyuser');
            }
        } catch (Exception $e) {
            echo $e;
        }
        
    }

    public function holidaysformajaxAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_HolidaysDataMapper();
                $Obj = new Gyuser_Model_Holidays();
                $_holidays_json = $request->holidays_json;
                $Obj->setHoliday_json($_holidays_json);
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = $mapper->SaveWithJson($Obj);
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function getholidaysAction() {
        try {
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {

                $mapper = new Gyuser_Model_HolidaysDataMapper();
                $Obj = new Gyuser_Model_Holidays();
                $this->_helper->layout->disableLayout();
                $this->_helper->viewRenderer->setNoRender();
                $result = json_encode($mapper->fetchAllJson());
                if ($result) {
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    //********************************************** OP TERCEROS **********************************************//
    public function createtercerosopajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();  
            if ($this->getRequest()->isPost()) {
                
                //1. create operation
                $mapper = new Gyuser_Model_OperationsDataMapper ();
                $Obj = new Gyuser_Model_Operations ();
                $Obj->setClient_id($request->client_id);
                //format date to yyyy-mm-dd
                list ( $Day, $Month, $Year ) = explode('/', $request->date);
                $stampeddate = mktime(12, 0, 0, $Month, $Day, $Year);
                $realDate = date("Y-m-d", $stampeddate);

                $Obj->setDate($realDate);
                $Obj->setAmount($request->total_amount);  
                $Obj->setTasa_porcentual($request->tasa_anual);
                /*
                $Obj->setState($request->state);
                $Obj->setObservations($request->observations);
                $Obj->setCave_id($request->cave);
                $Obj->setBank_account_id($request->bank_account_id);                
                if ($request->id)
                    $Obj->setId($request->id);      
                 * 
                 */          
                $chequesList = $request->cheques_list; 
                $opId = $mapper->createTercerosOp($Obj, $chequesList);
                
                $mapper = new Gyuser_Model_AdminDataMapper();
                $mapper->sendPedidoInformesOpTerceros($opId);
                
                if (!$opId)
                    throw Exception("Hubo un error al crear la operación de cheques de terceros.");
                
                echo $opId; // return op id so that it counts as success                 
            } 
            else 
                throw Exception("Hubo un error al enviar el formulario.");
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function setinformeterceroajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                $chequeId = $request->cheque_id;
                $opId = (int) $request->operation_id;
                $approved = $request->approved;
                $report = $request->report;
                $mapper = new Gyuser_Model_ChequesDataMapper();
                $result = $mapper->setChequeInforme($chequeId, $approved, $report);
                $opMapper = new Gyuser_Model_OperationsDataMapper();
                if ($approved == '0') //not approved
                    $opMapper->updateOpAmount($opId);
                
                $opMapper->OpTercerosStateChange($opId, 5); //if all cheques finished approval it will set op. cerrada con cliente (ready to deliver).        
                if ($result) {                    
                    echo $result;
                } else {
                    echo "f";
                }
            }
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function sendtercerosopajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();  
            if ($this->getRequest()->isPost()) {                
                $mapper = new Gyuser_Model_OperationsDataMapper();                
                $tasaAnual = $request->tasa_anual;
                $opId = $request->operation_id;
                $success = $mapper->OpTercerosStateChange($opId, 6, $tasaAnual); //6 = 'ingresar cheques'
                if ($success)
                    echo $success; // returns 1 if success, 2 if state was already changed
                elseif (!$success)
                    throw Exception("Hubo un error al enviar la operación con cheques de terceros.");
            } 
            else 
                throw Exception("Hubo un error al enviar el formulario.");
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function consolidatetercerosopajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();  
            if ($this->getRequest()->isPost()) {                
                $mapper = new Gyuser_Model_OperationsDataMapper();    
                $opId = $request->operation_id;
                $chequesListJson = $request->cheques_json;
                $success = $mapper->OpTercerosStateChange($opId, 9, null, $chequesListJson); //6 = 'ingresar cheques'
                if ($success)
                    echo $success; // returns 1 if success, 2 if state was already changed
                elseif (!$success)
                    throw Exception("Hubo un error al enviar la operación con cheques de terceros.");
            } 
            else 
                throw Exception("Hubo un error al enviar el formulario.");
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    public function gettercerosopdetailsajaxAction() {
        try {
            $this->_helper->layout->disableLayout();
            $this->_helper->viewRenderer->setNoRender();
            $request = $this->getRequest();
            if ($this->getRequest()->isPost()) {
                //$liqId = (int) $request->liquidaciones_id;
                
                //if ($liqId) {                    
                    /*
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
                    if($status == 2 || $status == 1) 
                        $liqDate = $lqList['date'];
                    else //is 0 = not committed. Set date as today
                        $liqDate = date('Y-m-d');
                     * 
                     */
                    //$chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($liqId, $provData, $liqDate);
                
                $opId = (int) $request->operation_id;
                $cMapper = new Gyuser_Model_ChequesDataMapper();
                $chequesList = $cMapper->GetChequesByOpIdJson($opId);
                $result = array(
                    //'provData' => $provDataJson,
                    //'liquidacion' => $liquidacion,
                    'chequesList' => $chequesList,
                );

                if ($result)
                    echo json_encode($result);
                else
                    echo 'f';                    
            }
                 
        } catch (Exception $e) {
            echo $e;
        }
    }
    //********************************************** EOF OP TERCEROS **********************************************//

    
}

function findFirstAndLastDay($anyDate) {
    //$anyDate         =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $timeStamp = mktime(0, 0, 0, $mn, 1, $yr);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, $dt, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-d', $lastDayTimeStamp); // Find last day of the month
    $Month = date('M', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay", "$Month"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfCurrentQuater($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3) {
        $newMN = 1;
    } else if ($mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 4;
    } else if ($mn == 7 || $mn == 8 || $mn == 9) {
        $newMN = 7;
    } else if ($mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 10;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $mn, $dt, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-d', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfCurrentSemester($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3 || $mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 1;
    } else if ($mn === 7 || $mn == 8 || $mn == 9 || $mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 7;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $mn, $dt, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfCurrentYear($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    $timeStamp = mktime(0, 0, 0, 1, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    
    /*list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $mn, $dt, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month    
     */
    $arrDay = array("$firstDay", "$anyDate"); // return the result in an array format.

    return $arrDay;
}

//Prev To Date
function prevFirstAndCurrentDay($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $timeStamp = mktime(0, 0, 0, $mn - 1, 1, $yr);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, $dt, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-d', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndCurrentDateOfPrevQuater($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3) {
        $newMN = 10;
        $newYR = (int) $newYR - 1;
    } else if ($mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 1;
    } else if ($mn == 7 || $mn == 8 || $mn == 9) {
        $newMN = 4;
    } else if ($mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 7;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m + 2, 1, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastCurrentDatesOfPrevQuater($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3) {
        $newMN = 10;
        $currentMN = 1;
        $newYR = (int) $newYR - 1;
    } else if ($mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 1;
        $currentMN = 4;
    } else if ($mn == 7 || $mn == 8 || $mn == 9) {
        $newMN = 4;
        $currentMN = 7;
    } else if ($mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 7;
        $currentMN = 10;
    }

    $dayGaps = DaysGap("$yr-$currentMN-01", $anyDate);
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-d', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, $dayGaps, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-d', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastCurrentDatesOfPrevSemester($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3 || $mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 7;
        $newYR = (int) $newYR - 1;
        $currentMN = 1;
    } else if ($mn === 7 || $mn == 8 || $mn == 9 || $mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 1;
        $currentMN = 7;
    }

    $dayGaps = DaysGap("$yr-$currentMN-01", $anyDate);
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-d', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, $dayGaps, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-d', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastCurrentDatesOfPrevYear($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr - 1;
    $dayGaps = DaysGap("$yr-01-01", $anyDate);
    $timeStamp = mktime(0, 0, 0, 1, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-d', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, $dayGaps, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findPrevMonthFirstAndLastDay($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn === 1) {
        $newYR = (int) $newYR - 1;
        $newMN = 12;
    } else {
        $newMN = (int) $newMN - 1;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m, 1, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $Month = date('M', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay", "$Month"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfPrevQuater($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3) {
        $newMN = 10;
        $newYR = (int) $newYR - 1;
    } else if ($mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 1;
    } else if ($mn == 7 || $mn == 8 || $mn == 9) {
        $newMN = 4;
    } else if ($mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 7;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m + 2, 1, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfPrevSemester($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr;
    if ($mn == 1 || $mn == 2 || $mn == 3 || $mn == 4 || $mn == 5 || $mn == 6) {
        $newMN = 7;
        $newYR = (int) $newYR - 1;
    } else if ($mn === 7 || $mn == 8 || $mn == 9 || $mn == 10 || $mn == 11 || $mn == 12) {
        $newMN = 1;
    }
    $timeStamp = mktime(0, 0, 0, $newMN, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, $m + 5, 1, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function findFirstAndLastDatesOfPrevYear($anyDate) {
    //$anyDate            =    '2009-08-25';    // date format should be yyyy-mm-dd
    list($yr, $mn, $dt) = explode('-', $anyDate);    // separate year, month and date
    $newMN = $mn = (int) $mn;
    $newYR = $yr - 1;
    $timeStamp = mktime(0, 0, 0, 1, 1, $newYR);    //Create time stamp of the first day from the give date.
    $firstDay = date('Y-m-d', $timeStamp);    //get first day of the given month
    list($y, $m, $t) = explode('-', date('Y-m-t', $timeStamp)); //Find the last date of the month and separating it
    $lastDayTimeStamp = mktime(0, 0, 0, 12, 1, $y); //create time stamp of the last date of the give month
    $lastDay = date('Y-m-t', $lastDayTimeStamp); // Find last day of the month
    $arrDay = array("$firstDay", "$lastDay"); // return the result in an array format.

    return $arrDay;
}

function month_lang($month) {
    $month_lang = array(
        'Jan' => 'Enero',
        'Feb' => 'Febrero',
        'Mar' => 'Marzo',
        'Apr' => 'Abril',
        'May' => 'Mayo',
        'Jun' => 'Junio',
        'Jul' => 'Julio',
        'Aug' => 'Agosto',
        'Sep' => 'Septiembre',
        'Oct' => 'Octubre',
        'Nov' => 'Noviembre',
        'Dec' => 'Diciembre',
    );
    return $month_lang[$month] ? $month_lang[$month] : $month;
}

function DaysGap($start, $end) {
    //("2011-03-07", "2011-06-06").'days';
    $start_ts = strtotime($start);
    $end_ts = strtotime($end);
    $diff = $end_ts - $start_ts;
    return round($diff / 86400);
}
