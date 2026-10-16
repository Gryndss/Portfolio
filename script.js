/* =========================================================
   Portfolio — Alvin (Grynds)
   JavaScript vanilla : menu mobile, apparition au scroll,
   barre de navigation et année auto.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Menu mobile ---- */
  const burger = document.getElementById("burger");
  const links  = document.querySelector(".nav__links");

  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    // Referme le menu quand on clique sur un lien
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Apparition des éléments au scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // on anime une seule fois
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Secours : tout est visible si l'API n'est pas supportée
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Ombre de la barre de navigation au scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 10 ? "0 1px 0 rgba(0,0,0,.06)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Formulaire de contact : envoi direct par email via EmailJS ---- */
  if (window.emailjs && emailjs.init) {
    emailjs.init({ publicKey: "ZsHSsq3OCnXzJfJN1" });
  }

  const form         = document.getElementById("contact-form");
  const status       = document.getElementById("form-status");
  const submitButton = document.getElementById("contact-submit");

  function setStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  if (form) {
    const timeInput = form.querySelector('input[name="time"]');
    if (timeInput) timeInput.value = new Date().toLocaleString("fr-FR");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!submitButton) return;

      // Vérifie que tous les champs sont remplis (et l'email valide)
      const fields = form.querySelectorAll(
        'input[name="name"], input[name="email"], input[name="title"], textarea[name="message"]'
      );
      let isValid = true;
      fields.forEach((field) => {
        const empty = !field.value.trim();
        const badEmail = field.type === "email" && !field.checkValidity();
        if (empty || badEmail) {
          isValid = false;
          field.style.borderColor = "#c62828";
        } else {
          field.style.borderColor = "";
        }
      });

      if (!isValid) {
        setStatus("Merci de remplir tous les champs avec un email valide.", true);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Envoi...";
      setStatus("");

      if (!window.emailjs || !emailjs.sendForm) {
        setStatus("Erreur de chargement d'EmailJS. Veuillez réessayer.", true);
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer le message";
        return;
      }

      emailjs
        .sendForm("service_6jxlm8q", "template_nsp7f4q", form)
        .then(() => {
          setStatus("Message envoyé avec succès.");
          form.reset();
          if (timeInput) timeInput.value = new Date().toLocaleString("fr-FR");
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          setStatus(
            error && error.text ? error.text : "Erreur lors de l'envoi. Veuillez réessayer.",
            true
          );
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.textContent = "Envoyer le message";
        });
    });
  }

  /* ---- Année courante dans le footer ---- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

});
