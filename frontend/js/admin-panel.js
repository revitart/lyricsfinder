document.addEventListener('DOMContentLoaded', function() {
  // Проверка авторизации: если localStorage.adminAuth не равен 'true', перенаправляем на index.html
  if (localStorage.getItem('adminAuth') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const adminPanel = document.getElementById('adminPanel');
  const adminSearchInput = document.getElementById('adminSearchInput');

  function fetchSongs() {
    return JSON.parse(localStorage.getItem('songs')) || [];
  }

  function saveSongs(songs) {
    localStorage.setItem('songs', JSON.stringify(songs));
  }

  function renderAdminPanel(filter = '') {
    const songs = fetchSongs();
    adminPanel.innerHTML = '';

    // Фильтрация по названию или исполнителю
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(filter) ||
      song.artist.toLowerCase().includes(filter)
    );

    // Разделение по статусу
    const pendingSongs = filteredSongs.filter(song => song.status === 'pending');
    const approvedSongs = filteredSongs.filter(song => song.status === 'approved');

    // Отображаем заявки
    const pendingHeading = document.createElement('h2');
    pendingHeading.textContent = 'Заявки на добавление треков';
    adminPanel.appendChild(pendingHeading);
    const pendingContainer = document.createElement('div');
    pendingContainer.className = 'admin-section pending-section';
    adminPanel.appendChild(pendingContainer);
    if (pendingSongs.length === 0) {
      pendingContainer.innerHTML = '<p class="admin-no-songs">Нет заявок на добавление треков.</p>';
    } else {
      pendingSongs.forEach(song => {
        const card = createAdminCard(song);
        const btnContainer = document.createElement('div');
        btnContainer.className = 'admin-buttons';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редактировать';
        editBtn.className = 'btn-edit';
        editBtn.onclick = () => openEditModal(song);

        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Одобрить';
        approveBtn.className = 'btn-primary';
        approveBtn.onclick = () => updateSongStatus(song.id, 'approved');

        const declineBtn = document.createElement('button');
        declineBtn.textContent = 'Отклонить';
        declineBtn.className = 'btn-secondary';
        declineBtn.onclick = () => updateSongStatus(song.id, 'declined');

        btnContainer.append(editBtn, approveBtn, declineBtn);
        card.appendChild(btnContainer);
        pendingContainer.appendChild(card);
      });
    }

    // Отображаем одобренные треки
    const approvedHeading = document.createElement('h2');
    approvedHeading.textContent = 'Добавленные треки';
    adminPanel.appendChild(approvedHeading);
    const approvedContainer = document.createElement('div');
    approvedContainer.className = 'admin-section approved-section';
    adminPanel.appendChild(approvedContainer);
    if (approvedSongs.length === 0) {
      approvedContainer.innerHTML = '<p class="admin-no-songs">Нет добавленных треков.</p>';
    } else {
      approvedSongs.forEach(song => {
        const card = createAdminCard(song);
        const btnContainer = document.createElement('div');
        btnContainer.className = 'admin-buttons';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редактировать';
        editBtn.className = 'btn-edit';
        editBtn.onclick = () => openEditModal(song);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'btn-secondary';
        deleteBtn.onclick = () => updateSongStatus(song.id, 'delete');

        btnContainer.append(editBtn, deleteBtn);
        card.appendChild(btnContainer);
        approvedContainer.appendChild(card);
      });
    }
  }

  function createAdminCard(song) {
    const card = document.createElement('div');
    card.className = 'admin-card';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'admin-card-header';

    const coverImg = document.createElement('img');
    coverImg.src = song.cover || 'placeholder.jpg';
    coverImg.alt = song.title;
    coverImg.className = 'admin-cover';
    headerDiv.appendChild(coverImg);

    const basicInfoDiv = document.createElement('div');
    basicInfoDiv.className = 'admin-basic-info';

    const titleElem = document.createElement('h3');
    titleElem.textContent = song.title;
    basicInfoDiv.appendChild(titleElem);

    const artistElem = document.createElement('p');
    artistElem.innerHTML = `<strong>Исполнитель:</strong> ${song.artist}`;
    basicInfoDiv.appendChild(artistElem);

    headerDiv.appendChild(basicInfoDiv);
    card.appendChild(headerDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'admin-card-details';

    if (song.feat && song.feat.trim() !== '') {
      const featElem = document.createElement('p');
      featElem.innerHTML = `<strong>Приглашенный гость:</strong> ${song.feat}`;
      detailsDiv.appendChild(featElem);
    }

    const genreElem = document.createElement('p');
    genreElem.innerHTML = `<strong>Жанр:</strong> ${song.genre}`;
    detailsDiv.appendChild(genreElem);

    if (song.lyrics && song.lyrics.trim() !== '') {
      const lyricsElem = document.createElement('div');
      lyricsElem.className = 'admin-lyrics';
      lyricsElem.innerText = song.lyrics;
      detailsDiv.appendChild(lyricsElem);
    }

    if (song.producer && song.producer.trim() !== '') {
      const producerElem = document.createElement('p');
      producerElem.innerHTML = `<strong>Продюсер:</strong> ${song.producer}`;
      detailsDiv.appendChild(producerElem);
    }

    if (song.lyricist && song.lyricist.trim() !== '') {
      const lyricistElem = document.createElement('p');
      lyricistElem.innerHTML = `<strong>Автор текста:</strong> ${song.lyricist}`;
      detailsDiv.appendChild(lyricistElem);
    }

    if (song.releaseDate && song.releaseDate.trim() !== '') {
      const releaseDateElem = document.createElement('p');
      releaseDateElem.innerHTML = `<strong>Дата выхода:</strong> ${song.releaseDate}`;
      detailsDiv.appendChild(releaseDateElem);
    }

    card.appendChild(detailsDiv);
    return card;
  }

  function updateSongStatus(id, newStatus) {
    let songs = fetchSongs();
    if (newStatus === 'delete') {
      songs = songs.filter(song => song.id != id);
    } else {
      songs = songs.map(song => {
        if (song.id == id) {
          return { ...song, status: newStatus };
        }
        return song;
      });
    }
    saveSongs(songs);
    renderAdminPanel(adminSearchInput.value.trim().toLowerCase());
  }

  function openModal(message, onConfirm) {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.innerHTML = '';
    const modal = document.createElement('div');
    modal.className = 'modal';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.textContent = 'Подтверждение';
    modal.appendChild(header);

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.textContent = message;
    modal.appendChild(content);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'modal-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Отмена';
    cancelBtn.onclick = () => { modalOverlay.classList.remove('active'); };

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-primary';
    confirmBtn.textContent = 'Подтвердить';
    confirmBtn.onclick = () => {
      modalOverlay.classList.remove('active');
      onConfirm();
    };

    buttonsDiv.append(cancelBtn, confirmBtn);
    modal.appendChild(buttonsDiv);
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add('active');
  }

  function openEditModal(song) {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.innerHTML = '';
    const modal = document.createElement('div');
    modal.className = 'modal';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.textContent = 'Редактировать песню';
    modal.appendChild(header);

    const form = document.createElement('form');
    form.innerHTML = `
      <label>Исполнитель: <input type="text" name="artist" value="${song.artist}" required></label>
      <label>Название песни: <input type="text" name="title" value="${song.title}" required></label>
      <label>Приглашенный гость: <input type="text" name="feat" value="${song.feat || ''}"></label>
      <label>Жанр: <input type="text" name="genre" value="${song.genre}" required></label>
      <label>Текст песни: <textarea name="lyrics" required>${song.lyrics}</textarea></label>
      <label>Продюсер: <input type="text" name="producer" value="${song.producer || ''}"></label>
      <label>Автор текста: <input type="text" name="lyricist" value="${song.lyricist || ''}"></label>
      <label>Дата выхода: <input type="date" name="releaseDate" value="${song.releaseDate || ''}"></label>
    `;
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'modal-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Отмена';
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => { modalOverlay.classList.remove('active'); };

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary';
    saveBtn.textContent = 'Сохранить';
    saveBtn.type = 'submit';

    buttonsDiv.append(cancelBtn, saveBtn);
    form.appendChild(buttonsDiv);
    modal.appendChild(form);
    modalOverlay.appendChild(modal);
    modalOverlay.classList.add('active');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const updatedSong = {
        artist: formData.get('artist').trim(),
        title: formData.get('title').trim(),
        feat: formData.get('feat').trim(),
        genre: formData.get('genre').trim(),
        lyrics: formData.get('lyrics').trim(),
        producer: formData.get('producer').trim(),
        lyricist: formData.get('lyricist').trim(),
        releaseDate: formData.get('releaseDate')
      };
      let songs = fetchSongs();
      songs = songs.map(songItem => {
        if (songItem.id == song.id) {
          return { ...songItem, ...updatedSong };
        }
        return songItem;
      });
      saveSongs(songs);
      modalOverlay.classList.remove('active');
      renderAdminPanel(adminSearchInput.value.trim().toLowerCase());
    });
  }

  adminSearchInput.addEventListener('input', function() {
    renderAdminPanel(adminSearchInput.value.trim().toLowerCase());
  });

  renderAdminPanel('');
});
