import React from 'react'
import Select from 'react-select';
import  { useEffect, useState } from 'react'
import { get } from '../../Service/Services';
import SessionManager from '../../../modules/auth/components/Session';
type Props = { className: string }

function EmployeeDetails({ className }: Props) {
    const [data, setData] = useState([])
    const Empcode = SessionManager.getEmpID()
const OptionDep =[{value:"Engineering", label:"Engineering"}]
const OptionTeam =[{value:"Quality Checker", label:"Quality Checker"},{value:"Service Engineer", label:"Service Engineer"}]

    const filllist = () => {
        get('HRDashBoard/HRDashBoard?empCode=' + Empcode).then((result) => {
            var i = 1
            let data1: any = []
            result.data.empDetails.map((obj: any) => {
                data1.push({
                    repFirstName:obj.repFirstName,
                    departmentName:obj.departmentName,
                    repMiddleName :obj.repMiddleName,
                    repLastName:obj.repLastName,
                    designation:obj.designation,
                    sectionName:obj.sectionName
                })
                i = i + 1
            })
            setData(data1)
            console.log(data1);
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
                                        Employee Details
                                    </h3>
                                    <div className='card-toolbar'>
                                        <button
                                            className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                                            data-kt-menu-trigger='click'
                                            data-kt-menu-placement='bottom-end'
                                            data-kt-menu-flip='top-end'
                                        >
                                            <i className='bi bi-three-dots-vertical fs-3' ></i>
                                        </button>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <div className='ms-5 me-5 mb-5'>
                                        <div className='row'>
                                            <div className='col-lg-4'>
                                                <div className='pb-4'>
                                                    <input className='form-control form-control-sm' placeholder='search'></input>
                                                </div>
                                            </div>
                                            <div className='col-lg-4'>
                                                <Select
                                               options={OptionDep}
                                                    className='pb-4'
                                                    name="Department"
                                                    placeholder="Department"
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
                                            <div className='col-lg-4'>
                                                <Select
                                               options={OptionTeam}
                                                    className='pb-4'
                                                    name="Teams"
                                                    placeholder="Teams"
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

                                    <div className='row'>
                                        <div className='col-lg-12'>
                                            <div className="table-responsive ms-5 me-5 mb-5 rounded shadow-sm p-3 rounded">
                                                <table id="dtVerticalScrollExample" className='table table-striped gs-1 gy-2'>
                                                    <thead className="w-120 " style={{ background: "#0095e8" }}>
                                                        <tr className='text-muted fw-semibold text-center '>


                                                            <th className='min-w-150px text-white' >Employee Name

                                                            </th>
                                                            <th className='min-w-150px text-white' >Department

                                                            </th>
                                                            <th className='min-w-150px text-white' >Designation

                                                            </th>

                                                            <th className='min-w-150px text-white' >Team

                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {data.map((rowData: any, index: any) => (
											    <tr className='text-center fw-bold text-gray-800'>

                                                <td >
                                                    {rowData.repFirstName+' '+rowData.repMiddleName+' '+rowData.repLastName}
                                                </td>
                                                <td >
                                                    {rowData.departmentName}
                                                </td>
                                                <td >
                                                    {rowData.designation}
                                                </td>
                                                <td >
                                                {rowData.sectionName}
                                                </td>
                                            </tr>
										))}
                                                    
                                                        {/* <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Gowtham
                                                            </td>
                                                            <td >
                                                                UI/UX
                                                            </td>
                                                            <td >
                                                                Designer
                                                            </td>
                                                            <td >
                                                                LOIU
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Smith
                                                            </td>
                                                            <td >
                                                                Admin
                                                            </td>
                                                            <td >
                                                                Recuriter
                                                            </td>
                                                            <td >
                                                                R&D
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
        </>
    )
}

export default EmployeeDetails