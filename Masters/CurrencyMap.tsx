/* Import Statement */
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import dayjs from "dayjs";
import Select from 'react-select';
import Autocomplete from "react-autocomplete";
import { Delete, get, post, put } from "../Service/Services";
import '../Qs_css/Autocomplete.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
  id: number,
  currMapKey: number,
  countryCode: string,
  currencyCode: string,
  validFrom: string,
  validTo: string,
  isActive: boolean,
}
/* CountryCurrencyMaster Functionality Start */

const CurrencyMapMaster = () => {
  let selectRef = useRef<any>();
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [countrycodes, setcountrycodes] = useState<any>({ value: '', label: '' });
  const [currencyCodes, setcurrencyCodes] = useState<any>({ value: '', label: '' });
  const [Option, setOption] = useState([]);
  const [Option1, setOption1] = useState([]);
  const [city, setCity] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [ValidFrom, setValidFrom] = useState('');
  const [ValidTo, setValidTo] = useState('');
  const [order, setorder] = useState('DSC');
  const [stateValue, setstateValue] = useState('');
  const [Currency, setCurrency] = useState([]);
  const [Country, setCountry] = useState([]);
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [savebtndisable, setsavebtndisable] = useState(false);
  const INITIAL_COUNT = "";
  const [errmsg, seterrmsg] = useState(INITIAL_COUNT);
  const prevCountRef = useRef<string>(INITIAL_COUNT);
  /* Initial Page Load Function */
  const filllist = () => {
    get('Currency/GetAllCurrency')
      .then((result) => {
        let data2: any = [];
        console.log(result.data);

        result.data.map((obj: any) => {
          data2.push(
            {
              value: obj.currencyCode,
              label: obj.currencyCode,
            })
        })
        setOption(data2)
        console.log(data2);

        setCurrency(result.data)
      })
    get('Countries/GetAllCountries')
      .then((result) => {
        let data2: any = [];
        console.log(result.data);

        result.data.map((obj: any) => {
          data2.push(
            {
              value: obj.countryCode,
              label: obj.countryCode,
            })
        })
        setOption1(data2)
        setCountry(result.data)
      })

    get('CountryCurrency/GetAllCountryCurrency')
      .then((result) => {
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {
          data1.push(
            {
              id: i,
              currMapKey: obj.currMapKey,
              countryCode: obj.countryCode,
              currencyCode: obj.currencyCode,
              validFrom: dayjs(obj.validFrom).format('YYYY-MM-DD'),
              validTo: dayjs(obj.validTo).format('YYYY-MM-DD'),
              isActive: obj.isActive ? 'Active' : 'In Active',
            })
          i = i + 1;
        })
        setCity(data1)
      })
  }

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
    if (countrycodes.value == "" && currencyCodes.value == "" && formik.values.validFrom == "" && formik.values.validTo == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (countrycodes.value == "") {
      toast.error("Please Enter CountryCode ");
      return false;
    }
    if (currencyCodes.value == "") {
      toast.error("Please Enter CurrencyCode");
      return false;
    }
    if (formik.values.validFrom == "") {
      toast.error("Please Enter validFrom Date");
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

  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      countryCode: "",
      currencyCode: "",
      validFrom: "",
      validTo: "",
      isActive: true
    },
    /*  insert Functionality */
    onSubmit: (values, { resetForm }) => {
      if (validate() === true) {
        if (rowId === 0) {
          const Insertdata = {
            countryCode: countrycodes.value,
            currencyCode: currencyCodes.value,
            validFrom: values.validFrom,
            validTo: values.validTo,
            isActive: values.isActive,
            createdBy:SessionManager.getUserID(),
            createdDate: dayjs()

          }
          console.log(Insertdata);

          post('CountryCurrency/AddCountryCurrency', Insertdata)
            .then((result) => {
              filllist()
              document.getElementById('countryCode')?.focus()
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
            currMapkey: rowId,
            countryCode: countrycodes.value,
            currencyCode: currencyCodes.value,
            validFrom: formik.values.validFrom,
            validTo: formik.values.validTo,
            isActive: formik.values.isActive,
            modifiedBy:SessionManager.getUserID(),
            modifiedDate: dayjs()
          }

          console.log(updatedata);

          put('CountryCurrency/UpdateCountryCurrency', updatedata)
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
    get('CountryCurrency/GetCountryCurrency?CountCurr=' + rowData.currMapKey)
      .then((result) => {
        formik.setFieldValue("currMapKey", result.data.currMapKey)
        formik.setFieldValue("countryCode", result.data.countryCode)
        formik.setFieldValue("currencyCode", result.data.currencyCode)
        formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
        formik.setFieldValue("validTo", dayjs(result.data.validTo).format('YYYY-MM-DD'))
        setswtstatus(result.data.isActive)
        setcountrycodes({ value: result.data.countryCode, label: result.data.countryCode })
        setcurrencyCodes({ value: result.data.currencyCode, label: result.data.currencyCode })
        document.getElementById('validFrom')?.focus()
      })
    setSelectedRow(rowData);

    setrowId(rowData.currMapKey)
    setreadonly(true);

  }
  /* Table Sorting */
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
  /* Table Functionality End*/

  /* Page Reset */

  const onReset = () => {
    if (rowId !== undefined) {
      setrowId(0)
      setreadonly(false);
      setswtstatus(true);
      setcountrycodes({ value: '', label: '' })
      setcurrencyCodes({ value: '', label: '' })
      formik.resetForm();
      setSelectedRow(undefined)
      selectRef.current.focus()
      seterrmsg('');
    }

  }
  /* End */
  /* show&hide functionality for alert Div style */
  const divStyle = () => {
    return errmsg ? "block" : "none";
  }
  return (
    <>
      <div style={{ display: divStyle() }}>{prevCountRef.current}
      </div>
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Country CurrencyMap Master</h3>

      <div className="card">
        <div className='shadow-sm p-2 mb-5 bg-white rounded '>
          <div className='container-fluid'>
            <div className='row'>
              {/*  Heading Button Start */}
              <div className='col-lg-12 col-md-12 col-sm-8 '>
                <div className="action1">
                  <button form='form' type="reset" className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                    <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                  <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                    <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />
                    Save</button>

                  <button type='button' className='btn btn-link ' style={{ color: '#0095e8' }} >
                    <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />
                    Delete</button>
                </div>
              </div>
              {/*  Heading End  */}

              {/*  Autocomplete Start  */}
              <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                <div className="autocomplete-wrapper">
                  <Autocomplete
                    inputProps={{ placeholder: "Search For Country Code" }}
                    value={stateValue}
                    items={city}
                    getItemValue={(item) => item.countryCode}
                    shouldItemRender={(state, value) => state.countryCode.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                    renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                    }
                    renderItem={(item, isHighlighted) => (


                      <table
                        className={`item ${isHighlighted ? "selected-item" : ""}`}

                      >
                        <thead style={{ background: "#0095e8", color: "white", position: "sticky", top: 0 }}>
                          {
                            item.id === 1 ?
                              <tr>
                                <th>CountryCode</th>
                                <th>CurrencyCode</th>
                                <th >ValidFrom</th>
                                <th  >ValidTo</th>
                                <th >Status</th>
                              </tr>
                              :
                              null
                          }
                        </thead>
                        <tbody>
                          <tr key={item.countryCode}
                            onClick={() => handleRowClick(item)}
                            onKeyDown={(event) => handleRowKeyDown(event, item)}
                            tabIndex={0}
                          >
                            <td className='min-w-150px' >{item.countryCode}</td>
                            <td className='min-w-150px' >{item.currencyCode}</td>
                            <td className='min-w-150px'>{dayjs(item.validFrom).format('DD-MM-YYYY')}</td>
                            <td className='min-w-150px'>{dayjs(item.validTo).format('DD-MM-YYYY')}</td>
                            <td className='min-w-70px'>{item.isActive}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    onChange={(event, val) => {

                      setstateValue(val);
                    }}
                    onSelect={(event, val) => {
                      setstateValue(val)
                      setstateValue('')


                      get('CountryCurrency/GetCountryCurrency?CountCurr=' + val.currMapKey)
                        .then((result) => {
                          setrowId(1)
                          formik.setFieldValue("currMapKey", result.data.currMapKey)
                          formik.setFieldValue("countryCode", result.data.countryCode)
                          formik.setFieldValue("currencyCode", result.data.currencyCode)
                          formik.setFieldValue("validFrom", dayjs(result.data.validFrom).format('YYYY-MM-DD'))
                          formik.setFieldValue("validTo", dayjs(result.data.ValidTo).format('YYYY-MM-DD'))
                          setswtstatus(result.data.isActive)
                          setcountrycodes({ value: result.data.countryCode, label: result.data.countryCode })
                          setcurrencyCodes({ value: result.data.currencyCode, label: result.data.currencyCode })
                          document.getElementById('validFrom')?.focus()
                        })
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
              <div className="card" style={{ height: 400 }} >
                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                  <div className="table-responsive">
                    {/* begin::Table */}
                    <div style={{ height: 360, overflowY: "scroll" }}>
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                        {/* begin::Table head */}
                        <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='fw-bold text-muted'>

                            <th className='min-w-150px text-white  ' onClick={() => Sorting("countryCode")}>Country code

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />


                            </th>

                            <th className='min-w-150px text-white ' onClick={() => Sorting("currencyCode")}>Currency code

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />


                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting("validFrom")}>Valid From

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />
                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting("validTo")}>Valid To

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
                          {city.map((rowData: IData) => (

                            <tr key={rowData.currMapKey}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.currMapKey === rowData.currMapKey
                                    ? '#BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}

                            >

                              <td>
                                {rowData.countryCode}
                              </td>
                              <td>
                                {rowData.currencyCode}
                              </td>
                              <td>
                                {dayjs(rowData.validFrom).format('DD-MM-YYYY')}

                              </td>
                              <td>
                                {dayjs(rowData.validTo).format('DD-MM-YYYY')}
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

                    <Form id='form' className="">
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h4>Country CurrencyMap Master</h4></div>
                          <div className="col-lg-12 col-md-6 col-sm-6">

                            <div className="row">
                              <div className="col-lg-3 col-md-4 Code">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="name">Country Code</label>
                                  <Select
                                    ref={selectRef}
                                    isDisabled={readonly}
                                    name="countrycodes"
                                    autoFocus
                                    options={Option1}
                                    value={countrycodes}
                                    onChange={(o) => {
                                      setcountrycodes(o)
                                      console.log(countrycodes);

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
                              <div className="col-lg-3 col-md-4 Code">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="name">Currency Code</label>
                                  <Select
                                    name="currencyCodes"
                                    isDisabled={readonly}
                                    options={Option}
                                    value={currencyCodes}
                                    onChange={(o) => setcurrencyCodes(o)}
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
                              <div className="col-lg-4 col-md-6 Dat">
                                <div className="p-1">
                                  <label className="form-label">Valid From</label>
                                  <Field name="validFrom" id="validFrom" value={formik.values.validFrom} type='date' className='form-control' onChange={formik.handleChange}
                                  />

                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 Dat">
                                <div className="p-1">
                                  <label className="form-label">Valid To</label>

                                  <Field name='validTo' value={formik.values.validTo} type='date' className='form-control' onChange={formik.handleChange} />

                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-6">
                                <div className="p-1">
                                  <label className="form-label ">Status</label>
                                  <div className="form-check form-switch ">
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
/* CountryCurrencyMaster Functionality Start */

export default CurrencyMapMaster;
