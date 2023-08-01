/* Import Statement */
import React, { useEffect, useState } from 'react'
import { Modal, Tab, Tabs } from 'react-bootstrap';
import { Field, useFormik } from 'formik';
import dayjs from "dayjs";
import { get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import SessionManager from '../../modules/auth/components/Session';
import { Link } from 'react-router-dom';

/* Payroll Functionality Start */
export default function Payroll() {

    /* Const Variable Initialization */
    // const [empCode, setempCode] = useState("161");
    const empCode = SessionManager.getEmpID();
    const [showOffcanvas, setShowOffcanvas] = React.useState(false);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const [order, setorder] = useState('DSC');
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [approve, setApprove] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseapprove = () => setApprove(false);
    const [status, setStatus] = useState("Draft");
    const [employeeCode, setemployeeCode] = useState("");
    const [employeeName, setemployeeName] = useState("");
    const [rowId, setrowId] = useState(0);
    const [basic, setbasic] = useState(0);
    const [amt, setAmt] = useState(0);
    const [component, setComponent] = useState("");
    const [EmployeeC, setEmployeeC] = useState(0);
    const [EmployeerC, setEmployeerC] = useState(0);
    const [department, setDepartment] = useState("");
    const [hra, sethra] = useState(0);
    const [totalEarning, settotalEarning] = useState(0);
    const [netsalary, setnetsalary] = useState(0);
    const [deduction, setdeduction] = useState(0);
    const [totalsalary, settotalsalary] = useState(0);
    const [allowance, setallowance] = useState([]);


    const [showmodal, setShowmodal] = useState(false);
    const handleClosemodal = () => {
        onReset();
        setShowmodal(false);
    }

    const handleShowmodal = () => {
        setShowmodal(true);
    }

    const [approvshowmodal, setapprovshowmodal] = useState(false);
    const approvClosemodal = () => setapprovshowmodal(false);
    const approvShowmodal = () => setapprovshowmodal(true)


    /* Initial Page Load Function */
    const filllist = () => {

        get('PayRollServices/GetAlPayrollMaster')
            .then((result) => {
                let data: any = [];
                result.data.map((obj: any) => {
                    data.push(
                        {
                            id: obj.id,
                            payrollMonth: obj.payrollMonth,
                            totalAmountPayable: obj.totalAmountPayable,
                            status: obj.status,
                            payrollProcessDate: dayjs(obj.payrollProcessDate).format('YYYY-MM-DD'),

                        })
                })
                setData(data)
                console.log(data);
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


    /* Formik variables declaration */
    const formik = useFormik({
        initialValues: {

        },
        onSubmit: (values, { resetForm }) => {
        }
    });

    /*Save functionality-Status(Draft) */
    const Onsave = () => {
        const Insertdata = {

        }
        post('Leave/SaveLeave', Insertdata)
            .then((result) => {
                console.log(Insertdata);
                filllist()
                toast.success(result.data.statusmessage);
                onReset()
                handleClosemodal()
                // handleCloseOffcanvas()
            })
    }


    const handleRowClick = () => {
        get('PayRollServices/GetallPayrollDetailsByEmpcode?empcode=' + "572")
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


    /* File upload Functionality Ends */

    /* Calculating leave Balance while choosing leave type --Leave Application form */
    useEffect(() => {


    }, [])

    /* Calculation for counting leave No.of.days */




    /* Page Reset */
    const onReset = () => {

        formik.resetForm()
    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>

            <div className='card'>
                <div className='card-body'>

                    {/* Leave Overview Tab Start */}
                    <div className='container-fluid'>
                        <Tabs
                            defaultActiveKey="Payroll"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="Payroll" title="Payroll">

                                <div className='card'>
                                    <div className='card-body'>
                                        <div className='container-fluid'>
                                            <div className='card shadow-sm p-3 mb-5 mt-5 bg-white rounded'>
                                                <div className='card-header border-0 mb-2'>
                                                    <h3 className='card-title fw-bold'>
                                                        payroll List
                                                    </h3>

                                                    <div className='card-toolbar'>
                                                        <Link to='/Createpayroll'>
                                                            <a className='btn btn-sm btn-light-primary' > create payroll</a>
                                                        </Link>

                                                    </div>
                                                </div>
                                                <div className='table-responsive'>
                                                    <div style={{ height: 380, overflowY: "scroll" }}>
                                                        {/* begin::Table */}
                                                        <table className='table table-striped align-middle gs-0 gy-2  '>
                                                            {/* begin::Table head */}
                                                            <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                                <tr className='text-bolder text-muted text-center'>
                                                                    <th className='min-w-150px text-white'>Document no </th>
                                                                    <th className='min-w-150px text-white'>Date </th>
                                                                    <th className='min-w-150px text-white'>Month </th>
                                                                    <th className='min-w-150px text-white'>Year </th>
                                                                    <th className='min-w-150px text-white' >Status  </th>
                                                                    <th className='min-w-150px text-white' >Action </th>

                                                                </tr>
                                                            </thead>
                                                            {/* end::Table head */}
                                                            {/* begin::Table body */}
                                                            <tbody>
                                                                {data.map((rowData: any, index: any) => (
                                                                    <tr className='text-center' key={index}>
                                                                        <td>
                                                                            {rowData.id}
                                                                        </td>
                                                                        <td>
                                                                            {dayjs(rowData.payrollProcessDate).format('DD-MM-YYYY')}

                                                                        </td>
                                                                        <td>
                                                                            {rowData.payrollMonth}
                                                                        </td>
                                                                        <td>
                                                                            {dayjs(rowData.payrollProcessDate).format('YYYY')}

                                                                        </td>
                                                                        <td>
                                                                            {rowData.status}
                                                                        </td>

                                                                        <td>
                                                                            <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} onClick={handleShowmodal}>
                                                                                <KTIcon iconName='pencil' style={{ fontSize: 20, color: '#0095e8' }} />Edit</button>
                                                                            <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} onClick={() => setStatus("Waiting for Approval")}>
                                                                                <KTIcon iconName='save-2' style={{ fontSize: 20, color: '#0095e8' }} />Submit</button>
                                                                        </td>

                                                                    </tr>
                                                                ))}


                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="My Approvals" title="My Approvals" >
                                <div className='card shadow-sm p-3 mb-5 mt-5 bg-white rounded'>
                                    <div className='card-header border-0 mb-2'>
                                        <h3 className='card-title fw-bold'>
                                            My Approvals
                                        </h3>
                                    </div>
                                    <div className='table-responsive'>
                                        <div style={{ height: 380, overflowY: "scroll" }}>
                                            {/* begin::Table */}
                                            <table className='table table-striped align-middle gs-0 gy-2 '>
                                                {/* begin::Table head */}
                                                <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-bolder text-muted text-center'>
                                                        <th className='min-w-150px text-white'>Document no </th>
                                                        <th className='min-w-150px text-white'>Date </th>
                                                        <th className='min-w-150px text-white'>Month </th>
                                                        <th className='min-w-150px text-white'>Year </th>
                                                        <th className='min-w-150px text-white' >Status  </th>

                                                    </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody>
                                                    {data.map((rowData: any, index: any) => (
                                                        <tr className='text-center' key={index}>
                                                            <td onClick={approvShowmodal}>
                                                                {rowData.id}
                                                            </td>
                                                            <td>
                                                                {dayjs(rowData.payrollProcessDate).format('DD-MM-YYYY')}

                                                            </td>
                                                            <td>
                                                                {rowData.payrollMonth}
                                                            </td>
                                                            <td>
                                                                {dayjs(rowData.payrollProcessDate).format('YYYY')}

                                                            </td>
                                                            <td>
                                                                Waiting for Reviewer Approval
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Tab>


                            <Tab eventKey="Approved/Denied" title="Approved/Denied">
                                <div className='card shadow-sm p-3 mb-5 mt-5 bg-white rounded'>
                                    <div className='card-header border-0 mb-2'>
                                        <h3 className='card-title fw-bold'>
                                            Approved / Denied
                                        </h3>
                                    </div>
                                    <div className='table-responsive'>
                                        <div style={{ height: 380, overflowY: "scroll" }}>
                                            {/* begin::Table */}
                                            <table className='table table-striped align-middle gs-0 gy-2'>
                                                {/* begin::Table head */}
                                                <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-bolder text-muted text-center'>
                                                        <th className='min-w-150px text-white'>Document no </th>
                                                        <th className='min-w-150px text-white'>Date </th>
                                                        <th className='min-w-150px text-white'>Month </th>
                                                        <th className='min-w-150px text-white'>Year </th>
                                                        <th className='min-w-150px text-white' >Status  </th>

                                                    </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody>
                                                    {data.map((rowData: any, index: any) => (
                                                        <tr className='text-center' key={index}>
                                                            <td>
                                                                {rowData.id}
                                                            </td>
                                                            <td>
                                                                {dayjs(rowData.payrollProcessDate).format('DD-MM-YYYY')}

                                                            </td>
                                                            <td>
                                                                {rowData.payrollMonth}
                                                            </td>
                                                            <td>
                                                                {dayjs(rowData.payrollProcessDate).format('YYYY')}

                                                            </td>
                                                            <td>
                                                                Approved
                                                            </td>
                                                        </tr>
                                                    ))}


                                                </tbody>

                                            </table>

                                        </div>

                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* ------Edt Offcanva Start------ */}


            < Modal
                show={approvshowmodal}
                onHide={approvClosemodal}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton className=''>
                    <Modal.Title id="contained-modal-title-vcenter w-100 text-center" className='w-100 text-center '>

                        <h3 className='m-0'>Payroll Details</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                }}>
                    <div className="card text-dark" >
                        <div className="container">
                            <div className="container-fluid">
                                <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
                                    <div className="row p-2">
                                        <label className="form-label col-lg-4" >Emp Code:{employeeCode}</label>
                                        <label className="form-label col-lg-4" >Emp Name:{employeeName}</label>
                                        <label className="form-label col-lg-4" >Department:{department}</label>
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
                                            <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded col-lg-12'>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <label className="form-label col-lg-6">Basic</label>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <label className="form-label col-lg-6">900</label>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <label className="form-label col-lg-6" >HRA</label>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <label className="form-label col-lg-6" >20</label>
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
                                            <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
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


                                    <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
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


                                    <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
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
                    </div>


                </Modal.Body >
                <Modal.Footer>
                    <div className='p-2'>
                        <div className='d-flex justify-content-end gap-5'>
                            <a type="button" className="btn btn-sm btn-success" >Approve</a>
                            <a type="button" className="btn btn-sm btn-danger" onClick={() => handleClosemodal()}>Reject</a>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal >

            < Modal
                show={showmodal}
                onHide={handleClosemodal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton className=''>
                    <Modal.Title id="contained-modal-title-vcenter w-100 text-center" className='w-100 text-center '>
                        <h3 className='m-0'>Payroll Details</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className='text-dark'
                    style={{
                        maxHeight: 'calc(100vh - 210px)',
                        overflowY: 'auto'
                    }}>
                    <div className="container-fluid">

                        <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
                            <div className="row p-2">
                                <label className="form-label col-lg-3" >Payroll Month</label>
                                <label className="form-label col-lg-3" >May</label>
                            </div>
                            <div className="row p-2">
                                <div className="col-lg-3">
                                    <label className="form-label" >Payable Amount</label>
                                </div>
                                <div className="col-lg-3">

                                    <input autoComplete="off" name='payableamount' className='form-control form-control-sm' onChange={formik.handleChange} placeholder="20000" />
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal.Body >
                <Modal.Footer>
                    <div className='p-2'>
                        <div className='d-flex justify-content-end gap-5'>
                            <a type="button" className="btn btn-sm btn-primary" onClick={() => handleClosemodal()}>Update</a>
                            <a type="button" className="btn btn-sm btn-danger" onClick={() => handleClosemodal()}>Cancel</a>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal >
            {/* edit Offcanvas End */}

        </>
    )
}
