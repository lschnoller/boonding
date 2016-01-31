var _holidays_arr; //global array for holidays
$(function() {
    getholidays(); //fills global array with holidays 
});

/*
 * La formula para calcular el valor al dia es la siguiente:
 * valor al dia = importe - impuesto_al_cheque (% de importe) - descuento (importe * tasa anual/360 (0.17%) * cantidad de dias) - gastos - cheque menor a
 * 
 * PRE: cheque amt, chequeDate, chequeLocation and provData with the providers costs, etc.
 */
function getCheckValue(chequeAmt, chequeDate, chequeLocation, provData)
{
    var calcDate, dateAccredited, accHrs, gastos, gastosOtros, gralDiscounts, descuento, todayValue, gastosFee, impuestoAlCheque, tasaDiaria, dateDiff, impAlCheque, temp1, temp2;
    tasaDiaria = gastosOtros = 0;
    dateDiff = '';

    if (chequeLocation == 1) { //cheque is from capital
        accHrs = provData.acCapital;
        gastosFee = provData.gastosGeneral;
    }
    else if (chequeLocation == 2) { //cheque is from interior
        accHrs = provData.acInterior;
        if (provData.gastosInterior)
            gastosFee = provData.gastosInterior;
        else
            gastosFee = provData.gastosGeneral;
    }

    //theres's a fee for small cheques
    if (provData.gastosChequeMenorA1)
    {
        //make sure cheque menor a 1 is smaller than 2
        if (provData.gastosChequeMenorA1 > provData.gastosChequeMenorA2) {
            temp1 = provData.gastosChequeMenorA1;
            temp2 = provData.gastosFeeChequeMenorA1;
            provData.gastosChequeMenorA1 = provData.gastosChequeMenorA2;
            provData.gastosFeeChequeMenorA1 = provData.gastosFeeChequeMenorA2;
            provData.gastosChequeMenorA2 = temp1;
            provData.gastosFeeChequeMenorA2 = temp2;
        }

        if (chequeAmt < provData.gastosChequeMenorA1)
            gastosOtros = provData.gastosFeeChequeMenorA1;
        else if (chequeAmt < provData.gastosChequeMenorA2)
            gastosOtros = provData.gastosFeeChequeMenorA2;
    }

    dateAccredited = addDaysByHr(chequeDate, accHrs);
    tasaDiaria = provData.tasaAnual / 360;

    dateDiff = daysBetween(dateAccredited, provData.liqDate);
    impuestoAlCheque = chequeAmt * provData.impuestoAlCheque / 100;
    gastos = chequeAmt * gastosFee / 100;
    //gralDiscounts = (chequeAmt * (impAlCheque + gastos)) / 100; //impuesto al cheuqe and gastos are percentages.
    descuento = (chequeAmt * tasaDiaria / 100) * parseInt(dateDiff);
    todayValue = chequeAmt - impuestoAlCheque - descuento - gastos - gastosOtros;

    var chequeDetails = {
        days: dateDiff,
        todayValue: todayValue,
        impuestoAlCheque: impuestoAlCheque,
        gastos: gastos,
        gastosOtros: gastosOtros,
        daysDiscountFee: descuento,
        acreditationHrs: accHrs,
        acreditationDate: dateAccredited
    };
    return chequeDetails;
}

//PRE:  1. the later date dd/mm/yyyy format
//      2. (optional) the earlier date in dd/mm/yyyy format. If missing, it is replaced for current date. 
//POST: tells how many days are there between the two dates.
function daysBetween(dateTwo, dateOne) {
    var today, dd, mm, yyyy, dateOneArr, dateTwoArr;

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    if (dateOne === undefined) {
        dateOne = new Date();
    }
    else {
        dateOneArr = dateOne.split('/');
        dateOneArr[1] = dateOneArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
        dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    }

    dateTwoArr = dateTwo.split('/');
    dateTwoArr[1] = dateTwoArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
    dateTwo = new Date(dateTwoArr[2], dateTwoArr[1], dateTwoArr[0]);

    // Convert both dates to milliseconds
    var date1_ms = dateOne.getTime();
    var date2_ms = dateTwo.getTime();
    var i;
    // Calculate the difference in milliseconds
    if (date1_ms > date2_ms) {
        i = -1;
    } else {
        i = 1;
    }
    var difference_ms = Math.abs(date1_ms - date2_ms);
    // Convert back to days and return
    return Math.floor(difference_ms / ONE_DAY) * i;
}

function addDays(dateOne, days) {
    // The number of milliseconds in one day
    var dateOneArr = dateOne.split('/');
    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateOne.setDate(dateOne.getDate() + days);
    var month = parseInt(dateOne.getMonth()) + 1;
    return dateOne.getDate() + '/' + month + '/' + dateOne.getFullYear();
}

function getholidays() {
    var url = '/index/getholidays';
    _holidays_arr = new Array();
    $.post(url,
            function(data) {
                holidays = data;
                for (var x in holidays) {
                    holiday = holidays[x];
                    _holidays_arr.push(holiday.holiday_date);
                }
            }, 'json');
}

//PRE: requires a global var array "_holidays_arr" with all the holidays.
function isHoliday(dateTemp)
{
    var day, cYear, cMonth, cDate, cFullDate;
    var isHoliday = false;

    day = dateTemp.getDay();
    cYear = dateTemp.getFullYear();
    cMonth = dateTemp.getMonth() + 1; //month is 0 based
    cMonth = cMonth > 9 ? cMonth : '0' + cMonth;
    cDate = dateTemp.getDate() > 9 ? dateTemp.getDate() : '0' + dateTemp.getDate();
    cFullDate = cDate + '/' + cMonth + '/' + cYear;

    if (($.inArray(cFullDate, _holidays_arr) > -1) || day == 6 || day == 0) //the date is a holiday or saturday or sunday	
        isHoliday = true;

    return isHoliday;
}

function addDaysByHr(checkDate, acHours) {
    var acDays, dateTemp, dateTempArr, day, cYear, cMonth, cDate, cFullDate, acreditationDate;

    acDays = Math.round(acHours / 24);
    dateTempArr = checkDate.split('/');
    dateTempArr[1] = dateTempArr[1] - 1; //months are 0 based in js Date objects (jan = 0) 
    dateTemp = new Date(dateTempArr[2], dateTempArr[1], dateTempArr[0]);

    //if check date falls in a holiday or saturday or sunday add an extra acreditation day for next available day 
    if (isHoliday(dateTemp))
        acDays++;

    for (var i = 0; i < acDays; i++) {
        //get next date
        dateTemp = new Date(dateTemp.getFullYear(), dateTemp.getMonth(), dateTemp.getDate() + 1);
        if (isHoliday(dateTemp)) //the date is a holiday or saturday or sunday	
            acDays++;
    }
    cMonth = dateTemp.getMonth() + 1; //month is 0 based
    cMonth = cMonth > 9 ? cMonth : '0' + cMonth;
    cDate = dateTemp.getDate() > 9 ? dateTemp.getDate() : '0' + dateTemp.getDate();

    acreditationDate = cDate + '/' + cMonth + '/' + dateTemp.getFullYear();
    return acreditationDate;
}

function hrsBetween(dateOne, dateTwo)
{
    var weekendDays = parseInt(daysBetween(dateTwo, dateOne));
    // The number of milliseconds in one day
    //var ONE_DAY = 1000 * 60 * 60 ;
    var dateOneArr = dateOne.split('/');
    var dateTwoArr = dateTwo.split('/');

    dateOne = new Date(dateOneArr[2], dateOneArr[1], dateOneArr[0]);
    dateTwo = new Date(dateTwoArr[2], dateTwoArr[1], dateTwoArr[0]);

    var start = dateOne,
            finish = dateTwo,
            dayMilliseconds = 1000 * 60 * 60 * 24;

    while (start <= finish) {
        var day = start.getDay();
        if (day == 0 || day == 6) {
            weekendDays--;
        }
        start = new Date(+start + dayMilliseconds);
    }
    if (weekendDays) {
        weekendDays += 1;
        weekendDays = weekendDays * 24;
    } else {

    }
    return weekendDays;
}

//PRE: json object with checks values
//POST: json object with checks total values
function calculateChecksTotals(checksArr)
{
    var dayAvg,chequeChkCount,bruto,totalDays,payingAmount,
        impuestoAlCheque,intereses,gastosGeneral,plazo,zip,gastosInterior,gastosOtros;
    chequeChkCount=bruto=totalDays=payingAmount=impuestoAlCheque=intereses=gastosGeneral=gastosInterior=gastosOtros = 0;
    
    //var acreditacionCapital = parseInt($('.acreditacion_capital').val());
    //var acreditacionInterior = parseInt($('.acreditacion_interior').val());

    for(var i=0; i < checksArr.length; i++) {
        //calculate totals
        chequeChkCount++;
        bruto += checksArr[i].importe;
        totalDays += checksArr[i].days;
        payingAmount += checksArr[i].todayValue;  
        impuestoAlCheque += checksArr[i].impuestoAlCheque;
        intereses += checksArr[i].intereses;

        if (checksArr[i].location) {
            gastosGeneral += checksArr[i].gastos;
            //plazo = acreditacionCapital;
            //zip = 'Capital'
        }
        else {
            gastosInterior += checksArr[i].gastos;
            //plazo = acreditacionInterior;
            //zip = 'Interior';
        }
        gastosOtros += checksArr[i].gastosOtros;
    }
    dayAvg = totalDays/chequeChkCount;
    
    var checksTotals = {
        'chequeChkCount': chequeChkCount,
        'dayAvg': dayAvg,
        'bruto': bruto,
        'totalDays': totalDays,
        'payingAmount': payingAmount,
        'impuestoAlCheque': impuestoAlCheque,
        'intereses': intereses,
        'gastosGeneral': gastosGeneral,
        'gastosInterior': gastosInterior,
        'gastosOtros': gastosOtros
    };
    return checksTotals;
}