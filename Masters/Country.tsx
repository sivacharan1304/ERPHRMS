/* Import Statement */
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik"
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { Delete, get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
  id: number,
  countryCode: string,
  countryName: string,
  telCode_From: string;
  telCode_To: string;
  isActive: boolean;
}
/* Country Function Start */
const Country = () => {
  /* Const Variable Initialization */
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [country, setcountry] = useState([]);
  const [country1, setcountry1] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [searchdata, setsearchdata] = useState([]);
  const [stateValue, setstateValue] = useState('');
  const [countryCode, setCountryCode] = useState();
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [savebtndisable, setsavebtndisable] = useState(false);
  const INITIAL_COUNT = "";
  const [errmsg, seterrmsg] = useState(INITIAL_COUNT);
  const prevCountRef = useRef<string>(INITIAL_COUNT);
  const [order, setorder] = useState('DSC');

  /* Initial Page Load Function */
  const filllist = () => {
    get('Countries/GetAllCountries')
      .then((result) => {
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {
          data1.push(
            {
              id: i,
              countryCode: obj.countryCode,
              countryName: obj.countryName,
              telCode_From: obj.telCode_From,
              telCode_To: obj.telCode_To,
              isActive: obj.isActive ? 'Active' : 'In Active',
            })
          i = i + 1;
        })
        setcountry(data1)
        setcountry1(data1)
        setCountryCode(data1.countryCode)
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
    if (formik.values.countryCode == "" && formik.values.countryName == "" && formik.values.telCode_From == "" && formik.values.telCode_To == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (formik.values.countryCode == "") {
      toast.error("Please Enter CountryCode ");
      return false;
    }
    if (formik.values.countryName == "") {
      toast.error("Please Enter CountryName ");
      return false;
    }
    if (formik.values.telCode_From == "") {
      toast.error("Please Enter TelCode_From ");
      return false;
    }
    if (formik.values.telCode_To == "") {
      toast.error("Please Enter TelCode_To ");
      return false;
    }
    return valid;
  }
  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      countryCode: "",
      countryName: "",
      telCode_From: "",
      telCode_To: "",
      isActive: true
    },
    /*  insert Functionality */
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      if (validate() === true) {
        if (rowId === 0) {
          const InsertData = {
            countryCode: values.countryCode.toUpperCase(),
            countryName: values.countryName,
            telCode_From: (values.telCode_From).toString(),
            telCode_To: (values.telCode_To).toString(),
            isActive: values.isActive,
            createdBy:SessionManager.getUserID(),
            createdDate: dayjs()
          }
          console.log(InsertData);

          post('Countries/AddCountries', InsertData)
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
        else {
          const updatedata = {
            countryCode: formik.values.countryCode.toUpperCase(),
            countryName: formik.values.countryName,
            telCode_From: (formik.values.telCode_From).toString(),
            telCode_To: (formik.values.telCode_To).toString(),
            isActive: formik.values.isActive,
            modifiedBy:SessionManager.getUserID(),
            modifiedDate: dayjs()
          }
          /*  update functionality */
          put('Countries/UpdateCountries', updatedata)
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
    get('Countries/GetCountries?CountriesCode=' + rowData.countryCode)
      .then((result) => {

        formik.setFieldValue("countryCode", result.data.countryCode)
        formik.setFieldValue("countryName", result.data.countryName)
        formik.setFieldValue("telCode_From", result.data.telCode_From)
        formik.setFieldValue("telCode_To", result.data.telCode_To)
        setswtstatus(result.data.isActive)
        document.getElementById('countryName')?.focus()

      })
    setSelectedRow(rowData);
    setreadonly(true);
    setrowId(1)
  }
  /* Table Sorting */
  const Sorting = (column: any) => {
    if (order === "ASC") {
      const sorted = [...country].sort((a: any, b: any) =>
        a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
      );
      setcountry(sorted);
      setorder('DSC')
    }
    if (order === "DSC") {
      const sorted = [...country].sort((a: any, b: any) =>
        a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
      );
      setcountry(sorted);
      setorder('ASC')
    }
  }
  /*  End */
  /* Table Functionality End*/

  /* Page Reset */
  const onReset = () => {
    if (rowId !== undefined) {
      setrowId(0)
      document.getElementById('countryCode')?.focus()
      setreadonly(false);
      setswtstatus(true);
      formik.resetForm();
      setSelectedRow(undefined)
      seterrmsg('');


    }
  }
  /* End */
  /* show&hide functionality for alert Div style */
  const divStyle = () => {

    return errmsg ? "" : "none";
  }

  return (
    <>
      <div style={{ display: divStyle() }}  >{prevCountRef.current}
      </div>
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Country Master</h3>
      <div className="card ">
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
                  {/* Autocomplete functionality  */}
                  <Autocomplete
                    inputProps={{ placeholder: "Search For Country Code" }}
                    value={stateValue}
                    items={country1}
                    getItemValue={(item) => item.countryCode}
                    shouldItemRender={(state, value) => state.countryCode.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                <td>Countrycode</td>
                                <td>CountryName</td>
                                <th>Status</th>
                              </tr>
                              :
                              null
                          }
                        </thead>
                        <tbody>
                          <tr key={item.countryCode}
                            onClick={() => handleRowClick(item)}
                            onKeyDown={(event) => handleRowKeyDown(event, item)}
                            tabIndex={0}>
                            <td className='min-w-200px' >{item.countryCode}</td>
                            <td className='min-w-200px' >{item.countryName}</td>
                            <td className='min-w-200px'>{item.isActive}</td>
                          </tr>
                        </tbody>
                      </table>

                    )}

                    onChange={(event, val) => {

                      setstateValue(val);
                    }}
                    onSelect={(val) => {
                      setstateValue(val)
                      setstateValue('')
                      var c = val.split("-", 5);
                      get('Countries/GetCountries?CountriesCode=' + val)
                        .then((result) => {
                          setrowId(1)
                          formik.setFieldValue("countryCode", result.data.countryCode)
                          formik.setFieldValue("countryName", result.data.countryName)
                          formik.setFieldValue("telCode_From", result.data.telCode_From)
                          formik.setFieldValue("telCode_To", result.data.telCode_To)
                          setswtstatus(result.data.isActive)
                          document.getElementById('countryName')?.focus()

                        })
                    }}



                  />
                  {/* Autocomplete End  */}
                </div>
              </div>


            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className='col-lg-6 col-md-12 col-sm-12' >
              <div className="card " style={{ height: 400 }}>
                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded ">
                  <div className="table-responsive">
                    {/* begin::Table */}
                    <div style={{ height: 360, overflowY: "scroll" }}>
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                        {/* begin::Table head */}
                        <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='text-bolder text-muted'>
                            <th className='min-w-150px text-white ' onClick={() => Sorting("countryCode")}>Country Code

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />



                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting("countryName")} >Country Name

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
                          {country.map((rowData: IData) => (

                            <tr key={rowData.countryCode}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.countryCode === rowData.countryCode
                                    ? '#BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}

                            >

                              <td >{rowData.countryCode} </td>
                              <td>{rowData.countryName}</td>
                              <td >{rowData.isActive}</td>
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

                <div className="card-body ">
                  {/* Formik integration Start*/}
                  <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                    <Form id='form' className="">
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h4>Country</h4></div>
                          <div className="col-lg-12 col-md-6 col-sm-6">
                            <div className="row">
                              <div className="col-lg-3 col-md-4 Ccode">
                                <div className="p-1">
                                  <label className="form-label" >Country Code</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field innerRef={inputRef} name='countryCode' id="countryCode" readOnly={readonly} maxlength={3} className='form-control form-control-sm' autoFocus onChange={formik.handleChange} value={formik.values.countryCode.replace(/[^a-z,]+$/i, '')} />{countryCode === '' && <span style={{ color: 'red' }}>*</span>}

                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-5 col-md-6 NName">
                                <div className="p-1">
                                  <label className="form-label" >Country Name</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field name='countryName' id="countryName" maxlength={50} autoComplete='off' className='form-control  form-control-sm' onChange={formik.handleChange} value={formik.values.countryName.replace(/[^a-z\s,]+$/i, '')} />

                                </div>
                              </div>
                            </div>


                            <div className="row">
                              <div className="col-lg-3 col-md-4 Ccode">
                                <div className="p-1">
                                  <label className="form-label " >Telecode From</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field name='telCode_From' maxLength={5} type="text" autoComplete='off' className='form-control  form-control-sm' onChange={formik.handleChange} value={formik.values.telCode_From.replace(/[^\d-]/, '')} />

                                </div >
                              </div>
                              <div className="col-lg-3 col-md-4 Ccode">
                                <div className="p-1">
                                  <label className="form-label " >Telecode To</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field name='telCode_To' maxLength="5" autoComplete='off' className='form-control  form-control-sm' onChange={formik.handleChange} value={formik.values.telCode_To.replace(/[^\d-]/, '')} />

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
/* Country Function End */
export default Country;
