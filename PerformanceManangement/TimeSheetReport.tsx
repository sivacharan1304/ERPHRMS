import React, { useState } from 'react';
import dayjs from "dayjs";
interface Timesheet {
  empcode: number;
  empName: string;
  projectName: string;
  taskName: string;
  projectStartDate: string;
  projectEndDate: string;
  totalHourSpend: number;
}

interface TimesheetReportProps {
  timesheets: Timesheet[];
}

const TimesheetReport: React.FC<TimesheetReportProps> = ({ timesheets }) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredTimesheets = timesheets.filter((timesheet) =>
    timesheet.empName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };


  return (
    <>
      <div className='card shadow-sm p-3 mb-5 bg-white rounded'>
        <div className='card-header border-0 mb-2'>
          <h3 className='card-title fw-bold'>TimeSheet</h3>
          <div className='card-toolbar'>
            <input
              name='searchValue'
              type='search'
              placeholder='Search Employee Name'
              autoComplete='off'
              className='form-control form-control-sm'
              style={{ width: '200px' }}
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className='table-responsive'>
          <div style={{ height: 380, overflowY: 'scroll' }}>
            <table className='table table-striped align-middle gy-2 gs-2'>
              <thead style={{ background: '#0095e8', position: 'sticky', top: 0 }}>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-70px text-white'>Employee Code</th>
                  <th className='min-w-100px text-white'>Employee Name</th>
                  <th className='min-w-100px text-white'>Project Name</th>
                  <th className='min-w-100px text-white'>Task Name</th>
                  <th className='min-w-100px text-white'>Project Start Date</th>
                  <th className='min-w-100px text-white'>Project End Date</th>
                  <th className='min-w-70px text-white'>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesheets.map((timesheet) => (
                  <tr key={timesheet.empcode}>
                    <td>{timesheet.empcode}</td>
                    <td>{timesheet.empName}</td>
                    <td>{timesheet.projectName}</td>
                    <td>{timesheet.taskName}</td>
                    <td>{dayjs(timesheet.projectStartDate).format('YYYY-MM-DD')}</td>
                    <td>{dayjs(timesheet.projectEndDate).format('YYYY-MM-DD')}</td>
                    <td>{timesheet.totalHourSpend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimesheetReport;