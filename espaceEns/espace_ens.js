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

//...............................................
const createExamBtn = document.getElementById('create-exam');
const tabButtons = document.querySelectorAll('.tab');
const examDisplay = document.getElementById('exam-display');

// form cree axam
const form = document.getElementById('exam-form');
const exams = JSON.parse(localStorage.getItem('exams')) || [];
let currentExam = {};
form.onsubmit = (event) => {
  event.preventDefault()
  currentExam = {
    name: document.getElementById('exam-name').value,
    description: document.getElementById('exam-desc').value,
    semestre: document.getElementById('semestre').value,
  }
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  exams.push(currentExam);
  localStorage.setItem('exams', JSON.stringify(exams));
  renderExamsByClass(currentExam.semestre);
  window.location.href = 'espaceExam/espace_exam.html'
}
// create exam btn
createExamBtn.onclick = () => {
  //  ..........
};


// creat ele card
function renderExamsByClass(level) {
  examDisplay.innerHTML = '';
  exams.filter(e => e.semestre === level).forEach(exam => {
    const card = document.createElement('div');
    card.className = 'exam-card';
    card.innerHTML = `
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="infotop">${exam.name}<br>
      <div class="name">${exam.description}</div><br>
      <div class="name">${exam.semestre}</div></div>`;
    card.onclick = () => {
      localStorage.setItem('selectedExam', JSON.stringify(exam));
      window.location.href = 'espaceExam/espace_exam.html';
    };
    examDisplay.appendChild(card);
  });
}

tabButtons.forEach((btn) => {
  btn.onclick = () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderExamsByClass(btn.dataset.class);
  };
});

renderExamsByClass("S1");
document.querySelector('.tab[data-class="S1"]').classList.add('active');

// fleche pour passage de card
let scrollPosition = 0;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const cardWidth = 220;
prevBtn.onclick = () => {
  scrollPosition -= cardWidth * 2;
  if (scrollPosition < 0) scrollPosition = 0;
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' });
};

nextBtn.onclick = () => {
  scrollPosition += cardWidth * 2;
  examDisplay.scrollTo({ left: scrollPosition, behavior: 'smooth' });
};
