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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROPUESTAS, PROPUESTAS_PARTIDO } from '@/utils/constants';
import { Modal } from '@/components/common';
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

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
  onViewDetails: () => void;
  accentColor?: 'primary' | 'amber';
}

const ProposalCard = ({ proposal, index, onViewDetails, accentColor = 'primary' }: ProposalCardProps) => {
  const Icon = iconMap[proposal.icono] || Heart;
  const isAmber = accentColor === 'amber';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${isAmber ? 'bg-amber-100 group-hover:bg-amber-500' : 'bg-primary-100 group-hover:bg-primary-600'} flex items-center justify-center mb-4 transition-colors`}>
          <Icon className={`w-7 h-7 ${isAmber ? 'text-amber-600' : 'text-primary-600'} group-hover:text-white transition-colors`} />
        </div>

        {/* Category */}
        <span className={`text-xs font-medium ${isAmber ? 'text-amber-600' : 'text-primary-600'} uppercase tracking-wider`}>
          {proposal.categoria}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-secondary-900 mt-2 mb-3">
          {proposal.titulo}
        </h3>

        {/* Description */}
        <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
          {proposal.descripcion}
        </p>

        {/* View More Button */}
        <button
          onClick={onViewDetails}
          className={`inline-flex items-center ${isAmber ? 'text-amber-600 hover:text-amber-700' : 'text-primary-600 hover:text-primary-700'} font-medium text-sm transition-colors`}
        >
          Ver detalles
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
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
    <>
      {/* Propuestas de la Candidata */}
      <section id="propuestas" className="py-16 lg:py-24 bg-secondary-50">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Nuestro Compromiso
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
              Propuestas de Gobierno
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Conoce las propuestas que llevaremos al Congreso para transformar Puno
              y mejorar la calidad de vida de todos los puneños.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPUESTAS.map((proposal, index) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                index={index}
                onViewDetails={() => handleSelect(proposal, 'candidata')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Plan de Gobierno Ahora Nación - Preview */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-secondary-50 to-amber-50/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
              Ahora Nación 2026–2031
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
              Plan de Gobierno Nacional
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Ejes estratégicos del partido Ahora Nación para la transformación del Perú.
            </p>
          </motion.div>

          {/* Grid - mostrar solo las primeras 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPUESTAS_PARTIDO.slice(0, 3).map((proposal, index) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                index={index}
                onViewDetails={() => handleSelect(proposal, 'partido')}
                accentColor="amber"
              />
            ))}
          </div>

          {/* Ver todas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/propuestas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Ver todas las propuestas
              <ArrowRight className="w-5 h-5" />
            </Link>
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
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                selectedSource === 'partido'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-primary-100 text-primary-600'
              }`}>
                {selectedProposal.categoria}
              </span>
              {selectedSource === 'partido' && (
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                  Plan Ahora Nación
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-secondary-700 mb-6">
              {selectedProposal.descripcion}
            </p>

            {/* Details List */}
            <h4 className="font-semibold text-secondary-900 mb-3">
              {selectedSource === 'partido' ? 'Ejes de acción:' : 'Acciones específicas:'}
            </h4>
            <ul className="space-y-3">
              {selectedProposal.detalles.map((detalle, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full ${
                    selectedSource === 'partido' ? 'bg-amber-100' : 'bg-primary-100'
                  } flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className={`${
                      selectedSource === 'partido' ? 'text-amber-600' : 'text-primary-600'
                    } text-xs font-bold`}>
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-secondary-700">{detalle}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Proposals;
