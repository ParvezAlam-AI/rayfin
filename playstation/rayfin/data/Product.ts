import {
  boolean,
  decimal,
  entity,
  role,
  text,
  uuid,
} from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*')
export class Product {
  @uuid() id!: string;
  @text({ min: 1, max: 80 }) sku!: string;
  @text({ min: 1, max: 160 }) title!: string;
  @text({ min: 1, max: 120 }) publisher!: string;
  @text({ min: 1, max: 60 }) genre!: string;
  @decimal() price!: number;
  @decimal({ optional: true }) oldPrice?: number;
  @text({ optional: true, max: 40 }) badge?: string;
  @text() imageUrl!: string;
  @text({ max: 40 }) platform!: string;
  @text({ max: 12 }) ageRating!: string;
  @text() description!: string;
  @boolean({ default: false }) featured!: boolean;
}
