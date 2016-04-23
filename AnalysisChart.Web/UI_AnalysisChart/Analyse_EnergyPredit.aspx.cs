using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Data;
using System.Web.Services;
using WebStyleBaseForEnergy;

namespace AnalysisChart.Web.UI_AnalysisChart
{
    public partial class Analyse_EnergyPredit : WebStyleBaseForEnergy.webStyleBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
#if DEBUG
                ////////////////////调试用,自定义的数据授权
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_qtx" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
#elif RELEASE
#endif
                this.OrganisationTree_ProductionLine.Organizations = GetDataValidIdGroup("ProductionOrganization");                 //向web用户控件传递数据授权参数
                this.OrganisationTree_ProductionLine.PageName = "Analyse_ProductionLine.aspx";                                     //向web用户控件传递当前调用的页面名称
            }
        }
        [WebMethod]
        public static string GetEnergyPreditItems()
        {
            string m_EnergyPreditJson = AnalysisChart.Bll.EnergyPredit.GetEnergyPreditItems();
            return m_EnergyPreditJson;
        }
        [WebMethod]
        public static string GetEnergyPreditChart(string myOrgnizationId, string myDateTime, string myTagItemsJson)
        {
            string m_EnergyPreditChartJson = AnalysisChart.Bll.EnergyPredit.GetEnergyPreditChart(myOrgnizationId, myDateTime, myTagItemsJson);
            return m_EnergyPreditChartJson;
        }
    }
}