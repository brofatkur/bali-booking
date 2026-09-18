-- 1. Create tables
CREATE TABLE IF NOT EXISTS bali_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bali_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  globaltix_product_id INT UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_slug VARCHAR(100),
  location_area VARCHAR(100) NOT NULL,
  description TEXT,
  highlights JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  cancellation_policy TEXT,
  images JSONB DEFAULT '[]',
  base_price_idr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  selling_price_idr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  markup_percent NUMERIC(5, 2) DEFAULT 15.00,
  rating NUMERIC(3, 1) DEFAULT 4.8,
  review_count INT DEFAULT 120,
  duration VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bali_product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES bali_products(id) ON DELETE CASCADE,
  globaltix_ticket_type_id INT NOT NULL,
  option_name VARCHAR(255) NOT NULL,
  description TEXT,
  b2b_price_idr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  markup_type VARCHAR(20) DEFAULT 'percentage',
  markup_value NUMERIC(12, 2) DEFAULT 15.00,
  selling_price_idr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_pax INT DEFAULT 1,
  max_pax INT DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bali_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  hotel_pickup_address TEXT,
  product_id UUID REFERENCES bali_products(id),
  product_option_id UUID REFERENCES bali_product_options(id),
  product_title VARCHAR(255),
  option_name VARCHAR(255),
  visit_date DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(30) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'qris',
  globaltix_status VARCHAR(30) DEFAULT 'unreserved',
  globaltix_booking_ref VARCHAR(100),
  reservation_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  voucher_pdf_url TEXT,
  ticket_codes JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bali_system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed categories & system settings
INSERT INTO bali_categories (slug, name, icon, sort_order) VALUES
('watersport', 'Watersport & Pantai', 'Waves', 1),
('adventure-atv', 'ATV & Rafting Adventure', 'Compass', 2),
('trekking-nature', 'Gunung & Trekking Sunrise', 'Mountain', 3),
('cultural-dance', 'Budaya & Tari Tradisional', 'Sparkles', 4),
('island-cruise', 'Nusa Penida & Snorkeling', 'Ship', 5),
('spa-wellness', 'Spa & Relaksasi Bali', 'Heart', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO bali_system_settings (setting_key, setting_value) VALUES
('globaltix_config', '{"environment": "sandbox", "api_base_url": "https://stg-api.globaltix.com/api", "client_id": "BALI_EXPLORE_AGENT", "client_secret": "gtx_sec_sandbox_bali2026", "is_connected": true, "token_status": "active"}'::jsonb),
('pricing_markup', '{"default_type": "percentage", "default_value": 15, "min_margin_idr": 25000, "auto_round_up_thousand": true}'::jsonb),
('payment_config', '{"gateway": "qris_simulator", "active_methods": ["qris", "bca_va", "mandiri_va"], "auto_settle_simulation": true}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 3. Seed Products
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES 
(
  51001,
  'Tanjung Benoa Watersport Combo (Banana Boat, Jet Ski & Parasailing)',
  'tanjung-benoa-watersport-combo',
  'watersport',
  'Tanjung Benoa, Nusa Dua',
  'Nikmati serunya petualangan bahari di pusat watersport Bali, Tanjung Benoa. Paket combo ini mencakup wahana paling favorit: Banana Boat yang seru bersama teman, Jet Ski dengan instruktur berpengalaman, serta Parasailing Adventure dengan panorama pesisir pantai Bali yang menawan.',
  '["Sensasi terbang parasailing dengan pemandangan pantai Nusa Dua", "Wahana Jet Ski bertenaga dengan instruktur profesional", "Peralatan standar keselamatan internasional dan asuransi penuh", "Fasilitas loker, shower, dan handuk bersih di lokasi"]'::jsonb,
  '["Tiket Banana Boat (15 menit)", "Tiket Jet Ski + Instruktur (15 menit)", "Parasailing Adventure (1 putaran)", "Instruktur & Perlengkapan Safety (Life Jacket)", "Asuransi aktivitas", "Penggunaan ruang ganti & shower"]'::jsonb,
  '["Transportasi antar-jemput hotel (tersedia di paket add-on)", "Foto & video dokumentasi (dapat dibeli di lokasi)", "Makan siang & pengeluaran pribadi"]'::jsonb,
  'Pembatalan gratis hingga 24 jam sebelum tanggal kunjungan.',
  '["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"]'::jsonb,
  280000, 335000, 19.64, 4.9, 342, '2 - 3 Jam', true, true
),
(
  51002,
  'Ubud Jungle ATV Quad Bike & Rafting Sungai Ayung Adventure',
  'ubud-jungle-atv-rafting-ayung',
  'adventure-atv',
  'Ubud, Gianyar',
  'Taklukkan rute ekstrem trek lumpur, terowongan gua buatan, hutan bambu, dan air terjun dengan motor ATV 250cc di Ubud! Dilanjutkan dengan arung jeram seru di Sungai Ayung sejauh 10 km dengan tebing relief Ramayana yang legendaris.',
  '["Lintasan ATV terlengkap: hutan rimba, lumpur basah, sungai, dan gua", "Arung jeram seru kelas II-III di Sungai Ayung Ubud", "Makan siang prasmanan masakan khas Bali di pinggir lembah", "Pemandu bersertifikat rescue & instruktur ramah"]'::jsonb,
  '["Sewa motor ATV Quad Bike + Helm + Sepatu boots", "Peralatan Rafting (Dayung, Helm, Pelampung)", "Pemandu Rafting & Instruktur ATV", "Makan siang buffet prasmanan", "Fasilitas loker, handuk & kamar mandi bersih", "Perlindungan asuransi"]'::jsonb,
  '["Dokumentasi foto/video aksi", "Pengeluaran pribadi"]'::jsonb,
  'Bisa reschedule atau refund penuh jika pembatalan diajukan 1 hari sebelumnya.',
  '["https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"]'::jsonb,
  420000, 495000, 17.86, 4.9, 520, '5 - 6 Jam', true, true
),
(
  51003,
  'Gunung Batur Sunrise Trekking & Pemandian Air Panas Alami Kintamani',
  'gunung-batur-sunrise-trekking-kintamani',
  'trekking-nature',
  'Kintamani, Bangli',
  'Rasakan momen magis menyaksikan matahari terbit dari puncak Gunung Batur (1.717 mdpl) berlatar Danau Batur dan siluet Gunung Rinjani Lombok. Di puncak, nikmati sarapan telur rebus uap kawah vulkanik hangat, dilanjutkan berendam rileks di air belerang hangat Toya Devasya.',
  '["Saksikan golden sunrise terbaik di pulau Bali dari puncak kaldera", "Sarapan hangat di puncak: roti, teh/kopi, dan telur rebus uap vulkanik", "Relaksasi otot di pemandian air panas alami tepi Danau Batur", "Didampingi pemandu lokal berlisensi Asosiasi Trekking Batur"]'::jsonb,
  '["Tiket masuk kawasan Gunung Batur & retribusi Kintamani", "Pemandu lokal berpengalaman & ramah", "Peralatan senter / trekking pole", "Sarapan ringan di puncak gunung", "Tiket kolam air panas alami (opsional paket komplit)"]'::jsonb,
  '["Jaket tebal & perlengkapan pribadi", "Tips untuk pemandu lokal (sukarela)"]'::jsonb,
  'Bisa dibatalkan gratis hingga H-1 sebelum pukul 18:00 WITA.',
  '["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"]'::jsonb,
  350000, 415000, 18.57, 4.8, 280, '6 Jam (Dini Hari)', true, true
),
(
  51004,
  'One Day Nusa Penida Tour Barat + Snorkeling Manta Bay',
  'nusa-penida-west-tour-snorkeling',
  'island-cruise',
  'Nusa Penida, Klungkung',
  'Jelajahi keajaiban pulau eksotis Nusa Penida! Kunjungi tebing T-Rex Kelingking Beach yang ikonik, kolam alami Angel’s Billabong, dan Broken Beach. Dilengkapi sesi snorkeling seru di Manta Bay untuk berenang bersama ikan pari Manta raksasa yang ramah.',
  '["Spot foto spektakuler di Kelingking T-Rex Cliff & Broken Beach", "Snorkeling di perairan jernih Manta Bay, Gamat Bay, & Crystal Bay", "Tiket Speedboat PP Sanur - Nusa Penida jalur ekspres", "Mobil privat ber-AC dengan driver lokal merangkap fotografer handal"]'::jsonb,
  '["Tiket Fastboat PP (Sanur - Nusa Penida)", "Transportasi mobil privat ber-AC di Nusa Penida + bensin + driver", "Tiket masuk semua objek wisata", "Peralatan snorkeling lengkap + perahu jukung tradisional + pemandu", "Makan siang restoran lokal"]'::jsonb,
  '["Retribusi Pemda Klungkung (Rp 25.000/orang bayar di dermaga)", "Pengeluaran pribadi"]'::jsonb,
  'Pembatalan hingga 24 jam sebelum jadwal keberangkatan.',
  '["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80"]'::jsonb,
  580000, 685000, 18.10, 4.9, 610, '10 Jam', true, true
),
(
  51005,
  'Tiket Resmi Pertunjukan Tari Kecak & Api Uluwatu Sunset',
  'tari-kecak-api-uluwatu-sunset',
  'cultural-dance',
  'Uluwatu, Badung',
  'Pentas budaya paling legendaris di Bali berlatar tebing 70 meter di atas Samudra Hindia dan matahari terbenam (sunset) yang magis. Menampilkan kisah epik Ramayana dengan paduan suara 50 penari Kecak bertelanjang dada dan atraksi Hanoman membakar api.',
  '["Panggung terbuka di tebing pura Uluwatu menghadap sunset langsung", "Kisah pewayangan Ramayana & aksi akrobatik Hanoman Api", "Voucher barcode instan tanpa antre panjang di loket tiket", "Pilihan jam tayang sunset (18:00) atau malam hari (19:00)"]'::jsonb,
  '["Tiket resmi pertunjukan Tari Kecak Uluwatu", "Brosur sinopsis cerita dalam bahasa Indonesia / Inggris", "Jaminan tempat duduk"]'::jsonb,
  '["Tiket masuk kawasan Pura Uluwatu (dibayar di gerbang pura)", "Antar jemput transportasi"]'::jsonb,
  'Non-refundable jika tiket sudah di-issue pada hari H.',
  '["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"]'::jsonb,
  125000, 150000, 20.00, 4.8, 1140, '1 Jam Pertunjukan', true, true
)
ON CONFLICT (globaltix_product_id) DO NOTHING;

-- 4. Seed Product Options
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80101, 'Paket Combo Standar (Banana + Jet Ski + Parasailing)', 'Termasuk semua 3 wahana + asuransi + instruktur', 280000, 335000, 1, 15
FROM bali_products WHERE globaltix_product_id = 51001;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80102, 'Paket Combo + Antar Jemput Hotel (Kuta/Seminyak/Nusa Dua)', 'Combo 3 wahana ditambah mobil antar jemput hotel private', 410000, 485000, 2, 10
FROM bali_products WHERE globaltix_product_id = 51001;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80201, 'Single ATV (1 Orang 1 Motor) + Rafting Ayung + Lunch', '1 pengendara 1 motor ATV 250cc, rafting 2 jam, dan buffet lunch', 420000, 495000, 1, 20
FROM bali_products WHERE globaltix_product_id = 51002;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80202, 'Tandem ATV (1 Motor Berdua) + Rafting Ayung + Lunch', 'Cocok untuk pasangan / orang tua & anak (harga untuk 2 orang)', 760000, 890000, 2, 2
FROM bali_products WHERE globaltix_product_id = 51002;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80301, 'Batur Sunrise Trekking Standar', 'Pemandu lokal, tiket kawasan, sarapan hangat di puncak', 350000, 415000, 1, 12
FROM bali_products WHERE globaltix_product_id = 51003;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80302, 'Batur Trekking + Natural Hot Spring Toya Devasya', 'Trekking sunrise dilanjutkan berendam di kolam air panas alami tepi danau', 475000, 560000, 1, 12
FROM bali_products WHERE globaltix_product_id = 51003;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80401, 'Tur Pulau Barat (Kelingking, Broken Beach, Angel Billabong)', 'Tiket fastboat PP, mobil privat AC + driver, makan siang', 580000, 685000, 1, 10
FROM bali_products WHERE globaltix_product_id = 51004;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80402, 'Tur Barat + Snorkeling Manta Bay 3 Spot', 'Tur darat Kelingking + perahu snorkeling Manta Bay & Crystal Bay', 760000, 895000, 1, 10
FROM bali_products WHERE globaltix_product_id = 51004;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80501, 'Sesi 1: Sunset Show (Pukul 18:00 WITA)', 'Pertunjukan saat sunset matahari terbenam paling favorit', 125000, 150000, 1, 10
FROM bali_products WHERE globaltix_product_id = 51005;

INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80502, 'Sesi 2: Night Show (Pukul 19:00 WITA)', 'Pertunjukan malam dengan tata lampu & atraksi obor api dramatis', 125000, 150000, 1, 10
FROM bali_products WHERE globaltix_product_id = 51005;
