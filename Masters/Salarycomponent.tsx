/* Import Statement */
import React, {useEffect, useState, useRef} from 'react'
import {Formik, Form, Field, ErrorMessage, useFormik} from 'formik'
import {KTIcon, toAbsoluteUrl} from '../../../_metronic/helpers'
import Autocomplete from 'react-autocomplete'
import Select, {components} from 'react-select'
import '..//Qs_css//Autocomplete.css'
import dayjs from 'dayjs'
import {Delete, get, post, put} from '../Service/Services'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* Array Initialization */
interface IData {
	id: number
	componentName: string
	componentShortCode: string
	calculationAmount: string
	order: number
	credit: number
	debit: number
	allowance: number
	calculationType: string
	showInEmployee: boolean
	showInPayRoll: boolean
	isProrat: boolean
	isTaxable: boolean
	isActive: boolean
}
/* Company Function Start */
const Salarycomponent = () => {
	/* Const Variable Initialization */
	const [selectedRow, setSelectedRow] = useState<IData>()
	const [Calculationtype, setCalculationtype] = useState<any>({value: '', label: ''})
	const [Data, setData] = useState([])
	const [rowId, setrowId] = useState(0)
	const [stateValue, setstateValue] = useState('')
	const [order, setorder] = useState('DSC')
	const [swtShowInEmployee, setswtShowInEmployee] = useState(true)
	const [swtShowInPayRoll, setswtShowInPayRoll] = useState(true)
	const [swtProrat, setswtProrat] = useState(true)
	const [swtTaxable, setswtTaxable] = useState(true)
	const [swtstatus, setswtstatus] = useState(true)
	const [readonly, setreadonly] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const INITIAL_COUNT = ''
	const [errmsg, seterrmsg] = useState(INITIAL_COUNT)
	const prevCountRef = useRef<string>(INITIAL_COUNT)
	const [options, setoptions] = useState([])
	const [selectedOption, setSelectedOption] = useState({value: 0, label: ''})

	const [calculation] = useState([
		{
			label: 'Flat',
			value: 1,
		},
		{
			label: 'Percentage',
			value: 2,
		},
	])

	/* Initial Page Load Function */
	const filllist = () => {
		get('SalaryComponent/GetAllSalaryComponent').then((result) => {
			var i = 1

			let data1: any = []
			result.data.map((obj: IData) => {
				data1.push({
					sno: i,
					id: obj.id,
					componentName: obj.componentName,
					componentShortCode: obj.componentShortCode,
					calculationAmount: formik.values.calculationAmount,
					order: formik.values.order,
					debit: formik.values.debit,
					credit: formik.values.credit,
					allowance: formik.values.allowance,
					calculationType: obj.calculationType,
					showInEmployee: obj.showInEmployee ? 'Active' : 'In Active',
					showInPayRoll: obj.showInPayRoll ? 'Active' : 'In Active',
					isProrat: obj.isProrat ? 'Active' : 'In Active',
					isTaxable: obj.isTaxable ? 'Active' : 'In Active',
					isActive: obj.isActive ? 'Active' : 'In Active',
				})
				i = i + 1
			})
			console.log(data1);
			
			setData(data1)
		})
	}

	useEffect(() => {
		prevCountRef.current = errmsg
		if (inputRef.current) {
			inputRef.current.focus()
		}

		filllist()
	}, [errmsg])
	/* Form Validation */
	const validate = () => {
		let valid = true
		if (
			formik.values.componentName == '' &&
			formik.values.componentShortCode == '' &&
			formik.values.calculationAmount == '' &&
			formik.values.order == 0 &&
			formik.values.debit == 0 &&
			formik.values.credit == 0 &&
			formik.values.allowance == 0 &&
			selectedOption.value == 0
		) {
			toast.error('Invalid Details. Please Check Required Field....')
			return false
		}
		if (formik.values.componentName == '') {
			toast.error('Please Enter componentName ')
			return false
		}
		if (formik.values.componentShortCode == '') {
			toast.error('Please Enter componentShortCode ')
			return false
		}
		if (formik.values.order == 0) {
			toast.error('Please Enter order ')
			return false
		}
		if (formik.values.debit == 0) {
			toast.error('Please Enter order ')
			return false
		}
		if (formik.values.credit == 0) {
			toast.error('Please Enter order ')
			return false
		}
		if (formik.values.allowance == 0) {
			toast.error('Please Enter order ')
			return false
		}
		if (formik.values.calculationAmount == '') {
			toast.error('Please Enter calculationAmount ')
			return false
		}
		if (selectedOption.value == 0) {
			toast.error('Please Enter calculationType')
			return false
		}

		return valid
	}
	/* Formik Library Start*/
	const formik = useFormik({
		initialValues: {
			componentName: '',
			componentShortCode: '',
			calculationAmount: '',
			order: 0,
			debit: 0,
			credit: 0,
			allowance: 0,
			calculationType: '',
			showInEmployee: true,
			showInPayRoll: true,
			isProrat: true,
			isTaxable: true,
			isActive: true,
		},
		/*  Insert Functionality */
		onSubmit: (values, {resetForm}) => {
			const InsertData = {
				componentName: formik.values.componentName,
				componentShortCode: formik.values.componentShortCode,
				calculationAmount: formik.values.calculationAmount,
				order: formik.values.order,
				debit: formik.values.debit,
				credit: formik.values.credit,
				allowance: formik.values.allowance,
				calculationType: selectedOption.label,
				showInEmployee: values.showInEmployee,
				showInPayRoll: values.showInPayRoll,
				isProrat: values.isProrat,
				isTaxable: values.isTaxable,
				isActive: values.isActive,
				//createdBy:SessionManager.getUserID(),
				createdDate: dayjs(),
			}

			if (validate() === true) {
				if (rowId === 0) {
					post('SalaryComponent/AddSalaryComponent', InsertData).then((result) => {
						filllist()
						document.getElementById('componentName')?.focus()

						if (result.data.status == 'F') {
							toast.warning(result.data.statusmessage)
						} else if (result.data.status == 'S') {
							toast.success(result.data.statusmessage)
							onReset()
						}
					})
				} else {
					/*  Update Functionality */
					const updatedata = {
						id: rowId,
						componentName: formik.values.componentName,
						componentShortCode: formik.values.componentShortCode,
						calculationAmount: formik.values.calculationAmount,
						order: formik.values.order,

						debit: formik.values.debit,
						credit: formik.values.credit,
						allowance: formik.values.allowance,
						calculationType: selectedOption.label,
						showInEmployee: values.showInEmployee,
						showInPayRoll: values.showInPayRoll,
						isProrat: values.isProrat,
						isTaxable: values.isProrat,
						isActive: values.isActive,
						//modifiedBy:SessionManager.getUserID(),
						modifiedDate: dayjs(),
					}

					console.log(updatedata)

					put('SalaryComponent/UpdateSalaryComponent', updatedata).then((result) => {
						console.log(result)
						filllist()
						toast.success(result.data.statusmessage)
						document.getElementById('componentName')?.focus()
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
			setSelectedRow(item)
		}
	}

	/* Table Functionality Start*/
	/* Table Rowclick Event Handlers*/
	const handleRowClick = (rowData: IData) => {
		get('SalaryComponent/GetSalaryComponent?Id=' + rowData.id).then((result) => {
			formik.setFieldValue('id', result.data.id)
			formik.setFieldValue('componentName', result.data.componentName)
			formik.setFieldValue('order', result.data.order)
			formik.setFieldValue('debit', result.data.debit)
			formik.setFieldValue('credit', result.data.credit)
			formik.setFieldValue('allowance', result.data.allowance)
			formik.setFieldValue('calculationAmount', result.data.calculationAmount)
			formik.setFieldValue('componentShortCode', result.data.componentShortCode)
			setSelectedOption({
				value: result.data.calculationType,
				label: result.data.calculationType === 1 ? 'Flat' : 'Percentage',
			})
			setswtShowInEmployee(result.data.showInEmployee)
			setswtShowInPayRoll(result.data.showInPayRoll)
			setswtProrat(result.data.isProrat)
			setswtTaxable(result.data.isProrat)
			setswtstatus(result.data.isActive)
			document.getElementById('componentName')?.focus()
		})
		setSelectedRow(rowData)
		setrowId(rowData.id)
	}
	/* Table Sorting */
	const Sorting = (column: any) => {
		if (order === 'ASC') {
			const sorted = [...Data].sort((a: any, b: any) =>
				a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
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
	/*  End */

	/* Table Functionality End*/

	/* Page Reset */
	const onReset = () => {
		if (rowId !== undefined) {
			document.getElementById('componentName')?.focus()
			setrowId(0)
			setreadonly(false)
			setswtstatus(true)
			setswtShowInEmployee(true)
			setswtShowInPayRoll(true)
			setswtProrat(true)
			setswtTaxable(true)
			setSelectedOption({value: 0, label: ''})
			formik.resetForm()
			setSelectedRow(undefined)
			seterrmsg('')
		}
	}
	/* show&hide functionality for alert Div style */

	const divStyle = () => {
		return errmsg ? '' : 'none'
	}

	return (
		<>
			<div style={{display: divStyle()}}>{prevCountRef.current}</div>
			<ToastContainer autoClose={2000}></ToastContainer>
			<h3>Salary Component</h3>
			<div className='card'>
				<div className='shadow-sm p-2 mb-5 bg-white rounded'>
					<div className='container-fluid'>
						<div className='row'>
							{/*  Heading Button Start */}
							<div className='col-lg-12 col-md-12 col-sm-8 '>
								<div className='action1'>
									<button
										type='reset'
										form='form'
										className='btn btn-link'
										style={{color: '#0095e8'}}
										onClick={onReset}
									>
										<KTIcon iconName='plus' style={{fontSize: 18, color: '#0095e8'}} />
										New
									</button>

									<button
										type='submit'
										className='btn btn-link'
										style={{color: '#0095e8'}}
										form='form'
									>
										<KTIcon iconName='save-2' style={{fontSize: 16, color: '#0095e8'}} />
										Save
									</button>

									<button type='button' className='btn btn-link' style={{color: '#0095e8'}}>
										<KTIcon iconName='trash' style={{fontSize: 15, color: '#0095e8'}} />
										Delete
									</button>
								</div>
							</div>
							{/*  Heading End  */}
							{/*  Autocomplete Start  */}
							<div className='col-lg-2 col-md-3 col-sm-12 d-flex align-items-center position-relative my-1'>
								<div className='autocomplete-wrapper'>
									<Autocomplete
										inputProps={{placeholder: 'Search For Component Name'}}
										value={stateValue}
										items={Data}
										getItemValue={(item) =>
											item.componentName +
											'-' +
											item.componentShortCode +
											'-' +
											item.calculationAmount +
											'-' +
											item.order +
											'-' +
											item.debit +
											'-' +
											item.credit +
											'-' +
											item.allowance +
											'-' +
											item.calculationType +
											'-' +
											item.showInEmployee +
											'-' +
											item.showInPayRoll +
											'-' +
											item.isProrat +
											'-' +
											item.isTaxable +
											'-' +
											item.isActive
										}
										shouldItemRender={(state, value) =>
											state.componentName.toLowerCase().indexOf(value.toLowerCase()) !== -1
										}
										renderMenu={(item) => (
											<div
												className='dropdown cd position-absolute'
												style={{zIndex: 12, color: 'black', background: 'white'}}
											>
												{' '}
												{item}
											</div>
										)}
										renderItem={(item, isHighlighted) => (
											<table
												className={`item ${isHighlighted ? 'selected-item' : ''}`}
												style={{border: '1px'}}
											>
												<thead
													style={{
														background: '#0095e8',
														color: 'white',
														position: 'sticky',
														top: 0,
													}}
												>
													{item.sno === 1 ? (
														<tr>
															<th>componentName</th>
															<th>calculationType</th>
															<th>Status</th>
														</tr>
													) : null}
												</thead>
												<tbody>
													<tr
														key={item.id}
														onClick={() => item}
														onKeyDown={(event) => handleRowKeyDown(event, item)}
														tabIndex={0}
													>
														<td className='min-w-150px'>{item.componentName}</td>
														<td className='min-w-150px'>{item.calculationType}</td>
														<td className='min-w-150px'>{item.isActive}</td>
													</tr>
												</tbody>
											</table>
										)}
										onChange={(event, val) => {
											setstateValue(val)
										}}
										onSelect={(e, val) => {
											console.log('value', val)
											get('SalaryComponent/GetSalaryComponent?Id=' + val.id).then((result) => {
												document.getElementById('componentName')?.focus()

												//formik.setFieldValue('id', result.data.id)
												formik.setFieldValue('componentName', result.data.componentName)
												formik.setFieldValue('order', result.data.order)
												formik.setFieldValue('calculationAmount', result.data.calculationAmount)
												formik.setFieldValue('componentShortCode', result.data.componentShortCode)
												setSelectedOption({
													value: result.data.calculationType,
													label: result.data.calculationType === 1 ? 'Flat' : 'Percentage',
												})
												setswtShowInEmployee(result.data.showInEmployee)
												setswtShowInPayRoll(result.data.showInPayRoll)
												setswtProrat(result.data.isProrat)
												setswtTaxable(result.data.isProrat)
												setswtstatus(result.data.isActive)
											})
											setSelectedRow(val)
											setrowId(1)
										}}
									/>
								</div>
							</div>

							{/* Autocomplete End  */}
						</div>
					</div>
				</div>

				<div className='container'>
					<div className='row'>
						<div className='col-lg-6 col-md-12 col-sm-12' style={{background: 'white'}}>
							<div className='card ' style={{height: 400}}>
								<div className='card-body shadow-sm p-2 mb-5 bg-white rounded'>
									<div className='table-responsive'>
										{/* begin::Table */}
										<div style={{height: 360, overflowY: 'scroll'}}>
											<table
												id='dtVerticalScrollExample'
												className='table table-striped align-middle gs-1'
											>
												{/* begin::Table head */}
												<thead
													className='w-120'
													style={{background: '#0095e8', position: 'sticky', top: 0}}
												>
													<tr className='fw-bold text-muted'>
														<th
															className='min-w-100px text-white'
															onClick={() => Sorting('componentName')}
														>
															componentName
															<img
																alt='sort'
																src={toAbsoluteUrl('/media/logos/sort.png')}
																className='ms-1'
																height={13}
																width={13}
															/>
														</th>
														<th
															className='min-w-100px text-white  '
															onClick={() => Sorting('componentShortCode')}
														>
															ComponentShortCode
															<img
																alt='sort'
																src={toAbsoluteUrl('/media/logos/sort.png')}
																className='ms-1'
																height={13}
																width={13}
															/>
														</th>
														<th
															className='min-w-100px text-white  '
															onClick={() => Sorting('calculationType')}
														>
															calculationType
															<img
																alt='sort'
																src={toAbsoluteUrl('/media/logos/sort.png')}
																className='ms-1'
																height={13}
																width={13}
															/>
														</th>

														<th
															className='min-w-70px text-white'
															onClick={() => Sorting('isActive')}
														>
															Status
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
															key={rowData.id}
															onClick={() => handleRowClick(rowData)}
															style={{
																backgroundColor:
																	selectedRow && selectedRow.id === rowData.id
																		? ' #BAD9FB'
																		: 'white',
																cursor: 'pointer',
																width: 100,
															}}
														>
															<td>{rowData.componentName}</td>
															<td>{rowData.componentShortCode}</td>
															<td>{rowData.calculationType}</td>
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

						<div className='col-lg-6 col-md-12 '>
							<div className='card'>
								<div className='card-body'>
									{/* Formik integration Start*/}
									<Formik
										initialValues={formik.initialValues}
										onSubmit={() => formik.handleSubmit()}
									>
										<Form id='form' className=''>
											<div className='container'>
												<div className='row'>
													<div className='card-title'>
														<h4>Company Master</h4>
													</div>
													<div className='col-lg-12 col-md-12 col-sm-6'>
														<div className='row'>
															<div className='col-lg-5'>
																<div className='p-1'>
																	<label className='form-label'>Component Name</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		innerRef={inputRef}
																		type='text'
																		id='componentName'
																		maxlength={20}
																		autoFocus
																		className='form-control form-control-sm'
																		name='componentName'
																		onChange={formik.handleChange}
																		value={formik.values.componentName}
																	/>
																</div>
															</div>
															<div className='col-lg-6'>
																<div className='p-1'>
																	<label className='form-label'>Component Short Code</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<div className='col-lg-4'>
																		<Field
																			id='componentShortCode'
																			maxlength={5}
																			className='form-control form-control-sm'
																			name='componentShortCode'
																			onChange={formik.handleChange}
																			value={formik.values.componentShortCode}
																		/>
																	</div>
																</div>
															</div>
														</div>

														<div className='row'>
															<div className='col-lg-4 '>
																<div className='p-1 '>
																	<label className='form-label'>Calculation Type</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>

																	<Select
																		name='calculationType'
																		id='calculationType'
																		autoFocus
																		components={{
																			IndicatorSeparator: () => null,
																		}}
																		options={calculation}
																		value={selectedOption}
																		onChange={(o: any) => setSelectedOption(o)}
																		placeholder='Select'
																		isDisabled={readonly}
																		styles={{
																			menu: (base) => ({
																				...base,
																				width: 'max-content',
																				minWidth: '100%',
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

															<div className='col-lg-1 p-0 w-15px'>
																<div className=''>
																	{selectedOption.value !== 0 ? (
																		<div className='mt-11 '>
																			{selectedOption.value === 1 ? (
																				<div>
																					<label>Amt</label>
																				</div>
																			) : (
																				<div>
																					<label>%</label>
																				</div>
																			)}
																		</div>
																	) : null}
																</div>
															</div>

															<div className='col-lg-4 ms-2'>
																<div className='p-1'>
																	<label className='form-label'>Calculation Amount</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		id='calculationAmount'
																		maxlength={10}
																		className='form-control form-control-sm'
																		name='calculationAmount'
																		onChange={formik.handleChange}
																		value={formik.values.calculationAmount}
																	/>
																</div>
															</div>
														</div>

														<div className='row'>
															<div className='col-lg-4'>
																<div className='p-1'>
																	<label className='form-label'>Component Order</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		id='order'
																		maxlength={10}
																		className='form-control form-control-sm'
																		name='order'
																		onChange={formik.handleChange}
																		value={formik.values.order}
																	/>
																</div>
															</div>
															<div className='col-lg-4'>
																<div className='p-1'>
																	<label className='form-label'>Allowance</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		id='allowance'
																		maxlength={10}
																		className='form-control form-control-sm'
																		name='allowance'
																		onChange={formik.handleChange}
																		value={formik.values.allowance}
																	/>
																</div>
															</div>
														</div>
														<div className='row'>
															<div className='col-lg-4'>
																<div className='p-1'>
																	<label className='form-label'>Credit Amount</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		id='credit'
																		maxlength={10}
																		className='form-control form-control-sm'
																		name='credit'
																		onChange={formik.handleChange}
																		value={formik.values.credit}
																	/>
																</div>
															</div>

															<div className='col-lg-4'>
																<div className='p-1'>
																	<label className='form-label'>Debit Amount</label>
																	<span style={{display: divStyle(), color: 'red'}}>*</span>
																	<Field
																		id='debit'
																		maxlength={10}
																		className='form-control form-control-sm'
																		name='debit'
																		onChange={formik.handleChange}
																		value={formik.values.debit}
																	/>
																</div>
															</div>
														</div>

														<div className='row'>
															<div className='col-lg-3'>
																<div className='p-1'>
																	<label className='form-label'>Show Employee</label>
																	<div className='form-check form-switch '>
																		<input
																			name='showInEmployee'
																			type='checkbox'
																			className='form-check-input'
																			checked={swtShowInEmployee}
																			onChange={(e) => {
																				formik.handleChange(e)
																				return setswtShowInEmployee(!swtShowInEmployee)
																			}}
																		/>
																	</div>
																</div>
															</div>
															<div className='col-lg-3'>
																<div className='p-1'>
																	<label className='form-label'>Show PaySlip</label>
																	<div className='form-check form-switch '>
																		<input
																			name='showInPayRoll'
																			type='checkbox'
																			className='form-check-input'
																			checked={swtShowInPayRoll}
																			onChange={(e) => {
																				formik.handleChange(e)
																				return setswtShowInPayRoll(!swtShowInPayRoll)
																			}}
																		/>
																	</div>
																</div>
															</div>
															<div className='col-lg-2'>
																<div className='p-1'>
																	<label className='form-label'>Prorat</label>
																	<div className='form-check form-switch '>
																		<input
																			name='isProrat'
																			type='checkbox'
																			className='form-check-input'
																			checked={swtProrat}
																			onChange={(e) => {
																				formik.handleChange(e)
																				return setswtProrat(!swtProrat)
																			}}
																		/>
																	</div>
																</div>
															</div>

															<div className='col-lg-2'>
																<div className='p-1'>
																	<label className='form-label'>Taxable</label>
																	<div className='form-check form-switch '>
																		<input
																			name='isTaxable'
																			type='checkbox'
																			className='form-check-input'
																			checked={swtTaxable}
																			onChange={(e) => {
																				formik.handleChange(e)
																				return setswtTaxable(!swtTaxable)
																			}}
																		/>
																	</div>
																</div>
															</div>
															<div className='col-lg-2'>
																<div className='p-1'>
																	<label className='form-label'>Status</label>
																	<div className='form-check form-switch '>
																		<input
																			name='isActive'
																			type='checkbox'
																			className='form-check-input'
																			checked={swtstatus}
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
	)
}
/* Company Function End */

export default Salarycomponent
