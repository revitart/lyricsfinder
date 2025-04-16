document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('addSongForm');
  const genreSelect = document.getElementById('genre');
  const customGenreContainer = document.getElementById('customGenreContainer');
  const coverInput = document.getElementById('cover');
  const coverPreview = document.getElementById('coverPreview');

  // Показываем или скрываем поле для ввода кастомного жанра
  genreSelect.addEventListener('change', function() {
    customGenreContainer.style.display = genreSelect.value === 'Другой' ? 'block' : 'none';
  });

  // Предпросмотр обложки
  coverInput.addEventListener('change', function() {
    const file = coverInput.files[0];
    if (file) {
      // Проверяем, что выбран файл-изображение
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл с изображением.');
        coverInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        coverPreview.src = e.target.result;
        coverPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      coverPreview.style.display = 'none';
    }
  });

  // Обработка отправки формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const artist = document.getElementById('artist').value.trim();
    const title = document.getElementById('title').value.trim();
    const feat = document.getElementById('feat').value.trim();
    let genre = genreSelect.value;
    if (genre === 'Другой') {
      const customGenre = document.getElementById('customGenre').value.trim();
      if (customGenre) {
        genre = customGenre;
      }
    }
    const lyrics = document.getElementById('lyrics').value.trim();
    const producer = document.getElementById('producer').value.trim();
    const lyricist = document.getElementById('lyricist').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;
    let cover = '';

    if (coverInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        cover = e.target.result;
        saveSong(cover);
      };
      reader.readAsDataURL(coverInput.files[0]);
    } else {
      saveSong(cover);
    }

    function saveSong(coverData) {
      const newSong = {
        id: Date.now(), // Используем время как уникальный id
        artist,
        title,
        feat,
        genre,
        lyrics,
        cover: coverData,
        producer,
        lyricist,
        releaseDate,
        status: 'pending' // Новая заявка сохраняется со статусом "pending"
      };

      // Получаем массив песен из localStorage, если его нет – создаём пустой массив
      const songs = JSON.parse(localStorage.getItem('songs')) || [];
      songs.push(newSong);
      localStorage.setItem('songs', JSON.stringify(songs));

      alert('Песня отправлена на проверку!');
      form.reset();
      coverPreview.style.display = 'none';
    }
  });
});
