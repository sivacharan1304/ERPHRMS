/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik"
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    id: number,
    famType: string,
    description: string,
    isActive: boolean,
    createdDate: string,
    sno: number,
}

/* FamilyType Functionality Start */
const FamilyType = () => {

    /* Const Variable Initialization */
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [Data1, setData1] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);

    /* Initial Page Load Function */
    const filllist = () => {
        get('FamilyType/GetAllFamilyType')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            id: i,
                            famType: obj.famType,
                            description: obj.description,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setData(data1)
                setData1(data1)
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

        if (formik.values.famType == "" && formik.values.description == "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }

        if (formik.values.famType == "") {
            toast.error("Please Enter Family Type");
            return false;
        }
        if (formik.values.description == "") {
            toast.error("Please Enter description");
            return false;
        }

        return valid;
    }

    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            famType: "",
            description: "",
            isActive: true,
        },

        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const Insertdata = {
                        famType: formik.values.famType.toUpperCase(),
                        description: formik.values.description,
                        isActive: formik.values.isActive,
                        createdDate: dayjs()
                    }
                    post('FamilyType/AddFamilyType', Insertdata)
                        .then((result) => {
                            filllist()
                            document.getElementById('famType')?.focus();
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
                        famType: formik.values.famType,
                        description: formik.values.description,
                        isActive: swtstatus,
                        modifiedDate: dayjs()
                    }
                    put('FamilyType/UpdateFamilyType', updatedata)
                        .then((result) => {
                            toast.success(result.data.statusmessage);
                            filllist()
                            onReset()
                        })
                }

            }
        },
    })
    /* Formik Library End */

    /* Table Functionality Start */
    /* Autocomplete KeyEnter Event handlers */
    const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
        if (event.keyCode === 13 || event.key === 'Enter') {
            setSelectedRow(item);
        }
    };

    /* Table Rowclick Event Handlers */
    const handleRowClick = (rowData: IData) => {
        get('FamilyType/GetFamilyByType?enityType=' + rowData.famType)
            .then((result) => {
                document.getElementById('description')?.focus();
                formik.setFieldValue("famType", result.data.famType)
                formik.setFieldValue("description", result.data.description)
                setswtstatus(result.data.isActive);
            })

        setSelectedRow(rowData);
        setreadonly(true);
        setrowId(1)
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
            document.getElementById('famType')?.focus();
            setrowId(0)
            setSelectedRow(undefined)
            setreadonly(false);
            setswtstatus(true);
            formik.resetForm()
        }
    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Family Type Master</h3>
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
                                        inputProps={{ placeholder: "Search FamilyType" }}
                                        value={stateValue}
                                        items={Data1}
                                        getItemValue={(item) => (item.famType + "-" + item.description + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.famType.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                                                <th>Family Type</th>
                                                                <th>Description</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.id}
                                                        onClick={() => handleRowClick(item)}
                                                        onKeyDown={(event) => handleRowKeyDown(event, item)}
                                                        tabIndex={0}
                                                    >
                                                        <td className='min-w-150px' >{item.famType}</td>
                                                        <td className='min-w-250px'>{item.description}</td>
                                                        <td className='min-w-95px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        /* Binding The Values Tab Control Columns In The Fields */
                                        onChange={(event, val) => {
                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            get('FamilyType/GetFamilyByType?enityType=' + val.famType)
                                                .then((result) => {
                                                    document.getElementById('description')?.focus();
                                                    formik.setFieldValue("famType", result.data.famType)
                                                    formik.setFieldValue("description", result.data.description)
                                                    setswtstatus(result.data.isActive);
                                                })

                                            setSelectedRow(val);
                                            setreadonly(true);
                                            setrowId(1)

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
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>

                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder '>

                                                        <th className='min-w-100px text-white' onClick={() => Sorting("famType")}>Family Type
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting("description")}>Description
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
                                                    {Data.map((rowData: IData) => (
                                                        <tr key={rowData.famType}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.famType === rowData.famType
                                                                        ? ' #BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >

                                                            <td>
                                                                {rowData.famType}
                                                            </td>
                                                            <td>
                                                                {rowData.description}
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
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            <div className="card ">
                                <div className="card-body">
                                    {/* Formik integration Start*/}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form' autoComplete="off">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h4>Family Type Master</h4></div>
                                                    <div className="col-lg-12 col-md-6 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="famType" >Family Type</label>
                                                                    <Field maxlength='10' autoFocus id="famType" readOnly={readonly} name='famType' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.famType.replace(/[^a-z,]+$/i, '')} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-5 col-md-6 Description">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="description" >Family Description</label>
                                                                    <Field name='description' id="description" maxlength='20' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.description.replace(/[^a-z\s,]+$/i, '')} />
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
/* FamilyType Functionality End */
export default FamilyType;
