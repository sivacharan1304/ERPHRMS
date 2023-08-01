import React from 'react'

type Props = {
    className: string
    ActivityData: any
}

function RecentActivity({ className, ActivityData }: Props) {
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
                            {
                                ActivityData.map((record: any, index: any) => (
                                    <div className='flex-grow-1 me-5 ms-5 mb-5'>
                                        <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                            {record.message}
                                        </a>
                                        <span className='text-muted fw-semibold d-block'>22 hrs  ago</span>
                                    </div>
                                ))
                            }
                            <div className='card-body'>
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

export default RecentActivity