document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const user = JSON.parse(localStorage.getItem(email));
      if (user && user.password === password) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials.");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value; 

      if (password !== confirmPassword) { 
        alert("Passwords do not match. Please re-enter."); 
        return; 
      }

      if (localStorage.getItem(email)) {
        alert("User already exists.");
      } else {
        localStorage.setItem(email, JSON.stringify({ email, password }));
        alert("Signup successful!");
        window.location.href = "login.html";
      }
    });
  }
});