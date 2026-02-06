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
  HeartPulse,
  Factory,
  TrainFront,
  Shield,
  Zap,
  Home,
  Landmark,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button, Modal } from '@/components/common';
import { PROPUESTAS, PROPUESTAS_PARTIDO, CANDIDATA } from '@/utils/constants';
import type { Proposal } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  TrendingUp,
  Building,
  Leaf,
  TreePine,
  HeartPulse,
  Factory,
  TrainFront,
  Shield,
  Zap,
  Home,
  Landmark,
};

const ProposalCard = ({ proposal, index, onSelect, accentColor = 'primary' }: {
  proposal: Proposal;
  index: number;
  onSelect: () => void;
  accentColor?: 'primary' | 'amber';
}) => {
  const Icon = iconMap[proposal.icono] || Heart;
  const isAmber = accentColor === 'amber';

  return (
    <motion.div
      key={proposal.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary-100"
    >
      <div className={`h-2 ${isAmber ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'gradient-primary'}`} />

      <div className="p-6">
        <div className={`w-16 h-16 rounded-2xl ${isAmber ? 'bg-amber-100 group-hover:bg-amber-500' : 'bg-primary-100 group-hover:bg-primary-600'} flex items-center justify-center mb-5 transition-colors`}>
          <Icon className={`w-8 h-8 ${isAmber ? 'text-amber-600' : 'text-primary-600'} group-hover:text-white transition-colors`} />
        </div>

        <span className={`text-xs font-semibold ${isAmber ? 'text-amber-600' : 'text-primary-600'} uppercase tracking-wider`}>
          {proposal.categoria}
        </span>

        <h3 className="text-2xl font-bold text-secondary-900 mt-2 mb-3">
          {proposal.titulo}
        </h3>

        <p className="text-secondary-600 mb-5">
          {proposal.descripcion}
        </p>

        <ul className="space-y-2 mb-5">
          {proposal.detalles.slice(0, 2).map((detalle, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
              <span className={`w-1.5 h-1.5 rounded-full ${isAmber ? 'bg-amber-500' : 'bg-primary-500'} mt-2 flex-shrink-0`} />
              {detalle}
            </li>
          ))}
          {proposal.detalles.length > 2 && (
            <li className="text-sm text-secondary-400">
              +{proposal.detalles.length - 2} más...
            </li>
          )}
        </ul>

        <Button
          variant="outline"
          size="sm"
          onClick={onSelect}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          fullWidth
        >
          Ver detalles completos
        </Button>
      </div>
    </motion.div>
  );
};

const Proposals = () => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedSource, setSelectedSource] = useState<'candidata' | 'partido' | null>(null);

  const handleSelect = (proposal: Proposal, source: 'candidata' | 'partido') => {
    setSelectedProposal(proposal);
    setSelectedSource(source);
  };

  return (
    <Layout title="Propuestas" description="Conoce las propuestas de gobierno de la Dra. Mirella Camapaza y el Plan de Gobierno de Ahora Nación.">
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

      {/* Propuestas de la Candidata */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              {CANDIDATA.nombreCompleto}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">
              Propuestas de la Candidata
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Compromisos directos de la {CANDIDATA.titulo} {CANDIDATA.nombre} {CANDIDATA.apellidos} como {CANDIDATA.cargo}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROPUESTAS.map((proposal, index) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                index={index}
                onSelect={() => handleSelect(proposal, 'candidata')}
                accentColor="primary"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Separador */}
      <div className="container-custom">
        <div className="border-t border-secondary-200" />
      </div>

      {/* Plan de Gobierno - Ahora Nación */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Ahora Nación 2026–2031
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">
              Plan de Gobierno Nacional
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Ejes estratégicos del Plan de Gobierno del partido Ahora Nación para la transformación del Perú.
            </p>
          </motion.div>

          {/* Ideas Fuerza */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-md border border-amber-200 p-6 md:p-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-secondary-900 mb-4 text-center">
                Ideas Fuerza del Plan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Descentralización productiva',
                  'Industrialización regional',
                  'Modernización del Estado',
                  'Infraestructura como motor',
                ].map((idea) => (
                  <div key={idea} className="text-center p-3 bg-amber-50 rounded-xl">
                    <p className="text-sm font-semibold text-amber-800">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROPUESTAS_PARTIDO.map((proposal, index) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                index={index}
                onSelect={() => handleSelect(proposal, 'partido')}
                accentColor="amber"
              />
            ))}
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
        onClose={() => { setSelectedProposal(null); setSelectedSource(null); }}
        title={selectedProposal?.titulo}
        size="lg"
      >
        {selectedProposal && (
          <div>
            {/* Source Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                {selectedProposal.categoria}
              </span>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                selectedSource === 'partido'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-secondary-100 text-secondary-600'
              }`}>
                {selectedSource === 'partido' ? 'Plan Ahora Nación' : `Propuesta de ${CANDIDATA.nombre} ${CANDIDATA.apellidos}`}
              </span>
            </div>

            {/* Description */}
            <p className="text-secondary-700 text-lg mb-6">
              {selectedProposal.descripcion}
            </p>

            {/* Details List */}
            <h4 className="font-bold text-secondary-900 mb-4 text-lg">
              {selectedSource === 'partido' ? 'Ejes de acción:' : 'Acciones específicas que impulsaremos:'}
            </h4>
            <ul className="space-y-4">
              {selectedProposal.detalles.map((detalle, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full ${
                    selectedSource === 'partido' ? 'bg-amber-100' : 'bg-primary-100'
                  } flex items-center justify-center flex-shrink-0`}>
                    <span className={`${
                      selectedSource === 'partido' ? 'text-amber-600' : 'text-primary-600'
                    } text-sm font-bold`}>
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
