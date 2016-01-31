<?php

class Gyuser_Model_CRMTasks {
    private $db;
    public $operator_id;
    private $operator_type;
    protected $_dbTable;
    
    
    public function __construct(array $options = null) {
        $this->db = Zend_Db_Table::getDefaultAdapter();
        $sessionNamespace = new Zend_Session_Namespace();
        $authDetail = $sessionNamespace->authDetail;
        $this->operator_id = $authDetail->getId();
        $this->operator_type = $authDetail->getType();
    }
    
    
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

    public function getMyTasks() 
    {
        $list = FALSE;
        $constants = new Gyuser_Model_CrmConstants();
        $operator_id = $this->operator_id;
        $operator_type = $this->operator_type;
        $operator_typeArray = $constants->getOperatorTypes();
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();
        $operatorArray = $constants->getOperators();
        //$operationArray = $constants->getOperations();
        $today = date('Y-m-d');
        
        //NOTE! the inner join with the CRM_Events table is to filter all records that don't correspond to an existing CRM_Event
        $query = "SELECT N.*,C.first_name, C.last_name FROM Notifications AS N JOIN clients AS C ON (C.id = N.client_id) INNER JOIN CRM_Events ON N.event_id = CRM_Events.id WHERE event_id IS NOT NULL AND $operator_type <= N.operator_type AND N.due_date <= '$today' AND N.status = 0 ORDER BY due_date";

        $stmt = $this->db->query($query);
        $rows = $stmt->fetchAll();
        if (count($rows) > 0) {
            foreach ($rows AS $event) {
                $list[$event['id']]['operator_type'] = $event['operator_type'];
                $list[$event['id']]['operator_type_name'] = $operator_typeArray[$event['operator_type']];
                $list[$event['id']]['event_id'] = $event['event_id'];
                $list[$event['id']]['status'] = $event['status'];
                $list[$event['id']]['reason'] = $event_typeArray[$event['event_type']];
                $list[$event['id']]['operator_id'] = $event['operator_id'];
                $list[$event['id']]['operator'] = (isset($operatorArray[$event['operator_id']])) ? $operatorArray[$event['operator_id']] : 0;
                $list[$event['id']]['client_id'] = $event['client_id'];
                $list[$event['id']]['extra'] = $event['extra'];
                $list[$event['id']]['due_date'] = $event['due_date'];
                $list[$event['id']]['action'] = $event_actionArray[$event['event_action']];
                $list[$event['id']]['name'] = $event['first_name'] . ' ' . $event['last_name'];
                $list[$event['id']]['ref_date'] = date('D, M j', strtotime($event['ref_date']));
                $list[$event['id']]['origin_id'] = $event['origin_id'];
            }
        }
        return $list;
    }

    public function getMyPendingTasks($isAdmin = false) {
        $list = FALSE;
        $constants = new Gyuser_Model_CrmConstants();
        $operator_id = $this->operator_id;
        $operator_type = $this->operator_type;
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();
        $operatorArray = $constants->getOperators();
        $operatorTypeArray = $constants->getOperatorTypes();
        //$operationArray = $constants->getOperations();
        $today = date('Y-m-d');
        $WHERE = " N.operator_type = $operator_type AND ";
        if ($isAdmin)
            $WHERE = "";
        $query = "SELECT N.*,C.first_name, C.last_name FROM Notifications AS N JOIN clients AS C ON (C.id = N.client_id) WHERE event_id IS NOT NULL AND $WHERE N.due_date < '$today' AND N.status = 0";
        $stmt = $this->db->query($query);
        $rows = $stmt->fetchAll();
        if (count($rows) > 0) {
            foreach ($rows AS $event) {
                @$list[$event['id']]['operator_type'] = $operatorTypeArray[$event['operator_type']];
                @$list[$event['id']]['event_id'] = $event['event_id'];
                @$list[$event['id']]['status'] = $event['status'];
                @$list[$event['id']]['reason'] = $event_typeArray[$event['event_type']];
                @$list[$event['id']]['operator_id'] = $event['operator_id'];
                @$list[$event['id']]['operator'] = (isset($operatorArray[$event['operator_id']])) ? $operatorArray[$event['operator_id']] : 0;
                @$list[$event['id']]['client_id'] = $event['client_id'];
                @$list[$event['id']]['extra'] = $event['extra'];
                @$list[$event['id']]['due_date'] = date('D, M j', strtotime($event['due_date']));
                @$list[$event['id']]['action'] = $event_actionArray[$event['event_action']];
                @$list[$event['id']]['name'] = $event['first_name'] . ' ' . $event['last_name'];
                @$list[$event['id']]['ref_date'] = date('D, M j', strtotime($event['ref_date']));
                @$list[$event['id']]['origin_id'] = $event['origin_id'];
            }
        }

        return $list;
    }

    public function getAdminMonitor() {
        if ($this->operator_type != 1)
            return false;

        $list = FALSE;
        $constants = new Gyuser_Model_CrmConstants();
        $operator_id = $this->operator_id;
        $operator_type = $this->operator_type;
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();
        $operatorArray = $constants->getOperators();
        //$operationArray = $constants->getOperations();
        $today = date('Y-m-d');
        $start = date('Y-m-d', strtotime('-2 DAY'));
        $query = "SELECT N.*,C.first_name, C.last_name FROM Notifications AS N JOIN clients AS C ON (C.id = N.client_id) WHERE DATE(N.action_date) BETWEEN '$start' AND '$today' AND N.status > 0 ORDER BY operator_id = $operator_id DESC, action_date DESC";
        $stmt = $this->db->query($query);
        $rows = $stmt->fetchAll();
        if (count($rows) > 0) {
            foreach ($rows AS $event) {
                $list[$event['operator_id']]['name'] = (isset($operatorArray[$event['operator_id']])) ? $operatorArray[$event['operator_id']] : 0;
                //$list[$event['operator_id']]['id'] = $event['operator_id'];
                $list[$event['operator_id']][$event['id']]['status'] = $event['status'];
                $list[$event['operator_id']][$event['id']]['event_type'] = $event['event_type'];
                $list[$event['operator_id']][$event['id']]['client_id'] = $event['client_id'];
                $list[$event['operator_id']][$event['id']]['extra'] = $event['extra'];
                $list[$event['operator_id']][$event['id']]['comment'] = $event['comment'];
                $list[$event['operator_id']][$event['id']]['due_date'] = $event['due_date'];
                $list[$event['operator_id']][$event['id']]['action_date'] = $event['action_date'];
                $list[$event['operator_id']][$event['id']]['event_action'] = $event['event_action'];
                $list[$event['operator_id']][$event['id']]['first_name'] = $event['first_name'];
                $list[$event['operator_id']][$event['id']]['last_name'] = $event['last_name'];                
                $list[$event['operator_id']][$event['id']]['ref_date'] = date('D, M j', strtotime($event['ref_date']));
            }
        }
        return $list;
    }

    public function getCompletedTasks() {
        $operator_id = $this->operator_id;
        
        $constants = new Gyuser_Model_CrmConstants();
        $operatorTypeArray = $constants->getOperatorTypes();
        $operatorArray = $constants->getOperators();
        /*
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();        
        */
        $DATE = date('Y-m-d');
        $list = array();
        $query = "SELECT N.*,C.first_name, C.last_name FROM Notifications AS N JOIN clients AS C ON (C.id = N.client_id) WHERE N.operator_id = $operator_id AND DATE(action_date) = '$DATE' AND N.status > 0 ORDER BY action_date DESC";
        $stmt = $this->db->query($query);
        $tasks = $stmt->fetchAll();
        if (count($tasks) > 0) {
            foreach ($tasks AS $event) {
                $list[$event['id']]['operator_type'] = $operatorTypeArray[$event['operator_type']];
                $list[$event['id']]['event_id'] = $event['event_id'];
                $list[$event['id']]['status'] = $event['status'];
                $list[$event['id']]['event_type'] = $event['event_type'];
                $list[$event['id']]['operator_id'] = $event['operator_id'];
                $list[$event['id']]['operator'] = (isset($operatorArray[$event['operator_id']])) ? $operatorArray[$event['operator_id']] : 0;
                $list[$event['id']]['client_id'] = $event['client_id'];
                $list[$event['id']]['extra'] = $event['extra'];
                $list[$event['id']]['comment'] = $event['comment'];
                $list[$event['id']]['due_date'] = date('D, M j', strtotime($event['due_date']));
                $list[$event['id']]['event_action'] = $event['event_action'];
                $list[$event['id']]['first_name'] = $event['first_name'];
                $list[$event['id']]['last_name'] = $event['last_name'];
                $list[$event['id']]['ref_date'] = date('D, M j', strtotime($event['ref_date']));                
                $list[$event['id']]['action_date'] = $event['action_date'];
            }
        }
        return $list;
    }

    public function getEventAsHtml($id) {
        $query = "SELECT N.*,C.first_name, C.last_name FROM Notifications AS N JOIN clients AS C ON (C.id = N.client_id) WHERE N.id = $id";
        $stmt = $this->db->query($query);
        $val = $stmt->fetch();
        
        return $this->createCompletedTaskHtml($val);        
    }

    public function createCompletedTaskHtml($val) 
    {        
        $constants = new Gyuser_Model_CrmConstants();
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        
        $thumbs = '';
        if ($val['status'] == 1)
            //$thumbs = '<img src="/images/thumb-up.png">';
            $thumbs = '<span class="thumb-up" style="cursor:default" title="Tarea realizada">&nbsp;</span>';
        elseif ($val['status'] == 2)
            //$thumbs = '<img src="/images/thumb-down.png">';            
            $thumbs = '<span class="thumb-down" style="cursor:default" title="Tarea reprogramada">&nbsp;</span>';
        $extra = '';
        if ($val['extra'] != '')
            $extra = '<span class="ref-date">[' . $val['extra'] . ']</span>';                                    
        $comment = '';
        if ($val['comment'] != '')
            $comment = '<p class="comment-box-open"><span style="text-decoration:underline">Observaciones:</span> '.$val['comment'].'</p>';
        else
            $comment = '';

        if(date('Y-m-d', strtotime($val['action_date'])) == date('Y-m-d', strtotime('now')) ) {
            $time = date('H:i', strtotime($val['action_date']));
            $action_date = "<strong>Hoy $time</strong> - ";
        }
        elseif(date('Y-m-d', strtotime($val['action_date'])) == date('Y-m-d', strtotime('-1 day')) ) {
            $time = date('H:i', strtotime($val['action_date']));
            $action_date = "<strong>Ayer $time</strong> - ";
        }
        else
            $action_date = '<strong>'.date('d/m', strtotime($val['action_date'])).'</strong> - ';

        $li = '<li>
                <span class="ref-date">' . $action_date . '</span> '.$event_actionArray[$val['event_action']]. ' <a href="/crm/clientinfo/' . $val['client_id'] . '" class="client-info">'.$val['first_name'].' '.$val['last_name'].'</a> por ' . strtolower($event_typeArray[$val['event_type']]) .' '. $extra .' '. $thumbs
                .$comment
               .'</li>';
        return $li;
    }
    
    public function signOffEvent($notify_id, $status, $comment) {
        $stmt = $this->db->query("SELECT * FROM Notifications WHERE id = $notify_id AND status > 0");
        $rows = $stmt->fetchAll();
        if (count($rows) > 0) {
            return FALSE;
        } else {
            $operator_id = $this->operator_id;
            $action_date = date('Y-m-d H:i:s');
            $this->db->query("UPDATE Notifications SET operator_id = $operator_id , status = $status, comment = '$comment', action_date = '$action_date' WHERE id = $notify_id ");
            return TRUE;
        }
    }

    //NOTE! moved to Notifications data mapper so that it doesn't need to 
    //      use the constructor and access cookies (this would make the 
    //      cron fail.
    /*
    public function setDailyTasks() 
    {
        $constants = new Gyuser_Model_CrmConstants();
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();
        $operatorArray = $constants->getOperators();
        $operatorTypeArray = $constants->getOperatorTypes();
        $query = "SELECT * FROM CRM_Events WHERE status = 1 ORDER BY event_type";
        $db = Zend_Db_Table::getDefaultAdapter();
        $stmt = $db->query($query);
        $rows = $stmt->fetchAll();
        $INSERT = FALSE;
        if (count($rows) > 0) {
            foreach ($rows AS $event) {
                $eventId = $event['id'];                
                $DATE = date('Y-m-d', strtotime($constants->getEventTypeSign($event['event_type']) . ' ' . $event['event_span_count'] . ' ' . $event['event_span_unit']));
                // DELETE LATER
                //$DATE = date('Y-m-d' ,strtotime($DATE . " - $window DAY"));
                // 1 = 'Follow up potencial';
                // 2 = 'Follow up pasivo';
                // 3 = 'Payment due';
                $data['event_id'] = $event['id'];
                $data['event_type'] = $event['event_type'];
                $data['operator_type'] = $event['operator_id'];
                $data['event_action'] = $event['event_action'];
                $data['operator_id'] = 0;
                $data['client_id'] = '';
                $data['status'] = 0;
                $data['extra'] = '';
                $data['ref_date'] = date('Y-m-d');
                $data['due_date'] = date('Y-m-d');

                switch((int) $event['event_type']) {
                    case 1:  //seguimiento a cliente potencial
                        $query = "SELECT id, DATE(type_change) AS the_date FROM clients WHERE client_type IN (1,2) AND DATE(type_change) = '$DATE' AND status = 1";
                        break;
                    case 2: //seguimiento a cliente pasivo
                        $query = "SELECT id, DATE(type_change) AS the_date FROM clients WHERE client_type = 5 AND DATE(type_change) = '$DATE' AND status = 1";
                        break;
                    case 3: //seguimiento a cliente activo
                        $query = "SELECT id, DATE(type_change) AS the_date FROM clients WHERE client_type = 3 AND DATE(type_change) = '$DATE' AND status = 1";
                        break;
                    case 4: //seguimiento a cliente en cobranza
                        $query = "SELECT id, DATE(type_change) AS the_date FROM clients WHERE client_type = 4 AND DATE(type_change) = '$DATE' AND status = 1";
                        break;
                    case 5: //seguimiento por recordatorio de pago
                        $query = "SELECT C.date,O.client_id,C.amount FROM cheques AS C JOIN operations AS O ON (C.operation_id = O.id) WHERE C.date = '$DATE'  ";
                        break;
                }
                $stmt = $db->query($query);                    
                $clients = $stmt->fetchAll();
                if (count($clients) > 0) {
                    foreach ($clients AS $client) {
                        if($event['event_type'] == 5) { //recordatorio de pago
                            $data['client_id'] = $client['client_id'];
                            $data['ref_date'] = $client['date'];
                            $data['extra'] = $client['amount'];
                        }
                        else {
                            $data['client_id'] = $client['id'];
                            $data['ref_date'] = $client['the_date'];
                        }                        
                        $db->insert('Notifications', $data);
                    }
                }
                /*
                if ($event['event_type'] == 1) { //seguimiento a cliente potencial
                    //$stmt = $this->db->query("SELECT id, DATE(added_in_system) AS the_date FROM clients WHERE status IN (1,2) AND DATE(date_added) = '$DATE' ");
                    $stmt = $this->db->query("SELECT id, type_change AS the_date FROM clients WHERE client_type IN (1,2) AND DATE(type_change) = '$DATE' AND status = 1");                    
                    $clients = $stmt->fetchAll();
                    if (count($clients) > 0) {
                        foreach ($clients AS $client) {
                            $data['client_id'] = $client['id'];
                            $data['ref_date'] = $client['the_date'];
                            $this->db->insert('Notifications', $data);
                        }
                    }
                } elseif ($event['event_type'] == 2) { //seguimiento a cliente pasivo
                    //$stmt = $this->db->query("SELECT C.date,O.client_id FROM cheques AS C JOIN operations AS O ON (C.operation_id = O.id) JOIN clients AS CI ON (CI.id = O.client_id AND CI.client_type = 3) WHERE C.date = '$DATE' AND (C.status = 2 OR (C.status = 3 AND C.balance = 0) ) ");
                    $stmt = $this->db->query("SELECT id, DATE(added_in_system) AS the_date FROM clients WHERE client_type IN (1,2) AND DATE(type_change) = '$DATE' AND status = 1");                    
                    $clients = $stmt->fetchAll();
                    if (count($clients) > 0) {
                        foreach ($clients AS $client) {
                            $data['client_id'] = $client['client_id'];
                            $data['ref_date'] = $client['date'];
                            $this->db->insert('Notifications', $data);
                        }
                    }
                } elseif ($event['event_type'] == 3) { //recordatorio de pago
                    $stmt = $this->db->query("SELECT C.date,O.client_id,C.amount FROM cheques AS C JOIN operations AS O ON (C.operation_id = O.id) WHERE C.date = '$DATE'  ");
                    $clients = $stmt->fetchAll();
                    if (count($clients) > 0) {
                        foreach ($clients AS $client) {
                            $data['client_id'] = $client['client_id'];
                            $data['ref_date'] = $client['date'];
                            $data['extra'] = $client['amount'];
                            $this->db->insert('Notifications', $data);
                        }
                    }
                }
                 * 
                 */
                /*
                echo var_dump($data) . '<br/><br/>';
            }
        }
    }
*/
    
    public function getClientHistory($id) 
    {
        $constants = new Gyuser_Model_CrmConstants();
        $event_typeArray = $constants->getEventTypes();
        $event_actionArray = $constants->getEventActions();
        $eventUnitArray = $constants->getSpanUnit();
        $operatorArray = $constants->getOperators();
        $operatorTypeArray = $constants->getOperatorTypes();

        $list = false;
        $stmt = $this->db->query("SELECT * FROM Notifications WHERE client_id = $id AND action_date IS NOT NULL ORDER BY action_date DESC,due_date");
        $notifications = $stmt->fetchAll();
        if (count($notifications) > 0) {
            foreach ($notifications AS $notification) 
            {
                $dias = array ('Lunes', 'Martes', 'Miércoles','Jueves', 'Viernes', 'Sábado', 'Domingo'); 
                $meses = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
                $datetime = strtotime($notification['action_date']);
                $numDia = date('N', $datetime) -1;
                $numMes = date('n',  $datetime) -1;
                $dia = $dias[$numDia];
                $mes = $meses[$numMes];
                $dateFormat = $dia.' '.date('j',$datetime).' de '.$mes;
                if((int)date('Y',$datetime) < (int)date('Y'))
                    $dateFormat .= ' de '.date('Y',$datetime);
                $list[$notification['id']]['status'] = $notification['status'];
                //$list[$notification['id']]['action_date'] = date('D, M j H:i', strtotime($notification['action_date']));
                $list[$notification['id']]['action_date'] = $dateFormat;
                $list[$notification['id']]['due_date'] = date('D, M j', strtotime($notification['due_date']));
                $list[$notification['id']]['ref_date'] = date('D, M j', strtotime($notification['ref_date']));
                $list[$notification['id']]['comment'] = $notification['comment'];
                $list[$notification['id']]['extra'] = $notification['extra'];
                if (isset($notification['event_type']))
                //if($notification['event_type'] > 0)
                    $list[$notification['id']]['title'] = $event_typeArray[$notification['event_type']] . '(' . $event_actionArray[$notification['event_action']] . ')';
                else
                    $list[$notification['id']]['title'] = $notification['title'];
                $list[$notification['id']]['operator'] = $operatorArray[$notification['operator_id']];
            }
        }
        return $list;
    }
    
    public function getCRMCheckSpan() {
        $query = "SELECT crm_operation_notify_span FROM admin WHERE id = 1";
        $stmt = $this->db->query($query);
        $row = $stmt->fetch();
        return $row['crm_operation_notify_span'];
    }

    public function getOperationsForTodayAndDelayed($CRMCheckSpan) {
        $list = FALSE;
        $TIME = date('Y-m-d H:i:s', strtotime("- $CRMCheckSpan MINUTES"));
        $query = "SELECT O.id,O.state_order_id,O.state_change,OS.name,C.first_name,C.last_name,O.client_id FROM operations AS O JOIN operations_state AS OS ON (O.state_order_id = OS.order_id) JOIN clients AS C ON (C.id = O.client_id) WHERE O.state_order_id IN (1,2,4,5,6,7,8) AND O.state_change < '$TIME' ORDER BY state_change DESC ";
        $stmt = $this->db->query($query);
        $operations = $stmt->fetchAll();

        if (count($operations) > 0) {
            foreach ($operations AS $o) {
                $list[$o['id']]['state'] = $o['state_order_id'];
                $list[$o['id']]['client'] = $o['first_name'] . ' ' . $o['last_name'];
                $list[$o['id']]['state_name'] = $o['name'];
                $list[$o['id']]['state_change'] = $o['state_change'];
            }
        }
        return $list;
    }
    
    public function getOperationsMonitor($CRMCheckSpan) {
        $list = FALSE;
        //$TIME = date('Y-m-d H:i:s', strtotime("- $CRMCheckSpan MINUTES"));
        //$query = "SELECT O.id,O.state_order_id,O.state_change,OS.name,C.first_name,C.last_name,O.client_id FROM operations AS O JOIN operations_state AS OS ON (O.state_order_id = OS.order_id) JOIN clients AS C ON (C.id = O.client_id) WHERE O.state_order_id IN (1,2,4,5,6,7,8) AND O.state_change < '$TIME' ORDER BY state_change DESC ";
        $query = "SELECT O.id,O.state_order_id,O.state_change,OS.name,C.first_name,C.last_name,O.client_id FROM operations AS O JOIN operations_state AS OS 
            ON (O.state_order_id = OS.order_id) JOIN clients AS C ON (C.id = O.client_id) WHERE DATE(O.state_change) = DATE(NOW()) 
            OR O.state_order_id IN (1,2,4,5,6,7,8) ORDER BY state_change DESC";
        
        //the where clause says if the op state change happened today or if it happened 30 minutes ago and it's not a final state
        $stmt = $this->db->query($query);
        $operations = $stmt->fetchAll();

        if (count($operations) > 0) {
            foreach ($operations AS $o) {
                $list[$o['id']]['state'] = $o['state_order_id'];
                $list[$o['id']]['client'] = $o['first_name'] . ' ' . $o['last_name'];
                $list[$o['id']]['state_name'] = $o['name'];
                $list[$o['id']]['state_change'] = $o['state_change'];
            }
        }
        return $list;
    }

    public function operationsArrayToHtml($array, $CRMCheckSpan) {
        $html = '';
        if (is_array($array)) {
            foreach ($array AS $key => $val) {
                $delayedClass = "";
                if( strtotime($val['state_change']) < strtotime("- $CRMCheckSpan MINUTES") && ($val['state'] != 9 && $val['state'] != 10 && $val['state'] != 99) )  //
                    $delayedClass = " class='delayedOperation'";
                
                if( date('Y-m-d', strtotime($val['state_change'])) == date('Y-m-d', strtotime('now')) )
                    $state_change_date = '<strong>hoy</strong>';
                else
                    $state_change_date = 'el <strong>'.date('d/m', strtotime($val['state_change'])).'</strong>';
                
                $state_change_time = date('H:i', strtotime($val['state_change']));                
                $html .= "<li$delayedClass>La operaci&oacute;n <strong>$key</strong> de <strong>" . $val['client'] . "</strong> está en estado <strong>" . $val['state_name'] . "</strong> desde $state_change_date a las <strong>$state_change_time hs</strong></li>";
            }
        } else {
            $html = '<li>No hay tareas demoradas.</li>';
        }
        return $html;
    }
    
    public function getLiquidacionesToHTML() {
        $list = FALSE;
        $query = "SELECT liquidaciones.id, liquidaciones.date_delivered, providers.name, liquidaciones.committed FROM liquidaciones JOIN providers ON liquidaciones.provider_id = providers.id WHERE DATE(liquidaciones.date_delivered) = DATE(NOW()) ";
        $stmt = $this->db->query($query);
        $liqs = $stmt->fetchAll();
        $liqData = '';
        if (count($liqs) > 0) {
            foreach ($liqs AS $liq) {
                if($liq['committed'] == 2)
                    $liqData .= "<li>La liquidaci&oacute;n <strong>{$liq['id']}</strong> con {$liq['name']} fue enviada en el día de la fecha.</li>";
                else if($liq['committed'] == 1)
                    $liqData .= "<li>La liquidaci&oacute;n <strong>{$liq['id']}</strong> con {$liq['name']} fue consolidada en el día de la fecha.</li>";                
                else if($liq['committed'] == 0)
                    $liqData .= "<li>La liquidaci&oacute;n <strong>{$liq['id']}</strong> con {$liq['name']} fue creada en el día de la fecha.</li>";
            }
        }
        return $liqData;
    }

    public function insertOperatorComment($client_id, $comment) {
        $data['operator_id'] = $this->operator_id;
        $data['operator_type'] = $this->operator_type;
        $data['client_id'] = $client_id;
        $data['title'] = '';
        $data['comment'] = $comment;
        $data['action_date'] = date('Y-m-d H:i:s');
        $this->db->insert('Notifications', $data);
    }

    public function getNotifications($id) {
        $query = "SELECT * FROM Notifications WHERE id = $id";
        $stmt = $this->db->query($query);
        $row = $stmt->fetch();
        return $row;
    }
    
    public function isDone($notificationId) {
        $query = "SELECT * FROM Notifications WHERE id = $notificationId AND status > 0";
        $stmt = $this->db->query($query);
        $row = $stmt->fetch();
        if($row)
            return true;
        else
            return false;
    }

    public function delayTheEvent($id, $date) {
        $notify = $this->getNotifications($id);
        $notify['id'] = NULL;
        $notify['comment'] = '';
        $notify['operator_id'] = 0;
        $notify['status'] = 0;
        $notify['action_date'] = NULL;
        $notify['due_date'] = $date;
        $notify['origin_id'] = $id;
        $this->db->insert('Notifications', $notify);
    }

}

