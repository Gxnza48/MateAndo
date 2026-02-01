-- Create products table (Spanish only, ARS only)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description_es TEXT,
  price_ars NUMERIC NOT NULL,
  material TEXT,
  stock INTEGER NOT NULL DEFAULT 10,
  rating NUMERIC DEFAULT 4.5,
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products RLS policy: public read, authenticated write
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "products_authenticated_write" ON public.products;
CREATE POLICY "products_authenticated_write" ON public.products FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Insert initial products data
INSERT INTO public.products (slug, category, name_es, description_es, price_ars, material, stock, rating, image_url, featured, in_stock) VALUES
('mate-imperial', 'mates', 'Mate Imperial', 'Mate de ceramica artesanal con diseno elegante y moderno. Perfecto para los que valoran el estilo y la tradicion.', 15000, 'ceramica', 25, 4.9, 'https://thehouseofmate.com/cdn/shop/files/69A55BE3-7BEB-42A0-A5FB-160F0275BC71.jpg?v=1723560623&width=713', true, true),
('mate-torpedo', 'mates', 'Mate Torpedo', 'Mate de forma torpedo, diseno ergonomico tradicional. Material resistente y duradero para disfrutar el mate autentico.', 18000, 'calabaza', 30, 4.8, 'https://thehouseofmate.com/cdn/shop/files/27CA003A-D98C-45DB-BE09-3E8B148E564A.jpg?v=1723560799&width=713', true, true),
('bombilla-pico-de-loro', 'bombillas', 'Bombilla Pico de Loro', 'Bombilla de alpaca con el clasico diseno pico de loro. Filtro de calidad premium para una experiencia optima.', 8500, 'alpaca', 50, 4.9, 'https://thehouseofmate.com/cdn/shop/files/bombillas_e73d8811-dbaf-4cb9-b564-ae7dcfefea40.jpg?v=1715308072&width=713', true, true),
('set-matero', 'kits', 'Set Matero', 'Set completo del matero: termo con capacidad de 1L, mate artesanal y bombilla pico de loro. Todo lo que necesitas para disfrutar el mate como un verdadero argentino.', 45000, 'varios', 12, 5.0, 'https://thehouseofmate.com/cdn/shop/files/TERMO_MATE_BOMBILLA.png?v=1746855733&width=713', true, true)
ON CONFLICT (slug) DO NOTHING;
