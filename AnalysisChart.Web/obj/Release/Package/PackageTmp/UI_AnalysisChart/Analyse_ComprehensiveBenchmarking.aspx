<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Analyse_ComprehensiveBenchmarking.aspx.cs" Inherits="AnalysisChart.Web.UI_AnalysisChart.ComprehensiveBenchmarking" %>
<%@ Register Src="~/UI_WebUserControls/TagsSelector/TagsSelector_Dcs.ascx" TagName="TagsSelector_Dcs" TagPrefix="uc1" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head_ComprehensiveBenchmarking" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>综合能耗KPI分析</title>
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/gray/easyui.css" />
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/icon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtIcon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtCss.css" />

    <link rel="stylesheet" type="text/css" href="/lib/pllib/themes/jquery.jqplot.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shCoreDefault.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shThemejqPlot.min.css" />
    <!--    <link type="text/css" rel="stylesheet" href="/css/common/charts.css" />-->
    <link type="text/css" rel="stylesheet" href="/css/common/NormalPage.css" />


    <script type="text/javascript" src="/lib/ealib/jquery.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/jquery.easyui.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/easyui-lang-zh_CN.js" charset="utf-8"></script>

    <!--[if gt IE 8]><script type="text/javascript" src="/lib/ealib/extend/easyUI.WindowsOverrange.js" charset="utf-8"></script>-->
    <!--[if !IE]><!-->
    <script type="text/javascript" src="/lib/ealib/extend/easyUI.WindowsOverrange.js" charset="utf-8"></script>
    <!--<![endif]-->

    <!--[if lt IE 9]><script type="text/javascript" src="/lib/pllib/excanvas.js"></script><![endif]-->
    <script type="text/javascript" src="/lib/pllib/jquery.jqplot.min.js"></script>

    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.trendline.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.barRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pieRenderer.min.js"></script>

    <!-- Additional plugins go here -->
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasAxisTickRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.categoryAxisRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasTextRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.dateAxisRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pointLabels.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.enhancedLegendRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasOverlay.min.js"></script> 
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.cursor.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.highlighter.min.js"></script>
    <!--[if lt IE 8 ]><script type="text/javascript" src="/lib/pllib/plugins/jqplot.json2.min"></script><![endif]-->


    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->

    <script type="text/javascript" src="/js/common/components/Charts.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/DataGrid.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/WindowsDialog.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/GridChart.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/format/DateTimeFormat.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/PrintFile.js" charset="utf-8"></script> 
    <script type="text/javascript" src="js/page/Analyse_ComprehensiveBenchmarking.js" charset="utf-8"></script>



</head>
<body>
    <div class="easyui-layout" data-options="fit:true,border:false">
        <div class="easyui-panel" data-options="region:'west',border:true" style="width: 340px;">
            <div id="MainSelect_Toolbar" style="display: none; text-align: center; padding-top: 10px;">
                <table style="width: 330px;">
                    <tr>
                        <td style="width: 65px; height: 30px;">统计周期</td>
                        <td style="text-align: left;" colspan="2">
                            <input type="radio" name="SelectRadio_Cyc" id="Radio_YearStatistics" value="year" checked ="checked" />年统计
                            <input type="radio" name="SelectRadio_Cyc" id="Radio_CustomDefineStatistics" value="CustomDefine" />自定义月统计
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 30px;">起止月份</td>
                        <td style="text-align: left;" colspan="2">
                            <input id="StartTime" class="easyui-datebox" data-options="validType:'md[\'2012-10\']', required:true" style="width: 100px" />
                            <span id="InnerlLine">---</span>
                            <input id="EndTime" class="easyui-datebox" data-options="validType:'md[\'2012-10-10\']', required:true" style="width: 100px" />
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 30px;">指标类别</td>
                        <td style="text-align: left;" colspan="2">
                            <select id="Combobox_ValueTypeF" class="easyui-combobox" name="ValueType" data-options="panelHeight:'auto'" style="width: 135px;">
                                <option value="ElectricityConsumption_Comprehensive">综合电耗</option>
                                <option value="CoalConsumption_Comprehensive">综合煤耗</option>
                                <option value="EnergyConsumption_Comprehensive">综合能耗</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 30px;">坐标方式</td>
                        <td style="text-align: left;" colspan="2">
                            <input type="radio" name="SelectRadio_ChartType" id="Radio_Line" value="Line" checked="checked" />折线图
                            <input type="radio" name="SelectRadio_ChartType" id="Radio_Bar" value="Bar" />柱状图
                            <input type="radio" name="SelectRadio_ChartType" id="Radio_MultiBar" value="MultiBar" />累计柱状图
                            <input type="radio" name="SelectRadio_ChartType" id="Radio_Pie" value="Pie" />饼图
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 30px;">显示方式</td>
                        <td style="text-align: left;">
                            <input type="radio" name="SelectRadio_ShowType" id="Radio_ShowInPage" value="SingleScreen" checked="checked" />单屏显示
                            <input type="radio" name="SelectRadio_ShowType" id="Radio_ShowWindows" value="MultiScreen" />分屏显示
                        </td>
                        <td style="width: 55px;">
                            <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'ext-icon-chart_curve'"
                                onclick="LoadLinesDataFun();">分析</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 5px; border-bottom: 1px solid #cccccc;"></td>
                        <td style="border-bottom: 1px solid #cccccc;"></td>
                        <td style="border-bottom: 1px solid #cccccc;"></td>
                    </tr>
                    <tr>
                        <td style="height: 5px;"></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan ="2" style="height: 30px; text-align: left;">
                            <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="AddTagItemsFun();">添加</a>
                            <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="RemoveDataTagFun();">清空列表</a>
                            <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-save',plain:true" onclick="SaveDataTagClick();">保存</a>
                        </td>
                        <td>
                            <a href="#" class="easyui-linkbutton" data-options="iconCls:'ext-icon-page_white_excel',plain:true" onclick="ExportFileFun();">导出</a>
                        </td>
                    </tr>
                </table>
            </div>
            <table id="grid_SelectedObj" title="已选择数据项" data-options="fit:true,border:false"></table>
        </div>
        <div class="easyui-panel" data-options="region:'center',border:false" style="padding: 5px;">
            <div class="easyui-layout" data-options="fit:true,border:false">
                <div id="Windows_Container" class="easyui-panel" data-options="region:'center', border:false, collapsible:false, split:false">
                    <!--<div id="Windows_Container" class="easyui-layout" data-options="fit:true,border:false"></div>-->
                </div>
            </div>
        </div>
    </div>
    <!--------------------------------------------------dialog选择数据项------------------------------------------>
    <div id="dlg_TagItemsList" class="easyui-dialog">
        <div id="TagItemsTabs" class="easyui-tabs" data-options="fit:true, tabPosition:'left'">
            <div title="统计数据" style="padding: 10px;">
                <div class="easyui-layout" data-options="fit:true,border:false">
                    <div data-options="region:'north',border:true" style="height: 38px;">
                        <div id="toolBar_StaticsItems" style="display: normal; text-align: left; background-color: #f3f3f3; height: 30px; padding-left: 10px; padding-top: 5px;">
                            <table style="width: 330px;">
                                <tr>
                                    <td style="width: 60px;">产线类型</td>
                                    <td style="text-align: left; width: 120px;">
                                        <select id="Select_ProductionLineTypeF" class="easyui-combobox" name="ProductionLineType" data-options="panelHeight:'auto',onChange:function(){RefreshStaticsItems();}" style="width: 100px;">
                                            <option value="熟料">熟料</option>
                                            <option value="水泥磨">水泥</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div data-options="region:'center',border:true" style ="padding-top:10px; overflow:auto;">
                        <ul id="grid_StaticsItems"></ul>
                    </div>
                    <div data-options="region:'east',border:false" style="padding-top:10px; padding-left: 10px; width:450px;">
                        <table id="grid_StandardItems"></table>
                    </div>
                </div>
            </div>
            <div title="DCS数据" style="padding: 10px;">
                <uc1:TagsSelector_Dcs ID="TagsSelector_DcsTags" runat="server" />
            </div>
            <div title="用户自定义" style="padding: 10px;">
                <div id="toolBar_CustomDefine" style="display: none; text-align: center;">
                    <table style="width: 330px;">
                        <tr>
                            <td style="text-align: left;">
                                <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="RemoveAllDataTagGroupFun();">清空列表</a>
                            </td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <table id="CustomDefine"></table>
            </div>
        </div>
    </div>
    <!--////////////////////////////////////////////保存用户自定义标签组//////////////////////////////-->
    <div id="dlg_CustomDefineCustomGroupName" class="easyui-dialog" data-options="iconCls:'icon-save',resizable:false,modal:true">
        <fieldset>
            <legend>用户自定义对标数据</legend>
            <table class="table" style="width: 100%;">
                <tr>
                    <th style="height: 30px;">自定义组名称</th>
                    <td>
                        <input id="TextBox_CustomGroupName" class="easyui-validatebox" data-options="required:true" style="width: 240px" />
                    </td>
                </tr>
                <tr>
                    <th style="height: 30px;">备注</th>
                    <td>
                        <textarea id="TextBox_Remark" cols="20" name="S1" style="width: 240px; height: 60px;" draggable="false"></textarea>
                    </td>
                </tr>
            </table>
        </fieldset>
    </div>
    <div id="buttons_CustomDefineCustomGroupName">
        <table style="width: 100%">
            <tr>
                <td style="text-align: right">
                    <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save',plain:true" onclick="SaveDataTagsGroupFun();">保存</a>
                    <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-cancel',plain:true" onclick="javascript:$('#dlg_CustomDefineCustomGroupName').dialog('close');">取消</a>
                </td>
            </tr>
        </table>
    </div>
    <form id="form_Main" runat="server">
        <div>
        </div>
    </form>
</body>
</html>

