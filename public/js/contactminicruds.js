$(document).ready(function(){
	
    $( ".addNewContactPop" ).dialog({
        autoOpen: false,
        modal:true,		
        height: window.screen.height - 400,
        width: 600,			
        buttons: {			
            "Guardar": function() {				
                $("#AddNewContactPointForm").submit();
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
			
        }
    });
    $("#AddNewContactPointForm").validate({
        submitHandler: function(form){
            userFormPop = $("#AddNewContactPointForm");
            var url = userFormPop.attr('action');
            var Contactid	= $(' [name="id"]',userFormPop).val();
            var Contactname	= $(' [name="title"]',userFormPop).val();
            var ContactDesc	= $(' [name="description"]',userFormPop).val();
            $.post(url, { 
                "id"	  		: Contactid,
                "title"  		: Contactname,
                "description" 	: ContactDesc,
            },
            function(data){
                if(isInt(data)){
                    var submitType = $('.addNewContactPop .addEditBtn').text();
                    if(submitType	==	'Edit'){
                        showmsg("Actualización exitosa.",'t');
                        $('[name="contact_point"] option[value="'+Contactid+'"]').text(Contactname);
                        $('.addNewContactPop .addEditBtn').text('Add');
                        $(' [name="description"]',userFormPop).val('');
                        $(' [name="title"]',userFormPop).val('');
                        $(' [name="id"]',userFormPop).val('');
                        AddContactTabs.tabs({
                            selected: 0
                        });	
                        $('#contactId_'+Contactid+' .contact_name').text(Contactname);
                        $('#contactId_'+Contactid+' .contact_desc').text(ContactDesc);
                        window.location	=	window.location.href+'#ContactId_'+Contactid;
									  
                    }else if(submitType	==	'Add'){
                        showmsg("Adding New Client Successful!",'t');
                        var addOption = '<option value="'+data+'">'+$(' [name="title"]',userFormPop).val()+'</option>';
                        $('#userForm [name="contact_point"] .addnew').before(addOption);
                        $('#userForm [name="contact_point"] option[value="'+data+'"]').attr({
                            'selected':'selected'
                        });
                        $("#userFormPop [name='contact_point']").append(addOption);
                        var trmade = $('#ContactGrid').dataTable().fnAddData( [
                            data,
                            Contactname,
                            ContactDesc,									                                                            	
                            ] );
                        var oSettings = ContactGrid.fnSettings();
                        var nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'contactId_'+data;
                        $("td:eq(1)",nTr).addClass('contact_name');
                        $("td:eq(2)",nTr).addClass('contact_desc');
                        $(' [name="description"]',userFormPop).val('');
                        $(' [name="title"]',userFormPop).val('');
                        $(' [name="id"]',userFormPop).val('');
                        AddContactTabs.tabs({
                            selected: 0
                        });
                        window.location	=	window.location.href+'#'+nTr.id;
													
                    }
                }else{
                    showmsg("Oops Updating Como Nos Contactó not get successfully done.\n Please Try Again",'f');
							  
                }
                $('#ContactGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
            });
        }
    });
    AddContactTabs	=	$("#AddContactTabs").tabs({
        selected	:	1
    });

    ContactGrid = $('#ContactGrid').dataTable({
        "bJQueryUI"			: true,
        "bAutoWidth"		: true,
        "bScrollCollapse"	: true,
        "bStateSave"		: true,
        "bPaginate"			: false,
        "bInfo"				: false
		
	
    }).ready(function(){
        $('#ContactGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    })
    //$("#ContactGrid_wrapper .fg-toolbar").prepend('<h1>test</h1>');
    var edBtn = "<span class='contactEditBtn gridBtn'>Edit</span>";
    edBtn += "<span class='contactDeleteBtn gridBtn'>Delete</span>";
    $("#ContactGrid_wrapper .fg-toolbar:has('.dataTables_filter')").append(edBtn);
	
    $("#ContactGrid tbody").click(function(event) {
        $(ContactGrid.fnSettings().aoData).each(function (){
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });
	
	
    $('.contactEditBtn').live('click',function(){
        var rowFlag		=	$(".Contactgridtbody .row_selected").size();
        if(rowFlag){
            var ContactTr		=	$(".Contactgridtbody .row_selected");
            var ContactId		=	ContactTr.attr('id').split('_');
            var ContactName	=	$('.contact_name',ContactTr).text();
            var ContactDesc	=	$('.contact_desc',ContactTr).text();
            var tForm			=	$('#AddNewContactPointForm');
            $('[name="title"]',tForm).val(ContactName);
            $('[name="description"]',tForm).val(ContactDesc);
            $('[name="id"]',tForm).val(ContactId[1]);
            AddContactTabs.tabs({
                selected: 1
            });			
            $('.addNewContactPop .addEditBtn').text('Edit');
        }else{
            showmsg("Please select the row", 'f');
        }
    });
    $('.contactDeleteBtn').live('click',function(){
        var ContactTr	=	fnGetSelected( ContactGrid );
        var ContactId	=	ContactTr[0].id.split('_');
        var url = 'index/deletecontactajax';
        $.post(url, { 
            "id"	  	: ContactId[1],		
        },			
        function(data){
            if(isInt(data)){				  
                showmsg("Deleted Successfully!",'t');
                ContactGrid.fnDeleteRow( ContactTr[0] );				   							
            }else{
                showmsg("Oops Deleting Como Nos Contactó not get successfully done.\n Please Try Again",'f');				   
            }
            $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
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