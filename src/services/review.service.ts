import { api } from '../lib/api/client';
import type { ApiResponse, ReviewSummaryResponse } from '../lib/api/types';
import type { ApiCategory } from '../lib/utils/category';

type RecentReviewParams = {
  category?: ApiCategory;
  page?: number;
  size?: number;
};

export const reviewService = {
  async getRecentReviews(params: RecentReviewParams): Promise<ApiResponse<ReviewSummaryResponse[]>> {
    return await api.get<ApiResponse<ReviewSummaryResponse[]>>('/review/recent', {
      params,
    });
  },
  async getBestReviews(params?: {
    category?: ApiCategory;
  }): Promise<ApiResponse<ReviewSummaryResponse[]>> {
    return await api.get<ApiResponse<ReviewSummaryResponse[]>>('/review/best', {
      params,
    });
  },
};
