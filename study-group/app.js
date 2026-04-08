// ================= Firebase Config =================

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore Database
const db = firebase.firestore();



// ================= Create Session =================

function createSession() {

let name = document.getElementById("name").value;
let subject = document.getElementById("subject").value;
let time = document.getElementById("time").value;

db.collection("sessions").add({
name: name,
subject: subject,
time: time,
participants: [name],
createdAt: new Date()
})

.then((docRef)=>{

let link = window.location.href + "?session=" + docRef.id;

alert("Session Created!\nShare this link:\n" + link);

})

}


// ================= Real Time Sessions =================

db.collection("sessions")
.orderBy("createdAt", "desc")
.onSnapshot((snapshot) => {

  let html = "";

  snapshot.forEach((doc) => {

    let data = doc.data();

    html += `
<div>
<h3>${data.subject}</h3>
<p>Started by: ${data.name}</p>
<p>Time: ${data.time} mins</p>

<p>Participants:</p>
<ul>
${data.participants.map(p => `<li>${p}</li>`).join("")}
</ul>

<button onclick="joinSession('${doc.id}')">
Join Session
</button>

</div>
`

  });

  document.getElementById("sessions").innerHTML = html;

});



// ================= Join Session =================

function joinSession(id) {
  function joinSession(id){

let user = document.getElementById("name").value;

if(!user){
alert("Enter your name first");
return;
}

let sessionRef = db.collection("sessions").doc(id);

sessionRef.get().then((doc)=>{

let data = doc.data();

let participants = data.participants || [];

if(!participants.includes(user)){
participants.push(user);

sessionRef.update({
participants: participants
})

alert("Joined Successfully");

}

})

}

  
}
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session');

if(sessionId){
setTimeout(()=>{
joinSession(sessionId);
},2000)
}