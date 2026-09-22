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
   3. BANDEAU DE PHOTOS DÉFILANTES (HERO TICKER INTERACTIF)
   ========================================================================== */
function initialiserTickerPhotos() {
  const track = document.getElementById("photo-ticker-track");
  const parent = track ? track.parentElement : null;
  if (!track || !parent) return;

  const imagesSources = [
    "Images/tarif-eco/1.jpg",
    "Images/tarif-standard/1.jpg",
    "Images/tarif-premium/1.jpg",
    "Images/tarif-standard/2.jpg",
    "Images/tarif-eco/2.jpg",
    "Images/tarif-premium/2.jpg"
  ];

  // Triplement de la liste pour garantir une boucle infinie continue
  const totalImages = [...imagesSources, ...imagesSources, ...imagesSources];

  track.innerHTML = "";
  totalImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "zoomable";
    img.alt = "Photo événementielle";
    img.draggable = false;
    img.onerror = () => {
      img.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80";
    };
    track.appendChild(img);
  });

  let position = 0;
  const baseSpeed = 1.0;
  let extraVelocity = 0;
  let isInteracting = false;
  let hasDragged = false;
  let lastX = 0;
  let startX = 0;
  let padTimeout = null;

  function animer() {
    if (!isInteracting) {
      position -= (baseSpeed + extraVelocity);
    } else {
      position -= extraVelocity;
    }

    // Amorti d'inertie
    extraVelocity *= 0.94;
    if (Math.abs(extraVelocity) < 0.05) extraVelocity = 0;

    // Réinitialisation de la boucle (1/3 de la largeur)
    const segmentWidth = track.scrollWidth / 3;
    if (segmentWidth > 0) {
      if (position <= -segmentWidth) {
        position += segmentWidth;
      } else if (position > 0) {
        position -= segmentWidth;
      }
    }

    track.style.transform = `translate3d(${position}px, 0, 0)`;
    requestAnimationFrame(animer);
  }

  requestAnimationFrame(animer);

  // --- Interaction tactile & glissement à la souris ---
  track.addEventListener("pointerdown", (e) => {
    isInteracting = true;
    hasDragged = false;
    startX = e.clientX;
    lastX = e.clientX;
    extraVelocity = 0;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isInteracting) return;
    const delta = e.clientX - lastX;
    lastX = e.clientX;

    if (Math.abs(e.clientX - startX) > 6) {
      hasDragged = true; // Empêche l'ouverture accidentelle de la lightbox si on glisse
    }

    position += delta;
    extraVelocity = -delta * 0.45;
  });

  const stopInteraction = () => {
    if (isInteracting) isInteracting = false;
  };

  window.addEventListener("pointerup", stopInteraction);
  window.addEventListener("pointercancel", stopInteraction);

  // Évite d'ouvrir la photo en plein écran quand on effectue un simple swipe
  track.addEventListener("click", (e) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  // --- Interaction Trackpad (Molette / Pad horizontal) ---
  parent.addEventListener("wheel", (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);

    if (delta !== 0) {
      position -= delta;
      extraVelocity = delta * 0.18;
      isInteracting = true;

      clearTimeout(padTimeout);
      padTimeout = setTimeout(() => {
        isInteracting = false;
      }, 140);
    }
  }, { passive: true });
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

/* /* ==========================================================================
   6. AVIS & LIVRE D'OR (ENVOI POUR MODÉRATION & CHARGEMENT DYNAMIQUE)
   ========================================================================== */

// 6.1 URL de ton API / Base de données (Airtable, Supabase, Google Sheet...)
// Laisse vide pour l'instant : les 3 avis du HTML restent affichés par défaut.
const URL_API_AVIS = ""; 

function creerElementAvis(nom, lieu, note, message) {
  const noteNum = Number(note) || 5;
  const etoiles = "★".repeat(noteNum) + "☆".repeat(5 - noteNum);

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

// 6.2 Chargement des avis validés depuis la future base de données
async function chargerAvisValides() {
  const reviewsList = document.getElementById("reviews-list");
  if (!reviewsList || !URL_API_AVIS) return;

  try {
    const response = await fetch(URL_API_AVIS);
    if (!response.ok) return;

    const avisValides = await response.json();
    
    // Si la base contient des avis, on les affiche
    if (Array.isArray(avisValides) && avisValides.length > 0) {
      reviewsList.innerHTML = ""; // Vide les placeholders HTML
      avisValides.forEach((item) => {
        const card = creerElementAvis(item.nom, item.evenement_lieu, item.note, item.commentaire);
        reviewsList.appendChild(card);
      });
    }
  } catch (err) {
    console.warn("Impossible de joindre la base d'avis, conservation des avis locaux.");
  }
}

// 6.3 Traitement du formulaire d'avis (envoi vers ta boîte pour modération)
function initialiserFormulaireAvis() {
  const reviewForm = document.getElementById("review-form");
  const statusMsg = document.getElementById("review-status-msg");
  const submitBtn = document.getElementById("btn-submit-review");

  if (!reviewForm) return;

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.textContent = "Transmission en cours...";
    submitBtn.disabled = true;

    const formData = new FormData(reviewForm);

    try {
      const response = await fetch(reviewForm.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        reviewForm.style.display = "none";
        statusMsg.style.display = "block";
      } else {
        alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer dans un instant.");
        submitBtn.textContent = "Envoyer mon témoignage";
        submitBtn.disabled = false;
      }
    } catch (error) {
      // Affichage visuel même lors des tests en local
      reviewForm.style.display = "none";
      statusMsg.style.display = "block";
    }
  });
}

/*/* ==========================================================================
   7. INITIALISATION GLOBALE & ANIMATION GSAP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initialiserGaleriesTarifs();
  initialiserTickerPhotos();
 chargerAvisValides();
initialiserFormulaireAvis();

  // Animation GSAP au scroll (uniquement active sur ordinateur)
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
      // Uniquement sur les écrans de plus de 850px (Desktop / PC)
      "(min-width: 851px)": function () {
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
  }
});
