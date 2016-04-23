using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Data;
using WebStyleBaseForEnergy;
namespace AnalysisChart.Web.UI_AnalysisChart
{
    public partial class Analyse_BenchmarkingBySameType : WebStyleBaseForEnergy.webStyleBase
    {
        private const string KPIName = "EntityBenchmarkingKPI";
        private const string StandardType = "Energy";
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
#if DEBUG
                ////////////////////调试用,自定义的数据授权
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_byc", "zc_nxjc_qtx" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
#elif RELEASE
#endif
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
        public static string GetBenchmarkingDataValue(string myStartTime, string myEndTime, string myTagInfoJson)
        {
            string myValueJson = AnalysisChart.Bll.Analyse_BenchmarkingBySameType.GetBenchmarkingDataValue(myStartTime, myEndTime, myTagInfoJson);
            return myValueJson;
        }
        [WebMethod]
        public static string GetStandardItems(string myStatisticalMethod, string myValueType)
        {
            List<string> m_DataValidIdGroup = GetDataValidIdGroup("ProductionOrganization");   //数据授权
            List<string> m_OrganizationIdList = AnalysisChart.Bll.Analyse_KPICommon.GetAllParentIdAndChildrenIdByIds(m_DataValidIdGroup);
            string m_IndexTagJson = AnalysisChart.Bll.Analyse_KPICommon.GetStandardItems(myStatisticalMethod, myValueType, StandardType, m_OrganizationIdList);
            return m_IndexTagJson;
        }
        [WebMethod]
        public static string GetStaticsItems(string myOrganizationType, string myModel)
        {
            List<string> m_DataValidIdGroup = GetDataValidIdGroup("ProductionOrganization");
            List<string> m_Organizations = WebUserControls.Service.OrganizationSelector.OrganisationTree.GetOrganisationLevelCodeById(m_DataValidIdGroup);
            if (m_DataValidIdGroup != null && m_DataValidIdGroup.Count > 0)
            {
                string StaticsItemsJson = AnalysisChart.Bll.Analyse_BenchmarkingBySameType.GetStaticsItems(myOrganizationType, myModel, m_Organizations);
                return StaticsItemsJson;
            }
            else
            {
                return "{\"rows\":[],\"total\":0}";
            }
        }
    }
}