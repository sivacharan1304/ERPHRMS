/* Import Statement */
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { get, post, put, Delete } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
  id: number,
  languageCode: string,
  description: string,
  isActive: boolean
}
/* Language Functionality Start */
const Language = () => {
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [Lcode, setLcode] = useState([]);
  const [Lcode1, setLcode1] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [searchdata, setsearchdata] = useState([]);
  const [stateValue, setstateValue] = useState('');
  const [order, setorder] = useState('ASC');
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [savebtndisable, setsavebtndisable] = useState(false);
  const INITIAL_COUNT = "";
  const [errmsg, seterrmsg] = useState(INITIAL_COUNT);
  const prevCountRef = useRef<string>(INITIAL_COUNT);
  /* Initial Page Load Function */
  const filllist = () => {


    get('Language/GetAllLanguage')
      .then((result) => {
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {

          data1.push(
            {
              id: i,
              languageCode: obj.languageCode,
              description: obj.description,
              isActive: obj.isActive ? 'Active' : 'In Active',

            })
          i = i + 1;

        })

        setLcode(data1)
        setLcode1(data1)
        setsearchdata(data1)
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

  /* Form Validation */
  const validate = () => {
    let valid = true

    if (formik.values.languageCode == "" && formik.values.description == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (formik.values.languageCode == "") {
      toast.error("Please Enter LanguagueCode ");
      return false;
    }
    if (formik.values.description == "") {
      toast.error("Please Enter Description ");
      return false;
    }
    return valid;
  }
  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      languageCode: "",
      description: "",
      isActive: true,

    },
    /*  insert Functionality */

    onSubmit: (values, { resetForm }) => {
      if (validate() === true) {
        if (rowId === 0) {
          const Insertdata = {
            languageCode: values.languageCode.toUpperCase(),
            description: values.description,
            isActive: values.isActive,
            createdBy:SessionManager.getUserID(),
            createdDate: dayjs()

          }

          post('Language/Addlanaguage', Insertdata)
            .then((result) => {
              filllist()
              document.getElementById('languageCode')?.focus()
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

            languageCode: formik.values.languageCode.toUpperCase(),
            description: formik.values.description,
            isActive: formik.values.isActive,
            modifiedBy:SessionManager.getUserID(),
            modifiedDate: dayjs()
          }
          console.log(updatedata);

          put('Language/UpdateLanguage', updatedata)
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
    get('Language/GetLanguage?langCode=' + rowData.languageCode)
      .then((result) => {
        formik.setFieldValue('languageCode', result.data.languageCode)
        formik.setFieldValue('description', result.data.description)
        formik.values.isActive = result.data.isActive
        setswtstatus(result.data.isActive)
        document.getElementById('description')?.focus()
      })
    setSelectedRow(rowData);
    setreadonly(true);
    setrowId(1);
  }
  /* Table Sorting */
  const Sorting = (column: any) => {
    if (order === "ASC") {
      const sorted = [...Lcode].sort((a: any, b: any) =>
        a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
      );
      setLcode(sorted);
      setorder('DSC')
    }
    if (order === "DSC") {
      const sorted = [...Lcode].sort((a: any, b: any) =>
        a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
      );
      setLcode(sorted);
      setorder('ASC')
    }
  }
  /*  End */
  /* Table Functionality End*/

  /* Page Reset */
  const onReset = () => {
    if (rowId !== undefined) {
      document.getElementById('languageCode')?.focus()
      setreadonly(false);
      setswtstatus(true);
      formik.resetForm();
      setSelectedRow(undefined);
      setrowId(0)
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
      <div style={{ display: divStyle() }}  >
        {prevCountRef.current}
      </div>
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Language Master</h3>

      <div className="card" >
        <div className='shadow-sm p-2 mb-5   bg-white rounded '>
          <div className='container-fluid'>
            <div className='row'>
              {/*  Heading Button Start */}

              <div className='col-lg-12 col-md-12 col-sm-8'>
                <div className="action1">
                  <button type='reset' className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
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
                    inputProps={{ placeholder: "Search For Language Code" }}

                    value={stateValue}
                    items={Lcode1}
                    getItemValue={(item) => item.languageCode}
                    shouldItemRender={(state, value) => state.languageCode.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                    renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                    }
                    renderItem={(item, isHighlighted) => (

                      <table
                        className={`item ${isHighlighted ? "selected-item" : ""}`}
                        style={{ border: "1px" }}
                      >
                        <thead style={{ background: "#0095e8", color: "white", position: "sticky", top: 0 }}>

                          {item.id === 1 ?
                            <tr>
                              <th>Languague Code</th>
                              <th>Description</th>
                              <th>Status</th>
                            </tr>
                            : null
                          }
                        </thead>
                        <tbody>

                          <tr key={item.languageCode}
                            onClick={() => handleRowClick(item)}
                            onKeyDown={(event) => handleRowKeyDown(event, item)}
                            tabIndex={0}
                          >
                            <td className='min-w-200px' >{item.languageCode}</td>
                            <td className='min-w-200px'>{item.description}</td>
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
                      var c = val.split("-", 3);
                      get('Language/GetLanguage?langCode=' + val)
                        .then((result) => {
                          setrowId(1)
                          formik.setFieldValue('languageCode', result.data.languageCode)
                          formik.setFieldValue('description', result.data.description)
                          formik.values.isActive = result.data.isActive
                          setswtstatus(result.data.isActive)
                          document.getElementById('description')?.focus()
                        })
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
              <div className="card " style={{ height: 400 }}>
                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded ">
                  <div className="table-responsive">
                    {/* begin::Table */}
                    <div style={{ height: 360, overflowY: "scroll" }}>

                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                        {/* begin::Table head */}
                        <thead className="w-150" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='fw-bold text-muted'>
                            <th className='min-w-150px text-white' onClick={() => Sorting('languageCode')} >Language Code

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />

                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting('description')} >Description

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
                          {Lcode.map((rowData: IData) => (
                            <tr key={rowData.languageCode}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.languageCode === rowData.languageCode
                                    ? ' #BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}

                            >

                              <td>{rowData.languageCode}</td>
                              <td>{rowData.description}</td>
                              <td>{rowData.isActive}</td>

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
                <div className="card-body ">

                  {/* Formik integration Start*/}

                  <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>


                    <Form id='form' className="">
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h4>Language Master</h4></div>
                          <div className="col-lg-12 col-md-7 col-sm-6">

                            <div className="row">
                              <div className="col-lg-3 col-md-4 Ccode">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="name" >Language Code</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field innerRef={inputRef} maxlength={3} id="languageCode" readOnly={readonly} name='languageCode' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.languageCode.replace(/[^a-z,]+$/i, '')} />

                                </div >
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-5 col-md-6 NName">
                                <div className="p-1">
                                  <label className="form-label" >Description</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field maxlength={20} id="description" className="form-control form-control-sm" name='description' autoComplete='off' onChange={formik.handleChange} value={formik.values.description.replace(/[^a-z\s,]+$/i, '')} />

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
/* Language Functionality End */

export default Language;
