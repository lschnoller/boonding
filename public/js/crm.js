var sure_to_delete = "Está seguro que desea eliminar?";
function deleteThis(ME){
    var r=confirm(sure_to_delete);
    if (r==true){
        URL = $(ME).attr('href');
        $.post(URL,
            function(data){
                console.log(data);
                if(data.status == 'success'){
                    $(ME).parent().parent().fadeOut();
                    alertMessage(data.message,'=)');
                }else{
                    alertMessage(data.message,'error');
                }
            }, "json");
    }
    return false;
}

function zzzsignOffEvent(ME,_event_id, _operator_id,_item_id){
    $(ME).after('<img src="/images/loading.gif" width="13" />');
    $(ME).hide();
    $.post('/crm/evetnsignoff/'+_event_id+'/'+_operator_id+'/'+_item_id,
        function(data){
            console.log(data);
            $(ME).next().remove();
            if(data.status == 'success'){
                $(ME).after('<span>Ready</span>');
                $(ME).remove();
            }else{
                $(ME).show();
                alert(data.message);
            }
		    
        }, "json");
}

function signOffEvent(ME,_id,_status){
    if(_status == 1){
        $('#date-'+_id).hide();
        $('#date-'+_id).parent().hide();
        $('#comment-box-'+_id).removeClass('comment-box-red');
    }else{
        $('#date-'+_id).show();
        $('#date-'+_id).parent().show();
        $('#comment-box-'+_id).addClass('comment-box-red');
    }
    $('#comment-box-'+_id).show("fast", function() {
        $('.accordion-resize').accordion("resize");
    });
    $('#status-'+_id).val(_status);
    $('#comment-'+_id).focus();
}

function signOffEventClose(_id){
    $('#comment-box-'+_id).hide("fast", function() {
        $('.accordion-resize').accordion("resize");
    });
}


function saveEventAction(ME, notificationId, status){
    var date;
    date = '';    
    $(ME).attr("disabled", "disabled");
    //$(ME).prop("disabled", true);
    if(status == 0) { //reprogramar without date
       $('#reprogramar-date').datepicker({
           changeMonth: true,
           changeYear: true,
           dateFormat: 'dd/mm/yy',
           yearRange: "-0:+1", // this is the option you're looking for
           onSelect: function(dateText, inst) {
               if(dateText != '') {
                   $('#reprogramarDateValue').val(dateText);
                   saveEventAction(ME, notificationId, 2)                   
               }                   
           },
           'beforeShow': function(input, inst){
               $(inst.dpDiv).position({
                  my: "left bottom",
                  at: "left top",
                  of: $(input)
               });
           },
       });
       $('#ui-datepicker-div').draggable();
       $('#reprogramar-date').datepicker('show');
    }
    else if(status == 1 || status == 2) //finalizar tarea or reprogramar with date
    {
        if(status == 2) {
            date = $('#reprogramarDateValue').val();            
        }        
        //var _status = $('#status-'+notificationId).val();
        //var _comment = $('#comment-'+notificationId).val();
        var comment = $('#signoff-comment').val();
        //$(ME).val('Guardando...');
        $.post('/crm/eventsignoff/'+notificationId,{
            status: status, 
            comment: comment,
            date: date
        },
        function(data){
            console.log(data);
            $(ME).next().next().hide();
            $(ME).removeClass('ui-state-disabled');
            if(data.status == 'success'){
                $('#signoff-comment').val('');
                $(data.html).insertAfter('#client-info-cont-signoff');
                //$('#comment-box-'+notificationId).fadeOut();
                //$('#comment-box-'+notificationId).remove();
                
                if($('#event-'+notificationId).next().hasClass('delayed-btn')) {
                    $('#event-'+notificationId).fadeOut();
                    $('#event-'+notificationId).next().fadeOut('slow', function() {
                        $('#event-'+notificationId).next().next().remove();//hide the <br />
                    });//hide the demorada label also                        
                }else {
                    $('#event-'+notificationId).fadeOut('slow', function(){
                        $('#event-'+notificationId).next().remove();//hide the <br />
                    });
                }                   
                
                if(! $('#completed-tasks').is(":visible")) //has no completed tasks, then show hidden box
                    $('#completed-tasks').show();
                $('#completed-tasks').prepend(data.html); //add the completed task to the completed tasks list.

                $('#signoffDialog').dialog('close');
            }else            
                alert(data.message);  
        }, "json");
    }
    $(ME).removeAttr("disabled");
}

function checkOperationsOnDelay(firstLoad){
    $('#loader01').show();
    $('#operations-on-delay').html('');
    //$('#operations-on-delay').hide();
    //$('#recent-op-loader').css('display', 'inline-block');
    $.post('/crm/getoperationsmonitor',
        function(data){
            console.log(data);
            if(data.status == 'success'){    
                $('#operations-on-delay').html(data.html);                                
                //$('.initial-content').html(data.html);
                //$('.initial-content').show();
                if(firstLoad !== undefined) {
                    $('#operations-on-delay').show();
                    var icons = {
                        header: "ui-accordion-icon",
                        activeHeader: "ui-accordion-icon-active"
                      };
                      $("#monitor").accordion({
                          icons: icons,
                          collapsible: true,
                          autoHeight: true,
                          active:false,
                          heightStyle:'fill'
                      });
                      $('#monitor').accordion('activate'); //open the monitor by default 
                      //
                      //clean up
                      $('#monitor h3').removeClass('initial');
                      //$('#monitor').accordion('option','active',0); //open the monitor by default 
                }
                else {
                    $('#operations-on-delay').slideDown(function() {
                        //alert('finished-motion');
                        $('.accordion-resize').accordion("resize");
                    });                        
                }
                $('#loader01').hide();
            }else{
                alert(data.message.xdebug_message);
                $('#operations-on-delay').html('Hubo un error al cargar las operaciones.');
                $('.accordion-resize').accordion("resize");
            }      
            /*$('#recent-op-loader').hide();
            $('#operations-on-delay').effect("highlight", {}, 3000);
            $('.accordion-resize').accordion("resize");*/
        }, "json");
    var t = setTimeout("checkOperationsOnDelay()",120000); //every 2 min
}
    
function submitOperatorComment(ME,_client_id)
{
    _comment = $('#operator-comment').val();
    if($.trim(_comment) != '')
    {
        $(ME).val('Por favor espere...');
        $(ME).attr("disabled", "disabled");
        $.post('/crm/submitoperatorcomment',{
            client_id:_client_id, 
            comment: _comment
        },
        function(data){
            console.log(data);
            if(data.status == 'success'){
                $('#operator-comment').val('');
                $(data.html).insertAfter('#client-info-cont');
                $('#crmDialog').dialog('close');
            }else{
                alert(data.message);
            }
            $(ME).removeAttr("disabled");
            $(ME).val('Guardar');

        }, "json");
    }
}

$(function (){
    $('.sign-off').live('click',function(){
        var dialogTitle = $('#client-name', this).text();
        var viewportHeight = $(window).height();        
        var dialog = $('#signoffDialog');
        dialog.dialog({
            autoOpen:false,
            resizable:false,    
            draggable:false,
            position: 'top',
            close: function(event, ui) {                
                dialog.hide('fadeOut');
                $("#signoffDialog").html("");
            },
            modal: true,
            dialogClass:'dialogPosition',
            width: 350,
            height: viewportHeight-10,
            title: dialogTitle,
            hide: "fade",
            show: "fadeIn"
        });        
        
        var url = $(this).attr('href');
        dialog.load(url, {},
            function (responseText, textStatus, XMLHttpRequest) {   
                if(responseText.indexOf('"status":-1') == -1) { //the call succeeded               
                    $('#signoffDialog').parent().css({
                        position:"fixed"
                    }).end().dialog('open');
                    dialog.removeClass('loading');
                    viewportHeight -= 240;        
                    $('#client-info ul').css('height', viewportHeight+'px');
                }
                else {
                    var data = 'data = '+responseText; //evals results, creates "data" array
                    eval(data);
                    if(data.status == -1) {
                        alert('Esta tarea ya fue realizada por otro operador.');
                        $('#event-'+data.notificationId).fadeOut();
                    }
                }
            }
            );            
        return false;			
    });
    
    $('.client-info').live('click',function(){
        var dialogTitle = $(this).text();
        var viewportHeight = $(window).height();        
        var dialog = $('#crmDialog');
        dialog.dialog({
            autoOpen:false,
            resizable:false,    
            draggable:false,
            position: 'top',
            close: function(event, ui) {
                $("#crmDialog").html("");
            },
            modal: true,
            dialogClass:'dialogPosition',
            width: 350,
            height: viewportHeight-10,
            title: dialogTitle,
            hide: "fade",
            show: "fadeIn"
        });
        $('#crmDialog').parent().css({
            position:"fixed"
        }).end().dialog('open');
        
        var url = this.href;
        dialog.load(
            url, 
            {},
            function (responseText, textStatus, XMLHttpRequest) {
                dialog.removeClass('loading');
                viewportHeight -= 190;        
                $('#client-info ul').css('height', viewportHeight+'px');
            }
            );
        /*    
        var clientid = $(this).attr('href').split('/');
        $.post('/index/getclientsdetailsbyidajax', {"client_id": clientid[3]},
        function(data){
            if(data){
                //var html = data['first_name']+' '+data['last_name']+' - <span style="font-size:12px">'+data['client_type_name']+'<br />Celular: '+data['tel_cell']+'<br />Tel: '+data['tel_part_code']+' '+data['tel_part']+'<br />Email: '+data['email']+'</span>';
                var html = data['first_name']+' '+data['last_name']+'<span style="font-size:12px"><br />Celular: '+data['tel_cell']+'<br />Tel: '+data['tel_part_code']+' '+data['tel_part']+'<br />Email: '+data['email']+'</span>';
                $("#crmDialog").prev().find(".ui-dialog-title").html(html);
            }
            else
                alert('ajax returned no data');
        }, "json");
        */
        
        return false;			
    });
    
});
