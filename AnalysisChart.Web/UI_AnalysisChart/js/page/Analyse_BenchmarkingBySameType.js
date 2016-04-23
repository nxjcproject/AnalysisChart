var ChartLoadType = 'first';
var LastScreenShowType = "";
var StandardItemsLoadType = 'first';
var ComparableIndexDataLoadType = 'first';
//////////////////设置标准库,当选择不同的统计项，则对应不同的标准///////////////
var CurrentStandardLib;
var SelectDatetime;   //点击查询后的数据
$(function () {
    InitializeDateTime();           //初始化日期
    loadTagItemsListDialog();
    InitializeSelectedGrid({ "rows": [], "total": 0 });    //初始化选择列表
    BindingTrigger();             //添加自定义事件绑定

});
function BindingTrigger() {
    ////////////当标准数据加载完后
    $('#grid_StandardItems').bind("StandardItemsLoadComplate", function () {
        LoadComparableIndexData();
    });
}
function InitializeDateTime() {
    //StartTime; EndTime

    var lastMonthDate = new Date();  //上月日期  
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    $('#StartTimeF').datetimespinner({
        formatter:formatter2,
        parser:parser2,
        selections:[[0,4],[5,7],[8,9]], 
        required:true
    });
    $('#EndTimeF').datetimespinner({
        formatter:formatter2,
        parser:parser2,
        selections:[[0,4],[5,7],[8,9]], 
        required:true
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
function formatter2(date){
    if (!date){return '';}
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return y + '-' + (m<10?('0'+m):m);
}
function parser2(s){
    if (!s){return null;}
    var ss = s.split('-');
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    if (!isNaN(y) && !isNaN(m)){
        return new Date(y,m-1,1);
    } else {
        return new Date();
    }
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
    //var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
    //var m_SelectedTab = $('#TagItemsTabs').tabs('getSelected');
    //var m_SelectedTabTitle = m_SelectedTab.panel('options').title;
    //if (FirstLoadIndexTab == 'first') {
    //    LoadComparableIndexData(m_ValueType, AllCategroy, 'first');
    //    FirstLoadIndexTab = 'last';
    //}
    //else {
    //    LoadComparableIndexData(m_ValueType, AllCategroy, 'last');
    //}
    LoadStandardItems();
    $('#dlg_TagItemsList').dialog('open');
}
function StaticsMethod(myRecord) {
    if (myRecord.value != null && myRecord.value != undefined) {
        if (myRecord.value == "ElectricityConsumption_Entity") {
            $('#Combobox_ObjectTypeF').combobox('disable');
        }
        else {
            $('#Combobox_ObjectTypeF').combobox('enable');
        }
    }   
    RemoveDataTagFun();
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
function LoadComparableIndexData() {                                      //装载可比数据
    var m_Model = "";
    if ($('#Combobox_ObjectTypeF').combobox('options').disabled == true) {
        m_Model = "ClinkerAndCementmill";
    }
    var m_OrganizationLineType = $('#Combobox_ObjectTypeF').combobox('getValue');

    $.ajax({
        type: "POST",
        url: "Analyse_BenchmarkingBySameType.aspx/GetStaticsItems",
        data: "{myOrganizationType:'" + m_OrganizationLineType + "',myModel:'" + m_Model + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_DataGridId = "grid_StaticsItems";
            var m_MsgData = jQuery.parseJSON(msg.d);
            if (ComparableIndexDataLoadType == "first") {
                InitializeStaticsItems(m_DataGridId, m_MsgData);
                ComparableIndexDataLoadType = 'last';
            }
            else {
                $('#' + m_DataGridId).tree('loadData', m_MsgData);
                //$('#' + m_DataGridId).tree('loadData', { "rows": [], "total": 0 });
            }
        }
    });
}
function LoadStandardItems() {
    var m_ValueTypeCombobox = $('#Combobox_ValueTypeF').combobox('getValue').split('_');
    
    var m_StatisticalMethod = m_ValueTypeCombobox[1];
    var m_ValueType = m_ValueTypeCombobox[0];
    $.ajax({
        type: "POST",
        url: "Analyse_BenchmarkingBySameType.aspx/GetStandardItems",
        data: "{myStatisticalMethod:'" + m_StatisticalMethod + "',myValueType:'" + m_ValueType + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_DataGridId = "grid_StandardItems";
            var m_MsgData = jQuery.parseJSON(msg.d);
            CurrentStandardLib = m_MsgData["rows"];
            if (StandardItemsLoadType == "first") {
                InitializeStandardGrid(m_DataGridId, { "rows": [], "total": 0 });
                StandardItemsLoadType = 'last'
            }
            else {
                $('#' + m_DataGridId).datagrid('loadData', { "rows": [], "total": 0 });
            }
            $('#' + m_DataGridId).trigger("StandardItemsLoadComplate");                   //添加一个自定义事件，表示标准已经加载完毕
        }
    });
}
function InitializeStaticsItems(myGridId, myData) {
    $('#' + myGridId).tree({
        data: myData,
        animate: true,
        lines: true,
        toolbar: '#toolBar_' + myGridId,
        onDblClick: function (rowData) {
            if (rowData.id.length > 5) {
                //onOrganisationTreeClick(node);
                var m_VariableId = rowData.VariableId;
                var m_ValueTypeName = m_VariableId + $('#Combobox_ValueTypeF').combobox('getText');

                var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
                var m_TagItemId = m_VariableId + "_" + m_ValueType;

                var m_ValueTypeCombobox = $('#Combobox_ValueTypeF').combobox('getValue').split('_');
                var m_StatisticalMethod = m_ValueTypeCombobox[1];

                var m_TagName = rowData.Name;
                var m_TreeData = $('#' + myGridId).tree('getParent', rowData.target);
                while (m_TreeData != null && m_TreeData != undefined && m_TreeData != NaN) {
                    if (m_TreeData.Type == '分公司' || m_TreeData.Type == '熟料' || m_TreeData.Type == '水泥磨' || m_TreeData.Type == 'MainMachine') {
                        m_TagName = m_TreeData.text + '>>' + m_TagName;
                    }
                    m_TreeData = $('#' + myGridId).tree('getParent', m_TreeData.target);
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
                alert("请选择到工序!");
            }
        },
        onClick: function (rowData) {
            SetStandardByVariableId(rowData.VariableId, rowData.OrganizationId);   //单击统计项可自动对应标准
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
    $('#' + myGridId).datagrid({
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
                'TagItemId': rowData.StandardItemId, 'Name': rowData.StandardName,
                'OrganizationId': "", 'LevelCode': "", 'StatisticType': rowData.StandardId,
                'StatisticName' : rowData.StandardName, 'VariableId': "", 'Value': rowData.StandardValue
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

function ExportFileFun() {
    var m_FunctionName = "ExcelStream";
    var m_Parameter1 = GetDataGridTableHtml("grid_SelectedObj", "横向对标数据", SelectDatetime);
    var m_Parameter2 = "横向对标数据";

    var m_ReplaceAlllt = new RegExp("<", "g");
    var m_ReplaceAllgt = new RegExp(">", "g");
    m_Parameter1 = m_Parameter1.replace(m_ReplaceAlllt, "&lt;");
    m_Parameter1 = m_Parameter1.replace(m_ReplaceAllgt, "&gt;");

    var form = $("<form id = 'ExportFile'>");   //定义一个form表单
    form.attr('style', 'display:none');   //在form表单中添加查询参数
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', "Analyse_BenchmarkingBySameType.aspx");

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
    SelectDatetime = "开始时间:" + m_StartTime + "--结束时间" + m_EndTime + "(" + $('#Combobox_ValueTypeF').combobox('getText') + ")";
    if (m_TagInfoObject['rows'].length > 0) {
        var m_TagInfoJson = JSON.stringify(m_TagInfoObject);
        $.ajax({
            type: "POST",
            url: "Analyse_BenchmarkingBySameType.aspx/GetBenchmarkingDataValue",
            data: "{myStartTime:'" + m_StartTime + "',myEndTime:'" + m_EndTime + "',myTagInfoJson:'" + m_TagInfoJson +  "'}",
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

