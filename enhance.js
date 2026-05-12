// ============================================================
//  enhance.js — interactions, modal, skills, form, FAB
// ============================================================

// -------- Floating Action Button (FAB) --------
const fab = document.getElementById("fab");
const fabPopup = document.getElementById("fab-popup");
if (fab && fabPopup) {
  fab.addEventListener("click", () => fabPopup.classList.toggle("show"));
  document.body.addEventListener("click", (e) => {
    if (!fab.contains(e.target) && !fabPopup.contains(e.target)) {
      fabPopup.classList.remove("show");
    }
  });
}

// -------- Animate Circular Skill Dots (IntersectionObserver) --------
function animateSkillDots() {
  const skillItems = document.querySelectorAll(".skill-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const percent = parseInt(item.dataset.percent);
      const circle = item.querySelector(".skill-dot-circle");
      const percentText = item.querySelector(".skill-percent");
      let progress = 0;

      const interval = setInterval(() => {
        progress++;
        const deg = (progress / 100) * 360;
        circle.style.background = `conic-gradient(var(--cyan-glow) ${deg}deg, rgba(255,255,255,0.1) ${deg}deg)`;
        percentText.textContent = progress + "%";
        if (progress >= percent) {
          clearInterval(interval);
          item.classList.add("animated");
        }
      }, 14);

      observer.unobserve(item);
    });
  }, { threshold: 0.4 });

  skillItems.forEach((item) => observer.observe(item));
}

// -------- Timeline card expand/collapse --------
document.querySelectorAll(".timeline-card").forEach((card) => {
  card.addEventListener("click", function () {
    this.classList.toggle("expanded");
    const desc = this.querySelector(".timeline-desc");
    if (desc) desc.style.color = this.classList.contains("expanded") ? "var(--text-main)" : "";
  });
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter") this.click();
  });
});

// -------- Project Detail Data --------
const projectData = {
  1: {
    title: "Responsive Web Portfolio",
    tags: ["HTML", "CSS", "JavaScript"],
    desc: `An elegant, cyber-modern developer portfolio built entirely with vanilla HTML, CSS, and JavaScript. Features include:`,
    bullets: [
      "Animated neon background canvas with floating geometric shapes",
      "Glowing hexagon avatar with floating animation",
      "Typewriter rotating title effect",
      "Fully responsive layout for all screen sizes",
      "Smooth scroll navigation and preloader",
      "Circular animated skill indicators",
      "Interactive project cards with modal popups"
    ]
  },
  2: {
    title: "Registrar's Office Transaction Processing System",
    tags: ["PHP", "Laravel", "MySQL", "Bootstrap"],
    desc: `A web-based system for Camarines Sur Polytechnic College designed to digitize and streamline registrar operations:`,
    bullets: [
      "Online request submission for certifications and transcripts",
      "Student tracking dashboard for request statuses",
      "Staff admin panel for processing and approving requests",
      "Eliminates long queues and reduces processing time",
      "Secure authentication and document management",
      "Automated email notifications for students"
    ]
  },
  3: {
    title: "PolyClinic System",
    tags: ["PHP", "MySQL", "Bootstrap"],
    desc: `A comprehensive healthcare management platform built for polyclinic operations:`,
    bullets: [
      "Patient registration and medical records management",
      "Appointment scheduling with calendar integration",
      "Treatment monitoring and prescription tracking",
      "Staff coordination (doctors, nurses, admin)",
      "Minimizes paperwork and reduces manual errors",
      "Role-based access control for different staff types"
    ]
  },
  4: {
    title: "FableLearning Website",
    tags: ["HTML", "CSS", "JavaScript", "Web Audio API"],
    desc: `An interactive educational story platform for young learners, featuring narrated fables and engaging mini-games:`,
    bullets: [
      '<i class="fa-solid fa-book-open"></i> 3 original educational fables with audio narration (Web Audio API / recorded audio)',
      '<i class="fa-solid fa-magnifying-glass"></i> Story 1 Game: Word Search — find hidden vocabulary from the story',
      '<i class="fa-solid fa-images"></i> Story 2 Game: 3 Pics One Riddle — identify a word/concept from three image clues',
      '<i class="fa-solid fa-circle-dot"></i> Story 3 Game: Spinning Wheel Quiz — answer 10 questions perfectly to win',
      "Progress tracking per story and game",
      "Kid-friendly UI with colorful, animated design",
      "Responsive layout for tablets and desktop"
    ]
  }
};

// -------- Project Modal --------
const modal = document.getElementById("projectModal");
const modalInfo = document.getElementById("modalProjectInfo");
const closeModalBtn = document.getElementById("closeModal");

function buildModalHTML(data) {
  const tagsHTML = data.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  const bulletsHTML = data.bullets
    .map((b) => `<li>${b}</li>`)
    .join("");
  return `
    <h3>${data.title}</h3>
    <div class="modal-tag-row">${tagsHTML}</div>
    <p>${data.desc}</p>
    <ul>${bulletsHTML}</ul>
  `;
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", function (e) {
    // Don't open modal if the "View Details" toggle button was clicked
    if (e.target.classList.contains("project-btn")) return;
    const idx = parseInt(card.getAttribute("data-project"));
    if (projectData[idx]) {
      modalInfo.innerHTML = buildModalHTML(projectData[idx]);
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  });
});

// "View Details" button also opens modal (not expand text anymore)
document.querySelectorAll(".project-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = btn.closest(".project-card");
    const idx = parseInt(card.getAttribute("data-project"));
    if (projectData[idx]) {
      modalInfo.innerHTML = buildModalHTML(projectData[idx]);
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  });
});

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

// -------- Contact Form --------
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("formMsg");
    const txt = "Message sent! I'll get back to you soon.";
    let curr = 0;
    msg.style.display = "block";
    msg.textContent = "";
    const interval = setInterval(() => {
      msg.textContent += txt[curr];
      curr++;
      if (curr >= txt.length) {
        clearInterval(interval);
        setTimeout(() => {
          msg.style.display = "none";
          form.reset();
        }, 2200);
      }
    }, 35);
  });
}

// -------- Init on DOMContentLoaded --------
window.addEventListener("DOMContentLoaded", () => {
  animateSkillDots();
});