import { Tab, Tabs } from 'react-bootstrap'

type Props = {
    className: string
    NewData: any
    taskdata: any
}

function NewsAnnouncements({ className, NewData, taskdata }: Props) {
    console.log(NewData);

    return (
        <>
            <div className={` ${className}`}>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='card rounded '>
                            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className='mt-5'>
                                <Tab eventKey={1} title="News & Announcements" tabClassName='fw-bold' className='mt-8'>
                                    <div className='card-body'>
                                        {
                                            NewData.map((record: any, index: any) => (
                                                <div className='d-flex align-items-center mb-5 ms-5 me-5' key={index}>
                                                    <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                            {record.message}
                                                        </a>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className='d-flex justify-content-end gap-5  mb-5 mt-3 me-5'>
                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary '
                                            >
                                                Create
                                            </a>

                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary '
                                            >
                                                View All
                                            </a>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey={2} title="Task" tabClassName=' fw-bold' className='mt-8'>
                                    <div className='card-body'>
                                        {
                                            taskdata.map((record: any, index: any) => (
                                                <div className='d-flex align-items-center mb-5 ms-5 me-5' key={index}>
                                                    <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                                    <div className='flex-grow-1'>
                                                        <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                          {record.taskDecs}
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        {/* 
                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Company celebrates its 6th Anniversary
                                                </a>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    System maintenance for 2 hours
                                                </a>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    System maintenance for 2 hours
                                                </a>
                                        </div>
                                            </div> */}
                                        < div className='d-flex justify-content-end gap-5  mb-5 me-5' >
                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary'
                                            >
                                                Create
                                            </a>

                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary '
                                            >
                                                View All
                                            </a>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey={3} title="Alerts" tabClassName=' fw-bold' className='mt-8' >
                                    <div className='card-body'>
                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-rounded h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Salary updated for project B team members
                                                </a>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Company celebrates its 6th Anniversary
                                                </a>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    System maintenance for 2 hours
                                                </a>
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-5 ms-5 me-5'>
                                            <span className='bullet bullet-circle h-10px w-10px bg-primary me-3'></span>
                                            <div className='flex-grow-1'>
                                                <a className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    System maintenance for 2 hours
                                                </a>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-end gap-5 mb-5 me-5'>
                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary '
                                            >
                                                Create
                                            </a>

                                            <a
                                                href='#'
                                                className='btn btn-sm btn-light-primary '
                                            >
                                                View All
                                            </a>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default NewsAnnouncements