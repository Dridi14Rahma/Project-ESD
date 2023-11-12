// import all packages already installed 
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2')

//we created the instances and called it 
const app = express();
app.use(cors());
app.use(bodyparser.json());


// database connection after checking that the server is working 

const db = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'R@1234dridi#',
    database: 'pfaprojet'

})

//check database connection 
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database...');
});

//defining routes 

// get all data method

app.get('/esd', (req, res) => {

    let qr = 'select es.idESD,es.matricule_employee, em.nom, em.prenom , es.zone , es.date, es.heure , es.mesure from esd es  join employee em on es.matricule_employee = em.matricule ';
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'error found')
        }

        if (result.length > 0) {
            res.send({
                message: 'all user data',
                data: result
            })
        }
    })

});
// get single data from esd 
app.get('/esd/:id', (req, res) => {
    let gid = req.params.id;
    let qr = `SELECT es.idESD, es.matricule_employee, em.nom, em.prenom, es.zone, es.date, es.heure, es.mesure
    FROM esd es
    JOIN employee em ON es.matricule_employee = em.matricule
    WHERE es.matricule_employee = ${gid}
     `;
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'error found')
        }

        if (result.length > 0) {
            res.send({
                message: 'all user data',
                data: result
            })
        }
    })

});

//get single data 
app.get('/employee/:id', (req, res) => {

    let gid = req.params.id;
    let qr = `select * from employee where matricule=${gid}`;
    db.query(qr, (err, result) => {
        if (err) { console.log(err) }
        if (result.length > 0) {
            res.send({
                message: "get single data",
                data: result
            });
        }
        else {
            res.send({
                message: 'donnée introuvable'
            });
        }
    })
});


//create data 
app.post('/employee', (req, res) => {
    let name = req.body.nom;
    let matricule = req.body.matricule;
    let lastname = req.body.prenom;
    let zone = req.body.zone;

    // Obtenez la date et l'heure actuelles
    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset(); // Obtenez le décalage en minutes
    const adjustedDate = new Date(currentDate.getTime() - offset * 60 * 1000); // Ajustez la date et l'heure
    const formattedDate = adjustedDate.toISOString().slice(0, 10); // Format : yyyy-MM-dd
    const formattedTime = adjustedDate.toISOString().slice(11, 19); // Format : HH:mm:ss

    console.log(req.body, 'create data');

    let qr = 'INSERT INTO employee (matricule, nom, prenom, zone, date_creation, heure_creation) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(qr, [matricule, name, lastname, zone, formattedDate, formattedTime], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            console.error('Query:', qr);
            res.status(500).json({
                message: 'Erreur lors de l"insertion des données '
            });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({
                message: "l'employé est créé avec succée"
            });
        } else {
            res.json({
                message: 'echec'
            });
        }
    });
});


//update data

app.put('/employee/:id', (req, res) => {
    let name = req.body.nom;
    let matricule = req.body.matricule;
    let lastname = req.body.prenom;
    let zone = req.body.zone;
    let gid = req.params.id;

    // Obtenez la date et l'heure actuelles
    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset(); // Obtenez le décalage en minutes
    const adjustedDate = new Date(currentDate.getTime() - offset * 60 * 1000); // Ajustez la date et l'heure
    const formattedDate = adjustedDate.toISOString().slice(0, 10); // Format : yyyy-MM-dd
    const formattedTime = adjustedDate.toISOString().slice(11, 19); // Format : HH:mm:ss


    let qr = 'UPDATE employee SET matricule= ?,nom=?, prenom = ?,date_modification = ? ,heure_modification= ?,zone= ? WHERE matricule = ?';
    db.query(qr, [matricule, name, lastname, formattedDate, formattedTime, zone, gid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: 'erreur lors de modification des données '
            });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({
                message: 'modification réussite'
            });
        } else {
            res.json({
                message: 'echec '
            });
        }
    });
});





app.delete('/employee/:id', (req, res) => {
    let gid = req.params.id;
    let qr = 'DELETE FROM employee WHERE matricule= ?';
    db.query(qr, [gid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: 'Error deleting data'
            });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({
                message: 'les données sont effacé'
            });
        } else {
            res.json({
                message: 'echec du supression'
            });
        }
    });
});















app.listen(3000, () => {
    console.log("server is running ")
});