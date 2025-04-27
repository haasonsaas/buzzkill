
// --- CONFIG -------------------------------------------------
const HYPE_WORDS = [
  "AI-powered","revolutionary","next-gen","paradigm","synergy",
  "military-grade","cutting-edge","world-class","unprecedented",
  "transformative","enterprise-grade","turnkey","end-to-end"
];
const COLOR_SCALE = ["#8bc34a","#ffc107","#ff5722"];  // green→yellow→red
const OBSERVER_ROOT = document.body;                   // watch entire doc
// ------------------------------------------------------------

// Helper: true ⇢ anchor href includes "/company/"
function isCompanyActor(postRoot) {
  const actorLink = postRoot.querySelector('a[href*="/company/"]');
  return Boolean(actorLink);
}

// Helper: returns hype-count in innerText
function hypeScore(postRoot) {
  const text = postRoot.innerText.toLowerCase();
  return HYPE_WORDS.reduce(
    (count, w) => count + (text.includes(w.toLowerCase()) ? 1 : 0),
    0
  );
}

// Inject badge top-right of post
function tagPost(postRoot, score) {
  // prevent duplicate tagging
  if (postRoot.querySelector(".hype-badge")) return;

  const idx = Math.min(score, COLOR_SCALE.length - 1);
  const badge = document.createElement("div");
  badge.textContent = score ? `Hype ${score}` : "Sane ✅";
  badge.className = "hype-badge";
  
  // Use our CSS class from content.css and add style properties directly 
  // for things that might change based on score
  badge.style.backgroundColor = COLOR_SCALE[idx];
  
  postRoot.style.position = "relative";
  postRoot.appendChild(badge);
}

// Main scan
function scanPost(postRoot) {
  if (!isCompanyActor(postRoot)) return;        // skip personal posts
  const score = hypeScore(postRoot);
  // Changed to include Sane badge for score 0
  tagPost(postRoot, score);
}

// Observe feed mutations (LinkedIn is infinite-scroll + SPA nav)
const postSelector = 'div.feed-shared-update-v2, div[data-urn^="urn:li:activity:"]';
const observer = new MutationObserver(mutations =>
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches && node.matches(postSelector)) scanPost(node);
      node.querySelectorAll?.(postSelector).forEach(scanPost);
    });
  })
);

observer.observe(OBSERVER_ROOT, { childList: true, subtree: true });

// First sweep on page load
document.querySelectorAll(postSelector).forEach(scanPost);
