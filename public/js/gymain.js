  $(document).ready(function(){	
    
    //$('body').layout({ applyDefaultStyles: true });
	
    $('.msgClose').click(function(){
        $(this).parents('.mainMsgDiv').hide();
    });
    $("button, input:submit, .jqButton").button();
    $('.pageLoading').remove();	
    $('#flat').menu({ 
        content: $('#flat').next().html(), // grab content from this page
        showSpeed: 400 
    });
    jQuery.fn.dataTableExt.oSort['us_date-asc'] = function (a, b) {
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
    jQuery.fn.dataTableExt.oSort['currency-asc'] = function(a,b) {
        /* Remove any formatting */
        var x = a == "-" ? 0 : a.replace( /[^\d\-\.]/g, "" );
        var y = b == "-" ? 0 : b.replace( /[^\d\-\.]/g, "" );

        /* Parse and return */
        x = parseFloat( x );
        y = parseFloat( y );
        return x - y;
    };

    jQuery.fn.dataTableExt.oSort['currency-desc'] = function(a,b) {
        var x = a == "-" ? 0 : a.replace( /[^\d\-\.]/g, "" );
        var y = b == "-" ? 0 : b.replace( /[^\d\-\.]/g, "" );

        x = parseFloat( x );
        y = parseFloat( y );
        return y - x;
    };
    jQuery.fn.dataTableExt.afnSortData['dom-checkbox'] = function (oSettings, iColumn) {
        var aData = [];
        $( 'td:eq('+iColumn+') input', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
            aData.push( this.checked==true ? "1" : "0" );
        } );
        return aData;
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
});

var isInt = function(n){
    var reInt = new RegExp(/^-?\d+$/);
    if (!reInt.test(n)) {
        return false;
    }
    return true;
}
function showmsg(msg,flag,fade){
    if(!fade){
        fade = true;
    }else{
        fade = false;
    }
    var zIx	=	parseInt($('.ui-widget-overlay').css('z-index'));
    zIx	+=	4;
    $('.mainMsgDiv').css({
        'z-index':zIx
    });
    $('.mainMsgInnerDiv').removeClass('greenMsgBG redMsgBG');
    if(flag == 't'){
        $('.mainMsgInnerDiv').addClass('greenMsgBG');
    }else if(flag == 'f'){
        $('.mainMsgInnerDiv').addClass('redMsgBG');
    }
    $(".mainMsgDiv #mainMsg").text(msg);
    $(".mainMsgDiv").fadeIn('slow');
    if(fade){
        setTimeout('hidemsg()',3000);
    }
}
function hidemsg(){
    $(".mainMsgDiv").fadeOut('slow');
}
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
function searchItemArr(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
}

function clearForm(form) {
    $(':input', form).not('.omitClearForm').each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden')
            this.value = "";
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = 0;
    });
};
Number.prototype.formatMoney = function(c, d, t){
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
function amountFormat(amount){
    return parseFloat(amount) ? '$ '+(parseFloat(amount)).formatMoney(2, '.', ',') : amount;	
/*
	 * ex : amount =	1234444.00 or 123334445 or 12331212
	 * returns as $ 1,234,444.00 or $ 123,334,445.00 $ 12,331,212.00
	 */
}
function amountFormatW(amount){
    return parseFloat(amount)?(parseFloat(amount)).formatMoney(0, '.', ','):amount;	
/*
	 * ex : amount =	1234444.00 or 123334445 or 12331212
	 * returns as	    1,234,444 or 123,334,445 or 12,331,212
	 */
}
function amountFormatR(amount) {
    var amountType = typeof amount;
    if(amountType == 'number'){
        return amount.toFixed(2);
    }
    if(amount != '' && amount){
        amount = parseFloat(amount.replace(/\$|\,|\s/gi,""));
        return amount;
    }else{
        return 0;
    }
/*
	 * ex : amount =	$ 1,234,444.00 or "123334445" or 12331,212
	 * returns as 1234444.00
	 */
}
