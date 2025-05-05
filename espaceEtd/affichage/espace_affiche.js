
let questions = [];
let current = 0;
let timer = 30;
let reponces = [];
let interval;

const selectedExam = localStorage.getItem("selectedExam");
const examLien = selectedExam ? JSON.parse(selectedExam).exam_lien : null;

window.onload = () => {
  if (!examLien) {
    alert("Aucun examen sélectionné.");
    window.location.href = "../connexion/conn.html";
    return;
  }

  fetch(`/questions/${examLien}`)
    .then(res => res.json())
    .then(data => {
      questions = data.map(q => {
        if (q.type === "qcm") {
          q.correct_answers = JSON.parse(q.correct_options || "[]").map(index => {
            index = parseInt(index);
            return [q.option1, q.option2, q.option3, q.option4][index];
          });
        }
        if (q.type === "directe" && typeof q.reponce === "string") {
          q.correct_answers = [q.reponce.trim()];
        }
        return q;
      });

      if (questions.length === 0) {
        alert("Aucune question disponible pour cet examen.");
        window.location.href = "../connexion/conn.html";
      } else {
        showQuestion();
        startTimer();
      }
    })
    .catch(err => console.error("Erreur lors du chargement des questions:", err));
};

function showQuestion() {
  clearInterval(interval);
  const container = document.getElementById("exam-container");

  container.className = "exam-card";  // Ajoute la classe CSS

  container.innerHTML = "";
  const question = questions[current];

  // Affichage des médias
  if (question.image_url) {
    const img = document.createElement("img");
    img.src = question.image_url;
    img.style.maxWidth = "100%";
    img.style.margin = "10px 0";
    container.appendChild(img);
  }

  if (question.audio_url) {
    const audio = document.createElement("audio");
    audio.src = question.audio_url;
    audio.controls = true;
    container.appendChild(audio);
  }

  if (question.video_url) {
    const video = document.createElement("video");
    video.src = question.video_url;
    video.controls = true;
    video.style.maxWidth = "100%";
    container.appendChild(video);
  }

  const qText = document.createElement("h2");
  qText.textContent = question.text;
  container.appendChild(qText);

  if (question.type === "qcm") {
    const selectedOptions = [];

    ["option1", "option2", "option3", "option4"].forEach(opt => {
      if (question[opt]) {
        const btn = document.createElement("button");
        btn.textContent = question[opt];
        btn.classList.add("option-button");
        btn.onclick = () => {
          const index = selectedOptions.indexOf(question[opt]);
          if (index === -1) {
            selectedOptions.push(question[opt]);
            btn.classList.add("selected");
          } else {
            selectedOptions.splice(index, 1);
            btn.classList.remove("selected");
          }
        };
        container.appendChild(btn);
      }
    });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Suivant";
    nextBtn.classList.add("next-button");
    nextBtn.onclick = () => handleReponce(selectedOptions);
    container.appendChild(nextBtn);

  } else if (question.type === "directe") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Votre réponse ici...";
    input.style.width = "98%";
    input.style.height = "30px";
    container.appendChild(input);

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Suivant";
    submitBtn.onclick = () => handleReponce(input.value);
    container.appendChild(submitBtn);
  }
}

function startTimer() {
  timer = questions[current].duree || 30;
  interval = setInterval(() => {
    document.getElementById("timer").textContent = `Temps : ${timer}s`;
    if (--timer < 0) {
      handleReponce(null);
    }
  }, 1000);
}

function handleReponce(reponce) {
  clearInterval(interval);
  reponces.push({ questionId: questions[current].id, reponce: reponce });
  current++;
  if (current < questions.length) {
    showQuestion();
    startTimer();
  } else {
    submitExam();
  }
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  a = a.map(x => x.toLowerCase().trim()).sort();
  b = b.map(x => x.toLowerCase().trim()).sort();
  return JSON.stringify(a) === JSON.stringify(b);
}

function submitExam() {
  let totalPoints = 0;
  let pointsObtenus = 0;

  questions.forEach((question) => {
    const note = question.note || 1;
    totalPoints += note;

    const userRepObj = reponces.find(r => r.questionId === question.id);
    if (!userRepObj) return;

    const userRep = userRepObj.reponce;

    if (question.type === "qcm") {
      const bonnes = question.correct_answers || [];
      if (arraysEqual(bonnes, userRep)) {
        pointsObtenus += note;
      }

    } else if (question.type === "directe") {
      const bonne = (question.correct_answers?.[0] || "").toLowerCase().trim();
      const user = (userRep || "").toLowerCase().trim();
      if (user === bonne) {
        pointsObtenus += note;
      }
    }
  });

  const scoreFinal = totalPoints > 0 ? Math.round((pointsObtenus / totalPoints) * 100) : 0;

  document.getElementById("exam-container").innerHTML = "";
  document.getElementById("timer").textContent = "";
  document.getElementById("score").textContent = `Votre score : ${scoreFinal}/100`;

  fetch(`/submit/${examLien}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reponces: reponces, score: scoreFinal })
  }).catch(err => console.error("Erreur lors de la soumission:", err));
}
