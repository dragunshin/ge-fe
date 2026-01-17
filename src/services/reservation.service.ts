import { api } from "../lib/api/client";
import type { ApiResponse } from "../lib/api/types";

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

export const reservationService = {
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
};
