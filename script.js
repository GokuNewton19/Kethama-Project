/* =========================================================
   KETHAMA CONSULT — script.js
   Sections:
   1. Service data (single source of truth for cards + dropdown)
   2. Router (tap-to-navigate between views, no scroll-reveal)
   3. Renderers (services, board placeholders, footer links)
   4. Request form (validation + submit + success animation)
   5. Contact form (functional via mailto + stub for backend)
   6. Supabase-ready hooks (fill in when backend is connected)
   7. UI polish: navbar blur-on-scroll, mobile menu, parallax/tilt
   ========================================================= */

/* ---------------------------------------------------------
   1. SERVICE DATA
   --------------------------------------------------------- */
const SERVICES = [
  {
    id: 'chartered-accountants',
    name: 'Chartered Accountants',
    short: 'Advisory and reporting from professionals licensed to certify your financial statements.',
    long: 'Our chartered accountants prepare and certify financial statements to a standard that regulators, banks and investors trust — bringing licensed authority to every report we sign.',
    icon: 'ledger'
  },
  {
    id: 'chartered-bankers',
    name: 'Chartered Bankers',
    short: 'Banking and treasury advisory from specialists who understand lending from the inside.',
    long: 'Get advice from chartered bankers on lending structures, treasury management and regulatory capital — perspective shaped by years inside banking institutions.',
    icon: 'bank'
  },
  {
    id: 'legal-advisory',
    name: 'Legal Advisory',
    short: 'Corporate and commercial counsel that keeps your contracts and governance solid.',
    long: 'From contract drafting to regulatory compliance and dispute guidance, our legal advisory service keeps your business on solid legal ground at every stage.',
    icon: 'gavel'
  },
  {
    id: 'accountants',
    name: 'Accountants',
    short: 'Day-to-day bookkeeping and management accounts that keep your numbers current.',
    long: 'Ongoing bookkeeping, reconciliations and management accounts, delivered on a schedule that keeps your business decision-ready every month.',
    icon: 'calculator'
  },
  {
    id: 'audit',
    name: 'Audit',
    short: 'Independent, evidence-based examination of your statements and internal controls.',
    long: 'An independent audit of your financial statements and internal controls, carried out to chartered standards and documented for regulators, lenders and shareholders.',
    icon: 'audit'
  },
  {
    id: 'tax',
    name: 'Tax',
    short: 'Planning, filing and representation that keeps you compliant while minimising liability.',
    long: 'Tax planning, filing and representation before the Ghana Revenue Authority — structured to keep you fully compliant while legitimately minimising what you owe.',
    icon: 'percent'
  },
  {
    id: 'secretary',
    name: 'Secretary',
    short: 'Statutory filings, board minutes and governance administration, handled end-to-end.',
    long: 'Company secretarial support covering statutory filings, board minutes, share registers and Registrar-General compliance — so your governance paperwork is never late.',
    icon: 'seal'
  },
  {
    id: 'training',
    name: 'Training Services',
    short: 'Workshops and certification-track training for finance, audit and governance teams.',
    long: 'Practical workshops and certification-track training for finance, audit, tax and governance teams — built around real cases, not generic slides.',
    icon: 'training'
  }
];

const ICONS = {
  ledger: '<path d="M5 3h11l3 3v15H5z"/><path d="M16 3v3h3"/><path d="M9 11h6M9 15h6M9 7h3"/>',
  bank: '<path d="M3 21h18"/><path d="M4 21V10l8-6 8 6v11"/><path d="M9 21v-7h6v7"/>',
  gavel: '<path d="M14 5l5 5"/><path d="M3 21l7-7"/><path d="M8.5 9.5l6 6"/><path d="M11 5l4-2 6 6-2 4-8-8z"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 18h8"/>',
  audit: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/><path d="M7.5 10l1.7 1.7L12.5 8"/>',
  percent: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M18 6L6 18"/>',
  seal: '<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>',
  training: '<path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>'
};

function iconSvg(key){
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[key] || ICONS.ledger}</svg>`;
}

/* ---------------------------------------------------------
   2. ROUTER
   --------------------------------------------------------- */
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('[data-route]');

function navigateTo(route, { push = true } = {}){
  const target = document.getElementById('view-' + route);
  if(!target) return;

  views.forEach(v => v.classList.remove('active'));
  target.classList.add('active');

  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  if(push) history.pushState({ route }, '', '#' + route);

  // close mobile nav after navigating
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('open');
}

navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(btn.dataset.route);
  });
});

window.addEventListener('popstate', (e) => {
  const route = (e.state && e.state.route) || location.hash.replace('#','') || 'home';
  navigateTo(route, { push: false });
});

// initial route from hash
const initialRoute = location.hash.replace('#','') || 'home';
navigateTo(initialRoute, { push: false });

/* ---------------------------------------------------------
   3. RENDERERS
   --------------------------------------------------------- */

// home page service cards
const servicesGrid = document.getElementById('servicesGrid');
servicesGrid.innerHTML = SERVICES.map((s, i) => `
  <div class="service-card" data-tilt>
    <span class="tag">0${i + 1}</span>
    <div class="service-icon">${iconSvg(s.icon)}</div>
    <h3>${s.name}</h3>
    <p>${s.short}</p>
  </div>
`).join('');

// request page detailed list
const serviceDetailList = document.getElementById('serviceDetailList');
serviceDetailList.innerHTML = SERVICES.map(s => `
  <div class="detail-item">
    <div class="service-icon">${iconSvg(s.icon)}</div>
    <div>
      <h3>${s.name}</h3>
      <p>${s.long}</p>
    </div>
  </div>
`).join('');

// service dropdown
const reqService = document.getElementById('reqService');
SERVICES.forEach(s => {
  const opt = document.createElement('option');
  opt.value = s.name;
  opt.textContent = s.name;
  reqService.appendChild(opt);
});
const otherOpt = document.createElement('option');
otherOpt.value = 'Other';
otherOpt.textContent = 'Other (not listed)';
reqService.appendChild(otherOpt);

const otherServiceField = document.getElementById('otherServiceField');
reqService.addEventListener('change', () => {
  const isOther = reqService.value === 'Other';
  otherServiceField.style.display = isOther ? 'flex' : 'none';
  document.getElementById('reqServiceOther').required = isOther;
});

// footer service links
document.getElementById('footerServices').innerHTML = SERVICES.slice(0,5).map(s => `<li>${s.name}</li>`).join('');

// board of directors placeholders — replace with real details later
const boardGrid = document.getElementById('boardGrid');
const BOARD_PLACEHOLDER_COUNT = 6;
boardGrid.innerHTML = Array.from({ length: BOARD_PLACEHOLDER_COUNT }).map((_, i) => `
  <div class="board-card">
    <div class="img-placeholder board-photo">Board Member Photo<br>Placeholder ${i + 1}</div>
    <div class="board-info">
      <h4>Full Name Placeholder</h4>
      <span class="role">Board Title Placeholder</span>
      <p class="bio">Short biography placeholder — add a sentence or two about this board member's background and role at Kethama Consult.</p>
    </div>
  </div>
`).join('');

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   4. REQUEST FORM
   --------------------------------------------------------- */
const requestForm = document.getElementById('requestForm');
const successOverlay = document.getElementById('successOverlay');

function setFieldValidity(field, isValid){
  field.closest('.field').classList.toggle('invalid', !isValid);
}

function validateRequestForm(data){
  let valid = true;
  const nameField = document.getElementById('reqName');
  const emailField = document.getElementById('reqEmail');
  const phoneField = document.getElementById('reqPhone');
  const serviceField = document.getElementById('reqService');
  const descField = document.getElementById('reqDescription');

  if(!data.name.trim()){ setFieldValidity(nameField, false); valid = false; } else setFieldValidity(nameField, true);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if(!emailOk){ setFieldValidity(emailField, false); valid = false; } else setFieldValidity(emailField, true);
  if(!data.phone.trim()){ setFieldValidity(phoneField, false); valid = false; } else setFieldValidity(phoneField, true);
  if(!data.service){ setFieldValidity(serviceField, false); valid = false; } else setFieldValidity(serviceField, true);
  if(!data.description.trim()){ setFieldValidity(descField, false); valid = false; } else setFieldValidity(descField, true);

  return valid;
}

requestForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(requestForm);
  const data = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    phone: formData.get('phone') || '',
    service: formData.get('service') || '',
    serviceOther: formData.get('serviceOther') || '',
    company: formData.get('company') || '',
    description: formData.get('description') || '',
    submittedAt: new Date().toISOString()
  };

  if(!validateRequestForm(data)) return;

  const submitBtn = document.getElementById('requestSubmitBtn');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try{
    await submitRequestToSupabase(data);   // see section 6 below
    successOverlay.classList.add('show');
    requestForm.reset();
    otherServiceField.style.display = 'none';
  }catch(err){
    console.error('Request submission failed:', err);
    alert('Something went wrong sending your request. Please try again or call us directly.');
  }finally{
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

document.getElementById('closeSuccess').addEventListener('click', () => {
  successOverlay.classList.remove('show');
});
successOverlay.addEventListener('click', (e) => {
  if(e.target === successOverlay) successOverlay.classList.remove('show');
});

/* ---------------------------------------------------------
   5. CONTACT FORM (functional today via mailto, backend-ready)
   --------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const toastEl = document.getElementById('toast');

function showToast(message, duration = 3200){
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), duration);
}

function validateContactForm(data){
  let valid = true;
  const nameField = document.getElementById('cName');
  const emailField = document.getElementById('cEmail');
  const subjectField = document.getElementById('cSubject');
  const messageField = document.getElementById('cMessage');

  if(!data.name.trim()){ setFieldValidity(nameField, false); valid = false; } else setFieldValidity(nameField, true);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if(!emailOk){ setFieldValidity(emailField, false); valid = false; } else setFieldValidity(emailField, true);
  if(!data.subject.trim()){ setFieldValidity(subjectField, false); valid = false; } else setFieldValidity(subjectField, true);
  if(!data.message.trim()){ setFieldValidity(messageField, false); valid = false; } else setFieldValidity(messageField, true);

  return valid;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    subject: formData.get('subject') || '',
    message: formData.get('message') || '',
    submittedAt: new Date().toISOString()
  };

  if(!validateContactForm(data)) return;

  const submitBtn = document.getElementById('contactSubmitBtn');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try{
    // Store the message (Supabase-ready stub — see section 6)
    await submitContactToSupabase(data);

    // Functional fallback that works with zero backend: opens the
    // visitor's email client with everything pre-filled.
    const mailBody =
      `Name: ${data.name}%0D%0A` +
      `Email: ${data.email}%0D%0A%0D%0A` +
      `${encodeURIComponent(data.message)}`;
    const mailtoLink = `mailto:info@kethamaconsult.com?subject=${encodeURIComponent(data.subject)}&body=${mailBody}`;
    window.location.href = mailtoLink;

    showToast('Opening your email app to send this message to KETHAMA CONSULT…');
    contactForm.reset();
  }catch(err){
    console.error('Contact submission failed:', err);
    showToast('Something went wrong. Please call us instead.');
  }finally{
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* ---------------------------------------------------------
   6. SUPABASE-READY HOOKS
   ---------------------------------------------------------
   These two functions are the only places that need to change
   when a Supabase backend is connected. Right now they simply
   resolve locally so the site works with zero backend.

   TO CONNECT SUPABASE:
   1. Add to index.html, before script.js:
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   2. Initialise the client near the top of this file:
        const supabase = window.supabase.createClient(
          'YOUR_SUPABASE_URL',
          'YOUR_SUPABASE_ANON_KEY'
        );
   3. Replace the body of each function below with an insert, e.g.:
        const { error } = await supabase.from('requests').insert([data]);
        if (error) throw error;
   --------------------------------------------------------- */

async function submitRequestToSupabase(data){
  // --- Supabase insert goes here, e.g.: ---
  // const { error } = await supabase.from('requests').insert([data]);
  // if (error) throw error;

  // Local placeholder behaviour until Supabase is connected:
  console.log('[Kethama] New service request (not yet saved to a backend):', data);
  return new Promise(resolve => setTimeout(resolve, 900));
}

async function submitContactToSupabase(data){
  // --- Supabase insert goes here, e.g.: ---
  // const { error } = await supabase.from('messages').insert([data]);
  // if (error) throw error;

  console.log('[Kethama] New contact message (not yet saved to a backend):', data);
  return new Promise(resolve => setTimeout(resolve, 500));
}

/* ---------------------------------------------------------
   7. UI POLISH
   --------------------------------------------------------- */

// navbar background on scroll
const navbar = document.getElementById('navbar');
document.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// tilt / parallax on service cards (mouse-based)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function attachTilt(card){
  if(prefersReducedMotion) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
  });
}
document.querySelectorAll('[data-tilt]').forEach(attachTilt);

// scroll-based parallax for decorative elements (blobs, seal)
function updateParallax(){
  if(prefersReducedMotion) return;
  const activeView = document.querySelector('.view.active');
  if(!activeView) return;
  const scrollY = window.scrollY;
  activeView.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}
document.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();
