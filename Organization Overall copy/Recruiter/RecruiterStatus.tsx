import React from 'react'
import Barcharters from './Barcharters'
import Select from 'react-select';
type Props = {
  className: string
  RecruitingData: any
}

function RecruiterStatus({ className, RecruitingData }: Props) {
  return (
    <>
      <div className={` ${className}`}>
        <div className="card" >
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-6 col-md-6'>
                <div className='card'>
                  <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                    <h3 className='card-title text-gray-800  fw-bold'>
                      Recuriting Status
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
                    <div className="table-responsive ms-5 me-5 mb-7 shadow-sm p-3 rounded">
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1 gy-2'>

                        <thead className="w-120 " style={{ background: "#0095e8" }}>
                          <tr className='text-muted  fw-semibold  text-center'>

                            <th className='min-w-150px text-white'>Job Id
                            </th>
                            <th className='min-w-150px text-white'>Role
                            </th>
                            <th className='min-w-150px text-white'>Candidates
                            </th>
                            <th className='min-w-150px text-white'>Deadline
                            </th>
                            <th className='min-w-150px text-white'>Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            RecruitingData.map((record: any, index: any) => (
                              <tr key={index} className='text-center'>
                                <td>{record.jobID}</td>
                                <td>{record.role}</td>
                                <td>{record.candidates}</td>
                                <td>{record.deadline}</td>
                                {
                                  record.status === 'completed' ?
                                    <span className='badge badge-light-success fs-6 fw-bold'>Completed</span> : null
                                }
                                {
                                  record.status === 'expired' ?
                                    <span className='badge badge-light-danger fs-6 fw-bold'>Expired</span> : null
                                }
                                {
                                  record.status === 'in active' ?
                                    <span className='badge badge-light-warning fs-6 fw-bold'>In Active</span> : null
                                }
                                {
                                  record.status === 'in progress' ?
                                    <span className='badge badge-light-primary fs-6 fw-bold'>On Process</span> : null
                                }
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
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


              <div className='col-lg-6 col-md-6'>
                <div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
                  <h3 className='card-title'>
                    <Select
                      name="Designation"
                      className='pt-2'
                      placeholder="Designation"
                      components={{
                        IndicatorSeparator: () => null
                      }}
                      styles={{
                        menu: (base) => ({
                          ...base,
                          width: "max-content",
                          minWidth: "100%"
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: "#E1E3EA",
                          borderRadius: "0.425rem",
                          height: 10,

                          fontSize: "15px! important",
                          boxShadow: state.isFocused ? ' 0 0 0 0.25rem rgba(0, 123, 255, 0.25)' : '#E1E3EA',
                          minHeight: state.isFocused ? '31px !important' : '31px !important',
                          padding: state.isFocused ? '0 8px !important' : '0 8px !important',

                          '&:hover': {
                            border: 'E1E3EA'
                          }
                        }),
                      }}
                    />
                  </h3>

                  <div className='card-toolbar'>
                    <Select
                      name="Month"
                      className='pt-2'
                      placeholder="Month"
                      components={{
                        IndicatorSeparator: () => null
                      }}
                      styles={{
                        menu: (base) => ({
                          ...base,
                          width: "max-content",
                          minWidth: "100%"
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: "#E1E3EA",
                          borderRadius: "0.425rem",
                          height: 10,

                          fontSize: "15px! important",
                          boxShadow: state.isFocused ? ' 0 0 0 0.25rem rgba(0, 123, 255, 0.25)' : '#E1E3EA',
                          minHeight: state.isFocused ? '31px !important' : '31px !important',
                          padding: state.isFocused ? '0 8px !important' : '0 8px !important',

                          '&:hover': {
                            border: 'E1E3EA'
                          }
                        }),
                      }}
                    />
                  </div>
                </div>
                <Barcharters />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default RecruiterStatus