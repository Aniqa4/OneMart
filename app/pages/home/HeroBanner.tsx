import { Link } from "react-router";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7163cc] via-[#8b7fe0] to-[#b3aaec] text-white px-8 py-14 md:py-20 mb-2">
      {/* decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          New Arrivals
        </span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Discover Your<br />Perfect Style
        </h1>
        <p className="text-white/75 text-sm md:text-base mb-8 leading-relaxed max-w-sm">
          Handpicked collections crafted with quality and creativity — from everyday essentials to statement pieces.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/categories"
            className="bg-white text-[#7163cc] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            Shop Now
          </Link>
          <Link
            to="/categories"
            className="border border-white/40 text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Explore Categories
          </Link>
        </div>
      </div>

      {/* floating stat cards */}
      <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-3">
        {[
          { value: "10K+", label: "Happy Customers" },
          { value: "500+", label: "Products" },
          { value: "4.9★", label: "Average Rating" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center min-w-[120px]">
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
