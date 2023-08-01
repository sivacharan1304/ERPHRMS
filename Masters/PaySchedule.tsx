/* Import Statement */
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import '../Qs_css/Autocomplete.css'
import { get, post, put } from "../Service/Services";
import Select from 'react-select';
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";

/* State Master Functionality Start */
const PaySchedule = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [PaySchedule, setPaySchedule] = useState([]);
    const [PayScheduleCopy, setPayScheduleCopy] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [payScheduleValue, setpayScheduleValue] = useState<any>({ value: '', label: '' });
    const [PayStartDateValue, setPayStartDateValue] = useState<any>({ value: 0, label: '' });
    const [WorkingDays, setWorkingDays] = useState({
        'Sunday': false,
        'Monday': false,
        'Tuesday': false,
        'Wednesday': false,
        'Thursday': false,
        'Friday': false,
        'Saturday': false
    });
    const [PayStartDateOptions] = useState([
        {
            value: 1,
            label: 1
        },
        {
            value: 2,
            label: 2
        },
        {
            value: 3,
            label: 3
        },
        {
            value: 4,
            label: 4
        },
        {
            value: 5,
            label: 5
        },
        {
            value: 6,
            label: 6
        },
        {
            value: 7,
            label: 7
        },
        {
            value: 8,
            label: 8
        },
        {
            value: 9,
            label: 9
        },
        {
            value: 10,
            label: 10
        },
        {
            value: 11,
            label: 11
        },
        {
            value: 12,
            label: 12
        },
        {
            value: 13,
            label: 13
        },
        {
            value: 14,
            label: 14
        },
        {
            value: 15,
            label: 15
        },
        {
            value: 16,
            label: 16
        },
        {
            value: 17,
            label: 17
        },
        {
            value: 18,
            label: 18
        },
        {
            value: 19,
            label: 19
        },
        {
            value: 20,
            label: 20
        },
        {
            value: 21,
            label: 21
        },
        {
            value: 22,
            label: 22
        },
        {
            value: 23,
            label: 23
        },
        {
            value: 24,
            label: 24
        },
        {
            value: 25,
            label: 25
        },
        {
            value: 26,
            label: 26
        },
        {
            value: 27,
            label: 27
        },
        {
            value: 28,
            label: 28
        },
        {
            value: 29,
            label: 29
        },
        {
            value: 30,
            label: 30
        },
        {
            value: 31,
            label: 31
        }
    ]);
    const [payScheduleOptions] = useState([
        {
            value: 'Every Week',
            label: 'Every Week'
        },
        {
            value: 'Every Quarter',
            label: 'Every Quarter'
        },
        {
            value: 'Every Month',
            label: 'Every Month'
        },
    ]);
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);

    /* Initial Page Load Function */
    const filllist = () => {
        get('PaySchedule/GetAllPaySchedule')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: any) => {
                    data1.push(
                        {
                            id: obj.id,
                            sno: i,
                            payScheduleName: obj.payScheduleName,
                            payFrequency: obj.payFrequency,
                            workingDays: obj.workingDays,
                            payStartDate: obj.payStartDate,
                            payEndDate: obj.payEndDate,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setPaySchedule(data1)
                setPayScheduleCopy(data1)
            })

    }

    useEffect(() => {
        filllist()
        // var s = SessionManager.getUserID();
        // if (SessionManager.getUserID() == null) {
        //     window.location.href = "/hrms/auth";
        // }
    }, [])

    /* Form Validation Start*/

    const validate = () => {
        let valid = true

        if (PayStartDateValue.value === 0 && payScheduleValue.value === '' && formik.values.payScheduleName === '') {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (formik.values.payScheduleName === "") {
            toast.error("Please Enter Pay Schedule Name");
            return false;
        }
        if (WorkingDays.Sunday === false &&
            WorkingDays.Monday === false &&
            WorkingDays.Tuesday === false &&
            WorkingDays.Wednesday === false &&
            WorkingDays.Thursday === false &&
            WorkingDays.Friday === false &&
            WorkingDays.Saturday === false) {
            toast.error("Please Select Atleast 1 Working Day");
            return false;
        }
        if (payScheduleValue.value === '') {
            toast.error("Please Select Pay Schedule Frequency");
            return false;
        }
        if (PayStartDateValue.value === 0) {
            toast.error("Please Select Pay Schedule Start Date");
            return false;
        }
        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            payScheduleName: "",
            EndDate: 0,
            isActive: true
        },

        onSubmit: (values) => {
            // if (validate() === true) {
            if (rowId === 0) {
                let workingDays: any = ''
                for (let [key, value] of Object.entries(WorkingDays)) {
                    if (value !== false) {
                        workingDays += key + ","
                    }
                }
                console.log(workingDays);

                const insertData = {
                    payScheduleName: values.payScheduleName,
                    workingDays: workingDays.slice(0, workingDays.length - 1),
                    payFrequency: payScheduleValue.value,
                    payStartDate: PayStartDateValue.value,
                    payEndDate: values.EndDate,
                    isActive: values.isActive,
                    createdDate: dayjs(),
                    // createdBy: SessionManager.getUserID()
                }
                console.log(insertData);

                post('PaySchedule/AddPaySchedule', insertData)
                    .then((result) => {
                        filllist()
                        document.getElementById('stateCode')?.focus()
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
                let workingDays: any = ''
                for (let [key, value] of Object.entries(WorkingDays)) {
                    if (value !== false) {
                        workingDays += key + ","
                    }
                }
                console.log(workingDays);
                const updatedata = {
                    id: rowId,
                    payScheduleName: formik.values.payScheduleName,
                    workingDays: workingDays.slice(0, workingDays.length - 1),
                    payFrequency: payScheduleValue.value,
                    payStartDate: PayStartDateValue.value,
                    payEndDate: formik.values.EndDate,
                    isActive: formik.values.isActive,
                    // modifiedBy: SessionManager.getUserID(),
                    modifiedDate: dayjs()
                }
                console.log(updatedata);
                put('PaySchedule/UpdatePaySchedule', updatedata)
                    .then((result) => {
                        filllist()
                        toast.success(result.data.statusmessage)
                        onReset()
                    })
            }
            // }
        },

    })
    /* Formik Library End*/


    useEffect(() => {
        if (PayStartDateValue.value !== 0) {
            if (PayStartDateValue.value === 1) {
                formik.setFieldValue('EndDate', 31)
            }
            else {
                if (PayStartDateValue.value !== 0) {
                    formik.setFieldValue('EndDate', PayStartDateValue.value - 1)
                }
            }
        }

    }, [PayStartDateValue.value])
    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/

    const handleRowClick = (rowData: any) => {
        get('PaySchedule/GetPayScheduleById?id=' + rowData.id)
            .then((result) => {
                selectRef.current?.focus()
                formik.setFieldValue("payScheduleName", result.data.payScheduleName)
                setpayScheduleValue({ value: result.data.payFrequency, label: result.data.payFrequency })
                setPayStartDateValue({ value: result.data.payStartDate, label: result.data.payStartDate })
                formik.setFieldValue("payEndDate", result.data.payEndDate)
                WorkingDays.Sunday = false
                WorkingDays.Monday = false
                WorkingDays.Tuesday = false
                WorkingDays.Wednesday = false
                WorkingDays.Thursday = false
                WorkingDays.Friday = false
                WorkingDays.Saturday = false

                result.data.workingDays.split(',').map((record: any) => {
                    if (record === "Sunday") {
                        WorkingDays.Sunday = true
                    }
                    if (record === "Monday") {
                        WorkingDays.Monday = true
                    }
                    if (record === "Tuesday") {
                        WorkingDays.Tuesday = true
                    }
                    if (record === "Wednesday") {
                        WorkingDays.Wednesday = true
                    }
                    if (record === "Thursday") {
                        WorkingDays.Thursday = true
                    }
                    if (record === "Friday") {
                        WorkingDays.Friday = true
                    }
                    if (record === "Saturday") {
                        WorkingDays.Saturday = true
                    }
                    console.log(record);

                })
                setswtstatus(result.data.isActive);
            })
        setrowId(rowData.id);
        setSelectedRow(rowData);
        setreadonly(true);
    }

    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...PaySchedule].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setPaySchedule(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...PaySchedule].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setPaySchedule(sorted);
            setorder('ASC')
        }
    }

    /* Table Sorting End */
    /* Table Functionality End */

    /* Page Reset Start */

    const onReset = () => {
        if (rowId !== undefined) {
            setpayScheduleValue({ value: '', label: '' })
            setPayStartDateValue({ value: 0, label: '' })
            setWorkingDays({
                'Sunday': false,
                'Monday': false,
                'Tuesday': false,
                'Wednesday': false,
                'Thursday': false,
                'Friday': false,
                'Saturday': false
            })
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
            {/*  Heading Start  */}
            <h3>Pay Schedule Master</h3>
            <div className="card">
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-8 '>
                                <div className="action1">
                                    <button type='reset' form="form" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}>
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>
                            {/*  Heading End  */}

                            {/* Autocomplete Start  */}
                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: "Search For Pay Schedule Name" }}
                                        value={stateValue}
                                        items={PayScheduleCopy}
                                        getItemValue={(item) => (item.payScheduleName + "-" + item.payFrequency + "-" + item.payStartDate + "-" + item.payEndDate)}
                                        shouldItemRender={(state: any, value: any) => state.payScheduleName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                                        renderMenu={(item: any) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                                        }
                                        renderItem={(item: any, isHighlighted: any) => (

                                            <table
                                                className={`item ${isHighlighted ? "selected-item" : ""}`}
                                                style={{ border: "1px" }}
                                            >
                                                <thead style={{ background: "#0095e8", color: "white", position: "sticky", top: 0 }}>
                                                    {
                                                        item.sno === 1 ?
                                                            <tr>
                                                                <th>Pay Schedule Name</th>
                                                                <th>Pay Schedule Frequency</th>
                                                                <th>Start Date</th>
                                                                <th>End Date</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.id}
                                                        onClick={() => handleRowClick(item)}>
                                                        <td className='min-w-200px' >{item.payScheduleName}</td>
                                                        <td className='min-w-200px'>{item.payFrequency}</td>
                                                        <td className='min-w-200px'>{item.payStartDate}</td>
                                                        <td className='min-w-200px'>{item.payEndDate}</td>
                                                        <td className='min-w-200px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}

                                        onChange={(event, val) => {
                                            setstateValue(val);
                                        }}

                                        onSelect={(e, val) => {
                                            setstateValue(val)
                                            get('PaySchedule/GetPayScheduleById?id=' + val.id)
                                                .then((result) => {
                                                    selectRef.current?.focus()
                                                    formik.setFieldValue("payScheduleName", result.data.payScheduleName)
                                                    setpayScheduleValue({ value: result.data.payFrequency, label: result.data.payFrequency })
                                                    setPayStartDateValue({ value: result.data.payStartDate, label: result.data.payStartDate })
                                                    formik.setFieldValue("payEndDate", result.data.payEndDate)
                                                    WorkingDays.Sunday = false
                                                    WorkingDays.Monday = false
                                                    WorkingDays.Tuesday = false
                                                    WorkingDays.Wednesday = false
                                                    WorkingDays.Thursday = false
                                                    WorkingDays.Friday = false
                                                    WorkingDays.Saturday = false

                                                    result.data.workingDays.split(',').map((record: any) => {
                                                        if (record === "Sunday") {
                                                            WorkingDays.Sunday = true
                                                        }
                                                        if (record === "Monday") {
                                                            WorkingDays.Monday = true
                                                        }
                                                        if (record === "Tuesday") {
                                                            WorkingDays.Tuesday = true
                                                        }
                                                        if (record === "Wednesday") {
                                                            WorkingDays.Wednesday = true
                                                        }
                                                        if (record === "Thursday") {
                                                            WorkingDays.Thursday = true
                                                        }
                                                        if (record === "Friday") {
                                                            WorkingDays.Friday = true
                                                        }
                                                        if (record === "Saturday") {
                                                            WorkingDays.Saturday = true
                                                        }
                                                        console.log(record);

                                                    })
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setrowId(val.id);
                                            setSelectedRow(val);
                                            setreadonly(true);
                                        }}
                                    />

                                </div>
                            </div>
                            {/* Autocomplete End  */}
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            <div className="card" style={{ height: 400 }}>
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded " >
                                    <div className="table-responsive" >
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder'>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('payScheduleName')}>Pay Schedule Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-200px text-white' onClick={() => Sorting('payFrequency')}>Pay Schedule Frequency
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-90px text-white' onClick={() => Sorting('payStartDate')}>Start Date
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-90px text-white' onClick={() => Sorting('payEndDate')}>End Date
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-90px text-white' onClick={() => Sorting('isActive')}>Status
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
                                                    {PaySchedule.map((rowData: any) => (

                                                        <tr key={rowData.stateCode}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.id === rowData.id
                                                                        ? '#BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >
                                                            <td >
                                                                {rowData.payScheduleName}
                                                            </td>
                                                            <td >
                                                                {rowData.payFrequency}
                                                            </td >
                                                            <td >
                                                                {rowData.payStartDate}
                                                            </td >
                                                            <td >
                                                                {rowData.payEndDate}
                                                            </td >

                                                            <td >
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

                        <div className='col-lg-6 col-md-12 col-sm-12 '>
                            <div className="card ">
                                <div className="card-body">
                                    {/* Formik Fields Start  */}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form'>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h3>Pay Schedule</h3></div>
                                                    <div className="col-lg-12 col-md-6 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4 Code">
                                                                <div className="p-1">
                                                                    <label className="form-label">Pay Schedule Name</label>
                                                                    <input ref={selectRef} autoFocus name='payScheduleName' className='form-control  form-control-sm' onChange={formik.handleChange} value={formik.values.payScheduleName} />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <label className="form-label">Working Days</label>
                                                            <div className="col-lg-12 col-md-4 Code">
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Sunday" checked={WorkingDays.Sunday} name="Sunday"
                                                                        onChange={(e) => {
                                                                            setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })
                                                                            // return WorkingDays.Sunday = !WorkingDays.Sunday
                                                                        }
                                                                        } />
                                                                    <label className="form-label" >Sunday</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Monday" checked={WorkingDays.Monday} name="Monday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label" >Monday</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Tuesday" checked={WorkingDays.Tuesday} name="Tuesday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label">Tuesday</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Wednesday" checked={WorkingDays.Wednesday} name="Wednesday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label">Wednesday</label>
                                                                </div><br /><br />
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Thursday" checked={WorkingDays.Thursday} name="Thursday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label">Thursday</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Friday" checked={WorkingDays.Friday} name="Friday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label">Friday</label>
                                                                </div>
                                                                <div className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="checkbox" id="Saturday" checked={WorkingDays.Saturday} name="Saturday" onChange={(e) => setWorkingDays({ ...WorkingDays, [e.target.name]: e.target.checked })} />
                                                                    <label className="form-label">Saturday</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label" >Pay Schedule Frequency</label>
                                                                    <Select
                                                                        name="payScheduleValue"
                                                                        options={payScheduleOptions}
                                                                        value={payScheduleValue}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        onChange={(o: any) => setpayScheduleValue(o)}
                                                                        placeholder="Select"
                                                                        // isDisabled={readonly}
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
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label">Start Date</label>
                                                                    <Select
                                                                        name="PayStartDateValue"
                                                                        options={PayStartDateOptions}
                                                                        value={PayStartDateValue}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        onChange={(o: any) => setPayStartDateValue(o)}
                                                                        placeholder="Select"
                                                                        // isDisabled={readonly}
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
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-6 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label">End Date</label><br />
                                                                    <label className="form-label">{formik.values.EndDate}</label>
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-8">
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
                                    {/* Formik Fields End  */}
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
export default PaySchedule;
