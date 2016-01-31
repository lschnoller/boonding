$(document).ready(function() {

    $(".addNewCave").dialog({
        autoOpen: false, modal: true,
        height: window.screen.height - 400,
        width: 400,
        buttons: {
            "Guardar": function() {
                $("#addNewCaveForm").submit();
            },
            "Cerrar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {

        }
    });
    $("#addNewCaveForm").validate({
        submitHandler: function(form) {
            userFormPop = $("#addNewCaveForm");
            var url = userFormPop.attr('action');
            var Caveid = $(' input[name="id"]', userFormPop).val();
            var Cavename = $(' input[name="name"]', userFormPop).val();
            $.post(url, {
                "id": Caveid,
                "name": Cavename,
            },
            function(data) {
                if (isInt(data)) {
                    var submitType = $('.addNewCave .addEditBtn').text();
                    if (submitType == 'Editar') {
                        showmsg("Los cambios fueron guardados...", 't');
                        $('[name="cave_name"] option[value="' + Caveid + '"]').text(Cavename);
                        $('.addNewCave .addEditBtn').text('Agregar');
                        $('[name="name"]', userFormPop).val('');
                        $('[name="id"]', userFormPop).val('');
                        AddCaveTabs.tabs({selected: 0});
                        $('#CaveId_' + Caveid + ' .td_cave').text(Cavename);
                        window.location = window.location.href + '#CaveId_' + Caveid;

                    } else if (submitType == 'Agregar') {
                        showmsg("El registro fue guardado...", 't');
                        var addOption = '<option value="' + data + '">' + $(' input[name="name"]', userFormPop).val() + '</option>';
                        $('[name="cave_name"] .addnew').before(addOption);
                        $('[name="cave_name"] option[value="' + data + '"]').attr({'selected': 'selected'});

                        var trmade = $('#CaveGrid').dataTable().fnAddData([
                            data,
                            Cavename,
                        ]);
                        var oSettings = CaveTable.fnSettings();
                        var nTr = oSettings.aoData[ trmade[0] ].nTr;
                        nTr.id = 'CaveId_' + data;
                        $("td:eq(1)", nTr).addClass('td_cave');
                        $('[name="name"]', userFormPop).val('');
                        $('[name="id"]', userFormPop).val('');
                        AddCaveTabs.tabs({selected: 0});
                        window.location = window.location.href + '#' + nTr.id;

                    }
                } else {
                    showmsg("Hubo un error al guardar, por favor intente nuevamente.", 'f');

                }
                $('#CaveGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
            });
        }
    });
    AddCaveTabs = $("#AddCaveTabs").tabs({selected: 1});

    CaveTable = $('#CaveGrid').dataTable({
        "bJQueryUI": true,
        "bAutoWidth": true,
        "bScrollCollapse": true,
        "bStateSave": true,
        "bPaginate": false,
        "bInfo": false
    }).ready(function() {
        $('#CaveGrid_wrapper .dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
    })
    //$("#CaveGrid_wrapper .fg-toolbar").prepend('<h1>test</h1>');
    var edBtn = "<span class='CaveEditBtn gridBtn'>Editar</span>";
    edBtn += "<span class='CaveDeleteBtn gridBtn'>Borrar</span>";
    $("#CaveGrid_wrapper .fg-toolbar:has('.dataTables_filter')").append(edBtn);

    $("#CaveGrid tbody").click(function(event) {
        $(CaveTable.fnSettings().aoData).each(function() {
            $(this.nTr).removeClass('row_selected');
        });
        $(event.target.parentNode).addClass('row_selected');
    });


    $('.CaveEditBtn').live('click', function() {
        var CaveTr = $(".Cavegridtbody .row_selected");
        var CaveId = CaveTr.attr('id').split('_');
        var CaveName = $('.td_cave', CaveTr).text();
        var tForm = $('#addNewCaveForm');

        $('[name="name"]', tForm).val(CaveName);
        $('[name="id"]', tForm).val(CaveId[1]);

        AddCaveTabs.tabs({selected: 1});

        $('.addNewCave .addEditBtn').text('Editar');
    });
    $('.CaveDeleteBtn').live('click', function() {
        var CaveTr = fnGetSelected(CaveTable);
        var CaveId = CaveTr[0].id.split('_');
        var url = '/index/deletecolegaajax';
        $.post(url, {
            "id": CaveId[1],
        },
        function(data) {
            if (data) {
                showmsg("Borrado exitosamente...", 't');
                CaveTable.fnDeleteRow(CaveTr[0]);
            } else {
                showmsg("Hubo un problema al borrar, por favor intente nuevamente.", 'f');
            }
            $('.dataTables_scrollHeadInner .ui-state-default:eq(0)').trigger('click');
        });

    });
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
});