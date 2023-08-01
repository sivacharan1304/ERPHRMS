import React, { useEffect, useState } from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import { get } from '../../../component/Service/Services'

type Props = {
	className: string
}

function Roles({className}: Props) {
	const [Role, setRole] = useState(0)
	const filllist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode=10').then((result) => {
			setRole(result.data.role)
		})
	}

	useEffect(() => {
		filllist()
	}, [])

	return (
		<>
			<div className={` ${className}`}>
				<div className='card rounded ' style={{background: '#ffc0cb'}}>
					<div className='card-header border-0 mb-3 ms-5 mt-3 me-5'>
						<h3 className='card-title text-gray-800 fw-bold'></h3>
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
						<div className='text-center'>
							<div className=' d-flex flex-column p-4'>
								<p className='card-label fw-bold fs-3 mb-1 '>Roles</p>
								<p className='text-black fw-bold fs-1'>{Role}</p>
							</div>
						</div>
						<div className='d-flex justify-content-end mb-5 mt-4 me-5'>
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
		</>
	)
}

export default Roles
