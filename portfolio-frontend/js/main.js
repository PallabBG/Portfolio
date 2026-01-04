fetch('https://portfolio-backend-4fbc.onrender.com/site-data.json')
  .then(res => res.json())
  .then(data => {

    /* ================= HERO ================= */
    const heroImg = document.querySelector('.about-photo');
    if (heroImg && data.hero.photo) {
        heroImg.src = data.hero.photo;
    }

    // 🔥 FIX: Added 'extra' back and the separator '|'
    document.querySelector('.hero-desc').innerHTML = `
        ${data.hero.subtitle} <span style="color:var(--primary); margin:0 8px;">|</span> ${data.hero.extra}
        <br>
        <span style="color:var(--text-muted); font-size:0.9em; margin-top:10px; display:inline-block; font-weight: 500;">
            ${data.hero.statusLine || ''}
        </span>
    `;

    document.querySelector('.hero-badge').innerText = data.hero.badge || 'Portfolio';
    document.querySelector('.hero-first-name').innerText = data.hero.firstName;
    document.querySelector('.hero-last-name').innerText = data.hero.lastName;
    
    // 🔥 TYPEWRITER EFFECT
    const titleElement = document.querySelector('.hero-title');
    const titleText = data.hero.title || "Full Stack Developer";
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < titleText.length) {
            titleElement.innerHTML = titleText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    setTimeout(typeWriter, 500);

    document.querySelector('.resume-btn').href = data.hero.resume;


    /* ================= ABOUT ================= */
    if (data.about) {
        document.getElementById("about-heading").innerText = data.about.heading || '';
        
        const paragraphs = (data.about?.description || "")
            .split(/\n\s*\n/)
            .map(p => `<p>${p.trim()}</p>`)
            .join("");
        document.querySelector(".about-description").innerHTML = paragraphs;

        document.getElementById("about-stats").innerHTML = `
          <div class="stat">
            <h4>${data.about.stats?.year || '0'}</h4>
            <span>Exp. Years</span>
          </div>
          <div class="stat">
            <h4>${data.about.stats?.projects || '0'}</h4>
            <span>Projects</span>
          </div>
          <div class="stat">
            <h4>${data.about.stats?.hackathons || '0'}</h4>
            <span>Hackathons</span>
          </div>
        `;

        const aboutImg = document.querySelector('.about-photo');
        if (aboutImg && data.about.profile?.image) {
            aboutImg.src = data.about.profile.image;
        }

        document.getElementById("aboutLocationText").textContent = data.about?.profile?.location || "";
        document.getElementById("aboutEmailText").textContent = data.about?.profile?.email || "";
        document.getElementById("aboutAgeText").textContent = data.about?.profile?.age ? `${data.about.profile.age} Years Old` : "";
    }

    /* ================= SKILLS ================= */
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      data.skills.forEach(skill => {
        skillsContainer.innerHTML += `
          <div class="skill-group reveal">
            <h3><i class="fas fa-${skill.icon}"></i> ${skill.title}</h3>
            <div class="tags">
              ${skill.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        `;
      });
    }

    /* ================= PROJECTS ================= */
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = '';
      data.projects.forEach(project => {
        projectsGrid.innerHTML += `
          <div class="project-card reveal">
            <div class="project-img-wrapper">
              <img src="${project.image}" onerror="this.src='https://via.placeholder.com/400x250/111/fff?text=No+Image'">
              <div class="overlay-actions">
                ${project.live ? `<a href="${project.live}" target="_blank" class="action-btn"><i class="fas fa-external-link-alt"></i></a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" class="action-btn"><i class="fab fa-github"></i></a>` : ''}
              </div>
            </div>
            <div class="project-content">
              <h3>${project.name}</h3>
              <p>${project.description}</p>
              <div class="stack-list">
                ${project.stack.map(t => `<span class="stack-item">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      });
    }

    /* ================= EXPERIENCE ================= */
    const experienceList = document.getElementById("experienceList");
    if (experienceList && Array.isArray(data.experience)) {
      experienceList.innerHTML = "";
      data.experience.forEach(exp => {
        const card = document.createElement("div");
        card.className = "card experience-card reveal";
        card.innerHTML = `
          <h3>${exp.role}</h3>
          <p class="exp-company">${exp.company}</p>
          <p class="exp-duration">${exp.duration}</p>
          <p class="exp-description">${exp.description}</p>
        `;
        experienceList.appendChild(card);
      });
    }
    
    renderEducation(data.education || []);
    renderCertificates(data.certificates || []);
    renderSocials(data.socials || []);
    renderContact(data.contact || {});
    renderFooterYear(data.footerYear || {});

    // 🔥 INIT SCROLL ANIMATIONS
    setTimeout(initScrollAnimations, 500);
  })
  .catch(err => console.error('Failed to load site-data.json', err));

/* ================= HELPER FUNCTIONS ================= */

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

function renderCertificates(certificates = []) {
  const container = document.getElementById("certificatesContainer");
  if (!container) return;
  container.innerHTML = "";

  certificates.forEach(cert => {
    const card = document.createElement("div");
    card.className = "cert-card reveal";
    card.onclick = () => openCertModal(cert.image);
    card.innerHTML = `
      <img src="${cert.image}" class="cert-img" onerror="this.src='https://via.placeholder.com/300x180/111/fff?text=Certificate'">
      <div class="cert-info">
        <h4>${cert.title}</h4>
        <span>${cert.issuer} • ${cert.year}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderEducation(education = []) {
  const container = document.getElementById("educationList");
  container.innerHTML = "";
  education.forEach(edu => {
    const div = document.createElement("div");
    div.className = "edu-item reveal";
    div.innerHTML = `
      <div class="edu-icon">
        <i class="fas fa-${edu.icon || "graduation-cap"}"></i>
      </div>
      <div class="edu-content">
        <h4>${edu.degree}</h4>
        <span class="edu-year">${edu.year}</span>
        <p class="edu-institute">${edu.institute}</p>
        <p style="color:var(--text-muted); font-size:0.9rem;">${edu.stream}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderContact(contact) {
  if (!contact) return;
  const textEl = document.getElementById("contactText");
  const emailBtn = document.getElementById("contactEmailBtn");
  if (textEl) textEl.innerText = contact.text || "";
  if (emailBtn && contact.email) {
    emailBtn.href = `mailto:${contact.email}`;
  }
}

function getSocialIcon(url) {
  if (url.includes("github.com")) return "fab fa-github";
  if (url.includes("linkedin.com")) return "fab fa-linkedin";
  if (url.includes("twitter.com") || url.includes("x.com")) return "fab fa-x-twitter";
  if (url.includes("instagram.com")) return "fab fa-instagram";
  if (url.includes("facebook.com")) return "fab fa-facebook";
  if (url.includes("youtube.com")) return "fab fa-youtube";
  return "fas fa-link";
}

function renderSocials(socials) {
  const container = document.getElementById("socialLinks");
  if (!container) return;
  container.innerHTML = "";
  (socials || []).forEach(s => {
    if (!s || !s.url) return;
    const a = document.createElement("a");
    a.href = s.url.startsWith("http") ? s.url : `https://${s.url}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "social-icon";
    a.innerHTML = `<i class="${getSocialIcon(s.url)}"></i>`;
    container.appendChild(a);
  });
}

function renderFooterYear(year) {
  const footerYear = year || new Date().getFullYear();
  const mainYear = document.getElementById("footerYear");
  if (mainYear) mainYear.textContent = footerYear;
  document.querySelectorAll(".sidebar-footer").forEach(el => {
    el.innerHTML = `&copy; ${footerYear} Pallab B.`;
  });
}

/* ================= MODAL LOGIC ================= */
const modal = document.getElementById("certModal");
const modalImg = document.getElementById("certModalImg");

function openCertModal(imgUrl) {
    if(modal && modalImg) {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('active'), 10);
        modalImg.src = imgUrl;
    }
}

function closeCertModal() {
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = "none", 300);
    }
}

if(modal) {
    modal.onclick = (e) => {
        if(e.target === modal) closeCertModal();
    }
}