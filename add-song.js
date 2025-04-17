document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addSongForm');
  const genreSelect = document.getElementById('genre');
  const customGenreContainer = document.getElementById('customGenreContainer');

  // Показ поля «Другой жанр»
  genreSelect.addEventListener('change', () => {
    customGenreContainer.style.display = genreSelect.value === 'Другой' ? 'block' : 'none';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const artist = document.getElementById('artist').value.trim();
    const title = document.getElementById('title').value.trim();
    const feat = document.getElementById('feat').value.trim();
    let genre = genreSelect.value;
    if (genre === 'Другой') {
      const custom = document.getElementById('customGenre').value.trim();
      if (custom) genre = custom;
    }
    const lyrics = document.getElementById('lyrics').value.trim();
    const cover = document.getElementById('coverUrl').value.trim();
    const producer = document.getElementById('producer').value.trim();
    const lyricist = document.getElementById('lyricist').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;
    const currentUser = localStorage.getItem('currentUser') || 'anonymous';

    const newSong = {
      id: Date.now(),
      artist,
      title,
      feat,
      genre,
      lyrics,
      cover,
      producer,
      lyricist,
      releaseDate,
      status: 'pending',
      submittedBy: currentUser
    };

    const songs = JSON.parse(localStorage.getItem('songs')) || [];
    songs.push(newSong);
    localStorage.setItem('songs', JSON.stringify(songs));

    alert('Песня отправлена на проверку!');
    form.reset();
  });
});
