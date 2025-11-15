// Подгружаем sidebar.html во все страницы

fetch("/NovaModeratorBot/assets/sidebar.html")
  .then(response => response.text())
  .then(html => {
      document.getElementById("sidebar").innerHTML = html;

      // Определяем текущий путь
      const current = window.location.pathname;

      // Подсвечиваем активную кнопку
      document.querySelectorAll(".sidebar .item").forEach(link => {
          if (current.includes(link.getAttribute("href"))) {
              link.style.background = "rgba(255,255,255,0.07)";
              link.style.borderLeft = "4px solid #6aa7ff";
              link.style.color = "#ffffff";
          }
      });
  });
