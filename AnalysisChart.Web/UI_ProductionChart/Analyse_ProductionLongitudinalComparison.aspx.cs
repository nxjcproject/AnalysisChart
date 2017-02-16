using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using WebStyleBaseForEnergy;
namespace AnalysisChart.Web.UI_ProductionChart
{
    public partial class Analyse_ProductionLongitudinalComparison : WebStyleBaseForEnergy.webStyleBase
    {
        private const string KPIName = "EntityProductionKPI";
        private const string StandardType = "Production";
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
#if DEBUG
                ////////////////////调试用,自定义的数据授权
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_byc_byf", "zc_nxjc_qtx" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
#elif RELEASE
#endif
                this.TagsSelector_DcsTags.Organizations = GetDataValidIdGroup("ProductionOrganization");                 //向web用户控件传递数据授权参数
                this.TagsSelector_DcsTags.PageName = "Analyse_ProductionLongitudinalComparison.aspx";                                     //向web用户控件传递当前调用的页面名称
            }
            ///以下是接收js脚本中post过来的参数
            string m_FunctionName = Request.Form["myFunctionName"] == null ? "" : Request.Form["myFunctionName"].ToString();             //方法名称,调用后台不同的方法
            string m_Parameter1 = Request.Form["myParameter1"] == null ? "" : Request.Form["myParameter1"].ToString();                   //方法的参数名称1
            string m_Parameter2 = Request.Form["myParameter2"] == null ? "" : Request.Form["myParameter2"].ToString();                   //方法的参数名称2
            if (m_FunctionName == "ExcelStream")
            {
                //ExportFile("xls", "导出报表1.xls");
                string m_ExportTable = m_Parameter1.Replace("&lt;", "<");
                m_ExportTable = m_ExportTable.Replace("&gt;", ">");
                AnalysisChart.Bll.Analyse_KPICommon.ExportExcelFile("xls", m_Parameter2 + ".xls", m_ExportTable);
            }
        }
        [WebMethod]
        public static string GetIndicatorItems()
        {
            string myValueJson = AnalysisChart.Bll.Analyse_ProductionHorizontalComparison.GetIndicatorItems();
            return myValueJson;
        }
        [WebMethod]
        public static string GetStaticsItems(string myValueType, string myEquipmentCommonId, string mySpecificationsId)
        {
            List<string> m_DataValidIdGroup = GetDataValidIdGroup("ProductionOrganization");
            if (m_DataValidIdGroup != null && m_DataValidIdGroup.Count > 0)
            {
                string StaticsItemsJson = AnalysisChart.Bll.Analyse_ProductionHorizontalComparison.GetStaticsItems(myValueType, myEquipmentCommonId, mySpecificationsId, m_DataValidIdGroup);
                return StaticsItemsJson;
            }
            else
            {
                return "{\"rows\":[],\"total\":0}";
            }
        }
        [WebMethod]
        public static string GetStandardItems(string myStatisticalMethod, string myValueType)
        {
            List<string> m_DataValidIdGroup = GetDataValidIdGroup("ProductionOrganization");   //数据授权
            List<string> m_OrganizationIdList = AnalysisChart.Bll.Analyse_KPICommon.GetAllParentIdAndChildrenIdByIds(m_DataValidIdGroup);
            string m_IndexTagJson = AnalysisChart.Bll.Analyse_KPICommon.GetStandardItems(myStatisticalMethod, myValueType, StandardType,m_OrganizationIdList);
            return m_IndexTagJson;
        }
        [WebMethod]
        public static string GetEquipmentInfo()
        {
            List<string> m_DataValidIdGroup = GetDataValidIdGroup("ProductionOrganization");
            string m_StaticsItemsJson = AnalysisChart.Bll.Analyse_ProductionHorizontalComparison.GetEquipmentInfo(m_DataValidIdGroup);
            return m_StaticsItemsJson;
        }
        [WebMethod]
        public static string SaveCustomDefineTags(string myTagsGroupName, string myRemark, string myTagInfoJson)
        {
            string m_SaveResultJson = AnalysisChart.Bll.Analyse_KPICommon.SaveCustomDefineTags(myTagsGroupName, myRemark, myTagInfoJson, mUserId, KPIName);
            return m_SaveResultJson;
        }
        [WebMethod]
        public static string GetCustomDefineTagsGroup()
        {
            string m_CustomTagsGroupJson = AnalysisChart.Bll.Analyse_KPICommon.GetCustomDefineTagsGroup(mUserId, KPIName);
            return m_CustomTagsGroupJson;
        }
        [WebMethod]
        public static string GetTagGroupJsonById(string myTagGroupId)
        {
            string m_CustomTagsGroupJson = AnalysisChart.Bll.Analyse_KPICommon.GetTagGroupJsonById(myTagGroupId);
            return m_CustomTagsGroupJson;
        }
        [WebMethod]
        public static string DeleteAllCustomDefineTagsByUserId()
        {
            string m_DeleteResultJson = AnalysisChart.Bll.Analyse_KPICommon.DeleteAllCustomDefineTagsByUserId(mUserId, KPIName);
            return m_DeleteResultJson;
        }
        [WebMethod]
        public static string DeleteCustomDefineTagsByTagsGroupId(string myTagGroupId)
        {
            string m_DeleteResultJson = AnalysisChart.Bll.Analyse_KPICommon.DeleteCustomDefineTagsByTagsGroupId(myTagGroupId, KPIName);
            return m_DeleteResultJson;
        }


        [WebMethod]
        public static string GetChartDataJson(string myAnalyseCyc, string myStartTime, string myEndTime, string myChartType, string myTagInfoJson)
        {
            string m_ChartTableJson = AnalysisChart.Bll.Analyse_ProductionLongitudinalComparison.GetChartDataJson(myAnalyseCyc, myStartTime, myEndTime, myChartType, myTagInfoJson);
            return m_ChartTableJson;
        }
        [WebMethod]
        public static string SpecificationsInfo(string myEquipmentCommonId)
        {
            string m_DeleteResultJson = AnalysisChart.Bll.Analyse_KPICommon.GetSpecificationsInfo(myEquipmentCommonId);
            return m_DeleteResultJson;
        }
    }
}