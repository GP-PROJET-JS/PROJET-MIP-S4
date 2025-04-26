const form = document.getElementById('exam-form');

const questionSection = document.getElementById('question-section');
const qcmBtn = document.getElementById('qcm-btn');
const repBtn = document.getElementById('rep-btn');
const qcmForm = document.getElementById('qcm-form');
const repForm = document.getElementById('rep-form');
const addQcmAnswer = document.getElementById('add-qcm-answer');
const qcmAnswers = document.getElementById('qcm-answers');
const addQuestionBtn = document.getElementById('add-question');
const finishBtn = document.getElementById('finish');

let currentExam = {};
let questions = [];

// form.onsubmit = (e) => {
//   e.preventDefault();
//   currentExam = {
//     name: document.getElementById('exam-name').value,
//     subject: document.getElementById('subject').value,
//     major: document.getElementById('major').value,
//     questions: []
//   };
//   questionSection.classList.remove('hidden');
//   form.classList.add('hidden');
// };

qcmBtn.onclick = () => {
  qcmBtn.classList.add('active');
  repBtn.classList.remove('active');
  qcmForm.classList.remove('hidden');
  repForm.classList.add('hidden');
};

repBtn.onclick = () => {
  repBtn.classList.add('active');
  qcmBtn.classList.remove('active');
  repForm.classList.remove('hidden');
  qcmForm.classList.add('hidden');
};

addQcmAnswer.onclick = () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Réponse QCM';
  qcmAnswers.appendChild(input);
};

addQuestionBtn.onclick = () => {
  if (qcmBtn.classList.contains('active')) {
    const question = document.getElementById('qcm-question').value;
    const answers = Array.from(qcmAnswers.querySelectorAll('input')).map(input => input.value);
    currentExam.questions.push({ type: 'qcm', question, answers });
    document.getElementById('qcm-question').value = '';
    qcmAnswers.innerHTML = '';
  } else {
    const question = document.getElementById('rep-question').value;
    const answer = document.getElementById('rep-answer').value;
    currentExam.questions.push({ type: 'rep', question, answer });
    document.getElementById('rep-question').value = '';
    document.getElementById('rep-answer').value = '';
  }
};

finishBtn.onclick = () => {
  let exams = JSON.parse(localStorage.getItem('exams')) || [];
  exams.push(currentExam);
  localStorage.setItem('exams', JSON.stringify(exams));
  window.location.href = '../Espace_Ens.html';
};
