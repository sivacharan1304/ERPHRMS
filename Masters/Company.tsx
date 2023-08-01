
/* Import Statement */
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import Select, { components } from 'react-select';
import '../Qs_css/Autocomplete.css'
import dayjs from "dayjs";
import { Delete, get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
  id: number,
  compId: string,
  compShortName: string,
  compLongName: string,
  primCurrencyCode: string;
  languageKey: string;
  isActive: boolean;
}
/* Company Function Start */
const Company = () => {

  /* Const Variable Initialization */
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [CCode, setCCode] = useState<any>({ value: '', label: '' });
  const [LCode, setLCode] = useState<any>({ value: '', label: '' });
  const [Option, setOption] = useState([]);
  const [Option1, setOption1] = useState([]);
  const [Country, setCountry] = useState('');
  const [company, setcompany] = useState([]);
  const [company1, setcompany1] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [CountryCode, setCountryCode] = useState('');
  const [searchdata, setsearchdata] = useState([]);
  const [stateValue, setstateValue] = useState('');
  const [Currency, setCurrency] = useState([]);
  const [Language, setLanguage] = useState([]);
  const [order, setorder] = useState('DSC');
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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

    get('Language/GetAllLanguage')
      .then((result) => {
        let data2: any = [];
        console.log(result.data);

        result.data.map((obj: any) => {
          data2.push(
            {
              value: obj.languageCode,
              label: obj.languageCode + '-' + obj.description,
            })
        })
        setOption1(data2)
        setLanguage(result.data)
      })
    get('Company/GetAllCompany')
      .then((result) => {
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {
          data1.push(
            {
              id: i,
              compId: obj.compId,
              compShortName: obj.compShortName,
              compLongName: obj.compLongName,
              primCurrencyCode: obj.primCurrencyCode,
              languageKey: obj.languageKey,
              isActive: obj.isActive ? 'Active' : 'In Active',

            })
          i = i + 1;

        })
        setcompany(data1)
        setcompany1(data1)
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
    if (formik.values.compId == "" && formik.values.compShortName == "" && formik.values.compLongName == "" && CCode.value == "" && LCode.value == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (formik.values.compId == "") {
      toast.error("Please Enter CompanyId ");
      return false;
    }
    if (formik.values.compShortName == "") {
      toast.error("Please Enter ShortName ");
      return false;
    }
    if (formik.values.compLongName == "") {
      toast.error("Please Enter LongName");
      return false;
    }
    if (CCode.value == "") {
      toast.error("Please Enter PrimCurrencyCode");
      return false;
    }
    if (LCode.value == "") {
      toast.error("Please Enter LanguageKey ");
      return false;
    }
    return valid;
  }
  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      compId: "",
      compShortName: "",
      compLongName: "",
      primCurrencyCode: "",
      languageKey: "",
      isActive: true
    },
    /*  Insert Functionality */
    onSubmit: (values, { resetForm }) => {


      const InsertData = {
        compId: values.compId.toUpperCase(),
        compShortName: values.compShortName,
        compLongName: values.compLongName,
        primCurrencyCode: CCode.value,
        languageKey: LCode.value,
        isActive: values.isActive,
        createdBy:SessionManager.getUserID(),
        createdDate: dayjs()
      }
      console.log(InsertData)
      if (validate() === true) {
        if (rowId === 0) {
          post('Company/AddCompany', InsertData)
            .then((result) => {
              filllist()

              document.getElementById('compId')?.focus()
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
          /*  Update Functionality */
          const updatedata = {
            compId: formik.values.compId,
            compShortName: formik.values.compShortName,
            compLongName: formik.values.compLongName,
            primCurrencyCode: CCode.value,
            languageKey: LCode.value,
            isActive: formik.values.isActive,
            modifiedBy:SessionManager.getUserID(),
            modifiedDate: dayjs()
          }

          put('Company/UpdateCompany', updatedata)
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

  /* Autocomplete KeyEnter Event handlers */
  const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      setSelectedRow(item);

    }
  };

  /* Table Functionality Start*/
  /* Table Rowclick Event Handlers*/
  const handleRowClick = (rowData: IData) => {
    get('Company/GetCompanyById?CompanyID=' + rowData.compId)
      .then((result) => {
        formik.setFieldValue("compId", result.data.compId)
        formik.setFieldValue("compShortName", result.data.compShortName)
        formik.setFieldValue("compLongName", result.data.compLongName)
        formik.setFieldValue("primCurrencyCode", result.data.primCurrencyCode)
        formik.setFieldValue("languageKey", result.data.languageKey)
        setswtstatus(result.data.isActive)
        document.getElementById('compShortName')?.focus()
        setCCode({ value: result.data.primCurrencyCode, label: result.data.primCurrencyCode })
        setLCode({ value: result.data.languageKey, label: result.data.languageKey })

      })
    setSelectedRow(rowData);
    setreadonly(true);

    setrowId(1)

  }
  /* Table Sorting */
  const Sorting = (column: any) => {
    if (order === "ASC") {
      const sorted = [...company].sort((a: any, b: any) =>
        a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
      );
      setcompany(sorted);
      setorder('DSC')
    }
    if (order === "DSC") {
      const sorted = [...company].sort((a: any, b: any) =>
        a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
      );
      setcompany(sorted);
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
      document.getElementById('compId')?.focus()
      setCCode({ value: '', label: '' })
      setLCode({ value: '', label: '' })
      formik.resetForm();
      setSelectedRow(undefined)
      seterrmsg('');

    }
  }
  /* show&hide functionality for alert Div style */

  const divStyle = () => {

    return errmsg ? "" : "none";
  }

  return (

    <>
      <div style={{ display: divStyle() }}>{prevCountRef.current}
      </div>
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Company Master</h3>
      <div className="card" >
        <div className='shadow-sm p-2 mb-5 bg-white rounded'>
          <div className='container-fluid'>
            <div className='row'>


              {/*  Heading Button Start */}
              <div className='col-lg-12 col-md-12 col-sm-8 '>
                <div className="action1">
                  <button type='reset' form='form' className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                    <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                  <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                    <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                  <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} >
                    <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>

                </div>
              </div>
              {/*  Heading End  */}
              {/*  Autocomplete Start  */}
              <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                <div className="autocomplete-wrapper">

                  <Autocomplete
                    inputProps={{ placeholder: "Search For Company Code" }}
                    value={stateValue}
                    items={company1}

                    getItemValue={(item) => item.compId}
                    shouldItemRender={(state, value) => state.compShortName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                <th>CompanyId</th>
                                <th>ShortName</th>
                                <th>LongName</th>
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
                            <td className='min-w-150px'  >{item.compId}</td>
                            <td className='min-w-150px'  >{item.compShortName}</td>
                            <td className='min-w-150px' >{item.compLongName}</td>
                            <td className='min-w-150px' >{item.isActive}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    onChange={(event, val) => { setstateValue(val) }}
                    onSelect={(val) => {
                      console.log(val);
                      setstateValue(val)
                      setstateValue('')
                      var c = val.split("-", 6);
                      get('Company/GetCompanyById?CompanyID=' + val)
                        .then((result) => {
                          setrowId(1)
                          formik.setFieldValue("compId", result.data.compId)
                          formik.setFieldValue("compShortName", result.data.compShortName)
                          formik.setFieldValue("compLongName", result.data.compLongName)
                          formik.setFieldValue("primCurrencyCode", result.data.primCurrencyCode)
                          formik.setFieldValue("languageKey", result.data.languageKey)
                          setswtstatus(result.data.isActive)
                          document.getElementById('compShortName')?.focus()
                          setCCode({ value: result.data.primCurrencyCode, label: result.data.primCurrencyCode })
                          setLCode({ value: result.data.languageKey, label: result.data.languageKey })
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
            <div className='col-lg-6 col-md-12 col-sm-12' style={{ background: "white" }}>
              <div className="card " style={{ height: 400 }}>
                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                  <div className="table-responsive">
                    {/* begin::Table */}
                    <div style={{ height: 360, overflowY: "scroll" }}>
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>
                        {/* begin::Table head */}
                        <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='fw-bold text-muted'>

                            <th className='min-w-100px text-white' onClick={() => Sorting("compId")}  >Company Id
                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />
                            </th>
                            <th className='min-w-100px text-white  ' onClick={() => Sorting("compShortName")}>Short Name

                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />


                            </th>
                            <th className='min-w-100px text-white  ' onClick={() => Sorting("compLongName")}>Long Name

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
                          {company.map((rowData: IData) => (

                            <tr key={rowData.compId}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.compId === rowData.compId
                                    ? ' #BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}

                            >

                              <td>
                                {rowData.compId}
                              </td>

                              <td>
                                {rowData.compShortName}
                              </td>
                              <td>
                                {rowData.compLongName}
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

            <div className='col-lg-6 col-sm-12 '>
              <div className="card">
                <div className="card-body">
                  {/* Formik integration Start*/}
                  <Formik initialValues={formik.initialValues} onSubmit={() => formik.handleSubmit()}>

                    <Form id='form' className="">
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h4>Company Master</h4></div>
                          <div className="col-lg-12 col-md-6 col-sm-6">
                            <div className="row">
                              <div className="col-lg-3 col-md-4 Id">
                                <div className="p-1">
                                  <label className="form-label">Company Id</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field innerRef={inputRef} type="text" id="compId" readOnly={readonly} maxlength={6} autoFocus className="form-control form-control-sm" name='compId' onChange={formik.handleChange} value={formik.values.compId.replace(/[^a-z,]+$/i, '')} />

                                </div >
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-3 col-md-4 shortName">
                                <div className="p-1">
                                  <label className="form-label"  >Short Name</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field id="compShortName" maxlength={20} className="form-control form-control-sm" name='compShortName' onChange={formik.handleChange} value={formik.values.compShortName.replace(/[^a-z,0-9]+$/i, '')} />


                                </div >

                              </div>

                              <div className="col-lg-5 col-md-8 Name">
                                <div className="p-1">
                                  <label className="form-label" >Long Name</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Field className="form-control form-control-sm" maxlength={50} name='compLongName' autoComplete='off' onChange={formik.handleChange} value={formik.values.compLongName.replace(/[^a-z 0-9\s,]+$/i, '')} />

                                </div>
                              </div>

                            </div>

                            <div className="row">
                              <div className="col-lg-3 col-md-4 Code">
                                <div className="p-1">
                                  <label className="form-label">Currency Code</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Select

                                    name="CCode"

                                    options={Option}
                                    value={CCode}

                                    onChange={(o) => {
                                      return setCCode(o)

                                    }

                                    }

                                    placeholder="Select"

                                    components={{
                                      IndicatorSeparator: () => null

                                    }}
                                    styles={{
                                      menu: (base) => ({
                                        ...base,
                                        width: "max-content",
                                        minWidth: "150px",

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
                              <div className="col-lg-3 col-md-5 Code">
                                <div className="p-1">
                                  <label className="form-label">Language Code</label>
                                  <span style={{ display: divStyle(), color: 'red' }}>*</span>
                                  <Select
                                    name="LCode"
                                    options={Option1}

                                    value={LCode}
                                    onChange={(o) => {
                                      return setLCode(o)


                                    }

                                    }
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


                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="p-1">
                                    <label className="form-label">Status</label>
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
/* Company Function End */

export default Company;
