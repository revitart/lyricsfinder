// js/add-song.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmSng88xnPQgxhUYoRZsPnCi9MB9Z7aP8",
  authDomain: "lyricsfinder-689ac.firebaseapp.com",
  projectId: "lyricsfinder-689ac",
  storageBucket: "lyricsfinder-689ac.firebasestorage.app",
  messagingSenderId: "643308267858",
  appId: "1:643308267858:web:22a45404aeebf85767328b",
  measurementId: "G-F1ELHLM4DB"
};
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

let currentUserEmail = null;
onAuthStateChanged(auth, user => {
  if (user) currentUserEmail = user.email;
  else {
    alert("Нужно войти, чтобы отправлять заявки.");
    window.location.href = "login.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addSongForm');
  const genreSelect = document.getElementById('genre');
  const customGenreContainer = document.getElementById('customGenreContainer');

  genreSelect.addEventListener('change', () => {
    customGenreContainer.style.display = genreSelect.value === 'Другой' ? 'block' : 'none';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentUserEmail) return;

    const artist      = document.getElementById('artist').value.trim();
    const title       = document.getElementById('title').value.trim();
    const feat        = document.getElementById('feat').value.trim();
    let genre         = genreSelect.value;
    if (genre === 'Другой') {
      const c = document.getElementById('customGenre').value.trim();
      if (c) genre = c;
    }
    const lyrics      = document.getElementById('lyrics').value.trim();
    const cover       = document.getElementById('coverUrl').value.trim();
    const producer    = document.getElementById('producer').value.trim();
    const lyricist    = document.getElementById('lyricist').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;

    try {
      await addDoc(collection(db, "songs"), {
        artist,
        title,
        feat,
        genre,
        lyrics,
        cover,
        producer,
        lyricist,
        releaseDate,
        status: "pending",
        submittedBy: currentUserEmail,
        createdAt: serverTimestamp()
      });
      alert('Песня отправлена на проверку!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки: " + err.message);
    }
  });
});
