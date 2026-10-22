import { insforge, INSFORGE_BASE_URL } from './insforge';
import {
  BaliProduct,
  BaliCategory,
  BaliProductOption,
  BookingRecord,
  GlobalTixConfig,
} from '../types';

export interface DbConnectionStatus {
  connected: boolean;
  latencyMs: number;
  baseUrl: string;
  productCount: number;
  optionCount: number;
  bookingCount: number;
  lastChecked: string;
  error?: string;
}

const fallbackCategories: BaliCategory[] = [
  { id: '1', slug: 'theme-waterpark', name: 'Waterpark & Theme Park', icon: 'Waves', sort_order: 1 },
  { id: '2', slug: 'wildlife-safari', name: 'Safari & Satwa Bali', icon: 'Compass', sort_order: 2 },
  { id: '3', slug: 'beach-club', name: 'Beach Club & Sunset', icon: 'Sparkles', sort_order: 3 },
  { id: '4', slug: 'watersport', name: 'Watersport & Bahari', icon: 'Waves', sort_order: 4 },
  { id: '5', slug: 'adventure-atv', name: 'ATV, Rafting & Swing', icon: 'Compass', sort_order: 5 },
  { id: '6', slug: 'island-cruise', name: 'Nusa Penida & Cruise', icon: 'Ship', sort_order: 6 },
  { id: '7', slug: 'cultural-dance', name: 'Budaya, Pura & Kecak', icon: 'Sparkles', sort_order: 7 },
  { id: '8', slug: 'trekking-nature', name: 'Gunung Batur & Alam', icon: 'Mountain', sort_order: 8 },
];

const fallbackBaliProducts: BaliProduct[] = [
  {
    id: 'c0c87158-4034-477a-9de3-477cb451d5b8',
    globaltix_product_id: 10241,
    title: 'Waterbom Bali - Single Day Pass (Waterpark #1 di Asia)',
    slug: 'waterbom-bali-day-pass',
    category_slug: 'theme-waterpark',
    location_area: 'Kuta, Badung',
    description:
      'Nikmati hari penuh keseruan di Waterbom Bali, waterpark terbaik #1 di Asia versi TripAdvisor! Rasakan wahana seluncuran kelas dunia seperti Climax, Pipeline, Boomerang, dan Twin Racers di tengah taman tropis rimbun seluas 3,8 hektar di jantung Kuta.',
    highlights: [
      'Akses seharian penuh ke seluruh 26 wahana seluncuran kelas dunia termasuk area baru Oasis Gardens',
      'Wahana ekstrem Climax, Smashdown 2.0, Fast & Fierce, serta Lazy River yang santai',
      'Standar keamanan internasional EarthCheck Gold Certified di Kuta Bali',
      'E-Voucher GlobalTix langsung scan di gerbang masuk tanpa antre loket',
    ],
    inclusions: [
      'Tiket Masuk Seharian Penuh (Single Day Pass) Waterbom Bali',
      'Akses ke seluruh seluncuran air, kolam renang, dan fasilitas sun lounger',
      'Wi-Fi gratis di area taman air',
      'Asuransi keselamatan pengunjung di dalam area',
    ],
    exclusions: [
      'Sewa handuk, loker, dan gazebo privat',
      'Makanan & minuman (menggunakan gelang Splash Band non-tunai)',
      'Transportasi menuju lokasi di Jl. Kartika Plaza Kuta',
    ],
    cancellation_policy: 'Tiket berlaku fleksibel sesuai tanggal terpilih. Reschedule gratis hingga H-1.',
    images: [
      'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    ],
    base_price_idr: 415000,
    selling_price_idr: 485000,
    markup_percent: 16.87,
    rating: 4.9,
    review_count: 2840,
    duration: 'Seharian (09:00 - 18:00)',
    is_featured: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    options: [
      {
        id: 'opt-10241-1',
        product_id: 'c0c87158-4034-477a-9de3-477cb451d5b8',
        globaltix_ticket_type_id: 20101,
        option_name: 'Single Day Pass - Dewasa (Adult 12+ Tahun)',
        description: 'Akses penuh seluruh seluncuran dan kolam Waterbom Bali seharian',
        b2b_price_idr: 415000,
        markup_type: 'percentage',
        markup_value: 16.87,
        selling_price_idr: 485000,
        min_pax: 1,
        max_pax: 15,
        is_active: true,
      },
      {
        id: 'opt-10241-2',
        product_id: 'c0c87158-4034-477a-9de3-477cb451d5b8',
        globaltix_ticket_type_id: 20102,
        option_name: 'Single Day Pass - Anak (Child 2-11 Tahun)',
        description: 'Tiket masuk anak seharian penuh termasuk area Funtastic',
        b2b_price_idr: 330000,
        markup_type: 'percentage',
        markup_value: 16.67,
        selling_price_idr: 385000,
        min_pax: 1,
        max_pax: 15,
        is_active: true,
      },
    ],
  },
  {
    id: '46e3b0a6-a83f-4496-bf40-d7e42b8c58b5',
    globaltix_product_id: 10412,
    title: 'Taman Safari Bali (Bali Safari & Marine Park) - Jungle Hopper Pass',
    slug: 'taman-safari-bali-jungle-hopper',
    category_slug: 'wildlife-safari',
    location_area: 'Gianyar, Bali',
    description:
      'Jelajahi habitat lebih dari 120 spesies satwa langka dari 3 negara (Indonesia, India, dan Afrika) di Taman Safari Bali. Paket resmi GlobalTix ini sudah mencakup Safari Journey dengan trem khusus, pertunjukan edukasi satwa, Harimau Show, dan Gajah Show.',
    highlights: [
      'Safari Journey dengan trem ber-AC melintasi habitat satwa lepas seperti Singa, Badak, dan Zebra',
      'Menonton Animal Educational Presentation, Harimau Show, dan Elephant Conservation Show',
      'Akses ke area Fresh Water Aquarium dan Fun Zone',
    ],
    inclusions: [
      'Tiket Masuk Taman Safari Bali',
      '1x Safari Journey Tour menggunakan Trem Khusus',
      'Akses semua pertunjukan edukasi satwa sesuai jadwal',
    ],
    exclusions: ['Makan siang di Tsavo Lion Restaurant', 'Transportasi hotel'],
    cancellation_policy: 'Pembatalan gratis hingga 24 jam sebelum tanggal kunjungan.',
    images: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80',
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80',
    ],
    base_price_idr: 520000,
    selling_price_idr: 600000,
    markup_percent: 15.38,
    rating: 4.9,
    review_count: 1950,
    duration: '5 - 7 Jam',
    is_featured: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    options: [
      {
        id: 'opt-10412-1',
        product_id: '46e3b0a6-a83f-4496-bf40-d7e42b8c58b5',
        globaltix_ticket_type_id: 20201,
        option_name: 'Explorer Pass (Khusus WNI / KTP Indonesia) - Dewasa',
        description: 'Termasuk 1x Safari Journey Tram, Animal Show, Harimau Show & Elephant Show',
        b2b_price_idr: 145000,
        markup_type: 'percentage',
        markup_value: 20,
        selling_price_idr: 175000,
        min_pax: 1,
        max_pax: 20,
        is_active: true,
      },
      {
        id: 'opt-10412-2',
        product_id: '46e3b0a6-a83f-4496-bf40-d7e42b8c58b5',
        globaltix_ticket_type_id: 20202,
        option_name: 'Jungle Hopper Pass (All Nationalities / WNA & WNI)',
        description: 'Paket favorit internasional mencakup Safari Journey & semua pertunjukan',
        b2b_price_idr: 520000,
        markup_type: 'percentage',
        markup_value: 15.38,
        selling_price_idr: 600000,
        min_pax: 1,
        max_pax: 20,
        is_active: true,
      },
    ],
  },
];

/**
 * Verify live connectivity to InsForge PostgreSQL backend
 */
export async function checkInsForgeConnection(): Promise<DbConnectionStatus> {
  const start = performance.now();
  try {
    const [pRes, oRes, bRes] = await Promise.all([
      insforge.database.from('bali_products').select('id'),
      insforge.database.from('bali_product_options').select('id'),
      insforge.database.from('bali_bookings').select('id'),
    ]);

    const latencyMs = Math.round(performance.now() - start);

    if (pRes.error) {
      return {
        connected: false,
        latencyMs,
        baseUrl: INSFORGE_BASE_URL,
        productCount: 0,
        optionCount: 0,
        bookingCount: 0,
        lastChecked: new Date().toISOString(),
        error: pRes.error.message,
      };
    }

    return {
      connected: true,
      latencyMs,
      baseUrl: INSFORGE_BASE_URL,
      productCount: Array.isArray(pRes.data) ? pRes.data.length : 0,
      optionCount: Array.isArray(oRes.data) ? oRes.data.length : 0,
      bookingCount: Array.isArray(bRes.data) ? bRes.data.length : 0,
      lastChecked: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - start),
      baseUrl: INSFORGE_BASE_URL,
      productCount: 0,
      optionCount: 0,
      bookingCount: 0,
      lastChecked: new Date().toISOString(),
      error: err?.message || 'Network error',
    };
  }
}

export async function fetchCategories(): Promise<BaliCategory[]> {
  try {
    const { data, error } = await insforge.database
      .from('bali_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }
    return data as BaliCategory[];
  } catch (err) {
    console.warn('Using fallback categories due to network error', err);
    return fallbackCategories;
  }
}

export async function fetchProducts(): Promise<BaliProduct[]> {
  try {
    const [pResult, oResult] = await Promise.all([
      insforge.database
        .from('bali_products')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('globaltix_product_id', { ascending: true }),
      insforge.database.from('bali_product_options').select('*'),
    ]);

    if (pResult.error || !pResult.data || pResult.data.length === 0) {
      const local = getStoredLocalProducts();
      return local.length > 0 ? local : fallbackBaliProducts;
    }

    const optionsList = (oResult.data as BaliProductOption[]) || [];

    const products: BaliProduct[] = (pResult.data as any[]).map((p) => {
      const options = optionsList
        .filter((o) => o.product_id === p.id)
        .map((o) => ({
          ...o,
          b2b_price_idr: Number(o.b2b_price_idr),
          selling_price_idr: Number(o.selling_price_idr),
          markup_value: Number(o.markup_value || 15),
        }));

      return {
        ...p,
        base_price_idr: Number(p.base_price_idr),
        selling_price_idr: Number(p.selling_price_idr),
        markup_percent: Number(p.markup_percent),
        rating: Number(p.rating || 4.8),
        review_count: Number(p.review_count || 100),
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
        exclusions: Array.isArray(p.exclusions) ? p.exclusions : [],
        images: Array.isArray(p.images) ? p.images : [],
        options,
      };
    });

    try {
      localStorage.setItem('cached_bali_products', JSON.stringify(products));
    } catch {
      // ignore storage quota errors
    }
    return products;
  } catch (err) {
    console.warn('Falling back to cached products', err);
    const local = getStoredLocalProducts();
    return local.length > 0 ? local : fallbackBaliProducts;
  }
}

export function getStoredLocalProducts(): BaliProduct[] {
  try {
    const cached = localStorage.getItem('cached_bali_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export async function fetchProductById(id: string): Promise<BaliProduct | null> {
  const all = await fetchProducts();
  return all.find((p) => p.id === id || p.slug === id) || null;
}

export async function updateProductMarkup(
  productId: string,
  newMarkupPercent: number
): Promise<boolean> {
  try {
    const products = await fetchProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const newSellingPrice =
      Math.ceil((Number(product.base_price_idr) * (1 + newMarkupPercent / 100)) / 1000) * 1000;

    await insforge.database
      .from('bali_products')
      .update({
        markup_percent: newMarkupPercent,
        selling_price_idr: newSellingPrice,
        last_synced_at: new Date().toISOString(),
      })
      .eq('id', productId);

    // Also update option selling prices proportionally in InsForge DB
    if (product.options && product.options.length > 0) {
      for (const opt of product.options) {
        const optSelling =
          Math.ceil((Number(opt.b2b_price_idr) * (1 + newMarkupPercent / 100)) / 1000) * 1000;
        await insforge.database
          .from('bali_product_options')
          .update({
            markup_value: newMarkupPercent,
            selling_price_idr: optSelling,
          })
          .eq('id', opt.id);
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to update product markup', err);
    return false;
  }
}

export async function toggleProductStatus(
  productId: string,
  isActive: boolean
): Promise<boolean> {
  try {
    await insforge.database
      .from('bali_products')
      .update({ is_active: isActive })
      .eq('id', productId);
    return true;
  } catch (err) {
    console.error('Failed to toggle product status', err);
    return false;
  }
}

// ----------------------------------------------------
// SYSTEM SETTINGS IN INSFORGE DATABASE
// ----------------------------------------------------

export async function fetchGlobalTixSettingsFromDb(): Promise<GlobalTixConfig | null> {
  try {
    const { data, error } = await insforge.database
      .from('bali_system_settings')
      .select('*')
      .eq('setting_key', 'globaltix_config');

    if (error || !data || data.length === 0) return null;
    const row = data[0] as any;
    return row.setting_value as GlobalTixConfig;
  } catch {
    return null;
  }
}

export async function saveGlobalTixSettingsToDb(config: GlobalTixConfig): Promise<boolean> {
  try {
    const { error } = await insforge.database
      .from('bali_system_settings')
      .update({
        setting_value: config,
        updated_at: new Date().toISOString(),
      })
      .eq('setting_key', 'globaltix_config');
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// BOOKING MANAGEMENT (INSFORGE POSTGRESQL)
// ----------------------------------------------------

export async function fetchBookings(): Promise<BookingRecord[]> {
  try {
    const { data, error } = await insforge.database
      .from('bali_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return getStoredLocalBookings();
    }

    const records = (data as any[]).map((b) => ({
      ...b,
      unit_price: Number(b.unit_price),
      total_amount: Number(b.total_amount),
      quantity: Number(b.quantity),
      ticket_codes: Array.isArray(b.ticket_codes) ? b.ticket_codes : [],
    }));

    try {
      localStorage.setItem('cached_bali_bookings', JSON.stringify(records));
    } catch {
      // ignore
    }
    return records as BookingRecord[];
  } catch (err) {
    console.warn('Falling back to local bookings', err);
    return getStoredLocalBookings();
  }
}

export function getStoredLocalBookings(): BookingRecord[] {
  try {
    const cached = localStorage.getItem('cached_bali_bookings');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }
  return [];
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidUUID(val?: string): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export async function saveBooking(booking: Partial<BookingRecord>): Promise<BookingRecord> {
  const newBooking: BookingRecord = {
    id: isValidUUID(booking.id) ? booking.id! : generateUUID(),
    booking_code:
      booking.booking_code ||
      `BALI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    customer_name: booking.customer_name || 'Wisatawan Bali',
    customer_email: booking.customer_email || 'guest@example.com',
    customer_phone: booking.customer_phone || '+628123456789',
    hotel_pickup_address: booking.hotel_pickup_address || '',
    product_id: isValidUUID(booking.product_id) ? booking.product_id! : '',
    product_option_id: isValidUUID(booking.product_option_id) ? booking.product_option_id! : '',
    product_title: booking.product_title || '',
    option_name: booking.option_name || '',
    visit_date: booking.visit_date || new Date().toISOString().split('T')[0],
    quantity: booking.quantity || 1,
    unit_price: booking.unit_price || 0,
    total_amount: booking.total_amount || 0,
    payment_status: booking.payment_status || 'pending',
    payment_method: booking.payment_method || 'qris',
    globaltix_status: booking.globaltix_status || 'reserved',
    globaltix_booking_ref: booking.globaltix_booking_ref || '',
    reservation_expires_at: booking.reservation_expires_at || new Date(Date.now() + 3600000).toISOString(),
    confirmed_at: booking.confirmed_at || new Date().toISOString(),
    voucher_pdf_url: booking.voucher_pdf_url || '',
    ticket_codes: booking.ticket_codes || [],
    notes: booking.notes || '',
    created_at: new Date().toISOString(),
  };

  try {
    // Build database payload omitting empty UUID foreign keys if not valid UUID
    const dbPayload: Record<string, any> = {
      id: newBooking.id,
      booking_code: newBooking.booking_code,
      customer_name: newBooking.customer_name,
      customer_email: newBooking.customer_email,
      customer_phone: newBooking.customer_phone,
      hotel_pickup_address: newBooking.hotel_pickup_address,
      product_title: newBooking.product_title,
      option_name: newBooking.option_name,
      visit_date: newBooking.visit_date,
      quantity: newBooking.quantity,
      unit_price: newBooking.unit_price,
      total_amount: newBooking.total_amount,
      payment_status: newBooking.payment_status,
      payment_method: newBooking.payment_method,
      globaltix_status: newBooking.globaltix_status,
      globaltix_booking_ref: newBooking.globaltix_booking_ref,
      reservation_expires_at: newBooking.reservation_expires_at,
      confirmed_at: newBooking.confirmed_at,
      voucher_pdf_url: newBooking.voucher_pdf_url,
      ticket_codes: newBooking.ticket_codes,
      notes: newBooking.notes,
      created_at: newBooking.created_at,
    };

    if (isValidUUID(newBooking.product_id)) {
      dbPayload.product_id = newBooking.product_id;
    }
    if (isValidUUID(newBooking.product_option_id)) {
      dbPayload.product_option_id = newBooking.product_option_id;
    }

    // IMPORTANT: @insforge/sdk requires array format [{...}] for .insert()
    const { error } = await insforge.database.from('bali_bookings').insert([dbPayload]);
    if (error) {
      console.warn('InsForge insert warning:', error);
    }
  } catch (err) {
    console.warn('Database insert error, saved to local cache', err);
  }

  // Always update local cache for instant PWA offline viewing
  try {
    const current = getStoredLocalBookings();
    const updated = [newBooking, ...current.filter((b) => b.id !== newBooking.id)];
    localStorage.setItem('cached_bali_bookings', JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newBooking;
}

export async function updateBookingStatus(
  bookingId: string,
  updates: Partial<BookingRecord>
): Promise<BookingRecord | null> {
  try {
    await insforge.database
      .from('bali_bookings')
      .update(updates)
      .eq('id', bookingId);
  } catch (err) {
    console.warn('Database update failed, updating local storage', err);
  }

  const current = getStoredLocalBookings();
  const index = current.findIndex((b) => b.id === bookingId);
  if (index >= 0) {
    current[index] = { ...current[index], ...updates };
    try {
      localStorage.setItem('cached_bali_bookings', JSON.stringify(current));
    } catch {
      // ignore
    }
    return current[index];
  }
  return null;
}
