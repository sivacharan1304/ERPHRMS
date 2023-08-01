/* Import Statement */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import Autocomplete from "react-autocomplete";
import { get, post, put } from "../Service/Services";
import dayjs from "dayjs";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import SessionManager from "../../modules/auth/components/Session";
import { AnyMxRecord } from "dns";
/* Array Initialization */
interface IData {
    roleID: number,
    roleName: string,
    userID: number,
    userName: string,
    password: string,
    emailID: string,
    clientID: number,
    isActive: boolean,
    sno: number,
    id: number,
    remarks: string,
    createdDate: string,
    modifiedDate: string,

}
/* User Role Functionality Start */
const PerformanceMapping = () => {
    const [selectedRow, setSelectedRow] = useState<any>();
    const [PerfomanceMappingData, setPerfomanceMappingData] = useState([]);
    const [PerfParameterData, setPerfParameterData] = useState([]);
    const [rowId, setrowId] = useState(0);
    const [order, setorder] = useState('DSC');
    const [stateValue, setstateValue] = useState('');
    const [swtstatus, setswtstatus] = useState(true);
    const [EmpGrpIdOptions, setEmpGrpIdOptions] = useState<any>([]);
    const [EmpSubGrpIdOptions, setEmpSubGrpIdOptions] = useState<any>([]);
    const [EmpGrpIdValue, setEmpGrpIdValue] = useState<any>({ value: '', label: '' });
    const [EmpSubGrpIdValue, setEmpSubGrpIdValue] = useState<any>({ value: '', label: '' });
    const [RoleAutoID, setRoleAutoID] = useState(0);
    const [SelectedParameterData, setSelectedParameterData] = useState<any[]>([]);
    const [checked, setChecked] = useState(false);
    const [readonly, setreadonly] = useState(false);

    const handleSelectAll = (event: any) => {
        // Update selectedRows state based on checked value
        setChecked(event.target.checked)
        if (event.target.checked) {
            setSelectedParameterData(PerfParameterData); // Select all rows
        } else {
            setSelectedParameterData([]); // Deselect all rows
        }
    };

    // Function to handle individual checkboxes

    const handleCheckbox = (event: any, rowData: any) => {
        // Update selectedRows state based on checkbox selection
        if (event.target.checked) {
            if (RoleAutoID === 0) {
                const InsertData = {

                    paramId: rowData.paramId,
                    parameterName: rowData.parameterName,
                    displayOrder: rowData.displayOrder,
                    parameterDescription: rowData.parameterDescription,
                    isActive: rowData.isActive,
                    createdDate: dayjs(),
                    createdBy: SessionManager.getEmpID()
                }
                setSelectedParameterData((prevSelectedRows) => [...prevSelectedRows, InsertData]);
            }
            else {
                const UpdateData = {
                    paramId: rowData.paramId,
                    parameterMapId: rowId,
                    parameterName: rowData.parameterName,
                    displayOrder: rowData.displayOrder,
                    parameterDescription: rowData.parameterDescription,
                    isActive: rowData.isActive,
                    modifiedDate: dayjs(),
                    modifiedBy: SessionManager.getEmpID()
                }
                console.log(rowData)
                setSelectedParameterData((prevSelectedRows) => [...prevSelectedRows, UpdateData]);
            }

        } else {
            const filter = SelectedParameterData.filter((row) => row.paramId !== rowData.paramId)
            setSelectedParameterData(filter)
        }
    };
    /* Initial Page Load Function */
    const filllist = () => {

        get('EmpGroup/GetAllEmpGroup')
            .then((result) => {
                let data3: any = []
                result.data.map((record: any) => {
                    data3.push({
                        label: record.empGrpShortName,
                        value: (record.empGrpId).toString(),
                    })
                })
                setEmpGrpIdOptions(data3)
            })
        get('PerformanceParameter/GetAllPerformanceParameter')
            .then((result) => {
                var i = 1;
                let data: any = []
                result.data.map((obj: any) => {
                    data.push(
                        {
                            "paramId": obj.paramId,
                            "parameterName": obj.parameterName,
                            "parameterDescription": obj.parameterDescription,
                            "displayOrder": obj.displayOrder,
                            "isActive": obj.isActive
                        })
                    i = i + 1;
                })
                setPerfParameterData(data)
            })

        get('PerformanceMapping/GetAllPerformanceMapping')
            .then((result) => {
                var i = 1;
                let data: any = []
                result.data.map((obj: any) => {
                    console.log(obj);
                    data.push(
                        {
                            sno: i,
                            parameterMapId: obj.parameterMapId,
                            empGrpID: obj.empGrpID,
                            empGrpShortName: obj.empGrpShortName,
                            empSubGrpID: obj.empSubGrpID,
                            subGrpShortName: obj.subGrpShortName,
                            isActive: obj.isActive ? 'Active' : 'In Active'
                        })
                    i = i + 1;
                })
                setPerfomanceMappingData(data)

               
            })
    }
    useEffect(() => {
        if (SessionManager.getUserID() == null) {
            window.location.href = "/hrms/auth";
        }
        filllist()
    }, [])
    useEffect(() => {
        get('EmpSubGroup/GetSubGrpByEmpGrpId?Grpid=' + Number(EmpGrpIdValue.value))
            .then((result) => {
                let data4: any = []
                result.data.map((record: any) => {
                    data4.push({
                        label: record.subGrpShortName,
                        value: (record.empSubGrpID).toString(),
                    })
                })
                setEmpSubGrpIdOptions(data4)
            })
    }, [EmpGrpIdValue.value])
    /* Form Validation */
    const validate = () => {
        let valid = true

        if (EmpGrpIdValue.value === "" && EmpSubGrpIdValue.value === "") {
            toast.error("Invalid Details. Please Check Required Field....");
            return false;
        }
        if (EmpGrpIdValue.value === "") {
            toast.error("Please Enter User Name ");
            return false;
        }
        if (EmpSubGrpIdValue.value === "") {
            toast.error("Please Enter Password ");
            return false;
        }
        return valid;
    }
    /* Formik Library Start*/
    const formik = useFormik({
        initialValues: {
            isActive: true,
        },
        /* insert Functionality */

        onSubmit: (values) => {
            if (validate() === true) {
                if (rowId === 0) {
                    const Insertdata = {

                        empGrpID: EmpGrpIdValue.value,
                        empSubGrpID: EmpSubGrpIdValue.value,
                        isActive: formik.values.isActive,
                        createdDate: dayjs(),
                        createdBy: SessionManager.getEmpID(),
                        performanceMappings: SelectedParameterData
                      
                    }
                            console.log(Insertdata);

                    post('PerformanceMapping/AddPerformanceMappping', Insertdata)
                        .then((result) => {
                            filllist()
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
                /* update functionality */
                else {
                    const updatedata = {
                        parameterMapId: rowId,
                        empGrpID: EmpGrpIdValue.value,
                        empSubGrpID: EmpSubGrpIdValue.value,
                        isActive: formik.values.isActive,
                        modifiedDate: dayjs(),
                        modifiedBy: SessionManager.getEmpID(),
                        performanceParameters: SelectedParameterData
                    }
                    console.log(updatedata);
                    put('PerformanceMapping/UpdatePerformanceParameterAndPerformanceMapping', updatedata)
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

    /* Table Rowclick Event Handlers*/
    const handleRowClick = (rowData: any) => {
        get('EmpGroup/GetEmpGroup?EmpGrpID=' + rowData.empGrpID)
            .then((result) => {
                setEmpGrpIdValue({ value: result.data.empGrpId.toString(), label: result.data.empGrpShortName })
            })

        get('EmpSubGroup/GetEmpSubGroup?EmpSubGrpID=' + rowData.empSubGrpID)
            .then((result) => {
                setEmpSubGrpIdValue({ value: result.data.empSubGrpID.toString(), label: result.data.subGrpLongName })
            })

        get('PerformanceMapping/GetAllPerformanceById?Id=' + rowData.parameterMapId)
            .then((result) => {              
                setRoleAutoID(result.data.performanceParameter[result.data.performanceParameter.length - 1]?.id)
                setSelectedParameterData(result.data.performanceParameter)
                setswtstatus(result.data.isActive)
            })
        setrowId(rowData.parameterMapId)
        setSelectedRow(rowData);
        setreadonly(true);
    }
    /* Table Sorting */
    const Sorting = (column: any) => {
        if (order === "ASC") {
            const sorted = [...PerfomanceMappingData].sort((a: any, b: any) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );
            setPerfomanceMappingData(sorted);
            setorder('DSC')
        }
        if (order === "DSC") {
            const sorted = [...PerfomanceMappingData].sort((a: any, b: any) =>
                a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
            );
            setPerfomanceMappingData(sorted);
            setorder('ASC')
        }
    }
    /* End */
    /* Table Functionality End*/

    /* Page Reset */
    const onReset = () => {
        if (rowId !== undefined) {
            setrowId(0)
            setreadonly(false);
            setswtstatus(true);
            setSelectedRow(undefined)
            setEmpGrpIdValue({ value: '', label: '' })
            setEmpSubGrpIdValue({ value: '', label: '' })
            formik.resetForm()
            setChecked(false);
            setSelectedParameterData([]);
        }
    }
    /* End */

    return (
        <>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Performance Mapping Master</h3>
            <div className="card">

                <div className='shadow-sm p-2 mb-5 bg-white rounded '>
                    <div className='container-fluid'>
                        <div className='row'>
                            {/* Heading Button Start */}
                            <div className='col-lg-12 col-md-12 col-sm-8'>
                                <div className="action1">
                                    <button type='reset' className='btn btn-link' style={{ color: '#0095e8' }} onClick={onReset}>
                                        <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />New</button>

                                    <button type='submit' className='btn btn-link' style={{ color: '#0095e8' }} form='form'>
                                        <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />Save</button>

                                    <button type='button' className='btn btn-link' style={{ color: '#0095e8' }} >
                                        <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />Delete</button>
                                </div>
                            </div>
                            {/* Heading End */}



                            {/* Autocomplete Start */}
                            {/* <div className="col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1">
                                <div className="autocomplete-wrapper">
                                    <Autocomplete
                                        inputProps={{ placeholder: 'Search For UserName' }}
                                        value={stateValue}
                                        items={PerfomanceMappingData}
                                        getItemValue={(item) => (item.empGrpShortName + "-" + item.subGrpShortName + "-" + item.isActive)}
                                        shouldItemRender={(state, value) => state.empGrpShortName.toLowerCase().indexOf(value.toLowerCase()) !== -1}
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
                                                            <tr className="text-center">
                                                                <th>Employee Group</th>
                                                                <th>Employee Sub Group</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            :
                                                            null
                                                    }
                                                </thead>
                                                <tbody>
                                                    <tr key={item.userID}
                                                        onClick={() => handleRowClick(item)}
                                                        tabIndex={0}
                                                        className="text-center"
                                                    >
                                                        <td className='min-w-250px' >{item.empGrpShortName}</td>
                                                        <td className='min-w-250px' >{item.subGrpShortName}</td>
                                                        <td className='min-w-250px'>{item.isActive}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                        onChange={(event, val) => {

                                            setstateValue(val);
                                        }}
                                        onSelect={(event, val) => {

                                            get('UserMaster/GetAllRolesByUser?userid=' + val.parameterMapId)
                                                .then((result) => {
                                                    console.log(result);
                                                    document.getElementById('userName')?.focus();
                                                    formik.setFieldValue("userName", result.data.empGrpShortName)
                                                    formik.setFieldValue("password", result.data.subGrpShortName)
                                                    setswtstatus(result.data.isActive);
                                                    setright(true);
                                                    setSelectedParameterData(result.data.userRoleMap);
                                                })
                                            setSelectedRow(val);
                                            setrowId(val.parameterMapId)
                                        }}
                                    />
                                </div>
                            </div> */}
                            {/* Autocomplete End */}
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
                                                    <tr className='text-muted text-bolder text-center'>

                                                        <th className='min-w-150px text-white' onClick={() => Sorting("empGrpShortName")} >Employee Group
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("subGrpShortName")}>Emplopyee Sub Group
                                                            <img
                                                                alt='sort'
                                                                src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                className='ms-1'
                                                                height={13}
                                                                width={13}
                                                            />
                                                        </th>
                                                        <th className='min-w-150px text-white' onClick={() => Sorting("isActive")}>Status
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
                                                    {PerfomanceMappingData.map((rowData: any) => (
                                                        <tr key={rowData.userID}
                                                            onClick={() => handleRowClick(rowData)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedRow && selectedRow.parameterMapId === rowData.parameterMapId
                                                                        ? ' #BAD9FB'
                                                                        : 'white',
                                                                cursor: 'pointer',
                                                                width: 100
                                                            }}
                                                            className=" text-center">

                                                            <td>
                                                                {rowData.empGrpShortName}
                                                            </td>
                                                            <td>
                                                                {rowData.subGrpShortName}
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
                                        {({ errors, touched, isSubmitting
                                        }) =>
                                        (
                                            <Form id='form' autoComplete="off">
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="card-title"><h4>Performance Mapping</h4></div>
                                                        <div className="col-lg-12 col-md-12 col-sm-6">
                                                            <div className="row">
                                                                <div className="col-lg-4 col-md-5 Name">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Employee Group</label>
                                                                        <Select
                                                                            name="EmpGrpIdValue"
                                                                            placeholder="Select"
                                                                            options={EmpGrpIdOptions}
                                                                            value={EmpGrpIdValue}
                                                                            onChange={(o) => setEmpGrpIdValue(o)}
                                                                            components={{
                                                                                IndicatorSeparator: () => null
                                                                            }}

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


                                                                    </div >
                                                                </div>

                                                                <div className="col-lg-4 col-md-5">
                                                                    <div className="p-1">
                                                                        <label className="form-label">Employee Sub Group</label>
                                                                        <Select
                                                                            name="EmpSubGrpIdValue"
                                                                            placeholder="Select"
                                                                            options={EmpSubGrpIdOptions}
                                                                            value={EmpSubGrpIdValue}
                                                                            onChange={(o) => setEmpSubGrpIdValue(o)}
                                                                            components={{
                                                                                IndicatorSeparator: () => null
                                                                            }}
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


                                                                    </div >
                                                                </div>

                                                                <div className="col-lg-2 col-md-2">
                                                                    <div className="pt-4">
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
                                                            <div className="card shadow-sm mt-5 p-2 mb-5 bg-white rounded" style={{ height: 200 }}>
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <table className="table table-striped align-middle gs-0 gy-2">
                                                                            <div style={{ height: 180, overflowY: "scroll", }}>
                                                                                <thead className="" style={{ background: '#0095e8', position: 'sticky', top: 0 }}>
                                                                                    <tr className="text-bolder text-muted text-center">
                                                                                        <th className="w-25px">
                                                                                            <div className="form-check form-check-sm form-check-custom form-check-success ms-2 pt-1">
                                                                                                <input
                                                                                                    className="form-check-input"
                                                                                                    type="checkbox"
                                                                                                    value="1"
                                                                                                    data-kt-check="true"
                                                                                                    data-kt-check-target=".widget-9-check"
                                                                                                    checked={checked}
                                                                                                    onChange={handleSelectAll}
                                                                                                    id="selectallcheck"

                                                                                                />
                                                                                            </div>
                                                                                        </th>
                                                                                        <th className="min-w-100px text-white">
                                                                                            Parameter Name
                                                                                        </th>

                                                                                        <th className="min-w-100px text-white">
                                                                                            Display Order
                                                                                        </th>
                                                                                        <th className="min-w-100px text-white">
                                                                                            Weightage
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {PerfParameterData.map((rowData: any, index: any) => (
                                                                                        <tr
                                                                                            key={index}
                                                                                            // onClick={() => handleRowClickFormRoles(rowData)}
                                                                                            style={{
                                                                                                backgroundColor: selectedRow && selectedRow.paramId === rowData.paramId ? '#BAD9FB' : 'white',
                                                                                                cursor: 'pointer',
                                                                                                width: 100,
                                                                                            }}
                                                                                            className="text-center"
                                                                                        >
                                                                                            <td>
                                                                                                <div className="form-check form-check-sm form-check-custom form-check-solid ms-2">
                                                                                                    <input
                                                                                                        className="form-check-input widget-9-check" type="checkbox"
                                                                                                        checked={SelectedParameterData && rowData && SelectedParameterData.some((row) => row.paramId === rowData.paramId)}
                                                                                                        onClick={(event) => handleCheckbox(event, rowData)}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td >{rowData.parameterName}</td>
                                                                                            <td>{rowData.displayOrder}</td>
                                                                                            <td><input placeholder="Weightage" name="weightage" value={30} className="form-control form-control-sm" /></td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </div>
                                                                        </table>
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
/* User Role Functionality End */
export default PerformanceMapping;
