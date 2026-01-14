import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { AffiliationForm } from '@/components/forms';
import { Card } from '@/components/common';
import { CheckCircle, Users, Heart, Award } from 'lucide-react';
import { CANDIDATA } from '@/utils/constants';

const benefits = [
  {
    icon: Users,
    title: 'Forma parte del cambio',
    description: 'Únete a miles de puneños comprometidos con el desarrollo de nuestra región.',
  },
  {
    icon: Heart,
    title: 'Participa activamente',
    description: 'Ten voz y voto en las decisiones importantes de nuestra campaña.',
  },
  {
    icon: Award,
    title: 'Representación real',
    description: 'Ayúdanos a llevar las verdaderas necesidades de Puno al Congreso.',
  },
];

const Affiliate = () => {
  return (
    <Layout title="Afíliate" description="Únete a nuestra campaña y forma parte del cambio que Puno necesita.">
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
              ¡Afíliate y sé parte del cambio!
            </h1>
            <p className="text-xl text-white/90">
              Únete a nuestra campaña y juntos construiremos el Puno que todos merecemos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 -mt-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                ¿Por qué afiliarte?
              </h2>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div className="bg-secondary-50 rounded-xl p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">
                  Requisitos para afiliarte
                </h3>
                <ul className="space-y-2">
                  {[
                    'Ser mayor de 18 años',
                    'Tener DNI vigente',
                    'Residir en la región Puno',
                    'Compartir nuestra visión de cambio',
                  ].map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-secondary-700">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
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
                  Completa tus datos
                </h2>
                <AffiliationForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Affiliate;
