// menu barre
const checkbox = document.querySelector("#menu-check")
const menu = document.querySelector(".menu")

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        menu.classList.add("visible")
        overlay.classList.toggle("active")
    } else {
        menu.classList.remove("visible")
        overlay.classList.remove("active")
    }
})

const overlay = document.querySelector("#overlay")
overlay.addEventListener("click", () => {
    menu.classList.remove("visible")
    overlay.classList.remove("active")
    checkbox.checked = false
})

// etudiant + enseignant
const Etudiant = document.querySelector(".Etudiant")
const Enseignant = document.querySelector(".Enseignant")
const submit = document.querySelector(".submit")
Etudiant.onclick = function () {
    Etudiant.classList.add('Etudiant_activer')
    Enseignant.classList.remove('Enseignant_activer')
    msj = document.querySelector(".message").innerHTML = "S\'inscrire Comme Etudiant :"
    type = document.querySelector("#type").value = "etudiant"
    // console.log(type)
    submit.style.backgroundColor = "royalblue"

    submit.addEventListener("mouseover", () => {
        submit.style.backgroundColor = "rgb(56, 90, 194)"
    })
    submit.addEventListener("mouseout", () => {
        submit.style.backgroundColor = "royalblue"
    })
}
Enseignant.onclick = function () {
    Enseignant.classList.add('Enseignant_activer')
    Etudiant.classList.remove('Etudiant_activer')
    msj = document.querySelector(".message").innerHTML = "S\'inscrire Comme Enseignant :"
    type = document.querySelector("#type").value = "enseignant"
    // console.log(type)
    submit.style.backgroundColor = "brown"

    submit.addEventListener("mouseover", () => {
        submit.style.backgroundColor = "rgb(125, 32, 32)"
    })
    submit.addEventListener("mouseout", () => {
        submit.style.backgroundColor = "brown"
    })
}

// verification form
function validerFormulaire(event) {
    let estValide = true
    
    const mdp = document.querySelector('input[name="mdp"]')
    const confirmMdp = document.querySelector('input[name="confirm_mdp"]')
    const dateNaissance = document.querySelector('input[name="date_naissance"]')
    const selectSexe = document.querySelector('select[name="sexe"]')

    if (selectSexe.value === "Selectioner") {
        document.getElementById("error-sexe").style.color = "red"
        estValide = false
    }else{
        document.getElementById("error-sexe").style.color = "green"
    }

    const birthDate = new Date(dateNaissance.value)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    
    if (age < 10 || age > 100 || isNaN(age)) {
        document.getElementById("error-naissance").style.color = "red"
        document.getElementById("error-naissance").innerHTML = "L'age doit etre entre 10 et 100 ans"
        estValide = false;
    }else{
        document.getElementById("error-naissance").style.color = "green"
        document.getElementById("error-naissance").innerHTML = "Date de naissance"
    }

    if (mdp.value !== confirmMdp.value) {
        document.getElementById("error-mdp").style.color = "red"
        document.getElementById("error-mdp").innerHTML = "mots de passe ne pas correspondent"
        estValide = false;
    }else{
        document.getElementById("error-mdp").style.color = "green"
        document.getElementById("error-mdp").innerHTML = "Confirmer Mot de Pass"
    }
    
    event.preventDefault()
    if (estValide) {
        const formData = new FormData(document.querySelector("form"))
        fetch("/inscription", {
            method: "POST",
            body: new URLSearchParams(formData)
        })
        .then(res => res.text())
        .then(data => {
            const msg = document.getElementById("success-message")
            document.getElementById("up").scrollIntoView({ behavior: "smooth" })
            msg.innerHTML = "✅ Inscription réussie ! Esayer de Se connecter..."
            msg.classList.add("show")
            setTimeout(() => {
                window.location.href = "../connexion/conn.html"
            }, 3000)
        })
    }
    return estValide;
}

