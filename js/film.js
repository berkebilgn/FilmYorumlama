// js/film.js

fetch("/js/data.json")
  .then((response) => response.json())
  .then((data) => {
    const filmList = document.getElementById("film-list");

    data.forEach((film) => {
      const filmItem = document.createElement("li");
      filmItem.classList.add("film-item");

      const filmImage = document.createElement("div");
      filmImage.classList.add("film-image");
      const filmImageLink = document.createElement("a");
      filmImageLink.href =
        "single_page.html?film=" + normalizeFilmName(film.name.toLowerCase());
      const filmImageImg = document.createElement("img");
      filmImageImg.src = film.img;
      filmImageImg.alt = film.name;
      filmImageLink.appendChild(filmImageImg);
      filmImage.appendChild(filmImageLink);
      filmItem.appendChild(filmImage);

      const filmInfo = document.createElement("div");
      filmInfo.classList.add("film-info");
      const filmTitleLink = document.createElement("a");
      filmTitleLink.href =
        "single_page.html?film=" + normalizeFilmName(film.name.toLowerCase());
      const filmTitle = document.createElement("h3");
      filmTitle.textContent = film.name;
      filmTitleLink.appendChild(filmTitle);
      filmInfo.appendChild(filmTitleLink);

      filmItem.appendChild(filmInfo);
      filmList.appendChild(filmItem);
    });
  })
  .catch((error) => {
    console.error("Film verileri çekilirken hata oluştu:", error);
  });

function normalizeFilmName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}
