/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import '../Qs_css/Autocomplete.css'
import { get, post, put } from "../Service/Services";
import Autocomplete from "react-autocomplete";
import Select from 'react-select';
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    compCurrId: number,
    compDivID: string,
    compID: string,
    currencyCode: string,
    refKey: string,
    isActive: boolean,
    sno: number
}

/* Company Currency Functionality Start */

const Currency = () => {
    const selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [Data1, setData1] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [order, setorder] = useState('DSC');
    const [stateValue, setstateValue] = useState('');
    const [companyId, setcompanyId] = useState<any>({ value: '', label: '' });
    const [compDivisionId, setcompDivisionId] = useState<any>({ value: '', label: '' });
    const [currencyCode, setcurrencyCode] = useState<any>({ value: '', label: '' });
    const [compIdOptions, setcompIdOptions] = useState([]);
    const [DivisionIdOptions, setDivisionIdOptions] = useState([]);
    const [currCodeOptions, setcurrCodeOptions] = useState([]);
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [errmsg, seterrmsg] = useState('');
    const prevCountRef = useRef<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    /* Initial Page Load Function */
    const filllist = () => {
        get('Company/GetAllCompany')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.compId,
                            label: obj.compId,
                        })
                })
                setcompIdOptions(data2)
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
                setcurrCodeOptions(data2)
            })
        get('CompanyCurrency/GetAllCompanyCurrency')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            sno: i,
                            compCurrId: obj.compCurrId,
                            compDivID: obj.compDivID,
                            compID: obj.compID,
                            currencyCode: obj.currencyCode,
                            refKey: obj.refKey,
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
        var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
    }, [])

    useEffect(() => {

        if (companyId.value !== '') {
            get('CompanyCurrency/GetByCompid?compid=' + companyId.value)
                .then((res) => {
                    let data3: any = [];
                    res.data.map((obj: any) => {
                        data3.push(
                            {
                                value: obj.compDivID,
                                label: obj.compDivID,
                            })
                    })
                    setDivisionIdOptions(data3)
                })
        }
    }, [companyId.value])

    /* Rendering Errors Start*/

    useEffect(() => {
        prevCountRef.current = errmsg;
        if (inputRef.current) inputRef.current.focus()
        filllist()
    }, [errmsg])

    /* Rendering Errors End*/

    /* Form Validation Start*/

    const validate = () => {
        let valid = true

        if (compDivisionId.value === '' && companyId.value === '' && currencyCode.value === '' && formik.values.refKey == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (compDivisionId.value === "") {
            toast.error("Please Select Division ID");
            return false;
        }
        if (companyId.value === "") {
            toast.error("Please Select Company Name");
            return false;
        }
        if (currencyCode.value === "") {
            toast.error("Please Select Currency Code");
            return false;
        }
        if (formik.values.refKey === "") {
            toast.error("please Enter Reference Key");
            return false;
        }
        return valid;
    }
    /* Form Validation End*/

    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            compDivID: '',
            compID: '',
            currencyCode: '',
            refKey: '',
            isActive: true,
        },
        onSubmit: (values) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const insertData = {
                        divisionID: compDivisionId.value,
                        compID: companyId.value,
                        currencyCode: currencyCode.value,
                        refKey: Number(values.refKey),
                        isActive: values.isActive,
                        createdDate: dayjs(),
                        createdBy: SessionManager.getUserID()
                    }

                    post('CompanyCurrency/AddCompanyCurrency', insertData)
                        .then((result) => {
                            filllist()
                            document.getElementById('currencyCode')?.focus()
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
                else {
                    const updatedata = {
                        compCurrId: rowId,
                        divisionID: compDivisionId.value,
                        currencyCode: currencyCode.value,
                        compID: companyId.value,
                        refKey: Number(formik.values.refKey),
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }

                    put('CompanyCurrency/UpdateCompanyCurrency', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            console.log(result.data.statusmessage);
                            onReset()
                            selectRef.current.focus()
                        })
                }
                selectRef.current.focus()
            }
        },

    })

    /* Formik Library End*/

    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/

    const handleRowClick = (rowData: IData) => {

        get('CompanyCurrency/GetCompanyCurrency?CompCurrId=' + rowData.compCurrId)
            .then((result) => {
                document.getElementById('refKey')?.focus();
                setcompanyId({ value: result.data.compID, label: result.data.compID })
                setcompDivisionId({ value: result.data.compDivID, label: result.data.compDivID })
                setcurrencyCode({ value: result.data.currencyCode, label: result.data.currencyCode })
                formik.setFieldValue('compID', result.data.compID)
                formik.setFieldValue('currencyCode', result.data.currencyCode)
                formik.setFieldValue('divisionID', result.data.divisionID)
                formik.setFieldValue('refKey', (result.data.refKey).toString())
                formik.values.isActive = result.data.isActive
                setswtstatus(result.data.isActive);
            })
        setreadonly(true);
        setSelectedRow(rowData);
        setrowId(rowData.compCurrId)
    }

    /* Table Sorting */

    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...Data].sort((a: any, b: any) =>
                (a[column]).toString().toLowerCase() > b[column].toLowerCase() ? 1 : -1
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
            setcompanyId({ value: '', label: '' })
            setcompDivisionId({ value: '', label: '' })
            setcurrencyCode({ value: '', label: '' })
            setreadonly(false);
            setswtstatus(true);
            setSelectedRow(undefined)
            setDivisionIdOptions([])
            selectRef.current.focus()
            seterrmsg('')
        }
    }
    /* Page Reset End */


    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            {/*  Heading Start  */}
            <h3>Company Currency Master</h3>
            <div className="card">
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-8'>
                                <div className="action1">
                                    <button type='reset' form='form' className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}  >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>
                            {/*  Heading End  */}

                            {/* Autocomplete Start  */}
                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        value={stateValue}
                                        items={Data1}
                                        inputProps={{ placeholder: "Search For DivisionID" }}
                                        getItemValue={(item) => (item.compCurrId + "-" + item.compDivID + "-" + item.isActive)}
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
                                                                <th>Division ID</th>
                                                                <th>Company ID</th>
                                                                <th>Currency Code</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.id}
                                                        onClick={() => handleRowClick(item)} >
                                                        <td className='min-w-150px'>{item.compDivID}</td>
                                                        <td className='min-w-150px'>{item.compID}</td>
                                                        <td className='min-w-150px'>{item.currencyCode}</td>
                                                        <td className='min-w-70px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        onChange={(event, val: any) => setstateValue(val)}
                                        onSelect={(e, val: any) => {
                                            setstateValue(val)
                                            get('CompanyCurrency/GetCompanyCurrency?CompCurrId=' + val.compCurrId)
                                                .then((result) => {
                                                    document.getElementById('refKey')?.focus();
                                                    setcompanyId({ value: result.data.compID, label: result.data.compID })
                                                    setcompDivisionId({ value: result.data.compDivID, label: result.data.compDivID })
                                                    setcurrencyCode({ value: result.data.currencyCode, label: result.data.currencyCode })
                                                    formik.setFieldValue('compID', result.data.compID)
                                                    formik.setFieldValue('currencyCode', result.data.currencyCode)
                                                    formik.setFieldValue('divisionID', result.data.divisionID)
                                                    formik.setFieldValue('refKey', (result.data.refKey).toString())
                                                    formik.values.isActive = result.data.isActive
                                                    setswtstatus(result.data.isActive);
                                                })
                                            setstateValue('')
                                            setreadonly(true);
                                            setSelectedRow(val);
                                            setrowId(val.compCurrId)
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

                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded ">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder'>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compDivID')}>Division ID
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('compID')}>Company ID
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting('currencyCode')}>Currency Code
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
                                                    {Data.map((rowData: IData) => (

                                                        <tr key={rowData.compCurrId}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.compCurrId === rowData.compCurrId
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
                                                                {rowData.compID}
                                                            </td>
                                                            <td>
                                                                {rowData.currencyCode}
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
                            <div className="card">
                                <div className="card-body">
                                    {/* Formik Fields Start  */}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>
                                        {({ errors, touched, isSubmitting
                                        }) =>
                                        (
                                            <Form id='form'>
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="card-title"><h3>Company Currency</h3></div>
                                                        <div className="col-lg-12 col-md-6 col-sm-6">
                                                            <div className="row">
                                                                <div className="col-lg-3 col-md-4 Id">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Company ID</label>
                                                                        
                                                                        <Select
                                                                            ref={selectRef}
                                                                            name="compID"
                                                                            options={compIdOptions}
                                                                            value={companyId}
                                                                            onChange={(o: any) => setcompanyId(o)}
                                                                            placeholder="Select"
                                                                            isDisabled={readonly}
                                                                            components={{
                                                                                IndicatorSeparator: () => null
                                                                            }}
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
                                                                    </div >
                                                                </div>
                                                                <div className="col-lg-3 col-md-4 Code">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Currency Code</label>
                                                                        
                                                                        <Select
                                                                            name="currencyCode"
                                                                            id="currencyCode"
                                                                            options={currCodeOptions}
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
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-lg-3 col-md-4 Id">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Division Id</label>
                                                                        
                                                                        <Select
                                                                            name="compDivID"

                                                                            options={DivisionIdOptions}
                                                                            value={compDivisionId}
                                                                            onChange={(o: any) => setcompDivisionId(o)}
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
                                                                <div className="col-lg-4 col-md-5 Key">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Reference Key</label>
                                                                        
                                                                        <Field name='refKey' id='refKey' maxLength={10} type="text" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.refKey.replace(/[^\d-]/, '')} />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-lg-6 ">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Status</label>
                                                                        <div className="form-check form-switch">
                                                                            <input name='isActive' type="checkbox" className='form-check-input' checked={swtstatus}
                                                                                onChange={(e) => {
                                                                                    formik.handleChange(e)
                                                                                    return setswtstatus(!swtstatus)
                                                                                }} />

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
/* Company Currency Functionality End */
export default Currency;
