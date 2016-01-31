var chart;
$(document).ready(function() {
    var icons = {
      header: "ui-accordion-icon",
      activeHeader: "ui-accordion-icon-active"
    };
    $(".accordion").not('#monitor').accordion({
        icons: icons,
        collapsible: true,
        autoHeight: true,
        active:false,
        heightStyle:'fill'
    });
    //$('.accordion_open').accordion('option','active',0); //open the monitor by default 
    
    if(_isAdmin) {
        var footer = new Array();
        var cTable;
        var AmountByPrevMonths = eval(OperationsAmountByPrevMonths);
        var months = new Array();
        var monthData ;
        cave = new Array();
        var solo = new Array();
        for(var x in AmountByPrevMonths){
            months.unshift(x);
            monthData = AmountByPrevMonths[x];
            cave.unshift(monthData.cave);
            solo.unshift(monthData.solo);
        }

        tableData =	[{
            name: 'A medias',
            data: cave
        }, {
            name: 'Solos',
            data: solo
        } ];

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'opGraphBox',
                defaultSeriesType: 'column',
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Monto de Operaciones Mes a Mes'
            },
            xAxis: {
                categories: months
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Montos ($AR)',
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    },
                    formatter: function() {
                        return amountFormat(this.total);
                    },
                }
            },
            legend: {
                align: 'right',
                x: -10,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                    this.series.name +': '+ amountFormat(this.y)+'<br/>'+
                    'Total: '+ amountFormat(this.point.stackTotal);
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function() {
                            return amountFormatW(this.y);
                        },
                        lineWidth: 50
                    },
                },
            },
            series: tableData,
        });

        /*chart 2*/
        chequeArr = eval(chequeArr);
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chequesGraphBox',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Cheques en Cartera'
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout:'horizontal',
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: chequeArr
            }]
        });
        ChequeAmountByPrevMonths = eval(ChequeAmountByPrevMonths);
        var aMonths	= new Array();
        var aMonthsAmt = new Array();
        if(ChequeAmountByPrevMonths){
            for(var x in ChequeAmountByPrevMonths){
                aMonths.unshift(x);
                aMonthsAmt.unshift(ChequeAmountByPrevMonths[x]);
            }
        }

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'acGraphBox',
                defaultSeriesType: 'column',
                backgroundColor: 'transparent',
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: aMonths
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Montos ($AR)'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    },
                    formatter: function() {
                        return amountFormat(this.total);
                    },
                }
            },
            legend: {
                enabled:false,
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                shadow: true
            },
            tooltip: {
                formatter: function() {
                    return ''+
                    this.x +': '+ amountFormat(this.y);
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function() {
                            return '';
                        },

                        lineWidth: 50
                    },


                },
            },
            series: [{
                name: 'Acreditaciones',
                data: aMonthsAmt

            }
            ]
        });

        var pre_pas	=	psdoPrec;
        var pre_gy	=	100 - parseFloat(psdoPrec);
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'pasadosGraphBox1',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: 'transparent',
            },
            title: {
                text: ''
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: false
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                ['GY'		,   pre_gy],
                ['Pasados'	,       pre_pas],
                ]
            }]
        });

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'pasadosGraphBox2',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Porcentajes pasados'
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            legend: {
                align:'right',
                verticalAlign:'middle',
                layout:'vertical'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: eval(provsData) //global var created in dashboard.phtml
                /*data: [
                    ['BA Investment', pre_new_1],
                    ['Megamarte', pre_new_2],
                    ['Financiera Op', pre_new_3],
                ]*/
            }]
        });

        eval(amountsPassedByDates);

        passedtableData = [{
            name: '90+',
            data: amountsPassedByDates.amounts1
        }, {
            name: '60 a 90 dias',
            data: amountsPassedByDates.amounts2
        }, {
            name: '60 a 90 dias',
            data: amountsPassedByDates.amounts3
        }, {
            name: '0 a 30 dias',
            data: amountsPassedByDates.amounts4
        }];
        var provNames = amountsPassedByDates.names; 
        /*
        passedtableData =	[{
            name: '90+',
            data: eval(AmounByPayedChequesAfter90DaysByCaves)
        }, {
            name: '60 a 90 dias',
            data: eval(AmounByPayedCheques60To90DaysByCaves)
        }, {
            name: '60 a 90 dias',
            data: eval(AmounByPayedCheques30To60DaysByCaves)
        }, {
            name: '0 a 30 dias',
            data: eval(AmounByPayedCheques0To30DaysByCaves)
        }];
    */
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'pasadosGraphBox3',
                defaultSeriesType: 'column',
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Montos Pasados al Día'
            },
            xAxis: {
                categories: provNames,//['Financiera Op','Megamarte','BA Investment'],
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Montos ($AR)',
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    },
                    formatter: function() {
                        return amountFormat(this.total);
                    },
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
                layout: 'vertical'
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                    this.series.name +': '+ amountFormat(this.y)+'<br/>'+
                    'Total: '+ amountFormat(this.point.stackTotal);
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function() {
                            return amountFormatW(this.y);
                        },
                        lineWidth: 50
                    },
                },
            },
            series: passedtableData,
        });

        var preCaveRej = eval(RejectedChequesBalanceByCaves);
        var divId, rejPercentage, rejRemainder;
        for (var i=0; i < preCaveRej.length; i++) {
            divId = 'container'+i;
            $('#rechazados-box').append('<div id="'+divId+'" class="rechazado-pie"></div>');
            rejPercentage = preCaveRej[i].rej_percentage;
            rejRemainder = 100 - rejPercentage;
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: divId,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    backgroundColor: 'transparent',
                },
                title: {
                    text: preCaveRej[i].name,
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            distance: -30,
                            color: 'white',
                            formatter: function() {
                                return this.percentage.toFixed(2) +' %';
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        ['Acreditado', rejRemainder],
                        ['Rechazado', rejPercentage],
                    ]
                }]
            });
        }
        /*
        var prec_rej = parseFloat(preCaveRejArr[1]);
        var prec_acrd = 100 - prec_rej;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container7',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Financiera Op',
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                ['Acreditado', prec_acrd],
                ['Rechazado', prec_rej],

                ]
            }]
        });

        var prec_rej	=	parseFloat(preCaveRejArr[2]);
        var prec_acrd	=	100 - prec_rej;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container8',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Megamarte',
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                ['Acreditado'	,       prec_acrd],
                ['Rechazado'		,   prec_rej],
                ]
            }]
        });

        var prec_rej	=	parseFloat(preCaveRejArr[3]);
        var prec_acrd	=	100 - prec_rej;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container9',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'BA Investment',
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: -30,
                        color: 'white',
                        formatter: function() {
                            return this.percentage.toFixed(2) +' %';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                ['Acreditado'	,       prec_acrd],
                ['Rechazado'		,   prec_rej],
                ]
            }]
        });
    */
        RejectedChequesBalanceByCavesAndMonths = eval(RejectedChequesBalanceByCavesAndMonths);
        var monthsAtt = RejectedChequesBalanceByCavesAndMonths['months'];
        var providers = RejectedChequesBalanceByCavesAndMonths['provs'];

        /*
        var amounts = new Array();
        var provs = new Array();
        for(var prov in RejectedChequesBalanceByCavesAndMonths) {
            for(var x in prov){
                amounts.unshift(x);
            }
            provs.unshift(amounts);
        }

        var cave_2 = new Array();
        for(var x in RejectedChequesBalanceByCavesAndMonths[2]){
            cave_2.unshift(RejectedChequesBalanceByCavesAndMonths[2][x]);
        }
        var cave_3 = new Array();
        for(var x in RejectedChequesBalanceByCavesAndMonths[3]){
            cave_3.unshift(parseInt(RejectedChequesBalanceByCavesAndMonths[3][x]));
        }
        rejTableData =	[{
            name: 'Financiera Op',
            data: cave_1
        }, {
            name: 'Megamarte',
            data: cave_2
        },{
            name: 'BA Investment',
            data: cave_3
        }];
    */
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container10',
                defaultSeriesType: 'column',
                backgroundColor: 'transparent',
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: monthsAtt
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Montos ($ARG)',
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    },
                    formatter: function() {
                        return amountFormat(this.total);
                    },
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false,
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                    this.series.name +': '+ amountFormat(this.y)+'<br/>'+
                    'Total: '+ amountFormat(this.point.stackTotal);
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function() {
                            return amountFormatW(this.y);
                        },

                        lineWidth: 50
                    },
                },
            },
            series: providers,
        });

    }
});
