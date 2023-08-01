import React from 'react'
import Select from 'react-select';
type Props = { className: string }

function CompetencySkills({ className }: Props) {
    return (
        <>
            <div className={` ${className}`}>
                <div className='card rounded'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='card'>
                                <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                                    <h3 className='card-title text-gray-800  fw-bold'>
                                        Competency Skills
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
                                            <div className='col-lg-2 col-md-2'>
                                                <Select
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
                                            <div className='col-lg-2 col-md-2'>
                                                <Select
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
                                            <div className='col-lg-2 col-md-2'>
                                                <div className='d-flex align-items-center pt-2'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                            Not Defined
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-2 col-md-2'>
                                                <div className='d-flex align-items-center pt-2'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-success fs-6'>
                                                            Awareness
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-2 col-md-2'>
                                                <div className='d-flex align-items-center pt-2'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-warning fs-6'>
                                                            Expected
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-2 col-md-2'>
                                                <div className='d-flex align-items-center pt-2'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-info fs-6'>
                                                            Next Level
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12'>
                                            <div className="table-responsive ms-5 me-5 mb-5 rounded shadow-sm p-3 rounded">
                                                <table id="dtVerticalScrollExample" className='table table-striped gs-1 gy-2'>
                                                    <thead className="w-120 " style={{ background: "#0095e8" }}>
                                                        <tr className='text-muted fw-semibold text-center '>


                                                            <th className='min-w-150px text-white' >Employee Name

                                                            </th>
                                                            <th className='min-w-150px text-white' >Communication

                                                            </th>
                                                            <th className='min-w-150px text-white' >Technical Skills

                                                            </th>

                                                            <th className='min-w-150px text-white' >Probelem-Solving Skills

                                                            </th>
                                                            <th className='min-w-150px text-white' >Logical-Solving Skills

                                                            </th>
                                                            <th className='min-w-150px text-white' >Data Analysis

                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Jamal
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td>
                                                                Jaleel
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Siva
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Ranjitha
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Dhivya
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Gowtham
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Nellavathi
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Nithya
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Sathya
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Hema
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                        </tr>
                                                        <tr className='text-center fw-bold text-gray-800'>

                                                            <td >
                                                                Abinesh
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                            </td>
                                                            <td>
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                            </td>
                                                            <td >
                                                                <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
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
        </>
    )
}

export default CompetencySkills