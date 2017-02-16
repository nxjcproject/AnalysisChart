/////////////////////////////
var LastScreenShowType = "";
var FirstLoadProductionLineCombobox = "first";   //是否是第一次加载产线树
var FirstLoadIndexTab = "first";                 //是否是第一次加载Tab
////////////////////////////
//////////////////设置常量/////////////////
var AllCategroy = "AllCategroy";
var TimeOfLastCycName = "同期";
///////////////////////////////////////////
//////////////////设置标准库,当选择不同的统计项，则对应不同的标准///////////////
var CurrentStandardLib;
var SelectDatetime;   //点击分析后记录时间
$(function () {
    InitializeSelectedGrid();           //初始化选择列表
    InitializeData();                   //初始化时间等数据
    InitializeItemTabs();
    loadCustomDefineDialog();
    //InitializeIndexGridStruct(false);
    //LoadLinesData();
    //GetWindowPostion();
});
function InitializeData() {
    var m_DateTime = new Date();
    var m_NowStr = m_DateTime.format("yyyy-MM-dd");
    $('#StartTime').datebox('setValue', m_NowStr);
    $('#EndTime').datebox('setValue', m_NowStr);
}
//////////////////////////////////初始化基础数据//////////////////////////////////////////
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
            width: '160',
            title: '数据名称',
            field: 'TagItemName'
        }, {
            width: '60',
            title: '标签名称',
            field: 'TagId',
            hidden: true
        }, {
            width: '60',
            title: '标签计算类型',
            field: 'TagStaticsType',
            hidden: true
        }, {
            width: '60',
            title: '所属表',
            field: 'TagTable',
            hidden: true
        }, {
            width: '60',
            title: '所属数据库',
            field: 'TagDataBase',
            hidden: true
        }, {
            width: '80',
            title: '辅助信息',
            field: 'TagDescription'
        }, {
            width: '60',
            title: '标签分类',
            field: 'TagTabClass',
            hidden: true
        }, {
            width: '40',
            title: '同期',
            field: 'SameTimeOfLastCyc'
        }, {
            width: '80',
            title: '其它信息',
            field: 'OtherInfo',
            hidden: true
        }]],
        onDblClickRow: function (rowIndex, rowData) {
            $(this).datagrid('deleteRow', rowIndex);
        },
        toolbar: '#MainSelect_Toolbar'
    });
}
//初始化弹出对话框Tab项
function InitializeItemTabs() {
    $('#dlg_TagItemsList').dialog({
        title: '数据项查询',
        width: 900,
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

//根据Tab标题获得TabId
function GetTabIdByTitle(myTitle) {
    if (myTitle == '统计数据') {
        return 'StaticsItems';
    }
    else if (myTitle == 'DCS数据') {
        return 'DcsData';
    }
    else if (myTitle == '用户自定义') {
        return 'CustomDefine';
    }
    else {
        return "";
    }
}
function AddTagItemsFun() {
    var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
    var m_SelectedTab = $('#TagItemsTabs').tabs('getSelected');
    var m_SelectedTabTitle = m_SelectedTab.panel('options').title;
    if (FirstLoadIndexTab == 'first') {
        LoadComparableIndexData(m_ValueType, AllCategroy, 'first', 4);
        FirstLoadIndexTab = 'last';
    }
    else {
        LoadComparableIndexData(m_ValueType, AllCategroy, 'last', 4);
    }
    $('#dlg_TagItemsList').dialog('open');
}
/////////////////////////////获得卡片中的数据,并填充数据///////////////////////////
function LoadComparableIndexData(myValueType, myCategory, myLoadType, mySuccessFlag) {                                      //装载可比数据
    $.messager.progress({
        title: 'Please waiting',
        msg: 'Loading data...'
    });
    var m_SuccessFlag = mySuccessFlag;
    if (myCategory == 'StaticsItems' || myCategory == AllCategroy) {
        var m_OrganizationLineType = $('#Select_ProductionLineTypeF').combobox('getValue');
        var m_HiddenMainMachine = $("input[id='checkBox_HiddenMainMachine']:checked").val(); //是否隐藏主要设备
        $.ajax({
            type: "POST",
            url: "Analyse_ComprehensiveBenchmarking.aspx/GetStaticsItems",
            data: "{myOrganizationType:'" + m_OrganizationLineType + "',myValueType:'" + myValueType + "',myHiddenMainMachine:'" + m_HiddenMainMachine + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_DataGridId = "grid_StaticsItems";
                var m_MsgData = jQuery.parseJSON(msg.d);
                if (myLoadType == "first") {
                    InitializeStaticsItems(m_DataGridId, m_MsgData);
                }
                else {
                    $('#' + m_DataGridId).tree('loadData', m_MsgData);
                    //$('#' + m_DataGridId).tree('loadData', { "rows": [], "total": 0 });
                }
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }
            },
            error: function (msg) {
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }        
            }
        });
    }
    if (myCategory == 'StandardItems' || myCategory == AllCategroy) {
        var m_ValueType = myValueType.split('_');

        $.ajax({
            type: "POST",
            url: "Analyse_ComprehensiveBenchmarking.aspx/GetStandardItems",
            data: "{myStatisticalMethod:'" + m_ValueType[1] + "',myValueType:'" + m_ValueType[0] + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_DataGridId = "grid_StandardItems";
                var m_MsgData = jQuery.parseJSON(msg.d);
                CurrentStandardLib = m_MsgData["rows"];
                if (myLoadType == "first") {
                    InitializeStandardGrid(m_DataGridId, { "rows": [], "total": 0 });
                    var m_OrganizationType = $('#Select_ProductionLineTypeF').combobox('getValue');        //判断产线类型
                    if (m_OrganizationType == "熟料") {
                        SetStandardByVariableId("clinker");
                    }
                    else if (m_OrganizationType == "水泥磨") {
                        SetStandardByVariableId("cementmill");
                    }
                }
                else {
                    var m_OrganizationType = $('#Select_ProductionLineTypeF').combobox('getValue');        //判断产线类型
                    if (m_OrganizationType == "熟料") {
                        SetStandardByVariableId("clinker");
                    }
                    else if (m_OrganizationType == "水泥磨") {
                        SetStandardByVariableId("cementmill");
                    }
                    //$('#' + m_DataGridId).tree('loadData', { "rows": [], "total": 0 });
                }
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }
            },
            error: function (msg) {
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }
            }
        });
    }
    if (myCategory == 'DcsData' || myCategory == AllCategroy) {
        var m_DataGridId = "DcsData";
        m_SuccessFlag = m_SuccessFlag - 1;
        if (m_SuccessFlag == 0) {
            $.messager.progress('close');
        }
    }
    if (myCategory == 'CustomDefine' || myCategory == AllCategroy) {

        $.ajax({
            type: "POST",
            url: "Analyse_ComprehensiveBenchmarking.aspx/GetCustomDefineTagsGroup",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var m_DataGridId = "CustomDefine";
                var m_MsgData = jQuery.parseJSON(msg.d);
                if (myLoadType == "first") {
                    InitializeCustomDefinedGrid(m_DataGridId, m_MsgData);
                }
                else {
                    $('#' + m_DataGridId).datagrid('loadData', m_MsgData);
                }
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }
            },
            error: function (msg) {
                m_SuccessFlag = m_SuccessFlag - 1;
                if (m_SuccessFlag == 0) {
                    $.messager.progress('close');
                }
            }
        });
    }
}
///////////////////////////////刷新统计项信息列表///////////////////////////////
function RefreshStaticsItems() {
    var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
    LoadComparableIndexData(m_ValueType, 'StaticsItems', 'last', 1);

    var m_OrganizationType = $('#Select_ProductionLineTypeF').combobox('getValue');        //判断产线类型
    if (m_OrganizationType == "熟料") {
        SetStandardByVariableId("clinker");
    }
    else if (m_OrganizationType == "水泥磨") {
        SetStandardByVariableId("cementmill");
    }
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
            //var m_SelectedTab = $('#TagItemsTabs').tabs('getSelected');
            //var m_SelectedTabTitle = m_SelectedTab.panel('options').title;   //获得标签所属的类别Tab的Title
            //var m_SelectedTabId = GetTabIdByTitle(m_SelectedTabTitle);
            var m_SameTimeOfLastCyc = $("input[id='Checkbox_LastYearSameTime']:checked").val(); //是否同期
            var m_ValueTypeTemp = $('#Combobox_ValueTypeF').combobox('getText');
            var m_NewRow = {
                'TagItemId': rowData.StandardItemId, 'TagItemName': rowData.StandardName + ">>" + rowData.Name.replace(m_ValueTypeTemp, ''),
                'TagId': rowData.StandardItemId, 'TagStaticsType': "1",
                'TagTable': "", 'TagDataBase': "", 'TagDescription': rowData.StandardName,
                'TagTabClass': "ComparableStandard", 'SameTimeOfLastCyc': m_SameTimeOfLastCyc, 'OtherInfo': rowData.StandardValue
            };
            var m_AddFlag = AddChartTags(m_NewRow);
            if (m_AddFlag == true) {
                alert("标签添加成功!");
            }
        }
    });
}
//////////////////DCS标签获得标签双击事件///////////////////
function GetTagInfo(myRowData, myDcsDataBaseName, myDcsOrganizationId) {
    var m_SameTimeOfLastCyc = $("input[id='Checkbox_LastYearSameTime']:checked").val(); //是否同期
    if (m_SameTimeOfLastCyc == TimeOfLastCycName) {
        var m_NewRow = {
            'TagItemId': myRowData.VariableName, 'TagItemName': myRowData.VariableDescription,
            'TagId': myRowData.FieldName, 'TagStaticsType': "2",
            'TagTable': myRowData.TableName, 'TagDataBase': myDcsDataBaseName,
            'TagDescription': "DCS标签", 'TagTabClass': "DcsData", 'SameTimeOfLastCyc': "", 'OtherInfo': ""
        };
        AddChartTags(m_NewRow);
    }

    var m_NewRow = {
        'TagItemId': myRowData.VariableName, 'TagItemName': myRowData.VariableDescription,
        'TagId': myRowData.FieldName, 'TagStaticsType': "2",
        'TagTable': myRowData.TableName, 'TagDataBase': myDcsDataBaseName,
        'TagDescription': "DCS标签", 'TagTabClass': "DcsData", 'SameTimeOfLastCyc': m_SameTimeOfLastCyc, 'OtherInfo': ""
    };
    var m_AddFlag = AddChartTags(m_NewRow);
    if (m_AddFlag == true) {
        alert("标签添加成功!");
    }
}
/////////////////////获得统计数据项//////////////////////
function InitializeStaticsItems(myGridId, myData) {
    $('#' + myGridId).tree({
        data: myData,
        animate: true,
        lines: true,
        toolbar: '#toolBar_' + myGridId,
        onDblClick: function (rowData) {
            //onOrganisationTreeClick(node);
            var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
            var m_OrganizationType = $('#Select_ProductionLineTypeF').combobox('getValue');
            var m_SameTimeOfLastCyc = $("input[id='Checkbox_LastYearSameTime']:checked").val(); //是否同期
            var m_TagName = rowData.text;
            var m_TreeData = $('#' + myGridId).tree('getParent', rowData.target);
            while (m_TreeData != null && m_TreeData != undefined && m_TreeData != NaN) {
                if (m_TreeData.Type == '分公司' || m_TreeData.Type == '熟料' || m_TreeData.Type == '水泥磨' || m_TreeData.Type == 'MainMachine') {
                    m_TagName = m_TreeData.text + '>>' + m_TagName;
                }
                m_TreeData = $('#' + myGridId).tree('getParent', m_TreeData.target);
            }
            if (m_SameTimeOfLastCyc == TimeOfLastCycName) {
                var m_NewRow = {
                    'TagItemId': rowData.OrganizationId, 'TagItemName': m_TagName,
                    'TagId': rowData.TagColumnName, 'TagStaticsType': m_ValueType,
                    'TagTable': rowData.TagTableName, 'TagDataBase': rowData.TagDataBase, 'TagDescription': "统计数据",
                    'TagTabClass': "ComprehensiveStatics", 'SameTimeOfLastCyc': "", 'OtherInfo': m_OrganizationType
                };
                AddChartTags(m_NewRow);
            }
            var m_NewRow = {
                'TagItemId': rowData.OrganizationId, 'TagItemName': m_TagName,
                'TagId': rowData.TagColumnName, 'TagStaticsType': m_ValueType,
                'TagTable': rowData.TagTableName, 'TagDataBase': rowData.TagDataBase, 'TagDescription': "统计数据",
                'TagTabClass': "ComprehensiveStatics", 'SameTimeOfLastCyc': m_SameTimeOfLastCyc, 'OtherInfo': m_OrganizationType
            };
            var m_AddFlag = AddChartTags(m_NewRow);
            if (m_AddFlag == true) {
                alert("标签添加成功!");
            }
        },
        onClick: function (rowData) {
            //SetStandardByVariableId(rowData.TagColumnName, rowData.OrganizationId);   //单击统计项可自动对应标准
        }
    });
}
function SetStandardByVariableId(myVariableId) {
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
////////////////////////////获得用户自定义标签组的DataGrid////////////////////////////
function InitializeCustomDefinedGrid(myGridId, myData) {
    $('#' + myGridId).datagrid({
        title: '',
        data: myData,
        dataType: "json",
        striped: true,
        //loadMsg: '',   //设置本身的提示消息为空 则就不会提示了的。这个设置很关键的
        rownumbers: true,
        singleSelect: true,
        idField: 'TagGroupId',
        columns: [[{
            width: '200',
            title: '自定义组ID',
            field: 'TagGroupId',
            hidden: true
        }, {
            width: '200',
            title: '自定义组名',
            field: 'TagGroupName'
        }, {
            width: '120',
            title: '创建时间',
            field: 'CreateTime'
        }, {
            width: '150',
            title: '备注',
            field: 'Remarks'
        }, {
            width: '50',
            title: '操作',
            field: 'Op',
            formatter: function (value, row, index) {
                var str = '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除" onclick="RemoveDataTagGroupById(\'' + row.TagGroupId + '\');"/>';
                return str;
            }
        }]],
        toolbar: '#toolBar_CustomDefine',
        onDblClickRow: function (rowIndex, rowData) {
            //var m_MsgData = jQuery.parseJSON(rowData.TagGroupJson);
            //if (m_MsgData) {
            //    $('#grid_SelectedObj').datagrid('loadData', m_MsgData);
            //}
            SetSelectGridDataGroup(rowData.TagGroupId);
            alert("标签添加成功!");
        }
    });
}

function SetSelectGridDataGroup(myTagGroupId) {
    $.ajax({
        type: "POST",
        url: "Analyse_ComprehensiveBenchmarking.aspx/GetTagGroupJsonById",
        data: "{myTagGroupId:'" + myTagGroupId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var m_MsgData = jQuery.parseJSON(msg.d);
            if (m_MsgData) {
                $('#grid_SelectedObj').datagrid('loadData', m_MsgData);
            }
        }
    });
}
//////////////////////////////添加到显示列表///////////////////////////////
function AddChartTags(myRow) {
    var m_Rows = $('#grid_SelectedObj').datagrid('getRows');
    var m_TagsCount = m_Rows.length;

    if (m_TagsCount < 8) {
        $('#grid_SelectedObj').datagrid('appendRow', myRow);
        return true;
    }
    else {
        alert("最多允许添加8个标签!");
        return false;
    }
}
function RemoveDataTagFun() {
    $('#grid_SelectedObj').datagrid('loadData', { 'rows': [], 'total': 0 });
}
function SaveDataTagClick() {
    $('#TextBox_CustomGroupName').attr('value', "");
    $('#TextBox_Remark').attr('value', "");
    $('#dlg_CustomDefineCustomGroupName').dialog('open');
}
function SaveDataTagsGroupFun() {
    var m_TagInfoObject = $('#grid_SelectedObj').datagrid('getData');
    var m_TagsGroupName = $('#TextBox_CustomGroupName').val();
    var m_Remark = $('#TextBox_Remark').val();
    var m_Valid_TagsGroupName = $('#TextBox_CustomGroupName').validatebox('isValid');
    if (m_Valid_TagsGroupName == false) {
        alert("请输入用户自定义趋势组名称!");
    }
    else if (m_TagInfoObject['rows'].length > 0) {
        var m_TagInfoJson = JSON.stringify(m_TagInfoObject);

        $.ajax({
            type: "POST",
            url: "Analyse_ComprehensiveBenchmarking.aspx/SaveCustomDefineTags",
            data: "{myTagsGroupName:'" + m_TagsGroupName + "',myRemark:'" + m_Remark + "',myTagInfoJson:'" + m_TagInfoJson + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d == "1") {
                    $('#dlg_CustomDefineCustomGroupName').dialog('close');
                    alert("用户自定义趋势保存成功!");
                }
                else {
                    alert("用户自定义趋势保存失败!");
                }
            }
        });
    }
    else {
        alert("您还没有选择标签!");
    }
}
function RemoveAllDataTagGroupFun() {
    parent.$.messager.confirm('询问', '您确定要删除所有自定义组?', function (r) {
        if (r) {
            $.ajax({
                type: "POST",
                url: "Analyse_ComprehensiveBenchmarking.aspx/DeleteAllCustomDefineTagsByUserId",
                data: "",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d == "1") {
                        alert("删除成功!");
                        var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
                        LoadComparableIndexData(m_ValueType, "CustomDefine", "last", 1);
                    }
                    else if (msg.d == "0") {
                        alert("没有可以删除的项!");
                    }
                    else {
                        alert("删除失败!");
                    }
                }
            });
        }
    });
}
function RemoveDataTagGroupById(myId) {
    parent.$.messager.confirm('询问', '您确定要删除该自定义组?', function (r) {
        if (r) {
            $.ajax({
                type: "POST",
                url: "Analyse_ComprehensiveBenchmarking.aspx/DeleteCustomDefineTagsByTagsGroupId",
                data: "{myTagGroupId:'" + myId + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d == "1") {
                        alert("删除成功!");
                        var m_ValueType = $('#Combobox_ValueTypeF').combobox('getValue');
                        LoadComparableIndexData(m_ValueType, "CustomDefine", "last", 1);
                    }
                    else if (msg.d == "0") {
                        alert("没有可以删除的项!");
                    }
                    else {
                        alert("删除失败!");
                    }
                }
            });
        }
    });
}

function ExportFileFun() {
    var m_FunctionName = "ExcelStream";
    var m_Parameter1 = GetDataGridTableHtmlSplitColumn("Windows0_Grid", "综合对标数据", SelectDatetime, ">>", "RowName");
    var m_Parameter2 = "综合对标数据";

    var m_ReplaceAlllt = new RegExp("<", "g");
    var m_ReplaceAllgt = new RegExp(">", "g");
    m_Parameter1 = m_Parameter1.replace(m_ReplaceAlllt, "&lt;");
    m_Parameter1 = m_Parameter1.replace(m_ReplaceAllgt, "&gt;");

    var form = $("<form id = 'ExportFile'>");   //定义一个form表单
    form.attr('style', 'display:none');   //在form表单中添加查询参数
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', "Analyse_ComprehensiveBenchmarking.aspx");

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

///////////////////////获得图表//////////////////////////
//点击分析按钮
function LoadLinesDataFun() {
    var m_AnalyseCyc = $("input[name='SelectRadio_Cyc']:checked").val();
    var m_StartTime = $('#StartTime').datebox('getValue');
    var m_EndTime = $('#EndTime').datebox('getValue');
    var m_TagInfoObject = $('#grid_SelectedObj').datagrid('getData');
    var m_ChartType = $("input[name='SelectRadio_ChartType']:checked").val();
    var m_ShowType = $("input[name='SelectRadio_ShowType']:checked").val();
    if (m_StartTime == "") {
        alert("您还没有选择查询开始时间!");
    }
    else if (m_AnalyseCyc == 'CustomDefine' && m_EndTime == "") {
        alert("您还没有选择查询结束时间!");
    }
    else if (m_AnalyseCyc == "CustomDefine" && m_StartTime.substring(1, 4) != m_EndTime.substring(1, 4)) {
        alert("必须选定同一年!");
    }
    else {
        SelectDatetime = "开始时间:" + m_StartTime + "--结束时间:" + m_EndTime;
        if (m_AnalyseCyc == "year") {
            SelectDatetime = SelectDatetime + "(年统计" + $('#Combobox_ValueTypeF').combobox("getText") + ")";
        }
        else if (m_AnalyseCyc == "CustomDefine") {
            SelectDatetime = SelectDatetime + "(月统计" + $('#Combobox_ValueTypeF').combobox("getText") + ")"
        }
        if (m_TagInfoObject['rows'].length > 0) {
            var m_TagInfoJson = JSON.stringify(m_TagInfoObject);

            $.ajax({
                type: "POST",
                url: "Analyse_ComprehensiveBenchmarking.aspx/GetChartDataJson",
                data: "{myAnalyseCyc:'" + m_AnalyseCyc + "',myStartTime:'" + m_StartTime + "',myEndTime:'" + m_EndTime + "',myChartType:'" + m_ChartType + "',myTagInfoJson:'" + m_TagInfoJson + "'}",
                //url: "Analyse_ProductionProcess.aspx/GetChartDataJson1",
                //data:"",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var m_MsgData = jQuery.parseJSON(msg.d);
                    var m_WindowContainerId = 'Windows_Container';


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
                        m_MsgData["title"] = $('#Combobox_ValueTypeF').combobox('getText');
                        m_Postion = GetWindowPostion(m_EmptyIndex, m_WindowContainerId);
                        WindowsDialogOpen(m_MsgData, m_WindowContainerId, true, m_ChartType, m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, m_Maximizable, m_Maximized);
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
        else {
            alert("您还没有选择标签!");
        }
    }
}

function loadCustomDefineDialog() {
    $('#dlg_CustomDefineCustomGroupName').dialog({
        title: '用户自定义组信息',
        width: 400,
        height: 230,
        closed: true,
        cache: false,
        modal: true,
        buttons: '#buttons_CustomDefineCustomGroupName'
    });
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
    CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);               //生成图表
    if (myMaximized != true) {
        ChangeSize(m_WindowId);
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
            //CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);

        },
        onRestore: function () {
            //TopWindow(m_WindowId);
            ChangeSize(m_WindowId);
            //CreateGridChart(myData, m_WindowId, myIsShowGrid, myChartType);
        }
    });
}


