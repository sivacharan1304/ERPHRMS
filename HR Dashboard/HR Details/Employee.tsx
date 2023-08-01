import React, { useEffect, useState } from 'react'

import Chart from 'react-apexcharts';
import { KTIcon } from '../../../../_metronic/helpers';
import { get } from '../../Service/Services';
import SessionManager from '../../../modules/auth/components/Session';

type Props = {
    className: string
}

function Employee({ className }: Props) {
    const [EmpTotal, setEmpTotal] = useState([])
    const Empcode = SessionManager.getEmpID()

    const filllist = () => {
		get('HRDashBoard/HRDashBoard?empCode=' + Empcode).then((result) => {
			setEmpTotal(result.data.employeeTotal)
		})
	}
    useEffect(() => {
		filllist()
	}, [])
    const chartData = [4, 2];
    const chartOptions = {

        options: {
            Chart: {
                type: 'donut'
            },
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
            labels: ['Male', 'Female'],
            dataLabels: {
                style: {
                    fontSize: '14px',
                    colors: ['#000000'],
                    fontWeight: 'bold',
                },
            },
        },
    };


    return (
        <>
            <div
                className={` ${className}`}
            >
                <div className='card rounded ' style={{ background: "#ffefd5" }}>
                    <div className='card-header border-0 mb-3 ms-5 mt-3 me-5'>
                        <h3 className='card-title text-gray-800 fw-bold'>
                        </h3>
                        <div className='card-toolbar'>
                            <button
                                className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'>
                                <i className='bi bi-three-dots-vertical fs-3'></i>
                            </button>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="text-center">
                            <div className=' d-flex flex-column p-4'>
                                <p className='card-label fw-bold fs-3 mb-1 '>Employee</p>
                                <p className='text-black fw-bold fs-1'>
                                    {EmpTotal}
                                </p>
                            </div>

                            <div className='d-flex justify-content-center gap-15 mb-5 mt-5'>
                                <div className=''>
                                    <p className='fw-bold text-gray-800  fs-6 mb-1'>New Employee</p>
                                    <span className='badge badge-light-success fs-6 fw-bold rounded'>
                                        <button
                                            type='button'
                                            className='btn btn-icon btn-sm h-auto btn-color-success justify-content-end me-1'>
                                            <KTIcon iconName='chart-line-up' className='fs-2' />
                                        </button>14%</span>
                                </div>
                                <div className=''>
                                    <p className='fw-bold text-gray-800 fs-6 mb-1'>Resigned Employee</p>
                                    <span className='badge badge-light-danger fs-6 fw-bold rounded'>
                                        <button
                                            type='button'
                                            className='btn btn-icon btn-sm h-auto btn-color-danger justify-content-end me-1'>
                                            <KTIcon iconName='chart-line-down' className='fs-2' />
                                        </button>7.0%</span>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center mb-5 me-5'>
                                <Chart
                                    options={chartOptions.options}
                                    series={chartData}
                                    type="donut"
                                    width="230"
                                />
                            </div>
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
        </>
    )
}

export default Employee