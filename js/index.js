// js/index.js

/* Home Sidebar Start */

const btnOpenSidebar = document.querySelector("#btn-menu");
const sidebar = document.querySelector("#sidebar");
const btnCloseSidebar = document.querySelector("#close-sidebar");
btnOpenSidebar.addEventListener("click", function () {
  sidebar.style.left = "0";
});

btnCloseSidebar.addEventListener("click", function () {
  sidebar.style.left = "-100%";
});
/* Home Sidebar End */

// Search Modal Start
const btnOpenSearch = document.querySelector(".search-button");
const btnCloseSearch = document.getElementById("close-search");
const modalSearch = document.getElementsByClassName("modal-search");
const modalSearchWrapper = document.getElementsByClassName("modal-wrapper");
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

btnOpenSearch.addEventListener("click", function () {
  modalSearch[0].style.visibility = "visible";
  modalSearch[0].style.opacity = "1";
});

btnCloseSearch.addEventListener("click", function () {
  modalSearch[0].style.visibility = "hidden";
  modalSearch[0].style.opacity = "0";
});

/* Click Outside Start */
document.addEventListener("click", function (e) {
  if (
    !e.composedPath().includes(modalSearchWrapper[0]) &&
    !e.composedPath().includes(btnOpenSearch)
  ) {
    modalSearch[0].style.visibility = "hidden";
    modalSearch[0].style.opacity = "0";
  }
});
/* Click Outside End */

// Film verilerini saklayacağımız değişken
let movies = [];

// JSON dosyasından verileri alıyoruz
fetch("/js/data.json")
  .then((response) => response.json())
  .then((data) => {
    movies = data;
  })
  .catch((error) => {
    console.error("Hata: JSON dosyası alınamadı.", error);
  });

// Film arama işlemini gerçekleştiren fonksiyon
function searchMovies(event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim().toLowerCase();

  // Arama işlemini gerçekleştiriyoruz
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm)
  );

  // Arama sonuçlarını gösteriyoruz
  showSearchResults(filteredMovies);
}

// Arama sonuçlarını gösteren fonksiyon
function showSearchResults(results) {
  searchResult.innerHTML = "";

  if (results.length === 0) {
    searchResult.innerHTML = "<p>Aradığınız film bulunamadı.</p>";
    return;
  }

  results.forEach((movie) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result");
    resultItem.innerHTML = `
            <a href="single_page.html?film=${normalizeFilmName(
              movie.name.toLowerCase()
            )}" class="result-item">
                <img src="${movie.img}" class="search-thumb" alt="" />
                <div class="search-info">
                    <h4>${movie.name}</h4>
                    <span class="search-tur">${movie.tur}</span>
                </div>
            </a>
        `;
    searchResult.appendChild(resultItem);
  });
}

// Türkçe karakterleri normalize eden fonksiyon
function normalizeFilmName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

// Boşlukları '_' ile değiştiren fonksiyon
function replaceSpacesWithUnderscores(str) {
  return str.replace(/\s+/g, "_");
}

searchResult.addEventListener("click", function (event) {
  const clickedItem = event.target.closest(".result-item");
  if (clickedItem) {
    // Tıklanan filmin sayfasına yönlendirme
    const filmName = clickedItem.querySelector("h4").textContent;
    const filmUrl = `single_page.html?film=${replaceSpacesWithUnderscores(
      filmName.toLowerCase()
    )}`;
    window.location.href = filmUrl;
  }
});

// Arama formunu dinlemek için event listener ekliyoruz
const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", searchMovies);

// Search Modal End

// Slider Start
let slideIndex = 1;
showSlides(slideIndex);

setInterval(() => {
  showSlides((slideIndex += 1));
}, 4000);

function plusSlide(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slider-item");
  const dots = document.getElementsByClassName("slider-dot");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "flex";
  dots[slideIndex - 1].className += " active";
}

// Slider End

// Add Film to LocalStorage Start

async function getData() {
  const photos = await fetch("/js/data.json");
  const data = await photos.json();

  data ? localStorage.setItem("films", JSON.stringify(data)) : [];
}

getData();

const films = localStorage.getItem("films");
console.log(JSON.parse(films));

// Add Film to LocalStorage End

//Film List Start

function filmsFunc() {
  const filmss = JSON.parse(localStorage.getItem("films"));
  console.log(filmss);
}

filmsFunc();
//Film List End
