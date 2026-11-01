"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
export default function SubmissionForm() {
  const [status, setStatus] = useState<
      "idle" | "sending" | "success" | "error"
    >("idle"),
    [message, setMessage] = useState(""),
    [online, setOnline] = useState(true),
    [available, setAvailable] = useState<boolean | null>(null),
    [description, setDescription] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const controller = new AbortController();
    fetch("/api/submit", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setAvailable(d.available))
      .catch(() => {});
    return () => {
      controller.abort();
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: form.get("toolName"),
          link: form.get("link"),
          category: form.get("category"),
          description: form.get("description"),
          honeypot: form.get("company_website"),
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) {
        const seconds = Number(response.headers.get("Retry-After"));
        throw new Error(
          (data.error || "Unable to send this suggestion.") +
            (seconds ? ` Try again in ${seconds} seconds.` : ""),
        );
      }
      setStatus("success");
      setMessage(`Delivered for manual review. Receipt: ${data.receipt}.`);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Connection failed. Your fields are still here.",
      );
      requestAnimationFrame(() => alertRef.current?.focus());
    }
  }
  return (
    <>
      <noscript>
        <p className="notice">
          This form requires JavaScript. You can suggest a tool through a public
          repository issue instead.
        </p>
      </noscript>
      {!online && (
        <p role="status" className="notice">
          You are offline. Your entered fields remain here; reconnect before
          sending.
        </p>
      )}
      {available === false && (
        <p role="status" className="notice">
          Form delivery is temporarily unavailable.{" "}
          <a
            href="https://github.com/nipunyatawara-dev/random-stuff-site/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suggest a tool in a repository issue instead ↗
          </a>
        </p>
      )}
      {status === "success" ? (
        <div className="submit-success" role="status">
          <h2>Suggestion received</h2>
          <p>{message}</p>
          <p>
            We will check whether it fits the directory. Acceptance and review
            time are not guaranteed.
          </p>
          <div className="dialog-actions">
            <button
              className="button"
              onClick={() => {
                setStatus("idle");
                setDescription("");
              }}
            >
              Suggest another
            </button>
            <Link href="/#catalog-section" className="button button-primary">
              Return to tools
            </Link>
          </div>
        </div>
      ) : (
        <form
          className="submit-form"
          action="/submit"
          method="post"
          onSubmit={submit}
          aria-busy={status === "sending"}
        >
          <input
            type="text"
            name="company_website"
            autoComplete="off"
            tabIndex={-1}
            hidden
            aria-hidden="true"
          />
          {status === "error" && (
            <div
              ref={alertRef}
              tabIndex={-1}
              role="alert"
              className="notice"
              id="submission-error"
            >
              {message}
            </div>
          )}
          <div>
            <label htmlFor="tool-name">Tool name (required)</label>
            <input
              id="tool-name"
              name="toolName"
              required
              maxLength={80}
              autoComplete="off"
              placeholder="e.g. Flameshot"
              aria-describedby="name-hint"
            />
            <p className="field-hint" id="name-hint">
              Up to 80 characters.
            </p>
          </div>
          <div>
            <label htmlFor="tool-url">
              Official website or repository (required)
            </label>
            <input
              id="tool-url"
              name="link"
              type="url"
              inputMode="url"
              required
              maxLength={500}
              autoComplete="url"
              placeholder="https://example.com"
              aria-describedby="url-hint"
            />
            <p className="field-hint" id="url-hint">
              Use the official public HTTP(S) URL, without passwords or tracking
              links.
            </p>
          </div>
          <div>
            <label htmlFor="tool-category">Category (required)</label>
            <select
              id="tool-category"
              name="category"
              required
              defaultValue="Websites"
            >
              <option value="Websites">Website / web app</option>
              <option value="Softwares">Desktop software</option>
              <option value="Scripts">Script / CLI tool</option>
            </select>
          </div>
          <div>
            <label htmlFor="tool-description">
              What makes it useful? (required)
            </label>
            <textarea
              id="tool-description"
              name="description"
              required
              maxLength={500}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-describedby="description-hint"
              placeholder="What does it do, and who would use it?"
            />
            <p className="field-hint" id="description-hint">
              {description.length}/500 characters. Share a concrete use case;
              omit personal information.
            </p>
          </div>
          <p className="field-hint">
            Sent to Discord for manual review.{" "}
            <Link href="/about">Curation and privacy details</Link>.
          </p>
          <button
            className="button button-primary"
            type="submit"
            disabled={status === "sending" || !online || available === false}
          >
            {status === "sending" ? "Sending suggestion…" : "Send for review"}
          </button>
        </form>
      )}
    </>
  );
}
