using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AnalysisChart.IDal;
using AnalysisChart.Model;
using System.Data;
namespace AnalysisChart.Dal
{
    public class AnalysisKPI_EntityBenchmarking : IAnalysisKPI_EntityBenchmarking
    {
        private const string clinker = "熟料";
        private static readonly WebStyleBaseForEnergy.DbDataAdapter m_DbDataAdapter = new WebStyleBaseForEnergy.DbDataAdapter("ConnNXJC");
        public DataTable GetStaticsItems(string myOrganizationType, string myValueType, bool myHiddenMainMachine, List<string> myOrganizations)
        {
            string m_Sql = @"Select 
                        A.OrganizationID as OrganizationId, 
                        A.Name as Name,
					    A.LevelCode as LevelCode,
                        A.LevelType as Type, 
                        '' as TagColumnName,
                        'balance_Energy' as TagTableName, 
                        '' as TagDataBase 
                        from system_Organization A
					    where A.Enabled = 1 
						and A.LevelType in('Company','Factory','ProductionLine')
                        and {2}
                    union
                        Select 
                        A.OrganizationID as OrganizationId, 
                        (Case when C.LevelType = 'ProductionLine' then A.Name else '' end) + C.Name as Name,
					    A.LevelCode + substring(C.LevelCode,4 ,len(C.LevelCode)-3) as LeveCode,
                        C.LevelType as Type, 
                        C.VariableID as TagColumnName,
                        'balance_Energy' as TagTableName, 
                        'NXJC' as TagDataBase 
                        from system_Organization A, tz_Formula B, formula_FormulaDetail C
					    where A.Enabled = 1 
                        and A.Type = '{0}' 
                        and B.Type = 2
                        and B.ENABLE = 1
                        and B.State = 0
                        and A.OrganizationID = B.OrganizationID
                        and B.KeyID = C.KeyID
                        and A.Type = '{0}' 
                        and A.LevelType = 'ProductionLine'
                        and C.LevelType <> 'ProductionLine'
                        {1}
                        and {2}";

            string m_SqlConditionTemp = @" (A.LevelCode like '{0}%' 
                                       or CHARINDEX(A.LevelCode, '{0}') > 0) ";
            string m_SqlCondition = "";
            if (myOrganizations != null)
            {
                for (int i = 0; i < myOrganizations.Count; i++)
                {
                    if (i == 0)
                    {
                        m_SqlCondition = string.Format(m_SqlConditionTemp, myOrganizations[i]);
                    }
                    else
                    {
                        m_SqlCondition = m_SqlCondition + string.Format("or " + m_SqlConditionTemp, myOrganizations[i]);
                    }
                }
            }

            string m_LevelType = "";
            if(myValueType == "ElectricityConsumption" && myHiddenMainMachine == true)      //如果是电耗并且隐藏主要设备
            {
                m_LevelType = " and C.LevelType in ('ProductionLine','Process')";   
            }
            else if (myValueType == "CoalConsumption")                   //煤耗只能显示熟料产线,水泥磨产线没有煤耗
            {
                m_LevelType = string.Format(" and C.LevelType in ('ProductionLine') and A.Type = '{0}'", clinker);
            }
            else
            {
                m_LevelType = " and C.LevelType in ('ProductionLine','Process','MainMachine')";
            }

            if (m_SqlCondition != "")
            {
                m_Sql = string.Format(m_Sql, myOrganizationType, m_LevelType,  "(" + m_SqlCondition + ")");
            }
            else
            {
                m_Sql = string.Format(m_Sql, myOrganizationType, m_LevelType,  "A.OrganizationID <> A.OrganizationID");
            }
            try
            {
                DataSet mDataSet_ProductionLine = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "StaticsItemsTable");
                return mDataSet_ProductionLine.Tables["StaticsItemsTable"];
            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataTable GetMonthStaticsData(string myOrganizationId, string myVariableId, string myStartTime, string myEndTime)
        {
            string m_Sql = @"select M.VDate as Vdate, 
                    sum(M.TagValue) as TagValue from (
                        Select               
                        substring(A.TimeStamp, 6,2) as VDate, 
                        (case when B.TotalPeakValleyFlatB is null then 0 else B.TotalPeakValleyFlatB end) as TagValue
                        from tz_Balance A, balance_Energy B 
					    where A.TimeStamp > '{0}'
					    and A.TimeStamp <= '{1}'
                        and A.StaticsCycle = 'month'
                        and B.OrganizationID = '{2}' 
                        and A.BalanceId = B.KeyId 
                        and B.VariableId = '{3}') M
                    group by M.VDate
                    order by M.VDate";

            try
            {
                m_Sql = string.Format(m_Sql, myStartTime, myEndTime, myOrganizationId, myVariableId);
                DataSet mDataSet_HistoryTrendData = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "HistoryTrendDataTable");
                return mDataSet_HistoryTrendData.Tables["HistoryTrendDataTable"];
            }
            catch (Exception)
            {
                return null;
            }
        }
        public DataTable GetDayStaticsData(string myOrganizationId, string myVariableId, string myStartTime, string myEndTime)
        {
            string m_Sql = @"select M.VDate as Vdate, 
                    sum(M.TagValue) as TagValue from (
                        Select               
                        substring(A.TimeStamp, 6,2) + substring(A.TimeStamp, 9,2) as VDate, 
                        (case when B.TotalPeakValleyFlatB is null then 0 else B.TotalPeakValleyFlatB end) as TagValue
                        from tz_Balance A, balance_Energy B 
					    where A.TimeStamp > '{0}'
					    and A.TimeStamp <= '{1}'
                        and A.StaticsCycle = 'day'
                        and B.OrganizationID = '{2}' 
                        and A.BalanceId = B.KeyId 
                        and B.VariableId = '{3}') M
                    group by M.VDate
                    order by M.VDate";

            try
            {
                m_Sql = string.Format(m_Sql, myStartTime, myEndTime, myOrganizationId, myVariableId);
                DataSet mDataSet_HistoryTrendData = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "HistoryTrendDataTable");
                return mDataSet_HistoryTrendData.Tables["HistoryTrendDataTable"];
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
