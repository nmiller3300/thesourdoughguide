function renderNav(activePage){
  return `
  <nav class="site-nav barnwood">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <div class="nav-badge">🌾</div>
        <div>
          <div class="nav-name">The Sourdough Guide</div>
          <div class="nav-tagline">From First Loaf to Mastery</div>
        </div>
      </a>
      <div class="nav-links">
        <a href="/beginner.html" ${activePage==='beginner'?'class="active"':''}>Start Here</a>
        <a href="/recipes.html" ${activePage==='recipes'?'class="active"':''}>Recipes</a>
        <a href="/troubleshooting.html" ${activePage==='troubleshooting'?'class="active"':''}>Troubleshooting</a>
        <a href="/equipment.html" ${activePage==='equipment'?'class="active"':''}>Equipment</a>
        <a href="/about.html" ${activePage==='about'?'class="active"':''}>About</a>
      </div>
      <button class="nav-toggle" onclick="toggleNav()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav barnwood" id="mobileNav">
      <a href="/beginner.html">Start Here</a>
      <a href="/recipes.html">Recipes</a>
      <a href="/troubleshooting.html">Troubleshooting</a>
      <a href="/equipment.html">Equipment</a>
      <a href="/about.html">About</a>
    </nav>
  </nav>
  <div class="rope"></div>`;
}

function renderFooter(){
  return `
  <div class="wood-bg">
    <div class="container">
      <section class="newsletter">
        <div class="nl-inner">
          <span class="nl-icon">✉</span>
          <h2>Get better at sourdough,<br>one email at a time.</h2>
          <p>New guides, troubleshooting tips, and seasonal recipes delivered to your inbox. No spam, ever.</p>
          <form class="nl-form" onsubmit="handleSubscribe(event)">
            <input type="email" placeholder="Your email address" required>
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  </div>
  <div class="rope"></div>
  <div class="barnwood">
    <div class="container">
      <footer class="site-footer">
        <div class="ft-grid">
          <div class="ft-brand">
            <div class="ft-logo-wrap"><div class="ft-badge">🌾</div><span class="ft-name">The Sourdough Guide</span></div>
            <p>Your complete resource for sourdough baking — from first starter to master loaf.</p>
          </div>
          <div class="ft-col"><h5>Learn</h5><a href="/beginner.html">Beginner's Guide</a><a href="/beginner.html">Starter Guide</a><a href="/recipes.html">Techniques</a></div>
          <div class="ft-col"><h5>Recipes</h5><a href="/recipes.html">All Recipes</a><a href="/recipes.html">Country Loaf</a><a href="/recipes.html">Discard Recipes</a></div>
          <div class="ft-col"><h5>Help</h5><a href="/troubleshooting.html">Troubleshooting</a><a href="/equipment.html">Equipment</a><a href="/about.html">About</a></div>
          <div class="ft-col"><h5>Legal</h5><a href="/privacy.html">Privacy Policy</a><a href="/affiliate.html">Affiliate Disclosure</a><a href="/terms.html">Terms</a></div>
        </div>
        <div class="ft-bottom">
          <p>© 2025 ThesourdoughGuide.com · All rights reserved</p>
          <p>Some links are affiliate links. We earn a small commission at no extra cost to you.</p>
        </div>
      </footer>
    </div>
  </div>`;
}
