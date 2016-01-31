$(function() {
    var caveForm	=	$('#caveForm');
    $('.caveIdBtn').click(function(){
        if($('[name="cave_id"]',caveForm).val()	==	''){
            showmsg("Please select the cave!","t");			
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
	
    /*oTable = $('#grid').dataTable({
        "bJQueryUI"			: true,
        "sPaginationType"	: "full_numbers",
        "sScrollX"			: "100%",
        "bScrollCollapse"	: true,
        "iDisplayLength"	: 50,
        "aaSorting"			: [[ 1, "desc" ]]
    });*/
    
    /*jQuery.fn.dataTableExt.oSort['us_date-asc'] = function (a, b) {
        a = $('<span></span>').append(a).text();
        b = $('<span></span>').append(b).text();
        if ($.trim(a) != '') {
            var frDatea2 = $.trim(a).split('/');
            var x = (frDatea2[2] + frDatea2[1] + frDatea2[0]) * 1;
        } else {
            var x = 10000000000000; // = l'an 1000 ...
        }
        if ($.trim(b) != '') {
            frDateb = $.trim(b).split('/');
            var y = (frDateb[2] + frDateb[1] + frDateb[0]) * 1;		                
        } else {
            var y = 10000000000000;		                
        }
        var z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return z;
    };
    jQuery.fn.dataTableExt.oSort['us_date-desc'] = function (a, b) {
        a = $('<span></span>').append(a).text();
        b = $('<span></span>').append(b).text();
        if ($.trim(a) != '') {
            var frDatea2 = $.trim(a).split('/');
            var x = (frDatea2[2] + frDatea2[1] + frDatea2[0]) * 1;
        } else {
            var x = 10000000000000; // = l'an 1000 ...
        }
        if ($.trim(b) != '') {
            frDateb = $.trim(b).split('/');
            var y = (frDateb[2] + frDateb[1] + frDateb[0]) * 1;		                
        } else {
            var y = 10000000000000;		                
        }	            
        var z = ((x < y) ? 1 : ((x > y) ? -1 : 0));		            
        return z;
    };*/
    
    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, iColumn )
    {
        var aData = [];
        $( 'td:eq('+iColumn+') input', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
            aData.push( this.checked==true ? "1" : "0" );
        } );
        return aData;
    }
    
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bScrollCollapse": true,
        "iDisplayLength": 50,        
        'aoColumns': [ null, {'sType': 'us_date'}, {'sType': 'currency'},{'sType': 'currency'}, null],
        "aaSorting": [[ 1, "desc" ]]
    });
    
    vgTable = $('#chequesGrid').dataTable({
        "bJQueryUI": true,
        "sScrollX": "100%",
        "bInfo": false,
        "bPaginate"	: false,	
        "bScrollCollapse"	: true,
        "bAutoWidth"		: true,
        'aoColumns': [ {
            "sSortDataType": "dom-checkbox"
        }, null, null, {
            "sType": 'us_date'
        }, null, null, null],
    });
    vgoSettings = vgTable.fnSettings();
	   
    // Show an example parameter from the settings
	

    var edBtn = "<span style='float:left;'><span class='btn30 gridBtn' limit='30'>Mostrar 30</span>";
    edBtn += "<span class='btn40 gridBtn' limit='40'>Mostrar 40</span>";
    edBtn += "<span class='btnInp gridBtn'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/></span>";
    $('#chequesGrid_wrapper .fg-toolbar').append(edBtn);
    opTable = $('#operationGrid').dataTable({
        "bJQueryUI": true,
        "sScrollX": "100%",
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
		
    });
    vcTable = $('#viewChequesGrid').dataTable({
        "bJQueryUI": true,
        "sScrollX": "100%",
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
		
		
    });

    cdliTable = $('#chequesDetailsByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        "bAutoWidth": true,
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        "sScrollXInner": "100%",
        "bLengthChange": false,

    });

    vgliTable = $('#chequesGridByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        "sScrollXInner": "100%",
    });
    ogliTable = $('#operationGridByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        //"bAutoWidth": true,
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
        var result = confirm('Seguro desea eliminar?');
		
        if(result){
            var anSelected = fnGetSelected( oTable );
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/chequedeleteajax";
            $.post(url, { 
                "id"   : selIdArr[1]
            },				
            function(data){
                if(isInt(data)){							  
                    showmsg("El registro a sido eliminado.",'t');
                    oTable.fnDeleteRow( anSelected[0] );							  
                }else{							 
                    showmsg("El usuario no pudo ser borrado. \n Por favor intente nuevamente.",'f');
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
        width		: window.screen.width - 200,
        autoResize	: true,
			
        buttons: {
            "Listo": function() {		
                vgTable.fnFilter('');
                $( this ).dialog( "close" );
                vcTable.fnClearTable();
                var payingAmount	=	0;
                var chequeFlag	=	false;
                var acreditacion_hr,date,date_arc,date_diff='';
                var location_capital,subTotalAM=0,cost_general=0,gastos_general=0,tasa_anual=0,gastos_interior=0,interests=0,dayAvg=0,totalDays=0,payingAmount,flAmout,discount,selAmount,chqPer=0;
                var chequeChkCount	=	$('.chequeChk:checked').size();
                var acreditacion_capital	=	parseInt($('.acreditacion_capital').val());
                var acreditacion_interior	=	parseInt($('.acreditacion_interior').val());
					
                acreditacion_hr	= acreditacion_interior;
                var gastos_interior_tot = 0;
                var cqktr_id;
                var oSettings = vcTable.fnSettings();
					
                var gastos_cheque_menor_a_1		=	amountFormatR($('.gastos_cheque_menor_a_1').val());
                var gastos_cheque_a_1			=	amountFormatR($('.gastos_cheque_a_1').val());
                var gastos_cheque_menor_a_2		=	amountFormatR($('.gastos_cheque_menor_a_2').val());
                var gastos_cheque_a_2			=	amountFormatR($('.gastos_cheque_a_2').val());
                var gastos_other_cost			=	0;
                var gastos_menor_high		=	gastos_cheque_menor_a_2;
                var gastos_menor_low		=	gastos_cheque_menor_a_1;
                var gastos_menor_high_cost	=	gastos_cheque_a_2;
                var gastos_menor_low_cost	=	gastos_cheque_a_1;
                if(gastos_cheque_menor_a_2	> gastos_cheque_menor_a_1){
                    gastos_menor_high		=	gastos_cheque_menor_a_2;
                    gastos_menor_high_cost	=	gastos_cheque_a_2;
                    gastos_menor_low		=	gastos_cheque_menor_a_1;
                    gastos_menor_low_cost	=	gastos_cheque_a_1;
                }else{
                    gastos_menor_high		=	gastos_cheque_menor_a_1;
                    gastos_menor_high_cost	=	gastos_cheque_a_1;
                    gastos_menor_low		=	gastos_cheque_menor_a_2;
                    gastos_menor_low_cost	=	gastos_cheque_a_2;
                }
					
					
                $('.chequeChk:checked').each(function(){
                    var cqktr = $(this).parents('tr:eq(0)');
                    cqktr_id	=	$(this).attr('id').split('_');
                    selAmount	=	amountFormatR($('.user_amount',cqktr).text());
                    chqPer		=	selAmount*2.1/100;
                    discount	=	0;
						
                    if(gastos_menor_high < selAmount){
                        gastos_other_cost	+=	gastos_menor_high_cost;
                    }
                    if(gastos_menor_low < selAmount && gastos_menor_high > selAmount){
                        gastos_other_cost	+=	gastos_menor_low_cost;
                    }
                    location_capital	=	parseInt($('.user_operation_id [name="location_capital"]',cqktr).val());
						
                    gastos_interior	=	amountFormatR($('.gastos_interior').val());
						
                    if(location_capital	==	1){
                        acreditacion_hr	=	acreditacion_capital;
                    }else if(location_capital	==	2){
                        acreditacion_hr	=	acreditacion_interior;
                        gastos_interior_tot	+=	(selAmount*gastos_interior)/100;
                    }else{
                        acreditacion_hr	=	0;
                    }
						
                    date		=	$('.user_date',cqktr).text();
                    date_arc	=	add_days_by_hr(date,acreditacion_hr);
                    date_diff	=	days_between(currentdate,date_arc);
                    totalDays	+=	date_diff;
                    //hour_diff	=	hours_between(currentdate,date);
                    discount	=	(selAmount*0.17/100)*parseInt(date_diff);
                    //date_arc	=	add_days(date,date_diff);
						
                    //flAmout		=	selAmount	-	chqPer	- discount;
                    flAmout		=	selAmount;
                    payingAmount	+=	flAmout;
						
                    var trmade = $('#viewChequesGrid').dataTable().fnAddData( [
                        $('.user_bank_name',cqktr).text(),
                        $('.user_check_n',cqktr).text(),
                        $('.user_zip_code',cqktr).text(),
                        acreditacion_hr+'<input type="hidden" name="acreditacion_hrs" value="'+acreditacion_hr+'"/>',
                        $('.user_date',cqktr).text(),
                        date_arc,
                        date_diff,
                        $('.user_operation_id',cqktr).text(),
                        amountFormat(flAmout),
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'SelectedCheque_'+cqktr_id[1];
						
                    chequeFlag	=	true;
						
                });
                if(chequeFlag)	{
                    var trmade = $('#viewChequesGrid').dataTable().fnAddData( ['','','','','','','','','-'] );
                    var trmade = $('#viewChequesGrid').dataTable().fnAddData( ['Cant. Cheques','D&iacute;as Promedio','Bruto','Intereses','Gs. Interior','Gs. Grales','Gs. Otros','Subtotal',''] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    $(nTr).attr({
                        'style':'background:#CCCCCC;font-weight:bold;'
                    });
                    dayAvg	=	totalDays/chequeChkCount;
                    tasa_anual	=	amountFormatR($('.tasa_anual').val());
                    interests	=	((((tasa_anual)/360)*dayAvg)*payingAmount)/100;
                    //gastos_interior	=	amountFormatR($('.gastos_interior').val());
                    gastos_general		=	amountFormatR($('.gastos_general').val());
                    impuesto_al_cheque	=	amountFormatR($('.impuesto_al_cheque').val());
						
						
                    //gastos_interior_tot	=	(payingAmount*gastos_interior)/100;
                    gastos_general_tot	=	(payingAmount*(impuesto_al_cheque+gastos_general))/100;
                    //fn_cost_general	=	(fn_payingAmount*gastos_interior)/100;
                    other_cost		=	amountFormatR($("#operationGrid [name='acreditacion']").val())?amountFormatR($("#operationGrid [name='acreditacion']").val()):0;
                    subTotalAM		=	payingAmount-interests-gastos_interior_tot-gastos_general_tot-other_cost;
					
                    var trmade = $('#viewChequesGrid').dataTable().fnAddData( [
                        '<span class="fn_chequeChkCount">'		+chequeChkCount	+'</span>' ,
                        '<span class="fn_dayAvg">'				+dayAvg.toFixed(2)			+'</span>' ,
                        '<span class="fn_payingAmount">'		+amountFormat(payingAmount)	+'</span>' ,
                        '<span class="fn_interests">'			+amountFormat(interests)		+'</span>' ,
                        '<span class="fn_gastos_interior">'		+amountFormat(gastos_interior_tot)+'</span>' ,
                        '<span class="fn_cost_general">'		+amountFormat(gastos_general_tot)	+'</span>' ,
                        '<span class="fn_other_cost">'			+amountFormat(other_cost+gastos_other_cost)		+'</span>' ,
                        '<span class="paying_amount_span">'		+amountFormat(subTotalAM)		+'</span>' ,'']);
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'liqSupDetials';
						
                }
                var frontFinalView	=	$('.finalPayView');	
                pay_final_amount	=	amountFormatR($('#pay_final_amount').val());
                balance				=	amountFormatR(subTotalAM)	-	pay_final_amount;	
                $('.payCls',frontFinalView).text(amountFormat(pay_final_amount));
					
                $('.payingCls',frontFinalView).text(amountFormat(subTotalAM));
                $('.balanceCls',frontFinalView).text(amountFormat(balance));
					
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
                $( this ).dialog("close");
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
        currentdate				=	$('.currentDateLiq').val();
        var amount_payed			=	amountFormatR($('.payingCls',frontFinalView).text());
        var current_account_balance	=	amountFormatR($('.balanceCls',frontFinalView).text());
			
        var PayChecksForm	=	$('#PayChecksForm');
			
			
        var operations_json	=	new Array();
			
        $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
            $('[name="previous_account_balance"]',PayChecksForm).val(amountFormatR($('.pay_amount_cls',this).text()));				
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
        $('[name="current_account_balance"]',PayChecksForm).val(current_account_balance);
        $('[name="amount_payed"]',PayChecksForm).val(amount_payed);
        var cheques_json	=	new Array();
        var acreditacion_hrs,cqktr_id;
        $('#viewChequesGrid  tr[id^="SelectedCheque_"]').each(function(){
            var cqktr = $(this);
            cqktr_id	=	cqktr.attr('id').split('_');
            acreditacion_hrs	=	$('[name="acreditacion_hrs"]',cqktr).val();
				
            var cheque	= {
                'cheque_id'			:	cqktr_id[1],
                'acreditacion_hrs'	:	acreditacion_hrs,
            }
            cheques_json.push(cheque);		
        });
			
        $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));
			
        var liqSupDetials	=	$("#liqSupDetials");
			
        /*
			$('.fn_chequeChkCount',liqSupDetials).text();
			$('.fn_dayAvg',liqSupDetials).text();
			$('.fn_payingAmount',liqSupDetials).text();
			$('.fn_interests',liqSupDetials).text();
			$('.fn_gastos_interior',liqSupDetials).text();
			$('.fn_cost_general',liqSupDetials).text();
			$('.fn_other_cost',liqSupDetials).text();
			$('.paying_amount_span',liqSupDetials).text();
			*/
        $('[name="checks_qty"]',PayChecksForm).val($('.fn_chequeChkCount',liqSupDetials).text());
        $('[name="average_days"]',PayChecksForm).val($('.fn_dayAvg',liqSupDetials).text());
        $('[name="total_bruto"]',PayChecksForm).val(amountFormatR($('.fn_payingAmount',liqSupDetials).text()));
        $('[name="intereses"]',PayChecksForm).val(amountFormatR($('.fn_interests',liqSupDetials).text()));
        $('[name="gastos_interior"]',PayChecksForm).val(amountFormatR($('.fn_gastos_interior',liqSupDetials).text()));
        $('[name="gastos_general"]',PayChecksForm).val(amountFormatR($('.fn_cost_general',liqSupDetials).text()));
        $('[name="gastos_varios"]',PayChecksForm).val(amountFormatR($('.fn_other_cost',liqSupDetials).text()));
        $('[name="total_neto"]',PayChecksForm).val(amountFormatR($('.paying_amount_span',liqSupDetials).text()));
			
			
        PayChecksForm.submit();
			
    });
		
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    currentdate	=	$('#ServerCurrentDate').val();
    $('.currentDate').text(currentdate);
    $('.currentDateLiq').val(currentdate);
		
    //$(".currentdate").val(currentdate);
    $('.currentDateLiq').change(function(){
        currentdate	=	$(this).val();
    });
		
	
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
    $('#operationGrid tbody tr[id^="Acreditacion"] [name="acreditacion"]').keyup(function(){
        $('#PayChecksForm [name="acreditacion"]').val($(this).val());
        $('#liqSupDetials .fn_other_cost').text($(this).val());
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
    $('#operationGridByLiquidacionesId tbody tr[id^="Acreditacion"] .pay_amount_cls').live('keyup',function(){
        finalBalanceWithChkOnEdit();
    });
    $('#chequesGrid tbody tr').live('click',function(){
        if($('.chequeChk',this).is(':checked')){
            $('.chequeChk',this).removeAttr('checked');
            changeChkOnAdd($('.chequeChk',this));
        }else{
            $('.chequeChk',this).attr('checked','checked');
            changeChkOnAdd($('.chequeChk',this));
        }			
    });
    $('#chequesGrid tbody tr  .chequeChk').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            changeChkOnAdd($(this));
        }else{
            $(this).attr('checked','checked');
            changeChkOnAdd($(this));
        }
    });
    finalBalanceWithChk();
    $('.viewBtn').click(function(){
        var comitted	=	parseInt($('[name="comitted"]',this).val());
			
			
        $( ".chequeListByLiquidacionesId" ).dialog('open');
        $(".ui-dialog-buttonpane button:contains('Consolidar')").button("disable");
        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');
        var url = '/liquidaciones/getliquidacionesdetailssupplierajax';
        var current_account_balance	=	$('.user_current_account_balance',bankTr).text();
        var amount_payed	=	$('.user_amount_payed',bankTr).text();
			
			
        $('.finalPayViewByLiquidacionesId .payingCls').text(amount_payed);
        $('.finalPayViewByLiquidacionesId .balanceCls').text(current_account_balance);
			
        var date	=	$('.user_date',bankTr).text();
        $('.loadOperations').text('Cargando...');
        $('.loadOperations').show();
        $.post(url, { 
            'liquidaciones_id'				:	bankid[1]
        },
        function(data){						
            if(data){
					 
                var chequeListJson	=	data['chequesList'];
                var acreditacion_hr,selAmount,chqPer,discount,date,date_diff,flAmout,l_date,payingAmount	=	0;
                var trmade,item,oSettings,nTr;
                var chequeChkCount,
                dayAvg,
                date_arc,
                payingAmount,
                interests,
                gastos_interior,
                cost_general,
                other_cost,
                subTotalAM,
                hour_diff;
                vgliTable.fnClearTable();
                vgliTable.fnSetColumnVis( 0, true );
                oSettings = vgliTable.fnSettings();
                var liquidacion	=	data['liquidacion'];
					 
					
					
                for(var x in chequeListJson){
                    item	=	chequeListJson[x];
                    acreditacion_hr	=	parseInt(item['acreditacion_hrs']);
                    selAmount	=	amountFormatR(item['amount']);
                    chqPer		=	selAmount*2.1/100;
                    discount	=	0;
						
											
                    //flAmout		=	selAmount	-	chqPer	- discount;
                    flAmout		=	selAmount;
                    payingAmount	+=	flAmout;
					
						
                    date		=	item['date'];
						
                    date_arc	=	add_days_by_hr(date,acreditacion_hr);
                    l_date		=	item['liquidacion_date'];
						
                    date_diff	=	days_between(l_date,date_arc);
                    //hour_diff	=	hours_between(l_date,date);
                    discount	=	(selAmount*0.17/100)*parseInt(date_diff);
						
                    flAmout		=	selAmount;
                    payingAmount	+=	flAmout;
						
						
                    trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( [	chk('editli',true),						                                                
                        '<span class="fe_bank_name">'+item['bank_name']	+'</span>' ,
                        '<span class="fe_check_n">'+item['check_n']	+'</span>' ,
                        '<span class="fe_check_zip_code">'+item['check_zip_code']	+'</span>' ,
                        '<span class="fe_hour_diff">'+acreditacion_hr	+'</span>' ,
                        '<span class="fe_date">'+date	+'</span>' ,
                        '<span class="fe_l_date">'+date_arc	+'</span>' ,
                        '<span class="fe_date_diff">'+date_diff	+'</span>' ,
                        '<span class="fe_name">'+item['first_name']+' '+item['last_name']	+'</span>' ,
                        '<span class="chk_final_amount">'+amountFormat(flAmout)+'</span>'	+'</span>' ,
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editchequelistid_'+item['id'];
						
						
                };
					 	
                /*
					 trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','','-',] );
					trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','SALDO EN CHEQUES','<span class="paying_amount_span_edit">'+payingAmount.toFixed(2)+'</span>',] );
					
					
					
					
					nTr = oSettings.aoData[ trmade[0] ].nTr;
					$("td:eq(8)",nTr).addClass('greyBg');
					$("td:eq(9)",nTr).addClass('greyBg');
					*/
					
					
                //var trmade = $('#chequesDetailsByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','','-'] );
                //var trmade = $('#chequesDetailsByLiquidacionesId').dataTable().fnAddData( ['','cant. cheques','dias promedio','bruto','intereses','Gs. Interior','Gs.Grales','Gs. Otros','Sub Total','',''] );
                //nTr = oSettings.aoData[ trmade[0] ].nTr;
                //$(nTr).attr({'style':'background:#CCCCCC;font-weight:bold;'});
					 	
                chequeChkCount	=	liquidacion['checks_qty'];
                dayAvg			=	liquidacion['average_days'];
                payingAmount	=	liquidacion['total_bruto'];
                interests		=	liquidacion['intereses'];
                gastos_interior	=	liquidacion['gastos_interior'];
                cost_general	=	liquidacion['gastos_general'];        							
                other_cost		=	parseInt(liquidacion['gastos_varios']);  
                subTotalAM		=	liquidacion['total_neto'];
                amount_payed_w	=	liquidacion['amount_payed'];
                current_account_balance_w	=	liquidacion['current_account_balance'];
                //$("table#chequesDetailsByLiquidacionesId").parent().html('');
				
                cdliTable.fnClearTable();
                cdoSettings = cdliTable.fnSettings();
					 
					
                var trmade = $('#chequesDetailsByLiquidacionesId').dataTable().fnAddData( [
                    '<span class="fn_chequeChkCount">'		+chequeChkCount	+'</span>' ,
                    '<span class="fn_dayAvg">'				+dayAvg			+'</span>' ,
                    '<span class="fn_payingAmount">'		+amountFormat(payingAmount)	+'</span>' ,
                    '<span class="fn_interests">'			+amountFormat(interests	)	+'</span>' ,
                    '<span class="fn_gastos_interior">'		+amountFormat(gastos_interior)+'</span>' ,
                    '<span class="fn_cost_general">'		+amountFormat(cost_general)	+'</span>' ,
                    '<span class="fn_other_cost">'			+amountFormat(other_cost)		+'</span>' ,
                    '<span class="paying_amount_span_edit">'+amountFormat(subTotalAM)		+'</span>' ,]);
                nTr = cdoSettings.aoData[ trmade[0] ].nTr;
                nTr.id = 'liqSupDetials_edit';
                //$('#chequesDetailsByLiquidacionesId').dataTable();
					
                //var trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','','-'] );
					
					 
                var opertationsListJson	=	data['opertationsList'];
                ogliTable.fnClearTable();
                ogliTable.fnSetColumnVis( 0, true );
                var amount,amountCave,commision,finalAmount,acreditacion,totalFinalAmount	=	0;
                oSettings = ogliTable.fnSettings();
					
					 
                var liquidacion_date	=	liquidacion['date'];
                var liquidacion_id		=	liquidacion['id'];
                $('#PayChecksEditForm [name="date"]').val(liquidacion_date);
                $('#PayChecksEditForm [name="id"]').val(liquidacion_id);
                if(liquidacion){
                    previous_account_balance	= amountFormatR(liquidacion['previous_account_balance']);	
                    acreditacion				= amountFormatR(liquidacion['gastos_varios']);
                    if(previous_account_balance){
                        totalFinalAmount	+=	previous_account_balance;
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData([	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            'Balance',
                            '<span class="pay_amount_cls">'+amountFormat(previous_account_balance)+'</span>',
                            ]);
							 
                        nTr = oSettings.aoData[trmade[0]].nTr;
                        nTr.id = 'PreviousBalance';
							
                    }
                    totalFinalAmount	+=	other_cost;
                    if(comitted){
							 
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            'Otros gastos',
                            '<span class="pay_amount_cls">'+amountFormat(other_cost)+'</span>',
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
						
                    }else{
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [	'',						                                                
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            'Otros gastos',
                            '<input type="text" class="pay_amount_cls" value="'+other_cost+'"/>',
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
						
                    }
                }
					 
						
                for(var x in opertationsListJson){
                    var item	=	opertationsListJson[x];
                    amount	=	amountFormatR(item['amount']);
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
					 
					 
                var rejectedChequesJson	=	data['rejectedCheques'];
                var rejected_cheques_fee	=	0.00;
					
					 
                for(var x in rejectedChequesJson){
                    item	=	rejectedChequesJson[x];
                    amount	=	parseFloat(item['amount']);
                    rejected_cheques_fee	=	parseFloat(item['rejected_cost']);
                    finalAmount	=	amount+rejected_cheques_fee;
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
                //trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','-',] );
                trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','SALDO A LIQUIDAR','<span class="pay_final_amount_span_edit">'+amountFormat(totalFinalAmount)+'</span>',] );
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
					
                $('.finalPayViewByLiquidacionesId .payingCls').text(amount_payed_w);
                $('.finalPayViewByLiquidacionesId .balanceCls').text(current_account_balance_w);
					 
            }else{
                $('.loadOperations').text('Hubo un problema, por favor intente nuevamente.');
            }
        },'json');			
    });
    $('.cancelBtn').click(function(){
        var r=confirm("Esta seguro que desea borrar la liquidacion?");
        if (r==true)
        {
            var bankTr = $(this).parents('tr:eq(0)');
            var row = $(this).closest("tr").get(0);
            var bankid = bankTr.attr('id').split('_');
            var url = '/liquidaciones/deleteliquidacionessupplier';
            url	+=	'/liquidaciones_id/'+	bankid[1];
            url	+=	'/cave_id/'+	$('[name="cave_id"]',caveForm).val();
            window.location	=	url;
        }
        else
        {
			 
        }
			
			
			
    });
    $('.pdfBtn').live('click',function(){
        var url = '/liquidaciones/generatepdfforsupplierliquidaciones';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
		
        url += "/liquidacion_id/"+clientid+'/status/0';
        window.open(url,'_blank');
    });
    $('.excelBtn').live('click',function(){
        var url = '/liquidaciones/generateexcelforsupplierliquidaciones';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
		
        url += "/liquidacion_id/"+clientid+'/status/0';
        window.open(url,'_blank');
    });
    $('.excelMailBtn').live('click',function(){
        var url = '/liquidaciones/sendmailofsupplierliquidacionesexcel';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid	=	clientid[1];
        showmsg("Mail Sending....!",'f',true);
        //url += "/liquidacion_id/"+clientid+'/status/0';
        //window.open(url,'_blank');
        $.post(url, { 
            "liquidacion_id"   : clientid,
            "status"		   : 0, 
        },				
        function(data){
            if(data){							  
                showmsg("Mail Sended Succesfully!",'t');
					  							  
            }else{							 
                showmsg("Mail Sended Succesfully!",'t');
            }
        });
			
    });
		
    $('.btn40,.btn30,.chooseChequesBtn').click(function(){
        var url = '/liquidaciones/getchequesbysupplieridfilterajax';
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
        var thisBtn	=	$(this);
        if(thisBtn.hasClass('chooseChequesBtn')){
            vgTable.fnClearTable(); 
            $( ".chequeList" ).dialog('open');
            pay_final_amount	=	$('#pay_final_amount').val();
            payCls			=	$('.payCls');
            payCls.text(amountFormat(pay_final_amount));	
        }
        $.post(url, { 
            "cave_id"  : $('[name="cave_selected_id"]').val(),
            "pos"	   : $(this).attr('limit'), 
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
        var url = '/liquidaciones/getchequesbysupplieridfilterajax';
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
        $.post(url, { 
            "cave_id"  : $('[name="cave_selected_id"]').val(),
            "pos"	   : $(this).next('[name="get_chk_inp"]').val(), 
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
function days_between(dateOne, dateTwo) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var dateOneArr	=  dateOne.split('/');
    var dateTwoArr	=  dateTwo.split('/');
    
    dateOne = new Date(dateOneArr[2], parseInt(dateOneArr[1])-1, dateOneArr[0]);
    dateTwo = new Date(dateTwoArr[2], parseInt(dateTwoArr[1])-1, dateTwoArr[0]);

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
function add_days_by_hr(dateOne, hours) {
    var days	=	Math.round(hours/24);
    var dateTwo,day,cYear,cMonth,cDate,cFullDate;
    var dateOneArr	=  dateOne.split('/');
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    var prev_day	=	dateOne.getDay();
    var day_count	=	0;
    if(prev_day	==	0 || prev_day == 6){
    //day_count++;
    }
    dateTwo = new Date(dateOne.getFullYear(), dateOne.getMonth()-1, dateOne.getDate()-1);
    for (var i =0; i <= days; i++){		
        dateTwo = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate()+1);
        day = dateTwo.getDay();
        cYear	 	= dateTwo.getFullYear();
        cMonth 		= dateTwo.getMonth()+1;
        cMonth		= cMonth>9?cMonth:'0'+cMonth;	
        cDate 		= dateTwo.getDate()>9?dateTwo.getDate():'0'+dateTwo.getDate();
        cFullDate	=	cDate+'/'+cMonth+'/'+cYear;
		
        if($.inArray(cFullDate, holidays_arr) > -1){
            i--;
        }		
		
        if (day == 0 || day == 6) {
            i--;
        }
	   
    }
    var month	=	parseInt(dateTwo.getMonth())+1;
    return dateTwo.getDate()+'/'+month+'/'+dateTwo.getFullYear();
//return day_count;
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
        final_amount	+=	amountFormatR($('.pay_amount_cls',this).text());				
    });
    $('#operationGrid tbody tr[id^="Acreditacion"]').each(function(){
        if(amountFormatR($('.pay_amount_cls',this).val())){
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).val());
        }
    });
    $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
        if($('[name="operation_chk"]',this).is(':checked')){
            var operationid	=	$(this).attr('id').split('_');
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).text());
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
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).text());
            var rejected_cheque	= 	{
                'rejected_cheque_id'	:	rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
    $('.pay_final_amount_span').text(amountFormat(final_amount));
    $('#pay_final_amount').val(amountFormat(final_amount));
    //final_amount	=	amountFormatR($('#pay_final_amount').val());
	
    var frontFinalView	=	$('.finalPayView');	
    pay_final_amount	=	amountFormatR($('#pay_final_amount').val());
    payingAmount		=	amountFormatR($('.paying_amount_span').text())?amountFormatR($('.paying_amount_span').text()):0;
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
        PreviousBalance	=	amountFormatR($('.pay_amount_cls',this).text());
        final_amount	+=	PreviousBalance;			
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="Acreditacion"]').each(function(){
        if(amountFormatR($('.pay_amount_cls',this).val())){
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).val());
            acreditacion	=	amountFormatR($('.pay_amount_cls',this).val());
        }
    });
    $('#operationGridByLiquidacionesId tbody tr[id^="editoperationlistid_"]').each(function(){
        if($('[name="editOperation"]',this).is(':checked')){
            var operationid	=	$(this).attr('id').split('_');
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).text());
            var operation	= 	{
                'operation_id'	:	operationid[1]
            }
            operations_json.push(operation);
        }
    });
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
	
    var rejected_cheques_json	=	new Array();
    $('#operationGridByLiquidacionesId tbody tr[id^="editrejectedchequelistid_"]').each(function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            var rejected_cheque_id	=	$(this).attr('id').split('_');
            final_amount	+=	amountFormatR($('.pay_amount_cls',this).text());
            var rejected_cheque	= 	{
                'rejected_cheque_id'	:	rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
	
    var cheques_json	=	new Array();
    var chk_amount	=	0;
    var chk_count	=	0;
    var chk_total_days	=	0;
	
    $('#chequesGridByLiquidacionesId [name="editli"]').each(function(){
        if($(this).is(':checked')){
			
            var cqktr = $(this).parents('tr:eq(0)');
            chk_amount		+=	amountFormatR($('.chk_final_amount',cqktr).text());
            chk_total_days	+=	amountFormatR($('.fe_date_diff',cqktr).text());
            cqktr	=	cqktr.attr('id').split('_');
            var cheque	= {
                'cheque_id'	:	cqktr[1]
            }
            chk_count++;
        }
        cheques_json.push(cheque);		
    });
	
	
	
    $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));
	
	
	
    var frontFinalView	=	$('.finalPayViewByLiquidacionesId');	
    pay_final_amount	=	amountFormatR($('[name="amount_payed"]',PayChecksForm).val());
    payingAmount		=	amountFormatR($('.paying_amount_span_edit').text())?amountFormatR($('.paying_amount_span_edit').text()):0;
    balance				=	payingAmount	-	final_amount;	
	
    $('#operationGridByLiquidacionesId .pay_final_amount_span_edit').text(amountFormat(final_amount));
    $('[name="amount_payed"]',PayChecksForm).val(payingAmount.toFixed(2));
	
	
    $('.payCls',frontFinalView).text(amountFormat(final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(chk_amount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
	
    $('[name="current_account_balance"]',PayChecksForm).val(balance);
    $('[name="previous_account_balance"]',PayChecksForm).val(PreviousBalance);
    $('[name="acreditacion"]',PayChecksForm).val(acreditacion);	
	
    var liqSupDetials	=	$("#liqSupDetials_edit");
    var fn_dayAvg,fn_chequeChkCount,fn_payingAmount,tasa_anual,fn_interests,gastos_general,fn_cost_general,gastos_interior;
	
    fn_dayAvg	=	chk_total_days/chk_count;
    fn_payingAmount	=	chk_amount;
    tasa_anual	=	amountFormatR($('.tasa_anual').val());
    gastos_general	=	amountFormatR($('.gastos_general').val());
    gastos_interior =	amountFormatR($('.gastos_interior').val());
    fn_interests	=	(((tasa_anual/360)*fn_dayAvg)*fn_payingAmount)/100;
	
    var impuesto_al_cheque	=	amountFormatR($('.impuesto_al_cheque').val());
	
    fn_cost_general	=	(fn_payingAmount*(impuesto_al_cheque+gastos_general))/100;
	
	
    //tasa_anual	=	amountFormatR($('.tasa_anual').val());
    //interests	=	((((tasa_anual)/360)*dayAvg)*payingAmount)/100;
    //gastos_interior	=	amountFormatR($('.gastos_interior').val());
    //gastos_general		=	amountFormatR($('.gastos_general').val());
    //impuesto_al_cheque	=	amountFormatR($('.impuesto_al_cheque').val());
	
    //gastos_interior_tot	=	(payingAmount*gastos_interior)/100;
    //gastos_general_tot	=	(payingAmount*(impuesto_al_cheque+gastos_general))/100;
    //fn_cost_general	=	(fn_payingAmount*gastos_interior)/100;
    //other_cost		=	amountFormatR($("#operationGrid [name='acreditacion']").val())?amountFormatR($("#operationGrid [name='acreditacion']").val()):0;
	
    subTotalAM		=	fn_payingAmount-fn_interests-gastos_interior-acreditacion-gastos_general;
	
    fn_dayAvg		=	parseFloat(fn_dayAvg);
    fn_payingAmount	=	parseFloat(fn_payingAmount);
    fn_interests	=	parseFloat(fn_interests);
    fn_cost_general	=	parseFloat(fn_cost_general);
    acreditacion	=	parseFloat(acreditacion);
    subTotalAM		=	parseFloat(subTotalAM);
    $('.fn_chequeChkCount',liqSupDetials).text(chk_count);
    $('.fn_dayAvg',liqSupDetials).text(fn_dayAvg.toFixed(2));
    $('.fn_payingAmount',liqSupDetials).text(amountFormat(fn_payingAmount));
    $('.fn_interests',liqSupDetials).text(amountFormat(fn_interests));
    $('.fn_cost_general',liqSupDetials).text(amountFormat(fn_cost_general));
    $('.paying_amount_span_edit').text(amountFormat(subTotalAM));
    $('.fn_other_cost',liqSupDetials).text(amountFormat(acreditacion));
	

    $('[name="checks_qty"]',PayChecksForm).val($('.fn_chequeChkCount',liqSupDetials).text());
    $('[name="average_days"]',PayChecksForm).val($('.fn_dayAvg',liqSupDetials).text());
    $('[name="total_bruto"]',PayChecksForm).val(amountFormatR($('.fn_payingAmount',liqSupDetials).text()));
    $('[name="intereses"]',PayChecksForm).val(amountFormatR($('.fn_interests',liqSupDetials).text()));
    $('[name="gastos_interior"]',PayChecksForm).val(amountFormatR($('.fn_gastos_interior',liqSupDetials).text()));
    $('[name="gastos_general"]',PayChecksForm).val(amountFormatR($('.fn_cost_general',liqSupDetials).text()));
    $('[name="gastos_varios"]',PayChecksForm).val(amountFormatR($('.fn_other_cost',liqSupDetials).text()));
    $('[name="total_neto"]',PayChecksForm).val(amountFormatR(subTotalAM));
	
    $('.payCls',frontFinalView).text(amountFormat(final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(subTotalAM));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
	
}
function changeChkOnAdd(c_this){
    if(!c_this){
        return false;
    }
    var payCls			=	$('.chequesTotalShowTable .payCls');
    var payingCls		=	$('.chequesTotalShowTable .payingCls');
    var balanceCls		=	$('.chequesTotalShowTable .balanceCls');
    var balanceAmount	=	0;
    selAmount	=	amountFormatR(payingCls.text());
    var cqktr = c_this.parents('tr:eq(0)');
	
    if(c_this.is(':checked')){
        selAmount	+=	amountFormatR($('.user_amount',cqktr).text());
        balanceAmount	=	selAmount	-	amountFormatR(payCls.text());
    }else{
        selAmount	-=	amountFormatR($('.user_amount',cqktr).text());
        balanceAmount	=	selAmount	+	amountFormatR(payCls.text());
    }
	
	
    payingCls.text(amountFormat(selAmount));
    balanceCls.text(amountFormat(balanceAmount));
}
function changeChkOnOpen(){
    var payCls			=	$('.chequesTotalShowTable .payCls');
    var payingCls		=	$('.chequesTotalShowTable .payingCls');
    var balanceCls		=	$('.chequesTotalShowTable .balanceCls');
    var balanceAmount	=	0;
    selAmount	=	0.00;
	
    $('.chequeChk:checked').each(function(){
        var cqktr = $(this).parents('tr:eq(0)');
        selAmount	+=	amountFormatR($('.user_amount',cqktr).text());
    });
	
    balanceAmount	=	selAmount	-	amountFormatR(payCls.text());
	
    payingCls.text(amountFormat(selAmount));
    balanceCls.text(amountFormat(balanceAmount));
}

function createchequegrid(data){
	
    var location_capital,inp_chk,rejClientIdArr,jsonData,cheque_id	,operation_id,date,check_n,amount,cheque_status,first_name,last_name,cheque_state_id,status_list,bank_name,zip_code;
    var trmade;
    var dataArr = new Array();
    rejClientIdArr	=	data['rejClientIdArr'];
    //rejClientIdArr	=	rejClientIdArr.split(',');
	
    //delete  data['rejClientIdArr'];
	
    for(var x in data){
        jsonData			=	data[x];
        client_id			=	jsonData['client_id'];
        client_business 	=	jsonData['client_business'];
        cheque_id			=	jsonData['cheque_id'];
        operation_id		=	jsonData['operation_id'];
        date				=	jsonData['date'];
        check_n			=	jsonData['check_n'];
        amount				=	jsonData['amount'];
        cheque_status		=	jsonData['cheque_status'];
        first_name			=	jsonData['first_name'];
        last_name			=	jsonData['last_name'];
        cheque_state_id	=	jsonData['cheque_state_id'];
        status_list		=	jsonData['status_list'];
        business			=	jsonData['business'];
        location_capital	=	jsonData['location_capital'];
        zip_code			=	jsonData['zip_code'];
		 
        if($.inArray(client_id,rejClientIdArr) >= 0){
				
            inp_chk	= '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/><span style="color:red;font-size:14px;font-weight:bold;"> ! </span>';
				
        }else{
            inp_chk	= '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/>';
        }
        dataArr.push([							                                                
            inp_chk,
            cheque_id,
            '<span class="user_operation_id">'+first_name+' '+last_name 
            +'<input type="hidden" value="'+operation_id+'" name="operation_id"/>'
            +'<input type="hidden" value="'+location_capital+'" name="location_capital"/></span>',
            '<span class="user_date">'+date+'</span>',
            '<span class="user_check_n">'+check_n+'</span>',
            '<span class="user_bank_name">'+business+'</span>',
            '<span class="user_amount">'+amountFormat(amount)+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/></span>',
            ]);
    }
	
    vgTable.fnClearTable();
	
    trmade = $('#chequesGrid').dataTable().fnAddData( dataArr );
    dataArr	=	null;
    data	=	null;
	
    $('#viewChequesGrid [id^="SelectedCheque_"]').each(function(){
        var vcgId	=	$(this).attr('id').split('_');
        $('#chequesGrid  .chequeChk[id="userid_'+vcgId[1]+'"]').attr({
            'checked':'checked'
        });		
    });
	
    changeChkOnAdd();	 
}