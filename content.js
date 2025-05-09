// --- CONFIG -------------------------------------------------
const HYPE_WORDS = [
  "AI-powered","revolutionary","next-gen","paradigm","synergy",
  "military-grade","cutting-edge","world-class","unprecedented",
  "transformative","enterprise-grade","turnkey","end-to-end",
  "disruptive","innovative","scalable","agile","blockchain",
  "cloud-native","data-driven","digital transformation","ecosystem",
  "empower","exponential","future-proof","game-changing","holistic",
  "hyper-automation","industry 4.0","machine learning","microservices",
  "omnichannel","platform","quantum","real-time","robust","seamless",
  "smart","sustainable","thought leadership","value proposition",
  "web3","zero-trust","artificial intelligence","big data","cybersecurity",
  "deep learning","edge computing","frictionless","growth hacking",
  "hyper-personalization","immersive","knowledge economy","low-code",
  "metaverse","neural network","optimization","predictive analytics",
  "quantum computing","resilient","trustless","visionary",
  "web-scale","experience","yield","zeitgeist","algorithm","biometrics",
  "cognitive","distributed","elastic","federated","generative","hybrid",
  "intelligent","just-in-time","key performance indicator","lean",
  "mission-critical","network effect","operational excellence",
  "performance-driven","quality assurance","responsive","serverless",
  "time-to-market","user-centric","virtualization","workflow",
  "accelerate","benchmark","competitive advantage","digital native",
  "efficiency","framework","governance","high-performance","insight",
  "journey","key differentiator","lifecycle","market leader",
  "next-level","optimize","process","quantifiable","revenue",
  "strategic","technology stack","unified","value chain","workforce",
  // Blockchain/Crypto/Web3 additions
  "cryptocurrency","crypto","token","tokens","NFT","NFTs","DeFi","DAO","DAOs",
  "staking","mining","airdrop","wallet","wallets","ledger","smart contract","smart contracts",
  "digital asset","digital assets","digital identity","decentralized","decentralization",
  "permissionless","immutable","transparency","traceability","supply chain","verification",
  "authentication","consensus","validator","proof of stake","proof of work","sharding",
  "on-chain","off-chain","mainnet","testnet","gas fees","digital ledger","distributed ledger",
  "tokenomics","protocol","interoperability","cross-chain","oracle","zk-rollup","L2","layer 2",
  "scalability","disrupting","revolutionizing","reshaping","future of finance","future of business",
  "eliminating middlemen","trust-based","digital ecosystem","fraud prevention","data integrity",
  "secure transactions","transparent transactions","automated agreements"
];

// New patterns for cringe-bait detection
const VULNERABILITY_PATTERNS = [
  "struggled with", "faced challenges", "wasn't easy", "had to learn", "failed at",
  "made mistakes", "wasn't perfect", "had doubts", "was scared", "felt lost",
  "didn't know", "wasn't sure", "had to overcome", "was difficult", "was hard",
  "wasn't simple", "had to figure out", "wasn't obvious", "had to adapt",
  "was challenging", "wasn't straightforward"
];

const HUMBLE_BRAG_PATTERNS = [
  "but now", "fast forward", "today we", "now we've", "we've achieved",
  "we've built", "we've created", "we've developed", "we've launched",
  "we've grown", "we've expanded", "we've reached", "we've secured",
  "we've partnered", "we've collaborated", "we've innovated",
  "we've transformed", "we've revolutionized", "we've disrupted",
  "we've scaled", "we've optimized", "we've automated"
];

const CTA_PATTERNS = [
  "what do you think?", "thoughts?", "agree?", "let me know",
  "share your experience", "comment below", "drop a comment",
  "would love to hear", "curious to know", "interested in",
  "reach out", "connect with me", "follow for more",
  "let's discuss", "let's connect", "let's talk",
  "would you like to", "are you ready to", "want to learn more"
];

const COLOR_SCALE = ["#8bc34a","#ffc107","#ff5722"];  // green→yellow→red
const OBSERVER_ROOT = document.body;                   // watch entire doc
// ------------------------------------------------------------

// Helper: true ⇢ anchor href includes "/company/"
function isCompanyActor(postRoot) {
  const actorLink = postRoot.querySelector('a[href*="/company/"]');
  return Boolean(actorLink);
}

// Helper: returns hype-count in main post content if available, else all text
function hypeScore(postRoot) {
  // Try to get the main post text, fallback to all text
  const mainText = postRoot.querySelector('.update-components-text')?.innerText?.toLowerCase();
  const text = mainText || postRoot.innerText.toLowerCase();
  return HYPE_WORDS.reduce(
    (count, w) => count + (text.includes(w.toLowerCase()) ? 1 : 0),
    0
  );
}

// New helper: detects cringe-bait pattern
function detectCringeBait(postRoot) {
  const mainText = postRoot.querySelector('.update-components-text')?.innerText?.toLowerCase();
  const text = mainText || postRoot.innerText.toLowerCase();
  
  let score = 0;
  let hasVulnerability = false;
  let hasHumbleBrag = false;
  let hasCTA = false;
  
  // Check for vulnerability pattern
  VULNERABILITY_PATTERNS.forEach(pattern => {
    if (text.includes(pattern)) {
      hasVulnerability = true;
      score += 1;
    }
  });
  
  // Check for humble brag pattern
  HUMBLE_BRAG_PATTERNS.forEach(pattern => {
    if (text.includes(pattern)) {
      hasHumbleBrag = true;
      score += 1;
    }
  });
  
  // Check for CTA pattern
  CTA_PATTERNS.forEach(pattern => {
    if (text.includes(pattern)) {
      hasCTA = true;
      score += 1;
    }
  });
  
  // Bonus points for having all three patterns
  if (hasVulnerability && hasHumbleBrag && hasCTA) {
    score += 2;
  }
  
  return score;
}

// Inject badge top-right of post
function tagPost(postRoot, hypeScore, cringeScore) {
  // prevent duplicate tagging
  if (postRoot.querySelector(".hype-badge")) return;

  const totalScore = hypeScore + cringeScore;
  const idx = Math.min(totalScore, COLOR_SCALE.length - 1);
  const badge = document.createElement("div");
  
  let badgeText = "";
  if (cringeScore >= 3) {
    badgeText = "Cringe-bait detected 🚫";
  } else if (hypeScore > 0) {
    badgeText = `Hype ${hypeScore}`;
  } else {
    badgeText = "Safe from hype ✅";
  }
  
  badge.textContent = badgeText;
  badge.className = "hype-badge";
  
  // Use our CSS class from content.css and add style properties directly 
  // for things that might change based on score
  badge.style.backgroundColor = COLOR_SCALE[idx];
  
  postRoot.style.position = "relative";
  postRoot.appendChild(badge);

  // Apply blur effect if total score is over 1
  if (totalScore > 1) {
    const content = postRoot.querySelector('.update-components-text') || postRoot;
    content.classList.add('hype-blur');
  }
}

// Main scan
function scanPost(postRoot) {
  if (!isCompanyActor(postRoot)) return;        // skip personal posts
  const hype = hypeScore(postRoot);
  const cringe = detectCringeBait(postRoot);
  tagPost(postRoot, hype, cringe);
}

// Broadened selector to catch more post types, including control menu container
const postSelector = [
  'div.feed-shared-update-v2',
  'div[data-urn^="urn:li:activity:"]',
  'div.update-components-update-v2__commentary',
  'div.feed-shared-inline-show-more-text',
  'div.feed-shared-update-v2__control-menu-container'
].join(', ');
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
