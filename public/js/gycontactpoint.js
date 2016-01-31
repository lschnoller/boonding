$(document).ready(function () {
    $("#tabs").tabs({selected: 0});
    //$('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    $("#operatorForm").validate({
        submitHandler: function (form) {
            var tForm = $("#operatorForm");
            var url = tForm.attr('action');
            $.post(url, {
                "title": $(' [name="title"]', tForm).val(),
                "description": $(' [name="description"]', tForm).val()
            },
            function (data) {
                if (isInt(data)) {
                    var trmade = $('#grid').dataTable().fnAddData([
                        data,
                        $('[name="title"]', tForm).val(),
                        $('[name="description"]', tForm).val(),
                    ]);
                    var oSettings = oTable.fnSettings();
                    var nTr = oSettings.aoData[ trmade[0] ].nTr;
                    nTr.id = 'userid_' + data;
                    $("td:eq(1)", nTr).addClass('user_Title');
                    $("td:eq(2)", nTr).addClass('user_Description');
                    showmsg("El registro fue agregado.", 't');
                    clearForm(tForm);

                } else {
                    showmsg("Hubo un error al agregar el registro.", 'f');
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
        "aoColumns": [{"bVisible":false}, null,null],
        "aaSorting": [[1, "asc"]],
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
        var result = confirm('Seguro desea eliminar?');

        if (result) {
            var anSelected = fnGetSelected(oTable);
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/deletecontactpointajax";
            $.post(url, {
                "id": selIdArr[1]
            },
            function (data) {
                if (isInt(data) && data) {
                    showmsg("El registro a sido eliminado.", 't');
                    oTable.fnDeleteRow(anSelected[0]);
                } else {
                    showmsg("Hubo un error al eliminar el registro.", 'f');
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
        height: 250,
        width: 350,
        buttons: {
            "Guardar": function () {
                $("#operatorFormPop").submit();


            },
            "Cancelar": function () {
                $(this).dialog("close");
                clearForm($("#operatorFormPop"));

            }
        },
        close: function () {
            clearForm($("#operatorFormPop"));

        }
    });
    $(".editBtn")
            .click(function () {
                var selRow = $(".gridtbody .row_selected");

                if (selRow.size()) {
                    var idArr = selRow.attr('id').split("_");
                    var popEditForm = $("#operatorFormPop");
                    $('input[name="id"]', popEditForm).val(idArr[1]);
                    $('input[name="title"]', popEditForm).val($(".user_Title", selRow).text());
                    $('input[name="description"]', popEditForm).text($(".user_Description", selRow).text());
                    $("#editPopUP").dialog("open");
                } else {
                    alert("Por favor seleccione la fila que desea editar.");
                }

                //trSelected
            });
    $("#operatorFormPop").validate({
        submitHandler: function (form) {
            userFormPop = $("#operatorFormPop");
            var url = userFormPop.attr('action');
            $.post(url, {
                "id": $(' input[name="id"]', userFormPop).val(),
                "title": $(' input[name="title"]', userFormPop).val(),
                "description": $(' input[name="description"]', userFormPop).val(),
            },
                    function (data) {
                        if (data) {

                            var selRow = $("#grid .row_selected");

                            $(".user_Title", selRow).text($('[name="title"]', userFormPop).val());
                            $(".user_Description", selRow).text($(' [name="description"]', userFormPop).val());

                            showmsg("Actualización exitosa.", 't');
                            $("#editPopUP").dialog('close');
                            clearForm(userFormPop);
                        } else {
                            showmsg("Error: no se pudo eliminar el registro.", 'f');
                            $("#editPopUP").dialog('close');
                        }
                        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
                    });
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