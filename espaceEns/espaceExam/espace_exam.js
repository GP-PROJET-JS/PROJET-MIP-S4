
let questions = [];

// recuperer exam_lien 
const urlParams = new URLSearchParams(window.location.search);
const exam_lien = urlParams.get('exam_lien');


function chargerQuestions() {

  fetch(`/get-questions?exam_lien=${exam_lien}`)
    .then(res => res.json())
    .then(data => {
      questions = data.map(q => ({
        id: q.id,
        question: q.text || '',             
        duree: q.duree || 0,
        note: q.note || 0,
        type: q.type || 'qcm',
        choices: [q.option1, q.option2, q.option3, q.option4],
        correct: JSON.parse(q.correct_options || '[]'),         
        correct_options: q.correct_options || '[]',            
        reponce: q.reponce || '',
        tolerance: q.tolerance || 0,
        image: q.image_url || '',
        video: q.video_url || '',
        audio: q.audio_url || ''
      }));
      renderQuestions();
    })
    .catch(err => console.error("Erreur chargement des questions:", err));
}

let currentQuestionType = 'qcm';

// Sauvegarde dans le localStorage
function saveToLocalStorage() {
  localStorage.setItem('questions', JSON.stringify(questions));
}

// Affichage des questions
function renderQuestions() {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'question-card';

    div.innerHTML = `
      <div class="media-preview">
        ${q.image ? `<img src="${q.image}" />` : ''}
        ${q.video ? `<video controls src="${q.video}"></video>` : ''}
        ${q.audio ? `<audio controls src="${q.audio}"></audio>` : ''}
      </div>

      <div style="display: flex;">
        <label>Question:</label>
        <input type="text" class="form-control mb-2" value="${q.question}" oninput="updateQuestion(${q.id}, this.value)" style="width: 58%;margin: 0 10px;"/>
        <label>Durée:</label>
        <input type="number" class="form-control mb-2" value="${q.duree}" oninput="updateDuree(${q.id}, this.value)" style="width: 10%;margin: 0px 10px;"/>
        <label>Note:</label>
        <input type="number" class="form-control mb-2" value="${q.note}" oninput="updateNote(${q.id}, this.value)" style="width: 10%;margin: 0 0 0 10px;"/>
      </div>

      <div class="mb-2">
        <button class="btn ${q.type === 'qcm' ? 'btn-success' : 'btn-outline-success'} btn-sm me-2" onclick="setQuestionType(${q.id}, 'qcm')">QCM</button>
        <button class="btn ${q.type === 'directe' ? 'btn-success' : 'btn-outline-success'} btn-sm" onclick="setQuestionType(${q.id}, 'directe')">Question Directe</button>
      </div>

      ${q.type === 'qcm' ? getQcmInputs(q) : getreponceInput(q)}

      <div class="media-buttons mt-2">
        <button class="btn btn-outline-secondary" onclick="uploadFile(${q.id}, 'image')">Image</button>
        <button class="btn btn-outline-secondary" onclick="uploadFile(${q.id}, 'video')">Vidéo</button>
        <button class="btn btn-outline-secondary" onclick="uploadFile(${q.id}, 'audio')">Audio</button>
      </div>

      <button class="btn btn-outline-danger mt-2" onclick="supprimerQuestion(${q.id})">Supprimer la question</button>
    `;

    container.appendChild(div);
  });
}

// Mise a jour type de question
function setQuestionType(id, type) {
  const q = questions.find(q => q.id === id);
  if (q) {
    q.type = type;
    saveToLocalStorage();
    renderQuestions();
  }
}

// Entree QCM
function getQcmInputs(q) {
  return q.choices.map((choice, index) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" name="qcm_${q.id}" ${q.correct.includes(index) ? 'checked' : ''} onchange="toggleCorrect(${q.id}, ${index})">
      <input type="text" class="form-control" value="${choice}" oninput="updateChoice(${q.id}, ${index}, this.value)">
    </div>
  `).join('');
}

// Entree Q directe
function getreponceInput(q) {
  return `
    <label class="mt-2">Vrai Réponse :</label>
    <input type="text" class="form-control" value="${q.reponce || ''}" oninput="updatereponce(${q.id}, this.value)" />
    <label class="mt-2">Tolérance (%):</label>
    <input type="number" class="form-control" min="0" max="100" value="${q.tolerance || 0}" oninput="updateTolerance(${q.id}, this.value)" />
  `;
}

// Fonctions de mise a jour
function updateQuestion(id, text) {
  const q = questions.find(q => q.id === id);
  if (q) { q.question = text; saveToLocalStorage(); }
}

function updateDuree(id, number) {
  const q = questions.find(q => q.id === id);
  if (q) { q.duree = number; saveToLocalStorage(); }
}

function updateNote(id, number) {
  const q = questions.find(q => q.id === id);
  if (q) { q.note = number; saveToLocalStorage(); }
}

function updateChoice(id, index, value) {
  const q = questions.find(q => q.id === id);
  if (q) { q.choices[index] = value; saveToLocalStorage(); }
}

function toggleCorrect(id, index) {
  const q = questions.find(q => q.id === id);
  if (q) {
    const pos = q.correct.indexOf(index);
    if (pos > -1) {
      q.correct.splice(pos, 1);
    } else {
      q.correct.push(index);
      q.correct.sort((a, b) => a - b);
    }
    q.correct_options = JSON.stringify(q.correct);
    saveToLocalStorage();
  }
}

function updatereponce(id, value) {
  const q = questions.find(q => q.id === id);
  if (q) { q.reponce = value; saveToLocalStorage(); }
}

function updateTolerance(id, value) {
  const q = questions.find(q => q.id === id);
  if (q) { q.tolerance = parseInt(value); saveToLocalStorage(); }
}

// Ajouter une question
function ajouterQuestion(type) {
  const id = Date.now();
  questions.push({
    id, 
    question: '', 
    duree: '', 
    note: '',
    type, 
    choices: ['', '', '', ''],
    correct: [], 
    reponce: '', 
    tolerance: 0,
    image: '', 
    video: '', 
    audio: ''
  });
  saveToLocalStorage();
  renderQuestions();
}

// Supprimer question
function supprimerQuestion(id) {
  questions = questions.filter(q => q.id !== id);
  saveToLocalStorage();
  renderQuestions();
}

// Supprimer tout
function supprimerTous() {
  questions = [];
  saveToLocalStorage();
  renderQuestions();
}

// ---------------------------------------------------------------------
// Upload fichier
function uploadFile(id, type) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = `${type}/*`;

  input.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // cree un lien tmp

      const q = questions.find(q => q.id === id);
      if (q) {
        q[type] = fileURL;
        saveToLocalStorage();
        renderQuestions();
      }
    }
  });

  input.click();
}
// -----------------------------------------------------------------------

// Terminer & envoyer les questions
document.getElementById('terminer').addEventListener('click', async () => {
  const selectedExam = JSON.parse(localStorage.getItem('selectedExam'));
  const exam_lien = selectedExam ? selectedExam.exam_lien : null;

  if (!exam_lien) {
    alert("Le lien de l'examen est manquant.");
    return;
  }
  try {
    // Supprimer les anciennes questions
    const deleteResponse = await fetch('/supprimer-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam_lien })
    });

    if (!deleteResponse.ok) {
      throw new Error("Échec lors de la suppression des anciennes questions.");
    }

    // Enregistrer les nouvelles questions
    const response = await fetch('/ajouter-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions: questions.map(q => ({
          ...q,
          correct_options: JSON.stringify(q.correct)
        })),
        exam_lien
      })
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement des questions.");
    }

    const data = await response.json();
    alert('Examen bien enregistré !');
    localStorage.removeItem('questions');
    window.location.href = '../Espace_Ens.html';

  } catch (error) {
    console.error('Erreur :', error);
    alert("Une erreur s'est produite. Voir la console pour plus de détails.");
  }
});

// Boutons
document.getElementById('ajouterQuestion').addEventListener('click', () => ajouterQuestion(currentQuestionType));
document.getElementById('supprimerTous').addEventListener('click', supprimerTous);

chargerQuestions();
