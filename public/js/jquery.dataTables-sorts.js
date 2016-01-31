/*
 * ADD-ONS for several sorts.
 */

$(function() {
//2nd declaration to be able to sort columns dinamically (AJAX) 1st dec in gymain.js
    jQuery.fn.dataTableExt.oSort['us_date-asc'] = function (a, b) {
        a = $('<span></span>').append(a).text();
        b = $('<span></span>').append(b).text();
        if ($.trim(a) != '') {
            var frDatea2 = $.trim(a).split('/');
            var x = (frDatea2[2] + frDatea2[1] + frDatea2[0]) * 1;
        } else {
            var x = 10000000000000; // = l'an 1000 ...
        }
        if ($.trim(b) != '') {
            frDateb = $.trim(b).split('/');
            var y = (frDateb[2] + frDateb[1] + frDateb[0]) * 1;
        } else {
            var y = 10000000000000;
        }
        var z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return z;
    };
    jQuery.fn.dataTableExt.oSort['us_date-desc'] = function (a, b) {
        a = $('<span></span>').append(a).text();
        b = $('<span></span>').append(b).text();
        if ($.trim(a) != '') {
            var frDatea2 = $.trim(a).split('/');
            var x = (frDatea2[2] + frDatea2[1] + frDatea2[0]) * 1;
        } else {
            var x = 10000000000000; // = l'an 1000 ...
        }
        if ($.trim(b) != '') {
            frDateb = $.trim(b).split('/');
            var y = (frDateb[2] + frDateb[1] + frDateb[0]) * 1;
        } else {
            var y = 10000000000000;
        }
        var z = ((x < y) ? 1 : ((x > y) ? -1 : 0));
        return z;
    };
    jQuery.fn.dataTableExt.oSort['num-html-asc']  = function(a,b) {
        var x = a.replace( /<.*?>/g, "" );
        var y = b.replace( /<.*?>/g, "" );
        x = parseFloat( x );
        y = parseFloat( y );
        return ((x < y) ? -1 : ((x > y) ?  1 : 0));
    };

    jQuery.fn.dataTableExt.oSort['num-html-desc'] = function(a,b) {
        var x = a.replace( /<.*?>/g, "" );
        var y = b.replace( /<.*?>/g, "" );
        x = parseFloat( x );
        y = parseFloat( y );
        return ((x < y) ?  1 : ((x > y) ? -1 : 0));
    };

    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, iColumn )
    {
        var aData = [];
        $( 'td:eq('+iColumn+') input', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
            aData.push( this.checked==true ? "1" : "0" );
        } );
        return aData;
    }
});