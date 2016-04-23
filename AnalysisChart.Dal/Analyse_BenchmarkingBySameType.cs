using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using AnalysisChart.IDal;
using AnalysisChart.Model;
namespace AnalysisChart.Dal
{
    public class Analyse_BenchmarkingBySameType : IAnalyse_BenchmarkingBySameType
    {
        private static readonly WebStyleBaseForEnergy.DbDataAdapter m_DbDataAdapter = new WebStyleBaseForEnergy.DbDataAdapter("ConnNXJC");
        public DataTable GetBenchmarkingDataValue(string myStartTime, string myEndTime, List<string> myOrganizationIdList)
        {
            string m_OrganizationIds = "NULL";
            if (myOrganizationIdList != null)
            {
                for (int i = 0; i < myOrganizationIdList.Count; i++)
                {
                    if (i == 0)
                    {
                        m_OrganizationIds = "'" + myOrganizationIdList[i] + "'";
                    }
                    else
                    {
                        m_OrganizationIds = m_OrganizationIds + ",'" + myOrganizationIdList[i] + "'";
                    }
                }
            }
            try
            {
                string m_Sql = @"select 
                                D.OrganizationID as OrganizationID, 
                                D.VariableId as VariableId,
                                sum(D.Value) as Value 
                                from (
                                select B.OrganizationID as OrganizationID,
                                B.VariableId as VariableId, 
                                B.TotalPeakValleyFlatB as Value
                                from tz_Balance A, balance_energy B
                                where A.StaticsCycle = 'month'
                                and A.BalanceId = B.KeyId
                                and (B.ValueType = 'ElectricityQuantity' or B.ValueType = 'MaterialWeight')
                                and A.TimeStamp >= '{0}'
                                and A.TimeStamp <='{1}'
                                and B.OrganizationID in ({2})) D
                                group by D.OrganizationID, D.VariableId";
                m_Sql = string.Format(m_Sql, myStartTime, myEndTime, m_OrganizationIds);

                DataSet mDataSet_BenchmarkingDataValue = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "BenchmarkingDataValueTable");
                return mDataSet_BenchmarkingDataValue.Tables["BenchmarkingDataValueTable"];
            }
            catch
            {
                return null;
            }

        }
        public DataTable GetElectricityConsumptionFormula(List<string> myOrganizationIdList, List<string> myVariableIdList)
        {
            string m_OrganizationIds = "NULL";
            string m_VariableIds = "NULL";
            if (myOrganizationIdList != null && myVariableIdList != null)
            {
                for (int i = 0; i < myOrganizationIdList.Count; i++)
                {
                    if (i == 0)
                    {
                        m_OrganizationIds = "'" + myOrganizationIdList[i] + "'";
                    }
                    else
                    {
                        m_OrganizationIds = m_OrganizationIds + ",'" + myOrganizationIdList[i] + "'";
                    }
                }
                for (int i = 0; i < myVariableIdList.Count; i++)
                {
                    if (i == 0)
                    {
                        m_VariableIds = "'" + myVariableIdList[i] + "'";
                    }
                    else
                    {
                        m_VariableIds = m_VariableIds + ",'" + myVariableIdList[i] + "'";
                    }
                }
            }
            try
            {
                string m_Sql = @"select A.OrganizationID,B.Name,B.LevelCode,B.VariableID,B.LevelType,C.ValueFormula
                                    from tz_Formula A, formula_FormulaDetail B
                                    left join balance_Energy_Template C on B.VariableId + '_ElectricityConsumption' = C.VariableId
                                    where A.OrganizationID in ({0})
                                    and A.Type =2
                                    and A.Enable = 1
                                    and A.State = 0
                                    and A.KeyID = B.KeyID
                                    and (B.LevelType <> 'MainMachine'
                                    or (B.LevelType = 'MainMachine' and B.VariableId + '_ElectricityConsumption' in ({1})))
                                    order by B.LevelCode";
                m_Sql = string.Format(m_Sql, m_OrganizationIds, m_VariableIds);

                DataSet mDataSet_CaculateFormulaTable = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "CaculateFormulaTable");
                return mDataSet_CaculateFormulaTable.Tables["CaculateFormulaTable"];
            }
            catch
            {
                return null;
            }
        }
        public DataTable GetOrganizationsLevelCode(string myStatisticalRange, List<string> myOrganizationIds)
        {
            string m_MainFrameDataBase = WebStyleBaseForEnergy.DbDataAdapter.MainFrameDataBase;
            string m_Sql = @"select 
                                A.LevelCode as LevelCode,
                                A.OrganizationID as OrganizationId,
                                A.Name as Name,
                                '0.00' as Value  
                                from system_Organization A, system_Organization B
                                where A.LevelType = '{0}'
                                and A.LevelCode like B.LevelCode + '%'
                                and B.OrganizationID in {1}";    
            //
            string m_OrganizationIds = "";

            if (myOrganizationIds != null)
            {
                for (int i = 0; i < myOrganizationIds.Count; i++)
                {
                    if (i == 0)
                    {
                        m_OrganizationIds = "'" + myOrganizationIds[i] + "'";
                    }
                    else
                    {
                        m_OrganizationIds = m_OrganizationIds + ",'" + myOrganizationIds[i] + "'";
                    }
                }
            }
            m_Sql = string.Format(m_Sql, myStatisticalRange, "(" + m_OrganizationIds + ")");
            try
            {
                DataSet m_DataSet_OrganizationLevelCodeTable = m_DbDataAdapter.MySqlDbDataAdaper.Fill(null, m_Sql, "OrganizationLevelCodeTable");
                if (myStatisticalRange == "Group")
                {
                    if (m_DataSet_OrganizationLevelCodeTable.Tables["OrganizationLevelCodeTable"].Rows.Count == 0)   //当没有集团授权功能时，手动增加数据授权，但是这样做表示所有人能查询集团总的能耗信息
                    {
                        m_DataSet_OrganizationLevelCodeTable.Tables["OrganizationLevelCodeTable"].Rows.Add(new string[] { "O", "zc_nxjc", "集团", "0.00" });
                    }
                }
                return m_DataSet_OrganizationLevelCodeTable.Tables["OrganizationLevelCodeTable"];
            }
            catch (Exception)
            {
                return null;
            }
        }
        public DataTable GetStaticsItems(string myOrganizationType, string myModel, List<string> myOrganizations)
        {
            string m_Sql = "";
            string m_OrganizationTypeE = "";
            if (myOrganizationType == "熟料")
            {
                m_OrganizationTypeE = "clinker";
            }
            else
            {
                m_OrganizationTypeE = "cementmill";
            }
            if (myModel == "ClinkerAndCementmill")
            {
                m_Sql = @"Select M.OrganizationId as OrganizationId,
                            M.Name as Name, 
                            M.LevelCode as LevelCode,
                            M.VariableId as VariableId,
                            M.Type as Type,
                            M.Value as Value 
                            from (
                            Select 
                                A.OrganizationID as OrganizationId, 
                                A.Name as Name,
					            A.LevelCode as LevelCode,
                                '{2}' as VariableId, 
                                A.Type as Type,
                                '' as Value
                                from system_Organization A
					            where A.Enabled = 1 
						        and (A.Type in ('{0}') or A.Type = '' or A.Type is null or A.Type = '分厂' or A.Type = '分公司')
                                and {1}
                            union all
                                Select 
                                A.OrganizationID as OrganizationId,
                                B.Name as Name, 
                                C.LevelCode + substring(B.LevelCode,4,len(B.LevelCode) - 3) as LevelCode,
                                B.VariableId as VariableId,
                                B.LevelType as Type,
                                '' as Value
                                from tz_formula A, formula_FormulaDetail B, system_Organization C
                                where {3}
                                and C.Enabled = 1
                                and C.Type in ('熟料','水泥磨')
                                and A.OrganizationID in (C.OrganizationID)
                                and A.Enable = 1
                                and A.State = 0
                                and A.KeyID = B.KeyID
                                and B.LevelType <> 'ProductionLine') M
                            order by M.LevelCode";
                string m_SqlConditionTemp1 = @" C.LevelCode like '{0}%' ";
                string m_SqlCondition1 = "";
                if (myOrganizations != null)
                {
                    for (int i = 0; i < myOrganizations.Count; i++)
                    {
                        if (i == 0)
                        {
                            m_SqlCondition1 = string.Format(m_SqlConditionTemp1, myOrganizations[i]);
                        }
                        else
                        {
                            m_SqlCondition1 = m_SqlCondition1 + string.Format("or " + m_SqlConditionTemp1, myOrganizations[i]);
                        }
                    }
                }
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
                if (m_SqlCondition1 != "" && m_SqlCondition != "")
                {
                    m_Sql = string.Format(m_Sql, myOrganizationType, "(" + m_SqlCondition + ")", m_OrganizationTypeE, "(" + m_SqlCondition1 + ")");
                }
                else
                {
                    m_Sql = string.Format(m_Sql, myOrganizationType, "A.OrganizationID <> A.OrganizationID", m_OrganizationTypeE, "A.OrganizationID <> A.OrganizationID");
                }

            }
            else
            {
                m_Sql = @"Select 
                        A.OrganizationID as OrganizationId, 
                        A.Name as Name,
					    A.LevelCode as LevelCode,
                        '{2}' as VariableId, 
                        A.Type as Type,
                        '' as Value
                        from system_Organization A
					    where A.Enabled = 1 
						and (A.Type in ('{0}') or A.Type = '' or A.Type is null or A.Type = '分厂' or A.Type = '分公司')
                        and {1}";
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
                if (m_SqlCondition != "")
                {
                    m_Sql = string.Format(m_Sql, myOrganizationType, "(" + m_SqlCondition + ")", m_OrganizationTypeE);
                }
                else
                {
                    m_Sql = string.Format(m_Sql, myOrganizationType, "A.OrganizationID <> A.OrganizationID", m_OrganizationTypeE);
                }
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
    }
}
