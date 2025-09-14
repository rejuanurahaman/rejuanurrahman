// Production-quality front-end interactions and GSAP powered animations.
(function(){
  'use strict';

  // Helper selectors
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Populate year
  qs('#year').textContent = new Date().getFullYear();

  // NAV TOGGLE for small screens
  const navToggle = qs('.nav-toggle');
  const navList = qs('#nav-list');
  if(navToggle){
    navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? '' : 'flex';
      navList.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Smooth scrolling for internal links
  document.addEventListener('click', e=>{
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close nav on mobile
        if(window.innerWidth < 980 && navList){ navList.style.display = ''; navToggle.setAttribute('aria-expanded', 'false'); }
      }
    }
  });

  // Contact form - very simple client-side behavior (replace with server in production)
  const form = qs('#contact-form');
  const status = qs('#form-status');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);
      // Basic validation
      if(!data.get('name') || !data.get('email') || !data.get('message')){
        status.className = '';
        status.textContent = 'Please complete all fields.';
        status.classList.add('sr-only');
        return;
      }
      // Show a temporary success state
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      setTimeout(()=>{
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        status.textContent = 'Message sent — thank you!';
        status.classList.remove('sr-only');
        form.reset();
      }, 900);
    });

    qs('#clear-btn').addEventListener('click', ()=>{ form.reset(); });
  }

  // Project modal interactions
  const modal = qs('#project-modal');
  const modalClose = qs('.modal-close');
  const modalTitle = qs('#modal-title');
  const modalBody = qs('#modal-body');

  function openModal(data){
    modalTitle.textContent = data.title;
    modalBody.textContent = data.body;
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-panel').focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
  }
  qsa('.project-cta').forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
      const card = btn.closest('.project-card');
      const title = card.querySelector('.project-title').textContent;
      const body = card.querySelector('.project-desc').textContent + ' — replace this summary with a detailed description, screenshots and links.';
      openModal({title, body});
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  // GSAP animations — hero, scroll-triggered fades
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);

    // hero entrance
    gsap.from('.headline', {y:30,opacity:0,duration:0.9,ease:'power3.out'});
    gsap.from('.lead',{y:18,opacity:0,duration:0.9,delay:0.15});
    gsap.from('.device-mock',{y:18,opacity:0,duration:0.9,delay:0.2});

    // staggered project reveal
    gsap.utils.toArray('.project-card').forEach((card, i)=>{
      gsap.from(card,{
        y:20,opacity:0,duration:0.8,delay:0.05*i, ease:'power2.out',
        scrollTrigger:{trigger:card, start:'top 85%'}
      });
    });

    // sections reveal
    gsap.utils.toArray('.section').forEach(section =>{
      gsap.from(section.querySelectorAll('h2, p, .project-card, .about-card, .skill'),{
        y:20, opacity:0, duration:0.7, stagger:0.08, ease:'power2.out',
        scrollTrigger:{trigger:section, start:'top 85%'}
      });
    });

    // subtle floating background animation
    gsap.to('.hero-bg-grad', {rotation:1, y:6, duration:8, repeat:-1, yoyo:true, ease:'sine.inOut'});
  }

  // Accessibility: set focus outline visible for keyboard users
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

})();
