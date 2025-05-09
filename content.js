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

// Helper: true ⇢ anchor href includes "/company/" or has company-like structure
function isCompanyActor(postRoot) {
  // Check for company link
  const actorLink = postRoot.querySelector('a[href*="/company/"]');
  if (actorLink) return true;

  // Check for actor title structure
  const actorTitle = postRoot.querySelector('.update-components-actor__title');
  if (actorTitle) {
    // Check if it has company-like indicators
    const titleText = actorTitle.textContent.toLowerCase();
    const companyIndicators = ['inc', 'ltd', 'llc', 'corp', 'company', 'enterprises', 'group', 'holdings'];
    
    // Check for verified badge
    const hasVerifiedBadge = actorTitle.querySelector('.text-view-model__verified-icon') !== null;
    
    // Check for premium badge
    const hasPremiumBadge = actorTitle.querySelector('.text-view-model__linkedin-bug-premium-v2') !== null;
    
    // Check for supplementary info that might indicate company
    const supplementaryInfo = actorTitle.querySelector('.update-components-actor__supplementary-actor-info');
    const hasSupplementaryInfo = supplementaryInfo !== null;
    
    // Check for description that might indicate company
    const description = postRoot.querySelector('.update-components-actor__description');
    const hasDescription = description !== null;
    
    return companyIndicators.some(indicator => titleText.includes(indicator)) || 
           hasVerifiedBadge || 
           hasPremiumBadge || 
           hasSupplementaryInfo ||
           hasDescription;
  }

  return false;
}

// Helper: returns hype-count in main post content if available, else all text
function hypeScore(postRoot) {
  // Try to get the main post text, fallback to all text
  const mainText = postRoot.querySelector('.update-components-text, .feed-shared-inline-show-more-text')?.innerText?.toLowerCase();
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

// Helper: find the top-level post container
function findTopLevelPost(element) {
  // Look for common top-level post containers
  const topLevelSelectors = [
    'div.feed-shared-update-v2',
    'div[data-urn^="urn:li:activity:"]',
    'div.fie-impression-container'
  ];
  
  // Check if current element is a top-level container
  if (topLevelSelectors.some(selector => element.matches(selector))) {
    return element;
  }
  
  // Check parent elements
  let parent = element.parentElement;
  while (parent) {
    if (topLevelSelectors.some(selector => parent.matches(selector))) {
      return parent;
    }
    parent = parent.parentElement;
  }
  
  return element; // Fallback to original element if no top-level container found
}

// Inject badge top-right of post
function tagPost(postRoot, hypeScore, cringeScore) {
  // Find the top-level post container
  const topLevelPost = findTopLevelPost(postRoot);
  
  // prevent duplicate tagging by checking the top-level container
  if (topLevelPost.querySelector(".hype-badge")) return;

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
  
  topLevelPost.style.position = "relative";
  topLevelPost.appendChild(badge);

  // Apply blur effect if total score is over 1
  if (totalScore > 1) {
    const content = topLevelPost.querySelector('.update-components-text, .feed-shared-inline-show-more-text') || topLevelPost;
    content.classList.add('hype-blur');
  }
}

// Main scan
function scanPost(postRoot) {
  // Find the top-level post container
  const topLevelPost = findTopLevelPost(postRoot);
  
  // Skip if we've already processed this post
  if (topLevelPost.querySelector(".hype-badge")) return;
  
  if (!isCompanyActor(topLevelPost)) return;        // skip personal posts
  const hype = hypeScore(topLevelPost);
  const cringe = detectCringeBait(topLevelPost);
  tagPost(topLevelPost, hype, cringe);
}

// Broadened selector to catch more post types
const postSelector = [
  'div.feed-shared-update-v2',
  'div[data-urn^="urn:li:activity:"]',
  'div.update-components-text.relative.update-components-update-v2__commentary',
  'div.feed-shared-inline-show-more-text',
  'div.feed-shared-update-v2__control-menu-container',
  'div[class*="update-components-actor"]',  // Match any element with update-components-actor in class
  'div[class*="feed-shared"]',             // Match any feed-shared elements
  'div[class*="update-components"]',       // Match any update-components elements
  'div[class*="BFyLjthMMnayexUrBYClsFbsEDtmkg"]',  // Match the specific actor class
  'div.fie-impression-container',          // Match impression container
  'div.update-components-header',          // Match header components
  'div.feed-shared-inline-show-more-text__see-more-less-toggle'  // Match show more/less toggle
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
