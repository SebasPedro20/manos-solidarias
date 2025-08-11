document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle && navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    if (mainNav.style.display === "flex" || mainNav.style.display === "block") {
      mainNav.style.display = "none";
    } else {
      mainNav.style.display = window.innerWidth <= 880 ? "block" : "flex";
    }
  });
  mainNav && mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && window.innerWidth <= 880) {
      mainNav.style.display = "none";
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
  const newsContainer = document.getElementById("news-container");
  fetch("news.json")
    .then(resp => {
      if (!resp.ok) throw new Error("No se pudo obtener noticias");
      return resp.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        newsContainer.innerHTML = "<p>No hay noticias recientes.</p>";
        return;
      }
      data.forEach(item => {
        const card = document.createElement("article");
        card.className = "news-card";
        const title = document.createElement("h3");
        title.textContent = item.titulo || "Sin título";
        const p = document.createElement("p");
        p.textContent = item.resumen || "";
        const date = document.createElement("div");
        date.className = "news-date";
        if (item.fecha) {
          const d = new Date(item.fecha);
          if (!isNaN(d)) date.textContent = d.toLocaleDateString();
          else date.textContent = item.fecha;
        }
        card.appendChild(title);
        if (p.textContent) card.appendChild(p);
        card.appendChild(date);
        newsContainer.appendChild(card);
      });
    })
    .catch(err => {
      newsContainer.innerHTML = "<p>Error cargando noticias.</p>";
      console.error(err);
    });
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("submit-btn");
  const statusSpan = document.getElementById("form-status");
  const toast = document.getElementById("toast");
  function showToast(text, timeout = 2200) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), timeout);
  }
  function validateName() {
    const v = nameInput.value.trim();
    const el = document.getElementById("error-name");
    if (v.length < 2) { el.textContent = "Ingrese su nombre (mínimo 2 caracteres)."; return false; }
    el.textContent = ""; return true;
  }
  function validateEmail() {
    const v = emailInput.value.trim();
    const el = document.getElementById("error-email");
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) { el.textContent = "Ingrese un correo válido."; return false; }
    el.textContent = ""; return true;
  }
  function validateMessage() {
    const v = messageInput.value.trim();
    const el = document.getElementById("error-message");
    if (v.length < 10) { el.textContent = "Escribe al menos 10 caracteres."; return false; }
    el.textContent = ""; return true;
  }
  [nameInput, emailInput, messageInput].forEach(inp =>
    inp.addEventListener("input", () => {
      validateName(); validateEmail(); validateMessage();
    })
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = validateName() && validateEmail() && validateMessage();
    if (!ok) {
      showToast("Corrige los errores del formulario", 2000);
      return;
    }
    submitBtn.disabled = true;
    statusSpan.textContent = "Enviando...";
    setTimeout(() => {
      submitBtn.disabled = false;
      statusSpan.textContent = "";
      showToast("Mensaje enviado con éxito. Gracias.", 2200);
      form.reset();
    }, 900);
  });
});
