const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

//Error
const error = document.querySelector(".error-message");


function home() {
    document.location.href = "index.html";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

const user = {
    email: email.value,
    password: password.value,
};


fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
})

    .then((response) => {
    
        if (response.ok) {
            return response.json();
        }
        else if (response.status === 404) {
            console.log("User not found");
            error.innerText = "Utilisateur inconnu";
        }
        else if (response.status === 401) {
            console.log("Unauthorized");
            error.innerText = "Erreur dans les informations de connexion";
        }
    })

//On récupère et on stock le token, et on redirige 
.then((data) => {
    sessionStorage.setItem("token", data.token);
    home();
})
.catch((error) => {
    console.log(error);
    error.innerText = "Erreur dans les informations de connexion";
});
})