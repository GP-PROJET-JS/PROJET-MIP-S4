
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
Etudiant.onclick = function () {
    Etudiant.classList.add('Etudiant_activer')
    Enseignant.classList.remove('Enseignant_activer')
    msj = document.querySelector(".message").innerHTML = "Se Connecter Comme Etudiant :"
    type = document.querySelector("#type").value = "etudiant"
    // console.log(type)
    submit = document.querySelector(".submit")
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
    msj = document.querySelector(".message").innerHTML = "Se Connecter Comme Enseignant :"
    type = document.querySelector("#type").value = "enseignant"
    // console.log(type)
    submit = document.querySelector(".submit")
    submit.style.backgroundColor = "brown"

    submit.addEventListener("mouseover", () => {
        submit.style.backgroundColor = "rgb(125, 32, 32)"
    });
    submit.addEventListener("mouseout", () => {
        submit.style.backgroundColor = "brown"
    });  
}

// verification connection
function seConnecter(event) {
  event.preventDefault()

  const email = document.querySelector('input[name="email"]').value
  const mdp = document.querySelector('input[name="mdp"]').value
  const usertype = document.querySelector('#type').value

  fetch("/connexion", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mdp, usertype })
  })
  .then(res => {
    if (!res.ok) throw new Error("Echec de connexion")
      return res.json();
  })
  // Réinitialiser les couleurs et les messages
  .then(data => {
    document.querySelectorAll("span").forEach((e) => {
      e.style.color = "green"
    })
    const errMsg = document.querySelector("#error-message")
    errMsg.innerText = ""

    // Stocker le token dans localStorage
    localStorage.setItem("token", data.token)
    localStorage.setItem("usertype", data.usertype)
    localStorage.setItem("utilisateurConnecte", JSON.stringify({
      id: data.id,
      usertype: data.usertype
    }))
    // Rediriger selon le type d'utilisateur
    const msg = document.getElementById("success-message")
    msg.innerHTML = "✅ Bienvenu ! Redirection en cours..."
    msg.classList.add("show")
    setTimeout(() => {
      if (data.usertype === "etudiant") {
            window.location.href = "../espaceEtd/Espace_Etd.html" // !!!!!
          } else {
            window.location.href = "../espaceEns/Espace_Ens.html"
          }
    }, 2000)
    //
    // setTimeout(() => {
    //   if (data.usertype === "etudiant") {
    //     window.location.href = "../espaceEtd/espaceEtd.html" // !!!!!
    //   } else {
    //     window.location.href = "../espaceEns/Espace_Ens.html"
    //   }
    // }, 500)
  })
  // Traiter les Errors
  .catch(err => {
    const errMsg = document.querySelector("#error-message")
    errMsg.style.color = "red"
    errMsg.innerText = "email ou mot de passe incorrect !"
    document.querySelectorAll("label span").forEach((e)=> {
      e.style.color = "red"
    })
  });
  
}
