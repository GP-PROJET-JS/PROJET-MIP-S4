// side barre
const checkbox = document.querySelector("#menu-check");
const aside = document.querySelector(".aside");
const overlay = document.querySelector("#overlay");

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        aside.classList.add("visible")
        overlay.classList.add("active")
    } else {
        aside.classList.remove("visible")
        overlay.classList.remove("active")
    }
})

overlay.addEventListener("click", () => {
    aside.classList.remove("visible")
    overlay.classList.remove("active")
    checkbox.checked = false
})

function deconnecter() {
  localStorage.removeItem("token")
  localStorage.removeItem("usertype")
  window.location.href = "../connexion/conn.html"
}
//...............................................
const createExamBtn = document.getElementById('create-exam')
const tabButtons = document.querySelectorAll('.tab')
const examDisplay = document.getElementById('exam-display')

// form cree exam
const form = document.getElementById('exam-form');
// const exams = JSON.parse(localStorage.getItem('exams')) || [];
let currentExam = {}

const token = localStorage.getItem("token")
if (!token) {
  alert("Vous devez vous connecter !");
  window.location.href = "../connexion/conn.html"
  
}
const decoded = JSON.parse(atob(token.split('.')[1]))
const ensId = decoded.id
// const utilisateur = JSON.parse(localStorage.getItem('utilisateurConnecte'))
// if (!utilisateur || utilisateur.usertype !== 'enseignant') {
//   alert("Vous devez vous connecter en tant qu'enseignant !");
//   window.location.href = "../connexion/conn.html";
// }

// recuperation des donner directemant de db
let exams = [];
fetch(`/examens/${ensId}`)
  .then(res => res.json())
  .then(data => {
    exams = data
    renderExamsByClass("S1")
    document.querySelector('.tab[data-class="S1"]').classList.add('active')
  })
  .catch(err => {
    console.error("Erreur lors du chargement des examens:", err)
  })
// 
form.onsubmit = (event) => {
  event.preventDefault()
  currentExam = {
    name: document.getElementById('exam-name').value,
    description: document.getElementById('exam-desc').value,
    semestre: document.getElementById('semestre').value,
    id: ensId
  }

  // exams.push(currentExam);
  // localStorage.setItem('exams', JSON.stringify(exams));
  renderExamsByClass(currentExam.semestre)
  // envoie au db
  fetch('/ajouter-examen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(currentExam)
  })
  .then(res => res.json())
  .then(data => {
    window.location.reload()
    alert(data.message)
    window.location.href = 'espaceExam/espace_exam.html'
    // currentExam.exam_lien = data.exam_lien;
    // exams.push(currentExam);
    // localStorage.setItem('exams', JSON.stringify(exams));
  })
  .catch(err => {
    console.error('Erreur envoi :', err)
  })
}

// creat ele card
function renderExamsByClass(level) {
  examDisplay.innerHTML = ''
  exams.filter(e => e.semestre === level).forEach(exam => {
    const card = document.createElement('div')
    card.className = 'exam-card'
    card.innerHTML = `
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="infotop">${exam.exam_nom}<br>
        <div class="name">${exam.exam_desc || `<br>`}</div><br>
        <div class="name">${exam.semestre}</div><br>
        <div class="name" style="font-size: 16px;">
          <div style="cursor: text;margin-bottom: -14px;"> <span style="color:yellow;">🔗Lien:</span> ${exam.exam_lien || 'Lien non généré'}</div><br><br>
          <button class="btn-delete" data-id="${exam.exam_id}">Supprimer</button>
          </div>
      </div>`
    card.onclick = () => {
      localStorage.setItem('selectedExam', JSON.stringify(exam))
      window.location.href = 'espaceExam/espace_exam.html'
    }
    // supprimer exam card de db
    const deleteBtn = card.querySelector('.btn-delete')
    deleteBtn.onclick = (e) => {
      e.stopPropagation()
      if (!confirm("vous etes sure de supprimer ce exam ?")) return
      const examId = deleteBtn.dataset.id
      // const index = exams.findIndex(ex => ex.exam_lien === examLien);
      // if (index !== -1) {
      //   // supprimer de localStorage
      //   exams.splice(index, 1);
      //   localStorage.setItem('exams', JSON.stringify(exams));
      //   renderExamsByClass(level);
      // }
      // supprimer de db
      fetch(`/supprimer-examen/${examId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        })
        .then(res => res.text())
        .then(msg => {
          console.log(msg)
          return fetch(`/examens/${ensId.id}`)
        })
        .then(res => res.json())
        .then(data => {
          exams = data
          renderExamsByClass(level)
        })
        .catch(err => {
          console.error("Erreur lors de la suppression du serveur:", err)
        })
      }
    examDisplay.appendChild(card)
  })
}

// bouton semestre
tabButtons.forEach((btn) => {
  btn.onclick = () => {
    tabButtons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    renderExamsByClass(btn.dataset.class)
  }
})

renderExamsByClass("S1")
document.querySelector('.tab[data-class="S1"]').classList.add('active')

// fleche pour passage de card
let scrollPosition = 0
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')

const cardWidth = 237
prevBtn.onclick = () => {
  scrollPosition -= cardWidth * 1
  if (scrollPosition < 0) scrollPosition = 0
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' })
}

nextBtn.onclick = () => {
  scrollPosition += cardWidth * 1
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' })
}
