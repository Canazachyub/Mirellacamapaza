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
import { PROPUESTAS } from '@/utils/constants';
import { Modal } from '@/components/common';
import type { Proposal } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  GraduationCap,
  TrendingUp,
  Building,
  Leaf,
  TreePine,
};

interface ProposalCardProps {
  proposal: Proposal;
  index: number;
  onViewDetails: () => void;
}

const ProposalCard = ({ proposal, index, onViewDetails }: ProposalCardProps) => {
  const Icon = iconMap[proposal.icono] || Heart;

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
        <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
          <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
        </div>

        {/* Category */}
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
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
          className="inline-flex items-center text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors"
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

  return (
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
              onViewDetails={() => setSelectedProposal(proposal)}
            />
          ))}
        </div>
      </div>

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
            <p className="text-secondary-700 mb-6">
              {selectedProposal.descripcion}
            </p>

            {/* Details List */}
            <h4 className="font-semibold text-secondary-900 mb-3">
              Acciones específicas:
            </h4>
            <ul className="space-y-3">
              {selectedProposal.detalles.map((detalle, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-xs font-bold">
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
    </section>
  );
};

export default Proposals;
