import { getData } from "../utils/api-utility.js";

const MEMBERS_ENDPOINT = "/members";

const registrationFormInputs = document.querySelectorAll(
  "#member-registration-form input"
);
const loginFormInputs = document.querySelectorAll("#member-signin-form input");
const invalidFeedbackMessages = document.querySelectorAll(".invalid-feedback");
const btnLogout = document.querySelector(".btn-logout");
const formsContainer = document.querySelector("#registration");
const toggleFormSignIn = document.querySelector("#goto-signin");
const toggleFormRegister = document.querySelector("#goto-register");
const registrationForm = document.querySelector("#member-registration-form");
const signinForm = document.querySelector("#customer-signin-form");

let isLogged = false;

//Get the members data
let membersList = await getData(MEMBERS_ENDPOINT);

document.addEventListener("DOMContentLoaded", () => {
  onInit();
  console.log("Script loaded for", window.location.pathname);
});

function onInit() {
  const loggedMember = JSON.parse(localStorage.getItem("logedMember")) || "";

  if (loggedMember) {
    document.querySelector(".user-name-label").textContent = loggedMember.name;

    if (btnLogout) {
      btnLogout.classList.remove("d-none");
    }
    isLogged = true;
    hideForms();
    logOut();
  }

  //toggle the forms
  if (toggleFormSignIn) {
    toggleFormSignIn.addEventListener("click", toggleSignInForm);
  }

  if (toggleFormRegister) {
    toggleFormRegister.addEventListener("click", toggleRegisterForm);
  }

  //handle the forms submission
  if (registrationForm) {
    registrationForm.addEventListener("submit", handleRegistrationForm);
  }

  if (signinForm) {
    signinForm.addEventListener("submit", handleSigninForm);
  }
}

/**
 * Add event listeners to all inputs to handle feedback messages
 */
loginFormInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    const inputId = input.id;
    const messageElement = document.getElementById(`invalid-login-${inputId}`);

    if (input.value) {
      messageElement.classList.remove("d-block");
    }
  });
});

/**
 * if user is logged in, hide the forms
 */
function hideForms() {
  if (isLogged) {
    if (formsContainer) {
      formsContainer.classList.add("d-none");
    }
  }
}

/**
 * if user logs out, show the forms
 */
function logOut() {
  btnLogout.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.removeItem("logedMember");
    document.querySelector(".user-name-label").textContent = "";

    if (formsContainer) {
      formsContainer.classList.remove("d-none");
    }

    btnLogout.classList.add("d-none");
  });
}

/**
 * Toggle to the sign in form if the member already exists
 * @param {*} event
 */
function toggleSignInForm(event) {
  event.preventDefault(); // Prevent default behavior

  // Toggle visibility of the forms
  document.querySelector("#member-registration-form").classList.add("d-none");
  document.querySelector("#member-signin-form").classList.remove("d-none");
  document.querySelector("#member-signin-form").classList.add("d-block");

  document.querySelector("#form-type").textContent = "Log In";
  document.querySelector("#has-account span").textContent = "Don't";

  // Show the register button, hide the sign-in button
  toggleFormSignIn.classList.add("d-none");
  toggleFormRegister.classList.remove("d-none");
  toggleFormRegister.classList.add("d-inline");
  resetForms();
  resetFeedbaackMessages();
}

/**
 * toggle to the register form if the member does not have an account
 * @param {*} event
 */
function toggleRegisterForm(event) {
  event.preventDefault(); // Prevent default behavior
  resetForms();
  resetFeedbaackMessages();

  document.querySelector("#member-signin-form").classList.add("d-none");
  document.querySelector("#member-signin-form").classList.remove("d-block"); // Ensure the sign-in form is hidden
  document
    .querySelector("#member-registration-form")
    .classList.remove("d-none");
  document.querySelector("#member-registration-form").classList.add("d-block");

  document.querySelector("#has-account span").textContent = "Already";

  // Show the sign-in button, hide the register button
  toggleFormRegister.classList.add("d-none");
  toggleFormSignIn.classList.remove("d-none");
  toggleFormSignIn.classList.add("d-inline");
}

/**
 * handle registration form submission
 * @param {*} event
 */
function handleRegistrationForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const memberData = Object.fromEntries(formData.entries());
  console.log("member data", memberData);

  const isValidForm = validateRegistrationForm(memberData);
  const isValidPhone = validatePhone(memberData.phone);
  console.log(isValidPhone);

  if (isValidForm) {
    console.log("is the form valid?", isValidForm);
    if (!isValidPhone) {
      document.querySelector("#invalid-phone").classList.add("d-block");
    } else if (isValidPhone) {
      document.querySelector("#invalid-phone").classList.remove("d-block");

      const isSuccess = registerNewMembers(
        memberData.name,
        memberData.address,
        memberData.city,
        memberData.email,
        memberData.phone,
        memberData.username,
        memberData.password
      );

      if (isSuccess) {
        alert("Registration succesful. Sign in to participate in our blog");
        resetForms();
      } else {
        alert("member already exists!!!");
      }
    }
  }
}

/**
 * handle login form submission
 * @param {*} event
 */
function handleSigninForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  //get data from the form
  const loginData = Object.fromEntries(formData.entries());
  console.log("data", loginData);

  //Validate data
  const isValidForm = validateLoginForm(loginData);

  //if is valid data log in
  if (isValidForm) {
    let isSuccess = memberLogin(loginData);

    if (isSuccess) {
      isLogged = true;
      resetForms();
      hideForms();
      logOut();
    } else {
      isLogged = false;
    }
  }
}

/**
 * verify member and login
 * @param {*} data
 */
function memberLogin(data) {
  let loggedMember = JSON.parse(localStorage.getItem("logedmember")) || "";
  let localMembers = JSON.parse(localStorage.getItem("members")) || [];

  // Check if the member already exists in the API data
  const existingMember = membersList.find(
    (member) =>
      member.username === data.username && member.password === data.password
  );

  // Check if the member already exists in the local storage
  const existingLocalMember = localMembers.find(
    (member) =>
      member.username === data.username && member.password === data.password
  );

  //validate  member
  if (existingMember) {
    let verifiedMember = loggedMember.username === existingMember.username;

    if (verifiedMember) {
      document.querySelector(".user-name-label").textContent =
        verifiedMember.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
    } else {
      localStorage.setItem("logedMember", JSON.stringify(existingMember));
      document.querySelector(".user-name-label").textContent =
        existingMember.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
      resetForms();
      return true;
    }
  } else if (existingLocalMember) {
    let verifiedMember = loggedMember.username === existingLocalMember.username;

    if (verifiedMember) {
      document.querySelector(".user-name-label").textContent =
        verifiedMember.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
    } else {
      localStorage.setItem("logedMember", JSON.stringify(existingLocalMember));
      document.querySelector(".user-name-label").textContent =
        existingLocalMember.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
      resetForms();
      return true;
    }
  } else {
    console.log(
      "The username and password you've entered doesn't match any account. Please Try again"
    );
    alert(
      "The username and password you've entered doesn't match any account. Please Try again"
    );
    return false;
  }
}

/**
 * Register new customers
 */
function registerNewMembers(
  name,
  address,
  city,
  email,
  phone,
  username,
  password
) {
  //Get members form localStorage
  let members = JSON.parse(localStorage.getItem("members")) || [];

  // Check if the customer already exists in the local storage
  let existingLocalMember = members.find(
    (member) => member.username === username || member.email === email
  );

  // Check if the member already exists in the API data (membersList)
  let existingAPIMember = membersList.find(
    (member) => member.username === username || member.email === email
  );

  //if existent member
  if (existingLocalMember || existingAPIMember) {
    return false;
  }

  // If member does not exist
  let newMember = {
    id: members.length + membersList.length + 1,
    name: name,
    address: address,
    city: city,
    email: email,
    phone: phone,
    status: "Active",
    username: username,
    password: password,
  };

  members.push(newMember);

  // Save updated members array to local storage
  localStorage.setItem("members", JSON.stringify(members));

  console.log("New member registered: ", newMember);
  return true;
}

/**
 * validate the forms
 */
function validateRegistrationForm(data) {
  let isValid = true;

  isValid = validateField(data.name, "invalid-name") && isValid;
  isValid = validateField(data.address, "invalid-address") && isValid;
  isValid = validateField(data.city !== "0", "invalid-city") && isValid;
  isValid = validateField(data.email, "invalid-email") && isValid;
  isValid = validateField(data.username, "invalid-username") && isValid;
  isValid = validateField(data.password, "invalid-password") && isValid;

  return Boolean(isValid);
}

/**
 * validate the login form data
 * @param {*} data
 * @returns
 */
function validateLoginForm(data) {
  let isValid = true;

  isValid = validateField(data.username, "invalid-login-username") && isValid;
  isValid = validateField(data.password, "invalid-login-password") && isValid;

  return Boolean(isValid);
}

/**
 * Validate phone number format
 * @param {*} phone
 * @returns
 */
function validatePhone(phone) {
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  return regex.test(phone);
}

/**
 * validate individual fields
 * @param {*} value
 * @param {*} elementId
 */
function validateField(value, elementId) {
  const messageElement = document.getElementById(elementId);

  if (!value) {
    messageElement.classList.add("d-block");
    return false;
  } else {
    messageElement.classList.remove("d-block");
    return true;
  }
}

/**
 * reset the forms
 */
function resetForms() {
  //clear inputs
  document.querySelectorAll(".form-control").forEach((input) => {
    input.value = "";
  });

  //reset dropdowns
  document.querySelectorAll(".form-select").forEach((select) => {
    select.selectedIndex = "0";
  });
}

/**
 * Reset all fedback messages
 */
function resetFeedbaackMessages() {
  invalidFeedbackMessages.forEach((message) => {
    message.classList.remove("d-block");
  });
}
