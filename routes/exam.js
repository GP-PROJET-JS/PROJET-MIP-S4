const express = require('express')
const router = express.Router()
const crypto = require('crypto')

// Route pour ajouter exam
router.post('/ajouter-examen', (req, res) => {
  const db = req.app.get('db')

  const { name, description, semestre, id } = req.body
  // generer un lien
  const exam_lien = 'exam-' + crypto.randomBytes(4).toString('hex')

  const sql = `INSERT INTO examens (exam_nom, exam_desc, semestre, id, exam_lien) 
               VALUES (?, ?, ?, ?, ?)`

  db.query(sql, [name, description, semestre, id, exam_lien], (err, result) => {
    if (err) {
      console.error('erreur dans la saisie d\'exam', err)
      return res.status(500).send('erreur dans le server')
    }
    res.json({ message: 'exam bien creer', exam_lien })

  })
})

// Récupérer tous les examens d'un enseignant
router.get('/examens/:id', (req, res) => {
  const db = req.app.get('db')
  const ens_id = req.params.id

  const sql = `SELECT * FROM examens WHERE id = ?`

  db.query(sql, [ens_id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la recuperation des examens:", err)
      return res.status(500).send("Erreur serveur")
    }
    res.json(results); // return un tableau des examens
  })
})

// Route pour supprimer exam card par exam_id
router.delete('/supprimer-examen/:exam_id', (req, res) => {
  const db = req.app.get('db')
  const examId = req.params.exam_id

  const sql = `DELETE FROM examens WHERE exam_id = ?`
  db.query(sql, [examId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression:", err)
      return res.status(500).send("Erreur lors de la suppression")
    }
    res.send("Examen supprime avec succes !")
  })
})


module.exports = router;

