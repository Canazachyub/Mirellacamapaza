import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CANDIDATA } from '@/utils/constants';
import { scrollToElement } from '@/utils/helpers';
import Button from '@/components/common/Button';

// URL del GIF de fondo
const HERO_BACKGROUND_GIF = 'https://raw.githubusercontent.com/Canazachyub/GIFS/refs/heads/main/LANDING%20FIN.gif';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background GIF */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${HERO_BACKGROUND_GIF}")`,
        }}
      />

      {/* Overlay rojo semitransparente para legibilidad */}
      <div className="absolute inset-0 bg-primary-600/10" />

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg"
          >
            {CANDIDATA.nombreCompleto}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-4"
          >
            {CANDIDATA.cargo}
          </motion.p>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-white/80 italic mb-8 max-w-2xl mx-auto"
          >
            "{CANDIDATA.slogan}"
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/afiliate">
              <Button variant="white" size="lg" className="min-w-[180px]">
                ¡Afíliate Ahora!
              </Button>
            </Link>
            <Link to="/propuestas">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[180px] border-white text-white hover:bg-white hover:text-primary-600"
              >
                Ver Propuestas
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => scrollToElement('propuestas')}
            className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm">Conoce más</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
