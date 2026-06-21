import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import axiosInstance from "~/utilities/axiosInstance";
import type { ProductProps } from "~/interface/ProductProps";

interface SuggestionBodyProps {
  loading: boolean;
  suggestions: ProductProps[];
  query: string;
  onSuggestionClick: () => void;
  onSeeAll: () => void;
}

function SuggestionBody({
  loading,
  suggestions,
  query,
  onSuggestionClick,
  onSeeAll,
}: SuggestionBodyProps) {
  if (loading)
    return (
      <div className="flex items-center justify-center py-5">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );

  if (!suggestions.length)
    return (
      <p className="px-4 py-3.5 text-sm text-gray-400">
        No results for &ldquo;{query}&rdquo;
      </p>
    );

  return (
    <>
      {suggestions.map((p) => (
        <Link
          key={p._id || p.id}
          to={`/details/${p._id || p.id}`}
          onClick={onSuggestionClick}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
        >
          <img
            src={p.productImage}
            alt={p.productName}
            className="w-9 h-9 object-cover rounded-lg bg-gray-100 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {p.productName}
            </p>
            <p className="text-xs text-gray-400">{p.finalPrice} BDT</p>
          </div>
        </Link>
      ))}
      <button
        onClick={onSeeAll}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition border-t border-gray-100"
      >
        <IoSearchOutline size={14} />
        See all results for &ldquo;{query}&rdquo;
      </button>
    </>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const match = location.pathname.match(/^\/search\/(.+)/);
    if (match) {
      setQuery(decodeURIComponent(match[1]));
      setShowDropdown(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus();
  }, [mobileOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setShowDropdown(true);
      try {
        const { data } = await axiosInstance.get(
          `/search-products/${encodeURIComponent(q)}`,
          { params: { page: 1, limit: 6 } }
        );
        setSuggestions(data.products || data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = (q: string) => {
    if (!q.trim()) return;
    setShowDropdown(false);
    setMobileOpen(false);
    navigate(`/search/${encodeURIComponent(q.trim())}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleSuggestionClick = () => {
    setShowDropdown(false);
    setQuery("");
    setMobileOpen(false);
  };

  const SearchIcon = () =>
    loading ? (
      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    ) : (
      <IoSearchOutline size={17} />
    );

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block w-full max-w-sm relative" ref={containerRef}>
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/15 hover:bg-white/20 focus-within:bg-white/20 rounded-xl overflow-hidden transition"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/60 px-3.5 py-2 outline-none min-w-0"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center justify-center w-9 h-9 shrink-0 hover:bg-white/15 transition"
          >
            <SearchIcon />
          </button>
        </form>

        {showDropdown && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <SuggestionBody
              loading={loading}
              suggestions={suggestions}
              query={query}
              onSuggestionClick={handleSuggestionClick}
              onSeeAll={() => doSearch(query)}
            />
          </div>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Search"
        className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/15 transition"
      >
        <IoSearchOutline size={21} />
      </button>

      {/* Mobile panel — fixed below the navbar */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-50 brand-bg text-white px-4 py-3 sm:hidden">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/15 rounded-xl overflow-hidden"
          >
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/60 px-3.5 py-2.5 outline-none min-w-0"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center w-10 h-10 hover:bg-white/15 transition shrink-0"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close search"
              className="flex items-center justify-center w-10 h-10 hover:bg-white/15 transition shrink-0"
            >
              <IoClose size={17} />
            </button>
          </form>

          {showDropdown && query.trim() && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <SuggestionBody
                loading={loading}
                suggestions={suggestions}
                query={query}
                onSuggestionClick={handleSuggestionClick}
                onSeeAll={() => doSearch(query)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SearchBar;
