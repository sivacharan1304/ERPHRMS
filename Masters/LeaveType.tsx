/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get,post,put } from "../Service/Services";

/* Array Initialization */
interface IData {
    id: number,
    type: string,
    applicableFor: string,
    enhanceNo: number,
    payment: boolean,
    paymentHours: number,
    isActive: boolean,
}

/* LeaveType Functionality Start */
const LeaveType = () => {
    /* Const Variable Initialization */
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [rowId, setrowId] = useState(0);
    const [data, setData] = useState([]);
    const [rowData, setrowData] = useState([]);
    const [order, setorder] = useState('ASC');
    const [stateValue, setstateValue] = useState('');
    const [swtstatus, setswtstatus] = useState(true);
    const [paymentstatus, setpaymentstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [data1, setData1] = useState([])
    const [selectedOption, setSelectedOption] = useState<any>({ value: '', label: '' });

    const [leaveOptions] = useState([
        {
            label: 'Female',
            value: 'Female'
        },
        {
            label: 'Male',
            value: 'Male'
        },
        {
            label: 'Both',
            value: 'Both'
        },
        {
            label: 'Others',
            value: 'Others'
        },
    ])

    /* Initial Page Load Function */
    const filllist = () => {
        get('LeaveType/GetAllLeaveType')
            .then((result) => {
                console.log(result);
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            sno: i,
                            id: obj.id,
                            type: obj.type,
                            applicableFor: obj.applicableFor,
                            enhanceNo: obj.enhanceNo,
                            payment: obj.payment ? 'Payment' : 'Paymentless',
                            paymentHours: obj.paymentHours,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setData(data1)
                setData1(data1)
                setrowData(data1)
            })
    }

    useEffect(() => {
        filllist()
    }, [])

    /* Form Validation */
    const validate = () => {
        let valid = true

        if (formik.values.type == "" && selectedOption.value == "" && formik.values.enhanceNo === 0 && formik.values.paymentHours === 0) {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (formik.values.type == "") {
            toast.error("Please Enter Type ");
            return false;
        }
        if (selectedOption.value == "") {
            toast.error("Please enter Applicable for");
            return false;
        }
        if (formik.values.enhanceNo === 0) {
            toast.error("Please enter Enhance No");
            return false;
        }
        if (formik.values.paymentHours === 0) {
            toast.error("Please enter paymentHours");
            return false;
        }
        return valid;
    }

    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            type: "",
            applicableFor: "",
            enhanceNo: 0,
            payment: true,
            paymentHours: 0,
            isActive: true,
        },
        /*  insert Functionality */
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const InsertData = {
                        applicableFor: selectedOption.value,
                        enhanceNo: Number(values.enhanceNo),
                        type: values.type.toUpperCase(),
                        payment: values.payment,
                        paymentHours: Number(values.paymentHours),
                        isActive: formik.values.isActive,
                        createdDate: dayjs()

                    }
                    console.log(InsertData);
                    post('LeaveType/AddLeaveType', InsertData)
                        .then((result) => {
                            filllist()
                            document.getElementById('type')?.focus();
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
                        id: rowId,
                        applicableFor: selectedOption.value,
                        type: formik.values.type,
                        enhanceNo: formik.values.enhanceNo,
                        payment: formik.values.payment,
                        paymentHours: formik.values.paymentHours,
                        isActive: formik.values.isActive,
                        modifiedDate: dayjs()
                    }
                    console.log(updatedata);
                    put('LeaveType/UpdateLeaveType', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            document.getElementById('type')?.focus();
                            onReset()
                        })
                }
            }
        },
    })
    /* Formik Library End */

    /* Table Rowclick Event Handlers */
    const handleRowClick = (rowData: any) => {
        get('LeaveType/GetLeaveType?id=' + rowData.id)
            .then((result) => {
                console.log(result);
                setSelectedOption({ value: result.data.applicableFor, label: result.data.applicableFor })
                formik.setFieldValue("type", result.data.type)
                formik.setFieldValue("enhanceNo", result.data.enhanceNo)
                formik.setFieldValue("paymentHours", result.data.paymentHours)
                formik.values.isActive = result.data.isActive
                setswtstatus(result.data.isActive);
                setpaymentstatus(result.data.payment);
            })
        selectRef.current.focus()
        setreadonly(true);
        setrowId(rowData.id)
        setSelectedRow(rowData)
        document.getElementById('type')?.focus();

    }

    /* Table Functionality Start */
    /* Autocomplete KeyEnter Event handlers */
    const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
        if (event.keyCode === 13 || event.key === 'Enter') {
            setSelectedRow(item);
        }
    };

    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...data].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...data].sort((a: any, b: any) =>
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
            document.getElementById('type')?.focus();
            setSelectedOption({ value: '', label: '' })
            setrowId(0)
            formik.resetForm()
            setreadonly(false);
            setswtstatus(true);
            setpaymentstatus(true);
            setSelectedRow(undefined);
        }
    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3> Leave Type</h3>
            <div className="card" >
                <div className='shadow-sm p-2 mb-5   bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>

                            <div className='col-lg-12 col-md-12 col-sm-8 '>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'left' }}>
                                    <button type='reset' form="form" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}  >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: "Search LeaveType" }}
                                        value={stateValue}
                                        items={data1}
                                        getItemValue={(item) => (item.type + "-" + item.applicableFor + "-" + "-" + item.payment + "-" + item.paymentHours + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.type.toLowerCase().indexOf(value.toLowerCase()) !== -1}

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
                                                                <th>LeaveType </th>
                                                                <th>Applicable For </th>
                                                                <th>Payment</th>
                                                                <th>PaymentHrs</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr style={{ padding: "1px" }} key={item.id}
                                                        onClick={() => handleRowClick(item.id)}
                                                        onKeyDown={(event) => handleRowKeyDown(event, item)}
                                                        tabIndex={0}>
                                                        <td className='min-w-150px' >{item.type}</td>
                                                        <td className='min-w-150px'>{item.applicableFor}</td>
                                                        <td className='min-w-150px'>{item.payment}</td>
                                                        <td className='min-w-150px'>{item.paymentHours}</td>
                                                        <td className='min-w-90px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        onChange={(event, val) => {

                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val) => {
                                            get('LeaveType/GetLeaveType?id=' + val.id)
                                                .then((result) => {
                                                    console.log(result);
                                                    setSelectedOption({ value: result.data.applicableFor, label: result.data.applicableFor })
                                                    formik.setFieldValue("type", result.data.type)
                                                    formik.setFieldValue("enhanceNo", result.data.enhanceNo)
                                                    formik.setFieldValue("paymentHours", result.data.paymentHours)
                                                    formik.values.isActive = result.data.isActive
                                                    setswtstatus(result.data.isActive);
                                                    setpaymentstatus(result.data.payment);
                                                })
                                            selectRef.current.focus()
                                            setreadonly(true);
                                            setrowId(val.id)
                                            setSelectedRow(val)
                                            document.getElementById('type')?.focus();

                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            <div className="card " style={{ height: 400 }}>
                                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                                    <div className="table-responsive">
                                        {/* begin::Table */}
                                        <div style={{ height: 360, overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle'>
                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='fw-bold text-muted'>
                                                        <th className='w-8px'>
                                                        </th>

                                                        <th className='min-w-100px text-white' onClick={() => Sorting('type')}>Leave Type

                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-120px text-white' onClick={() => Sorting('applicableFor')}>Applicable for
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-100px text-white' >Enhance no
                                                        </th>

                                                        <th className='min-w-100px text-white' onClick={() => Sorting('payment')}>Payment
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />

                                                        </th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting('paymentHours')}>PaymentHrs
                                                        </th>

                                                        <th className='min-w-80px text-white' onClick={() => Sorting('isActive')}>Status
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
                                                    {data.map((rowData: IData) => (

                                                        <tr key={rowData.id}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.id === rowData.id
                                                                        ? '#BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                        >
                                                            <td>
                                                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {rowData.type}
                                                            </td>
                                                            <td>
                                                                {rowData.applicableFor}
                                                            </td>
                                                            <td>
                                                                {rowData.enhanceNo}
                                                            </td>
                                                            <td>
                                                                {rowData.payment}
                                                            </td>
                                                            <td>
                                                                {rowData.paymentHours}
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

                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>
                                        {({ errors, touched, isSubmitting
                                        }) =>
                                        (
                                            <Form id='form'>
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="card-title"><h4>Leave Type</h4></div>
                                                        <div className="col-lg-12 col-md-12 col-sm-6">
                                                            <div className="row">
                                                                <div className="col-lg-3 col-md-3 Type">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="type"> Leave Type</label>
                                                                        <Field autoFocus name='type' id="type" readOnly={readonly} maxlength={10} className='form-control form-control-sm ' onChange={formik.handleChange} value={formik.values.type} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-3 Applicable">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Applicable For</label>
                                                                        <Select
                                                                            ref={selectRef}
                                                                            components={{
                                                                                IndicatorSeparator: () => null
                                                                            }}
                                                                            name="applicableFor"
                                                                            options={leaveOptions}
                                                                            id='applicableFor'
                                                                            value={selectedOption}
                                                                            onChange={(o: any) => setSelectedOption(o)}
                                                                            placeholder="Select"
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
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-3 col-md-3 Enhance">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" > Enhance No</label>
                                                                        <Field name='enhanceNo' id="enhanceNo" maxlength={2} className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.enhanceNo} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-3 Payment">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" > Payment Hours</label>
                                                                        <Field name='paymentHours' id="paymentHours" maxlength={2} className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.paymentHours} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-lg-2 col-md-1 Status">
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
                                                                <div className="col-lg-2 col-md-1 PaymentStatus">
                                                                    <div className="p-1">
                                                                        <label className="form-label ">Payment</label>
                                                                        <div className="form-check form-switch">
                                                                            <input name='payment' type="checkbox" className='form-check-input' checked={paymentstatus}
                                                                                onChange={(e) => {
                                                                                    formik.handleChange(e)
                                                                                    return setpaymentstatus(!paymentstatus)
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};
export default LeaveType;
