import React, { useEffect, useState } from 'react';

//bootstrap, react-bootstrap imports
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//formik
import { useFormik } from 'formik';

//react router imports
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditJobSheet() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoadding, setIsLoadding] = useState(false);

	const formik = useFormik({
		initialValues: {
			clientName: '',
			contactInfo: '',
			recievedDate: '',
			inventoryRecieved: '',
			inventoryFile: null,
			reportedIssue: '',
			clientNotes: '',
			assignedTechnician: '',
			deadline: '',
			estimatedAmount: '',
			status: '',
		},
		onSubmit: async (values) => {
			const formData = new FormData();

			// Append all form values to FormData
			formData.append('clientName', values.clientName);
			formData.append('contactInfo', values.contactInfo);
			formData.append('recievedDate', values.recievedDate);
			formData.append('inventoryRecieved', values.inventoryRecieved);
			formData.append('reportedIssue', values.reportedIssue);
			formData.append('clientNotes', values.clientNotes);
			formData.append('assignedTechnician', values.assignedTechnician);
			formData.append('deadline', values.deadline);
			formData.append('estimatedAmount', values.estimatedAmount);
			formData.append('status', values.status);

			// Appending the file to FormData (only if a file was selected)
			if (values.inventoryFile) {
				formData.append('inventoryFile', values.inventoryFile);
			}

			//Sending FormData to the backend
			try {
				setIsLoadding(true);
				const response = await fetch(
					`http://localhost:8080/api/jobsheet/${id}`,
					{
						method: 'PATCH',
						body: formData,
					}
				);
				if (response.ok) {
					console.log('Job sheet updated successfully!');
				} else {
					console.log('Error updateding job sheet');
				}
				setIsLoadding(false);
			} catch (error) {
				console.error('Error submitting form:', error);
				setIsLoadding(false);
			}
			navigate('/');
		},
	});

	useEffect(() => {
		async function getJobSheetDetails() {
			const res = await fetch(`http://localhost:8080/api/jobsheet/${id}`);
			const data = await res.json();
			formik.setValues({
				clientName: data.clientName || '',
				contactInfo: data.clientNumber || '',
				recievedDate: data.recievedDate || '',
				inventoryRecieved: data.inventoryRecieved || '',
				inventoryFile: null, // File inputs handled by backend
				reportedIssue: data.reportedIssue || '',
				clientNotes: data.clientNotes || '',
				assignedTechnician: data.assignedTechnician || '',
				deadline: data.deadline || '',
				estimatedAmount: data.estimatedAmount || '',
				status: data.status || '',
			});
		}
		getJobSheetDetails();
	}, []);

	if (isLoadding) {
		return (
			<div
				className='d-flex justify-content-center align-items-center'
				style={{ height: '100vh' }}
			>
				<Spinner animation='border' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</Spinner>
			</div>
		);
	}

	return (
		<div className='bg-light'>
			<Container maxwidth='lg'>
				<Row className='justify-content-center'>
					<Col
						lg='8'
						className='bg-white border-3 my-3 p-3 rounded-3 shadow-3'
					>
						<h3 className='fw-semibold bg-blue text-white text-center py-3 rounded-top-3'>
							Edit Job Sheet
						</h3>
						<Form onSubmit={formik.handleSubmit}>
							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Client Name
								</Form.Label>
								<Form.Control
									type='text'
									name='clientName'
									onChange={formik.handleChange}
									value={formik.values.clientName}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Contact Info (Phone 10nos)
								</Form.Label>
								<Form.Control
									type='number'
									name='contactInfo'
									onChange={formik.handleChange}
									value={formik.values.contactInfo}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Recieved Date
								</Form.Label>
								<Form.Control
									type='date'
									name='recievedDate'
									onChange={formik.handleChange}
									value={formik.values.recievedDate}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Inventory Recieved
								</Form.Label>
								<Form.Control
									type='text'
									name='inventoryRecieved'
									onChange={formik.handleChange}
									value={formik.values.inventoryRecieved}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Upload Inventory Image/Document/Video
								</Form.Label>
								<Form.Control
									type='file'
									name='inventoryFile'
									onChange={(event) => {
										formik.setFieldValue(
											'inventoryFile',
											event.currentTarget.files[0]
										);
									}}
								/>
							</Form.Group>

							<Form.Group
								className='mb-3'
								controlId='exampleForm.ControlTextarea1'
							>
								<Form.Label className='fw-semibold'>
									Reported Issue
								</Form.Label>
								<Form.Control
									as='textarea'
									rows='3'
									name='reportedIssue'
									onChange={formik.handleChange}
									value={formik.values.reportedIssue}
								/>
							</Form.Group>

							<Form.Group
								className='mb-3'
								controlId='exampleForm.ControlTextarea1'
							>
								<Form.Label className='fw-semibold'>
									Client Notes
								</Form.Label>
								<Form.Control
									as='textarea'
									rows='3'
									name='clientNotes'
									onChange={formik.handleChange}
									value={formik.values.clientNotes}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Assigned Technician
								</Form.Label>
								<Form.Control
									type='text'
									name='assignedTechnician'
									onChange={formik.handleChange}
									value={formik.values.assignedTechnician}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Deadline
								</Form.Label>
								<Form.Control
									type='date'
									name='deadline'
									onChange={formik.handleChange}
									value={formik.values.deadline}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='formBasicText'>
								<Form.Label className='fw-semibold'>
									Estimated Amount
								</Form.Label>
								<Form.Control
									type='text'
									name='estimatedAmount'
									onChange={formik.handleChange}
									value={formik.values.estimatedAmount}
								/>
							</Form.Group>

							<Form.Select
								className='mb-3'
								name='status'
								onChange={formik.handleChange}
								value={formik.values.status}
							>
								<option disabled value=''>
									status
								</option>
								<option value='Complete'>Complete</option>
								<option value='Incomplete'>Incomplete</option>
								<option value='Pending'>Pending</option>
							</Form.Select>

							<Button
								variant='primary'
								type='submit'
								className='bg-blue border-0 w-100 mb-3'
							>
								Save changes
							</Button>
							<div className='d-flex justify-content-center'>
								<Link to='/'>
									<Button
										variant='link'
										className='p-0 fw-semibold'
										style={{ textDecoration: 'none' }}
									>
										Cancel
									</Button>
								</Link>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default EditJobSheet;
