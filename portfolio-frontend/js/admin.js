const BACKEND = 'https://portfolio-backend-4fbc.onrender.com';
let TOKEN = '';
let siteData = {};

/* ---------- LOGIN ---------- */
function login() {
  const emailVal = document.getElementById('email').value;
  const passVal = document.getElementById('password').value;

  fetch(`${BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: emailVal, password: passVal })
  })
  .then(r => r.json())
  .then(d => {
    if(d.token) {
        TOKEN = d.token;
        const loginScreen = document.getElementById('login-screen');
        const editor = document.getElementById('editor');

        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            editor.style.display = 'flex';
        }, 300);

        loadData();
    } else {
        showToast('Login Failed: Invalid Credentials', 'error');
    }
  })
  .catch((err) => {
      console.error(err);
      showToast('Server Error: Is backend running?', 'error');
  });
}

/* ---------- LOAD DATA ---------- */
function loadData() {
  fetch(`${BACKEND}/site-data.json`)
    .then(r => r.json())
    .then(d => {
      siteData = {
        hero: d.hero || {},
        about: d.about || {},
        skills: d.skills || [],
        projects: d.projects || [],
        experience: d.experience || [],
        education: d.education || [],
        certificates: d.certificates || [],
        socials: d.socials || [],
        contact: d.contact || {},
        footerYear: d.footerYear || {},
      };

      fillHero();
      fillAbout();
      renderSkills();
      renderProjects();

      document.getElementById("experienceAdminList").innerHTML = "";
      (siteData.experience || []).forEach(exp => addExperience(exp));

      document.getElementById("certAdminList").innerHTML = "";
      (siteData.certificates || []).forEach(c => addCertificate(c));

      document.getElementById("educationAdminList").innerHTML = "";
      (siteData.education || []).forEach(edu => addEducation(edu));

      document.getElementById("socialAdminList").innerHTML = "";
      (siteData.socials || []).forEach(s => addSocial(s));

      if (siteData.contact) {
        document.getElementById("contactTextInput").value = siteData.contact.text || "";
        document.getElementById("contactEmailInput").value = siteData.contact.email || "";
      }
      document.getElementById("footerYearInput").value = siteData.footerYear || "2025";
    })
    .catch(e => console.error("Error loading data:", e));
}

/* ---------- FILL BASIC SECTIONS ---------- */
function fillHero() {
  document.getElementById('photo').value = siteData.hero.photo || '';
  document.getElementById('badge').value = siteData.hero.badge || '';
  document.getElementById('firstName').value = siteData.hero.firstName || '';
  document.getElementById('lastName').value = siteData.hero.lastName || '';
  document.getElementById('title').value = siteData.hero.title || '';
  document.getElementById('subtitle').value = siteData.hero.subtitle || '';
  document.getElementById('extra').value = siteData.hero.extra || '';
  document.getElementById('statusLine').value = siteData.hero.statusLine || '';
  document.getElementById('resume').value = siteData.hero.resume || '';
}

function fillAbout() {
  document.getElementById('aboutHeading').value = siteData.about?.heading || '';
  document.getElementById('aboutDescription').value = siteData.about?.description || '';
  
  document.getElementById('aboutYear').value = siteData.about?.stats?.year || '';
  document.getElementById('aboutRole').value = siteData.about?.stats?.role || '';
  document.getElementById('aboutProjects').value = siteData.about?.stats?.projects || '';
  document.getElementById('aboutHackathons').value = siteData.about?.stats?.hackathons || '';
  
  document.getElementById('aboutImage').value = siteData.about?.profile?.image || '';
  document.getElementById('aboutLocation').value = siteData.about?.profile?.location || '';
  document.getElementById('aboutEmail').value = siteData.about?.profile?.email || '';
  document.getElementById('aboutAge').value = siteData.about?.profile?.age || '';
}

/* ---------- RENDER DYNAMIC LISTS ---------- */
function renderSkills() {
  const container = document.getElementById('skills');
  container.innerHTML = '';
  siteData.skills.forEach((s, i) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="card-header">
            <span>Skill Group ${i+1}</span>
            <button class="remove-btn" onclick="siteData.skills.splice(${i},1);renderSkills()">Remove</button>
        </div>
        <div class="grid-2">
            <input placeholder="Title" value="${s.title || ''}" onchange="siteData.skills[${i}].title=this.value" />
            <input placeholder="Icon (fas fa-code)" value="${s.icon || ''}" onchange="siteData.skills[${i}].icon=this.value" />
        </div>
        <input placeholder="Tags (React, Node, etc)" value="${(s.tags || []).join(',')}" onchange="siteData.skills[${i}].tags=this.value.split(',')" />
      </div>`;
  });
}
function addSkill() {
  siteData.skills.push({ title: '', icon: '', tags: [] });
  renderSkills();
}

function renderProjects() {
  const container = document.getElementById('projects');
  container.innerHTML = '';
  siteData.projects.forEach((p, i) => {
    container.innerHTML += `
      <div class="item-card">
         <div class="card-header">
            <span>Project: ${p.name || 'New'}</span>
            <button class="remove-btn" onclick="siteData.projects.splice(${i},1);renderProjects()">Remove</button>
        </div>
        <div class="grid-2">
            <input placeholder="Project Name" value="${p.name || ''}" onchange="siteData.projects[${i}].name=this.value" />
            <input placeholder="Image URL" class="code-input" value="${p.image || ''}" onchange="siteData.projects[${i}].image=this.value" />
        </div>
        <div class="grid-2">
            <input placeholder="Live URL" class="code-input" value="${p.live||''}" onchange="siteData.projects[${i}].live=this.value" />
            <input placeholder="GitHub URL" class="code-input" value="${p.github||''}" onchange="siteData.projects[${i}].github=this.value" />
        </div>
        <textarea placeholder="Description" onchange="siteData.projects[${i}].description=this.value">${p.description||''}</textarea>
        <input placeholder="Stack (comma separated)" value="${(p.stack||[]).join(',')}" onchange="siteData.projects[${i}].stack=this.value.split(',')" />
      </div>`;
  });
}
function addProject() {
  siteData.projects.push({});
  renderProjects();
}

function addExperience(data = {}) {
  const t = document.getElementById("experienceTemplate");
  const clone = t.content.cloneNode(true);
  clone.querySelector(".exp-role").value = data.role || "";
  clone.querySelector(".exp-company").value = data.company || "";
  clone.querySelector(".exp-duration").value = data.duration || "";
  clone.querySelector(".exp-description").value = data.description || "";
  document.getElementById("experienceAdminList").appendChild(clone);
}
function removeExperience(btn) { btn.closest(".experience-item").remove(); }

function addCertificate(data = {}) {
  const t = document.getElementById("certTemplate");
  const clone = t.content.cloneNode(true);
  clone.querySelector(".cert-image").value = data.image || "";
  clone.querySelector(".cert-title").value = data.title || "";
  clone.querySelector(".cert-issuer").value = data.issuer || "";
  clone.querySelector(".cert-year").value = data.year || "";
  document.getElementById("certAdminList").appendChild(clone);
}

function addEducation(edu = {}) {
  const container = document.getElementById("educationAdminList");
  const item = document.createElement("div");
  item.className = "item-card education-item";
  item.innerHTML = `
    <div class="card-header" style="grid-column: span 2">
        <span>Education</span>
        <button class="remove-btn" onclick="this.closest('.education-item').remove()">Remove</button>
    </div>
    <div class="grid-2">
        <input class="edu-degree" placeholder="Degree" value="${edu.degree||''}"/>
        <input class="edu-institute" placeholder="Institute" value="${edu.institute||''}"/>
    </div>
    <div class="grid-2">
        <input class="edu-year" placeholder="Year" value="${edu.year||''}"/>
        <input class="edu-stream" placeholder="Stream" value="${edu.stream||''}"/>
    </div>
    <input class="edu-icon" placeholder="Icon Class (e.g. graduation-cap)" value="${edu.icon||''}"/>
  `;
  container.appendChild(item);
}
document.getElementById("addEducationBtn").onclick = () => addEducation();

function addSocial(data = {}) {
    const div = document.createElement("div");
    div.className = "item-card social-item";
    div.innerHTML = `
        <div style="display:flex; gap:10px; width:100%;">
            <input type="text" class="social-url code-input" placeholder="https://..." value="${data.url || ""}">
            <button class="remove-btn" onclick="this.parentElement.parentElement.remove()">Remove</button>
        </div>
    `;
    document.getElementById("socialAdminList").appendChild(div);
}

/* ---------- SAVE FUNCTION WITH TOAST ---------- */
function save() {
    const getData = (sel) => document.getElementById(sel).value;

    siteData.hero = {
        photo: getData('photo'),
        badge: getData('badge'),
        firstName: getData('firstName'),
        lastName: getData('lastName'),
        title: getData('title'),
        subtitle: getData('subtitle'),
        extra: getData('extra'),
        statusLine: getData('statusLine'),
        resume: getData('resume')
    };

    siteData.about = {
        heading: getData('aboutHeading'),
        description: getData('aboutDescription'),
        stats: {
            year: getData('aboutYear'),
            role: getData('aboutRole'),
            projects: getData('aboutProjects'),
            hackathons: getData('aboutHackathons')
        },
        profile: {
            image: getData('aboutImage'),
            location: getData('aboutLocation'),
            email: getData('aboutEmail'),
            age: getData('aboutAge')
        }
    };

    siteData.experience = [];
    document.querySelectorAll(".experience-item").forEach(item => {
        siteData.experience.push({
            role: item.querySelector(".exp-role").value,
            company: item.querySelector(".exp-company").value,
            duration: item.querySelector(".exp-duration").value,
            description: item.querySelector(".exp-description").value
        });
    });

    siteData.certificates = [];
    document.querySelectorAll(".cert-item").forEach(item => {
        siteData.certificates.push({
            image: item.querySelector(".cert-image").value,
            title: item.querySelector(".cert-title").value,
            issuer: item.querySelector(".cert-issuer").value,
            year: item.querySelector(".cert-year").value
        });
    });

    siteData.education = [];
    document.querySelectorAll(".education-item").forEach(item => {
        siteData.education.push({
            degree: item.querySelector(".edu-degree").value,
            institute: item.querySelector(".edu-institute").value,
            year: item.querySelector(".edu-year").value,
            stream: item.querySelector(".edu-stream").value,
            icon: item.querySelector(".edu-icon").value
        });
    });

    siteData.contact = {
        text: getData("contactTextInput"),
        email: getData("contactEmailInput")
    };
    siteData.socials = [];
    document.querySelectorAll(".social-item").forEach(item => {
        const url = item.querySelector(".social-url").value.trim();
        if (url) siteData.socials.push({ url });
    });
    siteData.footerYear = getData("footerYearInput");

    fetch(`${BACKEND}/api/site`, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + TOKEN
        },
        body: JSON.stringify(siteData)
    })
    .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
    })
    .then(() => {
        // 🔥 SHOW SUCCESS TOAST
        showToast('Changes Saved Successfully!', 'success');
    })
    .catch(err => {
        console.error(err);
        // 🔥 SHOW ERROR TOAST
        showToast('Save Failed. Check Console.', 'error');
    });
}

/* ---------- TOAST NOTIFICATION LOGIC ---------- */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Icon based on type
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-triangle"></i>';

    toast.innerHTML = `${icon} ${message}`;
    toast.className = `toast ${type} show`;

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}