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

const token = localStorage.getItem("token")
if (!token) {
  alert("Vous devez vous connecter !");
  window.location.href = "../connexion/conn.html"
}

// debut form cree exam
const form = document.getElementById('exam-form');
let currentExam = {}

const decoded = JSON.parse(atob(token.split('.')[1]))
const ensId = decoded.id

// recuperation des examens depuis la base de donnees
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

// soumission du formulaire
form.onsubmit = (event) => {
  event.preventDefault()
  currentExam = {
    name: document.getElementById('exam-name').value,
    description: document.getElementById('exam-desc').value,
    semestre: document.getElementById('semestre').value,
    id: ensId
  }

  fetch('/ajouter-examen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(currentExam)
  })
  .then(res => res.json())
  .then(data => {
    currentExam.exam_lien = data.exam_lien;

    // Stocker dans localStorage avant redirection
    localStorage.setItem('selectedExam', JSON.stringify(currentExam));
    
    // alert(data.message);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: data.message
    });
    setTimeout(() => {
      window.location.href = 'espaceExam/espace_exam.html'
    }, 2000);
    // window.location.href = 'espaceExam/espace_exam.html'
  })
  .catch(err => {
    console.error('Erreur envoi :', err)
  })
}

// afficher les examens selon le semestre
function renderExamsByClass(level) {
  examDisplay.innerHTML = ''
  exams.filter(e => e.semestre === level).forEach(exam => {
    const card = document.createElement('div');
    card.className = 'exam-card';
    card.innerHTML = `
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="infotop">${exam.exam_nom}<br>
        <div class="name">${exam.exam_desc || `<br>`}</div><br>
        <div class="name">${exam.semestre}</div><br>
        <div class="lienDiv" class="name" style="font-size: 16px;">
          <div style="cursor: default; margin-bottom: -34px; padding: 10px;">
            <span style="color:yellow;">🔗</span> 
            <span class="lienText">${exam.exam_lien || 'Lien non genere'}</span>
            <button class="copyBtn" style="background:none; border:none; cursor:pointer;" title="Copier">📝</button>
          </div><br><br>
          <button class="btn-delete" data-id="${exam.exam_id}">Supprimer</button>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      localStorage.setItem('selectedExam', JSON.stringify(exam));
      window.location.href = `espaceExam/espace_exam.html?exam_lien=${exam.exam_lien}`;
    });

    const lienDiv = card.querySelector(".lienDiv");
    lienDiv.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    const copyBtn = lienDiv.querySelector(".copyBtn");
    copyBtn.addEventListener("click", (e) => {
      const lienText = lienDiv.querySelector(".lienText").innerText.trim();
      navigator.clipboard.writeText(lienText).then(() => {
        showCopiedMessage(copyBtn);
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    });

    function showCopiedMessage(element) {
      const message = document.createElement('div');
      message.textContent = 'Lien copié!';
      message.style.position = 'fixed';
      message.style.background = '#4caf50';
      message.style.color = 'white';
      message.style.padding = '5px 10px';
      message.style.borderRadius = '10px';
      message.style.top = '20px';
      message.style.right = '20px';
      message.style.zIndex = 1000;
      message.style.fontSize = '14px';
      message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      
      document.body.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 2000);
    }

    // supprimer examen
    const deleteBtn = card.querySelector('.btn-delete')
    deleteBtn.onclick = (e) => {
      e.stopPropagation()
      // if (!confirm("vous etes sure de supprimer ce exam ?")) return

      Swal.fire({
        title: "<span style=\"font-family: Arial;\">vous etes sure de supprimer ce exam ?</span>",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "oui, supprimer",
        cancelButtonText: "annuler"
      }).then((result) => {
        if (result.isConfirmed) {
          const examId = deleteBtn.dataset.id;
    
          fetch(`/supprimer-examen/${examId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(res => res.text())
          .then(msg => {
            console.log(msg);
            Swal.fire({
              title: "exam bien supprime",
              text: "",
              icon: "success"
            });
            return fetch(`/examens/${ensId}`)
          })
          .then(res => res.json())
          .then(data => {
            exams = data
            renderExamsByClass(level)
          })
          .catch(err => {
            console.error("Erreur lors de la suppression du serveur:", err)
          })
        } else return;
      })
    }

    examDisplay.appendChild(card)
  })
}

// changer de semestre
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

const cardWidth = 220
prevBtn.onclick = () => {
  scrollPosition -= cardWidth * 1 + 20
  if (scrollPosition < 0) scrollPosition = 0
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' })
}

nextBtn.onclick = () => {
  scrollPosition += cardWidth * 1 + 20
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' })
}
