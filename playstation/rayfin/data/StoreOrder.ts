import { date, decimal, entity, role, set, text, uuid } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class StoreOrder {
  @uuid() id!: string;
  @text() user_id!: string;
  @decimal() total!: number;
  @set('pending', 'paid', 'cancelled') status!: 'pending' | 'paid' | 'cancelled';
  @date() createdAt!: Date;
}
