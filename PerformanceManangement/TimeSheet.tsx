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
const TimeSheet = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [TimeSheetData, setTimeSheetData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [projectIDValue, setprojectIDValue] = useState<any>({ value: '', label: '' });
    const [taskIDValue, settaskIDValue] = useState<any>({ value: '', label: '' });
    const [EmpIDValue, setEmpIDValue] = useState<any>({ value: '', label: '' });
    const [ProjectIDOptions, setProjectIDOptions] = useState();
    const [TaskIDOptions, setTaskIDOptions] = useState();
    const [EmpOptions, setEmpOptions] = useState();



    // const handleStartTimeChange = (event: any) => {
    //     formik.handleChange(event);

    //     calculateTotalHours(event.target.value, formik.values.EndTime);
    // };

    // const handleEndTimeChange = (event: any) => {
    //     formik.handleChange(event);

    //     calculateTotalHours(event.target.value, formik.values.StartTime);
    // };

    // const calculateTotalHours = (startTime: string, endTime: string) => {
    //     if (startTime && endTime) {
    //         const startDate = new Date(startTime);
    //         const endDate = new Date(endTime);
    //         const timeDifferenceInMs = endDate.getTime() - startDate.getTime();
    //         const totalHours = timeDifferenceInMs / (1000 * 60 * 60);
    //         formik.setFieldValue('totalHourSpend', totalHours.toString());
    //     }
    // };

    /* Initial Page Load Function */
    const filllist = () => {
        get('TimeSheet/GetAllEmpTimeSheet')
            .then((result) => {
                var i = 1;
                let data: any = []
                result.data.map((obj: any) => {
                    data.push(
                        {
                            id: obj.id,
                            empcode: obj.empcode,
                            projectName: obj.projectName,
                            projectID: obj.projectID,
                            taskID: obj.taskID,
                            taskName: obj.taskName,
                            StartDate: obj.StartDate,
                            EndDate: obj.EndDate,
                            StartTime: obj.StartTime,
                            EndTime: obj.EndTime,
                            totalHourSpend: obj.totalHourSpend,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i
                        })
                    i = i + 1;
                })
                setTimeSheetData(data)
            })
        get('EmpMaster/GetAllEmployeeList')
            .then((result) => {
                let data: any = []
                result.data.map((record: any) => {
                    data.push({
                        value: record.empCode,
                        label: record.empCode + ' - ' + record.empFirstName + " " + record.empMiddleName + " " + record.empLastName

                    })
                })
                setEmpOptions(data);
            })


        get('TaskMaster/GetAllTaskMaster')
            .then((result) => {
                let data: any = []
                result.data.map((record: any) => {
                    data.push({
                        value: record.id,
                        label: record.taskName
                    })
                })
                setTaskIDOptions(data)
            })
        get('Projects/GetAllProjects')
            .then((result) => {
                let data: any = []
                result.data.map((record: any) => {
                    data.push({
                        value: record.id,
                        label: record.projectName
                    })
                })
                setProjectIDOptions(data)
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

        if (EmpIDValue.value === '' && projectIDValue.value === '' && formik.values.StartDate == "" && formik.values.EndDate == "" && formik.values.StartTime == "" && formik.values.EndTime == "" && formik.values.totalHourSpend == "" && taskIDValue.value == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (EmpIDValue.value === "") {
            toast.error("Please Enter Employee Code");
            return false;
        }
        if (projectIDValue.value === "") {
            toast.error("Please Select Project");
            return false;
        }
        if (taskIDValue.value === "") {
            toast.error("Please Select Task");
            return false;
        }
        if (formik.values.StartDate === "") {
            toast.error("Please Enter Start Date");
            return false;
        }
        if (formik.values.EndDate === "") {
            toast.error("Please Enter End Date");
            return false;
        }
        if (formik.values.StartTime === "") {
            toast.error("Please Enter Start Time");
            return false;
        }
        if (formik.values.EndTime === "") {
            toast.error("Please Enter End Time");
            return false;
        }
        if (formik.values.totalHourSpend === "") {
            toast.error("Please Enter Total Hours Spend");
            return false;
        }

        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            empcode: "",
            StartDate: "",
            EndDate: "",
            StartTime: "",
            EndTime: "",
            totalHourSpend: '',
            isActive: true
        },
        onSubmit: (values) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const insertData = {
                        empcode: EmpIDValue.value,
                        projectID: projectIDValue.value.toString(),
                        taskID: taskIDValue.value.toString(),
                        StartDate: formik.values.StartDate,
                        EndDate: formik.values.EndDate,
                        StartTime: formik.values.StartTime.toString(),
                        EndTime: formik.values.EndTime.toString(),
                        totalHourSpend: formik.values.totalHourSpend,
                        isActive: formik.values.isActive,
                        createdBy: SessionManager.getUserID(),
                        createdDate: dayjs()
                    }
                    console.log(insertData);

                    // post('TimeSheet/AddTimeSheet', insertData)
                    //     .then((result) => {
                    //         filllist()
                    //         // document.getElementById('stateCode')?.focus()
                    //         console.log(result);
                    //         if (result.data.status == 'F') {
                    //             toast.warning(result.data.statusmessage);

                    //         }
                    //         else if (result.data.status == 'S') {
                    //             toast.success(result.data.statusmessage);
                    //             onReset()
                    //         }
                    //     })
                }
                else {
                    const updatedata = {
                        id: rowId,
                        empcode: EmpIDValue.value,
                        projectID: projectIDValue.value.toString(),
                        taskID: taskIDValue.value.toString(),
                        StartDate: formik.values.StartDate,
                        EndDate: formik.values.EndDate,
                        StartTime: formik.values.StartTime.toString(),
                        EndTime: formik.values.EndTime.toString(),
                        totalHourSpend: formik.values.totalHourSpend,
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }
                    console.log(updatedata);

                    put('TimeSheet/UpdateTimeSheet', updatedata)
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
        console.log(rowData);

        get('TimeSheet/GetTimeSheet?Id=' + rowData.id)
            .then((result) => {
                // document.getElementById('empcode')?.focus();
                get('EmpMaster/GetEmployeeByCode?empCode=' + result.data.empcode)
                    .then((result) => {
                        setEmpIDValue({ value: result.data.empMaster.empCode, label: result.data.empMaster.empCode + ' - ' + result.data.empMaster.empFirstName + " " + result.data.empMaster.empMiddleName + " " + result.data.empMaster.empLastName })
                    })
                get('Projects/Getprojects?Id=' + result.data.projectID)
                    .then((result) => {
                        setprojectIDValue({ value: result.data.id, label: result.data.projectName })
                    })
                get('TaskMaster/GetTaskMaster?Id=' + result.data.taskID)
                    .then((result) => {
                        settaskIDValue({ value: result.data.id, label: result.data.taskName })
                    })
                formik.setFieldValue("StartDate", dayjs(result.data.startDate).format('YYYY-MM-DD'))
                formik.setFieldValue("EndDate", dayjs(result.data.endDate).format('YYYY-MM-DD'))
                formik.setFieldValue("StartTime", result.data.startTime)
                formik.setFieldValue("EndTime", (result.data.endTime))
                formik.setFieldValue("totalHourSpend", result.data.totalHourSpend.toString())
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
            const sorted = [...TimeSheetData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setTimeSheetData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...TimeSheetData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setTimeSheetData(sorted);
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
            setprojectIDValue({ value: '', label: '' })
            settaskIDValue({ value: '', label: '' })
            setEmpIDValue({ value: '', label: '' })
        }
    }
    /* Page Reset End */

    return (
        <>

            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Time Sheet</h3>
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

                                                        <th className='min-w-100px text-white' onClick={() => Sorting("projectName")}>Project Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting("taskName")}>Task Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting("totalHourSpend")}>Total Hours
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
                                                    {TimeSheetData.map((rowData: any, index: any) => (
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
                                                                {rowData.projectName}
                                                            </td>
                                                            <td>
                                                                {rowData.taskName}
                                                            </td>
                                                            <td>
                                                                {rowData.totalHourSpend}
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
                                                    <div className="card-title"><h3>Time Sheet</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label">Employee</label>
                                                                    <Select
                                                                        name="EmpIDValue"
                                                                        value={EmpIDValue}
                                                                        options={EmpOptions}
                                                                        onChange={(o) => setEmpIDValue(o)}
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
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-7 Description">
                                                                <div className="p-1">
                                                                    <label className="form-label">Project</label>
                                                                    <Select
                                                                        name="projectIDValue"
                                                                        value={projectIDValue}
                                                                        options={ProjectIDOptions}
                                                                        onChange={(o) => setprojectIDValue(o)}
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
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Task</label>
                                                                    <Select
                                                                        name="taskIDValue"
                                                                        value={taskIDValue}
                                                                        options={TaskIDOptions}
                                                                        onChange={(o) => settaskIDValue(o)}
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
                                                                    <label className="form-label">Start Date</label>
                                                                    <input name='StartDate' type="date" id="StartDate" autoComplete="off" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.StartDate} />
                                                                </div >
                                                            </div>



                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">End Date</label>
                                                                    <input name='EndDate' type="date" id="EndDate" autoComplete="off" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.EndDate} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Start Time</label>
                                                                    <input
                                                                        name='StartTime'
                                                                        id="StartTime"
                                                                        type="time"
                                                                        autoComplete="off"
                                                                        className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        min="00:00"
                                                                        max="23:59"
                                                                        value={formik.values.StartTime}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">End Time</label>
                                                                    <input
                                                                        name='EndTime'
                                                                        id="EndTime"
                                                                        autoComplete="off"
                                                                        className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        type="time"
                                                                        min="00:00"
                                                                        max="23:59"
                                                                        value={formik.values.EndTime}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Total Hours</label>
                                                                    <input
                                                                        name='totalHourSpend'
                                                                        id="totalHourSpend"
                                                                        autoComplete="off"
                                                                        className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.totalHourSpend}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
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
export default TimeSheet;
