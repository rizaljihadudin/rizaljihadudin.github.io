(function () {
  "use strict";

  // ---------------------------------------------------------------
  // State aplikasi
  // renderedCount : berapa card yang sudah dirender ke DOM
  // isLoading     : kunci supaya batch berikutnya tidak dimuat dobel
  // ---------------------------------------------------------------
  const state = {
    renderedCount: 0,
    isLoading: false,
    lastFocused: null,
    lightbox: { images: [], index: 0, title: "" }
  };

  const el = {
    grid: document.getElementById("project-grid"),
    loader: document.getElementById("loader"),
    loadMore: document.getElementById("load-more"),
    endNote: document.getElementById("end-note"),
    sentinel: document.getElementById("scroll-sentinel"),
    shownCount: document.getElementById("shown-count"),
    totalCount: document.getElementById("total-count"),
    modal: document.getElementById("modal"),
    modalScroll: document.getElementById("modal-scroll"),
    lightbox: document.getElementById("lightbox"),
    lightboxImg: document.getElementById("lightbox-img"),
    lightboxCaption: document.getElementById("lightbox-caption")
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // ===============================================================
  // BAGIAN 1 — Konten statis dari constants.js
  // ===============================================================
  function renderStaticContent() {
    document.getElementById("brand-name").textContent = SITE.name;
    document.getElementById("hero-eyebrow").textContent = SITE.role;
    document.getElementById("hero-title").innerHTML =
      "Portofolio";
    document.getElementById("hero-tagline").textContent = SITE.tagline;
    document.getElementById("footer-name").textContent =
      "© " + new Date().getFullYear() + " " + SITE.name + " — " + SITE.location;

    // document.getElementById("hero-stats").innerHTML = SITE.stats
    //   .map(
    //     (stat) =>
    //       "<li class=\"stat\"><span class=\"stat-value\">" +
    //       escapeHtml(stat.value) +
    //       "</span><span class=\"stat-label\">" +
    //       escapeHtml(stat.label) +
    //       "</span></li>"
    //   )
    //   .join("");

    document.getElementById("social-list").innerHTML = SITE.socials
      .map(
        (social) =>
          "<li><a class=\"btn btn-ghost\" href=\"" +
          escapeHtml(social.url) +
          "\" target=\"_blank\" rel=\"noopener\">" +
          escapeHtml(social.label) +
          "</a></li>"
      )
      .join("");

    el.totalCount.textContent = String(PROJECTS.length);
  }

  // ===============================================================
  // BAGIAN 2 — Grid card + Infinite Scroll
  // ===============================================================

  function cardTemplate(project, index) {
    const badges = project.stack
      .slice(0, 3)
      .map((tech, i) => "<li class=\"badge" + (i === 0 ? " badge-accent" : "") + "\">" + escapeHtml(tech) + "</li>")
      .join("");

    const extra =
      project.stack.length > 3 ? "<li class=\"badge\">+" + (project.stack.length - 3) + "</li>" : "";

    return (
      "<article class=\"card\" role=\"listitem\" tabindex=\"0\" aria-label=\"Buka detail proyek " +
      escapeHtml(project.title) +
      "\" data-project-id=\"" +
      escapeHtml(project.id) +
      "\" style=\"animation-delay:" +
      (index % PAGE_SIZE) * 45 +
      "ms\">" +
      "<span class=\"card-media\">" +
      "<img src=\"" +
      escapeHtml(project.cover) +
      "\" alt=\"Cover proyek " +
      escapeHtml(project.title) +
      "\" loading=\"lazy\" decoding=\"async\" />" +
      "</span>" +
      "<span class=\"card-body\">" +
      "<span class=\"card-category\">" +
      escapeHtml(project.category) +
      "</span>" +
      "<h3 class=\"card-title\">" +
      escapeHtml(project.title) +
      "</h3>" +
      "<p class=\"card-summary\">" +
      escapeHtml(project.summary) +
      "</p>" +
      "<ul class=\"badges\">" +
      badges +
      extra +
      "</ul>" +
      "</span>" +
      "</article>"
    );
  }

  // Render satu batch (PAGE_SIZE card) mulai dari posisi renderedCount.
  function renderNextBatch() {
    const nextSlice = PROJECTS.slice(state.renderedCount, state.renderedCount + PAGE_SIZE);
    if (nextSlice.length === 0) return;

    const fragment = document.createElement("div");
    fragment.innerHTML = nextSlice
      .map((project, i) => cardTemplate(project, state.renderedCount + i))
      .join("");

    while (fragment.firstChild) {
      el.grid.appendChild(fragment.firstChild);
    }

    state.renderedCount += nextSlice.length;
    el.shownCount.textContent = String(state.renderedCount);
  }

  const hasMore = () => state.renderedCount < PROJECTS.length;

  // Pintu masuk tunggal untuk memuat batch: dipakai oleh tombol
  // "Muat Lebih Banyak", IntersectionObserver, dan fallback scroll.
  // Delay singkat dipakai supaya indikator loading sempat terlihat
  // dan supaya batch tidak menumpuk saat scroll sangat cepat.
  function loadMore() {
    if (state.isLoading || !hasMore()) return;

    state.isLoading = true;
    el.loader.hidden = false;
    el.loadMore.disabled = true;

    window.setTimeout(() => {
      renderNextBatch();
      state.isLoading = false;
      el.loader.hidden = true;

      if (hasMore()) {
        el.loadMore.disabled = false;
      } else {
        // Semua data habis: matikan pemicu dan tampilkan penanda akhir.
        el.loadMore.hidden = true;
        el.endNote.hidden = false;
        if (observer) observer.disconnect();
        window.removeEventListener("scroll", onScrollFallback);
      }
    }, 380);
  }

  // Pemicu utama infinite scroll: IntersectionObserver mengawasi
  // elemen sentinel di bawah grid. rootMargin 400px membuat batch
  // berikutnya dimuat sebelum pengguna benar-benar sampai dasar.
  let observer = null;

  function setupInfiniteScroll() {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) loadMore();
          });
        },
        { root: null, rootMargin: "400px 0px", threshold: 0 }
      );
      observer.observe(el.sentinel);
      return;
    }
    // Fallback browser lama: cek jarak scroll ke dasar halaman.
    window.addEventListener("scroll", onScrollFallback, { passive: true });
  }

  function onScrollFallback() {
    const distanceToBottom =
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    if (distanceToBottom < 400) loadMore();
  }

  // ===============================================================
  // BAGIAN 3 — Modal detail proyek
  // ===============================================================

  function modalTemplate(project) {
    const stack = project.stack
      .map((tech) => "<li class=\"badge badge-accent\">" + escapeHtml(tech) + "</li>")
      .join("");

    // Tiap gambar galeri menyimpan data-gallery-index agar lightbox
    // tahu harus mulai dari gambar keberapa saat diklik.
    const gallery = project.gallery
      .map(
        (src, i) =>
          "<button class=\"gallery-item\" type=\"button\" data-gallery-index=\"" +
          i +
          "\" aria-label=\"Perbesar gambar " +
          (i + 1) +
          " dari " +
          escapeHtml(project.title) +
          "\">" +
          "<img src=\"" +
          escapeHtml(src) +
          "\" alt=\"" +
          escapeHtml(project.title) +
          " tangkapan layar " +
          (i + 1) +
          "\" loading=\"lazy\" decoding=\"async\" />" +
          "</button>"
      )
      .join("");

    const description = project.description
      .map((paragraph) => "<p>" + escapeHtml(paragraph) + "</p>")
      .join("");

    // Proyek internal/NDA ditandai url "-" sehingga tombolnya dinonaktifkan.
    const hasUrl = Boolean(project.url) && project.url !== "-";
    const links = hasUrl
      ? "<a class=\"btn btn-accent btn-view-project\" href=\"" +
        escapeHtml(project.url) +
        "\" target=\"_blank\" rel=\"noopener\">View Project</a>"
      : "<button class=\"btn btn-accent btn-view-project\" type=\"button\" disabled " +
        "aria-disabled=\"true\" title=\"Proyek ini tidak dapat diakses publik\">" +
        "View Project</button>";

    return (
      "<div class=\"modal-head\">" +
      "<div class=\"modal-kicker\">" +
      "<span class=\"badge badge-accent\">" +
      escapeHtml(project.category) +
      "</span>" +
      "</div>" +
      "<h2 class=\"modal-title\" id=\"modal-title\">" +
      escapeHtml(project.title) +
      "</h2>" +
      "<p class=\"modal-summary\">" +
      escapeHtml(project.summary) +
      "</p>" +
      "</div>" +
      "<div class=\"modal-block\">" +
      "<p class=\"block-label\">Project Gallery</p>" +
      "<div class=\"gallery\" id=\"modal-gallery\">" +
      gallery +
      "</div>" +
      "</div>" +
      "<div class=\"modal-block modal-desc\">" +
      "<p class=\"block-label\">Description</p>" +
      description +
      "</div>" +
      "<div class=\"modal-block\">" +
      "<p class=\"block-label\">Tech Stack</p>" +
      "<ul class=\"badges\">" +
      stack +
      "</ul>" +
      "</div>" +
      "<div class=\"modal-actions\">" +
      links +
      "</div>"
    );
  }

  function openModal(projectId) {
    const project = PROJECTS.find((item) => item.id === projectId);
    if (!project) return;

    state.lastFocused = document.activeElement;
    state.lightbox.images = project.gallery;
    state.lightbox.title = project.title;

    el.modalScroll.innerHTML = modalTemplate(project);
    el.modal.hidden = false;
    document.body.classList.add("is-locked");
    el.modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    el.modal.hidden = true;
    el.modalScroll.innerHTML = "";
    if (el.lightbox.hidden) document.body.classList.remove("is-locked");
    if (state.lastFocused) state.lastFocused.focus();
  }

  // ===============================================================
  // BAGIAN 4 — Lightbox galeri
  // Gambar tidak dibuat ulang setiap kali; hanya src-nya yang ditukar
  // di tengah transisi fade + scale supaya perpindahan terasa halus.
  // ===============================================================

  function showLightbox(index) {
    state.lightbox.index = index;
    el.lightboxImg.src = state.lightbox.images[index];
    el.lightboxImg.alt = state.lightbox.title + " tangkapan layar " + (index + 1);
    el.lightboxCaption.textContent =
      state.lightbox.title + " — " + (index + 1) + " / " + state.lightbox.images.length;
    el.lightbox.hidden = false;
    document.body.classList.add("is-locked");
  }

  function stepLightbox(step) {
    const total = state.lightbox.images.length;
    if (total < 2) return;

    const nextIndex = (state.lightbox.index + step + total) % total;
    state.lightbox.index = nextIndex;

    // Fade out, tukar sumber gambar, lalu fade in kembali.
    el.lightboxImg.classList.add("is-swapping");
    window.setTimeout(() => {
      el.lightboxImg.src = state.lightbox.images[nextIndex];
      el.lightboxImg.alt = state.lightbox.title + " tangkapan layar " + (nextIndex + 1);
      el.lightboxCaption.textContent =
        state.lightbox.title + " — " + (nextIndex + 1) + " / " + total;
      el.lightboxImg.classList.remove("is-swapping");
    }, 180);
  }

  function closeLightbox() {
    el.lightbox.hidden = true;
    el.lightboxImg.src = "";
    if (el.modal.hidden) document.body.classList.remove("is-locked");
  }

  // ===============================================================
  // BAGIAN 5 — Event binding
  // ===============================================================

  function bindEvents() {
    el.loadMore.addEventListener("click", loadMore);

    // Delegasi klik card: satu listener untuk semua card, termasuk
    // card yang baru muncul dari batch infinite scroll berikutnya.
    el.grid.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      if (card) openModal(card.dataset.projectId);
    });

    // Card bukan elemen <button>, jadi Enter dan Spasi disambungkan manual.
    el.grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".card");
      if (!card) return;
      event.preventDefault();
      openModal(card.dataset.projectId);
    });

    el.modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) {
        closeModal();
        return;
      }
      const galleryItem = event.target.closest(".gallery-item");
      if (galleryItem) showLightbox(Number(galleryItem.dataset.galleryIndex));
    });

    el.lightbox.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-lightbox]")) {
        closeLightbox();
        return;
      }
      const stepButton = event.target.closest("[data-lightbox-step]");
      if (stepButton) stepLightbox(Number(stepButton.dataset.lightboxStep));
    });

    document.addEventListener("keydown", (event) => {
      if (!el.lightbox.hidden) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") stepLightbox(1);
        if (event.key === "ArrowLeft") stepLightbox(-1);
        return;
      }
      if (!el.modal.hidden && event.key === "Escape") closeModal();
    });

    // Geser jari kiri/kanan untuk pindah gambar di perangkat sentuh.
    let touchStartX = 0;
    el.lightbox.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    el.lightbox.addEventListener(
      "touchend",
      (event) => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 60) stepLightbox(delta < 0 ? 1 : -1);
      },
      { passive: true }
    );
  }

  function init() {
    renderStaticContent();
    renderNextBatch();
    bindEvents();
    setupInfiniteScroll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
