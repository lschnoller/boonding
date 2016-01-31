$(document).ready(function(){
	$("#AddPriorForm").validate({
		submitHandler: function(form) {
			var multiPriorJson	= []; 
			$('#AddPriorForm  .prior_span').each(function(){
				
				var id						=	$("[name='id']",this).val();
				var date					=	$("[name='date']",this).val();
				var is_operation_completed	=	$("[name*='is_operation_completed']:checked",this).val();
				var cave_name				=	$("[name='cave_name']",this).val();
				var cave_name_db			=	$("[name='cave_name'] option:selected",this).text();
				var amount					=	$("[name='amount']",this).val();
				var next_check_date			=	$("[name='next_check_date']",this).val();
				var pending_checks			=	$("[name='pending_checks']",this).val();
				var is_last_operation		=	$("[name='is_last_operation']",this).is(':checked')?1:0;
				
				var PriorJosn = {
										'id'						:	id,
										'date'						:	date,
										'is_operation_completed'	:	is_operation_completed,
										'cave_name'					:	cave_name,
										'cave_name_db'				:	cave_name_db,
										'amount'					:	amount,
										'next_check_date'			:	next_check_date,
										'pending_checks'			:	pending_checks,
										'is_last_operation'			:	is_last_operation,
									};
				
				multiPriorJson.push(PriorJosn);
			});
			//alert(JSON.stringify(mulitAddresJson));
			
			$("#userForm [name='multi_prior_json']").val(JSON.stringify(multiPriorJson));
			if(multiPriorJson){
				$('.showPriorDivOnAdd').html('');
				for(var x in multiPriorJson){					
					var data = multiPriorJson[x];
					var newPriorView = CreatePriorOperationsView(data);
					$('.showPriorDivOnAdd').append(newPriorView);
				}
			}
			$( ".addPriorOperationsPop" ).dialog("close");
			return false;			
		}			
	});
	$( ".addPriorOperationsPop" ).dialog({
		autoOpen: false,modal:true,
		height: 600,
		width: 700,
		
		
		buttons: {
			"Agregar Nueva": function() {
				
				$('.prior_main_div').append(CreatePriorSpan());
				//$('.datepicker').not('.hasDatePicker').datepicker();
					
			},
			"Guardar": function() {
				
				$("#AddPriorForm").submit();
			}
		},
		close: function() {
			
		}
    });
	$( ".editPriorPop" ).dialog({
		autoOpen: false,modal:true,
		height: 600,
		width: 700,
		
		
		buttons: {
			"Agregar Nueva": function() {
				
				$('.edit_prior_main_div').append(CreatePriorSpan());
				//$('.datepicker').not('.hasDatePicker').datepicker();
					
			},
			"Guardar": function() {
				
				$("#EditPriorForm").submit();
			}
		},
		close: function() {
			
		}
    });
	
	
	$('#userForm .client_type').change(function(){
		if($('option:selected',this).text().toLowerCase() == 'potencial con operaciones'){
			$("#PriorTr").show();
			$(".showPriorDivOnAdd").show();
		}else{
			$("#PriorTr").hide();
			$(".showPriorDivOnAdd").hide();
		}
		
	});
	$('#userFormPop .client_type').change(function(){
		if($('option:selected',this).text().toLowerCase() == 'potencial con operaciones'){
			$("#EditPriorTr").show();
			$("#showPriorDiv").show();
		}else{
			$("#EditPriorTr").hide();
			$("#showPriorDiv").hide();
		}
		
	});
	$('.addPriorBtn').click(function(){		
		$(".addPriorOperationsPop").dialog('open');
	});
	$('[name="cave_name"]').live('change',function(){
		if($('option:selected',this).hasClass('addnew')){
			$( ".addNewCave" ).dialog('open');
			cave_change_select = $(this);
		}
	});
	$('.deletePrior').live('click',function(){
		
		var priorSpan = $(this).parents('.prior_span');
		var priorId = parseInt($('[name="id"]',priorSpan).val());
		var url = "/index/deletepriorajax";
		if(priorId){
			$.post(url, { 
				'id'				:	priorId
			},
			function(data){						
				 if(data){
					  priorSpan.remove();
					  showmsg('Campo borrado...','t');		  
				 }else{
					 showmsg('Campo borrado...','f');
				 }
			});	
		}else{
			priorSpan.remove();
			showmsg('Campo borrado...','t');
		}
		
	})
	$(".editPriorBtn").click(function(){
		
		var tForm 	= $("#EditPriorForm");
		$('.new_prior_span',tForm).remove();
		clearForm(tForm);
		$( ".editPriorPop" ).dialog('open');
		
		var clientid = $("#userFormPop [name='id']").val();
		
		var url = "/index/getpriorbyclientidajax";
		$('[name="client_id"]',tForm).val(clientid);
		$('.edit_prior_main_div').html('<h1>Loading...</h1>');
		$(".editPriorPop").dialog('open');
		$.post(url, { 
			"client_id" : clientid
		},function(data){
			
			if(data && data != ''){
			
			 	
				$('.edit_prior_main_div').html('');
				for(var x in data){
					var jsonData = data[x];
					var newPriorSpan = CreatePriorSpan();
		
					
					var id						=	jsonData['id'];
					var date					=	jsonData['date'];
					var is_operation_completed	=	jsonData['is_operation_completed'];
					var cave_name				=	jsonData['cave_name'];
					var amount					=	jsonData['amount'];
					var next_check_date			=	jsonData['next_check_date'];
					var pending_checks			=	jsonData['pending_checks'];
					var is_last_operation		=	jsonData['is_last_operation'];
					
					$('[name="id"]',newPriorSpan).val(id);
					$('[name="date"]',newPriorSpan).val(date);
					
					$('[name="cave_name"]  option[value="'+cave_name+'"]',newPriorSpan).attr({'selected':'selected'});
					$('[name="amount"]',newPriorSpan).val(amount);
					$('[name="next_check_date"]',newPriorSpan).val(next_check_date);
					$('[name="pending_checks"]',newPriorSpan).val(pending_checks);
					if(parseInt(is_last_operation)){
						$('[name="is_last_operation"]',newPriorSpan).attr({'checked':'checked'});
					}
					
					$('[name*="is_operation_completed"]',newPriorSpan).removeAttr('checked');
					if(parseInt(is_operation_completed)){
						$('[name*="is_operation_completed"]:eq(0)',newPriorSpan).attr('checked','checked');
					}else{
						$('[name*="is_operation_completed"]:eq(1)',newPriorSpan).attr('checked','checked');
					}
					
					$('.edit_prior_main_div').append(newPriorSpan);
					
				}
				
				
				
			}else{
				$('.edit_prior_main_div').html('');
				showmsg("El registro no pudo ser editado. Por favor, intente nuevamente.",'f');
			}							
		},'json');
		
	});
	
	$("#EditPriorForm").validate({
		submitHandler: function(form) {
			var tForm = $('#EditPriorForm');
			var multiPriorJson	= []; 
			$('.prior_span',tForm).each(function(){
				
				
				var id						=	$("[name='id']",this).val();
				var date					=	$("[name='date']",this).val();
				var is_operation_completed	=	$("[name*='is_operation_completed']:checked",this).val();
				var cave_name				=	$("[name='cave_name']",this).val();
				var amount					=	$("[name='amount']",this).val();
				var next_check_date			=	$("[name='next_check_date']",this).val();
				var pending_checks			=	$("[name='pending_checks']",this).val();
				var is_last_operation		=	$("[name='is_last_operation']",this).is(':checked')?1:0;
				
				
				var PriorJson = {
								'id'						:	id,
								'date'						:	date,
								'is_operation_completed'	:	is_operation_completed,
								'cave_name'					:	cave_name,								
								'amount'					:	amount,
								'next_check_date'			:	next_check_date,
								'pending_checks'			:	pending_checks,
								'is_last_operation'			:	is_last_operation,
							};
				
				multiPriorJson.push(PriorJson);
			});
			
			var multiPriorJson	=	JSON.stringify(multiPriorJson);
			var url =	"/index/editmultipriorajax";
			var client_id = $("[name='client_id']",tForm).val();
			
			//alert(client_id);
			//alert(multiAddressJson);
			$.post(url, { 
				'client_id'				:	client_id,
				'multi_prior_json'		:	multiPriorJson,	
			},
			
				 function(data){
						
				  if(data){
					  showmsg('Datos guardados exitosamente.','t');
					  var url = "/index/getpriorbyclientidajax";
						$.post(url, { 
							"client_id" : client_id,
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
					 showmsg('Hubo un error al editar. Por favor, intente nuevamente.','f');
				 }
			});	
			$( ".editPriorPop" ).dialog( "close" );
			return false;
		}
			
	});
	

});
var date_i = 0;
var radio_i	=	1;
function CreatePriorSpan(){	
	var defaultPriorSpan =  $('.prior_default_span').clone().html();
	var span = $('<span class="prior_span new_prior_span"></span>');
	var newPriorSpan = span.html(defaultPriorSpan);
	$('.datepicker',newPriorSpan).each(function(){
		var newdateid	=	'new_date_'+date_i;
		$(this).attr({'id':newdateid});	
		$(this).removeClass('hasDatepicker');
		$(this).datepicker({ 
			changeMonth: true,
	        changeYear: true,
			"dateFormat": 'dd/mm/yy' 
				
		});
		date_i++;
	})
	$('[name="is_operation_completed"]',newPriorSpan).each(function(){
		$(this).attr({'name':'is_operation_completedW'+radio_i});
		
	});
	radio_i++;	
	return newPriorSpan;
}
function CreatePriorOperationsView(jsonData){
	
	var str						=	'';		
	var id						=	jsonData['id'];
	var date					=	jsonData['date'];
	var is_operation_completed	=	jsonData['is_operation_completed'];
	var cave_name				=	jsonData['cave_name'];
	var cave_name_db			=	jsonData['cave_name_db'];
	var amount					=	jsonData['amount'];
	var next_check_date			=	jsonData['next_check_date'];
	var pending_checks			=	jsonData['pending_checks'];
	var is_last_operation		=	jsonData['is_last_operation'];

	str		=	'<table>'+
					'<tr>'+
						'<td width="140">Fecha</td><td> : </td><td>'+date+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Con qui&eacute;n?</td><td> : </td><td>'+cave_name_db+'</td>'+
					'</tr>'+					
					'<tr>'+
						'<td>Importe</td><td> : </td><td>'+amount+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Fecha próximo cheque</td><td> : </td><td>'+next_check_date+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td>Cheques pendientes</td><td> : </td><td>'+pending_checks+'</td>'+
					'</tr>'+
				'</table>';
	return str;
}