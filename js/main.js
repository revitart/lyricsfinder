document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultsContainer = document.getElementById('results');

  function renderSongs(songs) {
    resultsContainer.innerHTML = '';
    if (songs.length === 0) {
      resultsContainer.innerHTML = '<p>Песни не найдены.</p>';
      return;
    }
    songs.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card';
      card.onclick = function() {
        window.location.href = `song-details.html?id=${song.id}`;
      };

      const coverImg = document.createElement('img');
      coverImg.src = song.cover || 'placeholder.jpg';
      coverImg.alt = song.title;
      card.appendChild(coverImg);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'song-info';
      const titleElem = document.createElement('h3');
      titleElem.textContent = song.title;
      const artistElem = document.createElement('p');
      artistElem.textContent = song.artist;
      infoDiv.appendChild(titleElem);
      infoDiv.appendChild(artistElem);
      card.appendChild(infoDiv);

      resultsContainer.appendChild(card);
    });
  }

  function searchSongs() {
    const query = searchInput.value.trim().toLowerCase();
    const songs = JSON.parse(localStorage.getItem('songs')) || [];
    // Отбираем только одобренные треки
    const approvedSongs = songs.filter(song => song.status === 'approved');

    let filteredSongs;
    if (query === "") {
      // Если строка поиска пустая, показываем все одобренные треки
      filteredSongs = approvedSongs;
    } else {
      const normalizedQuery = query.replace(/[-]/g, ' ').replace(/\s+/g, ' ');
      filteredSongs = approvedSongs.filter(song => {
        const combinedText = (song.artist + " " + song.title).toLowerCase();
        const normalizedText = combinedText.replace(/[-]/g, ' ').replace(/\s+/g, ' ');
        return normalizedText.includes(normalizedQuery);
      });
    }
    renderSongs(filteredSongs);
  }

  searchBtn.addEventListener('click', searchSongs);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchSongs();
    }
  });

  // При загрузке страницы сразу выводим все одобренные треки
  searchSongs();
});
