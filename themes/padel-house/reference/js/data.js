/**
 * Padel House: mock data for demo purposes only.
 * All names, figures, and identifiers are fictional.
 */

const PH_DATA = {
  company: {
    name: "Padel House",
    country: { es: "República Dominicana", en: "Dominican Republic" },
    currency: "RD$",
    stores: ["Piantini", "Naco", "Santiago", "Bávaro"],
  },

  executive: {
    kpis: [
      { id: "revenueMtd", value: "RD$ 4.82M", trend: "+18.4%", direction: "up" },
      { id: "activeMembers", value: "2,847", trend: "+12.1%", direction: "up" },
      { id: "inventoryTurn", value: "4.2x", trend: "+0.6", direction: "up" },
      { id: "avgTicket", value: "RD$ 8,450", trend: "+5.2%", direction: "up" },
    ],
    revenueTrend: [3200000, 3450000, 3680000, 3920000, 4100000, 4380000, 4820000],
    storePerformance: [1680000, 1240000, 980000, 920000],
    categoryMix: { keys: ["rackets", "footwear", "apparel", "balls", "accessories"], values: [38, 22, 18, 12, 10] },
    insights: [
      { id: "premiumRackets", icon: "📈", type: "green" },
      { id: "touristSeason", icon: "⚡", type: "lime" },
      { id: "restockSizes", icon: "📦", type: "coral" },
      { id: "loyaltyConversion", icon: "🎯", type: "blue" },
    ],
    activity: ["a1", "a2", "a3", "a4"],
  },

  customers: {
    kpis: [
      { id: "active90", value: "6,214", trend: "+9.8%", direction: "up" },
      { id: "ltv", value: "RD$ 42,800", trend: "+14.2%", direction: "up" },
      { id: "retention", value: "68%", trend: "+3.1pp", direction: "up" },
      { id: "nps", value: "72", trend: "+5", direction: "up" },
    ],
    segments: { keys: ["competitive", "recreational", "beginner", "corporate", "tourist"], values: [28, 34, 18, 12, 8] },
    acquisition: { keys: ["referrals", "instagram", "clubs", "walkin", "whatsapp", "events"], values: [32, 24, 18, 14, 8, 4] },
    retention: [58, 59, 61, 62, 64, 66, 68],
    cities: [
      { key: "santoDomingo", pct: 52, customers: 3231 },
      { key: "santiago", pct: 24, customers: 1491 },
      { key: "puntaCana", pct: 14, customers: 870 },
      { key: "other", pct: 10, customers: 622 },
    ],
    topCustomers: [
      { initials: "MR", name: "María R.", city: "Piantini", tier: "Platinum", ltv: "RD$ 186,400", visits: 28, lastVisit: { es: "28 jun", en: "Jun 28" } },
      { initials: "JL", name: "José L.", city: "Santiago", tier: "Gold", ltv: "RD$ 142,200", visits: 22, lastVisit: { es: "30 jun", en: "Jun 30" } },
      { initials: "AC", name: "Ana C.", city: "Naco", tier: "Gold", ltv: "RD$ 128,900", visits: 19, lastVisit: { es: "1 jul", en: "Jul 1" } },
      { initials: "DP", name: "Diego P.", city: "Bávaro", tier: "Silver", ltv: "RD$ 98,600", visits: 14, lastVisit: { es: "29 jun", en: "Jun 29" } },
      { initials: "LF", name: "Laura F.", city: "Piantini", tier: "Silver", ltv: "RD$ 87,300", visits: 16, lastVisit: { es: "27 jun", en: "Jun 27" } },
    ],
  },

  inventory: {
    kpis: [
      { id: "activeSkus", value: "1,248", trend: "+86", direction: "up" },
      { id: "stockValue", value: "RD$ 12.4M", trend: "-2.1%", direction: "down" },
      { id: "coverage", value: "38", trend: "-4", direction: "up", trendSuffix: { es: " dias", en: " days" } },
      { id: "fillRate", value: "94.2%", trend: "+1.8pp", direction: "up" },
    ],
    categories: {
      keys: ["rackets", "footwear", "apparel", "balls", "accessories", "protection"],
      stock: [420, 680, 540, 890, 1120, 310],
      turnover: [5.2, 3.8, 4.1, 6.8, 5.5, 3.2],
    },
    alerts: [
      { sku: "BP-Vertex-04", product: "Bullpadel Vertex 04", store: "Santiago", qty: 3, status: "critical", daysLeft: 4 },
      { sku: "NX-AT10-Pro", product: "Nox AT10 Pro Cup", store: "Naco", qty: 5, status: "warning", daysLeft: 8 },
      { sku: "HD-Delta-Pro", product: "Head Delta Pro", store: "Piantini", qty: 4, status: "warning", daysLeft: 7 },
      { sku: "AS-Bela-V3", product: "Adidas Metalbone 3.3", store: "Bávaro", qty: 2, status: "critical", daysLeft: 3 },
      { sku: "WL-Pro-Overgrip", product: "Wilson Pro Overgrip (12pk)", store: "Santiago", qty: 18, status: "warning", daysLeft: 9 },
    ],
    topSKUs: [
      { rank: 1, product: "Bullpadel Vertex 04", categoryKey: "rackets", sold: 142, margin: "42%", stock: 28 },
      { rank: 2, product: "Nox AT10 Pro Cup", categoryKey: "rackets", sold: 118, margin: "39%", stock: 22 },
      { rank: 3, product: "Head Pro S+", categoryKey: "balls", sold: 890, margin: "28%", stock: 340 },
      { rank: 4, product: "Bullpadel Hack 04", categoryKey: "rackets", sold: 96, margin: "41%", stock: 19 },
      { rank: 5, product: "Wilson Kaos Swift", categoryKey: "footwear", sold: 84, margin: "35%", stock: 31 },
    ],
    warehouse: [
      { location: "Piantini", units: 4280, value: "RD$ 4.1M", coverage: 35 },
      { location: "Naco", units: 3120, value: "RD$ 2.9M", coverage: 41 },
      { location: "Santiago", units: 2890, value: "RD$ 2.6M", coverage: 33 },
      { location: "Bávaro", units: 2640, value: "RD$ 2.8M", coverage: 44 },
    ],
  },

  sales: {
    kpis: [
      { id: "ytd", value: "RD$ 28.6M", trend: "+22.3%", direction: "up" },
      { id: "transactions", value: "18,420", trend: "+16.7%", direction: "up" },
      { id: "conversion", value: "34.8%", trend: "+2.4pp", direction: "up" },
      { id: "grossMargin", value: "38.6%", trend: "+1.2pp", direction: "up" },
    ],
    monthly: {
      current: [3200000, 3450000, 3680000, 3920000, 4100000, 4380000, 4820000],
      previous: [2680000, 2810000, 3020000, 3180000, 3290000, 3520000, 3680000],
    },
    byCategory: {
      keys: ["rackets", "footwear", "apparel", "balls", "accessories"],
      values: [10868000, 6292000, 5148000, 3432000, 2860000],
    },
    byStore: [9980000, 7360000, 5820000, 5460000],
    topProducts: [
      { product: "Bullpadel Vertex 04", revenue: "RD$ 2.14M", units: 142, growth: "+28%" },
      { product: "Nox AT10 Pro Cup", revenue: "RD$ 1.86M", units: 118, growth: "+22%" },
      { product: "Head Pro S+ (3-pack)", revenue: "RD$ 890K", units: 890, growth: "+18%" },
      { product: "Wilson Kaos Swift", revenue: "RD$ 720K", units: 84, growth: "+31%" },
      { product: "Bullpadel Hack 04", revenue: "RD$ 680K", units: 96, growth: "+15%" },
    ],
    team: [
      { name: "Carlos M.", store: "Piantini", sales: "RD$ 1.42M", target: 92, deals: 186 },
      { name: "Patricia S.", store: "Naco", sales: "RD$ 1.18M", target: 88, deals: 164 },
      { name: "Roberto H.", store: "Santiago", sales: "RD$ 980K", target: 95, deals: 142 },
      { name: "Sofía V.", store: "Bávaro", sales: "RD$ 920K", target: 86, deals: 138 },
      { name: "Miguel A.", store: "Piantini", sales: "RD$ 890K", target: 84, deals: 128 },
    ],
  },

  loyalty: {
    kpis: [
      { id: "totalMembers", value: "4,620", trend: "+18.6%", direction: "up" },
      { id: "pointsIssued", value: "842K", trend: "+24%", direction: "up" },
      { id: "redeemRate", value: "41%", trend: "+6pp", direction: "up" },
      { id: "loyaltyRevenue", value: "RD$ 1.8M", trend: "+32%", direction: "up" },
    ],
    tiers: [
      { id: "bronze", name: "Bronze", icon: "🥉", count: 1848, pct: 40 },
      { id: "silver", name: "Silver", icon: "🥈", count: 1386, pct: 30 },
      { id: "gold", name: "Gold", icon: "🥇", count: 924, pct: 20 },
      { id: "platinum", name: "Platinum", icon: "💎", count: 462, pct: 10 },
    ],
    pointsTrend: {
      issued: [520000, 580000, 610000, 640000, 690000, 740000, 842000],
      redeemed: [180000, 210000, 230000, 250000, 280000, 310000, 345000],
    },
    engagement: { keys: ["purchases", "events", "referrals", "surveys", "app"], values: [45, 22, 18, 8, 7] },
    rewards: [
      { id: "r1", points: 500, redemptions: 342, tier: "Bronze" },
      { id: "r2", points: 1200, redemptions: 186, tier: "Silver" },
      { id: "r3", points: 800, redemptions: 264, tier: "Silver" },
      { id: "r4", points: 2000, redemptions: 98, tier: "Gold" },
      { id: "r5", points: 3500, redemptions: 42, tier: "Platinum" },
    ],
  },

  growth: {
    kpis: [
      { id: "pipeline", value: "RD$ 6.2M", trend: "+3", direction: "up", trendSuffix: { es: " nuevas", en: " new" } },
      { id: "market", value: "+34%", trend: "CAGR 3yr", direction: "neutral" },
      { id: "loyaltyPen", value: "38%", trend: "+8pp YTD", direction: "up" },
      { id: "roi", value: "4.8x", trend: "+0.9", direction: "up" },
    ],
    scenarios: [
      { id: "conservative", revenue: "RD$ 52M", growth: "+18%" },
      { id: "base", revenue: "RD$ 58M", growth: "+28%" },
      { id: "aggressive", revenue: "RD$ 68M", growth: "+42%" },
    ],
    opportunities: [
      { id: "o1", impact: "RD$ 4.2M/yr", priority: "high", confidence: 82, timeline: "Q1 2027" },
      { id: "o2", impact: "RD$ 2.8M/yr", priority: "high", confidence: 76, timeline: "Q4 2026" },
      { id: "o3", impact: "RD$ 3.1M/yr", priority: "medium", confidence: 71, timeline: "Q3 2026" },
      { id: "o4", impact: "RD$ 1.4M/yr", priority: "medium", confidence: 65, timeline: "Q2 2027" },
      { id: "o5", impact: "RD$ 680K/yr", priority: "low", confidence: 58, timeline: "Dec 2026" },
    ],
    marketTrend: {
      labels: ["2022", "2023", "2024", "2025", "2026E", "2027E"],
      players: [12000, 16800, 23400, 31200, 41800, 56000],
      revenue: [18000000, 24800000, 34200000, 44600000, 58000000, 72000000],
    },
    expansion: [
      { city: "La Romana", clubs: 6, population: "280K", score: 87, statusKey: "evaluation" },
      { city: "San Pedro de Macorís", clubs: 4, population: "210K", score: 72, statusKey: "research" },
      { city: "Puerto Plata", clubs: 3, population: "165K", score: 68, statusKey: "research" },
      { city: "La Vega", clubs: 5, population: "245K", score: 74, statusKey: "watchlist" },
    ],
  },

  products: [
    { id: "p1", icon: "🎾", name: "Bullpadel Vertex 04", categoryKey: "rackets", price: 15900, stock: 24, health: "good", tags: ["bestseller"], pairsWith: ["p10", "p9", "p12"] },
    { id: "p2", icon: "🎾", name: "Nox AT10 Genius 18K", categoryKey: "rackets", price: 17500, stock: 8, health: "low", tags: ["featured"], pairsWith: ["p10", "p12"] },
    { id: "p3", icon: "🎾", name: "Babolat Air Veron", categoryKey: "rackets", price: 14200, stock: 18, health: "good", tags: ["new"], pairsWith: ["p10", "p9"] },
    { id: "p4", icon: "🎾", name: "Head Extreme One", categoryKey: "rackets", price: 13800, stock: 6, health: "low", tags: [], pairsWith: ["p10", "p12"] },
    { id: "p5", icon: "👟", name: "Asics Gel-Padel Pro 5", categoryKey: "footwear", price: 7800, stock: 32, health: "good", tags: ["bestseller"], pairsWith: ["p7", "p9"] },
    { id: "p6", icon: "👟", name: "Babolat Jet Premura 2", categoryKey: "footwear", price: 8900, stock: 12, health: "good", tags: ["new"], pairsWith: ["p7", "p9"] },
    { id: "p7", icon: "👕", name: "Padel House Pro Tee", categoryKey: "apparel", price: 1950, stock: 60, health: "good", tags: ["featured"], pairsWith: ["p8", "p5"] },
    { id: "p8", icon: "🧥", name: "Padel House Hoodie Club", categoryKey: "apparel", price: 3400, stock: 25, health: "good", tags: ["new"], pairsWith: ["p7"] },
    { id: "p9", icon: "🟡", name: "Head Padel Pro S x3", categoryKey: "balls", price: 495, stock: 140, health: "good", tags: ["bestseller"], pairsWith: ["p1", "p10"] },
    { id: "p10", icon: "🧤", name: "Overgrip Wilson Pro x3", categoryKey: "accessories", price: 650, stock: 9, health: "critical", tags: ["bestseller"], pairsWith: ["p9", "p12"] },
    { id: "p11", icon: "🎒", name: "Padel House Mochila Tour", categoryKey: "accessories", price: 2900, stock: 20, health: "good", tags: ["featured"], pairsWith: ["p9", "p7"] },
    { id: "p12", icon: "🛡️", name: "Protector de Pala Nox", categoryKey: "protection", price: 380, stock: 45, health: "good", tags: [], pairsWith: ["p10"] },
  ],

  posCustomers: [
    { id: "walkin", initials: "PH", tier: null },
    { id: "c1", name: "María R.", initials: "MR", tier: "Platinum", benefitPct: 20 },
    { id: "c2", name: "José L.", initials: "JL", tier: "Gold", benefitPct: 15 },
    { id: "c3", name: "Diego P.", initials: "DP", tier: "Silver", benefitPct: 10 },
  ],
};
