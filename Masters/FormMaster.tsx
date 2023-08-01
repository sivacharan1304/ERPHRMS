/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import { get, post, put } from "../Service/Services";
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    formID: number,
    formName: string,
    formType: string,
    menuName: string,
    parentName: string,
    isActive: boolean,
    sno: number,
    createdDate: string,
    modifiedDate: string
}
/* Form Functionality Start */
const FormMaster = () => {
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [Data1, setData1] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [order, setorder] = useState('DSC');
    const [stateValue, setstateValue] = useState('');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [savebtndisable, setsavebtndisable] = useState(false);
    const INITIAL_COUNT = "";
    const [errmsg, seterrmsg] = useState(INITIAL_COUNT);
    const prevCountRef = useRef<string>(INITIAL_COUNT);
    /* Initial Page Load Function */
    const filllist = () => {
        get('Forms/GetAllFormTable')
            .then((result) => {
                console.log(result);
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            sno: i,
                            formID: obj.formID,
                            formName: obj.formName,
                            formType: obj.formType,
                            menuName: obj.menuName,
                            parentName: obj.parentName,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setData(data1)
                setData1(data1)
            })
    }

    useEffect(() => {
        filllist()
    }, [])
    useEffect(() => {
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {
    
          window.location.href = "/hrms/auth";
        }
        prevCountRef.current = errmsg;
        if (inputRef.current) {
            inputRef.current.focus();
        }
        filllist()
    }, [errmsg])
    /* Form Validation */
    const validate = () => {
        let valid = true

        if (formik.values.formName == "" && formik.values.formType == "" && formik.values.menuName == "" && formik.values.parentName == "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (formik.values.formName == "") {
            toast.error("Please Enter Form Name ");
            return false;
        }
        if (formik.values.formType == "") {
            toast.error("Please Enter Form Type ");
            return false;
        }
        if (formik.values.menuName == "") {
            toast.error("Please Enter Menu Name ");
            return false;
        }
        if (formik.values.parentName == "") {
            toast.error("Please Enter Parent Name ");
            return false;
        }
        return valid;
    }
    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            formID: "",
            formName: "",
            formType: "",
            menuName: "",
            parentName: "",
            isActive: true,
            sno: 0,
        },
        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const Insertdata = {
                        formName: formik.values.formName,
                        formType: formik.values.formType,
                        menuName: formik.values.menuName,
                        parentName: formik.values.parentName,
                        isActive: formik.values.isActive,
                        createdBy:SessionManager.getUserID(),
                        createdDate: dayjs()
                    }
                    post('Forms/AddFormTable', Insertdata)
                        .then((result) => {
                            console.log();
                            filllist()
                            document.getElementById('formName')?.focus()
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
                /*  update functionality */
                else {
                    const updatedata = {
                        formID: rowId,
                        formName: formik.values.formName,
                        formType: formik.values.formType,
                        menuName: formik.values.menuName,
                        parentName: formik.values.parentName,
                        isActive: swtstatus,
                        modifiedBy:SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }
                    put('Forms/UpdateFormTable', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage);
                            onReset()
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
        get('Forms/GetFormTableById?id=' + rowData.formID)
            .then((result) => {
                formik.setFieldValue("formName", result.data.formName)
                formik.setFieldValue("formType", result.data.formType)
                formik.setFieldValue("menuName", result.data.menuName)
                formik.setFieldValue("parentName", result.data.parentName)
                setswtstatus(result.data.isActive);
            })
        setrowId(rowData.formID)
        setSelectedRow(rowData);
        setreadonly(true);
        document.getElementById('formType')?.focus();
    }
    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...Data].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...Data].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setData(sorted);
            setorder('ASC')
        }
    }
    /*  End */
    /* Table Functionality End*/

    /* Page Reset */
    const onReset = () => {
        if (rowId !== undefined) {
            setrowId(0)
            setreadonly(false);
            setswtstatus(true);
            setSelectedRow(undefined)
            document.getElementById('formName')?.focus();
            formik.resetForm()
            seterrmsg('');
        }
    }
    /*  End */
    /* show&hide functionality for alert Div style */
    const divStyle = () => {

        return errmsg ? "" : "none";
    }
    return (
        <>
            <div style={{ display: divStyle() }}  >
                {prevCountRef.current}
            </div>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Form Master</h3>
            <div className="card">

                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        {/*  Heading Button Start */}
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-8'>
                                <div className="action1">
                                    <button type='reset' form="form" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}  >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                    {/* <button form='form' className='btn btn-link ' style={{ color: '#0095e8' }}>
                    <KTIcon iconName='filter' style={{ color: '#0095e8', fontSize: 18 }} />
                    Filter</button> */}
                                </div>
                            </div>
                            {/*  Heading End  */}

                            {/*  Autocomplete Start  */}
                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: 'Search For FormName' }}
                                        value={stateValue}
                                        items={Data1}
                                        getItemValue={(item) => (item.formName + "-" + item.formType + "-" + item.menuName + "-" + item.parentName + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.formName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                                        renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                                        }
                                        renderItem={(item, isHighlighted) => (

                                            <table
                                                className={`item ${isHighlighted ? "selected-item" : ""}`}
                                                style={{ border: "1px" }}
                                            >
                                                <thead style={{ background: "#0095e8", color: "white", position: "sticky", top: 0 }}>
                                                    {
                                                        item.sno === 1 ?
                                                            <tr className="">
                                                                <th>Form Name</th>
                                                                <th>Form Type</th>
                                                                <th>Menu Name</th>
                                                                <th>Parent Name</th>
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
                                                        tabIndex={0}
                                                        className=""
                                                    >
                                                        <td className='min-w-150px' >{item.formName}</td>
                                                        <td className="min-w-150px">{item.formType}</td>
                                                        <td className="min-w-150px">{item.menuName}</td>
                                                        <td className="min-w-150px">{item.parentName}</td>
                                                        <td className='min-w-90px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        onChange={(event, val) => {
                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            get('Forms/GetFormTableById?id=' + val.formID)
                                                .then((result) => {
                                                    document.getElementById('formType')?.focus();
                                                    formik.setFieldValue("formName", result.data.formName)
                                                    formik.setFieldValue("formType", result.data.formType)
                                                    formik.setFieldValue("menuName", result.data.menuName)
                                                    formik.setFieldValue("parentName", result.data.parentName)
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setSelectedRow(val);
                                            setreadonly(true);
                                            setrowId(1)

                                        }}
                                    />
                                </div>


                                {/*  Autocomplete End  */}
                            </div>
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
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1' >

                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder'>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("formName")} >Form Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("formType")} >Form Type
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("menuName")} >Menu Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("parentName")} >Parent Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-90px text-white' onClick={() => Sorting("isActive")}>Status
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
                                                    {Data.map((rowData: IData) => (
                                                        <tr key={rowData.formID}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.formID === rowData.formID
                                                                        ? ' #BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                            className="">

                                                            <td>
                                                                {rowData.formName}
                                                            </td>
                                                            <td>
                                                                {rowData.formType}
                                                            </td>
                                                            <td>
                                                                {rowData.menuName}
                                                            </td>
                                                            <td>
                                                                {rowData.parentName}
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

                        <div className='col-lg-6 col-md-12 col-sm-12 '>
                            <div className="card ">
                                <div className="card-body" >
                                    {/* Formik integration Start*/}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>
                                        {({ errors, touched, isSubmitting
                                        }) =>
                                        (
                                            <Form id='form' autoComplete="off">
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="card-title"><h4>Form Master</h4></div>
                                                        <div className="col-lg-12 col-md-12 col-sm-6">
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-5">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Form Name</label>
                                                                        <Field maxLength="50" id="formName" autoFocus readOnly={readonly} name='formName' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.formName.replace(/[^a-z,]+$/i, '')} />
                                                                        {formik.errors.formName && formik.touched.formName && isSubmitting == true && rowId === 0 ? <div style={{ color: 'red' }}>{formik.errors.formName}</div> : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-5 col-md-4 Form-Type">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Form Type</label>
                                                                        <Field maxLength="20" id="formType" name='formType' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.formType.replace(/[^a-z,]+$/i, '')} />
                                                                        {formik.errors.formType && formik.touched.formType && isSubmitting == true && rowId === 0 ? <div style={{ color: 'red' }}>{formik.errors.formType}</div> : null}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-5">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Menu Name</label>
                                                                        <Field maxLength="50" id="menuName" name='menuName' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.menuName.replace(/[^a-z,]+$/i, '')} />
                                                                        {formik.errors.menuName && formik.touched.menuName && isSubmitting == true && rowId === 0 ? <div style={{ color: 'red' }}>{formik.errors.menuName}</div> : null}
                                                                    </div>

                                                                </div>
                                                                <div className="col-lg-6 col-md-5">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Parent Name</label>
                                                                        <Field maxLength="50" id="parentName" name='parentName' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.parentName.replace(/[^a-z,]+$/i, '')} />
                                                                        {formik.errors.parentName && formik.touched.parentName && isSubmitting == true && rowId === 0 ? <div style={{ color: 'red' }}>{formik.errors.parentName}</div> : null}
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
                                        )}
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
/* Form Functionality Start */
export default FormMaster;
