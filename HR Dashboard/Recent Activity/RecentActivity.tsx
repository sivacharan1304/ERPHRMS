import React, { useEffect, useState } from 'react'
import SessionManager from '../../../modules/auth/components/Session'
import { get } from '../../Service/Services'

type Props = { className: string }

function RecentActivity({ className }: Props) {
    const [data, setData] = useState([])
    const Empcode = SessionManager.getEmpID()

    const filllist = () => {
        get('HRDashBoard/HRDashBoard?empCode=' + Empcode).then((result) => {
            var i = 1
            let data1: any = []
            result.data.activity.map((obj: any) => {
                data1.push({
                    
                    message:obj.message,

                    
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
            <div
                className={` ${className}`}
            >
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='card rounded'>
                            <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                                <h3 className='card-title text-gray-800 fw-bold'>
                                    Recent Activity
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

                            {data.map((rowData: any, index: any) => (
											<div className='flex-grow-1 me-5 ms-5 mb-5'>
                                            <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                {rowData.message}
                                            </a>
                                            <span className='text-muted fw-semibold d-block'>22 hrs  ago</span>
                                        </div>
										))}
                                
                                {/* <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                        You change the password of your login
                                    </a>
                                    <span className='text-muted fw-semibold d-block'>2 days ago</span>
                                </div>
                                <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                        You update the certificate document
                                    </a>
                                    <span className='text-muted fw-semibold d-block'>12 days ago</span>
                                </div>
                                <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                        You update the certificate document
                                    </a>
                                    <span className='text-muted fw-semibold d-block'>12 days ago</span>
                                </div>
                                <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                        You update the certificate document
                                    </a>
                                    <span className='text-muted fw-semibold d-block'>12 days ago</span>
                                </div>
                                <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                        You update the certificate document
                                    </a>
                                    <span className='text-muted fw-semibold d-block'>12 days ago</span>
                                </div> */}

                                <div className='d-flex justify-content-end mb-5 mt-7 me-5'>
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
        </>
    )
}

export default RecentActivity