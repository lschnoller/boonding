$(document).ready(function(){
	
	$( ".addNewEventType" ).dialog({
		autoOpen: false,modal:true,		
		height: window.screen.height - 400,
		width: 400,			
		buttons: {
			
			"Guardar": function() {				
				$("#addNewEventTypeForm").submit();
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			
		}
	});
	$("#addNewEventTypeForm").validate({
		submitHandler: function(form){
			EditEventForm = $("#addNewEventTypeForm");
			var url = EditEventForm.attr('action');
			var EventTypeid	= $(' input[name="id"]',EditEventForm).val();
			var EventTypename	= $(' input[name="name"]',EditEventForm).val();
			$.post(url, { 
							"id"	  	: EventTypeid,
							"name"  	: EventTypename,
						},
					 function(data){
							if(isInt(data)){
								  var submitType = $('.addNewEventType .addEditBtn').text();
								  if(submitType	==	'Edit'){
									  showmsg("Actualización exitosa.",'t');
									  $('[name="type_id"] option[value="'+EventTypeid+'"]').text(EventTypename);
									  $('.addNewEventType .addEditBtn').text('Add');
									  $(' input[name="name"]',EditEventForm).val('');
									  $(' input[name="id"]',EditEventForm).val('');
									  AddEventTypeTabs.tabs({selected: 0});	
									  $('#EventTypeId_'+EventTypeid+' .td_eventType').text(EventTypename);
									  window.location	=	window.location.href+'#EventTypeId_'+EventTypeid;
									  
								  }else if(submitType	==	'Add'){
									  	showmsg("Adding New Client Successful!",'t');
									  	var addOption = '<option value="'+data+'">'+$(' input[name="name"]',EditEventForm).val()+'</option>';
									  	$('#eventForm [name="type_id"] .addnew').before(addOption);
									  	$('#eventForm [name="type_id"] option[value="'+data+'"]').attr({'selected':'selected'});
									  	$("#EditEventForm [name='type_id']").append(addOption);
									  	var trmade = $('#EventTypeGrid').dataTable().fnAddData( [
									  	                                                          	data,
									                                                            	EventTypename,								                                                            	
													                               		] );
										var oSettings = EventTypeTable.fnSettings();
									 	var nTr = oSettings.aoData[ trmade[0] ].nTr;
										nTr.id = 'EventTypeId_'+data;
										$("td:eq(1)",nTr).addClass('td_eventType');
										$(' input[name="name"]',EditEventForm).val('');
										$(' input[name="id"]',EditEventForm).val('');
										AddEventTypeTabs.tabs({selected: 0});
										window.location	=	window.location.href+'#'+nTr.id;
													
								  }
						  }else{
							  showmsg("Oops Updating Tipo de evento not get successfully done.\n Please Try Again",'f');
							  
						  }
						 
			});
		}
	});
	AddEventTypeTabs	=	$("#AddEventTypeTabs").tabs({	selected	:	1 });

	EventTypeTable = $('#EventTypeGrid').dataTable({
		"bJQueryUI"			: true,
		"bAutoWidth"		: true,
		"bScrollCollapse"	: true,
		"bStateSave"		: true,
		"bPaginate"			: false,	
		"bInfo"				: false
	})
	//$("#EventTypeGrid_wrapper .fg-toolbar").prepend('<h1>test</h1>');
	var edBtn = "<span class='EventTypeEditBtn gridBtn'>Edit</span>";
	edBtn += "<span class='EventTypeDeleteBtn gridBtn'>Delete</span>";
	$("#EventTypeGrid_wrapper .fg-toolbar:has('.dataTables_filter')").append(edBtn);
	
	$("#EventTypeGrid tbody").click(function(event) {
		$(EventTypeTable.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('row_selected');
		});
		$(event.target.parentNode).addClass('row_selected');
	});	
	 $('.EventTypeEditBtn').live('click',function(){
		 var EventTypeTr	=	$(".EventTypegridtbody .row_selected");
		 var EventTypeId	=	EventTypeTr.attr('id').split('_');
		 var EventTypeName	=	$('.td_eventType',EventTypeTr).text();
		 var tForm			=	$('#addNewEventTypeForm');
		 $('[name="name"]',tForm).val(EventTypeName);
		 $('[name="id"]',tForm).val(EventTypeId[1]);
		 AddEventTypeTabs.tabs({selected: 1});			
		 $('.addNewEventType .addEditBtn').text('Edit');
	 });
	 $('.EventTypeDeleteBtn').live('click',function(){
		 var EventTypeTr	=	fnGetSelected( EventTypeTable );
		 var EventTypeId	=	EventTypeTr[0].id.split('_');
		 var url = '/index/deleteeventtypeajax';
		 $.post(url, { 
				"id"	  	: EventTypeId[1],		
			},			
		 function(data){
				if(isInt(data)){				  
				 	showmsg("Deleted Successfully!",'t');
				 	EventTypeTable.fnDeleteRow( EventTypeTr[0] );	
				 	$('[name="type_id"] option[value="'+EventTypeId[1]+'"]').remove();
			  }else{
				  	showmsg("Oops Deleting Tipo de evento not get successfully done.\n Please Try Again",'f');				   
			  }
			 
		});		
	});	
	 function fnGetSelected( oTableLocal )
		{
			var aReturn = new Array();
			var aTrs = oTableLocal.fnGetNodes();
			
			for ( var i=0 ; i<aTrs.length ; i++ )
			{
				if ($(aTrs[i]).hasClass('row_selected'))
				{
					aReturn.push( aTrs[i] );
				}
			}
			return aReturn;
		}
});