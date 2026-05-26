"use client";

import { useState } from "react";

type Props = { labels: { name: string; email: string; projectType: string; message: string; submit: string; success: string; error: string } };

export default function InquiryForm({ labels }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (response.ok) {
      event.currentTarget.reset();
      setState("success");
    } else {
      setState("error");
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <label>{labels.name}<input name="name" required /></label>
      <label>{labels.email}<input name="email" type="email" required dir="ltr" /></label>
      <label>{labels.projectType}<input name="projectType" /></label>
      <label>{labels.message}<textarea name="message" rows={6} required /></label>
      <button className="site-button" disabled={state === "saving"}>{labels.submit}</button>
      {state === "success" ? <p role="status">{labels.success}</p> : null}
      {state === "error" ? <p role="alert">{labels.error}</p> : null}
    </form>
  );
}
