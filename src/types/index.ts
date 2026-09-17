export interface BaliCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface BaliProductOption {
  id: string;
  product_id: string;
  globaltix_ticket_type_id: number;
  option_name: string;
  description: string;
  b2b_price_idr: number;
  markup_type: 'percentage' | 'fixed';
  markup_value: number;
  selling_price_idr: number;
  min_pax: number;
  max_pax: number;
  is_active: boolean;
}

export interface BaliProduct {
  id: string;
  globaltix_product_id: number;
  title: string;
  slug: string;
  category_slug: string;
  location_area: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  cancellation_policy: string;
  images: string[];
  base_price_idr: number;
  selling_price_idr: number;
  markup_percent: number;
  rating: number;
  review_count: number;
  duration: string;
  is_featured: boolean;
  is_active: boolean;
  last_synced_at: string;
  options?: BaliProductOption[];
}

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed' | 'refunded';
export type GlobalTixStatus = 'unreserved' | 'reserved' | 'confirmed' | 'released';

export interface BookingRecord {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  hotel_pickup_address?: string;
  product_id: string;
  product_option_id: string;
  product_title: string;
  option_name: string;
  visit_date: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: string;
  globaltix_status: GlobalTixStatus;
  globaltix_booking_ref?: string;
  reservation_expires_at?: string;
  confirmed_at?: string;
  voucher_pdf_url?: string;
  ticket_codes: Array<{
    ticket_id: string;
    barcode: string;
    passenger_name: string;
  }>;
  notes?: string;
  created_at: string;
}

export interface GlobalTixConfig {
  environment: 'sandbox' | 'production';
  api_base_url: string;
  client_id: string;
  client_secret: string;
  is_connected: boolean;
  token_status: string;
}

export interface MarkupSetting {
  default_type: 'percentage' | 'fixed';
  default_value: number;
  min_margin_idr: number;
  auto_round_up_thousand: boolean;
}
