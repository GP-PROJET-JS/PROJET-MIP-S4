const express = require('express')
const router = express.Router()
const crypto = require('crypto')

// Route pour ajouter exam
router.post('/ajouter-examen', (req, res) => {
  const db = req.app.get('db')
  const { name, description, semestre, id } = req.body
  
  // generer un lien
  const exam_lien = 'platexm-exam-' + crypto.randomBytes(4).toString('hex') + ".tb";

  const sql = `INSERT INTO examens (exam_nom, exam_desc, semestre, id, exam_lien) 
               VALUES (?, ?, ?, ?, ?)`

  db.query(sql, [name, description || '', semestre, id, exam_lien], (err, result) => {
    if (err) {
      console.error('Erreur dans la saisie d\'exam', err)
      return res.status(500).send('Erreur dans le server')
    }
    res.json({ message: 'Examen cree avec succes', exam_lien })

  })
})

// Recuperer tous les examens d'un enseignant
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

// Route pour ajouter les questions
router.post('/ajouter-question', (req, res) => {
  const db = req.app.get('db');
  const { questions, exam_lien } = req.body;

  if (!exam_lien || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).send("Données invalides");
  }

  // Verification existence de l’examen
  db.query("SELECT 1 FROM examens WHERE exam_lien = ?", [exam_lien], (err, results) => {
    if (err) return res.status(500).send("Erreur serveur");
    if (results.length === 0) return res.status(400).send("Examen introuvable");

    // Preparer les valeurs
    const sql = `
      INSERT INTO questions 
      (exam_lien, type, text, duree, note, option1, option2, option3, option4, correct_options, reponce, tolerance, image_url, video_url, audio_url)
      VALUES ?`;

    const values = questions.map(q => [
      exam_lien,
      q.type || 'qcm',
      q.question || '',
      q.duree || 0,
      q.note || 0,
      q.choices?.[0] || '',
      q.choices?.[1] || '',
      q.choices?.[2] || '',
      q.choices?.[3] || '',
      JSON.stringify(q.correct || []),
      q.reponce || '',
      q.tolerance || 0,
      q.image || '',
      q.video || '',
      q.audio || ''
    ]);

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Erreur insertion questions:', err);
        return res.status(500).send('Erreur serveur');
      }
      res.json({ message: "Questions enregistrees avec succes" });
    });
  });
});

// Recuperer les questions d'un examen
router.get('/questions/:exam_lien', (req, res) => {
  const db = req.app.get('db')
  const exam_lien = req.params.exam_lien

  const sql = `
    SELECT q.*
    FROM questions q
    JOIN examens e ON q.exam_lien = e.exam_lien
    WHERE e.exam_lien = ?
  `
  db.query(sql, [exam_lien], (err, results) => {
    if (err) {
      console.error('Erreur recuperation questions:', err)
      return res.status(500).send('Erreur serveur')
    }
    res.json(results)
  })
})

// Soumettre les reponses
router.post('/submit/:exam_lien', (req, res) => {
  const db = req.app.get('db')
  const exam_lien = req.params.exam_lien
  const { reponces } = req.body

  const sql = `
    SELECT q.id, q.reponce
    FROM questions q
    JOIN examens e ON q.exam_lien = e.exam_lien
    WHERE e.exam_lien = ?
  `
  
  db.query(sql, [exam_lien], (err, results) => {
    if (err) {
      console.error('Erreur soumission:', err)
      return res.status(500).send('Erreur serveur')
    }

    let score = 0
    reponces.forEach(ans => {
      const q = results.find(q => q.id === ans.questionId)
      if (q && q.reponce === ans.reponce) score += 10
    })

    res.json({ score })
  })
})

// -------------------------------
// const app = express();
// app.get('/get-questions', (req, res) => {
//   const examLien = req.query.exam_lien;
//   if (!examLien) return res.status(400).json({ error: "exam_lien manquant" });

//   db.query('SELECT * FROM questions WHERE exam_lien = ?', [examLien], (err, results) => {
//     if (err) return res.status(500).json({ error: "Erreur serveur" });
//     res.json({ questions: results });
//   });
// });
// -------------------------------

// Route pour recuperer les questions par exam_lien
router.get('/get-questions', (req, res) => {
  const db = req.app.get('db');
  const { exam_lien } = req.query;

  const sql = `SELECT * FROM questions WHERE exam_lien = ?`;
  db.query(sql, [exam_lien], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des questions:', err);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
});

// Supprimer toutes les questions d'un examen donne
router.post('/supprimer-questions', async (req, res) => {
  const { exam_lien } = req.body;

  if (!exam_lien) {
    return res.status(400).json({ error: "exam_lien manquant" });
  }

  try {
    const sql = "DELETE FROM questions WHERE exam_lien = ?";
    const db = req.app.get('db');
    await db.promise().query(sql, [exam_lien]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur lors de la suppression des questions:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;

