
// Configuration
const HYPE_WORDS = [
  "AI-powered", "revolutionary", "next-gen", "paradigm", "synergy",
  "military-grade", "cutting-edge", "world-class", "unprecedented",
  "transformative", "enterprise-grade", "turnkey", "end-to-end"
];

const COLOR_SCALE = ["#8bc34a", "#ffc107", "#ff5722"];

// Helper functions
function isCompanyPost(postRoot) {
  const actorLink = postRoot.querySelector('a[href*="/company/"]');
  return Boolean(actorLink);
}

function calculateHypeScore(text) {
  const lowerText = text.toLowerCase();
  return HYPE_WORDS.reduce(
    (count, word) => count + (lowerText.includes(word.toLowerCase()) ? 1 : 0),
    0
  );
}

function getHypeColor(score) {
  const idx = Math.min(score, COLOR_SCALE.length - 1);
  return COLOR_SCALE[idx];
}

function addHypeBadge(postRoot, score) {
  // Prevent duplicate badges
  if (postRoot.querySelector('.hype-badge')) return;

  const color = getHypeColor(score);
  const badge = document.createElement('div');
  
  badge.className = 'hype-badge';
  badge.textContent = score ? `Hype ${score}` : 'Sane ✅';
  badge.style.backgroundColor = color;
  
  postRoot.style.position = 'relative';
  postRoot.appendChild(badge);
}

function scanPost(postRoot) {
  if (!isCompanyPost(postRoot)) return;
  
  const text = postRoot.innerText;
  const score = calculateHypeScore(text);
  if (score >= 0) {
    addHypeBadge(postRoot, score);
  }
}

// Watch for new posts (LinkedIn infinite scroll)
const postSelector = 'div.feed-shared-update-v2, div[data-urn^="urn:li:activity:"]';
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches && node.matches(postSelector)) scanPost(node);
      node.querySelectorAll?.(postSelector).forEach(scanPost);
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial scan of existing posts
document.querySelectorAll(postSelector).forEach(scanPost);
