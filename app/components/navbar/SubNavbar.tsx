import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router";
import useCategoryStore from "~/store/getCategories/useCategoryStore";

function SubNavbar() {
  const { categories, fetchCategories, loading } = useCategoryStore();

  const [openMenu, setOpenMenu] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  useEffect(() => {
    if (!categories.length) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  if (loading) {
    return (
      <div className="border-b bg-white py-3 px-4 text-sm text-gray-400">
        Loading categories…
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
        {/* ================= Desktop ================= */}
        <div className="hidden md:flex items-center gap-6 py-3 text-sm font-medium">
          {categories.map((category) => (
            <div key={category._id} className="relative group">
              <Link
                to={`/categories/${category._id}/${encodeURIComponent(category.categoryName)}`}
                className="flex items-center gap-1 text-gray-600 hover:text-black transition"
              >
                {category.categoryName}
                {category.subCategories?.length > 0 && <IoChevronDown />}
              </Link>

              {/* Sub category dropdown */}
              {category.subCategories?.length > 0 && (
                <div
                  className="absolute left-0 top-full mt-3 w-64 rounded-xl bg-white shadow-xl border border-gray-100
                                opacity-0 scale-95 invisible group-hover:visible group-hover:opacity-100 group-hover:scale-100
                                transition-all duration-200 z-50 p-2"
                >
                  {category.subCategories.map((sub: any) => (
                    <div key={sub._id} className="relative group/sub">
                      <Link
                        to={`/categories/${sub._id}/${encodeURIComponent(sub.name)}`}
                        className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        {sub.name}
                        {sub.subSubCategories?.length > 0 && (
                          <IoChevronDown className="text-xs -rotate-90" />
                        )}
                      </Link>

                      {/* Sub-sub */}
                      {sub.subSubCategories?.length > 0 && (
                        <div
                          className="absolute left-full top-0 ml-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100
                                        opacity-0 scale-95 invisible group-hover/sub:visible group-hover/sub:opacity-100 group-hover/sub:scale-100
                                        transition-all duration-200 p-2"
                        >
                          {sub.subSubCategories.map((ss: any) => (
                            <Link
                              key={ss._id}
                              to={`/categories/${ss._id}/${encodeURIComponent(ss.name)}`}
                              className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                              {ss.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= Mobile ================= */}
        <div className="md:hidden">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex w-full items-center justify-between py-3 font-medium text-gray-700"
          >
            Categories
            {openMenu ? <IoChevronUp /> : <IoChevronDown />}
          </button>

          {openMenu && (
            <div className="pb-3">
              {categories.map((category) => (
                <div key={category._id} className="border-b border-gray-100">
                  <button
                    onClick={() =>
                      setExpandedCat(
                        expandedCat === category._id ? null : category._id,
                      )
                    }
                    className="w-full flex justify-between items-center px-3 py-3 text-left"
                  >
                    {category.categoryName}
                    {category.subCategories?.length &&
                      (expandedCat === category._id ? (
                        <IoChevronUp />
                      ) : (
                        <IoChevronDown />
                      ))}
                  </button>

                  {expandedCat === category._id &&
                    category.subCategories?.length && (
                      <div className="pl-4 bg-gray-50 rounded-lg mx-2 mb-2">
                        {category.subCategories.map((sub: any) => (
                          <div key={sub._id}>
                            <button
                              onClick={() =>
                                setExpandedSub(
                                  expandedSub === sub._id ? null : sub._id,
                                )
                              }
                              className="w-full flex justify-between items-center px-3 py-2 text-sm"
                            >
                              <Link
                                to={`/categories/${category._id}/${encodeURIComponent(category.categoryName)}`}
                                onClick={() => setOpenMenu(false)}
                                className="flex-1"
                              >
                                {sub.name}
                              </Link>
                              {sub.subSubCategories?.length &&
                                (expandedSub === sub._id ? (
                                  <IoChevronUp />
                                ) : (
                                  <IoChevronDown />
                                ))}
                            </button>

                            {expandedSub === sub._id &&
                              sub.subSubCategories?.length && (
                                <div className="pl-4 pb-2">
                                  {sub.subSubCategories.map((ss: any) => (
                                    <Link
                                      key={ss._id}
                                      to={`/categories/${category._id}/${encodeURIComponent(category.categoryName)}?sub=${encodeURIComponent(sub.name)}&subSub=${encodeURIComponent(ss.name)}`}
                                      onClick={() => setOpenMenu(false)}
                                      className="block px-3 py-2 text-sm text-gray-600 hover:text-black"
                                    >
                                      {ss.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SubNavbar;
