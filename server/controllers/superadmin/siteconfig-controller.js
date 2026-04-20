import prisma from "../../lib/prisma.js";

const DEFAULT_CONFIG = {
  hero: {
    badge: "New Season Sale",
    title: "Discover Your",
    titleAccent: "Signature Style",
    subtitle: "Shop the latest trends across fashion, accessories, footwear and more — all in one place.",
  },
  categories: [
    { id: "men",         label: "Men's Fashion",  count: "240+" },
    { id: "women",       label: "Women's Style",  count: "380+" },
    { id: "kids",        label: "Kids & Baby",    count: "120+" },
    { id: "accessories", label: "Accessories",    count: "95+"  },
    { id: "footwear",    label: "Footwear",       count: "160+" },
  ],
  brands: [
    { id: "nike",   label: "Nike",    tagline: "Just Do It"          },
    { id: "adidas", label: "Adidas",  tagline: "Impossible Is Nothing" },
    { id: "puma",   label: "Puma",    tagline: "Forever Faster"      },
    { id: "levi",   label: "Levi's",  tagline: "Quality Never Basic" },
    { id: "zara",   label: "Zara",    tagline: "Defining Trends"     },
    { id: "h&m",    label: "H&M",     tagline: "Fashion & Quality"   },
  ],
  highlights: [
    { id: "flash",   label: "Flash Deals",   desc: "Up to 70% off today"   },
    { id: "rated",   label: "Top Rated",     desc: "4.5+ star products"    },
    { id: "trending",label: "Trending Now",  desc: "What's hot this week"  },
  ],
  cta: {
    badge: "Limited Time Offer",
    title: "Get 20% Off Your First Purchase",
    desc: "New to ShopVerse? Sign up and enjoy an exclusive welcome discount on your first order.",
    buttonText: "Shop the Collection",
  },
};

// GET /api/superadmin/siteconfig
export const getSiteConfig = async (req, res) => {
  try {
    const keys = Object.keys(DEFAULT_CONFIG);
    const rows = await prisma.siteConfig.findMany({ where: { key: { in: keys } } });

    // Merge DB values over defaults
    const config = { ...DEFAULT_CONFIG };
    for (const row of rows) {
      config[row.key] = row.value;
    }

    res.json({ success: true, data: config });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Public version (no auth) — used by the shopping home
export const getSiteConfigPublic = async (req, res) => {
  try {
    const keys = Object.keys(DEFAULT_CONFIG);
    const rows = await prisma.siteConfig.findMany({ where: { key: { in: keys } } });
    const config = { ...DEFAULT_CONFIG };
    for (const row of rows) config[row.key] = row.value;
    res.json({ success: true, data: config });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/superadmin/siteconfig/:key
export const updateSiteConfig = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!Object.keys(DEFAULT_CONFIG).includes(key)) {
      return res.status(400).json({ success: false, message: "Invalid config key" });
    }

    const updated = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json({ success: true, data: updated, message: `Config '${key}' updated` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/superadmin/siteconfig/:key  — resets to default
export const resetSiteConfig = async (req, res) => {
  try {
    const { key } = req.params;
    await prisma.siteConfig.deleteMany({ where: { key } });
    res.json({ success: true, message: `Config '${key}' reset to default` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
