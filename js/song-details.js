// js/song-details.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const ctn    = document.getElementById('songDetails');

  if (!id) {
    ctn.innerHTML = '<p>Трек не найден.</p>';
    return;
  }

  const snap = await getDoc(doc(db,"songs",id));
  if (!snap.exists() || snap.data().status!=="approved") {
    ctn.innerHTML = '<p>Трек не найден или не одобрен.</p>';
    return;
  }

  const s = snap.data();
  ctn.innerHTML = `
    <div class="track-details-container">
      <div class="track-header">
        <img src="${s.cover||'placeholder.jpg'}" class="track-cover" alt>
        <div class="track-title-artist">
          <h2>${s.title}</h2>
          <p><strong>Исполнитель:</strong> ${s.artist}</p>
          ${s.feat?`<p><strong>Feat:</strong> ${s.feat}</p>`:""}
        </div>
      </div>
      <div class="track-lyrics">
        ${s.lyrics?`<pre class="lyrics-text">${s.lyrics}</pre>`:""}
      </div>
      <div class="track-additional-info">
        <p><strong>Жанр:</strong> ${s.genre}</p>
        ${s.producer?`<p><strong>Продюсер:</strong> ${s.producer}</p>`:""}
        ${s.lyricist?`<p><strong>Автор:</strong> ${s.lyricist}</p>`:""}
        ${s.releaseDate?`<p><strong>Дата выхода:</strong> ${s.releaseDate}</p>`:""}
      </div>
    </div>`;
});
