import React from 'react';

//react router dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//import from pages
import Home from './pages/Home';
import EditJobSheet from './pages/EditJobSheet';
import CreateJobSheet from './pages/CreateJobSheet';
import JobSheetDetails from './pages/JobSheetDetails';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/create-jobsheet' element={<CreateJobSheet />} />
				<Route path='/jobsheet-details/:id' element={<JobSheetDetails />} />
				<Route path='/edit-jobsheet/:id' element={<EditJobSheet />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
