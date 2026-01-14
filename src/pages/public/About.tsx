import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Heart,
  Award,
  Users,
  Target,
  ArrowRight,
  Scale,
  Calculator,
  Building2,
  Globe,
  FileText,
  CheckCircle,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button, Card } from '@/components/common';
import { CANDIDATA } from '@/utils/constants';

// Formación académica
const education = [
  {
    title: 'Abogada Titulada',
    institution: 'Universidad Nacional de San Antonio Abad del Cusco',
    icon: Scale,
  },
  {
    title: 'Contadora Pública',
    institution: 'Universidad Andina del Cusco',
    icon: Calculator,
  },
  {
    title: 'Maestría en Gestión Pública',
    institution: 'Universidad del Pacífico (en curso)',
    icon: GraduationCap,
  },
  {
    title: 'Máster en Cooperación Internacional',
    institution: 'Universidad de la Rioja, España (en curso)',
    icon: Globe,
  },
];

// Diplomados y especializaciones
const specializations = [
  'Diplomado en Derecho Administrativo - Universidad ESAN',
  'Diplomado en Gobierno y Políticas Públicas - Pontificia Universidad Católica del Perú',
  'Especialización en Tributación - Universidad del Pacífico',
  'Diplomado en Contrataciones con el Estado - Universidad Peruana Austral',
  'Especialización en Procedimiento Administrativo Sancionador - Universidad ESAN',
];

// Experiencia laboral
const experience = [
  {
    period: '2025',
    title: 'Sub Gerente de Evaluación, Desarrollo y Capacitación',
    institution: 'EsSalud - Seguro Social de Salud',
    description: 'Liderazgo del Plan de Desarrollo de las Personas y programas de formación profesional a nivel nacional.',
    icon: Building2,
  },
  {
    period: '2023 - 2025',
    title: 'Asesora de la Oficina de Cooperación Internacional',
    institution: 'EsSalud - Seguro Social de Salud',
    description: 'Negociación de convenios internacionales, gestión de proyectos de cooperación técnica y relaciones con organismos internacionales.',
    icon: Globe,
  },
  {
    period: '2021 - 2023',
    title: 'Asesora de Despachos Congresales',
    institution: 'Congreso de la República del Perú',
    description: 'Elaboración de Proyectos de Ley, gestión de pedidos y reuniones con gremios y organizaciones de la sociedad civil.',
    icon: FileText,
  },
  {
    period: '2021',
    title: 'Abogada - PROMOVILIDAD',
    institution: 'Ministerio de Transportes y Comunicaciones',
    description: 'Asistencia legal y fortalecimiento de capacidades institucionales de gobiernos locales.',
    icon: Building2,
  },
  {
    period: '2017',
    title: 'Auditora Tributaria',
    institution: 'SUNAT',
    description: 'Fiscalización, procedimientos tributarios y evaluación de denuncias.',
    icon: Calculator,
  },
  {
    period: '2016 - 2017',
    title: 'Asesora Jurídica',
    institution: 'SUNARP',
    description: 'Elaboración de documentos legales, procedimientos administrativos sancionadores y disciplinarios.',
    icon: Scale,
  },
];

// Valores
const values = [
  {
    icon: Heart,
    title: 'Compromiso',
    description: 'Dedicación total al servicio de los puneños y al desarrollo de nuestra región.',
  },
  {
    icon: Users,
    title: 'Cercanía',
    description: 'Trabajo directo con la población, escuchando y atendiendo sus necesidades reales.',
  },
  {
    icon: Target,
    title: 'Resultados',
    description: 'Enfoque en acciones concretas que generen cambios tangibles para Puno.',
  },
];

const About = () => {
  return (
    <Layout title="Conóceme" description="Conoce la historia y trayectoria de la Dra. Mirella Camapaza Quispe, profesional multidisciplinaria con experiencia en gestión pública.">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              Abogada y Contadora Pública
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {CANDIDATA.nombreCompleto}
            </h1>
            <p className="text-xl text-white/90">
              {CANDIDATA.cargo} | {CANDIDATA.partido}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://raw.githubusercontent.com/Canazachyub/GIFS/refs/heads/main/DRa.%20mirella%20.png"
                  alt={CANDIDATA.nombreCompleto}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 rounded-2xl -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Mi Historia
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
                Profesional al Servicio de Puno
              </h2>

              <div className="space-y-4 text-secondary-600">
                <p>
                  Soy la <strong className="text-secondary-900">Dra. Mirella Camapaza Quispe</strong>,
                  profesional multidisciplinaria con <strong className="text-primary-600">doble titulación como Abogada y Contadora</strong>,
                  colegiada y con una sólida formación en Derecho Administrativo, Gestión Pública y Derecho Tributario.
                </p>
                <p>
                  Mi trayectoria incluye experiencia destacada en instituciones gubernamentales de prestigio como el
                  <strong className="text-secondary-900"> Congreso de la República</strong>, donde participé directamente en la
                  <strong className="text-primary-600"> elaboración de Proyectos de Ley</strong> y en la gestión de las necesidades
                  de la ciudadanía ante el Poder Ejecutivo, Gobiernos Locales y Regionales.
                </p>
                <p>
                  He ocupado cargos de alta responsabilidad como <strong className="text-secondary-900">Sub Gerente en EsSalud</strong>,
                  liderando programas de desarrollo y capacitación a nivel nacional. Además, cuento con experiencia en
                  <strong className="text-primary-600"> cooperación internacional</strong>, negociando convenios y gestionando
                  proyectos con organismos internacionales.
                </p>
              </div>

              <blockquote className="mt-6 p-4 bg-primary-50 border-l-4 border-primary-600 rounded-r-lg">
                <p className="text-secondary-700 italic">
                  "{CANDIDATA.slogan}"
                </p>
              </blockquote>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/propuestas">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Ver mis propuestas
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button variant="outline">
                    Contáctame
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formación Académica */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Preparación Académica
            </span>
            <h2 className="text-3xl font-bold text-secondary-900 mt-2 mb-4">
              Formación Profesional
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Una sólida preparación académica que respalda mi capacidad para legislar y gestionar políticas públicas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {education.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-500 text-sm">
                    {item.institution}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Especializaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary-600" />
              Diplomados y Especializaciones
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {specializations.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experiencia Laboral */}
      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Trayectoria Profesional
            </span>
            <h2 className="text-3xl font-bold text-secondary-900 mt-2 mb-4">
              Experiencia en el Sector Público
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Años de experiencia en instituciones gubernamentales de primer nivel, trabajando por el bienestar de los peruanos.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {experience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                        <item.icon className="w-7 h-7 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-secondary-900">
                          {item.title}
                        </h3>
                        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-primary-700 font-medium mb-2">
                        {item.institution}
                      </p>
                      <p className="text-secondary-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Experiencia adicional en Puno */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-bold text-primary-800 mb-4">
              Experiencia en la Región Puno
            </h3>
            <p className="text-secondary-700 mb-4">
              Además de mi experiencia en instituciones nacionales, he trabajado directamente con gobiernos locales de nuestra región:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900">Municipalidad Provincial de Lampa</h4>
                <p className="text-sm text-secondary-600">Asesora Legal - Derecho administrativo, municipal y laboral</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900">Municipalidad de Salcedo</h4>
                <p className="text-sm text-secondary-600">Asesora Legal - Procedimientos administrativos y contenciosos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Mis Valores
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Los principios que guían mi trabajo y mi compromiso con Puno.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Únete a nuestra campaña!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Con mi experiencia en el Congreso y en gestión pública, estoy preparada para
              representar a Puno y llevar nuestras necesidades al más alto nivel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
    </Layout>
  );
};

export default About;
