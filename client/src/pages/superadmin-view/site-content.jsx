import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSiteConfigAdmin,
  updateSiteConfig,
  resetSiteConfig,
} from "@/store/siteconfig-slice";
import {
  Settings,
  Sparkles,
  Tag,
  ShoppingBag,
  Zap,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

// ─── tiny helpers ───────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5"
        style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            <Icon className="w-4 h-4" style={{ color: "#f59e0b" }} />
          </div>
          <span className="text-base font-semibold text-white">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
        )}
      </button>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      )}
    </div>
  );
}

function SaveResetBar({ onSave, onReset, saving }) {
  return (
    <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset to Default
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{
          background: saving ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #f59e0b, #d97706)",
          boxShadow: saving ? "none" : "0 4px 14px rgba(245,158,11,0.3)",
        }}
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function SiteContentPage() {
  const dispatch = useDispatch();
  const { config, isLoading } = useSelector((state) => state.siteconfig);

  // local draft states
  const [hero, setHero] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [cta, setCta] = useState(null);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    dispatch(fetchSiteConfigAdmin());
  }, [dispatch]);

  // Sync local state when config loads
  useEffect(() => {
    if (!config) return;
    setHero({ ...config.hero });
    setCategories(config.categories.map((c) => ({ ...c })));
    setBrands(config.brands.map((b) => ({ ...b })));
    setHighlights(config.highlights.map((h) => ({ ...h })));
    setCta({ ...config.cta });
  }, [config]);

  const save = async (key, value) => {
    setSaving((p) => ({ ...p, [key]: true }));
    const result = await dispatch(updateSiteConfig({ key, value }));
    setSaving((p) => ({ ...p, [key]: false }));
    if (updateSiteConfig.fulfilled.match(result)) {
      toast.success(`${key} saved!`);
    } else {
      toast.error(result.payload || "Failed to save");
    }
  };

  const reset = async (key) => {
    const result = await dispatch(resetSiteConfig(key));
    if (resetSiteConfig.fulfilled.match(result)) {
      toast.success(`${key} reset to default`);
      dispatch(fetchSiteConfigAdmin());
    } else {
      toast.error(result.payload || "Failed to reset");
    }
  };

  // Category helpers
  const updateCategory = (idx, field, val) =>
    setCategories((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  const addCategory = () =>
    setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, label: "", count: "" }]);
  const removeCategory = (idx) =>
    setCategories((prev) => prev.filter((_, i) => i !== idx));

  // Brand helpers
  const updateBrand = (idx, field, val) =>
    setBrands((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: val } : b)));
  const addBrand = () =>
    setBrands((prev) => [...prev, { id: `brand-${Date.now()}`, label: "", tagline: "" }]);
  const removeBrand = (idx) =>
    setBrands((prev) => prev.filter((_, i) => i !== idx));

  // Highlight helpers
  const updateHighlight = (idx, field, val) =>
    setHighlights((prev) => prev.map((h, i) => (i === idx ? { ...h, [field]: val } : h)));
  const addHighlight = () =>
    setHighlights((prev) => [...prev, { id: `hl-${Date.now()}`, label: "", desc: "" }]);
  const removeHighlight = (idx) =>
    setHighlights((prev) => prev.filter((_, i) => i !== idx));

  if (isLoading || !hero) {
    return (
      <div className="flex items-center justify-center py-24">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#f59e0b", borderRightColor: "rgba(245,158,11,0.3)" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-2">
        <Settings className="w-6 h-6" style={{ color: "#f59e0b" }} />
        <div>
          <h1 className="text-2xl font-bold text-white">Site Content</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Edit all text & labels shown on the shopping home page
          </p>
        </div>
      </div>

      {/* ── Hero Section ─────────────────────────────── */}
      <Section icon={Sparkles} title="Hero Banner Text">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Badge Label" value={hero.badge} onChange={(v) => setHero((p) => ({ ...p, badge: v }))} placeholder="New Season Sale" />
          <Field label="Title Line 1" value={hero.title} onChange={(v) => setHero((p) => ({ ...p, title: v }))} placeholder="Discover Your" />
          <Field label="Title Accent (gradient)" value={hero.titleAccent} onChange={(v) => setHero((p) => ({ ...p, titleAccent: v }))} placeholder="Signature Style" />
        </div>
        <Field label="Subtitle / Description" value={hero.subtitle} onChange={(v) => setHero((p) => ({ ...p, subtitle: v }))} multiline placeholder="Shop the latest trends..." />
        <SaveResetBar onSave={() => save("hero", hero)} onReset={() => reset("hero")} saving={saving.hero} />
      </Section>

      {/* ── Highlights Bar ───────────────────────────── */}
      <Section icon={Zap} title="Highlights Bar (3 feature strips)">
        <div className="space-y-3 mb-4">
          {highlights.map((h, idx) => (
            <div
              key={h.id}
              className="grid sm:grid-cols-3 gap-3 p-4 rounded-xl relative"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Field label="Label" value={h.label} onChange={(v) => updateHighlight(idx, "label", v)} placeholder="Flash Deals" />
              <Field label="Description" value={h.desc} onChange={(v) => updateHighlight(idx, "desc", v)} placeholder="Up to 70% off today" />
              <div className="flex items-end">
                <button
                  onClick={() => removeHighlight(idx)}
                  className="p-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addHighlight}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium mb-4"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus className="w-4 h-4" /> Add Highlight
        </button>
        <SaveResetBar onSave={() => save("highlights", highlights)} onReset={() => reset("highlights")} saving={saving.highlights} />
      </Section>

      {/* ── Categories ───────────────────────────────── */}
      <Section icon={Tag} title="Shop by Category Cards">
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          The category ID must match the product filter value (e.g. "men", "women", "kids", "accessories", "footwear").
        </p>
        <div className="space-y-3 mb-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="grid sm:grid-cols-4 gap-3 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Field label="ID (filter key)" value={cat.id} onChange={(v) => updateCategory(idx, "id", v)} placeholder="men" />
              <Field label="Display Label" value={cat.label} onChange={(v) => updateCategory(idx, "label", v)} placeholder="Men's Fashion" />
              <Field label="Item Count" value={cat.count} onChange={(v) => updateCategory(idx, "count", v)} placeholder="240+" />
              <div className="flex items-end">
                <button
                  onClick={() => removeCategory(idx)}
                  className="p-2.5 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium mb-4"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
        <SaveResetBar onSave={() => save("categories", categories)} onReset={() => reset("categories")} saving={saving.categories} />
      </Section>

      {/* ── Brands ───────────────────────────────────── */}
      <Section icon={ShoppingBag} title="Top Brands Cards">
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          The brand ID must match the product filter value (e.g. "nike", "adidas", "puma", "levi", "zara", "h&m").
        </p>
        <div className="space-y-3 mb-4">
          {brands.map((brand, idx) => (
            <div
              key={brand.id}
              className="grid sm:grid-cols-4 gap-3 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Field label="ID (filter key)" value={brand.id} onChange={(v) => updateBrand(idx, "id", v)} placeholder="nike" />
              <Field label="Display Label" value={brand.label} onChange={(v) => updateBrand(idx, "label", v)} placeholder="Nike" />
              <Field label="Tagline" value={brand.tagline} onChange={(v) => updateBrand(idx, "tagline", v)} placeholder="Just Do It" />
              <div className="flex items-end">
                <button
                  onClick={() => removeBrand(idx)}
                  className="p-2.5 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addBrand}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium mb-4"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
        <SaveResetBar onSave={() => save("brands", brands)} onReset={() => reset("brands")} saving={saving.brands} />
      </Section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <Section icon={Zap} title="CTA (Call-to-Action) Banner" defaultOpen={false}>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Badge Text" value={cta.badge} onChange={(v) => setCta((p) => ({ ...p, badge: v }))} placeholder="Limited Time Offer" />
          <Field label="Button Text" value={cta.buttonText} onChange={(v) => setCta((p) => ({ ...p, buttonText: v }))} placeholder="Shop the Collection" />
          <Field label="Headline" value={cta.title} onChange={(v) => setCta((p) => ({ ...p, title: v }))} placeholder="Get 20% Off Your First Purchase" />
        </div>
        <Field label="Description" value={cta.desc} onChange={(v) => setCta((p) => ({ ...p, desc: v }))} multiline placeholder="New to ShopVerse? Sign up and enjoy..." />
        <SaveResetBar onSave={() => save("cta", cta)} onReset={() => reset("cta")} saving={saving.cta} />
      </Section>
    </div>
  );
}

export default SiteContentPage;
