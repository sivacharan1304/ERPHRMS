/* Import Statement */
import { useEffect, useRef, useState } from "react"
import { Formik, Form, Field, useFormik } from "formik"
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import { get, post, put } from "../Service/Services";
import { boolean } from "yup";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
    sno: number,
    id: number,
    year: string,
    holidayName: string,
    holidayAllowance: string,
    startDate: string,
    endDate: string,
    skipWeekEnd: boolean,
    createdDate: string,
    modifiedDate: string,
    isActive: boolean
}
/* Holiday Master Functionality Start */


/* Const Variable Initialization */
const Holiday = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [Data1, setData1] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [stateValue, setstateValue] = useState('');
    const [order, setorder] = useState('DSC');
    const [swtstatus, setswtstatus] = useState(true);
    const [swtstatus1, setswtstatus1] = useState(true);
    const [Option, setOption] = useState([]);
    const [year, setyear] = useState([]);
    const [yearcode, setyearcode] = useState<any>({ value: '', label: '' });
    const [readonly, setreadonly] = useState(false);
    const INITIAL_COUNT = "";
    const [errmsg, seterrmsg] = useState(INITIAL_COUNT);
    const prevCountRef = useRef<string>(INITIAL_COUNT);
    const inputRef = useRef<HTMLInputElement>(null);
    /* Initial Page Load Function */
    const filllist = () => {
        get('YearMaster/GetAllYearMaster')
            .then((result) => {
                let data2: any = [];
                console.log(result.data);

                result.data.map((obj: any) => {
                    data2.push(
                        {
                            value: obj.year,
                            label: obj.year,
                        })
                })
                setOption(data2)
                console.log(data2);

                setyear(result.data)
            })
        get('HolidayMaster/GetAllHolidayMaster')
            .then((result) => {
                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {

                            sno: i,
                            id: obj.id,
                            year: obj.year,
                            holidayName: obj.holidayName,
                            holidayAllowance: obj.holidayAllowance,
                            startDate: dayjs(obj.startDate).format('DD-MM-YYYY'),
                            endDate: dayjs(obj.endDate).format('DD-MM-YYYY'),
                            skipWeekEnd: obj.skipWeekEnd ? 'Active' : 'In Active',
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                    i = i + 1;
                })
                setData(data1)
                setData1(data1)
            })
    }

    useEffect(() => {
    //     var s = SessionManager.getUserID();
    //     if (SessionManager.getUserID() == null) {
    
    //       window.location.href = "/hrms/auth";
    //     }
        prevCountRef.current = errmsg;
        if (inputRef.current) {
            inputRef.current.focus();
        }
        filllist()
    }, [errmsg])

    useEffect(() => {
        filllist()
    }, [])

    /* Form Validation */
    const validate = () => {
        let valid = true
        if (yearcode.value == "" && formik.values.holidayName == "" && 
        formik.values.holidayAllowance == "" 
         && formik.values.startDate == "" && formik.values.endDate == "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (yearcode.value === "") {
            toast.error("please Enter Year");
            return false;
        }
        if (formik.values.holidayName == "" ) {
            toast.error("please Enter Holiday Name");
            return false;
        }
        if (formik.values.holidayAllowance == "" || !Number(formik.values.holidayAllowance)) {
            toast.error("please Enter Holiday Allowance");
            return false;
        }
        if (formik.values.startDate == "") {
            toast.error("please Enter StartDate");
            return false;
        }
        if (formik.values.endDate == "") {
            toast.error("please Enter EndDate");
            return false;
        }
        return valid;
    }

    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            year: "",
            holidayName: "",
            holidayAllowance: "",
            startDate: "",
            endDate: "",
            skipWeekEnd: true,
            isActive: true,
        },
        // insert Functionality
        onSubmit: (values, { resetForm }) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const Insertdata = {
                        year: yearcode.value,
                        holidayName: formik.values.holidayName,
                        holidayAllowance: Number(formik.values.holidayAllowance),
                        startDate: formik.values.startDate,
                        endDate: formik.values.endDate,
                        skipWeekEnd: formik.values.skipWeekEnd,
                        isActive: formik.values.isActive,
                        createdBy:SessionManager.getUserID(),
                        createdDate: dayjs()
                    }
                    console.log(Insertdata);

                    post('HolidayMaster/AddHolidayMaster', Insertdata)
                        .then((result) => {
                            filllist()
                            document.getElementById('year')?.focus();
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
                        year: yearcode.value,
                        holidayName: formik.values.holidayName,
                        holidayAllowance: Number(formik.values.holidayAllowance),
                        startDate: formik.values.startDate,
                        endDate: formik.values.endDate,
                        skipWeekEnd: swtstatus1,
                        isActive: swtstatus,
                        modifiedBy:SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    
                    }
                    console.log(updatedata);
                    // update functionality
                    put('HolidayMaster/UpdateAddressType', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            console.log(result.data.statusmessage);
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
        get('HolidayMaster/GetHolidayMaster?id=' + rowData.id)
            .then((result) => {
                document.getElementById('holidayName')?.focus();
                formik.setFieldValue("year", result.data.year)
                formik.setFieldValue("holidayName", result.data.holidayName)
                formik.setFieldValue("holidayAllowance", (result.data.holidayAllowance).toString())
                formik.setFieldValue("startDate", dayjs(result.data.startDate).format('YYYY-MM-DD'))
                formik.setFieldValue("endDate", dayjs(result.data.endDate).format('YYYY-MM-DD'))
                setswtstatus(result.data.isActive);
                setswtstatus1(result.data.skipWeekEnd);
                setyearcode({ value: result.data.year, label: result.data.year })
            })
        setrowId(rowData.id)
        setSelectedRow(rowData);
        setreadonly(true);
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
            document.getElementById('year')?.focus();
            setrowId(0)
            setSelectedRow(undefined)
            setyearcode({ value: '', label: '' })
            setreadonly(false);
            setswtstatus(true);
            setswtstatus1(true);
            selectRef.current.focus()
            formik.resetForm()
            seterrmsg('')
        }
    }
    /* End */
    /* show&hide functionality for alert Div style */
    const divStyle = () => {
        return errmsg ? "" : "none";
    }
    return (
        <>
            <div style={{ display: divStyle() }}>{prevCountRef.current}</div>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Holidays Master</h3>
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
                                        inputProps={{ placeholder: "Search" }}
                                        value={stateValue}
                                        items={Data1}
                                        getItemValue={(item) => (item.year + "-" + item.holidayName + "-" + item.holidayAllowance + "-" + item.startDate + "-" + item.endDate + "-" + item.skipWeekEnd + "-" + item.isActive)}
                                        shouldItemRender={(state: any, value: any) => state.holidayName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                                        renderMenu={(item: any) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}>{item}</div>
                                        }
                                        renderItem={(item: any, isHighlighted: any) => (
                                            <table
                                                className={`item ${isHighlighted ? "selected-item" : ""}`}
                                            >
                                                <thead style={{ background: "#0095e8", color: "white" }}>
                                                    {
                                                        item.sno === 1 ?
                                                            <tr>
                                                                <th>Year</th>
                                                                <th>Holidays Name</th>
                                                                <th>Holiday Allowance</th>
                                                                <th>Skip WeekEnd</th>
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
                                                    >
                                                        <td className='min-w-100px' >{item.year}</td>
                                                        <td className='min-w-150px'>{item.holidayName}</td>
                                                        <td className='min-w-150px'>{item.holidayAllowance}</td>
                                                        <td className='min-w-150px'>{item.skipWeekEnd}</td>
                                                        <td className='min-w-60px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        )}

                                        onChange={(event, val: any) => {
                                            setstateValue(val);
                                        }}
                                        onSelect={(e, val: any) => {
                                            get('HolidayMaster/GetHolidayMaster?id=' + val.id)
                                                .then((result) => {
                                                    document.getElementById('holidayName')?.focus();
                                                    formik.setFieldValue("year", result.data.year)
                                                    formik.setFieldValue("holidayName", result.data.holidayName)
                                                    formik.setFieldValue("holidayAllowance", (result.data.holidayAllowance).toString())
                                                    formik.setFieldValue("startDate", dayjs(result.data.startDate).format('YYYY-MM-DD'))
                                                    formik.setFieldValue("endDate", dayjs(result.data.endDate).format('YYYY-MM-DD'))
                                                    setswtstatus(result.data.isActive);
                                                    setswtstatus1(result.data.skipWeekEnd);
                                                    setyearcode({ value: result.data.year, label: result.data.year })
                                                })

                                            setreadonly(true);
                                            setSelectedRow(val);
                                            setrowId(val.id)

                                        }}
                                    />
                                </div>
                                {/* Autocomplete End  */}
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
                                        <div style={{ height: "360px", overflowY: "scroll" }}>
                                            <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>

                                                {/* begin::Table head */}
                                                <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                                                    <tr className='text-muted text-bolder '>

                                                        <th className='min-w-100px text-white'>Year

                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("holidayName")}>Holiday Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>

                                                        <th className='min-w-150px text-white'>Holiday Allowance

                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("skipWeekEnd")}>Skip Week End
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-70px text-white' onClick={() => Sorting("isActive")}>Status
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
                                                        <tr key={rowData.id}
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
                                                                {rowData.year}
                                                            </td>
                                                            <td>
                                                                {rowData.holidayName}
                                                            </td>
                                                            <td>
                                                                {rowData.holidayAllowance}
                                                            </td>
                                                            <td>
                                                                {rowData.skipWeekEnd}
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
                                        {({ errors, touched, isSubmitting
                                        }) =>
                                        (
                                            <Form id='form' >
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="card-title"><h3>Holidays Master</h3></div>
                                                        <div className="col-lg-12 col-md-12 col-sm-6">
                                                            <div className="row">
                                                                <div className="col-lg-3 col-md-5 years">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="name" >Year</label>
                                                                        <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                                                        <Select
                                                                            ref={selectRef}
                                                                            isDisabled={readonly}
                                                                            name="yearcode"
                                                                            autoFocus
                                                                            options={Option}
                                                                            value={yearcode}
                                                                            onChange={(o) => {
                                                                                setyearcode(o)
                                                                                console.log(yearcode);

                                                                            }}

                                                                            placeholder="Select"

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
                                                                <div className="col-lg-5 col-md-6 Holiday-Name">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Holiday Name</label>
                                                                        <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                                                        <Field name='holidayName' id="holidayName" autoComplete="off" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.holidayName} />
                                                                    </div >
                                                                </div>
                                                                <div className="col-lg-5 col-md-6 Holiday-Allowance">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Holidays Allowance</label>
                                                                        <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                                                        <Field name='holidayAllowance' id="holidayAllowance" type="text" autoComplete="off" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.holidayAllowance.replace(/[^0-9,]+$/i, '')} />
                                                                    </div >
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-lg-4 col-md-6 Dat">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >Start Date</label>
                                                                        <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                                                        <Field name='startDate' id="startDate" autoComplete="off" type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.startDate} />
                                                                    </div >
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 Dat">
                                                                    <div className="p-1">
                                                                        <label className="form-label" htmlFor="" >End Date</label>
                                                                        <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                                                        <Field name='endDate' id="endDate" autoComplete="off" type="date" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.endDate} />
                                                                    </div >
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-lg-2 col-md-2 Status">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Status</label>
                                                                        <div className="form-check form-switch">
                                                                            <input name='isActive' type="checkbox" className='form-check-input' checked={swtstatus}
                                                                                onChange={(e) => {
                                                                                    formik.handleChange(e)
                                                                                    return setswtstatus(!swtstatus)
                                                                                }}
                                                                            />
                                                                            {formik.touched.isActive && isSubmitting == true && rowId === 0}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-10 col-md-10 Status">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Skip Week End</label>
                                                                        <div className="form-check form-switch">
                                                                            <input name='isActive' type="checkbox" className='form-check-input' checked={swtstatus1}
                                                                                onChange={(e) => {
                                                                                    formik.handleChange(e)
                                                                                    return setswtstatus1(!swtstatus1)
                                                                                }}
                                                                            />
                                                                            {formik.touched.isActive && isSubmitting == true && rowId === 0}
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
/* Holiday Master Functionality End */
export default Holiday;
