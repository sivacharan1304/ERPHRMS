/* Import Statement */
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from "../Service/Services";
import Select from 'react-select';
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    compDivID: string,
    compDivShtName: string,
    compDivLongName: string,
    compID: string,
    currencyCode: string,
    languageCode: string,
    validFrom: string,
    validTo: string,
    isActive: boolean,
    sno: number
}

/* Company Division Currency Master Functionality Start */
const CompanyDivision = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [DataCopy, setDataCopy] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [companyID, setcompanyID] = useState<any>({ value: '', label: '' });
    const [currencyCode, setcurrencyCode] = useState<any>({ value: '', label: '' });
    const [languageCode, setlanguageCode] = useState<any>({ value: '', label: '' });
    const [compID, setcompID] = useState([]);
    const [currCode, setcurrCode] = useState([]);
    const [langCode, setlangCode] = useState([]);
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);

    /* Initial Page Load Function */

    const filllist = () => {
        get('Company/GetAllCompany')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.compId,
                            label: obj.compShortName,
                        })
                })
                setcompID(data2)
            })
        get('Language/GetAllLanguage')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.languageCode,
                            label: obj.languageCode + " - " + obj.description,
                        })
                })
                setlangCode(data2)
            })
        get('Currency/GetAllCurrency')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.currencyCode,
                            label: obj.currencyCode + " - " + obj.shortDesc,
                        })
                })
                setcurrCode(data2)
            })
        get('CompDivision/GetAllCompDivision')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            compDivID: obj.compDivID,
                            compDivShtName: obj.compDivShtName,
                            compDivLongName: obj.compDivLongName,
                            compID: obj.compID,
                            currencyCode: obj.currencyCode,
                            languageCode: obj.languageCode,
                            validFrom: dayjs(obj.validFrom).format('DD-MM-YYYY'),
                            validTo: dayjs(obj.validTo).format('DD-MM-YYYY'),
                            isActive: obj.isActive ? 'Active' : 'In Active',
                            sno: i,
                        })
                    i = i + 1;
                })
                setData(data1)
                setDataCopy(data1)
            })

    }

    useEffect(() => {
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {

            window.location.href = "/hrms/auth";
        }
        filllist()
    }, [])

    /* Form Validation Start*/
    const validate = () => {
        let valid = true

        if (languageCode.value === '' && companyID.value === '' && currencyCode.value === '' && formik.values.validFrom == "" && formik.values.validTo == "" && formik.values.compDivID == "" && formik.values.compDivLongName == "" && formik.values.compDivShtName == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (companyID.value === "") {
            toast.error("Please select Company Name");
            return false;
        }
        if (formik.values.compDivID === "") {
            toast.error("Please Enter Company Division ID");
            return false;
        }
        if (formik.values.compDivShtName === "") {
            toast.error("Please Enter Company Division Short Name");
            return false;
        }
        if (formik.values.compDivLongName === "") {
            toast.error("Please Enter Company Division Long Name");
            return false;
        }
        if (currencyCode.value === "") {
            toast.error("Please Select Currency Code");
            return false;
        }
        if (languageCode.value === "") {
            toast.error("Please select Language Code");
            return false;
        }
        if (formik.values.validFrom === "") {
            toast.error("Please Enter Valid From");
            return false;
        }

        if (dayjs(formik.values.validFrom) >= dayjs(formik.values.validTo)) {
            toast.error("End Date is Greater than of Start Date");
            return false;
        }
        if (formik.values.validTo === "") {
            toast.error("Please Enter Valid To");
            return false;
        }
        if (dayjs(formik.values.validTo) <= dayjs(formik.values.validFrom)) {
            toast.error("Start Date is Less than of End Date")
            return false;
        }
        return valid;
    }

    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            compDivID: '',
            compDivShtName: '',
            compDivLongName: '',
            compID: '',
            currencyCode: '',
            languageCode: '',
            validFrom: '',
            validTo: '',
            isActive: true,
        },
        onSubmit: (values) => {
            if (validate() === true) {
                /*  insert Functionality */
                if (rowId === 0) {
                    const insertData = {
                        compDivID: values.compDivID.toUpperCase(),
                        compDivShtName: values.compDivShtName,
                        compDivLongName: values.compDivLongName,
                        compID: companyID.value,
                        currencyCode: currencyCode.value,
                        languageCode: languageCode.value,
                        validFrom: values.validFrom,
                        validTo: values.validTo,
                        isActive: values.isActive,
                        createdDate: dayjs(),
                        createdBy: SessionManager.getUserID(),
                    }
                    post('CompDivision/AddCompDivision', insertData)
                        .then((result) => {
                            filllist()

                            document.getElementById('compDivID')?.focus()
                            selectRef.current.focus()
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
                /*  Update Functionality */
                else {
                    const updatedata = {
                        compDivID: formik.values.compDivID,
                        compDivShtName: formik.values.compDivShtName,
                        compDivLongName: formik.values.compDivLongName,
                        compID: companyID.value,
                        currencyCode: currencyCode.value,
                        languageCode: languageCode.value,
                        validFrom: formik.values.validFrom,
                        validTo: formik.values.validTo,
                        isActive: formik.values.isActive,
                        modifiedDate: dayjs(),
                        modifiedBy: SessionManager.getUserID(),
                    }

                    put('CompDivision/UpdateCompDivision', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            onReset()
                            selectRef.current.focus()
                        })
                }
            }
        },
    })
    /* Formik Library End*/

    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/
    const handleRowClick = (rowData: IData) => {
        get('CompDivision/GetCompDivision?compdivid=' + rowData.compDivID)
            .then((result) => {
                document.getElementById('compDivShtName')?.focus();
                setcompanyID({ value: result.data.compID, label: result.data.compID })
                setcurrencyCode({ value: result.data.currencyCode, label: result.data.currencyCode })
                setlanguageCode({ value: result.data.languageCode, label: result.data.languageCode })
                formik.setFieldValue('compDivID', result.data.compDivID)
                formik.setFieldValue('compDivShtName', result.data.compDivShtName)
                formik.setFieldValue('compDivLongName', result.data.compDivLongName)
                formik.setFieldValue('compID', result.data.compID)
                formik.setFieldValue('languageCode', result.data.languageCode)
                formik.setFieldValue('currencyCode', result.data.currencyCode)
                formik.setFieldValue('validFrom', dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                formik.setFieldValue('validTo', dayjs(result.data.validTo).format('YYYY-MM-DD'))
                formik.values.isActive = result.data.isActive
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
    /* Table Sorting End */
    /* Table Functionality End */

    /* Page Reset Start */

    const onReset = () => {
        if (rowId !== undefined) {
            setrowId(0)
            formik.resetForm()
            setSelectedRow(undefined)
            setcompanyID({ value: '', label: '' })
            setcurrencyCode({ value: '', label: '' })
            setlanguageCode({ value: '', label: '' })
            setreadonly(false);
            setswtstatus(true);
            selectRef.current.focus()
        }
    }

    /* Page Reset End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            {/*  Heading Start  */}
            <h3>Company Division Master</h3>
            <div className="card">
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-8'>
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
                                        inputProps={{ placeholder: "Search For DivisionID" }}
                                        value={stateValue}
                                        items={DataCopy}
                                        getItemValue={(item) => (item.compDivID + "-" + item.compDivShtName + "-" + item.isActive)}
                                        shouldItemRender={(state: any, value: any) => state.compDivID.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                                                <th>Division Id</th>
                                                                <th>Short Name</th>
                                                                <th>Long Name</th>
                                                                <th>Company Id</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.compDivID}
                                                        onClick={() => handleRowClick(item)} >
                                                        <td className='min-w-150px' >{item.compDivID}</td>
                                                        <td className='min-w-150px'>{item.compDivShtName}</td>
                                                        <td className='min-w-150px'>{item.compDivLongName}</td>
                                                        <td className='min-w-150px'>{item.compID}</td>
                                                        <td className='min-w-70px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        onChange={(event, val: any) => setstateValue(val)}
                                        onSelect={(e, val: any) => {
                                            setstateValue(val)
                                            get('CompDivision/GetCompDivision?compdivid=' + val.compDivID)
                                                .then((result) => {
                                                    document.getElementById('compDivShtName')?.focus();
                                                    setcompanyID({ value: result.data.compID, label: result.data.compID })
                                                    setcurrencyCode({ value: result.data.currencyCode, label: result.data.currencyCode })
                                                    setlanguageCode({ value: result.data.languageCode, label: result.data.languageCode })
                                                    formik.setFieldValue('compDivID', result.data.compDivID)
                                                    formik.setFieldValue('compDivShtName', result.data.compDivShtName)
                                                    formik.setFieldValue('compDivLongName', result.data.compDivLongName)
                                                    formik.setFieldValue('compID', result.data.compID)
                                                    formik.setFieldValue('languageCode', result.data.languageCode)
                                                    formik.setFieldValue('currencyCode', result.data.currencyCode)
                                                    formik.setFieldValue('validFrom', dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                                                    formik.setFieldValue('validTo', dayjs(result.data.validTo).format('YYYY-MM-DD'))
                                                    formik.values.isActive = result.data.isActive
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setstateValue('')
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
                                                    <tr className='text-muted text-bolder'>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compDivID')}>Division Id
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compDivShtName')}>Short Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compDivLongName')}>Long Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compID')}>Company Id
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('isActive')}>Status <img
                                                            alt='sort'
                                                            src={toAbsoluteUrl('/media/logos/sort.png')}
                                                            className='ms-1'
                                                            height={13}
                                                            width={13}
                                                        /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Data.map((rowData: IData) => (

                                                        <tr key={rowData.compDivID}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.compDivID === rowData.compDivID
                                                                        ? '#BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}

                                                        >
                                                            <td>
                                                                {rowData.compDivID}
                                                            </td>

                                                            <td>
                                                                {rowData.compDivShtName}
                                                            </td>
                                                            <td>
                                                                {rowData.compDivLongName}
                                                            </td>
                                                            <td>
                                                                {rowData.compID}
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
                                    {/* Formik Fields Start  */}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form'>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h3>Company Division Master</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-6">
                                                        <div className="row">
                                                            <div className="col-lg-5 col-md-4 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label">Company Name</label>
                                                                    <Select
                                                                        ref={selectRef}
                                                                        name="compID"
                                                                        options={compID}
                                                                        value={companyID}
                                                                        onChange={(o: any) => setcompanyID(o)}
                                                                        placeholder="Select"
                                                                        autoFocus
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
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
                                                                </div >
                                                            </div>


                                                            <div className="col-lg-4 col-md-3 Id">
                                                                <div className="p-1">
                                                                    <label className="form-label">Company Division Id</label>

                                                                    <Field name='compDivID' id='compDivID' readOnly={readonly} maxLength={5} type='text' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.compDivID.replace(/[^a-z,]+$/i, '')} />
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-3 shortName">
                                                                <div className="p-1">
                                                                    <label className="form-label">Short Name</label>

                                                                    <Field name='compDivShtName' maxLength={10} autoComplete='off' id='compDivShtName' type='text' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.compDivShtName.replace(/[^a-z\s,]+$/i, '')} />
                                                                </div >
                                                            </div>

                                                            <div className="col-lg-5 col-md-4 longName">
                                                                <div className="p-1">
                                                                    <label className="form-label">Long Name</label>

                                                                    <Field name='compDivLongName' maxLength={40} autoComplete='off' type='text' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.compDivLongName.replace(/[^a-z\s,]+$/i, '')} />
                                                                </div >
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-3 Code">
                                                                <div className="p-1">
                                                                    <label className="form-label">Currency Code</label>

                                                                    <Select
                                                                        name="currencyCode"
                                                                        options={currCode}
                                                                        value={currencyCode}
                                                                        onChange={(o: any) => setcurrencyCode(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
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
                                                                </div >
                                                            </div>

                                                            <div className="col-lg-3 col-md-3 Code">
                                                                <div className="p-1">
                                                                    <label className="form-label">Language Code</label>

                                                                    <Select
                                                                        name="languageCode"
                                                                        options={langCode}
                                                                        value={languageCode}
                                                                        onChange={(o: any) => setlanguageCode(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
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
                                                            <div className="col-lg-4 col-md-3 Dat">
                                                                <div className="p-1">
                                                                    <label className="form-label">Valid From</label>

                                                                    <Field name='validFrom' type='date' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validFrom} />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-4 col-md-3 Dat">
                                                                <div className="p-1">
                                                                    <label className="form-label">Valid To</label>

                                                                    <Field name='validTo' type='date' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.validTo} />
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
/* Company Division Currency Master Functionality End */

export default CompanyDivision;
