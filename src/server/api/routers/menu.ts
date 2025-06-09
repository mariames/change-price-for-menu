import { z } from 'zod';
import { router, publicProcedure } from '../../trpc';
import { db } from '../../db';
import { menuImages, priceUpdates } from '../../db/schema';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const RegionSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const PriceUpdateSchema = z.object({
  originalPrice: z.string(),
  newPrice: z.string(),
  coordinates: RegionSchema,
});

export const menuRouter = router({
  uploadImage: publicProcedure
    .input(z.object({
      imageUrl: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('uploadImage called with input:', input);
        console.log('uploadImage input type:', typeof input);
        console.log('uploadImage input keys:', Object.keys(input));
        // Here you would save the image URL to your database
        // For now, we'll just return a mock ID
        return { id: 1 };
      } catch (error) {
        console.error('Error in uploadImage:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload image',
          cause: error,
        });
      }
    }),

  detectPrices: publicProcedure
    .input(z.object({
      imageUrl: z.string(),
      region: RegionSchema,
    }))
    .query(async ({ input, ctx }) => {
      try {
        console.log('detectPrices called with:', input);
        // Here you would use Tesseract.js to detect prices in the region
        // For now, we'll return a mock price
        return '$9.99';
      } catch (error) {
        console.error('Error in detectPrices:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to detect prices',
          cause: error,
        });
      }
    }),

  updatePrices: publicProcedure
    .input(z.object({
      menuImageId: z.number(),
      priceUpdates: z.array(PriceUpdateSchema),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('updatePrices called with:', input);
        // Here you would update the prices in your database
        // For now, we'll just return success
        return { success: true };
      } catch (error) {
        console.error('Error in updatePrices:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update prices',
          cause: error,
        });
      }
    }),
}); 