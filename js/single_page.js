// js/single.js

// URL parametrelerinden film adını almak için bir fonksiyon
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
    }
  }
  return null;
}

// Türkçe karakterleri normalize eden fonksiyon
function normalizeFilmName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function normalizeeFilmName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "%20");
}

const filmName = getQueryVariable("film");
if (filmName) {
  fetch("/js/data.json")
    .then((response) => response.json())
    .then((data) => {
      const film = data.find(
        (f) =>
          normalizeFilmName(f.name.toLowerCase()) === filmName.toLowerCase()
      );
      if (film) {
        document.getElementById("film-gorsel").src = film.img;
        document.getElementById("film-baslik").textContent = film.name;
        document.getElementById("film-tur").textContent = `Tür: ${film.tur}`;
        document.getElementById(
          "film-yil"
        ).textContent = `Yapım Yılı: ${film.year}`;
        document.getElementById(
          "film-yonetmen"
        ).textContent = `Yönetmen: ${film.director}`;
        document.getElementById(
          "film-oyuncular"
        ).textContent = `Oyuncular: ${film.players}`;
        document.getElementById(
          "film-ozet"
        ).textContent = `Özet: ${film.description}`;

        // Breadcrumb güncellemesi
        document.getElementById("single_tur_page").textContent = film.tur;
        document.getElementById(
          "single_tur_page"
        ).href = `single_tur_page.html?tur=${normalizeeFilmName(film.tur)}`;
        document.getElementById("film-adi").textContent = film.name;
      } else {
        console.error("Film bulunamadı.");
      }
    })
    .catch((error) => console.error("Hata:", error));
} else {
  console.error("Film adı URL parametresinde bulunamadı.");
}

// Yorumları tutmak için bir dizi oluşturuyoruz
let comments = [];

// Yorum ekleme formunu ve yıldızları seçiyoruz
const commentForm = document.getElementById("comment-form");
const stars = document.getElementById("stars").children;

// Yıldızlara tıklamayı dinliyoruz ve puanı belirliyoruz
let rating = 0;
for (let i = 0; i < stars.length; i++) {
  stars[i].addEventListener("click", function (e) {
    e.preventDefault(); // Sayfanın en başına atlamasını engelliyoruz
    rating = parseInt(this.getAttribute("data-value"));
    highlightStars(rating);
  });
}

// Yıldızları vurguluyoruz
function highlightStars(num) {
  for (let i = 0; i < stars.length; i++) {
    if (i < num) {
      stars[i].classList.add("highlight");
    } else {
      stars[i].classList.remove("highlight");
    }
  }
}

// Yıldızlara tıklandığında active sınıfını ekleyelim
for (let i = 0; i < stars.length; i++) {
  stars[i].addEventListener("click", function (e) {
    e.preventDefault(); // Sayfanın en başına atlamasını engelliyoruz
    rating = parseInt(this.getAttribute("data-value"));
    highlightStars(rating);

    // Active sınıfını ekleyelim
    for (let j = 0; j < stars.length; j++) {
      if (j <= i) {
        stars[j].classList.add("active");
      } else {
        stars[j].classList.remove("active");
      }
    }
  });
}

// Yorum ekleme formunu göndermeyi dinliyoruz
commentForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Sayfanın yeniden yüklenmesini engelliyoruz
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const commentText = document.getElementById("comment").value;

  if (!name || !email || !commentText || rating === 0) {
    alert("Lütfen tüm alanları doldurun ve bir puan verin.");
    return;
  }

  // Yeni yorumu diziye ekliyoruz
  const comment = {
    name: name,
    email: email,
    commentText: commentText,
    rating: rating,
    date: new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  comments.push(comment);
  updateCommentList();

  // Yorum ekleme formunu sıfırlıyoruz
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("comment").value = "";
  rating = 0;
  highlightStars(rating);

  // Yorumları local storage'e kaydediyoruz
  localStorage.setItem(`comments_${filmName}`, JSON.stringify(comments));
});

// Sayfa yüklendiğinde local storage'deki yorumları alıyoruz
if (localStorage.getItem(`comments_${filmName}`)) {
  comments = JSON.parse(localStorage.getItem(`comments_${filmName}`));
  updateCommentList();
}

// Yorumları güncelleyen fonksiyon
function updateCommentList() {
  const commentList = document.getElementById("comment-list");
  commentList.innerHTML = "";

  comments.forEach((comment) => {
    const li = document.createElement("li");
    li.classList.add("comment-item");

    const avatar = document.createElement("div");
    avatar.classList.add("comment-avatar");
    const avatarImg = document.createElement("img");
    avatarImg.src = "/images/avatar.png";
    avatarImg.alt = "Avatar";
    avatar.appendChild(avatarImg);
    li.appendChild(avatar);

    const commentText = document.createElement("div");
    commentText.classList.add("comment-text");
    const starList = document.createElement("ul");
    starList.classList.add("comment-star");
    for (let i = 0; i < comment.rating; i++) {
      const starItem = document.createElement("li");
      const starIcon = document.createElement("i");
      starIcon.classList.add("bi", "bi-star-fill");
      starItem.appendChild(starIcon);
      starList.appendChild(starItem);
    }
    commentText.appendChild(starList);
    const commentMeta = document.createElement("div");
    commentMeta.classList.add("comment-meta");
    commentMeta.innerHTML = `<strong>${comment.name}</strong> - <time>${comment.date}</time>`;
    commentText.appendChild(commentMeta);
    const commentDescription = document.createElement("div");
    commentDescription.classList.add("comment-description");
    commentDescription.textContent = comment.commentText;
    commentText.appendChild(commentDescription);
    li.appendChild(commentText);

    commentList.appendChild(li);
  });
}
