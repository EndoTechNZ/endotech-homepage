type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyVariantOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  numericId: string | null;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku: string | null;
  price: ShopifyMoney;
  selectedOptions: ShopifyVariantOption[];
};

export type ShopifyProduct = {
  title: string;
  handle: string;
  description: string | null;
  onlineStoreUrl: string | null;
  variants: ShopifyVariant[];
};

type ShopifyProductResponse = {
  data?: {
    productByHandle?: {
      title: string;
      handle: string;
      description?: string | null;
      onlineStoreUrl?: string | null;
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          availableForSale: boolean;
          quantityAvailable?: number | null;
          sku?: string | null;
          price: ShopifyMoney;
          selectedOptions?: ShopifyVariantOption[];
        }>;
      };
    } | null;
  };
};

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      title
      handle
      description
      onlineStoreUrl
      variants(first: 25) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          sku
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const getNumericVariantId = (gid: string): string | null => {
  const match = gid.match(/(\d+)$/);
  return match ? match[1] : null;
};

export const getShopifyStoreDomain = (): string | null => {
  return import.meta.env.SHOPIFY_STORE_DOMAIN?.trim() || null;
};

export const getShopifyProductByHandle = async (handle: string): Promise<ShopifyProduct | null> => {
  const storeDomain = getShopifyStoreDomain();
  const privateToken = import.meta.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
  const publicToken = import.meta.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN?.trim();
  const apiVersion = import.meta.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || '2026-04';

  if (!storeDomain || (!privateToken && !publicToken)) {
    return null;
  }

  const authHeader = privateToken
    ? { 'Shopify-Storefront-Private-Token': privateToken }
    : { 'X-Shopify-Storefront-Access-Token': publicToken! };

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyProductResponse;
  const product = payload.data?.productByHandle;

  if (!product) {
    return null;
  }

  return {
    title: product.title,
    handle: product.handle,
    description: product.description ?? null,
    onlineStoreUrl: product.onlineStoreUrl ?? null,
    variants: product.variants.nodes.map((variant) => ({
      id: variant.id,
      numericId: getNumericVariantId(variant.id),
      title: variant.title,
      availableForSale: variant.availableForSale,
      quantityAvailable: variant.quantityAvailable ?? null,
      sku: variant.sku ?? null,
      price: variant.price,
      selectedOptions: variant.selectedOptions ?? [],
    })),
  };
};
