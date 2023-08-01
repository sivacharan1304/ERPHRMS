import React from 'react'
import { KTIcon } from '../../../../_metronic/helpers'

type Props = {
    className: string
    ProjectCount: number
    Resultproject: any
}

function ProjectHandler({ className, ProjectCount, Resultproject }: Props) {
    // console.log(Resultproject);
    
    return (
        <>
            <div
                className={` ${className}`}
            >

                <div className='card rounded ' style={{ background: "#e6e6fa" }}>
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
                                <p className='card-label fw-bold fs-3 mb-1 '>Projects Handling</p>
                                <p className='text-black fw-bold fs-1 mb-1'>
                                    {ProjectCount}
                                </p>
                            </div>
                            <div className='d-flex justify-content-center gap-5 mb-5 mt-3'>
                                {/* <p className='btn btn-sm btn-light-success '>
                                    1 Completed
                                </p>
                                <p
                                    className='btn btn-sm btn-light-warning '
                                >
                                    2 Pending
                                </p> */}

                                <span className='badge badge-light-success fs-8 fw-bold rounded'>
                                    {Resultproject.completeProjects !== undefined ? Resultproject.completeProjects : null}{' '}
                                    Completed</span>

                                <span className='badge badge-light-warning fs-8 fw-bold rounded'>
                                    {Resultproject.pendingProjects !== undefined ? Resultproject.pendingProjects : null} {' '}
                                    pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectHandler