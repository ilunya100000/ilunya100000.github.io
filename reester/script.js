const API_URL = "https://YOUR_RAILWAY_APP.up.railway.app/api";
let isAdmin = false;

async function fetchPassports() {
  const res = await fetch(API_URL + "/passports");
  const passports = await res.json();
  const container = document.getElementById("passports");
  container.innerHTML = "";
  passports.forEach(p => {
    const div = document.createElement("div");
    div.className = "passport";
    div.innerHTML = `
      <img src="${p.photo}" alt="photo">
      <p><b>Number:</b> ${p.series}</p>
      <p><b>Name:</b> ${p.fullname}</p>
      <p><b>Info:</b> ${p.info}</p>
    `;
    if (isAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.onclick = () => deletePassport(p.id);
      div.appendChild(btn);
    }
    container.appendChild(div);
  });
}

document.getElementById("passportForm").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const file = formData.get("photo");
  const reader = new FileReader();
  reader.onload = async () => {
    const body = {
      series: formData.get("series"),
      fullname: formData.get("fullname"),
      info: formData.get("info"),
      photo: reader.result
    };
    await fetch(API_URL + "/passports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    e.target.reset();
    fetchPassports();
  };
  reader.readAsDataURL(file);
});

async function deletePassport(id) {
  await fetch(API_URL + "/passports/" + id, { method: "DELETE" });
  fetchPassports();
}

function login() {
  const pass = prompt("Enter admin password:");
  if (pass === "MakanHuesos") {
    isAdmin = true;
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("logoutBtn").style.display = "inline-block";
    fetchPassports();
  } else {
    alert("Wrong password!");
  }
}

function logout() {
  isAdmin = false;
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  fetchPassports();
}

fetchPassports();
