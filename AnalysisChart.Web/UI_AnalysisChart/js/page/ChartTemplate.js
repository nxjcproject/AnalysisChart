
$(function () {
    InitializeSelectedGrid();
    InitializeItemTabs();
    //LoadLinesData();
    //GetWindowPostion();
});
///////////////////////获得图表//////////////////////////
function LoadLinesData() {
    $.ajax({
        type: "POST",
        url: "Analyse_ProductionLine.aspx/GetChartDataJson",
        data: "",                                     //"{myAnalyseType:'" + myAnalyseType + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var MsgData = jQuery.parseJSON(msg.d);
            
            var m_WindowContainerId = 'Windows_Container';
            ///*
            var m_Postion = GetWindowPostion(0, m_WindowContainerId);
            WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Line", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
            m_Postion = GetWindowPostion(1, m_WindowContainerId);
            WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Bar", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
            m_Postion = GetWindowPostion(2, m_WindowContainerId);
            WindowsDialogOpen(MsgData, m_WindowContainerId, true, "MultiBar", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
            m_Postion = GetWindowPostion(3, m_WindowContainerId);
            WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Pie", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, true, false);
            //*/
            //var m_Size = GetPanelSize($('#ChartShow'));
            //var m_Postion = GetWindowPostion(0, m_WindowContainerId);
            //WindowsDialogOpen(MsgData, m_WindowContainerId, true, "Pie", m_Postion[0], m_Postion[1], m_Postion[2], m_Postion[3], false, false, true);
            //CreateGridChart(MsgData, m_WindowContainerId, true, "MultiBar");              //生成图表
        }
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
        frozenColumns: [[{
            width: '150',
            title: '数据名称',
            field: 'TagItemName',
            sortable: false
        }
			 ]],
        columns: [[{
            width: '110',
            title: '类型',
            field: 'TagItemClass'

        },{
            width: '40',
            title: '操作',
            field: 'Op',
            formatter: function (value, row, index) {
                var str = '<img class="iconImg" src = "lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除" onclick="RemoveRoleFun(\'' + row.id + '\');"/>';
                return str;
            }
        }]],
        toolbar: '#MainSelect_Toolbar'
    });
}
function InitializeItemTabs() {
    $('#dlg_TagItemsList').dialog({
        title: '数据项查询',
        width: 800,
        height: 600,
        closed: true,
        cache: false,
        modal: true,
        iconCls:'icon-search',
        resizable:false
    });
}
function AddTagItemsFun() {
    $('#dlg_TagItemsList').dialog('open');
    InitializeProduceLineGrid(null)
}
function InitializeProduceLineGrid(myData) {
    $('#Grid_ProductionLine').datagrid({
        title: '',
        data: myData,
        dataType: "json",
        striped: true,
        //loadMsg: '',   //设置本身的提示消息为空 则就不会提示了的。这个设置很关键的
        rownumbers: true,
        singleSelect: true,
        idField: 'ProductionLineId',
        frozenColumns: [[{
            width: '200',
            title: '产线名称',
            field: 'ProductionLineName',
            sortable: false
        }
			 ]],
        columns: [[{
            width: '200',
            title: '所属分厂',
            field: 'FactoryName'

        }, {
            width: '160',
            title: '备注',
            field: 'Remark'
        }]],
        toolbar: '#ToolBar_ProductionLine'
    });
    
}
