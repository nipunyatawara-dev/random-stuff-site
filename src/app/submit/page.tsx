"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";
import {
  OtterLogo,
  MagneticButton,
  PolaroidCard,
  InlineBadge,
} from "@/components/studio";

const TOOL_NAME_MAX_LENGTH = 80;
const LINK_MAX_LENGTH = 500;
const DESCRIPTION_MAX_LENGTH = 500;

export default function SubmitPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [toolName, setToolName] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("Websites");
  const [description, setDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const body = {
      toolName: toolName.trim(),
      link: link.trim(),
      category: category.trim(),
      description: description.trim(),
      honeypot: honeypot.trim(),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage("");
    setToolName("");
    setLink("");
    setCategory("Websites");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#14334D] font-sans antialiased flex flex-col selection:bg-[#9DF71F] selection:text-[#14334D]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F0F2F5]/85 backdrop-blur-md border-b border-[#D6DCE1] px-4 md:px-8 py-3 select-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <OtterLogo size={32} />
            <span className="font-phudu font-bold text-lg text-[#14334D] tracking-tight">
              RANDOM STUFF
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-studio-button border border-white/80 text-xs font-semibold text-[#14334D] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#007BE5]" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Submit Workspace */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-10 md:p-12 shadow-studio-card border border-white/80 overflow-hidden">
          {/* Tagline Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F2F5] border border-[#D6DCE1] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#89E00F] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#304F68]/70">
              COMMUNITY CURATION // 100% FREE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-[#304F67] leading-[1.2] tracking-[-0.035em] mb-2">
                Submit a <InlineBadge type="otter" /> tool{" "}
                <span className="text-[#A0AFBB] font-normal">to the</span> directory
              </h1>

              <p className="text-sm text-[#456176] font-medium mb-8">
                Know a game-changing website, software, or CLI script?{" "}
                <span className="font-caveat text-xl text-[#007BE5] font-bold">
                  Reviewed by ShockaGG within 24h.
                </span>
              </p>

              {status === "success" ? (
                <div className="p-8 rounded-3xl bg-[#F0FDF4] border border-emerald-200 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-phudu text-2xl font-bold text-emerald-950 mb-2">
                    Submission Received!
                  </h3>
                  <p className="text-sm text-emerald-800 max-w-md mb-6 leading-relaxed">
                    Thank you for contributing to Random Stuff! We&apos;ll review your submission and add it to the directory shortly.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <MagneticButton variant="primary-light" size="md" onClick={resetForm}>
                      Submit Another Tool
                    </MagneticButton>
                    <MagneticButton variant="accent-lime" size="md" href="/">
                      Return to Directory →
                    </MagneticButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Invisible Honeypot to Catch Spam Bots */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: "none" }}
                    aria-hidden="true"
                  />

                  {status === "error" && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Tool Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14334D]">
                      Tool Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={TOOL_NAME_MAX_LENGTH}
                      placeholder="e.g. Raycast, Warp, Coolors"
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] border border-[#D6DCE1] text-sm text-[#14334D] placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#007BE5] focus:ring-2 focus:ring-[#007BE5]/20 transition-all font-sans"
                    />
                  </div>

                  {/* Tool Link */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14334D]">
                      Website or GitHub URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      maxLength={LINK_MAX_LENGTH}
                      placeholder="https://example.com or https://github.com/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] border border-[#D6DCE1] text-sm text-[#14334D] placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#007BE5] focus:ring-2 focus:ring-[#007BE5]/20 transition-all font-sans"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14334D]">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] border border-[#D6DCE1] text-sm text-[#14334D] focus:outline-hidden focus:bg-white focus:border-[#007BE5] focus:ring-2 focus:ring-[#007BE5]/20 transition-all font-sans cursor-pointer"
                    >
                      <option value="Websites">Websites (Web App / Online Tool)</option>
                      <option value="Softwares">Softwares (Desktop Application)</option>
                      <option value="Scripts">Scripts (CLI / Terminal Script / Automation)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14334D]">
                        Brief Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">
                        {description.length}/{DESCRIPTION_MAX_LENGTH}
                      </span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      placeholder="Explain in 1-2 concise sentences what makes this tool uniquely useful..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] border border-[#D6DCE1] text-sm text-[#14334D] placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#007BE5] focus:ring-2 focus:ring-[#007BE5]/20 transition-all font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <MagneticButton
                      variant="accent-lime"
                      size="lg"
                      type="submit"
                      disabled={status === "submitting"}
                      icon={<Send className="w-4 h-4 text-[#14334D]" />}
                      className="w-full sm:w-auto"
                    >
                      {status === "submitting" ? "Sending to Review..." : "Submit Tool for Review"}
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Live Polaroid Preview Card & Principles */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
              <div className="w-full max-w-[320px]">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Live Desk Preview
                  </span>
                </div>

                <PolaroidCard
                  caption={toolName ? toolName : "Your Tool Here..."}
                  pinType="red-pin"
                  rotation={-3}
                  className="w-full"
                >
                  <div className="w-full h-full bg-gradient-to-br from-sky-100 via-[#F0F7FF] to-emerald-100 p-5 flex flex-col justify-between items-center text-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white text-[#007BE5] font-bold shadow-xs">
                      {category}
                    </span>
                    <div className="my-auto">
                      <span className="font-phudu text-xl font-black text-[#14334D] block truncate max-w-[200px]">
                        {toolName || "Tool Title"}
                      </span>
                      <span className="text-xs text-[#456176] line-clamp-2 mt-1">
                        {description || "A high-taste utility for modern builders."}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#89E00F] font-bold bg-white/80 px-2 py-0.5 rounded-full">
                      ★ Community Curated
                    </span>
                  </div>
                </PolaroidCard>

                {/* Submission Principles */}
                <div className="mt-8 p-5 rounded-2xl bg-[#F0F2F5] border border-slate-200/80 space-y-2 text-xs text-[#456176]">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#14334D] font-bold mb-1">
                    Curation Principles
                  </div>
                  <p>✦ We prioritize clean utilities, developer tools, and design gems.</p>
                  <p>✦ No affiliate link farming or sponsored SEO traps.</p>
                  <p>✦ Tools with generous free tiers or open source licenses are featured first.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
