import React from 'react'
import LeaveCard from './Leave Card/LeaveCard'
import ProjectHandling from './Quad Card/Project Handling'
import Task from './Quad Card/Task'
import Department from './Quad Card/Department'
import Roles from './Quad Card/Roles'
import TeamAvailability from './Team Availability/TeamAvailability'
import RecentActivity from './Recent Activity/RecentActivity'
import NewsAnnouncement from './News & Announcement/NewsAnnouncement'
import EmployeeOverall from './Employee Overall Status/EmployeeOverall'
import SessionManager from '../../modules/auth/components/Session'
import { useEffect } from 'react'


type Props = {}

function EmployeeDashboard({ }: Props) {

    useEffect(() => {
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
    }, [])

   
        const username = SessionManager.getUserName()
       
        return (
            <>
                <h2>Welcome, Hi {username}</h2>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-lg-7 col-md-12'>
                            <div className='row'>
                                <div className='col-lg-12 col-md-12'>
                                    {/* Leave Card Start */}

                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12'>
                                            <LeaveCard className='mb-5' />
                                        </div>
                                    </div>

                                    {/* Leave Card End */}

                                    <div className='row'>
                                        {/* Team Availability Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <TeamAvailability className='mb-5' />
                                        </div>

                                        {/* Team Availability End */}

                                        {/* Recent Activity Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <RecentActivity className='mb-5' />
                                        </div>

                                        {/* Recent Activity End */}
                                    </div>

                                    <div className='row'>
                                        {/* New & Announcement Start */}

                                        <div className='col-lg-12 col-md-12'>
                                            <NewsAnnouncement className='mb-5' />
                                        </div>

                                        {/* New & Announcement End*/}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-5 col-md-12'>
                            <div className='row'>
                                <div className='col-lg-12 col-md-12'>
                                    <div className='row'>
                                        {/* Project Handling Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <ProjectHandling className='mb-5' />
                                        </div>

                                        {/* Project Handling End */}

                                        {/* Department Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <Department className='mb-5 ' />
                                        </div>

                                        {/* Department Start */}
                                    </div>
                                </div>
                                <div className='col-lg-12 col-md-12'>
                                    <div className='row'>
                                        {/* Task Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <Task className='mb-5' />
                                        </div>

                                        {/* Task End */}

                                        {/* Roles Start */}

                                        <div className='col-lg-6 col-md-6'>
                                            <Roles className='mb-5' />
                                        </div>

                                        {/* Roles Start */}
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='row'>
                                        {/* Employee Over All Start */}

                                        <div className='col-lg-12 col-md-12'>
                                            <EmployeeOverall className='mb-5' />
                                        </div>

                                        {/* Employee Over All Start */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }


export default EmployeeDashboard