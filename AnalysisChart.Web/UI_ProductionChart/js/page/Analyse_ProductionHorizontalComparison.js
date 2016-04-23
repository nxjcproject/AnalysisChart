var ChartLoadType = 'first';
var LastScreenShowType = "";
var StandardItemsLoadType = 'first';
var EquipmentItemsLoadType = 'first';
//////////////////设置标准库,当选择不同的统计项，则对应不同的标准///////////////
var CurrentStandardLib;
var SelectDatetime;   //点击查询后的数据
$(function () {
    InitializeDateTime();           //初始化日期
    loadTagItemsListDialog();
    LoadIndicatorItems();
    LoadEquipmentCommonInfo();
    InitializeSelectedGrid({ "rows": [], "total": 0 });    //初始化选择列表
    BindingTrigger();             //添加自定义事件绑定

});
function BindingTrigger() {
    ////////////当标准数据加载完后
    $('#grid_StandardItems').bind("StandardItemsLoadComplate", function () {
        LoadRunIndicatorObjectItems();
    });
}
function InitializeDateTime() {
    //StartTime; EndTime

    var lastMonthDate = new Date();  //上月日期  
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    $('#StartTimeF').datetimespinner({
        formatter: formatter2,
        parser: parser2,
        selections: [[0, 4], [5, 7], [8, 9]],
        required: true
    });
    $('#EndTimeF').datetimespinner({
        formatter: formatter2,
        parser: parser2,
        selections: [[0, 4], [5, 7], [8, 9]],
        required: true
    });
    var m_LastMonthDateString = lastMonthDate.getFullYear();
    if (lastMonthDate.getMonth() + 1 < 10) {
        m_LastMonthDateString = m_LastMonthDateString + '-0' + (lastMonthDate.getMonth() + 1);
    }
    else {
        m_LastMonthDateString = m_LastMonthDateString + '-' + (lastMonthDate.getMonth() + 1);
    }
    if (lastMonthDate.getDate() < 10) {
        m_LastMonthDateString = m_LastMonthDateString + '-0' + lastMonthDate.getDate();
    }
    else {
        m_LastMonthDateString = m_LastMonthDateString + '-' + lastMonthDate.getDate();
    }
    $('#StartTimeF').datetimespinner('setValue', m_LastMonthDateString);
    $('#EndTimeF').datetimespinner('setValue', m_LastMonthDateString);
}
function formatter2(date) {
    if (!date) { return ''; }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return y + '-' + (m < 10 ? ('0' + m) : m);
}
function parser2(s) {
    if (!s) { return null; }
    var ss = s.split('-');
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    if (!isNaN(y) && !isNaN(m)) {
        return new Date(y, m - 1, 1);
    } else {
        return new Date();
    }
}
function LoadIndicatorItems() {
    $.ajax({
        type: "POST",
        url: "Analyse_ProductionHorizontalComparison.aspx/GetIndicatorItems",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_MsgData = jQuery.parseJSON(msg.d);
            $('#ComboTree_ValueTypeF').combotree({
                data: m_MsgData,
                dataType: "json",
                valueField: 'id',
                textField: 'text',
                required: false,
                panelHeight: 'auto',
                editable: false
            });
            
            $('#ComboTree_ValueTypeF').combotree('tree').tree("collapseAll");
            if (m_MsgData != null && m_MsgData != undefined && m_MsgData.length > 0) {
                $('#ComboTree_ValueTypeF').combotree("setValue", m_MsgData[0].id);
            }
        }
    });
}
///设置选中列表（datagrid）
function InitializeSelectedGrid(myData) {
    $('#grid_SelectedObj').datagrid({
        title: '',
        data: myData,
        dataType: "json",
        striped: true,
        //loadMsg: '',   //设置本身的提示消息为空 则就不会提示了的。这个设置很关键的
        rownumbers: true,
        singleSelect: true,
        idField: 'TagItemId',
        columns: [[{
            width: '110',
            title: '数据项ID',
            field: 'TagItemId',
            hidden: true
        }, {
            width: '140',
            title: '名称',
            field: 'Name'
        }, {
            width: '60',
            title: '组织机构ID',
            field: 'OrganizationId',
            hidden: true
        }, {
            width: '60',
            title: '层次码',
            field: 'LevelCode',
            hidden: true
        }, {
            width: '60',
            title: '统计方式',
            field: 'StatisticType',
            hidden: true
        }, {
            width: '60',
            title: '统计方式名称',
            field: 'StatisticName',
            hidden: true
        }, {
            width: '60',
            title: '变量ID',
            field: 'VariableId',
            hidden: true
        }, {
            width: '70',
            title: '值',
            field: 'Value'
        }]],
        onDblClickRow: function (rowIndex, rowData) {
            $(this).datagrid('deleteRow', rowIndex);
        },
        toolbar: '#tool_SelectedObj'
    });
}
function AddTagItemsFun() {
    //var m_ValueType = $('#ComboTree_ValueTypeF').combobox('getValue');
    //var m_SelectedTab = $('#TagItemsTabs').tabs('getSelected');
    //var m_SelectedTabTitle = m_SelectedTab.panel('options').title;
    //if (FirstLoadIndexTab == 'first') {
    //    LoadRunIndicatorObjectItems(m_ValueType, AllCategroy, 'first');
    //    FirstLoadIndexTab = 'last';
    //}
    //else {
    //    LoadRunIndicatorObjectItems(m_ValueType, AllCategroy, 'last');
    //}
    LoadStandardItems();
    $('#dlg_TagItemsList').dialog('open');
}
function RemoveDataTagFun() {
    $('#grid_SelectedObj').datagrid('loadData', { 'rows': [], 'total': 0 });
}
function loadTagItemsListDialog() {
    $('#dlg_TagItemsList').dialog({
        title: '数据项查询',
        width: 700,
        height: 450,
        left: 20,
        top: 20,
        closed: true,
        cache: false,
        modal: true,
        iconCls: 'icon-search',
        resizable: false
    });
}
function LoadEquipmentCommonInfo()
{
    $.ajax({
        type: "POST",
        url: "Analyse_ProductionHorizontalComparison.aspx/GetEquipmentInfo",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_MsgData = jQuery.parseJSON(msg.d);
            $('#EquipmentCommonInfo').combobox({
                data: m_MsgData,
                valueField: 'id',
                textField: 'text',
                separator: ',',
                multiple: true,
                panelHeight: 'auto'
            });
        }
    });
}
function LoadRunIndicatorObjectItems() {                                      //装载可比数据

    var m_ValueType = $('#ComboTree_ValueTypeF').combotree('getValue');
    var m_DataGridId = "EquipmentInfo";
    var m_EquipmentCommonId = $('#EquipmentCommonInfo').combobox('getValue');
    if (m_EquipmentCommonId == undefined || m_EquipmentCommonId == null) {
        m_EquipmentCommonId = "";
    }
    if (m_ValueType != undefined && m_ValueType != null) {
        $.ajax({
            type: "POST",
            url: "Analyse_ProductionHorizontalComparison.aspx/GetStaticsItems",
            data: "{myValueType:'" + m_ValueType + "',myEquipmentCommonId:'" + m_EquipmentCommonId + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_DataGridId = "StaticsItems";
                var m_MsgData = jQuery.parseJSON(msg.d);
                if (EquipmentItemsLoadType == "first") {
                    InitializeStaticsItems(m_DataGridId, m_MsgData);
                    EquipmentItemsLoadType = 'last';
                }
                else {
                    $('#grid_' + m_DataGridId).tree('loadData', m_MsgData);
                    //$('#' + m_DataGridId).tree('loadData', { "rows": [], "total": 0 });
                }
            }
        });
    }
    else {
        alert("请先选择指标类别!");
    }
}
    function LoadStandardItems() {
        var m_ValueTypeCombobox = $('#ComboTree_ValueTypeF').combobox('getValue');

        var m_StatisticalMethod = "Entity";
        var m_ValueType = "Production";
        $.ajax({
            type: "POST",
            url: "Analyse_ProductionHorizontalComparison.aspx/GetStandardItems",
            data: "{myStatisticalMethod:'" + m_StatisticalMethod + "',myValueType:'" + m_ValueType + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_DataGridId = "StandardItems";
                var m_MsgData = jQuery.parseJSON(msg.d);
                CurrentStandardLib = m_MsgData["rows"];
                if (StandardItemsLoadType == "first") {
                    InitializeStandardGrid(m_DataGridId, { "rows": [], "total": 0 });
                    StandardItemsLoadType = 'last'
                }
                else {
                    $('#grid_' + m_DataGridId).datagrid('loadData', { "rows": [], "total": 0 });
                }
                $('#grid_' + m_DataGridId).trigger("StandardItemsLoadComplate");                   //添加一个自定义事件，表示标准已经加载完毕
            }
        });
    }
    function InitializeStaticsItems(myGridId, myData) {
        $('#grid_' + myGridId).tree({
            data: myData,
            animate: true,
            lines: true,
            toolbar: '#toolbar_' + myGridId,
            onDblClick: function (rowData) {
                if (rowData.id.length > 5) {
                    //onOrganisationTreeClick(node);
                    var m_VariableId = rowData.id;
                    var m_ValueTypeName = $('#ComboTree_ValueTypeF').combobox('getText');

                    var m_ValueType = $('#ComboTree_ValueTypeF').combobox('getValue');
                    var m_TagItemId = m_ValueType;

                    var m_ValueTypeCombobox = $('#ComboTree_ValueTypeF').combobox('getValue').split('_');
                    var m_StatisticalMethod = "Entity";

                    var m_TagName = rowData.text;
                    var m_TreeData = $('#grid_' + myGridId).tree('getParent', rowData.target);
                    while (m_TreeData != null && m_TreeData != undefined && m_TreeData != NaN) {
                        if (m_TreeData.LevelType == 'Company') {
                            m_TagName = m_TreeData.text + '>>' + m_TagName;
                        }
                        m_TreeData = $('#grid_' + myGridId).tree('getParent', m_TreeData.target);
                    }

                    var m_NewRow = {
                        'TagItemId': m_TagItemId, 'Name': m_TagName,
                        'OrganizationId': rowData.OrganizationId, 'LevelCode': rowData.LevelCode,
                        'StatisticType': m_StatisticalMethod, 'StatisticName': m_ValueTypeName, 'VariableId': m_VariableId, 'Value': ""
                    };
                    var m_AddFlag = AddChartTags(m_NewRow);
                    if (m_AddFlag == true) {
                        alert("标签添加成功!");
                    }
                }
                else {
                    alert("请选择到设备!");
                }
            },
            onClick: function (rowData) {
                SetStandardByVariableId(rowData.EquipmentCommonId, rowData.OrganizationId);   //单击统计项可自动对应标准
            }
        });
    }
    function SetStandardByVariableId(myVariableId, myOrganizationId) {
        var m_DataGridId = "grid_StandardItems";
        var m_StandardObject = { "rows": [], "total": 0 };
        if (CurrentStandardLib != undefined && CurrentStandardLib != null) {
            for (var i = 0; i < CurrentStandardLib.length; i++) {
                if (CurrentStandardLib[i].VariableId == myVariableId && (CurrentStandardLib[i].OrganizationId == "" || CurrentStandardLib[i].OrganizationId == myOrganizationId)) {
                    var m_NewRow = {
                        'StandardItemId': CurrentStandardLib[i].StandardItemId, 'Name': CurrentStandardLib[i].Name,
                        'StandardName': CurrentStandardLib[i].StandardName, 'StandardId': CurrentStandardLib[i].StandardId,
                        'StandardLevel': CurrentStandardLib[i].StandardLevel, 'StandardValue': CurrentStandardLib[i].StandardValue,
                        'Unit': CurrentStandardLib[i].Unit
                    };
                    m_StandardObject["rows"].push(m_NewRow);
                }
            }

            m_StandardObject["total"] = m_StandardObject["rows"].length;
        }
        $('#' + m_DataGridId).datagrid('loadData', m_StandardObject);

    }
    ////////////////////////////获得标准DataGrid////////////////////////////
    function InitializeStandardGrid(myGridId, myData) {
        $('#grid_' + myGridId).datagrid({
            title: '',
            data: myData,
            fit: true,
            border: true,
            dataType: "json",
            striped: true,
            //loadMsg: '',   //设置本身的提示消息为空 则就不会提示了的。这个设置很关键的
            rownumbers: true,
            singleSelect: true,
            idField: 'StandardItemId',
            columns: [[{
                width: '130',
                title: '标准名称',
                field: 'Name'
            }, {
                width: '80',
                title: '归类',
                field: 'StandardName'
            }, {
                width: '90',
                title: '标准ID',
                field: 'StandardId',
                hidden: true
            }, {
                width: '40',
                title: '等级',
                field: 'StandardLevel'
            }, {
                width: '60',
                title: '数值',
                field: 'StandardValue'
            }, {
                width: '60',
                title: '单位',
                field: 'Unit'
            }]],
            onDblClickRow: function (rowIndex, rowData) {
                var m_NewRow = {
                    'TagItemId': rowData.StandardItemId, 'Name': rowData.Name + ">>" + rowData.StandardName,
                    'OrganizationId': "", 'LevelCode': "", 'StatisticType': rowData.StandardId,
                    'StatisticName': rowData.StandardName, 'VariableId': "", 'Value': rowData.StandardValue
                };
                var m_AddFlag = AddChartTags(m_NewRow);
                if (m_AddFlag == true) {
                    alert("标签添加成功!");
                }
            }
        });
    }
    //////////////////////////////添加到显示列表///////////////////////////////
    function AddChartTags(myRow) {
        var m_Rows = $('#grid_SelectedObj').datagrid('getRows');
        var m_TagsCount = m_Rows.length;
        var m_IsDuplicate = false;
        if (m_TagsCount < 32) {
            for (var i = 0; i < m_TagsCount; i++) {
                if (m_Rows[i]["TagItemId"] == myRow["TagItemId"] && m_Rows[i]["OrganizationId"] == myRow["OrganizationId"]) {
                    m_IsDuplicate = true;
                    break;
                }
            }
            if (m_IsDuplicate == true) {
                alert("该标签已经选择!");
                return false;
            }
            else {
                $('#grid_SelectedObj').datagrid('appendRow', myRow);
                return true;
            }
        }
        else {
            alert("最多允许添加32个标签!");
            return false;
        }
    }
    function SetSelectedObjValue(myMsgData) {
        var m_Rows = $('#grid_SelectedObj').datagrid('getRows');
        if (myMsgData["columns"] != null && myMsgData["columns"] != undefined) {
            for (var i = 1; i < myMsgData["columns"].length; i++) {
                var m_ColumnField = myMsgData["columns"][i].field;
                for (var j = 0; j < m_Rows.length; j++) {
                    if (m_ColumnField == m_Rows[j]["TagItemId"] + m_Rows[j]["OrganizationId"]) {
                        m_Rows[j]["Value"] = myMsgData["rows"][0][m_ColumnField];
                        $('#grid_SelectedObj').datagrid('refreshRow', j);
                        break;
                    }
                }
            }
        }
    }
    function GetDataGridToTableTransposition(myTitleName, mySelectDatetime) {
        var m_DataGridDataObj = $('#grid_SelectedObj').datagrid("getRows");
        var m_NewDataGridDataObj = [];
        for (var i = 0; i < m_DataGridDataObj.length; i++) {      //构造数组仅名称和值两列
            m_NewDataGridDataObj.push([m_DataGridDataObj[i]["Name"], m_DataGridDataObj[i]["Value"]]);
        }

        var m_MaxSplitCount = 0;         //取分割后最大的数组长度
        var m_TitleArray = [];
        var m_TableColumnArray = [];
        m_NewDataGridDataObj = m_NewDataGridDataObj.sort(function (a, b) {              //对名字进行升序排序
            if (a[0] > b[0]) {
                return 1;
            } else if (a[0] < b[0]) {
                return -1;
            } else {
                return 0;
            }
        });
        for (var i = 0; i < m_NewDataGridDataObj.length; i++) {
            var m_TitleItemArray = m_NewDataGridDataObj[i][0].split(">>");
            if (m_MaxSplitCount < m_TitleItemArray.length) {
                m_MaxSplitCount = m_TitleItemArray.length;        //取分割后最大的数组长度
            }
            m_TitleArray.push(m_TitleItemArray);
        }

        for (var i = 0; i < m_MaxSplitCount; i++) {
            var m_TitleString = "";
            var m_Colspan = 1;
            for (var j = 0; j < m_TitleArray.length; j++) {
                if (i < m_TitleArray[j].length) {                          //检查数组不能越界
                    if (m_TitleString != m_TitleArray[j][i]) {
                        m_TitleString = m_TitleArray[j][i];
                        if (m_TableColumnArray[i] == undefined) {
                            m_TableColumnArray[i] = [];
                        }
                        m_TableColumnArray[i].push([m_TitleString, 1]);

                        if (m_TableColumnArray[i].length > 1) {
                            m_TableColumnArray[i][m_TableColumnArray[i].length - 2][1] = m_Colspan;
                        }
                        m_Colspan = 1;
                    }
                    else {
                        m_Colspan = m_Colspan + 1;
                    }
                }
                else {
                    if (m_TableColumnArray[i] == undefined) {
                        m_TableColumnArray[i] = [];
                    }
                    m_TableColumnArray[i].push(["", 1]);
                }
            }
            if (m_TableColumnArray[i].length > 0) {
                m_TableColumnArray[i][m_TableColumnArray[i].length - 1][1] = m_Colspan;
            }
        }
        ////////////////生成table/////////////
        var m_TableString = '<table style = "border:0px;margin:0px;border-collapse:collapse;border-spacing:0px;padding:0px;">';
        m_TitleSpan = m_NewDataGridDataObj.length > 0 ? m_NewDataGridDataObj.length : 1;
        var m_TitleHtml = '<tr><td colspan = ' + m_TitleSpan + ' style = "font-size:18pt; text-align:center; font-weight:bold;">' + myTitleName + '</td></tr>';
        m_TitleHtml = m_TitleHtml + '<tr><td colspan = ' + m_TitleSpan + ' style = "text-align:center; "> 统计日期: ' + mySelectDatetime + '</td></tr>';

        m_TableString = m_TableString + m_TitleHtml;
        for (var i = 0; i < m_TableColumnArray.length; i++) {
            m_TableString = m_TableString + "<tr>"
            for (var j = 0; j < m_TableColumnArray[i].length; j++) {
                if (m_TableColumnArray[i][j][1] > 1) {
                    m_TableString = m_TableString + '<td colspan = ' + m_TableColumnArray[i][j][1] + ' style = "border:0.1pt solid black; text-align:center;">' + m_TableColumnArray[i][j][0] + '</td>';
                }
                else {
                    m_TableString = m_TableString + '<td style = "border:0.1pt solid black; text-align:center;">' + m_TableColumnArray[i][j][0] + '</td>';
                }
            }
            m_TableString = m_TableString + "</tr>";
        }
        m_TableString = m_TableString + "<tr>"
        for (var i = 0; i < m_NewDataGridDataObj.length; i++) {
            m_TableString = m_TableString + '<td style = "border:0.1pt solid black; text-align:center;">' + m_NewDataGridDataObj[i][1] + '</td>';
        }
        m_TableString = m_TableString + "</tr></table>";

        return m_TableString;
        //for (var i = 0; i < m_DataGridDataObj.length - 1; i++) {
        //    for (var j = i + 1; j < m_DataGridDataObj.length; j++) {
        //        if(m_DataGridDataObj[i]["Name"] > 
        //    }
        //}
    }


    function ExportFileFun() {
        var m_FunctionName = "ExcelStream";
        var m_Parameter1 = GetDataGridToTableTransposition("横向对标数据", SelectDatetime);                 //GetDataGridTableHtmlSplitColumn("grid_SelectedObj", "横向对标数据", SelectDatetime, ">>", "Name");
        var m_Parameter2 = "横向对标数据";

        var m_ReplaceAlllt = new RegExp("<", "g");
        var m_ReplaceAllgt = new RegExp(">", "g");
        m_Parameter1 = m_Parameter1.replace(m_ReplaceAlllt, "&lt;");
        m_Parameter1 = m_Parameter1.replace(m_ReplaceAllgt, "&gt;");

        var form = $("<form id = 'ExportFile'>");   //定义一个form表单
        form.attr('style', 'display:none');   //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', "Analyse_ProductionHorizontalComparison.aspx");

        var input_Method = $('<input>');
        input_Method.attr('type', 'hidden');
        input_Method.attr('name', 'myFunctionName');
        input_Method.attr('value', m_FunctionName);
        var input_Data1 = $('<input>');
        input_Data1.attr('type', 'hidden');
        input_Data1.attr('name', 'myParameter1');
        input_Data1.attr('value', m_Parameter1);
        var input_Data2 = $('<input>');
        input_Data2.attr('type', 'hidden');
        input_Data2.attr('name', 'myParameter2');
        input_Data2.attr('value', m_Parameter2);

        $('body').append(form);  //将表单放置在web中 
        form.append(input_Method);   //将查询参数控件提交到表单上
        form.append(input_Data1);   //将查询参数控件提交到表单上
        form.append(input_Data2);   //将查询参数控件提交到表单上
        form.submit();
        //释放生成的资源
        form.remove();
    }

    /////////////////////////////////////////////////
    function LoadChartFun() {
        var m_StartTime = $('#StartTimeF').datetimespinner('getValue');
        var m_EndTime = $('#EndTimeF').datetimespinner('getValue');
        var m_TagInfoObject = $('#grid_SelectedObj').datagrid('getData');
        SelectDatetime = "开始时间:" + m_StartTime + "--结束时间" + m_EndTime + "(" + $('#ComboTree_ValueTypeF').combobox('getText') + ")";
        if (m_TagInfoObject['rows'].length > 0) {
            var m_TagInfoJson = JSON.stringify(m_TagInfoObject);
            $.ajax({
                type: "POST",
                url: "Analyse_ProductionHorizontalComparison.aspx/GetHorizontalComparisonDataValue",
                data: "{myStartTime:'" + m_StartTime + "',myEndTime:'" + m_EndTime + "',myTagInfoJson:'" + m_TagInfoJson + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var m_MsgData = jQuery.parseJSON(msg.d);
                    SetSelectedObjValue(m_MsgData);

                    var m_WindowContainerId = 'Windows_Container';

                    var m_ChartType = "Bar";
                    var m_ShowType = "SingleScreen";

                    var m_Maximizable = false;
                    var m_Maximized = false;
                    //判断单屏显示模式
                    if (m_ShowType == 'SingleScreen') {
                        m_Maximizable = false;
                        m_Maximized = true;
                    }
                    else {
                        m_Maximizable = true;
                        m_Maximized = false;
                    }

                    var m_WindowsIdArray = GetWindowsIdArray();
                    ///////////////////////如果改变显示方式，则清除所有窗口///////////////////////////////
                    if (LastScreenShowType != m_ShowType) {
                        if (LastScreenShowType != "") {
                            for (var i = 0; i < m_WindowsIdArray.length; i++) {
                                if (m_WindowsIdArray[i] != "") {
                                    ReleaseAllGridChartObj(m_WindowsIdArray[i]);
                                }
                            }
                            CloseAllWindows();
                        }
                        LastScreenShowType = m_ShowType;
                    }
                    else {
                        if (m_ShowType == 'SingleScreen') {
                            for (var i = 0; i < m_WindowsIdArray.length; i++) {
                                if (m_WindowsIdArray[i] != "") {
                                    ReleaseAllGridChartObj(m_WindowsIdArray[i]);
                                }
                            }
                            CloseAllWindows();
                        }
                    }

                    //////////////////////////////计算当前windows数量/////////////////////////
                    var m_WindowsCount = 0;
                    var m_EmptyIndex = -1;              //找到第一个空位置放置
                    m_WindowsIdArray = GetWindowsIdArray();
                    for (var i = 0; i < m_WindowsIdArray.length; i++) {
                        if (m_WindowsIdArray[i] != "") {
                            m_WindowsCount = m_WindowsCount + 1;
                        }
                        else {
                            if (m_EmptyIndex == -1) {
                                m_EmptyIndex = i;
                            }
                        }
                    }
                    /////////////////////判断超数量的图表///////////////////////
                    if (m_ShowType == 'SingleScreen' && m_WindowsCount > 0) {
                        alert("请先关闭图表!");
                    }
                    else if (m_ShowType == 'MultiScreen' && m_WindowsCount >= 4) {
                        alert("请先关闭图表!");
                    }
                    else {
                        var m_Postion = GetWindowPostion(m_EmptyIndex, m_WindowContainerId);
                        WindowsDialogOpen(m_MsgData, m_WindowContainerId, false, m_ChartType, m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, m_Maximizable, m_Maximized);
                        //WindowsDialogOpen(m_MsgData, "Windows_Container", true, "Bar", 100, 100, 0, 0, false, true, false);
                    }
                    /*
                    var m_Postion = GetWindowPostion(0, m_WindowContainerId);
                    WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Line", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
                    m_Postion = GetWindowPostion(1, m_WindowContainerId);
                    WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Bar", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
                    m_Postion = GetWindowPostion(2, m_WindowContainerId);
                    WindowsDialogOpen(MsgData, m_WindowContainerId, true, "MultiBar", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
                    m_Postion = GetWindowPostion(3, m_WindowContainerId);
                    WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Pie", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
                    */
                    //var m_Size = GetPanelSize($('#ChartShow'));
                    //var m_Postion = GetWindowPostion(0, m_WindowContainerId);
                    //WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Pie", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, false, true);
                    //CreateGridChart(MsgData, m_WindowContainerId, true, "MultiBar");              //生成图表
                }
            });
        }
    }
    ///////////////////////获取window初始位置////////////////////////////
    function GetWindowPostion(myWindowIndex, myWindowContainerId) {
        var m_ParentObj = $('#' + myWindowContainerId);
        var m_ParentWidth = m_ParentObj.width();
        var m_ParentHeight = m_ParentObj.height();
        var m_ZeroLeft = 0;
        var m_ZeroTop = 0;
        var m_Padding = 5;
        var m_Width = (m_ParentWidth - m_Padding) / 2;
        var m_Height = (m_ParentHeight - m_Padding) / 2;
        var m_Left = 0;
        var m_Top = 0;
        if (myWindowIndex == 0) {
            m_Left = m_ZeroLeft;
            m_Top = m_ZeroTop;
        }
        else if (myWindowIndex == 1) {
            m_Left = m_ZeroLeft + m_Width + m_Padding;
            m_Top = m_ZeroTop;
        }
        else if (myWindowIndex == 2) {
            m_Left = m_ZeroLeft;
            m_Top = m_ZeroTop + m_Height + m_Padding;
        }
        else if (myWindowIndex == 3) {
            m_Left = m_ZeroLeft + m_Width + m_Padding;
            m_Top = m_ZeroTop + m_Height + m_Padding;
        }

        return [m_Width, m_Height, m_Left, m_Top]
    }
    ///////////////////////////////////////////打开window窗口//////////////////////////////////////////
    function WindowsDialogOpen(myData, myContainerId, myIsShowGrid, myChartType, myWidth, myHeight, myLeft, myTop, myDraggable, myMaximizable, myMaximized) {
        ;
        var m_WindowId = OpenWindows(myContainerId, '数据分析', myWidth, myHeight, myLeft, myTop, myDraggable, myMaximizable, myMaximized); //弹出windows
        var m_WindowObj = $('#' + m_WindowId);
        if (myMaximized != true) {
            CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);               //生成图表
        }

        m_WindowObj.window({
            onBeforeClose: function () {
                ///////////////////////释放图形空间///////////////
                //var m_ContainerId = GetWindowIdByObj($(this));
                ReleaseGridChartObj(m_WindowId);
                CloseWindow($(this))
            },
            onMaximize: function () {
                TopWindow(m_WindowId);
                ChangeSize(m_WindowId);
                CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);

            },
            onRestore: function () {
                //TopWindow(m_WindowId);
                ChangeSize(m_WindowId);
                CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);
            }
        });
    }

