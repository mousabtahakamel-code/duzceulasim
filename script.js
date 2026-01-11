// Kullanıcılar
const users = [
    {username: "owner1", password: "123", role: "owner", messages: []},
    {username: "amir1", password: "123", role: "amir", messages: []},
    {username: "sofor1", password: "123", role: "sofor", messages: []}
];

// Atamalar
let assignments = [];

// LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = users.find(u => u.username === username && u.password === password);

    if(!user){
        document.getElementById("loginMsg").innerText = "Kullanıcı adı veya şifre hatalı!";
        return;
    }

    document.getElementById("loginDiv").style.display = "none";

    if(user.role === "owner") document.getElementById("ownerPanel").style.display = "block";
    else if(user.role === "amir") {
        document.getElementById("amirPanel").style.display = "block";
        updateSoforSelect();
    } else if(user.role === "sofor") {
        document.getElementById("soforPanel").style.display = "block";
        updateSoforPanel(user.username);
    }
});

// OWNER PANEL - HESAP EKLE
document.getElementById("addUserBtn").addEventListener("click", () => {
    const username = document.getElementById("newUser").value;
    const password = document.getElementById("newPass").value;
    const role = document.getElementById("newRole").value;

    if(!username || !password) return alert("Kullanıcı adı ve şifre girin!");

    users.push({username, password, role, messages: []});
    alert("Kullanıcı eklendi!");
    if(role === "sofor") updateSoforSelect();
});

// OWNER PANEL - MESAJ GÖNDER
document.getElementById("sendMsgBtn").addEventListener("click", () => {
    const text = document.getElementById("ownerMsg").value;
    if(!text) return;
    const tarih = new Date().toLocaleString();
    users.forEach(u => { if(u.role !== "owner") u.messages.push({text, from:"OWNER", tarih}); });
    alert("Mesaj gönderildi!");
    document.getElementById("ownerMsg").value = "";
});

// HAREKET AMİR PANELİ - ŞOFÖR SEÇİMİ
function updateSoforSelect(){
    const select = document.getElementById("soforSelect");
    select.innerHTML = "";
    users.filter(u=>u.role==="sofor").forEach(u=>{
        const option = document.createElement("option");
        option.value = u.username;
        option.text = u.username;
        select.appendChild(option);
    });
}

// ATAMA YAP
document.getElementById("assignBtn").addEventListener("click", () => {
    const sofor = document.getElementById("soforSelect").value;
    const hat = document.getElementById("hatSelect").value;
    const arac = document.getElementById("aracSelect").value;

    const index = assignments.findIndex(a=>a.sofor===sofor);
    if(index!==-1) assignments[index]={sofor, arac, hat};
    else assignments.push({sofor, arac, hat});

    renderAssignments();
});

// ATAMALARI EKRANA YAZDIR
function renderAssignments(){
    const div = document.getElementById("assignmentsList");
    let html = "<ul>";
    assignments.forEach(a=>{ html += `<li>${a.sofor} → ${a.arac} | ${a.hat}</li>`; });
    html += "</ul>";
    div.innerHTML = html;
}

// ŞOFÖR PANELİ GÜNCELLE
function updateSoforPanel(username){
    const atama = assignments.find(a=>a.sofor===username);
    const div = document.getElementById("soforAtama");
    if(atama) div.innerHTML = `<p>Atanan Araç: <strong>${atama.arac}</strong><br>Hat: <strong>${atama.hat}</strong></p>`;
    else div.innerHTML = "<p>Henüz atama yapılmadı.</p>";

    // Mesajları göster
    const user = users.find(u=>u.username===username);
    let mesajHtml = "<ul>";
    user.messages.forEach(m=>{ mesajHtml += `<li>[${m.tarih}] ${m.from}: ${m.text}</li>`; });
    mesajHtml += "</ul>";
    document.getElementById("soforMessages").innerHTML = mesajHtml;
}

// SEFER BAŞLAT
document.getElementById("startTripBtn").addEventListener("click", ()=>{
    const username = users.find(u=>u.role==="sofor").username;
    const atama = assignments.find(a=>a.sofor===username);
    if(!atama) return alert("Henüz atama yapılmadı.");
    const saat = new Date();
    saat.setHours(saat.getHours()+3);
    alert(`Sefer Başladı: ${atama.arac} - ${atama.hat} | Kalkış Saati: ${saat.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`);
});
