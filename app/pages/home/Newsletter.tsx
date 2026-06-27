import { useState } from "react";
import { toast } from "react-toastify";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! Thanks for joining.");
    setEmail("");
  };

  return (
    <div className="my-10 rounded-2xl bg-gradient-to-br from-[#7163cc] to-[#9589d9] px-8 py-12 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">Stay in the loop</p>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Get Exclusive Deals</h2>
      <p className="text-white/70 text-sm mb-8 max-w-sm mx-auto">
        Subscribe to our newsletter and be the first to know about new arrivals, sales, and offers.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
