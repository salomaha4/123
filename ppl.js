<script>
    
let isLoading = true;


function goFullScreen() {
    var elem = document.documentElement; 

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    $('.btn__fullscreen--out').removeClass('d-none');
    $('.btn__fullscreen--in').addClass('d-none');
    $('iframe').addClass('iframe--full');
}

function goOutFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    $('.btn__fullscreen--in').removeClass('d-none');
    $('.btn__fullscreen--out').addClass('d-none');
    $('iframe').removeClass('iframe--full');
}

    const _state={
        idFac:null,
        nameFactory:null,
        id_flag:null,
        teamId:null,
        id_type:null,
        nameTeam:null,
        sDate:null,
        nameCheck:null,
        formTimeout: null,
    }

    var sBu = searchParams('nameBU');
    var idFactory = searchParams('id-bu');  
    
    var dataset = {};
    var count = 1

    var get_session = window.sessionStorage.getItem('dataset');
    if (get_session != undefined) {
        dataset = JSON.parse(get_session);
    }
    if (dataset && dataset.selectedBu && dataset.selectedFactory) {
        sBu = dataset.selectedBu;
        idFactory = dataset.selectedFactory;
    }

    var timeTitle = '';
    var temp_selection;
    var tempFLag = "";
    var idBu = (dataset.idBu != undefined ? dataset.idBu : "");
    // var sbuName = (dataset.sbuName != undefined ? dataset.sbuName : "");
    var status_name = '<spring:message code="needed.check" /> ';
    var status_name_chart = "<spring:message code='needed.check' /> ";
    var flag_id_value = "1";
    _state.id_flag = flag_id_value;

    $("#status_name_un").html(status_name);

    function init() {
        requestGetSbuName();
    }

    function requestGetSbuName() {
        $(".loader").removeClass("d-none");

        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/get_list_bu",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var status = response['status'];
                var data = response['data'];
                var message = response['message'];
                var total = response['total'];
                if (total > 0) {
                    var htmlBu = "";
                    // $('#btnBu').html(htmlBu);
                    for (var i = 0; i < data.length; i++) {
                        htmlBu += '<option value="' + data[i] + '">' + data[i] + '</option>';
                    }
                    // sbuName = (sbuName != '' ? sbuName : data[0]);
                    $('#btnBu').html(htmlBu);
                    // $('#btnBu').val(sbuName);

                    if (sBu != null) {
                        $("#btnBu [value=" + sBu + "]").attr("selected", true);
                        getFactory(sBu);
                    } else {
                        $("#btnBu [value=" + data[0] + "]").attr("selected", true);
                        getFactory(data[0]);
                    }

                } else {
                    console.log("No data factory line.");
                }
            },
            failure: function (error) {
                $(".loader").addClass("d-none");

                console.log(error);
            }
        });
    }


    $("#btnBu").change(function () {
        isLoading = true;
        // sbuName = $("#btnBu").find("option:selected").val();
        // sbuName = $(this).val();
        // dataset.sbuName = $(this).val();
        // idBu = '';
        // var nameFactory = $("#btnBu").val();
        _state.nameFactory = $("#btnBu").val();
            dataset.selectedBu = _state.nameFactory;
    window.sessionStorage.setItem('dataset', JSON.stringify(dataset));
        getFactory(_state.nameFactory); 
    });


    function getFactory(nameFactory) {
        $(".loader").removeClass("d-none");

        // $('#select-factory').html('');
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/get_list_factory_with_group_line",
            data: {
                sbu_name: nameFactory
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var status = response['status'];
                var data = response['data'];
                var message = response['message'];
                var total = response['total'];
                if (total > 0) {
                    var htmlFactory = "";
                    for (var i = 0; i < data.length; i++) {
                        htmlFactory += '<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>';
                    }
                    // idBu = (idBu != '' ? idBu : data[0]['id']);
                    $('#select-factory').html(htmlFactory);
                    // $('#select-factory').val(idBu);
                    
                    if (idFactory != null) {
                        $("#select-factory [value=" + idFactory + "]").attr("selected", true);
                        //  _state.idFac=idFactory
                        // loadItem(idFactory);

                        _state.idFac=idFactory;
                        loadItem(_state.idFac);

                    } else {
                        $("#select-factory [value=" + data[0]['id'] + "]").attr("selected", true);
                        _state.idFac = data[0]['id']
                        loadItem(_state.idFac)
                        // loadItem(data[0]['id']);
                    }

                    // if (idBu != null && idBu != '') {
                    // }
                } else {
                    alert("No data factory line!");
                }
                window.sessionStorage.setItem('dataset', JSON.stringify(dataset));
            },
            error: function (e) {
                $(".loader").addClass("d-none");
                var res = JSON.parse(e.responseText);
                alert(res.message);

            }
        });
    }


    $("#select-factory").change(function () {
        isLoading = true;
        // idBu = $("#select-factory").find("option:selected").val();
        // idBu = $(this).val();
        // dataset.idBu = $(this).val();
        var idFac = $("#select-factory").val();
        _state.idFac=idFac;
        dataset.selectedFactory = idFac;
        window.sessionStorage.setItem('dataset', JSON.stringify(dataset));
        loadItem(idFac);
    });


    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    Date.prototype.toString = function () {
        var date = new Date(this.valueOf());
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;
        var a = year + "-" + month + "-" + day;
        return a;
    }

    Date.prototype.toString2 = function () {
        var date = new Date(this.valueOf());
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;
        var a = day + "." + month;
        return a;
    }

    Date.prototype.calDayFromDateToDate = function (date) {
        const oneDay = 24 * 60 * 60 * 1000;
        var start = new Date(this.valueOf());
        var diffDay = Math.round(Math.abs((start - date) / oneDay));
        return diffDay;
    }

    function getTotalDayInMonth(timeSpan) {
        var startDate = timeSpan;
        var dateCheck = new Date(startDate);
        var feb = 28;
        if (dateCheck.getFullYear() * 1 % 4 == 0) {
            feb = 29;
        }
        var month = dateCheck.getMonth();
        var day = 30;
        switch (month) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                day = 31;
                break;
            case 1:
                day = feb;
                break;
            default:
                day = 30;
                break;
        }
        return day;
    }

    function defaultItemTime(idStep, frmFlag, timeSpan) {
        var html = "";
        if (frmFlag == 1) {
            //DAY
            var totalDay = getTotalDayInMonth(timeSpan);
            for (var j = 1; j <= totalDay; j++) {
                var tmp = '';
                if (j < 10) {
                    tmp = '0' + j;
                } else tmp = j;
                html += '<td class="step' + idStep + '_' + tmp + '"></td>';
            }
        } else if (frmFlag == 2) {
            //week
            for (var j = 1; j <= 53; j++) {

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 3) {
            //month
            for (var j = 1; j <= 12; j++) {
                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 4) {
            //quarter
            for (var j = 1; j <= 4; j++) {

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 5) {
            //year
            var mDate = new Date();
            var yearStart = 2019;
            var yearEnd = mDate.getFullYear();
            for (var j = yearStart; j <= yearEnd; j++) {
                var tmp = '';

                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        } else if (frmFlag == 7) {
            //shift

            var totalDay = getTotalDayInMonth(timeSpan);
            for (var j = 1; j <= totalDay; j++) {
                var tmp = '';
                if (j < 10) {
                    tmp = '0' + j;
                } else tmp = j;

                html += '<td class="step' + idStep + '_' + tmp + '_DAY"></td>'
                    + '<td class="step' + idStep + '_' + tmp + '_NIGHT"></td>';
            }
        } else if (frmFlag == 8) {
            //lession 4
            for (var j = 1; j <= 4; j++) {
                html += '<td class="step' + idStep + '_' + j + '"></td>';
            }
        }
        return html;
    }

    function getFormatDate(strDate) {
        var date = new Date(strDate);
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var hour = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;
        var minute = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;
        var second = date.getSeconds().toString();
        second = second.length > 1 ? second : '0' + second;

        var a = year + "/" + month + "/" + day + " 08:30:00";

        timeM = a;
        return a;
        // return time;
    }

    $('#reservation').daterangepicker({
        timePicker: true,
        timePickerIncrement: 7,
        singleDatePicker: true,
        locale: {
            format: 'YYYY/MM/DD HH:mm'
        }
    });

    var start = moment().format("YYYY/MM/DD HH:mm");
    $('#reservation').data('daterangepicker').setStartDate(start);

    var timeSpan = $('#reservation').val();

    $('#reservation').on('change', function () {
        timeSpan = this.value;
        init()
    });

    Date.prototype.getWeekNumber = function () {

        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    };
    $("#reservation").change(function () {
        if (moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm") < moment(new Date()).format("YYYY/MM/DD HH:mm")) {
            status_name = "Quantity Unchecked";
            status_name_chart = "Unchecked";
        }
        else {
            var status_name = 'Needed Check ';
            status_name_chart = 'Needed Check';
        }
        $("#status_name_un").html(status_name);
        loadDateDf();
        // loadItem();
    });

    function getQuarter(d) {
        var m = Math.floor(d.getMonth() / 3) + 1;
        return m > 4 ? m - 4 : m;
    }

    function loadDateDf() {
        var sDate = $('#reservation').val();
        var date = new Date(sDate);
        var d = date.toString();
        //  var w = date.getWeekNumber();
        var oneJan = new Date(date.getFullYear(), 0, 1);
        var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        var w = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
        //    console.log("result---", result)
        var m = date.getMonth();
        var y = date.getFullYear();

        // var monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];
        var monthNames = ["1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12"
        ];
        $("#time_1").html(" " + d.slice(8,) + "");
        $("#time_2").html(" " + w + "");
        $("#time_3").html(" " + monthNames[m] + "");
        $("#time_4").html(" " + getQuarter(date) + "");
        $("#time_5").html(" " + y + "");
        $("#time_7").html(" " + "DAY" + "");
    }

    function loadItem(idFac) {
        $(".loader").removeClass("d-none");

        $('#tbl_item>tbody').html('');
        $.ajax({
            type: 'GET',
            url: '/paperless/api/v2/get_flag_by_bu',
            data: {
                idBu: idFac,
            },
            success: function (res) {
                $(".loader").addClass("d-none");

                var data = res['data'];
                var html = '<tr>';

                for (i in data) {
                    html += '<td class="td_item">' +
                        '<div class="bar_charts item_bar" id="flag_' + data[i].id_flag + '">' +
                        '<div class="bar_charts text-center pl-0 w-100">' +
                        '<span class="f"><b>' + data[i].name + '</b> </span>' +
                        '<span class="t" id="time_' + data[i].id_flag + '"></span><br>' +
                        '<span class="t" id="total_' + data[i].id_flag + '"></span>' +
                        '</div>' +
                        '</div></td>';
                }
                html += '</tr>';
                $('#tbl_item>tbody').html(html);
                itemBarClick();
                loadDateDf();

                if (data != null) {
                    if (_state.id_flag) {
                        $("#flag_" + _state.id_flag).addClass('item_bar_active');
                    } else {
                        $("#flag_" + data[0].id_flag).addClass('item_bar_active');
                        
                        _state.id_flag = data[0].id_flag;
                    }
                    // getDataPaperless(data[0].id_flag);
                    // _state.id_flag = data[0].id_flag;
                    // getDataPaperless(data[0].id_flag)
                    getDataPaperless(_state.id_flag)
                }

                $("#factory_name").html($("#select-factory").find("option:selected").html() + ' Statistic');
            }, error(error) {
                $(".loader").addClass("d-none");
                clearInterval(window.autoReloadTimeout)
            }
        });
    }


    // var dataTEST = []
    function getDataPaperless(id_flag) {
        // console.log("id_flag---", id_flag)
        $(".loader").removeClass("d-none");

        if (id_flag == null) {
            var idFlag = 1;
        } else {
            var idFlag = id_flag;
        }
        var sDate = $('#reservation').val();
        var title = ' <spring:message code="department.statistic" /> - ' + sDate + tempFLag;
        $.ajax({
            type: 'GET',
            url: '/paperless/api/v2/statistic/get_data_statistic_bu_team_v2',
            data: {
                id_bu: $("#select-factory").val(),
                id_flag: idFlag,
                time_span: sDate,

            },
            success: function (res) {
                $(".loader").addClass("d-none");

                var data = res['data'];
                // dataTEST = data
                var tmpData = [{
                    name: "Report",
                    data: []
                }];
                if (data == null) {
                    alert("No Data!");
                    $("#n_box-2_1 span").html('<i class="far fa-frown"></i><b> No Data!</b>');
                    $("#chart_detail").addClass("d-none");
                    $("#statistic").addClass("d-none");
                    $("#department").addClass("d-none");
                    $("#chart-by-team").addClass("d-none");
                    $("#tbl>tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                    $("#tbl_title").html('No Data!');
                    $("#n_chart").removeClass('d-none');
                    $("#n_box-2_1").removeClass('d-none');
                    $("#n_box-2").removeClass('d-none');
                } else {

                    $("#chart_detail").removeClass("d-none");
                    $("#statistic").removeClass("d-none");
                    $("#department").removeClass("d-none");
                    $("#chart-by-team").removeClass("d-none");
                    $("#n_chart").addClass('d-none');
                    $("#n_box-2").addClass('d-none');
                    $("#n_box-2_1").addClass('d-none');

                    var sum = data.check + data.un_check;
                    var dataDepartment = data.teams;
                    var objData = {};
                    var team_id = [];

                    var categories = [];
                    var series = [];
                    var d_checked = [];

                    var percent_check = [];
                    var percent_uncheck = [];

                    var d_unchecked = [];
                    // var sl_check =[]
                    // var d_abnormal = [];

                    for (i in dataDepartment) {
                        team_id.push(dataDepartment[i].team_id);
                        categories.push(dataDepartment[i].team_name);
                        d_checked.push(dataDepartment[i].check);
                        d_unchecked.push(dataDepartment[i].un_check);
                        // d_abnormal.push(dataDepartment[i].abnormal);
                        percent_check.push(dataDepartment[i].percent_check);
                        percent_uncheck.push(100 - dataDepartment[i].percent_check)
                         _state.teamId=team_id;
                    }
                    // console.log("percent_check: ", percent_check);
                    // console.log("percent_uncheck: ", percent_uncheck)

                    objData[0] = {
                        "categories": categories,
                        "teamId": team_id
                    };
                   
                    var df1 = 'check';
                    var df2 = objData[0].teamId[0];
                    var df3 = '<spring:message code="me.checked" />';
                    var df4 = objData[0].categories[0];

                    tmpChecked = {
                        name: "<spring:message code='me.checked' />",
                        y: data.check,
                        events: {
                            click: function (event) {
                            }
                        },
                        sl: d_checked,
                        enableMouseTracking: false
                    }

                    tmpUnchecked = {
                        name: status_name_chart,
                        y: data.un_check,
                        events: {
                            click: function (event) {
                            }
                        },
                        sl: d_unchecked,
                        enableMouseTracking: false
                    }

                    $('#number_check').html(data.check);
                    document.getElementById("checked").value = (data.check / sum) * 100;

                    $('#number_uncheck').html(data.un_check);
                    document.getElementById("unchecked").value = (data.un_check / sum) * 100;

                    tmpData[0]['data'].push(tmpChecked);
                    tmpData[0]['data'].push(tmpUnchecked);
                    loadHightchart(tmpData);

                    var dataChecked = {
                        name: "<spring:message code='me.checked' />",
                        data: percent_check,
                        id_data: 'check',
                        sl: d_checked,
                    };
                    var dataUnhecked = {
                        name: status_name_chart,
                        data: percent_uncheck,
                        id_data: 'un_check',
                        sl: d_unchecked,
                    };

                    series.push(dataUnhecked);
                    series.push(dataChecked);
                    // console.log("series: ", series)
                   
                    loadDepartment(objData, series, title, id_flag, sDate);
                    _state.teamId = data["teams"][0].team_id;
                    // _state.id_flag = id_flag;
                    _state.id_type = 1;
                    _state.nameTeam = data["teams"][0].team_name;
                    _state.sDate = sDate;
                    // getMEchecklist(data["teams"][0].team_id, id_flag, 1, data["teams"][0].team_name);
                    getMEchecklist(_state.teamId,_state.id_flag,_state.id_type,_state.nameTeam)
                    count = 1
                    loadDataFormChecked(_state.id_flag,_state.teamId,_state.sDate)
                    // loadDataFormChecked(id_flag, data["teams"][0].team_id, sDate);
                }
            },
            error:function(){
                clearInterval(window.autoReloadTimeout)
            }
        })
    }

    function loadHightchart(tmpData) {
        Highcharts.chart('statistic', {
            colors: ['#3bdbc0', '#f4eb96'],
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: '#fff0',
                borderColor: "#4572A7",
                margin: [0, 0, 0, 0]
            },

            title: {

                text: 'aaaa',
                style: {
                    enabled: false,
                    color: '#daf9f7',
                    fontSize: "0px"
                }
            },
            tooltip: {
                // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                backgroundColor: '#063052db',
                valueSuffix: '',
                style: {
                    color: '#fff',
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'auto',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}<br> {point.percentage:.1f}%',
                        connectorColor: 'silver',
                        distance: "15",
                        color: '#ffff',
                        style: {
                            fontWeight: 'none',
                            textOverflow: 'clip',
                            textOutline: '0',
                        },
                    },
                }
            },
            navigation: {
                buttonOptions: {
                    height: 14,
                    width: 14,
                    symbolSize: 8,
                    symbolX: 7,
                    symbolY: 7,
                    symbolStrokeWidth: 1
                }
            },
            credits: {
                enabled: false
            },
            series: tmpData
        });
    }

    // var obj = []
    function loadDepartment(objData, series, title, id_flag, sDate) {
        // console.log("series-----: ", series)

        // obj = objData
        Highcharts.chart('department', {
            colors: ['#f4eb96', '#3bdbc0'],
            // [0, 1, 2] | 0: abnomal, 1: uncheck, 2: check
            chart: {
                type: 'column',
                backgroundColor: '#fff0',
            },
            title: {
                text: title,
                style: {
                    fontWeight: 'bold',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    color: '#8ce5ff',
                    fontSize: "2.7vh",
                }
            },
            xAxis: {
                categories: objData[0].categories,
                labels: {
                    style: {
                        color: '#FFF',
                        // fontSize: "14px",
                    },

                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                tickWidth: 0,
            },
            yAxis: {
                min: 0,
                gridLineColor: '#023c37b3',
                title: {
                    text: ''
                },

                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                },
                labels: {
                    format: '{value}%',
                    style: {
                        color: '#FFF',
                    },
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderColor: '#78d4e1',
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: null,
                itemStyle: {
                    color: '#ffffff',
                    fontSize: "11px",
                    fontWeight: null
                },
                itemHoverStyle: {
                    color: '#FFF263',
                    fontSize: "11.5px",
                }
            },
            // tooltip: {
            //     headerFormat: '<b style="color: #FFF">{point.x}</b><br/>',
            //     pointFormat: '<span style="color: #FFF">{series.name}: {point.y}% ({series.sl}: {point.y}) </span><br/><span style="color: #FFF">Total: {point.stackTotal}%</span>',
            //     backgroundColor: '#063052db'
            // },

            tooltip: {
                formatter: function () {
                    return '<span>' + this.x + '<br>' + this.series.name + ': ' + this.y + '% (' + series[this.series.name == 'Checked' ? 1 : 0].sl[objData[0].categories.indexOf(this.x)] + ')</span>'
                }

            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: '#023c37b3',
                        },
                    }
                },
                series: {
                    borderColor: null,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                // console.log("test click")
                                //alert('Category: ' + this.category + ', value: ' + this.series.userOptions.id_data);
                                //alert(objData[0].teamId[this.x]);
                                // console.log("series:", this);

                                var id_type = this.colorIndex;
                                // console.log("id_type11111:", id_type);

                                // alert("id_type--------------------:", id_type);
                                temp_selection = '';
                                _state.teamId = objData[0].teamId[this.x];
                                // _state.id_flag =  id_flag;
                                _state.id_type = id_type;
                                _state.nameTeam = this.category;
                                // getMEchecklist(objData[0].teamId[this.x], id_flag, id_type, this.category);
                                getMEchecklist(_state.teamId,id_flag,_state.id_type,_state.nameTeam)
                                // console.log(this.series.userOptions.id_data + " | " + objData[0].teamId[this.x] + " | " + this.series.name + " | " + this.category + " | " + id_flag + " | " + id_type);
                                // console.log("this.category", this.category)
                                // console.log("this.category", this.category)

                                count = 1
                                if (id_type == 1) { //1 : checked
                                    _state.id_flag = id_flag;
                                    _state.teamId = objData[0].teamId[this.x];
                                    _state.sDate = sDate;
                                    _state.nameTeam = this.category;
                                    _state.nameCheck = this.series.name
                                    loadDataFormChecked(id_flag,_state.teamId,_state.sDate,_state.nameTeam,_state.nameCheck)
                                    // loadDataFormChecked(id_flag, objData[0].teamId[this.x], sDate, this.category, this.series.name);
                                } else {            //0: uncheck
                                    loadDataFormUnCheck(id_flag, objData[0].teamId[this.x], sDate, this.category, this.series.name);
                                }
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: series
        });

    }

    function loadInfoQcc(idQcc) {
        $(".loader").removeClass("d-none");

        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_info_qcc_by_id_qcc",
            data: {
                id_qcc: idQcc
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var data = response['data'];
                //console.log(data);
                $("#name_form").html(data[0]['fr_name']);
                $("#detail-form-code").html(data[0]['fr_code']);
                $("#detail-factory").html(data[0]['bu_name']);
                $("#detail-floor").html(data[0]['floor']);
                $("#detail-line").html(data[0]['line_name']);
                $("#detail-qr").html(data[0]['fr_code']);
                $("#detail-cycle").html(data[0]['fl_name']);
            },
            failure: function (errMsg) {
                console.log(errMsg);
                $(".loader").addClass("d-none");

            }
        });
    }

    function loadHeaderTime(frmFlag, timeSpan) {
        var thead = '<tr><th style="min-width: 500px;"><button class="d-none" style="font-size: 15px; border: 0px; background: #fff; padding: 3px 12px;" id="btn-view-chart"> <i class="fas fa-chart-line d-none"></i></button></th>';
        switch (parseInt(frmFlag)) {
            case 2:
                //week
                for (var i = 1; i <= 53; i++) {
                    thead += '<th>WK' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 3:
                //month
                for (var i = 1; i <= 12; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 4:
                //quarter
                for (var i = 1; i <= 4; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 5:
                //year
                var mDate = new Date();
                var yearStart = 2019;
                var yearEnd = mDate.getFullYear();
                for (var i = yearStart; i <= yearEnd; i++) {
                    thead += '<th>' + i + '<br><span style="font-weight: 400;" class="step_create_time_' + i + '"></span></th>';
                }
                break;
            case 6:
                //Lien tuc
                break;
            case 7:
                //Shift
                var totalDay = getTotalDayInMonth(timeSpan);
                var thead = '<tr><th rowspan="2" style="min-width: 500px; width: 500px;"></th>';
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th colspan="2">' + i + '</th>';
                }
                thead += '</tr><tr>';
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th>D</th><th>N</th>';
                }
                thead += '</tr>';
                break;
            case 8:
                //Lession 6h
                // for (var i = 1; i <= 4; i++) {
                //     thead += '<th>' + i + '</th>';
                // }
                thead += '<th>白班/Ca ngày<br>第一節 Tiết 1<br>07:30-13:30</th>' +
                    '<th>白班/Ca ngày<br>第二節 Tiết 2<br>13:30-19:300</th>' +
                    '<th>晚班/Ca Đêm<br>第一節 Tiết 1<br>19:30-01:30</th>' +
                    '<th>晚班/Ca Đêm<br>第二節 Tiết 2<br>01:30-07:30</th>';
                break;
            default:
                //Day
                var totalDay = getTotalDayInMonth(timeSpan);
                for (var i = 1; i <= totalDay; i++) {
                    thead += '<th>' + i + '</th>';
                }
                break;
        }
        thead += '</tr>';
        $("#statistic-data-check-qr thead").html(thead);
    }

    function showDataStatistic(qccId, frmFlag, time) {
        $(".loader").removeClass("d-none");

        $("#detail-time").html(time);
        //$('#icon_loading_detail_qr').css("display", "block");
        $(".dialog-chart-statistic").html("");
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_step_form_report_by_qr_code",
            data: {
                idQrCode: qccId
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var length = response.length;
                if (length > 0) {
                    loadHeaderTime(frmFlag, time);
                    var row = "";
                    for (var i = 0; i < length; i++) {
                        var defValue = defaultItemTime(response[i]['step_id'], frmFlag, time);
                        row += '<tr class="step-' + response[i]['step_id'] + '"><td class="fixed" style="text-align: left;"><span>[' + (i + 1) + '] ' + response[i]['step_name'] + '</span><input type="checkbox" name="cb-show-value" class="cb-show-value d-none" id-step="' + response[i]['step_id'] + '"></td>' + defValue + '</tr>'
                    }
                    var defValue = defaultItemTime("_create_user", frmFlag, time);
                    row += '<tr class="text-center bg-body-blue"><td style="text-align: left;" class="fixed bg-body-blue-first first-col first-col-td"><spring:message code="paperless.checklist.applicant" /></td>' + defValue + '</tr>';
                    var defValue = defaultItemTime("_signer_user", frmFlag, time);
                    row += '<tr class="text-center bg-body-blue"><td style="text-align: left;" class="fixed bg-body-blue-first first-col first-col-td"><spring:message code="signer" /></td>' + defValue + '</tr>';
                    $("#statistic-data-check-qr tbody").html(row);

                    // clickCbShowValue();
                    loadDataCheck(qccId, frmFlag, time);
                    loadInfoQcc(qccId);
                } else {
                    console.log("Data null");
                }
                $('#icon_loading_detail_qr').css("display", "none");
            },
            failure: function (errMsg) {
                $(".loader").addClass("d-none");
                console.log(errMsg);
                $('#icon_loading_detail_qr').css("display", "none");
            }
        });
    }

    var dataTest = [];
    function loadDataCheck(idQcc, frmFlag, timeSpan) {
        $(".loader").removeClass("d-none");

        var mDate = new getFormatDate(timeSpan);
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_list_report_result_by_id_qr",
            data: {
                id_qr_code: idQcc,
                time_span: timeM + " - " + timeM
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $(".loader").addClass("d-none");

                var data = response['data'];
                dataTest = data
                var idsReport = [];

                if (frmFlag == 8) {
                    for (i in data) {
                        for (j in data[i]) {
                            console.log("j----", j) //==1
                            for (k in data[i][j]) {
                                console.log("k----", k)
                                var classStyle = "fas fa-times txt-color-error";
                                switch (data[i][j][k].value_check) {
                                    case 0:
                                        // classStyle = "fas fa-check txt-color-success";
                                        classStyle = "txt-color-success";
                                        break;
                                    case 2:
                                        //  classStyle = "fas fa-minus-circle node-txt-color-default";
                                        classStyle = "txt-color-default";
                                        break;
                                    default:
                                        //  classStyle = "fas fa-times txt-color-error";
                                        classStyle = "txt-color-error";
                                        break;
                                }
                                var status = '<span class="value-step ' + classStyle + '">' + data[i][j][k].value_content + '</span>' +
                                    // '<span data-toggle="tooltip" title="' + data[i][j][k].value_content + '"><i class="value-check ' + classStyle + '"></i></span>'+
                                    loadDataMedia(data[i][j][k]["media"]);
                                $('.step' + data[i][j][k].step_id + '_' + j + '').html(status);
                            }
                            $('.step_create_time_' + j).html(data[i][j][0]['time'].slice(0, 10));
                            $('.step_create_user_' + j).html(data[i][j][0]['id_card'] + '<br>' + data[i][j][0]['fullname']);
                            $('.step_signer_user_' + j).addClass(" signer_user_" + data[i][j][0]['rr_id']);
                            if (idsReport.indexOf(data[i][j][0]['rr_id']) == -1) {
                                idsReport.push(data[i][j][0]['rr_id']);
                            }
                        }
                    }
                }
                else if (frmFlag == 1) {
                    for (i in data) {
                        var convertTime = i.substring(8);
                        for (j in data[i]) {
                            var classStyle = "fas fa-times txt-color-error";
                            switch (data[i][j].value_check) {
                                case 0:
                                    classStyle = "fas fa-check txt-color-success";
                                    classStyle = "txt-color-success";
                                    break;
                                case 2:
                                    classStyle = "fas fa-minus-circle node-txt-color-default";
                                    classStyle = "txt-color-default";
                                    break;
                                default:
                                    classStyle = "fas fa-times txt-color-error";
                                    classStyle = "txt-color-error";
                                    break;
                            }
                            var status = '<span class="value-step ' + classStyle + '">' + data[i][j].value_content + '</span><span data-toggle="tooltip" title="' + data[i][j].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(data[i][j]['media']);
                            $('.step' + data[i][j].step_id + '_' + convertTime).html(status);
                        }
                        $('.step_create_time_' + convertTime).html(data[i][0]['time']);
                        $('.step_create_user_' + convertTime).html(data[i][0]['id_card'] + '<br>' + data[i][0]['fullname']);
                        $('.step_signer_user_' + convertTime).addClass(" signer_user_" + data[i][0]['rr_id']);
                        if (idsReport.indexOf(data[i][0]['rr_id']) == -1) {
                            idsReport.push(data[i][0]['rr_id']);
                        }
                    }
                }
                else if (frmFlag == 7) {
                    for (day in data) {
                        var convertTime = day.substring(8);
                        for (shift in data[day]) {
                            var item = data[day][shift];
                            for (var i = 0; i < item.length; i++) {
                                var classStyle = "fas fa-times txt-color-error";
                                switch (item[i].value_check) {
                                    case 0:
                                        classStyle = "fas fa-check txt-color-success";
                                        classStyle = "txt-color-success";
                                        break;
                                    case 2:
                                        classStyle = "fas fa-minus-circle node-txt-color-default";
                                        classStyle = "txt-color-default";
                                        break;
                                    default:
                                        classStyle = "fas fa-times txt-color-error";
                                        classStyle = "txt-color-error";
                                        break;
                                }
                                var status = '<span class="value-step ' + classStyle + '">' + item[i].value_content + '</span><span data-toggle="tooltip" title="' + item[i].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(item[i]['media']);

                                $('.step' + item[i].step_id + '_' + convertTime + "_" + shift).html(status);
                            }
                            $('.step_create_time_' + convertTime + "_" + shift).html(item[0]['time']);
                            $('.step_create_user_' + convertTime + "_" + shift).html(item[0]['id_card'] + '<br>' + item[0]['fullname']);
                            $('.step_signer_user_' + convertTime + "_" + shift).addClass(" signer_user_" + item[0]['rr_id']);

                            if (idsReport.indexOf(item[0]['rr_id']) == -1) {
                                idsReport.push(item[0]['rr_id']);
                            }
                        }
                    }
                }
                else {
                    for (i in data) {
                        console.log("i--------", i)
                        for (j in data[i]) {
                            var classStyle = "fas fa-times txt-color-error";
                            switch (data[i][j].value_check) {
                                case 0:
                                    classStyle = "fas fa-check txt-color-success";
                                    classStyle = "txt-color-success";
                                    break;
                                case 2:
                                    classStyle = "fas fa-minus-circle node-txt-color-default";
                                    classStyle = "txt-color-default";
                                    break;
                                default:
                                    classStyle = "fas fa-times txt-color-error";
                                    classStyle = "txt-color-error";
                                    break;
                            }
                            var status = '<span class="value-step ' + classStyle + '">' + data[i][j].value_content + '</span><span data-toggle="tooltip" title="' + data[i][j].value_content + '"><i class="value-check ' + classStyle + '"></i></span>' + loadDataMedia(data[i][j]['media']);

                            $('.step' + data[i][j].step_id + '_' + i).html(status);
                        }
                        $('.step_create_time_' + i).html(data[i][0]['time'].slice(0, 10));
                        $('.step_create_user_' + i).html(data[i][0]['id_card'] + '<br>' + data[i][0]['fullname']);
                        $('.step_signer_user_' + i).addClass(" signer_user_" + data[i][0]['rr_id']);
                        if (idsReport.indexOf(data[i][0]['rr_id']) == -1) {
                            idsReport.push(data[i][0]['rr_id']);
                        }
                    }
                }
                loadDataSigned(idsReport);
            }
        });
    }

    function loadDataSigned(dataRequest) {
        if (dataRequest.length > 0) {
            $.ajax({
                type: 'POST',
                url: "/paperless/api/v2/get_list_signer_by_ids_report",
                cache: false,
                data: JSON.stringify(dataRequest),
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    var status = res['status'];
                    var mess = res['message'];
                    var total = res['total'];
                    var data = res['data'];
                    if (total > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var classSign = ".signer_user_" + data[i]['rrId'];
                            $(classSign).append(data[i]['idCard'] + " " + '<br>' + data[i]['fullName']);
                        }
                    }
                },
                error: function (e) {
                    alert(e.message);
                }
            });
        }
    }

    function loadDataMedia(mData) {
        var medias = JSON.parse(mData);
        var htmlMedia = "";
        if (medias.length > 0) {
            for (var i = 0; i < medias.length; i++) {
                htmlMedia += '<img data-enlargable src="/paperless/ws-data/images/' + medias[i] + '" width="30px" height="30px" class="img-enlargable" alt="Fail" id="img-data-' + i + '" onclick="zoomImage(' + i + ')">';
            }
        }
        return htmlMedia;
    }

    function showDetail(id_qcc, flag_id) {
        if (flag_id == 6) {
            var timeSpan = $('#reservation').val();
            showDataStatistic6(id_qcc, flag_id, timeSpan);
            $('#modal-detail').modal("show");
            $(".content").css('filter', 'blur(8px)');
        } else {
            loadInfoQcc(id_qcc);
            var timeSpan = $('#reservation').val();
            loadHeaderTime(flag_id, timeSpan);
            showDataStatistic(id_qcc, flag_id, timeSpan);
            $('#modal-detail').modal("show");
            $(".content").css('filter', 'blur(8px)');
        }
    }

    $('#modal-detail').on('hidden.bs.modal', function () {
        $(".content").css('filter', 'none');
    });


    $('.MEchecklist').bind('click', function () {

        var chart = $('#container').highcharts(),
            series = chart.series[0],
            points = series.points;

        points[1].select(true, true);
        points[10].select(true, true);
    });

    function itemBarClick() {
        $('.item_bar').click(function () {
            isLoading = true;
            flag_id_value = $(this)[0].id.replace("flag_", "");
            _state.id_flag = flag_id_value;

            var dateN = new Date();
            var time = new Date().getHours() + ":" + new Date().getMinutes();
            var tSift = Date.parse(new Date(dateN) + " " + time);
            var defaultSift1 = Date.parse(new Date(dateN) + ' 19:30');
            var defaultSift2 = Date.parse(new Date(dateN) + ' 07:30');

            if (tSift < defaultSift1 && tSift >= defaultSift2) {
                var dateNow = moment(new Date()).format("YYYY/MM/DD ")
                var datePick = moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm");
            } else {
                var dateNow = moment(new Date()).format("YYYY/MM/DD ").add(-1, "days").format("YYYY/MM/DD HH:mm");
                var datePick = moment(new Date($('#reservation').val())).format("YYYY/MM/DD HH:mm");

            }

            switch (flag_id_value) {
                case '1':
                    if (datePick < dateNow) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    }
                    else {
                        var status_name = 'Needed Check ';
                        status_name_chart = 'Needed Check';
                    }
                    break;
                case '2':
                    //week click item D/w/m/y/s
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (new Date(datePick).getWeekNumber() < new Date(dateNow).getWeekNumber()) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            var status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '3':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (datePick.getMonth < dateNow.getMonth) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '4':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (getQuarter(new Date(datePick)) < getQuarter(new Date(dateNow))) {
                            status_name = "Quantity Unchecked";
                            status_name_chart = "Unchecked";
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                case '5':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        status_name = 'Needed Check ';
                        status_name_chart = 'Needed Check';
                    }
                    break;
                case '7':
                    if (datePick.getFullYear < dateNow.getFullYear) {
                        status_name = "Quantity Unchecked";
                        status_name_chart = "Unchecked";
                    } else {
                        if (getQuarter(new Date(datePick)) < getQuarter(new Date(dateNow))) {
                            status_name = 'Quantity Unchecked ';
                            status_name_chart = 'Unchecked';
                        } else {
                            status_name = 'Needed Check ';
                            status_name_chart = 'Needed Check';
                        }
                    }
                    break;
                default:
                    break;
            }

            $("#status_name_un").html(status_name);
            temp_selection = '';
            var ft = $(".f").html() + $(".t").html();
            var arr_f = (this.id).split("_");
            tempFLag = " | " + $(this).children()[0].innerText.replace("\n\n\n", " ").trim();
            getDataPaperless(arr_f[1]);
            // _state.id_flag = arr_f[1];
            $("." + $(this).parent()[0].className).children().removeClass('item_bar_active');
            $(this).addClass('item_bar_active');
        });
    }

    function showDataStatistic6(qccId, frmFlag, timeSpan) {
        $("#detail-time").html(timeSpan);

        $(".dialog-detail-qr").css("display", "block");
        $('#icon_loading_detail_qr').css("display", "block");
        $.ajax({
            type: "GET",
            url: "/paperless/api/web/get_step_form_report_by_qr_code",
            data: {
                idQrCode: qccId
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var length = response.length;
                dataStep = response;
                if (length > 0) {
                    loadTitleContinuity(response);
                    loadDataByTime(qccId, timeSpan);
                    loadInfoQcc(qccId);
                } else {
                    console.log("Data null");
                }

                $('#icon_loading_detail_qr').css("display", "none");
            },
            failure: function (errMsg) {
                console.log(errMsg);

                $('#icon_loading_detail_qr').css("display", "none");
            }
        });
    }

    function loadTitleContinuity(res) {
        var thead = "<tr class='d-none'><th>Paper code: </th><th class='form_name'></th></tr>"
            + "<tr class='bg-head-blue text-center' id='row_created_at'><th style='width: 20vw'>Created At</th></tr>"
            + "<tr class='bg-head-blue text-center' id='row_employee'><th>Employee</th></tr>";
        var tbody = "";
        for (var i = 0; i < res.length; i++) {
            tbody += "<tr class='row_step_" + res[i].step_id + "'><th class='step'>[" + (i + 1) + "] " + res[i]['step_name'] + "</th></tr>";
        }
        tbody += "<tr class='row_signer'><th>Signer</th></tr>";
        tbody += "<tr'><td class='row_form_description' colspan='31'>Note: " + res[0].descriptionForm + "</td></tr>";
        $("#statistic-data-check-qr thead").html(thead);
        $("#statistic-data-check-qr tbody").html(tbody);
    }

    function loadRowData(idReport, position) {
        console.log(idReport);
        var rowReport = '';
        $("#statistic-data-check-qr thead tr#row_created_at").append("<th class='time_create" + idReport + "'></th>");
        $("#statistic-data-check-qr thead tr#row_employee").append("<th class='id_card" + idReport + "'></th>");
        for (var i = 0; i < dataStep.length; i++) {
            var idView = "re-" + idReport + "-" + dataStep[i]['step_id'];
            rowReport = "<td id='" + idView + "' class='step'></td>";
            $("#statistic-data-check-qr tbody tr.row_step_" + dataStep[i]['step_id']).append(rowReport);
        }
        $("#statistic-data-check-qr tbody tr.row_signer").append("<td class='signer_user_" + idReport + "'></td>");
        x
    }

    function loadDataByTime(idQcc, time) {
        var eDate = moment(time).add(-6, "days").format("YYYY/MM/DD") + ' 07:30:00';
        var sDate = moment(time).add(1, "days").format("YYYY/MM/DD") + ' 07:30:00';
        var timeSpan = eDate + ' - ' + sDate;
        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_data_report_continuity_qcc",
            data: {
                id_qcc: idQcc,
                time_span: timeSpan
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var status = response['status'];
                var total = response['total'];
                var data = response['data'];
                var position = 0;
                if (total > 0) {
                    var idReports = [];
                    for (var idReport in data) {
                        loadRowData(idReport, ++position);
                        $(".time_create" + idReport).html(data[idReport][0]['rr_create_at']);
                        $(".id_card" + idReport).html(data[idReport][0]['u_id_card']);
                        for (var i = 0; i < data[idReport].length; i++) {
                            var idView = "#re-" + idReport + "-" + data[idReport][i]['rrs_id_step'];
                            $(idView).html(data[idReport][i]['rrs_content'] + loadDataMedia(data[idReport][i]['rrs_media']));
                        }
                        idReports.push(idReport);
                    }
                    loadDataSigned(idReports);
                }
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    $(".ico-close-dialog").click(function () {
        $(".dialog-detail-qr").css("display", "none");
    })

    $(".ico-export-excel").click(function () {
        fnExcelReport();
    });

    function loadInfoQcc(idQcc) {
        $.ajax({
            type: "GET",
            url: "/paperless/api/v1/get_info_qcc_by_id_qcc",
            data: {
                id_qcc: idQcc
            },
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = response['data'];
                // if(data.length > 0){
                $(".detail-name-form").html(data[0]['fr_name']);
                $("#detail-form-code").html(data[0]['fr_code']);
                $("#detail-factory").html(data[0]['bu_name']);
                $("#detail-floor").html(data[0]['floor']);
                $("#detail-line").html(data[0]['line_name']);
                $("#detail-qr").html(data[0]['qc_code']);
                $("#detail-cycle").html(data[0]['fl_name']);
                // }else{
                //     // Alert data null
                // }
                $(".form_name").html(data[0]['fr_name']);
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    // var dataTest = []
    function getMEchecklist(teamId, id_flag, id_type, nameTeam) {
        clearInterval(window.autoReloadTimeout);
        // console.log("type--------", id_type)
        $(".loader").removeClass("d-none");
        var textType = ""
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_data_statistic_team_v2",
            data: {
                id_bu: $("#select-factory").val(),
                id_flag: id_flag,
                id_team: teamId,
                time_span: timeSpan,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                var data = res['data'];
                var dataCheck = [];
                var dataCate = [];
                var dataUnCheck = [];
                var dataStartDate = []
                // var dataTotalQr = []

                if (res.status == 1 && res.total > 0) {
                    for (var itemDate in data) {
                        // dataTest = data
                        // console.log("itemData", data[itemDate].mData)
                        var item = {
                            key: itemDate,
                            // name: data[itemDate].team_name,
                            check: data[itemDate].mData.check,
                            uncheck: data[itemDate].mData.un_check,
                            date: data[itemDate].startDate
                        }
                        // console.log("item----", item)
                        dataCate.push(item.key);
                        dataCheck.push(item.check);
                        dataUnCheck.push(item.uncheck);
                        dataStartDate.push(item.date);
                        // dataTotalQr.push(item.qr);
                    }

                    // console.log("dataCate:", dataCate)
                    // console.log("dataCate:", dataCheck)
                    // console.log("dataCate:", dataUnCheck)
                    if (id_type == 1) {
                        loadDataHightChartByTeam(dataStartDate, dataCheck, dataCate, "#3bdbc0", "<spring:message code='me.checked' />", nameTeam, id_flag, teamId, 1);
                        textType = "<spring:message code='me.checked' />"
                    } else {
                        loadDataHightChartByTeam(dataStartDate, dataUnCheck, dataCate, "#f4eb96", "<spring:message code='needed.check' />", nameTeam, id_flag, teamId, 0);
                        textType = "<spring:message code='needed.check' />"

                    }
                    // console.log("dataTotalQR: ", dataTotalQr)
                    $(".loader").addClass("d-none");
                    $("#chart_detail").removeClass("d-none");
                    $("#statistic").removeClass("d-none");
                    $("#department").removeClass("d-none");
                    $("#chart-by-team").removeClass("d-none");
                    $("#n_chart").addClass('d-none');
                    $("#n_box-2").addClass('d-none');
                    $("#n_box-2_1").addClass('d-none');
                    $("#tbl_title").html(nameTeam + " (" + timeSpan + ") - " + textType)

                } else {
                    alert("No data");
                    $("#n_box-2_1 span").html('<i class="far fa-frown"></i><b> No Data!</b>');
                    $("#chart_detail").addClass("d-none");
                    $("#statistic").addClass("d-none");
                    $("#department").addClass("d-none");
                    $("#chart-by-team").addClass("d-none");
                    $("#tbl>tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                    $("#tbl_title").html('No Data!');
                    $("#n_chart").removeClass('d-none');
                    $("#n_box-2_1").removeClass('d-none');
                    $("#n_box-2").removeClass('d-none');
                }
            },
            failure: function (errMsg) {
                console.log(errMsg);
                $(".loader").addClass("d-none");
                clearInterval(window.autoReloadTimeout)
            },complete: function () {
            isLoading = false;
            if (!isLoading){
                window.autoReloadTimeout && clearInterval(window.autoReloadTimeout);
                window.autoReloadTimeout = setInterval(reloadData, 10000);
            }
        }
        });
    }


    function loadDataHightChartByTeam(mDate, mCheck, mCate, colorColum, nameCheck, nameTeam, idFlag, idTeam, idType) {
        // console.log("mDate: ", mDate)
        Highcharts.chart('chart-by-team', {
            chart: {
                type: 'column',
                backgroundColor: '#fff0',
            },
            title: {
                text: nameTeam + " (" + timeSpan + ") - " + nameCheck,
                style: {
                    fontWeight: 'bold',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    color: '#8ce5ff',
                    fontSize: "2.7vh",
                }
            },
            xAxis: {
                categories: mCate,
                labels: {
                    style: {
                        color: '#FFF',
                        // fontSize: "14px",
                    },
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickLength: 0,
                tickWidth: 0,
            },
            yAxis: {
                min: 0,
                gridLineColor: '#023c37b3',
                title: {
                    text: ''
                },

                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                },
                labels: {
                    style: {
                        color: '#FFF',
                    },
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderColor: '#78d4e1',
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: null,
                itemStyle: {
                    color: '#ffffff',
                    fontSize: "11px",
                    fontWeight: null
                },
                itemHoverStyle: {
                    color: '#FFF263',
                    fontSize: "11.5px",
                }
            },
            tooltip: {
                headerFormat: '<b style="color: #FFF">{point.x}</b><br/>',
                pointFormat: '<span style="color: #FFF">{series.name}: {point.y}</span><br/><span style="color: #FFF"><spring:message code="home.total" />: {point.stackTotal}</span>',
                backgroundColor: '#063052db'
            },

            plotOptions: {
                column: {
                    pointWidth: 40,
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: '#023c37b3',
                        },
                    }
                },
                series: {
                    borderColor: null,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                // console.log("test click day by day")
                                var id_type = this.colorIndex;
                                count = 1
                                var dateTimeConvert = mDate[this.x].slice(0, 16).replaceAll("-", "/")
                                // getMEchecklist(this.series.userOptions.id_data, objData[0].teamId[this.x], this.series.name, this.category, id_flag, id_type);
                                if (idType == 1) {
                                    // _state.id_flag = idFlag;
                                    _state.teamId = idTeam;
                                    _state.sDate = dateTimeConvert;
                                    _state.nameTeam = nameTeam;
                                    _state.nameCheck = nameCheck
                                    loadDataFormChecked(idFlag,_state.teamId,_state.sDate,_state.nameTeam,_state.nameCheck);
                                    // loadDataFormChecked(idFlag, idTeam, dateTimeConvert, nameTeam, nameCheck);
                                } else {
                                    loadDataFormUnCheck(idFlag, idTeam, dateTimeConvert, nameTeam, nameCheck)
                                }
                                // console.log("series Date-----", mDate[this.x]);
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: nameCheck,
                type: 'column',
                color: colorColum,
                data: mCheck,
                tooltip: {
                    valueSuffix: ''
                }

            },
                // {
                //     name: nameCheck,
                //     type: 'line',
                //     color: colorColum,
                //     data: mCheck,
                //     tooltip: {
                //         valueSuffix: ''
                //     }

                // }
            ]
        });

    }
    function loadDataFormUnCheck(idFlag, idTeam, sDate, nameTeam, nameCheck) {
        $(".icon-loading").removeClass("d-none");
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_qr_code_uncheck_data_statistic_bu_team_v2",
            data: {
                id_bu: $("#select-factory").val() * 1,
                id_flag: idFlag,
                id_team: idTeam,
                time_span: sDate,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                $(".icon-loading").addClass("d-none");
                $("#tbl_title").html(nameTeam + " (" + sDate + ") - " + nameCheck)
                var data = res['data'];
                if (res.status == 1 && res.total > 0) {
                    bultTable(data);

                }
            },
            failure: function (errMsg) {
                console.log(errMsg);

            }
        });
    }

    function loadDataFormChecked(idFlag, idTeam, sDate, nameTeam, nameCheck) {
        $(".icon-loading").removeClass("d-none");
        $.ajax({
            type: "GET",
            url: "/paperless/api/v2/statistic/get_qr_code_checked_data_statistic_bu_team_v2",
            data: {
                id_bu: $("#select-factory").val() * 1,
                id_flag: idFlag,
                id_team: idTeam,
                time_span: sDate,
            },
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                $(".icon-loading").addClass("d-none");
                $("#tbl_title").html(nameTeam + " (" + sDate + ") - " + nameCheck)
                var data = res['data'];
                if (data != null) {
                    if (res.status == 1 && res.total > 0) {
                        bultTable(data);
                    } else {
                        $("#tbl tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                        $("#totalForm").html(" - Total Checklist: 0")
                    }
                } else {
                    $("#tbl tbody").html('<tr><td colspan="6"><i class="far fa-smile-beam"></i> No Data!</td></tr>');
                }
             
            },
            failure: function (errMsg) {
            console.log(errMsg);
            }
        });
    }

    function reloadData() {
        if (isLoading) {
            console.log("loading");
            return; 
        }
        
        var currentTime = moment().format("YYYY/MM/DD HH:mm");
        $('#reservation').data('daterangepicker').setStartDate(currentTime);
        $('#reservation').val(currentTime);
        
        timeSpan = currentTime;
        _state.sDate = currentTime;
        
        loadItem(_state.idFac);
    }

    function bultTable(data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var mergeSn = data[i].qr_code

            var mergeBu = data[i].qr_id
            html += '<tr class="icon_detail" onclick="showDetail(' + data[i].qcc_id + ', ' + data[i].flag_id + ')">' +
                '<td class="sn sn-' + mergeBu + '" sn_name="' + mergeBu + '">' + (i + 1) + '</td>' +
                '<td class="bu bu-' + mergeBu + '" bu_name="' + mergeBu + '">' + data[i].qr_code + '</td>' +
                '<td style="white-space: nowrap; padding: 0 5px 0 5px;">' + data[i].line_name + '</td>' +
                '<td style="text-align: left" class="pl-2 pr-2">' + data[i].form_code + '&nbsp - &nbsp ' + data[i].form_name + '</td>' +
                '<td>' + data[i].description + '</td>' +
                '</tr>'
        }
        $("#tbl tbody").html(html);
        mergeRow("sn");
        mergeRow("bu");
    }
    const mergeRow = function (param) {
        var rowObj = {};
        var elem = document.getElementsByClassName(param);

        for (var i = 0; i < elem.length; i++) {
            var param_name = elem[i].getAttribute(param + '_name');
            // console.log("rowOBJ:", rowObj[param_name]);
            //  console.log("param_name:", param_name);

            //   rowObj.push(param_name)
            if (rowObj[param_name] == null) {
                rowObj[param_name] = 1;
                // console.log("rowOBJ 1:", rowObj[param_name]);

            } else {
                rowObj[param_name] += 1;
                // console.log("rowOBJ 2:", rowObj[param_name]);

            }
        }
        //   console.log("rowObj", rowObj);

        if (param != 'sn') {
            for (var i in rowObj) {
                $('.' + param + '-' + i + ':not(:first)').remove();  // da co remove r
                var param_first = document.getElementsByClassName(param + '-' + i);
                param_first[0].setAttribute("rowspan", rowObj[i]);
                // console.log("rowspan: ", rowObj[i])
                // console.log("paramlist.length: ", param_first.length)
                // console.log("paramlist[0]: ", param_first[0])
                // console.log("pram_first: " + rowObj[i], param_first)

                // for (var i = 1; i < param_first.length; i++) {
                //     param_first[i].remove();
                //     i--;
                // }
            }
        }
        else {
            for (var i in rowObj) {
                $('.' + param + '-' + i + ':not(:first)').remove();
                var param_first = document.getElementsByClassName(param + '-' + i);
                param_first[0].setAttribute("rowspan", rowObj[i]);
                // param_first[0].innerHTML = count;
                count++;
                // for (var i = 1; i < param_first.length; i++) {
                //     param_first[i].remove();
                //     i--;
                // }

            }
            $("#totalForm").html(" <spring:message code='total.Checklist' />: " + (count - 1))
        }
    }

    $('#view-image').click(function () {
        $(this).fadeOut();
        $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
        // window.onpopstate = function (event) {
        //     event.preventDefault();
        // };
    })

    function zoomImage(index) {
        var src = $("#img-data-" + index).attr("src");
        $('#view-image').css({
            background: 'RGB(47,48,59) url(' + src + ') no-repeat center',
            backgroundSize: 'contain',
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: '10000',
            top: '0',
            left: '0',
            cursor: 'zoom_out',
            display: 'block'
        });

        $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1');
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            $('#view-image').css('display', 'none');
            $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
            history.go(1);
            // window.onpopstate = function (event) {
            //     event.preventDefault();
            // };
        }
    }

    function searchParams(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURIComponent(results[1]) || 0;
        }
    }

    $(document).ready(function () {
        $("#myInput").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#myTable tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        init();
    });
    // function reloadData(){
    //     if (!window.autoReloadInterval) {
    //     window.autoReloadInterval = setInterval(() => {
    //         loadItem(_state.idFac);
    //         getDataPaperless(_state.id_flag);
    //         getMEchecklist(_state.teamId,_state.id_flag,_state.id_type,_state.nameTeam);
    //         loadDataFormChecked(_state.id_flag, _state.teamId,_state.sDate, _state.nameTeam, _state.nameCheck);
    //     }, 7000);
    //     }
    // }

</script>
