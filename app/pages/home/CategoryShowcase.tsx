import { useEffect } from "react";
import { Link } from "react-router";
import useCategoryStore from "~/store/getCategories/useCategoryStore";

const PALETTE = [
  "from-violet-100 to-violet-50 text-violet-700",
  "from-pink-100 to-pink-50 text-pink-700",
  "from-blue-100 to-blue-50 text-blue-700",
  "from-amber-100 to-amber-50 text-amber-700",
  "from-emerald-100 to-emerald-50 text-emerald-700",
  "from-rose-100 to-rose-50 text-rose-700",
  "from-sky-100 to-sky-50 text-sky-700",
  "from-orange-100 to-orange-50 text-orange-700",
];

export default function CategoryShowcase() {
  const { categories, fetchCategories, loading } = useCategoryStore();

  useEffect(() => {
    if (!categories.length) fetchCategories();
  }, []);

  const visible = categories.slice(0, 8);

  return (
    <div className="my-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <div className="mt-1.5 w-10 h-0.5 bg-[#7163cc] rounded-full" />
        </div>
        <Link
          to="/categories"
          className="text-sm font-medium text-[#7163cc] hover:underline"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-28 h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {visible.map((cat, i) => (
            <Link
              key={cat._id}
              to={`/categories/${cat._id}/${encodeURIComponent(cat.categoryName)}`}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${PALETTE[i % PALETTE.length]} hover:scale-105 transition-transform duration-200 aspect-square text-center`}
            >
              <span className="text-2xl font-bold leading-none">
                {cat.categoryName.charAt(0).toUpperCase()}
              </span>
              <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                {cat.categoryName}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
