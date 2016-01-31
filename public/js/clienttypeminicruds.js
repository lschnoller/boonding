$(document).ready(function(){
	
    $( ".add-new-client" ).dialog({
        autoOpen: false,
        modal:true,		
        height: window.screen.height - 400,
        width: 400,			
        buttons: {
			
            "Guardar": function() {				
                $("#addNewClientForm").submit();
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
			
        }
    });
    $("#addNewClientForm").validate({
        submitHandler: function(form){
            userFormPop = $("#addNewClientForm");
            var url = userFormPop.attr('action');
            var clientTypeid	= $(' input[name="id"]',userFormPop).val();
            var clientTypename	= $(' input[name="client"]',userFormPop).val();
            $.post(url, { 
                "id"	  	: clientTypeid,
                "client"  	: clientTypename,
            },
            function(data){
                if(isInt(data)){
                    var submitType = $('.add-new-client .addEditBtn').text();
                    if(submitType	==	'Edit'){
                        showmsg("Actualización exitosa.",'t');
                        $('[name="client_type"] option[value="'+clientTypeid+'"]').text(clientTypename);
                        $('.add-new-client .addEditBtn').text('Add');
                        $(' input[name="client"]',userFormPop).val('');
                        $(' input[name="id"]',userFormPop).val('');
                        AddClientTypeTabs.tabs({
                            selected: 0
                        });	
                        $('#clientTypeId_'+clientTypeid+' .clientTypeName').text(clientTypename);
                        window.location	=	window.location.href+'#clientTypeId_'+clientTypeid;
									  
                    }else if(submitType	==	'Add'){
                        showmsg("Adding New Client Successful!",'t');
                        var addOption = '<option value="'+data+'">'+$(' input[name="client"]',userFormPop).val()+'</option>';
                        $('#userForm [name="client_type"] .addnew').before(addOption);
                        $('#userForm [name="client_type"] option[value="'+data+'"]').attr({
                            'selected':'selected'
                        });
                        $("#userFormPop [name='client_type']").append(addOption);
                        var trmade = $('#ClientTypeGrid').dataTable().fnAddData( [
                            data,
                            clientTypename,								                                                            	
                            ] );
                        var oSettings = ClientTypeTable.fnSettings();
                        var nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'clientTypeId_'+data;
                        $("td:eq(1)",nTr).addClass('clientTypeName');
                        $(' input[name="client"]',userFormPop).val('');
                        $(' input[name="id"]',userFormPop).val('');
                        AddClientTypeTabs.tabs({
                            selected: 0
                        });
                        window.location	=	window.location.href+'#'+nTr.id;
													
                    }
                }else{
                    showmsg("Oops Updating Cliente not get successfully done.\n Please Try Again",'f');
							  
                }
                $('#ClientTypeGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
            });
        }
    });
    AddClientTypeTabs	=	$("#AddClientTypeTabs").tabs({
        selected	:	1
    });

    ClientTypeTable = $('#ClientTypeGrid').dataTable({
        "bJQueryUI"			: true,
        "bAutoWidth"		: true,
        "bScrollCollapse"	: true,
        "bStateSave"		: true,
        "bPaginate"			: false,
        "bInfo"				: false
		
	
    }).ready(function(){
        $('#ClientTypeGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    })
    //$("#ClientTypeGrid_wrapper .fg-toolbar").prepend('<h1>test</h1>');
    var edBtn = "<span class='clientTypeEditBtn gridBtn'>Edit</span>";
    edBtn += "<span class='clientTypeDeleteBtn gridBtn'>Delete</span>";
    $("#ClientTypeGrid_wrapper .fg-toolbar:has('.dataTables_filter')").append(edBtn);
	
    $("#ClientTypeGrid tbody").click(function(event) {
        $(ClientTypeTable.fnSettings().aoData).each(function (){
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });
	
	
    $('.clientTypeEditBtn').live('click',function(){
        var clientTypeTr	=	$(".ClientTypegridtbody .row_selected");
        var clientTypeId	=	clientTypeTr.attr('id').split('_');
        var clientTypeName	=	$('.clientTypeName',clientTypeTr).text();
        var tForm			=	$('#addNewClientForm');
        $('[name="client"]',tForm).val(clientTypeName);
        $('[name="id"]',tForm).val(clientTypeId[1]);
        AddClientTypeTabs.tabs({
            selected: 1
        });			
        $('.add-new-client .addEditBtn').text('Edit');
    });
    $('.clientTypeDeleteBtn').live('click',function(){
        var clientTypeTr	=	fnGetSelected( ClientTypeTable );
        var clientTypeId	=	clientTypeTr[0].id.split('_');
        var url = 'index/deleteclienttypeajax';
        $.post(url, { 
            "id"	  	: clientTypeId[1],		
        },			
        function(data){
            if(data){				  
                showmsg("Deleted Successfully!",'t');
                ClientTypeTable.fnDeleteRow( clientTypeTr[0] );				   							
            }else{
                showmsg("Oops Deleting Cliente not get successfully done.\n Please Try Again",'f');				   
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