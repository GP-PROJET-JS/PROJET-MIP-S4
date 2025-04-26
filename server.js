
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

//  Pour lire les donnees de formulaire
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//  Servir les fichiers statiques (JS, CSS)
app.use(express.static(__dirname))

// Importer les routes
const authRoutes = require('./routes/auth')
app.use('/', authRoutes)

//  Route pour afficher le formulaire HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'inscription/index.html'))
})

// Route pour exam
const examRoutes = require('./routes/exam');
app.use('/', examRoutes);

//  Connexion MySQL
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'MySQLroot0', // modifier si besoin
//     database: 'projet_db'
// })
//  Connexion db avec clever cloud
const db = mysql.createConnection({
    host: 'b36d44aud3qfv13tgans-mysql.services.clever-cloud.com',
    user: 'uecp2cnoj1yrcip2',
    password: '2Vivu13qrAdHfY8Vb28S', // modifier si besoin
    port: '3306',
    database: 'b36d44aud3qfv13tgans'
})
db.connect((err) => {
    if (err) {
        console.error('Erreur MySQL :', err)
        return;
    }
    console.log('✅ Connecte a MySQL')
})
app.set('db', db);

// Lancer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${port}`)
});
