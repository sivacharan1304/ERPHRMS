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
const PerformanceParameter = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [PerfParameterData, setPerfParameterData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);

    /* Initial Page Load Function */
    const filllist = () => {
        get('PerformanceParameter/GetAllPerformanceParameter')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: any) => {
                    data1.push(
                        {
                            paramId: obj.paramId,
                            parameterName: obj.parameterName,
                            parameterDescription: obj.parameterDescription,
                            displayOrder: obj.displayOrder,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i
                        })
                    i = i + 1;
                })
                setPerfParameterData(data1)

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

        if (formik.values.parameterName === '' && formik.values.parameterDescription === '' && formik.values.displayOrder == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (formik.values.parameterName === "") {
            toast.error("Please Enter Parameter Name");
            return false;
        }
        if (formik.values.parameterDescription === "") {
            toast.error("Please Enter Parameter Description");
            return false;
        }
        if (formik.values.displayOrder === "") {
            toast.error("Please Enter Display Order");
            return false;
        }
        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            parameterName: "",
            parameterDescription: "",
            displayOrder: "",
            isActive: true
        },

        onSubmit: (values) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const insertData = {
                        parameterName: formik.values.parameterName,
                        parameterDescription: formik.values.parameterDescription,
                        displayOrder: Number(formik.values.displayOrder),
                        isActive: formik.values.isActive,
                        createdBy: SessionManager.getUserID(),
                        createdDate: dayjs()
                    }

                    post('PerformanceParameter/AddPerformanceParameter', insertData)
                        .then((result) => {
                            filllist()
                            document.getElementById('stateCode')?.focus()
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
                        paramId: rowId,
                        parameterName: formik.values.parameterName,
                        parameterDescription: formik.values.parameterDescription,
                        displayOrder: Number(formik.values.displayOrder),
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }

                    put('PerformanceParameter/UpdatePerformanceParameter', updatedata)
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
        get('PerformanceParameter/GetPerformanceParameter?ParamId=' + rowData.paramId)
            .then((result) => {
                document.getElementById('parameterName')?.focus();
                formik.setFieldValue("parameterName", result.data.parameterName)
                formik.setFieldValue("parameterDescription", result.data.parameterDescription)
                formik.setFieldValue("displayOrder", result.data.displayOrder.toString())
                formik.setFieldValue("isActive", result.data.isActive)
                setswtstatus(result.data.isActive);
            })
        setSelectedRow(rowData);
        setreadonly(true);
        setrowId(rowData.paramId);
    }

    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...PerfParameterData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setPerfParameterData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...PerfParameterData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setPerfParameterData(sorted);
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
            <h3>Performance Parameter Master</h3>
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
                                        inputProps={{ placeholder: "Search Parameter Name" }}
                                        value={stateValue}
                                        items={PerfParameterData}
                                        getItemValue={(item) => (item.parameterName + "-" + item.parameterDescription + "-" + item.displayOrder + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.parameterName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                                                <th>Parameter Name</th>
                                                                <th>Parameter Description</th>
                                                                <th>Display Order</th>
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
                                                        <td className='min-w-150px' >{item.parameterName}</td>
                                                        <td className='min-w-250px'>{item.parameterDescription}</td>
                                                        <td className='min-w-250px'>{item.displayOrder}</td>
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
                                            get('PerformanceParameter/GetPerformanceParameter?ParamId=' + val.paramId)
                                                .then((result) => {
                                                    document.getElementById('parameterName')?.focus();
                                                    formik.setFieldValue("parameterName", result.data.parameterName)
                                                    formik.setFieldValue("description", result.data.parameterDescription)
                                                    formik.setFieldValue("displayOrder", result.data.displayOrder.toString())
                                                    formik.setFieldValue("isActive", result.data.isActive)
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setSelectedRow(val);
                                            setreadonly(true);
                                            setrowId(val.paramId);
                                            setstateValue('')
                                        }}
                                    />
                                </div>
                                {/* <button className='aply col-lg-3 col-sm-12 ms-2'>Apply Filter</button> */}
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

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("addrType")}>Parameter Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("addrDesc")}>Parameter Description
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("addrDesc")}>Display Order
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
                                                    {PerfParameterData.map((rowData: any, index: any) => (
                                                        <tr key={index}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.paramId === rowData.paramId
                                                                        ? ' #BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >

                                                            <td>
                                                                {rowData.parameterName}
                                                            </td>
                                                            <td>
                                                                {rowData.parameterDescription}
                                                            </td>
                                                            <td>
                                                                {rowData.displayOrder}
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
                                                    <div className="card-title"><h3>Performance Parameter</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-4 Type">
                                                                <div className="p-1">
                                                                    <label className="form-label">Parameter Name</label>
                                                                    <input maxLength={20} autoFocus id="parameterName" ref={selectRef} autoComplete="off" name='parameterName' className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.parameterName.replace(/[^a-z,]+$/i, '')} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7 Description">
                                                                <div className="p-1">
                                                                    <label className="form-label">Parameter Description</label>
                                                                    <textarea name='parameterDescription' id="parameterDescription" autoComplete="off" maxLength={1000} className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.parameterDescription.replace(/[^a-z\s,]+$/i, '')}
                                                                    />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-7">
                                                                <div className="p-1">
                                                                    <label className="form-label">Display Order</label>
                                                                    <input name='displayOrder' id="displayOrder" autoComplete="off" readOnly={readonly} className='form-control form-control-sm'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.displayOrder.replace(/[^\d-]/, '')} />
                                                                </div >
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
export default PerformanceParameter;
