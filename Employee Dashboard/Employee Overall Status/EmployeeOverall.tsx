import React, {useState} from 'react'
import Chart from 'react-apexcharts'

import {ProgressBar} from 'react-bootstrap'
import {KTIcon} from '../../../../_metronic/helpers'
import { get } from '../../../component/Service/Services'
import SessionManager from '../../../modules/auth/components/Session'

type Props = {className: string}
const EmployeeOverall = ({className}: Props) => {
	const [data, setData] = useState([])
    const Empcode=SessionManager.getEmpID()

	const filllist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode='+Empcode).then((result) => {
			console.log(result)
			var i = 1
			let data1: any = []
			result.data.map((obj: any) => {
				data1.push({
					department:obj.department,
					role: obj.role,
					entityDesc: obj.entityDesc,
					isActive: obj.isActive ? 'Active' : 'In Active',
				})
				i = i + 1
			})
			setData(data1)
		})
	}

	const now = 0
	const chartOptions = {
		options: {
			responsive: [
				{
					breakpoint: 768,
					options: {
						chart: {
							width: '100%',
						},
						legend: {
							position: 'bottom',
							offsetY: 10,
							itemMargin: {
								horizontal: 10,
								vertical: 5,
							},
						},
					},
				},
			],
			labels: ['Extra Activities', 'Core', 'Certification', 'Competency Skills'],
			plotOptions: {
				pie: {
					dataLabels: {
						offset: -10, // Adjust the label position (in pixels)
						style: {
							fontSize: '14px', // Adjust the font size
							fontWeight: 'bold', // Adjust the font weight
						},
					},
				},
			},
		},
	}

	const chartData = [44, 55, 30, 20]

	return (
		<>
			<div className={` ${className}`}>
				<div className='card rounded'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='card'>
								<div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
									<h3 className='card-title text-gray-800 fw-bold'>Performance Statistics </h3>
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
									<Chart options={chartOptions.options} series={chartData} type='pie' width='390' />
									{/* <Chart options={options} series={series} type="pie" width="480" /> */}
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='card'>
								<div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
									<h3 className='card-title text-gray-800 fw-bold'>Employee Project Status</h3>
									<div className='card-toolbar'></div>
								</div>
								<div className='card-body'>
									<div className='ms-5 me-5 mb-5 shadow-sm p-3 rounded '>
										<a href='#' className='text-gray-800  fw-bold fs-5'>
											Project 1
										</a>
										<ProgressBar className='mt-3' now={now} label={`${now}%`} />
									</div>
									<div className='ms-5 me-5 mb-5 shadow-sm p-3 rounded '>
										<a href='#' className='text-gray-800  fw-bold fs-5'>
											Project 2
										</a>
										<ProgressBar variant='info' className='mt-3' now={now} label={`${now}%`} />
									</div>
									<div className='ms-5 me-5 mb-5 shadow-sm p-3 rounded '>
										<a href='#' className='text-gray-800  fw-bold fs-5'>
											Project 3
										</a>
										<ProgressBar variant='success' className='mt-3' now={now} label={`${now}%`} />
									</div>
									<div className='ms-5 me-5 mb-5 shadow-sm p-3 rounded '>
										<a href='#' className='text-gray-800  fw-bold fs-5 '>
											Project 4
										</a>
										<ProgressBar variant='warning' className='mt-3' now={now} label={`${now}%`} />
									</div>
								</div>
								<div className='d-flex justify-content-end mb-5 me-5 mt-4'>
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
export default EmployeeOverall
