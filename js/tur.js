// js/tur.json

document.addEventListener("DOMContentLoaded", function () {
  fetch("/js/tur.json")
    .then((response) => response.json())
    .then((data) => {
      // Türler kısmı
      const turList = document.getElementById("tur-list");
      if (turList) {
        data.forEach((tur) => {
          const li = document.createElement("li");
          li.className = "tur-item";
          const a = document.createElement("a");
          a.href = `single_tur_page.html?tur=${encodeURIComponent(tur.tur)}`;
          a.innerHTML = `<span>${tur.tur}</span>`;
          li.appendChild(a);
          turList.appendChild(li);
        });
      }

      // Menü dropdown kısmı
      const menuDropdownContent = document.getElementById(
        "menu-dropdown-content"
      );
      if (menuDropdownContent) {
        data.forEach((tur) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `single_tur_page.html?tur=${encodeURIComponent(tur.tur)}`;
          a.innerText = tur.tur;
          li.appendChild(a);
          menuDropdownContent.appendChild(li);
        });
      }
    })
    .catch((error) => console.error("Hata:", error));
});
