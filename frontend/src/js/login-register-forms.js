//Get elements from the DOM

const toggleFormSignIn = document.querySelector("#goto-signin");
const toggleFormRegister = document.querySelector("#goto-register");
const registrationForm = document.querySelector("#customer-registration-form");
const signinForm = document.querySelector("#customer-signin-form");
const formsContainer = document.querySelector("#registration");

const registrationFormInputs = document.querySelectorAll(
  "#customer-registration-form input"
);
const loginFormInputs = document.querySelectorAll(
  "#customer-signin-form input"
);

const invalidFeedbackMessages = document.querySelectorAll(".invalid-feedback");

const btnLogout = document.querySelector(".btn-logout");

let isLogged = false;

document.addEventListener("DOMContentLoaded", () => {
  onInit();
  console.log("Script loaded for", window.location.pathname);
});

function onInit() {
  const loggedCustomer =
    JSON.parse(localStorage.getItem("logedCustomer")) || "";

  if (loggedCustomer) {
    document.querySelector(".user-name-label").textContent =
      loggedCustomer.name;

    if (btnLogout) {
      btnLogout.classList.remove("d-none");
    }
    isLogged = true;
    hideForms();
    logOut();
  }

  if (toggleFormSignIn) {
    toggleFormSignIn.addEventListener("click", toggleSignInForm);
  }

  if (toggleFormRegister) {
    toggleFormRegister.addEventListener("click", toggleRegisterForm);
  }
}

/**
 * Toggle to the sign in form if the customer already exists
 * @param {*} event
 */
function toggleSignInForm(event) {
  event.preventDefault(); // Prevent default behavior

  // Toggle visibility of the forms
  document.querySelector("#customer-registration-form").classList.add("d-none");
  document.querySelector("#customer-signin-form").classList.remove("d-none");
  document.querySelector("#customer-signin-form").classList.add("d-block");

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
 * toggle to the register form if the customer does not have an account
 * @param {*} event
 */
function toggleRegisterForm(event) {
  event.preventDefault(); // Prevent default behavior
  resetForms();
  resetFeedbaackMessages();

  document.querySelector("#customer-signin-form").classList.add("d-none");
  document.querySelector("#customer-signin-form").classList.remove("d-block"); // Ensure the sign-in form is hidden
  document
    .querySelector("#customer-registration-form")
    .classList.remove("d-none");
  document
    .querySelector("#customer-registration-form")
    .classList.add("d-block");

  // Show the sign-in button, hide the register button
  toggleFormRegister.classList.add("d-none");
  toggleFormSignIn.classList.remove("d-none");
  toggleFormSignIn.classList.add("d-inline");
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
