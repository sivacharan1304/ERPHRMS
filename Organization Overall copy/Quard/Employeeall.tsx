import { KTIcon } from '../../../../_metronic/helpers'
// import stock from '../../../_metronic/assets/logo/stock.png'
// import downstock from '../../../_metronic/assets/logo/down-arrow.png'

type Props = {
    className: string
    EmployeeCount: number,
    EmployeeResult: any
}

function Employeeall({ className, EmployeeCount, EmployeeResult }: Props) {
    return (
        <>
            {/* <div
                className={` ${className}`}
            >
                <div className='card rounded' style={{ background: "#e6e6fa" }}>
                    <div className=' border-0 d-flex justify-content-end me-7 mb-3'>
                        <h3 className='card-title text-gray-800 fw-bold'>
                        </h3>
                        <div className='card-toolbar w-10px h-10px'>
                            <button
                                className='btn btn-sm btn-icon btn-bg-none btn-active-color-primary'
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'>
                                <i className='bi bi-three-dots-vertical fs-7'></i>
                            </button>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="text-center">
                            <div className=' d-flex flex-column'>
                                <p className='card-label fw-bold fs-3'>Employee</p>
                                <p className='text-black fw-bold fs-1'>
                                    45
                                </p>
                            </div>


                            <div className='d-flex gap-4 justify-content-center'>
                                <p className='fs-10 my-0'>
                                    Active Employee
                                </p>
                                <p className='fs-10 my-0'>
                                    Inactive Employee
                                </p>
                            </div>

                            <div className='d-flex gap-12 justify-content-center'>

                                <p className='rounded fs-10 bg-light-success'>
                                    <img  /><span className='mx-1'>10%</span></p>

                                <p className='rounded fs-10 bg-light-warning'>
                                    <img  /> <span className='mx-1'>2%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div
                className={` ${className}`}
            >
                <div className='card rounded ' style={{ background: "#AFEEEE" }}>
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
                                <p className='text-black fw-bold fs-1 mb-1'>
                                  30  {/* {EmployeeCount} */}
                                </p>
                            </div>

                            <div className='d-flex justify-content-center gap-5 mb-4'>
                                <div className=''>
                                    <p className='fw-bold text-gray-800  fs-8 mb-1'>Active Employee</p>
                                    <span className='badge badge-light-success fs-8 fw-bold rounded'>
                                        <button
                                            type='button'
                                            className='btn btn-icon btn-sm h-auto btn-color-success justify-content-end me-1'>
                                            <KTIcon iconName='chart-line-up' className='fs-5' />
                                        </button>{EmployeeResult.activeEmployees}%</span>
                                </div>
                                <div className=''>
                                    <p className='fw-bold text-gray-800 fs-8 mb-1'>Inactive Employee</p>
                                    <span className='badge badge-light-danger fs-8 fw-bold rounded'>
                                        <button
                                            type='button'
                                            className='btn btn-icon btn-sm h-auto btn-color-danger justify-content-end me-1'>
                                            <KTIcon iconName='chart-line-down' className='fs-5' />
                                        </button>{EmployeeResult.inactiveEmployees}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Employeeall