import { useState, type FormEvent } from "react";

const CONTACT_EMAIL = "ts@halfodd.com";
const SUBJECT = "new form submission theresaschantz.com";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      SUBJECT,
    )}&body=${encodeURIComponent(body)}`;

    // Opens the visitor's own mail app with the fields pre-filled; there's
    // no backend here to send mail silently, so they still hit Send there.
    window.location.href = mailto;
  }

  return (
    <div className="page-copy">
      <h1>Contact</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label className="contact-form__field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="contact-form__field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="contact-form__field">
          <span>Message</span>
          <textarea
            name="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="contact-form__submit">
          Send
        </button>
      </form>
    </div>
  );
}
