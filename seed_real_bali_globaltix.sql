-- Reset and seed Real Bali GlobalTix Catalog
TRUNCATE TABLE bali_product_options CASCADE;
TRUNCATE TABLE bali_products CASCADE;
TRUNCATE TABLE bali_categories CASCADE;

INSERT INTO bali_categories (slug, name, icon, sort_order) VALUES
('theme-waterpark', 'Waterpark & Theme Park', 'Waves', 1),
('wildlife-safari', 'Safari & Satwa Bali', 'Compass', 2),
('beach-club', 'Beach Club & Sunset', 'Sparkles', 3),
('watersport', 'Watersport & Bahari', 'Waves', 4),
('adventure-atv', 'ATV, Rafting & Swing', 'Compass', 5),
('island-cruise', 'Nusa Penida & Cruise', 'Ship', 6),
('cultural-dance', 'Budaya, Pura & Kecak', 'Sparkles', 7),
('trekking-nature', 'Gunung Batur & Alam', 'Mountain', 8)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 1. Waterbom Bali (GlobalTix ID: 10241)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  10241,
  'Waterbom Bali - Single Day Pass (Waterpark #1 di Asia)',
  'waterbom-bali-day-pass',
  'theme-waterpark',
  'Kuta, Badung',
  'Nikmati hari penuh keseruan di Waterbom Bali, waterpark terbaik #1 di Asia versi TripAdvisor! Rasakan wahana seluncuran kelas dunia seperti Climax, Pipeline, Boomerang, dan Twin Racers di tengah taman tropis rimbun seluas 3,8 hektar di jantung Kuta.',
  '["Akses seharian penuh ke seluruh 26 wahana seluncuran kelas dunia termasuk area baru Oasis Gardens", "Wahana ekstrem Climax, Smashdown 2.0, Fast & Fierce, serta Lazy River yang santai", "Standar keamanan internasional EarthCheck Gold Certified di Kuta Bali", "E-Voucher GlobalTix langsung scan di gerbang masuk tanpa antre loket"]'::jsonb,
  '["Tiket Masuk Seharian Penuh (Single Day Pass) Waterbom Bali", "Akses ke seluruh seluncuran air, kolam renang, dan fasilitas sun lounger", "Wi-Fi gratis di area taman air", "Asuransi keselamatan pengunjung di dalam area"]'::jsonb,
  '["Sewa handuk, loker, dan gazebo privat", "Makanan & minuman (menggunakan gelang Splash Band non-tunai)", "Transportasi menuju lokasi di Jl. Kartika Plaza Kuta"]'::jsonb,
  'Tiket berlaku fleksibel sesuai tanggal terpilih. Reschedule gratis hingga H-1.',
  '["https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"]'::jsonb,
  415000, 485000, 16.87, 4.9, 2840, 'Seharian (09:00 - 18:00)', true, true
);

-- 2. Taman Safari Bali / Bali Safari & Marine Park (GlobalTix ID: 10412)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  10412,
  'Taman Safari Bali (Bali Safari & Marine Park) - Jungle Hopper Pass',
  'taman-safari-bali-jungle-hopper',
  'wildlife-safari',
  'Gianyar, Bali',
  'Jelajahi habitat lebih dari 120 spesies satwa langka dari 3 negara (Indonesia, India, dan Afrika) di Taman Safari Bali. Paket resmi GlobalTix ini sudah mencakup Safari Journey dengan trem khusus, pertunjukan edukasi satwa, Harimau Show, dan Gajah Show.',
  '["Safari Journey dengan trem ber-AC melintasi habitat satwa lepas seperti Singa, Badak, dan Zebra", "Menonton Animal Educational Presentation, Harimau Show, dan Elephant Conservation Show", "Akses ke area Fresh Water Aquarium dan Fun Zone", "Pilihan paket WNI (Domestik) dan WNA (Internasional) serta Night Safari"]'::jsonb,
  '["Tiket Masuk Taman Safari Bali", "1x Safari Journey Tour menggunakan Trem Khusus", "Akses semua pertunjukan edukasi satwa sesuai jadwal", "Akses Fresh Water Aquarium"]'::jsonb,
  '["Makan siang di Tsavo Lion atau Uma Restaurant (kecuali memilih Dragon Package)", "Foto bersama satwa & memberi makan satwa"]'::jsonb,
  'Pembatalan gratis hingga 24 jam sebelum tanggal kunjungan.',
  '["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80", "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80"]'::jsonb,
  520000, 600000, 15.38, 4.9, 1950, '5 - 7 Jam', true, true
);

-- 3. Garuda Wisnu Kencana (GWK) Cultural Park (GlobalTix ID: 10890)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  10890,
  'Garuda Wisnu Kencana (GWK) Cultural Park & Pertunjukan Tari Kecak',
  'gwk-cultural-park-bali-ticket',
  'cultural-dance',
  'Uluwatu, Badung',
  'Kunjungi ikon kebanggaan Bali, patung Garuda Wisnu Kencana setinggi 121 meter (salah satu patung tertinggi di dunia). Nikmati pertunjukan budaya Bali setiap jam di Amphitheater, parade budaya, serta Tari Kecak Garuda Wisnu yang megah saat matahari terbenam.',
  '["Akses langsung ke Plaza Wisnu, Lotus Pond, dan patung raksasa GWK setinggi 121 meter", "Gratis menonton 15 pertunjukan tari tradisional Bali & Tari Kecak di setiap sore", "Opsi Ultimate Package termasuk tur naik lift ke lantai 23 di dalam dada patung GWK", "Voucher GlobalTix langsung scan barcode di gerbang utama Plaza Bhagawan"]'::jsonb,
  '["Tiket Masuk Kawasan GWK Cultural Park", "Akses menonton seluruh jadwal tari reguler & Tari Kecak sore hari", "Akses ke ASANA Artseum atau Top of the Statue (khusus varian Ultimate)"]'::jsonb,
  '["Tiket Shuttle Buggy di dalam area (opsional)", "Pengeluaran makan & minum pribadi"]'::jsonb,
  'Bisa reschedule hingga 24 jam sebelum kunjungan.',
  '["https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"]'::jsonb,
  115000, 140000, 21.74, 4.8, 3120, '3 - 4 Jam', true, true
);

-- 4. Atlas Beach Club & Atlas Beach Fest Canggu (GlobalTix ID: 11205)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  11205,
  'Atlas Beach Club Canggu - General Admission + First Drink Voucher',
  'atlas-beach-club-canggu-pass',
  'beach-club',
  'Canggu, Badung',
  'Rasakan atmosfer beach club terbesar di dunia di Pantai Berawa, Canggu! Atlas Beach Club menghadirkan kolam renang tanpa batas (infinity pool) terpanjang di Asia Tenggara, penampilan DJ internasional setiap sore, pertunjukan tari api, dan panorama sunset Berawa.',
  '["Akses masuk ke Atlas Beach Club Canggu dan penggunaan kolam renang utama", "Sudah termasuk 1x Voucher Minuman Pilihan (koktail, mocktail, bir, atau soft drink)", "Hiburan live DJ setiap hari, tari Kecak kontemporer, dan fire dance saat malam", "Tersedia upgrade ke paket Daybed atau VIP Sofa dengan F&B Credit"]'::jsonb,
  '["Tiket Masuk (General Admission) Atlas Beach Club untuk 1 orang", "1x Minuman Pilihan (Alkohol / Non-Alkohol)", "Akses fasilitas kolam renang umum dan area pantai Berawa"]'::jsonb,
  '["Sewa handuk tambahan", "Minimum spend untuk area VIP Sofa / Cabana (kecuali pilih paket Daybed)"]'::jsonb,
  'Non-refundable pada hari H atau saat event khusus.',
  '["https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"]'::jsonb,
  130000, 155000, 19.23, 4.9, 1680, 'Fleksibel (10:00 - 00:00)', true, true
);

-- 5. Finns Beach Club Canggu (GlobalTix ID: 11310)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  11310,
  'Finns Beach Club Canggu - Sunset Daybed & Pool Access Pass',
  'finns-beach-club-canggu-pass',
  'beach-club',
  'Canggu, Badung',
  'Nikmati kemewahan tepi Pantai Berawa di Finns Beach Club, destinasi beach club paling ikonik di Bali dengan struktur bambu megah, 4 kolam renang oceanfront, 9 bar (termasuk 2 swim-up pool bar), dan musik DJ sunset berenergi tinggi.',
  '["Akses penuh ke 4 kolam renang tepi pantai Berawa dan 9 bar ikonik Finns Beach Club", "Termasuk kredit F&B (Makanan & Minuman) senilai paket yang dipilih", "Spot terbaik menikmati matahari terbenam di pesisir barat Canggu", "Konfirmasi e-voucher instan dari GlobalTix"]'::jsonb,
  '["Akses Masuk Finns Beach Club Canggu", "Voucher Kredit Makanan & Minuman (F&B Credit) sesuai opsi", "Handuk renang eksklusif (khusus paket Single Daybed / Lagoon Bed)", "Wi-Fi berkecepatan tinggi"]'::jsonb,
  '["Transportasi antar-jemput", "Konsumsi melebihi nilai kredit F&B"]'::jsonb,
  'Pembatalan maksimal H-2 sebelum tanggal kedatangan.',
  '["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80"]'::jsonb,
  210000, 250000, 19.05, 4.8, 1450, 'Seharian (10:00 - 00:00)', false, true
);

-- 6. Bali Zoo Singapadu Gianyar (GlobalTix ID: 11540)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  11540,
  'Bali Zoo Singapadu - Tiket Masuk & Pengalaman Interaksi Satwa',
  'bali-zoo-singapadu-admission',
  'wildlife-safari',
  'Ubud, Gianyar',
  'Kebun binatang tropis interaktif pertama di Bali di mana Anda dapat berinteraksi dekat dengan Rusa di Savanna, menonton presentasi burung eksotis, bermain air di Jungle Splash Waterplay untuk anak-anak, hingga sarapan pagi bersama Orangutan yang ikonik!',
  '["Akses penuh ke Bali Zoo, Savanna Afrika, dan wahana air anak Jungle Splash Waterplay", "Gratis naik shuttle bus internal mengelilingi area kebun binatang", "Opsi paket populer: Breakfast with Orangutan atau Elephant Mud Fun", "Lokasi strategis di jalur wisata Singapadu menuju Ubud"]'::jsonb,
  '["Tiket Masuk Bali Zoo", "Akses Jungle Splash Waterplay", "Pertunjukan satwa terjadwal (Exotic Bird Show)", "Asuransi pengunjung"]'::jsonb,
  '["Voucher makan satwa (Animal Feeding)", "Transportasi hotel (kecuali memilih paket dengan transfer)"]'::jsonb,
  'Pembatalan gratis hingga H-1 sebelum kunjungan.',
  '["https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&q=80", "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80"]'::jsonb,
  125000, 150000, 20.00, 4.8, 1420, '3 - 4 Jam', false, true
);

-- 7. Bali Bird Park (Taman Burung Bali) (GlobalTix ID: 11688)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  11688,
  'Bali Bird Park (Taman Burung Bali) - All Inclusive Ticket',
  'bali-bird-park-ticket',
  'wildlife-safari',
  'Ubud, Gianyar',
  'Rumah bagi lebih dari 1.300 burung dari 250 spesies Nusantara dan dunia, termasuk Jalak Bali langka dan Burung Cendrawasih Papua! Nikmati atraksi memberi makan burung Lory, pertunjukan burung elang pemangsa Basic Instinct, dan bioskop 4D.',
  '["Berinteraksi langsung dan berfoto bersama burung Kakatua, Macaw warna-warni, dan Rangkong", "Sudah termasuk semua pertunjukan: Bali Rainforest Free Flight Show, Pelican Feeding & 4D Cinema", "Melihat langsung Komodo Dragon asli di area khusus reptil", "Cocok untuk wisata keluarga dan edukasi anak di Bali"]'::jsonb,
  '["Tiket Masuk All-Inclusive Bali Bird Park", "Akses 4D Theater ber-AC", "Seluruh jadwal pertunjukan burung & sesi feeding terjadwal", "Pajak & biaya layanan"]'::jsonb,
  '["Makan siang di Bali Starling Restaurant", "Transportasi antar-jemput"]'::jsonb,
  'Pembatalan gratis hingga 24 jam sebelum tanggal kunjungan.',
  '["https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80", "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80"]'::jsonb,
  135000, 165000, 22.22, 4.8, 980, '3 Jam', false, true
);

-- 8. Aloha Ubud Swing & Tegalalang Rice Terrace (GlobalTix ID: 12104)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  12104,
  'Aloha Ubud Swing - Adrenaline Swing Package & Luwak Coffee Tasting',
  'aloha-ubud-swing-tegalalang',
  'adventure-atv',
  'Ubud, Gianyar',
  'Abadikan foto liburan paling Instagrammable di Bali di Aloha Ubud Swing! Berayun di ketinggian 10 hingga 60 meter di atas lembah sungai dan hamparan sawah terasering Tegalalang Ubud, lengkap dengan spot foto sarang burung (Bird Nest) dan cicip Kopi Luwak gratis.',
  '["Akses ke 5 ayunan ekstrem (Single Swing, Tandem Swing, Adrenaline Swing, dan Bed Swing)", "Berfoto di 4 spot sarang burung ikonik (Chicken Nest, Bird Nest) dan Batu Besar", "Gratis mencicipi aneka teh herbal Bali & Kopi tradisional di perkebunan", "Tersedia penyewaan gaun panjang (Flying Dress) warna-warni di lokasi"]'::jsonb,
  '["Tiket Paket Adrenaline Aloha Ubud Swing", "Akses semua ayunan dan spot foto sarang burung", "Sesi mencicipi kopi & teh tradisional Bali", "Perlengkapan sabuk pengaman (safety harness) & asuransi"]'::jsonb,
  '["Sewa gaun panjang (Flying Dress) & jasa fotografer profesional", "Transportasi hotel"]'::jsonb,
  'Bisa reschedule kapan saja sebelum tiket di-redeem.',
  '["https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80", "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"]'::jsonb,
  210000, 250000, 19.05, 4.9, 1120, '2 Jam', false, true
);

-- 9. Tanjung Benoa Watersport Combo (GlobalTix ID: 51001)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
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
  280000, 335000, 19.64, 4.9, 1342, '2 - 3 Jam', true, true
);

-- 10. Ubud ATV & Ayung Rafting (GlobalTix ID: 51002)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  51002,
  'Ubud Gorilla Cave ATV Quad Bike & Rafting Sungai Ayung Adventure',
  'ubud-jungle-atv-rafting-ayung',
  'adventure-atv',
  'Ubud, Gianyar',
  'Taklukkan rute ekstrem trek lumpur, terowongan gua Gorilla yang ikonik, hutan bambu, dan air terjun dengan motor ATV 250cc di Ubud! Dilanjutkan dengan arung jeram seru di Sungai Ayung sejauh 10 km dengan tebing relief Ramayana yang legendaris.',
  '["Lintasan ATV terlengkap: Gorilla Face Cave, hutan rimba, lumpur basah, sungai, dan air terjun", "Arung jeram seru kelas II-III di Sungai Ayung Ubud sepanjang 10 km", "Makan siang prasmanan masakan khas Bali di pinggir lembah", "Pemandu bersertifikat rescue & instruktur ramah"]'::jsonb,
  '["Sewa motor ATV Quad Bike + Helm + Sepatu boots", "Peralatan Rafting (Dayung, Helm, Pelampung)", "Pemandu Rafting & Instruktur ATV", "Makan siang buffet prasmanan", "Fasilitas loker, handuk & kamar mandi bersih", "Perlindungan asuransi"]'::jsonb,
  '["Dokumentasi foto/video aksi", "Pengeluaran pribadi"]'::jsonb,
  'Bisa reschedule atau refund penuh jika pembatalan diajukan 1 hari sebelumnya.',
  '["https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"]'::jsonb,
  420000, 495000, 17.86, 4.9, 1520, '5 - 6 Jam', true, true
);

-- 11. Mount Batur Sunrise Jeep 4WD & Trekking (GlobalTix ID: 51003)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  51003,
  'Gunung Batur Sunrise 4WD Jeep Tour / Trekking & Air Panas Kintamani',
  'gunung-batur-sunrise-trekking-kintamani',
  'trekking-nature',
  'Kintamani, Bangli',
  'Rasakan momen magis menyaksikan matahari terbit dari Gunung Batur (1.717 mdpl) baik dengan mendaki bersama pemandu lokal maupun naik Jeep 4WD Klasik menembus hamparan pasir hitam Black Lava! Dilanjutkan berendam rileks di air panas alami tepi Danau Batur.',
  '["Pilihan fleksibel: Trekking Puncak Kaldera ATAU Naik Mobil Jeep 4WD Klasik tanpa lelah mendaki", "Eksplorasi hamparan batu vulkanik Black Lava & Black Sand Kintamani", "Sarapan hangat di titik sunrise dengan panorama Gunung Abang, Danau Batur, dan Rinjani", "Relaksasi otot di pemandian air panas alami Toya Devasya / Batur Natural Hot Spring"]'::jsonb,
  '["Tiket masuk kawasan Geopark Gunung Batur & Kintamani", "Pemandu lokal berlisensi / Driver Jeep 4WD profesional merangkap fotografer", "Sarapan pagi + minuman hangat (Kopi Kintamani / Teh)", "Tiket kolam air panas alami (untuk opsi paket Hot Spring)"]'::jsonb,
  '["Jaket tebal pribadi", "Tips sukarela untuk pemandu/driver"]'::jsonb,
  'Bisa dibatalkan gratis hingga H-1 sebelum pukul 18:00 WITA.',
  '["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"]'::jsonb,
  350000, 415000, 18.57, 4.9, 1280, '6 Jam (Dini Hari)', true, true
);

-- 12. Nusa Penida Tour & Snorkeling Manta Bay (GlobalTix ID: 51004)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  51004,
  'One Day Nusa Penida Tour (Kelingking & Diamond Beach) + Manta Snorkeling',
  'nusa-penida-west-tour-snorkeling',
  'island-cruise',
  'Nusa Penida, Klungkung',
  'Jelajahi keajaiban pulau eksotis Nusa Penida! Kunjungi tebing T-Rex Kelingking Beach yang ikonik, kolam alami Angel Billabong, dan Broken Beach. Tersedia paket snorkeling 3 spot di Manta Bay, Crystal Bay, dan Gamat Bay untuk berenang bersama ikan pari Manta.',
  '["Spot foto spektakuler di Kelingking T-Rex Cliff, Broken Beach & Angel Billabong", "Snorkeling di perairan jernih Manta Bay, Gamat Bay, & Crystal Bay (opsi kombinasi)", "Tiket Fastboat PP Sanur - Nusa Penida jalur ekspres", "Mobil privat ber-AC di pulau Nusa Penida dengan driver lokal merangkap fotografer"]'::jsonb,
  '["Tiket Fastboat PP (Pelabuhan Sanur - Nusa Penida)", "Transportasi mobil privat ber-AC di Nusa Penida + BBM + driver", "Tiket masuk seluruh objek wisata sesuai rute", "Peralatan snorkeling lengkap + perahu snorkeling (khusus opsi Snorkeling)", "Makan siang di restoran lokal"]'::jsonb,
  '["Retribusi Pemda Klungkung (Rp 25.000/orang di dermaga)", "Pengeluaran pribadi"]'::jsonb,
  'Pembatalan gratis hingga 24 jam sebelum jadwal keberangkatan.',
  '["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80"]'::jsonb,
  580000, 685000, 18.10, 4.9, 1610, '9 - 10 Jam', true, true
);

-- 13. Tari Kecak & Api Uluwatu Sunset (GlobalTix ID: 51005)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  51005,
  'Tiket Resmi Pertunjukan Tari Kecak & Api Pura Luhur Uluwatu Sunset',
  'tari-kecak-api-uluwatu-sunset',
  'cultural-dance',
  'Uluwatu, Badung',
  'Pentas budaya paling legendaris di Bali berlatar tebing 70 meter di atas Samudra Hindia dan matahari terbenam (sunset) yang magis. Menampilkan kisah epik Ramayana dengan paduan suara 75 penari Kecak dan atraksi Hanoman membakar api.',
  '["Panggung amfiteater terbuka di tebing Pura Luhur Uluwatu menghadap sunset Samudra Hindia", "Kisah pewayangan Ramayana & aksi akrobatik Hanoman di tengah lingkaran api", "Voucher barcode GlobalTix langsung tukar gelang masuk tanpa antre loket reguler", "Pilihan jam tayang Sesi 1 Sunset (18:00 WITA) atau Sesi 2 Malam (19:00 WITA)"]'::jsonb,
  '["Tiket resmi pertunjukan Tari Kecak & Api Uluwatu", "Buklet sinopsis cerita Ramayana dalam berbagai bahasa", "Jaminan kuota tempat duduk amfiteater"]'::jsonb,
  '["Tiket masuk gerbang kawasan Pura Luhur Uluwatu (Rp 30.000 WNI / Rp 50.000 WNA)", "Transportasi antar-jemput"]'::jsonb,
  'Non-refundable untuk pembatalan pada hari H pertunjukan.',
  '["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80"]'::jsonb,
  125000, 150000, 20.00, 4.9, 3410, '1 Jam Pertunjukan', true, true
);

-- 14. Bali Hai Reef Cruise Nusa Lembongan (GlobalTix ID: 51006)
INSERT INTO bali_products (
  globaltix_product_id, title, slug, category_slug, location_area,
  description, highlights, inclusions, exclusions, cancellation_policy,
  images, base_price_idr, selling_price_idr, markup_percent, rating, review_count, duration, is_featured, is_active
) VALUES (
  51006,
  'Bali Hai Day Reef Cruise ke Teluk Nusa Lembongan (All-Inclusive)',
  'bali-hai-reef-cruise-nusa-lembongan',
  'island-cruise',
  'Nusa Dua / Benoa',
  'Berlayar mewah dengan katamaran Bali Hai II dari Pelabuhan Benoa menuju ponton eksklusif di perairan jernih Teluk Nusa Lembongan! Nikmati makan siang BBQ internasional sepuasnya, banana boat sepuasnya, seluncuran air 35 meter dari atas kapal, semi-submersible coral viewer, dan snorkeling.',
  '["Pelayaran katamaran mewah PP dari Dermaga Benoa ke Ponton Bali Hai di Nusa Lembongan", "Wahana air sepuasnya: Unlimited Banana Boat, Seluncuran Air 35m, Snorkeling & Kapal Selam Mini", "Makan siang Tropical BBQ Buffet lengkap dengan salad, ikan bakar, dan hidangan penutup", "Termasuk tur desa dan kebudayaan rumput laut di Pulau Nusa Lembongan"]'::jsonb,
  '["Pelayaran PP dengan Katamaran Bali Hai II", "Morning/Afternoon Tea, Coffee & Snacks di atas kapal", "International BBQ Buffet Lunch", "Unlimited Banana Boat Rides, Snorkeling Equipment & Semi-Submersible Coral Viewer", "Seluncuran air 35m & Loker penyimpanan", "Antar-jemput hotel area Bali Selatan"]'::jsonb,
  '["Scuba Diving & Parasailing (opsional tambahan di ponton)", "Minuman beralkohol & soft drink di bar ponton"]'::jsonb,
  'Pembatalan gratis hingga 48 jam sebelum tanggal pelayaran.',
  '["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80"]'::jsonb,
  1150000, 1350000, 17.39, 4.9, 890, '8 Jam (09:15 - 16:15)', false, true
);

-- ============================================================
-- SEED TICKET OPTIONS FOR ALL 14 REAL BALI GLOBALTIX PRODUCTS
-- ============================================================

-- 1. Waterbom Bali (10241)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20101, 'Single Day Pass - Dewasa (Adult 12+ Tahun)', 'Akses penuh seluruh seluncuran dan kolam Waterbom Bali seharian', 415000, 485000, 1, 15 FROM bali_products WHERE globaltix_product_id = 10241;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20102, 'Single Day Pass - Anak (Child 2-11 Tahun)', 'Tiket masuk anak seharian penuh termasuk area Funtastic', 330000, 385000, 1, 15 FROM bali_products WHERE globaltix_product_id = 10241;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20103, 'Family Pack (2 Dewasa + 2 Anak) + Loker & Handuk', 'Paket hemat keluarga 4 orang sudah termasuk sewa loker reguler dan 4 handuk', 1350000, 1580000, 1, 5 FROM bali_products WHERE globaltix_product_id = 10241;

-- 2. Taman Safari Bali (10412)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20201, 'Explorer Pass (Khusus WNI / KTP Indonesia) - Dewasa', 'Termasuk 1x Safari Journey Tram, Animal Show, Harimau Show & Elephant Show', 145000, 175000, 1, 20 FROM bali_products WHERE globaltix_product_id = 10412;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20202, 'Jungle Hopper Pass (All Nationalities / WNA & WNI)', 'Paket favorit internasional mencakup Safari Journey, Fresh Water Aquarium & semua pertunjukan', 520000, 600000, 1, 20 FROM bali_products WHERE globaltix_product_id = 10412;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20203, 'Night Safari Pass + BBQ Dinner di Nkuchiro', 'Walking Safari malam hari, naik kerangkeng trem memberi makan singa & harimau + makan malam BBQ', 790000, 920000, 1, 15 FROM bali_products WHERE globaltix_product_id = 10412;

-- 3. GWK Cultural Park (10890)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20301, 'Regular Entrance Ticket + Pertunjukan Tari Kecak', 'Tiket masuk kawasan GWK, Lotus Pond, Plaza Wisnu & menonton Tari Kecak sore', 115000, 140000, 1, 25 FROM bali_products WHERE globaltix_product_id = 10890;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20302, 'GWK Ultimate Package (Termasuk Tur Naik Lift ke Puncak Patung)', 'Tiket masuk + Akses Lift eksklusif ke lantai 23 di dalam dada Patung GWK + Tari Kecak', 245000, 290000, 1, 15 FROM bali_products WHERE globaltix_product_id = 10890;

-- 4. Atlas Beach Club (11205)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20401, 'One Day Pass + 1x First Drink Voucher', 'Tiket masuk 1 orang + 1 minuman pilihan (beer / cocktail / mocktail / juice) + akses kolam umum', 130000, 155000, 1, 20 FROM bali_products WHERE globaltix_product_id = 11205;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20402, 'VIP Pool Daybed (Maks. 4 Orang) - Termasuk F&B Credit Rp 1.500.000', 'Daybed tepi kolam utama untuk hingga 4 orang, sudah termasuk saldo makan/minum Rp 1,5 Juta', 1300000, 1500000, 1, 4 FROM bali_products WHERE globaltix_product_id = 11205;

-- 5. Finns Beach Club (11310)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20501, 'Garden / Poolside Single Pass (Termasuk F&B Credit Rp 250.000)', 'Akses masuk Finns Beach Club + saldo makanan & minuman senilai Rp 250.000', 210000, 250000, 1, 15 FROM bali_products WHERE globaltix_product_id = 11310;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20502, 'Deluxe Oceanfront Daybed (Hingga 6 Orang - F&B Credit Rp 2.400.000)', 'Daybed barisan depan menghadap pantai Berawa untuk 6 orang dengan kredit F&B penuh', 2050000, 2400000, 1, 4 FROM bali_products WHERE globaltix_product_id = 11310;

-- 6. Bali Zoo (11540)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20601, 'Zoo Admission (WNI / KTP Domestik) + Jungle Splash', 'Tiket masuk reguler Bali Zoo Singapadu + wahana air anak & pertunjukan satwa', 125000, 150000, 1, 20 FROM bali_products WHERE globaltix_product_id = 11540;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20602, 'Breakfast with Orangutan + Zoo Admission', 'Pengalaman sarapan pagi prasmanan ditemani Orangutan di Gayo Restaurant + Tiket Bali Zoo', 640000, 750000, 1, 12 FROM bali_products WHERE globaltix_product_id = 11540;

-- 7. Bali Bird Park (11688)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20701, 'Tiket Masuk Domestik (WNI) - All Bird Shows & 4D Cinema', 'Berlaku untuk pemegang KTP/KITAS, termasuk seluruh pertunjukan burung & teater 4D', 135000, 165000, 1, 20 FROM bali_products WHERE globaltix_product_id = 11688;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20702, 'Tiket Masuk Internasional (WNA / Foreigner) - All Inclusive', 'Tiket masuk wisatawan mancanegara termasuk seluruh pertunjukan dan sesi feeding', 310000, 365000, 1, 20 FROM bali_products WHERE globaltix_product_id = 11688;

-- 8. Aloha Ubud Swing (12104)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20801, 'Adrenaline Swing Package (5 Ayunan + 4 Bird Nests + Luwak Coffee)', 'Akses penuh ke semua ayunan dan sarang burung foto di Aloha Ubud', 210000, 250000, 1, 15 FROM bali_products WHERE globaltix_product_id = 12104;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 20802, 'Adrenaline Swing + Sewa Flying Dress Eksklusif', 'Paket komplit semua ayunan ditambah penyewaan gaun panjang berkibar untuk foto terbaik', 340000, 400000, 1, 10 FROM bali_products WHERE globaltix_product_id = 12104;

-- 9. Tanjung Benoa Watersport (51001)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80101, 'Paket Combo A (Banana Boat + Jet Ski + Parasailing Adventure)', 'Termasuk semua 3 wahana air populer + asuransi + instruktur + loker', 280000, 335000, 1, 15 FROM bali_products WHERE globaltix_product_id = 51001;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80102, 'Paket Combo B (Seawalker Marine Walk + Banana Boat + Jet Ski + Transfer)', 'Berjalan di dasar laut memberi makan ikan + 2 wahana + gratis jemput hotel Bali Selatan', 490000, 580000, 2, 12 FROM bali_products WHERE globaltix_product_id = 51001;

-- 10. Ubud ATV & Rafting (51002)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80201, 'Single ATV (1 Orang 1 Motor) + Rafting Sungai Ayung + Buffet Lunch', '1 pengendara 1 motor ATV Gorilla Cave, rafting 2 jam, dan makan siang prasmanan', 420000, 495000, 1, 20 FROM bali_products WHERE globaltix_product_id = 51002;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80202, 'Tandem ATV (1 Motor Berdua) + Rafting Sungai Ayung + Buffet Lunch', 'Cocok untuk pasangan / orang tua & anak (harga paket total untuk 2 peserta)', 760000, 890000, 1, 10 FROM bali_products WHERE globaltix_product_id = 51002;

-- 11. Mount Batur Sunrise (51003)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80301, 'Mount Batur Sunrise Trekking + Pemandu Pribadi + Sarapan Puncak', 'Pendakian sunrise Gunung Batur didampingi pemandu lokal resmi + sarapan di puncak', 350000, 415000, 1, 15 FROM bali_products WHERE globaltix_product_id = 51003;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80302, 'Sunrise 4WD Classic Jeep Tour + Black Lava + Natural Hot Spring', 'Naik Jeep 4x4 ke titik sunrise tanpa mendaki, lanjut eksplorasi Black Lava & berendam air panas', 520000, 615000, 1, 12 FROM bali_products WHERE globaltix_product_id = 51003;

-- 12. Nusa Penida Tour (51004)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80401, 'Tur Pulau Barat (Kelingking, Broken Beach, Angel Billabong & Crystal Bay)', 'Tiket Fastboat PP Sanur, mobil privat ber-AC di Nusa Penida + driver + makan siang', 580000, 685000, 1, 12 FROM bali_products WHERE globaltix_product_id = 51004;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80402, 'Tur Kombinasi Barat + Snorkeling 3 Spot (Manta Bay, Gamat & Crystal Bay)', 'Tur darat Kelingking Beach + perahu snorkeling berenang bersama Manta Ray + Fastboat PP', 760000, 895000, 1, 12 FROM bali_products WHERE globaltix_product_id = 51004;

-- 13. Tari Kecak Uluwatu (51005)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80501, 'Sesi 1: Sunset Show (Pukul 18:00 - 19:00 WITA)', 'Jadwal pertunjukan paling favorit tepat saat matahari terbenam di Uluwatu', 125000, 150000, 1, 15 FROM bali_products WHERE globaltix_product_id = 51005;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80502, 'Sesi 2: Night Show (Pukul 19:00 - 20:00 WITA)', 'Pertunjukan malam dengan suasana obor api yang dramatis dan kuota lebih lega', 125000, 150000, 1, 15 FROM bali_products WHERE globaltix_product_id = 51005;

-- 14. Bali Hai Reef Cruise (51006)
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80601, 'Day Reef Cruise - Dewasa (Termasuk BBQ Buffet Lunch & Hotel Transfer)', 'Pelayaran katamaran PP ke ponton Lembongan, semua wahana air & makan siang prasmanan', 1150000, 1350000, 1, 15 FROM bali_products WHERE globaltix_product_id = 51006;
INSERT INTO bali_product_options (product_id, globaltix_ticket_type_id, option_name, description, b2b_price_idr, selling_price_idr, min_pax, max_pax)
SELECT id, 80602, 'Day Reef Cruise - Anak (4-14 Tahun)', 'Tiket anak all-inclusive termasuk wahana banana boat, seluncuran 35m & makan siang', 780000, 920000, 1, 10 FROM bali_products WHERE globaltix_product_id = 51006;
