<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Monitor_KeyIndicators.aspx.cs" Inherits="AnalysisChart.Web.UI_AnalysisChart.Monitor_KeyIndicators" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/gray/easyui.css" />
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/icon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtIcon.css" />
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtCss.css" />

    <link rel="stylesheet" type="text/css" href="/lib/pllib/themes/jquery.jqplot.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shCoreDefault.min.css" />
    <link type="text/css" rel="stylesheet" href="/lib/pllib/syntaxhighlighter/styles/shThemejqPlot.min.css" />
    <link type="text/css" rel="stylesheet" href="/css/common/NormalPage.css" />
    <link type="text/css" rel="stylesheet" href="css/page/Monitor_KeyIndicators.css" />

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
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.meterGaugeRenderer.min.js"></script>
    <!--[if lt IE 8 ]><script type="text/javascript" src="/lib/pllib/plugins/jqplot.json2.min"></script><![endif]-->


    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->

    <script type="text/javascript" src="/js/common/components/Charts.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/DataGrid.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/WindowsDialog.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/GridChart.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/format/DateTimeFormat.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/PrintFile.js" charset="utf-8"></script>
    <script type="text/javascript" src="js/page/Monitor_KeyIndicators.js" charset="utf-8"></script>
</head>
<body>
    <div id="Mainlayout" class="easyui-layout" data-options="fit:true,border:false">
        <div class="easyui-panel" data-options="region:'north',border:false" style="height: 35px; padding-left:5px; padding-top:1px; overflow:hidden;">
            <table id ="QueryTable" style ="background-color:#dddddd; border:1px solid #bbbbbb;">
                <tr>
                    <td style="width: 80px; height: 30px;text-align: center;">选择生产区域</td>
                    <td style="width: 160px; text-align: left;">
                        <select id="Combobox_ValueTypeF" class="easyui-combobox" name="ValueType" data-options="panelHeight:'auto'" style="width: 140px;">
                                <option value="ElectricityQuantity">二分厂</option>
                            </select>
                    </td>
                    <td style="width: 60px;text-align: left">选择类型</td>
                    <td style="width: 130px; text-align: left;">
                        <select id="Select1" class="easyui-combobox" name="ValueType" data-options="panelHeight:'auto'" style="width: 120px;">
                                <option value="ElectricityQuantity">2#窑</option>
                            </select>
                    </td>
                    <td style ="width:70px;">
                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:false" onclick="ChartLoadData([18.5,55.64,20.74]);">确认</a>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>
        <div class="easyui-panel" data-options="region:'center',border:true" style="overflow:auto;">
            <table id="ChartContentTable"></table>
        </div>
    </div>
</body>
</html>
