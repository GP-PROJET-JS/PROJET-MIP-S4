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

// fnct deconnecter
function deconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    /*localStorage.removeItem("selectedExam");*/
    window.location.href = "../connexion/conn.html";
}

const token = localStorage.getItem("token");
const usertype = localStorage.getItem("usertype");
if (!token || usertype !== "etudiant") {
    alert("Vous devez vous connecter !");
    window.location.href = "../connexion/conn.html";
}
//...............................................
//  
/*function entrerExam() {
const lien = document.getElementById('examLien').value.trim();
if (!lien) {
    alert("Veuillez entrer un lien d'examen valide.");
    return;
}
const exam = { exam_lien: lien };
localStorage.setItem("selectedExam", JSON.stringify(exam));
window.location.href = "affichage/espace_affiche.html"; // Redirige vers l'espace d'examen
}*/

function entrerExam() {
    const lien = document.getElementById('examLien').value.trim();
    if (!lien) {
      alert("Veuillez entrer un lien d'examen valide.");
      return;
    }

    // Récupération de la géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const exam = {
            exam_lien: lien,
            localisation: {
              latitude: latitude,
              longitude: longitude
            }
          };

          localStorage.setItem("selectedExam", JSON.stringify(exam));
          window.location.href = "affichage/espace_affiche.html"; // Redirige vers l'espace d'examen
        },
        function(error) {
          alert("La géolocalisation a échoué ou a été refusée. Veuillez l'activer pour continuer.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }
  