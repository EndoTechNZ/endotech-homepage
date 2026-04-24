import { getShopifyProductByHandle } from './shopify';

export type OrderCatalogEntryDefinition = {
  size: string;
  length: string;
  sku: string;
  handle?: string | null;
  isMb2?: boolean;
};

export type OrderSelectorItem = OrderCatalogEntryDefinition & {
  price: string;
  status: string;
  productUrl: string | null;
  cartUrl: string | null;
  cartVariantId: string | null;
  hasLiveData: boolean;
};

const formatNzPrice = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(Number(amount));

export const buildOrderSelectorItems = async (
  entries: OrderCatalogEntryDefinition[],
  shopifyStoreDomain: string | null,
  fallbackPrice = 'Available on request',
) => {
  return Promise.all(
    entries.map(async (entry) => {
      if (!entry.handle) {
        return {
          ...entry,
          price: fallbackPrice,
          status: 'Contact for availability',
          productUrl: null,
          cartUrl: null,
          cartVariantId: null,
          hasLiveData: false,
        } satisfies OrderSelectorItem;
      }

      const lookup = await getShopifyProductByHandle(entry.handle);
      const product = lookup.product;
      const variant = product?.variants.find((item) => item.availableForSale) ?? product?.variants[0] ?? null;
      const price = variant ? formatNzPrice(variant.price.amount, variant.price.currencyCode) : fallbackPrice;
      const status = variant?.availableForSale ? 'Available to order online' : 'Currently unavailable';
      const productUrl = product?.onlineStoreUrl ?? (shopifyStoreDomain ? `https://${shopifyStoreDomain}/products/${entry.handle}` : null);
      const cartUrl =
        shopifyStoreDomain && variant?.numericId ? `https://${shopifyStoreDomain}/cart/${variant.numericId}:1` : null;

      return {
        ...entry,
        price,
        status,
        productUrl,
        cartUrl,
        cartVariantId: variant?.numericId ? String(variant.numericId) : null,
        hasLiveData: Boolean(product && variant),
      } satisfies OrderSelectorItem;
    }),
  );
};

export const getOrderCoverageLabel = (items: OrderSelectorItem[]) => {
  const availableCount = items.filter((entry) => entry.status === 'Available to order online').length;
  return `${availableCount} of ${items.length} SKUs live online`;
};
