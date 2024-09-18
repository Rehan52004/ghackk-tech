import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const tableHeadList = [
	'#',
	'Client ID',
	'Client Name',
	'Contact Info',
	'Recieved Date',
	'Inventory Recieved',
	'Reported Issue',
	'Client Notes',
	'Assigned Technician',
	'Estimated Amount',
	'Deadline',
	'Status',
	'Action',
];

function Home() {
	const [jobSheets, setJobSheets] = useState([]);
	const [query, setQuery] = useState('');
	const [isLoadding, setIsLoadding] = useState(false);
	const [error, setError] = useState(null);
	const [filteredSheet, setFilteredSheet] = useState([]);

	//query is case sensitive
	function handleQuery(e) {
		e.preventDefault();
		let res = jobSheets.filter(
			(sheet) =>
				String(sheet.clientName).includes(query) ||
				String(sheet.id).includes(query)
		);
		setFilteredSheet(res);
	}

	async function handleJobSheetDelete(id) {
		setIsLoadding(true);
		try {
			const res = await fetch(`http://localhost:8080/api/jobsheet/${id}`, {
				method: 'DELETE',
			});
		} catch (err) {
			console.log(err.message);
		}
		setIsLoadding(false);
		window.location.reload();
	}

	useEffect(() => {
		async function getJobSheet() {
			setIsLoadding(true);
			try {
				const res = await fetch('http://localhost:8080/api/jobsheet');
				const data = await res.json();
				setJobSheets(data);
				setFilteredSheet(data);
			} catch (err) {
				setError(err.message);
				setIsLoadding(false);
			}
			setIsLoadding(false);
		}
		getJobSheet();
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
		<div className='bg-light p-3' style={{ height: '100vh' }}>
			<Container fluid className='bg-white border-3 p-3 rounded-3 shadow-3'>
				<h3 className='fw-semibold bg-blue text-white text-center py-3 rounded-top-3 text-uppercase'>
					Hardik Traders - Client Management System
				</h3>
				<Form onSubmit={handleQuery} className='d-flex py-2'>
					<Form.Group controlId='formBasicText' className='flex-grow-1'>
						<Form.Control
							type='text'
							name='clientName'
							placeholder='Search by client name or id'
							onChange={(e) => setQuery(e.target.value)}
							value={query}
						/>
					</Form.Group>
					<Button
						variant='primary'
						type='submit'
						className='bg-blue border-0 ms-3 px-5'
					>
						Search
					</Button>
				</Form>
				<div className='d-flex justify-content-center align-items-center'>
					<Link to='/create-jobsheet'>
						<Button
							variant='primary'
							className='bg-blue border-0 mt-2 mb-3 mx-auto'
						>
							New Job Sheet
						</Button>
					</Link>
				</div>
				<div style={{ overflow: 'scroll' }}>
					<Table striped bordered>
						<thead>
							<tr style={{ backgroundColor: 'rgb(3, 3, 167)' }}>
								{tableHeadList.map((list) => (
									<th
										key={list}
										style={{
											backgroundColor: 'rgb(3, 3, 167)',
											color: 'white',
											border: '0',
										}}
									>
										{list}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filteredSheet?.map((sheet, idx) => (
								<tr key={sheet.id}>
									<td>{idx}</td>
									<td>{sheet.id}</td>
									<td>{sheet.clientName}</td>
									<td>{sheet.clientNumber}</td>
									<td>{sheet.recievedDate}</td>
									<td>{sheet.inventoryRecieved}</td>
									<td>{sheet.reportedIssue}</td>
									<td>{sheet.clientNotes}</td>
									<td>{sheet.assignedTechnician}</td>
									<td>{sheet.estimatedAmount}</td>
									<td>{sheet.deadline}</td>
									<td>{sheet.status}</td>
									<td>
										<Link to={`/jobsheet-details/${sheet.id}`}>
											<Button
												variant='primary'
												size='sm'
												className='border-0'
											>
												View
											</Button>
										</Link>
										<Link to={`/edit-jobsheet/${sheet.id}`}>
											<Button
												variant='warning'
												size='sm'
												className='border-0 text-white mx-1'
											>
												Edit
											</Button>
										</Link>
										<Button
											variant='danger'
											size='sm'
											className='border-0'
											onClick={() => handleJobSheetDelete(sheet.id)}
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
				<p className='bg-blue text-white text-xs text-center py-1 rounded-bottom-3'>
					@2024 Hardik Traders
				</p>
			</Container>
		</div>
	);
}

export default Home;
