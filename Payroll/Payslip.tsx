/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import Autocomplete from "react-autocomplete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import Select from 'react-select';
import { log } from "console";
import SessionManager from "../../modules/auth/components/Session";
import { Delete, get, post, put } from '../Service/Services'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'

/* EmployeeSubGroup Function Start */
const Payslip = () => {

    /* Const Variable Initialization */

    const empCode = SessionManager.getEmpID();
    const [employeeCode, setemployeeCode] = useState("");
    const [employeeName, setemployeeName] = useState("");
    const [EmployeeC, setEmployeeC] = useState(0);
    const [EmployeerC, setEmployeerC] = useState(0);
    const [department, setDepartment] = useState(0);
    const [totalEarning, settotalEarning] = useState(0);
    const [netsalary, setnetsalary] = useState(0);
    const [hra, sethra] = useState(0);
    const [basic, setbasic] = useState(0);
    const [deduction, setdeduction] = useState(0);
    const [totalsalary, settotalsalary] = useState(0);
    const [allowance, setallowance] = useState([]);

    /* Initial Page Load Function */
    const filllist = () => {

    }

    const handleRowClick = () => {
        get('PayRollServices/GetallPayrollDetailsByEmpcode?empcode=' + empCode)
            .then((result) => {
                setallowance(result.data.payrollSubdetail)
                setemployeeCode(result.data.empCode)
                setemployeeName(result.data.empFirstName + " " + result.data.empMiddleName + " " + result.data.empLastName)
                settotalEarning(result.data.grossSalary)
                setEmployeeC(result.data.employeePensionAmount)
                setEmployeerC(result.data.employerPensionAmount)
                setdeduction(result.data.totalDeductions)
                setnetsalary(result.data.netSalary)
                setbasic(result.data.basic)
                sethra(result.data.hra)
                settotalsalary(result.data.totalEarning)
                setDepartment(result.data.department)
            })

    }

    useEffect(() => {
        // var s = SessionManager.getUserID();
        // if (SessionManager.getUserID() == null) {
        //     window.location.href = "/hrms/auth";
        // }
        filllist()
        handleRowClick()
    }, [])
    /* Form Validation */


    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            isActive: true,
            createdDate: dayjs()
        },

        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {

        },
    })
    /* Formik Library End*/

    /* Page Reset */
    const onReset = () => {

    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Payslip</h3>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-2' >
                        <div className="p-2">
                            <label className="form-label" >Pay Month</label>
                            <input className="form-control form-control-sm" onChange={formik.handleChange} name='month' type="month" value="2023-05"/>
                        </div>
                    </div>
                    <div className='col-lg-3' >
                        <div className="mt-10">
                            <a type="button" className="btn btn-sm btn-primary" >Download Payslip</a>
                        </div>
                    </div>
                </div>

                <div className="card card p-2 mb-5 mt-5 bg-white rounded ">
                    <div className="card-body">
                        <div className="container-fluid ">
                            <div className="mt-5 mb-5">
                                <div className="row">

                                    <div className="col-lg-4 col-md-4 ">
                                        <label className="form-label">Emp Name: {employeeName} </label>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <label className="form-label">Emp Code:   {employeeCode} </label>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <label className="form-label">Department:   {department}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-lg-6 col-md-6 border">
                                    <div className="table-responsive">
                                        <table className='table gs-1 gy-4'>
                                            <thead>
                                                <tr className='text-muted text-bolder border-bottom  text-start'>
                                                    <th className="min-w-450px">Earnings</th>
                                                    <th className="min-w-100px">Amount</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="">
                                                    <td>Basic</td>
                                                    <td>20000</td>
                                                </tr>
                                                <tr>
                                                    <td>HRA</td>
                                                    <td>1000</td>
                                                </tr>
                                                <tr>
                                                    <td>Allowance</td>
                                                    <td>100</td>
                                                </tr>

                                                <tr>
                                                    <td>Toatal Earnings</td>
                                                    <td>21100</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6  border">
                                    <div className="table-responsive">
                                        <table className='table gs-1 gy-4'>
                                            <thead>
                                                <tr className='text-muted text-bolder border-bottom'>
                                                    <th className="min-w-450px text-start">Deduction</th>
                                                    <th className="min-w-100px text-start">Amount</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <td>Employer Contribution</td>
                                                    <td>10.50</td>
                                                </tr>
                                                <tr className="">
                                                    <td>Employee Contribution</td>
                                                    <td>20.55</td>
                                                </tr>

                                                <tr>
                                                    <td>Other Deduction</td>
                                                    <td>0</td>
                                                </tr>

                                                <tr>
                                                    <td>Deducation Amount</td>
                                                    <td>20.55</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6  border">
                                    <div className="ms-10 mt-5 mb-5">
                                        Net Salary
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6  border">
                                    <div className="ms-10 mt-5 mb-5">
                                        21,079.45
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* <div className="card">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12"></div>
                        <div className='card p-2 mb-5 mt-5 bg-white rounded '>
                            <div className="row ">
                                <label className="form-label col-lg-6" >Emp Code:{employeeCode}</label>
                                <label className="form-label col-lg-6" >Department:{department}</label>
                            </div>
                            <div className="row ">
                                <label className="form-label col-lg-6" >Emp Name:{employeeName}</label>
                            </div>
                        </div>

                        <table className='table table-bordered'>
                            <tr className='row'>
                                <th className='p-2 col-xl-6'>
                                    <label className="form-label" >Earnings</label>
                                </th>
                                <th className='p-2 col-xl-6'>
                                    <label className="form-label" >Deductions</label>
                                </th>
                            </tr>

                            <tr className='row'>
                                <td className='col-lg-6'>
                                    <div className='card  p-2 mb-5 mt-5 bg-white rounded col-lg-12'>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6">Basic</label>
                                            </div>
                                            <div className="col-lg-3">
                                                <label className="form-label col-lg-3">900</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6" >HRA</label>
                                            </div>
                                            <div className="col-lg-3">
                                                <label className="form-label" >{hra}</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label">Allowance</label>
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label">100</label>

                                            </div>
                                        </div>

                                    </div>
                                </td>

                                <td className='col-lg-6'>
                                    <div className='card  p-2 mb-5 mt-5 bg-white rounded '>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-12">Employeer contribution:</label>
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6">{EmployeerC}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-12">Employee contribution:</label>
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6">{EmployeeC}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label">Deduction</label>

                                            </div>
                                            <div className="col-lg-6">
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>


                            <div className='card  mb-5 mt-5 bg-white rounded '>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <label className="form-label col-lg-6 p-1" >Total Earnings</label>
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label col-lg-6 " >{totalEarning}</label>
                                    </div>

                                    <div className="col-lg-3 p-1 ps-5">
                                        <label className="form-label" >Deduction Amt</label>
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label col-lg-6 ps-3" >20.4</label>
                                    </div>
                                </div>
                            </div>


                            <div className='card   bg-white rounded '>
                                <div className='row'>
                                    <div className="col-lg-6">
                                        <label className="form-label col-lg-6"></label>
                                    </div>
                                    <div className="col-lg-3 col-md-12 col-sm-12  ps-5">
                                        <label className="form-label p-1" >Net salary</label>
                                    </div>
                                    <div className="col-lg-3 col-md-12 col-sm-12 ps-4">
                                        <label className="form-label" >{netsalary}</label>
                                    </div>
                                </div>

                            </div>
                        </table>

                    </div>
                </div>
            </div> */}
        </>
    );
};

export default Payslip;
