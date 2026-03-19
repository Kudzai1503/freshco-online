import { auth } from "@/auth";
import { departments } from "@/lib/storefront/mock/data";

import { StorefrontHeaderShell } from "@/components/storefront/layout/StorefrontHeaderShell";

const featuredDepartments = new Set(["deli", "confectionery", "butchery", "winery"]);

export async function StorefrontHeader({
  embedded = false,
}: Readonly<{ embedded?: boolean }>) {
  const session = await auth();
  const quickDepartments = departments.filter((department) =>
    featuredDepartments.has(department.slug),
  );

  return (
    <StorefrontHeaderShell
      embedded={embedded}
      isAuthenticated={Boolean(session?.user)}
      quickDepartments={quickDepartments}
    />
  );
}
