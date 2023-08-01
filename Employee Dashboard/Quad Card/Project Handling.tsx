import React, {useEffect, useState} from 'react'
import SessionManager from '../../../modules/auth/components/Session'
import {get} from '../../../component/Service/Services'

type Props = {
	className: string
}

function ProjectHandling({className}: Props) {
	const [project, setproject] = useState(0)

	const filllist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode=10').then((result) => {
			setproject(result.data.project)
		})
	}

	useEffect(() => {
		filllist()
	}, [])
	return (
		<>
			<div className={` ${className}`}>
				<div className='card rounded ' style={{background: '#e6e6fa'}}>
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
								<p className='card-label fw-bold fs-3 mb-1 '>Projects Handling</p>
								<p className='text-black fw-bold fs-1'>{project}</p>
							</div>
							<div className='d-flex justify-content-center gap-5'>
								<p className='btn btn-sm btn-light-success '>0 Completed</p>
								<p className='btn btn-sm btn-light-warning '>2 Pending</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProjectHandling
