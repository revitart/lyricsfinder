document.addEventListener('DOMContentLoaded', function() {
  const songDetailsContainer = document.getElementById('songDetails');
  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('id');

  if (!songId) {
    songDetailsContainer.innerHTML = '<p>Трек не найден.</p>';
    return;
  }

  const songs = JSON.parse(localStorage.getItem('songs')) || [];
  // Находим трек с заданным id и со статусом "approved"
  const song = songs.find(s => s.id == songId && s.status === 'approved');

  if (!song) {
    songDetailsContainer.innerHTML = '<p>Трек не найден или не одобрен.</p>';
    return;
  }

  const container = document.createElement('div');
  container.className = 'track-details-container';

  const headerSection = document.createElement('div');
  headerSection.className = 'track-header';
  
  const coverImg = document.createElement('img');
  coverImg.src = song.cover || 'placeholder.jpg';
  coverImg.alt = song.title;
  coverImg.className = 'track-cover';
  headerSection.appendChild(coverImg);

  const titleArtistDiv = document.createElement('div');
  titleArtistDiv.className = 'track-title-artist';

  const titleElem = document.createElement('h2');
  titleElem.textContent = song.title;
  titleArtistDiv.appendChild(titleElem);

  const artistElem = document.createElement('p');
  artistElem.innerHTML = `<strong>Исполнитель:</strong> ${song.artist}`;
  titleArtistDiv.appendChild(artistElem);

  if (song.feat && song.feat.trim() !== '') {
    const featElem = document.createElement('p');
    featElem.innerHTML = `<strong>Приглашенный гость:</strong> ${song.feat}`;
    titleArtistDiv.appendChild(featElem);
  }
  
  headerSection.appendChild(titleArtistDiv);
  container.appendChild(headerSection);

  const lyricsSection = document.createElement('div');
  lyricsSection.className = 'track-lyrics';
  if (song.lyrics && song.lyrics.trim() !== '') {
    const lyricsElem = document.createElement('pre');
    lyricsElem.className = 'lyrics-text';
    lyricsElem.textContent = song.lyrics;
    lyricsSection.appendChild(lyricsElem);
  }
  container.appendChild(lyricsSection);

  const additionalSection = document.createElement('div');
  additionalSection.className = 'track-additional-info';
  
  const genreElem = document.createElement('p');
  genreElem.innerHTML = `<strong>Жанр:</strong> ${song.genre}`;
  additionalSection.appendChild(genreElem);

  if (song.producer && song.producer.trim() !== '') {
    const producerElem = document.createElement('p');
    producerElem.innerHTML = `<strong>Продюсер:</strong> ${song.producer}`;
    additionalSection.appendChild(producerElem);
  }
  
  if (song.lyricist && song.lyricist.trim() !== '') {
    const lyricistElem = document.createElement('p');
    lyricistElem.innerHTML = `<strong>Автор текста:</strong> ${song.lyricist}`;
    additionalSection.appendChild(lyricistElem);
  }
  
  if (song.releaseDate && song.releaseDate.trim() !== '') {
    const releaseDateElem = document.createElement('p');
    releaseDateElem.innerHTML = `<strong>Дата выхода:</strong> ${song.releaseDate}`;
    additionalSection.appendChild(releaseDateElem);
  }
  
  container.appendChild(additionalSection);
  songDetailsContainer.appendChild(container);
});
