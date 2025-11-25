import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

export const PriceFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { pathname, query } = router;

  const initial = React.useMemo(() => {
    const [minStr, maxStr] = String(query?.price || "0-200").split("-");
    return {
      min: Number(minStr || 0),
      max: Number(maxStr || 200),
    };
  }, [query?.price]);

  const [min, setMin] = React.useState<number>(initial.min);
  const [max, setMax] = React.useState<number>(initial.max);

  React.useEffect(() => {
    setMin(initial.min);
    setMax(initial.max);
  }, [initial.min, initial.max]);

  function applyPriceRange() {
    const { price, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          price: `${Math.min(min, max)}-${Math.max(min, max)}`,
        },
      },
      undefined,
      { scroll: false }
    );
  }

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-5">
        {t("text-price")}
      </h3>

      <div className="space-y-4">
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={200}
            step={0.01}
            value={Math.min(min, max)}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={200}
            step={0.01}
            value={Math.max(min, max)}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full -mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="flex items-center border rounded-md px-2 py-1">
            <span className="text-sm text-heading mr-2">£</span>
            <input
              type="number"
              min={0}
              max={200}
              step={0.01}
              value={Math.min(min, max)}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="flex items-center border rounded-md px-2 py-1">
            <span className="text-sm text-heading mr-2">£</span>
            <input
              type="number"
              min={0}
              max={200}
              step={0.01}
              value={Math.max(min, max)}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={applyPriceRange}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-heading text-white rounded-md hover:opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
