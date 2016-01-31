$(document).ready(function(){
	$( ".addNewEventAction" ).dialog({
		autoOpen: false,modal:true,		
		height: window.screen.height - 400,
		width: 400,			
		buttons: {
			
			"Guardar": function() {				
				$("#addNewEventActionForm").submit();
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			
		}
	});
	$("#addNewEventActionForm").validate({
		submitHandler: function(form){
			EditEventForm = $("#addNewEventActionForm");
			var url = EditEventForm.attr('action');
			var EventActionid	= $(' input[name="id"]',EditEventForm).val();
			var EventActionname	= $(' input[name="name"]',EditEventForm).val();
			$.post(url, { 
							"id"	  	: EventActionid,
							"name"  	: EventActionname,
						},
					 function(data){
							if(isInt(data)){
								  var submitType = $('.addNewEventAction .addEditBtn').text();
								  if(submitType	==	'Edit'){
									  showmsg("Actualización exitosa.",'t');
									  $('[name="action_id"] option[value="'+EventActionid+'"]').text(EventActionname);
									  $('.addNewEventAction .addEditBtn').text('Add');
									  $(' input[name="name"]',EditEventForm).val('');
									  $(' input[name="id"]',EditEventForm).val('');
									  AddEventActionTabs.tabs({selected: 0});	
									  $('#EventActionId_'+EventActionid+' .td_EventAction').text(EventActionname);
									  window.location	=	window.location.href+'#EventActionId_'+EventActionid;
									  
								  }else if(submitType	==	'Add'){
									  	showmsg("Adding New Client Successful!",'t');
									  	var addOption = '<option value="'+data+'">'+$(' input[name="name"]',EditEventForm).val()+'</option>';
									  	$('#eventForm [name="action_id"] .addnew').before(addOption);
									  	$('#eventForm [name="action_id"] option[value="'+data+'"]').attr({'selected':'selected'});
									  	$("#EditEventForm [name='action_id']").append(addOption);
									  	var trmade = $('#EventActionGrid').dataTable().fnAddData( [
									  	                                                          	data,
									                                                            	EventActionname,								                                                            	
													                               		] );
										var oSettings = EventActionTable.fnSettings();
									 	var nTr = oSettings.aoData[ trmade[0] ].nTr;
										nTr.id = 'EventActionId_'+data;
										$("td:eq(1)",nTr).addClass('td_EventAction');
										$(' input[name="name"]',EditEventForm).val('');
										$(' input[name="id"]',EditEventForm).val('');
										AddEventActionTabs.tabs({selected: 0});
										window.location	=	window.location.href+'#'+nTr.id;
													
								  }
						  }else{
							  showmsg("Oops Updating Acción not get successfully done.\n Please Try Again",'f');
							  
						  }
						 
			});
		}
	});
	AddEventActionTabs	=	$("#AddEventActionTabs").tabs({	selected	:	1 });

	EventActionTable = $('#EventActionGrid').dataTable({
		"bJQueryUI"			: true,
		"bAutoWidth"		: true,
		"bScrollCollapse"	: true,
		"bStateSave"		: true,
		"bPaginate"			: false,	
		"bInfo"				: false
	});
	//$("#EventActionGrid_wrapper .fg-toolbar").prepend('<h1>test</h1>');
	var edBtn = "<span class='EventActionEditBtn gridBtn'>Edit</span>";
	edBtn += "<span class='EventActionDeleteBtn gridBtn'>Delete</span>";
	$("#EventActionGrid_wrapper .fg-toolbar:has('.dataTables_filter')").append(edBtn);
	
	$("#EventActionGrid tbody").click(function(event) {
		$(EventActionTable.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('row_selected');
		});
		$(event.target.parentNode).addClass('row_selected');
	});	
	 $('.EventActionEditBtn').live('click',function(){
		 EventActionTr			=	$(".EventActiongridtbody .row_selected");
		 var EventActionId		=	EventActionTr.attr('id').split('_');
		 var EventActionName	=	$('.td_EventAction',EventActionTr).text();
		 var tForm				=	$('#addNewEventActionForm');
		 $('[name="name"]',tForm).val(EventActionName);
		 $('[name="id"]',tForm).val(EventActionId[1]);
		 AddEventActionTabs.tabs({selected: 1});			
		 $('.addNewEventAction .addEditBtn').text('Edit');
	 });
	 $('.EventActionDeleteBtn').live('click',function(){
		 EventActionTr	=	 fnGetSelected( EventActionTable );
		 var EventActionId	=	EventActionTr[0].id.split('_');
		 var url = '/index/deleteeventactionajax';
		 $.post(url,{
				"id"	  	: EventActionId[1],		
			},			
		 function(data){
				if(isInt(data)){		  
				 	showmsg("Deleted Successfully!",'t');
				 	EventActionTable.fnDeleteRow( EventActionTr[0] );	
				 	$('[name="action_id"] option[value="'+EventActionId[1]+'"]').remove();
			  }else{
				  	showmsg("Oops Deleting Acción not get successfully done.\n Please Try Again",'f');				   
			  }
			 
		});		
	});
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
});