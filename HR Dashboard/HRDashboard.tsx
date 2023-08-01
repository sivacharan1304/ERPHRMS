import React, { useEffect } from 'react'
import LeaveCard from './Leave Card/LeaveCard'
import RecuritingStatus from './Recuriting Status/RecuritingStatus'
import Employee from './HR Details/Employee'
import Roles from './HR Details/Roles'
import Requests from './HR Details/Requests'
import DateCalendarServerRequest from './Calendar/Calendar'
import EmployeeAttrition from './Employee Attrition Rate/Employee Attrition'
import EmployeeDetails from './Employee Details/Employee Details'
import EmployeeSkills from './Employee Skills Matrix/Employee Skills'
import NewsAnnouncement from './News & Announcement/NewsAnnouncement'
import NewsAndAnnouncement from './News & Announcement/NewsAnnouncement'
import RecentActivity from './Recent Activity/RecentActivity'
import SessionManager from '../../modules/auth/components/Session'
import { get } from '../Service/Services'

type Props = {}

function  HRDashboard({ }: Props) {
    const UserName=SessionManager.getUserName()
    const speed = 120; // Example speed value

    return (
        <>
            <h2>Welcome {UserName}</h2>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-7 col-md-12'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <LeaveCard className='mb-5' />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <div className='row'>
                                    <RecuritingStatus className='mb-5' />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <DateCalendarServerRequest className='mb-5' />
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-5 col-md-12'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <Employee className='mb-5' />
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6'>
                                            <Roles className='mb-5' />
                                        </div>
                                        <div className='col-lg-6 col-md-6'>
                                            <Requests className='mb-5' />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <RecentActivity className='mb-5' />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <NewsAndAnnouncement className='mb-5' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-12'>
                            <EmployeeAttrition className='mb-5' />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <EmployeeDetails className='mb-5' />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <EmployeeSkills className='mb-5' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HRDashboard