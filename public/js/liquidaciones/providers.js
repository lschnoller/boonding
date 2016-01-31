var _liqDataEdit; //global var for liq data in the view liquidaciones sectionvar
$(function() {
    var providerForm = $('#providerForm');
    $('.providerIdBtn').click(function(){
        if($('[name="provider_id"]',providerForm).val()	== ''){
            showmsg("Por favor seleccione un proveedor.","t");			
        }else{
            providerForm.submit();
        }		
    });
    
    $( ".datepicker" ).datepicker({ 
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy'
    });	
    
    if($('[name="provider_selected_id"]',providerForm).val() != ''){
        $('[name="provider_id"] option[value="'+$('[name="provider_selected_id"]',providerForm).val()+'"]',providerForm).attr({
            'selected':'selected'
        });
        $('.providerNameSpan').text($('[name="provider_id"] option[value="'+$('[name="provider_selected_id"]',providerForm).val()+'"]',providerForm).text());
    } 
	
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bScrollCollapse": true,
        "bStateSave": false,
        "iDisplayLength": 50,
        'aoColumns': [{'sType': 'num-html'}, {"sType": 'us_date'}, {'sType':'currency'}, {'sType':'currency'}, {'sType':'currency'}, {'sType':'currency'}, null],
        "aaSorting": [[ 1, "desc" ]]
        
    });
    
    vgTable = $('#chequesGrid').dataTable({
        "bJQueryUI": true,
        //"sScrollX": "100%",
        "bInfo": false,
        "bPaginate": false,	
        "bScrollCollapse": true,
        //"bStateSave": true,
        "bAutoWidth": true,
        'aoColumns': [ {"sSortDataType": "dom-checkbox"}, {'sType': 'num-html'}, null, null, {"sType": 'us_date'}, {'sType':'num-html'}, {'sType':'currency'}, {'sType':'currency'}],
        "aaSorting": [[ 4, "asc" ]]
    });
    
    var edBtn = "<span style='float:left;'><span class='btn30 gridBtn' limit='30'>Mostrar 30 dias</span>";
    edBtn += "<span class='btn40 gridBtn' limit='40'>Mostrar 40 dias</span>";
    //edBtn += "<span class='btnInp gridBtn'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/></span>";
    edBtn += "<span class='' style='margin-left:10px; font:12px geneva, sans-serif; text-transform:uppercase'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/><span class='btnInp gridBtn'>dias </span></span>";
    $('#chequesGrid_wrapper .fg-toolbar').append(edBtn);
    
    opTable = $('#operationGrid').dataTable({
        "bJQueryUI"		: true,
        //"sScrollX"		: "100%",
        "bFilter"		: false,
        "bInfo"			: false,
        "bPaginate"		: false,
        //"bScrollCollapse"	: true,
        //"bStateSave"		: true,
        "bAutoWidth"		: false,
        'aoColumns': [ {"sWidth":"30px", "sSortDataType": "dom-checkbox"},{"sType": 'us_date'}, null, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[ 1, "asc" ]]
    });
    
    opTable = $('#rejectedGrid').dataTable({
        "bJQueryUI"		: true,
        //"sScrollX"		: "100%",
        "bFilter"		: false,
        "bInfo"			: false,
        "bPaginate"		: false,
        //"bScrollCollapse"	: true,
        //"bStateSave"		: true,
        "bAutoWidth"		: false,
        'aoColumns': [ {"sWidth":"30px", "sSortDataType": "dom-checkbox"}, null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[ 2, "asc" ]]
    });
	
    vcTable = $('#viewChequesGrid').dataTable({
        "bJQueryUI": true,
        //"sScrollXInner": "100%",
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        //"bScrollCollapse": true,
        "bAutoWidth": true,
        'aoColumns': [ {"sType": 'us_date'}, null, {'sType': 'currency'},{'sType': 'num-html'} , null, {'sType': 'num-html'}, {'sType': 'currency'}, {'sType': 'currency'},{'sType': 'currency'}]		
    });
    /*vctTable = $('#viewChequesGridTotals').dataTable({
        "bJQueryUI": true,
        //"sScrollXInner": "100%",
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        //"bScrollCollapse": true,
        "bAutoWidth": true	
    });*/
    ogliTable = $('#operationGridView').dataTable({
        "bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        "bAutoWidth": false,
        'aoColumns': [ {"sWidth":"30px", "sSortDataType": "dom-checkbox"},{"sType": 'us_date'}, null, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[ 1, "asc" ]]
    });	
    rgliTable = $('#rejectedGridView').dataTable({	
        "bJQueryUI": true,	
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        "bAutoWidth": false,
        'aoColumns': [ {"sWidth":"30px", "sSortDataType": "dom-checkbox"}, null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType': 'currency'}, {'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[ 2, "asc" ]]
    });    
    vgliTable = $('#viewChequesGridView').dataTable({
        "bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bPaginate": false,
        "bAutoWidth": true,
        'aoColumns': [ {"sSortDataType": "dom-checkbox"}, null, null, {"sType": 'us_date'}, {'sType': 'num-html'}, {'sType':'currency'}, {'sType':'num-html'}, {'sType':'currency'}, {'sType':'currency'}, {'sType':'currency'}],
        "aaSorting": [[ 3, "asc" ]]
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
        height		: window.screen.height - 300,
        //width		: window.screen.width - 200,
        width		: 900,
        autoResize	: true,
			
        buttons: {
            "Listo": function() {		
                var selAmount,cqktr,cqktr_id,location_capital,chequeTodayDetails,trmade,nTr,todayValue,days,acHrs,impCheque,gastos,
                descuento,checkId;
                var chequeFlag = false;
                var date = '';
                
                vgTable.fnFilter('');
                $( this ).dialog( "close" );
                vcTable.fnClearTable();
                var oSettings = vcTable.fnSettings();
                //vctTable.fnClearTable();
                //var otSettings = vctTable.fnSettings();
                var checksArr = [];
                var x = 0;
                $('#chequesGrid .chequeChk:checked').each(function()
                {						
                    cqktr = $(this).parents('tr:eq(0)');
                    cqktr_id = $(this).attr('id').split('_');
                    checkId = cqktr_id[1];
                    selAmount = amountFormatR($('.user_amount',cqktr).text());	
                    todayValue = amountFormatR($('.user_amount_today',cqktr).text());	
                    location_capital = parseInt($('[name="location_capital"]',cqktr).val());
                    date = $('.user_date',cqktr).text();
                    days = $('[name="days"]',cqktr).val();
                    acHrs = $('[name="ac_hrs"]',cqktr).val();
                    impCheque = $('[name="imp_cheque"]',cqktr).val();
                    gastos = $('[name="gastos"]',cqktr).val();
                    descuento = $('[name="descuento"]',cqktr).val();
                    /*
                    chequeTodayDetails = getCheckValue(selAmount, date, location_capital, null);
                    
                    checksArr[x++] = {
                        'importe':selAmount,
                        'days':chequeTodayDetails.days,
                        'todayValue':chequeTodayDetails.todayValue,
                        'impuestoAlCheque':chequeTodayDetails.impuestoAlCheque,
                        'intereses':chequeTodayDetails.daysDiscountFee,
                        'location': location_capital,
                        'gastos': chequeTodayDetails.gastos,
                        'gastosOtros': chequeTodayDetails.gastosOtros
                    };
                    */
                    checksArr[x++] = {'cheque_id':checkId};
                    trmade = $('#viewChequesGrid').dataTable().fnAddData([
                        $('.user_operation_id',cqktr).text(),
                        $('.user_bank_name',cqktr).text(),
                        date,
                        $('.user_check_n',cqktr).text(),
                        amountFormat(selAmount),                        
                        //date_diff
                        days +'<input type="hidden" name="acreditacion_hrs" value="'+acHrs+'"/>',
                        amountFormat(impCheque + gastos),
                        amountFormat(descuento),
                        '<span class="pay_amount_cls">'+amountFormat(todayValue)+'</span>'
                    ]);                    
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'SelectedCheque_' + cqktr_id[1];						
                    chequeFlag = true;		
                });
                
                var url = '/liquidaciones/getchequestotalsajax';
                $.post(url, { 
                    "provId": $('[name="provider_selected_id"]').val(),
                    "checks": JSON.stringify(checksArr)
                },			
                function(data){
                    //var checksTotals = calculateChecksTotals(checksArr);
                    var checksTotals = data;
                    if(chequeFlag)	{ //there is at least one cheque selected
                        //dayAvg = totalDays/chequeChkCount;                    
                        $('#selectedChequesTotals', '#viewChequesGrid').html('<tr class="checks-totals-th"><td>N. CHEQUES</td><td>DIAS PROM.</td><td>BRUTO</td><td>IMP. AL CHEQUE</td><td>INTERESES</td><td>GASTOS INT.</td><td>GASTOS CAP.</td><td>GASTOS OTROS</td><td>SUBTOTAL</td></tr>'+
                        '<tr><td><span class="fn_chequeChkCount">'+checksTotals.chequeChkCount+'</span></td>'+
                        '<td><span class="fn_dayAvg">'+checksTotals.dayAvg+'</span></td>'+
                        '<td><span class="fn_payingAmount">'+amountFormat(checksTotals.bruto)+'</span></td>'+
                        '<td><span class="fn_impuestoAlCheque">'+amountFormat(checksTotals.impuestoAlCheque)+'</span></td>'+                        
                        '<td><span class="fn_interests">'+amountFormat(checksTotals.intereses)+'</span></td>'+
                        '<td><span class="fn_gastos_interior">'+amountFormat(checksTotals.gastosInterior)+'</span></td>'+
                        '<td><span class="fn_cost_general">'+amountFormat(checksTotals.gastosGeneral)+'</span></td>'+
                        '<td><span class="fn_other_cost">'+amountFormat(checksTotals.gastosOtros)+'</span></td>'+
                        '<td><span class="paying_amount_span">'+amountFormat(checksTotals.payingAmount)+'</span></td></tr>');
                    }

                    finalBalanceWithChk();

                    //set hidden vals
                    var PayChecksForm = $('#PayChecksForm');
                    $('[name="amount_payed"]',PayChecksForm).val(checksTotals.payingAmount);        
                    $('[name="checks_qty"]',PayChecksForm).val(checksTotals.chequeChkCount);
                    $('[name="average_days"]',PayChecksForm).val(checksTotals.dayAvg);
                    $('[name="total_bruto"]',PayChecksForm).val(checksTotals.bruto);
                    $('[name="impuesto_al_cheque_amt"]',PayChecksForm).val(checksTotals.impuestoAlCheque);
                    $('[name="intereses"]',PayChecksForm).val(checksTotals.intereses);
                    $('[name="gastos_interior"]',PayChecksForm).val(checksTotals.gastosInterior);
                    $('[name="gastos_general"]',PayChecksForm).val(checksTotals.gastosGeneral);
                    $('[name="gastos_varios"]',PayChecksForm).val(checksTotals.gastosOtros);
                    $('[name="total_neto"]',PayChecksForm).val(checksTotals.payingAmount);
                },'json')
                .error(function(XHR,errorMsg,errorThrown) { 
                    vgTable.fnClearTable(); 
                    alert('cheques totals error: '+errorMsg+' '+XHR+' '+errorThrown);
                });		
                
            },
            "Cerrar": function() {				
                $( this ).dialog("close");
            }
        }
    });
		
    var chequeListByLiquidacionesId = $(".chequeListByLiquidacionesId").dialog({
        autoOpen: false,
        modal: true,
        height: window.screen.height - 200,
        width: 970,
        autoResize: true,			
        buttons: [{   
                id: 'submitLiqForm',            
                text: "Enviar",
                click: function() {	
                    finalBalanceWithChkOnEdit();                                
                    var PayChecksForm = $('#PayChecksEditForm'); 
                    /*
                    currentdate = $('.currentDateLiq').val();

                    $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
                        $('[name="previous_account_balance"]',PayChecksForm).val(parseFloat($('.pay_amount_cls',this).text()));				
                    });
                    */
                    PayChecksForm.submit();
                }
            }, {
                text: "Cerrar",
                click: function() {				
                    $(this).dialog( "close" );
                }
            }
        ]
    });
    
    $(".chequeListByLiquidacionesId").parent('div').find('.ui-dialog-buttonpane').append($('.finalPayViewByLiquidacionesId'));
			
    $(".chequeList").parent('div').find('.ui-dialog-buttonpane').append($('.chequesTotalShowTable'));
    
    $('.sendCheques').click(function()
    {
        var frontFinalView = $('.finalPayView');
        var PayChecksForm = $('#PayChecksForm'); 
        currentdate = $('.currentDateLiq').val();
        
        $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
            $('[name="previous_account_balance"]',PayChecksForm).val(parseFloat($('.pay_amount_cls',this).text()));				
        });
        $('[name="committed"]',PayChecksForm).val('0'); //status is not consolidated       
        $('[name="date"]',PayChecksForm).val(currentdate);
        $('[name="acreditacion"]',PayChecksForm).val(amountFormatR($('[name="acreditacion"]','#operationGridADDst').val()));
        //var debt = amountFormatR($('.payCls',frontFinalView).text()) + amountFormatR($('[name="acreditacion"]','#operationGridADDst').val());
        $('[name="amount_debt"]',PayChecksForm).val(amountFormatR($('.payCls',frontFinalView).text()));
        $('[name="amount_payed"]',PayChecksForm).val(amountFormatR($('.payingCls',frontFinalView).text()));
        $('[name="current_account_balance"]',PayChecksForm).val(amountFormatR($('.balanceCls',frontFinalView).text()));        
               
        //return false;
        PayChecksForm.submit();
    });
		
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    //currentDate	=	day + "/" + month + "/" + year;
    currentdate	= $('#ServerCurrentDate').val();
    $('.currentDate').text(currentdate);
    $('.currentDateLiq').val(currentdate);
    $('.currentDateLiq').change(function(){
        currentdate = $(this).val();
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
    $('#rejectedGrid tbody tr[id^="RejectedCheque_"]').click(function(){
        if($('[name="rejected_chk"]',this).is(':checked')){
            $('[name="rejected_chk"]',this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $('[name="rejected_chk"]',this).attr('checked','checked');
            finalBalanceWithChk();
        }			
    });
    $('#rejectedGrid tbody tr[id^="RejectedCheque_"] [name="rejected_chk"]').change(function(event){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChk();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChk();
        }
    });
		

    $('#operationGridView tbody tr[id^="editoperationlistid_"]').live('click',function(){
        if($('[name="editOperation"]',this).is(':checked')){
            $('[name="editOperation"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editOperation"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#operationGridView tbody tr[id^="editoperationlistid_"] [name="editOperation"]').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }
    });
    $('#operationGridADDstView tr[id^="Acreditacion"] [name="acreditacion"]').keyup(function(){
        $('#PayChecksEditForm [name="acreditacion"]').val($(this).val());
        finalBalanceWithChkOnEdit();			
    });
    $('#rejectedGridView tbody tr[id^="editrejectedchequelistid_"]').live('click',function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            $('[name="editRejectedCheque"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editRejectedCheque"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#rejectedGridView tbody tr[id^="editrejectedchequelistid_"] [name="editRejectedCheque"]').live('change',function(){
        if($(this).is(':checked')){
            $(this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $(this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }
    });

    $('#viewChequesGridView tbody tr[id^="editchequelistid_"]').live('click',function(){
        if($('[name="editli"]',this).is(':checked')){
            $('[name="editli"]',this).removeAttr('checked');
            finalBalanceWithChkOnEdit();
        }else{
            $('[name="editli"]',this).attr('checked','checked');
            finalBalanceWithChkOnEdit();
        }			
    });
    $('#viewChequesGridView tbody tr[id^="editchequelistid_"] [name="editli"]').live('change',function(){
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
        $( ".chequeListByLiquidacionesId" ).dialog('open');
        //$(".ui-dialog-buttonpane button:contains('Enviar')").button("disable");
        var bankTr = $(this).parents('tr:eq(0)');
        var bankid = bankTr.attr('id').split('_');        
        var current_account_balance = $('.user_current_account_balance',bankTr).text();
        var amount_payed = $('.user_amount_payed',bankTr).text();
        var status = parseInt($('[name="committed"]',bankTr).val());
	
        $('.finalPayViewByLiquidacionesId .payingCls').text(amount_payed);
        $('.finalPayViewByLiquidacionesId .balanceCls').text(current_account_balance);			
        var date = $('.user_date',bankTr).text();
        $('.loadOperations').text('Cargando...');
        $('.loadOperations').show();
        
        var url = '/liquidaciones/getliquidacionesdetailsforprovajax';
        $.post(url, { 
            'liquidaciones_id': bankid[1],
            'status': status
        },
        function(data)
        {						
            if(data)
            {   
                var chkbox,date,selAmount,trmade,item,oSettings,nTr,location_capital,chequeTodayDetails,liqData,
                amount,amountCave,commision,finalAmount,acreditacion,totalFinalAmount,opsTotal, rejTotal,saldo,checksTotalsHTML,nextStep;
                selAmount=amount=amountCave=commision=finalAmount=acreditacion=totalFinalAmount=opsTotal=rejTotal=saldo= 0;

                var liquidacion	= data['liquidacion'];
                var provData = data['provData'];
                var liquidacion_date =	liquidacion['date'];
                var liquidacion_id = liquidacion['id'];
                var committed = parseInt(liquidacion['committed']);
                if(committed == 0) //not consolidated
                    nextStep = '2'; //make it en camino
                else if(committed == 2) //en camino
                    nextStep = '1'; //make it consolidated
                
                /********************************************* DATOS GENERALES *******************************************************************/
                $('#PayChecksEditForm [name="id"]').val(liquidacion_id);
                $('#PayChecksEditForm [name="date"]').val(liquidacion_date);    
                $('#PayChecksEditForm [name="committed"]').val(nextStep);    
                $('#PayChecksEditForm [name="impuesto_al_cheque"]').val(provData['impuesto_al_cheque']);
                $('#PayChecksEditForm [name="tasa_anual"]').val(provData['tasa_anual']);
                $('#PayChecksEditForm [name="acreditacion_capital"]').val(provData['acreditacion_capital']);
                $('#PayChecksEditForm [name="acreditacion_interior"]').val(provData['acreditacion_interior']);
                $('#PayChecksEditForm [name="gastos_general"]').val(provData['gastos_general']);                
                $('#PayChecksEditForm [name="gastos_interior"]').val(provData['gastos_interior']);
                $('#PayChecksEditForm [name="gastos_menor_a_monto_1"]').val(provData['gastos_menor_a_monto_1']);
                $('#PayChecksEditForm [name="gastos_menor_a_1"]').val(provData['gastos_menor_a_1']);
                $('#PayChecksEditForm [name="gastos_menor_a_monto_2"]').val(provData['gastos_menor_a_monto_2']);
                $('#PayChecksEditForm [name="gastos_menor_a_2"]').val(provData['gastos_menor_a_2']);
                
		/***************************************** OPERACIONES COMPARTIDAS ***********************************************************/
                ogliTable.fnClearTable();
                ogliTable.fnSetColumnVis( 0, true );
                oSettings = ogliTable.fnSettings();
                
                var operationListJson = data['opertationsList'];
                for(var x in operationListJson) {                    
                    item = operationListJson[x];
                    amount = parseFloat(item['amount']);
                    amountCave = amount / 2;
                    commision = parseFloat(item['comision_amt']);
                    finalAmount = parseFloat(item['prov_payment']);      
                    /*
                    commision = amountCave * 15 / 100; //hay un 15% del monto del proveedor de comision por default
                    finalAmount = amountCave - commision;
                    */
                    if(committed == 1) //was consolidated
                        chkbox = '';
                    else
                        chkbox = chk('editOperation',true);
                    trmade = $('#operationGridView').dataTable().fnAddData( [
                        chkbox,    
                        item['date'],
                        item['first_name']+' '+item['last_name'],
                        amountFormat(amount),
                        amountFormat(amountCave),
                        amountFormat(commision),
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editoperationlistid_'+item['operationid'];
                    $("td:eq(8)",nTr).addClass('operation_amount');
                                        
                    opsTotal += finalAmount;	
                }
                $('.operationsTotal_span', '#operationGridView').text(amountFormat(opsTotal));
                
                totalFinalAmount += opsTotal;	
			
                /********************************************* REJECTED CHEQUES *******************************************/       
                rgliTable.fnClearTable();
                rgliTable.fnSetColumnVis( 0, true );
                oSettings = rgliTable.fnSettings();
                
                var rejectedChequesJson	= data['rejectedCheques'];
                var rejected_cheques_fee = 0;
                for(var x in rejectedChequesJson)
                {
                    item = rejectedChequesJson[x];
                    amount = amountFormatR(item['amount']);
                    rejected_cheques_fee = amountFormatR(item['rejected_cost_prov']);
                    finalAmount = amount + rejected_cheques_fee;
                    
                    if(committed == 1)
                        chkbox = '';
                    else
                        chkbox = chk('editRejectedCheque',true);
                    trmade = $('#rejectedGridView').dataTable().fnAddData( [	
                        chkbox,
                        item['first_name']+' '+item['last_name'],
                        item['date'],
                        item['check_n'],
                        amountFormat(item['amount']),
                        amountFormat(rejected_cheques_fee),                        
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                        ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editrejectedchequelistid_'+item['id'];                    
                    $("td:eq(8)",nTr).addClass('rejected_cheque_amount');
                    
                    rejTotal += finalAmount;
                }
                $('.rejectedTotal_span', '#rejectedGridView').text(amountFormat(rejTotal));
                
                totalFinalAmount += rejTotal;
                acreditacion = amountFormatR(liquidacion['acreditacion']);                
                totalFinalAmount -= acreditacion;
                $('[name="acreditacion"]','#operationGridADDstView').val(acreditacion);                 
                $('.pay_final_amount_span', '#operationGridADDstView').text(amountFormat(totalFinalAmount));                					 
                $('.payCls', '.finalPayViewByLiquidacionesId').text(amountFormat(totalFinalAmount));
                                
                /********************************************* CALCULO DE DESCUENTO ************************************/
                vgliTable.fnClearTable();
                vgliTable.fnSetColumnVis( 0, true ); 
                oSettings = vgliTable.fnSettings();
                var chequeListJson = data['chequesList'];
                
                //if(committed) {
                    //if liquidacion already committed then get the historic values for when the liq was created
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
                    
                    // set the global liq data for viewing liquidaciones to current liq
                    _liqDataEdit = liqData;
                    
                    /*
                    var url = '/liquidaciones/getchequesbyprovidfilterajax';
                    $.post(url, { 
                        "prov_id": $('[name="provider_selected_id"]').val(),
                        "pos": $(this).attr('limit'),
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
                    */
                    for(var x in chequeListJson)
                    {
                        item = chequeListJson[x];
                        selAmount = amountFormatR(item['amount']);      
                        if(committed == 1)
                            chkbox = '';
                        else
                            chkbox = chk('editli',true);
                        item['business'] = item['business'] != null ? item['business'] : '';
                        
                        trmade = $('#viewChequesGridView').dataTable().fnAddData( [
                            '<input type="hidden" name="location_capital" value="'+item['location_capital']+'" />'+chkbox,						                                                
                            '<span class="client_name">'+item['first_name']+' '+item['last_name']+'</span>',
                            '<span class="business">'+item['business']+'</span>',
                            '<span class="check_date">'+item['date']+'</span>',
                            '<span class="check_n">'+item['check_n']+'</span>',
                            '<span class="chk_amount">'+amountFormat(selAmount)+'</span>',                        
                            '<span class="check_days">'+item['days']+'</span>'+'<input type="hidden" name="acreditacion_hrs" value="'+item['ac_hrs']+'" />',
                            '<span class="check_imp">'+amountFormat(item['imp_al_cheque'] + item['gastos'])+'</span>',
                            '<span class="check_desc">'+amountFormat(item['descuento'])+'</span>',                        
                            '<span class="chk_final_amount">'+amountFormat(item['today_value'])+'</span>',
                            ] );
                        nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'editchequelistid_'+item['id'];
                    }
                    checksTotalsHTML = '<td></td>'+
                         '<td style="text-align:right"><span class="fn_chequeChkCount">'+liquidacion['checks_qty']+'</span></td>'+
                         '<td><span class="fn_dayAvg">'+liquidacion['average_days']+'</span></td>'+
                         '<td><span class="fn_payingAmount">'+amountFormat(liquidacion['total_bruto'])+'</span></td>'+
                         '<td><span class="fn_impuestoAlCheque">'+amountFormat(liquidacion['impuesto_al_cheque_amt'])+'</span></td>'+                        
                         '<td><span class="fn_interests">'+amountFormat(liquidacion['intereses'])+'</span></td>'+
                         '<td><span class="fn_gastos_interior">'+amountFormat(liquidacion['gastos_interior_fee'])+'</span></td>'+
                         '<td><span class="fn_cost_general">'+amountFormat(liquidacion['gastos_general_fee'])+'</span></td>'+
                         '<td><span class="fn_other_cost">'+amountFormat(liquidacion['gastos_varios'])+'</span></td>'+
                         '<td><span class="paying_amount_span">'+amountFormat(liquidacion['total_neto'])+'</span></td>';                
               
                //display totals
                $('#chequesTotals', '#viewChequesGridView').html(checksTotalsHTML);                
                $('.payingCls', '.finalPayViewByLiquidacionesId').text(amountFormat(liquidacion['total_neto']));
                saldo = (totalFinalAmount - liquidacion['total_neto']) * -1;                
                $('.balanceCls', '.finalPayViewByLiquidacionesId').text(amountFormat(saldo));
                
                /************************************** FINAL TOUCHES *****************************************************/
                $('.loadOperations').hide();                
                //finalBalanceWithChkOnEdit();				
                	
                if(status == 0){ //en camino
                    $('#submitLiqForm').show();
                    $('#submitLiqForm .ui-button-text').text('Enviar');
                    $('[name="acreditacion"]','#operationGridADDstView').removeAttr('disabled', 'disabled');
                } 
                else if(status == 2){ //en camino
                    $('#submitLiqForm').show();
                    $('#submitLiqForm .ui-button-text').text('Consolidar');
                    $('[name="acreditacion"]','#operationGridADDstView').removeAttr('disabled', 'disabled');
                }
                else if(status == 1) { //consolidated
                    $('#submitLiqForm').hide();
                    //$(".ui-dialog-buttonpane button:contains('Enviar')").hide();
                    $('[name="acreditacion"]','#operationGridADDstView').attr('disabled', 'disabled');
                    rgliTable.fnSetColumnVis(0, false);
                    vgliTable.fnSetColumnVis(0, false);
                    ogliTable.fnSetColumnVis(0, false);                    
                }/*else{                    
                    $(".ui-dialog-buttonpane button:contains('Consolidar')").button("enable");
                    $('[name="acreditacion"]','#operationGridADDstView').removeAttr("disabled");
                    rgliTable.fnSetColumnVis(0, true);
                    vgliTable.fnSetColumnVis(0, true);
                    ogliTable.fnSetColumnVis(0, true);
                }*/
                
            //vgliTable.fnAdjustColumnSizing();
            //ogliTable.fnAdjustColumnSizing();
            }else{
                $('.loadOperations').text('Error al cargar liquidación, por favor intente nuevamente.');
            }
        },'json');
    });
    
    $('.cancelBtn').click(function(){
        var del = confirm("Esta seguro que desea eliminar la liquidacion?");
        if (del) {
            var bankTr = $(this).parents('tr:eq(0)');
            var row = $(this).closest("tr").get(0);
            var bankid = bankTr.attr('id').split('_');
            var url = '/liquidaciones/deleteliquidaciones';
            url	+= '/liquidaciones_id/' + bankid[1];
            url	+= '/provider_id/' + $('[name="provider_selected_id"]',providerForm).val();
            window.location = url;
        }	
    });
    
    $('.pdfBtn').live('click',function(){
        var url = '/liquidaciones/generatepdfforliquidaciones';
        var clientid = $(this).parents('tr:eq(0)').attr('id').split('_');
        clientid = clientid[1];
		
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
    
    $('.btnInp,.btn40,.btn30,.chooseChequesBtn').click(function()
    {
        //vgTable global variable
        var pay_final_amount,pay_final_amount_inv,payCls;
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
			
        var thisBtn = $(this);
        if(thisBtn.hasClass('chooseChequesBtn')){
            vgTable.fnClearTable(); 
            $( ".chequeList" ).dialog('open');
            pay_final_amount = $('#pay_final_amount').val();
            pay_final_amount_inv = amountFormatR(pay_final_amount) * -1;
            $('.payCls', '.chequesTotalShowTable').text(amountFormat(pay_final_amount));
            $('.balanceCls', '.chequesTotalShowTable').text(amountFormat(pay_final_amount_inv));
        }
        else if(thisBtn.hasClass('btnInp')) {
            thisBtn.attr('limit',thisBtn.prev().val());
        }
        
        var url = '/liquidaciones/getchequesbyprovidfilterajax';
        $.post(url, { 
            "prov_id": $('[name="provider_selected_id"]').val(),
            "pos": $(this).attr('limit'),
            "liqDate": $('.currentDateLiq').val()
        },			
        function(data){
            vgTable.fnClearTable();
            createchequegrid(data['chequesEnCartera'], data['passingLimit']);
            createchequegrid(data['checksNoGood'], data['passingLimit']);

            var balanceAmount = 0;
            var selAmount = 0.00;
            var qty = 0;

            $('.chequeChk:checked').each(function(){
                var cqktr = $(this).parents('tr:eq(0)');
                selAmount += amountFormatR($('.user_amount_today',cqktr).text());
                qty++;
            });	

            balanceAmount = amountFormatR($('.chequesTotalShowTable .balanceCls').text()) + selAmount;
            $('.chequesTotalShowTable .payingCls').text(amountFormat(selAmount));
            $('.chequesTotalShowTable .balanceCls').text(amountFormat(balanceAmount));
            $('.chequesTotalShowTable .qtyCls').text(qty.toString());
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        },'json')
        .error(function() { 
            vgTable.fnClearTable(); 
            $('#chequesGrid_wrapper .fg-toolbar .dataTables_processing').remove();
        });			
    });
    /*
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
    */   		
});

function chk(name,checked){
    if(checked){
        checked	= 'checked="checked"';
    }else{
        checked	= '';
    }
    var chkbox	= '<input type="checkbox" class="chequeChk" name="'+name+'" '+checked+'/>'
    return chkbox; 
}

function finalBalanceWithChk()
{ 
    var operationid,payTotal,final_amountInv,operationsTotal,operation,rejected_cheque_id,rejectedTotal,selectedTotal,rejected_cheque, acreditacion_hrs;
    var operations_json = new Array();
    payTotal = operationsTotal = rejectedTotal = selectedTotal = 0;
    var PayChecksForm = $('#PayChecksForm');
    	
    $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
        payTotal += parseFloat(amountFormatR($('.pay_amount_cls',this).text()));				
    });
    $('#operationGridADDst tr[id^="Acreditacion"]').each(function(){
        if(parseFloat($('.pay_amount_cls',this).val())){
            payTotal -= parseFloat(amountFormatR($('.pay_amount_cls',this).val()));
        }
    });    
    $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
        if($('[name="operation_chk"]',this).is(':checked')){
            operationid = $(this).attr('id').split('_');
            operationsTotal += parseFloat(amountFormatR($('.pay_amount_cls',this).text()));
            operation = {
                'operation_id': operationid[1]
            }
            operations_json.push(operation);
        }
    });    
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
        
    var rejected_cheques_json = new Array();
    $('#rejectedGrid tbody tr[id^="RejectedCheque_"]').each(function(){
        if($('[name="rejected_chk"]',this).is(':checked')){
            rejected_cheque_id = $(this).attr('id').split('_');
            rejectedTotal += parseFloat(amountFormatR($('.pay_amount_cls',this).text()));
            rejected_cheque = {
                'rejected_cheque_id': rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
    
    var cheques_json = new Array();
    var cqktr_id;
    $('#viewChequesGrid  tr[id^="SelectedCheque_"]').each(function(){
        var cqktr = $(this);
        cqktr_id = cqktr.attr('id').split('_');
        selectedTotal += parseFloat(amountFormatR($('.pay_amount_cls',this).text()));
        acreditacion_hrs = $('[name="acreditacion_hrs"]',cqktr).val();
        var cheque = {
            'cheque_id': cqktr_id[1],//left for compatibility purposes
            'id': cqktr_id[1],
            'acreditacion_hrs': acreditacion_hrs,
        }
        cheques_json.push(cheque);		
    });			
    $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));
        
    payTotal += operationsTotal + rejectedTotal;
    //final_amountInv = payTotal * -1;
    var balance = (payTotal - selectedTotal) * -1;
    
    $('.operationsTotal_span', '#operationGrid').text(amountFormat(operationsTotal));
    $('.rejectedTotal_span',  '#rejectedGrid').text(amountFormat(rejectedTotal));    
    $('.pay_final_amount_span', '#operationGridADDst').text(amountFormat(payTotal));
    $('#pay_final_amount', '#operationGridADDst').val(amountFormat(payTotal));
    
    //$('.selectedTotal_span').text(amountFormat(selectedTotal));
    $('#selectedTotal').val(selectedTotal);
    //payTotal = parseFloat($('#pay_final_amount').val());
	
    var frontFinalView = $('.finalPayView');	
    //var pay_final_amount = parseFloat(amountFormatR($('#pay_final_amount').val()));
    //var payingAmount = parseFloat(amountFormatR($('#selectedChequesTotal').val()))?parseFloat(amountFormatR($('#selectedChequesTotal').val())):0;
    	
    $('.payCls',frontFinalView).text(amountFormat(payTotal));
    $('.payingCls',frontFinalView).text(amountFormat(selectedTotal));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
}

function finalBalanceWithChkOnEdit()
{   
    var prevBalance,acredAmount,liqData,operationid,payTotal,final_amountInv,operationsTotal,operation,rejected_cheque_id,rejectedTotal,selectedTotal,rejected_cheque, acreditacion_hrs;
    var operations_json = new Array();
    prevBalance = acredAmount = payTotal = operationsTotal = rejectedTotal = selectedTotal = 0;
    
    var PayChecksForm = $('#PayChecksEditForm');
	
    if(parseFloat(amountFormatR($('.prev_balance', '#operationGridADDstView').val()))) {
        prevBalance = parseFloat(amountFormatR($('.prev_balance', '#operationGridADDstView').val()));
        //PreviousBalance	= amountFormatR($('.pay_amount_cls',this).text());
        //final_amount +=	PreviousBalance;			
    }
    if(parseFloat($('.pay_amount_cls', '#operationGridADDstView').val())){
        acredAmount = parseFloat(amountFormatR($('.pay_amount_cls', '#operationGridADDstView').val()));
        //final_amount += amountFormatR($('.pay_amount_cls',this).text());
        //acreditacion = amountFormatR($('.pay_amount_cls',this).text());
    }
    
    $('#operationGridView tbody tr[id^="editoperationlistid_"]').each(function(){
        if($('[name="editOperation"]',this).is(':checked')){
            operationid = $(this).attr('id').split('_');
            operationsTotal += amountFormatR($('.pay_amount_cls',this).text());
            operation = {
                'operation_id': operationid[1]
            };
            operations_json.push(operation);
        }
    });
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
    $('.operationsTotal_span', '#operationGridView').text(amountFormat(operationsTotal));
       
    var rejected_cheques_json =	new Array();
    $('#rejectedGridView tbody tr[id^="editrejectedchequelistid_"]').each(function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            rejected_cheque_id = $(this).attr('id').split('_');
            rejectedTotal += amountFormatR($('.pay_amount_cls',this).text());
            rejected_cheque = {
                'rejected_cheque_id': rejected_cheque_id[1]
            };
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
    $('.rejectedTotal_span', '#rejectedGridView').text(amountFormat(rejectedTotal));    
    
    //calculate totals and display
    payTotal = operationsTotal + rejectedTotal - acredAmount;
    $('.pay_final_amount_span', '#operationGridADDstView').text(amountFormat(payTotal));
    $('#pay_final_amount', '#operationGridADDstView').val(amountFormat(payTotal));
    
    liqData = _liqDataEdit; //global liq data set to current liq on liq view.   
    var cheques_json = new Array();
    var checksArr = [];
    var x = 0;
    $('#viewChequesGridView [name="editli"]').each(function(){
        if($(this).is(':checked')) {
            var cqktr = $(this).parents('tr:eq(0)');
            var cqktr_id = cqktr.attr('id').split('_');           
            //selectedTotal += amountFormatR($('.chk_final_amount',cqktr).text());
            acreditacion_hrs = $('[name="acreditacion_hrs"]',cqktr).val();
            var cheque	= {
                'cheque_id': cqktr_id[1],
                'acreditacion_hrs': acreditacion_hrs
            };
            var selAmount = amountFormatR($('.chk_amount',cqktr).text());           
            var location_capital = parseInt($('[name="location_capital"]',cqktr).val());
            var date = $('.check_date',cqktr).text();
            var chequeTodayDetails = getCheckValue(selAmount, date, location_capital, liqData);
            
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
            cheques_json.push(cheque);
        }
    });	
    //add selected checks ids to json
    $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));    
    
    
    //calculate check totals and display in table footer
    var checksTotals = calculateChecksTotals(checksArr);
    $('#selectedChequesTotalsView', '#viewChequesGridView').html(
        '<tr class="checks-totals-th"><td>&nbsp;</td><td>N. CHEQUES</td><td>DIAS PROM.</td><td>BRUTO</td><td>IMP. AL CHEQUE</td><td>INTERESES</td><td>GASTOS INT.</td><td>GASTOS CAP.</td><td>GASTOS OTROS</td><td>SUBTOTAL</td></tr>'+
        '<tr><td>&nbsp;</td>'+
        '<td><span class="fn_chequeChkCount">'+checksTotals.chequeChkCount+'</span></td>'+
        '<td><span class="fn_dayAvg">'+checksTotals.dayAvg.toFixed(2)+'</span></td>'+
        '<td><span class="fn_payingAmount">'+amountFormat(checksTotals.bruto)+'</span></td>'+
        '<td><span class="fn_impuestoAlCheque">'+amountFormat(checksTotals.impuestoAlCheque)+'</span></td>'+                        
        '<td><span class="fn_interests">'+amountFormat(checksTotals.intereses)+'</span></td>'+
        '<td><span class="fn_gastos_interior">'+amountFormat(checksTotals.gastosInterior)+'</span></td>'+
        '<td><span class="fn_cost_general">'+amountFormat(checksTotals.gastosGeneral)+'</span></td>'+
        '<td><span class="fn_other_cost">'+amountFormat(checksTotals.gastosOtros)+'</span></td>'+
        '<td><span class="paying_amount_span">'+amountFormat(checksTotals.payingAmount)+'</span></td></tr>');
	
    //final_amountInv = payTotal * -1;
    var balance = prevBalance - payTotal + checksTotals.payingAmount;    
    var frontFinalView = $('.finalPayViewByLiquidacionesId');	
    $('.payCls',frontFinalView).text(amountFormat(payTotal));
    $('.payingCls',frontFinalView).text(amountFormat(checksTotals.payingAmount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));            
    
    //set form data
    $('[name="previous_account_balance"]',PayChecksForm).val(prevBalance);    
    $('[name="acreditacion"]',PayChecksForm).val(acredAmount);
    $('[name="amount_debt"]',PayChecksForm).val(payTotal);
    $('[name="amount_payed"]',PayChecksForm).val(checksTotals.payingAmount);  
    $('[name="current_account_balance"]',PayChecksForm).val(balance);
          
    $('[name="checks_qty"]',PayChecksForm).val(checksTotals.chequeChkCount);
    $('[name="average_days"]',PayChecksForm).val(checksTotals.dayAvg.toFixed(2));
    $('[name="total_bruto"]',PayChecksForm).val(checksTotals.bruto);
    $('[name="impuesto_al_cheque_amt"]',PayChecksForm).val(checksTotals.impuestoAlCheque);
    $('[name="intereses"]',PayChecksForm).val(checksTotals.intereses);
    $('[name="gastos_interior"]',PayChecksForm).val(checksTotals.gastosInterior);
    $('[name="gastos_general"]',PayChecksForm).val(checksTotals.gastosGeneral);
    $('[name="gastos_varios"]',PayChecksForm).val(checksTotals.gastosOtros);
    $('[name="total_neto"]',PayChecksForm).val(checksTotals.payingAmount);
}

function changeChkOnAdd(c_this){
    var balanceAmount;
    if(!c_this){
        return false;
    }
    var qtyCls = $('.chequesTotalShowTable .qtyCls');
    var payCls = $('.chequesTotalShowTable .payCls');
    var payingCls = $('.chequesTotalShowTable .payingCls');
    var balanceCls = $('.chequesTotalShowTable .balanceCls');
    var payAmount = amountFormatR(payCls.text()) * -1;
    var selAmount = amountFormatR(payingCls.text());
    var cqktr = c_this.parents('tr:eq(0)');
    var qty = parseInt(qtyCls.text());
	
    if(c_this.is(':checked')){
        selAmount += amountFormatR($('.user_amount_today',cqktr).text());
        qty++;
    }else{
        selAmount -= amountFormatR($('.user_amount_today',cqktr).text());
        qty--;
    }	
    balanceAmount = payAmount + selAmount;
    payingCls.text(amountFormat(selAmount));
    balanceCls.text(amountFormat(balanceAmount));
    qtyCls.text(qty.toString());
}

function changeChkOnOpen(){
    /*var qtyCls		= ;
    var payCls		= $('.chequesTotalShowTable .payCls');
    var payingCls	= ;
    var balanceCls	= ;*/
    var balanceAmount	= 0;
    var selAmount	= 0.00;
    var qty             = 0;
	
    $('.chequeChk:checked').each(function(){
        var cqktr = $(this).parents('tr:eq(0)');
        selAmount += amountFormatR($('.user_amount_today',cqktr).text());
        qty++;
    });	
    
    balanceAmount = amountFormatR($('.chequesTotalShowTable .balanceCls').text()) + selAmount;
    $('.chequesTotalShowTable .payingCls').text(amountFormat(selAmount));
    $('.chequesTotalShowTable .balanceCls').text(amountFormat(balanceAmount));
    $('.chequesTotalShowTable .qtyCls').text(qty.toString());
}

function createchequegrid(data, passingLimit)
{
    var chequesEnCartera,location_capital,inp_chk,jsonData,cheque_id,business,client_id,operation_id,
    date,check_n,amount,todayValue,first_name,last_name,cheque_state_id,acDate,acHrs,descuento,impCheque,gastos,gastosOtros,days;
    var dataArr = new Array();

    for(var x in data)
    {
        jsonData = data[x];
        client_id = jsonData['client_id'];
        //client_business = jsonData['client_business'];
        cheque_id = jsonData['cheque_id'];
        operation_id = jsonData['operation_id'];
        date = jsonData['date'];
        check_n = jsonData['check_n'];
        amount = jsonData['amount'];
        todayValue = jsonData['today_value'];
        //cheque_status = jsonData['cheque_status'];
        first_name = jsonData['first_name'];
        last_name = jsonData['last_name'];
        cheque_state_id = jsonData['cheque_state_id'];
        //status_list = jsonData['status_list'];
        business = (jsonData['business'] != null)?jsonData['business']:'';
        location_capital = jsonData['location_capital'];
        //zip_code = jsonData['zip_code'];
        days = jsonData['days'];
        acDate = jsonData['ac_date'];
        acHrs = jsonData['ac_hrs'];
        descuento = jsonData['descuento'];
        impCheque = jsonData['imp_al_cheque'];
        gastos = jsonData['gastos'];
        gastosOtros = jsonData['gastos_otros'];
        
        if(jsonData['rejChecks'] == 1) 
            inp_chk = '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/><span style="color:red;font-size:14px;font-weight:bold;" title="Cliente posee cheques rechazados con proveedor"> ! </span>';
        else if(jsonData['maxChecks'] == 1)
            inp_chk = '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/><span style="color:red;font-size:14px;font-weight:bold;" title="Hay '+passingLimit+' o más cheques pasados a este proveedor"> > </span>';
        else
            inp_chk = '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/>';

        inp_chk += '<input type="hidden" class="clickedChkbox" client_id="'+client_id+'" value="false" />'; //used when checkbox is clicked.
        
        if (client_id != null) {
            dataArr.push([
                inp_chk,
                cheque_id,
                '<span class="user_operation_id">'+first_name+' '+last_name+'<input type="hidden" value="'+operation_id+'" name="operation_id"/>'+'<input type="hidden" value="'+location_capital+'" name="location_capital"/></span>',
                '<span class="user_bank_name">'+business+'</span>',
                '<span class="user_date">'+date+'</span>',
                '<span class="user_check_n">'+check_n+'</span>',                
                //'<span class="user_amount">'+amountFormat(amount)+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/></span>',
                '<span class="user_amount">'+amountFormat(amount)+'</span>',
                '<span class="user_amount_today">'+amountFormat(todayValue)+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/></span>'+
                '<input type="hidden" value="'+days+'" name="days" />'+    
                '<input type="hidden" value="'+acDate+'" name="ac_date" />'+
                '<input type="hidden" value="'+acHrs+'" name="ac_hrs" />'+
                '<input type="hidden" value="'+descuento+'" name="descuento" />'+
                '<input type="hidden" value="'+impCheque+'" name="imp_cheque" />'+
                '<input type="hidden" value="'+gastos+'" name="gastos" />'+
                '<input type="hidden" value="'+gastosOtros+'" name="gastos_otros" />'
            ]);
        }
    }    
    trmade = $('#chequesGrid').dataTable().fnAddData( dataArr );
    dataArr = null;
    data = null;

    $('#viewChequesGrid [id^="SelectedCheque_"]').each(function(){
        var vcgId = $(this).attr('id').split('_');
        $('#chequesGrid  .chequeChk[id="userid_'+vcgId[1]+'"]').attr({
            'checked':'checked'
        });
    });

    //changeChkOnAdd();
}

function createchequegridOld(data){
    var zip_code,location_capital,jsonData,cheque_id,operation_id,date,check_n,amount,cheque_status,first_name,last_name,cheque_state_id,status_list,bank_name,chequeTodayDetails,liqData;
    var trmade;
    var dataArr = new Array();
    
    liqData = {
        'liqDate':currentdate, //global var with server current date or liquidacion date (if changed from current date);
        'impuestoAlCheque': parseFloat($('.impuesto_al_cheque').val()),
        'tasaAnual': parseFloat($('.tasa_anual').val()),
        'acCapital': parseInt($('.acreditacion_capital').val()),
        'acInterior': parseInt($('.acreditacion_interior').val()),
        'gastosGeneral': parseFloat($('.gastos_general').val()),
        'gastosInterior': parseFloat($('.gastos_interior').val()),
        'gastosChequeMenorA1': parseFloat($('.gastos_cheque_menor_a_1').val()),
        'gastosFeeChequeMenorA1': parseFloat($('.gastos_cheque_a_1').val()),
        'gastosChequeMenorA2': parseFloat($('.gastos_cheque_menor_a_2').val()),
        'gastosFeeChequeMenorA2': parseFloat($('.gastos_cheque_a_2').val())
    };
        
    for(var x in data)
    {
        jsonData = data[x];
        cheque_id = jsonData['cheque_id'];
        operation_id = jsonData['operation_id'];
        date = jsonData['date'];
        check_n = jsonData['check_n'];
        amount = jsonData['amount'];
        cheque_status = jsonData['cheque_status'];
        first_name = jsonData['first_name'];
        last_name = jsonData['last_name'];
        cheque_state_id = jsonData['cheque_state_id'];
        status_list = jsonData['status_list'];
        bank_name = jsonData['bank_name'];
        zip_code = jsonData['zip_code'];
        location_capital = jsonData['location_capital'];
                
        chequeTodayDetails = getCheckValue(amount, date, location_capital, liqData);
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
