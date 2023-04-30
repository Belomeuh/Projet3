/* --- Sélection des éléments du DOM --- */
// Get gallery Mes Projets
const gallery = document.querySelector(".gallery");
// Get nav Filters
const navFilters = document.querySelector(".filters");

const modalGallery = document.querySelector(".modale_conteneur")


// Fonction pour créer un projet dans la galerie
const createProject = (project) => {
  const figureProject = document.createElement("figure");
  figureProject.setAttribute("data-tag", project.category.name);
  figureProject.setAttribute("data-id", project.id);

  const imageProject = document.createElement("img");
  imageProject.src = project.imageUrl;
  imageProject.alt = project.title;


  const figcaptionProject = document.createElement("figcaption");
  figcaptionProject.innerText = project.title;

  figureProject.appendChild(imageProject);
  figureProject.appendChild(figcaptionProject);
  gallery.appendChild(figureProject);
};

// Fonction pour créer un projet dans le modal
const createModalProject = (project) => {
  const figureModalProject = document.createElement("figure");
  figureModalProject.setAttribute("data-id", project.id);
  figureModalProject.innerHTML = `<a href="#" id="trash_can"><i class="fa-solid fa-trash-can"></i></a>`;

 // const trashIcon = document.querySelector("#trash_can");
 // trashIcon.addEventListener('click', (e)=> {
   // e.preventDefault();
    //deleteWork();
  //});

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
 
   const figcaptionModalProject = document.createElement("figcaption");
  figcaptionModalProject.innerText = ("éditer");

  figureModalProject.appendChild(imageModalProject);
  figureModalProject.appendChild(figcaptionModalProject);
  modalGallery.appendChild(figureModalProject); 
};


// Fonction pour créer un bouton dans la nav des filtres
const createButton = (category) => {
  const buttonFilters = document.createElement("button");
  buttonFilters.setAttribute("data-tag", category.name);
  buttonFilters.setAttribute("data-id", category.id);
  buttonFilters.innerText = category.name;
  navFilters.appendChild(buttonFilters); 
};



// Fonction qui permet d'effacer tous les éléments enfant d'un élément parent dans le DOM
const dropElement = (parent_element) => {
  // Tant qu'il y a au moins un enfant
  while (parent_element.childNodes.length > 0) {
    // On efface le dernier élément, le précédent devient le dernier, jusqu'à 0 enfants
    parent_element.removeChild(parent_element.lastChild);
  }
};

// Fonction qui récupère les works de l'API :
// si le paramètre catégorie Id est renseigné,
// on affiche que les works correspondant à cette caégorie
// Sinon on affiche tout
const getWorks = async (categoryId) => {
  // On appelle l'API works
  await fetch("http://localhost:5678/api/works")
    //Si le fetch fonctionne on récupère les données en .json; Sinon on affiche une erreur
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Erreur dans la récupération des données de l'API");
      }
    })
    //On récupère chaque projet
    //Auxquels on applique la fonction createProject
    .then((projects) => {
      // On efface tous les travaux pour avoir une page blanche
      dropElement(gallery); // Sur la gallery
      dropElement(modalGallery); // Sur le modal

      projects.forEach((project) => {
        //si categoryId est vide, on affiche tout
        //si categoryId est renseigné, On filtre les works sur la catégorie,
        if (categoryId == project.category.id || categoryId == null) {
          createProject(project); // Créé la galerie section portfolio 
          createModalProject(project);  // Créer la galerie dans le modal
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fonction qui récupère les categories de filtres de l'API
const getCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    // Si le fetch fonctionne on récupère les données en .json; Sinon on affiche une erreur
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Erreur dans la récupération des donnés de l'API");
      }
    })
    //On récupère chaque categorie
    .then((categories) => {
      //Auxquelles on applique la fonction createButton
      categories.forEach((category) => {
        createButton(category);        
      });
    })

    .then((filtre) => {
      //on récupère les boutons
      const buttons = document.querySelectorAll(".filters button");
      
      
      buttons.forEach((button) => {
        //Pour chaque bouton, au clic
        button.addEventListener("click", function () {
          // Get (et Affiche le data-tag)
          let buttonTag = button.dataset.tag;
          console.log(buttonTag);

          //Get catégorie id
          let categorieId = button.getAttribute("data-id");
          console.log(categorieId);

          //on enlève, pour chaque bouton la classe is-active
          buttons.forEach((button) => button.classList.remove("is-active"));
          //puis on ajoute la classe active au bouton cliqué
          this.classList.add("is-active");
          // On récupère les works de l'API en fonction des categories
          getWorks(categorieId);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fonction qui affiche le getWorks sans parametre (on affiche tout) + on affiche toutes les categories
const main = async () => {
  await getWorks();
  await getCategories();
};

//A l'ouverture de la page, on execute la fonction main (getWorks et getCategories)
main();

//Mode admin
const adminPage = () => {
//On récupère les éléments
body = document.querySelector("body")
photoSophie = document.querySelector(".photoSophie")
mesProjets = document.querySelector(".mesProjets")
//
 body.insertAdjacentHTML(
    "beforeBegin",
    `<div class="edit_bar">
      <span class="edit"><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>
      <button>publier les changements</button>
      </div>`
  );

photoSophie.insertAdjacentHTML(
  "afterend",
  `<a id="photoModif" href= "#" class="edit_link"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`
  );
mesProjets.insertAdjacentHTML(
  "BeforeEnd", 
  `<a id="modal_opener" href="#modale" class="edit_link"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`
  );

//On cache les filtres comme sur la maquette
document.querySelector(".filters").style.display = "none";  
document.querySelector(".mesProjets").style.margin = "108px 0px 92px 0px";

//On gère la partie logout
const logButton = document.querySelector("#login a");
logButton.innerText = `logout`;
//logButton.classList.add("logout");
logButton.addEventListener("click", (e)=> {
  e.preventDefault()
  sessionStorage.clear();
  document.location.href = "index.html";
});

//On ouvre le modal
modalOpening = document.querySelector("#modal_opener")
modalOpening.addEventListener("click", ()=> {
    document.querySelector(".modale_section").style.display = 'block';
    //On fait en sorte d'afficher le modale1 et non le modale2
    document.querySelector(".modale1").style.display = 'block';
    document.querySelector(".modale2").style.display = 'none';
  }
);

//Fonction pour supprimer un work
const deleteWork = (workID) => {
  fetch("http://localhost:5678/api/works" + workID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
  });
};

//On ferme le modal
modalClosing = document.querySelector(".closeModale")
modalClosing.addEventListener("click", (e)=> {
  e.preventDefault()
  document.querySelector(".modale_section").style.display = 'none';
});

//On gère le changement de modal
const modalSwipe = document.querySelector("#addButton")
modalSwipe.addEventListener("click", ()=> {
  document.querySelector(".modale1").style.display = 'none';
  document.querySelector(".modale2").style.display = 'block';
});

//Le retour du modale2 au modale1
const modalBack = document.querySelector(".arrow")
modalBack.addEventListener("click", (e)=> {
  e.preventDefault()
  document.querySelector(".modale2").style.display = 'none';
  document.querySelector(".modale1").style.display = 'block';
});

};

//Afficher les éléments adminPage si le token est stocké
if (sessionStorage.getItem("token") !== null) {
  adminPage();
}