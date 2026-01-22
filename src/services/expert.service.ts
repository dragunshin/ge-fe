import { api } from '../lib/api/client';
import type {
  ApiResponse,
  ExpertInfoResponse,
  ExpertPortfolioResponse,
  ExpertScheduleResponse,
  ExpertSummaryResponse,
  PopularExpertsResponse,
} from '../lib/api/types';
import type { AvailableTimesResponse } from './reservation.service';
import type { ApiCategory } from '../lib/utils/category';

export type PortfolioCreateRequest = {
  title: string;
  concern: string;
  solution: string;
  beforeImage: string;
  afterImage: string;
  hashtags?: string[];
};

export type PortfolioUpdateRequest = Partial<PortfolioCreateRequest>;

export type ToggleRepresentativePortfolioRequest = {
  portfolioId: number;
};

export type ToggleRepresentativePortfolioResponse = {
  portfolioId: number;
  isRepresentative: boolean;
};

export type UpdateExpertInfoRequest = {
  introduction?: string;
  profileLink?: string;
  careerInfo?: string;
};

export type UpdateExpertImagesRequest = {
  profileImageKey?: string;
  backgroundImageKey?: string;
};

export type AvailableScheduleUpdateRequest = {
  availableDate: string;
  availableTimes: string[];
};

export type ConsultationScheduleUpdateItem = {
  consultationType: "MESSAGE" | "VIDEO";
  price: number;
  isActive: boolean;
};

export type ConsultationScheduleUpdateRequest = {
  schedules: ConsultationScheduleUpdateItem[];
};

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
  async getExpertPortfolios(
    userId: number,
    params?: { page?: number; size?: number },
  ): Promise<ApiResponse<ExpertPortfolioResponse[]>> {
    return await api.get<ApiResponse<ExpertPortfolioResponse[]>>(
      `/expert/${userId}/portfolios`,
      { params },
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

  async createPortfolio(
    payload: PortfolioCreateRequest,
  ): Promise<ApiResponse<ExpertPortfolioResponse>> {
    return await api.post<ApiResponse<ExpertPortfolioResponse>>("/expert/portfolios", payload);
  },

  async updatePortfolio(
    portfolioId: number,
    payload: PortfolioUpdateRequest,
  ): Promise<ApiResponse<ExpertPortfolioResponse>> {
    return await api.put<ApiResponse<ExpertPortfolioResponse>>(
      `/expert/portfolios/${portfolioId}`,
      payload,
    );
  },

  async deletePortfolio(portfolioId: number): Promise<ApiResponse<void>> {
    return await api.delete<ApiResponse<void>>(`/expert/portfolios/${portfolioId}`);
  },

  async toggleRepresentativePortfolio(
    payload: ToggleRepresentativePortfolioRequest,
  ): Promise<ApiResponse<ToggleRepresentativePortfolioResponse>> {
    return await api.patch<ApiResponse<ToggleRepresentativePortfolioResponse>>(
      "/expert/portfolios/representative",
      payload,
    );
  },

  async updateExpertInfo(payload: UpdateExpertInfoRequest): Promise<ApiResponse<ExpertInfoResponse>> {
    return await api.put<ApiResponse<ExpertInfoResponse>>("/expert/me/info", payload);
  },

  async updateExpertImages(
    payload: UpdateExpertImagesRequest,
  ): Promise<ApiResponse<ExpertInfoResponse>> {
    return await api.put<ApiResponse<ExpertInfoResponse>>("/expert/me/images", payload);
  },

  async updateAvailableSchedules(
    payload: AvailableScheduleUpdateRequest,
  ): Promise<ApiResponse<AvailableTimesResponse>> {
    return await api.put<ApiResponse<AvailableTimesResponse>>("/expert/available-schedules", payload);
  },

  async updateConsultationSchedules(
    payload: ConsultationScheduleUpdateRequest,
  ): Promise<ApiResponse<ExpertScheduleResponse[]>> {
    return await api.put<ApiResponse<ExpertScheduleResponse[]>>("/expert/schedules", payload);
  },
};
