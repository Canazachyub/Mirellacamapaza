import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { PersoneroForm } from '@/components/forms';
import { Card } from '@/components/common';
import { Shield, Eye, FileText, CheckCircle } from 'lucide-react';
import { CANDIDATA } from '@/utils/constants';

const benefits = [
  {
    icon: Shield,
    title: 'Defiende el voto',
    description: 'Asegura que cada voto cuente y se respete la voluntad popular en las urnas.',
  },
  {
    icon: Eye,
    title: 'Vigila el proceso',
    description: 'Sé los ojos del pueblo en las mesas de votación el día de las elecciones.',
  },
  {
    icon: FileText,
    title: 'Garantiza la transparencia',
    description: 'Fiscaliza el conteo de votos y firma las actas electorales oficiales.',
  },
];

const requirements = [
  'Ser mayor de 18 años',
  'Tener DNI vigente',
  'Estar registrado en el padrón electoral',
  'Disponibilidad el día de las elecciones (12 de abril 2026)',
];

const Personeros = () => {
  return (
    <Layout
      title="Personeros de Mesa"
      description="Regístrate como personero de mesa y defiende el voto de Puno."
    >
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
              Sé Personero de Mesa
            </h1>
            <p className="text-xl text-white/90">
              Tu presencia en las mesas de votación es fundamental para defender la democracia y garantizar elecciones transparentes.
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
                ¿Por qué ser personero?
              </h2>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
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
              <div className="bg-secondary-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-secondary-900 mb-4">
                  Requisitos para ser personero
                </h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-secondary-700">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  ¿Qué hace un personero?
                </h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Verifica la identidad de los votantes</li>
                  <li>• Observa el desarrollo de la votación</li>
                  <li>• Fiscaliza el conteo de votos</li>
                  <li>• Firma el acta electoral</li>
                  <li>• Reporta irregularidades</li>
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
                <PersoneroForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Personeros;
