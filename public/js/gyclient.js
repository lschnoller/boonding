$(function() {
    function retrunFalse() {
        return false;
    }
    function retrunTrue() {
        return true;
    }

    $(".ajaxMsgDiv").ajaxStart(function() {
        var zIx = parseInt($('.ui-widget-overlay').css('z-index'));
        zIx += 4;
        $(this).css({
            'z-index': zIx
        });
        $(this).show();
        $('div,span,li,a,input[type="submit"]').die("click", retrunTrue);
        $('div,span,li,a,input[type="submit"]').live('click', retrunFalse);
    });

    $('.ajaxMsgDiv').ajaxStop(function() {
        var zIx = parseInt($('.ui-widget-overlay').css('z-index'));
        zIx += 4;
        $(this).css({
            'z-index': zIx
        });
        $(this).hide();
        $('.btnLoading').hide();
        $('div,span,li,a,input[type="submit"]').die("click", retrunFalse);
        $('div,span,li,a,input[type="submit"]').live('click', retrunTrue);
    });

    $('.ajaxMsgDiv').ajaxError(function() {
        var zIx = parseInt($('.ui-widget-overlay').css('z-index'));
        zIx += 4;
        $(this).css({
            'z-index': zIx
        });
        $(this).hide();
        $('.btnLoading').hide();
        $('div,span,li,a,input[type="submit"]').die("click", retrunFalse);
        $('div,span,li,a,input[type="submit"]').live('click', retrunTrue);
    });
    var oTable;
    var gaiSelected = [];

    $(".datepickerMY").datepicker({
        yearRange: "-50:+0",
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy',
        showButtonPanel: true,
        closeText: 'OK',        
        showOptions:{direction:"up"},
        onChangeMonthYear: function(dateText, inst) {
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
        }
    });

    $('.ui-datepicker-close').live('click', function() {
        $(this).parents('#ui-datepicker-div:eq(0)').find('a.ui-state-default:eq(0)').trigger('click');
    });
    /*
     var nCloneTh = document.createElement('th');
     var nCloneTd = document.createElement('td');
     nCloneTd.innerHTML = '<img src="/images/details_open.png" class="amBtn">';
     nCloneTd.className = "center";
     $('#grid thead tr').each( function () {
     this.insertBefore(nCloneTh, this.childNodes[0]);
     });
     $('#grid tbody tr').each( function () {
     this.insertBefore(nCloneTd.cloneNode( true ), this.childNodes[0]);
     });
     */
    $.post('/index/getoperationstates',
            function(data) {
                operationStates = data;
            }, 'json');

    function fnBankDetails(oTable, nTr, data)
    {
        var item, id, bankName, zipCode, location, branch, accountNumber, opDate;
        var aData = oTable.fnGetData(nTr);
        var userid = nTr.id.split('_');
        var sOut = '<div class="bankShowBtn slideTable rightArrow" catch="bankTable_' + userid[1] + '" status="0">Detalle bancario</div>';
        sOut += '<table class="whiteTable details-table"  style="display:none;" id="bankTable_' + userid[1] + '">';
        sOut += '<tr><th>Banco</th><th>Sucursal</th><th>Nro. de Cuenta</th><th>Fecha de Alta</th><th>Acciones</th></tr>';
        var opendate, x;
        var RowCount = 0;
        for (x in data) {
            RowCount = 1;
            item = data[x];
            bankName = (item['bank_name']) ? item['bank_name'] : '';
            zipCode = (item['zip_code']) ? item['zip_code'] : '';
            location = (item['location_capital']) ? item['location_capital'] : '';
            branch = (item['branch']) ? item['branch'] : '';
            accountNumber = (item['account_n']) ? item['account_n'] : '';
            opDate = (item['opening_date']) ? item['opening_date'] : 'Sin Especificar';
            sOut += '<tr id="bankid_' + item['id'] + '">';
            sOut += '<td class="td_bank_name">' + bankName +
                    '<input type="hidden" name="zip_code" value="' + zipCode + '" />' +
                    '<input type="hidden" name="location_capital" value="' + location + '" />' +
                    '</td>';
            sOut += '<td class="td_branch">' + branch + '</td>';
            sOut += '<td class="td_account_n">' + accountNumber + '</td>';
            sOut += '<td  class="td_opening_date">' + opDate + '</td>';
            sOut += '<td><span class="link1" style="text-decoration:none;"><img src="/images/edit.png" class="editBankBtn"/> <img src="/images/delete.png" class="deleteBankBtn"/></span></td>';
            sOut += '</tr>';
        }
        if (!RowCount) {
            sOut += '<tr>';
            sOut += '<td class="td_bank_name" colspan="5" align="center">No figuran detalles bancarios.</td>';
            sOut += '</tr>';
        }
        sOut += '<tr>';
        sOut += '<td  colspan="5" align="right">';
        sOut += '<span title="" class="ui-state-default ui-corner-all addNewBankBtn jq-link-btn-small">Agregar Nuevo</span>';
        sOut += '</td>';
        sOut += '</tr>';
        sOut += '</table>';
        return sOut;
    }

    function fnAddressDetails(oTable, nTr, data)
    {
        var item, jsonData, id, street, city, state, state_name, country, zip_code, address_type, delivery_address;
        var aData = oTable.fnGetData(nTr);
        var client_id = nTr.id.split('_');
        var sOut = '<div class="addressShowBtn slideTable rightArrow" catch="addressTable_' + client_id[1] + '" status="0">Domicilios</div>';
        sOut += '<table class="whiteTable details-table" style="display:none;" id="addressTable_' + client_id[1] + '">';
        sOut += '<tr><th>Domicilio</th><th>Localidad</th><th>C.P.</th><th>Provincia</th><th>Tipo de Domicilio</th><th>Env&iacute;o</th><th>Acciones</th></tr>';
        var opendate, x;
        var RowCount = 0;
        for (x in data) {
            item = data[x];
            RowCount = 1;
            jsonData = item;
            id = jsonData['id'];
            street = (jsonData['street']) ? jsonData['street'] : '';
            city = (jsonData['city']) ? jsonData['city'] : '';
            state = (jsonData['state']) ? jsonData['state'] : '';
            state_name = (jsonData['state_name']) ? jsonData['state_name'] : '';
            //country = (jsonData['country']) ? jsonData['country'] : '';
            zip_code = (jsonData['zip_code']) ? jsonData['zip_code'] : '';
            address_type = (jsonData['address_type']) ? jsonData['address_type'] : '';
            delivery_address = parseInt(jsonData['delivery_address']) ? 'Si' : '';

            sOut += '<tr id="addressid_' + id + '">';
            sOut += '<td class="td_street">' + street + '</td>';
            sOut += '<td class="td_city">' + city + '</td>';
            sOut += '<td class="td_zip_code">' + zip_code + '</td>';
            sOut += '<td class="td_state">' + state_name + '<input type="hidden" value="' + state + '" /></td>';
            sOut += '<td class="td_address_type">' + address_type + '</td>';
            sOut += '<td class="td_delivery_address">' + delivery_address + '<input type="hidden" name="delivery_address_value" value="' + jsonData['delivery_address'] + '" /></td>';
            sOut += '<td><span class="link1" style="text-decoration:none"><img src="/images/edit.png" class="editAddBtn"/> <img src="/images/delete.png" class="deleteAddBtn"/></span></td>';
            /*sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editAddressBtn"/> <img src="/images/delete.png" class="deleteAddressBtn"/></span></td>';*/
            sOut += '</tr>';
        }
        if (!RowCount) {
            sOut += '<tr>';
            sOut += '<td class="td_address_name" colspan="7" align="center">No figuran domicilios para este cliente.</td>';
            sOut += '</tr>';
        }
        sOut += '<tr>';
        sOut += '<td  colspan="7" align="right">';
        sOut += '<span title="" class="ui-state-default ui-corner-all addNewAddBtn jq-link-btn-small">Agregar Nuevo</span>';
        sOut += '</td>';
        sOut += '</tr>';
        sOut += '</table>';
        return sOut;
    }
    function fnPriorDetails(oTable, nTr, data)
    {
        var item, jsonData, id, date, is_operation_completed, cave_name, cave_name_db, amount, next_check_date, pending_checks, is_last_operation;
        var aData = oTable.fnGetData(nTr);
        var client = nTr.id.split('_');
        var sOut = '<div class="priorShowBtn slideTable rightArrow" catch="priorTable_' + client[1] + '" status="0">Operaciones con otros proveedores</div>';
        sOut += '<table class="whiteTable details-table"  style="display:none;" id="priorTable_' + client[1] + '">';
        sOut += '<tr><th>Fecha</th><th>Colega</th><th>Importe</th><th>Fecha Próximo Cheque</th><th>Cheques Pendientes</th></tr>';
        var opendate, x;
        var RowCount = 0;
        for (x in data) {
            item = data[x];
            RowCount = 1;
            jsonData = item;
            id = (jsonData['id']) ? jsonData['id'] : '';
            date = (jsonData['date']) ? jsonData['date'] : '';
            //is_operation_completed = (jsonData['is_operation_completed']) ? jsonData['is_operation_completed'] : '';
            //cave_name = (jsonData['cave_name']) ? jsonData['cave_name'] : '';
            cave_name_db = (jsonData['cave_name_db']) ? jsonData['cave_name_db'] : '';
            amount = (jsonData['amount']) ? amountFormat(jsonData['amount']) : '';
            next_check_date = (jsonData['next_check_date']) ? jsonData['next_check_date'] : '';
            pending_checks = (jsonData['pending_checks'] != null) ? jsonData['pending_checks'] : '0';
            //is_last_operation = (jsonData['is_last_operation']) ? jsonData['is_last_operation'] : '';
            sOut += '<tr id="priorid_' + id + '">';
            sOut += '<td class="td_data">' + date + '</td>';
            sOut += '<td class="td_cave">' + cave_name_db + '</td>';
            sOut += '<td class="td_amount">' + amount + '</td>';
            sOut += '<td class="td_next_check_date">' + next_check_date + '</td>';
            sOut += '<td class="td_pending_checks">' + pending_checks + '</td>';
            /*sOut += 	'<td><span class="link1"><img src="/images/edit.png" class="editPriorBtn"/> <img src="/images/delete.png" class="deletePriorBtn"/></span></td>';*/
            sOut += '</tr>';
        }
        if (!RowCount) {
            sOut += '<tr>';
            sOut += '<td class="td_prior_name" colspan="5" align="center">No figuran detalles de operaciones anteriores.</td>';
            sOut += '</tr>';
        }
        sOut += '<tr>';
        sOut += '<td  colspan="7" align="right">';
        sOut += '<span title="" class="ui-state-default ui-corner-all addPriorAddBtn jq-link-btn-small">Agregar Nuevo</span>';
        sOut += '</td>';
        sOut += '</tr>';
        sOut += '</table>';
        return sOut;
    }

    $('.addressShowBtn').live('click', function() {
        var slideTable = $(this);
        var client_id = slideTable.attr('catch');
        var status = parseInt(slideTable.attr('status'));
        var tablefop = slideTable.parents('table:eq(0)');
        if (status) {
            $('#' + client_id, tablefop).slideUp('fast', function() {
                slideTable.attr('status', 0).removeClass('downArrow').addClass('rightArrow')
                        .text('Domicilios');
            });
        } else {
            slideTable.attr('status', 1).removeClass('rightArrow').addClass('downArrow')
                    .text('Domicilios');
            $('#' + client_id, tablefop).slideDown('fast');
        }
    });

    $('.priorShowBtn').live('click', function() {
        var slideTable = $(this);
        var client_id = slideTable.attr('catch');
        var status = parseInt(slideTable.attr('status'));
        var tablefop = slideTable.parents('table:eq(0)');
        if (status) {
            $('#' + client_id, tablefop).slideUp('fast', function() {
                slideTable.attr('status', 0).removeClass('downArrow').addClass('rightArrow')
                        .text('Operaciones con otros proveedores');
            });
        } else {
            slideTable.attr('status', 1).removeClass('rightArrow').addClass('downArrow')
                    .text('Operaciones con otros proveedores');

            $('#' + client_id, tablefop).slideDown('fast');
        }
    })

    $('.bankShowBtn').live('click', function() {
        var slideTable = $(this);
        var client_id = slideTable.attr('catch');
        var status = parseInt(slideTable.attr('status'));
        var tablefop = slideTable.parents('table:eq(0)');
        if (status) {
            $('#' + client_id, tablefop).slideUp('fast', function() {
                slideTable.text('Detalle bancario').attr('status', 0).removeClass('downArrow').addClass('rightArrow');
            });
        } else {
            slideTable.text('Detalle bancario').attr('status', 1).removeClass('rightArrow').addClass('downArrow');
            $('#' + client_id, tablefop).slideDown('fast');
        }
    })

    //$('#grid tbody td .amBtn').live('click', function(e, showLoading)
    $('#grid .gridtbody tr').live('click', function(e, showLoading)
    {
        if (showLoading === undefined)
            showLoading = false;
        var nTr = this;//.parentNode.parentNode;
        var trdet = $(this);//.parents('tr:eq(0)');
        var client = nTr.id.split('_');
        var clientId = client[1];
        var amBtnImg = $('.amBtn', this);
        amBtnImg.addClass('amBtnLoading');
        //var img = this;
        trdet.next('tr').find('.details').addClass('fnTableLoading');
        if (amBtnImg.attr('src').match('details_close') && !showLoading) {
            amBtnImg.attr('src', "/images/details_open.png");

            if (e.originalEvent !== undefined) { //clicked by mouse, make animation
                $('div.animation-wrapper', $(nTr).next()[0]).slideUp(function() {
                    oTable.fnClose(nTr);
                    trdet.removeClass('row_selected');
                });
            }
            else { //don't animate
                oTable.fnClose(nTr);
                trdet.removeClass('row_selected');
            }
            //oTable.fnClose(nTr);
            amBtnImg.removeClass('amBtnLoading');
        }
        else
        {
            trdet.next('tr').find('.details').addClass('fnTableLoading');
            amBtnImg.attr('src', "/images/details_close.png");
            var url = '/index/getalldetailsbyclientidajax';
            $.post(url, {
                "client_id": clientId
            },
            function(data) {
                if (data) {
                    var rejectedBtnName, stateBtnHTML, pdf_Arr, cave_id, pdf_list, opLabelClass, opName, chequesHTML, addressesHTML, priorHTML, bankdetailsHTML, report, cave_name, stateDetailsHTML, opHTML, statustime, date_added, rejectedBtn, statusTxt, nextClsName, nextBtnText, operationInp, amountInp, stateid, amountInp, stateid, opId, opType, amount, tasa, opStateTR, opStateText;

                    //alert(data);
                    var bankdetails = data['bankdetails'];
                    bankdetailsHTML = fnBankDetails(oTable, nTr, bankdetails);
                    var addresses = data['addresses'];
                    addressesHTML = fnAddressDetails(oTable, nTr, addresses);
                    var prior = data['prior'];
                    priorHTML = fnPriorDetails(oTable, nTr, prior);
                    var opList = data['operations'];

                    chequesHTML = opLabelClass = opName = pdf_list = report = cave_name = stateDetailsHTML = opHTML = statustime = date_added = rejectedBtn = statusTxt = nextClsName = nextBtnText = operationInp = amountInp = stateid = amountInp = stateid = opId = opType = amount = tasa = '';

                    if (opList) {
                        var colspan, tasaHTML, borderRight;
                        var i = 0;
                        var opArr = new Array();
                        var opIdArr = new Array();

                        for (var x in opList)
                        {
                            opStateTR = opStateText = opHTML = colspan = tasaHTML = borderRight = statusTxt = nextClsName = nextBtnText = rejectedBtn = pdf_list = '';
                            var operation = opList[x];
                            stateid = parseInt(operation['stateid']);
                            opId = operation['operationid'];
                            opType = operation['type'];
                            amount = operation['amount'];
                            tasa = operation['tasa'];
                            report = operation['report'];
                            date_added = operation['date'];
                            ac_date = operation['ac_date'];
                            cave_name = operation['cave_name'];
                            cave_id = parseInt(operation['cave_id']) ? parseInt(operation['cave_id']) : 0;
                            statustime = operation['state_change'];

                            report = report ? report : '';
                            pdf_list = '<span class="details_pdf"><input type="hidden" value="1"/><img src="/images/pdf_icon.png"/> Mutuo 1 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
                            pdf_list += '<span class="details_pdf"><input type="hidden" value="2"/><img src="/images/pdf_icon.png"/> Mutuo 2 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
                            pdf_list += '<span class="details_pdf"><input type="hidden" value="3"/><img src="/images/pdf_icon.png"/> Mutuo 3 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
                            pdf_list = '<div style="margin-top:.5em">' + pdf_list + '</div>'

                            var cancelOpBtn = '';
                            if (stateid == 1 || stateid == 2 || stateid == 4 || stateid == 5 || stateid == 6 || stateid == 7 || stateid == 8) {
                                cancelOpBtn = ' <span class="jq-link-btn-cancel cancelOp">Anular Op.</span>';
                            }
                            statustime += cancelOpBtn;
                            //statustime	+= '<div style="font-size:12px;color:#595959;white-space:normal">'+report+'</div>';
                            switch (stateid) {
                                case 1:
                                    statusTxt = operationStates[1].name + ': ' + statustime;
                                    nextClsName = 'operationStepTwo';
                                    nextBtnText = 'Pedido de Informe';
                                    rejectedBtn = 'Pedido de Informe Compartido'
                                    pdf_list = '';
                                    break;
                                case 2:
                                    statusTxt = operationStates[2].name + ': ' + statustime;
                                    if (opType == 1) { //op cheque propio
                                        nextClsName = 'operationStepThree';
                                        nextBtnText = 'Informe Aprobado';
                                        rejectedBtn = 'Informe Desaprobado';
                                        pdf_list = '';
                                    }
                                    break;
                                case 3:
                                    //statusTxt 	= '<div class="stateViewDiv">'+operationStates[3].name+': '+statustime+'</div>';
                                    statusTxt = '<span style="font-size:10px; color: #777">' + statustime + '</span> <span class="stateViewDivNoStatusYellow">Informe Desaprobado</span>';
                                    nextClsName = '';
                                    nextBtnText = '';
                                    rejectedBtn = '';
                                    pdf_list = '';
                                    break;
                                case 4:
                                    statusTxt = operationStates[4].name + ': ' + statustime;
                                    nextClsName = 'operationStepFour';
                                    nextBtnText = 'Seleccionar Plan';
                                    pdf_list = '';
                                    break;
                                case 5:
                                    if (opType == 1) //op cheque propio                                        
                                        nextClsName = 'operationStepFive';
                                    else if (opType == 2)
                                        nextClsName = 'sendTercerosBtn';
                                    statusTxt = operationStates[5].name + ': ' + statustime;
                                    nextBtnText = 'Enviar';
                                    break;
                                case 6:
                                    statusTxt = operationStates[6].name + ': ' + statustime;
                                    if (opType == 1) //op cheque propio                                        
                                        nextClsName = 'operationStepSix';
                                    else if (opType == 2)
                                        nextClsName = 'consolidateTercerosOpBtn';
                                    nextBtnText = 'Ingresar Cheques';
                                    break;
                                case 7:
                                    statusTxt = operationStates[7].name + ': ' + statustime;
                                    nextClsName = 'operationStepSix';
                                    nextBtnText = 'Asignar Ubicación';
                                    break;
                                case 8:
                                    statusTxt = operationStates[8].name + ': ' + statustime;
                                    nextClsName = 'operationStepSix';
                                    nextBtnText = 'Ingresar Cheques';
                                    break;
                                case 9:
                                    statusTxt = '<div class="stateViewDivNoStatus" style="width: 55px">En cartera</div>';
                                    nextClsName = '';
                                    nextBtnText = '';
                                    break;
                                case 10:
                                    statusTxt = '<span class="stateViewDivSaldada">SALDADA</span>';
                                    nextClsName = '';
                                    nextBtnText = '';
                                    break;
                                case 11:
                                    statusTxt = '<div class="stateViewDivCobranza">EN COBRANZA</div>';
                                    nextClsName = '';
                                    nextBtnText = '';
                                    break;
                                case 99:
                                    statusTxt = '<span style="font-size:10px; color: #777">' + statustime + '</span> <span class="stateViewDivNoStatusRed">Anulada</span>';
                                    nextClsName = '';
                                    nextBtnText = '';
                                    rejectedBtn = '';
                                    pdf_list = '';
                                    break;
                                default:
                                    statusTxt = '<div> </div>';
                                    nextClsName = 'addNewOperations';
                                    nextBtnText = 'Nueva Operación';
                                    pdf_list = '';
                                    break;
                            }

                            if (nextClsName != '') {
                                nextClsName = 'ui-state-default ui-corner-all jq-link-btn-small ' + nextClsName;
                                operationInp = '<input type="hidden" name="operationid" value="' + opId + '"/>';
                                amountInp = '<input type="hidden" name="amount" value="' + amount + '"/>';
                                stateBtnHTML = '<span class="' + nextClsName + '" title="" id="OpClientId' + nTr.id + '">' + nextBtnText + operationInp + amountInp;
                                stateBtnHTML += '<input type="hidden" name="cave_id" value="' + cave_id + '" />';
                                stateBtnHTML += '<input type="hidden" name="show_cheques" value="" />';
                                stateBtnHTML += '<input type="hidden" name="state_id" value="' + stateid + '" /></span>';

                                if (rejectedBtn != '') //rejected btn means if it has a 2nd option button
                                {
                                    rejectedBtnName = rejectedBtn;
                                    if (stateid == 1)
                                        cave_id = 1;

                                    if (stateid == 2)
                                        nextClsName += '_rej'

                                    rejectedBtn = '<br /><br /><span class="' + nextClsName + '" title="" id="OpClientId' + nTr.id + '">' + rejectedBtnName + operationInp + amountInp;
                                    rejectedBtn += '<input type="hidden" name="cave_id" value="' + cave_id + '" />';
                                    rejectedBtn += '<input type="hidden" name="show_cheques" value="" />';
                                    rejectedBtn += '<input type="hidden" name="state_id" value="' + stateid + '" /></span>';
                                }
                                //if the operation has a next action then create a table header
                                opStateTR = '<tr class="state-row"><td style="border-right:0"><div class="stateViewDiv">' + statusTxt + '</div></td><td colspan="3" style="padding:.7em">' + stateBtnHTML + rejectedBtn + '</td></tr>';
                                opStateText = '';
                            }
                            else {
                                if (stateid == 2 && opType == 2) { //op terceros agudardando informes
                                    opStateTR = '<tr class="state-row"><td style="border-right:0"><div class="stateViewDiv">' + statusTxt + '</div></td><td colspan="3" style="padding:.7em"></td></tr>';
                                }
                                else {
                                    //if the operation doesn't have a next action then just show the status next to the operation id
                                    opStateTR = '';
                                    opStateText = '<span style="float:right">' + statusTxt + '</span>';
                                }
                            }

                            //put everything together and create HTML
                            tasaHTML = borderRight = '';
                            if (tasa)
                                tasaHTML = '<span class="bcts"> Tasa: ' + tasa + ' %</span>';
                            else
                                tasaHTML = '<span class="bcts"> Tasa: </span>'; //borderRight = 'style="border-right:0"';

                            if (stateid != 3 && stateid != 99)
                                //******************* CREATE CHEQUES HTML **********************//
                                chequesHTML = fnChequeDetails(oTable, nTr, operation['cheques'], opType);
                            else
                                chequesHTML = '';

                            if (opType == 1) {
                                opLabelClass = ' propios-op';
                                opName = 'OPERACION ' + opId;
                            }
                            else if (opType == 2) { //terceros op
                                opLabelClass = ' terceros-op';
                                opName = 'OPERACION ' + opId + ' <span style="font-size:smaller">CHEQUES TERCEROS</span>';
                            }

                            opName += '<input type="hidden" name="operation_id_reference" value="' + opId + '" />';
                            opName += '<input type="hidden" name="client_id_reference" value="' + clientId + '" />';
                            opName += '<input type="hidden" name="tasa_reference" value="' + tasa + '" />';
                            opName += '<input type="hidden" name="ac_date_reference" value="' + ac_date + '" />';

                            opHTML = '<table class="user-panel-table operations-table"><tr><td><table class="whiteTable operation-details-table">' + opStateTR + '<tr><td class="tc' + opLabelClass + '" colspan="4">' + opStateText + '<span class="bct" style="vertical-align:middle; font-weight:bold">' + opName + '</span></td></tr>';
                            if (report != '')
                                opHTML += '<tr><td colspan="4"><span class="opReport">Observaciones: ' + report + '</span></td></tr>';
                            opHTML += '<tr><td class="tc"><span class="bcts"> Fecha: ' + date_added + '</span></td><td ' + borderRight + '><span class="bcts"> Importe: $ ' + amount + '</span></td><td>' + tasaHTML + '</td>';
                            if (cave_name)
                                opHTML += '<td class="tc"><span class="bcts"> A medias con ' + cave_name + '</span></td>';
                            else
                                opHTML += '<td class="tc"><span class="bcts"> SOLOS</span></td>';

                            opHTML += '</tr></table>' + chequesHTML + '<td>' + pdf_list + '</td></td>';
                            opHTML += '</tr>';
                            opHTML += '<tr><td></td></tr></table>';

                            opArr[i] = opHTML;
                            opIdArr[i++] = parseInt(opId);
                        } //EOF FOR EACH OPERATION

                        //all this checking of operation order and reversing is because
                        //of a bug in chrome that doesn't reverses the order in the for in loop
                        if (opIdArr[0] < opIdArr[1])
                            opArr.reverse();
                        var operationsHTML = opArr.join('');
                    }

                    var clientInfo, activity, extra_info, newoprBtn, tercerosOpBtn, gdcBtn, inPegoBtn, hist, vProfile, newoprBtn, tProfile, dni, tc, tl, ln, fn, email;
                    newoprBtn = tercerosOpBtn = tProfile = dni = tc = tl = ln = fn = activity = extra_info = '';
                    var tProfileImg;
                    fn = $('.user_first_name', nTr).text();
                    ln = $('.user_last_name', nTr).text();
                    dni = $('.user_DNI', nTr).text();
                    tc = $('.user_tel_cell', nTr).text();
                    tl = $('.user_tel_part', nTr).text();
                    email = $('.user_email', nTr).text();
                    clientInfo = data['clientInfo'];
                    activity = oTable.fnGetData(nTr)[15];//$('.user_activity', nTr).text();
                    extra_info = oTable.fnGetData(nTr)[17];//$('.user_extra_info', nTr).text();
                    tercerosOpBtn = '<span id="OpClientIduserid_' + clientId + '" title="" class="ui-state-default ui-corner-all addTercerosOp jq-link-btn-small">Operación Cheques 3ros</span>';
                    newoprBtn = '<span id="OpClientIduserid_' + clientId + '" title="" class="ui-state-default ui-corner-all addNewOperations jq-link-btn-small">Solicitar Operación</span>';
                    gdcBtn = '<span id="OpClientIduserid_' + clientId + '" title="" class="ui-state-default ui-corner-all addNewGdc jq-link-btn-small">Gestión de Cobranza</span>';
                    inPegoBtn = '<span id="OpClientIduserid_' + clientId + '" title="" class="ui-state-default ui-corner-all addNewInsPago jq-link-btn-small">Insertar Pago</span>';
                    hist = '<span id="OpClientIduserid_' + clientId + '" title="" class="ui-state-default ui-corner-all crmBtn jq-link-btn-small">Historial</span>';

                    //tProfile	= '<table class="fnOpenTable"><tr><td><div>';

                    tProfileImg = '<div style="float:left; margin-right:.5em; text-align:center">';
                    switch (clientInfo.client_type) {
                        case 1:
                        case 2:
                            tProfileImg += '<img src="/images/person-green.png" class="profile-img" />';
                            break;
                        case 3:
                            tProfileImg += '<img src="/images/person.png" class="profile-img" />';
                            break;
                        case 4:
                            tProfileImg += '<img src="/images/person-red.png" class="profile-img" />';
                            break;
                        case 5:
                            tProfileImg += '<img src="/images/person-yellow.png" class="profile-img" />';
                            break;
                    }
                    tProfileImg += '<br /><span class="stateViewDivNoStatus">' + clientInfo.type_name + '</span></div>';

                    //tProfile	+= '<div>';
                    tProfile = '<div style="position:relative;" class=""><div style="position: absolute; right: 0px;"><span clientid="' + clientId + '" title="Eliminar Cliente" class="deleteBtn2 ui-state-default ui-corner-all jq-link-btn-small" style="font-size:smaller; background:red">Eliminar</span></div></div>';
                    tProfile += '<p title="Editar Cliente" id="editBtn2" clientid="' + clientId + '" class="bct client-details client-name" style="float:left; cursor:pointer; margin-right:1em" onmouseover="$(this).next().show()" onmouseout="$(this).next().hide()">' + fn + ' ' + ln + '</p>';
                    //edit button
                    tProfile += '<div style="display:none; clear:right;"><img src="/images/editBtn.png" title="Editar Cliente" style="" /></div>';
                    tProfile += '<p class="bct client-details" style="clear:both"><b>DNI:</b> ' + dni + '</p>';
                    tProfile += '<p class="bct client-details"><b>Celular:</b> ' + tc + '</p>';
                    tProfile += '<p class="bct client-details"><b>Tel:</b> ' + tl + '</p>';
                    tProfile += '<p class="bct client-details"><b>Email:</b> <span style="text-transform:none"><a href="mailto:' + email + '">' + email + '</a></span></p>';
                    tProfile += '<p class="bct client-details"><b>Actividad:</b> ' + activity + '</p>';
                    tProfile += '<p class="bct client-details" style=""><b>Otros datos:</b> ' + extra_info + '</p>';
                    tProfile += '<p class="bct client-details" style="margin-bottom:5px;"><b>Contacto:</b> ' + clientInfo.contact_title + '</p>';
                    //tProfile	+= '</div></div></div></td></tr>';
                    //tProfile	+= '</table>';

                    vProfile = '<table>';
                    vProfile += '<tr><td>' + tercerosOpBtn + '</td></tr>';
                    vProfile += '<tr><td>' + newoprBtn + '</td></tr>';
                    vProfile += '<tr><td>' + gdcBtn + '</td></tr>';
                    vProfile += '<tr><td>' + inPegoBtn + '</td></tr>';
                    vProfile += '<tr><td>' + hist + '</td></tr>';
                    vProfile += '</table>';
                    /*tProfile	= '<table class="fnOpenTable">';
                     tProfile	+= '<tr><td class="bct"><img src="/images/person.png"/>'+fn+' '+ln+'</td></tr>';
                     tProfile	+= '<tr><td class="bct">DNI: '+dni+'</td></tr>';
                     tProfile	+= '<tr><td class="bct">Celular: '+tc+'</td></tr>';
                     tProfile	+= '<tr><td class="bct">Tel: '+tl+'</td></tr>';
                     tProfile	+= '<tr><td>'+newoprBtn+'</td></tr>';
                     tProfile	+= '<tr><td>'+gdcBtn+'</td></tr>';
                     tProfile	+= '<tr><td>'+inPegoBtn+'</td></tr>';
                     tProfile	+= '</table>';*/

                    var finalTable = '<table style="max-width:950px;"><tr><td><table class="user-panel-table fnOpenTable">' +
                            '<tr valign="top"><td><div style="min-width:610px">' + tProfileImg +
                            '<div class="profile-info">' + tProfile + '<div><div class="detail-tables">' +
                            bankdetailsHTML + '</div><div class="detail-tables">' + addressesHTML + '</div><div class="detail-tables">' +
                            priorHTML + '</div></div></div><div style="float:left">' + vProfile + '</div></div></td><td></td></tr></table>';

                    /*var finalTable = '<table class="fnOpenTable">'+
                     '<tr><td>'+	bankdetailsHTML	+'</td><td rowspan="3">'+tProfile+'</td></tr>'+
                     '<tr><td>'+	addressesHTML	+'</td></tr>'+
                     '<tr><td>'+	priorHTML		+'</td></tr>';*/
                    finalTable += operationsHTML + '</td></tr></table>';
                    finalTable = '<div class="animation-wrapper">' + finalTable + '</div>';
                    //finalTable +='</table>';
                    //oTable.fnClose(nTr);
                    trdet.addClass('row_selected');
                    var nDetailsRow = oTable.fnOpen(nTr, finalTable, 'details');
                    if (e.originalEvent !== undefined) //clicked by mouse, make animation
                        $('div.animation-wrapper', nDetailsRow).slideDown();
                    else //don't animate
                        $('div.animation-wrapper', nDetailsRow).show();
                    //trdet.next('tr').find('.details').removeClass('fnTableLoading');
                    amBtnImg.removeClass('amBtnLoading');
                }
                else
                    alert('ajax returned no data');
            }, 'json');
        }
    });

    function fnChequeDetails(oTable, nTr, data, opType)
    {
        var client_id, balance, check_n, x, status, payment_type, payment_type_name, cobranzas_count, addCls, pro_name, cave_name, supplier_name, redColor, item, i, blured;
        var aData = oTable.fnGetData(nTr);
        client_id = nTr.id;
        client_id = client_id.split('_');
        client_id = client_id[1];
        var sOut = '<table class="whiteTable operation-details-table" id="chequesTable_' + client_id + '">';
        sOut += '<tr>';
        if (opType == 2)
            sOut += '<th>Titular</th>';
        sOut += '<th>Fecha</th><th>N Cheque</th><th>Importe</th>';
        if (opType == 2)
            sOut += '<th>Cant. Días</th><th>Valor al Día</th>';
        sOut += '<th>Estado</th><th>Detalle</th><th>Acciones</th></tr>';

        var rejBtn = ' <img src="/images/cancel.png" title="Rechazar Cheque" class="rejectChequeBtn" /> ';
        var payedBtn = ' <img src="/images/accept.png" class="payedChequeBtn"  /> ';
        var RowCount = 0;
        for (x in data) {
            RowCount = 1;
            item = data[x];
            //set empty string for all null values
            for (i in item) {
                if (item[i] === null)
                    item[i] = '';
            }
            status = parseInt(item['status']);
            addCls = '';
            if (status == 3)
                addCls = 'lightRedTr';
            else if (status == 2)
                addCls = 'lightGreenTr';
            
            if (item['status_name'] == 'Informe desaprobado' || item['status_name'] == 'Anulado' || item['status_name'] == 'Cheque fantasma') {
                redColor = 'style="color:red"';
                blured = 'chequeBlured';
            }
            else {
                redColor = '';
                blured = '';
            }
            
            sOut += '<tr id="chequelistid_' + item['id'] + '" class="' + addCls + ' ' + blured +'">';
            if (opType == 2)
                sOut += '<td class="td_titular">' + item['first_name'] + ' ' + item['last_name'] + '</td>';

            sOut += '<td class="td_date">' + item['date'] + '</td>';
            check_n = item['check_n'];
            if (check_n == null) {
                check_n = 'Sin Especificar';
            }

            payment_type = parseInt(item['rejected_check_payment']);
            switch (payment_type) {
                case 1:
                    payment_type_name = ' (Cheque Propio)';
                    break;
                case 2:
                    payment_type_name = ' (Cheque Tercero)';
                    break;
                default:
                    payment_type_name = '';
                    break;
            }
            if (item['balance']) {
                balance = item['balance'];
                if (balance == '0.00')
                    balance = 'Pagado';
            } else
                balance = '';

            pro_name = '';
            if (status == 4) {
                /*
                 cave_name = item['cave_name'];
                 supplier_name = item['supplier_name'];
                 if(cave_name){
                 pro_name = cave_name;
                 }else if(supplier_name){
                 pro_name = supplier_name;
                 }*/
                pro_name = item['cave_name'];
            }
            
            sOut += '<td class="td_check_n">' + check_n + '</td>';
            sOut += '<td class="td_amount">' + amountFormat(item['amount']) + '</td>';
            if (opType == 2) {
                sOut += '<td class="td_days">' + item['days'] + '</td>';
                sOut += '<td class="td_today_value">' + amountFormat(item['today_value']) + '</td>';
            }
            sOut += '<td class="td_status_name"><span ' + redColor + '>' + item['status_name'] + payment_type_name + '</span></td>';
            sOut += '<td class="td_rej_balance">' + amountFormat(balance) + ' ' + pro_name + '</td>';
            sOut += '<td class="td_actions">';

            if (status == 4 || status == 1 || status == 2) {
                sOut += rejBtn;
                //sOut += 	payedBtn;
            }
            /*
             cobranzas_count = parseInt(item['cobranzas_count']);
             
             if(status	==	3 && cobranzas_count){
             sOut +=	'<span class="ui-state-default ui-corner-all addNewGdc" title="" id="OpClientIduserid_'+client_id+'"><span class="jq-link-btn">Gestión de Cobranza</span></span>';
             }else if(status	==	3 && cobranzas_count	==	0){
             sOut +=	'<span class="ui-state-default ui-corner-all" title="" id="OpClientIduserid_'+client_id+'"><span class="jq-link-btn">Accrediation</span></span>';
             }
             */
            if (opType == 2 && status == 6) //informe not set yet
                sOut += '<img src="/images/like.png" title="Informe aprobado" class="approveChequeBtn" onmouseover="this.src = \'/images/like-over.png\'" onmouseout="this.src=\'/images/like.png\'" /> <img src="/images/unlike.png" title="Informe desaprobado" class="disapproveChequeBtn" onmouseover="this.src = \'/images/unlike-over.png\'" onmouseout="this.src=\'/images/unlike.png\'" />';
            else if (opType == 2 && status != 6) { //informe already set
                sOut += '<img src="/images/ico_report_new.png" title="INFORME: ' + item['informe_report'] + '" style="cursor:default" />';
            }
            sOut += '</td>';
            sOut += '</tr>';
        }
        if (!RowCount) {
            sOut += '<tr>';
            sOut += '<td class="td_cheques" colspan="6" align="center">No figuran cheques para esta operación.</td>';
            sOut += '</tr>';
        }
        /*sOut += '<tr>';
         sOut += 	'<td  colspan="5" align="right">';
         sOut += 		'<span id="OpClientIduserid_182" title="" class="operationStepSix ui-state-default ui-corner-all ui-state-default ui-corner-all row_selected">';
         sOut +=				'<span class="jq-link-btn">Editar Cheques';
         sOut +=				'<input type="hidden" value="146" name="operationid">';
         sOut +=				'<input type="hidden" value="243.00" name="amount">';
         sOut +=				'<input type="hidden" value="0" name="cave_id">';
         sOut +=				'<input type="hidden" value="14" name="state_id">';
         sOut +=		'</span></span>';
         sOut += 	'</td>';
         sOut += '</tr>';*/
        sOut += '</table>';
        return sOut;
    }
//*************************************** DIALOGS (POPUPS) *****************************************/
    $("#newOperations").dialog({
        autoOpen: false,
        modal: true,
        height: 350,
        width: 600,
        buttons: {
            "Crear Operación": function() {
                $("#operationsForm").submit();
            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });

    $(".EditPriorFromClientPanel").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 600,
        buttons: {
            "Crear Operación": function() {
                $("#EditPriorClientForm").submit();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        }
    });

    $("#insertPayment").dialog({
        autoOpen: false,
        autoResize: true,
        //modal:true,
        width: 600,
        //height: 375,       
        buttons: {
            "Guardar": function() {
                $("#insertPaymentForm").submit();
            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });
    $("#Plans").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 600,
        buttons: {
            'Cerrar Operacion': function() {
                $("#plansForm").submit();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        }
    });
    $("#PlansEdit").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 800,
        buttons: {
            'Guardar': function() {
                $("#plansEditForm").submit();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        }
    });

    $(".rejected_cheques_payment").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 800,
        buttons: {
            'Insertar Pago': function() {
                var client_id = $('.rejected_cheques_payment [name="client_id"]').val();
                $('#grid #userid_' + client_id).next('tr').find('.addNewInsPago').trigger('click');
            },
            'Cerrar': function() {
                $(this).dialog('close');
            },
        },
        close: function(event, ui)
        {
            $('.rejected_cheques_payment [name="rcp_status"]').val(0);
        },
        open: function(event, ui)
        {
            $('.rejected_cheques_payment [name="rcp_status"]').val(1);
        },
    });

//******************************************** EOF DIALOGS ******************************************************/


    $('.pdfBtnPop').live('click', function() {
        var url = '/index/generatepdf';
        var clientid = $(this).parents('td').find('[id*="OpClientIduserid_"]').attr('id').split('_');
        var operationid = $(this).parents('td').find('[name="operationid"]').val();
        clientid = clientid[1];
        typeid = $(this).parent('.details_pdf').find('input:hidden').val();
        url += "/clientid/" + clientid + "/typeid/" + typeid + '/status/0/operationid/' + operationid;
        window.location = url;

    });

    $('.pdfBtnNew').live('click', function() {
        var url = '/index/generatepdf';
        var clientid = $(this).parents('td').find('[id*="OpClientIduserid_"]').attr('id').split('_');
        var operationid = $(this).parents('td').find('[name="operationid"]').val();
        clientid = clientid[1];
        typeid = $(this).parent('.details_pdf').find('input:hidden').val();
        url += "/clientid/" + clientid + "/typeid/" + typeid + '/status/1/operationid/' + operationid;
        window.open(url, '_blank');
    });

    $('.addNewOperations').live('click', function() {
        var bankoptions, bankname, acnumber, bankDetailsTable, bankid;
        bankoptions = bankname = acnumber = '';

        $(this).append('<div class="btnLoading"></div>');
        bankDetailsTable = $(this).parents('.user-panel-table:eq(0)');
        bankDetailsTable = $('table[id^="bankTable_"]', bankDetailsTable);

        //bankoptions	=	'<option value="">Select</option>';
        $('tr[id^="bankid_"]', bankDetailsTable).each(function() {
            bankid = $(this).attr('id').split('_');
            bankname = $('.td_bank_name', this).text();
            acnumber = $('.td_account_n', this).text();
            bankoptions += '<option value="' + bankid[1] + '">' + bankname + ' ' + acnumber + '</option>'
        });
        $('[name="bank_account_id"]', tform).html(bankoptions);
        $('[name="bank_account_id"] option:last', tform).attr('selected', 'selected');
        $("#newOperations").dialog('open');
        var clientid = $(this).attr('id').split('_');
        var tform = $('#operationsForm');
        $('[name="client_id"]', tform).val(clientid[1]);
        $('[name="date"]', tform).val(currentDate);
        $('.opClientName', tform).text($('#userid_' + clientid[1] + ' .user_first_name').text() + ' ' + $('#userid_' + clientid[1] + ' .user_last_name').text());
        $('.btnLoading', this).hide();
    });

    $('.crmHistory').dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        buttons: {
            'Guardar': function() {
                var submitOperatorComment = $('.crmHistoryTag input[type="button"][value="Submit"]').attr('onClick');

                eval("'" + submitOperatorComment + "'");

            },
            Cancel: function() {
                $(this).dialog('close');
            }
        }
    });

    $('.crmBtn').live('click', function() {
        var clientid = $(this).attr('id').split('_');
        var dialogTitle = $('#userid_' + clientid[1] + ' .user_first_name').text() + ' ' + $('#userid_' + clientid[1] + ' .user_last_name').text();
        var viewportHeight = $(window).height();
        var dialog = $('#crmDialog');
        dialog.dialog({
            autoOpen: false,
            resizable: false,
            draggable: false,
            position: 'top',
            close: function(event, ui) {
                dialog.hide();
            },
            modal: true,
            dialogClass: 'dialogPosition',
            width: 350,
            height: viewportHeight - 10,
            title: dialogTitle
        });
        $('#crmDialog').parent().css({position: "fixed"}).end().dialog('open');


        var url = '/crm/clientinfo/' + clientid[1];
        dialog.load(
                url,
                {},
                function(responseText, textStatus, XMLHttpRequest) {
                    dialog.removeClass('loading');
                    viewportHeight -= 200;
                    $('#client-info ul').css('height', viewportHeight + 'px');
                }
        );

        return false;

    });

    $('.addNewInsPago').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        var clientid = $(this).attr('id').split('_');
        var tform = $('#insertPaymentForm');
        $('[name="rejected_cheques"]', tform).html('<option>Cargando...</option>');
        $('[name="payment_type"]', tform).val('').trigger('change');
        $("#insertPayment").dialog('open');
        var bankDetailsTable = $(this).parents('.user-panel-table:eq(0)');
        bankDetailsTable = $('table[id^="bankTable_"]', bankDetailsTable);
        var date = bankoptions = bankidvar = bankname = acnumber = '';
        //bankoptions	=	'<option value="">Select</option>';
        $('tr[id^="bankid_"]', bankDetailsTable).each(function() {
            bankid = $(this).attr('id').split('_');
            bankname = $('.td_bank_name', this).text();
            acnumber = $('.td_account_n', this).text();
            bankoptions += '<option value="' + bankid[1] + '">' + bankname + ' ' + acnumber + '</option>';
        });
        $('[name="bank_account_id"]', tform).html(bankoptions);
        $('[name="bank_account_id"] option:last', tform).attr('selected', 'selected');
        $('[name="client_id"]', tform).val(clientid[1]);
        $('[name="date"]', tform).val(currentDate);
        $('.opClientName', tform).text($('#userid_' + clientid[1] + ' .user_first_name').text() + ' ' + $('#userid_' + clientid[1] + ' .user_last_name').text());
        var url = '/index/getrejedchequescteyclientidajax';
        $.post(url, {
            "client_id": clientid[1]
        },
        function(data) {
            var rejDrp = $('[name="rejected_cheques"]', tform);
            var item, check_n, amount, option = '';
            if (data) {
                if (!jQuery.isEmptyObject(data)) {
                    option += '<option value="">Seleccionar</option>';
                    for (var x in data) {
                        item = data[x];
                        check_n = item['check_n'];
                        id = item['id'];
                        bank_name = item['bank_name'];
                        balance = item['balance'];
                        date = item['date'];
                        operation_id = item['operation_id'];
                        option += '<option value="' + id + '" balance="' + balance + '" operation_id="' + operation_id + '">' + check_n + ' ' + bank_name + ' ' + date + '</option>';
                    }
                }
                rejDrp.html(option);
            }
            else {
                option += '<option value="">No registra cheques deudores.</option>';
                rejDrp.html(option);
            }
        }, 'json');
        $('.btnLoading', this).hide();
    });

    $('#insertPaymentForm [name="payment_type"]').live('change', function() {
        var payment_type = parseInt($(this).val());
        var tForm = $('#insertPaymentForm');
        switch (payment_type) {
            case 1:
                $('.own_cheque_table', tForm).hide();
                $('.third_party_cheque_table', tForm).hide();
                $('.own_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                $('.third_party_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                break;
            case 2:
                $('.own_cheque_table', tForm).show();
                $('.third_party_cheque_table', tForm).hide();
                $('.own_cheque_table .notrequired', tForm).addClass('required').removeClass('notrequired');
                $('.third_party_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                break;
            case 3:
                $('.own_cheque_table', tForm).hide();
                $('.third_party_cheque_table', tForm).show();
                $('.own_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                $('.third_party_cheque_table .notrequired', tForm).addClass('required').removeClass('notrequired');
                break;
            default:
                $('.own_cheque_table', tForm).hide();
                $('.third_party_cheque_table', tForm).hide();
                $('.own_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                $('.third_party_cheque_table .required', tForm).addClass('notrequired').removeClass('required');
                break;
        }
    });

    $('#insertPaymentForm [name="rejected_cheques"]').live('change', function() {
        $('#insertPaymentForm [name="operation_id"]').val($('option:selected', this).attr('operation_id'));
        $('#insertPaymentForm [name="previous_balance"]').val($('option:selected', this).attr('balance'));
    });

    $('#insertPaymentForm [name="paid_amount"]').live('blur', function() {
        var prev_bal = parseFloat($('#insertPaymentForm [name="previous_balance"]').val());
        var amount_paying = parseFloat($(this).val());
        balance = (prev_bal - amount_paying).toFixed(2);
        if (!balance || balance == 'NaN') {
            balance = '';
        }
        $('#insertPaymentForm [name="current_balance"]').val(balance);
    });

    $('#insertPaymentForm .own_cheque_table [name="amount"]').live('keyup', function() {
        $('#insertPaymentForm [name="paid_amount"]').val($(this).val());
    });
    $('#insertPaymentForm .own_cheque_table [name="amount"]').live('blur', function() {
        $('#insertPaymentForm [name="paid_amount"]').trigger('blur');
    });
    $('#insertPaymentForm .third_party_cheque_table [name="new_amount"]').live('keyup', function() {
        $('#insertPaymentForm [name="paid_amount"]').val($(this).val());
    });
    $('#insertPaymentForm .third_party_cheque_table [name="new_amount"]').live('blur', function() {
        $('#insertPaymentForm [name="paid_amount"]').trigger('blur');
    });


    $("#insertPaymentForm").validate({
        submitHandler: function(form) {
            var tForm = $("#insertPaymentForm");
            $('[name="paid_amount"]', tForm).trigger('blur');
            var payment_type = parseInt($(' [name="payment_type"]', tForm).val());
            var client_id = $(' [name="client_id"]', tForm).val();
            var previous_balance = parseFloat($(' [name="previous_balance"]', tForm).val());
            var paid_amount = parseFloat($(' [name="paid_amount"]', tForm).val());
            var reqData;
            if (previous_balance < paid_amount) {
                showmsg("Importe mayor al adeudado. Por favor, ingrese un importe igual o menor al saldo pendiente.", 'f');
                return false;
            }
            else {
                switch (payment_type) {
                    case 1:
                        reqData = {
                            'client_id': client_id,
                            'operation_id': $(' [name="operation_id"]', tForm).val(),
                            'cheque_id': $(' [name="rejected_cheques"] option:selected', tForm).val(),
                            'date_paid': currentDate,
                            'paid_amount': $(' [name="paid_amount"]', tForm).val(),
                            'previous_balance': $(' [name="previous_balance"]', tForm).val(),
                            'current_balance': $(' [name="current_balance"]', tForm).val(),
                            'payment_type': $(' [name="payment_type"]', tForm).val(),
                        };
                        break;

                    case 2:
                        reqData = {
                            'client_id': client_id,
                            'operation_id': $(' [name="operation_id"]', tForm).val(),
                            'cheque_id': $(' [name="rejected_cheques"] option:selected', tForm).val(),
                            'date_paid': currentDate,
                            'paid_amount': $(' [name="paid_amount"]', tForm).val(),
                            'previous_balance': $(' [name="previous_balance"]', tForm).val(),
                            'current_balance': $(' [name="current_balance"]', tForm).val(),
                            'payment_type': $(' [name="payment_type"]', tForm).val(),
                            'cheque_date': $('.own_cheque_table [name="date"]', tForm).val(),
                            'new_cheque_n': $('.own_cheque_table [name="check_n"]', tForm).val(),
                            'rejected_bank_id': $('.own_cheque_table [name="bank_account_id"]', tForm).val(),
                        };
                        break;

                    case 3:
                        reqData = {
                            'client_id': client_id,
                            'operation_id': $(' [name="operation_id"]', tForm).val(),
                            'cheque_id': $(' [name="rejected_cheques"] option:selected', tForm).val(),
                            'date_paid': currentDate,
                            'paid_amount': $(' [name="paid_amount"]', tForm).val(),
                            'previous_balance': $(' [name="previous_balance"]', tForm).val(),
                            'current_balance': $(' [name="current_balance"]', tForm).val(),
                            'payment_type': $(' [name="payment_type"]', tForm).val(),
                            'cheque_date': $('.third_party_cheque_table [name="new_date"]', tForm).val(),
                            'new_cheque_n': $('.third_party_cheque_table [name="new_check_n"]', tForm).val(),
                            'bank_name': $('.third_party_cheque_table [name="bank_name"]', tForm).val(),
                            'branch': $('.third_party_cheque_table [name="branch"]', tForm).val(),
                            'account_n': $('.third_party_cheque_table [name="account_n"]', tForm).val(),
                            'opening_date': $('.third_party_cheque_table [name="opening_date"]', tForm).val(),
                            'check_zip_code': $('.third_party_cheque_table [name="new_check_zip_code"]', tForm).val(),
                            'location_capital': $('.third_party_cheque_table [name="location_capital"]:checked', tForm).val(),
                        };
                        break;
                }

                var url = '/index/savepaymentforrejectedchequeajax';
                $.post(url, reqData,
                        function(data) {
                            if (isInt(data)) {
                                var seltr = $('#userid_' + client_id);
                                $("#insertPayment").dialog('close');
                                clearForm(tForm);
                                if (data == -1) { //client status is no longer in cobranza. 
                                    $('#grid').dataTable().fnDeleteRow($('#grid #userid_' + client_id).next('tr'));
                                }
                                else {
                                    //$('.amBtn', seltr).trigger('click', [true]);
                                    $('#userid_' + client_id).trigger('click', [true]);

                                    if (parseInt($('.rejected_cheques_payment [name="rcp_status"]').val())) {
                                        $('#grid #userid_' + client_id).next('tr').find('.addNewGdc').trigger('click');
                                    }
                                }
                                showmsg("El pago fue agregado", 't');
                            } else {
                                showmsg("Hubo un error al insertar pago, por favor intente nuevamente.", 'f');
                            }
                        });
            }
        }
    });


//************************************* CHEQUES DE TERCEROS ****************************************/
    //initialize terceros table for consolidation
    var _vgliTable = $('#viewChequesGridView').dataTable({
        "bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        "bAutoWidth": true,
        'aoColumns': [{"sSortDataType": "dom-checkbox"}, null, null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'}, {'sType': 'num-html'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[3, "asc"]]
    });

    //initialize terceros consolidation dialog
    $("#consolidateTercerosOp").dialog({
        autoOpen: false,
        modal: true,
        height: 450,
        width: 1000,
        buttons: {
            'Consolidar': function() {
                $("#consolidateTercerosOpForm").submit();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        }
    });

    //initialize terceros op dialog
    $("#addChequesTerceros").dialog({
        autoOpen: false,
        autoResize: true,
        //modal:true,
        width: 750,
        //height: 375,       
        buttons: {
            "Guardar": {
                text: 'Guardar',
                class: 'cancel', //this makes validation be ommited.
                click: function() {
                    $("#addTercerosOpForm").submit();
                },
            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });

    $('#addTercerosOpForm').validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus(); //Set Focus on first error
            }
        }
    });
    $('#tasaAnual').live('change', function() {
        var tform = $('#addTercerosOpForm');
        $('[name="tasa_anual"]', tform).val($(this).val());
    });

    //open terceros op dialog
    $('.addTercerosOp').live('click', function() {
        var tform = $('#addTercerosOpForm');
        //$(this).append('<div class="btnLoading"></div>');
        var clientid = $(this).attr('id').split('_');
        $('[name="client_id"]', tform).val(clientid[1]);
        $('[name="date"]', tform).val(currentDate);
        $('.opClientName', tform).text($('#userid_' + clientid[1] + ' .user_first_name').text() + ' ' + $('#userid_' + clientid[1] + ' .user_last_name').text());
        $("#addChequesTerceros").dialog('open');
        //$('[name="rejected_cheques"]', tform).html('<option>Cargando...</option>');
        //$('[name="payment_type"]', tform).val('').trigger('change');
    });

    //add cheque tercero
    $('#addChequeTercero').live('click', function() {
        var tForm, cheques, chequesQty, opAmt, todayAmt;
        tForm = $("#addTercerosOpForm");
        if (tForm.valid()) {
            adminData = {
                //'liqDate':currentdate, //global var with server current date or liquidacion date (if changed from current date);
                'impuestoAlCheque': parseFloat($('[name="impuesto_al_cheque"]').val(), tForm),
                'tasaAnual': parseFloat($('[name="tasa_anual"]').val(), tForm),
                'acCapital': parseInt($('[name="ac_capital"]').val(), tForm),
                'acInterior': parseInt($('[name="ac_interior"]').val(), tForm),
                'gastosGeneral': parseFloat($('[name="gastos_general"]').val(), tForm),
                'gastosInterior': parseFloat($('[name="gastos_interior"]').val(), tForm)
            };
            var chequeAmount = amountFormatR($('[name="check_amount"]', tForm).val());
            var location_capital = parseInt($('[name="location_capital"]', tForm).val());
            var date = $('[name="check_date"]', tForm).val();
            var chequeTodayDetails = getCheckValue(chequeAmount, date, location_capital, adminData);

            cheques = $("#ntp-cheques-terceros-list");
            cheques.append('<li><span class="first-name">' + $('[name="first_name"]', tForm).val() + '</span> <span class="last-name">' + $('[name="last_name"]', tForm).val() + '</span> <strong style="color:#D64925">|</strong> <span class="check-date">' + $('[name="check_date"]', tForm).val() + '</span> <strong style="color:#D64925">|</strong> &numero; <span class="check-n">' + $('[name="check_n"]', tForm).val() + '</span> <strong style="color:#D64925">|</strong> <span class="check-amount">' + amountFormat($('[name="check_amount"]', tForm).val()) + '</span> / <span class="check-today-value">' + amountFormat(chequeTodayDetails.todayValue) + '</span><img src="/images/cancel.png" class="removeChequeTercero ntp-remove-btn" /><input type="hidden" name="ntc_titular_id" value="" /> <input type="hidden" name="ntc_first_name" value="' + $('[name="first_name"]', tForm).val() + '" /> <input type="hidden" name="ntc_last_name" value="' + $('[name="last_name"]', tForm).val() + '" /> <input type="hidden" name="ntc_DNI" value="' + $('[name="DNI"]', tForm).val() + '" /> <input type="hidden" name="ntc_CUIL" value="' + $('[name="CUIL"]', tForm).val() + '" /> <input type="hidden" name="ntc_check_date" value="' + $('[name="check_date"]', tForm).val() + '" /> <input type="hidden" name="ntc_check_n" value="' + $('[name="check_n"]', tForm).val() + '" /> <input type="hidden" name="ntc_check_amount" value="' + amountFormatR($('[name="check_amount"]', tForm).val()) + '" /> <input type="hidden" name="ntc_check_today_amount" value="' + chequeTodayDetails.todayValue + '" /> <input type="hidden" name="ntc_bank_name" value="' + $('[name="bank_name"]', tForm).val() + '" /> <input type="hidden" name="ntc_branch" value="' + $('[name="branch"]', tForm).val() + '" /> <input type="hidden" name="ntc_zip" value="' + $('[name="zip_code"]', tForm).val() + '" /> <input type="hidden" name="ntc_location" value="' + $('[name="location_capital"]', tForm).val() + '" /> <input type="hidden" name="ntc_account_n" value="' + $('[name="account_n"]', tForm).val() + '" /> <input type="hidden" name="ntc_account_date" value="' + $('[name="opening_date"]', tForm).val() + '" /> </li><br />');

            //update cheques qty
            chequesQty = parseInt($('[name="checks_qty"]', tForm).val()) + 1;
            $('[name="checks_qty"]', tForm).val(chequesQty);
            $('.ntp-checks-qty').text(chequesQty);

            //update op total amount
            opAmt = amountFormatR(($('[name="op_amount"]', tForm).val())) + amountFormatR($('[name="check_amount"]', tForm).val());
            $('[name="op_amount"]', tForm).val(opAmt);
            $('.ntp-op-amount').text(amountFormat(opAmt));
            todayAmt = amountFormatR(($('[name="op_today_amount"]', tForm).val())) + chequeTodayDetails.todayValue;
            $('[name="op_today_amount"]', tForm).val(todayAmt);
            $('.ntp-op-today-amount').text(amountFormat(todayAmt));

            //clean up
            $(':input', '#addTercerosOpForm')
                    .not(':button, :submit, :reset, :hidden, :radio, select')
                    .val('');
            $(':radio', '#addTercerosOpForm').attr('checked', false);
            $('select', '#addTercerosOpForm').not('#tasaAnual').attr('selected', false);

            //set titular box to focus
            $('[name="first_name"]', tForm).focus();
        }
    });

    //remove cheque tercero
    $('.removeChequeTercero').live('click', function() {
        var tForm, chequesQty, opAmt, todayAmt;
        $(this).parent().next().remove(); //delete de <br />
        $(this).parent().remove();

        tForm = $("#addTercerosOpForm");

        //update cheques qty
        chequesQty = parseInt($('[name="checks_qty"]', tForm).val()) - 1;
        $('[name="checks_qty"]', tForm).val(chequesQty);
        $('.ntp-checks-qty').text(chequesQty);

        //update op total amount
        opAmt = amountFormatR(($('[name="op_amount"]', tForm).val())) - amountFormatR($('[name="check_amount"]', $(this).parent()).val());
        $('[name="op_amount"]', tForm).val(opAmt);
        $('.ntp-op-amount').text(amountFormat(opAmt));
        todayAmt = amountFormatR(($('[name="op_today_amount"]', tForm).val())) - amountFormatR($('[name="check_today_amount"]', $(this).parent()).val());
        $('[name="op_today_amount"]', tForm).val(todayAmt);
        $('.ntp-op-today-amount').text(amountFormat(todayAmt));
    });

    //submit terceros operation
    $("#addTercerosOpForm").submit(function() {
        var tForm = $("#addTercerosOpForm");
        var chequesList = new Array();
        var totalAmount = $('[name="op_amount"]', tForm).val();

        $('#ntp-cheques-terceros-list li', tForm).each(function() {
            var cheque = {
                'titular_id': $('[name="ntc_titular_id"]', this).val(),
                'first_name': $('[name="ntc_first_name"]', this).val(),
                'last_name': $('[name="ntc_last_name"]', this).val(),
                'DNI': $('[name="ntc_DNI"]', this).val(),
                'CUIL': $('[name="ntc_CUIL"]', this).val(),
                'check_date': $('[name="ntc_check_date"]', this).val(),
                'check_n': $('[name="ntc_check_n"]', this).val(),
                'check_amount': $('[name="ntc_check_amount"]', this).val(),
                'account_n': $('[name="ntc_account_n"]', this).val(),
                'bank_name': $('[name="ntc_bank_name"]', this).val(),
                'branch': $('[name="ntc_branch"]', this).val(),
                'zip_code': $('[name="ntc_zip"]', this).val(),
                'location_capital': $('[name="ntc_location"]', this).val(),
                'account_date': $('[name="ntc_account_date"]', this).val()
            };
            chequesList.push(cheque);
        });
        $('#addChequesTerceros').dialog('close');
        $.post('/index/createtercerosopajax/', {
            'client_id': $('[name="client_id"]', tForm).val(),
            'date': $('[name="date"]', tForm).val(),
            'operation_id': '',
            'tasa_anual': $('[name="tasa_anual"]', tForm).val(),
            'state_id': '',
            'total_amount': totalAmount,
            'cheques_list': JSON.stringify(chequesList),
        }, function(data) {
            if (isInt(data)) {
                //var seltr = $('#userid_' + $('[name="client_id"]', tForm).val());
                //$('.amBtn', seltr).trigger('click', [true]);
                $('#userid_' + $('[name="client_id"]', tForm).val()).trigger('click', [true]);
                showmsg("La operación ha sido agregada", 't');
                $("#addChequesTerceros").dialog('close');
                clearForm(tForm);
                $('#ntp-cheques-terceros-list').html('');
                notificationbyopchange(data); //data = opId                   
            } else
                showmsg("Hubo un error al crear la operación de cheques de terceros, por favor intente nuevamente.", 'f');
        });

    });

    //aprobacion de informe
    $('.approveChequeBtn').live('click', function() {
        tooltipBox = getReportForm($(this), '/index/setinformeterceroajax');
        var chequeId = $(this).closest('[id*="chequelistid"]').attr('id').split('_');
        var opId = $(this).closest('.operations-table').find('[name="operation_id_reference"]').val();
        var clientId = $(this).closest('.operations-table').find('[name="client_id_reference"]').val();
        $('[name="client_id"]', tooltipBox).val(clientId);
        $('[name="operation_id"]', tooltipBox).val(opId);
        $('[name="cheque_id"]', tooltipBox).val(chequeId[1]);
        $('[name="approved"]', tooltipBox).val(1);
        $('[name="report"]', tooltipBox).val('');
    });
    $('.disapproveChequeBtn').live('click', function() {
        tooltipBox = getReportForm($(this), '/index/setinformeterceroajax');
        var chequeId = $(this).closest('[id*="chequelistid"]').attr('id').split('_');
        var opId = $(this).closest('.operations-table').find('[name="operation_id_reference"]').val();
        var clientId = $(this).closest('.operations-table').find('[name="client_id_reference"]').val();
        $('[name="client_id"]', tooltipBox).val(clientId);
        $('[name="operation_id"]', tooltipBox).val(opId);
        $('[name="cheque_id"]', tooltipBox).val(chequeId[1]);
        $('[name="approved"]', tooltipBox).val(0);
        $('[name="report"]', tooltipBox).val('');
    });

    //enviar step
    $('.sendTercerosBtn').live('click', function() {
        tooltipBox = showPopupBox($(this), '.enviarTercerosOp');
        var clientId = $(this).closest('.operations-table').find('[name="client_id_reference"]').val();
        var opId = $(this).closest('.operations-table').find('[name="operation_id_reference"]').val();
        var tasaActual = $(this).closest('.operations-table').find('[name="tasa_reference"]').val();
        $('[name="client_id"]', tooltipBox).val(clientId);
        $('[name="operation_id"]', tooltipBox).val(opId);
        $('[name="pop_tasa_anual"]', tooltipBox).val(tasaActual);
    });

    $('#enviarTercerosOpForm').validate({
        submitHandler: function(form) {
            var url = '/index/sendtercerosopajax/';
            var clientId = $('[name="client_id"]', form).val();
            var opId = $('[name="operation_id"]', form).val();
            var tasa = $('[name="pop_tasa_anual"]', form).val();

            $.post(url, {
                "operation_id": opId,
                "tasa_anual": tasa,
            },
                    function(data) {
                        $('#userid_' + clientId).trigger('click', [true]);
                        $('.enviarTercerosOp').hide();
                        notificationbyopchange(opId);

                        if (data == '1') {
                            showmsg("El estado ha sido actualizado", 't');
                        }
                        else if (data == '2') {
                            showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
                        }
                        else if (data == '0') {
                            showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
                        }
                    });
            return false;
        }
    });

    $('.consolidateTercerosOpBtn').live('click', function() {
        var clientId = $(this).closest('.operations-table').find('[name="client_id_reference"]').val();
        var opId = $(this).closest('.operations-table').find('[name="operation_id_reference"]').val();
        var acDate = $(this).closest('.operations-table').find('[name="ac_date_reference"]').val();
        var tasa = $(this).closest('.operations-table').find('[name="tasa_reference"]').val();

        var tForm = $('#consolidateTercerosOpForm');
        $('[name="client_id"]', tForm).val('');
        $('[name="op_id"]', tForm).val('');
        $('[name="op_ac_date"]', tForm).val('');
        $('[name="op_tasa"]', tForm).val('');
        //clearForm(tForm);
        var url = '/index/gettercerosopdetailsajax';
        $.post(url, {
            'operation_id': opId
        },
        function(data) {
            if (data) {
                //var liquidacion	= data['liquidacion'];
                //var provData = data['provData'];    
                var chequeListJson = data['chequesList'];
                $('[name="client_id"]', tForm).val(clientId);
                $('[name="op_id"]', tForm).val(opId);
                $('[name="op_ac_date"]', tForm).val(acDate);
                $('[name="op_tasa"]', tForm).val(tasa);

                _vgliTable.fnClearTable();
                _vgliTable.fnSetColumnVis(0, true);
                var oSettings = _vgliTable.fnSettings();


                //if(committed) {
                //if liquidacion already committed then get the historic values for when the liq was created
                /*
                 liqData = {
                 'liqDate': liquidacion_date,
                 'impuestoAlCheque': provData['impuesto_al_cheque'],
                 'tasaAnual': provData['tasa_anual'],
                 'acCapital': provData['acreditacion_capital'],
                 'acInterior': provData['acreditacion_interior'],
                 'gastosGeneral': provData['gastos_general'],
                 'gastosInterior': provData['gastos_interior'],
                 'gastosChequeMenorA1': provData['gastos_menor_a_monto_1'],
                 'gastosFeeChequeMenorA1': provData['gastos_menor_a_1'],
                 'gastosChequeMenorA2': provData['gastos_menor_a_monto_2'],
                 'gastosFeeChequeMenorA2': provData['gastos_menor_a_2']                    
                 };
                 */
                // set the global liq data for viewing liquidaciones to current liq
                //_liqDataEdit = liqData;
                for (var x in chequeListJson)
                {
                    item = chequeListJson[x];
                    selAmount = amountFormatR(item['amount']);
                    chkbox = chk('editli', true);
                    item['business'] = item['business'] != null ? item['business'] : '';
                    item['gastos'] = item['terceros_gastos_general'] != null ? item['terceros_gastos_general'] : item['terceros_gastos_interior'];
                    trmade = $('#viewChequesGridView').dataTable().fnAddData([
                        '<input type="hidden" name="location_capital" value="' + item['terceros_location'] + '" />' + chkbox,
                        '<span class="client_name">' + item['first_name'] + ' ' + item['last_name'] + '</span>',
                        '<span class="business">' + item['business'] + '</span>',
                        '<span class="check_date">' + item['date'] + '</span>',
                        '<span class="check_n">' + item['check_n'] + '</span>',
                        '<span class="chk_amount">' + amountFormat(selAmount) + '</span>',
                        '<span class="check_days">' + item['terceros_days'] + '</span>' + '<input type="hidden" name="acreditacion_hrs" value="' + item['terceros_ac_hours'] + '" />',
                        '<span class="check_imp">' + amountFormat(item['terceros_imp_al_cheque'] + item['gastos']) + '</span>',
                        '<span class="check_desc">' + amountFormat(item['terceros_descuento']) + '</span>',
                        '<span class="chk_final_amount">' + amountFormat(item['terceros_today_value']) + '</span>',
                    ]);
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editchequelistid_' + item['cheque_id'];
                }

                /*
                 checksTotalsHTML = '<td></td>'+
                 '<td style="text-align:right"><span class="fn_chequeChkCount">'+liquidacion['checks_qty']+'</span></td>'+
                 '<td><span class="fn_dayAvg">'+liquidacion['average_days']+'</span></td>'+
                 '<td><span class="fn_payingAmount">'+amountFormat(liquidacion['total_bruto'])+'</span></td>'+
                 '<td><span class="fn_impuestoAlCheque">'+amountFormat(liquidacion['impuesto_al_cheque_amt'])+'</span></td>'+                        
                 '<td><span class="fn_interests">'+amountFormat(liquidacion['intereses'])+'</span></td>'+
                 '<td><span class="fn_gastos_interior">'+amountFormat(liquidacion['gastos_interior_fee'])+'</span></td>'+
                 '<td><span class="fn_cost_general">'+amountFormat(liquidacion['gastos_general_fee'])+'</span></td>'+
                 '<td><span class="fn_other_cost">'+amountFormat(liquidacion['gastos_varios'])+'</span></td>'+
                 '<td><span class="paying_amount_span">'+amountFormat(liquidacion['total_neto'])+'</span></td>';                */

                //display totals
                displayChequesTotals();
                //$('#chequesTotals', '#viewChequesGridView').html(checksTotalsHTML);                
                //$('.opTotal', '.totalsView').text(amountFormat(item['total_neto']));
                //saldo = (totalFinalAmount - liquidacion['total_neto']) * -1;                
                //$('.balanceCls', '.finalPayViewByLiquidacionesId').text(amountFormat(saldo));

                $("#consolidateTercerosOp").dialog('open');

            } else {
                showmsg('Error al cargar los cheques, por favor intente nuevamente.', 'f');
            }
        }, 'json');
    });
    $('#viewChequesGridView tbody tr[id^="editchequelistid_"]').live('click', function() {
        if ($('[name="editli"]', this).is(':checked')) {
            $('[name="editli"]', this).removeAttr('checked');
            displayChequesTotals();
        } else {
            $('[name="editli"]', this).attr('checked', 'checked');
            displayChequesTotals();
        }
    });
    $('#viewChequesGridView tbody tr[id^="editchequelistid_"] [name="editli"]').live('change', function() {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
            displayChequesTotals();
        } else {
            $(this).attr('checked', 'checked');
            displayChequesTotals();
        }
    });

    $('#consolidateTercerosOpForm').validate({
        submitHandler: function(form) {
            var chequeSelected = false;
            $('[name="editli"]','#viewChequesGridView').each(function() { 
                if ($(this).is(':checked')) 
                    chequeSelected = true; 
            });
            
            if (chequeSelected) {
                var url = '/index/consolidatetercerosopajax/';
                var clientId = $('[name="client_id"]', form).val();
                var opId = $('[name="op_id"]', form).val();
                var tasa = $('[name="pop_tasa_anual"]', form).val();
                var chequesListJson = $('[name="cheques_json"]', form).val();

                $.post(url, {
                    "operation_id": opId,
                    "tasa_anual": tasa,
                    'cheques_json': chequesListJson
                }, function(data) {                    
                        $('#userid_' + clientId).trigger('click', [true]);
                        //$('.enviarTercerosOp').hide();
                        notificationbyopchange(opId);
                        $('#consolidateTercerosOp').dialog('close');

                        if (data == '1') {
                            showmsg("El estado ha sido actualizado", 't');
                        }
                        else if (data == '2') {
                            showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
                        }
                        else if (data == '0') {
                            showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
                        }
                    });
                return false;
            }
            else {
                showmsg("Por favor seleccione al menos un cheque.", 'f');
                return false;
            }
        },
        
    });
    //************************************ EOF CHEQUES DE TERCEROS *********************************************/
    
    
    
    $('.addNewGdc').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        $('.rejected_cheques_payment').dialog('open');
        $('.dataLoading').show();
        var bankDetailsTable = $(this).parents('.fnOpenTable:eq(0)');
        var clientid = $(this).attr('id').split('_');
        $('.rejected_cheques_payment [name="client_id"]').val(clientid[1]);
        var url = '/index/getgestiondetailsajax';
        gtTable.fnClearTable();
        gptTable.fnClearTable();
        $.post(url, {
            "client_id": clientid[1]
        },
        function(data) {
            if (data) {
                var item, check_n, amount, id, bank_name, balance, operation_id, date, rejected_gastos, rejected_cost, total, observations, option = '';
                gtTable.fnClearTable();
                var grcList = data['grcList'];
                var gccList = data['gccList'];
                for (var x in grcList) {
                    item = grcList[x];
                    check_n = item['check_n'];
                    id = item['id'];
                    bank_name = item['bank_name'];
                    balance = item['balance'];
                    operation_id = item['operation_id'];
                    date = item['date'];
                    amount = parseFloat(item['amount']);
                    rejected_gastos = item['rejected_gastos'] ? parseFloat(item['rejected_gastos']) : 0.00;
                    total = amount + rejected_gastos;
                    observations = item['observations'];
                    var trmade = $('#gestionTable').dataTable().fnAddData([
                        date,
                        check_n,
                        amountFormat(amount),
                        amountFormat(rejected_gastos),
                        amountFormat(total),
                        amountFormat(balance),
                        bank_name,
                        observations,
                    ]);
                }
                for (var x in gccList) {
                    item = gccList[x];
                    id = item['id'];
                    date_paid = item['date_paid'];
                    previous_balance = item['previous_balance'];
                    check_n = item['check_n'];
                    paid_amount = item['paid_amount'];
                    current_balance = item['current_balance'];
                    amount = parseFloat(item['amount']);
                    rejected_cost = parseFloat(item['rejected_cost']);
                    total = amount + rejected_cost;
                    observations = item['observations'];
                    var trmade = $('#gestionPagoTable').dataTable().fnAddData([
                        date_paid,
                        check_n,
                        amountFormat(paid_amount),
                        //FIX! GUS PIDIO QUE ACA SIEMPRE SE VEA EL IMPORTE TOTAL ORIGINAL DEL CHEQUE
                        //amountFormat(previous_balance), 
                        amountFormat(total),
                        amountFormat(current_balance),
                    ]);
                }
            } else {
                $('.dataLoading').hide();
                gtTable.fnClearTable();
                gptTable.fnClearTable();
            }
            $('.dataLoading').hide();

        }, 'json').error(function() {
            $('.dataLoading').hide();
            showmsg("El cliente no posee cheques rechazados.", 'f');
            return false;
        });
        $('.btnLoading', this).hide();
    });

    $('.operationStepTwo').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        //var url = '/index/operationsteptwoajax';
        var url = '/index/operationstatechangeajax';

        var operationid = $('[name="operationid"]', this).val();
        var cave_id = $('[name="cave_id"]', this).val();
        var clientid = $(this).attr('id').split('_');
        $.post(url, {
            "operation_id": operationid,
            "state_id": '2',
            "cave_id": cave_id
        },
        function(data) {
            //var seltr = $('#userid_' + clientid[1]);
            //$('.amBtn', seltr).trigger('click', [true]);
            $('#userid_' + clientid[1]).trigger('click', [true]);
            notificationbyopchange(operationid);

            if (data == '1') {
                showmsg("El informe ha sido pedido", 't');
                $("#newOperations").dialog('close');
                //clearForm(tForm);
            }
            else if (data == '2') {
                showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
            }
            else if (data == '0') {
                showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
            }
        });
    });

    $('.cancelOp').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        //var url = '/index/canceloperation';
        var url = '/index/operationstatechangeajax';
        var clTd = $(this).parents('tr.state-row').next();
        var operationid = $('[name="operation_id_reference"]', clTd).val();
        var clientid = $(this).parents('td.details').parent().prev().attr('id').split('_');
        $.post(url, {
            "operation_id": operationid,
            "state_id": '99'
        },
        function(data) {
            //var seltr = $('#userid_' + clientid[1]);
            //$('.amBtn', seltr).trigger('click', [true]);
            $('#userid_' + clientid[1]).trigger('click', [true]);

            if (data == '1') {
                showmsg("La operación ha sido cancelada", 't');
            }
            else if (data == '2') {
                showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
            }
            else if (data == '0') {
                showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
            }
        });
    });

    $('#PlansDrp').change(function() {
        var pqty = parseFloat($('option:selected', this).attr('pqty'));
        var prec = parseFloat($('option:selected', this).attr('prec'));
        var plansList = '';
        var interest = parseFloat($('#InterestDrp option:selected').attr('interestvalue'));
        var amount = parseFloat($('#Plans .pAmount').val());
        var interestAmount = ((interest * amount) / 100) + amount;
        var divAmount = parseFloat(Math.round(interestAmount / pqty)).toFixed(2);
        //recDate(currentDate,prec);
        if (!interest) {
            showmsg("Por favor seleccione un interés antes de seleccionar el plan.", 'f');
            $('#PlansDrp option[value=""]').attr('selected', 'selected');
            plansList = '';
            $('.plansListUL').html(plansList);
            return false;
        }
        if (!amount) {
            showmsg("Por favor ingrese un monto de operación antes de seleccionar el plan.", 'f');
            $('#PlansDrp option[value=""]').attr('selected', 'selected');
            plansList = '';
            $('.plansListUL').html(plansList);
            return false;
        }
        var insertDate = currentDate;
        for (var i = 1; i <= pqty; i++) {
            var newDate = recDate(insertDate, prec);
            plansList += '<li>Cheque ' + i + ' : <input type="text" class="datepicker changeDateSpan" size="16"  value="' + newDate + '" /> ';
            plansList += ' <span class="dollar">$</span> <span class="changeAmountSpan">' + divAmount + '</span> </li>';
            insertDate = newDate;
        }
        $('.plansListUL').html(plansList);
        datepicker();
    });
    /*$('#InterestDrp').change(function(){
     $('#PlansDrp').trigger('change');
     });
     $('.pAmount').blur(function(){
     $('#PlansDrp').trigger('change');
     });*/
    $('#PlansEditDrp').change(function() {
        var pqty = parseFloat($('option:selected', this).attr('pqty'));
        var prec = parseFloat($('option:selected', this).attr('prec'));
        var plansList = '';
        var amount = parseFloat(Math.round($('#PlansEdit .pAmount')).text());
        var divAmount = amount / pqty;

        for (var i = 1; i <= pqty; i++) {
            plansList += '<li>Cheque ' + i + ' : <span class="changeDateSpan">' + currentDate + '</span><span class="calBtn"> </span> ';
            plansList += ' [<span class="dollar">$</span> <span class="changeAmountSpan">' + divAmount + '</span><span class="calndBtn"> </span> ]</li>';
        }
        $('.plansEditListUL').html(plansList);
    });
    var pd = 1;
    $('.calBtn').live('click', function() {

    });
    $('.calndBtn').live('click', function() {

    });
    $('.cheque_nBtn').live('click', function() {

    });
    $('.operationStepThree').live('click', function() {
        tooltipBox = getReportForm($(this), '/index/operationstatechangeajax');
        var operationid = $('[name="operationid"]', this).val();
        var clientid = $(this).attr('id').split('_');
        $('[name="operation_id"]', tooltipBox).val(operationid);
        $('[name="client_id"]', tooltipBox).val(clientid[1]);
        $('[name="approved"]', tooltipBox).val(1);
        $('[name="report"]', tooltipBox).val('');
    });
    $('.operationStepThree_rej').live('click', function() {
        tooltipBox = getReportForm($(this), '/index/operationstatechangeajax');
        var operationid = $('[name="operationid"]', this).val();
        var clientid = $(this).attr('id').split('_');
        $('[name="operation_id"]', tooltipBox).val(operationid);
        $('[name="client_id"]', tooltipBox).val(clientid[1]);
        $('[name="approved"]', tooltipBox).val(0);
        $('[name="report"]', tooltipBox).val('');
    });
    $('#reportDetails').submit(function() {
        var url = $('[name="action"]', this).val(); //'/index/operationstatechangeajax';
        var operation_id = $('[name="operation_id"]', this).val();
        var client_id = $('[name="client_id"]', this).val();
        var approved = $('[name="approved"]', this).val();
        var report = $('[name="report"]', this).val();
        var cheque_id = $('[name="cheque_id"]', this).val(); //only for terceros ops

        var state_id;

        if (approved == '1')
            state_id = '4';
        else
            state_id = '3';

        $.post(url, {
            "operation_id": operation_id,
            "state_id": state_id,
            "report": report,
            "approved": approved,
            "cheque_id": cheque_id,
        },
                function(data) {
                    //var seltr = $('#userid_' + client_id);
                    //$('.amBtn', seltr).trigger('click', [true]);
                    $('#userid_' + client_id).trigger('click', [true]);
                    $('.reportDetails').hide();
                    notificationbyopchange(operation_id);

                    if (data == '1') {
                        showmsg("El estado ha sido actualizado", 't');
                    }
                    else if (data == '2') {
                        showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
                    }
                    else if (data == '0') {
                        showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
                    }
                });
        return false;
    });

    $('.operationStepFour').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        var clientid = $(this).attr('id').split('_');
        var tform = $('#plansForm');
        sForm = $('#plansForm');
        clearForm(sForm);
        $('[name="client_id"]', tform).val(clientid[1]);
        //$('.pFirst_name',tform).text($('#userid_'+clientid[1]+' .user_first_name').text());
        //$('.pLast_name',tform).text($('#userid_'+clientid[1]+' .user_last_name').text());
        $('.pAmount', tform).val($('[name="amount"]', this).val());
        $('.current_date', tform).text(currentDate);
        if (!$('.pAmount', tform).parent('td').has('.dollar').length) {
            $('.pAmount', tform).before('<span class="dollar">$</span> ');
        }
        $('.plansListUL', tform).html('');
        $("#Plans").dialog('open');

        $('[name="operation_id"]', tform).val($('[name="operationid"]', this).val());
        $('.btnLoading').hide();
    });

    $('.operationStepFive').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        //var url = '/index/operationstepfiveajax';
        var url = '/index/operationstatechangeajax';
        var operationid = $('[name="operationid"]', this).val();
        var cave_id = parseInt($('[name="cave_id"]', this).val());
        var state_id = 0;

        if (cave_id)
            state_id = 7;
        else
            state_id = 6;

        var clientid = $(this).attr('id').split('_');
        $.post(url, {
            "operation_id": operationid,
            "state_id": state_id
        },
        function(data) {
            notificationbyopchange(operationid);
            //var seltr = $('#userid_' + clientid[1]);
            //$('.amBtn', seltr).trigger('click', [true]);
            $('#userid_' + clientid[1]).trigger('click', [true]);

            if (data == '1') {
                showmsg("La operación está en camino", 't');
            }
            else if (data == '2') {
                showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
            }
            else if (data == '0') {
                showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
            }
        });
    });

    $('.operationStepSix').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        var clientid = $(this).attr('id').split('_');
        var tform = $('#plansEditForm');
        var cave_id = parseInt($('[name="cave_id"]', this).val());
        var state_id = parseInt($('[name="state_id"]', this).val());
        var showChequeFields = true;
        var default_checkbox = true;
        if (!cave_id) {
            $('.localTr', tform).hide();
        } else {
            $('.localTr', tform).show();
        }
        if (state_id == 7 && cave_id == 1) {
            $('[name="show_cheques"]', this).val(0);
            $('.plansEditListUL').attr('show_cheques', 0);
            showChequeFields = false;
            default_checkbox = false;
            state_id = 8;
        } else {
            state_id = 9;
            $('[name="show_cheques"]', this).val(1);
            $('.plansEditListUL').attr('show_cheques', 1);
        }
        sForm = tform;
        clearForm(sForm);
        $('.plansEditListUL').html('<li><b>Cargando...</b></li>');

        var url = '/index/getchecksbyoperationidajax';
        var operationid = $('[name="operationid"]', this).val();
        $.post(url, {
            "operation_id": operationid
        },
        function(data) {
            var plan_id = data['planid'];
            var interests_id = data['interests_id'];
            var cheques = data['cheques'];
            var localChk, cheque, amount, plansList, x, chkDis, chkDisCls;
            if (parseInt(plan_id)) {
                $('[name="plans"] option[value="' + plan_id + '"]', tform).attr('selected', 'selected');
            } else {
                $('[name="plans"] option[value=""]', tform).attr('selected', 'selected');
            }
            if (parseInt(interests_id)) {
                $('[name="interests_id"] option[value="' + interests_id + '"]', tform).attr('selected', 'selected');
            } else {
                $('[name="interests_id"] option[value=""]', tform).attr('selected', 'selected');
            }

            if (cheques) {
                var pqty = parseFloat($('option:selected', tform).attr('pqty'));
                var prec = parseFloat($('option:selected', tform).attr('prec'));
                plansList = '';
                x = 1;
                amount = 0.00;
                var kar = 1;
                for (var i in cheques) {
                    cheque = cheques[i];
                    amount = parseFloat(cheque['amount']).toFixed(2);
                    check_n = cheque['check_n'];
                    localChk = '';
                    if (parseInt(cheque['local']) && default_checkbox) {
                        localChk = 'checked="checked" ';
                        chkDis = '';
                        chkDisCls = '';
                        kar++;
                        cTIndex = 'tabindex="' + kar + '"';
                        kar++;
                        dTIndex = 'tabindex="' + kar + '"';

                    } else if (cave_id) {
                        localChk = '';
                        chkDis = ' disabled="disabled"';
                        chkDisCls = 'disabledCls';
                        dTIndex = '';
                        cTIndex = '';
                    }
                    if (!check_n) {
                        check_n = '';
                    }
                    plansList += '<li id="chequeid_' + cheque['id'] + '">';
                    if (showChequeFields) {
                        plansList += 'Cheque ' + x + ' : <input class="changeCheque_nSpan ' + chkDisCls + '" size="25" ' + cTIndex + ' value="' + check_n + '" "' + chkDis + '"/>  -  ';
                    }
                    plansList += '<input class="changeDateSpan datepicker" ' + dTIndex + ' size="16" value="' + cheque['date'] + '"/> ';
                    plansList += ' <span class="dollar">$</span> <span class="changeAmountSpan">' + amount + '</span>';
                    if (cave_id) {
                        plansList += '<input type="checkbox" name="local" class="localChk" ' + localChk + '/></li>';
                    }
                    x++;
                }
                $('.plansEditListUL').html(plansList);
                $('.plansEditListUL').attr({
                    'cave': cave_id
                });

                $('.plansEditListUL').attr('state_id', state_id);
                datepicker();
                if ($('.plansEditListUL li [name="local"]:checked').size()) {
                    if ($('.plansEditListUL li [name="local"]:eq(0)').is(':checked')) {
                        $('#plansEditForm #local_2').attr('checked', 'checked');
                    } else {
                        $('#plansEditForm #local_1').attr('checked', 'checked');
                    }
                }
            }
        }, 'json');

        $('.localChk').live('click', function() {
            var localLi = $(this).parents('li:eq(0)');
            if ($(this).is(':checked')) {
                $('.changeCheque_nSpan', localLi).removeAttr('disabled').removeClass('disabledCls').focus();
                //$('[name="check_zip_code"]',localLi).removeAttr('disabled').removeClass('disabledCls').focus();
            } else {
                $('.changeCheque_nSpan', localLi).attr({
                    'disabled': 'disabled'
                }).addClass('disabledCls').val('');
                //$('[name="check_zip_code"]',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('');
            }
        });

        $('.changeCheque_nSpan').live('focus', function() {
            if ($(this).val() == '') {
                $(this).val('');
            }
            if ($.trim($(this).val()) == '') {
                $(this).val('');
            }
        });

        $('.changeCheque_nSpan').live('blur', function() {
            if ($(this).val() == '') {
                $(this).val('');
            }
        });

        $('.localDrp').change(function() {
            var check = uncheck = '';
            if (parseInt($(this).val())) {
                check = 'odd';
                uncheck = 'even';
            } else {
                check = 'even';
                uncheck = 'odd';
            }
            $('.plansEditListUL li [name="local"]:' + check).attr('checked', 'checked');
            $('.plansEditListUL li [name="local"]:' + uncheck).removeAttr('checked');

            var localLi, kar = 1;
            $('.plansEditListUL li [name="local"]').each(function() {
                localLi = $(this).parents('li:eq(0)');
                if ($(this).is(':checked')) {
                    $('.changeCheque_nSpan', localLi).removeAttr('disabled').removeClass('disabledCls').attr({
                        'tabindex': kar++
                    });
                    $('.changeDateSpan', localLi).attr({
                        'tabindex': kar++
                    });

                    //$('[name="check_zip_code"]',localLi).removeAttr('disabled').removeClass('disabledCls').focus();
                } else {
                    $('.changeCheque_nSpan', localLi).attr({
                        'disabled': 'disabled'
                    }).addClass('disabledCls').val('').removeAttr('tabindex');
                    $('.changeDateSpan', localLi).removeAttr('tabindex');
                    //$('[name="check_zip_code"]',localLi).attr({'disabled':'disabled'}).addClass('disabledCls').val('');
                }
            });

        });
        $('[name="client_id"]', tform).val(clientid[1]);
        //$('.pFirst_name',tform).text($('#userid_'+clientid[1]+' .user_first_name').text());
        //$('.pLast_name',tform).text($('#userid_'+clientid[1]+' .user_last_name').text());
        $('.pAmount', tform).text($('[name="amount"]', this).val());
        $('.current_date', tform).text(currentDate);
        if (!$('.pAmount', tform).parent('td').has('.dollar').length) {
            $('.pAmount', tform).before('<span class="dollar">$</span> ');
        }
        $('[name="operation_id"]', tform).val($('[name="operationid"]', this).val());
        $("#PlansEdit").dialog('open');

    });

    $("#operationsForm").validate({
        submitHandler: function(form) {
            var tForm = $("#operationsForm");
            var url = tForm.attr('action');
            $.post(url, {
                "client_id": $(' [name="client_id"]', tForm).val(),
                "date": $(' [name="date"]', tForm).val(),
                "amount": $(' [name="amount"]', tForm).val(),
                "state": 1,
                "observations": $(' [name="observations"]', tForm).val(),
                "report": $(' [name="report"]', tForm).val(),
                "cave": $(' [name="cave"]', tForm).val(),
                "bank_account_id": $(' [name="bank_account_id"]', tForm).val(),
            },
                    function(data) {
                        if (isInt(data)) {
                            //var seltr = $('#userid_' + $(' [name="client_id"]', tForm).val());
                            //$('.amBtn', seltr).trigger('click', [true]);
                            $('#userid_' + $('[name="client_id"]', tForm).val()).trigger('click', [true]);
                            showmsg("La operación ha sido agregada", 't');
                            $("#newOperations").dialog('close');
                            clearForm(tForm);
                            notificationbyopchange(data);
                        } else {
                            showmsg("Hubo un error al agregar la operación.", 'f');
                        }
                    });
        }
    });

    $("#EditPriorClientForm").validate({
        submitHandler: function(form) {
            var tForm = $("#EditPriorClientForm");
            var url = '/index/userpriorformajax';
            ;
            var id = $("[name='id']", tForm).val();
            var client_id = $("[name='client_id']", tForm).val();
            var date = $("[name='date']", tForm).val();
            var is_operation_completed = $("[name*='is_operation_completed']:checked", tForm).val();
            var cave_name = $("[name='cave_name']", tForm).val();
            var cave_name_db = $("[name='cave_name'] option:selected", tForm).text();
            var amount = $("[name='amount']", tForm).val();
            var next_check_date = $("[name='next_check_date']", tForm).val();
            var pending_checks = $("[name='pending_checks']", tForm).val();
            var is_last_operation = $("[name='is_last_operation']", tForm).is(':checked') ? 1 : 0;
            $.post(url, {
                'id': id,
                'client_id': client_id,
                'date': date,
                'is_operation_completed': is_operation_completed,
                'cave_name': cave_name,
                'cave_name_db': cave_name_db,
                'amount': amount,
                'next_check_date': next_check_date,
                'pending_checks': pending_checks,
                'is_last_operation': is_last_operation,
            },
                    function(data) {
                        if (isInt(data)) {
                            //var seltr = $('#userid_' + $(' [name="client_id"]', tForm).val());
                            //$('.amBtn', seltr).trigger('click', [true]);
                            $('#userid_' + $('[name="client_id"]', tForm).val()).trigger('click', [true]);
                            showmsg("La operación ha sido agregada", 't');

                            $(".EditPriorFromClientPanel").dialog('close');
                            clearForm(tForm);
                        } else {
                            showmsg("Hubo un error al agregar la operación.", 'f');
                        }
                    });
        }
    });
    $("#plansForm").validate({
        submitHandler: function(form) {
            var tForm = $("#plansForm");
            //var url = '/index/operationstepfourajax/';
            var url = '/index/operationstatechangeajax/';
            var chequesList = new Array();
            var totalAmount = $('#Plans .pAmount').val();
            $('.amInp').blur();
            $('.pDateInp').blur();
            $('.plansListUL li', tForm).each(function() {
                var cheque = {
                    'date': $('.changeDateSpan', this).val(),
                    'amount': $('.changeAmountSpan', this).text()
                }
                chequesList.push(cheque);
            });
            $.post(url, {
                "operation_id": $('[name="operation_id"]', tForm).val(),
                "state_id": '5',
                "total_amount": totalAmount,
                "cheques_list": JSON.stringify(chequesList),
                "plan_id": $('[name="plans"]', tForm).val(),
                'interests_id': $('#InterestDrp option:selected', tForm).val(),
            },
                    function(data) {
                        if (isInt(data)) {
                            //var seltr = $('#userid_' + $(' [name="client_id"]', tForm).val());
                            //$('.amBtn', seltr).trigger('click', [true]);
                            $('#userid_' + $('[name="client_id"]', tForm).val()).trigger('click', [true]);
                            $("#Plans").dialog('close');
                            notificationbyopchange($('[name="operation_id"]', tForm).val());
                            clearForm(tForm);

                            if (data == '1') {
                                showmsg("Los cheques han sido agregados", 't');
                            }
                            else if (data == '2') {
                                showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
                            }
                            else if (data == '0') {
                                showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
                            }
                        } else {
                            showmsg("Hubo un error al agregar el plan, por favor intente nuevamente.", 'f');
                        }
                    });
        }
    });
    $("#plansEditForm").validate({
        submitHandler: function(form) {
            var tForm = $("#plansEditForm");
            //var url = '/index/editplansandchequeaja/';
            var url = '/index/operationstatechangeajax/';
            var chequesList = new Array();
            var totalAmount = $('#PlansEdit .pAmount').text();
            $('.amInp').blur();
            $('.pDateInp').blur();
            $('.cnInp').blur();
            var state_id = $('.plansEditListUL').attr('state_id');
            var submitFlag = true;
            var cave_id = parseInt($('.plansEditListUL').attr('cave'));
            var show_cheques = parseInt($('.plansEditListUL').attr('show_cheques'));
            var chkInp, local;
            var chkArr = new Array();

            $('.plansEditListUL li', tForm).each(function() {
                chkInp = $('.changeCheque_nSpan', this);
                local = $('[name="local"]', this).is(':checked') ? 1 : 0;
                var repeatedChk = searchItemArr(chkArr, chkInp.val());
                chkArr.push(chkInp.val());
                if ($.trim(chkInp.val()) == '' && !local) {
                    if (cave_id && !local) {
                        return true;
                    } else {
                        chkInp.removeClass('inpError');
                    }
                    chkInp.addClass('inpError');
                    submitFlag = false;
                } else if (repeatedChk && show_cheques) {
                    chkInp.addClass('inpError');
                    submitFlag = false;
                    showmsg("Error: Dos cheques poseen el mismo numero.", 'f');
                } else {
                    chkInp.removeClass('inpError');
                }

            });
            if (!submitFlag) {
                return false;
            }

            $('.plansEditListUL li', tForm).each(function() {
                var chequeid = $(this).attr('id').split('_');
                chequeid = chequeid[1] ? chequeid[1] : null;
                cheque_n = null;
                if ($('.changeCheque_nSpan', this).val() != '') {
                    cheque_n = $('.changeCheque_nSpan', this).val();
                }
                var cheque = {
                    'id': chequeid,
                    'date': $('.changeDateSpan', this).val(),
                    'amount': $('.changeAmountSpan', this).text(),
                    'check_n': cheque_n,
                    'check_zip_code': $('[name="check_zip_code"]', this).val(),
                }
                if (cave_id) {
                    cheque['local'] = $('[name="local"]', this).is(':checked') ? 1 : 0;
                } else {
                    cheque['local'] = 1;
                }
                chequesList.push(cheque);
            });
            $.post(url, {
                "total_amount": totalAmount,
                "operation_id": $('[name="operation_id"]', tForm).val(),
                "cheques_list": JSON.stringify(chequesList),
                "plan_id": $('[name="plans"]', tForm).val(),
                'state_id': state_id
            },
            function(data) {
                if (isInt(data)) {
                    //var seltr = $('#userid_' + $(' [name="client_id"]', tForm).val());
                    //$('.amBtn', seltr).trigger('click', [true]);
                    $('#userid_' + $('[name="client_id"]', tForm).val()).trigger('click', [true]);
                    notificationbyopchange($('[name="operation_id"]', tForm).val());
                    //showmsg("Adding Plans done successfully!",'t');
                    $("#PlansEdit").dialog('close');
                    clearForm(tForm);

                    if (data == '1') {
                        showmsg("Los cheques han sido agregados", 't');
                    }
                    else if (data == '2') {
                        showmsg("El estado ha sido cambiado previamente por otro usuario y ha sido actualizado. ", 'f');
                    }
                    else if (data == '0') {
                        showmsg("Hubo un error al cambiar de estado, por favor intente nuevamente.", 'f');
                    }
                } else {
                    showmsg("Hubo un error al agregar el plan, por favor intente nuevamente.", 'f');
                }
            });
        }
    });

    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        //"sScrollXInner": "100%",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 100,
        "sScrollX": "100%",
        "bAutoWidth": false,
        "aaSorting": [[4, "asc"]],
        'aoColumns': [{'sWidth': '2%'}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}, {"sType": 'string', 'sWidth': '5%'}, {"sType": 'string', 'sWidth': '5%', 'bSortable': true}, {'sWidth': '5%'}, {'sWidth': '5%'}, {"sType": 'string', 'sWidth': '10%'}, {"sType": 'string', 'sWidth': '10%'}, {'sType': 'num-html', 'sWidth': '10%'}, {'sType': 'num-html', 'sWidth': '10%'}, {"bSearchable": true, "bVisible": false}, {"sType": 'us_date'}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}, {"bSearchable": true, "bVisible": false}],
        //"aoColumns": [null,null,null,null,null,null,null,{'sWidth':'140px'},{'sWidth':'200px'},{'sWidth':'140px'},{'sWidth':'100px'},{'sWidth':'100px'},null,null]
    });
    /*oTable.fnSetColumnVis(1, false);
     oTable.fnSetColumnVis(2, false);
     oTable.fnSetColumnVis(13, false);
     oTable.fnSetColumnVis(14, false);
     oTable.fnSetColumnVis(15, false);
     oTable.fnSetColumnVis(16, false);
     oTable.fnSetColumnVis(17, false);
     oTable.fnSetColumnVis(18, false);
     */
    gptTable = $('#gestionPagoTable').dataTable({
        "bJQueryUI": true,
        "bInfo": false,
        "bFilter": false,
        "bPaginate": false,
        "bAutoWidth": false,
        //"bScrollCollapse": true,
        //"bStateSave": false,
        'aoColumns': [{
                "sType": 'us_date'
            }, null, null, null, null, ]
    });

    gtTable = $('#gestionTable').dataTable({
        "bJQueryUI": true,
        "bInfo": false,
        "bFilter": false,
        "bPaginate": false,
        "bAutoWidth": false,
        //"bScrollCollapse": true,
        //"bStateSave": false,
        'aoColumns': [{
                "sType": 'us_date'
            }, null, null, null, null, null, null, null, ]
    });

    $('.rejectChequeBtn').live('click', function() {
        tooltipBox = getToolTipForm($(this));
        var sTr = $(this).parents('tr').eq(0);
        var saleid = sTr.attr('id').split('_');
        $('[name="cheque_id"]', tooltipBox).val(saleid[1]);

    });

    $('.costOne').live('click', function() {
        var tooltipBox = $('.tooltipBox');
        var cheque_id = $('[name="cheque_id"]', tooltipBox).val();
        var bankTr = $('#chequelistid_' + cheque_id);
        var gastos_denuncia = parseFloat($('[name="gastos_denuncia"]', tooltipBox).val());
        var chk_amount = amountFormatR($('[class="td_amount"]', bankTr).text());
        var balance = gastos_denuncia + chk_amount;
        var url = '/index/rejectchequewithgastosajax';
        $.post(url, {
            'id': cheque_id,
            'gastos': gastos_denuncia,
            'gastos_type': $(this).val(),
        },
                function(data) {
                    if (data) {
                        showmsg('El cheque ha sido rechazado', 't');
                        $('.td_status_name', bankTr).text('Rechazado');
                        $('.td_rej_balance', bankTr).text(amountFormat(balance));
                        $('.td_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
                        bankTr.removeClass('lightGreenTr');
                        bankTr.addClass('lightRedTr');
                        var opStatusEl = $('.td_actions', bankTr).closest('.operations-table').find('.state-row :first :first');
                        opStatusEl.removeClass();
                        opStatusEl.addClass('stateViewDivCobranza');
                        opStatusEl.text('En Cobranza');
                        tooltipBox.hide();
                    } else {
                        showmsg('Hubo un error al rechazar el cheque. Por favor intente nuevamente.', 'f');
                    }
                });
    });
    $('.costTwo').live('click', function() {
        var tooltipBox = $('.tooltipBox');
        var cheque_id = $('[name="cheque_id"]', tooltipBox).val();
        var bankTr = $('#chequelistid_' + cheque_id);
        var gastos_rechazo = parseFloat($('[name="gastos_rechazo"]', tooltipBox).val());
        var chk_amount = amountFormatR($('[class="td_amount"]', bankTr).text());
        var balance = gastos_rechazo + chk_amount;
        var url = '/index/rejectchequewithgastosajax';
        $.post(url, {
            'id': cheque_id,
            'gastos': gastos_rechazo,
            'gastos_type': $(this).val(),
        },
                function(data) {
                    if (data) {
                        showmsg('El cheque ha sido rechazado', 't');
                        $('.td_status_name', bankTr).text('Rechazado');
                        $('.td_rej_balance', bankTr).text(amountFormat(balance));
                        $('.td_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
                        bankTr.removeClass('lightGreenTr');
                        bankTr.addClass('lightRedTr');
                        var opStatusEl = $('.td_actions', bankTr).closest('.operations-table').find('.state-row :first :first');
                        opStatusEl.removeClass();
                        opStatusEl.addClass('stateViewDivCobranza');
                        opStatusEl.text('En Cobranza');
                        tooltipBox.hide();
                    } else {
                        showmsg('Hubo un error al rechazar el cheque. Por favor intente nuevamente.', 'f');
                    }
                });
    });
    $('.payedChequeBtn').live('click', function() {
        $(this).append('<div class="btnLoading"></div>');
        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');
        var url = '/index/chequepayedajax';
        $.post(url, {
            'id': bankid[1]
        },
        function(data) {
            if (data) {
                showmsg('El cheque ha sido pagado', 't');
                $('.td_status_name', bankTr).text('Acreditado');
                $('.td_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
            } else {
                showmsg('El cheque no pude ser pagado, por favor intente nuevamente.', 'f');
            }
        });
    });
    /*
     var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
     edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
     $("#grid_length").append(edBtn);
     */
    /*$("#grid tbody").click(function(event) {
     $(oTable.fnSettings().aoData).each(function() {
     $(this.nTr).removeClass('row_selected');
     });
     $(event.target.parentNode).addClass('row_selected');
     });*/




    $('.deleteBtn2').live('click', function() {
        var clientId = $(this).attr('clientid');
        deleteFun(oTable, clientId);
    });
    function deleteFun(oTable, clientId) {
        var result = confirm('Esta seguro que desea eliminar el cliente?');

        if (result) {

            //var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/userdeleteajax";
            $.post(url, {
                "id": clientId
            },
            function(data) {
                if (isInt(data)) {
                    showmsg('El cliente ha sido eliminado', 't');
                    var seltr = $('#userid_' + clientId, '.gridtbody');
                    //$('.amBtn', seltr).trigger('click', [false]);
                    $('#userid_' + clientId).trigger('click', [false]);
                    oTable.fnDeleteRow(seltr[0]);
                } else {
                    showmsg('Hubo un error al eliminar el cliente, por favor intente nuevamente.', 'f');
                }
            });
        }
    }
    function fnGetSelected(oTableLocal)
    {
        var aReturn = new Array();
        var aTrs = oTableLocal.fnGetNodes();

        for (var i = 0; i < aTrs.length; i++)
        {
            if ($(aTrs[i]).hasClass('row_selected'))
            {
                aReturn.push(aTrs[i]);
            }
        }
        return aReturn;
    }
    $('#editBtn2').live('click', function() {
        var clientId = $(this).attr('clientid');
        var selRow = $('#userid_' + clientId, '.gridtbody');
        if (selRow.size()) {
            var idArr = selRow.attr('id').split("_");
            var popEditForm = $("#userFormPop");
            clearForm(popEditForm);

            var url = "/index/getclientsdetailsbyidajax";
            $.post(url, {
                "client_id": idArr[1]
            }, function(data) {
                $('[name="id"]', popEditForm).val(idArr[1]);
                $('[name="original_type"]', popEditForm).val(data.client_type);
                $('[name="client_type"] option[value="' + data.client_type + '"]', popEditForm).attr('selected', 'selected');
                if (data.client_type == 4)//when cobranza disable all the select box
                    $('[name="client_type"]', popEditForm).attr('disabled', 'disabled');
                else //disable just the cobranza option
                    $('[name="client_type"] option[value="4"]', popEditForm).attr('disabled', 'disabled');
                $('[name="operator"] option[value="' + data.operator + '"]', popEditForm).attr('selected', 'selected');
                $('[name="first_name"]', popEditForm).val(data.first_name);
                $('[name="last_name"]', popEditForm).val(data.last_name);
                $('[name="DNI"]', popEditForm).val(data.DNI);
                $('[name="CUIL"]', popEditForm).val(data.CUIL);
                $('[name="business"]', popEditForm).val(data.business);
                $('[name="business_CUIT"]', popEditForm).val(data.business_CUIT);
                $('[name="tel_part"]', popEditForm).val(data.tel_part);
                $('[name="tel_lab"]', popEditForm).val(data.tel_lab);
                $('[name="tel_cell"]', popEditForm).val(data.tel_cell);
                $('[name="tel_otro"]', popEditForm).val(data.tel_otro);
                $('[name="tel_part_code"]', popEditForm).val(data.tel_part_code);
                $('[name="tel_lab_code"]', popEditForm).val(data.tel_lab_code);
                //$('[name="tel_cell_code"]',popEditForm).val(data.tel_cell_code);
                $('[name="tel_otro_code"]', popEditForm).val(data.tel_otro_code);
                $('[name="email"]', popEditForm).val(data.email);
                $('[name="activity"]', popEditForm).val(data.activity);
                $('[name="date_added"]', popEditForm).val(data.date_added);
                $('[name="contact_point"] option[value="' + data.contact_point + '"]', popEditForm).attr('selected', 'selected');
                $('[name="extra_info"]', popEditForm).val(data.extra_info);
                $('[name="client_type"]', popEditForm).trigger('change');
            }, 'json');
            /*
             var client_type_text = $('[name="client_type"] option[value="'+$(".user_client_type input",selRow).val()+'"]',popEditForm).text();
             if(client_type_text.toLowerCase() == 'potencial con operaciones'){
             $("#EditPriorTr").show();
             $('#showPriorDiv').html('Cargando operaciones anteriores...');
             var url = "/index/getpriorbyclientidajax";
             $.post(url, {
             "client_id" : idArr[1]
             },function(data){
             $('#showPriorDiv').html('');
             if(data && data != ''){
             for(var x in data){
             var jsonData = data[x];
             var addNewSpan = CreatePriorOperationsView(jsonData);
             $("#showPriorDiv").append(addNewSpan);
             }
             }
             },'json');
             }else{
             $("#EditPriorTr").hide();
             $("#showPriorDiv").hide();
             }
             */
            if ($('[name="client_type"]', popEditForm).val() == '1') {
                $('#userFormPop [name="CUIL"]').addClass('required');
            } else {
                $('#userFormPop [name="CUIL"]').removeClass('required');
            }
            $("#editPopUP").dialog("open");
            /*
             $('#showAddressDiv').html('Cargando domicilios');
             var url = "/index/getaddressbyclientidajax";
             $.post(url, {
             "client_id" : idArr[1]
             },function(data){
             $('#showAddressDiv').html('');
             for(var x in data){
             var jsonData = data[x];
             if(jsonData){
             var newAddSpan = CreateShowAddressView(jsonData);
             $('#showAddressDiv').append(newAddSpan);
             }
             }
             },'json');
             */
        } else {
            showmsg("Por favor seleccione una fila para editar", 'f');
        }
    });

    var lis, links, active, content, prevActive;
    $('#tabs ul').each(function() {
        // For each set of tabs, we want to keep track of
        // which tab is active and it's associated content
        lis = $(this).find('li');
        links = $(this).find('a');
        active = lis.first();
        // Use the first link as the initial active tab
        //active.addClass('ui-tabs-selected');
        content = $(lis).first().attr('title');

        // Hide the remaining content
        lis.each(function() {
            //this is the selected tab by filter
            if ($('a', this).text().toLowerCase() == $('#tab-selected').val())
                $(this).addClass('ui-tabs-selected');
            $('#' + $(this).attr('title')).hide();
        });
        $('#' + content).show();

        // Bind the click event handler
        $(lis).click(function(e) {
            // Make the old tab inactive.
            $('#tabs ul li').each(function() {
                if ($(this).hasClass('ui-tabs-selected')) {
                    prevActive = $(this);
                    prevActive.removeClass('ui-tabs-selected');
                }
            });
            $(this).addClass('ui-tabs-selected');

            $('#' + content).hide();
            // Update the variables with the new link and content
            content = $(this).attr('title');
            $('#' + content).show();

            if ($('a', this).text() != 'Agregar' && $('a', prevActive).text() != 'Agregar')
                window.location($('a', this).attr('href'));
            else //if it is "agregar" tab, set alta date to current date
                $('[name="date_added"]', '#userForm').val(currentDate);

            // Prevent the anchor's default click action
            e.preventDefault();

            return false;
        });

        return false;
    });
    /*
     $( "#tabs" ).tabs({
     selected: 0
     });
     */

    uForm = $("#userForm").validate({
        messages: {
        },
        submitHandler: function(form) {
            var tForm = $("#userForm");
            var url = tForm.attr('action');

            //var tel_cell_code 	= cellcode($('[name="tel_cell_code"]',tForm).val());
            var tel_otro_code = landcode($('[name="tel_otro_code"]', tForm).val());
            var tel_part_code = landcode($('[name="tel_part_code"]', tForm).val());
            var tel_lab_code = landcode($('[name="tel_lab_code"]', tForm).val());
            var tel_cell = landnumber($('[name="tel_cell"]', tForm).val());
            var tel_otro = landnumber($('[name="tel_otro"]', tForm).val());
            var tel_part = landnumber($('[name="tel_part"]', tForm).val());
            var tel_lab = landnumber($('[name="tel_lab"]', tForm).val());
            if (tel_cell == '' && tel_otro == '' && tel_part == '' && tel_lab == '') {
                showmsg("Por favor inserte al menos un numero telefónico", 'f');
                return false;
            }
            $("#userForm").animate({
                "opacity": .2
            }, 250);

            $.post(url, {
                "client_type": $('[name="client_type"]', tForm).val(),
                "operator": $('[name="operator"]', tForm).val(),
                "first_name": $('[name="first_name"]', tForm).val(),
                "last_name": $('[name="last_name"]', tForm).val(),
                "DNI": $('[name="DNI"]', tForm).val(),
                "CUIL": $('[name="CUIL"]', tForm).val(),
                "business": $('[name="business"]', tForm).val(),
                "business_CUIT": $('[name="business_CUIT"]', tForm).val(),
                "tel_part": tel_part,
                "tel_part_code": tel_part_code,
                "tel_lab": tel_lab,
                "tel_lab_code": tel_lab_code,
                "tel_cell": tel_cell,
                //"tel_cell_code"		: tel_cell_code,
                "tel_otro": tel_otro,
                "tel_otro_code": tel_otro_code,
                "email": $('[name="email"]', tForm).val(),
                "activity": $('[name="activity"]', tForm).val(),
                "date_added": $('[name="date_added"]', tForm).val(),
                "contact_point": $('[name="contact_point"]', tForm).val(),
                "extra_info": $('[name="extra_info"]', tForm).val(),
                "user_type_id": $('[name="user_type_id"]', tForm).val(),
                "multi_address_json": $('[name="multi_address_json"]', tForm).val(),
                "multi_prior_json": $('[name="multi_prior_json"]', tForm).val()

            },
            function(data) {
                if (data) {
                    var valid = data.valid;
                    if (valid) {
                        $('#userBankForm input[name="user_id"]').val(data.client_id);
                        $('#userBankForm input[name="addType"]').val('add');

                        $(".confirm-add-user").dialog('open');
                        var trmade = $('#grid').dataTable().fnAddData([
                            '<img src="/images/details_open.png" class="amBtn">',
                            data.client_id + '<input type="hidden" name="ct_id" value="' + $('[name="client_type"]', tForm).val() + '"><input type="hidden" name="contact_id" value="' + $('[name="contact_point"]', tForm).val() + '">',
                            $('[name="client_type"] option:selected', tForm).text(),
                            $('[name="first_name"]', tForm).val(),
                            $('[name="last_name"]', tForm).val(),
                            CreateSpansForViewNumber($('[name="tel_part_code"]', tForm).val(), $('[name="tel_part"]', tForm).val()),                            
                            CreateSpansForViewNumber('<span class="number_inp">' + $('[name="tel_cell"]', tForm).val() + '</span>'),
                            $('[name="email"]', tForm).val(),
                            $('[name="business"]', tForm).val(),                            
                            $('[name="DNI"]', tForm).val(),
                            $('[name="CUIL"]', tForm).val(),
                             CreateSpansForViewNumber($('[name="tel_lab_code"]', tForm).val(), $('[name="tel_lab"]', tForm).val()),
                            $('[name="date_added"]', tForm).val(),
                            CreateSpansForViewNumber($('[name="tel_otro_code"]', tForm).val(), $('[name="tel_otro"]', tForm).val()),
                            $('[name="business_CUIT"]', tForm).val(),
                            $('[name="activity"]', tForm).val(),
                            $('[name="contact_point"] option:selected').eq(0).text() + '<input type="hidden" name="contact_point_id" value="' + $('[name="contact_point"] option:selected').val() + '"/>',
                            $('[name="extra_info"]', tForm).val(),
                            $('[name="operator"] option:selected').eq(0).text() + '<input type="hidden" name="ct_id" value="' + $('[name="operator"] option:selected').val() + '"/>'
                        ]);
                        
                        var oSettings = oTable.fnSettings();
                        var nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'userid_' + data.client_id;
                        $("td:eq(1)", nTr).addClass('user_first_name');
                        $("td:eq(2)", nTr).addClass('user_last_name');
                        $("td:eq(3)", nTr).addClass('user_tel_part');
                        $("td:eq(4)", nTr).addClass('user_tel_cell');
                        $("td:eq(5)", nTr).addClass('user_email');
                        $("td:eq(6)", nTr).addClass('user_business');                        
                        $("td:eq(7)", nTr).addClass('user_DNI');
                        $("td:eq(8)", nTr).addClass('user_CUIL');
                        $("td:eq(11)", nTr).addClass('user_tel_lab');
                        $("td:eq(9)", nTr).addClass('user_date_added');
                        $("td:eq(13)",nTr).addClass('user_tel_otro');
                        $("td:eq(14)", nTr).addClass('user_business_CUIT');                        
                        $("td:eq(15)", nTr).addClass('user_activity');
                        $("td:eq(16)", nTr).addClass('user_contact_point');
                        $("td:eq(17)", nTr).addClass('user_extra_info');
                        $("td:eq(18)", nTr).addClass('user_operator');
                        
                        clearForm(tForm)
                        clearForm($('#AddNewAddressForm'));
                        $('#AddNewAddressForm .new_address_span').remove();
                        $(".showAddressDivOnAdd", tForm).html('');
                        clearForm($('#AddPriorForm'));
                        $('#AddPriorForm .new_address_span').remove();
                    } else {
                        showmsg("Hubo un error al insertar el cliente, por favor intente nuevamente.", 'f');

                        if (data.DNI !== true) {
                            var errorMsg = " Este DNI ya existe para el cliente " + data.DNI.f_name + " " + data.DNI.l_name;
                            $('[name="DNI"]', tForm).remove('valid').addClass('error').after(' <label for="DNI" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.email !== true) {
                            var errorMsg = " Esta dirección de correo ya existe para el cliente " + data.email.f_name + " " + data.email.l_name;
                            $('[name="email"]', tForm).remove('valid').addClass('error').after(' <label for="email" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.CUIL !== true) {
                            var errorMsg = " Este número de CUIL ya existe para el cliente " + data.CUIL.f_name + " " + data.CUIL.l_name;
                            $('[name="CUIL"]', tForm).remove('valid').addClass('error').after(' <label for="CUIL" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.business_CUIT !== true) {
                            var errorMsg = " Este CUIT De Empresa  ya existe para el cliente " + data.business_CUIT.f_name + " " + data.business_CUIT.l_name;
                            $('[name="business_CUIT"]', tForm).remove('valid').addClass('error').after(' <label for="business_CUIT" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                    }
                }
                //$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
            }, 'json');
            $("#userForm").animate({
                "opacity": 1
            }, 250);
        }
    });

    $("input[name='dob']").addClass('datepicker');

    datepicker();

    $('.edTabBtn').click(function() {
        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    });

    $("#userSubmit").click(function() {
        //return false;
    });

    $("#userFormPop input").addClass('text ui-widget-content ui-corner-all');
});

$(function() {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#dialog:ui-dialog").dialog("destroy");

    $(".add-new-user").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Agregar": function() {
                $(".confirm-add-user").dialog('open');
                $(this).dialog("close");
            },
            "Cerrar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {
            showmsg('El usuario ha sido cargado', 't');
        }
    });
    $(".confirm-add-user").dialog({
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        open: function() {
            //mantain the capital checkbox selected
            $('#location_capital_1', '#userBankForm').attr('checked', 'checked');
        },
        buttons: {
            "Guardar": function() {
                $('#userBankForm').submit();
                showmsg('La cuenta ha sido cargada', 't');
            },
            "Cancelar": function() {
                clearForm($("#userForm"));
                clearForm($("#userBankForm"));
                $(this).dialog("close");
            }
        },
        close: function() {

        }
    });
    $(".addAddressPop").dialog({
        autoOpen: false,
        modal: true,
        height: 300,
        width: 700,
        buttons: {
            "Guardar": function() {
                AddNewAddressForm();
                $("#AddNewAddressForm").submit();
            },
            "Agregar Otro": function() {
                $("#AddNewAddressForm [name='street']").validate();
                var newAddSpan = CreateAddressSpan();
                $('.address_main_div').append(newAddSpan);


            },
        },
        close: function() {
            $('#userForm [name="activity"]').focus();
        }
    });
    function AddNewAddressForm()
    {
        $("#AddNewAddressForm").validate({
            debug: true,
            submitHandler: function(form) {
                var multiAddressJson = [];
                $('#AddNewAddressForm .address_span').each(function() {
                    var id = $("[name='id']", this).val();
                    var street = $("[name='street']", this).val();
                    var city = $("[name='city']", this).val();
                    var zip_code = $("[name='zip_code']", this).val();
                    var state_select = $(".state_select", this).val();
                    var state_name = $(".state_select option:selected", this).text();
                    var address_type = $("[name='address_type']", this).val();
                    var delivery_address = $("[name='delivery_address']", this).is(':checked') ? 1 : 0;
                    var AddressJosn = {
                        'id': id,
                        'street': street,
                        'city': city,
                        'zip_code': zip_code,
                        'state_name': state_name,
                        'state_select': state_select,
                        'address_type': address_type,
                        'delivery_address': delivery_address,
                    };
                    multiAddressJson.push(AddressJosn);
                });
                //alert(JSON.stringify(mulitAddresJson));
                $("#userForm [name='multi_address_json']").val(JSON.stringify(multiAddressJson));
                if (multiAddressJson) {
                    $('.showAddressDivOnAdd').html('');
                    for (var x in multiAddressJson) {
                        var data = multiAddressJson[x];
                        var newAddressView = CreateShowAddressView(data);
                        $('.showAddressDivOnAdd').append(newAddressView);
                    }
                }
                $(".addAddressPop").dialog("close");
                return false;
            }
        });
    }

    $("#EditAddressForm").validate({
        submitHandler: function(form) {
            var tForm = $('#EditAddressForm');
            var multiAddressJson = [];
            $('.address_span', tForm).each(function() {

                var id = $("[name='id']", this).val();
                var street = $("[name='street']", this).val();
                var city = $("[name='city']", this).val();
                var zip_code = $("[name='zip_code']", this).val();
                var state_select = $(".state_select", this).val();
                var address_type = $("[name='address_type']", this).val();
                var delivery_address = $("[name='delivery_address']", this).is(':checked') ? 1 : 0;
                var AddressJosn = {
                    'id': id,
                    'street': street,
                    'city': city,
                    'zip_code': zip_code,
                    'state_select': state_select,
                    'address_type': address_type,
                    'delivery_address': delivery_address,
                };

                multiAddressJson.push(AddressJosn);
            });
            //alert(JSON.stringify(mulitAddresJson));
            var multiAddressJson = JSON.stringify(multiAddressJson);
            var url = "/index/editmultiaddressajax";
            var client_id = $("[name='client_id']", tForm).val();
            //alert(client_id);
            //alert(multiAddressJson);
            $.post(url, {
                'client_id': client_id,
                'multi_address_json': multiAddressJson,
            },
                    function(data) {

                        if (data) {
                            showmsg('La dirección ha sido editada', 't');
                            var url = "/index/getaddressbyclientidajax";
                            $.post(url, {
                                "client_id": client_id
                            }, function(data) {
                                $('#showAddressDiv').html('');
                                for (var x in data) {
                                    var jsonData = data[x];
                                    if (jsonData) {
                                        var newAddSpan = CreateShowAddressView(jsonData);
                                        $('#showAddressDiv').append(newAddSpan);
                                    }
                                }
                            }, 'json');
                        } else {
                            showmsg('Hubo un error al editar la dirección, por favor intente nuevamente.', 'f');
                        }
                    });
            $(".editAddressPop").dialog("close");
            return false;
        }

    });

    $('.deleteAddress').live('click', function() {
        var addressSpan = $(this).parents('.address_span');
        var addressId = parseInt($('[name="id"]', addressSpan).val());
        var url = "/index/deleteaddressajax";
        if (addressId) {
            $.post(url, {
                'address_id': addressId
            },
            function(data) {
                if (data) {
                    addressSpan.remove();
                    showmsg('La dirección ha sido eliminada', 't');
                } else {
                    showmsg('Hubo un error al eliminar la dirección. Por favor intente nuevamente.', 'f');
                }
            });
        } else {
            addressSpan.remove();
            showmsg('La dirección ha sido eliminada', 't');
        }
    })

    $("#userBankForm").validate({
        submitHandler: function(form) {
            userFormPop = $("#userBankForm");
            var url = userFormPop.attr('action');
            var userid = $('#userBankForm [name="user_id"]').val();

            $.post(url, {
                "user_id": userid,
                "bank_name": $('[name="bank_name"]', userFormPop).val(),
                "account_n": $('[name="account_n"]', userFormPop).val(),
                "branch": $('[name="branch"]', userFormPop).val(),
                "opening_date": $('[name="opening_date"]', userFormPop).val(),
                "zip_code": $('[name="zip_code"]', userFormPop).val(),
                "location_capital": $('[name="location_capital"]:checked', userFormPop).val(),
            },
                    function(data) {
                        if (data) {
                            if ($('#userBankForm input[name="addType"]').val() == 'listing') {
                                //var seltr = $('#userid_' + userid);
                                //$('.amBtn', seltr).trigger('click', [true]);
                                $('#userid_' + userid).trigger('click', [true]);
                            }
                            $(".confirm-add-user").dialog('close');
                            clearForm($("#userForm"));
                            clearForm($("#userBankForm"));
                            $(".add-new-user").dialog('open');
                        }
                    });
        }


    });
    //add-new-client

    $("#editPopUP").dialog({
        autoOpen: false,
        modal: true,
        height: window.screen.height - 200,
        width: 800,
        buttons: {
            "Ok": function() {
                $("#userFormPop").submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {

        }
    });

    $("#userFormPop").validate({
        messages: {
        },
        submitHandler: function(form) {
            userFormPop = $("#userFormPop");
            /*
             var tel_cell_code = cellcode($('[name="tel_cell_code"]',userFormPop).val());
             var tel_otro_code = cellcode($('[name="tel_otro_code"]',userFormPop).val());
             var tel_part_code = $('[name="tel_part_code"]',userFormPop).val();
             var tel_lab_code = $('[name="tel_lab_code"]',userFormPop).val();
             var tel_cell = cellnumber($('[name="tel_cell"]',userFormPop).val());
             var tel_otro = cellnumber($('[name="tel_otro"]',userFormPop).val());
             var tel_part = landnumber($('[name="tel_part"]',userFormPop).val());
             var tel_lab	= landnumber($('[name="tel_lab"]',userFormPop).val());
             if(tel_cell	== '' && tel_otro == ''	&& tel_part == '' && tel_lab == ''){
             showmsg("Por favor ingrese al menos un número telefónico.",'f');
             return false;
             }
             */
            var url = $("#userFormPop").attr('action');
            $.post(url, {
                "id": $('[name="id"]', userFormPop).val(),
                "client_type": $(' [name="client_type"]', userFormPop).val(),
                "first_name": $(' [name="first_name"]', userFormPop).val(),
                "last_name": $(' [name="last_name"]', userFormPop).val(),
                "DNI": $(' [name="DNI"]', userFormPop).val(),
                "CUIL": $(' [name="CUIL"]', userFormPop).val(),
                "tel_part": formatTel($('[name="tel_part"]', userFormPop).val()),
                "tel_part_code": formatAreacode($('[name="tel_part_code"]', userFormPop).val()),
                "tel_lab": formatTel($('[name="tel_lab"]', userFormPop).val()),
                "tel_lab_code": formatAreacode($('[name="tel_lab_code"]', userFormPop).val()),
                "tel_cell": formatTel($('[name="tel_cell"]', userFormPop).val()),
                //"tel_cell_code"	: removeChars($('[name="tel_cell_code"]',userFormPop).val()),
                "tel_otro": formatTel($('[name="tel_otro"]', userFormPop).val()),
                "tel_otro_code": formatAreacode($('[name="tel_otro_code"]', userFormPop).val()),
                "email": $(' [name="email"]', userFormPop).val(),
                "activity": $(' [name="activity"]', userFormPop).val(),
                "date_added": $(' [name="date_added"]', userFormPop).val(),
                "operator": $(' [name="operator"]', userFormPop).val(),
                "contact_point": $(' [name="contact_point"]', userFormPop).val(),
                "extra_info": $(' [name="extra_info"]', userFormPop).val(),
                "business": $('[name="business"]', userFormPop).val(),
                "business_CUIT": $('[name="business_CUIT"]', userFormPop).val()
            },
            function(data) {
                if (data) {
                    //var	valid = parseInt(data.valid);
                    if (data.valid) {
                        var clientId = $('[name="id"]', userFormPop).val();
                        var selRow = $('#userid_' + clientId, ".gridtbody");

                        $(".user_client_type", selRow).text($('[name="client_type"] option:selected', userFormPop).text());
                        $(".user_first_name", selRow).text($('[name="first_name"]', userFormPop).val());
                        $(".user_last_name", selRow).text($('[name="last_name"]', userFormPop).val());
                        $(".user_DNI", selRow).text($('[name="DNI"]', userFormPop).val());
                        $(".user_CUIL", selRow).text($('[name="CUIL"]', userFormPop).val());
                        $(".user_tel_part", selRow).html(CreateSpansForViewNumber($('[name="tel_part_code"]', userFormPop).val(), $('[name="tel_part"]', userFormPop).val()));
                        $(".user_tel_lab", selRow).html(CreateSpansForViewNumber($('[name="tel_lab_code"]', userFormPop).val(), $('[name="tel_lab"]', userFormPop).val()));
                        $(".user_tel_cell", selRow).html('<span class="number_inp">' + $('[name="tel_cell"]', userFormPop).val() + '</span>');
                        $(".user_tel_otro", selRow).html(CreateSpansForViewNumber($('[name="tel_otro_code"]', userFormPop).val(), $('[name="tel_otro"]', userFormPop).val()));
                        $(".user_email", selRow).text($('[name="email"]', userFormPop).val());
                        $(".user_activity", selRow).text($('[name="activity"]', userFormPop).val());
                        $(".user_date_added", selRow).text($('[name="date_added"]', userFormPop).val());
                        $(".user_operator", selRow).html($('[name="operator"] option:selected', userFormPop).text() + '<input type="hidden" name="ct_id" value="' + $('[name="operator"] option:selected', userFormPop).val() + '"/>');
                        $(".user_contact_point", selRow).html($('[name="contact_point"] option:selected', userFormPop).text() + '<input type="hidden" name="contact_point_id" value="' + $('[name="contact_point"] option:selected', userFormPop).val() + '"/>');
                        $(".user_extra_info", selRow).text($('[name="extra_info"]', userFormPop).val());
                        $(".user_business", selRow).text($('[name="business"]', userFormPop).val());
                        $(".user_business_CUIT", selRow).text($('[name="business_CUIT"]', userFormPop).val());

                        showmsg("El usuario ha sido guardado", 't');
                        $("#editPopUP").dialog('close');

                        //var seltr = $('#userid_' + clientId);
                        //$('.amBtn', seltr).trigger('click', [true]);
                        $('#userid_' + clientId).trigger('click', [true]);
                    }
                    else
                    {
                        showmsg("Hubo un error al guardar el usuario, por favor intente nuevamente.", 'f');

                        if (data.DNI !== true) {
                            var errorMsg = " Este DNI ya existe para el cliente " + data.DNI.f_name + " " + data.DNI.l_name;
                            $('[name="DNI"]', userFormPop).remove('valid').addClass('error').after(' <label for="DNI" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.email !== true) {
                            var errorMsg = " Esta dirección de correo ya existe para el cliente " + data.email.f_name + " " + data.email.l_name;
                            $('[name="email"]', userFormPop).remove('valid').addClass('error').after(' <label for="email" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.CUIL !== true) {
                            var errorMsg = " Este CUIL ya existe para el cliente " + data.CUIL.f_name + " " + data.CUIL.l_name;
                            $('[name="CUIL"]', userFormPop).remove('valid').addClass('error').after(' <label for="CUIL" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                        if (data.business_CUIT !== true) {
                            var errorMsg = " Este CUIT de Empresa  ya existe para el cliente " + data.business_CUIT.f_name + " " + data.business_CUIT.l_name;
                            $('[name="business_CUIT"]', userFormPop).remove('valid').addClass('error').after(' <label for="business_CUIT" generated="true" class="error" style="display: inline;">' + errorMsg + '</label>');
                        }
                    }
                }
                $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');



            }, 'json');
        }
    });

    jQuery.validator.addMethod("telArg", function(value, element) {
        var tel = value; //number
        var areaCode = $(element).prev().val(); //area code should be the prev element
        tel = tel.replace(/\D/g, ''); //remove non digits. Used for removing dashes
        tel = areaCode.trim() + tel.trim();
        //regular phones have 11 digits. Some cell phones outside
        //buenos aires have an extra 15 that makes them be 13 digits total
        if (tel.length > 10 && tel.length < 14)
            return true;
        else if (tel == '') { //if no tel, erase the areaCode and submit
            areaCode = '';
            return true
        }
        else
            return false;
    }, 'El código de area y teléfono deben sumar 11 dígitos.');

    $('.client_type').change(function() {
        if ($('option:selected', this).hasClass('addnew')) {
            $(".add-new-client").dialog('open');
        }
    });

    $(".edit-bank-details").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 500,
        buttons: {
            "Ok": function() {
                var url = $('#editBankForm').submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });

    $(".edit-address-details").dialog({
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        open: function() {
            var editBankForm = $('#editAddForm');
            if ($('[name="id"]', editBankForm).val() != '')
                $(this).parent().find('.ui-dialog-title').text('Editar Domicilio');
            else
                $(this).parent().find('.ui-dialog-title').text('Nuevo Domicilio');
        },
        close: function() {
            clearForm($('#editAddForm'));
        },
        buttons: {
            "Aceptar": function() {
                var url = $('#editAddForm').submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }

    });

    $(".addNewOperatorPop").dialog({
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        buttons: {
            "Aceptar": function() {
                var url = $('#operatorForm').submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });

    $(".addAddressBtn").click(function() {
        $(".addAddressPop").dialog('open');
    });

    $(".editAddressBtn").live('click', function() {
        var tForm = $("#EditAddressForm");
        $('.new_address_span', tForm).remove();
        clearForm(tForm);
        $(".editAddressPop").dialog('open');

        var clientid = $("#userFormPop [name='id']").val();
        var url = "/index/getaddressbyclientidajax";
        $('[name="client_id"]', tForm).val(clientid);
        $('.edit_address_main_div').html('<h1>Loading...</h1>');
        $.post(url, {
            "client_id": clientid
        }, function(data) {
            if (data && data != '') {
                $('.edit_address_main_div').html('');
                for (var x in data) {
                    var jsonData = data[x];
                    var newAddSpan = CreateAddressSpan();
                    var id = jsonData['id'];
                    var street = jsonData['street'];
                    var city = jsonData['city'];
                    var zip_code = jsonData['zip_code'];
                    var state = jsonData['state'];
                    var state_name = jsonData['state_name'];
                    var country = jsonData['country'];
                    var address_type = jsonData['address_type'];
                    var delivery_address = jsonData['delivery_address'];

                    $('[name="id"]', newAddSpan).val(id);
                    $('[name="street"]', newAddSpan).val(street);
                    $('[name="city"]', newAddSpan).val(city);
                    $('[name="zip_code"]', newAddSpan).val(zip_code);
                    $('.state_select option[value="' + state + '"]', newAddSpan).attr({
                        'selected': 'selected'
                    });
                    $('.[name="address_type"] option[value="' + address_type + '"]', newAddSpan).attr({
                        'selected': 'selected'
                    });

                    if (parseInt(delivery_address)) {
                        $('[name="delivery_address"]', newAddSpan).attr({
                            'checked': 'checked'
                        });
                    }
                    $('.edit_address_main_div').append(newAddSpan);
                }
                $(".editAddressPop").dialog('open');
            } else {
                $('.edit_address_main_div').html('');
                showmsg("Hubo un error al editar el domicilio. Por favor, intente nuevamente.", 'f');
            }
        }, 'json');
    });

    $(".editAddressPop").dialog({
        autoOpen: false,
        modal: true,
        height: 600,
        width: 700,
        buttons: {
            "Guardar": function() {
                var tForm = $("#EditAddressForm");
                tForm.submit();
            },
            "Agregar Otro": function() {
                $('.edit_address_main_div').append(CreateAddressSpan());
            },
        },
        close: function() {
            $('#userFormPop [name="activity"]').focus();
        }
    });

    $("#operatorForm").validate({
        submitHandler: function(form) {
            var tForm = $("#operatorForm");
            var url = tForm.attr('action');
            $.post(url, {
                "name": $(' input[name="name"]', tForm).val(),
                "last_name": $(' input[name="last_name"]', tForm).val(),
                "email": $(' input[name="email"]', tForm).val(),
                "password": $(' input[name="password"]', tForm).val()
            },
            function(data) {
                if (isInt(data)) {
                    var newOption = "";
                    newOption += '<option value="' + data + '">' + $(' input[name="name"]', tForm).val() + '</option>';
                    $("#operatorDrp .addNewOperatorDrp").before(newOption);
                    $('#operatorDrp  option[value="' + data + '"]').attr({
                        'selected': 'selected'
                    });
                    $("#userFormPop [name='operator']").append(newOption);
                    $(".addNewOperatorPop").dialog('close');
                    showmsg("El operador ha sido agregado", 't');
                    clearForm(tForm);

                } else {
                    showmsg("Hubo un error al agregar el operador.", 'f');
                }
            });
        }
    });

    $("#editBankForm").validate({
        submitHandler: function(form) {
            editBankForm = $("#editBankForm");
            var url = editBankForm.attr('action');
            $.post(url, {
                "id": $('[name="id"]', editBankForm).val(),
                "bank_name": $('[name="bank_name"]', editBankForm).val(),
                "account_n": $('[name="account_n"]', editBankForm).val(),
                "branch": $('[name="branch"]', editBankForm).val(),
                "opening_date": $('[name="opening_date"]', editBankForm).val(),
                "zip_code": $('[name="zip_code"]', editBankForm).val(),
                "location_capital": $('[name="location_capital"]:checked', editBankForm).val(),
            },
                    function(data) {
                        if (data) {
                            var bankTr = $("#bankid_" + $('[name="id"]', editBankForm).val());
                            $('.td_bank_name', bankTr).html(
                                    $('[name="bank_name"]', editBankForm).val() +
                                    '<input type="hidden" name="zip_code" value="' + $('[name="zip_code"]', editBankForm).val() + '" />' +
                                    '<input type="hidden" name="location_capital" value="' + $('[name="location_capital"]:checked', editBankForm).val() + '" />'
                                    );
                            $('.td_account_n', bankTr).html($('[name="account_n"]', editBankForm).val());
                            $('.td_branch', bankTr).html($('[name="branch"]', editBankForm).val());
                            if ($('input[name="opening_date"]', editBankForm).val() == '') {
                                $('.td_opening_date', bankTr).html('Sin Especificar');
                            } else {
                                $('.td_opening_date', bankTr).html($('input[name="opening_date"]', editBankForm).val());
                            }

                            clearForm(editBankForm);
                            showmsg("La cuenta ha sido guardada", 't');
                            $(".edit-bank-details").dialog('close');
                        } else {
                            showmsg("Hubo un error al editar la cuenta bancaria, por favor intente nuevamente.");
                            $(".edit-bank-details").dialog('close');
                        }
                    });
        }
    });

    $("#editAddForm").validate({
        submitHandler: function(form) {
            editBankForm = $("#editAddForm");
            var url = editBankForm.attr('action');
            $.post(url, {
                "id": $('[name="id"]', editBankForm).val(),
                "street": $('[name="street"]', editBankForm).val(),
                "city": $('[name="city"]', editBankForm).val(),
                "client_id": $('[name="client_id"]', editBankForm).val(),
                "zip_code": $('[name="zip_code"]', editBankForm).val(),
                "state": $('[name="state_select"]', editBankForm).val(),
                "address_type": $('[name="address_type"]', editBankForm).val(),
                "delivery_address": parseInt($('[name="delivery_address"]:checked', editBankForm).val()),
            },
                    function(data) {
                        if (data) {
                            var bankTr = $("#addressid_" + $('input[name="id"]', editBankForm).val());
                            $('.td_street', bankTr).html($('[name="street"]', editBankForm).val());
                            $('.td_city', bankTr).html($('[name="city"]', editBankForm).val());
                            $('.td_zip_code', bankTr).html($('[name="zip_code"]', editBankForm).val());
                            $('.td_state', bankTr).html($('[name="state_select"] option:selected', editBankForm).text());
                            $('.td_address_type', bankTr).html($('[name="address_type"] option:selected', editBankForm).text());
                            //var seltr = $('#userid_' + $('[name="client_id"]', editBankForm).val());
                            //$('.amBtn', seltr).trigger('click', [true]);
                            $('#userid_' + $('[name="client_id"]', editBankForm).val()).trigger('click', [true]);
                            clearForm(editBankForm);
                            showmsg("El domicilio ha sido guardado", 't');
                            $(".edit-address-details").dialog('close');
                        } else {
                            showmsg("Hubo un error al guardar el domicilio, por favor intente nuevamente.");
                            $(".edit-address-details").dialog('close');
                        }
                    });
        }
    });

    $('.editBankBtn').live('click', function() {
        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');
        var editBankForm = $('#editBankForm');
        $('[name="id"]', editBankForm).val(bankid[1]);
        $('[name="bank_name"]', editBankForm).val($('.td_bank_name', bankTr).text());
        $('[name="account_n"]', editBankForm).val($('.td_account_n', bankTr).text());
        $('[name="branch"]', editBankForm).val($('.td_branch', bankTr).text());
        $('[name="zip_code"]', editBankForm).val($('[name="zip_code"]', bankTr).val());
        $('[name="location_capital"][value="' + $('[name="location_capital"]', bankTr).val() + '"]', editBankForm).attr('checked', 'checked');
        if ($('.td_opening_date', bankTr).text() == 'Sin Especificar') {
            $('[name="opening_date"]', editBankForm).val('');
        } else {
            $('[name="opening_date"]', editBankForm).val($('.td_opening_date', bankTr).text());
        }

        $(".edit-bank-details").dialog('open');
    });

    $(".addNewBankBtn").live('click', function() {
        var bankDataTableId = $(this).parents('table').attr('id').split('_');
        $('#userBankForm input[name="user_id"]').val(bankDataTableId[1]);
        $('#userBankForm input[name="addType"]').val('listing');
        $(".confirm-add-user").dialog('open');
    });

    $('.editAddBtn').live('click', function() {
        var client = $(this).parents('table:eq(0)'); //get whole addresses table
        var clientid = client.attr('id').split('_'); //get user id
        var addrTr = $(this).parents('tr');
        var addrid = addrTr.attr('id').split('_');
        var editAddForm = $('#editAddForm');
        $('[name="id"]', editAddForm).val(addrid[1]);
        $('[name="client_id"]', editAddForm).val(clientid[1]);
        $('[name="street"]', editAddForm).val($('.td_street', addrTr).html());
        $('[name="city"]', editAddForm).val($('.td_city', addrTr).html());
        $('[name="zip_code"]', editAddForm).val($('.td_zip_code', addrTr).html());
        $('[name="state_select"] option[value="' + $('.td_state input:hidden', addrTr).val() + '"]', editAddForm).attr({
            'selected': 'selected'
        });
        $('[name="address_type"] option[value="' + $('.td_address_type', addrTr).html() + '"]', editAddForm).attr({
            'selected': 'selected'
        });
        if ($('.td_delivery_address input:hidden', addrTr).val() == '1')
            $('[name="delivery_address"][value="1"]', editAddForm).attr('checked', true);
        else
            $('[name="delivery_address"][value="0"]', editAddForm).attr('checked', true);

        $(".edit-address-details").dialog('open');
    });

    $('.addNewAddBtn').live('click', function() {
        var addressesTable = $(this).parents('table:eq(0)'); //get whole addresses table
        var clientid = addressesTable.attr('id').split('_'); //get user id
        var editBankForm = $('#editAddForm');
        $('[name="client_id"]', editBankForm).val(clientid[1]);
        $('input:radio[name="delivery_address"]').attr('checked', false);
        $(".edit-address-details").dialog('open');
    });

    $('.addPriorAddBtn').live('click', function() {
        var bankTr = $(this).parents('table:eq(0)');
        var bankid = bankTr.attr('id').split('_');
        var editBankForm = $('#EditPriorClientForm');
        $('[name="client_id"]', editBankForm).val(bankid[1]);

        $(".EditPriorFromClientPanel").dialog('open');
    });

    $('.deleteBankBtn').live('click', function() {
        var result = confirm('Esta seguro que desea eliminar este registro?');

        if (result) {
            var bankTr = $(this).parents('tr');
            var bankid = bankTr.attr('id').split('_');
            var url = '/index/deletebankaccountajax';
            $.post(url, {
                'id': bankid[1]
            },
            function(data) {
                if (data) {
                    bankTr.eq(0).remove();
                    showmsg('La cuenta bancaria ha sido eliminada', 't');
                } else {
                    showmsg('Hubo un error al eliminar la cuenta bancaria. Por favor, intente nuevamente.', 'f');
                }
            });
        }
    });

    $('.deleteAddBtn').live('click', function() {
        var result = confirm('Esta seguro que desea eliminar este registro?');

        if (result) {
            var addrTr = $(this).parents('tr');
            var addrid = addrTr.attr('id').split('_');
            var url = '/index/deleteaddressajax';
            $.post(url, {
                'address_id': addrid[1]
            },
            function(data) {
                if (data) {
                    addrTr.eq(0).remove();
                    showmsg('El domicilo ha sido eliminado', 't');
                } else {
                    showmsg('Hubo un error eliminar el domicilio. Por favor, intente nuevamnete.', 'f');
                }
            });
        }
    });

    $('.toolTipCancelBtn').click(function() {
        $('.tooltipBox').hide();
    });



    $('#operatorDrp').change(function() {
        if ($('option:selected', this).hasClass('addNewOperatorDrp')) {
            clearForm($("#operatorForm"));
            $(".addNewOperatorPop").dialog('open');
        }
    });

    $('#ContactPointDrp').change(function() {
        if ($('option:selected', this).hasClass('addnew')) {
            clearForm($("#AddNewContactPointForm"));
            $(".addNewContactPop").dialog('open');
        }
    });

    jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^[0-9]{2}[-]{1}[0-9]{8}[-]{1}[0-9]{1}$/);
    }, "Please specify a valid phone number");
    /*jQuery.validator.addMethod("cellphone", function(phone_number, element) {
     phone_number = phone_number.replace(/\s+/g, "");
     return this.optional(element) || phone_number.length > 9 &&
     phone_number.match(/^[0-9]{3}[-]{1}[0-9]{4}[-]{1}[0-9]{4}$/);
     }, "Please specify a valid cell phone number");
     jQuery.validator.addMethod("landphone", function(phone_number, element) {
     phone_number = phone_number.replace(/\s+/g, "");
     return this.optional(element) || phone_number.length > 9 &&
     phone_number.match(/^\([1-9]\d{3}\)\s?\d{3}\-\d{4}$/);
     }, "Please specify a valid land phone number");*/


    $('.nameCap').keyup(function(evt) {
        $str = $(this).val().capitalize();
        $(this).val($str);
    });
    String.prototype.capitalize = function() {
        return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
            return p1 + p2.toUpperCase();
        });
    };

    //$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
});


$(document).ready(function() {
    var cForm = $('#userForm');
    var cPopForm = $('#userFormPop');
    telsValidations(cForm);
    telsValidations(cPopForm);

    $('[name="client_type"]', cForm).change(function() {
        if ($(this).val() == '1' || $(this).val() == '2') {
            $('[name="CUIL"]', cForm).removeClass('required');
            $('[name="DNI"]', cForm).removeClass('required');
        } else {
            $('[name="CUIL"]', cForm).addClass('required');
        }
    });
    $('[name="client_type"]', cPopForm).change(function() {
        if ($(this).val() == '1' || $(this).val() == '2') {
            $('[name="CUIL"]', cPopForm).removeClass('required');
            $('[name="DNI"]', cPopForm).removeClass('required');
        } else {
            $('[name="CUIL"]', cPopForm).addClass('required');
        }
    });
    $('[name="client_type"]', cForm).trigger('change');
    $('[name="CUIL"]', cForm).blur(function() {
        var lp = $(this);
        if (lp.val().length > 2) {
            var lpstr = lp.val();
            var finStr = '';
            lpstr = lpstr.split('-').join('');
            finStr += lpstr.substring(0, 2);
            finStr += '-' + lpstr.substring(2, 10);
            if (lpstr.length > 10) {

                finStr += '-' + lpstr.substring(10, 11);
            }
            lp.val(finStr);
        }

        lpstr = finStr.split('-');
        if (lpstr.length) {
            if (isInt(lpstr[1]) && $.trim($('[name="DNI"]', cForm).val()) == '') {
                $('[name="DNI"]', cForm).val(lpstr[1]);
            }
        }
    });
    $('[name="business_CUIT"]').blur(function() {
        var lp = $(this);
        if (lp.val().length > 2) {
            var lpstr = lp.val();
            var finStr = '';
            lpstr = lpstr.split('-').join('');
            finStr += lpstr.substring(0, 2);
            finStr += '-' + lpstr.substring(2, 10);
            if (lpstr.length > 10) {

                finStr += '-' + lpstr.substring(10, 11);
            }
            lp.val(finStr);
        }
    });
    $('[name="CUIL"]', cPopForm).blur(function() {
        var lp = $(this);
        if (lp.val().length > 2) {
            var lpstr = lp.val();
            var finStr = '';
            lpstr = lpstr.split('-').join('');
            finStr += lpstr.substring(0, 2);
            finStr += '-' + lpstr.substring(2, 10);
            if (lpstr.length > 10) {
                finStr += '-' + lpstr.substring(10, 11);
            }
            lp.val(finStr);
        }

        lpstr = finStr.split('-');
        if (lpstr.length) {
            if (isInt(lpstr[1]) && $.trim($('[name="DNI"]', cPopForm).val()) == '') {
                $('[name="DNI"]', cPopForm).val(lpstr[1]);
            }
        }
    });

    $('.landphone').live('blur', function() {
        var lp = $(this);
        var lpstr = lp.val().trim();
        lpstr = lpstr.split('-').join('');
        lpstr = lpstr.split(' ').join('');
        if (lpstr.length > 4) {
            var lpArr = Array();
            var sublpstr;
            for (var i = lpstr.length; i >= 0; i -= 4) {
                sublpstr = lpstr.substring(i - 4, i);
                if (sublpstr != '') {
                    lpArr.push(sublpstr);
                }
            }
            lp.val(lpArr.reverse().join('-'));
        }
        else if (lpstr == '' && lp.prev().val().trim() == '011')
            lp.prev().val('');
    });

    $('.cellphone').live('blur', function() {
        var lp = $(this);
        var lpstr = lp.val().trim();
        lpstr = lpstr.split('-').join('');
        lpstr = lpstr.split(' ').join('');
        if (lp.val().length > 4) {
            //lpstr = '15'+(lpstr.substring(2,lpstr.length))
            var lpArr = Array();
            var sublpstr;
            for (var i = lpstr.length; i >= 0; i -= 4) {
                sublpstr = lpstr.substring(i - 4, i);
                if (sublpstr != '') {
                    lpArr.push(sublpstr);
                }
            }
            lp.val(lpArr.reverse().join('-'));
        }
    });

    $('.areacode').live('focus', function() {
        if ($(this).val() == '' && $(this).next().val() == '') {
            $(this).val('011');
            return false;
        }
    });

    $('[name="CUIL"]', '#addTercerosOpForm').blur(function() {
        var lp = $(this);
        if (lp.val().length > 2) {
            var lpstr = lp.val();
            var finStr = '';
            lpstr = lpstr.split('-').join('');
            finStr += lpstr.substring(0, 2);
            finStr += '-' + lpstr.substring(2, 10);
            if (lpstr.length > 10) {

                finStr += '-' + lpstr.substring(10, 11);
            }
            lp.val(finStr);
        }

        lpstr = finStr.split('-');
        if (lpstr.length) {
            if (isInt(lpstr[1]) && $.trim($('[name="DNI"]', '#addTercerosOpForm').val()) == '') {
                $('[name="DNI"]', '#addTercerosOpForm').val(lpstr[1]);
            }
        }
    });
    jQuery.fn.ForceNumericOnly =
            function()
            {
                return this.each(function()
                {
                    $(this).keydown(function(e)
                    {
                        var key = e.charCode || e.keyCode || 0;
                        // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
                        return (
                                key == 8 ||
                                key == 9 ||
                                key == 46 ||
                                (key >= 37 && key <= 40) ||
                                (key >= 48 && key <= 57) ||
                                (key >= 96 && key <= 105));
                    })
                })
            };
    //$('.onlynumbers').ForceNumericOnly();
    //$('.hidden-default').hide();
});

function addDashes(el) {
    var lp = $(el);
    if (lp.val().length > 4) {
        var lpstr = lp.val();
        lpstr = lpstr.split('-').join('');
        var lpArr = Array();
        var sublpstr;
        for (var i = lpstr.length; i >= 0; i -= 4) {
            sublpstr = lpstr.substring(i - 4, i);
            if (sublpstr != '') {
                lpArr.push(sublpstr);
            }
        }
        lp.val(lpArr.reverse().join('-'));
    }
}

function getCaretPosition(input)
{
    if (document.selection)
    {
        var range = document.selection.createRange().duplicate();
        //moveStart returns the # of characters moved.
        return -range.moveStart("character", -input.value.length);
    }
    else if (input.selectionStart)
        return input.selectionStart;
    return -1;
}

function setCaretPosition(elem, caretPos) {
    if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
    }
    else {
        if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(caretPos, caretPos);
        }
        else
            elem.focus();
    }
}

function telsValidations(cForm) {
    /*$('[name="tel_part_code"]',cForm).blur(function(){
     var areacode = $(this);
     if(areacode.val().length >= 3) {
     var max_length_tel_part = 12 - areacode.val().length;
     var tel_part = $('[name="tel_part"]',cForm);
     tel_part.attr({
     'maxlengthattr':max_length_tel_part
     });
     /*
     if(tel_part.val().length > max_length_tel_part){
     tel_part.val('');
     }
     */
    /*
     }else {
     $('[name="tel_part"]',cForm).attr({
     'maxlengthAttr':9
     });
     }
     });
     */
    $('[name="tel_lab_code"]', cForm).blur(function() {
        var areacode = $(this);
        if (areacode.val().length >= 3) {
            var max_length_tel_lab = 12 - areacode.val().length;
            var tel_lab = $('[name="tel_lab"]', cForm);
            tel_lab.attr({
                'maxlengthattr': max_length_tel_lab
            });
            /*
             if(tel_lab.val().length > max_length_tel_lab){
             tel_lab.val('');
             }*/
        } else {
            $('[name="tel_lab"]', cForm).attr({
                'maxlengthAttr': 9
            });
        }
    });
    $('[name="tel_cell_code"]', cForm).blur(function() {
        var areacode = $(this);
        var areacodelen = areacode.val().length;
        var max_length_tel_cell;
        if (areacodelen >= 4) {
            if (areacodelen == 4) {
                max_length_tel_cell = 9;
            } else if (areacodelen == 5) {
                max_length_tel_cell = 8;
            }
            var tel_cell = $('[name="tel_cell"]', cForm);
            tel_cell.attr({
                'maxlengthattr': max_length_tel_cell
            });
            if (tel_cell.val().length > max_length_tel_cell) {
                tel_cell.val('');
            }
        } else {
            $('[name="tel_cell"]', cForm).attr({
                'maxlengthAttr': 12
            });
        }
    });
    $('[name="tel_otro_code"]', cForm).blur(function() {
        var areacode = $(this);
        var areacodelen = areacode.val().length;
        var max_length_tel_otro;
        if (areacodelen >= 4) {
            if (areacodelen == 4) {
                max_length_tel_otro = 9;
            } else if (areacodelen == 5) {
                max_length_tel_otro = 8;
            }
            var tel_otro = $('[name="tel_otro"]', cForm);
            tel_otro.attr({
                'maxlengthattr': max_length_tel_otro
            });
            /*
             if(tel_otro.val().length > max_length_tel_otro){
             tel_otro.val('');
             }*/
        } else {
            $('[name="tel_otro"]', cForm).attr({
                'maxlengthAttr': 12
            });
        }
    });
}

function formatTel(tel) {
    return tel.replace(/\D/g, ''); //remove non digits. Used for removing dashes
}

function formatAreacode(code) {
    code = code.replace(/\D/g, ''); //remove non digits
    if (code.trim() == '011') //if buenos aires area code, return blank script
        code = '';
    return code;
}

function cellcode(code) {
    if (code.length) {
        code = '+54' + code.substring(1, code.length);
    } else {
        //code = '+5411';
    }
    return code;
}

function cellnumber(number) {
    number = number.split('-').join('');
    if (number.length >= 10) {
        number = number.substring(2, number.length);
    } else {
        number = number.substring(1, number.length);
    }
    return number;
}

function landnumber(number) {
    if (number.length) {
        number = number.split('-').join('');
    }
    return number;
}

function landcode(number) {
    number = number.trim();
    if (number == '011') {
        number = '';
    }
    return number;
}

function CreateSpansForViewNumber(code, number) {
    if(typeof number == 'undefined')
        number = '';
    if(typeof code == 'undefined')
        code = '';
    var cnspan = '<span class="area_code_inp">' + code + '</span> <span class="number_inp">' + number + '</span>';
    return cnspan;
}

function CreateAddressSpan() {
    var defaultAddressSpan = $('.address_defale_span').clone().html();
    var stateSelectId = $('.state_select', defaultAddressSpan).attr('id').split('_');
    var newIdNum = parseInt(stateSelectId[1]) + 1;
    stateSelectId = stateSelectId[0] + '_' + newIdNum;
    $('.address_defale_span .state_select').attr({
        'id': stateSelectId
    });
    $('.state_select', defaultAddressSpan).attr({
        'id': stateSelectId
    })
    var span = $('<span class="address_span new_address_span"></span>');
    var newAddSpan = span.html(defaultAddressSpan);
    return newAddSpan;
}

function CreateShowAddressView(data) {
    var str = '';
    var jsonData = data;
    var id = jsonData['id'];
    var street = jsonData['street'];
    var city = jsonData['city'];
    var zip_code = jsonData['zip_code'];
    var state = jsonData['state'];
    var state_name = jsonData['state_name'];
    var country = jsonData['country'];
    var address_type = jsonData['address_type'];
    var delivery_address = parseInt(jsonData['delivery_address']) ? 'True' : 'False';


    str = '<table>' +
            '<tr>' +
            '<td width="100">Domicilio</td><td> : </td><td>' + street + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Barrio / Ciudad</td><td> : </td><td>' + city + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>C.P.</td><td> : </td><td>' + zip_code + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Provincia</td><td> : </td><td>' + state_name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Tipo de Domicilio</td><td> : </td><td>' + address_type + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Env&iacute;o</td><td> : </td><td>' + delivery_address + '</td>' +
            '</tr>' +
            '</table>';
    return str;
}

function cellPhoneValid(th) {
    var maxlength;
    if (th.value.substr(0, 2) == '15')
        maxlength = 12;
    else
        maxlength = parseInt(th.getAttribute("maxlengthattr", 2));

    if (th.value.length > maxlength) {
        th.value = th.value.substr(0, maxlength);
    }
}

function disableSelection(target) {
    if (typeof target.onselectstart != "undefined") { //IE route
        target.onselectstart = function() {
            return false;
        }
    } else if (typeof target.style.MozUserSelect != "undefined") { //Firefox route
        target.style.MozUserSelect = "none";
    } else { //All other route (ie: Opera)
        target.onmousedown = function() {
            return false;
        }
    }
    target.style.cursor = "default"
}
var currentTime = new Date;
var month = currentTime.getMonth() + 1;
month = month < 10 ? '0' + month : month;
var day = currentTime.getDate();
day = day < 10 ? '0' + day : day;
var year = currentTime.getFullYear();
var currentDate = day + "/" + month + "/" + year;

function recDate(oldDate, rec) {
    var oldDateArr = oldDate.split('/');
    var myDate = new Date();
    myDate.setFullYear(oldDateArr[2], oldDateArr[1] - 1, oldDateArr[0]);
    myDate.setDate(myDate.getDate() + rec);
    var newDate = myDate.getDate();
    newDate = newDate < 10 ? '0' + newDate : newDate;
    var newMonth = myDate.getMonth() + 1;
    newMonth = newMonth < 10 ? '0' + newMonth : newMonth;
    var newYear = myDate.getFullYear();
    var newFullYear = newDate + '/' + newMonth + '/' + newYear;
    //alert(newFullYear);
    return newFullYear;
}

function pdfSwitch(stateid, statustime, cave_id, report)
{
    var pdf_Arr = new Array();
    var pdf_list = '';
    rejectedBtn = '';
    report = report ? report : '';
    pdf_list = '<span class="details_pdf"><input type="hidden" value="1"/><img src="/images/pdf_icon.png"/> Mutuo 1 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
    pdf_list += '<span class="details_pdf"><input type="hidden" value="2"/><img src="/images/pdf_icon.png"/> Mutuo 2 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
    pdf_list += '<span class="details_pdf"><input type="hidden" value="3"/><img src="/images/pdf_icon.png"/> Mutuo 3 <br/><span class="pdfBtnPop pdfBtn">Guardar</span>  |  <span class="pdfBtnNew pdfBtn">Ver</span></span>';
    pdf_list = '<div style="margin-top:.5em">' + pdf_list + '</div>'

    var cancelOpBtn = '';
    if (stateid == 1 || stateid == 2 || stateid == 4 || stateid == 5 || stateid == 6 || stateid == 7 || stateid == 8) {
        cancelOpBtn = ' <span class="jq-link-btn-cancel cancelOp">Anular Op.</span>';
    }
    statustime += cancelOpBtn;
    /*
     if(stateid == 5 && cave_id	== 1){
     stateid	= 10;
     }
     if(stateid == 7 && cave_id	== 1){
     stateid	= 7;
     }
     if(stateid == 6 && cave_id	== 1){
     stateid	= 6;
     }
     if(stateid == 8 && cave_id	== 1){
     stateid	= 8;
     }
     if(stateid == 7 && cave_id	== 0){
     stateid	= 6;
     }
     
     var OpRejected = false;
     if(stateid == 8){
     OpRejected = true;
     }
     
     if(!OpRejected){
     statustime += cancelOpBtn;
     }
     */
    statustime += '<div style="font-size:12px;color:#595959;white-space:normal">' + report + '</div>';
    switch (stateid) {
        case 1:
            statusTxt = '<div class="stateViewDiv">' + operationStates[1].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepTwo';
            nextBtnText = 'Pedido de Informe';
            rejectedBtn = 'Pedido de Informe Compartido'
            pdf_list = '';
            break;
        case 2:
            statusTxt = '<div class="stateViewDiv">' + operationStates[2].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepThree';
            nextBtnText = 'Informe Aprobado';
            rejectedBtn = 'Informe Desaprobado';
            pdf_list = '';
            break;
        case 3:
            statusTxt = '<div class="stateViewDiv">' + operationStates[3].name + ': ' + statustime + '</div>';
            nextClsName = '';
            nextBtnText = '';
            break;
        case 4:
            statusTxt = '<div class="stateViewDiv">' + operationStates[4].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepFour';
            nextBtnText = 'Seleccionar Plan';
            pdf_list = '';
            break;
        case 5:
            statusTxt = '<div class="stateViewDiv">' + operationStates[5].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepFive';
            nextBtnText = 'Op. en Camino';
            break;
        case 6:
            statusTxt = '<div class="stateViewDiv">' + operationStates[6].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepSix';
            nextBtnText = 'Insertar Cheques';
            break;
        case 7:
            statusTxt = '<div class="stateViewDiv">' + operationStates[7].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepSix';
            nextBtnText = 'Asignar Ubicación';
            break;
        case 8:
            statusTxt = '<div class="stateViewDiv">' + operationStates[8].name + ': ' + statustime + '</div>';
            nextClsName = 'operationStepSix';
            nextBtnText = 'Insertar Cheques';
            break;
        case 9:
            statusTxt = '<div class="stateViewDivNoStatus" style="width: 55px">En cartera</div>';
            nextClsName = '';
            nextBtnText = '';
            break;
        case 10:
            statusTxt = '<span class="stateViewDivSaldada">SALDADA</span>';
            nextClsName = '';
            nextBtnText = '';
            break;
        case 11:
            statusTxt = '<div class="stateViewDivCobranza">EN COBRANZA</div>';
            nextClsName = '';
            nextBtnText = '';
            break;
        case 99:
            statusTxt = '<div class="stateViewDiv">' + operationStates[99].name + ': ' + statustime + '</div>';
            nextClsName = '';
            nextBtnText = '';
            rejectedBtn = '';
            pdf_list = '';
            break;
        default:
            statusTxt = '<div> </div>';
            nextClsName = 'addNewOperations';
            nextBtnText = 'Nueva Operación';
            pdf_list = '';
            break;
    }
    pdf_Arr['pdf_list'] = pdf_list;
    pdf_Arr['statusTxt'] = statusTxt;
    pdf_Arr['nextClsName'] = nextClsName;
    pdf_Arr['nextBtnText'] = nextBtnText;
    pdf_Arr['rejectedBtn'] = rejectedBtn;
    return pdf_Arr;

}
function datepicker() {

    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy',
        yearRange: "-50:+0", // this is the option you're looking for
    });
    $(".datepicker").focus(function() {
        $('.ui-datepicker-calendar').show();
    });

}
function getToolTipForm(ele) {
    var tooltipBox = $('.ShipDetails');
    tooltipBox.show();
    var x = ele.offset().left;
    var y = ele.offset().top;
    x = x - tooltipBox.width() - 10;
    tooltipBox.css({
        'top': y + 'px',
        'left': x + 'px'
    });
    return tooltipBox;
}
function getReportForm(ele, action) {
    $('[name="action"]', '#reportDetails').val(action);
    var tooltipBox = $('.reportDetails');
    tooltipBox.show();
    var x = ele.offset().left;
    var y = ele.offset().top;
    x = x - tooltipBox.width() - 10;
    tooltipBox.css({
        'top': y + 'px',
        'left': x + 'px'
    });
    return tooltipBox;
}
function showPopupBox(ele, boxSelector) {
    var tooltipBox = $(boxSelector);
    tooltipBox.show();
    var x = ele.offset().left;
    var y = ele.offset().top;
    x = x - tooltipBox.width() - 10;
    tooltipBox.css({
        'top': y + 'px',
        'left': x + 'px'
    });
    return tooltipBox;
}
function notificationbyopchange(op_id, terceros) {
    var url = '/index/notificationbyopchange';
    var title;
    if (terceros)
        title = 'Op. cheques 3ros ' + op_id;
    else
        title = 'Op. ' + op_id;
    $.post(url, {
        'operator_id': op_id,
        'title': title,
    },
            function(data) {

            });
}

function chk(name, checked) {
    if (checked) {
        checked = 'checked="checked"';
    } else {
        checked = '';
    }
    var chkbox = '<input type="checkbox" class="chequeChk" name="' + name + '" ' + checked + '/>'
    return chkbox;
}

function displayChequesTotals() {
    var prevBalance, acredAmount, liqData, operationid, payTotal, final_amountInv, operationsTotal, operation, rejected_cheque_id, rejectedTotal, selectedTotal, rejected_cheque, acreditacion_hrs;
    var operations_json = new Array();
    prevBalance = acredAmount = payTotal = operationsTotal = rejectedTotal = selectedTotal = 0;

    var tForm = $('#consolidateTercerosOpForm');
    var opId = $('[name="op_id"]', tForm).val();
    var acDate = $('[name="op_ac_date"]', tForm).val();
    var tasa = $('[name="op_tasa"]', tForm).val();

    //liqData = _liqDataEdit; //global liq data set to current liq on liq view.   
    var cheques_json = new Array();
    var checksArr = [];
    var x = 0;
    var adminData = {
        'liqDate': acDate, //fecha en qeu se tomaron los cheques
        'impuestoAlCheque': parseFloat($('[name="impuesto_al_cheque"]', tForm).val()),
        'tasaAnual': tasa,
        'acCapital': parseInt($('[name="acreditacion_capital"]', tForm).val()),
        'acInterior': parseInt($('[name="acreditacion_interior"]', tForm).val()),
        'gastosGeneral': parseFloat($('[name="gastos_general"]', tForm).val()),
        'gastosInterior': parseFloat($('[name="gastos_interior"]', tForm).val())
    };
    var cqktr,cqktr_id,cheque, selAmount,location_capital,date,chequeTodayDetails;
    $('#viewChequesGridView [name="editli"]').each(function() {
        cqktr = $(this).parents('tr:eq(0)');
        cqktr_id = cqktr.attr('id').split('_');
        if ($(this).is(':checked')) {            
            //selectedTotal += amountFormatR($('.chk_final_amount',cqktr).text());
            //acreditacion_hrs = $('[name="acreditacion_hrs"]',cqktr).val();
            cheque = {
                'cheque_id': cqktr_id[1],
                'status':1
                //'acreditacion_hrs': acreditacion_hrs
            };
            cheques_json.push(cheque);

            selAmount = amountFormatR($('.chk_amount', cqktr).text());
            location_capital = parseInt($('[name="location_capital"]', cqktr).val());
            date = $('.check_date', cqktr).text();
            chequeTodayDetails = getCheckValue(selAmount, date, location_capital, adminData);

            checksArr[x++] = {
                'importe': selAmount,
                'days': chequeTodayDetails.days,
                'todayValue': chequeTodayDetails.todayValue,
                'impuestoAlCheque': chequeTodayDetails.impuestoAlCheque,
                'intereses': chequeTodayDetails.daysDiscountFee,
                'location': location_capital,
                'gastos': chequeTodayDetails.gastos,
                'gastosOtros': chequeTodayDetails.gastosOtros
            };
        }
        else { //not checked
            cheque = {
                'cheque_id': cqktr_id[1],
                'status':9
                //'acreditacion_hrs': acreditacion_hrs
            };
            cheques_json.push(cheque);
        }            
    });
    //add selected checks ids to json
    $('[name="cheques_json"]', tForm).val(JSON.stringify(cheques_json));

    //calculate check totals and display in table footer
    var checksTotals = calculateChecksTotals(checksArr);
    $('#selectedChequesTotalsView', '#viewChequesGridView').html(
            '<tr class="checks-totals-th"><td>&nbsp;</td><td>N. CHEQUES</td><td>DIAS PROM.</td><td>BRUTO</td><td>IMP. AL CHEQUE</td><td>INTERESES</td><td>GASTOS INT.</td><td>GASTOS CAP.</td><td>GASTOS OTROS</td><td>SUBTOTAL</td></tr>' +
            '<tr><td>&nbsp;</td>' +
            '<td><span class="fn_chequeChkCount">' + checksTotals.chequeChkCount + '</span></td>' +
            '<td><span class="fn_dayAvg">' + checksTotals.dayAvg.toFixed(2) + '</span></td>' +
            '<td><span class="fn_payingAmount">' + amountFormat(checksTotals.bruto) + '</span></td>' +
            '<td><span class="fn_impuestoAlCheque">' + amountFormat(checksTotals.impuestoAlCheque) + '</span></td>' +
            '<td><span class="fn_interests">' + amountFormat(checksTotals.intereses) + '</span></td>' +
            '<td><span class="fn_gastos_interior">' + amountFormat(checksTotals.gastosInterior) + '</span></td>' +
            '<td><span class="fn_cost_general">' + amountFormat(checksTotals.gastosGeneral) + '</span></td>' +
            '<td><span class="fn_other_cost">' + amountFormat(checksTotals.gastosOtros) + '</span></td>' +
            '<td><span class="paying_amount_span">' + amountFormat(checksTotals.payingAmount) + '</span></td></tr>');
    //display totals
    $('.opTasa','.totalsView').text(tasa + '%');
    $('.opTotal','.totalsView').text(amountFormat(checksTotals.bruto));
    $('.todayValueTotal','.totalsView').text(amountFormat(checksTotals.payingAmount));

            
    //final_amountInv = payTotal * -1;
    /*
     var balance = prevBalance - payTotal + checksTotals.payingAmount;    
     var frontFinalView = $('.finalPayViewByLiquidacionesId'); 
     $('.payCls',frontFinalView).text(amountFormat(payTotal));
     $('.payingCls',frontFinalView).text(amountFormat(checksTotals.payingAmount));
     $('.balanceCls',frontFinalView).text(amountFormat(balance));            
     */
    //set form data
    /*
     $('[name="checks_qty"]',tForm).val(checksTotals.chequeChkCount);
     $('[name="average_days"]',tForm).val(checksTotals.dayAvg.toFixed(2));
     $('[name="total_bruto"]',tForm).val(checksTotals.bruto);
     $('[name="impuesto_al_cheque_amt"]',tForm).val(checksTotals.impuestoAlCheque);
     $('[name="intereses"]',tForm).val(checksTotals.intereses);
     $('[name="gastos_interior"]',tForm).val(checksTotals.gastosInterior);
     $('[name="gastos_general"]',tForm).val(checksTotals.gastosGeneral);
     $('[name="gastos_varios"]',tForm).val(checksTotals.gastosOtros);
     $('[name="total_neto"]',tForm).val(checksTotals.payingAmount);
     */
}
