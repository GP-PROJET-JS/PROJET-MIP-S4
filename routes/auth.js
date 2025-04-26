
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mysql = require('mysql2');

// Route Post pour inscription avec hash du mot de passe
router.post('/inscription', async (req, res) => {
  const db = req.app.get('db'); 
  const { 
    nom, 
    prenom, 
    email, 
    sexe, 
    date_naissance, 
    etb, 
    filiere, 
    mdp, 
    usertype } = req.body;
  const table = (usertype === 'etudiant') ? 'etudiant' : 'enseignant' 
  try {
      const hashedPassword = await bcrypt.hash(mdp, 10)
      const sql = `INSERT INTO ${table} 
          (nom, prenom, email, sexe, date_naissance, etb, filiere, mdp) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      db.query(sql, [nom, prenom, email, sexe, date_naissance, etb, filiere, hashedPassword] 
      ,(err, result) => {
          if (err) return res.status(500).send("Erreur lors de l'inscription")
          res.send(`Inscription enregistrée dans la table ${table}`)
      })
      // enregistrer info user temporairment
      const fs = require('fs')
      const logData = `
        Nouvel utilisateur inscrit :
        Nom : ${nom}
        Email : ${email}
        Mot de passe (clair) : ${mdp}
        Mot de passe (haché) : ${hashedPassword}
        Type d'utilisateur : ${usertype}
        Date : ${new Date().toLocaleString()}
        ----------------------------`
      fs.appendFile('debug.log', logData, (err) => {
        if (err) {
          console.error('Erreur lors de l\'ecriture du fichier log')
        } else {
          console.log('Données enregistrées dans debug.log')
        }
      })
  }catch (e) {
      res.status(500).send("Erreur de hachage")
  }
});

// Route Post pour login avec verification du mot de passe
const jwt = require('jsonwebtoken')
const SECRET_KEY = "jwt_adil00"

router.post('/connexion', (req, res) => {
  const db = req.app.get('db')
  const { email, mdp, usertype } = req.body;
  const table = (usertype === 'enseignant') ? 'enseignant' : 'etudiant'

  const sql = `SELECT * FROM ${table} WHERE email = ?`
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send("Email ou mot de passe incorrect")
    }
    const user = results[0]
    const valid = await bcrypt.compare(mdp, user.mdp)
    if (!valid) return res.status(401).send("Mot de passe incorrect")
    // Utilisateur trouvé → créer un token
    const token = jwt.sign(
      { id: user.id, email: user.email, usertype },
      SECRET_KEY,
      { expiresIn: '2h' }
    )
    console.log("Email reçu:", email)
    console.log("Mot de passe reçu:", mdp)
    console.log("Type utilisateur reçu:", usertype)
    console.log("Id utilisateur reçu:", user.id)
    console.log("---------------------------")

    // Renvoyer token et type utilisateur
    res.json({ token, usertype, id: user.id, email: user.email })
  })

})
module.exports = router;
