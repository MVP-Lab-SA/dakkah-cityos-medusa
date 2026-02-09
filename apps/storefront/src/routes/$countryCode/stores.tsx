import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRegion } from "@/lib/data/regions";
import { listProducts } from "@/lib/data/products";
import { listCategories } from "@/lib/data/categories";
import { HttpTypes } from "@medusajs/types";

export const Route = createFileRoute("/$countryCode/stores")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    if (typeof window === "undefined") return { countryCode, region: null, products: [] as HttpTypes.StoreProduct[], categories: [] as HttpTypes.StoreProductCategory[] }
    const { queryClient } = context;

    // Fetch region based on country code
    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    });

    if (!region) {
      throw notFound();
    }

    // Fetch all products for that region
    const { products } = await queryClient.ensureQueryData({
      queryKey: ["products", "all", region.id],
      queryFn: () =>
        listProducts({
          query_params: {
            limit: 100,
            fields: "*variants,+variants.calculated_price,+variants.inventory_quantity,*images,*categories,*collection",
          },
          region_id: region.id,
        }),
    });

    // Fetch categories
    const categories = await queryClient.ensureQueryData({
      queryKey: ["categories", "all"],
      queryFn: () => listCategories(),
    });

    return {
      countryCode,
      region,
      products: products as HttpTypes.StoreProduct[],
      categories: categories as HttpTypes.StoreProductCategory[],
    };
  },
  component: StoresPage,
});

function StoresPage() {
  const { products, categories, region } = Route.useLoaderData();

  if (!region) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="text-zinc-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  // Group products by category
  const productsByCategory = categories.map((category) => {
    const categoryProducts = products.filter((product) =>
      product.categories?.some((cat) => cat.id === category.id)
    );
    return {
      category,
      products: categoryProducts,
    };
  });

  // Products without categories
  const uncategorizedProducts = products.filter(
    (product) => !product.categories || product.categories.length === 0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">
            Saudi Arabian Marketplace
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Discover authentic Saudi products, traditional clothing, premium fragrances, and cultural treasures
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-amber-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇸🇦</span>
              <span>Made in Saudi Arabia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <span>{products.length} Products</span>
            </div>
          </div>
        </div>

        {/* Products by Category */}
        {productsByCategory.map(({ category, products: categoryProducts }) => {
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-amber-900 mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-amber-700">{category.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Uncategorized Products */}
        {uncategorizedProducts.length > 0 && (
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                Featured Products
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {uncategorizedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              No Products Available
            </h2>
            <p className="text-amber-700">
              Check back soon for amazing Saudi products!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const countryCode = Route.useParams().countryCode;
  const image = product.thumbnail || product.images?.[0]?.url;
  const variant = product.variants?.[0];
  const price = variant?.calculated_price;

  return (
    <a
      href={`/${countryCode}/products/${product.handle}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-amber-50">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
        )}
        {product.collection && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.collection.title}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-sm text-amber-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {price ? (
            <div className="text-lg font-bold text-amber-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: price.currency_code?.toUpperCase() || "SAR",
              }).format((price.amount || 0) / 100)}
            </div>
          ) : (
            <div className="text-sm text-amber-600">Price on request</div>
          )}
          
          {variant?.inventory_quantity !== undefined && (
            <div className="text-xs text-amber-600">
              {variant.inventory_quantity > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.categories.slice(0, 2).map((cat: any) => (
              <span
                key={cat.id}
                className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
