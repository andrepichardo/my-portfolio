"use client";

import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

/** The only interactive part of the contact section. */
const ContactForm = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);

  const handleValidation = () => {
    const tempErrors: Record<string, boolean> = {};
    let isValid = true;

    if (fullname.length <= 0) {
      tempErrors["fullname"] = true;
      isValid = false;
    }
    if (email.length <= 0) {
      tempErrors["email"] = true;
      isValid = false;
    }
    if (subject.length <= 0) {
      tempErrors["subject"] = true;
      isValid = false;
    }
    if (message.length <= 0) {
      tempErrors["message"] = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        body: JSON.stringify({ email, fullname, subject, message }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await res.json();
      if (data.error) {
        toast.error("Message could not be sent.");
      } else {
        toast.success("Message sent successfully!");
      }
    } catch {
      toast.error("Message could not be sent.");
    } finally {
      setSending(false);
      setFullname("");
      setEmail("");
      setMessage("");
      setSubject("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col p-2">
        <label htmlFor="fullname" className="py-2 text-sm uppercase">
          Full Name
        </label>
        <input
          id="fullname"
          title="Full Name"
          className="border-2 w-full rounded-lg flex px-2 py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        {errors?.fullname && (
          <p className="text-red-500">Full name cannot be empty.</p>
        )}
      </div>
      <div className="flex flex-col p-2">
        <label htmlFor="email" className="py-2 text-sm uppercase">
          Email
        </label>
        <input
          id="email"
          title="Email"
          className="border-2 rounded-lg w-full flex px-2 py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors?.email && <p className="text-red-500">Email cannot be empty.</p>}
      </div>
      <div className="flex flex-col p-2">
        <label htmlFor="subject" className="py-2 text-sm uppercase">
          Subject
        </label>
        <input
          id="subject"
          title="Subject"
          className="border-2 rounded-lg w-full flex px-2 py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {errors?.subject && (
          <p className="text-red-500">Subject cannot be empty.</p>
        )}
      </div>
      <div className="flex flex-col p-2">
        <label htmlFor="message" className="py-2 text-sm uppercase">
          Message
        </label>
        <textarea
          id="message"
          title="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 resize-none w-full px-2 py-3 rounded-lg transition-all border-gray-300 dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none min-h-43.75 max-h-43.75 sm:min-h-56.25 sm:max-h-56.25"
        />
        {errors?.message && (
          <p className="text-red-500">Message body cannot be empty.</p>
        )}
      </div>
      <div className="flex p-2">
        <button
          type="submit"
          disabled={sending}
          className="btn w-full p-4 mt-4 transition-all"
        >
          {sending ? (
            <span className="w-full flex justify-center items-center gap-1.5">
              Sending <FaSpinner className="animate-spin" />
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
