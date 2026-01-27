import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Sparkles, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import MapComponent from '@/components/ui/MapComponent';
import { Card } from '@/components/common';
import { SEDES, CONTACTO } from '@/utils/constants';
import { getWhatsAppUrl } from '@/utils/helpers';

const Locations = () => {
  // Encontrar sede nueva para el banner
  const sedeNueva = SEDES.find(s => s.esNueva);

  return (
    <Layout title="Sedes" description="Encuentra nuestras sedes en Puno, Juliaca, Ilave y Ayaviri.">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        {/* Banner de Inauguración dentro del hero */}
        {sedeNueva && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black py-3 px-4 mb-6 rounded-lg mx-4 md:mx-auto max-w-4xl shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap text-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-bold">¡NUEVA SEDE!</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <strong>Miércoles 28 - 4:00 PM</strong>
              </span>
              <span className="hidden sm:inline">|</span>
              <span>{sedeNueva.direccion}, {sedeNueva.ciudad}</span>
              <span className="text-sm hidden md:inline">({sedeNueva.referencia})</span>
            </div>
          </motion.div>
        )}
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestras Sedes
            </h1>
            <p className="text-xl text-white/90">
              Visítanos en cualquiera de nuestras sedes. Estamos para escucharte y trabajar juntos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 -mt-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MapComponent height="500px" zoom={7} />
          </motion.div>
        </div>
      </section>

      {/* Sedes List */}
      <section className="py-12 bg-secondary-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {SEDES.map((sede, index) => (
              <motion.div
                key={sede.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`h-full ${
                    sede.esPrincipal ? 'border-2 border-primary-500' : ''
                  } ${
                    sede.esNueva ? 'border-2 border-yellow-500 bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sede.esPrincipal && (
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-xs font-semibold rounded-full">
                        Sede Principal
                      </span>
                    )}
                    {sede.esNueva && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        ¡INAUGURACIÓN!
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {sede.nombre}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-secondary-700">{sede.direccion}</p>
                        {sede.referencia && (
                          <p className="text-sm text-secondary-500">
                            Ref: {sede.referencia}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary-600" />
                      <p className="text-secondary-700">
                        Lun - Sáb: 8:00 AM - 6:00 PM
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary-600" />
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-700 hover:text-primary-600"
                      >
                        {CONTACTO.whatsappDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-3">
                    {sede.googleMapsUrl && (
                      <a
                        href={sede.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        Cómo llegar
                      </a>
                    )}
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Contactar
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Locations;
