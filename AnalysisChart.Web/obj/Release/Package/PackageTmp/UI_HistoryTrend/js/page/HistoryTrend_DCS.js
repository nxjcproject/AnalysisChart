////////////////////////////
var IsFirstLoadChart;
$(function () {
    InitializeSelectedGrid();
    LoadSelectDcsTagsDialog();
    InitializeDateTimePickers();
    IsFirstLoadChart = true;
    ReloadTagTypeCommbox();
});
//////////////////////////////////初始化基础数据//////////////////////////////////////////
function InitializeSelectedGrid() {
    $('#grid_SelectedObj').datagrid({
        title: '',
        data: {"rows":[],"total":0},
        dataType: "json",
        striped: true,
        //loadMsg: '',   //设置本身的提示消息为空 则就不会提示了的。这个设置很关键的
        rownumbers: true,
        singleSelect: true,
        idField: 'TagItemId',
        columns: [[{
            width: '180',
            title: '标签名称',
            field: 'TagItemName'
        }, {
            width: '90',
            title: '所属DataBase',
            field: 'TagDataBase',
            hidden: true
        }, {
            width: '90',
            title: '所属DataTable',
            field: 'TagDataTable',
            hidden: true
        }, {
            width: '90',
            title: '所属FieldId',
            field: 'TagFieldId',
            hidden: true
        }]],
        onDblClickRow: function (rowIndex, rowData) {
            $(this).datagrid('deleteRow', rowIndex);
        },
        toolbar: '#MainSelect_Toolbar'
    });
}
function InitializeDateTimePickers() {
    var m_DateTime = new Date();
    var m_NowStr = m_DateTime.format("yyyy-MM-dd hh:mm:ss");
    m_DateTime.setDate(m_DateTime.getDate() - 1);
    var m_YestedayStr = m_DateTime.format("yyyy-MM-dd hh:mm:ss");
    $('#StartTime').datetimebox('setValue', m_YestedayStr);
    $('#EndTime').datetimebox('setValue', m_NowStr);
}
function ReloadTagTypeCommbox() {
    var m_CommboxData = $('#combobox_TagsSelector_Dcs_DcsTagsTypeF').combobox('getData');
    if (m_CommboxData != null && m_CommboxData != undefined) {
        for (var i = 0; i < m_CommboxData.length; i++) {
            if (m_CommboxData[i].value == "bit") {
                m_CommboxData.splice(i, 1);
                break;
            }
        }
        $('#combobox_TagsSelector_Dcs_DcsTagsTypeF').combobox('loadData', m_CommboxData);
    }
}
/////////////////////////////////添加标签///////////////////////////////
function AddTagItemsFun() {
    $('#dlg_SelectDcsTags').dialog('open');
}
function RemoveAllTagItemsFun() {
    RemoveDataTagFun();
}
function QueryHistoryTrend() {
    var m_StartTime = $('#StartTime').datetimebox('getValue');
    var m_EndTime = $('#EndTime').datetimebox('getValue');
    var m_TagInfoObject = $('#grid_SelectedObj').datagrid('getData');
    if (m_StartTime == "") {
        alert("您还没有选择查询开始时间!");
    }
    else if (m_EndTime == "") {
        alert("您还没有选择查询结束时间!");
    }
    else {
        if (m_TagInfoObject['rows'].length > 0) {
            var m_TagInfoJson = JSON.stringify(m_TagInfoObject);

            $.ajax({
                type: "POST",
                url: "HistoryTrend_DCS.aspx/GetChartDataJson",
                data: "{myStartTime:'" + m_StartTime + "',myEndTime:'" + m_EndTime + "',myTagInfoJson:'" + m_TagInfoJson + "'}",
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
                        CreateGridChart(m_MsgData, m_WindowContainerId, true, "DateXLine");
                    }

                    /////////////////////判断超数量的图表///////////////////////
                    //m_Postion = GetWindowPostion(0, m_WindowContainerId);
                    //WindowsDialogOpen(m_MsgData, m_WindowContainerId, true, "Line", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, m_Maximizable, m_Maximized);
                }
            });
        }
        else {
            alert("您还没有选择标签!");
        }
    }
}
//////////////////获得标签双击事件///////////////////
function GetTagInfo(myRowData, myDcsDataBaseName, myDcsOrganizationId)
{
    var m_NewRow = {
        'TagItemId': myRowData.VariableName, 'TagItemName': myRowData.VariableDescription, 'TagDataBase': myDcsDataBaseName,
        'TagDataTable': myRowData.TableName, 'TagFieldId': myRowData.FieldName
    };
    AddChartTags(m_NewRow);
}
function AddChartTags(myRow) {
    var m_Rows = $('#grid_SelectedObj').datagrid('getRows');

    if (m_Rows.length < 8) {
        $('#grid_SelectedObj').datagrid('appendRow', myRow);
    }
    else {
        alert("最多允许添加8个标签!");
    }
}

////////////////////////////清空所有显示标签//////////////////////////////
function RemoveDataTagFun() {
    $('#grid_SelectedObj').datagrid('loadData', { 'rows': [], 'total': 0 });
}
/////////////////////////////添加标签对话框/////////////////////////////////
function LoadSelectDcsTagsDialog() {
    $('#dlg_SelectDcsTags').dialog({
        title: '选择DCS标签',
        width: 750,
        height: 460,
        closed: true,
        cache: false,
        modal: true
    });
}