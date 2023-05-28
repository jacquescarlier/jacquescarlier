//  -------------------------------------------
//  |  declaration of constants and variables |
//  -------------------------------------------

// API call

// url to access the api database
let url = "http://localhost:5678/api/works";
// url for the category part
let urlCategories = "http://localhost:5678/api/categories";

const gallery = document.querySelector(".gallery");
//const admin navigation bar
const adminNav = document.getElementById("admin-nav");
// "edit" buttons for the admin part
const modalCallButtons = document.querySelectorAll(".modifier");
// login or logout button depending on the token
const loginLogout = document.getElementById("login");

/* tableau ['entitled','suffix for button ID' (btn-" "), 'category name']
tableau pour fonction "create button sans passer par l'API"
Faute d'orthographe dans un nom de catégorie Hotel => Hôtel, désactivé pour l'instant
let arrayCreateButton = [["Tous", "Tous", "Tous"],["Objets", "Objets", "Objets"], ["Appartements", "Appartements", "Appartements"], ["Hôtels & restaurants", "Hotels", "Hotels & restaurants"]];*/

// --------------------------------------
// | Check the connection with the API  |
// --------------------------------------

async function getWorks(url) {
  const response = await fetch(url);
  if (response.ok) return await response.json();
  else {
    return Promise.reject(`Erreur HTTP fetch 1 => ${response.status}`);
  }
}

//  ---------------------------------------------------------
//  |   data recovery through the api url for categories    |
//  ---------------------------------------------------------

async function getCategories(urlCategories) {
  const response = await fetch(urlCategories);
  if (response.ok) return await response.json();
}

//  ---------------------------------------------
//  | Create buttons dynamically whith the API  |
//  ---------------------------------------------

async function createButtons(newFilterButton) {
  let category = await getCategories(urlCategories);

  //creation of buttons for each category

  for (let i = 0; i < category.length; i++) {
    //variable for creating a button
    let newFilterButton = document.createElement("button");
    //button type attribute
    newFilterButton.type = "button";
    // button name attribute
    newFilterButton.name = category[i].name;
    // button title
    newFilterButton.innerHTML = category[i].name;
    // button id ("btn-" + first retrieved word)
    newFilterButton.id = "btn-" + category[i].name.split(" ")[0];
    // class add to button
    newFilterButton.className = "btn-filter";
    //variable portfolio
    let portfolio = document.getElementById("filterButton");
    // adding buttons to " #portfolio "
    portfolio.appendChild(newFilterButton);
  }
}
createButtons();
//  -------------------------------
//  |   Create Button with Array  |
//  -------------------------------

//fonction avec tableau perso pour corriger la faute sur Hôtels (ô)
//désactivé pour l'instant
/*function createButton() {
    for (item of arrayCreateButton) {
        let newButton = document.createElement("button");
        console.log("newbutton", newButton);
        newButton.type = 'button';
        newButton.name = [item[2]]
        newButton.innerHTML = [item[0]];
        newButton.id = 'btn-' + [item[1]];
        console.log("id",newButton)
        newButton.className = 'btn-filter';
        let portfolio = document.getElementById("filterButton");
        console.log("id button", newButton.id)
        console.log("portfolio", portfolio);
        portfolio.appendChild(newButton);
    }
}
createButton();*/

//  --------------------------------------------
//  |    Creation of the gallery & the filter  |
//  --------------------------------------------

async function buildWorks() {
  // array constant
  let works = await getWorks(url);

  // -------------------------
  // | job creation function |
  // -------------------------

  function createWork() {
    for (const project of works) {
      let figure = document.createElement("figure");
      let img = document.createElement("img");
      img.src = project.imageUrl;
      figure.appendChild(img);
      let figcaption = document.createElement("figcaption");
      figcaption.innerHTML = project.title;
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  }
  createWork();
  //  ----------------------------
  //  | filter creation function |
  //  ----------------------------

  async function createFilter() {
    let filterChoice = "";
    const btnFilter = document.querySelectorAll(".btn-filter");
    // filter by category name
    btnFilter.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (e.target.name === "Tous") {
                                        console.log("target-e", e.target);
          filterChoice = works;
                                        console.log("filterChoice", filterChoice);
          applyFilter(filterChoice);
        } else {
          filterChoice = works.filter(
           //  compares the name of the button to the categories of the "works" array object
            (obj) => obj.category.name === e.target.name
          );
                                        console.log("target-e", e.target);
                                        console.log("filterChoice", filterChoice);
                                        console.log("button", e.target.name)
          applyFilter(filterChoice);
          
        }
      });
    });
  }
  createFilter();
 
  //}

  //buildWorks();

  // ------------------
  // |  Apply filter  |
  // ------------------

  function applyFilter(filterChoice) {
    gallery.innerHTML = "";
    for (const filter of filterChoice) {
      let figure = document.createElement("figure");
      let img = document.createElement("img");
      img.src = filter.imageUrl;
      figure.appendChild(img);
      let figcaption = document.createElement("figcaption");
      figcaption.innerHTML = filter.title;
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  }

  //  ---------------------------------------------
  //  | setting up element according to the token |
  //  ---------------------------------------------
const btnsFilter = document.querySelector(".btns-filter")
const mesProjetsH2 = document.querySelector(".mes-projets")
  // storing the token in a variable
  let controlToken = sessionStorage.getItem("token");
  console.log("token", controlToken);
  // Modifies elements when switching to "edit mode"
  controlToken === null ? (adminNav.style.display = "none")
    : (adminNav.style.display = "flex");

  controlToken === null ? (document.getElementById("login").innerHTML = "login")
    : (document.getElementById("login").innerHTML = "logout");

  controlToken === null ? (btnsFilter.style.display = "flex")
    : (btnsFilter.style.display = "none"); 
  
  controlToken === null ? mesProjetsH2.style.marginBottom = "30px"
  : mesProjetsH2.style.marginBottom = "92px"

  controlToken === null ? (btnsFilter.style.marginBotton = "")
    : (btnsFilter.style.marginBotton = "none"); 
  controlToken === null ? (header.style.marginTop = "50px")
    : (header.style.marginTop = "38px");

  modalCallButtons.forEach(function (item) {
    controlToken === null ? (item.style.display = "none")
      : (item.style.display = "flex");
  });

  //  ---------------------------------------------------------
  //  | Management of the action of the "login/logout" button |
  //  ---------------------------------------------------------

  // add event listening on the  "login/logout" button
  loginLogout.addEventListener("click", function () { logInLogOut(); });

  // redirect function to a page according to the token
  function logInLogOut() {
    if (controlToken === null) {
      window.location.replace("./login.html");
    } else {
      sessionStorage.clear();
      window.location.replace("./index.html");
    }
  }

  //  -----------------------
  //  | parts of the modals |
  //  -----------------------

  // page refresh
  const reload = () => {
    window.location.reload();
  };

  //  ------------------------
  //  | constantes for modal |
  //  ------------------------

/**** gallery modal ****/

  // general container & gallery
  const modalContainer = document.querySelector(".modal-container");
  const modalGallery = document.querySelector(".modal-photo-gallery");
  //all elements that can close or open the modal
  const modalTrigger = document.querySelectorAll(".modal-trigger");
  // button to open 2nd modal
  const buttonAddPhotos = document.getElementById("button-add-modal");
  // gallery container
  const galleryOfModal = document.querySelector(".gallery-modal");

/**** modal add photo ****/

  const modal2Container = document.querySelector(".modal2-container");
  //all elements that can close or open the modal
  const modalTrigger2 = document.querySelectorAll(".modal-trigger2");
  // general container to add a photo
  const addPhotos = document.querySelector(".add-photo");
  //validate button
  const buttonValidatePhoto = document.getElementById("button-validate-photo");
  // messages for image size or error when selecting
  const infoFile = document.querySelector(".info-file");
  // arrow previous
  const previousArrow = document.getElementById("previous-arrow");

  const imageSelected = document.querySelector(".image-selected")
  

  //  ---------------------
  //  | modal 1 - gallery |
  //  ---------------------
  
  /**** Create the gallery for modal ****/   
  
  for (const project of works) {
    //create an id to delete photos
   
    //create galerry
    let figure = document.createElement("figure");
    // id
    let idPhoto = project.id
    figure.id = idPhoto
    //img
    let img = document.createElement("img");
    img.src = project.imageUrl;
    figure.appendChild(img);
    //figcaption
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = "éditer";
    figure.appendChild(figcaption);
    // trash 
    let trashGallery = document.createElement("i");
    trashGallery.className = "fa-solid fa-trash-can trash";
    trashGallery.innerHTML = "";
    figure.appendChild(trashGallery);
    // arrow
    let arrowGallery = document.createElement("i");
    arrowGallery.className = "fa-solid fa-arrows-up-down-left-right arrow";
    arrowGallery.innerHTML = "";
    figure.appendChild(arrowGallery);

    galleryOfModal.appendChild(figure);

    // arrow hover
    img.addEventListener("mouseover", function(e) {
    arrowGallery.style.display = "flex" });
    img.addEventListener("mouseout", function(e) {
      arrowGallery.style.display = "none" });
  }

  //  *****************
  //  * display modal *
  //  *****************
  const containerAddPhoto = document.querySelector(".container-add-photo");
  const containerAddPhoto2 = document.querySelector(".container-add-photo2")
  
  modalContainer.className === "modal-container active" ? (modalgallery.style.display = "flex")
    : (modalGallery.style.display = "none");
  //list of  elements listened to under the class "trigger"
  modalTrigger.forEach((trigger) => trigger.addEventListener("click", toggleModal));
  // change the name of the class using toggle
  function toggleModal() {
    modalContainer.classList.toggle("active");
    alertModalGallery.style.display = "none";
    // makes the modal appears or disappear depending on the class
    modalContainer.className === "modal-container active" ? (modalGallery.style.display = "flex") : modalGallery.style.display = "none";
  }

  /**** delete image  ****/

  let trashButton = document.querySelectorAll(".fa-trash-can");
  let alertModalGallery = document.querySelector(".alert-modal");

  
  trashButton.forEach ((trash) => trash.addEventListener("click", function () {
    let figure = this.parentNode
    let idPhoto = figure.id
    //parseInt(idPhoto)
    const lru = "189.0.0.0"
    async function deletePhoto() {
      await fetch(`${lru}/${idPhoto}` , {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${controlToken}`
        },
      })

      .then(function (response) {
        if(response.status === 204) {
          alert("status url", response.staus)
        
         console.log("response.status => ", response.status);
        } else {
          resStatus = response.status
          console.log("pas ok autre", response.status);
          alertModalGallery.innerHTML = "impossible d'effacé le fichier, status du serveur :  " + resStatus;
          alertModalGallery.style.display = "flex";
        }
      })
     
    }
    deletePhoto()  

  }))

  modalGallery.addEventListener("click", function(){  alertModalGallery.style.display = "none";})
  alertModalGallery.innerHTML = " ";
  /**** close the modal by clicking outside ****/ 

  modalContainer.addEventListener("click", (e) => { toggleModal(); });
  modalContainer.children[1].addEventListener('click', function (e) { e.stopPropagation();});

  modal2Container.addEventListener("click", (e) => { toggleModal2(); });
  modal2Container.children[1].addEventListener('click', function (e) {e.stopPropagation();});

  //  ---------------------
  //  | modal - add photo |
  //  ---------------------

  //for close modal
  modalTrigger2.forEach((trigger) => trigger.addEventListener("click", toggleModal2));

  // conditions of appearance of the modal
  function toggleModal2() {
    modal2Container.classList.toggle("active");

    modalContainer.className === "modal-container active" ? (modalGallery.style.display = "flex")
      : (modalGallery.style.display = "none");

    modal2Container.className === "modal2-container active" ? (addPhotos.style.display = "flex")
      : (addPhotos.style.display = "none");

    modal2Container.className === "modal2-container active" ? (modalGallery.style.display = "none")
      : (modalGallery.style.display = "flex");
  }

  // toogle funtion to manage the appearance of the modal
  buttonAddPhotos.addEventListener("click", function () { toggleModal(); toggleModal2();});
  
  /****modal - add photo Arrow previous ****/
 
  previousArrow.addEventListener("click", function () {
    toggleModal2();
    modalContainer.classList.toggle("active");
    containerAddPhoto.style.display = "flex"
    containerAddPhoto2.style.display = "none";
    
    //containerAddPhoto2.figure.innerHTML = "";
  });
  
  /**** add photo  input file part  ****/
  
const fileUploadInput = document.querySelector("#my-file");

infoFile.innerHTML = "jpg png : 4 mo max";


fileUploadInput.addEventListener('change', previewFile);
console.log("fileuploadinput", fileUploadInput)

function previewFile() {
  console.log("file", this.files )
  console.log("namefile", this.files[0].name)
  // fichier avec . et jpeg ou jpg ou png en minuscule ou majuscule
  const fileExtensionRegex = /\.(jpe?g|png)$/i;
//.test renvoie true ou false
  if (this.files.length === 0 || !fileExtensionRegex.test(this.files[0].name) )  {
    console.log("fichier pas accepté")
    return;
  }
console.log("fichier img ok")

const file = this.files[0];
const newFileReader = new FileReader();

newFileReader.readAsDataURL(file);

newFileReader.addEventListener('load', (event) =>
displayImage(event, file))

function displayImage (event, file) {

const figure = document.createElement('figure');
figure.id = "image-selected";

const image = document.createElement('img');
image.src = event.target.result;

figure.appendChild(image);
image.style.width = "129px";
image.style.height = "169px";
document.querySelector(".container-add-photo2").appendChild(figure);
containerAddPhoto2.style.display = "flex"
containerAddPhoto.style.display = "none"

// change the background color of the "validate" button
buttonValidatePhoto.style.background = "#1D6154";

  //display Image
}
//const figcaption = document.createElement ('figcaption);
// figcaption.textContent = title;
  //previewFile
}

 /* let image 

  const inputFile = document.getElementById("my-file");
  const containerAddPhoto = document.querySelector(".container-add-photo");
  infoFile.innerHTML = "jpg png : 4 mo max";
 inputFile.addEventListener("click", function (e) {
    // modify the class of infoFile
    infoFile.classList = "info-file";
    inputFile.addEventListener("change", function (e) {
      document.querySelector(".info-file").innerHTML = "jpg png : 4 mo max";
      const typeImg = inputFile.value.split(".").reverse()[0];
      // file type check
      if (typeImg === "png" || typeImg === "PNG" || typeImg === "jpg" || typeImg === "jpeg" ) {
                                      console.log("img Ok");
    
        // change the background color of the "validate" button
        buttonValidatePhoto.style.background = "#1D6154";
      } else {
                                      console.log("img not ok");
        // change the text and modify the class of infofile
        infoFile.innerHTML = "fichier jpg ou png obligatoire";
        infoFile.classList = "message-info-file";
        return;
      }
      
      image = e.target.files[0].name;
                                      console.log("type =>", typeImg);
                                      console.log("fichier =>", image);
      let img = document.createElement("img");
      img.src = image;
      containerAddPhoto.appendChild(img);
    });
  });*/
}

buildWorks();
