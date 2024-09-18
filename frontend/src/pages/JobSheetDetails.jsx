import React, { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Container,
	Form,
	Row,
	Spinner,
	Table,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

function JobSheetDetails() {
	const { id } = useParams();
	const [jobSheet, setJobSheet] = useState({});
	const [isLoadding, setIsLoadding] = useState(false);

	const navigate = useNavigate();

	async function handleJobSheetDelete(id) {
		setIsLoadding(true);
		const res = await fetch(`http://localhost:8080/api/jobsheet/${id}`, {
			method: 'DELETE',
		});
		setIsLoadding(false);
		navigate('/');
	}

	const tableData = [
		{ title: 'Client Name', value: jobSheet.clientName },
		{ title: 'Contact Info', value: jobSheet.clientNumber },
		{ title: 'Recieved Date', value: jobSheet.recievedDate },
		{ title: 'Inventory Recieved', value: jobSheet.inventoryRecieved },
		{
			title: 'Inventory Image/Video/Document',
			value: jobSheet.inventoryFile,
		},
		{ title: 'Reported Issue', value: jobSheet.reportedIssue },
		{ title: 'Client Notes', value: jobSheet.clientNotes },
		{ title: 'Assigned Technician', value: jobSheet.assignedTechnician },
		{ title: 'Estimated Amount', value: jobSheet.estimatedAmount },
		{ title: 'Deadline', value: jobSheet.deadline },
		{ title: 'Status', value: jobSheet.status },
	];

	useEffect(() => {
		async function getJobSheetDetail() {
			setIsLoadding(true);
			try {
				const res = await fetch(`http://localhost:8080/api/jobsheet/${id}`);
				const data = await res.json();
				console.log(data);
				setJobSheet(data);
			} catch (err) {
				console.log(err);
				setIsLoadding(false);
			}
			setIsLoadding(false);
		}
		getJobSheetDetail();
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
							View Job Details
						</h3>
						<Table
							bordered
							className='w-100'
							style={{ overflow: 'scroll' }}
							id='table-data'
						>
							<tbody>
								{tableData.map((data) => (
									<tr key={data.title}>
										<td
											className='fw-semibold'
											style={{
												backgroundColor: 'rgb(3, 3, 167)',
												color: 'white',
												width: '40%',
											}}
										>
											{data.title}
										</td>
										<td>
											{data.title.includes('/') ? (
												<a
													href={`http://localhost:8080/${data.value}`}
													target='_blank'
													rel='noopener noreferrer'
												>
													<Button
														variant='link'
														className='p-0 fw-semibold'
														style={{ textDecoration: 'none' }}
													>
														View File
													</Button>
												</a>
											) : (
												data.value
											)}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Form>
							<Form.Group
								className='mb-3'
								controlId='exampleForm.ControlTextarea1'
							>
								<Form.Label className='fw-semibold'>
									Add or Edit Notes
								</Form.Label>
								<Form.Control
									as='textarea'
									rows='3'
									name='reportedIssue'
								/>
							</Form.Group>
							<Button
								variant='primary'
								type='submit'
								className='bg-blue border-0 w-100 mb-3'
							>
								Save
							</Button>
						</Form>
						<div className='d-flex gap-3'>
							<Link to={`/edit-jobsheet/${id}`}>
								<Button
									variant='link'
									className='p-0 fw-semibold'
									style={{ textDecoration: 'none' }}
								>
									Edit
								</Button>
							</Link>
							<Button
								variant='link'
								className='p-0 fw-semibold'
								style={{ textDecoration: 'none' }}
								onClick={handleJobSheetDelete}
							>
								Delete
							</Button>
						</div>
						<div className='d-flex justify-content-center'>
							<Link to='/'>
								<Button
									variant='link'
									className='p-0 fw-semibold'
									style={{ textDecoration: 'none' }}
								>
									Back
								</Button>
							</Link>
						</div>
						<Button
							variant='success'
							className='fw-semibold mb-3'
							onClick={generatePDF}
						>
							Save PDF
						</Button>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default JobSheetDetails;
