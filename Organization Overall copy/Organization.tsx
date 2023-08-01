import Select from 'react-select';
import ProjectHandler from './Quard/ProjectHandler';
import Employeeall from './Quard/Employeeall';
import Department from './Quard/Department';
import Detail from './Quard/Details';
import EmployeeAttrition from './Employee Attrition Rate/Employee Attrition';
import RecruiterStatus from './Recruiter/RecruiterStatus';
import CompetencySkills from './Competency Skills/Competency Skills';
import NewsAnnouncements from './News&Accouncement/NewsAnnouncements';
import RecentActivity from './Recent Activity/RecentActivities';
// import Location from './Quard/Location';
import { get } from '../Service/Services';
import { useEffect, useState } from 'react';
import SessionManager from '../../modules/auth/components/Session';

type Props = {}

function Organization({ }: Props) {

    const [CountryOptions, setCountryOptions] = useState<any>([]);
    const [LanguageOptions, setLanguageOptions] = useState<any>([]);
    const [NewData, setNewData] = useState<any>([]);
    const [ActivityData, setActivityData] = useState<any>([]);
    const [RecruitingData, setRecruitingData] = useState<any>([]);
    const [Company, setCompany] = useState<any>([]);
    const [attibutedata, setAttibutedata] = useState<any>([]);
    const [taskdata, settaskdata] = useState<any>([]);
    const [year, setyear] = useState<any>([]);
    const [CountryValue, setCountryValue] = useState<any>({ value: '', label: '' });
    const [LanguageValue, setLanguageValue] = useState<any>({ value: '', label: '' });
    const [ProjectCount, setProjectCount] = useState(0);
    const [EmployeeCount, setEmployeeCount] = useState(0);
    const [DepartmentCount, setDepartmentCount] = useState(0);
    const [EmpAttributeCount, setEmpAttributeCount] = useState(0);
    const [LocationCount, setLocationCount] = useState(0);
    const [Resultproject, setResultproject] = useState<any>({ completeProjects: 0, pendingProjects: 0 });
    const [EmployeeResult, setEmployeeResult] = useState<any>({ activeEmployees: 0, inactiveEmployees: 0 });

    const FillList = () => {
        const EmpCode = "8"
        get('OverAllDashBoard/GetByOverAllCode?empCode=' + EmpCode)
            .then((result: any) => {
                let countryData: any = []
                result.data.country.map((record: any) => {
                    countryData.push({
                        value: record.countryCode,
                        label: record.countryCode
                    })
                })
                setCountryOptions(countryData)

                let yearData: any = []
                result.data.employeeAttritionRate.map((record: any) => {
                    yearData.push({
                        value: record.year,
                        label: record.year
                    })
                })
                setyear(yearData)

                let languageData: any = []
                result.data.language.map((languageCode: any) => {
                    languageData.push({
                        value: languageCode,
                        label: languageCode
                    })
                })
                setLanguageOptions(languageData)
                setProjectCount(result.data.project)
                setResultproject(result.data.resultproject)
                setEmployeeCount(result.data.employee)
                setEmployeeResult(result.data.result)
                setDepartmentCount(result.data.department)
                setCompany(result.data.company[0])
                setEmpAttributeCount(result.data.totalPercentage)
                setRecruitingData(result.data.recruiting)
                setNewData(result.data.news)
                setActivityData(result.data.activity)
                setLocationCount(result.data.location)
                setAttibutedata(result.data.employeeAttritionRate)
                settaskdata(result.data.task)
            })
    }
    useEffect(() => {
        FillList()
    }, [])
    return (
        <>
            <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                <h3 className='card-title text-gray-800  fw-bold'>
                </h3>
                <div className='card-toolbar'>
                    <div className='d-flex justify-content-end gap-5'>
                        <Select
                            name="Co."
                            className='pt-2'
                            placeholder="Co."
                            options={CountryOptions}
                            value={CountryValue}
                            onChange={(o) => setCountryValue(o)}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            styles={{
                                menu: (base) => ({
                                    ...base,
                                    width: "max-content",
                                    minWidth: "100%"
                                }),
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: "#E1E3EA",
                                    borderRadius: "0.425rem",
                                    height: 10,

                                    fontSize: "15px! important",
                                    boxShadow: state.isFocused ? ' 0 0 0 0.25rem rgba(0, 123, 255, 0.25)' : '#E1E3EA',
                                    minHeight: state.isFocused ? '31px !important' : '31px !important',
                                    padding: state.isFocused ? '0 8px !important' : '0 8px !important',

                                    '&:hover': {
                                        border: 'E1E3EA'
                                    }
                                }),
                            }}
                        />
                        <Select
                            name="LNG"
                            className='pt-2'
                            placeholder="LNG"
                            options={LanguageOptions}
                            value={LanguageValue}
                            onChange={(o) => setLanguageValue(o)}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            styles={{
                                menu: (base) => ({
                                    ...base,
                                    width: "max-content",
                                    minWidth: "100%"
                                }),
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: "#E1E3EA",
                                    borderRadius: "0.425rem",
                                    height: 10,

                                    fontSize: "15px! important",
                                    boxShadow: state.isFocused ? ' 0 0 0 0.25rem rgba(0, 123, 255, 0.25)' : '#E1E3EA',
                                    minHeight: state.isFocused ? '31px !important' : '31px !important',
                                    padding: state.isFocused ? '0 8px !important' : '0 8px !important',

                                    '&:hover': {
                                        border: 'E1E3EA'
                                    }
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
            <h2>Welcome, Hi {SessionManager.getUserName()}</h2>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <div className='row'>
                                    <div className='col-lg-2 col-md-4 '>
                                        <ProjectHandler ProjectCount={ProjectCount} Resultproject={Resultproject} className='mb-5' />
                                    </div>
                                    <div className='col-lg-2 col-md-4'>
                                        <Employeeall EmployeeCount={EmployeeCount} EmployeeResult={EmployeeResult} className='mb-5' />
                                    </div>

                                    <div className='col-lg-2 col-md-4 '>
                                        <Department DepartmentCount={DepartmentCount} className='mb-5' />
                                    </div>

                                    {/* <div className='col-lg-2 col-md-6'>
                                        <Location Location={LocationCount} className='mb-5' />
                                    </div> */}

                                    <div className='col-lg-4 col-md-6 '>
                                        <Detail className='mb-5' Company={Company} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <EmployeeAttrition year={year} EmpAttributeCount={EmpAttributeCount} attibutedata={attibutedata} className='mb-5' />
                        </div>

                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <RecruiterStatus RecruitingData={RecruitingData} className='mb-5' /></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <CompetencySkills className='mb-5' /></div>
                        </div>

                        <div className='row'>

                            <div className='col-lg-6 col-md-6'><NewsAnnouncements className='mb-5' NewData={NewData} taskdata={taskdata} /></div>
                            <div className='col-lg-6 col-md-6'><RecentActivity ActivityData={ActivityData} className='mb-5' /></div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Organization
