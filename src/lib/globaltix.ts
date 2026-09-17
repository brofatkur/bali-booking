import { GlobalTixConfig } from '../types';

export interface GlobalTixReservePayload {
  ticketTypeId: number;
  visitDate: string; // YYYY-MM-DD
  quantity: number;
  leadPassenger: {
    name: string;
    email: string;
    phone: string;
  };
  pickupNotes?: string;
}

export interface GlobalTixReserveResponse {
  success: boolean;
  reservationRef: string;
  expiresAt: string; // ISO 8601 (60 minutes from now)
  totalAmountB2B: number;
  currency: string;
  message?: string;
}

export interface GlobalTixConfirmResponse {
  success: boolean;
  bookingRef: string;
  confirmedAt: string;
  voucherUrl: string;
  tickets: Array<{
    ticketId: string;
    barcode: string;
    passengerName: string;
  }>;
}

class GlobalTixApiClient {
  private config: GlobalTixConfig = {
    environment: 'sandbox',
    api_base_url: 'https://stg-api.globaltix.com/api',
    client_id: 'BALI_EXPLORE_AGENT',
    client_secret: 'gtx_sec_sandbox_bali2026',
    is_connected: true,
    token_status: 'active',
  };

  private cachedToken: { token: string; expiresAt: number } | null = null;

  constructor() {
    const saved = localStorage.getItem('globaltix_config');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved GlobalTix config', e);
      }
    }
  }

  public getConfig(): GlobalTixConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<GlobalTixConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.config.api_base_url =
      this.config.environment === 'production'
        ? 'https://sg-api.globaltix.com/api'
        : 'https://stg-api.globaltix.com/api';
    localStorage.setItem('globaltix_config', JSON.stringify(this.config));
    this.cachedToken = null;
  }

  /**
   * Acquire or reuse Bearer Token from GlobalTix auth endpoint
   */
  public async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60000) {
      return this.cachedToken.token;
    }

    try {
      // In live mode with valid account manager credentials:
      // const response = await fetch(`${this.config.api_base_url}/auth/authorize`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'x-api-key': this.config.client_secret },
      //   body: JSON.stringify({ client_id: this.config.client_id, client_secret: this.config.client_secret })
      // });
      // const json = await response.json();

      // Simulated realistic token valid for 24h
      const mockToken = `gtx_${this.config.environment}_tok_${Math.random().toString(36).substring(2, 15)}`;
      this.cachedToken = {
        token: mockToken,
        expiresAt: now + 24 * 60 * 60 * 1000,
      };
      return mockToken;
    } catch (err) {
      console.warn('GlobalTix Auth fallback to local session token', err);
      return `gtx_fallback_${Date.now()}`;
    }
  }

  /**
   * Check real-time date availability for specific ticket type
   */
  public async checkAvailability(
    _ticketTypeId: number,
    visitDate: string,
    _quantity: number
  ): Promise<{ available: boolean; remainingQuota: number; priceB2B: number }> {
    // Real GlobalTix call:
    // const token = await this.getAccessToken();
    // await fetch(`${this.config.api_base_url}/ticket/availability`, ...)

    // Simulate real-time API latency & check
    await new Promise((r) => setTimeout(r, 400));
    
    // Check if visit date is in the past
    const selected = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      return { available: false, remainingQuota: 0, priceB2B: 0 };
    }

    return {
      available: true,
      remainingQuota: 45,
      priceB2B: 280000,
    };
  }

  /**
   * Step 1 of 2-Phase Booking: Hold reservation for 60 minutes
   */
  public async reserveBooking(payload: GlobalTixReservePayload): Promise<GlobalTixReserveResponse> {
    await new Promise((r) => setTimeout(r, 600));

    const reservationRef = `GTX-RES-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    return {
      success: true,
      reservationRef,
      expiresAt,
      totalAmountB2B: 280000 * payload.quantity,
      currency: 'IDR',
      message: 'Reservation held successfully. Please confirm within 60 minutes.',
    };
  }

  /**
   * Step 2 of 2-Phase Booking: Confirm reservation and issue e-ticket
   */
  public async confirmBooking(
    reservationRef: string,
    bookingCode: string,
    customerName: string,
    quantity: number
  ): Promise<GlobalTixConfirmResponse> {
    await new Promise((r) => setTimeout(r, 750));

    const tickets = Array.from({ length: quantity }, (_, index) => {
      const ticketId = `TIX-${Date.now().toString(36).toUpperCase()}-${index + 1}`;
      const barcode = `GTX${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      return {
        ticketId,
        barcode,
        passengerName: index === 0 ? customerName : `${customerName} (Guest ${index + 1})`,
      };
    });

    return {
      success: true,
      bookingRef: reservationRef.replace('GTX-RES', 'GTX-CONF'),
      confirmedAt: new Date().toISOString(),
      voucherUrl: `https://apiconnect.globaltix.com/vouchers/${bookingCode}.pdf`,
      tickets,
    };
  }

  /**
   * Release reservation if booking is cancelled or payment expired
   */
  public async releaseBooking(reservationRef: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      message: `Reservation ${reservationRef} has been released and credit restored.`,
    };
  }

  /**
   * Sync Bali catalog products from GlobalTix API
   */
  public async fetchBaliCatalog(): Promise<any[]> {
    await new Promise((r) => setTimeout(r, 900));
    return [
      {
        globaltix_product_id: 51001,
        title: 'Tanjung Benoa Watersport Combo (Banana Boat, Jet Ski & Parasailing)',
        location: 'Tanjung Benoa, Nusa Dua',
        status: 'PUBLISHED',
      },
      {
        globaltix_product_id: 51002,
        title: 'Ubud Jungle ATV Quad Bike & Rafting Sungai Ayung Adventure',
        location: 'Ubud, Gianyar',
        status: 'PUBLISHED',
      },
      {
        globaltix_product_id: 51003,
        title: 'Gunung Batur Sunrise Trekking & Pemandian Air Panas Alami Kintamani',
        location: 'Kintamani, Bangli',
        status: 'PUBLISHED',
      },
      {
        globaltix_product_id: 51004,
        title: 'One Day Nusa Penida Tour Barat + Snorkeling Manta Bay',
        location: 'Nusa Penida, Klungkung',
        status: 'PUBLISHED',
      },
      {
        globaltix_product_id: 51005,
        title: 'Tiket Resmi Pertunjukan Tari Kecak & Api Uluwatu Sunset',
        location: 'Uluwatu, Badung',
        status: 'PUBLISHED',
      },
    ];
  }
}

export const globalTix = new GlobalTixApiClient();
