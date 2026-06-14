// Smooth scrolling pour la navigation
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const contactBtn = document.querySelector(".contact-btn");
  const burgerMenu = document.getElementById("burgerMenu");
  const navLinksContainer = document.getElementById("navLinks");

  // Burger menu toggle
  if (burgerMenu) {
    burgerMenu.addEventListener("click", function () {
      navLinksContainer.classList.toggle("active");
    });
  }

  // Smooth scroll sur les liens de navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      // Fermer le menu mobile quand on clique
      if (navLinksContainer.classList.contains("active")) {
        navLinksContainer.classList.remove("active");
      }

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Contact button
  contactBtn.addEventListener("click", function () {
    const contactSection = document.querySelector("#contact");
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  });
});

// Effet de parallaxe sur scroll
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll(".section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.pageYOffset;

    if (
      scrollPosition + window.innerHeight > sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      section.style.opacity = 1;
    }
  });
});

// Animation des éléments au scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeIn 0.6s ease-out forwards";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer les service cards et project cards
document.querySelectorAll(".service-card, .project-card").forEach((card) => {
  card.style.opacity = "0";
  observer.observe(card);
});

// Effet de pulse sur les boutons
const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});

// Animation au focus des inputs
const inputs = document.querySelectorAll(
  ".contact-form input, .contact-form textarea",
);
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
  });
});

// Validation du formulaire et envoi EmailJS
if (window.emailjs && emailjs.init) {
  emailjs.init({ publicKey: "ZsHSsq3OCnXzJfJN1" });
}

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const submitButton = document.getElementById("contact-submit");

function setContactStatus(message, isError = false) {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.style.color = isError ? "#FF6633" : "#7c3aed";
}

if (contactForm) {
  const timeInput = contactForm.querySelector('input[name="time"]');
  if (timeInput) {
    timeInput.value = new Date().toLocaleString("fr-FR");
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!submitButton) return;

    const formInputs = this.querySelectorAll(
      'input[name="name"], input[name="email"], input[name="title"], textarea[name="message"]',
    );

    let isValid = true;

    formInputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "#FF6633";
        input.style.animation = "shake 0.3s ease-in-out";
      } else {
        input.style.borderColor = "#5918AD";
      }
    });

    if (!isValid) {
      setContactStatus("Veuillez remplir tous les champs.", true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";
    setContactStatus("", false);

    if (!window.emailjs || !emailjs.sendForm) {
      setContactStatus("Erreur de chargement EmailJS. Veuillez réessayer.", true);
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer le message";
      return;
    }

    emailjs
      .sendForm("service_6jxlm8q", "template_nsp7f4q", this)
      .then(() => {
        setContactStatus("Message envoyé avec succès.");
        this.reset();
        if (timeInput) {
          timeInput.value = new Date().toLocaleString("fr-FR");
        }
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        const errorMessage =
          error && error.text
            ? error.text
            : "Erreur lors de l'envoi. Veuillez réessayer.";
        setContactStatus(errorMessage, true);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer le message";
      });
  });
}

// Effet de glow au mouvement de la souris sur le logo
const logo = document.querySelector(".logo");
document.addEventListener("mousemove", function (e) {
  if (logo) {
    const rect = logo.getBoundingClientRect();
    const distance = Math.hypot(
      e.clientX - rect.left - rect.width / 2,
      e.clientY - rect.top - rect.height / 2,
    );

    if (distance < 150) {
      const glow = Math.max(0, 1 - distance / 150);
      logo.style.textShadow = `0 0 ${20 * glow}px rgba(89, 24, 173, ${0.8 * glow})`;
    }
  }
});

// Effet de rotation subtle sur les cartes services
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// Active nav link based on scroll position
window.addEventListener("scroll", function () {
  let current = "";
  const sections = document.querySelectorAll(".section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.style.borderBottom = "2px solid #ffffff";
    } else {
      link.style.borderBottom = "none";
    }
  });
});

// Effet typewriter sur le titre principal
function typewriter(element, text, speed = 50) {
  let index = 0;
  element.textContent = "";

  function type() {
    if (index < text.length) {
      element.textContent += text[index];
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Animation du greeting au chargement - désactivée pour préserver le dégradé du nom
// window.addEventListener("load", function () {
//   const greeting = document.querySelector(".greeting");
//   if (greeting) {
//     const text = greeting.textContent;
//     typewriter(greeting, text, 30);
//   }
// });

// Ripple effect sur les boutons
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement("span");

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");

  // Ajouter le style du ripple
  if (!document.querySelector("style[data-ripple]")) {
    const style = document.createElement("style");
    style.setAttribute("data-ripple", "true");
    style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }

  button.appendChild(ripple);
}

buttons.forEach((button) => {
  button.addEventListener("click", createRipple);
});

// Shake animation
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Particules au mouvement de la souris (améliore l'expérience)
const canvas = document.createElement("canvas");
canvas.id = "particle-canvas";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "0";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = 1;
    this.color = ["#5918AD", "#FF6633", "#FFFFFF"][
      Math.floor(Math.random() * 3)
    ];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.opacity > 0);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateParticles);
  }
}

document.addEventListener("mousemove", function (e) {
  if (Math.random() > 0.8) {
    particles.push(new Particle(e.clientX, e.clientY));
    if (particles.length <= 5) {
      animateParticles();
    }
  }
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Scroll animation pour les sections
const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
  },
);

document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  sectionObserver.observe(section);
});

// Effets supplémentaires sur les icônes sociales
const socialIcons = document.querySelectorAll(".social-icon");
socialIcons.forEach((icon) => {
  icon.addEventListener("mouseenter", function () {
    const img = this.querySelector("img");
    if (img) {
      img.style.transform = "scale(1.3) rotate(10deg)";
    }
  });

  icon.addEventListener("mouseleave", function () {
    const img = this.querySelector("img");
    if (img) {
      img.style.transform = "scale(1) rotate(0)";
    }
  });
});

// Animation du texte "Développeur Inderterminer" qui change
function animateTypingText() {
  const textElement = document.querySelector(".typing-text");
  if (!textElement) return;

  const professions = [
    "Développeur Front End",
    "Développeur Back End",
    "Web Designer",
    "Développeur Full Stack",
    "Développeur Front End",
  ];

  let currentIndex = 0;
  const typingSpeed = 100; // Vitesse d'écriture
  const deletingSpeed = 50; // Vitesse d'effacement
  const pauseDuration = 2000; // Pause entre les mots

  function deleteText(text, callback) {
    let currentText = text;
    let index = text.length;

    function deleteChar() {
      if (index > 0) {
        currentText = text.substring(0, index - 1);
        textElement.textContent = currentText;
        index--;
        setTimeout(deleteChar, deletingSpeed);
      } else {
        callback();
      }
    }

    deleteChar();
  }

  function typeText(text, callback) {
    let currentText = "";
    let index = 0;

    function typeChar() {
      if (index < text.length) {
        currentText += text[index];
        textElement.textContent = currentText;
        index++;
        setTimeout(typeChar, typingSpeed);
      } else {
        callback();
      }
    }

    typeChar();
  }

  function animateNext() {
    const currentProfession = professions[currentIndex];

    // Effacer le texte
    deleteText(currentProfession, function () {
      // Écrire le prochain texte
      currentIndex = (currentIndex + 1) % professions.length;
      typeText(professions[currentIndex], function () {
        // Pause avant d'effacer à nouveau
        setTimeout(animateNext, pauseDuration);
      });
    });
  }

  // Commencer avec le premier métier
  typeText(professions[0], function () {
    setTimeout(function () {
      currentIndex = 1;
      animateNext();
    }, pauseDuration);
  });
}

// Lancer l'animation au chargement
window.addEventListener("load", function () {
  animateTypingText();
});
