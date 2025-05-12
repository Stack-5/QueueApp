import { number, object, string } from "zod";


export const customerRatingSchema = object({
  cashierUid: string().min(1, "cashierUid can not be empty"),
  rating: number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .int("Rating must be an integer"),
  comment: string().nullable(),
  timestamp: number(),
});
