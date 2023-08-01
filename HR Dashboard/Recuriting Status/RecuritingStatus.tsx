import React, { useEffect, useState } from 'react'
import { ProgressBar } from 'react-bootstrap';
import SessionManager from '../../../modules/auth/components/Session';
import { get } from '../../Service/Services';

type Props = { className: string }

function RecuritingStatus({ className }: Props) {
    const now = 60;
    const [data, setData] = useState([])
    const Empcode = SessionManager.getEmpID()

    const filllist = () => {
        get('HRDashBoard/HRDashBoard?empCode=' + Empcode).then((result) => {
            var i = 1
            let data1: any = []
            result.data.recruiting.map((obj: any) => {
                data1.push({
                    jobID: obj.jobID,
                    role: obj.role,
                    candidates: obj.candidates,
                    deadline: obj.deadline,

                })
                i = i + 1
            })
            setData(data1)
            console.log()
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
                                        Recuriting Status
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
                                    <div className="table-responsive ms-5 me-5 mb-7 shadow-sm p-3 rounded">
                                        <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1 gy-2'>

                                            <thead className="w-120 " style={{ background: "#0095e8" }}>
                                                <tr className='text-muted  fw-semibold  text-center'>

                                                    <th className='min-w-150px text-white'>JobId
                                                    </th>
                                                    <th className='min-w-150px text-white'>Role
                                                    </th>
                                                    <th className='min-w-150px text-white'>Candidates
                                                    </th>
                                                    <th className='min-w-150px text-white'>Deadline
                                                    </th>
                                                    <th className='min-w-150px text-white'>Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((rowData: any, index: any) => (
                                                    <tr className='text-center fw-bold text-gray-800 fs-6'>
                                                        <td>
                                                            {rowData.jobID}
                                                        </td>
                                                        <td>
                                                            {rowData.role}
                                                        </td>
                                                        <td>
                                                            {rowData.candidates}
                                                        </td>
                                                        <td>
                                                            {rowData.deadline}
                                                        </td>
                                                        <td>
                                                            <span className='badge badge-light-success fs-6 fw-bold'>Completed</span>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {/* <tr className='text-center fw-bold text-gray-800 '>
                                                    <td>
                                                        #10746
                                                    </td>
                                                    <td>
                                                        UI/UX Designer
                                                    </td>
                                                    <td>
                                                        4
                                                    </td>
                                                    <td>
                                                        1 Day
                                                    </td>
                                                    <td>
                                                        <span className='badge badge-light-primary fs-6 fw-bold'>On Process</span>
                                                    </td>
                                                </tr>
                                                <tr className='text-center fw-bold text-gray-800 '>
                                                    <td>
                                                        #10706
                                                    </td>
                                                    <td>
                                                        Mobile Developer
                                                    </td>
                                                    <td>
                                                        7
                                                    </td>
                                                    <td>
                                                        4 Days
                                                    </td>
                                                    <td>
                                                        <span className='badge badge-light-warning fs-6 fw-bold'>In Active</span>
                                                    </td>
                                                </tr> */}
                                                {/* <tr className='text-center fw-bold text-gray-800 '>
                                                    <td>
                                                        #10246
                                                    </td>
                                                    <td>
                                                        Web Developer
                                                    </td>
                                                    <td>
                                                        1
                                                    </td>
                                                    <td>
                                                        0 Day
                                                    </td>
                                                    <td>
                                                        <span className='badge badge-light-danger fs-6 fw-bold'>Expired</span>
                                                    </td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6'>
                                            <div className='shadow-sm p-3 rounded mb-5 ms-5 me-5'>
                                                <ProgressBar variant="info" className='mb-2' now={now} label={`${now}%`} />
                                                <div className='d-flex align-items-center ms-3'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-info me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a href='#' className='fw-bold text-gray-800 text-hover-info fs-6'>
                                                            Application
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-6'>
                                            <div className='shadow-sm p-3 rounded mb-5 ms-5 me-5'>
                                                <ProgressBar variant="primary" className='mb-2' now={now} label={`${now}%`} />
                                                <div className='d-flex align-items-center ms-3'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                            Shortlist
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6'>
                                            <div className='shadow-sm p-3 rounded mb-5 ms-5 me-5'>
                                                <ProgressBar variant="warning" className='mb-2' now={now} label={`${now}%`} />
                                                <div className='d-flex align-items-center ms-3'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-warning me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a href='#' className='fw-bold text-gray-800 text-hover-warning fs-6'>
                                                            Applied
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-6'>
                                            <div className='shadow-sm p-3 rounded mb-5 ms-5 me-5'>
                                                <ProgressBar variant="success" className='mb-2' now={now} label={`${now}%`} />
                                                <div className='d-flex align-items-center ms-3'>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-success me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a href='#' className='fw-bold text-gray-800 text-hover-success fs-6'>
                                                            Selected
                                                        </a>
                                                    </div>
                                                </div>
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

export default RecuritingStatus