export interface Dispensary {
  url: string;
  name: string;
  is_open: boolean;
  description?: string;
  logo_url?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  rating?: number;
  delivery_time?: string;
  minimum_order?: number;
  delivery_fee?: number;
  metadata: Record<string, unknown>;
}

export interface DispensaryListResponse {
  dispensaries: Dispensary[];
  total: number;
  page: number;
  per_page: number;
} 