const BACKEND = 'https://portfolio-backend-4fbc.onrender.com'; // Keep this for Admin Login/Saving
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
      // Map backend data to local structure
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
      
      // Clear and Fill Lists
      document.getElementById("experienceAdminList").innerHTML = "";
      (siteData.experience || []).forEach(exp => addExperience(exp));
      updateIndexes('experienceAdminList', 'Experience');

      document.getElementById("certAdminList").innerHTML = "";
      (siteData.certificates || []).forEach(c => addCertificate(c));
      updateIndexes('certAdminList', 'Certificate');

      document.getElementById("educationAdminList").innerHTML = "";
      (siteData.education || []).forEach(edu => addEducation(edu));
      updateIndexes('educationAdminList', 'Education');

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

/* ---------- HELPER: UPDATE NUMBERS ---------- */
function updateIndexes(containerId, namePrefix) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.item-card');
    items.forEach((item, index) => {
        const title = item.querySelector('.item-title') || item.querySelector('.card-header span');
        if(title) {
            title.innerText = `${namePrefix} ${index + 1}`;
        }
    });
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

/* ---------- SKILLS ---------- */
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
            <div><label>Group Title</label><input placeholder="e.g. Frontend" value="${s.title || ''}" onchange="siteData.skills[${i}].title=this.value" /></div>
            <div><label>Icon Class</label><input placeholder="e.g. code" value="${s.icon || ''}" onchange="siteData.skills[${i}].icon=this.value" /></div>
        </div>
        <label>Tags (Comma Separated)</label>
        <input placeholder="e.g. React, HTML, CSS" value="${(s.tags || []).join(',')}" onchange="siteData.skills[${i}].tags=this.value.split(',')" />
      </div>`;
  });
}
function addSkill() {
  siteData.skills.push({ title: '', icon: '', tags: [] });
  renderSkills();
}

/* ---------- PROJECTS ---------- */
function renderProjects() {
  const container = document.getElementById('projects');
  container.innerHTML = '';
  siteData.projects.forEach((p, i) => {
    container.innerHTML += `
      <div class="item-card">
         <div class="card-header">
            <span>Project ${i+1}</span>
            <button class="remove-btn" onclick="siteData.projects.splice(${i},1);renderProjects()">Remove</button>
        </div>
        <div class="grid-2">
            <div><label>Project Name</label><input placeholder="Name" value="${p.name || ''}" onchange="siteData.projects[${i}].name=this.value" /></div>
            <div><label>Image URL</label><input placeholder="https://..." class="code-input" value="${p.image || ''}" onchange="siteData.projects[${i}].image=this.value" /></div>
        </div>
        <div class="grid-2">
            <div><label>Live Link</label><input placeholder="https://..." class="code-input" value="${p.live||''}" onchange="siteData.projects[${i}].live=this.value" /></div>
            <div><label>GitHub Link</label><input placeholder="https://..." class="code-input" value="${p.github||''}" onchange="siteData.projects[${i}].github=this.value" /></div>
        </div>
        <label>Description</label>
        <textarea placeholder="Short description..." onchange="siteData.projects[${i}].description=this.value">${p.description||''}</textarea>
        <label>Tech Stack</label>
        <input placeholder="e.g. React, Node.js" value="${(p.stack||[]).join(',')}" onchange="siteData.projects[${i}].stack=this.value.split(',')" />
      </div>`;
  });
}
function addProject() {
  siteData.projects.push({});
  renderProjects();
}

/* ---------- EXPERIENCE ---------- */
function addExperience(data = {}) {
  const t = document.getElementById("experienceTemplate");
  const clone = t.content.cloneNode(true);
  clone.querySelector(".exp-role").value = data.role || "";
  clone.querySelector(".exp-company").value = data.company || "";
  clone.querySelector(".exp-duration").value = data.duration || "";
  clone.querySelector(".exp-description").value = data.description || "";
  document.getElementById("experienceAdminList").appendChild(clone);
  updateIndexes('experienceAdminList', 'Experience');
}
function removeExperience(btn) { 
    btn.closest(".experience-item").remove(); 
    updateIndexes('experienceAdminList', 'Experience');
}

/* ---------- CERTIFICATES ---------- */
function addCertificate(data = {}) {
  const t = document.getElementById("certTemplate");
  const clone = t.content.cloneNode(true);
  clone.querySelector(".cert-image").value = data.image || "";
  clone.querySelector(".cert-title").value = data.title || "";
  clone.querySelector(".cert-issuer").value = data.issuer || "";
  clone.querySelector(".cert-year").value = data.year || "";
  document.getElementById("certAdminList").appendChild(clone);
  updateIndexes('certAdminList', 'Certificate');
}
function removeCertificate(btn) {
    btn.closest(".cert-item").remove();
    updateIndexes('certAdminList', 'Certificate');
}

/* ---------- EDUCATION ---------- */
function addEducation(edu = {}) {
  const container = document.getElementById("educationAdminList");
  const item = document.createElement("div");
  item.className = "item-card education-item";
  item.innerHTML = `
    <div class="card-header" style="grid-column: span 2">
        <span class="item-title">Education Item</span>
        <button class="remove-btn" onclick="this.closest('.education-item').remove(); updateIndexes('educationAdminList', 'Education');">Remove</button>
    </div>
    <div class="grid-2">
        <div><label>Degree</label><input class="edu-degree" placeholder="e.g. BCA" value="${edu.degree||''}"/></div>
        <div><label>Institute</label><input class="edu-institute" placeholder="e.g. Techno India" value="${edu.institute||''}"/></div>
    </div>
    <div class="grid-2">
        <div><label>Year</label><input class="edu-year" placeholder="e.g. 2024-2028" value="${edu.year||''}"/></div>
        <div><label>Stream</label><input class="edu-stream" placeholder="e.g. Computer Science" value="${edu.stream||''}"/></div>
    </div>
    <label>Icon</label>
    <input class="edu-icon" placeholder="e.g. graduation-cap" value="${edu.icon||''}"/>
  `;
  container.appendChild(item);
  updateIndexes('educationAdminList', 'Education');
}

/* ---------- SOCIALS ---------- */
function addSocial(data = {}) {
    const div = document.createElement("div");
    div.className = "item-card social-item";
    div.innerHTML = `
        <div style="display:flex; gap:10px; width:100%; align-items:flex-end;">
            <div style="flex-grow:1">
                <label>Social URL</label>
                <input type="text" class="social-url code-input" placeholder="https://..." value="${data.url || ""}">
            </div>
            <button class="remove-btn" style="margin-bottom:12px;" onclick="this.parentElement.parentElement.remove()">Remove</button>
        </div>
    `;
    document.getElementById("socialAdminList").appendChild(div);
}

/* ---------- COLLECT DATA ---------- */
function collectData() {
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
}

/* ---------- SAVE TO BACKEND ---------- */
function save() {
    collectData(); // Update siteData object

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
        showToast('Changes Saved to Backend!', 'success');
    })
    .catch(err => {
        console.error(err);
        showToast('Save Failed. Check Console.', 'error');
    });
}

/* ---------- 🔥 DOWNLOAD CONFIG (THE NEW MAGIC BUTTON) ---------- */
function downloadConfig() {
    collectData(); // Ensure we have latest data
    const dataStr = JSON.stringify(siteData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "site-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Config Downloaded! Place it in your project.', 'success');
}

/* ---------- TOAST ---------- */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>';
    toast.innerHTML = `${icon} ${message}`;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}