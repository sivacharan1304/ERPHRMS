/* Import Statement */
import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import '../Qs_css/Autocomplete.css'
import { Delete, get, post, put } from '../Service/Services'
import Autocomplete from 'react-autocomplete'
import Select from 'react-select'
import dayjs from 'dayjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SessionManager from '../../modules/auth/components/Session'
import { columnsStateInitializer } from '@mui/x-data-grid/internals'
import { number } from 'yup'

/* Array Initialization */
interface IData {
	id: number
	pensionCode: string
	pensionType: string
	employerPercentage: number
	detailsEmployerPercentage: number
	empPercentage: number
	pensionId: number
	fromYear: number
	toYear: number
	salaryType: string
	isActive: boolean
	sno: number
}

/* Company Currency Functionality Start */

const PensionMaster = () => {
	const [selectedRow, setSelectedRow] = useState<IData>()
	const [Data, setData] = useState([])
	const [rowId, setrowId] = useState(0)
	const [order, setorder] = useState('DSC')
	const [stateValue, setstateValue] = useState('')
	const [swtstatus, setswtstatus] = useState(true)
	const [readonly, setreadonly] = useState(false)
	const [errmsg, seterrmsg] = useState('')
	const prevCountRef = useRef<string>('')
	const inputRef = useRef<HTMLInputElement>(null)

	const [yearfromoption, setyearfromoption] = useState([])
	const [selectyearfrom, setselectyearfrom] = useState<any>({ value: '', label: '' })

	const [yeartooption, setyeartooption] = useState([])
	const [selectyearto, setselectyearto] = useState<any>({ value: '', label: '' })
	const [pensionidoption, setpensionideoption] = useState([])
	const [selectpensionid, setselectpensionid] = useState({ value: 0, label: '' })
	const [salarytypeoption, setsalarytypeoption] = useState([])
	const [selectsalarytypeoption, setselectsalarytypeoption] = useState({ value: 0, label: '' })
	const [EmpDocData, setEmpDocData] = useState<any>([])
	const [EmpDocDataCopy, setEmpDocDataCopy] = useState<any>([])
	const [tableVisible, setTableVisible] = useState<any>([])
	const [data2, setdata2] = useState<any>([])
	const [rowToUpdate, setRowToUpdate] = useState(-1)
	const [rowData, setRowData] = useState({})
	const [detailid, setdetailid] = useState(0);

	const [salarytype] = useState([
		{
			label: 'Basic Pay',
			value: 1,
		},
		{
			label: 'Gross Pay',
			value: 2,
		},
	])

	/* Initial Page Load Function */
	const filllist = () => {
	

		get('PensionMaster/GetAllPensionMaster').then((result) => {
			var i = 1
			let data1: any = []
			result.data.map((obj: IData) => {
				data1.push({
					sno: i,
					id: obj.id,
					pensionCode: obj.pensionCode,
					pensionType: obj.pensionType,
					employerPercentage: obj.employerPercentage,
					empPercentage: obj.empPercentage,
					detailsEmployerPercentage: obj.detailsEmployerPercentage,
					pensionId: obj.pensionId,
					fromYear: obj.fromYear,
					toYear: obj.toYear,
					salaryType: obj.salaryType,
					isActive: obj.isActive ? 'Active' : 'In Active',
				})
				i = i + 1
			})
			console.log(data1)
			setData(data1)
		})
	}

	/* Rendering Errors End*/

	/* Form Validation Start*/

	const validate = () => {
		let valid = true

		if (
			formik.values.pensionCode === '' &&
			formik.values.pensionType === '' &&
			selectyearfrom.value === 0 &&
			selectyearto.value === 0 &&
			selectsalarytypeoption.value === 0 &&
			formik.values.detailsEmployerPercentage == '' &&
			formik.values.employerPercentage == '' &&
			formik.values.empPercentage == ''
		) {
			toast.error('Invalid Details. Please Check Required Fields....')
			return false
		}
		if (formik.values.pensionCode === '') {
			toast.error('Please Select Pension Code')
			return false
		}
		if (formik.values.pensionType === '') {
			toast.error('Please Select Pension Type')
			return false
		}
		if (selectyearfrom.value === 0) {
			toast.error('Please Select Year From')
			return false
		}
		if (selectyearto.value === 0) {
			toast.error('please Enter Year To')
			return false
		}
		if (selectsalarytypeoption.value === 0) {
			toast.error('please Enter Salary Type')
			return false
		}
		if (formik.values.detailsEmployerPercentage == '') {
			toast.error('PensionDetails Employer Percentage')
			return false
		}
		if (formik.values.employerPercentage == '') {
			toast.error('please Enter Pension Employer Percentage')
			return false
		}
		if (formik.values.empPercentage == '') {
			toast.error('please Enter Pension Employee Percentage')
			return false
		}
		return valid
	}
	/* Form Validation End*/
	/* Formik Library Start */
	const formik = useFormik({
		initialValues: {
			id: 0,
			pensionCode: '',
			pensionType: '',
			employerPercentage: '55',
			empPercentage: '',
			detailsEmployerPercentage: '',
			pensionId: 0,
			fromYear: '',
			toYear: '',
			salaryType: '',
			isActive: true,
		},
		onSubmit: (values) => {
			if (rowId === 0) {
				const insertData = {
					pensionCode: formik.values.pensionCode,
					pensionType: formik.values.pensionType,
					employerPercentage: Number(formik.values.employerPercentage),
					empPercentage: Number(formik.values.empPercentage),
					isActive: formik.values.isActive,
					pensionMasterDetails: data2,
				}
				
				post('PensionMaster/AddPensionMaster', insertData).then((result) => {
					filllist()
					if (result.data.status === 'F') {
						toast.warning(result.data.statusmessage)
					} else if (result.data.status === 'S') {
						toast.success(result.data.statusmessage)
						onReset()
					}
					alert("ok")

				})
			} else {
				const updatedata = {
					pemsionMaster: {
						id: rowId,
						pensionCode: formik.values.pensionCode,
						pensionType: formik.values.pensionType,
						employerPercentage: Number(formik.values.employerPercentage),
						empPercentage: Number(formik.values.empPercentage),
						isActive: formik.values.isActive,
						pensionMasterDetails: data2,
					},
				}

				console.log(data2)

				put('PensionMaster/UpdatePensionMaster', updatedata).then((result) => {
					console.log(updatedata)
					filllist()
					toast.success(result.data.statusmessage)
					console.log(result.data.statusmessage)
					onReset()
					alert('update')
				})
			}
		},
	})




	const pensionOnsave = () => {
		
		if (detailid === 0) {
			const InsertData = {
				
				id: data2.length + 1,
				pensionId: formik.values.pensionId,
				salarytype: selectsalarytypeoption.label,
				isActive: formik.values.isActive,
				fromYear: Number(formik.values.fromYear),
				toYear: Number(formik.values.toYear),
				employerPercentage: Number(formik.values.employerPercentage),
				createdBy: SessionManager.getUserID(),
				createdDate: dayjs()
			}
			console.log(InsertData);
			setdata2([...data2, InsertData])
			setselectsalarytypeoption({ value: 0, label: '' })
			setTableVisible(data2)
			onReset()
			console.log(detailid)
            setdetailid(InsertData.id)
		} else {

			const UpdateData = {
				
				id: detailid,
				pensionId: formik.values.pensionId,
				salarytype: selectsalarytypeoption.label,
				isActive: formik.values.isActive,
				fromYear: Number(formik.values.fromYear),
			     toYear: Number(formik.values.toYear),     
				employerPercentage: Number(formik.values.employerPercentage),
				modifiedBy: SessionManager.getUserID(),
				modifiedDate: dayjs()

			}


			console.log(UpdateData);
          
			// setdata2(
			// 	data2.map((record: any) => {
			// 		if (record.id !== UpdateData.id) {
			// 			return record
			// 		}
			// 		else {
			// 			return UpdateData
			// 		}
			// 	}))
			setselectsalarytypeoption({ value: 0, label: '' })
setdata2([...data2, UpdateData])
			setTableVisible(data2)
			onReset()
			console.log(data2)
		}


	}
   
    
	const handleDelete = (index: any) => {
		const updatedData = [...data2]
		updatedData.splice(index, 1)
		setdata2(updatedData)
        setTableVisible(data2)
	}

    
    

	const handleRowClick = (rowData: IData) => {
		get('PensionMaster/GetPensionDetailsById?Id=' + rowData.pensionId).then((result) => {
			formik.setFieldValue('pensionCode', result.data.pensionCode)
			formik.setFieldValue('pensionType', result.data.pensionType)
			formik.setFieldValue('employerPercentage', result.data.employerPercentage)
			formik.setFieldValue('empPercentage', result.data.empPercentage)
			formik.values.isActive = result.data.isActive
			setswtstatus(result.data.isActive)
			setdata2(result.data.pensionMasterDetails)
			console.log(result.data.pensionMasterDetails)

			setTableVisible(data2)
			console.log(data2)
		})

		setSelectedRow(rowData)
		setrowId(rowData.id)
	}

	const handleRowClickedit = (val: any) => {


		formik.setFieldValue('fromYear', val.fromYear)
		formik.setFieldValue('toYear', val.toYear)
		formik.setFieldValue('detailsEmployerPercentage', val.employerPercentage)
		formik.setFieldValue('fromYear', val.fromYear)
		formik.setFieldValue('toYear', val.toYear)
		setselectsalarytypeoption({
			value: val.salaryType === 'Basic Pay' ? 1 : 2,

			label: val.salaryType,
		})


		setSelectedRow(val)
		setdata2((data2: any) => data2)
        setTableVisible(data2);
		setrowId(val.sno)
		setdetailid(val.id)

		
	}



	

	const Sorting = (column: any) => {
		if (order === 'ASC') {
			const sorted = [...Data].sort((a: any, b: any) =>
				a[column].toString().toLowerCase() > b[column].toLowerCase() ? 1 : -1
			)
			setData(sorted)
			setorder('DSC')
		}
		if (order === 'DSC') {
			const sorted = [...Data].sort((a: any, b: any) =>
				a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
			)
			setData(sorted)
			setorder('ASC')
		}
	}

	/* Table Sorting End */
	/* Table Functionality End */


	const onReset = () => {
		if (rowId !== undefined) {
			setrowId(0)
            setdetailid(0)
			formik.resetForm()
			setselectpensionid({ value: 0, label: '' })
			setselectyearfrom({ value: 0, label: '' })
			setselectyearto({ value: 0, label: '' })
			setselectsalarytypeoption({ value: 0, label: '' })
			setreadonly(false)
			setswtstatus(true)
			setSelectedRow(undefined)

			seterrmsg('')
		}
	}
	const handleRowKeyDown = (event: React.KeyboardEvent, item: IData) => {
		if (event.keyCode === 13 || event.key === 'Enter') {
			setSelectedRow(item)
		}
	}

	/* Page Reset End */

	useEffect(() => {
		prevCountRef.current = errmsg
		if (inputRef.current) {
			inputRef.current.focus()
		}
		console.log(data2)

		filllist()
	}, [errmsg])

	return (
		<>
            <ToastContainer autoClose={2000}></ToastContainer>
            <h3>Pension Master</h3>
            <div className='card'>
                <div className='card-body'>
                    <div className='shadow-sm p-2 mb-5 bg-white rounded'>
                        <div className='container-fluid'>
                            <div className='row'>
                                {/*  Heading Button Start */}
                                <div className='col-lg-12 col-md-12 col-sm-8'>
                                    <div className='action1'>
                                        <button
                                            type='reset'
                                            form='form'
                                            className='btn btn-link'
                                            style={{ color: '#0095e8' }}
                                            onClick={onReset}
                                        >
                                            <KTIcon iconName='plus' style={{ fontSize: 18, color: '#0095e8' }} />
                                            New
                                        </button>

                                        <button
                                            type='submit'
                                            className='btn btn-link'
                                            style={{ color: '#0095e8' }}
                                            form='form'
                                        >
                                            <KTIcon iconName='save-2' style={{ fontSize: 16, color: '#0095e8' }} />
                                            Save
                                        </button>

                                        <button type='button' className='btn btn-link' style={{ color: '#0095e8' }}>
                                            <KTIcon iconName='trash' style={{ fontSize: 15, color: '#0095e8' }} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {/*  Heading End  */}

                                {/*  Autocomplete Start  */}
                                <div className='col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1'>
                                    <div className='autocomplete-wrapper'>
                                        <Autocomplete
                                            inputProps={{ placeholder: 'Search pensionCode' }}
                                            value={stateValue}
                                            items={Data}
                                            getItemValue={(item) =>
                                                item.pensionId +
                                                '_' +
                                                item.pensionCode +
                                                '-' +
                                                item.pensionType +
                                                '-' +
                                                item.employerPercentage +
                                                '-' +
                                                item.detailsEmployerPercentage +
                                                '-' +
                                                item.empPercentage +
                                                '-' +
                                                item.fromYear +
                                                '-' +
                                                item.toYear +
                                                '-' +
                                                item.salaryType +
                                                '-' +
                                                item.isActive
                                            }
                                            shouldItemRender={(state, value) => state.pensionId}
                                            renderMenu={(item) => (
                                                <div
                                                    className='dropdown cd position-absolute'
                                                    style={{ zIndex: 12, color: 'black', background: 'white' }}
                                                >
                                                    {' '}
                                                    {item}
                                                </div>
                                            )}
                                            renderItem={(item, isHighlighted) => (
                                                <table className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                                    <thead style={{ background: '#0095e8', color: 'white' }}>
                                                        {item.sno === 1 ? (
                                                            <tr>
                                                                <th>Pension Code</th>
                                                                <th>pensionType</th>
                                                                <th> Status</th>
                                                            </tr>
                                                        ) : null}
                                                    </thead>
                                                    <tbody>
                                                        <tr
                                                            key={item.id}
                                                            onClick={() => handleRowClick(item)}
                                                            onKeyDown={(event) => handleRowKeyDown(event, item)}
                                                            tabIndex={0}
                                                        >
                                                            <td className='min-w-250px'>{item.pensionCode}</td>
                                                            <td className='min-w-250px'>{item.pensionType}</td>
                                                            <td className='min-w-250px'>{item.isActive}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}
                                            /* Binding The Values Tab Control Columns In The Fields */
                                            onChange={(event, val) => {
                                                setstateValue(val)
                                            }}
                                            onSelect={(e, val) => {
                                                console.log('value', val)
                                                get('PensionMaster/GetPensionMasterById?Id=' + val.pensionId).then(
                                                    (result) => {
                                                        formik.setFieldValue('pensionCode', result.data.pensionCode)
                                                        formik.setFieldValue('pensionType', result.data.pensionType)
                                                        formik.setFieldValue(
                                                            'employerPercentage',
                                                            result.data.employerPercentage
                                                        )
                                                        formik.setFieldValue('empPercentage', result.data.empPercentage)
                                                        formik.values.isActive = result.data.isActive
                                                        setswtstatus(result.data.isActive)
                                                        setdata2(result.data.pensionMasterDetails)
                                                    }
                                                )
                                                setSelectedRow(val)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-4 col-md-12 col-sm-12'>
                                <div className='card' style={{ height: 390 }}>
                                    <div className='card-body shadow-sm p-2 mb-5 bg-white rounded '>
                                        <div className='table-responsive'>
                                            <div style={{ height: 300, overflowY: 'scroll' }}>
                                                <table
                                                    id='dtVerticalScrollExample'
                                                    className='table table-striped align-middle gs-1'
                                                >
                                                    <thead
                                                        className='w-120'
                                                        style={{ background: '#0095e8', position: 'sticky', top: 0 }}
                                                    >
                                                        <tr className='text-muted text-bolder'>
                                                            <th
                                                                className='min-w-100px text-white'
                                                                onClick={() => Sorting('stateCode')}
                                                            >
                                                                Pension Code
                                                                <img
                                                                    alt='sort'
                                                                    src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                    className='ms-1'
                                                                    height={13}
                                                                    width={13}
                                                                />
                                                            </th>
                                                            <th
                                                                className='min-w-150px text-white'
                                                                onClick={() => Sorting('stateName')}
                                                            >
                                                                Pension Type
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
                                                            <tr
                                                                key={rowData.pensionId}
                                                                onClick={() => handleRowClick(rowData)}
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedRow && selectedRow.id === rowData.id
                                                                            ? '#BAD9FB'
                                                                            : 'white',
                                                                    cursor: 'pointer',
                                                                    width: 100,
                                                                }}
                                                            >
                                                                <td>{rowData.pensionCode}</td>
                                                                <td>{rowData.pensionType}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-lg-8 col-md-12'>
                                <div className='card '>
                                    <div className='card-body'>
                                        <Formik
                                            initialValues={formik.initialValues}
                                            onSubmit={() => formik.handleSubmit()}
                                        >
                                            {({ errors, touched, isSubmitting }) => (
                                                <Form id='form'>
                                                    <div className='container'>
                                                        <div className='row'>
                                                            <div className='card-title'>
                                                                <h4>Pension Master</h4>
                                                            </div>
                                                            <div className='col-lg-12 col-md-12 col-sm-6'>
                                                                <div className='row'>
                                                                    <div className=' col-lg-3 col-md-2 Pension-code'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                Pension Code
                                                                            </label>
                                                                            <Field
                                                                                maxlength='10'
                                                                                autoFocus
                                                                                id='pensionCode'
                                                                                autoComplete='off'
                                                                                readOnly={readonly}
                                                                                name='pensionCode'
                                                                                className='form-control form-control-sm'
                                                                                onChange={formik.handleChange}
                                                                                value={formik.values.pensionCode}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-md-4'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                Pension Type
                                                                            </label>
                                                                            <Field
                                                                                maxlength='40'
                                                                                autoFocus
                                                                                id='pensionType'
                                                                                autoComplete='off'
                                                                                readOnly={readonly}
                                                                                name='pensionType'
                                                                                className='form-control form-control-sm'
                                                                                onChange={formik.handleChange}
                                                                                value={formik.values.pensionType}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-md-3 Emp-percentage'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                Employee Percentage
                                                                            </label>
                                                                            <div className='col-lg-5 col-md-5'>
                                                                                <Field
                                                                                    maxlength='5'
                                                                                    autoFocus
                                                                                    id='empPercentage'
                                                                                    autoComplete='off'
                                                                                    readOnly={readonly}
                                                                                    name='empPercentage'
                                                                                    className='form-control form-control-sm'
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.empPercentage}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='card-title'>
                                                                    <h4>Pension Master Details</h4>
                                                                </div>

                                                                <div className='row '>
                                                                    <div className='col-lg-2 col-md-2 from year '>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                From Year
                                                                            </label>
                                                                            <div className=''>
                                                                                <input
                                                                                    maxLength={5}
                                                                                    autoFocus
                                                                                    id='fromYear'
                                                                                    autoComplete='off'
                                                                                    
                                                                                    name='fromYear'
                                                                                    className='form-control form-control-sm'
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.fromYear}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-2 col-md-2 To-year'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                To Year
                                                                            </label>
                                                                            <input
                                                                                maxLength={5}
                                                                                autoFocus
                                                                                id='toYear'
                                                                                autoComplete='off'
                                                                                readOnly={readonly}
                                                                                name='toYear'
                                                                                className='form-control form-control-sm'
                                                                                onChange={formik.handleChange}
                                                                                value={formik.values.toYear}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-3 col-md-3 Salary-type'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                Salary Type
                                                                            </label>
                                                                            <Select
                                                                                name='salaryType'
                                                                                id='salaryType'
                                                                                options={salarytype}
                                                                                value={selectsalarytypeoption}
                                                                                onChange={(o: any) => {
                                                                                    setselectsalarytypeoption(o)
                                                                                    console.log(o)
                                                                                }}
                                                                                placeholder='Select'
                                                                                isDisabled={readonly}
                                                                                components={{
                                                                                    IndicatorSeparator: () => null,
                                                                                }}
                                                                                styles={{
                                                                                    menu: (base) => ({
                                                                                        ...base,
                                                                                        width: 'max-content',
                                                                                        minWidth: '150px',
                                                                                    }),
                                                                                    control: (baseStyles, state) => ({
                                                                                        ...baseStyles,
                                                                                        borderColor: '#E1E3EA',
                                                                                        borderRadius: '0.425rem',
                                                                                        height: 10,

                                                                                        fontSize: '15px! important',
                                                                                        boxShadow: state.isFocused
                                                                                            ? ' 0 0 0 0.25rem rgba(0, 123, 255, 0.25)'
                                                                                            : '#E1E3EA',
                                                                                        minHeight: state.isFocused
                                                                                            ? '31px !important'
                                                                                            : '31px !important',
                                                                                        padding: state.isFocused
                                                                                            ? '0 8px !important'
                                                                                            : '0 8px !important',

                                                                                        '&:hover': {
                                                                                            border: 'E1E3EA',
                                                                                        },
                                                                                    }),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-3 col-md-3 Emp-percentage'>
                                                                        <div className='p-1'>
                                                                            <label className='form-label' htmlFor='name'>
                                                                                Employer Percentage
                                                                            </label>
                                                                            <div className='col-lg-5 col-md-5'>
                                                                                <input
                                                                                    maxLength={5}
                                                                                    autoFocus
                                                                                    id='detailsEmployerPercentage'
                                                                                    autoComplete='off'
                                                                                    readOnly={readonly}
                                                                                    name='detailsEmployerPercentage'
                                                                                    className='form-control form-control-sm'
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.detailsEmployerPercentage}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-2 col-md-2'>
                                                                        <div className='mt-10'>
                                                                    {detailid===0?
                                                                            <a
                                                                                href='#'
                                                                                className='btn btn-sm btn-light-primary ' onClick={pensionOnsave}
                                                                            >
                                                                            Add
                                                                            </a>:
                                                                             <a
                                                                                href='#'
                                                                                className='btn btn-sm btn-light-primary '  onClick={pensionOnsave}
                                                                            >
                                                                            Update
                                                                            </a>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='row'>
                                                                    <div className='card-body shadow-sm p-2 bg-white rounded mb-5  mt-4'>
                                                                        <div className='table-responsive'>
                                                                            <div style={{ height: 157, overflowY: 'scroll' }}>
                                                                                {/* begin::Table */}
                                                                                <table className='table table-striped align-middle gy-2'>
                                                                                    {/* begin::Table head */}
                                                                                    <thead
                                                                                        className=''
                                                                                        style={{ background: '#0095e8', position: 'sticky', top: 0 }}
                                                                                    >
                                                                                        <tr className='text-bolder text-muted text-center'>
                                                                                            <th className='min-w-150px text-white'>
                                                                                                From Year
                                                                                                <a href=''>
                                                                                                    <img
                                                                                                        alt='sort'
                                                                                                        src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                                                        className='ms-1'
                                                                                                        height={13}
                                                                                                        width={13}
                                                                                                    />
                                                                                                </a>
                                                                                            </th>
                                                                                            <th className='min-w-150px text-white'>
                                                                                                To Year
                                                                                                <a href=''>
                                                                                                    <img
                                                                                                        alt='sort'
                                                                                                        src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                                                        className='ms-1'
                                                                                                        height={13}
                                                                                                        width={13}
                                                                                                    />
                                                                                                </a>
                                                                                            </th>
                                                                                            <th className='min-w-200px text-white'>
                                                                                                Employer Percentage
                                                                                                <a href=''>
                                                                                                    <img
                                                                                                        alt='sort'
                                                                                                        src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                                                        className='ms-1'
                                                                                                        height={13}
                                                                                                        width={13}
                                                                                                    />
                                                                                                </a>
                                                                                            </th>
                                                                                            <th className='min-w-150px text-white'>
                                                                                                Salary Type
                                                                                                <a href=''>
                                                                                                    <img
                                                                                                        alt='sort'
                                                                                                        src={toAbsoluteUrl('/media/logos/sort.png')}
                                                                                                        className='ms-1'
                                                                                                        height={13}
                                                                                                        width={13}
                                                                                                    />
                                                                                                </a>
                                                                                            </th>
                                                                                            {/* <th className='min-w-120px text-white'>Status</th> */}
                                                                                            <th className='min-w-150px text-white'>Action</th>
                                                                                        </tr>
                                                                                    </thead>

                                                                                    <tbody>
                                                                                        {data2.map((a:any,i:any) => (
                                                                                            <tr className='text-center' key={a.id}>
                                                                                                <td>{a.fromYear}</td>
                                                                                                <td>{a.toYear}</td>
                                                                                                <td>{a.detailsEmployerPercentage}5</td>
                                                                                                <td>{a.salaryType}</td>

                                                                                                <td>
                                                                                                    <button
                                                                                                        type='button'
                                                                                                        className='btn btn-link'
                                                                                                        style={{ color: '#0095e8' }}
                                                                                                        onClick={()=>handleRowClickedit(a)}
                                                                                                    >
                                                                                                        <KTIcon
                                                                                                            iconName='pencil'
                                                                                                            style={{ fontSize: 20, color: '#0095e8' }}
                                                                                                        />
                                                                                                    </button>

                                                                                                    <button
                                                                                                        type='button'
                                                                                                        className='btn btn-link'
                                                                                                        style={{ color: '#0095e8' }}
                                                                                                        onClick={() => handleDelete}
                                                                                                    >
                                                                                                        <KTIcon
                                                                                                            iconName='trash'
                                                                                                            style={{ fontSize: 20, color: '#0095e8' }}
                                                                                                        />
                                                                                                    </button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
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
            </div>
        </>
	)
}
/* PensionMasterDetail Functionality End */
export default PensionMaster