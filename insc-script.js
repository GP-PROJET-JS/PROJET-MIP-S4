// menu barre
const checkbox = document.querySelector("#menu-check")
const menu = document.querySelector(".menu")

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    menu.classList.add("visible")
  } else {
    menu.classList.remove("visible")
  }
})

// etudiant + enseignant
const Etudiant = document.querySelector(".Etudiant")
const Enseignant = document.querySelector(".Enseignant")
const submit = document.querySelector(".submit")
Etudiant.onclick = function () {
    Etudiant.classList.add('Etudiant_activer')
    Enseignant.classList.remove('Enseignant_activer')
    msj = document.querySelector(".message").innerHTML = "S\'inscrire Comme Etudiant :"
    type = document.querySelector("#type").value = "Etudiant"
    // console.log(type)
    submit.style.backgroundColor = "royalblue"

    submit.addEventListener("mouseover", () => {
        submit.style.backgroundColor = "rgb(56, 90, 194)";
    })
    submit.addEventListener("mouseout", () => {
        submit.style.backgroundColor = "royalblue";
    })
}

Enseignant.onclick = function () {
    Enseignant.classList.add('Enseignant_activer')
    Etudiant.classList.remove('Etudiant_activer')
    msj = document.querySelector(".message").innerHTML = "S\'inscrire Comme Enseignant :"
    type = document.querySelector("#type").value = "Enseignant"
    // console.log(type)
    submit.style.backgroundColor = "brown"

    submit.addEventListener("mouseover", () => {
        submit.style.backgroundColor = "rgb(125, 32, 32)";
    })
    submit.addEventListener("mouseout", () => {
        submit.style.backgroundColor = "brown";
    })
}

function allerAConnexion() {
    window.location.href = "conn.html"
    alert("Compte bien Crier, essayer de se connecter")
    return false
}



