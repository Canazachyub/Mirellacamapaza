import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { VolunteerForm } from '@/components/forms';
import { Card } from '@/components/common';
import { Heart, Users, Megaphone, Calendar, Camera, Car } from 'lucide-react';
import { CANDIDATA } from '@/utils/constants';

const volunteerAreas = [
  {
    icon: Megaphone,
    title: 'Redes Sociales',
    description: 'Ayúdanos a difundir nuestro mensaje en redes sociales.',
  },
  {
    icon: Users,
    title: 'Brigadas de Campo',
    description: 'Participa en visitas a comunidades y recorridos.',
  },
  {
    icon: Calendar,
    title: 'Eventos',
    description: 'Apoya en la organización de mítines y eventos.',
  },
  {
    icon: Camera,
    title: 'Fotografía/Video',
    description: 'Documenta nuestras actividades y eventos.',
  },
  {
    icon: Car,
    title: 'Logística',
    description: 'Ayuda con transporte y coordinación.',
  },
  {
    icon: Heart,
    title: 'Apoyo General',
    description: 'Colabora en diversas actividades de campaña.',
  },
];

const Volunteer = () => {
  return (
    <Layout title="Voluntariado" description="Sé voluntario y ayúdanos a construir el cambio que Puno necesita.">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
              {CANDIDATA.partido}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Sé Voluntario!
            </h1>
            <p className="text-xl text-white/90">
              Tu tiempo y talento pueden hacer la diferencia. Únete a nuestro equipo de voluntarios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 -mt-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Areas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Áreas de Voluntariado
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {volunteerAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
                      <area.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {area.title}
                    </h3>
                    <p className="text-secondary-600 text-sm">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="bg-primary-50 rounded-xl p-6 border-l-4 border-primary-600">
                <p className="text-secondary-700 italic mb-2">
                  "El cambio no lo hace una sola persona, lo hacemos juntos. Cada voluntario es
                  fundamental para construir el Puno que soñamos."
                </p>
                <p className="text-primary-600 font-semibold">
                  - {CANDIDATA.nombreCompleto}
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24">
                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                  Inscríbete como Voluntario
                </h2>
                <VolunteerForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Volunteer;
