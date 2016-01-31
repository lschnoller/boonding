<?php

require_once '../library/Zend/dompdf/dompdf_config.inc.php';

class Gyuser_Model_PdfGeneratorDataMapper {
    
    public function PrintLiquidacion($liqId) {       
        echo $this->displayLiqTable($liqId);
        echo '<div style="margin-top:2em"><input style="font:24px georgia" type="button" onClick="window.print()" value="Imprimir"/></div>';
        return 'success';
    }

    public function CreatePDFforLiquidaciones($status, $liqId) {
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }
        $html = $this->displayLiqTable($liqId, $filename);

        $dompdf = new DOMPDF();
        $dompdf->load_html($html);
        $dompdf->render();
        $dompdf->stream($filename.'.pdf', $param);
        return 'success';
    }

    public function CreateExcelforLiquidaciones($status, $liqId) {
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }
        $html = $this->displayLiqTable($liqId, $filename);
        echo $html;

        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment; filename={$filename}.xls");
        header("Pragma: no-cache");
        header("Expires: 0");
    }

    public function SendExcelByMail($status, $liqId) {
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }
        $html = $this->displayLiqTable($liqId, $filename, $provEmail, $provName);

        $mail = new Zend_Mail('utf-8');
        $at = new Zend_Mime_Part($html);
        $at->type = 'application/vnd.ms-excel';
        $at->disposition = Zend_Mime::DISPOSITION_INLINE;
        $at->encoding = Zend_Mime::ENCODING_BASE64;
        $at->filename = $filename.'.xls';
        $mail->addTo($provEmail);
        $mail->addAttachment($at);
        $mail->setSubject('Notificación de Operación');
        $mail->setBodyHtml("<p>Estimados $provName:<br /><br />Buen día, este es un envío automático de la próxima operación que realizaremos. Para ver el archivo adjunto por favor descargalo (opcion DESCARGAR) en tu computadora y luego abrilo, si al abrir aparece algún aviso de error o de cambio de Formato,  simplemente dale 'SI' para afirmar que lo queres abrir, es que el envio llega en un formato WEB.<br /><br />
Espero la confirmación de que lo hayas recibido para combinar detalles de día y horario. <br /><br />
Saludo Cordialmente,<br /><br />
Gustavo Yurgel</p>");
        $mail->send();
        return 'success';
    }

    private function displayLiqTable($liqId, &$filename = null, &$provEmail = null, &$provName = null) {
        $pre_val = 0;
        $liqId = (int) $liqId;
        if ($liqId) {
            $lMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liqId);
            $lqList = $lMapper->GetLiquidacionesById($lObj);
            $provId = $lqList['provider_id'];
            $liqDate = $lqList['date'];

            $html = '
                     <table cellpadding="0" cellspacing="0" border="1" class="liq-table">
                        <thead>
                                <tr>
                                    <td colspan="6" class="liq-header">OPERACIONES COMPARTIDAS</td>
                                </tr>
                                <tr class="liq-header2">
                                        <th>FECHA OP.</th>
                                        <th>NOMBRE</th>
                                        <th>TOTAL</th>
                                        <th>GY</th>
                                        <th>COMISIONES</th>
                                        <th>SALDO</th>
                                </tr>
                        </thead>
                           <tbody class="gridtbody">';

            $oMapper = new Gyuser_Model_OperationsDataMapper();
            $oObj = new Gyuser_Model_Operations();
            $oObj->setLiquidacion_id($liqId);
            $opertationsList = $oMapper->GetOperationsByLiquidacionIdJson($oObj);
            $pArr = $opertationsList;
            $strBld = '';
            $pay_final_amount = 0;
            if (count($pArr)) {
                foreach ($pArr as $pRow) {
                    $pay_final_amount += $pRow['prov_payment'];
                    $halfAmt = number_format(($pRow['amount'] / 2), 2, '.', '');

                    $html .= "<tr >
                                    <td>{$pRow['date']}</td>
                                    <td>{$pRow['first_name']} {$pRow['last_name']}</td>
                                    <td>{$this->formatMoney($pRow['amount'])}</td>
                                    <td>{$this->formatMoney($halfAmt)}</td>
                                    <td>{$this->formatMoney($pRow['comision_amt'])}</td>
                                    <td>{$this->formatMoney($pRow['prov_payment'])}</td>
                            </tr>";
                }
            }

            $html .= '</tbody>
                            <tfoot>
                                <tr class="liq-footer"><td colspan="4">&nbsp;</td><td>TOTAL</td><td><span class="operationsTotal_span">' . $this->formatMoney($pay_final_amount). '</span></td></tr>
                            </tfoot>
                        </table><br />';

            $html .= '<table cellpadding="0" cellspacing="0" border="1" class="liq-table">
                        <thead>
                                <tr>
                                    <td colspan="6" class="liq-header">CHEQUES RECHAZADOS</td>
                                </tr>
                                <tr class="liq-header2">
                                        <th>TITULAR</th>
                                        <th>FECHA</th>
                                        <th>N. CHEQUE</th>
                                        <th>RECHAZOS</th>
                                        <th>GASTOS</th>
                                        <th>SALDO</th>
                                </tr>
                        </thead>
                           <tbody class="gridtbody">';

            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liqId);
            $cObj->setProvider_id($provId);
            $pArr = $cMapper->RejectedChequeByLiquidacionesIdForProv($cObj);
            $strBld = '';
            $sName = '';
            $rejectedTotal = 0;
            //$rejectedChequesFee = number_format($rejectedChequesFee,2,'.','');
            if (count($pArr)) {
                foreach ($pArr as $pRow) {
                    $cObj->setRejected_type($pRow['rejected_type']);
                    $cMapper = new Gyuser_Model_ChequesDataMapper();
                    $rejectedChequesFee = (int) $cMapper->GetRejectionCostForProv($cObj);
                    $amount = $pRow['amount'];
                    $rChequeWithFee = $amount + $rejectedChequesFee;
                    $rChequeWithFee = number_format($rChequeWithFee, 2, '.', '');
                    $rejectedTotal += $rChequeWithFee;
                    $pay_final_amount += $rChequeWithFee;

                    $rejectedChequesFee = number_format($rejectedChequesFee, 2, '.', '');

                    $strBld .= <<<EOT
                    <tr id="RejectedCheque_{$pRow['id']}">
                        <td class="user_operation_id">{$pRow['first_name']} {$pRow['last_name']}</td>
                        <td class="user_check_n">{$pRow['date']}</td>
                        <td class="user_bank_name">{$pRow['check_n']}</td>
                        <td class="user_amount">{$this->formatMoney($amount)}</td>
                        <td class="user_rejected_cheque_fee">{$this->formatMoney($rejectedChequesFee)}</td>
                        <td class="pay_amount_cls">{$this->formatMoney($rChequeWithFee)}</td>
                    </tr>
EOT;
                }
            }
            $pay_final_amountInv = $pay_final_amount * -1;
            $pre_val = $pre_val * -1;

            $html .= $strBld;
            $html .= '  </tbody>
                        <tfoot>
                            <tr class="liq-footer"><td colspan="4">&nbsp;</td><td>TOTAL</td><td>' .$this->formatMoney($rejectedTotal). '</td></tr>
                        </tfoot>
                    </table><br />';
            $html .= '
                <table cellpadding="0" cellspacing="0" border="1" class="liq-table">
                    <thead>
                        <tr>
                            <td colspan="9" class="liq-header">CALCULO DE DESCUENTO</td>
                        </tr>
                        <tr class="liq-header2">
                            <th>TITULAR</th>
                            <th>EMPRESA</th>
                            <th>FECHA</th>
                            <th>NUMERO</th>
                            <th>IMPORTE</th>
                            <th>CANT DIAS</th>
                            <th>IMP. AL CHEQUE</th>
                            <th>DESCUENTO</th>
                            <th>SALDO A HOY</th>
                        </tr>
                    </thead>
                    <tbody class="gridtbody">';
            if ($lqList['committed'] == 1 || $lqList['committed'] == 2)
                $provData = $lMapper->getProvData($lqList['id']);
            else {//not committed. Get values from provider today values
                $pMapper = new Gyuser_Model_ProvidersDataMapper();
                $provData = $pMapper->GetProviderByIdSimple($provId);
            }
            $checksList = $cMapper->GetChequeDetailsByLiquidacionIdJson($liqId, $provData, $liqDate);
            $totalFinalAmount = 0;
            foreach ($checksList as $item) {
                $html .= "<tr>
                            <td>{$item['first_name']} {$item['last_name']}</td>
                            <td>{$item['business']}</td>
                            <td>{$item['date']}</td>
                            <td>{$item['check_n']}</td>
                            <td>{$this->formatMoney($item['amount'])}</td>
                            <td>{$item['days']}</td>
                            <td>{$this->formatMoney($item['imp_al_cheque'])}</td>
                            <td>{$this->formatMoney($item['descuento'])}</td>
                            <td>{$this->formatMoney($item['today_value'])}</td>
                         </tr>";
            }
            $html .= "</tbody>";
            $cTotals = $cMapper->GetChequesTotalsJson($provId, $checksList, $provData, $liqDate);
            $html .= "<tfoot>
                        <tr class='liq-header3'><th>N. CHEQUES</th><th>DIAS PROM.</th><th>BRUTO</th><th>IMP. AL CHEQUE</th><th>INTERESES</th><th>GASTOS INT.</th><th>GASTOS CAP.</th><th>GASTOS OTROS</th><th>SUBTOTAL</th></tr>
                        <tr>
                            <td>{$cTotals['chequeChkCount']}</td>
                            <td>{$cTotals['dayAvg']}</td>
                            <td>{$this->formatMoney($cTotals['bruto'])}</td>
                            <td>{$this->formatMoney($cTotals['impuestoAlCheque'])}</td>
                            <td>{$this->formatMoney($cTotals['intereses'])}</td>
                            <td>{$this->formatMoney($cTotals['gastosInterior'])}</td>
                            <td>{$this->formatMoney($cTotals['gastosGeneral'])}</td>
                            <td>{$this->formatMoney($cTotals['gastosOtros'])}</td>
                            <td>{$this->formatMoney($cTotals['payingAmount'])}</td>
                        </tr>
                     </tfoot></table>";
            $html_style = <<<EOT
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
            $html_header = "<h1 style='font:bold 26px georgia, geneva'>Liquidacion {$lqList['id']}</h1>
                        <table cellpadding='0' cellspacing='0' border='1' class='liq-table'>
                            <tr><th style='text-align:right'>PROVEEDOR:</th><td>{$provData->getName()}</td></tr>
                            <tr><th style='text-align:right'>FECHA:</th><td>{$lqList['date']}</td></tr>
                            <tr><th style='text-align:right'>ACREDITACIONES:</th><td>{$this->formatMoney($lqList['acreditacion'])}</td></tr>
                            <tr><th style='text-align:right'>TOTAL A LIQUIDAR</th><td>{$this->formatMoney($lqList['amount_debt'])}</td></tr>
                            <tr><th style='text-align:right'>IMPORTE PAGADO:</th><td>{$this->formatMoney($lqList['amount_payed'])}</td></tr>
                            <tr><th style='text-align:right'>SALDO:</th><td>{$this->formatMoney($lqList['current_account_balance'])}</td></tr>
                        </table><br /><br />";
            $provEmail = $provData->getEmail();
            $provName = str_replace(' ', '-', $provData->getName());
            $liqDate = str_replace('/', '-', $liqDate);
            $filename = 'Liq' . $liqId . '_' . $provName . '_' . $liqDate;
            return $html_style . $html_header . $html;
        }
        else
            throw new Exception('liqId missing in display pdf generator -> displayTable function');
    }
    
    private function formatMoney($number) {
        //setlocale(LC_MONETARY, 'es_AR.65001');
        //setlocale(LC_MONETARY, 'it_IT');
        return '$ '.number_format($number, 2, ',', '.');
    }
        
    

    public function CreatePDF(Gyuser_Model_User $obj, $typeid, $status, $operationid) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }
        switch ($typeid) {
            case 1:
                $mapper = new Gyuser_Model_UserDataMapper();
                $result = $mapper->ClientDetailsById($obj);
                $fn = $result->getFirst_name();
                $ln = $result->getLast_name();
                $dni = $result->GetDNI();
                $html =
                        '<html><body>' .
                        '<table style="font-size:30px;font-weight:bold;font-family:Helvetica,Arial;">' .
                        '<tr>' .
                        '<td>Nombre</td>' .
                        '<td>: </td>' .
                        "<td>$fn</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>Apellido</td>' .
                        '<td>: </td>' .
                        "<td>$ln</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>DNI</td>' .
                        '<td>: </td>' .
                        "<td>$dni</td>" .
                        '</tr>' .
                        '</table>' .
                        '</body></html>';
                $dompdf = new DOMPDF();
                $dompdf->load_html($html);
                $dompdf->render();
                $dompdf->stream("Mutuo-1.pdf", $param);

                break;
            case 2:
                $mapper = new Gyuser_Model_UserDataMapper();
                $result = $mapper->ClientDetailsById($obj);
                $fn = $result->getFirst_name();
                $ln = $result->getLast_name();
                $dni = $result->GetDNI();


                $chequeObj = new Gyuser_Model_Cheques();
                $chequeObj->setOperation_id($operationid);

                $chequeMapper = new Gyuser_Model_ChequesDataMapper();
                $chequesList = $chequeMapper->GetChequeDetailsByUserId($chequeObj);

                $html =
                        '<html>
					  <style>
                                        .cheques{
                                            width:100%;
                                            border:1px solid #ccc;
                                        }
                                            .cheques td,.cheques th{
                                                    border:2px solid #ccc;
                                                    font-family:Helvetica,Arial;
                                                    padding:10px;
        				}
        				.cheques th{
        					font-size:20px;
        					font-weight:bold;
        				}
        				.h1Txt{
        					text-decoration:underline;
        					font-family:Helvetica,Arial;
        				}
					  </style>

					  <body>' .
                        '<table style="font-size:30px;font-weight:bold;font-family:Helvetica,Arial;">' .
                        '<tr>' .
                        '<td>Nombre</td>' .
                        '<td>: </td>' .
                        "<td>$fn</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>Apellido</td>' .
                        '<td>: </td>' .
                        "<td>$ln</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>DNI</td>' .
                        '<td>: </td>' .
                        "<td>$dni</td>" .
                        '</tr>' .
                        '</table><br/><br/>';
                if ($chequesList) {
                    $html .= '<table class="cheques"><tr><th>Fecha</th><th>Numero De Cheque</th><th>Importe</th></tr>';
                    foreach ($chequesList as $cheque) {
                        $html .= '<tr>';
                        $html .= '<td >' . $cheque['date'] . '</td>';
                        $html .= '<td >' . $cheque['check_n'] . '</td>';
                        $html .= '<td >' . $cheque['amount'] . '</td>';
                        $html .= '</tr>';
                    }
                    $html .= '</table>';
                }

                $html .= '</body></html>';
                $dompdf = new DOMPDF();
                $dompdf->load_html($html);
                $dompdf->render();
                $dompdf->stream("Mutuo-2.pdf", $param);

                break;
            case 3:
                $mapper = new Gyuser_Model_UserDataMapper();
                $result = $mapper->ClientDetailsById($obj);
                $fn = $result->getFirst_name();
                $ln = $result->getLast_name();
                $dni = $result->GetDNI();
                $telc = $result->getTel_cell_code() . ' ' . $result->getTel_cell();
                $tell = $result->getTel_lab_code() . ' ' . $result->getTel_lab();
                $telo = $result->getTel_otro_code() . ' ' . $result->getTel_otro();
                $telp = $result->getTel_part_code() . ' ' . $result->getTel_part();

                $chequeObj = new Gyuser_Model_Cheques();
                $chequeObj->setOperation_id($operationid);

                $chequeMapper = new Gyuser_Model_ChequesDataMapper();
                $chequesList = $chequeMapper->GetChequeDetailsByUserId($chequeObj);

                $addressMapper = new Gyuser_Model_AddressDataMapper();
                $addressObj = new Gyuser_Model_Address();
                $addressObj->setClient_id($clietid);
                $address = $addressMapper->GetDeliveryAddressByClientId($addressObj);

                $html =
                        '<html>
					  <style>
					    .cheques{
					    	width:100%;
					    	border:1px solid #ccc;
					    }
					  	.cheques td,.cheques th{
					  		border:2px solid #ccc;
					  		font-family:Helvetica,Arial;
					  		padding:10px;
        				}
        				.cheques th{
        					font-size:20px;
        					font-weight:bold;
        				}
        				.address td{
        					font-family:Helvetica,Arial;
					  		padding:10px;
					  		font-size:20px;
        				}
					  </style>

					  <body>' .
                        '<table style="font-size:30px;font-weight:bold;font-family:Helvetica,Arial;">' .
                        '<tr>' .
                        '<td>Nombre</td>' .
                        '<td>: </td>' .
                        "<td>$fn</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>Apellido</td>' .
                        '<td>: </td>' .
                        "<td>$ln</td>" .
                        '</tr>' .
                        '<tr>' .
                        '<td>DNI</td>' .
                        '<td>: </td>' .
                        "<td>$dni</td>" .
                        '</tr>' .
                        '</table><br/><br/><h1 class="h1Txt">Cheques</h1>';
                if ($chequesList) {
                    $html .= '<table class="cheques"><tr><th>Fecha</th><th>Numero De Cheque</th><th>Importe</th></tr>';
                    foreach ($chequesList as $cheque) {
                        $html .= '<tr>';
                        $html .= '<td >' . $cheque['date'] . '</td>';
                        $html .= '<td >' . $cheque['check_n'] . '</td>';
                        $html .= '<td >' . $cheque['amount'] . '</td>';
                        $html .= '</tr>';
                    }
                    $html .= '</table>';
                }
                $html .= '<br/><br/><h1 class="h1Txt">Domicilios</h1>';
                if ($address) {
                    $str = '';
                    $jsonData = $address;
                    $id = $jsonData['id'];
                    $street = $jsonData['street'];
                    $city = $jsonData['city'];
                    $state = $jsonData['state'];
                    $state_name = $jsonData['state_name'];
                    $country = $jsonData['country'];

                    $html .= '<table class="address">' .
                            '<tr>' .
                            '<td width="100">Domicilio</td><td> : </td><td>' . $street . '</td>' .
                            '</tr>' .
                            '<tr>' .
                            '<td>Barrio / Ciudad</td><td> : </td><td>' . $city . '</td>' .
                            '</tr>' .
                            '<tr>' .
                            '<td>Provincia</td><td> : </td><td>' . $state_name . '</td>' .
                            '</tr>' .
                            '<tr>' .
                            '<td>Tel�fono</td><td> : </td><td>' . $telc . '<br/>' . $tell . '<br/>' .
                            $telo . '<br/>' . $telp . '<br/></td>' .
                            '</tr>' .
                            '</table>';
                }
                $html .= '</body></html>';
                $dompdf = new DOMPDF();
                $dompdf->load_html($html);
                $dompdf->render();
                $dompdf->stream("Mutuo-3.pdf", $param);
                break;
            default:

                break;
        }
    }
    
/*
    public function CreatePDFforLiquidaciones(Gyuser_Model_Liquidaciones $obj, $status, $liquidaciones_id) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }

        $liquidaciones_id = (int) $liquidaciones_id;
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
            $html = '';

            $html .= '<h1>Liquidaciones</h1>
                        <table cellpadding="5" cellspacing="0" border="1">
                                <thead>
                                        <tr>
                                                <th>Id</th>
                                                <th>date</th>
                                                <th>current_account_balance  ($)</th>
                                                <th>amount_payed  ($)</th>

                                        </tr>
                                </thead>
                                   <tbody>';

            $html .= "<tr>
                            <td>{$lqList['id']} </td>
                            <td>{$lqList['date']}</td>
                            <td>{$lqList['current_account_balance']}</td>
                            <td>{$lqList['amount_payed']}</td>

                    </tr>";
        }

        $html .= '</tbody></table><br/>';
        $html .=
                '<h1>Operations with cave</h1><table cellpadding="5" cellspacing="0" border="1" >
                <thead>
                        <tr>
                                <th>NOMBRE</th>
                                <th>TOTAL ($)</th>
                                <th>GUSTAVO ($)</th>
                                <th>COMISIONES ($)</th>
                                <th>RECHAZOS ($)</th>
                                <th>GASTOS ($)</th>
                                <th>ACREDITACIONES</th>
                                <th>SALDOS ($)</th>
                        </tr>
                </thead>
                <tbody class="gridtbody">';

        $pArr = $opertationsList;
        $strBld = '';
        $pay_final_amount = 0;
        if (count($pArr)) {
            foreach ($pArr as $pRow) {

                $cavename = $pRow['cave_name'];
                $total = $pRow['amount'];
                $halfamout = $total / 2;
                $halfamout = number_format($halfamout, 2, '.', '');
                $commision = 15;
                $commisionAmount = $halfamout * $commision / 100;
                $commisionAmount = number_format($commisionAmount, 2, '.', '');
                $cave_pay = $halfamout - $commisionAmount;
                $cave_pay = number_format($cave_pay, 2, '.', '');
                $pay_final_amount += $cave_pay;

                $html .= "<tr >
                                <td class='user_amount'>{$cavename}</td>
                                <td class='user_amount'>{$total}</td>
                                <td class='user_amount'>{$halfamout}</td>
                                <td class='user_amount'> - {$commisionAmount}</td>
                                <td class='user_amount'></td>
                                <td class='user_amount'></td>
                                <td class='user_amount'></td>
                                <td class='user_amount'>{$cave_pay}</td>
                        </tr>";
            }
        }

        $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';

        $pArr = $rejectedCheques;
        $rejectedChequesFee = 60.00;
        $rejectedChequesFee = number_format($rejectedChequesFee, 2, '.', '');

        if (count($pArr)) {
            $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';
            foreach ($pArr as $pRow) {
                //$pRow	=	new Gyuser_Model_Cheques();
                $amount = $pRow['amount'];
                $rChequeWithFee = $amount + $rejectedChequesFee;
                $rChequeWithFee = number_format($rChequeWithFee, 2, '.', '');
                $pay_final_amount += $rChequeWithFee;

                $html .= "<tr  style='background:#E3E3E3;'>
                                    <td class='user_operation_id'>{$pRow['first_name']}<input type='hidden' value='}' name='operation_id'/></td>
                                    <td class='user_date'></td>
                                    <td class='user_check_n'></td>
                                    <td class='user_bank_name'></td>
                                    <td class='user_amount'>{$amount}</td>
                                    <td class='user_rejected_cheque_fee'>{$rejectedChequesFee}</td>
                                    <td class='user_bank_name'></td>
                                    <td class='user_bank_name'>$rChequeWithFee</td>
                            </tr>";
            }
            $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            $pay_final_amount = number_format($pay_final_amount, 2, '.', '');
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO EN CHEQUES</td><td style='background:#CCCCCC;'><b>$pay_final_amount</b><input type='hidden' id='pay_final_amount' value='$pay_final_amount' /></td></tr>";
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";
        }
        $html .= '</tbody></table>';
        $html .= '<br/><br/>
                <h1>CALCULO DE DESCUENTO - <span class="currentDate"></span></h1>
                <table  cellpadding="5" cellspacing="0" border="1" >
                        <thead>
                            <tr>
                                <th>TITULAR</th>
                                <th>FECHA</th>
                                <th>IMPORTE ($)</th>
                                <th>NUMERO ($)</th>
                                <th>BANCO</th>
                                <th>CANT DIAS</th>
                                <th>IMP. AL CHEQUE</th>
                                <th>DESCUENTO	SALDO A HOY</th>
                                <th>SALDO A HOY ($)</th>
                        </tr>
                </thead>
                <tbody class="gridtbody">';
        $totalFinalAmount = 0;
        foreach ($chequesList as $cheques) {
            $item = $cheques;
            $cave_name = $item['first_name'];
            $amount = floatval($item['amount']);
            $check_n = $item['check_n'];
            $bank_name = $item['bank_name'];
            $l_date = $item['liquidacion_date'];

            $acreditacion_hr = (int) $item['acreditacion_hrs'];
            $date = $item['date'];

            $date_arc = add_days_by_hr($date, $acreditacion_hr);
            $date_diff = dateDiff($l_date, $date_arc);
            $chqPer = $amount * 2.1 / 100;
            $discount = ($amount * 0.17 / 100) * $date_diff;
            $finalAmount = $amount - $chqPer - $discount;
            $finalAmount = number_format($finalAmount, 2, '.', '');
            $amount = number_format($amount, 2, '.', '');
            $chqPer = number_format($chqPer, 2, '.', '');
            $discount = number_format($discount, 2, '.', '');
            $commision = number_format($commision, 2, '.', '');

            $totalFinalAmount += $finalAmount;

            $html .= "<tr>
                        <td>$cave_name</td>
                        <td>$date</td>
                        <td>$amount</td>
                        <td>$check_n</td>
                        <td>$bank_name</td>
                        <td>$date_diff</td>
                        <td>$chqPer</td>
                        <td>$discount</td>
                        <td>$finalAmount</td>
                      </tr>";
        }
        $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
        $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
        $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";

        $html .= '</tbody></table>';

        $dompdf = new DOMPDF();
        $dompdf->load_html($html);
        $dompdf->render();
        $dompdf->stream("Liquidaciones Details.pdf", $param);
    }
*/

/*
    public function CreateAndSendMailExcelforLiquidaciones(Gyuser_Model_Liquidaciones $obj, $status, $liquidaciones_id) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }

        $liquidaciones_id = (int) $liquidaciones_id;
        if ($liquidaciones_id) {
            $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liquidaciones_id);
            $lqList = $cMapper->GetLiquidacionesById($lObj);

            $caveMapper = new Gyuser_Model_OtherCavesDataMapper();
            $caveObj = new Gyuser_Model_OtherCaves();
            $caveObj->setId($lqList['cave_id']);
            $cave = $caveMapper->GetCaveById($caveObj);

            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liquidaciones_id);
            $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);

            $rejectedCheques = $cMapper->RejectedChequeByLiquidacionesId($cObj);

            $cMapper = new Gyuser_Model_OperationsDataMapper();
            $cObj = new Gyuser_Model_Operations();
            $cObj->setLiquidacion_id($liquidaciones_id);
            $opertationsList = $cMapper->GetOperationsIdByLiquidacionIdJson($cObj);
            $html = '';
            $html .= '<h1>Liquidaciones</h1>
                        <table cellpadding="5" cellspacing="0" border="1">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>date</th>
                                    <th>current_account_balance  ($)</th>
                                    <th>amount_payed  ($)</th>
                                </tr>
                            </thead>
                                   <tbody>';




            $html .= "<tr>
                                <td>{$lqList['id']} </td>
                                <td>{$lqList['date']}</td>
                                <td>{$lqList['current_account_balance']}</td>
                                <td>{$lqList['amount_payed']}</td>

                        </tr>";


            $html .= '</tbody></table><br/>';
            $html .=
                    '<h1>Operations with cave</h1><table cellpadding="5" cellspacing="0" border="1" >
	<thead>
		<tr>
			<th>NOMBRE</th>
			<th>TOTAL ($)</th>
			<th>GUSTAVO ($)</th>
			<th>COMISIONES ($)</th>
			<th>RECHAZOS ($)</th>
			<th>GASTOS ($)</th>
			<th>ACREDITACIONES</th>
			<th>SALDOS ($)</th>
		</tr>
	</thead>
	   <tbody class="gridtbody">';

            $pArr = $opertationsList;
            $strBld = '';
            $pay_final_amount = 0;
            if (count($pArr)) {
                foreach ($pArr as $pRow) {

                    $cavename = $pRow['cave_name'];
                    $total = $pRow['amount'];
                    $halfamout = $total / 2;
                    $halfamout = number_format($halfamout, 2, '.', '');
                    $commision = 15;
                    $commisionAmount = $halfamout * $commision / 100;
                    $commisionAmount = number_format($commisionAmount, 2, '.', '');
                    $cave_pay = $halfamout - $commisionAmount;
                    $cave_pay = number_format($cave_pay, 2, '.', '');
                    $pay_final_amount += $cave_pay;

                    $html .= "<tr >
					<td class='user_amount'>{$cavename}</td>
					<td class='user_amount'>{$total}</td>
					<td class='user_amount'>{$halfamout}</td>
					<td class='user_amount'> - {$commisionAmount}</td>
					<td class='user_amount'></td>
					<td class='user_amount'></td>
					<td class='user_amount'></td>
					<td class='user_amount'>{$cave_pay}</td>
				</tr>";
                }
            }
            $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';

            $pArr = $rejectedCheques;
            $rejectedChequesFee = 60.00;
            $rejectedChequesFee = number_format($rejectedChequesFee, 2, '.', '');

            if (count($pArr)) {
                $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';
                foreach ($pArr as $pRow) {

                    //$pRow	=	new Gyuser_Model_Cheques();


                    $amount = $pRow['amount'];

                    $rChequeWithFee = $amount + $rejectedChequesFee;
                    $rChequeWithFee = number_format($rChequeWithFee, 2, '.', '');
                    $pay_final_amount += $rChequeWithFee;


                    $html .= "<tr  style='background:#E3E3E3;'>
					<td class='user_operation_id'>{$pRow['first_name']}<input type='hidden' value='}' name='operation_id'/></td>
					<td class='user_date'></td>
					<td class='user_check_n'></td>
					<td class='user_bank_name'></td>
					<td class='user_amount'>{$amount}</td>
					<td class='user_rejected_cheque_fee'>{$rejectedChequesFee}</td>
					<td class='user_bank_name'></td>
					<td class='user_bank_name'>$rChequeWithFee</td>
				</tr>";
                }





                if (count($pArr)) {
                    $html .= '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>-</td></tr>';



                    $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    $pay_final_amount = number_format($pay_final_amount, 2, '.', '');
                    $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO EN CHEQUES</td><td style='background:#CCCCCC;'><b>$pay_final_amount</b><input type='hidden' id='pay_final_amount' value='$pay_final_amount' /></td></tr>";
                    $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";
                }
            }

            $html .= '</tbody></table>';


            $html .= '<br/><br/>
<h1>CALCULO DE DESCUENTO - <span class="currentDate"></span></h1>
<table  cellpadding="5" cellspacing="0" border="1" >
	<thead>
		<tr>
			<th>TITULAR</th>
			<th>FECHA</th>
			<th>IMPORTE ($)</th>
			<th>NUMERO ($)</th>
			<th>BANCO</th>
			<th>CANT DIAS</th>
			<th>IMP. AL CHEQUE</th>
			<th>DESCUENTO	SALDO A HOY</th>
			<th>SALDO A HOY ($)</th>
		</tr>
	</thead>
	   <tbody class="gridtbody">';

            $totalFinalAmount = 0;
            foreach ($chequesList as $cheques) {
                $item = $cheques;
                $cave_name = $item['first_name'];
                $amount = floatval($item['amount']);
                $check_n = $item['check_n'];
                $bank_name = $item['bank_name'];
                $l_date = $item['liquidacion_date'];

                $acreditacion_hr = (int) $item['acreditacion_hrs'];
                $date = $item['date'];

                $date_arc = add_days_by_hr($date, $acreditacion_hr);
                $date_diff = dateDiff($l_date, $date_arc);
                $chqPer = $amount * 2.1 / 100;
                $discount = ($amount * 0.17 / 100) * $date_diff;
                $finalAmount = $amount - $chqPer - $discount;


                $finalAmount = number_format($finalAmount, 2, '.', '');
                $amount = number_format($amount, 2, '.', '');
                $chqPer = number_format($chqPer, 2, '.', '');
                $discount = number_format($discount, 2, '.', '');
                $commision = number_format($commision, 2, '.', '');

                $totalFinalAmount += $finalAmount;

                $html .= "<tr>
                    <td>$cave_name</td>
                    <td>$date</td>
                    <td>$amount</td>
                    <td>$check_n</td>
                    <td>$bank_name</td>
                    <td>$date_diff</td>
                    <td>$chqPer</td>
                    <td>$discount</td>
                    <td>$finalAmount</td></tr>";
            }
            $html .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            $html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
        }

        $mail = new Zend_Mail();
        $at = new Zend_Mime_Part($html);
        $at->type = 'application/vnd.ms-excel';
        $at->disposition = Zend_Mime::DISPOSITION_INLINE;
        $at->encoding = Zend_Mime::ENCODING_BASE64;
        $at->filename = 'Liquidaciones.xls';
        $mail->addTo($cave->getEmail(), 'GY');
        $mail->addAttachment($at);
        $mail->setSubject('GY  Liquidaciones excel');
        $mail->setBodyHtml('<p>La liquidación se encuentra en el archivo de excel adjunto</p>');
        $mail->send();
    }

    public function CreateExcelforSupplierLiquidaciones(Gyuser_Model_Liquidaciones $obj, $status, $liquidaciones_id) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }

        $liquidaciones_id = (int) $liquidaciones_id;
        if ($liquidaciones_id) {
            //$liquidaciones_id	=	(int)$request->liquidaciones_id;

            $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liquidaciones_id);
            $lqList = $cMapper->GetLiquidacionesById($lObj);
            $cave_id = $lqList['credit_provider_id'];

            $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
            $supObj = new Gyuser_Model_SupplierOperations();
            $supObj->setId($cave_id);
            $supList = $supMapper->GetCaveById($supObj);


            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liquidaciones_id);
            $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);

            $rejectedCheques = $cMapper->RejectedChequeBySupplierLiquidacionesId($cObj);

            $cMapper = new Gyuser_Model_OperationsDataMapper();
            $cObj = new Gyuser_Model_Operations();
            $cObj->setLiquidacion_id($liquidaciones_id);
            //$opertationsList =	$cMapper->GetOperationsIdByLiquidacionIdJson($cObj);

            $sup_Id = $supList->getId();
            $sup_Name = $supList->getName();
            $sup_Email = $supList->getEmail();
            $sup_Balance = $supList->getBalance();
            $sup_Tasa_anual = $supList->getTasa_anual();
            $sup_Impuesto_al_cheque = $supList->getImpuesto_al_cheque();
            $sup_Gastos_general = $supList->getGastos_general();
            $sup_Gastos_interior = $supList->getGastos_interior();
            $sup_Acreditacion_capital = $supList->getAcreditacion_capital();
            $sup_Acreditacion_interior = $supList->getAcreditacion_interior();


            $totalFinalAmount = 0;
            $html = '';
            $html .= '<h1>Liquidaciones</h1>
							<table cellpadding="5" cellspacing="0" border="1">
								<thead>
									<tr>
										<th  style="width: 94px;">NOMBRE</th>
										<th  style="width: 100px;">TOTAL ($)</th>
										<th  style="width: 127px;">GUSTAVO ($)</th>
										<th  style="width: 157px;">COMISIONES ($)</th>
										<th  style="width: 141px;">RECHAZOS ($)</th>
										<th  style="width: 117px;">GASTOS ($)</th>
										<th  style="width: 198px;">ACREDITACIONES</th>
										<th  style="width: 118px;">SALDOS ($)</th>
									</tr>
								</thead>
								   <tbody>';



            $balance = floatval($lqList['current_account_balance']);
            $gastos_varios = floatval($lqList['gastos_varios']);
            $totalFinalAmount += $balance;
            $totalFinalAmount += $gastos_varios;
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>Balance</td>
								<td style='background:#E3E3E3;'>$balance</td>

							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td  style='background:#E3E3E3;'>Otros gastos</td>
								<td style='background:#E3E3E3;'>$gastos_varios</td>
							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td></td>
								<td>-</td>
							</tr>
							";

            foreach ($rejectedCheques as $row) {
                $item = $row;
                $amount = floatval($item['amount']);
                $rejected_cheques_fee = floatval($item['rejected_cost']);
                $finalAmount = $amount + $rejected_cheques_fee;
                $totalFinalAmount += $finalAmount;
                $fName = $item['first_name'];
                $lName = $item['last_name'];
                $name = $fName . ' ' . $lName;
                $amount = number_format($amount, 2);
                $rejected_cheques_fee = number_format($rejected_cheques_fee, 2);
                $finalAmount = number_format($finalAmount, 2);
                $html .= "<tr style='background:#E3E3E3;'>
										<td>$name</td>
										<td></td>
										<td></td>
										<td></td>
										<td>$amount</td>
										<td>$rejected_cheques_fee</td>
										<td></td>
										<td>$finalAmount</td>
										</tr>";
            }
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td>
								<td style='background:#E3E3E3;'>$totalFinalAmount</td>

							</tr>";


            $html .= '</tbody></table><br/>';


            $html .=
                    '<h1>Cheques - <span class="currentDate"></span></h1>
			<table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th  style="width: 138px;">Banco</th>
						<th  style="width: 94px;">N. Cheque</th>
						<th  style="width: 78px;">CP</th>

						<th  style="width: 60px;">Plazo</th>
						<th  style="width: 115px;">Fecha Dep</th>
						<th  style="width: 117px;">Fecha Acred</th>
						<th  style="width: 50px;">Dias</th>
						<th  style="width: 173px;">Firmante</th>
						<th  style="width: 93px;">Importe</th>
					</tr>
				</thead>
				<tbody class="gridtbody">';

            //$totalFinalAmount	= 0;



            foreach ($chequesList as $row) {
                $item = $row;
                $selAmount = floatval($item['amount']);
                $chqPer = ($selAmount * 2.1) / 100;
                $discount = 0;
                $acreditacion_hr = (int) $item['acreditacion_hrs'];
                $date = $item['date'];

                $date_arc = add_days_by_hr($date, $acreditacion_hr);
                $l_date = $item['liquidacion_date'];
                $date_diff = dateDiff($l_date, $date_arc);
                //hour_diff	=	hours_between(l_date,date);
                $discount = ($selAmount * 0.17 / 100) * (int) $date_diff;

                $flAmout = $selAmount;
                @$payingAmount += $flAmout;

                $bank_name = $item['bank_name'];
                $check_n = $item['check_n'];
                $check_zip_code = $item['check_zip_code'];
                $state = $item['state'];

                $c_name = $item['first_name'] . ' ' . $item['last_name'];
                $flAmout = number_format($flAmout, 2);
                $html .= "<tr>
										<td>$bank_name</td>
										<td>$check_n</td>
										<td>$check_zip_code</td>
										<td>$acreditacion_hr</td>
										<td>$date</td>
										<td>$date_arc</td>
										<td>$date_diff</td>
										<td>$c_name</td>
										<td>$flAmout</td>
										</tr>";
            };
            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
            $html .=
                    '<h1>-</h1><table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th style="width: 164px;">cant. cheques</th>
						<th style="width: 168px;">dias promedio</th>
						<th style="width: 85px;">bruto</th>
						<th style="width: 124px;">intereses</th>
						<th style="width: 133px;">Gs. Interior</th>
						<th style="width: 126px;">Gs.Grales</th>
						<th style="width: 115px;">Gs. Otros</th>
						<th style="width: 121px;">Sub Total</th>
					</tr>
				</thead>

						   <tbody class="gridtbody">';

            //$totalFinalAmount	= 0;
            //$acreditacion_hr	= $sup_Acreditacion_interior;


            $chequeChkCount = $lqList['checks_qty'];
            $dayAvg = $lqList['average_days'];
            $payingAmount = $lqList['total_bruto'];
            $interests = (int) $lqList['intereses'];
            $gastos_interior = (int) $lqList['gastos_interior'];
            $cost_general = (int) $lqList['gastos_general'];
            $other_cost = (int) $lqList['gastos_varios'];
            $subTotalAM = $lqList['total_neto'];
            $html .= "<tr>
										<td>$chequeChkCount</td>
										<td>$dayAvg</td>
										<td>$payingAmount</td>
										<td>$interests</td>
										<td>$gastos_interior</td>
										<td>$cost_general</td>
										<td>$other_cost</td>
										<td>$subTotalAM</td>
									</tr>";


            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
        }
        echo $html;
        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment; filename=liquidacionesdetails.xls");
        header("Pragma: no-cache");
        header("Expires: 0");
    }

    public function CreatePDFforSupplierLiquidaciones(Gyuser_Model_Liquidaciones $obj, $status, $liquidaciones_id) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }

        $liquidaciones_id = (int) $liquidaciones_id;
        if ($liquidaciones_id) {
            //$liquidaciones_id	=	(int)$request->liquidaciones_id;

            $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liquidaciones_id);
            $lqList = $cMapper->GetLiquidacionesById($lObj);
            $cave_id = $lqList['credit_provider_id'];

            $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
            $supObj = new Gyuser_Model_SupplierOperations();
            $supObj->setId($cave_id);
            $supList = $supMapper->GetCaveById($supObj);


            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liquidaciones_id);
            $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);

            $rejectedCheques = $cMapper->RejectedChequeBySupplierLiquidacionesId($cObj);

            $cMapper = new Gyuser_Model_OperationsDataMapper();
            $cObj = new Gyuser_Model_Operations();
            $cObj->setLiquidacion_id($liquidaciones_id);
            //$opertationsList =	$cMapper->GetOperationsIdByLiquidacionIdJson($cObj);

            $sup_Id = $supList->getId();
            $sup_Name = $supList->getName();
            $sup_Email = $supList->getEmail();
            $sup_Balance = $supList->getBalance();
            $sup_Tasa_anual = $supList->getTasa_anual();
            $sup_Impuesto_al_cheque = $supList->getImpuesto_al_cheque();
            $sup_Gastos_general = $supList->getGastos_general();
            $sup_Gastos_interior = $supList->getGastos_interior();
            $sup_Acreditacion_capital = $supList->getAcreditacion_capital();
            $sup_Acreditacion_interior = $supList->getAcreditacion_interior();


            $totalFinalAmount = 0;
            $html = '';
            $html .= '<h1>Liquidaciones</h1>
							<table cellpadding="5" cellspacing="0" border="1">
								<thead>
									<tr>
										<th>NOMBRE</th>
										<th>TOTAL ($)</th>
										<th>GUSTAVO ($)</th>
										<th>COMISIONES ($)</th>
										<th>RECHAZOS ($)</th>
										<th>GASTOS ($)</th>
										<th>ACREDITACIONES</th>
										<th>SALDOS ($)</th>
									</tr>
								</thead>
								   <tbody>';



            $balance = floatval($lqList['current_account_balance']);
            $gastos_varios = floatval($lqList['gastos_varios']);
            $totalFinalAmount += $balance;
            $totalFinalAmount += $gastos_varios;
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>Balance</td>
								<td style='background:#E3E3E3;'>$balance</td>

							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td  style='background:#E3E3E3;'>Otros gastos</td>
								<td style='background:#E3E3E3;'>$gastos_varios</td>
							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td></td>
								<td>-</td>
							</tr>
							";

            foreach ($rejectedCheques as $row) {
                $item = $row;
                $amount = floatval($item['amount']);
                $rejected_cheques_fee = floatval($item['rejected_cost']);
                $finalAmount = $amount + $rejected_cheques_fee;
                $totalFinalAmount += $finalAmount;
                $fName = $item['first_name'];
                $lName = $item['last_name'];
                $name = $fName . ' ' . $lName;
                $amount = number_format($amount, 2);
                $rejected_cheques_fee = number_format($rejected_cheques_fee, 2);
                $finalAmount = number_format($finalAmount, 2);
                $html .= "<tr style='background:#E3E3E3;'>
										<td>$name</td>
										<td></td>
										<td></td>
										<td></td>
										<td>$amount</td>
										<td>$rejected_cheques_fee</td>
										<td></td>
										<td>$finalAmount</td>
										</tr>";
            }
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td>
								<td style='background:#E3E3E3;'>$totalFinalAmount</td>

							</tr>";


            $html .= '</tbody></table><br/>';


            $html .=
                    '<h1>Cheques - <span class="currentDate"></span></h1>
			<table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th>Banco</th>
						<th>N. Cheque</th>
						<th>CP</th>
						<th>Plazo</th>
						<th>Fecha Dep</th>
						<th>Fecha Acred</th>
						<th>Dias</th>
						<th>Firmante</th>
						<th>Importe</th>
					</tr>
				</thead>
				<tbody class="gridtbody">';

            //$totalFinalAmount	= 0;

            foreach ($chequesList as $row) {
                $item = $row;
                $selAmount = floatval($item['amount']);
                $chqPer = ($selAmount * 2.1) / 100;
                $discount = 0;
                $acreditacion_hr = (int) $item['acreditacion_hrs'];
                $date = $item['date'];

                $date_arc = add_days_by_hr($date, $acreditacion_hr);
                $l_date = $item['liquidacion_date'];
                $date_diff = dateDiff($l_date, $date_arc);
                //hour_diff	=	hours_between(l_date,date);
                $discount = ($selAmount * 0.17 / 100) * (int) $date_diff;

                $flAmout = $selAmount;
                $payingAmount += $flAmout;

                $bank_name = $item['bank_name'];
                $check_n = $item['check_n'];
                $check_zip_code = $item['check_zip_code'];
                $state = $item['state'];

                $c_name = $item['first_name'] . ' ' . $item['last_name'];
                $flAmout = number_format($flAmout, 2);
                $html .= "<tr>
										<td>$bank_name</td>
										<td>$check_n</td>
										<td>$check_zip_code</td>
										<td>$acreditacion_hr</td>
										<td>$date</td>
										<td>$date_arc</td>
										<td>$date_diff</td>
										<td>$c_name</td>
										<td>$flAmout</td>
										</tr>";
            };
            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
            $html .=
                    '<h1>-</h1><table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th>cant. cheques</th>
						<th>dias promedio</th>
						<th>bruto</th>
						<th>intereses</th>
						<th>Gs. Interior</th>
						<th>Gs.Grales</th>
						<th>Gs. Otros</th>
						<th>Sub Total</th>
					</tr>
				</thead>

						   <tbody class="gridtbody">';

            //$totalFinalAmount	= 0;
            //$acreditacion_hr	= $sup_Acreditacion_interior;


            $chequeChkCount = $lqList['checks_qty'];
            $dayAvg = $lqList['average_days'];
            $payingAmount = $lqList['total_bruto'];
            $interests = (int) $lqList['intereses'];
            $gastos_interior = (int) $lqList['gastos_interior'];
            $cost_general = (int) $lqList['gastos_general'];
            $other_cost = (int) $lqList['gastos_varios'];
            $subTotalAM = $lqList['total_neto'];
            $html .= "<tr>
										<td>$chequeChkCount</td>
										<td>$dayAvg</td>
										<td>$payingAmount</td>
										<td>$interests</td>
										<td>$gastos_interior</td>
										<td>$cost_general</td>
										<td>$other_cost</td>
										<td>$subTotalAM</td>
									</tr>";


            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
        }

        $dompdf = new DOMPDF();
        $dompdf->load_html($html);
        $dompdf->render();
        $dompdf->stream("Liquidaciones Details.pdf", $param);
    }

    public function CreateAndSendMailExcelforSupplierLiquidaciones(Gyuser_Model_Liquidaciones $obj, $status, $liquidaciones_id) {
        $clietid = $obj->getId();
        $param = array();
        if ($status) {
            $param = array('compress' => 0, 'Attachment' => 0);
        }

        $liquidaciones_id = (int) $liquidaciones_id;
        if ($liquidaciones_id) {
            //$liquidaciones_id	=	(int)$request->liquidaciones_id;

            $cMapper = new Gyuser_Model_LiquidacionesDataMapper();
            $lObj = new Gyuser_Model_Liquidaciones();
            $lObj->setId($liquidaciones_id);
            $lqList = $cMapper->GetLiquidacionesById($lObj);
            $cave_id = $lqList['credit_provider_id'];

            $supMapper = new Gyuser_Model_SupplierOperationsDataMapper();
            $supObj = new Gyuser_Model_SupplierOperations();
            $supObj->setId($cave_id);
            $supList = $supMapper->GetCaveById($supObj);


            $cMapper = new Gyuser_Model_ChequesDataMapper();
            $cObj = new Gyuser_Model_Cheques();
            $cObj->setLiquidacion_id($liquidaciones_id);
            $chequesList = $cMapper->GetChequeDetailsByLiquidacionIdJson($cObj);

            $rejectedCheques = $cMapper->RejectedChequeBySupplierLiquidacionesId($cObj);

            $cMapper = new Gyuser_Model_OperationsDataMapper();
            $cObj = new Gyuser_Model_Operations();
            $cObj->setLiquidacion_id($liquidaciones_id);
            //$opertationsList =	$cMapper->GetOperationsIdByLiquidacionIdJson($cObj);

            $sup_Id = $supList->getId();
            $sup_Name = $supList->getName();
            $sup_Email = $supList->getEmail();
            $sup_Balance = $supList->getBalance();
            $sup_Tasa_anual = $supList->getTasa_anual();
            $sup_Impuesto_al_cheque = $supList->getImpuesto_al_cheque();
            $sup_Gastos_general = $supList->getGastos_general();
            $sup_Gastos_interior = $supList->getGastos_interior();
            $sup_Acreditacion_capital = $supList->getAcreditacion_capital();
            $sup_Acreditacion_interior = $supList->getAcreditacion_interior();


            $totalFinalAmount = 0;
            $html = '';
            $html .= '<h1>Liquidaciones</h1>
							<table cellpadding="5" cellspacing="0" border="1">
								<thead>
									<tr>
										<th  style="width: 94px;">NOMBRE</th>
										<th  style="width: 100px;">TOTAL ($)</th>
										<th  style="width: 127px;">GUSTAVO ($)</th>
										<th  style="width: 157px;">COMISIONES ($)</th>
										<th  style="width: 141px;">RECHAZOS ($)</th>
										<th  style="width: 117px;">GASTOS ($)</th>
										<th  style="width: 198px;">ACREDITACIONES</th>
										<th  style="width: 118px;">SALDOS ($)</th>
									</tr>
								</thead>
								   <tbody>';



            $balance = floatval($lqList['current_account_balance']);
            $gastos_varios = floatval($lqList['gastos_varios']);
            $totalFinalAmount += $balance;
            $totalFinalAmount += $gastos_varios;
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>Balance</td>
								<td style='background:#E3E3E3;'>$balance</td>

							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td  style='background:#E3E3E3;'>Otros gastos</td>
								<td style='background:#E3E3E3;'>$gastos_varios</td>
							</tr>
							<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td></td>
								<td>-</td>
							</tr>
							";

            foreach ($rejectedCheques as $row) {
                $item = $row;
                $amount = floatval($item['amount']);
                $rejected_cheques_fee = floatval($item['rejected_cost']);
                $finalAmount = $amount + $rejected_cheques_fee;
                $totalFinalAmount += $finalAmount;
                $fName = $item['first_name'];
                $lName = $item['last_name'];
                $name = $fName . ' ' . $lName;
                $amount = number_format($amount, 2);
                $rejected_cheques_fee = number_format($rejected_cheques_fee, 2);
                $finalAmount = number_format($finalAmount, 2);
                $html .= "<tr style='background:#E3E3E3;'>
										<td>$name</td>
										<td></td>
										<td></td>
										<td></td>
										<td>$amount</td>
										<td>$rejected_cheques_fee</td>
										<td></td>
										<td>$finalAmount</td>
										</tr>";
            }
            $html .= "<tr>
								<td></td><td></td><td></td><td></td><td></td><td></td>
								<td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td>
								<td style='background:#E3E3E3;'>$totalFinalAmount</td>

							</tr>";


            $html .= '</tbody></table><br/>';


            $html .=
                    '<h1>Cheques - <span class="currentDate"></span></h1>
			<table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th  style="width: 138px;">Banco</th>
						<th  style="width: 94px;">N. Cheque</th>
						<th  style="width: 78px;">CP</th>
						<th  style="width: 60px;">Plazo</th>
						<th  style="width: 115px;">Fecha Dep</th>
						<th  style="width: 117px;">Fecha Acred</th>
						<th  style="width: 50px;">Dias</th>
						<th  style="width: 173px;">Firmante</th>
						<th  style="width: 93px;">Importe</th>
					</tr>
				</thead>
				<tbody class="gridtbody">';

            //$totalFinalAmount	= 0;

            $acreditacion_hr = $sup_Acreditacion_interior;

            foreach ($chequesList as $row) {
                $item = $row;
                $selAmount = floatval($item['amount']);
                $chqPer = ($selAmount * 2.1) / 100;
                $discount = 0;
                $acreditacion_hr = (int) $item['acreditacion_hrs'];
                $date = $item['date'];

                $date_arc = add_days_by_hr($date, $acreditacion_hr);
                $l_date = $item['liquidacion_date'];
                $date_diff = dateDiff($l_date, $date_arc);
                //hour_diff	=	hours_between(l_date,date);
                $discount = ($selAmount * 0.17 / 100) * (int) $date_diff;

                $flAmout = $selAmount;
                $payingAmount += $flAmout;

                $bank_name = $item['bank_name'];
                $check_n = $item['check_n'];
                $check_zip_code = $item['check_zip_code'];
                $state = $item['state'];

                $c_name = $item['first_name'] . ' ' . $item['last_name'];
                $flAmout = number_format($flAmout, 2);
                $html .= "<tr>
										<td>$bank_name</td>
										<td>$check_n</td>
										<td>$check_zip_code</td>
										<td>$acreditacion_hr</td>
										<td>$date</td>
										<td>$date_arc</td>
										<td>$date_diff</td>
										<td>$c_name</td>
										<td>$flAmout</td>
										</tr>";
            };
            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
            $html .=
                    '<h1>-</h1><table  cellpadding="5" cellspacing="0" border="1" >
				<thead>
					<tr>
						<th style="width: 164px;">cant. cheques</th>
						<th style="width: 168px;">dias promedio</th>
						<th style="width: 85px;">bruto</th>
						<th style="width: 124px;">intereses</th>
						<th style="width: 133px;">Gs. Interior</th>
						<th style="width: 126px;">Gs.Grales</th>
						<th style="width: 115px;">Gs. Otros</th>
						<th style="width: 121px;">Sub Total</th>
					</tr>
				</thead>

						   <tbody class="gridtbody">';

            //$totalFinalAmount	= 0;
            //$acreditacion_hr	= $sup_Acreditacion_interior;


            $chequeChkCount = $lqList['checks_qty'];
            $dayAvg = $lqList['average_days'];
            $payingAmount = $lqList['total_bruto'];
            $interests = (int) $lqList['intereses'];
            $gastos_interior = (int) $lqList['gastos_interior'];
            $cost_general = (int) $lqList['gastos_general'];
            $other_cost = (int) $lqList['gastos_varios'];
            $subTotalAM = $lqList['total_neto'];
            $html .= "<tr>
										<td>$chequeChkCount</td>
										<td>$dayAvg</td>
										<td>$payingAmount</td>
										<td>$interests</td>
										<td>$gastos_interior</td>
										<td>$cost_general</td>
										<td>$other_cost</td>
										<td>$subTotalAM</td>
									</tr>";


            //$html  .= '<tr><td style="height:20px"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style='background:#E3E3E3;'>SALDO A LIQUIDAR</td><td style='background:#CCCCCC;'><b>$totalFinalAmount</b><input type='hidden' id='pay_final_amount' value='$totalFinalAmount' /></td></tr>";
            //$html  .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><input type='button' class='chooseChequesBtn jqButton' value='Choose Cheques'/></td><td></td></tr>";


            $html .= '</tbody></table>';
        }

        $mail = new Zend_Mail();
        $at = new Zend_Mime_Part($html);
        $at->type = 'application/vnd.ms-excel';
        $at->disposition = Zend_Mime::DISPOSITION_INLINE;
        $at->encoding = Zend_Mime::ENCODING_BASE64;
        $at->filename = 'Liquidaciones.xls';
        $mail->addAttachment($at);

        $mailto = $supList->getEmail();
        $mail->addTo($mailto, 'GY');
        $mail->setSubject('GY  Liquidaciones excel');
        $mail->setBodyHtml('<p>La liquidación se encuentra en el archivo de excel adjunto</p>');
        $mail->send();
    }
 * 
 */

}
