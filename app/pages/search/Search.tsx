import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import useSearchStore from "~/store/search/useSearchStore";
import Card from "~/components/Card";
import { ProductGridSkeleton } from "~/components/CardSkeleton";

const LIMIT = 20;

function Search() {
  const { name } = useParams<{ name: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const { results, total, totalPages, loading, error, search } =
    useSearchStore();

  useEffect(() => {
    if (name) search(name, page, LIMIT);
  }, [name, page]);

  const goToPage = (p: number) => {
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-1">
        Results for &ldquo;{name}&rdquo;
      </h2>

      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-6">
          {total} product{total !== 1 ? "s" : ""} found
        </p>
      )}

      {loading && <ProductGridSkeleton count={LIMIT} />}

      {!loading && error && (
        <p className="text-center text-red-500 py-12">{error}</p>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different search term
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((p) => (
              <Card
                key={p._id}
                productID={p._id}
                name={p.productName}
                price={p.price}
                discountedPrice={p.discountedPrice}
                finalPrice={p.finalPrice}
                imageUrl={p.productImage[0]}
                quantity={p.availableQuantity}
                hasVariants={p.hasVariants}
                variants={p.variants}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 h-9 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    p === page
                      ? "brand-bg text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 h-9 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
