import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { ROUTES } from "@utils/routes";
import { useUI } from "@contexts/ui.context";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useCart } from "@contexts/cart/cart.context";
import { ProductAttributes } from "@components/product/product-attributes";
import { generateCartItem } from "@utils/generate-cart-item";
import usePrice from "@framework/product/use-price";
import { getVariations } from "@framework/utils/get-variations";
import { useTranslation } from "next-i18next";

export default function ProductPopup() {
  const { t } = useTranslation("common");
  const {
    modalData: { data },
    closeModal,
    openCart,
  } = useUI();
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const { price, basePrice, discount } = usePrice({
    amount: data.sale_price ? data.sale_price : data.price,
    baseAmount: data.price,
    currencyCode: "GBP",
  });
  const variations = getVariations(data.variations);
  const { slug, image, name, description } = data;

  // Clean description for popup (avoid showing raw HTML attributes/styles)
  const descriptionText = useMemo(() => {
    const html = String(description || "");
    const noTags = html.replace(/<[^>]*>/g, " ");
    const decoded = noTags
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");
    return decoded.replace(/\s+/g, " ").trim();
  }, [description]);
  const descriptionSnippet = useMemo(() => {
    const MAX = 420;
    return descriptionText.length > MAX ? descriptionText.slice(0, MAX) + "…" : descriptionText;
  }, [descriptionText]);

  // Build a readable, structured block from flat description text
  const structured = useMemo(() => {
    const text = descriptionText;
    if (!text) return { intro: "", items: [] as { title: string; value: string }[] };

    // Add separators before known labels to split into sections
    const patterns: Array<{ title: string; exp: RegExp }> = [
      { title: "Brand", exp: /\bBrand:\s*/gi },
      { title: "Brand Category", exp: /\bBrand\s+Category:\s*/gi },
      { title: "Gender", exp: /\bGender:\s*/gi },
      { title: "Fragrance Notes – Top", exp: /\bFragrance\s+Notes\s*[-–]\s*Top:\s*/gi },
      { title: "Fragrance Notes – Heart", exp: /\bFragrance\s+Notes\s*[-–]\s*Heart:\s*/gi },
      { title: "Fragrance Notes – Base", exp: /\bFragrance\s+Notes\s*[-–]\s*Base:\s*/gi },
      { title: "Notes – Top", exp: /\bNotes\s*[-–]\s*Top:\s*/gi },
      { title: "Notes – Heart", exp: /\bNotes\s*[-–]\s*Heart:\s*/gi },
      { title: "Notes – Base", exp: /\bNotes\s*[-–]\s*Base:\s*/gi },
      { title: "Fragrance Family", exp: /\bFragrance\s+Family:\s*/gi },
      { title: "Key Note", exp: /\bKey\s+Note:\s*/gi },
      { title: "Strength", exp: /\bStrength:\s*/gi },
      { title: "Size", exp: /\bSize:\s*/gi },
      { title: "Bottle Type", exp: /\bBottle\s+Type:\s*/gi },
      { title: "Scent", exp: /\bScent:\s*/gi },
      { title: "EAN", exp: /\bEAN:\s*/gi },
    ];

    let marked = text;
    patterns.forEach(({ title, exp }) => {
      marked = marked.replace(exp, () => ` |||${title}: `);
    });

    const chunks = marked.split(" |||");
    const intro = (chunks[0] || "").trim();
    const items: { title: string; value: string }[] = [];
    for (let i = 1; i < chunks.length; i++) {
      const part = chunks[i];
      const idx = part.indexOf(": ");
      if (idx > 0) {
        const title = part.slice(0, idx).trim();
        const value = part.slice(idx + 2).trim();
        if (title && value) items.push({ title, value });
      }
    }

    // Minor normalization for comma-separated notes => nicer spacing
    items.forEach((it) => {
      if (/Notes/i.test(it.title)) {
        it.value = it.value.replace(/\s*,\s*/g, ", ");
      }
    });

    return { intro, items };
  }, [descriptionText]);

  // Derive a robust primary image src from multiple possible shapes
  const asString = (v: any): string | undefined => (typeof v === "string" ? v : undefined);
  const primarySrc =
    data?.images?.[0]?.url ||
    asString((data as any)?.image) ||
    (image?.original || image?.thumbnail) ||
    (Array.isArray((data as any)?.gallery)
      ? (typeof (data as any).gallery[0] === "string"
          ? (data as any).gallery[0]
          : (data as any).gallery[0]?.original || (data as any).gallery[0]?.thumbnail)
      : undefined) ||
    "/assets/placeholder/products/product-thumbnail.svg";

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
      setViewCartBtn(true);
    }, 600);
    const item = generateCartItem(data!, attributes);
    addItemToCart(item, quantity);
  }

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${slug}`, undefined, {
      locale: router.locale,
    });
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function navigateToCartPage() {
    closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-[430px] max-h-[320px] sm:max-h-[380px] md:max-h-[420px] lg:max-h-full overflow-hidden bg-gray-300">
          <Image
            src={primarySrc}
            alt={name || "Product image"}
            width={430}
            height={430}
            className="w-full h-auto object-contain lg:object-cover lg:w-full lg:h-full"
          />
        </div>
        <div className="flex flex-col p-5 md:p-8 w-full">
          <div className="pb-5">
            <div
              className="mb-2 md:mb-2.5 block -mt-1.5"
              onClick={navigateToProductPage}
              role="button"
            >
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold hover:text-black">
                {name}
              </h2>
            </div>
            <div className="text-sm md:text-body md:leading-7 space-y-2">
              {structured.intro && (
                <p>{structured.intro}</p>
              )}
              {structured.items.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {structured.items.map((it, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{it.title}:</span> {it.value}
                    </li>
                  ))}
                </ul>
              )}
              {!structured.intro && structured.items.length === 0 && (
                <p>{descriptionSnippet}</p>
              )}
            </div>

            <div className="flex items-center mt-3">
              <div className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                {price}
              </div>
              {discount && (
                <del className="font-segoe text-gray-400 text-base lg:text-xl ps-2.5 -mt-0.5 md:mt-0">
                  {basePrice}
                </del>
              )}
            </div>
          </div>

          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={`popup-attribute-key${variation}`}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
              />
            );
          })}

          <div className="pt-2 md:pt-4">
            <div className="flex items-center justify-between mb-4 space-s-3 sm:space-s-4">
              <Counter
                quantity={quantity}
                onIncrement={() => setQuantity((prev) => prev + 1)}
                onDecrement={() =>
                  setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                }
                disableDecrement={quantity === 1}
              />
              <Button
                onClick={addToCart}
                variant="flat"
                className={`w-full h-11 md:h-12 px-1.5 ${
                  !isSelected && "bg-gray-400 hover:bg-gray-400"
                }`}
                disabled={!isSelected}
                loading={addToCartLoader}
              >
                {t("text-add-to-cart")}
              </Button>
            </div>

            {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 h-11 md:h-12 rounded bg-gray-100 text-heading focus:outline-none border border-gray-300 transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                {t("text-view-cart")}
              </button>
            )}
            <Button
              onClick={navigateToProductPage}
              variant="flat"
              className="w-full h-11 md:h-12"
            >
              {t("text-view-details")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
