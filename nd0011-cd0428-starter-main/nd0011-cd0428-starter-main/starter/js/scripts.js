function fixImagePath(path) {
  if (!path) return 'starter/images/card_placeholder_bg.webp';
  return path.replace(/^(\.\.\/|\.\/)?images\//, 'starter/images/');
}

// ============ About Me Section ============
fetch('starter/data/aboutMeData.json')
  .then(res => res.json())
  .then(data => {
    const aboutMe = document.getElementById('aboutMe');
    if (!aboutMe) return;

    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';
    const headshotImg = document.createElement('img');
    headshotImg.src = fixImagePath(data.headshot) || 'starter/images/headshot_placeholder.webp';
    headshotImg.alt = "Profile Photo";
    headshotContainer.appendChild(headshotImg);

    const bio = document.createElement('p');
    bio.textContent = data.aboutMe || "No bio available.";

    aboutMe.appendChild(bio);
    aboutMe.appendChild(headshotContainer);
  })
  .catch(err => console.error("About Me error:", err));

// ============ Projects Section & Spotlight ============
let projects = [];
let currentSpotlight = 0;

fetch('starter/data/projectsData.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
    const projectList = document.getElementById('projectList');
    const projectSpotlight = document.getElementById('projectSpotlight');
    const spotlightTitles = document.getElementById('spotlightTitles');

    function showSpotlight(idx) {
      const proj = projects[idx];
      let bgImage = fixImagePath(proj.spotlight_image) || fixImagePath(proj.card_image);

      projectSpotlight.style.backgroundImage = `url('${bgImage}')`;
      projectSpotlight.style.backgroundSize = "cover";
      projectSpotlight.style.backgroundPosition = "center";

      spotlightTitles.innerHTML = `
        <h3>${proj.project_name || ""}</h3>
        <p>${proj.long_description || ""}</p>
        ${proj.url ? `<a href="${proj.url}" target="_blank">Click here to see more.</a>` : ""}
      `;

      Array.from(projectList.children).forEach((el, i) => {
        el.classList.toggle('active', i === idx);
      });
    }

    projects.forEach((proj, i) => {
      const card = document.createElement('div');
      card.className = 'projectCard';
      card.id = proj.project_id;
      let cardImage = fixImagePath(proj.card_image);
      card.style.backgroundImage = `url('${cardImage}')`;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
      card.innerHTML = `
        <h4>${proj.project_name || "No Name"}</h4>
        <p>${proj.short_description || ""}</p>
      `;
      card.addEventListener('click', () => {
        currentSpotlight = i;
        showSpotlight(i);
      });
      projectList.appendChild(card);
    });

    showSpotlight(0);
  })
  .catch(err => console.error("Projects error:", err));

// ============ Project List Scrolling ============
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
if (leftArrow && rightArrow) {
  leftArrow.addEventListener('click', () => {
    const projectList = document.getElementById('projectList');
    if (window.innerWidth >= 1024) {
      projectList.scrollBy({ top: -220, behavior: 'smooth' });
    } else {
      projectList.scrollBy({ left: -220, behavior: 'smooth' });
    }
  });
  rightArrow.addEventListener('click', () => {
    const projectList = document.getElementById('projectList');
    if (window.innerWidth >= 1024) {
      projectList.scrollBy({ top: 220, behavior: 'smooth' });
    } else {
      projectList.scrollBy({ left: 220, behavior: 'smooth' });
    }
  });
}

// ============ Contact Form Validation ============
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const form = document.getElementById('formSection');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const charactersLeft = document.getElementById('charactersLeft');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    // Email validation
    const emailVal = emailInput.value.trim();
    if (!emailVal.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    } else if (/[^a-zA-Z0-9@._-]/.test(emailVal)) {
      emailError.textContent = "Email contains illegal characters.";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    // Message validation
    const msgVal = messageInput.value.trim();
    if (!msgVal) {
      messageError.textContent = "Message cannot be empty.";
      valid = false;
    } else if (msgVal.length > 300) {
      messageError.textContent = "Message is too long (max 300 chars).";
      valid = false;
    } else if (/[^a-zA-Z0-9 @.,;:'"!?\n\r()_\-\[\]]/.test(msgVal)) {
      messageError.textContent = "Message contains illegal characters.";
      valid = false;
    } else {
      messageError.textContent = "";
    }

    if (valid) {
      alert('Submission successful! Thank you.');
      form.reset();
      charactersLeft.textContent = "Characters: 0/300";
      charactersLeft.classList.remove('error');
    }
  });

  // Live character count
messageInput.addEventListener('input', function () {
  const len = messageInput.value.length;
  charactersLeft.textContent = `Characters: ${len}/300`;
  if (len > 300) {
    charactersLeft.classList.add('error');
  } else {
    charactersLeft.classList.remove('error');
  }
});

}
