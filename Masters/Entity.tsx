/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";

/* Array Initialization */
interface IData {
  entityType: string,
  entityDesc: string,
  isActive: boolean,
  id: number
  createdDate: string,
  modifiedDate: string
}

/* Entity Functionality Start */
const Entity = () => {
  /* Const Variable Initialization */
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [Data, setData] = useState([]);
  const [Data1, setData1] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [order, setorder] = useState('DSC');
  const [stateValue, setstateValue] = useState('');
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);

  /* Initial Page Load Function */
  const filllist = () => {
    get('Entity/GetAllEntity')
      .then((result) => {
        console.log(result);
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {
          data1.push(
            {
              id: i,
              entityType: obj.entityType,
              entityDesc: obj.entityDesc,
              isActive: obj.isActive ? 'Active' : 'In Active',
            })
          i = i + 1;
        })
        setData(data1)
        setData1(data1)
      })
  }

  useEffect(() => {
    var s = SessionManager.getUserID();
    if (SessionManager.getUserID() == null) {
        window.location.href = "/hrms/auth";
    }
    filllist()
  }, [])

  /* Form Validation */
  const validate = () => {
    let valid = true

    if (formik.values.entityType == "" && formik.values.entityDesc == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (formik.values.entityType == "") {
      toast.error("Please Enter Entity type ");
      return false;
    }
    if (formik.values.entityDesc == "") {
      toast.error("Please Enter Description ");
      return false;
    }
    return valid;
  }

  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      entityType: "",
      entityDesc: "",
      isActive: true,
      sno: 0,
    },
    /*  insert Functionality */
    onSubmit: (values, { resetForm }) => {
      if (validate() === true) {
        if (rowId === 0) {
          const Insertdata = {
            entityType: formik.values.entityType.toUpperCase(),
            entityDesc: formik.values.entityDesc,
            isActive: formik.values.isActive,
            createdDate: dayjs()
          }
          post('Entity/AddEntity', Insertdata)
            .then((result) => {
              console.log();
              filllist()
              document.getElementById('entityType')?.focus();
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
            entityType: formik.values.entityType,
            entityDesc: formik.values.entityDesc,
            isActive: swtstatus,
            modifiedDate: dayjs()
          }
          put('Entity/UpdateEntity', updatedata)
            .then((result) => {
              filllist()
              toast.success(result.data.statusmessage)
              console.log(result.data.statusmessage);
              onReset()
            })
        }
        // resetForm();
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
    get('Entity/GetEnityByType?enityType=' + rowData.entityType)
      .then((result) => {
        document.getElementById('entityDesc')?.focus();
        formik.setFieldValue("entityType", result.data.entityType)
        formik.setFieldValue("entityDesc", result.data.entityDesc)
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
  /*  End */
  /* Table Functionality End*/

  /* Page Reset */
  const onReset = () => {
    if (rowId !== undefined) {
      setrowId(0)
      setreadonly(false);
      setswtstatus(true);
      setSelectedRow(undefined)
      document.getElementById('entityType')?.focus();
      formik.resetForm()
    }
  }
  /* End */

  return (
    <>
      
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Entity Master</h3>
      <div className="card">
        <div className='shadow-sm p-2 mb-5 bg-white rounded '>
          <div className='container-fluid'>
            <div className='row'>
              {/*  Heading Button Start */}
              <div className='col-lg-12 col-md-12 col-sm-8'>
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
                    inputProps={{ placeholder: 'Search Entity Type' }}
                    value={stateValue}
                    items={Data1}
                    getItemValue={(item) => (item.entityType + "-" + item.entityDesc + "-" + item.isActive)}
                    shouldItemRender={(state, value) => state.entityType.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                <th>Entity Type</th>
                                <th>Entity Description</th>
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
                            <td className='min-w-150px' >{item.entityType}</td>
                            <td className='min-w-250px'>{item.entityDesc}</td>
                            <td className='min-w-90px'>{item.isActive}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    /* Binding The Values Tab Control Columns In The Fields */
                    onChange={(event, val) => {
                      setstateValue(val);
                    }}
                    onSelect={(e, val) => {
                      get('Entity/GetEnityByType?enityType=' + val.entityType)
                        .then((result) => {
                          document.getElementById('entityDesc')?.focus();
                          formik.setFieldValue("entityType", result.data.entityType)
                          formik.setFieldValue("entityDesc", result.data.entityDesc)
                          setswtstatus(result.data.isActive);
                        })
                      setSelectedRow(val);
                      setreadonly(true);
                      setrowId(1)

                    }}
                  />
                </div>
                {/* <button className='aply col-lg-3 col-sm-12 ms-2'>Apply Filter</button> */}
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
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1' >

                        {/* begin::Table head */}
                        <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='text-muted text-bolder '>

                            <th className='min-w-100px text-white' onClick={() => Sorting("entityType")} >Entity Type
                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />
                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting("entityDesc")}>Entity Description
                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />
                            </th>
                            <th className='min-w-60px text-white' onClick={() => Sorting("isActive")}>Status
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
                            <tr key={rowData.entityType}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.entityType === rowData.entityType
                                    ? ' #BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}
                            >

                              <td>
                                {rowData.entityType}
                              </td>
                              <td>
                                {rowData.entityDesc}
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

                    <Form id='form' autoComplete="off">
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h4>Entity Master</h4></div>
                          <div className="col-lg-12 col-md-6 col-sm-6">
                            <div className="row">
                              <div className="col-lg-3 col-md-4 Type">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="entityType" >Entity Type</label>                              
                                  <Field maxlength='10' id="entityType" autoFocus readOnly={readonly} name='entityType' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.entityType.replace(/[^a-z,]+$/i, '')} />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-5 col-md-6 Description">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="entityDesc" >Entity Description</label>                               
                                  <Field id="entityDesc" name='entityDesc' maxlength='20' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.entityDesc.replace(/[^a-z\s,]+$/i, '')} />
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
/* Entity Functionality End */

export default Entity;
