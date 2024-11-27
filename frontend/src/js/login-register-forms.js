import { getData } from "../utils/api-utility.js";

const MEMBERS_ENDPOINT = "/members";

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

let membersList = [];

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

  //Toggle forms
  if (toggleFormSignIn) {
    toggleFormSignIn.addEventListener("click", toggleSignInForm);
  }

  if (toggleFormRegister) {
    toggleFormRegister.addEventListener("click", toggleRegisterForm);
  }

  //Handle form submissions
  if (registrationForm) {
    registrationForm.addEventListener("submit", handleRegistrationForm);
  }

  if (signinForm) {
    signinForm.addEventListener("submit", handleSigninForm);
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
 * handle registration form submission
 * @param {*} event
 */
function handleRegistrationForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const customerData = Object.fromEntries(formData.entries());
  console.log("customer data", customerData);

  const isValidForm = validateRegistrationForm(customerData);
  const isValidPhone = validatePhone(customerData.phone);
  console.log(isValidPhone);

  if (isValidForm) {
    console.log("is the form valid?", isValidForm);
    if (!isValidPhone) {
      document.querySelector("#invalid-phone").classList.add("d-block");
    } else if (isValidPhone) {
      document.querySelector("#invalid-phone").classList.remove("d-block");

      const isSuccess = registerNewCustomers(
        customerData.name,
        customerData.address,
        customerData.city,
        customerData.email,
        customerData.phone,
        customerData.username,
        customerData.password
      );

      if (isSuccess) {
        alert(
          "Registration succesful. Sign in for a better shopping experience"
        );
        resetForms();
      } else {
        alert("Customer already exists!!!");
      }
    }
  }
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

function registerNewCustomers(
  name,
  address,
  city,
  email,
  phone,
  username,
  password
) {}

/**
 * verify customer and login
 * @param {*} data
 */
async function memberLogin(data) {
  let loggedCustomer = JSON.parse(localStorage.getItem("logedCustomer")) || "";
  let localCustomers = JSON.parse(localStorage.getItem("customers")) || [];

  //Get the customers data
  membersList = await getData(MEMBERS_ENDPOINT);

  // Check if the customer already exists in the data
  const existingCustomer = membersList.find(
    (customer) =>
      customer.username === data.username && customer.password === data.password
  );

  // Check if the customer already exists in the local storage
  const existingLocalCustomer = localCustomers.find(
    (customer) =>
      customer.username === data.username && customer.password === data.password
  );

  //validate  customer
  if (existingCustomer) {
    let verifiedCustomer =
      loggedCustomer.username === existingCustomer.username;

    if (verifiedCustomer) {
      document.querySelector(".user-name-label").textContent =
        verifiedCustomer.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
    } else {
      localStorage.setItem("logedCustomer", JSON.stringify(existingCustomer));
      document.querySelector(".user-name-label").textContent =
        existingCustomer.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
      resetForms();
      return true;
    }
  } else if (existingLocalCustomer) {
    let verifiedCustomer =
      loggedCustomer.username === existingLocalCustomer.username;

    if (verifiedCustomer) {
      document.querySelector(".user-name-label").textContent =
        verifiedCustomer.name;

      if (btnLogout) {
        btnLogout.classList.remove("d-none");
      }
    } else {
      localStorage.setItem(
        "logedCustomer",
        JSON.stringify(existingLocalCustomer)
      );
      document.querySelector(".user-name-label").textContent =
        existingLocalCustomer.name;

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
 * if user logs out, show the forms
 */
function logOut() {
  btnLogout.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.removeItem("logedCustomer");
    document.querySelector(".user-name-label").textContent = "";

    if (formsContainer) {
      formsContainer.classList.remove("d-none");
    }

    btnLogout.classList.add("d-none");
  });
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
 * Add event listeners to registration inputs to handle feedback messages
 */

registrationFormInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    const inputId = input.id;
    const messageElement = document.getElementById(`invalid-${inputId}`);

    if (input.value) {
      messageElement.classList.remove("d-block");
    }
  });
});

/**
 * Add event listeners to login inputs to handle feedback messages
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

//if user is logged in, hide the forms
function hideForms() {
  if (isLogged) {
    if (formsContainer) {
      formsContainer.classList.add("d-none");
    }
  }
}
