$(function()
{
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 50,
        "sScrollXInner": "100%",
        'aoColumns': [null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'}, null, null, null, null],
        "aaSorting": [[1, "desc"]]
    });

    oTableCobranzas = $('#grid-cobranzas').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 50,
        "sScrollXInner": "100%",
        'aoColumns': [null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'},
            null, null, {'sType': 'currency'}, null, {'sType': 'num-html'}, null, null],
        "aaSorting": [[1, "desc"]]
    });

    oTable = $('#grid-terceros').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 50,
        "sScrollXInner": "100%",
        'aoColumns': [null, null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'}, null, {'sType': 'num-html'}, {'sType': 'currency'}, null, null, null],
        "aaSorting": [[1, "desc"]]
    });

    $('#operationsgrid').dataTable({
        "bJQueryUI": true,
        "sScrollXInner": "100%",
        "bScrollCollapse": true,
        "bStateSave": true,
        "bPaginate": false,
        "iDisplayLength": 50,
    });

    var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
    edBtn += "<!--<span class='deleteBtn gridBtn'>Borrar</span>-->";
    $("#grid_length").append(edBtn);
    $("#grid tbody").click(function(event) {
        $(oTable.fnSettings().aoData).each(function() {
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });

    /* Add a click handler for the delete row */
    $('.deleteBtn').click(function() {

        deleteFun(oTable);
    });

    function deleteFun(oTable) {
        var result = confirm('Esta seguro que desea eliminar este registro?');

        if (result) {
            var anSelected = fnGetSelected(oTable);
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/chequedeleteajax";
            $.post(url, {
                "id": selIdArr[1]
            },
            function(data) {
                if (isInt(data)) {
                    showmsg("El registro ha sido eliminado", 't');
                    oTable.fnDeleteRow(anSelected[0]);
                } else {
                    showmsg("Hubo un error al eliminar el registro", 'f');
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

    $(".editBtn").click(function() {
        var selRow = $(".gridtbody .row_selected");
        if (selRow.size()) {
            var idArr = selRow.attr('id').split("_");
            var popEditForm = $(".editChequePop");
            $('[name="id"]', popEditForm).val(idArr[1]);
            $('#opNumber', popEditForm).text($('[name="operation_id"]', selRow).val());
            $('#clientName', popEditForm).text($('.user_name', selRow).text());
            //$('[name="operation_id"] option[value="'+$(".user_operation_id input",selRow).val()+'"]',popEditForm).attr('selected','selected');
            $('[name="date"]', popEditForm).val($(".user_date", selRow).text());
            $('[name="check_n"]', popEditForm).val($(".user_check_n", selRow).text());
            $('#checkDate', popEditForm).text($(".user_date", selRow).text());
            $('#checkN', popEditForm).text($(".user_check_n", selRow).text());
            $('#checkAmount', popEditForm).text($(".user_amount", selRow).text());
            $('#checkStatus', popEditForm).text($('.user_status', selRow).text());
            ////$('[name="amount"]',popEditForm).val(amountFormatR($(".user_amount",selRow).text()));
            //$('[name="status"] option[value="'+$(".user_status input",selRow).val()+'"]',popEditForm).attr('selected','selected');
            $("#EditChequesForm [name='id']").val(idArr[1]);
            $("#EditChequesForm [name='operation_id']").val($('[name="operation_id"]', selRow).val());
            $("#EditChequesForm [name='amount']").val(amountFormatR($(".user_amount", selRow).text()));
            $("#EditChequesForm [name='status']").val($('.user_status', selRow).text());

            var status = $('[name="status_id"]', selRow).val();
            if (status != 1 && status != 6) { //cheque is not en cartera or en proceso            
                //$('[name="date"]',popEditForm).attr('disabled','disabled');
                //$('[name="check_n"]',popEditForm).attr('disabled','disabled');
                $('[name="date"]', popEditForm).hide();
                $('[name="check_n"]', popEditForm).hide();
                $('#checkDate', popEditForm).show();
                $('#checkN', popEditForm).show();
                $(":button:contains('Listo')").hide();
            }
            else { //cheque is en cartera or en proceso            
                //$('[name="date"]',popEditForm).removeAttr('disabled');
                //$('[name="check_n"]',popEditForm).removeAttr('disabled');
                $('[name="date"]', popEditForm).show();
                $('[name="check_n"]', popEditForm).show();
                $('#checkDate', popEditForm).hide();
                $('#checkN', popEditForm).hide();
                $(":button:contains('Listo')").show();
            }
            $(".editChequePop").dialog("open");
        } else {
            alert("Por favor seleccione una fila");
        }
    });

    /*tabs*/
    $("#tabs").tabs({
        selected: 0
    });
    uForm = $("#chequesForm").validate({
        submitHandler: function(form) {
            tForm = $("#chequesForm");
            var url = tForm.attr('action');
            $.post(url, {
                "operation_id": $(' [name="operation_id"]', tForm).val(),
                "date": $(' [name="date"]', tForm).val(),
                "check_n": $(' [name="check_n"]', tForm).val(),
                "amount": $(' [name="amount"]', tForm).val(),
                "status": $(' [name="status"]', tForm).val()

            },
            function(data) {
                if (isInt(data)) {
                    showmsg("El cheque ha sido agregado", 't');
                    window.location.reload()
                    /*
                     var trmade = $('#grid').dataTable().fnAddData( [
                     data,
                     $('[name="operation_id"] option:selected',tForm).text(),
                     $('[name="date"]',tForm).val(),
                     $('[name="check_n"]',tForm).val(),
                     amountFormat($('[name="amount"]',tForm).val()),
                     $('[name="status"] option:selected',tForm).text()] );
                     var oSettings = oTable.fnSettings();
                     var nTr = oSettings.aoData[ trmade[0] ].nTr;
                     nTr.id = 'chequeid_'+data;
                     $("td:eq(1)",nTr).addClass('user_operation_id').append('<input type="hidden" name="operation_id" value="'+$('[name="operation_id"]',tForm).val()+'">');
                     $("td:eq(2)",nTr).addClass('user_date');
                     $("td:eq(3)",nTr).addClass('user_check_n);
                     $("td:eq(4)",nTr).addClass('user_amount');
                     $("td:eq(5)",nTr).addClass('user_status').append('<input type="hidden" name="status_id" value="'+$('[name="status"]',tForm).val()+'">');
                     
                     $('.showOperationsSpan',tForm).text('');
                     clearForm(tForm);
                     */
                } else {
                    showmsg("Hubo un error al agregar el cheque, por favor intente nuevamente.", 'f');
                }
            });

        }
    });
    $(".editChequePop").dialog({
        autoOpen: false,
        modal: true,
        //height: 'auto',
        width: 500,
        buttons: {
            "Listo": function() {
                $("#EditChequesForm").submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
    });
    $("#addOperations").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 600,
        buttons: {
            "Listo": function() {

                $("#addOperationsForm").submit();


            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });
    $("#addOperationsForm").validate({
        submitHandler: function(form) {
            var tForm = $("#addOperationsForm");
            var url = tForm.attr('action');
            $.post(url, {
                "id": $(' input[name="id"]', tForm).val(),
                "client_id": $(' select[name="client_id"]', tForm).val(),
                "date": $(' input[name="date"]', tForm).val(),
                "amount": $(' input[name="amount"]', tForm).val(),
                "observations": $(' input[name="observations"]', tForm).val(),
                "report": $(' input[name="report"]', tForm).val()
            },
            function(data) {
                if (isInt(data)) {
                    showmsg("La operacion ha sido agregada", 't');
                    var addOption = '<option value="' + data + '">' + $('[name="client_id"] option:selected', tForm).eq(0).text() + ' ' + $(' input[name="amount"]', tForm).val() + '</option>';
                    $('#chequesForm [name="operation_id"] .addnew').before(addOption);
                    $('#chequesForm [name="operation_id"] option[value="' + data + '"]').attr({
                        'selected': 'selected'
                    });
                    $("#EditChequesForm [name='operation_id']").append(addOption);

                    $("#addOperations").dialog('close');
                } else {
                    showmsg("Hubo un error al agregar la operacion, por favor intente nuevamente.");
                    $("#addOperations").dialog('close');
                }
            });
        }


    });
    $("#EditChequesForm").validate({
        submitHandler: function(form) {
            tForm = $("#EditChequesForm");

            var url = tForm.attr('action');
            $.post(url, {
                "id": $(' [name="id"]', tForm).val(),
                "operation_id": $(' [name="operation_id"]', tForm).val(),
                "date": $(' [name="date"]', tForm).val(),
                "check_n": $(' [name="check_n"]', tForm).val(),
                "amount": $(' [name="amount"]', tForm).val(),
                "status": $(' [name="status"]', tForm).val()
            },
            function(data) {
                if (isInt(data)) {
                    showmsg("El cheque ha sido agregado", 't');

                    var selRow = $("#grid .row_selected");

                    $(".user_operation_id", selRow).html($('[name="operation_id"]', tForm).val() + '<input type="hidden" name="inp_operation_id" value="' + $('[name="operation_id"]', tForm).val() + '"/>');
                    $(".user_date", selRow).text($('[name="date"]', tForm).val());
                    $(".user_check_n", selRow).text($('[name="check_n"]', tForm).val());
                    $(".user_amount", selRow).text(amountFormat($('[name="amount"]', tForm).val()));
                    $(".user_status", selRow).html($('[name="status"]', tForm).val() + '<input type="hidden" name="status_id" value="' + $('[name="status"]', tForm).val() + '"/>');
                    //$(".user_contact_point",selRow).html( $('[name="contact_point"] option:selected',userFormPop).text()+'<input type="hidden" name="contact_point_id" value="'+$('[name="contact_point"] option:selected',userFormPop).val()+'"/>');
                    $(".editChequePop").dialog('close');
                    clearForm(tForm);
                } else {
                    $(".editChequePop").dialog('close');
                    showmsg("Hubo un error al agregar el cheque, por favor intente nuevamente.", 'f');
                }
            });

        }
    });

    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy'

    });

    $('#chequesForm [name="operation_id"]').change(function() {
        if ($('option:selected', this).hasClass('addnew')) {
            $("#addOperations").dialog('open');
        }

    });

    $(".selectOperations").dialog({
        autoOpen: false,
        modal: true,
        height: window.screen.height - 200,
        width: window.screen.width - 200,
        buttons: {
            "Listo": function() {

                var operation_id = $('#operationSelectForm [name="operation_radio"]:checked').val();
                var selRow = $('#operationSelectForm [name="operation_radio"]:checked').parents('tr');
                var clientName = $('.user_client_name', selRow).text();
                var clientdate = $('.user_date', selRow).text();
                var price = '$ ' + $('.user_amount', selRow).text();
                $("[name='operation_id']", operationForm).val(operation_id);
                $('.showOperationsSpan', operationForm).text(clientName + ' - ' + clientdate + ' - ' + price);
                $(this).dialog('close');

            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });
    $('.showOperationsBtn').click(function() {
        operationForm = null;
        operationForm = $("#chequesForm");
        var operation_id = $('[name="operation_id"]', operationForm);
        clearForm($('#operationSelectForm'));
        if (isInt(operation_id)) {
            $('#operationSelectForm [name="operation_radio"][value="' + operation_id + '"]').attr({
                'checked': 'checked'
            });
        }
        $(".selectOperations").dialog('open');
    });
    $('.editShowOperationsBtn').click(function() {
        operationForm = null;
        operationForm = $("#EditEventForm");
        var selectedRowOperation = $('[name="operation_id"]', operationForm).val();
        $("[name='operation_id']", operationForm).val(selectedRowOperation);
        $('#operationSelectForm [name="operation_radio"][value="' + selectedRowOperation + '"]').attr({
            'checked': 'checked'
        });
        var operation_id = $('#operationSelectForm [name="operation_radio"]:checked').val();
        var selRow = $('#operationSelectForm [name="operation_radio"]:checked').parents('tr');
        var clientName = $('.user_client_name', selRow).text();
        var clientdate = $('.user_date', selRow).text();
        var price = '$ ' + $('.user_amount', selRow).text();
        alert(clientName + ' - ' + clientdate + ' - ' + price);
        $('.showOperationsSpan', operationForm).text(clientName + ' - ' + clientdate + ' - ' + price);
        $(".selectOperations").dialog('open');
    });

    $('.rejectChequeBtn').live('click', function() {
        tooltipBox = getToolTipForm($(this));
        var sTr = $(this).parents('tr').eq(0);
        var saleid = sTr.attr('id').split('_');
        $('[name="cheque_id"]', tooltipBox).val(saleid[1]);
    });
    $('.toolTipCancelBtn').click(function() {
        $('.tooltipBox').hide();
    });
    $('.costOne').live('click', function() {
        var url = '/index/rejectchequewithgastosajax';
        var tooltipBox = $('.tooltipBox');
        var cheque_id = $('[name="cheque_id"]', tooltipBox).val();
        var bankTr = $('#userid_' + cheque_id);
        $.post(url, {
            'id': cheque_id,
            'gastos': $('[name="gastos_denuncia"]', tooltipBox).val(),
            'gastos_type': $(this).val(),
        },
                function(data) {
                    if (data) {
                        showmsg('El cheque ha sido rechazado', 't');
                        $('.user_status', bankTr).text('Rechazado');
                        $('.user_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
                        $('.user_actions', bankTr).html('<span id="OpClientIduserid_" title="" class="ui-state-default ui-corner-all addNewGdc"><span class="jq-link-btn">Gestión de Cobranza</span></span>');
                        tooltipBox.hide();
                    } else {
                        showmsg('Hubo un error al rechazar el cheque, por favor intente nuevamente.', 'f');
                    }
                });
    });
    $('.costTwo').live('click', function() {
        var url = '/index/rejectchequewithgastosajax';
        var tooltipBox = $('.tooltipBox');
        var cheque_id = $('[name="cheque_id"]', tooltipBox).val();
        var bankTr = $('#userid_' + cheque_id);
        $.post(url, {
            'id': cheque_id,
            'gastos': $('[name="gastos_rechazo"]', tooltipBox).val(),
            'gastos_type': $(this).val(),
        },
                function(data) {
                    if (data) {
                        showmsg('El cheque ha sido rechazado', 't');
                        $('.user_status', bankTr).text('Rechazado');
                        $('.user_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
                        $('.user_actions', bankTr).html('<span id="OpClientIduserid_" title="" class="ui-state-default ui-corner-all addNewGdc"><span class="jq-link-btn">Gestión de Cobranza</span></span>');
                        tooltipBox.hide();
                    } else {
                        showmsg('Hubo un problema al rechazar el cheque, por favor intente nuevamente.', 'f');
                    }
                });
    });
    $('.payedChequeBtn').live('click', function() {

        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');
        var url = '/index/chequepayedajax';
        $.post(url, {
            'id': bankid[1]
        },
        function(data) {
            if (data) {
                showmsg('El cheque ha sido pagado', 't');
                $('.user_status', bankTr).text('Acreditado');
                $('.user_actions', bankTr).find('.rejectChequeBtn,.payedChequeBtn').remove();
            } else {
                showmsg('Hubo un error al ingresar el pago del cheque, por favor intente nuevamente.', 'f');
            }
        });
    });
    $('.dataTables_scrollHeadInner .ui-state-default:eq(2)').trigger('click');
    gptTable = $('#gestionPagoTable').dataTable({
        "bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        //"bScrollCollapse": true,
        //"bStateSave"		: true,
        "bAutoWidth": true,
        'aoColumns': [{
                "sType": 'us_date'
            }, null, null, null, null, ]
    });
    gtTable = $('#gestionTable').dataTable({
        "bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        //"bScrollCollapse": true,
        //"bStateSave"		: true,
        "bAutoWidth": true,
        'aoColumns': [{
                "sType": 'us_date'
            }, null, null, null, null, null, null, null, ]
    });

    $('.addNewGdc').live('click', function() {
        $('.rejected_cheques_payment').dialog('open');
        var bankDetailsTable = $(this).parents('.fnOpenTable:eq(0)');
        var thisTr = $(this).parents('tr:eq(0)');
        var clientid = $('[id^="clientId_"]', thisTr).attr('id').split('_');
        $('.rejected_cheques_payment [name="client_id"]').val(clientid[1]);
        var url = '/index/getgestiondetailsajax';
        gtTable.fnClearTable();
        gptTable.fnClearTable();
        $.post(url, {
            "client_id": clientid[1]
        },
        function(data) {
            if (data) {

                var item, check_n, amount, id, bank_name, balance, operation_id, date, rejected_gastos, total, observations, option = '';
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
                    rejected_gastos = parseFloat(item['rejected_gastos']);
                    total = amount + rejected_gastos;
                    observations = item['observations'];
                    var trmade = $('#gestionPagoTable').dataTable().fnAddData([
                        date_paid,
                        amountFormat(paid_amount),
                        check_n,
                        amountFormat(previous_balance),
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
    $(".rejected_cheques_payment").dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 800,
        buttons: {
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
});
function getToolTipForm(ele) {

    var tooltipBox = $('.tooltipBox');
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