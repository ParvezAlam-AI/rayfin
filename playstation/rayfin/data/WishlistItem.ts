import { date, entity, role, text, uuid } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class WishlistItem {
  @uuid() id!: string;
  @text() productId!: string;
  @text() user_id!: string;
  @date() createdAt!: Date;
}
