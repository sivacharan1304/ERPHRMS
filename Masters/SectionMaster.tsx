/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import Select from 'react-select';
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    departmentName: string
    sectionID: string,
    secName: string,
    deptID: string,
    validFrom: string,
    validTo: string,
    isActive: boolean,
}

/* SectionMaster Functionality Start */
const SectionMaster = () => {

    /* Const Variable Initialization */
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [city, setCity] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [data, setData] = useState([]);
    const [order, setorder] = useState('ASC');
    const [stateValue, setstateValue] = useState('');
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [companyshortname, setcompanyshortname] = useState<any>({ value: '', label: '' });
    const [divisionOption, setDivisionOption] = useState<any>({ value: '', label: '' });
    const [selectedOption, setSelectedOption] = useState<any>({ value: '', label: '' });
    const [companydivision, setCompanydivision] = useState([]);
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
                            label: obj.compDivID,
                        })
                })
                setCompanydivision(data2)
            })

        get('DeptSection/GetAllDeptSection')
            .then((result) => {
                console.log(result);
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            sno: i,
                            sectionID: obj.sectionID,
                            departmentName: obj.departmentName,
                            secName: obj.secName,
                            deptID: obj.departmentName,
                            validFrom: dayjs(obj.validFrom).format('YYYY-MM-DD'),
                            validTo: dayjs(obj.validTo).format('YYYY-MM-DD'),
                            isActive: obj.isActive ? 'Active' : 'In Active',

                        })
                    i = i + 1;
                })
                setCity(data1)
                setData(data1)
                console.log(data1);

            })
    }
    useEffect(() => {
        if (rowId === 0) {
            formik.resetForm()
        }
        if (divisionOption.value !== '') {
            get('CompDivision/GetCompDivision?compdivid=' + divisionOption.value)
                .then((res) => {
                    formik.setFieldValue('compDivShtName', res.data.compDivShtName)
                    console.log(res.data.compDivShtName);
                })

        }
    }, [divisionOption])

    useEffect(() => {
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {

            window.location.href = "/hrms/auth";
        }
        filllist()
    }, [])

    useEffect(() => {
        if (divisionOption.value !== '') {
            get('DeptSection/GetDepartByDivisionID?DivisionID=' + divisionOption.value)
                .then((res) => {
                    let data3: any = [];
                    res.data.map((obj: any) => {
                        data3.push(
                            {
                                value: obj.deptId,
                                label: obj.departmentName,
                            })
                    })
                    setoptions(data3)
                })
        }
    }, [divisionOption.value])


    /* Form Validation */
    const validate = () => {
        let valid = true

        if (selectedOption.value === "" && divisionOption.value === "" && formik.values.sectionID == "" && formik.values.secName == "" && formik.values.validFrom == "" && formik.values.validTo === "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (divisionOption.value === "") {
            toast.error("Please Enter Companydivision");
            return false;
        }
        if (selectedOption.value === "") {

            toast.error("Please Enter department");
            return false;
        }
        if (formik.values.sectionID == "") {
            toast.error("Please Enter sectionID");
            return false;
        }
        if (formik.values.secName == "") {
            toast.error("Please Enter secName");
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

    const formik = useFormik({
        initialValues: {
            compDivShtName: "",
            sectionID: "",
            secName: "",
            deptID: "",
            validFrom: "",
            validTo: "",
            isActive: true
        },

        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const InsertData = {
                        deptID: selectedOption.value,
                        sectionID: values.sectionID,
                        secName: values.secName,
                        validFrom: dayjs(values.validFrom).format('YYYY-MM-DD'),
                        validTo: dayjs(values.validTo).format('YYYY-MM-DD'),
                        isActive: values.isActive,
                        createdDate: dayjs()

                    }
                    post('DeptSection/AddDeptSection', InsertData)
                        .then((result) => {
                            filllist()
                            document.getElementById('cityCode')?.focus()
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
                        sectionID: formik.values.sectionID,
                        secName: formik.values.secName,
                        deptID: selectedOption.value,
                        validFrom: formik.values.validFrom,
                        validTo: formik.values.validTo,
                        isActive: formik.values.isActive,
                        modifiedDate: dayjs()
                    }
                    console.log(updatedata);
                    put('DeptSection/UpdateDeptSection', updatedata)
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
    /* Autocomplete KeyEnter Event handlers */
    const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
        if (event.keyCode === 13 || event.key === 'Enter') {
            setSelectedRow(item);
        }
    };

    /* Table Rowclick Event Handlers*/
    const handleRowClick = (rowData: IData) => {
        get('DeptSection/GetDeptSection?DepSectionID=' + rowData.sectionID)
            .then((result) => {
                console.log(result.data);
                setDivisionOption({ value: result.data.compDivID, label: result.data.compDivID })
                setSelectedOption({ value: result.data.deptID, label: result.data.departmentName })
                formik.setFieldValue("sectionID", result.data.sectionID)
                formik.setFieldValue("secName", result.data.secName)
                formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                formik.setFieldValue("validTo", dayjs(result.data.validTo).format('YYYY-MM-DD'))
                formik.values.isActive = result.data.isActive
                setswtstatus(result.data.isActive);
            })
        setreadonly(true);
        setrowId(1)
        setSelectedRow(rowData)
        document.getElementById('secName')?.focus();
    }
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...city].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setCity(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...city].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setCity(sorted);
            setorder('ASC')
        }
    }
    /*  End */
    /* Table Functionality End */

    /* Page Reset */
    const onReset = () => {
        if (rowId !== undefined) {
            // document.getElementById('sectionID')?.focus();
            setSelectedOption({ value: '', label: '' })
            setDivisionOption({ value: '', label: '' })
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
            <h3> Department Section Master</h3>
            <div className="card " >
                <div className='shadow-sm p-2 mb-5   bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>

                            {/*  Heading Button Start */}
                            <div className='col-lg-12 col-md-12 col-sm-8 '>
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
                                        inputProps={{ placeholder: "Search SectionID" }}
                                        value={stateValue}
                                        items={data}
                                        getItemValue={(item) => (item.sectionID + "-" + item.secName + "-" + "-" + item.deptID + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.sectionID.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                                            <tr>
                                                                <th>DeptSection </th>
                                                                <th>DeptSection Name</th>
                                                                <th>Department Name </th>
                                                                <th> Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.id}
                                                        onClick={() => handleRowClick(item)}
                                                        onKeyDown={(event) => handleRowKeyDown(event, item)}
                                                        tabIndex={0}>
                                                        <td className='min-w-150px' >{item.sectionID}</td>
                                                        <td className='min-w-150px'>{item.secName}</td>
                                                        <td className='min-w-150px'>{item.departmentName}</td>
                                                        <td className='min-w-150px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}

                                        /* Binding The Values Tab Control Columns In The Fields */
                                        onChange={(event, val) => {

                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            console.log(val);

                                            setstateValue(val)
                                            setstateValue('')
                                            get('DeptSection/GetDeptSection?DepSectionID=' + val.sectionID)
                                                .then((result) => {
                                                    console.log(result.data);
                                                    setDivisionOption({ value: result.data.compDivID, label: result.data.compDivID + "-" + result.data.compDivShtName, })
                                                    setSelectedOption({ value: result.data.deptID, label: result.data.departmentName })
                                                    formik.setFieldValue("sectionID", result.data.sectionID)
                                                    formik.setFieldValue("secName", result.data.secName)
                                                    formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                                                    formik.setFieldValue("validTo", dayjs(result.data.validTo).format('YYYY-MM-DD'))
                                                    formik.values.isActive = result.data.isActive
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setreadonly(true);
                                            setrowId(val.sectionID)
                                            setSelectedRow(val)
                                            document.getElementById('secName')?.focus();
                                        }}
                                    />
                                </div>
                                {/* <button className='aply col-lg-3 col-sm-12 ms-2'>Apply Filter</button>  */}
                            </div>
                            {/* Autocomplete End  */}
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            <div className="card " style={{ height: 400 }}>
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded ">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='fw-bold text-muted'>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting('sectionID')}>Section Id

                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('secName')}>Section Name

                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('deptID')}>Department Name

                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-90px text-white' onClick={() => Sorting('deptID')}>Status

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
                                                    {city.map((rowData: IData) => (

                                                        <tr key={rowData.sectionID}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.sectionID === rowData.sectionID
                                                                        ? '#BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >
                                                            <td>
                                                                {rowData.sectionID}
                                                            </td >
                                                            <td>
                                                                {rowData.secName}
                                                            </td>
                                                            <td>
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
                                                <div className="form-group row">
                                                    <div className="card-title"><h4> Department Section</h4></div>
                                                    <div className="col-lg-12 col-md-6 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-5 col-md-9">
                                                                <div className="p-1">
                                                                    <label className="form-label">CompanyDivision </label>

                                                                    <Select
                                                                        ref={selectRef}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        name="companydivision"
                                                                        options={companydivision}
                                                                        id='companydivision'
                                                                        value={divisionOption}
                                                                        onChange={(o: any) => setDivisionOption(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        autoFocus
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
                                                            <label className="col-lg-7 form-label mt-11" >{formik.values.compDivShtName !== "" ? formik.values.compDivShtName : null}</label>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-5 col-md-9">
                                                                <div className="p-1">
                                                                    <label className="form-label">Department </label>
                                                                    <Select

                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        name="departmentName"
                                                                        options={options}
                                                                        id='departmentName'
                                                                        value={selectedOption}
                                                                        onChange={(o: any) => setSelectedOption(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}

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
                                                            <div className="col-lg-4 col-md-5 Id">
                                                                <div className="p-1 ">
                                                                    <label className="form-label" htmlFor="" >Section ID</label>
                                                                    <Field name='sectionID' id="sectionID" maxlength={20} readOnly={readonly} className='form-control form-control-sm ' onChange={formik.handleChange} value={formik.values.sectionID} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-5 col-md-7 Name">
                                                                <div className="p-1 ">
                                                                    <label className="form-label" htmlFor="" >Section Name</label>
                                                                    <Field name='secName' id="secName" maxlength={20} className='form-control form-control-sm ' onChange={formik.handleChange} value={formik.values.secName.replace(/[^a-z,]+$/i, '')} />
                                                                </div >
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-6 Dat">
                                                                <div className="p-1">
                                                                    <label className="form-label" htmlFor="" >Valid From</label>
                                                                    <Field name='validFrom' type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validFrom} />
                                                                </div >
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 Dat">
                                                                <div className="p-1 ">
                                                                    <label className="form-label" htmlFor="" >Valid To</label>
                                                                    <Field name='validTo' type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validTo} />
                                                                </div>
                                                            </div>
                                                        </div>


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
/* SectionMaster Functionality End */
export default SectionMaster;
