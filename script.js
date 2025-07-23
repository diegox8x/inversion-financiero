
const usuarios = [
  { usuario: "diego", clave: "1234" },
  { usuario: "maria", clave: "abcd" },
  { usuario: "esteban", clave: "4567" },
  
];

// Login
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

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Cargar datos en el panel
window.onload = function () {
  if (window.location.pathname.includes("panel.html")) {
    if (localStorage.getItem("login") !== "ok") {
      window.location.href = "index.html";
    } else {
      const usuario = localStorage.getItem("usuario");
      document.getElementById("bienvenida").innerText = "Bienvenido, " + usuario;

      fetch('datos.xlsx')
        .then(res => res.arrayBuffer())
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
          mostrarTabla(json, usuario);
        });
    }
  }
};

// Mostrar tabla filtrada
function mostrarTabla(datos, usuarioActual) {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";
  datos
    .filter(row => row["Usuario"] === usuarioActual)
    .forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row["Fecha"] || ""}</td>
        <td>${row["Monto"] || ""}</td>
        <td>${row["Ganancia"] || ""}</td>
        <td>${row["Retorno (%)"] || ""}</td>
      `;
      tbody.appendChild(tr);
    });
}