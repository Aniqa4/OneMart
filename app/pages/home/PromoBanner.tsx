import { Link } from "react-router";

export default function PromoBanner() {
  return (
    <div className="my-10 grid md:grid-cols-2 gap-4">
      {/* Main promo */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white px-8 py-10 flex flex-col justify-between min-h-[180px]">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-28 h-28 rounded-full bg-[#7163cc]/20 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b3aaec] mb-2 block">
            Limited Time
          </span>
          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
            Up to <span className="text-[#b3aaec]">50% Off</span>
          </h3>
          <p className="text-gray-400 text-sm mb-5">On selected items. Don't miss out.</p>
          <Link
            to="/categories"
            className="inline-block bg-[#7163cc] hover:bg-[#5e50b5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Shop the Sale
          </Link>
        </div>
      </div>

      {/* Secondary promo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7163cc]/10 to-[#b3aaec]/20 px-8 py-10 flex flex-col justify-between min-h-[180px] border border-[#7163cc]/15">
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#7163cc]/10 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7163cc] mb-2 block">
            Free Shipping
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-1">
            Orders Over<br />1000 BDT
          </h3>
          <p className="text-gray-500 text-sm mb-5">Delivered right to your door.</p>
          <Link
            to="/categories"
            className="inline-block bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
