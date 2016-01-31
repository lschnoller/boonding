$(function() {
    var caveForm = $('#caveForm');
    $('.caveIdBtn').click(function(){
        if($('[name="cave_id"]',caveForm).val()	==	''){
            showmsg("Por favor seleccione un proveedor","t");
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
        //"sScrollX": "100%",
        "bInfo": false,
        "bPaginate": false,
        "bScrollCollapse": true,
        "bAutoWidth": true,
        'aoColumns': [{"sSortDataType": "dom-checkbox"}, null, null, null, {'sType': 'us_date'}, {'sType':'num-html'},{'sType': 'currency'}, {'sType': 'currency'}],
        "aaSorting": [[ 4, "asc" ]]
    });
    vgoSettings = vgTable.fnSettings();

    // Show an example parameter from the settings
    var edBtn = "<span style='float:left;'><span class='btn30 gridBtn' limit='30'>Mostrar 30 dias</span>";
    edBtn += "<span class='btn40 gridBtn' limit='40'>Mostrar 40 dias</span>";
    edBtn += "<span class='' style='margin-left:10px; font:12px geneva, sans-serif; text-transform:uppercase'>Mostrar </span><input type='text' name='get_chk_inp' value='' style='width:50px;'/><span class='btnInp gridBtn'>dias </span></span>";
    $('#chequesGrid_wrapper .fg-toolbar').append(edBtn);
    
    opTable = $('#operationGrid').dataTable({
        "bJQueryUI": true,
        "sScrollX": "100%",
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate": false,
    });
    
    vcTable = $('#viewChequesGrid').dataTable({
        "bJQueryUI": true,
        "sScrollX": "100%",
        "bFilter": false,
        "bInfo": false,
        "bSort" : false,
        "bPaginate": false
    });

    cdliTable = $('#chequesDetailsByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        "bAutoWidth": true,
        "bFilter": false,
        "bInfo": false,
        "bSort": false,
        "bPaginate": false,
        "bScrollCollapse": true,
        "sScrollXInner": "100%",
        "bLengthChange": false
    });

    vgliTable = $('#chequesGridByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        "bFilter": false,
        "bInfo": false,
        "bSort" : true,
        "bPaginate"	: false,
        "bScrollCollapse"	: true,
        "sScrollXInner": "100%",
        'aoColumns': [null, null, {'sType':'num-html'}, null, null, {'sType': 'us_date'}, {'sType': 'us_date'}, null, null, {'sType': 'currency'}],
        "aaSorting": [[7, "asc" ]]
    });
    
    ogliTable = $('#operationGridByLiquidacionesId').dataTable({
        //"bJQueryUI": true,
        //"bAutoWidth": true,
        "bFilter": false,
        "bInfo": false,
        "bSort": false,
        "bPaginate": false,
        "bScrollCollapse": true,
        "sScrollXInner": "100%"
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
        var result = confirm('Esta seguro que desea eliminar?');

        if(result){
            var anSelected = fnGetSelected( oTable );
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/chequedeleteajax";
            $.post(url, {
                "id"   : selIdArr[1]
            },
            function(data){
                if(isInt(data)){
                    showmsg("El usuario ha sido eliminado.",'t');
                    oTable.fnDeleteRow( anSelected[0] );
                }else{
                    showmsg("El usuario no pudo ser eliminado. \n Por favor intente nuevamente.",'f');
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
            "Listo": function() 
            {
                var dayAvg,balance,payingAmount,selAmount,totalDays,cqktr,cqktr_id,location_capital,chequeTodayDetails,trmade,nTr;
                var impuestoAlCheque,intereses,bruto, chequeChkCount,gastosGeneral,gastosInterior,gastosOtros,plazo,zip;
                impuestoAlCheque=intereses=bruto=payingAmount=totalDays=chequeChkCount=gastosGeneral=gastosInterior=gastosOtros=0;
                var chequeFlag = false;
                var date = '';
                
                vgTable.fnFilter('');
                $(this).dialog( "close" );
                vcTable.fnClearTable();
                var oSettings = vcTable.fnSettings();
                
                var acreditacionCapital	= parseInt($('.acreditacion_capital').val());
                var acreditacionInterior = parseInt($('.acreditacion_interior').val());
                
                $('.chequeChk:checked').each(function()
                {                   
                    cqktr = $(this).parents('tr:eq(0)');
                    cqktr_id = $(this).attr('id').split('_');
                    selAmount = amountFormatR($('.user_amount',cqktr).text());						
                    location_capital = parseInt($('[name="location_capital"]',cqktr).val());
                    date = $('.user_date',cqktr).text();
                    chequeTodayDetails = getCheckValue(selAmount, date, location_capital, null, null);
                    
                    //calculate totals
                    chequeChkCount++;
                    bruto += selAmount;
                    totalDays += chequeTodayDetails.days;
                    payingAmount += chequeTodayDetails.todayValue;  
                    impuestoAlCheque += chequeTodayDetails.impuestoAlCheque;
                    intereses += chequeTodayDetails.daysDiscountFee;
                    
                    if (location_capital == 1) {
                        gastosGeneral += chequeTodayDetails.gastos;
                        plazo = acreditacionCapital;
                        zip = 'Capital'
                    }
                    else {
                        gastosInterior += chequeTodayDetails.gastos;
                        plazo = acreditacionInterior;
                        zip = 'Interior';
                    }
                    gastosOtros += chequeTodayDetails.gastosOtros;
                    
                    trmade = $('#viewChequesGrid').dataTable().fnAddData( [
                        $('.user_operation_id',cqktr).text(),
                        $('.user_bank_name',cqktr).text(),
                        $('.user_check_n',cqktr).text(),
                        zip,
                        plazo + '<input type="hidden" name="acreditacion_hrs" value="'+chequeTodayDetails.acreditacionHrs+'"/>',
                        date,
                        chequeTodayDetails.acreditationDate,
                        chequeTodayDetails.days,
                        amountFormat(selAmount)
                    ]);                    
                    
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'SelectedCheque_'+cqktr_id[1];
                    chequeFlag	=	true;
                });
                
                if(chequeFlag) {
                    trmade = $('#viewChequesGrid').dataTable().fnAddData( ['','','','','','','','','-'] );
                    trmade = $('#viewChequesGrid').dataTable().fnAddData( ['Cant. Cheques','D&iacute;as Promedio','Bruto','Impuesto Al Cheque','Intereses','Gs. Interior','Gs. Grales','Gs. Otros','Subtotal'] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    $(nTr).attr({
                        'style':'background:#CCCCCC;font-weight:bold;'
                    });
                    dayAvg = totalDays/chequeChkCount;
                    //gastosOtros += amountFormatR($("#operationGrid [name='acreditacion']").val()) ? amountFormatR($("#operationGrid [name='acreditacion']").val()) : 0;                    
                    //todayValue = chequeAmt - impuestoAlCheque - descuento - gastos - gastosOtros;
 
                    trmade = $('#viewChequesGrid').dataTable().fnAddData( [
                        '<span class="fn_chequeChkCount">'+chequeChkCount+'</span>',
                        '<span class="fn_dayAvg">'+dayAvg.toFixed(2)+'</span>',
                        '<span class="fn_payingAmount">'+amountFormat(bruto)+'</span>',
                        '<span class="fn_impuestoAlCheque">'+amountFormat(impuestoAlCheque)+'</span>',                        
                        '<span class="fn_interests">'+amountFormat(intereses)+'</span>',
                        '<span class="fn_gastos_interior">'+amountFormat(gastosInterior)+'</span>',
                        '<span class="fn_cost_general">'+amountFormat(gastosGeneral)+'</span>',
                        '<span class="fn_other_cost">'+amountFormat(gastosOtros)+'</span>',
                        '<span class="paying_amount_span">'+amountFormat(payingAmount)+'</span>'
                    ]);
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'liqSupDetials';
                }
                
                var frontFinalView = $('.finalPayView');
                pay_final_amount = amountFormatR($('#pay_final_amount').val());
                balance = payingAmount - pay_final_amount;
                
                $('.payCls',frontFinalView).text(amountFormat(pay_final_amount));
                $('.payingCls',frontFinalView).text(amountFormat(payingAmount));
                $('.balanceCls',frontFinalView).text(amountFormat(balance));
                
                //set vals
                var PayChecksForm = $('#PayChecksForm');
                $('[name="amount_payed"]',PayChecksForm).val(amountFormatR(payingAmount));        
                $('[name="checks_qty"]',PayChecksForm).val(chequeChkCount);
                $('[name="average_days"]',PayChecksForm).val(dayAvg.toFixed(2));
                $('[name="total_bruto"]',PayChecksForm).val(amountFormatR(bruto));
                $('[name="impuesto_al_cheque_amt"]',PayChecksForm).val(amountFormatR(impuestoAlCheque));
                $('[name="intereses"]',PayChecksForm).val(amountFormatR(intereses));
                $('[name="gastos_interior"]',PayChecksForm).val(amountFormatR(gastosInterior));
                $('[name="gastos_general"]',PayChecksForm).val(amountFormatR(gastosGeneral));
                $('[name="gastos_varios"]',PayChecksForm).val(amountFormatR(gastosOtros));
                $('[name="total_neto"]',PayChecksForm).val(amountFormatR(payingAmount));
            },
            
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });

    var chequeListByLiquidacionesId = $( ".chequeListByLiquidacionesId" ).dialog({
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

    $('.sendCheques').click(function()
    {        
        var acreditacion_hrs,cqktr,cqktr_id,cheque;
        var frontFinalView	=	$('.finalPayView');
        //$('.payCls',frontFinalView).text();
        //currentdate                 = $('.currentDateLiq').val();
        //var amount_payed            = amountFormatR($('.payingCls',frontFinalView).text());
        var current_account_balance = amountFormatR($('.balanceCls',frontFinalView).text());
        var PayChecksForm           = $('#PayChecksForm');        
        var operations_json         = new Array();
        var cheques_json            = new Array();
        var rejected_cheques_json   = new Array();
        //var liqSupDetials = $("#liqSupDetials");
        
        //set the prev balance value        
        $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
            $('[name="previous_account_balance"]',PayChecksForm).val(amountFormatR($('.pay_amount_cls',this).text()));
        });
        
        //set the selected operations
        $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
            if($('[name="operation_chk"]',this).is(':checked')){
                var operationid	=	$(this).attr('id').split('_');
                var operation	= 	{
                    'operation_id'	:	operationid[1]
                }
                operations_json.push(operation);
            }
        });        
        
        //set the rejected checks
        $('#operationGrid tbody tr[id^="RejectedCheque_"]').each(function(){
            if($('[name="rejected_chk"]',this).is(':checked')){
                var rejected_cheque_id	=	$(this).attr('id').split('_');
                var rejected_cheque	= 	{
                    'rejected_cheque_id'	:	rejected_cheque_id[1]
                }
                rejected_cheques_json.push(rejected_cheque);
            }
        });         
        
        //set the selected checks
        $('#viewChequesGrid  tr[id^="SelectedCheque_"]').each(function(){
            cqktr = $(this);
            cqktr_id = cqktr.attr('id').split('_');
            acreditacion_hrs = $('[name="acreditacion_hrs"]',cqktr).val();
            cheque = {
                'cheque_id': cqktr_id[1],
                'acreditacion_hrs': acreditacion_hrs,
            }
            cheques_json.push(cheque);
        });        
        
        $('[name="cheques_json"]',PayChecksForm).val(JSON.stringify(cheques_json));        
        $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json));
        $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json));
        $('[name="date"]',PayChecksForm).val($('.currentDateLiq').val());
        $('[name="current_account_balance"]',PayChecksForm).val(current_account_balance);       

        PayChecksForm.submit();
    });

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    currentdate	=$('#ServerCurrentDate').val();
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
        
        var url = '/liquidaciones/getliquidacionesdetailssupplierajax';
        $.post(url, {
            'liquidaciones_id': bankid[1]
        },
        function(data)
        {
            if(data)
            {
                var trmade,item,oSettings,nTr,chequeChkCount,payingAmount,other_cost,selAmount,date,location_capital,html_location,liqDate,chequeTodayDetails,liqData;
                var totalDays,bruto,impuestoAlCheque,intereses,gastosGeneral,gastosInterior,gastosOtros,gastosG,gastosI;
                totalDays=bruto=chequeChkCount=payingAmount=impuestoAlCheque=intereses=gastosGeneral=gastosInterior=GastosOtros=payingAmount = 0;
                                               
                vgliTable.fnClearTable();
                vgliTable.fnSetColumnVis( 0, true );
                oSettings = vgliTable.fnSettings();
                
                var liquidacion	= data['liquidacion'];
                liqData = {
                    'impuestoAlCheque': liquidacion['impuesto_al_cheque'],
                    'tasaAnual': liquidacion['tasa_anual'],
                    'acCapital': liquidacion['acreditacion_capital'],
                    'acInterior': liquidacion['acreditacion_interior'],
                    'gastosGeneral': liquidacion['gastos_general'],
                    'gastosInterior': liquidacion['gastos_interior'],
                    'gastosGeneralFee': liquidacion['gastos_general_fee'],
                    'gastosInteriorFee': liquidacion['gastos_interior_fee'],
                    'gastosVarios': liquidacion['gastos_varios']
                };
                
                //create selected checks list
                var chequeListJson = data['chequesList']; 
                for(var x in chequeListJson)
                {
                    item = chequeListJson[x];
                    selAmount = amountFormatR(item['amount']);
                    date = item['date'];
                    location_capital = item['local'];
                    liqDate = item['liquidacion_date'];                    
                    chequeTodayDetails = getCheckValue(selAmount, date, location_capital, liqDate, liqData);                    
                    
                    //calculate totals
                    chequeChkCount++;
                    bruto += selAmount;
                    totalDays += chequeTodayDetails.days;
                    payingAmount += chequeTodayDetails.todayValue;  
                    impuestoAlCheque += chequeTodayDetails.impuestoAlCheque;
                    intereses += chequeTodayDetails.daysDiscountFee;                    
                    if (location_capital) {
                        gastosGeneral += chequeTodayDetails.gastos;
                        html_location = 'Capital'
                        gastosG = chequeTodayDetails.gastos;
                        gastosI = 0;
                    }
                    else {
                        gastosInterior += chequeTodayDetails.gastos;
                        html_location = 'Interior';
                        gastosG = 0;
                        gastosI = chequeTodayDetails.gastos;
                    }
                    gastosOtros += chequeTodayDetails.gastosOtros;
                    
                    trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( [
                        chk('editli',true),
                        '<span class="fe_name">'+item['first_name']+' '+item['last_name']+'</span>',
                        '<span class="fe_bank_name">'+item['bank_name']+'</span>',
                        '<span class="fe_check_n">'+item['check_n']+'</span>',
                        '<span class="fe_check_zip_code">'+html_location+'</span>',
                        '<span class="fe_hour_diff">'+chequeTodayDetails.acreditationHrs+'</span>',
                        '<span class="fe_date">'+date+'</span>',
                        '<span class="fe_l_date">'+chequeTodayDetails.acreditationDate+'</span>',
                        '<span class="fe_date_diff">'+chequeTodayDetails.days+'</span>',
                        '<span class="chk_final_amount">'+amountFormat(selAmount)+'</span>'
                            +'<input type="hidden" class="fe_today_value" value="'+amountFormatR(chequeTodayDetails.todayValue)+'" />'
                            +'<input type="hidden" class="fe_impuesto_al_cheque" value="'+amountFormatR(chequeTodayDetails.impuestoAlCheque)+'" />'
                            +'<input type="hidden" class="fe_intereses" value="'+amountFormatR(chequeTodayDetails.daysDiscountFee)+'" />'
                            +'<input type="hidden" class="fe_gastos_generales" value="'+amountFormatR(gastosG)+'" />'
                            +'<input type="hidden" class="fe_gastos_interior" value="'+amountFormatR(gastosI)+'" />'
                            +'<input type="hidden" class="fe_gastos_otros" value="'+amountFormatR(chequeTodayDetails.gastosOtros)+'" />',
                    ] );
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editchequelistid_'+item['id'];
                };
                
                //create selected cheques details table
                //$("table#chequesDetailsByLiquidacionesId").parent().html('');
                cdliTable.fnClearTable();
                cdoSettings = cdliTable.fnSettings();                
                trmade = $('#chequesDetailsByLiquidacionesId').dataTable().fnAddData( [
                    '<span class="fn_chequeChkCount">'+chequeChkCount+'</span>',
                    '<span class="fn_dayAvg">'+amountFormat(totalDays / chequeChkCount)+'</span>',
                    '<span class="fn_payingAmount">'+amountFormat(bruto)+'</span>',
                    '<span class="fn_impuestoAlCheque">'+amountFormat(impuestoAlCheque)+'</span>',
                    '<span class="fn_interests">'+amountFormat(intereses)+'</span>',
                    '<span class="fn_cost_general">'+amountFormat(gastosGeneral)+'</span>',
                    '<span class="fn_gastos_interior">'+amountFormat(gastosInterior)+'</span>',
                    '<span class="fn_other_cost">'+amountFormat(gastosOtros)+'</span>' ,
                    '<span class="paying_amount_span_edit">'+amountFormat(payingAmount)+'</span>' ,
                ]);
                nTr = cdoSettings.aoData[ trmade[0] ].nTr;
                nTr.id = 'liqSupDetials_edit';
                //$('#chequesDetailsByLiquidacionesId').dataTable();
                //var trmade = $('#chequesGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','','','-'] );
                
                //****************************************************************************
                //create operations and rejected check table
                var opertationsListJson	= data['opertationsList'];
                ogliTable.fnClearTable();
                ogliTable.fnSetColumnVis( 0, true );
                var amount,amountCave,commision,finalAmount,acreditacion,totalFinalAmount = 0;
                
                oSettings = ogliTable.fnSettings();
                $('#PayChecksEditForm [name="date"]').val(liquidacion['date']);
                $('#PayChecksEditForm [name="id"]').val(liquidacion['id']);
                
                if(liquidacion){
                    var previous_account_balance = amountFormatR(liquidacion['previous_account_balance']);
                    //acreditacion = amountFormatR(liquidacion['gastos_varios']);
                    if(previous_account_balance)
                    {
                        totalFinalAmount += previous_account_balance;
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData(['', '', '', '', '', '', '', 'Balance',
                            '<span class="pay_amount_cls">'+amountFormat(previous_account_balance)+'</span>']);
                        nTr = oSettings.aoData[trmade[0]].nTr;
                        nTr.id = 'PreviousBalance';
                    } 
                }
/*no operations with suppliers
                for(var x in opertationsListJson){
                    item	=	opertationsListJson[x];
                    amount	=	amountFormatR(item['amount']);
                    amountCave	=	amount/2;
                    commision	=	amountCave*15/100;
                    finalAmount	=	amountCave-commision;
                    totalFinalAmount += finalAmount;
                    trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [
                        chk('editOperation',true),
                        item['first_name']+' '+item['last_name'],
                        amountFormat(amount),
                        amountFormat(amountCave),
                        '-'+amountFormat(commision),
                        '',
                        '',
                        '',
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                    ]);
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editoperationlistid_'+item['operationid'];
                    $("td:eq(8)",nTr).addClass('operation_amount');
                }
*/
                //create rejected checks list
                var rejectedChequesJson	= data['rejectedCheques'];
                var rejected_cheques_fee = 0.00;
                for(var x in rejectedChequesJson)
                {
                    item = rejectedChequesJson[x];
                    amount = parseFloat(item['amount']);
                    rejected_cheques_fee = parseFloat(item['rejected_cost_prov']);
                    finalAmount = amount + rejected_cheques_fee;
                    totalFinalAmount += finalAmount;
                    trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( [
                        chk('editRejectedCheque',true),
                        item['first_name']+' '+item['last_name'],
                        item['date'],
                        item['check_n'],
                        amountFormat(amount),
                        amountFormat(rejected_cheques_fee),
                        '<span class="pay_amount_cls">'+amountFormat(finalAmount)+'</span>',
                    ]);
                    nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'editrejectedchequelistid_'+item['id'];
                    $(nTr).attr({
                        'style':'background:#E3E3E3;'
                    });
                    $("td:eq(8)",nTr).addClass('rejected_cheque_amount');
                }
                
                if(liquidacion)
                {
                    if (comitted) {
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['', '', '', '', '', 'Acreditaci&oacute;n', 
                            '<span>' + amountFormat(liquidacion['acreditacion']) + '</span>'
                            + '<input type="hidden" class="pay_amount_cls" value="' + amountFormatR(liquidacion['acreditacion']) + '" size="5" />']);
                        nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'Acreditacion';
                    } else {
                        trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['', '', '', '', '', 'Acreditaci&oacute;n', 
                            '<input type="text" class="pay_amount_cls" value="'+amountFormatR(liquidacion['acreditacion'])+'" size="5" />']);
                        nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'Acreditacion';
                    }
                    totalFinalAmount -=	amountFormatR(liquidacion['acreditacion']);
                }
                
                //trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','-',] );
                trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','SALDO A LIQUIDAR','<span class="pay_final_amount_span_edit">'+amountFormat(totalFinalAmount)+'</span>',] );
                nTr = oSettings.aoData[ trmade[0] ].nTr;
                $(nTr).addClass("total")
                $("td:eq(7)",nTr).addClass('greyBg');
                $("td:eq(8)",nTr).addClass('greyBg');
                //trmade = $('#operationGridByLiquidacionesId').dataTable().fnAddData( ['','','','','','','','','-',] );

                $('.finalPayViewByLiquidacionesId .payCls').text(amountFormat(totalFinalAmount));
                $('.loadOperations').hide();
                
                //call to set hidden inputs
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
                $('.finalPayViewByLiquidacionesId .payingCls').text(amountFormat(liquidacion['amount_payed']));
                $('.finalPayViewByLiquidacionesId .balanceCls').text(amountFormat(liquidacion['current_account_balance']));

            }else{
                $('.loadOperations').text('Hubo un problema, por favor intente nuevamente.');
            }
        },'json');
    });
    
    $('.cancelBtn').click(function(){
        var r=confirm("Esta seguro que desea eliminar esta liquidacion?");
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
        showmsg("Enviando correo",'f',true);
        //url += "/liquidacion_id/"+clientid+'/status/0';
        //window.open(url,'_blank');
        $.post(url, {
            "liquidacion_id"   : clientid,
            "status"		   : 0,
        },
        function(data){
            if(data){
                showmsg("El correo ha sido enviado correctamente",'t');

            }else{
                showmsg("Hubo un error al enviar el correo.",'t');
            }
        });

    });

    $('.btn40,.btn30,.chooseChequesBtn').click(function()
    {
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
        
        var thisBtn = $(this);
        if(thisBtn.hasClass('chooseChequesBtn')){
            vgTable.fnClearTable();
            $( ".chequeList" ).dialog('open');
            pay_final_amount = $('#pay_final_amount').val();
            payCls = $('.payCls');
            payCls.text(amountFormat(pay_final_amount));
        }        
        var url = '/liquidaciones/getchequesbysupplieridfilterajax';
        $.post(url, {
            "cave_id": $('[name="cave_selected_id"]').val(),
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
    });
    
    $('.btnInp').click(function(){
        var url = '/liquidaciones/getchequesbysupplieridfilterajax';
        $('#chequesGrid_wrapper .fg-toolbar').append('<div id="grid_processing" class="dataTables_processing" style="visibility: visible;border:1px solid red;color:red;">Cargando...</div>');
        $.post(url, {
            "cave_id": $('[name="cave_selected_id"]').val(),
            "pos": $(this).next('[name="get_chk_inp"]').val(),
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

/*
* La formula para calcular el valor al dia es la siguiente:
* valor al dia = importe - impuesto_al_cheque (% de importe) - descuento (importe * tasa_anual/360 (0.17%) * cantidad de dias) - gastos - cheque menor a 
* 
* PRE: when liqData is null, the values of the provider are taken as they are today. Otherwise, the liqData need to be specified with the provider values at the liquidacion date.
*/
function getCheckValue(chequeAmt, chequeDate, chequeLocation, liqDate, liqData)
{    
    var date_arc,acreditacion_hr,gastos,gastosOtros,gralDiscounts,descuento,todayValue,gastosFee,impuestoAlCheque,tasaDiaria,date_diff,temp1,temp2;
    tasaDiaria=gastosOtros = 0;
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
            'gastosChequeMenorA1': parseFloat($('.gastos_cheque_menor_a_1').val()),
            'gastosFeeChequeMenorA1': parseFloat($('.gastos_cheque_a_1').val()),
            'gastosChequeMenorA2': parseFloat($('.gastos_cheque_menor_a_2').val()),
            'gastosFeeChequeMenorA2': parseFloat($('.gastos_cheque_a_2').val())
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
    
    //theres's a fee for small cheques
    if (liqData.gastosChequeMenorA1)
    {
        //make sure cheque menor a 1 is smaller than 2
        if (liqData.gastosChequeMenorA1 > liqData.gastosChequeMenorA2) {
            temp1 = liqData.gastosChequeMenorA1;
            temp2 = liqData.gastosFeeChequeMenorA1;
            liqData.gastosChequeMenorA1 = liqData.gastosChequeMenorA2;
            liqData.gastosFeeChequeMenorA1 = liqData.gastosFeeChequeMenorA2;
            liqData.gastosChequeMenorA2 = temp1;
            liqData.gastosFeeChequeMenorA2 = temp2;        
        }

        if (chequeAmt < liqData.gastosChequeMenorA1)
            gastosOtros = liqData.gastosFeeChequeMenorA1;
        else if (chequeAmt < liqData.gastosChequeMenorA2)
            gastosOtros = liqData.gastosFeeChequeMenorA2;
    }
    
    date_arc = add_days_by_hr(chequeDate, acreditacion_hr);    
    tasaDiaria = liqData.tasaAnual / 360; 
    
    date_diff = days_between(liqDate, date_arc);
    impuestoAlCheque = chequeAmt * liqData.impuestoAlCheque / 100;
    gastos = chequeAmt * gastosFee / 100;
    //gralDiscounts = (chequeAmt * (impuesto_al_cheque + gastos)) / 100; //impuesto al cheuqe and gastos are percentages.
    descuento = (chequeAmt * tasaDiaria / 100) * parseInt(date_diff);
    todayValue = chequeAmt - impuestoAlCheque - descuento - gastos - gastosOtros;

    var chequeDetails = {							                                                									                               		
        days: date_diff,
        todayValue: todayValue,
        impuestoAlCheque: impuestoAlCheque,
        gastos: gastos,
        gastosOtros: gastosOtros,
        daysDiscountFee: descuento,
        acreditationHrs: acreditacion_hr,
        acreditationDate: date_arc
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
    cMonth = cMonth>9?cMonth:'0'+cMonth;	
    cDate = dateTemp.getDate()>9?dateTemp.getDate():'0'+dateTemp.getDate();
        
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

function hours_between(dateOne, dateTwo) 
{
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

function chk(name,checked) {
    if(checked){
        checked	= 'checked="checked"';
    }else{
        checked	= '';
    }
    var chkbox	= '<input type="checkbox" name="'+name+'" '+checked+'/>'
    return chkbox;
}

function finalBalanceWithChk()
{
    var operations_json	= new Array();
    var final_amount	= 0;
    var PayChecksForm	= $('#PayChecksForm');
    var acreditacion  = 0;

    //add previous balance
    $('#operationGrid tbody tr[id^="PreviousBalance"]').each(function(){
        final_amount +=	amountFormatR($('.pay_amount_cls',this).text());
    });
    
    //substract acreditacion
    $('#operationGrid tbody tr[id^="Acreditacion"]').each(function(){
        acreditacion = amountFormatR($('.pay_amount_cls',this).val());
        if(acreditacion)
            final_amount -= acreditacion;
    });
    $('[name="acreditacion"]',PayChecksForm).val(acreditacion); //save acreditacion value
    
    //add up operations
    $('#operationGrid tbody tr[id^="operationsid_"]').each(function(){
        if($('[name="operation_chk"]',this).is(':checked')){
            var operationid = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var operation = {
                'operation_id': operationid[1]
            }
            operations_json.push(operation);
        }
    });
    $('[name="operations_json"]',PayChecksForm).val(JSON.stringify(operations_json)); //save operations

    //add up rejected checks
    var rejected_cheques_json = new Array();
    $('#operationGrid tbody tr[id^="RejectedCheque_"]').each(function(){
        if($('[name="rejected_chk"]',this).is(':checked')){
            var rejected_cheque_id = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var rejected_cheque	= {
                'rejected_cheque_id': rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    $('[name="rejected_cheques_json"]',PayChecksForm).val(JSON.stringify(rejected_cheques_json)); //save rejected checks
    
    $('.pay_final_amount_span').text(amountFormat(final_amount));
    $('#pay_final_amount').val(amountFormat(final_amount));
    //final_amount	=	amountFormatR($('#pay_final_amount').val());
    var frontFinalView = $('.finalPayView');
    pay_final_amount = amountFormatR($('#pay_final_amount').val());
    payingAmount = amountFormatR($('.paying_amount_span').text())?amountFormatR($('.paying_amount_span').text()):0;
    balance = payingAmount - final_amount;
    $('.payCls',frontFinalView).text(amountFormat(pay_final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(payingAmount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));
}

function finalBalanceWithChkOnEdit()
{
    var operations_json	= new Array();
    var final_amount = 0;
    var PayChequesEditForm = $('#PayChecksEditForm');
    var PreviousBalance	= 0;
    var acreditacion = 0;

    //add up the prev balance
    $('#operationGridByLiquidacionesId tbody tr[id^="PreviousBalance"]').each(function(){
        PreviousBalance	= amountFormatR($('.pay_amount_cls',this).text());
        final_amount +=	PreviousBalance;
    });
   
    //** substract the acreditacion value
    $('#operationGridByLiquidacionesId tbody tr[id^="Acreditacion"]').each(function(){
        if(amountFormatR($('.pay_amount_cls',this).val())){
            acreditacion = amountFormatR($('.pay_amount_cls',this).val());
            final_amount -= acreditacion;
        }
    });
    
    //add up all the operations
    $('#operationGridByLiquidacionesId tbody tr[id^="editoperationlistid_"]').each(function(){
        if($('[name="editOperation"]',this).is(':checked')){
            var operationid = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var operation = {
                'operation_id'	:	operationid[1]
            }
            operations_json.push(operation);
        }
    });    
    //add the selected operations to the hidden input for server-side use 
    $('[name="operations_json"]',PayChequesEditForm).val(JSON.stringify(operations_json));
    
    var rejected_cheques_json =	new Array();    
    //add up the rejected checks
    $('#operationGridByLiquidacionesId tbody tr[id^="editrejectedchequelistid_"]').each(function(){
        if($('[name="editRejectedCheque"]',this).is(':checked')){
            var rejected_cheque_id = $(this).attr('id').split('_');
            final_amount += amountFormatR($('.pay_amount_cls',this).text());
            var rejected_cheque	= {
                'rejected_cheque_id': rejected_cheque_id[1]
            }
            rejected_cheques_json.push(rejected_cheque);
        }
    });
    //add the rejected checks to the hidden input for server-side use 
    $('[name="rejected_cheques_json"]',PayChequesEditForm).val(JSON.stringify(rejected_cheques_json));
    
    //show the total value for the operations table
    $('#operationGridByLiquidacionesId .pay_final_amount_span_edit').text(amountFormat(final_amount));
    
    var cheques_json = new Array();
    var chk_bruto = 0;
    var chk_payingAmount = 0;
    var chk_count = 0;
    var chk_total_days = 0;
    var chk_impuestoAlCheque = 0;
    var chk_intereses = 0; 
    var chk_gastosGenerales = 0;
    var chk_gastosInterior = 0;
    var chk_gastosOtros = 0;
    //add up the selected checks
    $('#chequesGridByLiquidacionesId [name="editli"]').each(function(){
        if($(this).is(':checked')) {
            var cqktr = $(this).parents('tr:eq(0)');
            chk_bruto += amountFormatR($('.chk_final_amount',cqktr).text());
            chk_payingAmount += amountFormatR($('.fe_today_value',cqktr).val());
            chk_total_days += amountFormatR($('.fe_date_diff',cqktr).text());
            chk_impuestoAlCheque += amountFormatR($('.fe_impuesto_al_cheque',cqktr).val());
            chk_intereses += amountFormatR($('.fe_intereses',cqktr).val());
            chk_gastosGenerales += amountFormatR($('.fe_gastos_generales',cqktr).val());
            chk_gastosInterior += amountFormatR($('.fe_gastos_interior',cqktr).val());
            chk_gastosOtros += amountFormatR($('.fe_gastos_otros',cqktr).val());
            
            cqktr = cqktr.attr('id').split('_');
            var cheque	= {
                'cheque_id'	:	cqktr[1]
            }
            chk_count++;
        }
        cheques_json.push(cheque);
    });
    //add the selected checks to the hidden input for server-side use 
    $('[name="cheques_json"]',PayChequesEditForm).val(JSON.stringify(cheques_json));
    
    // create cheques details table
    var liqSupDetials =	$("#liqSupDetials_edit");
    var fn_dayAvg = chk_total_days / chk_count;    
    $('.fn_chequeChkCount',liqSupDetials).text(chk_count);
    $('.fn_dayAvg',liqSupDetials).text(fn_dayAvg.toFixed(2));
    $('.fn_payingAmount',liqSupDetials).text(amountFormat(chk_bruto));
    $('.fn_impuestoAlCheque',liqSupDetials).text(amountFormat(chk_impuestoAlCheque));
    $('.fn_interests',liqSupDetials).text(amountFormat(chk_intereses));
    $('.fn_cost_general',liqSupDetials).text(amountFormat(chk_gastosGenerales));
    $('.fn_gastos_interior',liqSupDetials).text(amountFormat(chk_gastosInterior));
    $('.fn_other_cost',liqSupDetials).text(amountFormat(chk_gastosOtros));
    $('.paying_amount_span_edit').text(amountFormat(chk_payingAmount));
    
    //update final amounts box
    var balance = chk_payingAmount - final_amount;    
    var frontFinalView = $('.finalPayViewByLiquidacionesId');
    $('.payCls',frontFinalView).text(amountFormat(final_amount));
    $('.payingCls',frontFinalView).text(amountFormat(chk_payingAmount));
    $('.balanceCls',frontFinalView).text(amountFormat(balance));

    //update input data for server-side
    $('[name="amount_payed"]',PayChequesEditForm).val(amountFormatR(chk_payingAmount));
    $('[name="current_account_balance"]',PayChequesEditForm).val(balance);
    $('[name="previous_account_balance"]',PayChequesEditForm).val(PreviousBalance);
    $('[name="acreditacion"]',PayChequesEditForm).val(acreditacion);
    $('[name="checks_qty"]',PayChequesEditForm).val(amountFormatR(chk_count));
    $('[name="average_days"]',PayChequesEditForm).val(fn_dayAvg);
    $('[name="total_bruto"]',PayChequesEditForm).val(amountFormatR(chk_bruto));
    $('[name="impuesto_al_cheque_amt"]',PayChequesEditForm).val(amountFormatR(chk_impuestoAlCheque));
    $('[name="intereses"]',PayChequesEditForm).val(amountFormatR(chk_intereses));    
    $('[name="gastos_interior"]',PayChequesEditForm).val(amountFormatR(chk_gastosInterior));
    $('[name="gastos_general"]',PayChequesEditForm).val(amountFormatR(chk_gastosGenerales));
    $('[name="gastos_varios"]',PayChequesEditForm).val(amountFormatR(chk_gastosOtros));
    $('[name="total_neto"]',PayChequesEditForm).val(amountFormatR(chk_payingAmount));    
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
    var selAmount           = amountFormatR(payingCls.text());    
    var cqktr           = c_this.parents('tr:eq(0)');
    var qty = parseInt(qtyCls.text());
    
    if(c_this.is(':checked')){
        selAmount += amountFormatR($('.user_amount_today',cqktr).text());
        balanceAmount = selAmount - amountFormatR(payCls.text());
        qty++;
    }else{
        selAmount -= amountFormatR($('.user_amount_today',cqktr).text());
        balanceAmount = selAmount + amountFormatR(payCls.text());
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

function createchequegrid(data)
{
    var chequesEnCartera,chequeTodayDetails,location_capital,inp_chk,rejClientIdArr,jsonData,cheque_id,business,client_id,operation_id,date,check_n,amount,first_name,last_name,cheque_state_id;
    var dataArr = new Array();
    rejClientIdArr = data['rejClientIdArr'];
    chequesEnCartera = data['chequesEnCartera'];

    for(var x in chequesEnCartera)
    {
        jsonData = chequesEnCartera[x];
        client_id = jsonData['client_id'];
        //client_business = jsonData['client_business'];
        cheque_id = jsonData['cheque_id'];
        operation_id = jsonData['operation_id'];
        date = jsonData['date'];
        check_n = jsonData['check_n'];
        amount = jsonData['amount'];
        //cheque_status = jsonData['cheque_status'];
        first_name = jsonData['first_name'];
        last_name = jsonData['last_name'];
        cheque_state_id = jsonData['cheque_state_id'];
        //status_list = jsonData['status_list'];
        business = jsonData['business'];
        location_capital = jsonData['location_capital'];
        //zip_code = jsonData['zip_code'];
        
        if (cheque_id == 1503)
            var do_something = cheque_id;
        
        chequeTodayDetails = getCheckValue(amount, date, location_capital, null, null);

        //client has rejected checks with prov
        if($.inArray(client_id,rejClientIdArr) >= 0) 
            inp_chk = '<input type="checkbox" class="chequeChk" client_id="'+client_id+'" id="userid_'+cheque_id+'"/><span style="color:red;font-size:14px;font-weight:bold;"> ! </span>';
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
                '<span class="user_amount_today">'+amountFormat(chequeTodayDetails.todayValue)+'<input type="hidden" value="'+cheque_state_id+'" name="status_id"/></span>',
            ]);
        }
    }
    vgTable.fnClearTable();
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