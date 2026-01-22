import { api } from "../lib/api/client";
import type { ApiResponse, PointApplicationResponse } from "../lib/api/types";

export type OutfitPriceRange = {
  minPrice: number;
  maxPrice: number;
};

export type FashionImageList = {
  front: string[];
  left: string[];
  right: string[];
  favorite: string[];
  purpose?: string[];
};

export type FashionConcern = {
  height: number;
  weight: number;
  topSize: "S" | "M" | "L" | "XL" | "XXL";
  bottomSize: "S" | "M" | "L" | "XL" | "XXL";
  bodyTypeDisadvantages: string[];
  bodyTypeEtcText?: string;
  styleColors: string[];
  styleFits: string[];
  styleImages: string[];
  styleEtcText?: string;
  outfitItems: string[];
  outfitPriceRange: OutfitPriceRange;
  outfitEtcText?: string;
  images: FashionImageList;
};

export type UpdateFashionConcernRequest = {
  fashion: FashionConcern;
};

export type UpdateReservationConcernResponse = {
  reservationId: number;
  concern: Record<string, unknown>;
  message: string;
};

export type TempReservationRequest = {
  expertId: number;
  category: "HAIR" | "FASHION" | "SKIN" | "MAKEUP";
  consultationType: "MESSAGE" | "VIDEO";
  scheduledDateTime?: string | null;
  price: number;
};

export type TempReservationResponse = {
  reservationId: number;
  expertId: number;
  category: "HAIR" | "FASHION" | "SKIN" | "MAKEUP";
  consultationType: "MESSAGE" | "VIDEO";
  scheduledDateTime?: string;
  price: number;
  reservationStatus: string;
};

export type ApplyPointsRequest = {
  pointsToUse: number;
};

export type AvailableDatesResponse = {
  year: number;
  month: number;
  availableDates: string[];
};

export type AvailableTimesResponse = {
  date: string;
  availableTimes: string[];
};

export type ReservationSheetTargetInfo = {
  expertNickname: string;
  category: "HAIR" | "FASHION" | "SKIN" | "MAKEUP" | string;
  consultationType: "MESSAGE" | "VIDEO" | string;
  originalPrice: number;
};

export type ReservationSheetPayerInfo = {
  userNickname: string;
  totalPoints: number;
};

export type ReservationSheetAccountInfo = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type ReservationSheetResponse = {
  createdAt: string;
  paymentDeadline: string;
  targetInfo: ReservationSheetTargetInfo;
  payerInfo: ReservationSheetPayerInfo;
  accountInfo: ReservationSheetAccountInfo;
};

export const reservationService = {
  async getAvailableDates(params: {
    expertId: number;
    year: number;
    month: number;
  }): Promise<ApiResponse<AvailableDatesResponse>> {
    return await api.get<ApiResponse<AvailableDatesResponse>>("/reservations/dates", { params });
  },
  async getAvailableTimes(params: {
    expertId: number;
    date: string;
  }): Promise<ApiResponse<AvailableTimesResponse>> {
    return await api.get<ApiResponse<AvailableTimesResponse>>("/reservations/times", { params });
  },
  async getReservationSheet(params: {
    expertId: number;
    type: "MESSAGE" | "VIDEO";
  }): Promise<ApiResponse<ReservationSheetResponse>> {
    return await api.get<ApiResponse<ReservationSheetResponse>>("/reservations/sheet", {
      params,
    });
  },
  async updateFashionConcern(
    reservationId: number,
    payload: UpdateFashionConcernRequest,
  ): Promise<ApiResponse<UpdateReservationConcernResponse>> {
    return await api.put<ApiResponse<UpdateReservationConcernResponse>>(
      `/reservations/${reservationId}/fashion-concern`,
      payload,
    );
  },
  // 상담 예약 시작 시 임시 예약 생성
  async createTempReservation(
    payload: TempReservationRequest,
  ): Promise<ApiResponse<TempReservationResponse>> {
    return await api.post<ApiResponse<TempReservationResponse>>(
      "/reservations/temp",
      payload,
    );
  },
  async applyPoints(
    reservationId: number,
    payload: ApplyPointsRequest,
  ): Promise<ApiResponse<PointApplicationResponse>> {
    return await api.put<ApiResponse<PointApplicationResponse>>(
      `/reservations/${reservationId}/points`,
      payload,
    );
  },
  async submitReservation(reservationId: number): Promise<ApiResponse<void>> {
    return await api.post<ApiResponse<void>>(`/reservations/${reservationId}/submit`);
  },
  async cancelTempReservation(reservationId: number): Promise<ApiResponse<void>> {
    return await api.post<ApiResponse<void>>(`/reservations/${reservationId}/cancel`);
  },
  async requestRefund(reservationId: number): Promise<ApiResponse<void>> {
    return await api.post<ApiResponse<void>>(`/reservations/${reservationId}/refund/request`);
  },
};
