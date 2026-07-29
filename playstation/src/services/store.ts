import { games } from '@/data/games';
import { getRayfinClient } from '@/services/rayfinClient';

export type StoreState = {
  wishlistIds: string[];
  cartIds: string[];
};

export async function initializeStore(userId: string): Promise<StoreState> {
  const client = getRayfinClient();
  const existingProducts = await client.data.Product.findMany();

  if (existingProducts.length === 0) {
    await Promise.all(
      games.map((game, index) =>
        client.data.Product.create({
          id: game.id,
          sku: game.id,
          title: game.title,
          publisher: game.publisher,
          genre: game.genre,
          price: game.price,
          oldPrice: game.oldPrice,
          badge: game.badge,
          imageUrl: game.image,
          platform: game.platform,
          ageRating: game.rating,
          description: game.description,
          featured: index < 5,
        })
      )
    );
  }

  const [wishlist, cart] = await Promise.all([
    client.data.WishlistItem.findMany({ user_id: { eq: userId } }),
    client.data.CartItem.findMany({ user_id: { eq: userId } }),
  ]);

  return {
    wishlistIds: wishlist.map((item) => item.productId),
    cartIds: cart.map((item) => item.productId),
  };
}

export async function saveWishlistItem(
  userId: string,
  productId: string,
  enabled: boolean
) {
  const client = getRayfinClient();
  const existing = await client.data.WishlistItem.findFirst({
    user_id: { eq: userId },
    productId: { eq: productId },
  });

  if (enabled && !existing) {
    await client.data.WishlistItem.create({
      id: crypto.randomUUID(),
      productId,
      user_id: userId,
      createdAt: new Date(),
    });
  } else if (!enabled && existing) {
    await client.data.WishlistItem.delete({ id: existing.id });
  }
}

export async function saveCartItem(
  userId: string,
  productId: string,
  enabled: boolean
) {
  const client = getRayfinClient();
  const existing = await client.data.CartItem.findFirst({
    user_id: { eq: userId },
    productId: { eq: productId },
  });

  if (enabled && !existing) {
    await client.data.CartItem.create({
      id: crypto.randomUUID(),
      productId,
      user_id: userId,
      createdAt: new Date(),
    });
  } else if (!enabled && existing) {
    await client.data.CartItem.delete({ id: existing.id });
  }
}

export async function createOrder(userId: string, total: number) {
  const client = getRayfinClient();
  return client.data.StoreOrder.create({
    id: crypto.randomUUID(),
    user_id: userId,
    total,
    status: 'pending',
    createdAt: new Date(),
  });
}
