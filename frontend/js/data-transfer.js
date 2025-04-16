// Функция экспорта данных из localStorage в файл JSON
function exportLocalStorage() {
    const data = localStorage.getItem('songs');
    if (!data) {
      alert('Нет данных для экспорта');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'songs_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Функция импорта данных из выбранного JSON-файла в localStorage
  function importLocalStorage() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) {
      alert("Выберите файл для импорта.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        JSON.parse(e.target.result); // Проверка валидности JSON
        localStorage.setItem('songs', e.target.result);
        alert("Данные успешно импортированы!");
      } catch (err) {
        alert("Ошибка: неверный формат JSON.");
      }
    };
    reader.readAsText(file);
  }
  
  // Привязываем обработчики к кнопкам после загрузки документа
  document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
  
    if (exportBtn) {
      exportBtn.addEventListener('click', exportLocalStorage);
    }
    if (importBtn) {
      importBtn.addEventListener('click', importLocalStorage);
    }
  });
  