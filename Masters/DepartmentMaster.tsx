/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import '../Qs_css/Autocomplete.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post, put } from "../Service/Services";
import Autocomplete from "react-autocomplete";
import Select from 'react-select';
import dayjs from "dayjs";
import SessionManager from "../../modules/auth/components/Session";

/* Array Initialization */
interface IData {
    id: number,
    deptId: number,
    departmentName: string,
    compDivID: string,
    compDivShtName: string,
    validFrom: string,
    validTo: string,
    isActive: boolean,
}

/* DepartmentMaster Functionality Start */
const DepartmentMaster = () => {

    /* Const Variable Initialization */
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [department, setDepartment] = useState([]);
    const [data, setData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [order, setorder] = useState('ASC');
    const [stateValue, setstateValue] = useState('');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>({ value: '', label: '' });
    const [options, setoptions] = useState([])

    /* Initial Page Load Function */
    const filllist = () => {
        get('CompDivision/GetAllCompDivision')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.compDivID,
                            label: obj.compDivShtName,
                        })
                })
                setoptions(data2)
            })

        get('Department/GetAllDepartments')
            .then((result) => {
                console.log(result);
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            id: i,
                            deptId: obj.deptId,
                            departmentName: obj.departmentName,
                            compDivID: obj.compDivID,
                            compDivShtName: obj.compDivShtName,
                            validFrom: dayjs(obj.validFrom).format('YYYY-MM-DD'),
                            validTo: dayjs(obj.validTo).format('YYYY-MM-DD'),
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setDepartment(data1)
                setData(data1)
            })
    }

    useEffect(() => {
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
        filllist()
    }, [])

    /* Form Validation */
    const validate = () => {
        let valid = true

        if (selectedOption.value === "" && formik.values.departmentName == "" && formik.values.validFrom == "" && formik.values.validTo === "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (selectedOption.value === "") {
            toast.error("Please Enter Companydivision");
            return false;
        }
        if (formik.values.departmentName == "") {
            toast.error("Please Enter DepartmentName");
            return false;
        }
        if (formik.values.validFrom == "") {
            toast.error("Please Enter validFrom date");
            return false;
        }
        else if (dayjs(formik.values.validFrom) > dayjs(formik.values.validTo)) {
            toast.error("End Date is Greater than of Start Date");
            return false;
        }
        if (formik.values.validTo == "") {
            toast.error("Please Enter validTo date");
            return false;
        }
        else if (dayjs(formik.values.validTo) < dayjs(formik.values.validFrom)) {
            toast.error("Start Date is Less than of End Date")
            return false;
        }
        return valid;
    }

    /* Formik Library Start */
    const formik = useFormik({
        initialValues: {
            deptId: 0,
            departmentName: "",
            compDivID: "",
            validFrom: "",
            validTo: "",
            isActive: true
        },

        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {

                    const InsertData = {
                        departmentName: values.departmentName,
                        compDivID: selectedOption.value,
                        validFrom: dayjs(values.validFrom).format('YYYY-MM-DD'),
                        validTo: dayjs(values.validTo).format('YYYY-MM-DD'),
                        isActive: values.isActive,
                        createdBy: SessionManager.getUserID(),
                        createDate: dayjs()
                    }
                    console.log(InsertData);
                    post('Department/AddDepartment', InsertData)
                        .then((result) => {
                            filllist()
                            document.getElementById('departmentName')?.focus()
                            if (result.data.status == 'F') {
                                toast.warning(result.data.statusmessage);

                            }
                            else if (result.data.status == 'S') {
                                toast.success(result.data.statusmessage);
                                onReset()
                            }

                        })
                }
                /*  update functionality */
                else {
                    const updatedata = {
                        deptId: rowId,
                        departmentName: formik.values.departmentName,
                        compDivID: selectedOption.value,
                        validFrom: formik.values.validFrom,
                        validTo: formik.values.validTo,
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }
                    console.log(updatedata);
                    put('Department/UpdateDepartment', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            console.log(result.data.statusmessage);
                            onReset();
                        })
                }

            }

        },
    })
    /* Formik Library End*/

    /* Table Functionality Start*/
    /* Autocomplete KeyEnter Event handlers */
    const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
        if (event.keyCode === 13 || event.key === 'Enter') {
            setSelectedRow(item);
        }
    };

    /* Table Rowclick Event Handlers*/
    const handleRowClick = (rowData: IData) => {
        console.log(rowData.deptId);
        get('Department/GetDepartment?departmentID=' + rowData.deptId)
            .then((result) => {
                setSelectedOption({ value: result.data.divisionID, label: result.data.compDivShtName })
                formik.setFieldValue("compDivID", result.data.compDivID);
                formik.setFieldValue("departmentName", result.data.departmentName)
                formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                formik.setFieldValue("validTo", dayjs(result.data.validTo).format('YYYY-MM-DD'))
                formik.values.isActive = result.data.isActive
                setswtstatus(result.data.isActive);
            })
        setreadonly(true);
        setrowId(rowData.deptId)
        setSelectedRow(rowData)
        document.getElementById('departmentName')?.focus();
    }

    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...department].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setDepartment(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...department].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setDepartment(sorted);
            setorder('ASC')
        }
    }
    /*  End */
    /* Table Functionality End */

    /* Page Reset */
    const onReset = () => {
        if (rowId !== undefined) {
            setSelectedOption({ value: '', label: '' })
            setrowId(0)
            formik.resetForm()
            setreadonly(false);
            setswtstatus(true);
            setSelectedRow(undefined)
            selectRef.current.focus()
        }
    }
    /* End */


    return (
        <>

            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Department Master </h3>
            <div className="card " >
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            {/*  Heading Button Start */}
                            <div className='col-lg-12 col-md-12 col-sm-8'>
                                <div className="action1">
                                    <button form='form' type="reset" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>
                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>
                            {/*  Heading End  */}

                            {/*  Autocomplete Start  */}
                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: "Search Department Name" }}
                                        value={stateValue}
                                        items={data}
                                        getItemValue={(item) => (item.compDivID + "-" + item.departmentName + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.departmentName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                                        renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                                        }
                                        renderItem={(item, isHighlighted) => (

                                            <table
                                                className={`item ${isHighlighted ? "selected-item" : ""}`}
                                                style={{ border: "1px" }}
                                            >
                                                <thead style={{ background: "#0095e8", color: "white", position: "sticky", top: 0 }}>
                                                    {
                                                        item.id === 1 ?
                                                            <tr>
                                                                <th>CompanyDivision</th>
                                                                <th>Department Name</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr key={item.id}
                                                        onClick={() => handleRowClick(item)}
                                                        onKeyDown={(event) => handleRowKeyDown(event, item)}
                                                        tabIndex={0}>
                                                        <td className='min-w-200px'>{item.compDivShtName}</td>
                                                        <td className='min-w-200px' >{item.departmentName}</td>
                                                        <td className='min-w-90px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}

                                        /* Binding The Values Tab Control Columns In The Fields */
                                        onChange={(event, val) => {
                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            setstateValue(val)
                                            setstateValue('')
                                            get('Department/GetDepartment?departmentID=' + val.deptId)
                                                .then((result) => {
                                                    setSelectedOption({ value: result.data.divisionID, label: result.data.compDivShtName })
                                                    formik.setFieldValue("compDivID", result.data.compDivID);
                                                    formik.setFieldValue("departmentName", result.data.departmentName)
                                                    formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                                                    formik.setFieldValue("validTo", dayjs(result.data.validTo).format('YYYY-MM-DD'))
                                                    formik.values.isActive = result.data.isActive
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setreadonly(true);
                                            setrowId(val.deptId)
                                            setSelectedRow(val)
                                            document.getElementById('departmentName')?.focus();
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
                        <div className='col-lg-6 col-md-12 col-sm-12' >
                            <div className="card" style={{ height: 400 }}>
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded ">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='fw-bold text-muted'>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compDivShtName')} >Company Division
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}

                                                            />
                                                        </th>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting('departmentName')}>Department Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>

                                                        <th className='min-w-70px text-white' onClick={() => Sorting('isActive')}>Status

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
                                                    {department.map((rowData: IData) => (

                                                        <tr key={rowData.deptId}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.deptId === rowData.deptId
                                                                        ? '#BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >
                                                            <td >
                                                                {rowData.compDivShtName}
                                                            </td>
                                                            <td >
                                                                {rowData.departmentName}
                                                            </td>

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
                            <div className="card">
                                <div className="card-body">
                                    {/* Formik integration Start*/}

                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form'>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h4> Department</h4></div>
                                                    <div className="col-lg-12 col-md-6 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-8">
                                                                <div className="p-1">
                                                                    <label className="form-label">CompanyDiv ID</label>

                                                                    <Select
                                                                        ref={selectRef}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}

                                                                        name="compDivID"
                                                                        options={options}
                                                                        id='compDivID'
                                                                        value={selectedOption}
                                                                        onChange={(o: any) => setSelectedOption(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        // values={onReset}

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
                                                                                width: "50%",
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
                                                                </div >
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-9">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="" > Department Name</label>
                                                                    <Field name='departmentName' id="departmentName" maxlength={20} className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.departmentName.replace(/[^a-z,]+$/i, '')} style={{ width: "80%" }} />
                                                                </div >
                                                            </div>
                                                        </div>


                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-6 Dat">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="" >Valid From</label>

                                                                    <Field name='validFrom' type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validFrom} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 Dat">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="" >Valid To</label>

                                                                    <Field name='validTo' type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validTo} />
                                                                </div >
                                                            </div>
                                                        </div>

                                                        <div className="row">

                                                            <div className="col-lg-8 col-md-6 ">
                                                                <div className="p-1">
                                                                    <label className="form-label ">Status</label>
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
/* DepartmentMaster Functionality End */

export default DepartmentMaster;
