<?php

class Gyuser_Model_NotificationsDataMapper {

    protected $_dbTable;

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
            $this->setDbTable('Gyuser_Model_DbTable_Notifications');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Notifications $Notifications) {
        $data = array(
            'payments_qty' => $Notifications->getPayments_qty(),
            'recurrence' => $Notifications->getRecurrence()
        );
        if (null === ($id = $Notifications->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find($id, Gyuser_Model_Notifications $Notifications) {
        /* $result = $this->getDbTable()->find($id);
          if (0 == count($result)) {
          return;
          }
          $row = $result->current();
          $Notifications->setId($row->id)
          ->setEmail($row->email)
          ->setComment($row->comment)
          ->setCreated($row->created); */
    }

    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'payments_qty',
            'recurrence',
        ));
        $select->where('status = ?', true);
        $select->order('payments_qty ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {
            $entry = new Gyuser_Model_Notifications();
            $entry->setId($row->id);
            $entry->setPayments_qty($row->payments_qty);
            $entry->setRecurrence($row->recurrence);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function delete(Gyuser_Model_Notifications $obj) {
        $table = $this->getDbTable();
        $where = $table->getAdapter()->quoteInto('id = ?', $obj->getId());
        $result = $table->delete($where);
        return $result;
    }

    public function SaveByOpChange(Gyuser_Model_Notifications $obj) {
        $opMapper = new Gyuser_Model_OperationsDataMapper();
        $opObj = new Gyuser_Model_Operations();
        $opObj->setId($obj->getOperator_id());
        $opResult = $opMapper->GetStateByOperationId($opObj);
        if ($opResult) {
            $state_name = $opResult['state_name'];
            $state_change = $opResult['state_change'];
            $client_id = $opResult['client_id'];

            $obj->setComment($state_name);
            $obj->setAction_date($state_change);
            $obj->setClient_id($client_id);
        }
        $sessionNamespace = new Zend_Session_Namespace();
        $operatorId = null;
        if ($sessionNamespace->loginAuth == true) {
            $authDetail = $sessionNamespace->authDetail;
            $operatorId = $authDetail->getId();
        }
        $data = array(
            'title' => $obj->getTitle(),
            'comment' => $obj->getComment(),
            'operator_id' => $operatorId,
            'action_date' => $obj->getAction_date(),
            'client_id' => $obj->getClient_id(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function SaveWhenRejected(Gyuser_Model_Notifications $obj) {
        $opMapper = new Gyuser_Model_OperationsDataMapper();
        $opObj = new Gyuser_Model_Operations();
        $opObj->setId($obj->getOperator_id());
        $opResult = $opMapper->GetStateByOperationId($opObj);
        if ($opResult) {
            $state_name = $opResult['state_name'];
            $state_change = $opResult['state_change'];
            $client_id = $opResult['client_id'];
            $obj->setClient_id($client_id);
        }
        $sessionNamespace = new Zend_Session_Namespace();
        $operatorId = null;
        if ($sessionNamespace->loginAuth == true) {
            $authDetail = $sessionNamespace->authDetail;
            $operatorId = $authDetail->getId();
        }
        $data = array(
            'title' => $obj->getTitle(),
            'comment' => $obj->getComment(),
            'operator_id' => $operatorId,
            'action_date' => $obj->getAction_date(),
            'client_id' => $obj->getClient_id(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['operation_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    //NOTE! originally created in CRMTasks class but since it has a constructor
    //      that gets info from the cookies, it didn't work when it was called
    //      from the cron job.
    public function createDailyTasks() 
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
                        $query = "SELECT C.date, C.check_n, C.amount, O.client_id FROM cheques AS C JOIN operations AS O ON (C.operation_id = O.id) WHERE C.date = '$DATE'  ";
                        break;
                }
                $stmt = $db->query($query);                    
                $clients = $stmt->fetchAll();
                if (count($clients) > 0) {
                    foreach ($clients AS $client) {
                        if($event['event_type'] == 5) { //recordatorio de pago
                            $data['client_id'] = $client['client_id'];
                            $data['ref_date'] = $client['date'];
                            $data['extra'] = 'Cheque N'.$client['check_n'].' '.$client['date'].' $'.$client['amount'];
                        }
                        else {
                            $data['client_id'] = $client['id'];
                            $data['ref_date'] = $client['the_date'];
                        }                        
                        $db->insert('Notifications', $data);
                    }
                }
                
                echo var_dump($data) . '<br/><br/>';
            }
        }
    }
}

