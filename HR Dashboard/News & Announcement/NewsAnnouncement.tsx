import React, { useEffect, useState } from 'react'
import SessionManager from '../../../modules/auth/components/Session'
import { get } from '../../Service/Services'

type Props = { className: string }

function NewsAndAnnouncement({ className }: Props) {
    const [data, setData] = useState([])
	const Empcode = SessionManager.getEmpID()

	const filllist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode=' + Empcode).then((result) => {
			var i = 1
			let data1: any = []
			result.data.news.map((obj: any) => {
				data1.push({
					message: obj.message,
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
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='card rounded '>
                            <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                                <h3 className='card-title text-gray-800 fw-bold'>
                                    News & Announcements
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
                                         <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                         <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                         <div className='flex-grow-1'>
											<a className='fw-bold text-gray-800 text-hover-primary fs-6' key={rowData.index}>
												{rowData.message}
											</a>
                                            </div>
                                </div>
										))}
                                    

                                {/* <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                    <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                    <div className='flex-grow-1'>
                                        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                            Company celebrates its 6th Anniversary
                                        </a>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                    <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                    <div className='flex-grow-1'>
                                        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                            System maintenance for 2 hours
                                        </a>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                    <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                    <div className='flex-grow-1'>
                                        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                            System maintenance for 2 hours
                                        </a>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                    <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                    <div className='flex-grow-1'>
                                        <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                            System maintenance for 2 hours
                                        </a>
                                    </div>
                                </div> */}
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
        </>
    )
}

export default NewsAndAnnouncement