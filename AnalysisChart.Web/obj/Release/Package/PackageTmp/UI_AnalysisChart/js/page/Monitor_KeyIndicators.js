﻿var ChartFirstFlag = true;
var ChartObject = [];
$(function () {
    GetChartData();
    $.parser.parse($('#Mainlayout').layout('panel', 'center'));
    $('#Mainlayout').layout('panel', 'center').scroll(function (myScroll) {
        //alert(myScroll.target.scrollLeft + "||" + myScroll.target.scrollTop);
        if (ChartObject.length > 0) {
            for (var i = 0; i < ChartObject.length; i++) {
                var m_ChartLabelLeft = $('#ChartContent_' + i).position().left;
                var m_ChartLabelTop = $('#ChartContent_' + i).position().top;
                $('#ChartValueTip_' + i).css('left', m_ChartLabelLeft + 15);
                $('#ChartValueTip_' + i).css('top', m_ChartLabelTop + 15);
            }
        }
    })
});
function GetChartData() {
    var m_OrganizationId = "";
    var m_PageId = "";
    var m_GroupName = "";
    $.ajax({
        type: "POST",
        url: "Monitor_KeyIndicators.aspx/GetChartData",
        data: "{myOrganizationId:'" + m_OrganizationId + "',myPageId:'" + m_PageId + "',myGroupName:'" + m_GroupName + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_MsgData = jQuery.parseJSON(msg.d);
            if (m_MsgData != null && m_MsgData != undefined) {
                if (ChartFirstFlag == true) {
                    ///////////自动生成Html/////////
                    GetChartContentHtml(m_MsgData);
                    for (var i = 0; i < m_MsgData.length; i++) {
                        ChartObject.push(GetMeterGauge("ChartContent_" + i, m_MsgData[i], ""));
                    }

                    ChartFirstFlag = false;
                }
                else {
                    ChartLoadData(m_MsgData)
                }
            }
        },
        error: function (msg) {
        }
    });
}
function GetChartContentHtml(myDataGroup) {
    var m_ChartContentWidth = 270;               //chart单独框架的宽度 
    var m_ChartContentHeight = 180;              //chart单独框架的高度
    var m_ChartContentRadio = 1.5;               //chart纵横比
    var m_MaxColumnCount = 4;                        //每行最多4个Chart
    var m_ChartContentObj = $("#ChartContentTable");

    var m_LayoutWidth = $('#Mainlayout').layout('panel', 'center').width();
    var m_LayoutHeight = $('#Mainlayout').layout('panel', 'center').height();
    var m_RowCount = myDataGroup.length % m_MaxColumnCount == 0 ? parseInt(myDataGroup.length / m_MaxColumnCount) : parseInt(myDataGroup.length / m_MaxColumnCount) + 1;

    if (m_ChartContentWidth * m_MaxColumnCount < m_LayoutWidth)                //可适当放大宽度
    {
        m_ChartContentWidth = parseInt(m_LayoutWidth / m_MaxColumnCount);
    }
    if (m_ChartContentHeight * m_RowCount < m_LayoutHeight) {             //可适当放大高度
        m_ChartContentHeight = parseInt(m_LayoutHeight / m_RowCount);
    }
    if (m_ChartContentWidth / m_ChartContentHeight > m_ChartContentRadio) {            //纵横比大于设定
        m_ChartContentWidth = parseInt(m_ChartContentHeight * m_ChartContentRadio);
    }
    else {
        m_ChartContentHeight = parseInt(m_ChartContentWidth / m_ChartContentRadio);
    }

    var m_ChartPaddingValue = parseInt((m_LayoutWidth - m_ChartContentWidth * m_MaxColumnCount) / 2);
    if (m_ChartPaddingValue < 0) {
        m_ChartPaddingValue = 0;
    }
    $('#Mainlayout').layout('panel', 'center').css("padding-left", m_ChartPaddingValue);
    $('#QueryTable').css("width", m_ChartContentWidth * m_MaxColumnCount);
    $('#Mainlayout').layout('panel', 'north').css("padding-left", m_ChartPaddingValue);


    for (var i = 0; i < m_RowCount; i++) {
        var m_ChartContentRowObj = $("<tr></tr>");
        for (var j = 0; j < m_MaxColumnCount; j++) {
            var m_ChartIndex = i * m_MaxColumnCount + j
            if (m_ChartIndex < myDataGroup.length) {
                m_ChartContentRowObj.append('<td style="width: ' + m_ChartContentWidth + 'px; height: ' + m_ChartContentHeight + 'px; background-color: #dddddd; overflow: hidden;">' +
                                            '<div id="ChartContent_' + m_ChartIndex + '" style="width: ' + m_ChartContentWidth + 'px; height: ' + (m_ChartContentHeight + 10) + 'px; font-size: 10pt; margin-bottom: -10px;"></div>' +
                                            '<div id="ChartValueTip_' + m_ChartIndex + '" style="width:100px; height: 25px; font-size: 9pt;position:absolute;left:' + (m_ChartPaddingValue + m_ChartContentWidth * j + 15) + 'px;top:' + (m_ChartContentHeight * i + 15) + 'px;">当前值:' + myDataGroup[m_ChartIndex]['value'] + '</div>' +
                                            '</td>');

                myDataGroup[m_ChartIndex]['background'] = "#ffffff";
                myDataGroup[m_ChartIndex]["hubRadius"] = 5;
                myDataGroup[m_ChartIndex]['ringWidth'] = 5;
                myDataGroup[m_ChartIndex]["intervalColors"] = ["#00ff00", "#ffff00", "#ff0000"];
                myDataGroup[m_ChartIndex]['intervalOuterRadius'] = parseInt(m_ChartContentHeight / 2) - 28;
                var m_LabelBackgroundColor = myDataGroup[m_ChartIndex]["intervalColors"][myDataGroup[m_ChartIndex]["intervalColors"].length - 1];
                for (var k = 0; k < myDataGroup[m_ChartIndex]['intervals'].length; k++) {
                    if (myDataGroup[m_ChartIndex]['intervals'][k] > myDataGroup[m_ChartIndex]['value']) {            //自动判断Label颜色
                        m_LabelBackgroundColor = myDataGroup[m_ChartIndex]["intervalColors"][k];
                        break;
                    }
                }
                myDataGroup[m_ChartIndex]["label"] = '<div id = "ChartLabel_' + m_ChartIndex + '" style = "font-size:9pt;color:black;background-color:' + m_LabelBackgroundColor + ';">' + myDataGroup[m_ChartIndex]["label"] + '</div>';

            }
            else {
                m_ChartContentRowObj.append('<td style="width: ' + m_ChartContentWidth + 'px; height: ' + m_ChartContentHeight + 'px; background-color: #dddddd; overflow: hidden;">' +
                                            '</td>');
            }
        }

        m_ChartContentObj.append(m_ChartContentRowObj);
    }
}
function ChartLoadData(myData) {
    ///////////更新当前值所在区域/////////////
    var m_LabelBackgroundColor = "#ffffff";    
    for (var i = 0; i < myData.length; i++) {
        ChartObject[i].data = [[myData[i]]];
        ChartObject[i].replot(ChartObject[i].options);


        var m_Intervals = ChartObject[i].options.seriesDefaults.rendererOptions.intervals;
        var m_IntervalColors = ChartObject[i].options.seriesDefaults.rendererOptions.intervalColors;
        for (var j = 0; j < m_Intervals.length; j++) {
            if (m_Intervals[j] > myData[i]) {            //自动判断Label颜色
                m_LabelBackgroundColor = m_IntervalColors[j];
                break;
            }
        }
        $('#ChartLabel_' + i).css('background-color', m_LabelBackgroundColor);
        $('#ChartValueTip_' + i).html('当前值:' + myData[i]);

    }

    //$('#QueryTable').css("height", $('#QueryTable').css("height") + 10);
}