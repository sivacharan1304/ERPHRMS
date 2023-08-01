import React, { useEffect, useState } from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import SessionManager from '../../../modules/auth/components/Session'
import { get } from '../../../component/Service/Services'

type Props = {className: string}

function TeamAvailability({className}: Props) {
	const [data, setData] = useState([])
	const Empcode = SessionManager.getEmpID()

	const filllist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode='+Empcode).then((result) => {
			setData(result.data.team)
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
								<h3 className='card-title text-gray-800 fw-bold'>Team Availabilty(5)</h3>
								<div className='card-toolbar'>
									<button
										className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
										data-kt-menu-trigger='click'
										data-kt-menu-placement='bottom-end'
										data-kt-menu-flip='top-end'
									>
										<i className='bi bi-three-dots-vertical fs-3'></i>
									</button>
								</div>
							</div>
							<div className='card-body'>
								{data.map((rowData:any,index:any)=>(
								<div className='d-flex align-items-center mb-5 ms-5 me-5' key={index}>
									<div className='flex-grow-1 '>
										<a className='fw-bold text-gray-800 text-hover-primary fs-6'>
										{rowData}
										</a>
									</div>
									<span className='badge badge-light-success fs-6 fw-bold'>Available</span>
								</div>
								))}
								{/* <div className='d-flex align-items-center mb-5 ms-5 me-5'>
									<div className='flex-grow-1'>
										<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
										Mr krishnaMooorthy Sekar
										</a>
									</div>
									<span className='badge badge-light-success fs-6 fw-bold'>Available</span>
								</div>
								<div className='d-flex align-items-center mb-5 ms-5 me-5'>
									<div className='flex-grow-1'>
										<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
										Ms vimaladevi Sekar s
										</a>
									</div>
									<span className='badge badge-light-success fs-6 fw-bold'>Available</span>
								</div>
								<div className='d-flex align-items-center mb-5 ms-5 me-5'>
									<div className='flex-grow-1'>
										<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
										Ms Ranjitha Selvaraj S
										</a>
									</div>
									<span className='badge badge-light-danger fs-6 fw-bold'>Available</span>
								</div>
								<div className='d-flex align-items-center mb-5 ms-5 me-5'>
									<div className='flex-grow-1'>
										<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
										Mr SivaCharan R
										</a>
									</div>
									<span className='badge badge-light-danger fs-6 fw-bold'>Available</span>
								</div> */}

								<div className='d-flex justify-content-end mb-5 me-5'>
									<button
										type='button'
										className='btn btn-icon btn-sm h-auto btn-active-color-primary justify-content-end'
									>
										<KTIcon iconName='exit-right-corner' className='fs-2' />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default TeamAvailability
