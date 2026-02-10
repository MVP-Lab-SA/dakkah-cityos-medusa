import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { useCMSNavigation } from "@/lib/hooks/use-cms"
import { getTenantLocalePrefix } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  if (typeof window === "undefined") {
    return (
      <footer className="bg-zinc-50 border-t border-zinc-300 w-full" data-testid="footer">
        <div className="content-container flex flex-col w-full">
          <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
            <div className="lg:w-1/3 flex flex-col gap-y-4">
              <span className="text-xl font-bold text-zinc-900">Dakkah CityOS</span>
              <p className="text-zinc-600 max-w-md text-base font-medium">
                Dakkah CityOS — Multi-tenant, city-scale commerce platform powering 25+ verticals across MENA and beyond.
              </p>
            </div>
          </div>
          <div className="border-t border-zinc-300 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs text-zinc-600">
                © {new Date().getFullYear()} Dakkah CityOS. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const location = useLocation();
  const baseHref = getTenantLocalePrefix(location.pathname);

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 3,
    },
  });

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  const { data: footerNav } = useCMSNavigation("footer");

  const groupNavItemsIntoColumns = (items: any[], itemsPerColumn: number = 9) => {
    if (!items || items.length === 0) return [];
    const columns = [];
    for (let i = 0; i < items.length; i += itemsPerColumn) {
      columns.push(items.slice(i, i + itemsPerColumn));
    }
    return columns;
  };

  const footerNavColumns = footerNav?.items
    ? groupNavItemsIntoColumns(footerNav.items, 9)
    : [];

  return (
    <footer
      className="bg-zinc-50 border-t border-zinc-300 w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3 flex flex-col gap-y-4">
            <Link
              to={baseHref || "/"}
              className="text-xl font-bold text-zinc-900 hover:text-zinc-600 transition-colors w-fit"
            >
              Dakkah CityOS
            </Link>
            <p className="text-zinc-600 max-w-md text-base font-medium">
              Dakkah CityOS — Multi-tenant, city-scale commerce platform powering 25+ verticals across MENA and beyond.
            </p>
            <CountrySelect regions={regions ?? []} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {categories && categories.length > 0 && (
              <FooterColumn
                title="Shop"
                links={categories.map((category) => ({
                  name: category.name,
                  url: `${baseHref}/categories/${category.handle}`,
                  isExternal: false,
                }))}
              />
            )}
            {footerNavColumns.map((column, columnIndex) => (
              <FooterColumn
                key={columnIndex}
                title={`Services ${columnIndex + 1}`}
                links={column.map((item: any) => ({
                  name: item.label,
                  url: `${baseHref}${item.url}`,
                  isExternal: false,
                }))}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-zinc-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Dakkah CityOS. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="text-xs text-zinc-600 hover:text-zinc-500 transition-colors"
                to={"/"}
              >
                Privacy Policy
              </Link>
              <Link
                className="text-xs text-zinc-600 hover:text-zinc-500 transition-colors"
                to={"/"}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: {
    name: string;
    url: string;
    isExternal: boolean;
  }[];
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-zinc-900 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 hover:text-zinc-500 transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-zinc-600 hover:text-zinc-500 transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
