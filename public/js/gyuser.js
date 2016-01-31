	$(function() {
		var oTable;
		var gaiSelected =  [];

		var nCloneTh = document.createElement( 'th' );
		var nCloneTd = document.createElement( 'td' );
		nCloneTd.innerHTML = '<img src="/images/details_open.png">';
		nCloneTd.className = "center";
		
		$('#grid thead tr').each( function () {
			this.insertBefore( nCloneTh, this.childNodes[0] );
		} );
		
		$('#grid tbody tr').each( function () {
			this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
		} );
		
		function fnFormatDetails ( oTable, nTr )
		{
			var aData = oTable.fnGetData( nTr );
			var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
			sOut += '<tr><td>Bank Details Will be show here:</td><td>Leous</td></tr>';
			sOut += '<tr><td>Bank Details Will be show here:</td><td>Could provide Leous</td></tr>';
			sOut += '<tr><td>Bank Details Will be show here:</td><td>Leous Leous Leous</td></tr>';
			sOut += '</table>';			
			return sOut;
		}
		$('#grid tbody td img').live('click', function () {
			var nTr = this.parentNode.parentNode;
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
				oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
			}
		} );
		
		oTable = $('#grid').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"sScrollX": "100%",
			"sScrollXInner": "180%",
			"bScrollCollapse": true,
			"iDisplayLength": 1 ,
			"bStateSave": true
			
			
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
				var url = "/gyuser/Index/userdeleteajax";
				$.post(url, { 
						"id"   : selIdArr[1]
						},				
						 function(data){
						 if(data){							  
							  alert("El registro a sido eliminado.");
							  oTable.fnDeleteRow( anSelected[0] );							  
						 }else{							 
							 alert("Oops user not deleted. \n Please try again!");
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
				var popEditForm = $("#userFormPop");				
				$('input[name="id"]',popEditForm).val(idArr[1]);
				$('select[name="client_type"] option[value="'+$(".user_client_type input",selRow).val()+'"]',popEditForm).attr('selected','selected');
				$('input[name="DNI"]',popEditForm).val($(".user_DNI",selRow).text());
				$('input[name="CUIL"]',popEditForm).val($(".user_CUIL",selRow).text());
				$('input[name="tel"]',popEditForm).val($(".user_tel",selRow).text());
				$('textarea[name="address_1"]',popEditForm).val($(".user_address_1",selRow).text());
				$('textarea[name="address_2"]',popEditForm).val($(".user_address_2",selRow).text());
				$('input[name="email"]',popEditForm).val($(".user_email",selRow).text());
				$('textarea[name="activity"]',popEditForm).html($(".user_activity",selRow).text());
				$('input[name="date_added"]',popEditForm).val($(".user_date_added",selRow).text());
				$('input[name="operator"]',popEditForm).val($(".user_operator",selRow).text());
				$('input[name="contact_point"]',popEditForm).val($(".user_contact_point",selRow).text());
				$('textarea[name="extra_info"]',popEditForm).val($(".user_extra_info",selRow).text());
				
				$( "#editPopUP" ).dialog( "open" );
			}else{				
				alert("Por favor, seleccione la fila que desea editar.");
			}
			
			//trSelected
		});
		
		
		
		
		
		/*tabs*/
		
		
		$( "#tabs" ).tabs({ selected: 0 });
		uForm = $("#userForm").validate({
				submitHandler: function(form) {
					var url = $("#userForm").attr('action');
					$("#userForm").animate( { "opacity" : .2 }, 250 );
					$.post(url, { 
									"client_type"   : $('#userForm select[name="client_type"]').val(),
									"DNI"  			: $('#userForm input[name="DNI"]').val(),
									"CUIL" 			: $('#userForm input[name="CUIL"]').val(),
									"tel"  			: $('#userForm input[name="tel"]').val(),
									"address_1" 	: $('#userForm textarea[name="address_1"]').val(),
									"address_2"  	: $('#userForm textarea[name="address_2"]').val(),
									"email" 		: $('#userForm input[name="email"]').val(),
									"activity"  	: $('#userForm textarea[name="activity"]').val(),
									"date_added"  	: $('#userForm input[name="date_added"]').val(),
									"operator"  	: $('#userForm input[name="operator"]').val(),
									"contact_point" : $('#userForm input[name="contact_point"]').val(),
									"extra_info"  	: $('#userForm textarea[name="extra_info"]').val(),
									"user_type_id" 	: $('#userForm input[name="user_type_id"]').val()

								},
								
							 function(data){
									
							  if(data){
								 $('#userBankForm input[name="user_id"]').val(data);
								  $( ".confirm-add-user" ).dialog('open'); 
								  /*var ltTr = $(".gridtbody tr:last");
								  var str =  '<tr id="userid_'+data+'">'+
												'<td class="sorted"><div style="width:'+$("td:eq(0) div",ltTr).width()+'"> '+data+ '</div></td>'+
												'<td class="user_client_type"><div  style="width:'+$("td:eq(1) div",ltTr).width()+'">'+$('#userForm select[name="client_type"] option:selected').text()+'<input type="hidden" name="ct_id" value="'+$('#userForm select[name="client_type"]').val()+'"></div></td>'+
												'<td class="user_DNI"><div  style="width:'+$("td:eq(2) div",ltTr).width()+'">'+$('#userForm input[name="DNI"]').val()+'</div></td>'+
												'<td class="user_CUIL" ><div  style="width:'+$("td:eq(3) div",ltTr).width()+'">'+$('#userForm input[name="CUIL"]').val()+'</div></td>'+
												'<td class="user_tel"><div  style="width:'+$("td:eq(4) div",ltTr).width()+'">'+$('#userForm input[name="tel"]').val()+'</div></td>'+
												'<td class="user_address_1"><div style="width:'+$("td:eq(5) div",ltTr).width()+'">'+$('#userForm textarea[name="address_1"]').val()+'</div></td>'+
												'<td class="user_address_2"><div  style="width:'+$("td:eq(6) div",ltTr).width()+'">'+$('#userForm textarea[name="address_2"]').val()+'</div></td>'+
												'<td class="user_email"><div style="width:'+$("td:eq(7) div",ltTr).width()+'">'+$('#userForm input[name="email"]').val()+'</div></td>'+
												'<td class="user_activity"><div style="width:'+$("td:eq(8) div",ltTr).width()+'">'+$('#userForm textarea[name="activity"]').val()+'</div></td>'+
												'<td class="user_date_added"><div style="width:'+$("td:eq(9) div",ltTr).width()+'">'+$('#userForm input[name="date_added"]').val()+'</div></td>'+
												'<td class="user_operator"><div style="width:'+$("td:eq(10) div",ltTr).width()+'">'+$('#userForm input[name="operator"]').val()+'</div></td>'+
												'<td class="user_contact_point"><div style="width:'+$("td:eq(11) div",ltTr).width()+'">'+ $('#userForm input[name="contact_point"]').val()+'</div></td>'+
												'<td class="user_extra_info"><div style="width:'+$("td:eq(12) div",ltTr).width()+'">'+$('#userForm textarea[name="extra_info"]').val()+'</div></td>'+
											'</tr>';
								 $(".gridtbody").append(str);
								 flexme1.flexReload();*/
								var trmade = $('#grid').dataTable().fnAddData( [
								                                    '<img src="/images/details_open.png">',            
								                               		data,
								                               		$('#userForm select[name="client_type"] option:selected').text(),
								                               		$('#userForm input[name="DNI"]').val(),
								                               		$('#userForm input[name="CUIL"]').val(),
								                               		$('#userForm input[name="tel"]').val(),
								                               		$('#userForm textarea[name="address_1"]').val(),
								                               		$('#userForm textarea[name="address_2"]').val(),
								                               		$('#userForm input[name="email"]').val(),
								                               		$('#userForm textarea[name="activity"]').val(),
								                               		$('#userForm input[name="date_added"]').val(),
								                               		$('#userForm input[name="operator"]').val(),
								                               		$('#userForm input[name="contact_point"]').val(),
								                               		$('#userForm textarea[name="extra_info"]').val()] );
								var oSettings = oTable.fnSettings();
								var nTr = oSettings.aoData[ trmade[0] ].nTr;
								nTr.id = 'userid_'+data;
								$("td:eq(2)",nTr).addClass('user_client_type').append('<input type="hidden" name="ct_id" value="'+$('#userForm select[name="client_type"]').val()+'">');
								$("td:eq(3)",nTr).addClass('user_DNI');
								$("td:eq(4)",nTr).addClass('user_CUIL');
								$("td:eq(5)",nTr).addClass('user_tel');
								$("td:eq(6)",nTr).addClass('user_address_1');
								$("td:eq(7)",nTr).addClass('user_address_2');
								$("td:eq(8)",nTr).addClass('user_email');
								$("td:eq(9)",nTr).addClass('user_activity');
								$("td:eq(10)",nTr).addClass('user_date_added');
								$("td:eq(11)",nTr).addClass('user_operator');
								$("td:eq(12)",nTr).addClass('user_contact_point');
								$("td:eq(13)",nTr).addClass('user_extra_info');
							 }
					});
					$("#userForm").animate( { "opacity" : 1 }, 250 );
				}	
		});
		$( "input[name='dob']" ).addClass('datepicker');
		$( ".datepicker" ).datepicker({ "dateFormat": 'yy-mm-dd' });
		
		
		
		function test2(){
			alert("success");
			
		}
		
		

		function test(){
			
		}
		
		
		
		$("#userSubmit").click(function(){
			
			
			//return false;
		});
		
		$("#userFormPop input").addClass('text ui-widget-content ui-corner-all');
		
		//This function adds paramaters to the post of flexigrid. You can add a verification as well by return to false if you don't want flexigrid to submit			
		
	});

$(function() {
	// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
	
	
	$( ".add-new-user" ).dialog({
		autoOpen: false,modal:true,
		modal: true,
		
		buttons: {
			"Add Account": function() {		
				
				$( ".confirm-add-user" ).dialog('open');	
				$( this ).dialog( "close" );
					
			},
			"No Thanks!": function() {
			
				$( this ).dialog( "close" );
			}
		}
    });
	$( ".confirm-add-user" ).dialog({
		autoOpen: false,modal:true,
		modal: true,
		
		buttons: {
			"Add": function() {		
					var url = $('#userBankForm').attr('action');
					$.post(url, { 
						"user_id"   	: $('#userBankForm input[name="user_id"]').val(),
						"bank_name"  	: $('#userBankForm input[name="bank_name"]').val(),
						"account_n" 	: $('#userBankForm input[name="account_n"]').val(),
						"branch"  		: $('#userBankForm input[name="branch"]').val()
					},
					
						 function(data){
								
						  if(data){
							 
							  
							  $( ".confirm-add-user" ).dialog('close'); 
							  
							  clearForm($("#userForm"));
							  clearForm($("#userBankForm"));
							  $( ".add-new-user" ).dialog('open');
						 }
					});		
					
					
					
			},
			"Cancel": function() {
				clearForm($("#userForm"));
				clearForm($("#userBankForm"));
				$( this ).dialog( "close" );
			}
		}
    });
	
	$( "#editPopUP" ).dialog({
		autoOpen: false,modal:true,
		height: 500,
		width: 600,
		modal: true,
		buttons: {
			"Guardar": function() {				
					
					$("#userFormPop").submit();
					
				
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			
		}
	});

	$("#userFormPop").validate({
		submitHandler: function(form) {
			userFormPop = $("#userFormPop");
			var url = $("#userFormPop").attr('action');
			$.post(url, { 
							"id" 			: $(' input[name="id"]',userFormPop).val(),
							"client_type"   : $(' select[name="client_type"]',userFormPop).val(),
							"DNI"  			: $(' input[name="DNI"]',userFormPop).val(),
							"CUIL" 			: $(' input[name="CUIL"]',userFormPop).val(),
							"tel"  			: $(' input[name="tel"]',userFormPop).val(),
							"address_1" 	: $(' textarea[name="address_1"]',userFormPop).val(),
							"address_2"  	: $(' textarea[name="address_2"]',userFormPop).val(),
							"email" 		: $(' input[name="email"]',userFormPop).val(),
							"activity"  	: $(' textarea[name="activity"]',userFormPop).val(),
							"date_added"  	: $(' input[name="date_added"]',userFormPop).val(),
							"operator"  	: $(' input[name="operator"]',userFormPop).val(),
							"contact_point" : $(' input[name="contact_point"]',userFormPop).val(),
							"extra_info"  	: $(' textarea[name="extra_info"]',userFormPop).val()	
						},
						
					 function(data){
							if(data){
							  	var selRow = $("#grid .row_selected");
							  	
							  	$(".user_client_type",selRow).text($('select[name="client_type"] option:selected',userFormPop).text());
								$(".user_DNI",selRow).text($(' input[name="DNI"]',userFormPop).val());
								$(".user_CUIL",selRow).text($(' input[name="CUIL"]',userFormPop).val());
								$(".user_tel",selRow).text($(' input[name="tel"]',userFormPop).val());
								$(".user_address_1",selRow).text($(' textarea[name="address_1"]',userFormPop).val());
								$(".user_address_2",selRow).text($(' textarea[name="address_2"]',userFormPop).val());
								$(".user_email",selRow).text($(' input[name="email"]',userFormPop).val());
								$(".user_activity",selRow).text($(' textarea[name="activity"]',userFormPop).val());
								$(".user_date_added",selRow).text($(' input[name="date_added"]',userFormPop).val());
								$(".user_operator",selRow).text($(' input[name="operator"]',userFormPop).val());
								$(".user_contact_point",selRow).text( $(' input[name="contact_point"]',userFormPop).val());
								$(".user_extra_info",selRow).text($(' textarea[name="extra_info"]',userFormPop).val());
							  alert("Actualización exitosa.");
							  $( "#editPopUP" ).dialog('close'); 							
						  }else{
							  alert("Error: no se pudo eliminar el registro.");
							  $( "#editPopUP" ).dialog('close'); 
						  }
			});
		}
		
		
	});
	
	
	
});



