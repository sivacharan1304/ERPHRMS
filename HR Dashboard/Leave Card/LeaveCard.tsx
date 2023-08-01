import React, {useEffect, useState} from 'react'
import CircleBarOne from './Circle Bar/CircleBarOne'
import CircleBarThree from './Circle Bar/CircleBarThree'
import CircleBarTwo from './Circle Bar/CircleBarTwo'
import CircleBarFour from './Circle Bar/CircleBarFour'
import CircleBarFive from './Circle Bar/CircleBarFive'
import CircleBarSix from './Circle Bar/CircleBarSix'
import {get} from '../../../component/Service/Services'
import SessionManager from '../../../modules/auth/components/Session'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

type Props = {className: string}

function LeaveCard({className}: Props) {

	const [sick, setSick] = useState(0)
	const [annual, setAnnual] = useState(0)
	const [lop, setLop] = useState(0)
	const [earned, setEarned] = useState(0)
	const [sickleavetotal, setSickLeavetotal] = useState(0)
	const [sickleavecondays, setSickLeavecondays] = useState(0)
	const [sickleavebl, setSickLeavebl] = useState(0)
	const [annualleavetotal, setAnnualLeavetotal] = useState(0)
	const [annualleavecondays, setAnnualLeavecondays] = useState(0)
	const [annualleavebl, setAnnualLeavebl] = useState(0)
	const [lopleavetotal, setLopLeavetotal] = useState(0)
	const [lopleavecondays, setLopLeavecondays] = useState(0)
	const [lopleavebl, setLopLeavebl] = useState(0)
	const [earnedleavetotal, setEarnedLeavetotal] = useState(0)
	const [earnedleavecondays, setEarnedLeavecondays] = useState(0)
	const [earnedleavebl, setEarnedLeavebl] = useState(0)
	const [days, setDays] = useState(0)
	const [leaveTypeoptions, setleaveTypeoptions] = useState([]);
    const [data, setData] = useState([]);
    const [rowData, setrowData] = useState([]);
    const [approvedData, setapprovedData] = useState([]);
    const [approval, setapproval] = useState([]);
    const [rowDataApproval, setrowDataApproval] = useState([]);

	const percentageone = sick
	const percentagetwo = annual
	const percentagethree = lop
	const percentagefour = earned
    const empCode = SessionManager.getEmpID();
    const percentagefive = 90;
    const percentagesix = 80;
	const [data2, setData2] = useState([])
	const Empcode = SessionManager.getEmpID()

	const fillSummarylist = () => {
		get('DashBoard/GetEmployeeByEmployeeCode?empCode=' + Empcode).then((result) => {
			var i = 1
			let data1: any = []
			result.data.summary.map((obj: any) => {
				data1.push({
					leaveType:obj.leaveType,
					status:obj.status,
				})
				i = i + 1
			})
			setData2(data1)
			console.log(data1)
			

		})
	}

	useEffect(() => {
		fillSummarylist()
	}, [])
	
	const filllist = () => {
        get('LeaveType/GetAllLeaveType')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.id,
                            label: obj.type,
                        })
                })
                setleaveTypeoptions(data2)
            })

        get('Leave/GetAllLeaveByEmpCode?empcode=' + empCode)
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: any) => {
                    data1.push(
                        {
                            id: obj.id,
                            leaveTypeID: obj.leaveTypeID,
                            leaveType: obj.leaveType,
                            startDate: dayjs(obj.startDate).format('YYYY-MM-DD'),
                            endDate: dayjs(obj.endDate).format('YYYY-MM-DD'),
                            status: obj.status,
                        })
                    i = i + 1;
                })
                setData(data1)
                setrowData(data1)
            })

        get('Leave/GetApprovalDenied?ReportingManagerEmpcode=' + empCode)
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: any) => {
                    data1.push(
                        {
                            id: obj.id,
                            leaveTypeID: obj.leaveTypeID,
                            leaveType: obj.leaveType,
                            empFirstName: obj.empFirstName,
                            empMiddleName: obj.empMiddleName,
                            empLastName: obj.empLastName,
                            startDate: dayjs(obj.startDate).format('YYYY-MM-DD'),
                            endDate: dayjs(obj.endDate).format('YYYY-MM-DD'),
                            status: obj.status,
                        })
                    i = i + 1;
                })
                setapprovedData(data1)
            })

        get('LeaveApproval/GetAllWaitingLeave?REmpcode=' + empCode)
            .then((result) => {
                var i = 1;
                let data2: any = []
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            id: obj.id,
                            empCode: obj.empCode,
                            leaveType: obj.leaveType,
                            leaveTypeID: obj.leaveTypeID,
                            empTitle: obj.empTitle,
                            empFirstName: obj.empFirstName,
                            empMiddleName: obj.empMiddleName,
                            empLastName: obj.empLastName,
                            empNickName: obj.empNickName,
                            status: obj.status,
                            startDate: dayjs(obj.startDate).format('YYYY-MM-DD'),
                            endDate: dayjs(obj.endDate).format('YYYY-MM-DD'),
                        })
                    i = i + 1;
                })
                setapproval(data2)
                setrowDataApproval(data2)
            })
    }
	useEffect(() => {
        // if (SessionManager.getUserID() == null) {
        //     window.location.href = "/hrms/auth";
        // }

        filllist()
        SessionManager.getisReportingManager()
        console.log(SessionManager.getisReportingManager());
    }, [])

    /* Leave balance calculation while page loading */
    useEffect(() => {
        get(`Leave/GetBalance?empcode=${empCode}&leaveTypeID=27`)
            .then((result) => {
                setSickLeavebl(result.data[0].balance)
                setSickLeavecondays(result.data[0].consumedDays)
                setSickLeavetotal(result.data[0].totalDays)
            })
        setSick(sickleavecondays / sickleavetotal * 100);
        get(`Leave/GetBalance?empcode=${empCode}&leaveTypeID=28`)
            .then((result) => {
                setAnnualLeavebl(result.data[0].balance)
                setAnnualLeavecondays(result.data[0].consumedDays)
                setAnnualLeavetotal(result.data[0].totalDays)
            })
        setAnnual(annualleavecondays / annualleavetotal * 100);
        get(`Leave/GetBalance?empcode=${empCode}&leaveTypeID=29`)
            .then((result) => {
                setLopLeavebl(result.data[0].balance)
                setLopLeavecondays(result.data[0].consumedDays)
                setLopLeavetotal(result.data[0].totalDays)
            })
        setLop(lopleavecondays / lopleavetotal * 100);

        get(`Leave/GetBalance?empcode=${empCode}&leaveTypeID=30`)
            .then((result) => {
                setEarnedLeavebl(result.data[0].balance)
                setEarnedLeavecondays(result.data[0].consumedDays)
                setEarnedLeavetotal(result.data[0].totalDays)
            })
        setEarned(earnedleavecondays / earnedleavetotal * 100);
    })

	return (
		<>
			<div className={` ${className}`}>
				<div className='card rounded'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='card'>
								<div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
									<h3 className='card-title text-gray-800  fw-bold'>Leave Card</h3>
									<div className='card-toolbar'>
										<a href='/hrms/leave' className='btn btn-sm btn-light-primary '>
											Apply Leave
										</a>
									</div>
								</div>
								<div className='card-body'>
									<div
										id='carouselExampleControls'
										className='carousel carousel-dark slide'
										data-bs-ride='carousel'
									>
										<div className='carousel-inner'>
											<div className='carousel-item active'>
												<div className='cards-wrapper'>
													<div className='card Slider'>
                                                    <CircleBarOne percentageone={percentageone}
                                                                leavecondays={sickleavecondays}
                                                                leavetotal={sickleavetotal}
                                                                leavebl={sickleavebl} />
													</div>

													<div className='card Slider  d-none d-md-block'>
                                                    <CircleBarTwo percentagetwo={percentagetwo}
                                                                leavecondays={annualleavecondays}
                                                                leavetotal={annualleavetotal}
                                                                leavebl={annualleavebl} />
													</div>

													<div className='card Slider  d-none d-md-block'>
                                                    <CircleBarThree percentagethree={percentagethree}
                                                                leavecondays={lopleavecondays}
                                                                leavetotal={lopleavetotal}
                                                                leavebl={lopleavebl} />
													</div>
												</div>
											</div>

											<div className='carousel-item'>
												<div className='cards-wrapper'>
													<div className='card Slider '>
                                                    <CircleBarFour percentagefour={percentagefour}
                                                                leavecondays={earnedleavecondays}
                                                                leavetotal={earnedleavetotal}
                                                                leavebl={earnedleavebl} />
													</div>
													<div className='card Slider  d-none d-md-block'>
														<CircleBarFive percentageFive={percentagefive} />
													</div>
													<div className='card Slider  d-none d-md-block'>
														<CircleBarSix percentageSix={percentagesix} />
													</div>
												</div>
											</div>
										</div>

										<button
											className='carousel-control-prev'
											type='button'
											data-bs-target='#carouselExampleControls'
											data-bs-slide='prev'
										>
											<span className='carousel-control-prev-icon' aria-hidden='true'></span>
											<span className='visually-hidden'>Previous</span>
										</button>
										<button
											className='carousel-control-next'
											type='button'
											data-bs-target='#carouselExampleControls'
											data-bs-slide='next'
										>
											<span className='carousel-control-next-icon' aria-hidden='true'></span>
											<span className='visually-hidden'>Next</span>
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='card'>
								<div className='card-header border-0 mb-5 ms-5 mt-5 me-5'>
									<h3 className='card-title text-gray-800 fw-bold'>Leave Summary</h3>
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
								{data.map((rowData: any, index: any) => (
												<div className='flex-grow-1 me-5 ms-5 mb-5 '>
												<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
													You applied for {rowData.leaveType} is {rowData.status}
												</a>
												<span className='text-muted fw-semibold d-block'>10 mins ago</span>
											</div>
										))}
								
									{/* <div className='flex-grow-1 me-5 ms-5 mb-5 '>
										<a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
											You applied for Casual Leave is Approved
										</a>
										<span className='text-muted fw-semibold d-block'>1 month ago</span>
									</div> */}

									<div className='d-flex justify-content-end mb-5 me-5'>
										<a href='#' className='btn btn-sm btn-light-primary '>
											View All
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default LeaveCard
