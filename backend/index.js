const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = 8080;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Function to create the uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');

function createUploadFolder() {
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	} else {
		console.log('Uploads folder already exists.');
	}
}
createUploadFolder();

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

//middleware for file upload
const upload = multer({ storage: storage });

//initialzing the sqlite databse
let db = new sqlite3.Database('client.db', (err) => {
	if (err) {
		console.error(err.message);
	} else {
		db.run(
			'CREATE TABLE IF NOT EXISTS client (id INTEGER PRIMARY KEY AUTOINCREMENT, clientName TEXT, clientNumber INTEGER, recievedDate TEXT, inventoryRecieved TEXT, inventoryFile TEXT, reportedIssue TEXT, clientNotes TEXT, assignedTechnician TEXT, deadline TEXT, estimatedAmount INTEGER, status TEXT)',
			(err) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Table cerated succesfully...!');
				}
			}
		);
	}
});

/* getting all clients/jobsheet details */
app.get('/api/jobsheet', (req, res) => {
	const sql = 'SELECT * FROM client';
	db.all(sql, [], (err, rows) => {
		if (err) {
			res.status(500).send(err.message);
		} else {
			res.status(200).send(rows);
		}
	});
});

/* creting new jobsheet */
app.post('/api/create', upload.single('inventoryFile'), (req, res) => {
	const {
		clientName,
		contactInfo,
		recievedDate,
		inventoryRecieved,
		reportedIssue,
		clientNotes,
		assignedTechnician,
		deadline,
		estimatedAmount,
		status,
	} = req.body;

	const inventoryFile = req.file
		? path.join('./uploads/', req.file.filename)
		: null;

	const sql = `
	  INSERT INTO client 
	  (clientName, clientNumber, recievedDate, inventoryRecieved, inventoryFile, reportedIssue, clientNotes, assignedTechnician, deadline, estimatedAmount, status)
	  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	// Run the database insertion
	db.run(
		sql,
		[
			clientName,
			contactInfo,
			recievedDate,
			inventoryRecieved,
			inventoryFile,
			reportedIssue,
			clientNotes,
			assignedTechnician,
			deadline,
			estimatedAmount,
			status,
		],
		(err) => {
			if (err) {
				console.log(err.message);
				return res.status(500).send(err.message);
			}
			res.status(200).json({ msg: 'Successfully inserted' });
		}
	);
});

/* getting single jobsheet details */
app.get('/api/jobsheet/:id', (req, res) => {
	const { id } = req.params;
	const sql = 'SELECT * FROM client where id = ?';
	db.get(sql, [id], (err, jobsheet) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(jobsheet);
		}
	});
});

/* modifying the jobsheet details */
app.patch('/api/jobsheet/:id', upload.single('inventoryFile'), (req, res) => {
	const { id } = req.params;
	const {
		clientName,
		contactInfo,
		recievedDate,
		inventoryRecieved,
		reportedIssue,
		clientNotes,
		assignedTechnician,
		deadline,
		estimatedAmount,
		status,
	} = req.body;

	// If a new file is uploaded
	const newInventoryFile = req.file;

	// SQL to get the current inventory file path from the database
	const getFileSql = 'SELECT inventoryFile FROM client WHERE id = ?';
	db.get(getFileSql, [id], (err, row) => {
		if (err) {
			return res.status(500).send({ msg: 'Error retrieving current file' });
		}

		// If a new file is uploaded, delete the old one
		if (row && row.inventoryFile && newInventoryFile) {
			const oldFilePath = path.join(__dirname, row.inventoryFile);
			fs.unlink(oldFilePath, (err) => {
				if (err) {
					console.error('Error deleting old file:', err);
				}
			});
		}

		// Setting the file path to either the new file or retain the old one if no new file is uploaded
		const inventoryFilePath = newInventoryFile
			? `uploads/${newInventoryFile.filename}`
			: row.inventoryFile;

		// Update SQL query
		const sql =
			'UPDATE client SET clientName = ?, clientNumber = ?, recievedDate = ?, inventoryRecieved = ?, inventoryFile = ?, reportedIssue = ?, clientNotes = ?, assignedTechnician = ?, deadline = ?, estimatedAmount = ?, status = ? WHERE id = ?';

		// Run the SQL query to update the jobsheet
		db.run(
			sql,
			[
				clientName,
				contactInfo,
				recievedDate,
				inventoryRecieved,
				inventoryFilePath, // Save the file path to the database
				reportedIssue,
				clientNotes,
				assignedTechnician,
				deadline,
				estimatedAmount,
				status,
				id,
			],
			(err) => {
				if (err) {
					return res.status(500).send({ msg: 'Jobsheet not updated' });
				} else {
					return res
						.status(200)
						.send({ msg: 'Jobsheet updated successfully' });
				}
			}
		);
	});
});

/* delete route for deleting the jobsheet */
app.delete('/api/jobsheet/:id', (req, res) => {
	const { id } = req.params;

	const getFileSql = 'SELECT inventoryFile FROM client WHERE id = ?';
	db.get(getFileSql, [id], (err, row) => {
		if (err) {
			return res.status(500).send({ msg: 'Error retrieving current file' });
		}

		// If a new file is uploaded, delete the old one
		if (row && row.inventoryFile) {
			const oldFilePath = path.join(__dirname, row.inventoryFile);
			fs.unlink(oldFilePath, (err) => {
				if (err) {
					console.error('Error deleting old file:', err);
				}
			});
		}
	});

	const sql = 'DELETE FROM client WHERE id = ?';
	db.run(sql, [id], (err) => {
		if (err) {
			res.status(500).send({ msg: 'jobsheet not deleted' });
		} else {
			res.status(200).send({ msg: 'jobsheet deleted sucessfully' });
		}
	});
});

app.listen(PORT, () => {
	console.log('Server running...!');
});
