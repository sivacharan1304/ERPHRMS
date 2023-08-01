/* Import Statement */
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik"
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import dayjs from "dayjs";
import '../Qs_css/Autocomplete.css'
import { get, post, put } from "../Service/Services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionManager from "../../modules/auth/components/Session";
/* Array Initialization */
interface IData {
  id: number,
  addrType: string,
  addrDesc: string,
  isActive: boolean,
  sno: number,
  createdDate: string,
  modifiedDate: string
}

/* Addresstype Functionality Start */
const Addresstype = () => {

  /* Const Variable Initialization */
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [Data, setData] = useState([]);
  const [Data1, setData1] = useState([]);
  const [rowId, setrowId] = useState(0);
  const [stateValue, setstateValue] = useState('');
  const [order, setorder] = useState('DSC');
  const [swtstatus, setswtstatus] = useState(true);
  const [readonly, setreadonly] = useState(false);

  /* Initial Page Load Function */
  const filllist = () => {
    get('AddressType/GetAllAddressType')
      .then((result) => {
        var i = 1;
        let data1: any = []
        result.data.map((obj: IData) => {
          data1.push(
            {
              id: i,
              addrType: obj.addrType,
              addrDesc: obj.addrDesc,
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

    if (formik.values.addrType == "" && formik.values.addrDesc == "") {
      toast.error("Invalid Details. Please Check Required Field....");
      return false;
    }
    if (formik.values.addrType == "") {
      toast.error("Please Enter Address Type ");
      return false;
    }
    if (formik.values.addrDesc == "") {
      toast.error("Please Enter Description ");
      return false;
    }
    return valid;
  }

  /* Formik Library Start*/
  const formik = useFormik({
    initialValues: {
      addrType: "",
      addrDesc: "",
      isActive: false,
    },
    /*  insert Functionality */
    onSubmit: (values, { resetForm }) => {
      if (validate() === true) {
        if (rowId === 0) {
          const Insertdata = {
            addrType: formik.values.addrType.toUpperCase(),
            addrDesc: formik.values.addrDesc,
            isActive: formik.values.isActive,
            createdBy: SessionManager.getUserID(),
            createdDate: dayjs()
          }
          post('AddressType/AddAddressType', Insertdata)
            .then((result) => {
              filllist()
              document.getElementById('addrType')?.focus();
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
            addrType: formik.values.addrType,
            addrDesc: formik.values.addrDesc,
            isActive: swtstatus,
            modifiedBy: SessionManager.getUserID(),
            modifiedDate: dayjs()
          }
          /*  update functionality */
          put('AddressType/UpdateAddressType', updatedata)
            .then((result) => {
              filllist()
              toast.success(result.data.statusmessage)
              document.getElementById('addrType')?.focus();
              if (result.data.statusmessage !== 'Already Exists') {
                onReset()
              }
            })
        }

      }
    },

  })
  /* Formik Library End */

  /* Table Functionality Start */
  /* Autocomplete KeyEnter Event handlers */
  const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      setSelectedRow(item);
    }
  };

  /* Table Rowclick Event Handlers */
  const handleRowClick = (rowData: IData) => {
    get('AddressType/GetAddressType?AddressType=' + rowData.addrType)
      .then((result) => {
        document.getElementById('addrDesc')?.focus();
        formik.setFieldValue("addrType", result.data.addrType)
        formik.setFieldValue("addrDesc", result.data.addrDesc)
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
      document.getElementById('addrType')?.focus();
      setrowId(0)
      setSelectedRow(undefined)
      setreadonly(false);
      setswtstatus(true);
      formik.resetForm()
     
    }
  }
  /* End */

  return (
    <>
      
      <ToastContainer autoClose={2000}></ToastContainer>
      <h3>Address Type Master</h3>
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
                    inputProps={{ placeholder: "Search AddressType" }}
                    value={stateValue}
                    items={Data1}
                    getItemValue={(item) => (item.addrType + "-" + item.addrDesc + "-" + item.isActive)}
                    shouldItemRender={(state, value) => state.addrType.toLowerCase().indexOf(value.toLowerCase()) !== -1}
                    renderMenu={(item) => <div className="dropdown cd position-absolute" style={{ zIndex: 12, color: "black", background: "white" }}> {item}</div>
                    }
                    renderItem={(item, isHighlighted) => (
                      <table
                        className={`item ${isHighlighted ? "selected-item" : ""}`}
                      >
                        <thead style={{ background: "#0095e8", color: "white" }}>
                          {
                            item.id === 1 ?
                              <tr>
                                <th>Address Type</th>
                                <th>Address Description</th>
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
                            <td className='min-w-150px' >{item.addrType}</td>
                            <td className='min-w-250px'>{item.addrDesc}</td>
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
                      get('AddressType/GetAddressType?AddressType=' + val.addrType)
                        .then((result) => {
                          document.getElementById('addrDesc')?.focus();
                          formik.setFieldValue("addrType", result.data.addrType)
                          formik.setFieldValue("addrDesc", result.data.addrDesc)
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
            </div>
            {/* Autocomplete End  */}

          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className='col-lg-6 col-md-12 col-sm-12'>
              <div className="card" style={{ height: 400 }}>
                <div className="card-body shadow-sm p-2 mb-5 bg-white rounded">
                  <div className="table-responsive">
                    {/* begin::Table */}
                    <div style={{ height: "310px", overflowY: "scroll" }}>
                      <table id="dtVerticalScrollExample" className='table table-striped align-middle gs-1'>

                        {/* begin::Table head */}
                        <thead className="w-120" style={{ background: "#0095e8", position: "sticky", top: 0 }}>
                          <tr className='text-muted text-bolder '>

                            <th className='min-w-150px text-white' onClick={() => Sorting("addrType")}>Address Type
                              <img
                                alt='sort'
                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                className='ms-1'
                                height={13}
                                width={13}
                              />
                            </th>
                            <th className='min-w-150px text-white' onClick={() => Sorting("addrDesc")}>Address Description
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
                            <tr key={rowData.addrType}
                              onClick={() => handleRowClick(rowData)}
                              style={{
                                backgroundColor:
                                  selectedRow && selectedRow.addrType === rowData.addrType
                                    ? ' #BAD9FB'
                                    : 'white',
                                cursor: 'pointer',
                                width: 100
                              }}
                            >

                              <td>
                                {rowData.addrType}
                              </td>
                              <td>
                                {rowData.addrDesc}
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

                    <Form id='form' >
                      <div className="container">
                        <div className="row">
                          <div className="card-title"><h3>Address Type Master</h3></div>
                          <div className="col-lg-12 col-md-12 col-sm-6">
                            <div className="row">
                              <div className="col-lg-3 col-md-4 Type">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="name" >Address Type</label>
                                  <Field maxlength='5' autoFocus id="addrType" autoComplete="off" readOnly={readonly} name='addrType' className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.addrType.replace(/[^a-z,]+$/i, '')} />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-6 col-md-7 Description">
                                <div className="p-1">
                                  <label className="form-label" htmlFor="addrDesc" >Address Description</label>
                                  <Field as="textarea" name='addrDesc' id="addrDesc" autoComplete="off" maxlength="50" className='form-control form-control-sm' onChange={formik.handleChange} value={formik.values.addrDesc.replace(/[^a-z\s,]+$/i, '')} />
                                </div >
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
/* Addresstype Functionality End */
export default Addresstype;
