$(document).ready(function() {
    $("#tabs").tabs({selected: 0});
    $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    $("#operatorForm").validate({
        submitHandler: function(form) {
            var tForm = $("#operatorForm");
            var url = tForm.attr('action');
            $.post(url, {
                "rate": $(' [name="rate"]', tForm).val(),
            },
                    function(data) {
                        if (isInt(data)) {
                            var trmade = $('#grid').dataTable().fnAddData([
                                data,
                                $('[name="rate"]', tForm).val(),
                            ]);
                            var oSettings = oTable.fnSettings();
                            var nTr = oSettings.aoData[ trmade[0] ].nTr;
                            nTr.id = 'userid_' + data;
                            $("td:eq(1)", nTr).addClass('user_Rate');
                            showmsg("Agregado.", 't');
                            clearForm(tForm);

                        } else {
                            showmsg("Oops!", 'f');
                        }
                    });
        }
    });
    oTable = $('#grid').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "sScrollX": "100%",
        "bScrollCollapse": true,
        "bStateSave": true, 
        "iDisplayLength": 50,
        "bFilter":false,
        "bInfo":false
    });
    var edBtn = "<span class='editBtn gridBtn'>Editar</span>";
    //edBtn += "<span class='deleteBtn gridBtn'>Borrar</span>";
    $("#grid_length").append(edBtn);
    $("#grid tbody").click(function(event) {
        $(oTable.fnSettings().aoData).each(function() {
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });
    $('.deleteBtn').click(function() {

        deleteFun(oTable);
    });



    function deleteFun(oTable) {
        var result = confirm('Esta seguro que desea eliminar la tasa?');
        if (result) {
            var anSelected = fnGetSelected(oTable);
            var selIdArr = anSelected[0].id.split("_");
            var url = "/gyuser/Index/tasasdeleteajax";
            $.post(url, {
                "id": selIdArr[1]
            },
            function(data) {
                if (isInt(data) && data) {
                    showmsg("La tasa ha sido borrada exitosamente", 't');
                    oTable.fnDeleteRow(anSelected[0]);
                } else {
                    showmsg("Hubo un error al eliminar la tasa.", 'f');
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
    
    $('.edTabBtn').click(function() {
        //$('.ui-icon-triangle-1-n').parent('th').trigger('click');
        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    });
    
    $("#editPopUP").dialog({
        autoOpen: false, modal: true,
        height: 200,
        width: 200,
        buttons: {
            "Guardar": function() {
                $("#operatorFormPop").submit();
            },
            "Cancelar": function() {
                $(this).dialog("close");
                clearForm($("#operatorFormPop"));
            }
        },
        close: function() {
            clearForm($("#operatorFormPop"));

        }
    });
    $(".editBtn")
            .click(function() {
        var selRow = $(".gridtbody .row_selected");

        if (selRow.size()) {
            var idArr = selRow.attr('id').split("_");
            var popEditForm = $("#operatorFormPop");
            $('[name="id"]', popEditForm).val(idArr[1]);
            $('[name="rate"]', popEditForm).val($(".user_Rate", selRow).text());

            $("#editPopUP").dialog("open");
        } else {
            alert("Por favor, seleccione una fila.");
        }

        //trSelected
    });
    $("#operatorFormPop").validate({
        submitHandler: function(form) {
            userFormPop = $("#operatorFormPop");
            var url = userFormPop.attr('action');
            $.post(url, {
                "id": $(' [name="id"]', userFormPop).val(),
                "rate": $(' [name="rate"]', userFormPop).val(),
            },
                    function(data) {
                        if (data) {
                            var selRow = $("#grid .row_selected");
                            $(".user_Rate", selRow).text($('[name="rate"]', userFormPop).val());
                            showmsg("Guardado.", 't');
                            $("#editPopUP").dialog('close');
                            clearForm(userFormPop);
                        } else {
                            showmsg("Hubo un error al editar la tasa.", 'f');
                            $("#editPopUP").dialog('close');
                        }
                        $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
                    });
        }
    });
    $('.nameCap').keyup(function(evt) {
        $str = $(this).val().capitalize();
        $(this).val($str);
    });
    String.prototype.capitalize = function() {
        return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
            return p1 + p2.toUpperCase();
        });
    };


});