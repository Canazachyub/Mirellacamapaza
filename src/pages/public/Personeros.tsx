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
    description: 'Asegura que cada voto cuente y se respete la voluntad popular.',
  },
  {
    icon: Eye,
    title: 'Vigila el proceso',
    description: 'Sé los ojos del pueblo en las mesas de votación.',
  },
  {
    icon: FileText,
    title: 'Garantiza transparencia',
    description: 'Fiscaliza el conteo y firma las actas electorales.',
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
      <section className="pt-28 pb-20 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
              {CANDIDATA.partido} - Elecciones 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sé Personero de Mesa
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Tu presencia en las mesas de votación es fundamental para defender la democracia y garantizar elecciones transparentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits row */}
      <section className="-mt-10 relative z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900 text-sm md:text-base mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-secondary-600 text-xs md:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form - Full width centered */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-[920px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="!p-0 overflow-hidden shadow-xl border-2 border-gray-100">
              <div className="p-5 sm:p-6 md:p-8">
                <PersoneroForm />
              </div>
            </Card>
          </motion.div>

          {/* Requirements + Info below the form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-secondary-900 mb-4 text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Requisitos para ser personero
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-secondary-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                ¿Qué hace un personero?
              </h3>
              <ul className="text-blue-700 text-sm md:text-base space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Verifica la identidad de los votantes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Observa el desarrollo de la votación
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Fiscaliza el conteo de votos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Firma el acta electoral
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Reporta irregularidades
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Personeros;
