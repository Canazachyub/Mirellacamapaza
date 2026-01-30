import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import Proposals from '@/components/sections/Proposals';
import Documents from '@/components/sections/Documents';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, ArrowRight, ClipboardCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common';
import { SEDES, CANDIDATA } from '@/utils/constants';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Propuestas Section */}
      <Proposals />

      {/* Documentos Section */}
      <Documents />

      {/* About Preview Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Candidate Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://raw.githubusercontent.com/Canazachyub/GIFS/refs/heads/main/CAMAPAZA%20(800%20x%20800%20px)%20(2).png"
                  alt={CANDIDATA.nombreCompleto}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-lg -z-10" />
              {/* Number badge */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-display font-bold text-3xl">
                  {CANDIDATA.numeroLista}
                </span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Conóceme
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
                {CANDIDATA.nombreCompleto}
              </h2>
              <p className="text-secondary-600 mb-4">
                Comprometida con el desarrollo de Puno y el bienestar de todos los puneños.
                Con experiencia profesional y una visión clara para transformar nuestra región.
              </p>
              <p className="text-secondary-600 mb-6">
                Mi compromiso es llevar las necesidades de Puno al Congreso de la República y elaborar
                propuestas en beneficio de la región. Siempre trabajando con transparencia, honestidad
                y cercanía a la población.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-secondary-700">
                  <Heart className="w-5 h-5 text-primary-600" />
                  <span>Compromiso social</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-700">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span>Trabajo en equipo</span>
                </div>
              </div>

              <Link to="/conoceme">
                <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Conoce mi historia
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              ¡Únete al cambio!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Juntos podemos construir el Puno que todos merecemos. Tu voz y tu voto son importantes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/afiliate">
                <Button variant="white" size="lg">
                  Afíliate Ahora
                </Button>
              </Link>
              <Link to="/voluntariado">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Sé Voluntario
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consulta Miembro de Mesa - ONPE */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  ¿Eres Miembro de Mesa?
                </h3>
                <p className="text-white/90 text-lg">
                  Consulta si fuiste elegido para las Elecciones Generales 2026
                </p>
              </div>
            </div>
            <a
              href="https://consultaelectoral.onpe.gob.pe/inicio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>Consultar Ahora</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sedes Preview */}
      <section className="py-16 lg:py-24 bg-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Nuestras Sedes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
              Encuéntranos cerca de ti
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras sedes. Estamos para escucharte.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEDES.map((sede, index) => (
              <motion.div
                key={sede.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {sede.nombre}
                </h3>
                <p className="text-secondary-600 text-sm mb-2">
                  {sede.direccion}
                </p>
                {sede.referencia && (
                  <p className="text-secondary-500 text-xs">
                    Ref: {sede.referencia}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/sedes">
              <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todas las sedes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
