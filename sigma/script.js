// NAVBAR & HOME
const menuItem = document.getElementById("menu-item");
const menuList = document.getElementById("menu-list");
const footer = document.getElementById("side-1");
const main = document.getElementById("main");

menuItem.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
  footer.classList.toggle("hidden");
});

// Tampilkan section 
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Sembunyikan halaman utama
  main.classList.add("hidden");

  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// ke home 
function goHome() {
  main.classList.remove("hidden");
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// NAVBAR & HOME END

// Materi switching
function showMateri(id) {
  document.querySelectorAll('.materi-content').forEach(m => m.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('#materiList li').forEach(li => li.classList.remove('active'));
  const activeLi = Array.from(document.querySelectorAll('#materiList li')).find(li => li.getAttribute('onclick')?.includes(id));
  if (activeLi) activeLi.classList.add('active');
}

function goBack() {
  const sidebar = document.querySelector('.sidebars');
  sidebar.classList.add('show');
  document.querySelectorAll('.materi-content').forEach(m => m.classList.remove('active'));
}

const sidebar = document.getElementById('sidebar');
const materiList = document.getElementById('materiList');

// Search materi
document.getElementById('search').addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll('#materiList li').forEach(li => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(search) ? 'block' : 'none';
  });
});

const galleryItems = document.querySelectorAll('.gallery-card img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');

galleryItems.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});
