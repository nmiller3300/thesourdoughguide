// ===== NAV =====
function toggleNav(){
  document.getElementById('mobileNav').classList.toggle('open');
}
document.querySelectorAll('.mobile-nav a').forEach(l=>l.addEventListener('click',()=>{
  document.getElementById('mobileNav').classList.remove('open');
}));

// Active nav link
const path = window.location.pathname;
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a=>{
  if(a.getAttribute('href') && path.includes(a.getAttribute('href').replace('.html',''))){
    a.classList.add('active');
  }
});

// ===== NEWSLETTER =====
function handleSubscribe(e){
  e.preventDefault();
  const btn=e.target.querySelector('button');
  const inp=e.target.querySelector('input');
  btn.textContent='Subscribed ✓';btn.style.background='#2D6A4F';
  inp.value='';inp.disabled=true;inp.placeholder="You're on the list!";
  setTimeout(()=>{btn.textContent='Subscribe';btn.style.background='';inp.disabled=false;inp.placeholder='Your email address'},4000);
}

// ===== STICKY HEADER =====
window.addEventListener('scroll',()=>{
  const h=document.querySelector('.site-nav');
  if(h) h.style.boxShadow=window.scrollY>10?'0 4px 20px rgba(44,26,14,.14)':'0 2px 10px rgba(44,26,14,.07)';
});

// ===== SCROLL FADE IN =====
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';obs.unobserve(e.target);}
  });
},{threshold:0.08});
document.querySelectorAll('.pc,.cat-card,.equip-card,.start-step').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(18px)';
  el.style.transition='opacity 0.45s ease, transform 0.45s ease';
  obs.observe(el);
});

// ===== POST LOADER =====
// Parses frontmatter from a markdown string
function parseFrontmatter(text){
  const match=text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!match) return {data:{},content:text};
  const data={};
  match[1].split('\n').forEach(line=>{
    const [key,...rest]=line.split(':');
    if(key) data[key.trim()]=rest.join(':').trim().replace(/^["']|["']$/g,'');
  });
  return {data,content:match[2]};
}

// Fetch all posts from the posts/ directory using the manifest
async function loadPosts(){
  try{
    const res=await fetch('/posts/manifest.json');
    if(!res.ok) return [];
    return await res.json();
  }catch(e){return [];}
}

// Format date nicely
function formatDate(str){
  if(!str) return '';
  const d=new Date(str);
  return d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
}

// Category color class
function catClass(cat){
  const map={beginner:'tag-beginner',recipe:'tag-recipe',troubleshooting:'tag-troubleshooting',equipment:'tag-equipment',advanced:'tag-advanced'};
  return map[cat]||'';
}

// Category bg for cards
function catBg(cat){
  const map={
    beginner:'linear-gradient(135deg,#1A3020,#2D5235)',
    recipe:'linear-gradient(135deg,#3D2C08,#6B5522)',
    troubleshooting:'linear-gradient(135deg,#3D0808,#6B2222)',
    equipment:'linear-gradient(135deg,#2A1E3D,#4A3568)',
    advanced:'linear-gradient(135deg,#083D2A,#226B4A)',
  };
  return map[cat]||'linear-gradient(135deg,#3D2008,#6B3F22)';
}

// Build a post card HTML
function buildPostCard(post){
  return `
  <article class="pc">
    <a href="/post.html?slug=${post.slug}" class="pc-img" style="background:${catBg(post.category)}">
      <span class="pc-tag">${post.category||'Post'}</span>
    </a>
    <div class="pc-body">
      <p class="pc-meta">${formatDate(post.date)}${post.readtime?' · '+post.readtime:''}</p>
      <h3><a href="/post.html?slug=${post.slug}">${post.title}</a></h3>
      <p>${post.excerpt||''}</p>
      <a href="/post.html?slug=${post.slug}" class="pc-link">Read More →</a>
    </div>
  </article>`;
}
