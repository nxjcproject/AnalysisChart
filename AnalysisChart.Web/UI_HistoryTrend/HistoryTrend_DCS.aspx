<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HistoryTrend_DCS.aspx.cs" Inherits="AnalysisChart.Web.UI_HistoryTrend.HistoryTrend_DCS" %>

<%@ Register src="~/UI_WebUserControls/TagsSelector/TagsSelector_Dcs.ascx" tagname="TagsSelector_Dcs" tagprefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>DCS历史趋势查询</title>
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

    <!--[if lt IE 9]><script type="text/javascript" src="/lib/pllib/excanvas.js"></script><![endif]-->
    <script type="text/javascript" src="/lib/pllib/jquery.jqplot.min.js"></script>
    <!--<script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shCore.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shBrushJScript.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/syntaxhighlighter/scripts/shBrushXml.min.js"></script>-->

    <!-- Additional plugins go here -->
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.barRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pieRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.categoryAxisRenderer.min.js"></script>
    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.pointLabels.min.js"></script>



    <script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasAxisTickRenderer.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasTextRenderer.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.dateAxisRenderer.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.cursor.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.highlighter.min.js"></script>
	<script type="text/javascript" src="/lib/pllib/plugins/jqplot.trendline.min.js"></script>



    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->

    <script type="text/javascript" src="/js/common/components/Charts.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/DataGrid.js" charset="utf-8"></script>
    <script type="text/javascript" src="/js/common/components/GridChart.js" charset="utf-8"></script>

    <script type="text/javascript" src="/js/common/format/DateTimeFormat.js" charset="utf-8"></script>

    <script type="text/javascript" src="js/page/HistoryTrend_DCS.js" charset="utf-8"></script>

</head>
<body>
    <div class="easyui-layout" data-options="fit:true,border:false">
        <div class="easyui-panel" data-options="region:'west',border:true" style="width: 230px;">
            <div id="MainSelect_Toolbar" style="display: none; text-align: center; padding-top: 10px;">
                <table style="width: 220px;">
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <td style="width: 60px; height: 30px;">开始时间</td>
                                    <td style="text-align: right;">
                                        <input id="StartTime" class="easyui-datetimebox" data-options="required:true, validType:'md[\'2014-07-28 10:10:10\']',editable:false" value="2014-07-28 12:13:56" style="width:150px"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 30px;">终止时间</td>
                                    <td>
                                        <input id="EndTime" class="easyui-datetimebox" data-options="required:true, validType:'md[\'2014-07-28 10:10:10\']', editable:false" value="2014-07-28 12:13:56" style="width:150px"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <td style="height: 30px; text-align: left;">
                                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="AddTagItemsFun();">添加</a>
                                        <a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="RemoveAllTagItemsFun();">清空</a>
                                    </td>
                                    <td>
                                        <div class="datagrid-btn-separator"></div>
                                    </td>
                                    <td>
                                        <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:true" onclick="QueryHistoryTrend();">查询</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <table id="grid_SelectedObj" title="已选择数据项" data-options="fit:true,border:false"></table>
        </div>
        <div class="easyui-panel" data-options="region:'center',border:false" style="padding: 5px;">
            <div class="easyui-layout" data-options="fit:true,border:false">
                <div id="Windows_Container" class="easyui-panel" data-options="region:'center', border:false, collapsible:false, split:false"></div>
            </div>
        </div>
    </div>

    <form id="form_HistoryTrend_DCS" runat="server">
        <div id="dlg_SelectDcsTags" class="easyui-dialog" data-options="iconCls:'icon-search',resizable:false,modal:true">       
            <uc1:TagsSelector_Dcs ID="TagsSelector_DcsTags" runat="server" />
        </div>
    </form>
</body>
</html>

