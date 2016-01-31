$(function() {
		
	oTable = $('#grid').dataTable({
		"bJQueryUI"			: true,
		"sPaginationType"	: "full_numbers",
		"sScrollXInner": "100%",		
		"bScrollCollapse"	: true,
		"bStateSave"		: true,
		"iDisplayLength"	: 50,
		
	});
	$('#operationsgrid').dataTable({
		"bJQueryUI"			: true,		
		"sScrollXInner": "100%",		
		"bScrollCollapse"	: true,
		"bStateSave"		: true,
		"bPaginate"			: false,	
		"iDisplayLength"	: 50,
	});
	
	
	var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
	edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
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
		var result = confirm('Seguro desea eliminar?');
		
		if(result){
			var anSelected = fnGetSelected( oTable );
			var selIdArr = anSelected[0].id.split("_");
			var url = "/gyuser/Index/eventdeleteajax";
			$.post(url, { 
					"id"   : selIdArr[1]
					},				
					 function(data){
					 if(isInt(data)){							  
						 showmsg("El registro a sido eliminado.",'t');
						  oTable.fnDeleteRow( anSelected[0] );							  
					 }else{							 
						 showmsg("Oops user not deleted. \n Please try again!",'f');
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
	$( ".editBtn" )
	.click(function() {
		var selRow = $(".gridtbody .row_selected");		
		if(selRow.size()){
			var idArr = selRow.attr('id').split("_");
			var popEditForm = $(".editEventPop");				
			$('[name="id"]',popEditForm).val(idArr[1]);
			//$('[name="operation_id"] option[value="'+$(".user_operation input",selRow).val()+'"]',popEditForm).attr('selected','selected');
			$('[name="type_id"] option[value="'+$(".user_type input",selRow).val()+'"]',popEditForm).attr('selected','selected');
			$('[name="action_id"] option[value="'+$(".user_action input",selRow).val()+'"]',popEditForm).attr('selected','selected');
			$('[name="schedule"]',popEditForm).val($(".user_schedule",selRow).text());
			$('[name="assigned_operator_id"] option[value="'+$(".user_assigned_operator input",selRow).val()+'"]',popEditForm).attr('selected','selected');
			$('[name="comments"]',popEditForm).val($(".user_comments",selRow).text());
			$('[name="operation_id"]',popEditForm).val($(".user_operation input",selRow).val());
			
			var operation_id	=	$('[name="operation_id"]',popEditForm).val();
			var selRow	=	$('#operationSelectForm [name="operation_radio"][value="'+operation_id+'"]').parents('tr');
			var clientName = $('.user_client_name',selRow).text();
			var clientdate = $('.user_date',selRow).text();
			var price = '$ '+$('.user_amount',selRow).text();
			$('.showOperationsSpan',popEditForm).text(clientName+' - '+clientdate+' - '+price);
			
			$("#EditEventForm [name='id']").val(idArr[1]);
			$( ".editEventPop" ).dialog( "open" );
		}else{				
			showmsg("Por favor, seleccione la fila que desea editar.",'f');
		}
	});
	
		/*tabs*/
		$( "#tabs" ).tabs({ selected: 0 });
		uForm = $("#eventForm").validate({
			submitHandler: function(form) {
				tForm = $("#eventForm");

				var url = tForm.attr('action');
				$.post(url, { 
								"operation_id"  		: $(' [name="operation_id"]',tForm).val(),
								"type_id" 				: $(' [name="type_id"]',tForm).val(),
								"action_id"   			: $(' [name="action_id"]',tForm).val(),
								"schedule" 				: $(' [name="schedule"]',tForm).val(),
								"assigned_operator_id" 	: $(' [name="assigned_operator_id"]',tForm).val(),
								"comments" 				: $(' [name="comments"]',tForm).val(),
							},
						function(data){
								
						  if(isInt(data)){							
							  showmsg("Eventos Added Succesfully!",'t');
							var optVal = $('[name="operation_id"]',tForm).val();
							var trmade = $('#grid').dataTable().fnAddData( [							                                                
							                               		data,
							                               		$("#operationSelectForm #userid_"+optVal+" .user_client_name").text()+'<input type="hidden" value="'+optVal+'">',
							                               		$('[name="type_id"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="type_id"]',tForm).val()+'">',
							                               		$('[name="action_id"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="action_id"]',tForm).val()+'">',
							                               		$('[name="schedule"]',tForm).val(),
							                               		$('[name="assigned_operator_id"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="assigned_operator_id"]',tForm).val()+'">',
							                               		$('[name="comments"]',tForm).val(),
							                               		] );
							var oSettings = oTable.fnSettings();
							var nTr = oSettings.aoData[ trmade[0] ].nTr;
							nTr.id = 'chequeid_'+data;
							$("td:eq(1)",nTr).addClass('user_operation');
							$("td:eq(2)",nTr).addClass('user_type');
							$("td:eq(3)",nTr).addClass('user_action');
							$("td:eq(4)",nTr).addClass('user_schedule');
							$("td:eq(5)",nTr).addClass('user_assigned_operator');
							$("td:eq(6)",nTr).addClass('user_comments');
							$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
							$('.showOperationsSpan',tForm).text('');
							clearForm(tForm);
						 }else{
							 showmsg("Oops Adding cheque is not successfull!\n\n Try Again ",'f');								 
						 }
				});
				
			}	
	});
		$("#EditEventForm").validate({
			submitHandler: function(form) {
				tForm = $("#EditEventForm");

				var url = tForm.attr('action');
				$.post(url, { 
								"id"					: $(' [name="id"]',tForm).val(),
								"operation_id"  		: $(' [name="operation_id"]',tForm).val(),
								"type_id" 				: $(' [name="type_id"]',tForm).val(),
								"action_id"   			: $(' [name="action_id"]',tForm).val(),
								"schedule" 				: $(' [name="schedule"]',tForm).val(),
								"assigned_operator_id" 	: $(' [name="assigned_operator_id"]',tForm).val(),
								"comments" 				: $(' [name="comments"]',tForm).val(),

							},
						function(data){
								
						  if(isInt(data)){							
							  showmsg("Eventos Added Succesfully!",'t');
							
							var selRow = $("#grid .row_selected");
							var optVal = $('[name="operation_id"]',tForm).val();
							$(".user_operation",selRow).html($("#operationSelectForm #userid_"+optVal+" .user_client_name").text()+'<input type="hidden" value="'+optVal+'">');
						  	$(".user_type",selRow).html( $('[name="type_id"] option:selected',tForm).text()+'<input type="hidden"  value="'+$('[name="type_id"]',tForm).val()+'"/>');
						  	$(".user_action",selRow).html( $('[name="action_id"] option:selected',tForm).text()+'<input type="hidden"  value="'+$('[name="action_id"]',tForm).val()+'"/>');
						  	$(".user_schedule",selRow).text($('[name="schedule"]',tForm).val());
						  	$(".user_assigned_operator",selRow).html( $('[name="assigned_operator_id"] option:selected',tForm).text()+'<input type="hidden" value="'+$('[name="assigned_operator_id"]',tForm).val()+'"/>');
						  	$(".user_comments",selRow).text($('[name="comments"]',tForm).val());
							
							//$(".user_contact_point",selRow).html( $('[name="contact_point"] option:selected',userFormPop).text()+'<input type="hidden" name="contact_point_id" value="'+$('[name="contact_point"] option:selected',userFormPop).val()+'"/>');
							
							
							
							$( ".editEventPop" ).dialog('close');
							clearForm(tForm);
						 }else{
							 $( ".editEventPop" ).dialog('close');
							 showmsg("Oops Adding Eventos is not successfull!\n\n Try Again ",'f');								 
						 }
				});
				
			}	
	});
		$( ".editEventPop" ).dialog({
			autoOpen: false,modal:true,
			height: 400,
			width: 500,
			
			buttons: {
				"Guardar": function() {		
					$("#EditEventForm").submit();
						
				},
				"Cancel!": function() {
				
					$( this ).dialog( "close" );
				}
			}
	    });
		$( "#addOperations" ).dialog({
			autoOpen: false,modal:true,
			height: 500,
			width: 600,
			
			buttons: {
				"Guardar": function() {				
						
						$("#addOperationsForm").submit();
						
					
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});
		$( ".selectOperations" ).dialog({
			autoOpen: false,modal:true,
			height: window.screen.height - 200,
			width: window.screen.width - 200,
			
			buttons: {
				"Guardar": function() {
						
						var operation_id	=	$('#operationSelectForm [name="operation_radio"]:checked').val();
						var selRow	=	$('#operationSelectForm [name="operation_radio"]:checked').parents('tr');
						var clientName = $('.user_client_name',selRow).text();
						var clientdate = $('.user_date',selRow).text();
						var price = '$ '+$('.user_amount',selRow).text();
						
						$("[name='operation_id']",operationForm).val(operation_id);
						$('.showOperationsSpan',operationForm).text(clientName+' - '+clientdate+' - '+price);
						$(this).dialog('close');
						
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});
		$('.showOperationsBtn').click(function(){
			operationForm = null;
			operationForm = $("#eventForm");
			clearForm($('#operationSelectForm'));
			$(".selectOperations").dialog('open');
		});
		$('.editShowOperationsBtn').click(function(){
			operationForm = null;
			operationForm = $("#EditEventForm");
			var selectedRowOperation = $('[name="operation_id"]',operationForm).val();
			$("[name='operation_id']",operationForm).val(selectedRowOperation);
			$('#operationSelectForm [name="operation_radio"][value="'+selectedRowOperation+'"]').attr({'checked':'checked'});
			
			$(".selectOperations").dialog('open');
		});		
		$("#addOperationsForm").validate({
			submitHandler: function(form){
				var tForm = $("#addOperationsForm");
				var url = tForm.attr('action');
				$.post(url, { 
									"id"			: $(' [name="id"]',tForm).val(),
									"client_id" 	: $(' [name="client_id"]',tForm).val(),
									"date"  		: $(' [name="date"]',tForm).val(),
									"amount"  		: $(' [name="amount"]',tForm).val(),
									"observations" 	: $(' [name="observations"]',tForm).val(),
									"report" 		: $(' [name="report"]',tForm).val()
							},
							function(data){							
								if(isInt(data)){
									  showmsg("Adding Operaciones done  successfully!",'t');
									  var addOption = '<option value="'+data+'">'+$('[name="client_id"] option:selected',tForm).eq(0).text()+' '+$(' input[name="amount"]',tForm).val()+'</option>';
									  $('#chequesForm [name="operation_id"] .addnew').before(addOption);
									  $('#chequesForm [name="operation_id"] option[value="'+data+'"]').attr({'selected':'selected'});
									  $("#EditChequesForm [name='operation_id']").append(addOption);
									  $( "#addOperations" ).dialog('close');
								}else{
									showmsg("Oops!");
									  $( "#addOperations" ).dialog('close');
								}							
							});
			}
		});
		
		$( ".datepicker" ).datepicker({ 
					changeMonth: true,
			        changeYear: true,
					"dateFormat": 'dd/mm/yy' 
						
		});		
		$('#eventForm [name="operation_id"]').change(function(){
			if($('option:selected',this).hasClass('addnew')){
				$( "#addOperations" ).dialog('open');
			}
			
		});
		$('#eventForm [name="type_id"]').change(function(){
			if($('option:selected',this).hasClass('addnew')){
				$( ".addNewEventType" ).dialog('open');
			}
			
		});
		
		$('#eventForm [name="action_id"]').change(function(){
			if($('option:selected',this).hasClass('addnew')){
				$( ".addNewEventAction" ).dialog('open');
			}			
		});
		
});


