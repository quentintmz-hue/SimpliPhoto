/* ==========================================================================
   1. DONNÉES DES TARIFS & PHOTOS
   ========================================================================== */
const OFFRES_DETAILS = {
  eco: {
    badge: "Formule Essentiel",
    titre: "Essentiel",
    prix: "20 € / heure",
    dossier: "Images/tarif-eco",
    public: "Idéal pour un vin d'honneur, un goûter d'anniversaire familial, une pendaison de crémaillère ou un afterwork intimiste.",
    argument: "Un tarif à 20 € de l'heure pour capturer les premiers éclats de rire et l'ambiance sans alourdir le budget.",
    inclus: [
      "Facturation au temps passé sur place",
      "Prises de vues 100% sur le vif sans poses figées",
      "L'intégralité des clichés exploitables triés et corrigés",
      "Galerie privée en ligne accessible dès le lendemain"
    ]
  },
  standard: {
    badge: "Le Choix Recommandé",
    titre: "Standard",
    prix: "30 € / heure",
    dossier: "Images/tarif-standard",
    public: "Conçu pour les vraies fêtes d'anniversaire, les baptêmes, cousinades ou soirées animées.",
    argument: "À 30 € de l'heure, vous profitez d'une immersion au milieu des invités avec un suivi photo continu des moments forts.",
    inclus: [
      "Immersion totale au cœur du groupe sans déranger",
      "Traitement colorimétrique soigné sur chaque image",
      "Fichiers HD haute résolution sans filigrane",
      "Téléchargement illimité pour tous les invités"
    ]
  },
  premium: {
    badge: "Immersion Complète",
    titre: "Signature",
    prix: "40 € / heure",
    dossier: "Images/tarif-premium",
    public: "Pour les grands rassemblements, mariages intimistes ou soirées dansantes jusqu'au bout de la nuit.",
    argument: "À 40 € de l'heure, une couverture sans compromis même en basse lumière, avec une priorité absolue sur le rendu et la livraison.",
    inclus: [
      "Couverture intégrale sans stress d'horaires",
      "Prises de vue nettes en basse lumière / soirée dansante",
      "Traitement express prioritaire (livraison sous 12h à 18h)",
      "Sélection haute qualité prête à l'impression"
    ]
  }
};

/* ==========================================================================
   2. GÉNÉRATION DES VITRINES PHOTOS PAR TARIF
   ========================================================================== */
function initialiserGaleriesTarifs() {
  const configs = [
    { id: "gallery-eco", dossier: "Images/tarif-eco", count: 4 },
    { id: "gallery-standard", dossier: "Images/tarif-standard", count: 4 },
    { id: "gallery-premium", dossier: "Images/tarif-premium", count: 4 }
  ];

  configs.forEach(({ id, dossier, count }) => {
    const container = document.getElementById(id);
    if (!container) return;

    // Grande photo principale
    const leadImg = document.createElement("img");
    leadImg.src = `${dossier}/1.jpg`;
    leadImg.alt = "Aperçu de la formule";
    leadImg.className = "gallery-lead-img zoomable";
    leadImg.onerror = () => {
      leadImg.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80";
    };

    // Grille des 3 vignettes
    const thumbWrap = document.createElement("div");
    thumbWrap.className = "gallery-thumbnails";

    for (let i = 2; i <= count; i++) {
      const thumb = document.createElement("img");
      thumb.src = `${dossier}/${i}.jpg`;
      thumb.alt = `Vignette ${i}`;
      thumb.className = "zoomable";
      thumb.onerror = () => {
        thumb.src = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=300&q=80";
      };
      thumbWrap.appendChild(thumb);
    }

    container.innerHTML = "";
    container.appendChild(leadImg);
    container.appendChild(thumbWrap);
  });
}

/* ==========================================================================
   3. BANDEAU DE PHOTOS DÉFILANTES (HERO TICKER)
   ========================================================================== */
function initialiserTickerPhotos() {
  const track = document.getElementById("photo-ticker-track");
  if (!track) return;

  const imagesSources = [
    "Images/tarif-eco/1.jpg",
    "Images/tarif-standard/1.jpg",
    "Images/tarif-premium/1.jpg",
    "Images/tarif-standard/2.jpg",
    "Images/tarif-eco/2.jpg",
    "Images/tarif-premium/2.jpg"
  ];

  // Doublage de la liste pour défilement infini sans saut
  const totalImages = [...imagesSources, ...imagesSources];

  track.innerHTML = "";
  totalImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "zoomable";
    img.alt = "Photo événementielle";
    img.onerror = () => {
      img.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80";
    };
    track.appendChild(img);
  });
}

/* ==========================================================================
   4. MODALE DE DÉTAIL DES FORMULES
   ========================================================================== */
const offerModal = document.getElementById("offer-modal");
const offerModalClose = document.getElementById("offer-modal-close");

function ouvrirDetailOffre(cle) {
  const data = OFFRES_DETAILS[cle];
  if (!data || !offerModal) return;

  document.getElementById("modal-badge").textContent = data.badge;
  document.getElementById("modal-title").textContent = data.titre;
  document.getElementById("modal-price").textContent = data.prix;
  document.getElementById("modal-target").textContent = data.public;
  document.getElementById("modal-argument").textContent = data.argument;

  const listContainer = document.getElementById("modal-included");
  listContainer.innerHTML = "";
  data.inclus.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    listContainer.appendChild(li);
  });

  // Ruban défilant de la modale
  const galleryWrap = document.getElementById("modal-gallery");
  galleryWrap.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const img = document.createElement("img");
    img.src = `${data.dossier}/${i}.jpg`;
    img.className = "zoomable";
    img.alt = `${data.titre} - photo ${i}`;
    img.onerror = () => {
      img.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80";
    };
    galleryWrap.appendChild(img);
  }

  offerModal.classList.add("active");
  offerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function fermerDetailOffre() {
  if (!offerModal) return;
  offerModal.classList.remove("active");
  offerModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (offerModalClose) offerModalClose.addEventListener("click", fermerDetailOffre);

if (offerModal) {
  offerModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("offer-modal-overlay")) {
      fermerDetailOffre();
    }
  });
}

/* ==========================================================================
   5. LIGHTBOX CADRÉE (NON-BLOQUANTE)
   ========================================================================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");

function ouvrirPleinEcran(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function fermerPleinEcran() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", fermerPleinEcran);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", fermerPleinEcran);

// Écouteur global de clic sur les photos agrandissables
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("zoomable")) {
    ouvrirPleinEcran(e.target.src);
  }
});

/* ==========================================================================
   6. AVIS & LIVRE D'OR (LOCALSTORAGE)
   ========================================================================== */
const reviewForm = document.getElementById("review-form");
const reviewsList = document.getElementById("reviews-list");

function creerElementAvis(nom, lieu, note, message) {
  const etoiles = "★".repeat(note) + "☆".repeat(5 - note);
  const card = document.createElement("article");
  card.className = "review-card";
  card.innerHTML = `
    <div class="review-stars">${etoiles}</div>
    <p class="review-text">« ${message} »</p>
    <div class="review-author">
      <strong>${nom}</strong>
      <span>${lieu}</span>
    </div>
  `;
  return card;
}

function chargerAvisEnregistres() {
  if (!reviewsList) return;
  const avisStockes = JSON.parse(localStorage.getItem("simpliphoto_avis") || "[]");
  avisStockes.forEach((a) => {
    const card = creerElementAvis(a.nom, a.lieu, a.note, a.message);
    reviewsList.prepend(card);
  });
}

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("author-name").value.trim();
    const lieu = document.getElementById("event-type").value.trim();
    const note = parseInt(document.getElementById("review-rating").value, 10);
    const message = document.getElementById("review-comment").value.trim();

    if (!nom || !message) return;

    const nouvelleCarte = creerElementAvis(nom, lieu, note, message);
    reviewsList.prepend(nouvelleCarte);

    const avisStockes = JSON.parse(localStorage.getItem("simpliphoto_avis") || "[]");
    avisStockes.push({ nom, lieu, note, message });
    localStorage.setItem("simpliphoto_avis", JSON.stringify(avisStockes));

    reviewForm.reset();
  });
}

/* ==========================================================================
   7. INITIALISATION GLOBALE & ANIMATION GSAP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initialiserGaleriesTarifs();
  initialiserTickerPhotos();
  chargerAvisEnregistres();

  // Animation GSAP au scroll
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

   gsap.to(".image-wrapper", {
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true
      }
    });

    gsap.to(".image-wrapper", {
      scale: 1.05,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
});