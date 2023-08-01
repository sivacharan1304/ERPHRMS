import React, { useEffect, useState } from 'react';
import TimesheetReport from './TimeSheetReport';
import { get } from '../Service/Services';

interface TimesheetData {
  empcode: number;
  empName: string;
  projectName: string;
  taskName: string;
  projectStartDate: string;
  projectEndDate: string;
  totalHourSpend: number;
}

const TimesheetApp: React.FC = () => {
  const [timesheets, setTimesheets] = useState<TimesheetData[]>([]);

  useEffect(() => {
    get('TimeSheet/GetAllEmpTimeSheetID')
      .then((result) => {
        const mappedData = result.data.map((obj: any, index: number) => ({
          empcode: obj.empcode,
          empName: obj.empName,
          projectName: obj.projectName,
          taskName: obj.taskName,
          projectStartDate: obj.projectStartDate,
          projectEndDate: obj.projectEndDate,
          totalHourSpend: obj.totalHourSpend,
          isActive: obj.isActive ? 'Active' : 'In Active',
          sno: index + 1,
        }));
        setTimesheets(mappedData);
      })

  }, []);



  return (
    <div>
      <h1>Timesheet Report</h1>
      <TimesheetReport timesheets={timesheets} />
    </div>
  );
};

export default TimesheetApp;
