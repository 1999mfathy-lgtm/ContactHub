// ===== DOM Elements =====
var imageInput = document.getElementById("imageInput");
var contactName = document.getElementById("contact-Name");
var phoneNumber = document.getElementById("Phone-Number");
var contactEmail = document.getElementById("contact-mail");
var addressInput = document.getElementById("contact-Adress");
var selectgroup = document.getElementById("selectgroup");
var noteInput = document.getElementById("noteInput");
var favCheckbox = document.getElementById("fav-check");
var emerCheckbox = document.getElementById("eme-check");
var saveBtn = document.getElementById("savebtn");
var updateBtn = document.getElementById("updateBtn");
var contactsCards = document.getElementById("contacts-cards");
var searchInput = document.getElementById("searchInput");
var nameRegex = /^[A-Za-z\s]{2,50}$/;
var phoneRegex = /^(?:\+20|0)?1[0125][0-9]{8}$/;
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


// var imgLivePrev = document.getElementById("imgLivePrev");

let allContacts = JSON.parse(localStorage.getItem("allContacts")) || [];
let contactToUpdate = null;

renderContacts();


function addContact() {
  if (!nameRegex.test(contactName.value)) {
        Swal.fire({ icon: "error", title: "Invalid Name", text: "Only letters, 2–50 chars." });
        return;
    }
  
    if (!phoneNumber.value) {
        Swal.fire({ icon: "error", title: "Missing Phone", text: "Please enter a phone number!" });
        return;
    }
    if (!phoneRegex.test(phoneNumber.value)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Valid Egyptian phone required (010..., 011..., +201...)"
        });
        return;
    }
    if (contactEmail.value !== "" && !emailRegex.test(contactEmail.value)) {
        Swal.fire({ icon: "error", title: "Invalid Email", text: "Enter a valid email!" });
        return;
    }

  
    if (imageInput.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
          reader.onload = function () {
                createContact(reader.result);
            };
    } else {
        createContact();
    }

    var modalEl = document.getElementById("exampleModal");
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
        modal.hide();
    }
    Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Contact has been added successfully.",
        timer: 1500,
        showConfirmButton: false
    })

}

function createContact(imageSrc) {
    var newContact = {
        id: Date.now(),
        name: contactName.value,
        phone: phoneNumber.value,
        email: contactEmail.value,
        address: addressInput.value,
        group: selectgroup.selectedOptions[0].innerText,
        note: noteInput.value,
        isFavorite: favCheckbox.checked,
        isEmergency: emerCheckbox.checked,
        image: imageSrc || "./images/default.png"
    };

    allContacts.push(newContact);
    saveContacts();
    renderContacts();
    clearForm();
}



function renderContacts() {
    contactsCards.innerHTML = "";

    if (allContacts.length === 0) {
        contactsCards.innerHTML = `
        <div class="text-center py-5 w-100">
            <div class="mx-auto mb-4 d-flex align-items-center justify-content-center add-icon">
                <i class="fa-solid fa-address-book fs-2"></i>
            </div>
            <p class="grayed fw-semibold">No contacts found</p>
            <p class="grayed mt-1">Click "Add Contact" to begin</p>
        </div>`;
        return;
    }


    for (var i = 0; i < allContacts.length; i++) {
        var cardHTML = getContactCardHTML(allContacts[i]);
        contactsCards.insertAdjacentHTML("beforeend", cardHTML);
     }


    document.getElementById(`tot-count`).innerText = allContacts.length;
    document.getElementById(`tot-count2`).innerText = allContacts.length;


    var fav = allContacts.filter(function (c) {
        return c.isFavorite
    });
    document.getElementById(`fav-count`).innerText = fav.length;
    var favoriteCards = '';
    for (i = 0; i < fav.length; i++) {
        favoriteCards += `
         <div   class=" fav-list d-flex  justify-content-between  align-items-center gap-3">
                                    <div class="d-flex gap-3">
                                        <div class=" icon44 fs-5 fw-medium " style="background:${getColorFromName(fav[i].name)}">
                                            <p class="m-0">${fav[i].name.charAt(0) + fav[i].name.charAt(1)}</p>
                                        </div>
                                        <div class="">
                                            <h2 class="fs-6 m-0">${fav[i].name}</h2>
                                            <p class="phone-number m-0 fs-12 grayed ">${fav[i].phone}</p>
                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <div class="  icon45 fs-6 d-flex justify-content-center align-items-center">
                                            <i class="fa-solid fa-phone"></i>
                                        </div>
                                    </div>
                                </div>`

    }
    document.getElementById(`fav-cards`).innerHTML = favoriteCards


    var emer = allContacts.filter(function (c) {
        return c.isEmergency
    });

    document.getElementById(`emer-count`).innerText = emer.length;
    var emergencyCards = '';
    for (i = 0; i < emer.length; i++) {
        emergencyCards += `
       <div  class=" emer-list d-flex  justify-content-between  align-items-center gap-3 ">
                                    <div class="d-flex gap-3" >
                                        <div style="background:${getColorFromName(emer[i].name)}" class=" icon44 fs-5 fw-medium ">
                                            <p  class="m-0">${emer[i].name.charAt(0) + emer[i].name.charAt(1)}</p>
                                        </div>
                                        <div class="">
                                            <h2 class="fs-6 m-0">${emer[i].name}</h2>
                                            <p class="phone-number m-0 fs-12 grayed ">${emer[i].phone}</p>
                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <div
                                            class="  icon46 icon45 fs-6 d-flex justify-content-center align-items-center">
                                            <i class="fa-solid fa-phone"></i>
                                        </div>
                                    </div>
                                </div>`
    }
    document.getElementById(`emer-cards`).innerHTML = emergencyCards

}

// ===== Generate Contact Card HTML =====
function getContactCardHTML(contact) {
    var emailBlock = contact.email ? `
        <div class="d-flex mt-2 g-2 email-block">
            <div class="mail-icon d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-envelope"></i>
            </div>
            <p class="ms-2">${contact.email}</p>
        </div>` : "";

    var addressBlock = contact.address ? `
        <div class="d-flex mt-2 address-block">
            <div class="map-icon d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-location-dot"></i>
            </div>
            <p class="ms-2">${contact.address}</p>
        </div>` : "";

    var groupBadge = contact.group !== "Select a group" ? `
        <div class="mt-2 ms-3 group-batch col-2 rounded-3">
            <p class="fs-11 m-0 ms-2">${contact.group}</p>
        </div>` : "";

    var emergencyBadge = contact.isEmergency ? `
        <div class="d-flex mt-2 rounded-3 col-3 ms-2 emergency-batch">
            <i class="fa-solid fa-heart-pulse"></i>
            <p class="fs-11 m-0 ms-2">Emergency</p>
        </div>` : "";

    var favStick = contact.isFavorite ? `<div class="fav-stick rounded-circle"><i class="fa-solid fa-star"></i></div>` : "";
    var emerStick = contact.isEmergency ? `<div class="emer-stick rounded-circle"><i class="fa-solid fa-heart-pulse"></i></div>` : "";
    var envlope = contact.email ? `<div class="mail-act act-icon"><i class="fa-solid fa-envelope"></i></div>` : "";

    return `
    <div class="col-md-6">
        <div class="card h-100 div2 bg-white position-relative mt-3" data-id="${contact.id}">
        <div class="h-100" >

            <div class="d-flex gap-3"  >
                <div style="background:${getColorFromName(contact.name)}" class="icon34 fw-medium"><p class="m-0">${contact.name.charAt(0) + contact.name.charAt(1)}</p></div>
                ${favStick}${emerStick}
                <div>
                    <h2 class="fs-6">${contact.name}</h2>
                    <div class="d-flex">
                        <div class="phone-icon d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-phone"></i>
                        </div>
                        <p class="ms-2">${contact.phone}</p>
                    </div>
                </div>
            </div>
            ${emailBlock}
            ${addressBlock}
            <div class="row">
                
                    ${groupBadge}${emergencyBadge}
                
            </div>
         </div>
            <div class="d-flex justify-content-between mt-2 foot-icos">
                <div class="phone-mail d-flex gap-2 mt-2">
                    <div class="phone-act act-icon"><i class="fa-solid fa-phone"></i></div>
                    ${envlope}
                </div>
                <div class="star-heart d-flex gap-2 mt-2">
                    <div onclick="addFavorite(${contact.id})" class="star-act act-icon"><i class="${contact.isFavorite ? "fa-solid yellow" : "fa-regular"} fa-star"></i></div>
                    <div onclick="addEmergency(${contact.id})" class="heart-act act-icon"><i class="${contact.isEmergency ? "fa-solid redd" : "fa-regular"} fa-heart"></i></div>
                    <div onclick="openEditModal(${contact.id})" class="pen-act act-icon"><i class="fa-solid fa-pen"></i></div>
                    <div onclick="deleteContact(${contact.id})" class="delete-act act-icon"><i class="fa-solid fa-trash"></i></div>
                </div>
            </div>
        </div>
    </div>`;
}


function addFavorite(contactId) {

    var contact = allContacts.find(function (c) {
        return c.id == contactId
    });
    contact.isFavorite = !contact.isFavorite;


    saveContacts();
    renderContacts();




}

function addEmergency(contactId) {
    var contact = allContacts.find(function (d) {
        return d.id == contactId
    });
    contact.isEmergency = !contact.isEmergency;
    saveContacts();
    renderContacts();




}


// ===== Open Edit Modal =====
function openEditModal(contactId) {

    var contact = allContacts.find(function (d) {
        return d.id == contactId
    });

    var selectOptions = Array.from(selectgroup.options);
    var option = selectOptions.find(function (opt) {
        return opt.innerText == contact.group
    })
    contactToUpdate = contact;
    contactName.value = contact.name;
    phoneNumber.value = contact.phone;
    contactEmail.value = contact.email || "";
    addressInput.value = contact.address || "";
    selectgroup.value = option.value;
    noteInput.value = contact.note;
    favCheckbox.checked = contact.isFavorite;
    emerCheckbox.checked = contact.isEmergency;

    var modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
    document.getElementById("exampleModalLabel").innerText = "Edit Contact";
    document.getElementById("savebtn").onclick = updateContact;

}

// ===== Update Contact =====
function updateContact() {
    if (!contactToUpdate) return;

    contactToUpdate.name = contactName.value;
    contactToUpdate.phone = phoneNumber.value;
    contactToUpdate.email = contactEmail.value;
    contactToUpdate.address = addressInput.value;
    contactToUpdate.group = selectgroup.value;
    contactToUpdate.isFavorite = favCheckbox.checked;
    contactToUpdate.isEmergency = emerCheckbox.checked;

    if (imageInput.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
       reader.onload = function () {
            contactToUpdate.image = reader.result;
            saveContacts();
            renderContacts();
        }; 
    } else {
        saveContacts();
        renderContacts();
    }

    clearForm();

    var modalEl = document.getElementById("exampleModal");
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
        modal.hide();
    }
    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully.",
        timer: 1500,
        showConfirmButton: false
    })

    document.getElementById("exampleModalLabel").innerText = "Add New Contact";
    document.getElementById("savebtn").onclick = addContact;



}

// ===== Delete Contact =====
function deleteContact(id) {
    Swal.fire({
        title: "Delete?",
        text: "This contact will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    }).then(function (res) {
        if (res.isConfirmed) {
            allContacts = allContacts.filter(function (c) {
                return c.id !== id;
            });
            saveContacts();
            renderContacts();
        }
});

}

// ===== Save to Local Storage =====
function saveContacts() {
    localStorage.setItem("allContacts", JSON.stringify(allContacts));
}

// ===== Clear Form =====
function clearForm() {
    contactName.value = "";
    phoneNumber.value = "";
    contactEmail.value = "";
    addressInput.value = "";
    selectgroup.value = "Select a group";
    noteInput.value = "";
    favCheckbox.checked = false;
    emerCheckbox.checked = false;
    imageInput.value = "";
    // imgLivePrev.src = "./images/default.png";
}

function getColorFromName(name) {
    if (!name || typeof name !== "string") {
        return "#b2bec3"; 
    }

    const colors = [
        "#00b894",
        "#0984e3",
        "#e84393",
        "#6c5ce7",
        "#fdcb6e"
    ];

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}




function validateInput(element, regex, errorId) {
    let value = element.value.trim();

    if (value === "") {
        document.getElementById(errorId).classList.add("hide-element");
        element.classList.remove("invalid");
    } else if (!regex.test(value)) {
        document.getElementById(errorId).classList.remove("hide-element");
        element.classList.add("invalid");
    } else {
        document.getElementById(errorId).classList.add("hide-element");
        element.classList.remove("invalid");
    }
}

contactName.addEventListener("input", function () {
  validateInput(contactName, nameRegex, "contactNameError");
});

phoneNumber.addEventListener("input", function () {
  validateInput(phoneNumber, phoneRegex, "contactPhoneError");
});

contactEmail.addEventListener("input", function () {
  validateInput(contactEmail, emailRegex, "contactEmailError");
});

searchInput.addEventListener("input", searchContacts);

function searchContacts(e) {
  var searchText = e.target.value.trim().toLowerCase();
  if (searchText === "") {
    renderContacts();
    return;
  }

  var filteredContacts = allContacts.filter(function (contact) {
    return (
      contact.name.toLowerCase().includes(searchText) ||
      contact.phone.includes(searchText) ||
      contact.email.toLowerCase().includes(searchText)
    );
  });

  renderFilteredContacts(filteredContacts);
}

function renderFilteredContacts(list) {
  contactsCards.innerHTML = "";

  if (list.length === 0) {
    contactsCards.innerHTML = `
      <div class="text-center py-5 w-100">
        <div class="mx-auto mb-4 d-flex align-items-center justify-content-center add-icon">
          <i class="fa-solid fa-address-book fs-2"></i>
        </div>
         <p class="grayed fw-semibold">No contacts found</p>
            <p class="grayed mt-1">Click "Add Contact" to begin</p>
      </div>
    `;
   
    return;
  }


    for (var i = 0; i < list.length; i++) {
        var cardHTML = getContactCardHTML(list[i]);
        contactsCards.insertAdjacentHTML("beforeend", cardHTML);
     }

}

