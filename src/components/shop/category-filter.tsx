import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

export const CategoryFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { pathname, query } = router;
  // We treat Men's/Women's as gender filter, not category slugs
  const selectedGender = (query?.gender as string) || "";
  const [gender, setGender] = React.useState<string>(selectedGender);

  React.useEffect(() => {
    setGender(selectedGender);
  }, [query?.gender]);

  // Only Men & Women categories -> map to gender param
  const items = [
    { id: 1, name: "Men's Perfumes", value: "men" },
    { id: 2, name: "Women's Perfumes", value: "women" },
  ];

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    // Exclusive selection: if clicking same, clear; else set new gender
    const next = gender === value ? "" : value;
    const { gender: _old, ...rest } = query;
    setGender(next);
    router.push(
      {
        pathname,
        query: {
          ...rest,
          ...(next ? { gender: next } : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }
  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        {t("text-category")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {items?.map((item: any) => (
          <CheckBox
            key={item.id}
            label={item.name}
            name={item.name.toLowerCase()}
            checked={gender === item.value}
            value={item.value}
            onChange={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};
