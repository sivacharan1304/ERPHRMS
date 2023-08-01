
import React, { useState } from 'react'
import ReactSpeedometer from 'react-d3-speedometer';
import Select from 'react-select';
type Props = {
    className: string
    EmpAttributeCount: number
    attibutedata:any
    year:any
}




function EmployeeAttrition({ className, EmpAttributeCount ,attibutedata,year}: Props) {
    const [yearvalue, setyearvalue] = useState<any>({ value: '', label: '' });
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
                                            name="This Month"
                                            className='pt-2'
                                            onChange={(o:any)=>setyearvalue(o)}
                                            value={yearvalue}
                                            options={year}
                                            placeholder="This Month"
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
                                                        value={EmpAttributeCount}
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


                                                                <th className='min-w-150px text-white' >Year

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
                                                            {attibutedata.map((record:any,index:any)=>(
                                                                <tr key={index} className='text-center'>
                                                                    <td>
                                                                        {record.year}
                                                                    </td>
                                                                    <td>
                                                                        {record.noofEmpMonthStart}
                                                                    </td>
                                                                    <td>
                                                                        {record.empJoined}
                                                                    </td>
                                                                    <td>
                                                                        {record.empLeft}
                                                                    </td>
                                                                    <td>
                                                                        {record.noofEmpMonthEnd}
                                                                    </td>
                                                                    <td>
                                                                        {record.averageEmp}
                                                                    </td>
                                                                    <td>
                                                                        {record.attritionRate}
                                                                    </td>

                                                                </tr>
                                                            ))}
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



