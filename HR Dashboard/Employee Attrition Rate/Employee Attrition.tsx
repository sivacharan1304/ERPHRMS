
import React, { useEffect, useState } from 'react'
import ReactSpeedometer from 'react-d3-speedometer';
import Select from 'react-select';
import SessionManager from '../../../modules/auth/components/Session';
import { get } from '../../Service/Services';
type Props = { className: string }

function EmployeeAttrition({ className }: Props) {
    const OptionYear = [{ value: "2020", label: "2020" },{ value: "2022", label: "2022" }]

    const [data, setData] = useState([])
    const Empcode = SessionManager.getEmpID()

    const filllist = () => {
        get('HRDashBoard/HRDashBoard?empCode=' + Empcode).then((result) => {
            var i = 1
            let data1: any = []
            result.data.employeeAttritionRate.map((obj: any) => {
                data1.push({

                    empCode: obj.empCode,
                    year: obj.year,
                    noofEmpMonthStart: obj.noofEmpMonthStart,
                    empJoined: obj.empJoined,
                    empLeft: obj.empLeft,
                    noofEmpMonthEnd: obj.noofEmpMonthEnd,
                    averageEmp: obj.averageEmp,
                    attritionRate: obj.attritionRate,


                })
                i = i + 1
            })
            setData(data1)

        })

    }
    useEffect(() => {
        filllist()
    }, [])
    return (
        <>
            <div className={` ${className}`}>
                <div className='card rounded'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='card'>
                                <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                                    <h3 className='card-title text-gray-800  fw-bold'>
                                        Employee Attrition Rate
                                    </h3>
                                    <div className='card-toolbar'>
                                        <Select
                                        options={OptionYear}
                                            name="This Year"
                                            className='pt-2'
                                            placeholder="This Year"
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
                                <div className='card-body'>
                                    <div className='conatiner-fluid'>
                                        <div className='row'>
                                            <div className='col-lg-3'>
                                                <div className='ms-5 me-5 mt-6 d-flex justify-content-center'>
                                                    <ReactSpeedometer
                                                        segmentColors={['limegreen', 'tomato', 'gold', 'firebrick']}
                                                        value={70}
                                                        width={250}
                                                        minValue={0}
                                                        maxValue={100}
                                                        height={200}
                                                        needleColor="steelblue" />
                                                </div>
                                            </div>
                                            <div className='col-lg-9'>
                                                <div className="table-responsive ms-5 me-5 mb-5 rounded shadow-sm p-3 rounded"  >

                                                    <table id="dtVerticalScrollExample" className='table table-striped gs-1 gy-2'>
                                                        <thead className="w-120 " style={{ background: "#0095e8" }}>
                                                            <tr className='text-muted fw-semibold text-center '>


                                                                <th className='min-w-150px text-white' >year

                                                                </th>
                                                                <th className='min-w-200px text-white' >Employee Month Start

                                                                </th>
                                                                <th className='min-w-200px text-white' >Employee Joined

                                                                </th>

                                                                <th className='min-w-150px text-white' >Employee Left

                                                                </th>
                                                                <th className='min-w-200px text-white' >Employee Month End

                                                                </th>

                                                                <th className='min-w-150px text-white' >Average Employee

                                                                </th>

                                                                <th className='min-w-150px text-white' >Attrition Rate %

                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.map((rowData: any, index: any) => (
                                                                <tr className='text-center fw-bold text-gray-800'>

                                                                    <td >
                                                                        {rowData.year}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.noofEmpMonthStart}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.empJoined}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.empLeft}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.noofEmpMonthEnd}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.averageEmp}
                                                                    </td>
                                                                    <td >
                                                                        {rowData.attritionRate}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                            {/*                                                         
                                                            <tr className='text-center fw-bold text-gray-800'>

                                                                <td >
                                                                    Jan
                                                                </td>
                                                                <td >
                                                                    80
                                                                </td>
                                                                <td >
                                                                    12
                                                                </td>
                                                                <td >
                                                                    11
                                                                </td>
                                                                <td >
                                                                    91
                                                                </td>
                                                                <td >
                                                                    55
                                                                </td>
                                                                <td >
                                                                    1.16%
                                                                </td>
                                                            </tr>
                                                            <tr className='text-center fw-bold text-gray-800'>

                                                                <td >
                                                                    Jan
                                                                </td>
                                                                <td >
                                                                    80
                                                                </td>
                                                                <td >
                                                                    12
                                                                </td>
                                                                <td >
                                                                    11
                                                                </td>
                                                                <td >
                                                                    91
                                                                </td>
                                                                <td >
                                                                    55
                                                                </td>
                                                                <td >
                                                                    1.16%
                                                                </td>
                                                            </tr> */}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className='d-flex justify-content-end mb-5 me-5'>
                                                    <a
                                                        href='#'
                                                        className='btn btn-sm btn-light-primary '
                                                    >
                                                        View All
                                                    </a>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeAttrition



