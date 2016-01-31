$(function() {
    var caveForm	=	$('#caveForm');
    $('.caveIdBtn').click(function(){
        if($('[name="cave_id"]',caveForm).val()	==	''){
            showmsg("Por favor seleccione un colega.","t");			
        }else{
            caveForm.submit();
        }		
    });
    
    $( ".datepicker" ).datepicker({ 
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy' 
			
    });	
    
    if($('[name="cave_selected_id"]',caveForm).val()!=''){
        $('[name="cave_id"] option[value="'+$('[name="cave_selected_id"]',caveForm).val()+'"]',caveForm).attr({
            'selected':'selected'
        });
        $('.caveNameSpan').text($('[name="cave_id"] option[value="'+$('[name="cave_selected_id"]',caveForm).val()+'"]',caveForm).text());
    } 
	
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 50,
        'aoColumns': [{
            'sType': 'num-html'
        }, {
            "sType": 'us_date'
        }, {
            'sType':'currency'
        }, {
            'sType':'currency'
        }, null],
        "aaSorting": [[ 1, "desc" ]]
        
    });
    
    vgTable = $('#chequesGrid').dataTable({
        "bJQueryUI": true,
        //"sScrollX": "100%",
        "bInfo": false,
        "bPaginate"	: false,	
        "bScrollCollapse"	: true,
        //"bStateSave"		: true,
        "bAutoWidth"		: true,
        'aoColumns': [ {"sSortDataType": "dom-checkbox"}, {'sType': 'num-html'}, null, {"sType": 'us_date'}, {'sType':'num-html'}, null, {'sType':'currency'}, {'sType':'currency'}],
        "aaSorting": [[ 3, "asc" ]]
    });
    
    var edBtn = "<span style='float:left;'><span class='btn30 gridBtn' limit='30'>Mostrar 30 dias</span>";
    edBtn += "<span class='btn40 gridBtn' limit='40'>Mostrar 40 dias</span>";
    //edBtn += "<span class='btnInp gridBtn'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/></span>";
    edBtn += "<span class='' style='margin-left:10px; font:12px geneva, sans-serif; text-transform:uppercase'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/><span class='btnInp gridBtn'>dias </span></span>";
    
    $('#chequesGrid_wrapper .fg-toolbar').append(edBtn);
    opTable = $('#operationGrid').dataTable({
        "bJQueryUI"		: true,
        "sScrollX"		: "100%",
        "bFilter"		: false,
        "bInfo"			: false,
        "bPaginate"		: false,
        "bScrollCollapse"	: true,
        //"bStateSave"		: true,
        "bAutoWidth"		: true,
        'aoColumns': [ null,{"sType": 'us_date'}, null, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'},null,{'sType': 'currency'}],
        "aaSorting": [[ 1, "asc" ]]
    });
	
	
    vcTable = $('#viewChequesGrid').dataTable({
        "bJQueryUI": true,
        "sScrollXInner": "100%",
        "bFilter": false,
        "bInfo": false,
        "bSort" : true,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        'aoColumns': [ {
            "sType": 'us_date'
        }, null, null,null , null, null, null, null,null]
		
    });
    vgliTable = $('#chequesGridByLiquidacionesId').dataTable({
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        "sScrollXInner": "100%",
    });
    ogliTable = $('#operationGridByLiquidacionesId').dataTable({
		
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        "sScrollXInner": "100%",
    });
	
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
        var result = confirm('Esta seguro que desea eliminar este registro?');
		
        if(result){
            var anSelected = fnGetSelected( oTable );
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/chequedeleteajax";
            $.post(url, { 
                "id"   : selIdArr[1]
            },				
            function(data){
                if(isInt(data)){							  
                    showmsg("Registro eliminado",'t');
                    oTable.fnDeleteRow( anSelected[0] );							  
                }else{							 
                    showmsg("Hubo un error al eliminar el registro, por favor intente nuevamente.",'f');
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

	
    /*tabs*/
    //$( "#tabs" ).tabs({ selected: 0 });
    
    
		
    $( ".chequeList" ).dialog({
        autoOpen	: false,
        modal		: true,
        height		: window.screen.height - 200,
        //width		: window.screen.width - 200,
        width		: 900,
        autoResize	: true,
			
        buttons: {
            "Listo": function() {		
                vgTable.fnFilter('');
                $( this ).dialog( "close" );
                vcTable.fnClearTable();
                
                var payingAmount,selAmount,date_diff_tot;
                payingAmount=date_diff_tot=0;
                var chequeFlag          =   false;
                var date = '';
                var cqktr, cqktr_id, location_capital, chequeTodayDetails, trmade;			
                var oSettings = vcTable.fnSettings();
                
                $('.chequeChk:checked').each(function()
                {						
                    cqktr = $(this).parents('tr:eq(0)');
                    cqktr_id = $(this).attr('id').split('_');
                    selAmount = amountFormatR($('.user_amount',cqktr).text());						
                    location_capital = parseInt($('[name="location_capital"]',cqktr).val());
                    date = $('.user_date',cqktr).text();
                    chequeTodayDetails = getCheckValue(selAmount, date, location_capital, null, null);
                    date_diff_tot += chequeTodayDetails.days;
                    payingAmount += chequeTodayDetails.todayValue;
                    
                    trmade = $('#viewChequesGrid').dataTable().fnAddData([							                                                									                               		
                        date,
                        $('.user_operation_id',cqktr).text(),
                        amountFormat(selAmount),                        
                        $('.user_check_n',cqktr).text(),
                        $('.user_bank_name',cqktr).text(),
                        //date_diff
                        chequeTodayDetails.days +'<input type="hidden" name="acreditacion_hrs" value="'+chequeTodayDetails.acreditationHrs+'"/>',
                        amountFormat(chequeTodayDetails.impuestoAlCheque + chequeTodayDetails.gastos),
                        amountFormat(chequeTodayDetails.daysDiscountFee),
                        amountFormat(chequeTodayDetails.todayValue),
                    ]);					
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'SelectedCheque_'+cqktr_id[1];
						
                    chequeFlag	= true;		
                });
                
                if(chequeFlag)	{
                    var viewChequesGridTotalTag	= $("#viewChequesGridTotalTag");						
                    var trmade = '<tr><td>IMPORTE EN CHEQUES</td><td><span class="paying_amount_span">'+amountFormat(payingAmount)+'</span></td></tr>';
                    viewChequesGridTotalTag.html(trmade);
                }
					
                /*var TNAD            =	((tasa_anual / 100) * 100) / 360;
                avg_date_diff_tot   =	date_diff_tot / $('.chequeChk:checked').size();
                var TTR             =	TNAD * avg_date_diff_tot;
                var TTRF            =	payingAmount * TTR;
                payingAmount      =	TTRF - payingAmount;*/
                
                var frontFinalView  =	$('.finalPayView');	
                pay_final_amount    =	amountFormatR($('#pay_final_amount').val());
                balance             =	payingAmount	-	pay_final_amount;	
                $('.payCls', frontFinalView).text(amountFormat(pay_final_amount));
                $('.payingCls', frontFinalView).text(amountFormat(payingAmount));
                $('.balanceCls', frontFinalView).text(amountFormat(balance));					
            },
            "Cerrar": function() {				
                $( this ).dialog("close");
            }
        }
    });
		
    var chequeListByLiquidacionesId	=	$( ".chequeListByLiquidacionesId" ).dialog({
        autoOpen	: false,
        modal		: true,
        height		: window.screen.height - 200,
        width		: window.screen.width - 200,
        autoResize	: true,
			
        buttons: {
            "Consolidar": function() {		
				
                $('#PayChecksEditForm').submit();						
					
            },
            "Cerrar": function() {				
                $( this ).dialog( "close" );
            }
        }
    });
    var rawProductTotalShowTable = $('.finalPayViewByLiquidacionesId');	
    $(".chequeListByLiquidacionesId").parent('div').find('.ui-dialog-buttonpane').append(rawProductTotalShowTable);
		
		
		
    var rawProductTotalShowTable = $('.chequesTotalShowTable');	
    $(".chequeList").parent('div').find('.ui-dialog-buttonpane').append(rawProductTotalShowTable);
		
		
		
    $('.sendCheques').click(function(){
        var frontFinalView	=	$('.finalPayView');	
        //$('.payCls',frontFinalView).text();
        currentdate			=	$('.currentDateLiq').val();
        var amount_payed		=	$('.payingCls',frontFinalView).text();
        var current_account_balance	=	$('.balanceCls',frontFinalView).text();			
        var PayChecksForm               =	$('#PayChecksForm');
        var operations_json             =	new Array();
			
        $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
            $('[name="previous_account_balance"]',PayChecksForm).val(parseFloat($('.pay_amount_cls',this).text()));				
        });
        $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
            if($('[name="operation_chk"]',this).is(':checked')){
                var operationid	=	$(this).attr('id').split('_');
                var operation	= 	{
                    'operation_id'	:	operationid[1]
                }
                operations_json.push(operation);
            }
        });
        $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
			
        var rejected_cheques_json	=	new Array();
        $('#operationGrid tbody tr[id^="RejectedCheque_"]').each(function(){
            if($('[name="rejected_chk"]',this).is(':checked')){
                var rejected_cheque_id	=	$(this).attr('id').split('_');
                var rejected_cheque	= 	{
                    'rejected_cheque_id'	:	rejected_cheque_id[1]
                }
                rejected_cheques_json.push(rejected_cheque);
            }
        });
        $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
			
        $('[name="date"]',PayChecksForm).val(currentdate);
        //alert(current_account_balance);
        //alert(amount_payed);
        $('[name="current_account_balance"]',PayChecksForm).val(amountFormatR(current_account_balance));
        $('[name="amount_payed"]',PayChecksForm).val(amountFormatR(amount_payed));
        var cheques_json	=	new Array();
        var cqktr_id,acreditacion_hrs;
        $('#viewChequesGrid  tr[id^="SelectedCheque_"]').each(function(){
            var cqktr = $(this);
            cqktr_id = cqktr.attr('id').split('_');
            acreditacion_hrs = $('[name="acreditacion_hrs"]',cqktr).val();
            var cheque = {
                'cheque_id': cqktr_id[1],
                'acreditacion_hrs': acreditacion_hrs,
            }
            cheques_json.push(cheque);		
        });
			
        $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));
        //return false;
        PayChecksForm.submit();
			
    });
		
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    //currentDate	=	day + "/" + month + "/" + year;
    currentdate	=	$('#ServerCurrentDate').val();
    $('.currentDate').text(currentdate);
    $('.currentDateLiq').val(currentdate);
    $('.currentDateLiq').change(function(){
        currentdate	=	$(this).val();
    });
    var _currentDate = currentdate; //globalVar
	
    $('#operationGrid tbody tr[id^="operationsid_"]').click(function(){
        if($('[name="operation_chk"]',this).is(':checked')){
            $('[name="operation_chk"]',this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $('[name="operation_chk"]',this).attr('checked','checked');
            finalBalanceWithChk();
        }			
    });
    $('#operationGrid tbody tr[id^="operationsid_"] [name="operation_chk"]').change(function(event){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChk();
        }
    });
    $('#operationGridADDst tbody tr[id^="Acreditacion"] [name="acreditacion"]').keyup(function(){
        $('#PayChecksForm [name="acreditacion"]').val($(this).val());
        finalBalanceWithChk();			
    });
    $('#operationGrid tbody tr[id^="RejectedCheque_"]').click(function(){
        if($('[name="rejected_chk"]',this).is(':checked')){
            $('[name="rejected_chk"]',this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $('[name="rejected_chk"]',this).attr('checked','checked');
            finalBalanceWithChk();
        }			
    });
    $('#operationGrid tbody tr[id^="RejectedCheque_"] [name="rejected_chk"]').change(function(event){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChk();
        }
    });
		

    $('#operationGridByLiquidacionesId tbody tr[id^="editoperationlistid_"]').live('click',function(){
        if($('[name="editOperation"]',this).is(':checked')){
            $('[name="editOperation"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editOperation"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="editoperationlistid_"] [name="editOperation"]').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="editrejectedchequelistid_"]').live('click',function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            $('[name="editRejectedCheque"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editRejectedCheque"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="editrejectedchequelistid_"] [name="editRejectedCheque"]').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }
    });

    $('#chequesGridByLiquidacionesId tbody tr[id^="editchequelistid_"]').live('click',function(){
        if($('[name="editli"]',this).is(':checked')){
            $('[name="editli"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editli"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#chequesGridByLiquidacionesId tbody tr[id^="editchequelistid_"] [name="editli"]').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }
    });
    
    $('#chequesGrid tbody tr').live('click',function() {
        if ($('.clickedChkbox',this).val() == 'false')
        {
            if($('.chequeChk',this).is(':checked')){
                $('.chequeChk',this).removeAttr('checked');
                changeChkOnAdd($('.chequeChk',this));
            }else{
                $('.chequeChk',this).attr('checked','checked');
                changeChkOnAdd($('.chequeChk',this));
            }
        }
        else
            $('.clickedChkbox',this).val('false');
    });
    
    $('#chequesGrid tbody tr .chequeChk').live('click',function() {        
        if(! $(this).is(':checked'))
            changeChkOnAdd($(this));
        else
            changeChkOnAdd($(this));
        
        $(this).siblings('.clickedChkbox').val('true');
    });
    
    finalBalanceWithChk();
    
    $('.viewBtn').click(function()
    {
        var comitted = parseInt($('[name="comitted"]',this).val());			
        $( ".chequeListByLiquidacionesId" ).dialog('open');
        $(".ui-dialog-buttonpane button:contains('Consolidar')").button("disable");
        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');        
        var current_account_balance = $('.user_current_account_balance',bankTr).text();
        var amount_payed = $('.user_amount_payed',bankTr).text();			
			
        $('.finalPayViewByLiquidacionesId .payingCls').text(amount_payed);
        $('.finalPayViewByLiquidacionesId .balanceCls').text(current_account_balance);			
        var date = $('.user_date',bankTr).text();
        $('.loadOperations').text('Cargando...');
        $('.loadOperations').show();
        
        var url = '/liquidaciones/getliquidacionesdetailsajax';
        $.post(url, { 
            'liquidaciones_id': bankid[1]
        },
        function(data)
        {						
            if(data)
            {				
                var chequeListJson = data['chequesList'];
                var date,payingAmount,selAmount,trmade,item,oSettings,nTr,location_capital,chequeTodayDetails,date_diff_tot,liqDate,liqData;
                payingAmount=selAmount=date_diff_tot=payingAmount=0;
                
                vgliTable.fnClearTable();
                vgliTable.fnSetColumnVis( 0, true ); 
                oSettings = vgliTable.fnSettings();
                
                var liquidacion	= data['liquidacion'];
                var liquidacion_date =	liquidacion['date'];
                var liquidacion_id = liquidacion['id'];
                liqData = {
                    'impuestoAlCheque': liquidacion['impuesto_al_cheque'],
                    'tasaAnual': liquidacion['tasa_anual'],
                    'acCapital': liquidacion['acreditacion_capital'],
                    'acInterior': liquidacion['acreditacion_interior'],
                    'gastosGeneral': liquidacion['gastos_general'],
                    'gastosInterior': liquidacion['gastos_interior']
                };
                
                for(var x in chequeListJson)
                {
                    item = chequeListJson[x];
                    selAmount = amountFormatR(item['amount']);
                    date = item['date'];
                    location_capital = item['local'];
                    liqDate = item['liquidacion_date'];
                    
                    chequeTodayDetails = getCheckValue(selAmount, date, location_capital, liqDate, liqData);
                    date_diff_tot += chequeTodayDetails.days;
                    payingAmount += chequeTodayDetails.todayValue;
                    
                    trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( [
                        chk('editli',true),						                                                
                        item['first_name']+' '+item['last_name'],
                        date,
                        amountFormat(selAmount),
                        item['check_n'],
                        item['bank_name'],
                        chequeTodayDetails.days +'<input type="hidden" name="acreditacion_hrs" value="'+chequeTodayDetails.acreditationHrs+'" />',
                        amountFormat(chequeTodayDetails.impuestoAlCheque + chequeTodayDetails.gastos),
                        amountFormat(chequeTodayDetails.daysDiscountFee),
                        '<span class="chk_final_amount">'+amountFormat(chequeTodayDetails.todayValue)+'</span>',
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editchequelistid_'+item['id'];
                }
                
                trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','-',] );
                //trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','Acreditacion','<span class="acreditacion_show"></span>',] );
                //trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','Balance Previo','<span class="balance_show">'+amountFormat(payingAmount)+'</span>',] );
                trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','IMPORTE EN CHEQUES','<span class="paying_amount_span_edit">'+amountFormat(payingAmount)+'</span>',] );
                nTr = oSettings.aoData[ trmade[0] ].nTr;
                $("td:eq(8)",nTr).addClass('greyBg');
                $("td:eq(9)",nTr).addClass('greyBg');
                //trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','-',] );
                
                var opertationsListJson	=	data['opertationsList'];
                ogliTable.fnClearTable();
                ogliTable.fnSetColumnVis( 0, true );
                var amount,amountCave,commision,finalAmount,acreditacion,totalFinalAmount,previous_account_balance;
                amount=amountCave=commision=finalAmount=acreditacion=totalFinalAmount = 0;
                oSettings = ogliTable.fnSettings();
					
                $('#PayChecksEditForm [name="date"]').val(liquidacion_date);
                $('#PayChecksEditForm [name="id"]').val(liquidacion_id);
                $('#PayChecksEditForm [name="impuesto_al_cheque"]').val(liquidacion['impuesto_al_cheque']);
                $('#PayChecksEditForm [name="tasa_anual"]').val(liquidacion['tasa_anual']);
                $('#PayChecksEditForm [name="acreditacion_capital"]').val(liquidacion['acreditacion_capital']);
                $('#PayChecksEditForm [name="acreditacion_interior"]').val(liquidacion['acreditacion_interior']);
                $('#PayChecksEditForm [name="gastos_general"]').val(liquidacion['gastos_general']);                
                $('#PayChecksEditForm [name="gastos_interior"]').val(liquidacion['gastos_interior']);
                
                if(liquidacion){
                    previous_account_balance = amountFormatR(liquidacion['previous_account_balance']);	
                    acreditacion = amountFormatR(liquidacion['acreditacion']);
                    if(previous_account_balance){
                        totalFinalAmount += previous_account_balance;
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            'Balance',
                            '<span class="pay_amount_cls">'+amountFormat(previous_account_balance)+'</span>',
                            ] );
							 
                        nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'PreviousBalance';
							
                    }
                    if(acreditacion){
                        totalFinalAmount	+=	acreditacion;
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            'Acreditacion',
                            '<span class="pay_amount_cls">'+amountFormat(acreditacion)+'</span>',
                            ] );
							
							 
                        nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'Acreditacion';
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '-', ]);
                        $('#chequesGridByLiquidacionesId .acreditacion_show').text(amountFormat(acreditacion));
						
                    }
                    $('#chequesGridByLiquidacionesId .balance_show').text(amountFormat(previous_account_balance));
                }		 
		//operations	 
                for(var x in opertationsListJson){
                    var item	=	opertationsListJson[x];
                    amount	=	parseFloat(item['amount']);
                    amountCave	=	amount/2;
                    commision	=	amountCave*15/100;
                    finalAmount	=	amountCave-commision;
                    totalFinalAmount	+=	finalAmount;	
                    var trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [
                        chk('editOperation',true),                  							
                        item['first_name']+' '+item['last_name'],
                        amountFormat(amount),
                        amountFormat(amountCave),
                        '-'+amountFormat(commision),
                        '',
                        '',
                        '',
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editoperationlistid_'+item['operationid'];
                    $("td:eq(8)",nTr).addClass('operation_amount');
                }
                var trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','<strong>RECHAZOS</strong>','','','','','','','-',] );
					 
                var rejectedChequesJson	= data['rejectedCheques'];
                var rejected_cheques_fee = 0;
                for(var x in rejectedChequesJson)
                {
                    item                =	rejectedChequesJson[x];
                    amount              =	amountFormatR(item['amount']);
                    rejected_cheques_fee = amountFormatR(item['rejected_cost_prov']);
                    finalAmount         =	amount+rejected_cheques_fee;
                    totalFinalAmount	+=	finalAmount;	
                    trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	
                        chk('editRejectedCheque',true),
                        item['first_name']+' '+item['last_name'],
                        '',
                        '',
                        '',
                        amountFormat(amount),
                        amountFormat(rejected_cheques_fee),
                        '',
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editrejectedchequelistid_'+item['id'];
                    $(nTr).attr({
                        'style':'background:#E3E3E3;'
                    });
                    $("td:eq(8)",nTr).addClass('rejected_cheque_amount');
                }
                trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','-',] );
                trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','IMPORTE A LIQUIDAR',
                    '<span class="pay_final_amount_span_edit">'+amountFormat(totalFinalAmount)+'</span>',] );
                nTr = oSettings.aoData[ trmade[0] ].nTr;
                $("td:eq(7)",nTr).addClass('greyBg');
                $("td:eq(8)",nTr).addClass('greyBg');
                //trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','-',] );
					 
                $('.finalPayViewByLiquidacionesId .payCls').text(amountFormat(totalFinalAmount));
                $('.loadOperations').hide();
                finalBalanceWithChkOnEdit();
					
                if(comitted){
                    vgliTable.fnSetColumnVis( 0, false );
                    ogliTable.fnSetColumnVis( 0, false );					
                    $(".ui-dialog-buttonpane button:contains('Consolidar')").button("disable");				
                }else{
                    vgliTable.fnSetColumnVis( 0, true );
                    ogliTable.fnSetColumnVis( 0, true );
                    $(".ui-dialog-buttonpane button:contains('Consolidar')").button("enable");
                }
					
            //vgliTable.fnAdjustColumnSizing();
            //ogliTable.fnAdjustColumnSizing();
            }else{
                $('.loadOperations').text('Error al cargar liquidación, por favor intente nuevamente.');
            }
        },'json');
    });
    
    $('.cancelBtn').click(function(){
        var r=confirm("Esta seguro que desea eliminar la liquidacion?");
        if (r==true)
        {
            var bankTr = $(this).parents('tr:eq(0)');
            var row = $(this).closest("tr").get(0);
            var bankid = bankTr.attr('id').split('_');
            var url = '/liquidaciones/deleteliquidaciones';
            url	+=	'/liquidaciones_id/'+	bankid[1];
            url	+=	'/cave_id/'+	$('[name="cave_id"]',caveForm).val();
            window.location	=	url;
        }
        else
        {
			 
        }		
    });
    
    $('.pdfBtn').live('click',function(){
        var url = '/liquidaciones/generatepdfforliquidaciones';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
		
        url += "/liquidacion_id/"+clientid+'/status/0';
        window.open(url,'_blank');
    });
    
    $('.excelBtn').live('click',function(){
        var url = '/liquidaciones/generateexcelforliquidaciones';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
		
        url += "/liquidacion_id/"+clientid+'/status/0';
        window.open(url,'_blank');
    });
    
    $('.excelMailBtn').live('click',function(){
        var url = '/liquidaciones/sendmailofliquidacionesexcel';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
        showmsg("Enviando correo...",'f',true);
        //url += "/liquidacion_id/"+clientid+'/status/0';
        //window.open(url,'_blank');
        $.post(url, { 
            "liquidacion_id"   : clientid,
            "status"		   : 0, 
        },				
        function(data){
            if(data)			  
                showmsg("Correo enviado",'t');					  							  
            else							 
                showmsg("Hubo un error al enviar el correo.",'f');            
        });			
    });
    
    $('.btn40,.btn30,.chooseChequesBtn').click(function()
    {
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
			
        var thisBtn	=	$(this);
        if(thisBtn.hasClass('chooseChequesBtn')){
            vgTable.fnClearTable(); 
            $( ".chequeList" ).dialog('open');
            pay_final_amount	=	$('#pay_final_amount').val();
            payCls			=	$('.payCls');
            payCls.text(amountFormat(pay_final_amount));				
        }
        
        var url = '/liquidaciones/getchequesbycaveidfilterajax';
        $.post(url, { 
            "cave_id"  : $('[name="cave_selected_id"]').val(),
            "pos"	   : $(this).attr('limit'),
            "liqDate": $('.currentDateLiq').val()
        },			
        function(data){
            createchequegrid(data);	
            changeChkOnOpen();
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        },'json')
        .error(function() { 
            vgTable.fnClearTable(); 
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        });			
    });
    
    $('.btnInp').click(function(){
        var url = '/liquidaciones/getchequesbycaveidfilterajax';
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
        $.post(url, { 
            "cave_id"  : $('[name="cave_selected_id"]').val(),
            "pos"	   : $(this).next('[name="get_chk_inp"]').val(), 
            "liqDate": $('.currentDateLiq').val()
        },			
        function(data){
            createchequegrid(data);				  
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        },'json')
        .error(function() { 
            vgTable.fnClearTable(); 
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        });
			
    });
    getholidays();		
});

function chk(name,checked){
    if(checked){
        checked	=	'checked="checked"';
    }else{
        checked	=	'';
    }
    var chkbox	=	'<input type="checkbox" name="'+name+'" '+checked+'/>'
    return chkbox; 
}

function finalBalanceWithChk(){ 
    var operations_json	=	new Array();
    var final_amount	=	0;
    var PayChecksForm	=	$('#PayChecksForm');
	
    $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
        final_amount	+=	parseFloat(amountFormatR($('.pay_amount_cls',this).text()));				
    });
    $('#operationGridADDst tbody tr[id^="Acreditacion"]').each(function(){
        if(parseFloat($('.pay_amount_cls',this).val())){
            final_amount	+=	parseFloat(amountFormatR($('.pay_amount_cls',this).val()));
        }
    });
    $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
        if($('[name="operation_chk"]',this).is(':checked')){
            var operationid	=	$(this).attr('id').split('_');
            final_amount	+=	parseFloat(amountFormatR($('.pay_amount_cls',this).text()));
            var operation	= 	{
                'operation_id'	:	operationid[1]
            }
            operations_json.push(operation);
        }
    });
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
	
    var rejected_cheques_json	=	new Array();
    $('#operationGrid tbody tr[id^="RejectedCheque_"]').each(function(){
        if($('[name="rejected_chk"]',this).is(':checked')){
            var rejected_cheque_id	=	$(this).attr('id').split('_');
            final_amount	+=	parseFloat(amountFormatR($('.pay_amount_cls',this).text()));
            var rejected_cheque	= 	{
                'rejected_cheque_id'	:	rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
    $('.pay_final_amount_span').text(amountFormat(final_amount));
    $('#pay_final_amount').val(amountFormat(final_amount));
    //final_amount	=	parseFloat($('#pay_final_amount').val());
	
    var frontFinalView	=	$('.finalPayView');	
    pay_final_amount	=	parseFloat(amountFormatR($('#pay_final_amount').val()));
    payingAmount		=	parseFloat(amountFormatR($('.paying_amount_span').text()))?parseFloat(amountFormatR($('.paying_amount_span').text())):0;
    balance				=	payingAmount	-	final_amount;	
    $('.payCls',frontFinalView).text(amountFormat(pay_final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(payingAmount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
}

function finalBalanceWithChkOnEdit(){ 
    var operations_json	=	new Array();
    var final_amount	=	0;
    var PayChecksForm	=	$('#PayChecksEditForm');
    var PreviousBalance	=	0;
    var acreditacion	=	0;
	
    $('#operationGridByLiquidacionesId tbody tr[id^="PreviousBalance"]').each(function(){
        PreviousBalance	= amountFormatR($('.pay_amount_cls',this).text());
        final_amount +=	PreviousBalance;			
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="Acreditacion"]').each(function(){
        if(parseFloat($('.pay_amount_cls',this).text())){
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            acreditacion = amountFormatR($('.pay_amount_cls',this).text());
        }
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="editoperationlistid_"]').each(function(){
        if($('[name="editOperation"]',this).is(':checked')){
            var operationid = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var operation = {
                'operation_id'	:	operationid[1]
            };
            operations_json.push(operation);
        }
    });
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
	
    var rejected_cheques_json =	new Array();
    $('#operationGridByLiquidacionesId tbody tr[id^="editrejectedchequelistid_"]').each(function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            var rejected_cheque_id = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var rejected_cheque	= {
                'rejected_cheque_id'	:	rejected_cheque_id[1]
            };
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
	
    var cheques_json	=	new Array();
    var chk_amount	=	0;
    $('#chequesGridByLiquidacionesId [name="editli"]').each(function(){
        if($(this).is(':checked')){
            var cqktr = $(this).parents('tr:eq(0)');
            chk_amount	+=	amountFormatR($('.chk_final_amount',cqktr).text());
            cqktr	=	cqktr.attr('id').split('_');
            var cheque	= {
                'cheque_id'	:	cqktr[1]
            };
        }
        cheques_json.push(cheque);		
    });
	
    $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));
	
    var frontFinalView = $('.finalPayViewByLiquidacionesId');	
    pay_final_amount = amountFormatR($('[name="amount_payed"]',PayChecksForm).val());
    payingAmount = amountFormatR($('.paying_amount_span_edit').text())?amountFormatR($('.paying_amount_span_edit').text()):0;
    balance = chk_amount - final_amount;	
	
    $('#operationGridByLiquidacionesId .pay_final_amount_span_edit').text(amountFormat(final_amount));
    $('.paying_amount_span_edit').text(amountFormat(chk_amount));
	
    $('.payCls',frontFinalView).text(amountFormat(final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(chk_amount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
	
    $('[name="current_account_balance"]',PayChecksForm).val(amountFormatR(balance));
    $('[name="amount_payed"]',PayChecksForm).val(amountFormatR(chk_amount));    
    $('[name="previous_account_balance"]',PayChecksForm).val(amountFormatR(PreviousBalance));
    $('[name="acreditacion"]',PayChecksForm).val(amountFormatR(acreditacion));		
}

function changeChkOnAdd(c_this){
    if(!c_this){
        return false;
    }
    var qtyCls          = $('.chequesTotalShowTable .qtyCls');
    var payCls		= $('.chequesTotalShowTable .payCls');
    var payingCls	= $('.chequesTotalShowTable .payingCls');
    var balanceCls	= $('.chequesTotalShowTable .balanceCls');
    var balanceAmount	= 0;
    var selAmount       = amountFormatR(payingCls.text());
    var cqktr           = c_this.parents('tr:eq(0)');
    var qty = parseInt(qtyCls.text());
	
    if(c_this.is(':checked')){
        selAmount += amountFormatR($('.user_amount_today',cqktr).text());
        balanceAmount =	selAmount - amountFormatR(payCls.text());
        qty++;
    }else{
        selAmount -= amountFormatR($('.user_amount_today',cqktr).text());
        balanceAmount =	selAmount + amountFormatR(payCls.text());
        qty--;
    }	
    payingCls.text(amountFormat(selAmount));
    balanceCls.text(amountFormat(balanceAmount));
    qtyCls.text(qty.toString());
}

function changeChkOnOpen(){
    var qtyCls		= $('.chequesTotalShowTable .qtyCls');
    var payCls		= $('.chequesTotalShowTable .payCls');
    var payingCls	= $('.chequesTotalShowTable .payingCls');
    var balanceCls	= $('.chequesTotalShowTable .balanceCls');
    var balanceAmount	= 0;
    var selAmount	= 0.00;
    var qty             = 0;
	
    $('.chequeChk:checked').each(function(){
        var cqktr = $(this).parents('tr:eq(0)');
        selAmount += amountFormatR($('.user_amount_today',cqktr).text());
        qty++;
    });	
    
    balanceAmount = selAmount - amountFormatR(payCls.text());
    payingCls.text(amountFormat(selAmount));
    balanceCls.text(amountFormat(balanceAmount));
    qtyCls.text(qty.toString());
}

function createchequegrid(data){
    var zip_code,location_capital,jsonData,cheque_id	,operation_id,date,check_n,amount,cheque_status,first_name,last_name,cheque_state_id,status_list,bank_name,chequeTodayDetails;
    var trmade;
    var dataArr = new Array();
    
    for(var x in data)
    {
        jsonData		=	data[x];
        cheque_id		=	jsonData['cheque_id'];
        operation_id		=	jsonData['operation_id'];
        date			=	jsonData['date'];
        check_n			=	jsonData['check_n'];
        amount			=	jsonData['amount'];
        cheque_status		=	jsonData['cheque_status'];
        first_name		=	jsonData['first_name'];
        last_name		=	jsonData['last_name'];
        cheque_state_id         =	jsonData['cheque_state_id'];
        status_list		=	jsonData['status_list'];
        bank_name		=	jsonData['bank_name'];
        zip_code		=	jsonData['zip_code'];
        location_capital	=	jsonData['location_capital'];
        
        chequeTodayDetails = getCheckValue(amount, date, location_capital, null, null);
        dataArr.push([							                                                
            '<input type="checkbox" class="chequeChk" id="userid_'+cheque_id+'" /><input type="hidden" class="clickedChkbox" value="false" />',
            cheque_id,
            '<span class="user_operation_id">'+first_name+' '+last_name 
            +'<input type="hidden" value="'+operation_id+'" name="operation_id"/>'
            +'<input type="hidden" value="'+zip_code+'" name="zip_code"/>'
            +'<input type="hidden" value="'+location_capital+'" name="location_capital"/></span>',
            '<span class="user_date">'+date+'</span>',
            '<span class="user_check_n">'+check_n+'</span>',
            '<span class="user_bank_name">'+bank_name+'</span>',
            '<span class="user_amount">'+amountFormat(amount)+'</span>',
            '<span class="user_amount_today">'+amountFormat(chequeTodayDetails.todayValue)+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/></span>',
            //'<span class="user_status">'+status_list+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/>'+'</span>',
        ]);		 
    }
    
    vgTable.fnClearTable();
    trmade = $('#chequesGrid').dataTable().fnAddData(dataArr);
    dataArr = null;
    data = null;
    $('#viewChequesGrid [id^="SelectedCheque_"]').each(function(){
        var vcgId	=	$(this).attr('id').split('_');
        $('#chequesGrid  .chequeChk[id="userid_'+vcgId[1]+'"]').attr({
            'checked':'checked'
        });
    });
}

function getCheckValue(chequeAmt, chequeDate, chequeLocation, liqDate, liqData)
{
    /*
     * La formula para calcular el valor al dia es la siguiente:
     * valor al dia = importe - impuesto_al_cheque (% de importe) - descuento (importe * tasa_anual/360 (0.17%) * cantidad de dias) - gastos 
     * 
     * PRE: when liqData is null, the values of the provider are taken as they are today. Otherwise, the liqData need to be specified with the provider values at the liquidacion date.
     */
    var date_arc,acreditacion_hr,gastos,gralDiscounts,descuento,todayValue,gastosFee,impuestoAlCheque,tasa_anual,tasaDiaria,date_diff,impuesto_al_cheque;
    tasaDiaria = 0;
    date_diff = currentDate = '';
    if (liqDate == null)
        liqDate = currentdate; //global var with server current date;
    if (liqData == null) {
        liqData = {
            'impuestoAlCheque': parseFloat($('.impuesto_al_cheque').val()),
            'tasaAnual': parseFloat($('.tasa_anual').val()),
            'acCapital': parseInt($('.acreditacion_capital').val()),
            'acInterior': parseInt($('.acreditacion_interior').val()),
            'gastosGeneral': parseFloat($('.gastos_general').val()),
            'gastosInterior': parseFloat($('.gastos_interior').val()),
        };
    }

    if(chequeLocation == 1) { //cheque is from capital
        acreditacion_hr = liqData.acCapital;
        gastosFee = liqData.gastosGeneral;        
    }
    else if(chequeLocation == 2) { //cheque is from interior
        acreditacion_hr = liqData.acInterior;
        if(liqData.gastosInterior)                
            gastosFee = liqData.gastosInterior;
        else
            gastosFee = liqData.gastosGeneral;
    }        
    
    date_arc = add_days_by_hr(chequeDate, acreditacion_hr);    
    tasaDiaria = liqData.tasaAnual / 360; 
    
    date_diff = days_between(liqDate, date_arc);
    impuestoAlCheque = chequeAmt * liqData.impuestoAlCheque / 100;
    gastos = chequeAmt * gastosFee / 100;
    //gralDiscounts = (chequeAmt * (impuesto_al_cheque + gastos)) / 100; //impuesto al cheuqe and gastos are percentages.
    descuento = (chequeAmt * tasaDiaria / 100) * parseInt(date_diff);
    todayValue = chequeAmt - impuestoAlCheque - descuento - gastos;

    var chequeDetails = {							                                                									                               		
        days: date_diff,
        todayValue: todayValue,
        impuestoAlCheque: impuestoAlCheque,
        gastos: gastos,
        daysDiscountFee: descuento,
        acreditationHrs: acreditacion_hr
    };
    return chequeDetails;        
}

function days_between(dateOne, dateTwo) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var dateOneArr,dateTwoArr;
    
    dateOneArr = dateOne.split('/');
    dateOneArr[1] = dateOneArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);    
    
    dateTwoArr = dateTwo.split('/');
    dateTwoArr[1] = dateTwoArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
    dateTwo = new Date(dateTwoArr[2], dateTwoArr[1], dateTwoArr[0]);
    
    // Convert both dates to milliseconds
    var date1_ms = dateOne.getTime();
    var date2_ms = dateTwo.getTime();

    // Calculate the difference in milliseconds
    if(date1_ms	> date2_ms){
        i	=	-1;
    }else{
        i	=	1;
    }
    var difference_ms = Math.abs(date1_ms - date2_ms);
    // Convert back to days and return
    return Math.floor(difference_ms/ONE_DAY)*i;
}

function add_days(dateOne, days) {
    // The number of milliseconds in one day
    var dateOneArr	=  dateOne.split('/');
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateOne.setDate(dateOne.getDate()+days);
    var month	=	parseInt(dateOne.getMonth())+1;
    return dateOne.getDate()+'/'+month+'/'+dateOne.getFullYear();
}

function getholidays(){
    var url = '/index/getholidays';
    holidays_arr	= new Array();
    $.post(url,			
        function(data){
            holidays	=	data;
            for(var x in holidays){
                holiday	=	holidays[x];
                holidays_arr.push(holiday.holiday_date);				
            }
        },'json');	
}

function add_days_by_hr(checkDate, acHours) {
    var acDays,dateTemp,dateTempArr,day,cYear,cMonth,cDate,cFullDate,acreditationDate;
    
    acDays = Math.round(acHours/24);
    dateTempArr = checkDate.split('/');
    dateTempArr[1] = dateTempArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
    dateTemp = new Date(dateTempArr[2], dateTempArr[1], dateTempArr[0]);
    
    //if check date falls in a holiday or saturday or sunday add an extra acreditation day for next available day 
    if(isHoliday(dateTemp)) 	
       acDays++;
   
    for (var i=0; i < acDays; i++) {		
        //get next date
        dateTemp = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate()+1);
        if(isHoliday(dateTemp)) //the date is a holiday or saturday or sunday	
            acDays++;	   
    }
    cMonth = dateTemp.getMonth()+1; //month is 0 based
    cMonth = cMonth > 9 ? cMonth : '0'+cMonth;	
    cDate = dateTemp.getDate() > 9 ? dateTemp.getDate() : '0'+dateTemp.getDate();
        
    acreditationDate = cDate+'/'+cMonth+'/'+dateTemp.getFullYear();
    return acreditationDate;
}
//PRE: requires a global var array "holidays_arr" with all the holidays.
function isHoliday(dateTemp)
{
    var day,cYear,cMonth,cDate,cFullDate;
    var isHoliday = false;
    
    day = dateTemp.getDay();
    cYear = dateTemp.getFullYear();
    cMonth = dateTemp.getMonth()+1; //month is 0 based
    cMonth = cMonth>9?cMonth:'0'+cMonth;	
    cDate = dateTemp.getDate()>9?dateTemp.getDate():'0'+dateTemp.getDate();
    cFullDate = cDate+'/'+cMonth+'/'+cYear;
    
    if(($.inArray(cFullDate, holidays_arr) > -1) || day == 6 || day == 0) //the date is a holiday or saturday or sunday	
        isHoliday = true;        

    return isHoliday;
}

function hours_between(dateOne, dateTwo) {
	
    var weekendDays = parseInt(days_between(dateOne, dateTwo) );
	
    // The number of milliseconds in one day
    //var ONE_DAY = 1000 * 60 * 60 ;
    var dateOneArr	=  dateOne.split('/');
    var dateTwoArr	=  dateTwo.split('/');
    
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateTwo = new Date(dateTwoArr[2], dateTwoArr[1], dateTwoArr[0]);

    var start = dateOne,
    finish = dateTwo,
    dayMilliseconds = 1000 * 60 * 60 * 24;
	
	
	
    while (start <= finish) {
        var day = start.getDay();
        if (day == 0 || day == 6) {
            weekendDays--;
        }
        start = new Date(+start + dayMilliseconds);
    }
    if(weekendDays){
        weekendDays	+=	1;
        weekendDays	=	weekendDays*24;
    }else{
		
    }
    return weekendDays;

}
