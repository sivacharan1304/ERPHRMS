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
const TaskMaster = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [TaskData, setTaskData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [StatusOptions, setStatusOptions] = useState<any>([]);
    const [StatusValue, setStatusValue] = useState<any>({ value: '', label: '' })
    const [assignedByOptions, setassignedByOptions] = useState<any>([]);
    const [assignedByValue, setassignedByValue] = useState<any>({ value: '', label: '' })

    /* Initial Page Load Function */
    const filllist = () => {
        get('TaskMaster/GetAllTaskMaster')
            .then((result) => {
                var i = 1;
                let data: any = []
                result.data.map((obj: any) => {
                    data.push(
                        {
                            id: obj.id,
                            taskName: obj.taskName,
                            taskDecs: obj.taskDecs,
                            assignedBy: obj.assignedBy,
                            estimatedHours: obj.estimatedHours,
                            actualHours: obj.actualHours,
                            status: obj.status,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i
                        })
                    i = i + 1;
                })
                setTaskData(data)

            })
        get('EmpMaster/GetAllEmployeeList')
            .then((result) => {
                let data: any = []
                result.data.map((record: any) => {
                    data.push({
                        // label: record.empCode + " - " + record.empFirstName + " " + record.empMiddleName + " " + record.empLastName,
                        label: record.empFirstName + " " + record.empMiddleName + " " + record.empLastName,
                        value: record.empFirstName + " " + record.empMiddleName + " " + record.empLastName,
                    })
                })
                setassignedByOptions(data)
            })
        setStatusOptions([
            {
                value: 'New',
                label: 'New'
            },
            {
                value: 'In progress',
                label: 'In progress'
            },
            {
                value: 'Complete',
                label: 'Complete'
            },
            {
                value: 'Cancel',
                label: 'Cancel'
            },
        ])
    }


    useEffect(() => {
        filllist()
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
    }, [])

    /* Form Validation Start*/

    // const validate = () => {
    //     let valid = true

    //     if (formik.values.attendanceDate === '' && formik.values.inTime === '' && formik.values.outTime == "" && formik.values.totalHours == "" && formik.values.otHours == "") {
    //         toast.error("Invalid Details. Please Check Required Fields....");
    //         return false;
    //     }
    //     if (formik.values.attendanceDate === "") {
    //         toast.error("Please Enter Attendance Date");
    //         return false;
    //     }
    //     if (formik.values.inTime === "") {
    //         toast.error("Please Enter In Time");
    //         return false;
    //     }
    //     if (formik.values.outTime === "") {
    //         toast.error("Please Enter Out Time");
    //         return false;
    //     }
    //     if (formik.values.totalHours === "") {
    //         toast.error("Please Enter Total Hours");
    //         return false;
    //     }
    //     if (formik.values.otHours === "") {
    //         toast.error("Please Enter OT Hours");
    //         return false;
    //     }
    //     return valid;
    // }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            taskName: '',
            taskDecs: '',
            assignedBy: '',
            estimatedHours: '',
            actualHours: '',
            status: '',
            isActive: true
        },

        onSubmit: (values) => {
            // if (validate() === true) {
            if (rowId === 0) {
                const insertData = {
                    taskName: formik.values.taskName,
                    taskDecs: formik.values.taskDecs,
                    assignedBy: assignedByValue.value,
                    estimatedHours: Number(formik.values.estimatedHours),
                    actualHours: Number(formik.values.actualHours),
                    status: StatusValue.value,
                    isActive: formik.values.isActive,
                    createdBy: SessionManager.getUserID(),
                    createdDate: dayjs()
                }
                console.log(insertData);

                post('TaskMaster/AddProjects', insertData)
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
                    taskName: formik.values.taskName,
                    taskDecs: formik.values.taskDecs,
                    assignedBy: assignedByValue.value,
                    estimatedHours: Number(formik.values.estimatedHours),
                    actualHours: Number(formik.values.actualHours),
                    status: StatusValue.value,
                    isActive: formik.values.isActive,
                    modifiedBy: SessionManager.getUserID(),
                    modifiedDate: dayjs()
                }
                console.log(updatedata);

                put('TaskMaster/UpdateTaskMaster', updatedata)
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

    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/

    const handleRowClick = (rowData: any) => {
        get('TaskMaster/GetTaskMaster?Id=' + rowData.id)
            .then((result) => {
                console.log(result.data);                
                document.getElementById('attendanceDate')?.focus();
                formik.setFieldValue("taskName", result.data.taskName)
                formik.setFieldValue("taskDecs", result.data.taskDecs)
                formik.setFieldValue("estimatedHours", result.data.estimatedHours.toString())
                formik.setFieldValue("actualHours", result.data.actualHours.toString())
                setStatusValue({ value: result.data.status, label: result.data.status })
                setassignedByValue({ value: result.data.assignedBy, label: result.data.assignedBy })
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
            const sorted = [...TaskData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setTaskData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...TaskData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setTaskData(sorted);
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
            <h3>Task Master</h3>
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

                            {/*  Autocomplete Start  */}
                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                {/* <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: "Search Task Name" }}
                                        value={stateValue}
                                        items={TaskData}
                                        getItemValue={(item) => (item.taskName + "-" + item.taskDecs + "-" + item.assignedBy + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.attendanceDate.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                                        renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                                        }
                                        renderItem={(item, isHighlighted) => (
                                            <table
                                                className={`item ${isHighlighted ? "selected-item" : ""}`}
                                            >
                                                <thead style={{ background: "#0095e8", color: "white" }}>
                                                    {
                                                        item.sno === 1 ?
                                                            <tr>
                                                                <th>Task Name</th>
                                                                <th>Actual Hours</th>
                                                                <th>Task Status</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr key={item.id}
                                                        onClick={() => handleRowClick(item)}
                                                        tabIndex={0}
                                                    >
                                                        <td className='min-w-150px' >{item.taskName}</td>
                                                        <td className='min-w-250px'>{item.actualHours}</td>
                                                        <td className='min-w-250px'>{item.status}</td>
                                                        <td className='min-w-90px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        )}

                                        onChange={(event, val) => {
                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            get('PerformanceParameter/GetPerformanceParameter?ParamId=' + val.attendanceID)
                                                .then((result) => {
                                                    document.getElementById('attendanceDate')?.focus();
                                                    formik.setFieldValue("attendanceDate", result.data.attendanceDate)
                                                    formik.setFieldValue("inTime", result.data.inTime.toString())
                                                    formik.setFieldValue("outTime", result.data.outTime.toString())
                                                    formik.setFieldValue("totalHours", result.data.outTime.toString())
                                                    formik.setFieldValue("otHours", result.data.outTime.toString())
                                                    formik.setFieldValue("isActive", result.data.isActive)
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setSelectedRow(val);
                                            setreadonly(true);
                                            setrowId(val.attendanceID);
                                            setstateValue('')
                                        }}
                                    />
                                </div> */}
                            </div>
                        </div>
                        {/* Autocomplete End  */}

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

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("taskName")}>Task Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("actualHours")}>Actual Hours
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("status")}>Task Status
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
                                                    {TaskData.map((rowData: any, index: any) => (
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
                                                                {rowData.taskName}
                                                            </td>
                                                            <td>
                                                                {rowData.actualHours}
                                                            </td>
                                                            <td>
                                                                {rowData.status}
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
                                                    <div className="card-title"><h3>Task</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label">Task Name</label>
                                                                    <input autoFocus id="taskName" ref={selectRef} autoComplete="off" className='form-control form-control-sm'
                                                                        name='taskName'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.taskName} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-7 Description">
                                                                <div className="p-1">
                                                                    <label className="form-label">Task Description</label>
                                                                    <textarea name='taskDecs' id="taskDecs" autoComplete="off" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.taskDecs}
                                                                    />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Assigned By</label>
                                                                    <Select
                                                                        name="assignedByValue"
                                                                        value={assignedByValue}
                                                                        options={assignedByOptions}
                                                                        onChange={(o) => setassignedByValue(o)}
                                                                        placeholder="Select"
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
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Estimated Hours</label>
                                                                    <input name='estimatedHours' id="estimatedHours" autoComplete="off"  className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.estimatedHours.replace(/[^\d-]/, '')} />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Actual Hours</label>
                                                                    <input name='actualHours' id="actualHours" autoComplete="off"  className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.actualHours.replace(/[^\d-]/, '')} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Task Status</label>
                                                                    <Select
                                                                        name="StatusValue"
                                                                        value={StatusValue}
                                                                        options={StatusOptions}
                                                                        onChange={(o) => setStatusValue(o)}
                                                                        placeholder="Select"
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
                                                                </div >

                                                            </div>
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
export default TaskMaster;
