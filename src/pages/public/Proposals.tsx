import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  GraduationCap,
  TrendingUp,
  Building,
  Leaf,
  TreePine,
  ChevronRight,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button, Modal } from '@/components/common';
import { PROPUESTAS, CANDIDATA } from '@/utils/constants';
import type { Proposal } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  TrendingUp,
  Building,
  Leaf,
  TreePine,
};

const Proposals = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  return (
    <Layout title="Propuestas" description="Conoce las propuestas de gobierno de la Dra. Mirella Camapaza.">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
              Nuestro Compromiso
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Propuestas de Gobierno
            </h1>
            <p className="text-xl text-white/90">
              Conoce las propuestas que llevaremos al Congreso para transformar Puno
              y mejorar la calidad de vida de todos los puneños.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Propuestas Grid */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROPUESTAS.map((proposal, index) => {
              const Icon = iconMap[proposal.icono] || Heart;

              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary-100"
                >
                  {/* Header con gradiente */}
                  <div className="h-2 gradient-primary" />

                  <div className="p-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                      <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                    </div>

                    {/* Category */}
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                      {proposal.categoria}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-secondary-900 mt-2 mb-3">
                      {proposal.titulo}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary-600 mb-5">
                      {proposal.descripcion}
                    </p>

                    {/* Preview of details */}
                    <ul className="space-y-2 mb-5">
                      {proposal.detalles.slice(0, 2).map((detalle, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                          {detalle}
                        </li>
                      ))}
                      {proposal.detalles.length > 2 && (
                        <li className="text-sm text-secondary-400">
                          +{proposal.detalles.length - 2} más...
                        </li>
                      )}
                    </ul>

                    {/* View More Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProposal(proposal)}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                      fullWidth
                    >
                      Ver detalles completos
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes alguna propuesta?
            </h2>
            <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
              Queremos escucharte. Comparte tus ideas y juntos construyamos las propuestas
              que Puno necesita.
            </p>
            <a href="/contacto">
              <Button variant="white" size="lg">
                Envíanos tu propuesta
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={!!selectedProposal}
        onClose={() => setSelectedProposal(null)}
        title={selectedProposal?.titulo}
        size="lg"
      >
        {selectedProposal && (
          <div>
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4">
              {selectedProposal.categoria}
            </span>

            {/* Description */}
            <p className="text-secondary-700 text-lg mb-6">
              {selectedProposal.descripcion}
            </p>

            {/* Details List */}
            <h4 className="font-bold text-secondary-900 mb-4 text-lg">
              Acciones específicas que impulsaremos:
            </h4>
            <ul className="space-y-4">
              {selectedProposal.detalles.map((detalle, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-secondary-700 pt-1">{detalle}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-secondary-600 italic text-center">
                "{CANDIDATA.slogan}"
              </p>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Proposals;
