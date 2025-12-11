// ============ BASE API URL ============
// Change this to your backend address
const API_URL = "http://localhost:4000/api/auth";

// ============ SIGNUP HANDLER ============
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = signupForm.name.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    document.getElementById("signupMessage").textContent = data.message;

    if (data.success) {
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  });
}


// ============ LOGIN HANDLER ============
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById("loginMessage").textContent = data.message || data.error;

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";  // Redirect after login
    }
  });
}


// ============ AUTH CHECK (For protected pages) ============
async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": token
    }
  });

  const data = await res.json();
  return data;
}


// ============ LOGOUT ============
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
