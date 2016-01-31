$(function() {
    var cTable = $('.cTable');
    var i = 0;
    var trArr = new Array();
    $('tr', cTable).each(function() {
        trArr[i] = $('td', this);
        i++;
    });
    var table2 = $('#grid');
    table2.html('');
    for (var j = 0; j < trArr[0].length; j++) {
        var newTr = $('<tr></tr>');

        for (var k = 0; k < trArr.length; k++)
        {
            newTr.append('<td>' + trArr[k][j].innerHTML + '</td>');
        }

        table2.append('<tr>' + newTr.html() + '</tr>');
    }
    cTable.show();

    /*
     oTable = $('#grid').dataTable({
     "bJQueryUI": true,
     "sPaginationType": "full_numbers",
     "sScrollX": "100%",
     
     "bScrollCollapse": true,
     "bStateSave": true,
     "iDisplayLength"	: 50,
     
     
     });
     */
    /*
     var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
     edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
     $("#grid_length").append(edBtn);
     
     $("#grid tbody").click(function(event) {
     $(oTable.fnSettings().aoData).each(function (){
     $(this.nTr).removeClass('row_selected');
     });
     $(event.target.parentNode).addClass('row_selected');
     });
     */

    /* Add a click handler for the delete row */
    $('.deleteBtn').click(function() {

        deleteFun(oTable);
    });



    function deleteFun(oTable) {
        var result = confirm('Esta seguro que desea eliminar este registro?');

        if (result) {
            var anSelected = fnGetSelected(oTable);
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/chequedeleteajax";
            $.post(url, {
                "id": selIdArr[1]
            },
            function(data) {
                if (isInt(data)) {
                    showmsg("Registro eliminado exitosamente", 't');
                    oTable.fnDeleteRow(anSelected[0]);
                } else {
                    showmsg("El registro no ha podido ser eliminado, por favor intente nuevamente.", 'f');
                }
            });
        }
    }
    function fnGetSelected(oTableLocal)
    {
        var aReturn = new Array();
        var aTrs = oTableLocal.fnGetNodes();

        for (var i = 0; i < aTrs.length; i++)
        {
            if ($(aTrs[i]).hasClass('row_selected'))
            {
                aReturn.push(aTrs[i]);
            }
        }
        return aReturn;
    }

    /*tabs*/
    //$( "#tabs" ).tabs({ selected: 0 });
    $("#plansForm").validate({
        submitHandler: function(form) {
            if (!gastos_cheque_menor()) {
                return false;
            }
            tForm = $("#plansForm");
            var name;
            if ($('[name="name"]', tForm).val() != '') {
                name = $('[name="name"]', tForm).val();
            }
            var url = tForm.attr('action');
            $.post(url, {
                "id": $(' [name="id"]', tForm).val(),
                "email": $(' [name="email"]', tForm).val(),
                "name": name,
                "tasa_anual": $(' [name="tasa_anual"]', tForm).val(),
                "impuesto_al_cheque": $(' [name="impuesto_al_cheque"]', tForm).val(),
                "gastos_interior": $(' [name="gastos_interior"]', tForm).val(),
                "gastos_general": $(' [name="gastos_general"]', tForm).val(),
                "gastos_denuncia": $(' [name="gastos_denuncia"]', tForm).val(),
                "gastos_rechazo": $(' [name="gastos_rechazo"]', tForm).val(),
                "acreditacion_capital": $(' [name="acreditacion_capital"]', tForm).val(),
                "acreditacion_interior": $(' [name="acreditacion_interior"]', tForm).val(),
                "gastos_cheque_menor_a_1": $(' [name="gastos_cheque_menor_a_1"]', tForm).val(),
                "gastos_cheque_a_1": $(' [name="gastos_cheque_a_1"]', tForm).val(),
                "gastos_cheque_menor_a_2": $(' [name="gastos_cheque_menor_a_2"]', tForm).val(),
                "gastos_cheque_a_2": $(' [name="gastos_cheque_a_2"]', tForm).val(),
            },
                    function(data) {

                        if (isInt(data)) {
                            showmsg("Los cambios han sido guardados", 't');

                            var selRow = $("#provider_details");
                            var idArr = selRow.attr('id').split("_");
                            var popEditForm = $("#grid #userid_" + $(' [name="id"]', tForm).val());

                            //$('[name="id"]'					,popEditForm).val(idArr[1]);
                            $('[name="email"]', popEditForm).val($("[name='email']", selRow).val());
                            $('[name="tasa_anual"]', popEditForm).val($("[name='tasa_anual']", selRow).val());
                            $('[name="impuesto_al_cheque"]', popEditForm).val($("[name='impuesto_al_cheque']", selRow).val());
                            $('[name="gastos_interior"]', popEditForm).val($("[name='gastos_interior']", selRow).val());
                            $('[name="gastos_general"]', popEditForm).val($("[name='gastos_general']", selRow).val());
                            $('[name="gastos_denuncia"]', popEditForm).val($("[name='gastos_denuncia']", selRow).val());
                            $('[name="gastos_rechazo"]', popEditForm).val($("[name='gastos_rechazo']", selRow).val());
                            $('[name="acreditacion_capital"]', popEditForm).val($("[name='acreditacion_capital']", selRow).val());
                            $('[name="acreditacion_interior"]', popEditForm).val($("[name='acreditacion_interior']", selRow).val());
                            $('[name="gastos_cheque_menor_a_1"]', popEditForm).val($("[name='gastos_cheque_menor_a_1']", selRow).val());
                            $('[name="gastos_cheque_a_1"]', popEditForm).val($("[name='gastos_cheque_a_1']", selRow).val());
                            $('[name="gastos_cheque_menor_a_2"]', popEditForm).val($("[name='gastos_cheque_menor_a_2']", selRow).val());
                            $('[name="gastos_cheque_a_2"]', popEditForm).val($("[name='gastos_cheque_a_2']", selRow).val());
                            $("#provider_details").dialog('close');
                            clearForm(tForm);
                        } else {
                            $("#provider_details").dialog('close');
                            showmsg("Hubo un error al guardar los cambios, por favor intente nuevamente.", 'f');
                        }
                    });

        }
    });
    $("#gyForm").validate({
        submitHandler: function(form) {
            tForm = $("#gyForm");

            var url = tForm.attr('action');
            $.post(url, {
                "id": $(' [name="id"]', tForm).val(),
                "tiempo_ac_capital": $(' [name="tiempo_ac_capital"]', tForm).val(),
                "tiempo_ac_interior": $(' [name="tiempo_ac_interior"]', tForm).val(),
                "tiempo_ac_sistema": $(' [name="tiempo_ac_sistema"]', tForm).val(),
                "gastos_denuncia": $(' [name="gastos_denuncia"]', tForm).val(),
                "gastos_rechazo": $(' [name="gastos_rechazo"]', tForm).val(),
                "gastos_general": $(' [name="gastos_general"]', tForm).val(),
                "gastos_interior": $(' [name="gastos_interior"]', tForm).val(),
                "impuesto_al_cheque": $(' [name="impuesto_al_cheque"]', tForm).val(),
                "crm_operation_notify_span": $('#crm_operation_notify_span').val()
            },
            function(data) {
                if (isInt(data)) {
                    showmsg("Los cambios han sido guardados", 't');
                } else {
                    showmsg("Hubo un error al guardar los cambios, por favor intente nuevamente.", 'f');
                }
            });

        }
    });
    $("#caveForm").validate({
        submitHandler: function(form) {
            tForm = $("#caveForm");

            var url = tForm.attr('action');
            $.post(url, {
                "id": $(' [name="id"]', tForm).val(),
                "email": $(' [name="email"]', tForm).val(),
                "tasa_anual": $(' [name="tasa_anual"]', tForm).val(),
                "impuesto_al_cheque": $(' [name="impuesto_al_cheque"]', tForm).val(),
                "gastos_general": $(' [name="gastos_general"]', tForm).val(),
                "gastos_denuncia": $(' [name="gastos_denuncia"]', tForm).val(),
                "gastos_rechazo": $(' [name="gastos_rechazo"]', tForm).val(),
                "acreditacion_capital": $(' [name="acreditacion_capital"]', tForm).val(),
                "acreditacion_interior": $(' [name="acreditacion_interior"]', tForm).val(),
                "gastos_cheque_menor_a_1": $(' [name="gastos_cheque_menor_a_1"]', tForm).val(),
                "gastos_cheque_a_1": $(' [name="gastos_cheque_a_1"]', tForm).val(),
                "gastos_cheque_menor_a_2": $(' [name="gastos_cheque_menor_a_2"]', tForm).val(),
                "gastos_cheque_a_2": $(' [name="gastos_cheque_a_2"]', tForm).val(),
            },
                    function(data) {

                        if (isInt(data)) {
                            showmsg("Los cambios han sido guardados", 't');
                            var selRow = $("#cave_details");
                            var idArr = selRow.attr('id').split("_");
                            var popEditForm = $("#grid #cave_" + $(' [name="id"]', tForm).val());

                            //$('[name="id"]'					,popEditForm).val(idArr[1]);
                            $('[name="email"]', popEditForm).val($("[name='email']", selRow).val());
                            $('[name="tasa_anual"]', popEditForm).val($("[name='tasa_anual']", selRow).val());
                            $('[name="impuesto_al_cheque"]', popEditForm).val($("[name='impuesto_al_cheque']", selRow).val());
                            $('[name="gastos_general"]', popEditForm).val($("[name='gastos_general']", selRow).val());
                            $('[name="gastos_denuncia"]', popEditForm).val($("[name='gastos_denuncia']", selRow).val());
                            $('[name="gastos_rechazo"]', popEditForm).val($("[name='gastos_rechazo']", selRow).val());
                            $('[name="acreditacion_capital"]', popEditForm).val($("[name='acreditacion_capital']", selRow).val());
                            $('[name="acreditacion_interior"]', popEditForm).val($("[name='acreditacion_interior']", selRow).val());
                            $('[name="gastos_cheque_menor_a_1"]', popEditForm).val($("[name='gastos_cheque_menor_a_1']", selRow).val());
                            $('[name="gastos_cheque_a_1"]', popEditForm).val($("[name='gastos_cheque_a_1']", selRow).val());
                            $('[name="gastos_cheque_menor_a_2"]', popEditForm).val($("[name='gastos_cheque_menor_a_2']", selRow).val());
                            $('[name="gastos_cheque_a_2"]', popEditForm).val($("[name='gastos_cheque_a_2']", selRow).val());

                            $("#cave_details").dialog('close');
                            clearForm(tForm);

                        } else {
                            showmsg("Hubo un error al guardar los cambios, por favor intente nuevamente.", 'f');
                        }
                    });

        }
    });

    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        "dateFormat": 'dd/mm/yy',
        yearRange: "-50:+0", // this is the option you're looking for
    });


    $("#provider_details").dialog({
        autoOpen: false,
        modal: true,
        height: window.screen.height - 300,
        width: window.screen.width - 700,
        buttons: {
            "Guardar": function() {
                $('#plansForm').submit();

            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });
    $("#cave_details").dialog({
        autoOpen: false,
        modal: true,
        height: window.screen.height - 300,
        width: window.screen.width - 700,
        buttons: {
            "Guardar": function() {
                $('#caveForm').submit();

            },
            "Cancelar": function() {
                $(this).dialog('close');
            }
        }
    });

    $('.toolTipCancelBtn').click(function() {
        $('.tooltipBox').hide();
    });

    $('.dataTables_scrollHeadInner .ui-state-default:eq(2)').trigger('click');
    $('.name_btn').live('click', function() {
        $('#nameTr').hide();
        var selRow = $(this);
        var idArr = selRow.attr('id').split("_");
        var popEditForm = $("#provider_details");
        $('[name="id"]', popEditForm).val(idArr[1]);
        $('[name="email"]', popEditForm).val($("[name='email']", selRow).val());
        $('#ui-dialog-title-provider_details').html('Configuración ' + $("[name='name']", selRow).val());
        $('[name="name"]', popEditForm).val($("[name='name']", selRow).val());
        $('[name="tasa_anual"]', popEditForm).val($("[name='tasa_anual']", selRow).val());
        $('[name="impuesto_al_cheque"]', popEditForm).val($("[name='impuesto_al_cheque']", selRow).val());
        $('[name="gastos_interior"]', popEditForm).val($("[name='gastos_interior']", selRow).val());
        $('[name="gastos_general"]', popEditForm).val($("[name='gastos_general']", selRow).val());
        $('[name="gastos_denuncia"]', popEditForm).val($("[name='gastos_denuncia']", selRow).val());
        $('[name="gastos_rechazo"]', popEditForm).val($("[name='gastos_rechazo']", selRow).val());
        $('[name="acreditacion_capital"]', popEditForm).val($("[name='acreditacion_capital']", selRow).val());
        $('[name="acreditacion_interior"]', popEditForm).val($("[name='acreditacion_interior']", selRow).val());

        $('[name="gastos_cheque_menor_a_1"]', popEditForm).val($("[name='gastos_cheque_menor_a_1']", selRow).val());
        $('[name="gastos_cheque_a_1"]', popEditForm).val($("[name='gastos_cheque_a_1']", selRow).val());
        $('[name="gastos_cheque_menor_a_2"]', popEditForm).val($("[name='gastos_cheque_menor_a_2']", selRow).val());
        $('[name="gastos_cheque_a_2"]', popEditForm).val($("[name='gastos_cheque_a_2']", selRow).val());

        popEditForm.dialog('open');
    });

    $('.addNewProvider').live('click', function() {
        $('#nameTr').show();
        var popEditForm = $("#provider_details");
        $('#ui-dialog-title-provider_details').html('Agregar Nuevo Proveedor');
        $('[name="id"]', popEditForm).val('');
        $('[name="name"]', popEditForm).val('');
        $('[name="email"]', popEditForm).val('');
        $('.name', popEditForm).text('Email');
        $('[name="tasa_anual"]', popEditForm).val('');
        $('[name="impuesto_al_cheque"]', popEditForm).val('');
        $('[name="gastos_interior"]', popEditForm).val('');
        $('[name="gastos_general"]', popEditForm).val('');
        $('[name="gastos_denuncia"]', popEditForm).val('');
        $('[name="gastos_rechazo"]', popEditForm).val('');
        $('[name="acreditacion_capital"]', popEditForm).val('');
        $('[name="acreditacion_interior"]', popEditForm).val('');
        $('[name="gastos_cheque_menor_a_1"]', popEditForm).val('');
        $('[name="gastos_cheque_a_1"]', popEditForm).val('');
        $('[name="gastos_cheque_menor_a_2"]', popEditForm).val('');
        $('[name="gastos_cheque_a_2"]', popEditForm).val('');

        popEditForm.dialog('open');
    });

    /*
     $('.cave_btn').live('click',function(){
     var selRow = $(this);
     var idArr = selRow.attr('id').split("_");
     var popEditForm = $("#cave_details");				
     
     $('[name="id"]'					,popEditForm).val(idArr[1]);
     $('[name="email"]'				,popEditForm).val($("[name='email']",selRow).val());
     //$('#ui-dialog-title-cave_details' ).html('Configuración '+$("[name='name']",selRow).val());
     $('[name="tasa_anual"]'			,popEditForm).val($("[name='tasa_anual']",selRow).val());
     $('[name="impuesto_al_cheque"]'	,popEditForm).val($("[name='impuesto_al_cheque']",selRow).val());
     $('[name="gastos_general"]'		,popEditForm).val($("[name='gastos_general']",selRow).val());
     $('[name="gastos_denuncia"]'	,popEditForm).val($("[name='gastos_denuncia']",selRow).val());
     $('[name="gastos_rechazo"]'		,popEditForm).val($("[name='gastos_rechazo']",selRow).val());
     $('[name="acreditacion_capital"]',popEditForm).val($("[name='acreditacion_capital']",selRow).val());
     $('[name="acreditacion_interior"]',popEditForm).val($("[name='acreditacion_interior']",selRow).val());
     $('[name="gastos_cheque_menor_a_1"]',popEditForm).val($("[name='gastos_cheque_menor_a_1']",selRow).val());
     $('[name="gastos_cheque_a_1"]',popEditForm).val($("[name='gastos_cheque_a_1']",selRow).val());
     $('[name="gastos_cheque_menor_a_2"]',popEditForm).val($("[name='gastos_cheque_menor_a_2']",selRow).val());
     $('[name="gastos_cheque_a_2"]',popEditForm).val($("[name='gastos_cheque_a_2']",selRow).val());
     
     popEditForm.dialog('open');
     
     });
     */
    $('.menorProv').blur(function() {
        gastos_cheque_menor('#plansForm');
    });
    $('.menorCave').blur(function() {
        gastos_cheque_menor('#caveForm');
    });

});
function getToolTipForm(ele) {

    var tooltipBox = $('.tooltipBox');
    tooltipBox.show();
    var x = ele.offset().left;
    var y = ele.offset().top;
    x = x - tooltipBox.width() - 10;
    tooltipBox.css({
        'top': y + 'px',
        'left': x + 'px'
    });
    return tooltipBox;
}
function gastos_cheque_menor(formId) {
    var gastos_cheque_menor_a_1 = $(formId + ' [name="gastos_cheque_menor_a_1"]');
    var gastos_cheque_a_1 = $(formId + ' [name="gastos_cheque_a_1"]');
    var gastos_cheque_menor_a_2 = $(formId + ' [name="gastos_cheque_menor_a_2"]');
    var gastos_cheque_a_2 = $(formId + ' [name="gastos_cheque_a_2"]');

    if ($.trim(gastos_cheque_menor_a_1.val()) == '' && $.trim(gastos_cheque_a_1.val()) == '') {
        gastos_cheque_menor_a_1.removeClass('required');
        gastos_cheque_a_1.removeClass('required');
    } else {
        gastos_cheque_menor_a_1.addClass('required');
        gastos_cheque_a_1.addClass('required');
    }

    if ($.trim(gastos_cheque_menor_a_2.val()) == '' && $.trim(gastos_cheque_a_2.val()) == '') {
        gastos_cheque_menor_a_2.removeClass('required');
        gastos_cheque_a_2.removeClass('required');
    } else {
        gastos_cheque_menor_a_2.addClass('required');
        gastos_cheque_a_2.addClass('required');
    }
    if (parseFloat(gastos_cheque_menor_a_1.val()) > parseFloat(gastos_cheque_menor_a_2.val())) {
        gastos_cheque_menor_a_1.parents('td:eq(0)').find('label').remove();
        gastos_cheque_menor_a_1.removeClass('valid').addClass('error').after('<label for="gastos_cheque_menor_a_1" class="error">Este importe debe ser menor al importe siguiente.</label>');
        return false;
    } else {
        gastos_cheque_menor_a_1.removeClass('error');
        gastos_cheque_menor_a_1.next('label').remove();
    }
    return true;

}