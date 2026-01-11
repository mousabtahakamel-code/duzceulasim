// İLK KURULUM
if (!localStorage.users) {
  localStorage.users = JSON.stringify([
    {username:"owner",password:"123",role:"owner",messages:[]},
    {username:"amir",password:"123",role:"amir",messages:[]},
    {username:"sofor",password:"123",role:"sofor",messages:[]}
  ]);
  localStorage.assignments = JSON.stringify([]);
}

let currentUser = null;

function getUsers(){ return JSON.parse(localStorage.users); }
function saveUsers(u){ localStorage.users = JSON.stringify(u); }
function getAssignments(){ return JSON.parse(localStorage.assignments); }
function saveAssignments(a){ localStorage.assignments = JSON.stringify(a); }

// LOGIN
function login(){
  const u = username.value;
  const p = password.value;
  const user = getUsers().find(x=>x.username===u && x.password===p);
  if(!user) return loginMsg.innerText="Hatalı giriş";

  currentUser = user;
  loginDiv.classList.add("hidden");
  document.getElementById(user.role+"Panel").classList.remove("hidden");

  if(user.role==="amir") loadSofors();
  if(user.role==="sofor") loadSofor();
}

// LOGOUT
function logout(){
  location.reload();
}

// OWNER
function addUser(){
  let users = getUsers();
  users.push({username:newUser.value,password:newPass.value,role:newRole.value,messages:[]});
  saveUsers(users);
  alert("Eklendi");
}

function deleteUser(){
  let users = getUsers().filter(u=>u.username!==deleteUser.value);
  saveUsers(users);
  alert("Silindi");
}

function changePassword(){
  let users = getUsers();
  let u = users.find(x=>x.username===passUser.value);
  if(!u) return alert("Yok");
  u.password=newPassword.value;
  saveUsers(users);
  alert("Değişti");
}

function sendMessage(){
  let users = getUsers();
  users.forEach(u=>{
    if(u.role!=="owner")
      u.messages.push({text:ownerMsg.value,date:new Date().toLocaleString()});
  });
  saveUsers(users);
  alert("Gönderildi");
}

// AMİR
function loadSofors(){
  soforSelect.innerHTML="";
  getUsers().filter(u=>u.role==="sofor").forEach(s=>{
    soforSelect.innerHTML+=`<option>${s.username}</option>`;
  });
}

function assign(){
  let a = getAssignments();
  a = a.filter(x=>x.sofor!==soforSelect.value);
  a.push({sofor:soforSelect.value,hat:hatSelect.value,arac:aracSelect.value});
  saveAssignments(a);
  renderAssignments();
}

function renderAssignments(){
  assignments.innerHTML="";
  getAssignments().forEach(a=>{
    assignments.innerHTML+=`${a.sofor} → ${a.arac} | ${a.hat}<br>`;
  });
}

// ŞOFÖR
function loadSofor(){
  let a = getAssignments().find(x=>x.sofor===currentUser.username);
  soforInfo.innerHTML = a ? `${a.arac}<br>${a.hat}` : "Atama yok";

  messages.innerHTML="";
  currentUser.messages.forEach(m=>{
    messages.innerHTML+=`[${m.date}] ${m.text}<br>`;
  });
}

function startTrip(){
  alert("Sefer başladı (+3 saat)");
}
