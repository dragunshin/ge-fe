import { api } from '../lib/api/client';
import type {
  ApiResponse,
  ExpertInfoResponse,
  ExpertScheduleResponse,
  ExpertSummaryResponse,
  PopularExpertsResponse,
} from '../lib/api/types';
import type { ApiCategory } from '../lib/utils/category';

export const expertService = {
  async getExpertList(params: {
    category?: ApiCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<ExpertSummaryResponse[]>> {
    return await api.get<ApiResponse<ExpertSummaryResponse[]>>('/expert', {
      params,
    });
  },
  async getExpertInfo(userId: number): Promise<ApiResponse<ExpertInfoResponse>> {
    return await api.get<ApiResponse<ExpertInfoResponse>>(`/expert/${userId}`);
  },
  async getExpertSchedules(
    userId: number,
  ): Promise<ApiResponse<ExpertScheduleResponse[]>> {
    return await api.get<ApiResponse<ExpertScheduleResponse[]>>(
      `/expert/${userId}/schedules`,
    );
  },

  async getTopExperts(category?: ApiCategory): Promise<ApiResponse<PopularExpertsResponse>> {
    if (category) {
      return await api.get<ApiResponse<PopularExpertsResponse>>(`/expert/popular/${category}`);
    }
    return await api.get<ApiResponse<PopularExpertsResponse>>('/expert/popular');
  },

  async likeExpert(userId: number): Promise<ApiResponse<Record<string, unknown>>> {
    return await api.post<ApiResponse<Record<string, unknown>>>(`/expert/${userId}/like`);
  },

  async unlikeExpert(userId: number): Promise<ApiResponse<Record<string, unknown>>> {
    return await api.delete<ApiResponse<Record<string, unknown>>>(`/expert/${userId}/like`);
  },

  async getLikedExperts(params?: {
    category?: ApiCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<ExpertSummaryResponse[]>> {
    return await api.get<ApiResponse<ExpertSummaryResponse[]>>('/expert/likes', {
      params,
    });
  },
};
