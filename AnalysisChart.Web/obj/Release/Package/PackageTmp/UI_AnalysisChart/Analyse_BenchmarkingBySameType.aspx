﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Analyse_BenchmarkingBySameType.aspx.cs" Inherits="AnalysisChart.Web.UI_AnalysisChart.Analyse_BenchmarkingBySameType" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>工序能耗KPI横向比较分析</title>
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/gray/easyui.css" />
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/icon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtIcon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtCss.css" />

    <link rel="stylesheet" type="text/css" href="/lib/pllib/themes/jquery.jqplot.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shCoreDefault.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shThemejqPlot.min.css" />
    <link type="text/css" rel="stylesheet" href="/css/common/charts.css" />
    <link type="text/css" rel="stylesheet" href="/css/common/NormalPage.css" />


    <script type="text/javascript" src="/lib/ealib/jquery.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/jquery.easyui.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/easyui-lang-zh_CN.js" charset="utf-8"></script>
    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->
    <!--[if gt IE 8]><script type="text/javascript" src="/lib/ealib/extend/easyUI.WindowsOverrange.js" charset="utf-8"></script>-->
    <!--[if !IE]><!-->
    <script type="text/javascript" src="/lib/ealib/extend/easyUI.WindowsOverrange.js" charset="utf-8"></script>
    <!--<![endif]-->

     <!--[if lt IE 9]><script type="text/javascript" src="/lib/pllib/excanvas.js"></script><![endif]-->
    <script type="text/javascript" src="/lib/pllib/jquery.jqplot.min.js"></script>
    <!--<script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shCore.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shBrushJScript.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shBrushXml.min.js"></script>-->

    <!-- Additional plugins go here -->
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.barRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pieRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasTextRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasAxisTickRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.categoryAxisRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.cursor.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.dateAxisRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pointLabels.min.js"></script>

    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->



    <script type="text/javascript" src="/js/common/components/Charts.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/DataGrid.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/WindowsDialog.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/GridChart.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/format/DateTimeFormat.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/PrintFile.js" charset="utf-8"></script> 
    <script type="text/javascript" src="js/page/Analyse_BenchmarkingBySameType.js" charset="utf-8"></script>



</head>
<body>
    <div class="easyui-layout" data-options="fit:true,border:false">
        <div class="easyui-panel" data-options="region:'west',border:true" style="width: 260px;">
            <table id="tool_SelectedObj" style="display: none; width: 260px;">
                <tr>
                    <td style="width: 60px; height: 30px;">起止时间</td>
                    <td style="text-align: left; width: 190px;" colspan="2">
                        <input id="StartTimeF" class="easyui-datetimespinner" style="width: 80px" />
                        <span id="InnerlLine">--</span>
                        <input id="EndTimeF" class="easyui-datetimespinner" style="width: 80px" />
                    </td>
                </tr>
                <tr>
                    <td style="width: 60px; height: 30px;">指标类别</td>
                    <td style="text-align: left; width: 190px;" colspan="2">
                        <select id="Combobox_ValueTypeF" class="easyui-combobox" name="ValueType" data-options="panelHeight:'auto', onSelect:function(myRecord){StaticsMethod(myRecord);}" style="width: 176px;">
                            <option value="ElectricityConsumption_Entity">工序电耗</option>
                            <option value="ElectricityConsumption_Comprehensive">综合电耗</option>
                            <option value="CoalConsumption_Comprehensive">综合煤耗</option>
                            <option value="EnergyConsumption_Comprehensive">综合能耗</option>
                            <option value="ElectricityConsumption_Comparable">可比综合电耗</option>
                            <option value="CoalConsumption_Comparable">可比综合煤耗</option>
                            <option value="EnergyConsumption_Comparable">可比综合能耗</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="width: 60px; height: 30px;">类型</td>
                    <td style="text-align: left; width: 120px;">
                        <select id="Combobox_ObjectTypeF" class="easyui-combobox" name="ObjectType" data-options="panelHeight:'auto', disabled:true, onSelect:function(){RemoveDataTagFun();}" style="width: 110px;">
                            <option value="熟料" selected="selected">熟料</option>
                            <option value="水泥磨">水泥</option>
                        </select>
                    </td>
                    <td style="width: 70px;">
                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'ext-icon-chart_curve'"
                            onclick="LoadChartFun();">分析</a>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left; width: 190px;" colspan="2">
                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="AddTagItemsFun();">添加</a>
                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="RemoveDataTagFun();">清空列表</a>

                    </td>
                    <td>
                        <div class="datagrid-btn-separator"></div>
                        <a href="#" class="easyui-linkbutton" data-options="iconCls:'ext-icon-page_white_excel',plain:true" onclick="ExportFileFun();">导出</a>
                    </td>
                </tr>
            </table>
            <table id="grid_SelectedObj" title="已选择数据项" data-options="fit:true,border:false"></table>
        </div>
        <div class="easyui-panel" data-options="region:'center',border:false" style="padding: 5px;">
            <div class="easyui-layout" data-options="fit:true,border:false">
                <div id="Windows_Container" class="easyui-panel" data-options="region:'center', border:false, collapsible:false, split:false">
                </div>
            </div>
        </div>
    </div>
    <!--弹出产线信息-->
    <div id="dlg_TagItemsList" class="easyui-dialog">
        <div class="easyui-layout" data-options="fit:true,border:false">
            <div data-options="region:'center',border:true" style="padding-top: 10px; overflow: auto;">
                <ul id="grid_StaticsItems"></ul>
            </div>
            <div data-options="region:'east',border:false" style="padding-top: 10px; padding-left: 10px; width: 450px;">
                <table id="grid_StandardItems"></table>
            </div>
        </div>
    </div>
    <form id="form_Main" runat="server">
        <div>
        </div>
    </form>
</body>
</html>
