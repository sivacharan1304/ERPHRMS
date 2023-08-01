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
const Projects = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [ProjectData, setProjectData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [ProjectLeadOptions, setProjectLeadOptions] = useState<any>([]);
    const [ProjectLeadValue, setProjectLeadValue] = useState<any>({ value: '', label: '' });
    const [projectManagerOptions, setprojectManagerOptions] = useState<any>([]);
    const [projectManagerValue, setprojectManagerValue] = useState<any>({ value: '', label: '' });
    const [projectDeliveryOptions, setprojectDeliveryOptions] = useState<any>([]);
    const [projectDeliveryValue, setprojectDeliveryValue] = useState<any>({ value: '', label: '' });
    const [projectStatusOptions, setprojectStatusOptions] = useState<any>([]);
    const [projectStatusValue, setprojectStatusValue] = useState<any>({ value: '', label: '' });

    /* Initial Page Load Function */
    const filllist = () => {
        get('Projects/GetAllProjects')
            .then((result) => {
                var i = 1;
                let data: any = []
                result.data.map((obj: any) => {
                    data.push(
                        {
                            id: obj.id,
                            projectName: obj.projectName,
                            projectLead: obj.projectLead,
                            projectManager: obj.projectManager,
                            projectDelivery: obj.projectDelivery,
                            projectDuration: obj.projectDuration,
                            projectStatus: obj.projectStatus,
                            projectStartDate: obj.projectStartDate,
                            projectEndDate: obj.projectEndDate,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i
                        })
                    i = i + 1;
                })
                setProjectData(data)

            })
        get('EmpMaster/GetAllEmployeeList')
            .then((result) => {
                let data: any = []
                result.data.map((record: any) => {
                    data.push({
                        // label: record.empCode + " - " + record.empFirstName + " " + record.empMiddleName + " " + record.empLastName,
                        label: record.empFirstName + " " + record.empMiddleName + " " + record.empLastName,
                        value: record.empFirstName + " " + record.empMiddleName + " " + record.empLastName
                    })
                })
                setProjectLeadOptions(data)
                setprojectDeliveryOptions(data)
                setprojectManagerOptions(data)
            })
        setprojectStatusOptions([
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

    const validate = () => {
        let valid = true

        if (formik.values.projectName === '' && ProjectLeadValue.value === '' && projectManagerValue.value == "" && projectDeliveryValue.value == "" && formik.values.projectDuration == ""
           && projectStatusValue.value== ""&& formik.values.projectStartDate == ""&& formik.values.projectEndDate == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (formik.values.projectName === "") {
            toast.error("Please Enter ProjectName");
            return false;
        }
        if (ProjectLeadValue.value === "") {
            toast.error("Please Enter In ProjectLead");
            return false;
        }
        if (projectManagerValue.value === "") {
            toast.error("Please Enter projectManager");
            return false;
        }
        if (projectDeliveryValue.value === "") {
            toast.error("Please Enter projectDelivery");
            return false;
        }
        if (formik.values.projectDuration === "") {
            toast.error("Please Enter projectDuration");
            return false;
        }
        if (projectStatusValue.value === "") {
            toast.error("Please Enter projectStatus");
            return false;
        }
        if (formik.values.projectStartDate  === "") {
            toast.error("Please Enter projectStartDate");
            return false;
        }
        if (formik.values.projectEndDate=== "") {
            toast.error("Please Enter projectEndDate");
            return false;
        }
    
        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            projectName: '',
            projectLead: '',
            projectManager: '',
            projectDelivery: '',
            projectDuration: '',
            projectStatus: '',
            projectStartDate: '',
            projectEndDate: '',
            isActive: true
        },

        onSubmit: (values) => {
             if (validate() === true) {
            if (rowId === 0) {
                const insertData = {
                    projectName: formik.values.projectName,
                    projectLead: ProjectLeadValue.value,
                    projectManager: projectManagerValue.value,
                    projectDelivery: projectDeliveryValue.value,
                    projectDuration: Number(formik.values.projectDuration),
                    projectStatus: projectStatusValue.value,
                    projectStartDate: formik.values.projectStartDate,
                    projectEndDate: formik.values.projectEndDate,
                    isActive: formik.values.isActive,
                    createdBy: SessionManager.getUserID(),
                    createdDate: dayjs()
                }
                console.log(insertData);

                post('Projects/AddProjects', insertData)
                    .then((result) => {
                        filllist()
                        // document.getElementById('stateCode')?.focus()
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
                    projectName: formik.values.projectName,
                    projectLead: ProjectLeadValue.value,
                    projectManager: projectManagerValue.value,
                    projectDelivery: projectDeliveryValue.value,
                    projectDuration: Number(formik.values.projectDuration),
                    projectStatus: projectStatusValue.value,
                    projectStartDate: formik.values.projectStartDate,
                    projectEndDate: formik.values.projectEndDate,
                    isActive: formik.values.isActive,
                    modifiedBy: SessionManager.getUserID(),
                    modifiedDate: dayjs()
                }
                console.log(updatedata);

                put('Projects/UpdateProjects', updatedata)
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
        get('Projects/Getprojects?Id=' + rowData.id)
            .then((result) => {
                document.getElementById('projectName')?.focus();

                formik.setFieldValue("projectName", result.data.projectName)

                // get('EmpMaster/GetEmployeeByCode?empCode=' + result.data.projectLead)
                //     .then((result) => {
                //         setProjectLeadValue({ value: result.data.empMaster.id, label: result.data.empMaster.id + " - " + result.data.empMaster.empFirstName + " " + result.data.empMaster.empMiddleName + " " + result.data.empMaster.empLastName, })
                //     })
                // get('EmpMaster/GetEmployeeByCode?empCode=' + result.data.projectManager)
                //     .then((result) => {
                //         setprojectManagerValue({ value: result.data.empMaster.id, label: result.data.empMaster.id + " - " + result.data.empMaster.empFirstName + " " + result.data.empMaster.empMiddleName + " " + result.data.empMaster.empLastName, })
                //     })
                // get('EmpMaster/GetEmployeeByCode?empCode=' + result.data.projectDelivery)
                //     .then((result) => {
                //         setprojectDeliveryValue({ value: result.data.empMaster.id, label: result.data.empMaster.id + " - " + result.data.empMaster.empFirstName + " " + result.data.empMaster.empMiddleName + " " + result.data.empMaster.empLastName, })
                //     })

                setProjectLeadValue({ value: result.data.projectLead, label: result.data.projectLead })
                setprojectManagerValue({ value: result.data.projectManager, label: result.data.projectManager })
                setprojectDeliveryValue({ value: result.data.projectDelivery, label: result.data.projectDelivery })
                setprojectStatusValue({ value: result.data.projectStatus, label: result.data.projectStatus })
                formik.setFieldValue("projectDuration", result.data.projectDuration.toString())
                formik.setFieldValue("projectStartDate", dayjs(result.data.projectStartDate).format('YYYY-MM-DD'))
                formik.setFieldValue("projectEndDate", dayjs(result.data.projectEndDate).format('YYYY-MM-DD'))
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
            const sorted = [...ProjectData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setProjectData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...ProjectData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setProjectData(sorted);
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
            setProjectLeadValue({ value: '', label: '' })
            setprojectStatusValue({ value: '', label: '' })
            setprojectManagerValue({ value: '', label: '' })
            setprojectDeliveryValue({ value: '', label: '' })
            selectRef.current?.focus()
        }
    }
    /* Page Reset End */

    return (
        <>

            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Projects</h3>
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
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: "Search Project Name" }}
                                        value={stateValue}
                                        items={ProjectData}
                                        getItemValue={(item) => (item.projectName + "-" + item.projectLead + "-" + item.projectManager + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.projectName}
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
                                                                <th>Project Name</th>
                                                                <th>Project Duration(Hrs)</th>
                                                                <th>Project Status</th>
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
                                                        <td className='min-w-150px' >{item.projectName}</td>
                                                        <td className='min-w-250px'>{item.projectDuration}</td>
                                                        <td className='min-w-250px'>{item.projectStatus}</td>
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
                                                    document.getElementById('projectLead')?.focus();
                                                    formik.setFieldValue("projectLead", result.data.id)
                                                    formik.setFieldValue("projectManager", result.data.projectManager)
                                                    formik.setFieldValue("projectDelivery", result.data.projectDelivery)
                                                    formik.setFieldValue("projectDuration", result.data.projectDuration.toString())
                                                    formik.setFieldValue("projectStatus", result.data.projectStatus)
                                                    formik.setFieldValue("projectStatus", result.data.projectStatus)
                                                    formik.setFieldValue("projectEndDate", result.data.projectEndDate)
                                                    formik.setFieldValue("isActive", result.data.isActive)
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setrowId(val.id);
                                            setSelectedRow(val);
                                            setreadonly(true);
                                            setstateValue('')
                                        }}
                                    />
                                </div>
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

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("projectName")}>Project Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("projectDuration")}>Project Duration(Hrs)
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting("projectStatus")}>Project Status
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
                                                    {ProjectData.map((rowData: any, index: any) => (
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
                                                                {rowData.projectDuration}
                                                            </td>
                                                            <td>
                                                                {rowData.projectStatus}
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
                                                    <div className="card-title"><h3>Projects</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4">
                                                                <label className="form-label">Project Name</label>
                                                                <input name='projectName' id="projectName" autoComplete="off" className='form-control form-control-sm'
                                                                    onChange={formik.handleChange}
                                                                    value={formik.values.projectName} />
                                                            </div >
                                                            <div className="col-lg-6 col-md-4">
                                                                <label className="form-label">Project Duration(In Hours)</label>
                                                                <input name='projectDuration' id="projectDuration" autoComplete="off" className='form-control form-control-sm'
                                                                    onChange={formik.handleChange}
                                                                    value={formik.values.projectDuration} />
                                                            </div >
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label">Project Lead</label>
                                                                    <Select
                                                                        name="ProjectLeadValue"
                                                                        value={ProjectLeadValue}
                                                                        options={ProjectLeadOptions}
                                                                        onChange={(o) => setProjectLeadValue(o)}
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
                                                                    <label className="form-label">Project Manager</label>
                                                                    <Select
                                                                        name="projectManagerValue"
                                                                        value={projectManagerValue}
                                                                        options={projectManagerOptions}
                                                                        onChange={(o) => setprojectManagerValue(o)}
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
                                                                    <label className="form-label">Project Delivery</label>
                                                                    <Select
                                                                        name="projectDeliveryValue"
                                                                        value={projectDeliveryValue}
                                                                        options={projectDeliveryOptions}
                                                                        onChange={(o) => setprojectDeliveryValue(o)}
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
                                                                    <label className="form-label">Project Status</label>
                                                                    <Select
                                                                        name="projectStatusValue"
                                                                        value={projectStatusValue}
                                                                        options={projectStatusOptions}
                                                                        onChange={(o) => setprojectStatusValue(o)}
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
                                                                    <label className="form-label">Project Start Date</label>
                                                                    <input name='projectStartDate' type="date" id="projectStartDate" autoComplete="off" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.projectStartDate} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Project End Date</label>
                                                                    <input name='projectEndDate' type="date" id="projectEndDate" autoComplete="off" className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.projectEndDate} />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-4">
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
export default Projects;
