<?php

class Gyuser_Model_AdminDataMapper {

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
            $this->setDbTable('Gyuser_Model_DbTable_Admin');
        }
        return $this->_dbTable;
    }

    public function save(Gyuser_Model_Admin $obj) {

        $data = array(
            //'rejected_type_1_name'	=>  $obj->getRejected_type_1_name() ,
            //'rejected_type_1_cost'	=>  $obj->getRejected_type_1_cost() ,
            //'rejected_type_2_name'	=>  $obj->getRejected_type_2_name(),
            //'rejected_type_2_cost'	=>  $obj->getRejected_type_2_cost(),
            'tiempo_ac_capital' => $obj->getTiempo_ac_capital(),
            'tiempo_ac_interior' => $obj->getTiempo_ac_interior(),
            'tiempo_ac_sistema' => $obj->getTiempo_ac_sistema(),
            'gastos_denuncia' => $obj->getGastos_denuncia(),
            'gastos_rechazo' => $obj->getGastos_rechazo(),
            'gastos_general' => $obj->getGastos_general(),
            'gastos_interior' => $obj->getGastos_interior(),
            'impuesto_al_cheque' => $obj->getImpuesto_al_cheque(),
            'crm_operation_notify_span' => $obj->getCrm_operation_notify_span(),
        );
        if (null === ($id = $obj->getId())) {
            unset($data['id']);
            $id = $this->getDbTable()->insert($data);
            return $id;
        } else {
            unset($data['user_id']);
            $id = $this->getDbTable()->update($data, array('id = ?' => $id));
            return $id;
        }
    }

    public function find(Gyuser_Model_Admin $obj) {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'rejected_type_1_name',
            //			'rejected_type_1_cost',
            'rejected_type_2_name',
            //			'rejected_type_2_cost',
            'tiempo_ac_capital',
            'tiempo_ac_interior',
            'tiempo_ac_sistema',
            'gastos_denuncia',
            'gastos_rechazo',
            'gastos_general',           
            'gastos_interior',
            'impuesto_al_cheque',
            'crm_operation_notify_span',
        ));

        $select->where('status = ?', true);
        $select->where('id = ?', $obj->getId());
        $row = $table->fetchRow($select);
        $entry = null;
        if ($row) {
            $entry = new Gyuser_Model_Admin();
            $entry->setId($row->id);
            //$entry->setRejected_type_1_cost($row->rejected_type_1_cost);
            $entry->setRejected_type_1_name($row->rejected_type_1_name);
            //$entry->setRejected_type_2_cost($row->rejected_type_2_cost);
            $entry->setRejected_type_2_name($row->rejected_type_2_name);
            $entry->setTiempo_ac_capital($row->tiempo_ac_capital);
            $entry->setTiempo_ac_interior($row->tiempo_ac_interior);
            $entry->setTiempo_ac_sistema($row->tiempo_ac_sistema);
            $entry->setGastos_denuncia($row->gastos_denuncia);
            $entry->setGastos_rechazo($row->gastos_rechazo);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setCrm_operation_notify_span($row->crm_operation_notify_span);
        }
        return $entry;
    }

    public function getAdminSettings() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'rejected_type_1_name',
            //'rejected_type_1_cost',
            'rejected_type_2_name',
            //'rejected_type_2_cost',
            'tiempo_ac_capital',
            'tiempo_ac_interior',
            'tiempo_ac_sistema',
            'gastos_denuncia',
            'gastos_rechazo',
            'gastos_general',           
            'gastos_interior',
            'impuesto_al_cheque',
            'crm_operation_notify_span',
            'mail_informes',
        ));

        $select->where('status = ?', true);
        $select->where('id = 1');
        $row = $table->fetchRow($select);
        $entry = null;
        if ($row) {
            $entry = new Gyuser_Model_Admin();
            $entry->setId($row->id);
            //$entry->setRejected_type_1_cost($row->rejected_type_1_cost);
            $entry->setRejected_type_1_name($row->rejected_type_1_name);
            //$entry->setRejected_type_2_cost($row->rejected_type_2_cost);
            $entry->setRejected_type_2_name($row->rejected_type_2_name);
            $entry->setTiempo_ac_capital($row->tiempo_ac_capital);
            $entry->setTiempo_ac_interior($row->tiempo_ac_interior);
            $entry->setTiempo_ac_sistema($row->tiempo_ac_sistema);
            $entry->setGastos_denuncia($row->gastos_denuncia);
            $entry->setGastos_rechazo($row->gastos_rechazo);
            $entry->setGastos_general($row->gastos_general);
            $entry->setGastos_interior($row->gastos_interior);
            $entry->setImpuesto_al_cheque($row->impuesto_al_cheque);
            $entry->setCrm_operation_notify_span($row->crm_operation_notify_span);
            $entry->setMail_informes($row->mail_informes);
        }
        return $entry;
    }
    
    public function fetchAll() {
        $table = $this->getDbTable();
        $select = $table->select();
        $select->from($table, array(
            'id',
            'name',
        ));
        $select->where('status = ?', true);
        $select->order('name ASC');
        $resultSet = $table->fetchAll($select);
        $entries = array();
        foreach ($resultSet as $row) {

            $entry = new Gyuser_Model_ClientTypes();
            $entry->setId($row->id);
            $entry->setName($row->name);
            $entries[] = $entry;
        }
        return $entries;
    }

    public function delete(Gyuser_Model_Admin $obj) {


        try {
            $table = $this->getDbTable();
            $set = array('status' => 0);
            $where = array('id = ?' => $obj->getId());
            $result = $table->update($set, $where);
            return $result;
        } catch (Exception $e) {

            echo $e;
        }
    }
    
    public function sendPedidoInformesOpTerceros($opId) {
        try {
            $mapper = new Gyuser_Model_ChequesDataMapper();
            $chequesList = $mapper->GetChequeDetailsByOpId($opId);
            
            $html = <<<EOT
                            <style type="text/css">      
                                .liq-table {
                                    border:1px solid #777;
                                }
                                .liq-table td, .liq-table th {                                
                                    border-top: 0px;
                                    border-right: 1px solid #e5e5e5;
                                    border-bottom: 1px solid #e5e5e5;
                                    border-left: 0px;
                                    border:1px solid #ccc;
                                    padding:3px 7px;
                                    font:12px Geneva, sans-serif;
                                    background-color:#fff;    
                                    white-space:nowrap;
                                }
                                td.liq-header {
                                    background-color:#777; 
                                    text-align:center;
                                    color:#fff;
                                    font:bold 13px Geneva, sans-serif;
                                    text-transform:uppercase;
                                    border-width:0;
                                    white-space:nowrap;
                                }
                                .liq-header2 td, .liq-header2 th{
                                    background-color:#f7f7f7;
                                }
                                .liq-header3 td, .liq-header3 th{
                                    background-color:#e3e3e3;
                                }
                                .liq-header2 td, .liq-header2 th, .liq-header3 td, .liq-header3 th{                                    
                                    font:bold 12px Geneva, arial, sans-serif;
                                    text-transform: uppercase
                                    white-space:nowrap;
                                }
                                .liq-footer td{
                                    background-color:#e3e3e3;
                                    font-weight:bold; 
                                    border-top:1px solid #333;
                                    white-space:nowrap;
                                }
                            </style>
EOT;
            
            $html .= <<<EOT
                    <h1 style="font:bold 26px arial, sans-serif">Pedidos de Informe</h1>
                     <table cellpadding="0" cellspacing="0" border="1" class="liq-table">
                        <thead>
                                <tr>
                                    <td colspan="12" class="liq-header">CHEQUES</td>
                                </tr>
                                <tr class="liq-header2">
                                        <th>TITULAR</th>
                                        <th>FECHA</th>
                                        <th>N. CHEQUE</th>
                                        <th>IMPORTE</th>
                                        <th>DNI</th>
                                        <th>CUIL</th>
                                        <th>EMPRESA</th>
                                        <th>N. CUENTA</th>
                                        <th>BANCO</th>
                                        <th>SUCURSAL</th>
                                        <th>C.P.</th>
                                        <th>FECHA APERTURA</th>
                                </tr>
                        </thead>
                           <tbody class="gridtbody">'
EOT;
            foreach ($chequesList as $cheque) {
                $chequeAmt = '$ '.number_format($cheque['amount'], 2, ',', '.');
                $html .= "<tr>                            
                            <td>{$cheque['first_name']} {$cheque['last_name']}</td>
                            <td>{$cheque['date']}</td>
                            <td>{$cheque['check_n']}</td>
                            <td>{$chequeAmt}</td>
                            <td>{$cheque['DNI']}</td>
                            <td>{$cheque['CUIL']}</td>
                            <td>{$cheque['business']}</td>
                            <td>{$cheque['account_n']}</td>
                            <td>{$cheque['bank_name']}</td>
                            <td>{$cheque['branch']}</td>
                            <td>{$cheque['zip_code']}</td>
                            <td>{$cheque['opening_date']}</td>
                        </tr>";
            }
            $html .= '</tbody>
                        </table><br />';
            
            
            //$param = array();
            //if ($status) {
            //    $param = array('compress' => 0, 'Attachment' => 0);
            //}
            $mail = new Zend_Mail('utf-8');
            /*
            $at = new Zend_Mime_Part($html);
            $at->type = 'application/vnd.ms-excel';
            $at->disposition = Zend_Mime::DISPOSITION_INLINE;
            $at->encoding = Zend_Mime::ENCODING_BASE64;
            $at->filename = $filename.'.xls';
             * 
             */
            $adminSettings = $this->getAdminSettings();
            $mail->addTo($adminSettings->getMail_informes());
            //$mail->addAttachment($at);
            $mail->setSubject('Cheques para aprobación');
            $mail->setBodyHtml($html);
            $mail->send();
            return 'success'; 
        } catch(Exception $e) {
            
        }
    }
}

