// NAVBAR & HOME
const menuItem = document.getElementById("menu-item");
const menuList = document.getElementById("menu-list");
const footer = document.getElementById("side-1");
const main = document.getElementById("main");

// Attach mobile menu toggle when menu item exists. Do not require footer to exist on all pages.
if (menuItem && menuList) {
  menuItem.addEventListener("click", () => {
    // toggle the menu visibility
    menuList.classList.toggle("hidden");
    // if a left sidebar exists on the page (side-1), toggle its visibility too (keeps behavior on index.html)
    if (footer) footer.classList.toggle("hidden");
  });
}

// Tampilkan section 
function showSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  target.classList.add("active");

  // Sembunyikan halaman utama
  if (main) main.classList.add("hidden");

  target.scrollIntoView({ behavior: "smooth" });
}

// ke home 
function goHome() {
  if (main) main.classList.remove("hidden");
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// NAVBAR & HOME END

// Materi switching
function showMateri(id) {
  document.querySelectorAll('.materi-content').forEach(m => m.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  document.querySelectorAll('#materiList li').forEach(li => li.classList.remove('active'));
  const activeLi = Array.from(document.querySelectorAll('#materiList li')).find(li => li.getAttribute('onclick')?.includes(id));
  if (activeLi) activeLi.classList.add('active');
}

function goBack() {
  const sidebarEl = document.querySelector('.sidebars');
  if (sidebarEl) sidebarEl.classList.add('show');
  document.querySelectorAll('.materi-content').forEach(m => m.classList.remove('active'));
}

const sidebar = document.getElementById('sidebar');
const materiList = document.getElementById('materiList');

// Search materi
const searchEl = document.getElementById('search');
if (searchEl) {
  searchEl.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('#materiList li').forEach(li => {
      const text = li.textContent.toLowerCase();
      li.style.display = text.includes(search) ? 'block' : 'none';
    });
  });
}

// Optional legacy lightbox for static galleries - run only if elements exist
const galleryItems = document.querySelectorAll('.gallery-card img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');

if (galleryItems.length && lightbox && lightboxImg && closeBtn) {
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
}

// GALLERY: upload, FileReader + LocalStorage (max 15 cards)
(function(){
  const STORAGE_KEY = 'pmr_keg_gallery_v1';
  const MAX_CARDS = 15;
  const fileInput = document.getElementById('fileInput');
  const titleInput = document.getElementById('titleInput');
  const descInput = document.getElementById('descInput');
  const addBtn = document.getElementById('addBtn');
  const gallery = document.getElementById('gallery');

  // Modal elements
  const igModal = document.getElementById('igModal');
  const igImage = document.getElementById('igImage');
  const igTitle = document.getElementById('igTitle');
  const igDesc = document.getElementById('igDesc');
  const igEdit = document.getElementById('igEdit');
  const igSave = document.getElementById('igSave');
  const igDelete = document.getElementById('igDelete');
  const igClose = document.getElementById('igClose');

  let currentIndex = null;

  function loadItems(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; }
    catch(e){ console.error('Gagal membaca LocalStorage', e); return []; }
  }
  function saveItems(items){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch(e){ console.error('Gagal menyimpan ke LocalStorage', e); } }

  function createCardElement(item, index){
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.index = index;
    if(!item){ const empty = document.createElement('div'); empty.className='empty'; empty.textContent = 'Kosong'; card.appendChild(empty); return card; }

    const img = document.createElement('img');
    img.src = item.dataUrl;
    img.alt = item.title || ('Kegiatan ' + (index+1));
    img.loading = 'lazy';
    img.style.cursor = 'zoom-in';

    // open modal on click
    img.addEventListener('click', ()=> openModal(index));

    const caption = document.createElement('div'); caption.className='caption'; caption.textContent = item.title || '';
    const controls = document.createElement('div'); controls.className='card-controls';
    const delBtn = document.createElement('button'); delBtn.className='btn-icon'; delBtn.title = 'Hapus'; delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); removeItem(index); });
    controls.appendChild(delBtn);
    card.appendChild(img); card.appendChild(caption); card.appendChild(controls);
    return card;
  }

  function render(){
    const items = loadItems();
    gallery.innerHTML='';
    const slots = new Array(MAX_CARDS).fill(null);
    for (let i=0;i<Math.min(items.length, MAX_CARDS);i++){ slots[i]=items[i]; }
    for (let i=0;i<MAX_CARDS;i++){ gallery.appendChild(createCardElement(slots[i], i)); }
  }

  function addItem(dataUrl, title, description){
    if(!dataUrl) return;
    const items = loadItems();
    items.unshift({id:Date.now(),dataUrl,title,description});
    const sliced = items.slice(0, MAX_CARDS);
    saveItems(sliced);
    render();
  }

  function removeItem(index){
    const items = loadItems();
    if(index >=0 && index < items.length){ items.splice(index,1); saveItems(items); render(); }
  }

  function openModal(index){
    const items = loadItems();
    const item = items[index];
    if(!item) return;
    currentIndex = index;
    igImage.src = item.dataUrl;
    igTitle.textContent = item.title || '';
    igDesc.textContent = item.description || '';
    igTitle.contentEditable = false; igDesc.contentEditable = false;
    igTitle.classList.remove('ig-editable'); igDesc.classList.remove('ig-editable');
    igSave.style.display = 'none'; igEdit.style.display = 'inline-block';
    igModal.classList.add('active'); igModal.setAttribute('aria-hidden','false');
  }

  function closeModal(){
    igModal.classList.remove('active'); igModal.setAttribute('aria-hidden','true');
    currentIndex = null;
  }

  // Edit flow with PIN
  function promptAdminAndEnableEdit(){
    const pin = prompt('Enter Admin PIN:');
    if(pin === null) return; // cancelled
    if(pin === '1234'){
      igTitle.contentEditable = true; igDesc.contentEditable = true;
      igTitle.classList.add('ig-editable'); igDesc.classList.add('ig-editable');
      igSave.style.display = 'inline-block'; igEdit.style.display = 'none';
    } else {
      alert('PIN salah');
    }
  }

  function saveEdits(){
    if(currentIndex === null) return;
    const items = loadItems();
    const item = items[currentIndex];
    if(!item) return;
    const newTitle = igTitle.textContent.trim();
    const newDesc = igDesc.textContent.trim();
    item.title = newTitle; item.description = newDesc;
    saveItems(items); render();
    igTitle.contentEditable = false; igDesc.contentEditable = false;
    igTitle.classList.remove('ig-editable'); igDesc.classList.remove('ig-editable');
    igSave.style.display = 'none'; igEdit.style.display = 'inline-block';
  }

  if(addBtn){
    addBtn.addEventListener('click', ()=>{
      const file = fileInput.files && fileInput.files[0];
      const title = (titleInput && titleInput.value) ? titleInput.value.trim() : '';
      const desc = (descInput && descInput.value) ? descInput.value.trim() : '';
      if(!file){ alert('Pilih gambar terlebih dahulu'); return; }
      if(!file.type.startsWith('image/')){ alert('File harus berupa gambar'); return; }
      const reader = new FileReader();
      reader.onload = function(e){ const dataUrl = e.target.result; addItem(dataUrl, title, desc); if(titleInput) titleInput.value=''; if(descInput) descInput.value=''; if(fileInput) fileInput.value=''; };
      reader.readAsDataURL(file);
    });

    // Enter to submit from description field
    if(descInput){ descInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ addBtn.click(); } }); }
  }

  // Modal actions
  if(igClose) igClose.addEventListener('click', closeModal);
  if(igDelete) igDelete.addEventListener('click', ()=>{ if(currentIndex!==null && confirm('Hapus foto ini?')){ removeItem(currentIndex); closeModal(); } });
  if(igEdit) igEdit.addEventListener('click', promptAdminAndEnableEdit);
  if(igSave) igSave.addEventListener('click', saveEdits);

  // close on backdrop click
  if(igModal) igModal.addEventListener('click',(e)=>{ if(e.target === igModal) closeModal(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });

  // initial render
  render();
})();

(function(){
  function setupWidget(){
    const widget = document.getElementById('updateWidget');
    const modal = document.getElementById('updateModal');
    const modalBody = document.getElementById('updateModalBody');
    const modalClose = document.getElementById('updateModalClose');

    function renderUpdateLogs(){
      if(!modalBody) return;
      modalBody.innerHTML = '';
      // update logs removed
    }

    function openModal(){ if(modal){ renderUpdateLogs(); modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; } }
    function closeModal(){ if(modal){ modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } }

    if(widget){
      // Ensure pointer events are enabled
      widget.style.pointerEvents = 'auto';
      widget.addEventListener('click', (e)=>{ e.stopPropagation(); openModal(); });
    }
    if(modalClose){ modalClose.addEventListener('click', (e)=>{ e.stopPropagation(); closeModal(); }); }
    if(modal){ modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); }); }
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

    // Accessibility: ensure widget touch target large enough
    if(widget){ widget.style.touchAction = 'manipulation'; }

    // Initial render (so label can be updated if desired)
    renderUpdateLogs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWidget);
  } else {
    setupWidget();
  }
})();