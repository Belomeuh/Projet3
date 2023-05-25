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
  figureModalProject.innerHTML = `<a href="#" data-id=${project.id} class="trash_can"><img src="./assets/icons/trash-icon.png"></img></a>`;

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
  imageModalProject.classList.add("modal-project-img")

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
    .then((filtre) => {
      //on récupère les boutons
      const trashIcons = document.querySelectorAll(".trash_can");


      trashIcons.forEach((trashIcon) => {
        //Pour chaque bouton, au clic
        trashIcon.addEventListener("click", function (event) {
          event.preventDefault();

          //Get catégorie id
          let trashIconId = trashIcon.getAttribute("data-id");

          if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true) {
            deleteWork(trashIconId);
          }
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};


// Fonction pour supprimer un projet de la modale
function deleteWork(workID) {
  
  let token = sessionStorage.getItem("token");
  fetch("http://localhost:5678/api/works/" + workID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    if (response.ok) {
    //return response.json();
    //maj affichage des projets : getWorks();
    getWorks();
    } else {
      console.log("Erreur dans la suppression d'un works");
    }
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
  logButton.addEventListener("click", (e) => {
    e.preventDefault()
    sessionStorage.clear();
    document.location.href = "index.html";
  });

  //On ouvre le modal
  const modale_section = document.querySelector(".modale_section");
  
  modalOpening = document.querySelector("#modal_opener")
  modalOpening.addEventListener("click", () => {
    document.querySelector(".modale_section").style.display = 'block';
    //On fait en sorte d'afficher le modale1 et non le modale2 
    document.querySelector(".modale1").style.display = 'block';
    document.querySelector(".modale2").style.display = 'none';
  }
  );

  //Ajout d'un work
  const addWorkForm = document.querySelector(".add_work_form");
  const inputElement = document.querySelector('.title_input');
  const selectElement = document.querySelector(".select_categorie");
  const fileInputElement = document.querySelector("#image_input");
  const validButton = document.querySelector("#confirm_add");
  const inputFile = document.querySelector("#image_input");

  //Prévisu image
  const showFile = (e) => {
    e.preventDefault();

    const reader = new FileReader();

    reader.readAsDataURL(inputFile.files[0]);
    reader.addEventListener("load", function () {
      previewImg.src = reader.result;
    });

    //On fait apparaite l'image
    const previewBox = document.querySelector(".dropzone");
    const previewImg = document.createElement("img");
    previewImg.setAttribute("id", "preview-image");
    //Et on masque les éléments
    const photoUploadButton = document.querySelector(".add_img");
    photoUploadButton.style.display = "none";
    const pictureIcon = document.querySelector(".photoIcon");
    pictureIcon.style.display = "none";
    const typeFiles = document.querySelector('#types_files');
    typeFiles.style.display = 'none';

    previewBox.appendChild(previewImg);
  };
    
  const checkForm = () => {
    if (inputElement.value !== "" && selectElement.value !== "" && fileInputElement.value !== "") {
      validButton.style.backgroundColor = "#1D6154";
      validButton.style.color = "#ffffff";
      validButton.disabled = false;
    }
  };


    //On donne les listener aux éléments
    inputFile.addEventListener("change", showFile);
    inputElement.addEventListener('input', checkForm);
    selectElement.addEventListener('input', checkForm);
    fileInputElement.addEventListener('change', checkForm);



    //On ajoute le nouveau work
    const addWork = async () => {
      const getPhoto = document.getElementById("image").files[0];
      const getTitle = document.getElementById("tittle").value;
      const getCategory = document.getElementById("category").value;

      //FormData 
      let formData = new FormData();
      formData.append("image", getPhoto);
      formData.append("title", getTitle);
      formData.append("category", getCategory);

      //Fetch api
      await fetch('http://localhost:5678/api/works/', {
        method: 'POST',
        headers: {
        Authorization: "Bearer " + token,
        body: formData },
      })

        .then((response) => {
          if (response.ok) {
            FormData();
          }
    });
  
}};

  //On ferme le modal
  const modale_section = document.querySelector(".modale_section");
  modalClosing = document.querySelector(".closeModale")
  modalClosing.addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector(".modale_section").style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target == modale) {
        modale_section.style.display = "none";
    }
};

  //On delete la galerie
  const deleteGalery = document.querySelector("#deleteAll")
  deleteGalery.addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm("Êtes-vous sûr de vouloir supprimer la galerie?") == true) {
      const figures = modalGallery.querySelectorAll("figure");
      for (let i = 0; i < figures.length; i++) {
        const figureID = figures[i].getAttribute("data-id");

        deleteWork(figureID);
      }
    }
  })

  //On gère le changement de modal
  const modalSwipe = document.querySelector("#addButton")
  modalSwipe.addEventListener("click", () => {
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
  
  
  //Afficher les éléments adminPage si le token est stocké
  if (sessionStorage.getItem("token") !== null) {
    adminPage();
  }