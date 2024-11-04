// js/single_tur_page.js

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tur = urlParams.get("tur");
  const filmList = document.getElementById("film-list");
  const turTitle = document.getElementById("tur");

  if (tur) {
    turTitle.innerText = `${tur} Filmleri`;

    fetch("/js/data.json")
      .then((response) => response.json())
      .then((data) => {
        // Verilen türe göre filmleri filtreleyin
        const filteredMovies = data.filter((movie) => movie.tur === tur);

        // Filtrelenmiş filmleri ekrana ekleyin
        filmList.innerHTML = ""; // Mevcut içeriği temizleyin
        if (filteredMovies.length > 0) {
          filteredMovies.forEach((movie) => {
            const filmItem = document.createElement("li");
            filmItem.classList.add("film-item");

            const filmImage = document.createElement("div");
            filmImage.classList.add("film-image");
            const filmImageLink = document.createElement("a");
            filmImageLink.href =
              "single_page.html?film=" +
              normalizeFilmName(movie.name.toLowerCase());
            const filmImageImg = document.createElement("img");
            filmImageImg.src = movie.img;
            filmImageImg.alt = movie.name;
            filmImageLink.appendChild(filmImageImg);
            filmImage.appendChild(filmImageLink);
            filmItem.appendChild(filmImage);

            const filmInfo = document.createElement("div");
            filmInfo.classList.add("film-info");
            const filmTitleLink = document.createElement("a");
            filmTitleLink.href =
              "single_page.html?film=" +
              normalizeFilmName(movie.name.toLowerCase());
            const filmTitle = document.createElement("h3");
            filmTitle.textContent = movie.name;
            filmTitleLink.appendChild(filmTitle);
            filmInfo.appendChild(filmTitleLink);

            filmItem.appendChild(filmInfo);
            filmList.appendChild(filmItem);
          });
        } else {
          filmList.innerHTML = "<p>Bu türe ait film bulunamadı.</p>";
        }
      })
      .catch((error) => console.error("Hata:", error));
  } else {
    turTitle.innerText = "Tür bulunamadı";
  }
});

function normalizeFilmName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}
