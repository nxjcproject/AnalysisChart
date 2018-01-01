<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Analyse_EnergyPredit.aspx.cs" Inherits="AnalysisChart.Web.UI_AnalysisChart.Analyse_EnergyPredit" %>

<%@ Register Src="~/UI_WebUserControls/OrganizationSelector/OrganisationTree.ascx" TagName="OrganisationTree" TagPrefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head_ProductionLine" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>能源预测分析</title>
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

    <script type="text/javascript" src="js/page/Analyse_EnergyPredit.js" charset="utf-8"></script>

</head>
<body>
    <div class="easyui-layout" data-options="fit:true,border:false">
        <div class="easyui-panel" data-options="region:'west',border:false" style="width: 150px;">
            <uc1:OrganisationTree ID="OrganisationTree_ProductionLine" runat="server" />
        </div>
        <div class="easyui-panel" data-options="region:'center',border:false" style="padding: 5px;">
            <div class="easyui-layout" data-options="fit:true,border:false">
                <div class="easyui-panel" data-options="region:'north', border:false, collapsible:false, split:false" style="height: 30px;">
                    <table>
                        <tr>
                            <td style="width: 60px; text-align: right;">选择年份</td>
                            <td>
                                <input id="Numberspinner_QueryDate" class="easyui-numberspinner" style="width: 80px;" data-options="min:1900, max:2200, editable:false" />
                            </td>
                            <td style="width: 70px; text-align: right;">选择统计项</td>
                            <td>
                                <input id="Combobox_GetTagItems" class="easyui-combobox" style="width: 180px;" />
                            </td>
                            <td style="width: 60px; text-align: right;">组织机构</td>
                            <td>
                                <input id="TextBox_OrganizationText" class="easyui-textbox" data-options="editable:false" style="width: 120px;" />
                            </td>
                            <td>
                                <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-search'"
                                    onclick="QueryStaticsDataFun();">查询</a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="Windows_Container" class="easyui-panel" data-options="region:'center', border:false, collapsible:false, split:false">
                </div>
            </div>
        </div>
    </div>

    <form id="form_Main" runat="server">
        <div>
        </div>
    </form>
</body>
</html>

