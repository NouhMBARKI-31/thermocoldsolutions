document.addEventListener("DOMContentLoaded", function () {
    //  Assurer le bon chargement des images
    const images = document.querySelectorAll("img");
    images.forEach(img => {
        img.style.display = "block"; // Empêche la disparition des images
    });

    //  Gestion dynamique du menu actif
    let currentPage = window.location.pathname.split("/").pop().split("?")[0].split("#")[0];
    let navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    //  Sélection des images pour chaque section
    const realisationImages = document.querySelectorAll(".realisations-gallery .zoomable");
    const serviceImages = document.querySelectorAll(".services-list .zoomable");

    //  Création de l'overlay pour "Nos Réalisations"
    const overlay = document.createElement("div");
    overlay.classList.add("fullscreen-overlay");
    overlay.style.display = "none"; // Par défaut caché
    document.body.appendChild(overlay);

    //  Ajout des éléments dans l'overlay
    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "&times;";
    overlay.appendChild(closeBtn);

    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-image";
    prevBtn.innerHTML = "&lt;";
    
    const nextBtn = document.createElement("button");
    nextBtn.id = "next-image";
    nextBtn.innerHTML = "&gt;";

    const largeImg = document.createElement("img");
    largeImg.classList.add("fullscreen-img");
    overlay.appendChild(largeImg);

    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.classList.add("thumbnail-container");
    overlay.appendChild(thumbnailContainer);

    let currentImageIndex = 0;
    let imagesArray = [];
    let userInteracted = false;

    // ✅ Fonction pour afficher une image avec transition fluide (sans auto-slide)
    function afficherImage(index) {
        largeImg.style.opacity = "0";
        setTimeout(() => {
            largeImg.src = imagesArray[index];
            largeImg.style.opacity = "1";
            mettreEnSurbrillanceMiniature(index);
        }, 300);
        currentImageIndex = index;
    }

    // ✅ Générer les miniatures sous l'image principale
    function genererMiniatures() {
        thumbnailContainer.innerHTML = "";
        imagesArray.forEach((imageSrc, index) => {
            const thumbnail = document.createElement("img");
            thumbnail.src = imageSrc;
            thumbnail.classList.add("thumbnail");
            thumbnail.dataset.index = index;

            thumbnail.addEventListener("click", () => {
                userInteracted = true;
                afficherImage(index);
            });

            thumbnailContainer.appendChild(thumbnail);
        });

        mettreEnSurbrillanceMiniature(currentImageIndex);
    }

    // ✅ Mettre en surbrillance la miniature active
    function mettreEnSurbrillanceMiniature(index) {
        const allThumbnails = document.querySelectorAll(".thumbnail");
        allThumbnails.forEach((thumb) => {
            thumb.style.border = "2px solid transparent";
        });

        if (allThumbnails[index]) {
            allThumbnails[index].style.border = "3px solid yellow";
        }
    }

    // ✅ Gestion du clic sur les images de "Nos Réalisations"
    realisationImages.forEach((img) => {
        img.addEventListener("click", () => {
            if (img.closest(".gallery")) {
                imagesArray = JSON.parse(img.closest(".gallery").dataset.images);
                currentImageIndex = 0;
                overlay.appendChild(prevBtn);
                overlay.appendChild(nextBtn);
            } else {
                imagesArray = [img.src];
                currentImageIndex = 0;
                if (prevBtn.parentNode) prevBtn.parentNode.removeChild(prevBtn);
                if (nextBtn.parentNode) nextBtn.parentNode.removeChild(nextBtn);
            }

            afficherImage(currentImageIndex);
            genererMiniatures();
            overlay.style.display = "flex";
        });
    });

    //  Navigation entre les images (sans auto-slide)
    function changerImage(direction) {
        userInteracted = true;

        if (direction === "prev" && currentImageIndex > 0) {
            afficherImage(currentImageIndex - 1);
        } else if (direction === "next" && currentImageIndex < imagesArray.length - 1) {
            afficherImage(currentImageIndex + 1);
        }
    }

    prevBtn.addEventListener("click", () => changerImage("prev"));
    nextBtn.addEventListener("click", () => changerImage("next"));

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        userInteracted = false;
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.display = "none";
            userInteracted = false;
        }
    });

    //  Création de l'overlay spécifique pour "Nos Services"
    const serviceOverlay = document.createElement("div");
    serviceOverlay.classList.add("service-overlay");
    serviceOverlay.style.display = "none"; // Caché par défaut
    document.body.appendChild(serviceOverlay);

    const serviceCloseBtn = document.createElement("span");
    serviceCloseBtn.classList.add("close-btn");
    serviceCloseBtn.innerHTML = "&times;";
    serviceOverlay.appendChild(serviceCloseBtn);

    const serviceLargeImg = document.createElement("img");
    serviceLargeImg.classList.add("fullscreen-img");
    serviceOverlay.appendChild(serviceLargeImg);

    // ✅ Gestion du clic sur les images de "Nos Services"
    serviceImages.forEach((img) => {
        img.addEventListener("click", () => {
            serviceLargeImg.src = img.src;
            serviceOverlay.style.display = "flex";
        });
    });

    serviceCloseBtn.addEventListener("click", () => {
        serviceOverlay.style.display = "none";
    });

    serviceOverlay.addEventListener("click", (e) => {
        if (e.target === serviceOverlay) {
            serviceOverlay.style.display = "none";
        }
    });

    // ✅ Ajout d'un bouton "Retour en haut"
    const backToTopButton = document.createElement("button");
    backToTopButton.innerHTML = "▲";
    backToTopButton.classList.add("back-to-top");
    document.body.appendChild(backToTopButton);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
