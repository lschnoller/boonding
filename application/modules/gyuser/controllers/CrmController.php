<?php

class Gyuser_CrmController extends Zend_Controller_Action {

    private $sessionNamespace;
    private $authDetail;

    public function init() {
        /* Initialize action controller here */
        $sessionNamespace = new Zend_Session_Namespace();
        if ($sessionNamespace->loginAuth == true) {
            $authDetail = $sessionNamespace->authDetail;
            $this->view->authDetail = $authDetail;
        }
    }

    public function indexAction() {
        try {
            $cMapper = new Gyuser_Model_ClientTypesDataMapper ();
            $cList = $cMapper->fetchAll();

            $adminObj = new Gyuser_Model_Admin();
            $adminObj->setId(1);
            $adminMapper = new Gyuser_Model_AdminDataMapper();
            $adminObj = $adminMapper->find($adminObj);

            $userType = new Gyuser_Model_UserType ();

            $this->view->admin = $adminObj;
            $this->view->authDetail = $this->authDetail;
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function indexeventsAction() {
        try {
            $constantsModel = new Gyuser_Model_CrmConstants();
            $this->view->event_typeArray = $constantsModel->getEventTypes();
            $this->view->event_actionArray = $constantsModel->getEventActions();
            $this->view->eventUnitArray = $constantsModel->getSpanUnit();
            $this->view->operatorArray = $constantsModel->getOperatorTypes();

            $form = new Gyuser_Model_CrmEvents();
            $data = $form->getNewForm($this->getRequest()->getPost());
            if (true === $data) {
                $this->_helper->flashMessenger()->addMessage('Event Created');
                $this->_helper->redirector->gotoUrlAndExit('crm/indexevents');
            }
            $this->view->form = $data;
            $this->view->list = $form->getList();
        } catch (Exception $e) {
            echo $e;
        }
    }

    public function eventeditAction() {
        $this->_helper->ViewRenderer->setScriptAction('indexevents');
        $constantsModel = new Gyuser_Model_CrmConstants();
        $this->view->event_typeArray = $constantsModel->getEventTypes();
        $this->view->event_actionArray = $constantsModel->getEventActions();
        $this->view->eventUnitArray = $constantsModel->getSpanUnit();
        $this->view->operatorArray = $constantsModel->getOperatorTypes();

        $form = new Gyuser_Model_CrmEvents();

        if (false === ($id = $this->_getParam('param1', false))) {
            throw new Exception('Tampered URI');
        }
        $data = $form->getEditForm($this->getRequest()->getPost(), $id);
        if (true === $data) {
            $this->_helper->flashMessenger()->addMessage('Details Saved');
            $this->_helper->redirector->gotoUrlAndExit('/crm/indexevents');
        }
        $this->view->edit = TRUE;
        $this->view->form = $data;
        $this->view->list = $form->getList();
    }

    public function eventdeleteAction() {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);

        if (false === ($id = $this->_getParam('param1', false))) {
            throw new Exception('Tampered URI');
        }
        $form = new Gyuser_Model_CrmEvents();
        $data = $form->deleteElemet($id);
        if ($data) {
            $return['status'] = 'success';
            $return['message'] = 'Item successfully deleted';
        } else {
            $return['status'] = 'error';
            $return['message'] = 'Error on delete! Please try again.';
        }
        echo json_encode($return);
    }

    public function eventsignoffAction() {
        try {
            $this->_helper->layout()->disableLayout();
            $this->_helper->viewRenderer->setNoRender(true);

            //_event_id, _operator_id,_item_id
            if (false === ($notify_id = $this->_getParam('param1', false))) {
                throw new Exception('Tampered URI');
            }
            $status = $_POST['status'];
            $comment = $_POST['comment'];
            $date = $_POST['date'];
            if (strpos($date, '/')) { //is in dd/mm/yyyy format
                $dateArr = explode('/', $date); //divide date
                $date = date("Y-m-d", strtotime($dateArr[1].'/'.$dateArr[0].'/'.$dateArr[2])); //set month first then day
            }
            
            $form = new Gyuser_Model_CRMTasks();
            $data = $form->signOffEvent($notify_id, $status, $comment);
            if ($status == 2) {
                $form->delayTheEvent($notify_id, $date);
            }
            if ($data) {
                $return['status'] = 'success';
                $return['html'] = $form->getEventAsHtml($notify_id);
            } else {
                $return['status'] = 'error';
                $return['message'] = 'Esta tarea ya fue realizada por otro operador. Por favor refresque la página para ver el estado actual de las tareas pendientes.';
            }
            echo json_encode($return);
        } catch(Exception $e) {
            echo $e;
        }
    }

    public function clientinfosignoffAction() {
        $this->_helper->layout()->disableLayout();
        
        $client_id = $this->_getParam('param1', false);
        $notification_id = $this->_getParam('param2', false);
        //_event_id, _operator_id,_item_id
        if (false === $client_id || false === $notification_id) {
            throw new Exception('Tampered URI');
        }
        $model = new Gyuser_Model_CRMTasks();
        if(!$model->isDone($notification_id)) {
            $this->_helper->ViewRenderer->setScriptAction('client-info-signoff');

            $this->view->notificationId = $notification_id;
            $this->view->clientId = $client_id;
            $this->view->clientHistory = $model->getClientHistory($client_id);
            
            //echo $client_id;
            $client = new Gyuser_Model_User();
            $client->setId($client_id);
            $mapper = new Gyuser_Model_UserDataMapper();
            $this->view->clientInfo = $mapper->ClientDetailsById($client);
        } else {//the task was already done
            $this->_helper->viewRenderer->setNoRender(true);
            $data['status'] = -1; //task already done by other operator
            $data['notificationId'] =  $notification_id;            
            echo json_encode($data);
            //echo -1;
        }
        
        return 0;
    }
    
    public function clientinfoAction() {
        $this->_helper->layout()->disableLayout();
        $this->_helper->ViewRenderer->setScriptAction('client-info');

        //_event_id, _operator_id,_item_id
        if (false === ($client_id = $this->_getParam('param1', false))) {
            throw new Exception('Tampered URI');
        }
        //echo $client_id;
        $client = new Gyuser_Model_User();
        $client->setId($client_id);
        $mapper = new Gyuser_Model_UserDataMapper();
        $this->view->clientInfo = $mapper->ClientDetailsById($client);
        
        $model = new Gyuser_Model_CRMTasks();
        $this->view->clientId = $client_id;
        $this->view->clientHistory = $model->getClientHistory($client_id);
    }

    public function cronAction() {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $model = new Gyuser_Model_CRMTasks();
        $model->setDailyTasks();
    }

    public function submitoperatorcommentAction() {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $model = new Gyuser_Model_CRMTasks();
        try {
            $operator_id = $model->operator_id;
            $constants = new Gyuser_Model_CrmConstants();
            $operatorArray = $constants->getOperators();
            $client_id = $_POST['client_id'];
            $comment = $_POST['comment'];
            $model->insertOperatorComment($client_id, $comment);
            $return['status'] = 'success';
            $return['html'] = '<li>
                                    <h2>Comentario <span class="action-date">' . date('H:i:s') . '</span></h2>
                                    <p>' . $comment . ' <span class="action-operator">' . $operatorArray[$operator_id] . '</span></p>
                            </li>';
        } catch (Exception $e) {
            $return['status'] = 'error';
            $return['message'] = $e;
        }

        echo json_encode($return);
    }

    public function getoperationsmonitorAction() {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $tasksModel = new Gyuser_Model_CRMTasks();

        $CRMCheckSpan = $tasksModel->getCRMCheckSpan();

        try {
            $operations = $tasksModel->getOperationsMonitor($CRMCheckSpan);
            $return['status'] = 'success';
            $return['html'] = $tasksModel->operationsArrayToHtml($operations, $CRMCheckSpan);
            $return['html'] .= $tasksModel->getLiquidacionesToHTML();
        } catch (Exception $e) {
            $return['status'] = 'error';
            $return['message'] = $e;
        }

        echo json_encode($return);
    }

}