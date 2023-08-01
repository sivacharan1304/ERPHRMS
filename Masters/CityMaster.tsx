/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik"
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { get, post, put } from "../Service/Services";
import Select from 'react-select';
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";

/* Array Initialization */

interface IData {
    id: number,
    stateCode: string,
    stateName: string,
    cityCode: string,
    cityName: string,
    countryName: string,
    countryCode: string,
    isActive: boolean

}
/* City Master Functionality Start */

const CityMaster = () => {
    let selectRef = useRef<any>();
    const [selectedRow, setSelectedRow] = useState<IData>();
    const [Data, setData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [SearchData, setSearchData] = useState('');
    const [Search, setSearch] = useState([]);
    const [State, setState] = useState([]);
    const [order, setorder] = useState('DSC');
    const [options, setoptions] = useState([]);
    const [countryCode, setcountryCode] = useState({ value: '', label: '' });
    const [stateCode, setstateCode] = useState({ value: '', label: '' });
    const [swtstatus, setswtstatus] = useState(true);
    const [readonly, setreadonly] = useState(false);
    const [focus, setfocus] = useState(true);

    /* Initial Page Load Function */

    const filllist = () => {

        get('Countries/GetAllCountries')
            .then((result) => {
                let data2: any = [];
                result.data.map((obj: IData) => {
                    data2.push(
                        {
                            value: obj.countryCode,
                            label: obj.countryName,
                        })
                })
                setoptions(data2)
            })
        get('Cities/GetAllCities')
            .then((result) => {

                var i = 1;
                let data1: any = []
                result.data.map((obj: IData) => {
                    data1.push(
                        {
                            id: i,
                            stateCode: obj.stateCode,
                            stateName: obj.stateName,
                            cityCode: obj.cityCode,
                            cityName: obj.cityName,
                            countryName: obj.countryName,
                            countryCode: obj.countryCode,
                            isActive: obj.isActive ? 'Active' : 'In Active',
                        })
                })
                setData(data1)
                setSearch(data1)
            })
    }

    useEffect(() => {
        filllist()
       var s = SessionManager.getUserID();
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
    }, [])

    /* Table Functionality Start*/

    /* Table Rowclick Event Handlers*/

    const handleRowClick = (rowData: IData) => {
        get('Cities/GetCitiesByCode?cityCode=' + rowData.cityCode)
            .then((result) => {
                document.getElementById('cityName')?.focus();
                setcountryCode({ value: result.data.countryCode, label: result.data.countryName })
                setstateCode({ value: result.data.stateCode, label: result.data.stateName })
                formik.setFieldValue('countryCode', result.data.countryCode)
                formik.setFieldValue('stateCode', result.data.stateCode)
                formik.setFieldValue("cityName", result.data.cityName)
                formik.setFieldValue("cityCode", result.data.cityCode)
                formik.values.isActive = result.data.isActive
                setswtstatus(result.data.isActive);
            })
        setSelectedRow(rowData);
        setrowId(1)
        setfocus(false)
        setreadonly(true);
    }

    /* Table Sorting */

    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...Data].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setSearch(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...Data].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setSearch(sorted);
            setorder('ASC')
        }
    }
    /* Table Sorting End */
    /* Table Functionality End */

    /*Search Functionality*/

    const filter = (value: any) => {
        const Keyword = value;
        get('Countries/GetCountries?CountriesCode=' + value)
            .then((result) => {
                setcountryCode({ value: result.data.countryCode, label: result.data.countryName })
                setSearchData('')
            })
        if (Keyword !== '') {
            const result = Search.filter((Us: IData) => {
                return Us.countryCode.toLowerCase().includes(Keyword.toLowerCase());
            });
            setSearch(result)
        }
        else {
            setSearch(Data)
        }
    }

    /*Search Functionality*/

    /* Form Validation Start*/

    const validate = () => {
        let valid = true

        if (countryCode.value === '' && stateCode.value === '' && formik.values.cityCode === '' && formik.values.cityName == "") {
            toast.error("Invalid Details. Please Check Required Fields....");
            return false;
        }
        if (countryCode.value === "") {
            toast.error("Please Enter Country Name");
            return false;
        }
        if (stateCode.value === "") {
            toast.error("Please Enter State Name");
            return false;
        }
        if (formik.values.cityCode === "" || Number(formik.values.cityCode)) {
            toast.error("Please Enter City Code");
            return false;
        }
        if (formik.values.cityName === "") {
            toast.error("Please Enter City Name");
            return false;
        }
        return valid;
    }

    /*Form Validation End*/


    /* Formik Library Start */

    const formik = useFormik({
        initialValues: {
            stateCode: '',
            stateName: '',
            cityCode: '',
            cityName: '',
            countryName: '',
            countryCode: '',
            isActive: true,
        },
        onSubmit: (values) => {
            if (validate() === true) {
                /*  insert Functionality */
                if (rowId === 0) {
                    const insertData = {
                        cityCode: (values.cityCode).toUpperCase(),
                        cityName: values.cityName,
                        stateCode: stateCode.value,
                        isActive: values.isActive,
                        createdBy: SessionManager.getUserID(),
                        createdDate: dayjs()
                    }
                    post('Cities/AddCities', insertData)
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
                /*  Update Functionality */
                else {
                    const updatedata = {
                        cityName: formik.values.cityName,
                        cityCode: formik.values.cityCode,
                        stateCode: formik.values.stateCode,
                        isActive: formik.values.isActive,
                        modifiedBy: SessionManager.getUserID(),
                        modifiedDate: dayjs()
                    }

                    put('Cities/UpdateCities', updatedata)
                        .then((result) => {
                            filllist()
                            toast.success(result.data.statusmessage)
                            onReset()
                        })
                }
            }
        },

    })
    /* Formik Library End */

    /*Loading Values into State Start*/

    useEffect(() => {

        if (countryCode.value !== '') {
            if (rowId === 0) {
                setstateCode({ value: '', label: '' })
                formik.resetForm()
            }
            get('Cities/Getstatebycountryid?countryCode=' + countryCode.value)
                .then((res) => {
                    let data3: any = [];
                    res.data.map((obj: IData) => {
                        data3.push(
                            {
                                value: obj.stateCode,
                                label: obj.stateName,
                            })
                    })
                    setState(data3)
                })
        }
    }, [countryCode])

    /*Loading Values into State End*/

    /* Page Reset Start */

    const onReset = () => {
        if (rowId !== undefined) {
            formik.resetForm()
            setcountryCode({ value: '', label: '' })
            setstateCode({ value: '', label: '' })
            setrowId(0)
            setfocus(true)
            setreadonly(false);
            setswtstatus(true);
            setState([])
            setSelectedRow(undefined)
            setSearchData('')
            setSearch(Data)
        }
        selectRef.current.focus()
    }

    /* Page Reset End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            {/*  Heading End  */}
            <h3>City Master</h3>
            <div className="card">
                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-8 '>
                                <div className="action1">
                                    <button type='reset' form="form" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>
                            {/*  Heading End  */}
                            <div className="col-lg-3 col-md-4 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <input className="" placeholder="Search Country Code" onChange={(e) => {
                                        if (e.target.value === '') {
                                            setSearch(Data)
                                        }
                                        setSearchData(e.target.value)

                                    }} value={SearchData} />
                                </div>
                                <button className='aply col-lg-4 col-md-5 col-sm-12 ms-2' onClick={() => filter(SearchData)}>Apply Filter</button>
                            </div>
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
                                                    <tr className='text-muted text-bolder '>

                                                        <th className='min-w-70px text-white' onClick={() => Sorting('cityCode')}>Code
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            /></th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting('cityName')}>City Name
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-100px text-white' onClick={() => Sorting('stateName')}>State Name
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
                                                    {
                                                        Search.map((rowData: IData) => (
                                                            <tr key={rowData.cityCode}
                                                                onClick={() => handleRowClick(rowData)}
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedRow && selectedRow.cityCode === rowData.cityCode
                                                                            ? '#BAD9FB'
                                                                            : 'white',
                                                                    cursor: 'pointer',
                                                                    width: 100
                                                                }}
                                                            >

                                                                <td>
                                                                    {rowData.cityCode}
                                                                </td>
                                                                <td>
                                                                    {rowData.cityName}
                                                                </td>
                                                                <td>
                                                                    {rowData.stateName}
                                                                </td>
                                                                <td>
                                                                    {rowData.isActive}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6  col-sm-12 '>
                            <div className="card ">
                                <div className="card-body" >
                                    {/* Formik Fields Start  */}
                                    <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                                        <Form id='form'>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="card-title"><h3>City</h3></div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                                        <div className="row">
                                                            <div className="col-lg-5 col-md-6 NName">
                                                                <div className="p-1">
                                                                    <label className="form-label">Country Name</label>

                                                                    <Select
                                                                        ref={selectRef}
                                                                        name="countryCode"
                                                                        options={options}
                                                                        value={countryCode}
                                                                        onChange={(o: any) => setcountryCode(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        autoFocus={focus}
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
                                                            <div className="col-lg-5 col-md-6 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label">State Name</label>

                                                                    <Select
                                                                        name="stateCode"
                                                                        options={State}
                                                                        value={stateCode}
                                                                        onChange={(o: any) => setstateCode(o)}
                                                                        placeholder="Select"
                                                                        isDisabled={readonly}
                                                                        components={{
                                                                            IndicatorSeparator: () => null
                                                                        }}
                                                                        styles={{
                                                                            menu: (base) => ({
                                                                                ...base,
                                                                                width: "max-content",
                                                                                minWidth: "150px",
                                                                                minHeight: '100px'
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
                                                            <div className="col-lg-3 col-md-4 Code">
                                                                <div className="p-1">
                                                                    <label className="form-label">City Code</label>

                                                                    <Field maxLength={6} name='cityCode' id='cityCode' readOnly={readonly} className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.cityCode.replace(/[^a-z,]+$/i, '')} />
                                                                </div >
                                                            </div>

                                                            <div className="col-lg-5 col-md-6 Name">
                                                                <div className="p-1">
                                                                    <label className="form-label">City Name</label>

                                                                    <input name='cityName' maxLength={50} id='cityName' type="text" className='form-control  form-control-sm' onChange={formik.handleChange} value={formik.values.cityName.replace(/[^a-z\s,]+$/i, '')} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="p-1">
                                                                    <label className="form-label ">Status</label>
                                                                    <div className="form-check form-switch">
                                                                        <input name='isActive' type="checkbox" className='form-check-input' readOnly
                                                                            onChange={(e) => {
                                                                                formik.handleChange(e)
                                                                                return setswtstatus(!swtstatus)
                                                                            }} checked={swtstatus} />
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
/* City Master Functionality End */

export default CityMaster;
