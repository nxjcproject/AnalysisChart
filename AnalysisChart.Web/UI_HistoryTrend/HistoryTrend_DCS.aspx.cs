using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Web.Services;
using WebStyleBaseForEnergy;
namespace AnalysisChart.Web.UI_HistoryTrend
{
    public partial class HistoryTrend_DCS : WebStyleBaseForEnergy.webStyleBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            base.InitComponts();
            if (!IsPostBack)
            {
                ////////////////////调试用,自定义的数据授权
                #if DEBUG
                List<string> m_DataValidIdItems = new List<string>() { "zc_nxjc_byc", "zc_nxjc_qtx" };
                AddDataValidIdGroup("ProductionOrganization", m_DataValidIdItems);
                #elif RELEASE
                #endif
                this.TagsSelector_DcsTags.Organizations = GetDataValidIdGroup("ProductionOrganization");                 //向web用户控件传递数据授权参数
                this.TagsSelector_DcsTags.PageName = "HistoryTrend_DCS.aspx";                                     //向web用户控件传递当前调用的页面名称
            }
        }
        [WebMethod]
        public static string GetChartDataJson(string myStartTime, string myEndTime, string myTagInfoJson)
        {
            string m_TagTrendJson = AnalysisChart.Bll.HistoryTrend.GetChartDataJson(myStartTime, myEndTime, myTagInfoJson);
            return m_TagTrendJson;
        }
    }
}