// js/main.js
import { initializeApp }       from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, getDocs }
       from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmSng88xnPQgxhUYoRZsPnCi9MB9Z7aP8",
  authDomain: "lyricsfinder-689ac.firebaseapp.com",
  projectId: "lyricsfinder-689ac",
  storageBucket: "lyricsfinder-689ac.appspot.com",
  messagingSenderId: "643308267858",
  appId: "1:643308267858:web:22a45404aeebf85767328b",
  measurementId: "G-F1ELHLM4DB"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function fetchApprovedSongs() {
  const q = query(collection(db,"songs"), where("status","==","approved"), orderBy("createdAt","desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d=>({ id:d.id, ...d.data() }));
}

function renderSongs(songs) {
  const c = document.getElementById('results');
  c.innerHTML = songs.length
    ? songs.map(s=>`
        <div class="song-card" onclick="window.location='song-details.html?id=${s.id}'">
          <img src="${s.cover||'placeholder.jpg'}">
          <div class="song-info">
            <h3>${s.title}</h3>
            <p>${s.artist}</p>
          </div>
        </div>`).join('')
    : '<p>Песни не найдены.</p>';
}

async function searchSongs() {
  const qText = document.getElementById('searchInput').value.trim().toLowerCase();
  const all = await fetchApprovedSongs();
  const filtered = qText
    ? all.filter(s=> (s.artist+' '+s.title).toLowerCase().includes(qText))
    : all;
  renderSongs(filtered);
}

document.getElementById('searchBtn').onclick = searchSongs;
document.getElementById('searchInput').onkeydown = e=>{ if(e.key==='Enter'){e.preventDefault();searchSongs();} };

// сразу показываем все
searchSongs();
