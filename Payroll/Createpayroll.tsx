/* Import Statement */
import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { get, post } from "../Service/Services";
import { KTIcon } from '../../../_metronic/helpers';
import SessionManager from '../../modules/auth/components/Session';

/* payroll-create Functionality Start */
export default function Createpayroll() {
    const [showmodal, setShowmodal] = useState(false);
    const handleClosemodal = () => {
        // setemployeeCode("");
        // setemployeeName("");
        // settotalEarning(0);
        // setEmployeeC(0);
        // setEmployeerC(0);
        // setdeduction(0);
        // setnetsalary(0);
        // setbasic(0)
        // sethra(0)
        // settotalsalary(0)
        // setDepartment(0)
        setShowAllowance(false)
        setShowDeduction(false)
        setShowmodal(false);
        setallowancevalue({ value: 0, label: '' });
        setdeductionvalue({ value: 0, label: '' });
    }

    const handleShowmodal = () => {
        setShowAllowance(true)
        setShowmodal(true);
    }

    /* Const Variable Initialization */
    const empCode = SessionManager.getEmpID();
    const [employeeCode, setemployeeCode] = useState("");
    const [employeeName, setemployeeName] = useState("");
    const [rowId, setrowId] = useState(0);
    const [basic, setbasic] = useState(0);
    const [amt, setAmt] = useState(0);
    const [EmployeeC, setEmployeeC] = useState(0);
    const [EmployeerC, setEmployeerC] = useState(0);
    const [department, setDepartment] = useState("");
    const [hra, sethra] = useState(0);
    const [totalEarning, settotalEarning] = useState(0);
    const [netsalary, setnetsalary] = useState(0);
    const [deduction, setdeduction] = useState(0);
    const [allowanceamt, setallowanceamt] = useState(0);
    const [totalsalary, settotalsalary] = useState(0);
    const [ShowAllowance, setShowAllowance] = useState(false);
    const [ShowDeduction, setShowDeduction] = useState(false);
    const [year, setYear] = useState([]);
    const [allowancetable, setallowancetable] = useState<any>([]);
    const [deductiontable, setdeductiontable] = useState<any>([]);
    const [company, setCompany] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [deductiondata, setdeductiondata] = useState([]);
    const [allowance, setallowance] = useState([]);
    const [allowanceA, setallowanceA] = useState([]);
    const [allowanceAll, setallowanceAll] = useState([]);
    const [allowanceAllAmt, setallowanceAllAmt] = useState([]);
    const [allowanceD, setallowanceD] = useState([]);
    const [yearvalue, setYearvalue] = useState<any>({ value: 0, label: '' });
    const [allowancevalue, setallowancevalue] = useState<any>({ value: 0, label: '' });
    const [deductionvalue, setdeductionvalue] = useState<any>({ value: 0, label: '' });
    const [companyvalue, setCompanyvalue] = useState<any>({ value: 0, label: '' });

    /* Initial Page Load Function */
    const filllist = () => {
        get('YearMaster/GetAllYearMaster')
            .then((result) => {
                let yeardata: any = [];
                result.data.map((obj: any) => {
                    yeardata.push(
                        {
                            value: obj.id,
                            label: obj.year,
                        })
                })
                setYear(yeardata)
            })

        get('Company/GetAllCompany')
            .then((result) => {
                let companydata: any = [];
                result.data.map((obj: any) => {
                    companydata.push(
                        {
                            value: obj.compId,
                            label: obj.compLongName + " " + obj.compShortName,
                        })
                })
                setCompany(companydata)
            })
        get('PayRollServices/GetAllPayRoll')
            .then((result) => {
                // console.log(result.data.p);
                let payroll: any = [];
                result.data.p.map((obj: any) => {
                    payroll.push(
                        {
                            id: obj.id,
                            employeeID: obj.employeeID,
                            empFirstName: obj.empFirstName,
                            empMiddleName: obj.empMiddleName,
                            empLastName: obj.empLastName,
                            employerPensionPercentage: obj.employerPensionPercentage,
                            grossSalary: obj.grossSalary,
                            totalDeductions: obj.totalDeductions,
                            netSalary: obj.netSalary,
                        })
                })
                setPayroll(payroll)
            })
    }

    useEffect(() => {
        // if (SessionManager.getUserID() == null) {
        //     window.location.href = "/hrms/auth";
        // }
        filllist()
        SessionManager.getisReportingManager()
    }, [])


    useEffect(() => {
        let data1: any = []
        let basicdata: any = []
        let basicdataamt: any = []
        allowance.map((record: any) => {
            if (record.allowanceorDeduction === "A" && record.showInEmployee === false)
                data1.push({
                    value: record.id,
                    label: record.componentName
                })
            if (record.allowanceorDeduction === "A" && record.showInEmployee === true) {
                basicdata.push({
                    value: record.id,
                    label: record.componentName,
                })
                basicdataamt.push({
                    value: record.id,
                    label: record.amount,
                })
            }

            console.log(record.amount);

            setAmt(record.amount)
        })
        setallowanceA(data1)
        setallowanceAll(basicdata)
        setallowanceAllAmt(basicdataamt)
        console.log(allowance);


        let data2: any = []
        allowance.map((record: any) => {
            if (record.allowanceorDeduction === "D" && record.showInEmployee === false)
                data2.push({
                    value: record.id,
                    label: record.componentName,

                })
        })

        setallowanceD(data2)
    }, [allowance])

    const handleRowClick = (rowData: any) => {
        console.log("rowadata", rowData);

        handleShowmodal()
        get('PayRollServices/GetallPayrollDetailsByEmpcode?empcode=' + rowData.employeeID)
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
        setrowId(rowData.id)
    }

    /* Payroll create Form Validation */
    const validate = () => {
        let valid = true
        if (yearvalue.value === 0) {
            toast.error("Please Enter Year");
            return false;
        }
        return valid;
    }

    /* Formik variables declaration */
    const formik: any = useFormik({
        initialValues: {
            empCode: empCode,
            empName: "",
            empFirstName: "",
            allowanceamt: 0,
            deductionamt: 0,
        },
        onSubmit: (values, { resetForm }) => {
        }
    });

    /* Submit functionality-Status(Waiting for Approval) */
    const onSubmitLeave = () => {
        if (validate() === true) {
            const Submitdata = {
                id: rowId,
                empCode: empCode,
                Year: yearvalue.value,
                createdDate: dayjs(),
                modifiedDate: dayjs(),
                modifiedBy: SessionManager.getUserID(),
                createdBy: SessionManager.getUserID(),
            }
            console.log(Submitdata);
            toast.success("Leave Submitted Successfully");
            handleClosemodal()
            post('Leave/SubmitLeave', Submitdata)
                .then((result) => {
                    filllist()
                    onReset()
                    handleClosemodal()
                })
        };
    }

    useEffect(() => {
        settotalEarning(totalEarning + Number(formik.values.allowanceamt))
        console.log(formik.values.allowanceamt);
    }, [formik.values.allowanceamt])


    useEffect(() => {
        setdeduction(deduction - Number(formik.values.deductionamt))
    }, [formik.values.deductionamt])

    useEffect(() => {
        setnetsalary(totalEarning - deduction)
    }, [totalEarning, deduction])

    /* Page Reset */
    const onReset = () => {
        setrowId(0)
        formik.resetForm()
    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            {/* <div className='card'>
                <div className='card-body'> */}
            <div className='container-fluid'>
                <div className='card shadow-sm p-3 mb-5 mt-5 bg-white rounded'>
                    <div className='card-header border-0 mb-2'>
                        <h3 className='card-title fw-bold'>
                            payroll
                        </h3>
                    </div>

                    <div className="container-fluid">
                        <div className="row">
                            <div className='col-lg-3' >
                                <div className="p-2">
                                    <label className="form-label" >Month</label>
                                    <input className="form-control form-control-sm" onChange={formik.handleChange} name='month' type="month" />
                                </div>
                            </div>
                            <div className='col-lg-3'>
                                <div className="p-2">
                                    <label className="form-label" >Company</label>
                                    <Select
                                        name="company"
                                        options={company}
                                        value={companyvalue}
                                        onChange={(o: any) => setCompanyvalue(o)}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}

                                        styles={{
                                            menu: (base) => ({
                                                ...base,
                                                width: "max-content",
                                                minWidth: "150px"
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
                            <div className='col-lg-3'>
                                <div className='p-2'>
                                    <a type="button" className="btn btn-sm btn-primary"
                                        style={{ marginTop: 20 }}
                                    >Create Payroll</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='table-responsive'>
                        <div style={{ height: 380, overflowY: "scroll" }}>
                            {/* begin::Table */}
                            <table className='table table-striped align-middle gs-0 gy-2'>
                                {/* begin::Table head */}
                                <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                    <tr className='text-bolder text-muted text-center'>
                                        <th className='min-w-150px text-white'>Emp code</th>
                                        <th className='min-w-150px text-white'>Emp Name </th>
                                        <th className='min-w-150px text-white'>Gross salary </th>
                                        <th className='min-w-150px text-white'>Net salary</th>
                                        <th className='min-w-150px text-white'>Deduction Amount </th>
                                        <th className='min-w-150px text-white' >Action </th>
                                    </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody >
                                    {payroll.map((rowData: any, index: any) => (
                                        <tr key={index} className='text-center'>
                                            <td>
                                                {rowData.employeeID}
                                            </td>
                                            <td>
                                                {rowData.empFirstName + " " + rowData.empMiddleName + " " + rowData.empLastName}
                                            </td>
                                            <td>
                                                {rowData.grossSalary}
                                            </td>
                                            <td>
                                                {rowData.netSalary}
                                            </td>
                                            <td>
                                                {rowData.totalDeductions}
                                            </td>
                                            <td>
                                                <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} onClick={() => handleRowClick(rowData)}>
                                                    <KTIcon iconName='pencil' style={{ fontSize: 20, color: '#0095e8' }} />Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div>
            </div> */}

            {/* ------Edit Popup Start------ */}
            < Modal
                show={showmodal}
                onHide={handleClosemodal}
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
                                            <tr >
                                                <div className="row">
                                                    <label className="form-label col-lg-6">Basic</label>
                                                    <label className="form-label col-lg-6">{basic}</label>
                                                </div>
                                                <div className="row">
                                                    <label className="form-label col-lg-6">HRA</label>
                                                    <label className="form-label col-lg-6">{hra}</label>
                                                </div>
                                            </tr>
                                        </div>

                                        {/* {allowanceAll.map((record: any, index: any) => (
                                                <tr key={index}>

                                                    <div className="col-lg-6">
                                                        <label className="form-label col-lg-6">{record.label}</label>

                                                        {allowanceAllAmt.map((record: any, index: any) => (
                                                            <label className="form-label col-lg-6">{record.label}</label>
                                                        ))}
                                                    </div>
                                                </tr>
                                            ))} */}



                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label">Allowance</label>

                                                <Select
                                                    placeholder="Allowance"
                                                    name="allowance"
                                                    options={allowanceA}
                                                    value={allowancevalue}
                                                    components={{
                                                        IndicatorSeparator: () => null
                                                    }}
                                                    onChange={(o: any) => {
                                                        const data: any = []
                                                        setallowancetable([...allowancetable, o])
                                                        setallowancevalue(o)
                                                    }
                                                    }
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
                                            <div className="col-lg-6">
                                                <button type='button' className='btn btn-primary btn-sm' style={{ fontSize: 10, height: 25, marginTop: 30 }} onClick={() => setShowAllowance(true)}>Add</button>
                                            </div>
                                        </div>

                                        {ShowAllowance === true && allowancevalue.value !== 0 ?
                                            <div className='table-responsive mt-2'>
                                                <div>
                                                    <table className='table table-striped align-middle gs-0 gy-2' style={{ width: "250px" }}>

                                                        <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                            <tr className='text-bolder text-muted ps-1'>
                                                                <th className='min-w-5px text-white'>Allowance</th>
                                                                <th className='min-w-5px text-white'>Amount</th>
                                                                <th className='min-w-5px text-white'></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {allowancetable.map((record: any, index: any) => (
                                                                <tr key={index}>
                                                                    <td>{record.label}</td>
                                                                    <td>
                                                                        <input style={{ width: 80, height: 25 }} name='allowanceamt' value={formik.values.allowanceamt} onChange={formik.handleChange}></input></td>
                                                                    <td>

                                                                        <div className="action1">
                                                                            <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}  >
                                                                                <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {/* <tr className='text-center'>
                                                                <td>{allowancevalue.label}</td>
                                                                <td>
                                                                    <input style={{ width: 80, height: 25 }} name='allowanceamt'></input>
                                                                </td>
                                                               
                                                            </tr> */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div> : null}

                                    </div>
                                </td>

                                <td className='col-lg-6'>
                                    <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-12">Employeer contribution</label>
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6">{EmployeerC}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-12">Employee contribution</label>
                                            </div>
                                            <div className="col-lg-6">
                                                <label className="form-label col-lg-6">{EmployeeC}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label className="form-label">Deduction</label>
                                                <Select
                                                    name="deduction"
                                                    value={deductionvalue}
                                                    options={allowanceD}
                                                    components={{
                                                        IndicatorSeparator: () => null
                                                    }}
                                                    onChange={(o: any) => {
                                                        const data: any = []
                                                        setdeductiontable([...deductiontable, o])
                                                        setdeductionvalue(o)
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
                                            <div className="col-lg-6">
                                                <button type='button' className='btn btn-primary btn-sm' style={{ fontSize: 10, height: 25, marginTop: 30 }} onClick={() => setShowDeduction(true)}>Add</button>
                                            </div>
                                        </div>

                                        {ShowDeduction === true && deductionvalue.value !== 0 ?
                                            <div className='table-responsive mt-2'>
                                                <div>
                                                    <table className='table table-striped align-middle gs-0 gy-2' style={{ width: "0px" }}>

                                                        <thead className="" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                            <tr className='text-bolder text-muted ps-1'>
                                                                <th className='min-w-5px text-white'>Deduction</th>
                                                                <th className='min-w-5px text-white'>Amount</th>
                                                                <th className='min-w-5px text-white'></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {deductiontable.map((record: any, index: any) => (
                                                                <tr key={index}>
                                                                    <td>{record.label}</td>
                                                                    <td>
                                                                        <input style={{ width: 80, height: 25 }} name='deductionamt' value={formik.values.deductionamt} onChange={formik.handleChange}></input></td>
                                                                    <td>
                                                                        <button type='button' className='btn btn-danger btn-sm' style={{ fontSize: 10, height: 25 }}>Delete</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {/* <tr className='text-center'>
                                                                <td>{allowancevalue.label}</td>
                                                                <td>
                                                                    <input style={{ width: 80, height: 25 }} name='allowanceamt'></input>
                                                                </td>
                                                               
                                                            </tr> */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div> : null}

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

                                    <div className="col-lg-3 ps-3">
                                        <label className="form-label" >Deduction Amt</label>
                                    </div>
                                    <div className="col-lg-3 ">
                                        <label className="form-label" >{deduction}</label>
                                    </div>
                                </div>

                            </div>


                            <div className='card shadow-sm p-2 mb-5 mt-5 bg-white rounded '>

                                <div className='row'>
                                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                                        <label className="form-label p-1" > </label>
                                    </div>
                                    <div className="col-lg-3 col-md-12 col-sm-12 ">
                                        <label className="form-label p-1" >Net salary</label>
                                    </div>
                                    <div className="col-lg-3 col-md-12 col-sm-12 ">
                                        <label className="form-label" >{netsalary}</label>
                                    </div>
                                </div>

                            </div>


                        </table>
                        <div className="row p-2">
                            <label className="form-label col-lg-6" >Remarks</label>
                        </div>
                        <div className="row p-2">
                            <textarea className="form-control form-control-sm" placeholder='' style={{ width: 500 }}></textarea>
                        </div>
                    </div>

                </Modal.Body >
                <Modal.Footer>
                    <div className='p-2'>
                        <div className='d-flex justify-content-end gap-5'>
                            <a type="button" className="btn btn-sm btn-primary" onClick={() => handleClosemodal()}>Save</a>
                            <a type="button" className="btn btn-sm btn-danger" onClick={() => handleClosemodal()}>Cancel</a>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal >
            {/* ------Edit popup end------ */}
        </>
    )
}