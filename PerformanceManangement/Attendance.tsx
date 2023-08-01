/* Import Statement */
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from "../Service/Services";
import Select from 'react-select';
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";

/* State Master Functionality Start */
const Attendance = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [AttendanceData, setAttendanceData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);

    /* Initial Page Load Function */
    const filllist = () => {
        get('Attendance/GetAllAttendance')
            .then((result) => {
                var i = 1;
                let data: any = []
                console.log(result.data);

                result.data.map((obj: any) => {
                    data.push(
                        {
                            id: obj.id,
                            attendanceDate: obj.attendanceDate,
                            inTime: obj.inTime,
                            outTime: obj.outTime,
                            totalHours: obj.totalHours,
                            otHours: obj.otHours,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i
                        })
                    i = i + 1;
                })
                console.log(data)
                setAttendanceData(data)

            })
    }

    useEffect(() => {
        filllist()
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
    }, [])

    /* Form Validation Start*/

    const validate = () => {
        let valid = true

        if (formik.values.attendanceDate === '' && formik.values.inTime === '' && formik.values.outTime == "" && formik.values.totalHours == "" && formik.values.otHours == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (formik.values.attendanceDate === "") {
            toast.error("Please Enter Attendance Date");
            return false;
        }
        if (formik.values.inTime === "") {
            toast.error("Please Enter In Time");
            return false;
        }
        if (formik.values.outTime === "") {
            toast.error("Please Enter Out Time");
            return false;
        }
        if (formik.values.totalHours === "") {
            toast.error("Please Enter Total Hours");
            return false;
        }
        if (formik.values.otHours === "") {
            toast.error("Please Enter OT Hours");
            return false;
        }
        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            attendanceDate: '',
            inTime: '',
            outTime: '',
            totalHours: '',
            otHours: '',
            isActive: true
        },

        onSubmit: (values) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const insertData = {
                        attendanceDate: formik.values.attendanceDate,
                        inTime: (formik.values.inTime),
                        outTime: (formik.values.outTime),
                        totalHours: Number(formik.values.totalHours),
                        otHours: Number(formik.values.otHours),
                        isActive: formik.values.isActive,
                        createdBy: SessionManager.getUserID(),
                        createdDate: dayjs()
                    }
                    console.log(insertData);

                    post('Attendance/AddAttendance', insertData)
                        .then((result) => {
                            filllist()
                            // document.getElementById('stateCode')?.focus()
                            console.log(result);
                            if (result.data.status == 'F') {
                                toast.warning(result.data.statusmessage);

                            }
                            else if (result.data.status == 'S') {
                                toast.success(result.data.statusmessage);
                                onReset()
                            }
                        })
                }
                else {
                    const updatedata = {
                        id: rowId,
                        attendanceDate: formik.values.attendanceDate,
                        inTime: formik.values.inTime,
                        outTime: formik.values.outTime,
                        totalHours: formik.values.totalHours,
                        otHours: formik.values.otHours,
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }
                    console.log(updatedata);

                    put('Attendance/UpdateAttendance', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            onReset()
                        })
                }
            }
        },

    })
    /* Formik Library End*/

    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/

    const handleRowClick = (rowData: any) => {
        get('Attendance/GetAttendance?Id=' + rowData.id)
            .then((result) => {
                document.getElementById('attendanceDate')?.focus();
                console.log(result.data);

                formik.setFieldValue("attendanceDate", dayjs(result.data.attendanceDate).format('YYYY-MM-DD'))
                formik.setFieldValue("inTime", result.data.inTime.toString())
                formik.setFieldValue("outTime", result.data.outTime.toString())
                formik.setFieldValue("totalHours", result.data.totalHours.toString())
                formik.setFieldValue("otHours", result.data.otHours.toString())
                formik.setFieldValue("isActive", result.data.isActive)
                setswtstatus(result.data.isActive);
            })
        setrowId(rowData.id);
        setSelectedRow(rowData);
        setreadonly(true);
    }

    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...AttendanceData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setAttendanceData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...AttendanceData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setAttendanceData(sorted);
            setorder('ASC')
        }
    }

    /* Table Sorting End */
    /* Table Functionality End */

    /* Page Reset Start */

    const onReset = () => {
        if (rowId !== undefined) {
            setreadonly(false);
            setswtstatus(true);
            setrowId(0)
            setstateValue('')
            formik.resetForm()
            setSelectedRow(undefined)
            selectRef.current.focus()
        }
    }
    /* Page Reset End */

    return (
        <>

            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Attendance</h3>
            <div className="card">
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>

                            {/*  Heading Button Start */}
                            <div className='col-lg-12 col-md-12 col-sm-8'>
                                <div className="action1">
                                    <button type='reset' form="form" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}  >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>

                                </div>
                            </div>
                            {/*  Heading End  */}
                        </div>

                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            <div className="card" style={{ height: 400 }}>
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: "310px", overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>

                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder '>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("attendanceDate")}>Attendance Date
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("inTime")}>In Time
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("inTime")}>Out Time
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-60px text-white' onClick={() => Sorting("isActive")}>Status
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AttendanceData.map((rowData: any, index: any) => (
                                                        <tr key={index}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.id === rowData.id
                                                                        ? ' #BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >
                                                            <td>
                                                                {dayjs(rowData.attendanceDate).format('YYYY-MM-DD')}
                                                            </td>
                                                            <td>
                                                                {rowData.inTime}
                                                            </td>
                                                            <td>
                                                                {rowData.outTime}
                                                            </td>
                                                            <td>
                                                                {rowData.isActive}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                {/* end::Table body */}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Table */}
                        <div className='col-lg-6 col-md-6 col-sm-12 '>
                            <div className="card ">
                                <div className="card-body " >
                                    {/* Formik integration Start*/}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form' >
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h3>Attendance</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label">Attendance Date</label>
                                                                    <input type="date" autoFocus id="attendanceDate" ref={selectRef} className='form-control form-control-sm'
                                                                        name='attendanceDate'
                                                                        readOnly={readonly}
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.attendanceDate} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-7 Description">
                                                                <div className="p-1">
                                                                    <label className="form-label">In Time</label>
                                                                    <input
                                                                        name='inTime'
                                                                        type="time"
                                                                        min="00:00"
                                                                        max="23:59"
                                                                        id="inTime"
                                                                        className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.inTime}
                                                                    />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Out Time</label>
                                                                    <input
                                                                        name='outTime'
                                                                        type="time"
                                                                        min="00:00"
                                                                        max="23:59"
                                                                        id="outTime"
                                                                        className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.outTime} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Total Hours</label>
                                                                    <input name='totalHours' id="totalHours" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.totalHours.replace(/[^\d-]/, '')} />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">OT Hours</label>
                                                                    <input name='otHours' id="otHours" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.otHours.replace(/[^\d-]/, '')} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="p-1">
                                                                    <label className="form-label">Status</label>
                                                                    <div className="form-check form-switch">
                                                                        <input name='isActive' type="checkbox" className='form-check-input' checked={swtstatus}
                                                                            onChange={(e) => {
                                                                                formik.handleChange(e)
                                                                                return setswtstatus(!swtstatus)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </Form>

                                    </Formik>
                                    {/* Formik integration End*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};
/* State Master Functionality End */
export default Attendance;
