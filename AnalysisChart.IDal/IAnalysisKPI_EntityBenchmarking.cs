using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
namespace AnalysisChart.IDal
{
    public interface IAnalysisKPI_EntityBenchmarking
    {
        DataTable GetStaticsItems(string myOrganizationType, string myValueType, bool myHiddenMainMachine, List<string> myOrganizations);
        DataTable GetMonthStaticsData(string myOrganizationId, string myVariableId, string myStartTime, string myEndTime);
        DataTable GetDayStaticsData(string myOrganizationId, string myVariableId, string myStartTime, string myEndTime);
    }
}
