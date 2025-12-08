-- Seed data for makanan_pokok (Indonesian Staple Foods)
INSERT INTO public.makanan_pokok (nama_makanan, "porsi(g)", "kalori(kkal)", "karbonhidrat(g)", "protein(g)", "lemak(g)", "serat(g)", "vitamin_A(IU)", "vitamin_B(mg)", "vitamin_C(mg)") VALUES
('Nasi Putih', 100, 130, 28, 2.7, 0.3, 0.4, 0, 0.1, 0),
('Nasi Merah', 100, 110, 23, 2.6, 0.9, 1.8, 0, 0.2, 0),
('Bubur Ayam', 200, 150, 25, 8, 3, 1, 100, 0.1, 2),
('Telur Rebus', 50, 78, 0.6, 6, 5, 0, 260, 0.6, 0),
('Ikan Kembung Goreng', 80, 150, 0, 18, 8, 0, 50, 0.2, 0),
('Tempe Goreng', 50, 100, 8, 9, 6, 2, 0, 0.1, 0),
('Tahu Bacem', 50, 80, 6, 5, 4, 1, 0, 0.1, 0),
('Bayam Bening', 100, 30, 4, 2, 0.5, 3, 2000, 0.1, 15),
('Sop Wortel & Brokoli', 150, 45, 8, 2, 1, 3, 3000, 0.1, 30),
('Pisang Ambon', 100, 90, 23, 1, 0.3, 2.6, 64, 0.4, 9),
('Pepaya', 100, 40, 10, 0.5, 0.1, 1.7, 950, 0.03, 60),
('Susu UHT Full Cream', 200, 120, 10, 6, 7, 0, 300, 0.8, 2);

-- Seed data for recommended_menus (Sample Menu Recommendations)
INSERT INTO public.recommended_menus (makanan, porsi_g, kalori_kkal, karbonhidrat_g, protein_g, lemak_g, vitamin_a_IU, vitamin_b_mg, vitamin_c_mg) VALUES
('Nasi Tim Ayam Cincang', 150, 200, 30, 10, 5, 100, 0.5, 2),
('Sup Krim Jagung', 150, 120, 18, 3, 4, 200, 0.2, 5),
('Perkedel Kentang', 50, 90, 12, 2, 4, 50, 0.1, 5),
('Puding Buah Naga', 100, 80, 15, 1, 0.5, 100, 0.1, 10),
('Bola-Bola Daging Sapi', 60, 140, 2, 12, 9, 30, 0.4, 0);
