import { insforge } from './insforge';
import {
  BaliProduct,
  BaliCategory,
  BaliProductOption,
  BookingRecord,
} from '../types';

// Fallback seed in case of offline or local demo state
const fallbackCategories: BaliCategory[] = [
  { id: '1', slug: 'watersport', name: 'Watersport & Pantai', icon: 'Waves', sort_order: 1 },
  { id: '2', slug: 'adventure-atv', name: 'ATV & Rafting', icon: 'Compass', sort_order: 2 },
  { id: '3', slug: 'trekking-nature', name: 'Gunung & Trekking', icon: 'Mountain', sort_order: 3 },
  { id: '4', slug: 'cultural-dance', name: 'Budaya & Tari', icon: 'Sparkles', sort_order: 4 },
  { id: '5', slug: 'island-cruise', name: 'Nusa Penida & Snorkeling', icon: 'Ship', sort_order: 5 },
  { id: '6', slug: 'spa-wellness', name: 'Spa & Relaksasi', icon: 'Heart', sort_order: 6 },
];

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
    console.warn('Using fallback categories due to network/database error', err);
    return fallbackCategories;
  }
}

export async function fetchProducts(): Promise<BaliProduct[]> {
  try {
    const { data: productsData, error: pError } = await insforge.database
      .from('bali_products')
      .select('*')
      .order('is_featured', { ascending: false });

    if (pError || !productsData || productsData.length === 0) {
      return getStoredLocalProducts();
    }

    const { data: optionsData } = await insforge.database
      .from('bali_product_options')
      .select('*');

    const products: BaliProduct[] = (productsData as any[]).map((p) => {
      const options = (optionsData as BaliProductOption[] || []).filter(
        (o) => o.product_id === p.id
      );
      return {
        ...p,
        highlights: Array.isArray(p.highlights) ? p.highlights : [],
        inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
        exclusions: Array.isArray(p.exclusions) ? p.exclusions : [],
        images: Array.isArray(p.images) ? p.images : [],
        options,
      };
    });

    localStorage.setItem('cached_bali_products', JSON.stringify(products));
    return products;
  } catch (err) {
    console.warn('Falling back to cached products', err);
    return getStoredLocalProducts();
  }
}

export function getStoredLocalProducts(): BaliProduct[] {
  const cached = localStorage.getItem('cached_bali_products');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
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
    const product = (await fetchProducts()).find((p) => p.id === productId);
    if (!product) return false;

    const newSellingPrice = Math.round(
      Number(product.base_price_idr) * (1 + newMarkupPercent / 100)
    );

    await insforge.database
      .from('bali_products')
      .update({
        markup_percent: newMarkupPercent,
        selling_price_idr: newSellingPrice,
      })
      .eq('id', productId);

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
// BOOKING MANAGEMENT
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
      ticket_codes: Array.isArray(b.ticket_codes) ? b.ticket_codes : [],
    }));

    localStorage.setItem('cached_bali_bookings', JSON.stringify(records));
    return records as BookingRecord[];
  } catch (err) {
    console.warn('Falling back to local bookings', err);
    return getStoredLocalBookings();
  }
}

export function getStoredLocalBookings(): BookingRecord[] {
  const cached = localStorage.getItem('cached_bali_bookings');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function saveBooking(booking: Partial<BookingRecord>): Promise<BookingRecord> {
  const newBooking: BookingRecord = {
    id: booking.id || crypto.randomUUID(),
    booking_code: booking.booking_code || `BALI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    customer_name: booking.customer_name || 'Wisatawan Bali',
    customer_email: booking.customer_email || 'guest@example.com',
    customer_phone: booking.customer_phone || '+628123456789',
    hotel_pickup_address: booking.hotel_pickup_address || '',
    product_id: booking.product_id || '',
    product_option_id: booking.product_option_id || '',
    product_title: booking.product_title || '',
    option_name: booking.option_name || '',
    visit_date: booking.visit_date || new Date().toISOString().split('T')[0],
    quantity: booking.quantity || 1,
    unit_price: booking.unit_price || 0,
    total_amount: booking.total_amount || 0,
    payment_status: booking.payment_status || 'pending',
    payment_method: booking.payment_method || 'qris',
    globaltix_status: booking.globaltix_status || 'reserved',
    globaltix_booking_ref: booking.globaltix_booking_ref,
    reservation_expires_at: booking.reservation_expires_at,
    confirmed_at: booking.confirmed_at,
    voucher_pdf_url: booking.voucher_pdf_url,
    ticket_codes: booking.ticket_codes || [],
    notes: booking.notes || '',
    created_at: new Date().toISOString(),
  };

  try {
    await insforge.database.from('bali_bookings').insert(newBooking);
  } catch (err) {
    console.warn('Database insert failed, saved to local cache', err);
  }

  // Always update local cache for instant PWA offline viewing
  const current = getStoredLocalBookings();
  const updated = [newBooking, ...current.filter((b) => b.id !== newBooking.id)];
  localStorage.setItem('cached_bali_bookings', JSON.stringify(updated));

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
    localStorage.setItem('cached_bali_bookings', JSON.stringify(current));
    return current[index];
  }
  return null;
}
