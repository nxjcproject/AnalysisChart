var OrganizationId = "";
var IsFirstLoadChart = "true";
$(function () {
    var m_DefaultDate = new Date().getFullYear();
    //myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    $('#Numberspinner_QueryDate').numberspinner('setValue', m_DefaultDate);
    LoadStaticsItemsData('first');
   
});
function LoadStaticsItemsData(myLoadType) {
    $.ajax({
        type: "POST",
        url: "Analyse_EnergyPredit.aspx/GetEnergyPreditItems",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_MsgData = jQuery.parseJSON(msg.d);
            if (myLoadType == 'first') {
                InitializeStaticsItemsCombobox(m_MsgData['rows']);
            }
            else {

            }
        }
    });
}

function InitializeStaticsItemsCombobox(myData) {
    $('#Combobox_GetTagItems').combobox({
        data: myData,
        valueField: 'id',
        textField: 'text',
        separator: ',',
        multiple: true,
        panelHeight: 'auto'
    });
}
function QueryStaticsDataFun() {
    var m_OrgnizationId = OrganizationId;
    var m_DateTime = $('#Numberspinner_QueryDate').numberspinner('getValue');
    var m_TagItems = $('#Combobox_GetTagItems').combobox('getValues');
    //var m_TagItemsJson = JSON.stringify(m_TagItems);

    if (m_TagItems.length > 8) {
        alert('最多只能选择8项!');
    }
    else if (m_TagItems.length < 1 || m_TagItems.length == undefined) {
        alert('您没有选择可分析的项!');
    }
    else if (m_OrgnizationId == "") {
        alert('请选定要查询的组织机构!');
    }
    else {
        var m_TagItemsJson = "";
        for (var i = 0; i < m_TagItems.length; i++) {
            if (i == 0) {
                m_TagItemsJson = m_TagItems[i];
            }
            else {
                m_TagItemsJson = m_TagItemsJson + "," + m_TagItems[i];
            }
        }

        $.ajax({
            type: "POST",
            url: "Analyse_EnergyPredit.aspx/GetEnergyPreditChart",
            data: "{myOrgnizationId:'" + m_OrgnizationId + "',myDateTime:'" + m_DateTime + "',myTagItemsJson:'" + m_TagItemsJson + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_MsgData = jQuery.parseJSON(msg.d);
                if (m_MsgData == null || m_MsgData == undefined || m_MsgData == NaN) {
                    alert("生成趋势失败!");
                }
                else if (m_MsgData["rows"].length == 0) {
                    alert("生成趋势失败!");
                }
                else {
                    var m_WindowContainerId = 'Windows_Container';
                    if (IsFirstLoadChart == true) {
                        IsFirstLoadChart = false;
                    }
                    else {
                        ReleaseGridChartObj(m_WindowContainerId);
                    }
                    CreateGridChart(m_MsgData, m_WindowContainerId, true, "Line");
                }
            }
        });
    }

}
//获取双击组织机构时的组织机构信息
function onOrganisationTreeClick(myNode) {
    //alert(myNode.text);
    OrganizationId = myNode.OrganizationId;
    $('#TextBox_OrganizationText').textbox('setText', myNode.text);
}