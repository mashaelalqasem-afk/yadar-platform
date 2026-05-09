
function scrollCards(id, direction) {
  const row = document.getElementById(id);

  row.scrollBy({
    left: direction * 650,
    behavior: "smooth"
  });
}

function toggleHeart(event, btn) {
  event.stopPropagation();

  btn.classList.toggle("saved");
  btn.textContent = btn.classList.contains("saved") ? "♥" : "♡";

  saveFavorites();
}

function saveFavorites() {
  const saved = [];

  document.querySelectorAll(".section:not(#favoritesSection) .heart.saved").forEach(heart => {
    const card = heart.closest(".card");
    saved.push(card.dataset.name);
  });

  localStorage.setItem("yadarFavorites", JSON.stringify(saved));
  renderFavorites();
}

function loadFavorites() {
  const saved = JSON.parse(localStorage.getItem("yadarFavorites")) || [];

  document.querySelectorAll(".section:not(#favoritesSection) .card").forEach(card => {
    const heart = card.querySelector(".heart");

    if (saved.includes(card.dataset.name)) {
      heart.classList.add("saved");
      heart.textContent = "♥";
    } else {
      heart.classList.remove("saved");
      heart.textContent = "♡";
    }
  });
}

function renderFavorites() {
  const favoritesContainer = document.getElementById("favoritesCards");
  const favoritesSection = document.getElementById("favoritesSection");

  favoritesContainer.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("yadarFavorites")) || [];
  const allCards = document.querySelectorAll(".section:not(#favoritesSection) .card");

  saved.forEach(savedName => {
    allCards.forEach(card => {
      if (card.dataset.name === savedName) {
        const clone = card.cloneNode(true);
        const heart = clone.querySelector(".heart");

        heart.classList.add("saved");
        heart.textContent = "♥";

        heart.onclick = function(event) {
          toggleHeart(event, card.querySelector(".heart"));
          renderFavorites();
        };

        clone.onclick = card.onclick;

        favoritesContainer.appendChild(clone);
      }
    });
  });

 favoritesSection.style.display = "block";

document.getElementById("favoritesEmpty").style.display =
  saved.length === 0 ? "block" : "none"; }

function openDetails(title, price, rating, image) {

  const descriptions = {
    "Modern apartment":
      "شقة حديثة في موقع مميز بالرياض، مناسبة للعائلات والإقامات القصيرة مع تصميم عصري وإنترنت سريع.",

    "Private chalet":
      "شاليه خاص مع جلسات خارجية ومسبح خاص، مناسب للويكند والعائلات.",

    "Cabin in Abha":
      "كوخ بإطلالة جبلية في أبها مع أجواء هادئة وطبيعة رائعة.",

    "Luxury penthouse":
      "بنتهاوس فاخر بإطلالة مميزة ومساحات واسعة وتجهيزات حديثة.",

    "Villa in Abha":
      "فيلا مريحة في أبها مناسبة للعائلات، بتصميم واسع وأجواء هادئة.",

    "Mountain villa":
      "فيلا جبلية بإطلالة جميلة وأجواء مناسبة للاسترخاء."
  };

  const links = {
    "Modern apartment": "https://www.airbnb.com/",
    "Private chalet": "https://www.booking.com/",
    "Cabin in Abha": "https://www.agoda.com/",
    "Luxury penthouse": "https://www.airbnb.com/",
    "Villa in Abha": "https://www.booking.com/",
    "Mountain villa": "https://www.agoda.com/"
  };

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalPrice").textContent = price;
  document.getElementById("modalRating").textContent = rating;
  document.getElementById("modalImg").src = image;

  document.querySelector(".desc").textContent =
    descriptions[title] ||
    "مكان مقترح ضمن دليل يادار مع تفاصيل مميزة وإقامة مريحة.";

  document.querySelector(".details-link").href =
    links[title] || "https://www.google.com";

  document.querySelector(".details-link").target = "_blank";

  document.getElementById("detailsModal").style.display = "flex";

  document.getElementById("bookingMessage").textContent = "";
  document.getElementById("bookingMessage").classList.remove("show");
  document.getElementById("guestSelect").value = "1";
  document.getElementById("nightSelect").value = "2";
}

function closeDetails() {
  document.getElementById("detailsModal").style.display = "none";
}

document.getElementById("detailsModal").addEventListener("click", function(e) {
  if (e.target === this) {
    closeDetails();
  }
});

function reserveStay() {

  const guests =
    document.getElementById("guestSelect").value;

  const nights =
    document.getElementById("nightSelect").value;

  const title =
    document.getElementById("modalTitle").textContent;

  const message =
    document.getElementById("bookingMessage");

  const bookingData = {
    title: title,
    guests: guests,
    nights: nights
  };

  const savedBookings =
    JSON.parse(localStorage.getItem("yadarBookings")) || [];

  savedBookings.push(bookingData);

  localStorage.setItem(
    "yadarBookings",
    JSON.stringify(savedBookings)
  );

  message.textContent =
    "✅ Booking saved successfully";

  message.classList.add("show");
const reserveBtn =
  document.querySelector(".reserve-btn");

reserveBtn.textContent = "Booked ✓";

setTimeout(() => {
  reserveBtn.textContent = "Reserve";
}, 2000);
}
  
function filterCards() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
  const cityValue = document.getElementById("cityFilter").value;
  const typeValue = document.getElementById("typeFilter").value;
  const priceValue = document.getElementById("priceFilter").value;

  const cards = document.querySelectorAll(".section:not(#favoritesSection) .card");
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const city = card.dataset.city.toLowerCase();
    const type = card.dataset.type.toLowerCase();
    const price = Number(card.dataset.price);

    const matchesSearch =
      name.includes(searchValue) ||
      city.includes(searchValue) ||
      type.includes(searchValue);

    const matchesCity = cityValue === "all" || city === cityValue;
    const matchesType = typeValue === "all" || type === typeValue;
    const matchesPrice = priceValue === "all" || price <= Number(priceValue);

    if (matchesSearch && matchesCity && matchesType && matchesPrice) {
      card.classList.remove("hidden");
      visibleCount++;
    } else {
      card.classList.add("hidden");
    }
  });

  updateSections();

  document.getElementById("noResults").style.display =
    visibleCount === 0 ? "block" : "none";
}

function updateSections() {
  const sections = document.querySelectorAll(".section:not(#favoritesSection)");

  sections.forEach(section => {
    const visibleCards = section.querySelectorAll(".card:not(.hidden)");
    section.style.display = visibleCards.length > 0 ? "block" : "none";
  });
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("cityFilter").value = "all";
  document.getElementById("typeFilter").value = "all";
  document.getElementById("priceFilter").value = "all";

  filterCards();
}

window.addEventListener("DOMContentLoaded", () => {

  loadFavorites();
  renderFavorites();
  filterCards();
  setTimeout(() => {
  document.getElementById("skeletonArea").style.display = "none";
}, 900);
  const isLoggedIn =
    localStorage.getItem("yadarLoggedIn");

  if (isLoggedIn) {

    const loginBtn =
      document.querySelector(".login-btn");

    loginBtn.textContent = "👤 Account";

    loginBtn.onclick = openAccountPopup;
  }

});
const loginBtn = document.querySelector(".login-btn");
const loginModal = document.getElementById("loginModal");

loginBtn.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

function closeLogin() {
  loginModal.style.display = "none";
}

loginModal.addEventListener("click", function(e) {
  if (e.target === this) {
    closeLogin();
  }
});
function submitLogin() {

  const emailInput =
    document.querySelector('.login-box input[type="email"]');

  const passwordInput =
  document.querySelector('.login-box input[type="password"]');

const email = emailInput.value.trim();
const password = passwordInput.value.trim();

const loginError =
  document.getElementById("loginError");

if (!email || !password) {

  loginError.style.display = "block";
  return;
}

loginError.style.display = "none";

  localStorage.setItem("yadarLoggedIn", "true");
  localStorage.setItem("yadarUserEmail", email);

  closeLogin();
  
emailInput.value = "";
passwordInput.value = "";

  const loginBtn = document.querySelector(".login-btn");

  loginBtn.textContent = "👤 Account";

  loginBtn.onclick = openAccountPopup;

  showToastMessage("✅ Welcome to YaDar");
}
const accountPopup = document.getElementById("accountPopup");

function openAccountPopup() {

  accountPopup.style.display = "flex";

  const savedEmail =
    localStorage.getItem("yadarUserEmail") ||
    "guest@yadar.com";

  document.getElementById("profileEmail").textContent =
    savedEmail;
}

function closeAccountPopup() {
  accountPopup.style.display = "none";
}

accountPopup.addEventListener("click", function(e) {
  if (e.target === this) {
    closeAccountPopup();
  }
});

function logoutUser() {

  localStorage.removeItem("yadarLoggedIn");
  localStorage.removeItem("yadarUserEmail");

  closeAccountPopup();

  const loginBtn = document.querySelector(".login-btn");

  loginBtn.textContent = "Login";

  showToastMessage("👋 Logged out successfully");

  loginBtn.onclick = null;

  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });
}

function showFavoritesPopup() {

  closeAccountPopup();

  document.getElementById("favoritesSection")
    .scrollIntoView({
      behavior: "smooth"
    });

  showToastMessage("❤️ Favorites opened");
}

function showBookingsPopup() {

  const bookingsList =
    document.getElementById("bookingsList");

  const savedBookings =
    JSON.parse(localStorage.getItem("yadarBookings")) || [];

  bookingsList.innerHTML = "";

  if (savedBookings.length === 0) {

    bookingsList.innerHTML =
      "<p>No bookings yet</p>";

    return;
  }

  savedBookings.forEach(booking => {

    bookingsList.innerHTML += `


  <div class="booking-item">

    <strong>${booking.title}</strong>

    <div class="booking-meta">
      👥 ${booking.guests} guests
    </div>

    <div class="booking-meta">
      🌙 ${booking.nights} nights
    </div>

    <div class="booking-status">
      Confirmed
    </div>
    <button class="delete-booking" onclick="deleteBooking(${savedBookings.indexOf(booking)})">
  Delete
</button>

  </div>

`;
  });

  showToastMessage("📅 Bookings loaded");
}
function showToastMessage(text) {

  const toast = document.getElementById("toastMessage");

  toast.textContent = text;

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}
function deleteBooking(index) {
  const savedBookings =
    JSON.parse(localStorage.getItem("yadarBookings")) || [];

  savedBookings.splice(index, 1);

  localStorage.setItem(
    "yadarBookings",
    JSON.stringify(savedBookings)
  );

  showBookingsPopup();
  showToastMessage("🗑️ Booking deleted");
}

function toggleDarkMode() {

  document.body.classList.toggle("dark-mode");

  const isDark =
    document.body.classList.contains("dark-mode");

  localStorage.setItem(
    "yadarDarkMode",
    isDark
  );

  updateDarkButton();
}

function updateDarkButton() {

  const darkBtn =
    document.querySelector(".dark-toggle");

  if (!darkBtn) return;

  if (document.body.classList.contains("dark-mode")) {
    darkBtn.textContent = "☀️";
  } else {
    darkBtn.textContent = "🌙";
  }
}

window.addEventListener("DOMContentLoaded", () => {

  const darkSaved =
    localStorage.getItem("yadarDarkMode");

  if (darkSaved === "true") {
    document.body.classList.add("dark-mode");
  }

updateDarkButton();
});
const menuBtn = document.querySelector(".circle-btn");
const menuPopup = document.getElementById("menuPopup");

menuBtn.addEventListener("click", () => {
  menuPopup.style.display = "flex";
});

menuPopup.addEventListener("click", function(e) {
  if (e.target === this) {
    menuPopup.style.display = "none";
  }
});

function scrollToSection(id) {
  menuPopup.style.display = "none";

  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

function scrollToAbout() {
  menuPopup.style.display = "none";

  document.querySelector(".about-section").scrollIntoView({
    behavior: "smooth"
  });
}
const suggestBtn =
  document.querySelector(".suggest-btn");

const suggestModal =
  document.getElementById("suggestModal");

suggestBtn.addEventListener("click", () => {
  suggestModal.style.display = "flex";
});

function closeSuggestModal() {
  suggestModal.style.display = "none";
}

suggestModal.addEventListener("click", function(e) {

  if (e.target === this) {
    closeSuggestModal();
  }

});

function submitSuggestion() {

  closeSuggestModal();

  const toast =
    document.getElementById("toastMessage");

  toast.innerHTML =
    "✅ Suggestion sent successfully";

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);

}
