// js/admin-panel.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs,
  updateDoc, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async function() {
  if (localStorage.getItem('adminAuth')!=='true') {
    window.location.href='index.html'; return;
  }
  const panel = document.getElementById('adminPanel'),
        searchInp = document.getElementById('adminSearchInput');

  async function fetchByStatus(status) {
    const q = query(collection(db,"songs"), where("status","==",status));
    const snap = await getDocs(q);
    return snap.docs.map(d=>({id:d.id,...d.data()}));
  }

  async function render() {
    const filter = searchInp.value.trim().toLowerCase();
    panel.innerHTML = "";

    const pending  = (await fetchByStatus("pending")).filter(s=>(s.title+s.artist).toLowerCase().includes(filter));
    const approved = (await fetchByStatus("approved")).filter(s=>(s.title+s.artist).toLowerCase().includes(filter));

    panel.innerHTML += `<h2>Заявки на проверку</h2>`;
    const pDiv = document.createElement('div'); pDiv.className='admin-section';
    if (!pending.length) pDiv.innerHTML='<p>Нет заявок.</p>';
    else pending.forEach(s=>pDiv.append(createCard(s,true)));
    panel.append(pDiv);

    panel.innerHTML += `<h2>Одобренные треки</h2>`;
    const aDiv = document.createElement('div'); aDiv.className='admin-section';
    if (!approved.length) aDiv.innerHTML='<p>Нет треков.</p>';
    else approved.forEach(s=>aDiv.append(createCard(s,false)));
    panel.append(aDiv);
  }

  function createCard(song,isPending) {
    const card = document.createElement('div'); card.className='admin-card';
    const hd = document.createElement('div'); hd.className='admin-card-header';
    hd.innerHTML = `
      <img src="${song.cover||'placeholder.jpg'}" class="admin-cover">
      <div class="admin-basic-info">
        <h3>${song.title}</h3>
        <p><strong>Исполнитель:</strong> ${song.artist}</p>
      </div>`;
    card.append(hd);

    const dt = document.createElement('div'); dt.className='admin-card-details';
    dt.innerHTML = `
      ${song.feat?`<p><strong>Feat:</strong> ${song.feat}</p>`:""}
      <p><strong>Жанр:</strong> ${song.genre}</p>
      ${song.lyrics?`<div class="admin-lyrics">${song.lyrics}</div>`:""}
      ${song.producer?`<p><strong>Продюсер:</strong> ${song.producer}</p>`:""}
      ${song.lyricist?`<p><strong>Автор:</strong> ${song.lyricist}</p>`:""}
      ${song.releaseDate?`<p><strong>Дата:</strong> ${song.releaseDate}</p>`:""}`;
    card.append(dt);

    const btns = document.createElement('div'); btns.className='admin-buttons';
    if (isPending) {
      const ok = document.createElement('button'); ok.textContent='Одобрить'; ok.className='btn-primary';
      ok.onclick = async ()=>{ await updateDoc(doc(db,"songs",song.id),{status:"approved",approvedAt:serverTimestamp()}); render(); };
      const no = document.createElement('button'); no.textContent='Отклонить'; no.className='btn-secondary';
      no.onclick = async ()=>{ await updateDoc(doc(db,"songs",song.id),{status:"declined"}); render(); };
      btns.append(ok,no);
    } else {
      const del = document.createElement('button'); del.textContent='Удалить'; del.className='btn-secondary';
      del.onclick = async ()=>{ await deleteDoc(doc(db,"songs",song.id)); render(); };
      btns.append(del);
    }
    card.append(btns);
    return card;
  }

  searchInp.addEventListener('input', render);
  render();
});
