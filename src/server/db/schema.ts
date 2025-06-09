import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const menuImages = pgTable('menu_images', {
  id: serial('id').primaryKey(),
  originalImageUrl: text('original_image_url').notNull(),
  processedImageUrl: text('processed_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const priceUpdates = pgTable('price_updates', {
  id: serial('id').primaryKey(),
  menuImageId: serial('menu_image_id').references(() => menuImages.id),
  originalPrice: varchar('original_price', { length: 20 }).notNull(),
  newPrice: varchar('new_price', { length: 20 }).notNull(),
  coordinates: text('coordinates').notNull(), // JSON string of x, y coordinates
  createdAt: timestamp('created_at').defaultNow(),
}); 