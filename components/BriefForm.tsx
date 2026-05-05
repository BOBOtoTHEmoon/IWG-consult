"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Building2,
  Sofa,
  Baby,
  Shirt,
  Gift,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  business: "https://buy.stripe.com/28E7sLgTr2kl53V9XidfG0a",
  home: "https://buy.stripe.com/9B6eVdeLjf770NF1qMdfG09",
  baby: "https://buy.stripe.com/00w3cv5aJe33gMD7PadfG08",
  souvenirs: "https://buy.stripe.com/5kQcN56eN9MNfIzd9udfG07",
  wardrobe: "https://buy.stripe.com/00w9AT5aJ4st0NF6L6dfG06",
  unsure: "", // No payment redirect — they're just exploring
};
const packages = [
  { id: "business", name: "Sourcing for Business", icon: Building2, fee: "£250" },
  { id: "home", name: "Home & Décor", icon: Sofa, fee: "£300" },
  { id: "baby", name: "Expecting Mum", icon: Baby, fee: "£180" },
  { id: "souvenirs", name: "Souvenirs & Gifting", icon: Gift, fee: "£150" },
  { id: "wardrobe", name: "Wardrobe & Accessories", icon: Shirt, fee: "£150" },
  { id: "unsure", name: "Not sure yet", icon: FileText, fee: "We'll advise" },
];

const budgetOptions = [
  "Under £1,000",
  "£1,000 – £5,000",
  "£5,000 – £25,000",
  "£25,000 – £100,000",
  "Over £100,000",
];

const timelineOptions = [
  "ASAP (rush)",
  "Within 1 month",
  "1–3 months",
  "3+ months",
  "Flexible",
];

type StoredFile = {
  id: string;
  file: File;
  preview: string | null;
};

export default function BriefForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    packageId: "",
    productDescription: "",
    quantity: "",
    budget: "",
    timeline: "",
    deliveryCountry: "",
    notes: "",
  });

  const [files, setFiles] = useState<StoredFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  // Validation per step
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = "Please enter your name";
      if (!form.email.trim()) e.email = "Please enter your email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email";
    }
    if (s === 1) {
      if (!form.packageId) e.packageId = "Please pick a package";
      if (!form.productDescription.trim())
        e.productDescription = "Tell us what you want to source";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // File handling
  const handleFiles = useCallback((newFiles: FileList) => {
    const valid: StoredFile[] = [];
    const fileErrors: string[] = [];

    Array.from(newFiles).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        fileErrors.push(`${file.name} is over ${MAX_FILE_SIZE_MB}MB`);
        return;
      }
      const isImage = file.type.startsWith("image/");
      valid.push({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        preview: isImage ? URL.createObjectURL(file) : null,
      });
    });

    if (fileErrors.length) {
      setErrors((e) => ({ ...e, files: fileErrors.join(", ") }));
    } else {
      setErrors((e) => ({ ...e, files: "" }));
    }

    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("files", f.file));

      const res = await fetch("/api/submit-brief", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Submit error response:", data);
        throw new Error(
          data.error ||
            data.message ||
            `Submission failed (status ${res.status})`
        );
      }

      setSubmitting(false);
      setSubmitted(true);

      // Redirect to Stripe Payment Link after 2.5s
      const paymentUrl = STRIPE_PAYMENT_LINKS[form.packageId];
      if (paymentUrl) {
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 2500);
      }
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        (err as Error).message ||
          "Something went wrong. Please try again or email us directly."
      );
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // Success state
  if (submitted) {
    return (
      <section className="pt-32 lg:pt-40 pb-20 lg:pb-28 min-h-[80svh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-16 rounded-full bg-[var(--color-ochre)] grid place-items-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-7 h-7 text-[var(--color-cream)]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl lg:text-6xl tracking-[-0.025em] leading-[1] mb-5"
          >
            Brief received,{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              {form.fullName.split(" ")[0] || "thanks"}
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-[var(--color-ink-soft)] text-base leading-relaxed mb-10 max-w-md mx-auto"
          >
            We've got your details and we'll come back with first supplier matches
            inside 3-5 working days.
            {STRIPE_PAYMENT_LINKS[form.packageId] ? (
              <>
                {" "}
                Redirecting you to secure payment for the sourcing fee in a few
                seconds...
              </>
            ) : (
              <>
                {" "}
                Check your inbox at{" "}
                <span className="text-[var(--color-ink)]">{form.email}</span>{" "}
                for a confirmation.
              </>
            )}
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
          >
            Back to home
          </motion.a>
        </div>
      </section>
    );
  }

  const stepLabels = ["Your details", "What you're sourcing", "References"];

  return (
    <section className="pt-32 lg:pt-36 pb-16 lg:pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
            Sourcing brief
          </p>
          <h1 className="text-4xl lg:text-6xl tracking-[-0.025em] leading-[1] mb-5">
            Tell us what you need to{" "}
            <span className="text-[var(--color-ochre)] font-medium">source</span>.
          </h1>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed max-w-xl mx-auto">
            Three short steps. Takes under three minutes. We'll come back with
            first supplier matches inside ten working days.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-2.5 flex-1 last:flex-none"
              >
                <div
                  className={`w-7 h-7 rounded-full grid place-items-center text-[11px] number-display transition-all duration-500 ${
                    i < step
                      ? "bg-[var(--color-ochre)] text-[var(--color-cream)]"
                      : i === step
                      ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                      : "bg-[var(--color-cream-dark)] text-[var(--color-stone)]"
                  }`}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`hidden sm:block text-[12px] tracking-wide transition-colors duration-500 ${
                    i <= step
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-stone)]"
                  }`}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className="flex-1 h-px bg-[var(--color-line)] mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-2xl p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {/* STEP 0 — Details */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <Field
                  label="Full name"
                  required
                  error={errors.fullName}
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder="Jane Doe"
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  error={errors.email}
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="jane@company.com"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    placeholder="+44 7000 000000"
                  />
                  <Field
                    label="Company (optional)"
                    value={form.company}
                    onChange={(v) => update("company", v)}
                    placeholder="Acme Imports Ltd"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 1 — Sourcing details */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Package picker */}
                <div>
                  <label className="block text-[12px] tracking-wide text-[var(--color-ink-soft)] mb-3">
                    Which package fits? <span className="text-[var(--color-ochre)]">*</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {packages.map((p) => {
                      const isSelected = form.packageId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => update("packageId", p.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                            isSelected
                              ? "border-[var(--color-ochre)] bg-[var(--color-ochre)]/[0.04] ring-1 ring-[var(--color-ochre)]"
                              : "border-[var(--color-line)] bg-[var(--color-cream)] hover:border-[var(--color-ink)]/30"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full grid place-items-center shrink-0 transition-colors duration-300 ${
                              isSelected
                                ? "bg-[var(--color-ochre)] text-[var(--color-cream)]"
                                : "bg-[var(--color-cream-dark)] text-[var(--color-ink)]"
                            }`}
                          >
                            <p.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-ink)] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[var(--color-stone)]">
                              {p.fee}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.packageId && (
                    <p className="text-xs text-red-600 mt-2">{errors.packageId}</p>
                  )}
                </div>

                {/* Product description */}
                <Field
                  label="What do you want to source?"
                  required
                  error={errors.productDescription}
                  textarea
                  value={form.productDescription}
                  onChange={(v) => update("productDescription", v)}
                  placeholder="e.g. 500 units of branded canvas tote bags, natural cotton, with single-color screen print logo"
                />

                <div className="grid sm:grid-cols-2 gap-5">
                  <SelectField
                    label="Estimated budget"
                    value={form.budget}
                    onChange={(v) => update("budget", v)}
                    options={budgetOptions}
                    placeholder="Pick a range"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <SelectField
                    label="Delivery timeline"
                    value={form.timeline}
                    onChange={(v) => update("timeline", v)}
                    options={timelineOptions}
                    placeholder="When do you need it?"
                  />
                  <Field
                    label="Delivery country"
                    value={form.deliveryCountry}
                    onChange={(v) => update("deliveryCountry", v)}
                    placeholder="United Kingdom"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2 — References & files */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* File upload */}
                <div>
                  <label className="block text-[12px] tracking-wide text-[var(--color-ink-soft)] mb-3">
                    Reference photos or files (optional)
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      dragActive
                        ? "border-[var(--color-ochre)] bg-[var(--color-ochre)]/[0.04]"
                        : "border-[var(--color-line)] bg-[var(--color-cream)] hover:border-[var(--color-ink)]/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files) handleFiles(e.target.files);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[var(--color-ochre)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-ink)] mb-1">
                      Drag & drop, or{" "}
                      <span className="text-[var(--color-ochre)] underline">
                        browse files
                      </span>
                    </p>
                    <p className="text-[11px] text-[var(--color-stone)]">
                      Images, PDFs, Word, Excel · Max {MAX_FILE_SIZE_MB}MB per file
                    </p>
                  </div>

                  {errors.files && (
                    <p className="text-xs text-red-600 mt-2">{errors.files}</p>
                  )}

                  {/* File list */}
                  {files.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {files.map((f) => (
                        <motion.li
                          key={f.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--color-cream)] border border-[var(--color-line)]"
                        >
                          {f.preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={f.preview}
                              alt=""
                              className="w-10 h-10 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-[var(--color-cream-dark)] grid place-items-center shrink-0">
                              <FileText className="w-4 h-4 text-[var(--color-ochre)]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-ink)] truncate">
                              {f.file.name}
                            </p>
                            <p className="text-[11px] text-[var(--color-stone)]">
                              {formatBytes(f.file.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            className="w-7 h-7 rounded-full grid place-items-center text-[var(--color-stone)] hover:bg-[var(--color-cream-dark)] hover:text-[var(--color-ink)] transition-colors"
                            aria-label="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                <Field
                  label="Anything else we should know?"
                  textarea
                  value={form.notes}
                  onChange={(v) => update("notes", v)}
                  placeholder="Material preferences, certifications required, packaging needs, branding details..."
                />
              </motion.div>
            )}
          </AnimatePresence>

         {/* Submission error */}
          {submitError && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-10 pt-6 border-t border-[var(--color-line)] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm tracking-wide transition-all duration-300 ${
                step === 0
                  ? "opacity-0 pointer-events-none"
                  : "border border-[var(--color-ink)]/20 text-[var(--color-ink)] hover:bg-[var(--color-cream-dark)]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
              >
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ochre)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre-deep)] disabled:opacity-60 transition-colors duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Submit brief
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-[var(--color-stone)] mt-6">
          Your details are confidential and never shared with anyone outside the
          IWG team.
        </p>
      </div>
    </section>
  );
}

/* ===== Sub-components ===== */

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  textarea,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] tracking-wide text-[var(--color-ink-soft)] mb-2">
        {label} {required && <span className="text-[var(--color-ochre)]">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--color-cream)] border text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ochre)]/40 focus:border-[var(--color-ochre)] transition-all duration-300 resize-none ${
            error
              ? "border-red-400 ring-1 ring-red-200"
              : "border-[var(--color-line)]"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--color-cream)] border text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ochre)]/40 focus:border-[var(--color-ochre)] transition-all duration-300 ${
            error
              ? "border-red-400 ring-1 ring-red-200"
              : "border-[var(--color-line)]"
          }`}
        />
      )}
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] tracking-wide text-[var(--color-ink-soft)] mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-[var(--color-cream)] border border-[var(--color-line)] text-[14px] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ochre)]/40 focus:border-[var(--color-ochre)] transition-all duration-300 appearance-none bg-no-repeat bg-[right_12px_center]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%238a8579' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        }}
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}