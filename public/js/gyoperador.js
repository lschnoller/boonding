$(document).ready(function () {
    $("#tabs").tabs({selected: 0});
    $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    $("#operatorForm").validate({
        submitHandler: function (form) {
            var tForm = $("#operatorForm");
            var url = tForm.attr('action');
            $.post(url, {
                "type": $(' select[name="type"]', tForm).val(),
                "name": $(' input[name="name"]', tForm).val(),
                "last_name": $(' input[name="last_name"]', tForm).val(),
                "email": $(' input[name="email"]', tForm).val(),
                "password": $(' input[name="password"]', tForm).val()
            },
            function (data) {
                if (isInt(data)) {
                    var type;
                    switch($('select[name="type"]', tForm).val()) {
                        case '1': 
                            type = 'Administrador/a';
                            break;
                        case '2':
                            type = 'Supervisor/a';
                            break;
                        case '3':
                            type = 'Operador/a';
                            break;
                    }
                    var trmade = $('#grid').dataTable().fnAddData([
                        data,
                        type,
                        $('input[name="name"]', tForm).val(),
                        $('input[name="last_name"]', tForm).val(),
                        $('input[name="email"]', tForm).val(),
                        //$.md5($('input[name="password"]', tForm).val())
                    ]);
                    var oSettings = oTable.fnSettings();
                    var nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'userid_' + data;
                    $("td:eq(1)", nTr).addClass('user_type');
                    $("td:eq(2)", nTr).addClass('user_name');
                    $("td:eq(3)", nTr).addClass('user_last_name');
                    $("td:eq(4)", nTr).addClass('user_email');
                    //$("td:eq(5)", nTr).addClass('user_password');
                    showmsg("El operador se ha agregado con exito.", 't');
                    clearForm(tForm);

                } else {
                    showmsg("Hubo un problema al agregar el operador.", 'f');
                }
            });
        }
    });
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bScrollCollapse": true,
        "bStateSave": true, "iDisplayLength": 50,
    });
    var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
    edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
    $("#grid_length").append(edBtn);
    $("#grid tbody").click(function (event) {
        $(oTable.fnSettings().aoData).each(function () {
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });
    $('.deleteBtn').click(function () {
        deleteFun(oTable);
    });



    function deleteFun(oTable) {
        var result = confirm('Esta seguro que desea eliminar al usuario?');

        if (result) {
            var anSelected = fnGetSelected(oTable);
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/operatordeleteajax";
            $.post(url, {
                "id": selIdArr[1]
            },
            function (data) {
                if (isInt(data) && data) {
                    showmsg("El usuario ha sido eliminado.", 't');
                    oTable.fnDeleteRow(anSelected[0]);
                } else {
                    showmsg("Hubo un error al eliminar el usuario.", 'f');
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
    $('.edTabBtn').click(function () {
        //$('.ui-icon-triangle-1-n').parent('th').trigger('click');
        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    });
    $("#editPopUP").dialog({
        autoOpen: false, modal: true,
        height: 500,
        width: 600,
        buttons: {
            "Guardar": function () {
                $("#operatorFormPop").submit();
            },
            "Cancelar": function () {
                $(this).dialog("close");
                clearForm($("#operatorFormPop"));
                $('#operatorFormPop .pwd_tr').hide();
                $('#operatorFormPop .chgpwd').text('Change Password');
                $("#operatorFormPop input[name='password']").removeClass('required');
            }
        },
        close: function () {
            clearForm($("#operatorFormPop"));
            $('#operatorFormPop .pwd_tr').hide();
            $('#operatorFormPop .chgpwd').text('Change Password');
            $("#operatorFormPop input[name='password']").removeClass('required');
        }
    });
    $(".editBtn")
            .click(function () {
                var selRow = $(".gridtbody .row_selected");

                if (selRow.size()) {
                    var idArr = selRow.attr('id').split("_");
                    var popEditForm = $("#operatorFormPop");
                    $('input[name="id"]', popEditForm).val(idArr[1]);
                    var typeVal;
                    switch($(".user_type", selRow).text()){
                        case 'Administrador/a':
                            typeVal = '1';
                            break;
                        case 'Supervisor/a':
                            typeVal = '2';
                            break;
                        case 'Operador/a':
                            typeVal = '3';
                            break;
                    }
                    
                    $('select[name="type"]', popEditForm).val(typeVal);
                    $('input[name="name"]', popEditForm).val($(".user_name", selRow).text());
                    $('input[name="last_name"]', popEditForm).val($(".user_last_name", selRow).text());
                    $('input[name="email"]', popEditForm).val($(".user_email", selRow).text());
                    //$('input[name="password"]',popEditForm).val($(".user_password",selRow).text());
                    $("#operatorFormPop input[name='password']").val('');
                    $("#editPopUP").dialog("open");
                } else {
                    alert("Por favor, seleccione la fila que desea editar.");
                }

                //trSelected
            });
    $("#operatorFormPop").validate({
        submitHandler: function (form) {
            userFormPop = $("#operatorFormPop");
            var url = userFormPop.attr('action');
            $.post(url, {
                "id": $(' input[name="id"]', userFormPop).val(),
                "type": $(' select[name="type"]', userFormPop).val(),
                "name": $(' input[name="name"]', userFormPop).val(),
                "last_name": $(' input[name="last_name"]', userFormPop).val(),
                "email": $(' input[name="email"]', userFormPop).val(),
                "password": $(' input[name="password"]', userFormPop).val()
            },
            function (data) {
                if (data) {
                    var selRow = $("#grid .row_selected");
                    var typeVal;
                    switch($(' select[name="type"]', userFormPop).val()) {
                        case '1':
                            typeVal = 'Administrador/a';
                            break;
                        case '2':
                            typeVal = 'Supervisor/a';
                            break;
                        case '3':
                            typeVal = 'Operador/a';
                            break;
                    }
                    $(".user_type", selRow).text(typeVal);
                    $(".user_name", selRow).text($(' input[name="name"]', userFormPop).val());
                    $(".user_last_name", selRow).text($(' input[name="last_name"]', userFormPop).val());
                    $(".user_email", selRow).text($(' input[name="email"]', userFormPop).val());
                    //$(".user_password", selRow).text($.md5($(' input[name="password"]', userFormPop).val()));

                    showmsg("La información se ha actualizado correctamente.", 't');
                    $("#editPopUP").dialog('close');
                    clearForm(userFormPop);
                } else {
                    showmsg("Hubo un problema al actualizar la información.", 'f');
                    $("#editPopUP").dialog('close');
                }
                //$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
            });
        }
    });
    $('#operatorFormPop .chgpwd').click(function () {
        if ($('.pwd_tr').is(':visible')) {
            $('.pwd_tr').hide();
            $("#operatorFormPop input[name='password']").val('');
            $("#operatorFormPop input[name='password']").removeClass('required');
            $('.chgpwd').text('Change Password');
        } else {
            $('.chgpwd').text('Cancel');
            $("#operatorFormPop input[name='password']").addClass('required');
            $('.pwd_tr').show();
        }
    });
    $('.nameCap').keyup(function (evt) {
        $str = $(this).val().capitalize();
        $(this).val($str);
    });
    String.prototype.capitalize = function () {
        return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
            return p1 + p2.toUpperCase();
        });
    };


});