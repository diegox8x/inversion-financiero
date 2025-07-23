
const usuarios = [
  { usuario: "diego", clave: "1234" },
  { usuario: "maria", clave: "abcd" },
  { usuario: "esteban", clave: "4567" },
  
];

/const SHEET_ID = "2PACX-1vSCBO7VHFAIJWjw-Gl8eI9OMRVpeHPUwahFTXIt-IyzYhicRqg-e0C0ZMOROAIPBZDv4i2O3tIySvA0"; // <-- Pega aquí tu ID de la hoja
const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/export?format=csv`;

function login() {
  const user = document.getElementById('usuario').value;
  const pass = document.getElementById('clave').value;
  const found = usuarios.find(u => u.usuario === user && u.clave === pass);
  if (found) {
    localStorage.setItem("login", "ok");
    localStorage.setItem("usuario", user);
    window.location.href = "panel.html";
  } else {
    document.getElementById('error').innerText = "Usuario o clave incorrectos.";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

window.onload = function () {
  if (window.location.pathname.includes("panel.html")) {
    if (localStorage.getItem("login") !== "ok") {
      window.location.href = "index.html";
    } else {
      const usuario = localStorage.getItem("usuario");
      document.getElementById("bienvenida").innerText = "Bienvenido, " + usuario;

      fetch(SHEET_URL)
        .then(res => res.text())
        .then(csv => csvToJson(csv))
        .then(data => mostrarTabla(data, usuario));
    }
  }
};

// Convertir CSV a JSON
function csvToJson(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
}

function mostrarTabla(datos, usuarioActual) {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";
  datos
    .filter(row => row["Usuario"] === usuarioActual)
    .forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row["Fecha"]}</td>
        <td>${row["Monto"]}</td>
        <td>${row["Ganancia"]}</td>
        <td>${row["Retorno (%)"]}</td>
      `;
      tbody.appendChild(tr);
    });
}