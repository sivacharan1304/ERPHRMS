import { useState } from 'react';
import { KTIcon } from '../../../../_metronic/helpers'
import dayjs from 'dayjs';

type Props = {
    className: string
    Company: any
}

function Detail({ className, Company }: Props) {
    let d = new Date()
    const [now] = useState(d.toLocaleTimeString())

    return (
        <>
            <div className={` ${className}`}>
                <div className='card rounded ' style={{ background: "#f5f5dc" }}>
                    <div className='card-body'>
                        <div className='mt-5 ms-5 me-5'>
                            <div className='d-flex'>
                                <svg height="100" width="100">
                                    <circle cx="50" cy="50" r="40" fill="grey" />
                                </svg>
                                <div className='d-flex flex-column mt-3 ms-2'>
                                    <p className='fw-bold text-gray-800  fs-3 mb-3'>Qserve <small className='fs-6'>PVT. LTD</small></p>
                                    <p className='fw-bold text-gray-800  fs-6 mb-2'>Loaction : India</p>
                                    <p className='fw-bold text-gray-800  fs-6 mb-2'>Time : {now}</p>
                                    <p className='fw-bold text-gray-800  fs-6 mb-2'>Company ID : {Company.compID}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-end mb-5 mt-8 me-5'>
                                <button
                                    type='button'
                                    className='btn btn-icon btn-sm h-auto  btn-active-color-primary justify-content-end'
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

export default Detail