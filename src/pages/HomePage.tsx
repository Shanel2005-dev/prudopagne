import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { useCategories, useProducts } from '../hooks/useCatalog';
import { whatsappLink } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import heroImage from '../assets/images/hero-pagne.jfif';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '22965524216';

const HERO_IMAGE = heroImage;

const CATEGORY_IMAGES: Record<string, string> = {
  bazin: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bazin_fabric.jpg',
  wax: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg',
  tissus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ankara_Fabric_With_A_Touch_Of_Smile.jpg/1280px-Ankara_Fabric_With_A_Touch_Of_Smile.jpg',
  chiganvy: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg',
  vlisco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg',
  superwax: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg',
  'vlisco imitation': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Wax_print.jpeg/1280px-Wax_print.jpeg',
};

export default function HomePage() {
  const { categories } = useCategories();
  const { products } = useProducts(true);
  const vedettes = products.slice(0, 8);

  return (
    <div className="bg-[#FFF9F3]">
      {/* Hero */}
      <section className="relative h-screen min-h-[560px] flex items-center justify-center overflow-hidden bg-[#1C1C1C]">
        <img src={HERO_IMAGE} alt="Tissus africains colorés" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/70 via-[#1C1C1C]/40 to-[#1C1C1C]/85" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-2xl mx-auto text-center px-5 -mt-12 md:-mt-20"
        >
           <h3 className="font-display text-4xl md:text-6xl leading-[1.1] text-[#FFF9F3] mb-6">
            Des tissus d'exception<br />pour sublimer votre élégance
          </h3>
          <p className="text-[#FFF9F3]/75 text-base md:text-lg mb-10 max-w-md mx-auto">
            Une sélection choisie avec exigence — à admirer, puis à commander directement sur WhatsApp.
          </p>
          <Link
            to="/catalogue"
            className="inline-block border border-[#D4AF37] text-[#D4AF37] px-9 py-3.5 rounded-full text-sm tracking-[0.15em] uppercase hover:bg-[#D4AF37] hover:text-[#1C1C1C] transition-colors duration-300"
          >
            Découvrir la collection
          </Link>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FFF9F3]/60"
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* Catégories */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-[#B8952E] mb-3">Nos univers</p>
          <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1C]">Chaque tissu raconte une histoire</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((c, i) => {
            const img = CATEGORY_IMAGES[c.nom.toLowerCase()];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={`/catalogue?categorie=${c.id}`} className="group relative block aspect-[4/5] rounded-2xl overflow-hidden">
                  {img ? (
                    <img src={img} alt={c.nom} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B1E3F] via-[#6E1732] to-[#1C1C1C] transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="font-display text-2xl text-[#FFF9F3]">{c.nom}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Produits vedettes */}
      {vedettes.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#B8952E] mb-3">Sélection du moment</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1C1C1C]">Nos pièces les plus admirées</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {vedettes.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Bannière prestige */}
      <section className="relative bg-[#1C1C1C] py-24 px-5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_20%,#D4AF37,transparent_45%),radial-gradient(circle_at_80%_80%,#8B1E3F,transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <p className="font-display italic text-2xl md:text-3xl text-[#FFF9F3] leading-relaxed mb-8">
            « Une sélection rigoureuse, une qualité authentique,<br className="hidden md:block" /> pensée pour sublimer votre style. »
          </p>
          <div className="w-10 h-px bg-[#D4AF37] mx-auto mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-10 text-[#FFF9F3]/70 text-xs md:text-sm tracking-wide">
            <p>Authenticité garantie</p>
            <p>Qualité contrôlée</p>
            <p>Réponse rapide</p>
          </div>
          <a
            href={whatsappLink(WHATSAPP_NUMBER, 'Bonjour, je voudrais des informations sur vos pagnes.')}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1C1C1C] px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-[#FFF9F3] transition-colors duration-300"
          >
            <MessageCircle size={17} /> Contacter sur WhatsApp
          </a>
        </motion.div>
      </section>
    </div>
  );
}