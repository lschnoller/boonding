$(document).ready(function()
    {
        var gaiSelected =  [];
        var nCloneTh = document.createElement( 'th' );
        var nCloneTd = document.createElement( 'td' );
        nCloneTd.innerHTML = '<img src="/images/details_open.png" class="amBtn">';
        nCloneTd.className = "center";

        $('#grid thead tr').each( function () {
            this.insertBefore( nCloneTh, this.childNodes[0] );
        } );

        $('#grid tbody tr').each( function () {
            this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
        } );

        function fnFormatDetails ( oTable, nTr ,data)
        {
            var aData = oTable.fnGetData( nTr );
            var sOut = '<table class="whiteTable">';
            //id 	operation_id 	date Fecha	check_n Numero de Cheque	amount Importe	status Estado
            sOut += '<tr><th>Fecha</th><th>N Cheque</th><th>Importe</th><th>Estado</th><!--<th></th>--></tr>';
            var opendate,x;
            for(x in data)
            {
                item = data[x];
                var colorClass = '';
                if (item['status'] == 2)
                    colorClass = "lightGreenTr";
                else if(item['status'] == 3)
                    colorClass = "lightRedTr";
                
                sOut += '<tr id="chequeid_'+item['id']+'" class="'+colorClass+'">';
                opendate = item['date'];
                if(opendate == null){
                    opendate = 'Sin Especificar';
                }
                var statusHTML = "";
                if(item['status'] != "" && item['status'] != null){                   
                    statusHTML += $('.statusDrpDwn option[value="'+item['status']+'"]').html()+'<input type="hidden" class="td_status_id" value="'+item['status']+'"/>';
                }else{
                    statusHTML += '<input type="hidden" class="td_status_id" value=""/>'
                }
                if (item['check_n'])
                    $checkN = item['check_n'];
                else
                    $checkN = "-";
                sOut += 	'<td class="td_date">'+opendate+'</td>';
                sOut += 	'<td class="td_check_n">'+$checkN+'</td>';
                sOut += 	'<td class="td_amount">'+amountFormat(item['amount'])+'</td>';
                sOut += 	'<td  class="td_status">'+statusHTML+'</td>';
                sOut += 	'<!--<td><span class="link1"><img src="/images/edit.png" class="editChequeBtn"/></span></td>-->';
                sOut += '</tr>';

            }

            sOut += '</table>';
            return sOut;
        }

        $('.editChequeBtn').live('click',function()
        {
            var chequeTr = $(this).parents('tr');
            var chequeId = chequeTr.attr('id').split('_');
            var editBankForm = $('#editChequesForm');
            $('[name="id"]',editBankForm).val(chequeId[1]);
            $('[name="date"]',editBankForm).val($('.td_date',chequeTr).html());
            $('[name="check_n"]',editBankForm).val($('.td_check_n',chequeTr).html());
            $('[name="amount"]',editBankForm).val(amountFormatR($('.td_amount',chequeTr).html()));
            //$('[name="status"] option[value="'+$('.td_status_id',chequeTr).val()+'"]',editBankForm).attr('selected','selected');
            $('#chequeStatus', editBankForm).html($('.td_status',chequeTr).html());
            $( "#editCheques" ).dialog('open');
        });
        
        $('#grid tbody td .amBtn').live('click', function () {
            var nTr = this.parentNode.parentNode;
            userid = nTr.id.split('_');
            var img = this;
            if ( this.src.match('details_close') )
            {
                /* This row is already open - close it */
                this.src = "/images/details_open.png";
                oTable.fnClose( nTr );
            }
            else
            {
                /* Open this row */
                this.src = "/images/details_close.png";
                //getbankdetailsbyidajax
                var url = '/gyuser/index/getcheckdetailsbyidajax';
                $.post(url, {
                    "operation_id"   : userid[1]
                },
                function(data){
                    if(data.length){
                        oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr,data), 'details' );
                    }else{
                        showmsg('Esta operación no contiene cheques','f');
                        img.src = "/images/details_open.png";
                    }
                    // oTable.fnDeleteRow( anSelected[0] );

                },'json');
            }
        } );

        oTable = $('#grid').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "sScrollXInner": "100%",
            "bScrollCollapse": true,
            "bStateSave": false,
            "iDisplayLength": 50,
            'aoColumns': [ null, {'sType':'num-html'}, null, {"sType": 'us_date'}, {'sType': 'currency'}, null, null, null],
            "aaSorting": [[3, "desc"]]
        });       
        
        var edBtn = "<!--<span class='editBtn gridBtn'>Editar</span>-->";
        edBtn += "<!--<span class='deleteBtn gridBtn'>Borrar</span>-->";
        $("#grid_length").append(edBtn);
        $("#grid tbody").click(function(event) {
            $(oTable.fnSettings().aoData).each(function (){
                $(this.nTr).removeClass('row_selected');
            });
            $(event.target.parentNode).addClass('row_selected');
        });

        /* Add a click handler for the delete row */
        $('.deleteBtn').click( function() {

            deleteFun(oTable);
        } );

        function deleteFun(oTable){
            var result = confirm('Esta seguro que desea eliminar la operación?');

            if(result){
                var anSelected = fnGetSelected( oTable );
                var selIdArr = anSelected[0].id.split("_");
                var url = "/gyuser/Index/operationsdeleteajax";
                $.post(url, {
                    "id"   : selIdArr[1]
                },
                function(data){
                    if(data){
                        showmsg("La operación ha sido eliminada",'t');
                        oTable.fnDeleteRow( anSelected[0] );
                    }else{
                        showmsg("Hubo un error al eliminar la operación, por favor intente nuevamente.",'f');
                    }
                });
            }
        }
        function fnGetSelected( oTableLocal )
        {
            var aReturn = new Array();
            var aTrs = oTableLocal.fnGetNodes();

            for ( var i=0 ; i<aTrs.length ; i++ )
            {
                if ( $(aTrs[i]).hasClass('row_selected') )
                {
                    aReturn.push( aTrs[i] );
                }
            }
            return aReturn;
        }
        
        $( ".editBtn" ).click(function() {
            var selRow = $(".gridtbody .row_selected");
            if(selRow.size()){
                var idArr = selRow.attr('id').split("_");
                var popEditForm = $("#editOperationsForm");
                $('[name="id"]',popEditForm).val(idArr[1]);
                $('[name="client_id"] option[value="'+$(".user_client_name input",selRow).val()+'"]',popEditForm).attr('selected','selected');
                $('[name="date"]',popEditForm).val($(".user_date",selRow).text());
                $('[name="amount"]',popEditForm).val(amountFormatR($(".user_amount",selRow).text()));
                $('[name="state"] option[value="'+$(".user_state input",selRow).val()+'"]',popEditForm).attr('selected','selected');
                $('[name="observations"]',popEditForm).val($(".user_observations",selRow).text());
                $('[name="report"]',popEditForm).val($(".user_report",selRow).text());

                $( "#editOperations" ).dialog( "open" );
            }else{
                showmsg("Por favor seleccione una fila primero.",'f');
            }
        //trSelected
        });

        /*tabs*/
        $( "#tabs" ).tabs({
            selected: 0
        });

        $("#operationsForm").validate({
            submitHandler: function(form) {
                var tForm = $("#operationsForm");
                var url = tForm.attr('action');
                $.post(url, {
                    "client_id" 	: $(' [name="client_id"]',tForm).val(),
                    "date"  		: $(' [name="date"]',tForm).val(),
                    "amount"  		: $(' [name="amount"]',tForm).val(),
                    "state"  		: $(' [name="state"]',tForm).val(),
                    "observations" 	: $(' [name="observations"]',tForm).val(),
                    "report" 		: $(' [name="report"]',tForm).val()
                },
                function(data){
                    if(isInt(data)){
                        $("#chequesForm input[name='operation_id']").val(data);
                        $( "#addNewCheques" ).dialog('open');
                        var trmade = oTable.fnAddData( [
                            '<img src="/images/details_open.png" class="amBtn">',
                            data,
                            $('[name="client_id"] option:selected',tForm).text()+'<input type="hidden"  value="'+$('select[name="client_id"]',tForm).val()+'"/>',
                            $('[name="date"]',tForm).val(),
                            amountFormat($('[name="amount"]',tForm).val()),
                            $('[name="state"] option:selected',tForm).text()+'<input type="hidden"  value="'+$('select[name="state"]',tForm).val()+'"/>',
                            $('[name="observations"]',tForm).val(),
                            $('[name="report"]',tForm).val()] );
                        var oSettings = oTable.fnSettings();
                        var nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'userid_'+data;
                        $("td:eq(2)",nTr).addClass('user_client_name');
                        $("td:eq(3)",nTr).addClass('user_date');
                        $("td:eq(4)",nTr).addClass('user_amount');
                        $("td:eq(5)",nTr).addClass('user_state');
                        $("td:eq(6)",nTr).addClass('user_observations');
                        $("td:eq(7)",nTr).addClass('user_report');

                        clearForm(tForm);
                    }else{
                        showmsg("Hubo un error al agregar la operación. Por favor intente nuevamente.",'f');
                    }
                });
            }
        });
        $("#editOperationsForm").validate({
            submitHandler: function(form) {
                var tForm = $("#editOperationsForm");
                var url = tForm.attr('action');
                $.post(url, {
                    "id": $(' [name="id"]',tForm).val(),
                    "client_id": $(' [name="client_id"]',tForm).val(),
                    "date": $(' [name="date"]',tForm).val(),
                    "amount": $(' [name="amount"]',tForm).val(),
                    "state": $(' [name="state"]',tForm).val(),
                    "observations": $(' [name="observations"]',tForm).val(),
                    "report": $(' [name="report"]',tForm).val()
                },
                function(data){
                    if(isInt(data)){
                        showmsg("La operación ha sido guardada",'t');
                        var selRow = $("#grid .row_selected");
                        $(".user_client_name",selRow).html($('[name="client_id"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="client_id"]',tForm).val()+'" />');
                        $(".user_date",selRow).text($('[name="date"]',tForm).val());
                        $(".user_amount",selRow).text(amountFormat($('[name="amount"]',tForm).val()));
                        $(".user_state",selRow).html($('[name="state"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="state"]',tForm).val()+'" />');
                        $(".user_observations",selRow).text($('[name="observations"]',tForm).val());
                        $(".user_report",selRow).text($('[name="report"]',tForm).val());
                        clearForm(tForm);
                        $( "#editOperations" ).dialog('close');
                        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
                    }else{
                        showmsg("Hubo un error al guardar la operación, por favor intente nuevamente.");
                    }
                });
            }
        });
        $("#addNewCheques").dialog({
            autoOpen: false,
            modal:true,
            height: 500,
            width: 600,

            buttons: {
                "Guardar": function() {

                    $("#chequesForm").submit();


                },
                "Cancelar": function() {
                    $(this).dialog('close');
                    showmsg('Operaciones Added Successfully!','t');
                }
            }
        });
        $( "#editOperations" ).dialog({
            autoOpen: false,
            modal:true,
            height: 500,
            width: 600,

            buttons: {
                "Guardar": function() {

                    $("#editOperationsForm").submit();


                },
                "Cancelar": function() {
                    $(this).dialog('close');
                }
            }
        });
        $( "#editCheques" ).dialog({
            autoOpen: false,
            modal:true,
            height: 300,
            width: 600,

            buttons: {
                "Guardar": function() {

                    $("#editChequesForm").submit();


                },
                "Cancelar": function() {
                    $(this).dialog('close');
                }
            }

        });
        $( ".addNextChequeConfirm" ).dialog({
            autoOpen: false,
            modal:true,
            buttons: {
                "Agregar Cheque": function() {

                    $("#addNewCheques").dialog('open');
                    $( this ).dialog( "close" );

                },
                "Cancelar": function() {
                    $( this ).dialog( "close" );
                }
            },
            close: function() {
                showmsg('La operación ha sido guardada.','t');
            }
        });

        $("#chequesForm").validate({
            submitHandler: function(form) {
                var tForm = $("#chequesForm");
                var url = tForm.attr('action');
                $.post(url, {
                    "operation_id" 	: $(' [name="operation_id"]',tForm).val(),
                    "date"  		: $(' [name="date"]',tForm).val(),
                    "check_n"  		: $(' [name="check_n"]',tForm).val(),
                    "amount" 		: $(' [name="amount"]',tForm).val(),
                    "status" 		: $(' [name="status"]',tForm).val()
                },
                function(data){
                    if(isInt(data)){
                        $( ".addNextChequeConfirm" ).dialog('open');
                        $("#addNewCheques").dialog('close');
                        clearForm(tForm);
                        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');


                    }else{
                        showmsg("Hubo un error al agregar los cheques, por favor intente nuevamente.",'f');
                    }
                });
            }


        });
        $("#editChequesForm").validate({
            submitHandler: function(form) {
                var tForm = $("#editChequesForm");
                var url = tForm.attr('action');
                $.post(url, {
                    "id" 			: $(' [name="id"]',tForm).val(),
                    "date"  		: $(' [name="date"]',tForm).val(),
                    "check_n"  		: $(' [name="check_n"]',tForm).val(),
                    "amount" 		: $(' [name="amount"]',tForm).val(),
                    "status" 		: $(' [name="status"]',tForm).val()
                },
                function(data){
                    if(isInt(data)){
                        $( "#editCheques" ).dialog('close');
                        var chequeTr = $("#chequeid_"+$('[name="id"]',tForm).val());
                        $('.td_date',chequeTr).html($('[name="date"]',tForm).val());
                        $('.td_check_n',chequeTr).html($('[name="check_n"]',tForm).val());
                        $('.td_amount',chequeTr).html($('[name="amount"]',tForm).val());
                        //$('.td_status_id',chequeTr).val();
                        var statusTD ="";
                        if($('select[name="status"]',tForm).val() != ""){
                            statusTD = $('.statusDrpDwn option[value="'+$('select[name="status"]',tForm).val()+'"]').html()+
                            '<input type="hidden" class="td_status_id" value="'+$('select[name="status"]',tForm).val()+'" />';
                        }else{
                            statusTD = '<input type="hidden" class="td_status_id" value="" />';
                        }
                        $('.td_status',chequeTr).html(statusTD);

                        clearForm(tForm);
                        showmsg("Los cheques han sido actualizados",'t');
                        $( "#editCheques" ).dialog('close');


                    }else{
                        showmsg("Hubo un error al actualizar los cheques, por favor intente nuevamente.",'f');
                    }
                });
            }


        });

        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
        $( ".datepicker" ).datepicker({
            changeMonth: true,
            changeYear: true,
            "dateFormat": 'dd/mm/yy'

        });
    });
