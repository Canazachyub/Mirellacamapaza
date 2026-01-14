import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ContactForm } from '@/components/forms';
import { Card } from '@/components/common';
import { CONTACTO, REDES_SOCIALES, SEDES } from '@/utils/constants';
import { getWhatsAppUrl } from '@/utils/helpers';

const contactInfo = [
  {
    icon: Phone,
    title: 'WhatsApp',
    value: CONTACTO.whatsappDisplay,
    link: getWhatsAppUrl(),
    isExternal: true,
  },
  {
    icon: Mail,
    title: 'Email',
    value: CONTACTO.email,
    link: `mailto:${CONTACTO.email}`,
    isExternal: true,
  },
  {
    icon: MapPin,
    title: 'Sede Principal',
    value: SEDES[0].direccion,
    link: SEDES[0].googleMapsUrl,
    isExternal: true,
  },
  {
    icon: Clock,
    title: 'Horario de Atención',
    value: 'Lun - Sáb: 8:00 AM - 6:00 PM',
    link: null,
    isExternal: false,
  },
];

const Contact = () => {
  return (
    <Layout title="Contacto" description="Contáctanos y forma parte del cambio. Estamos para escucharte.">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Tienes preguntas?
            </h1>
            <p className="text-xl text-white/90">
              Estamos aquí para escucharte. Contáctanos y te responderemos lo más pronto posible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 -mt-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card>
                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                  Información de Contacto
                </h2>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500">{item.title}</p>
                        {item.link ? (
                          <a
                            href={item.link}
                            target={item.isExternal ? '_blank' : undefined}
                            rel={item.isExternal ? 'noopener noreferrer' : undefined}
                            className="text-secondary-900 font-medium hover:text-primary-600 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-secondary-900 font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Social Media */}
              <Card>
                <h3 className="font-semibold text-secondary-900 mb-4">
                  Síguenos en redes
                </h3>
                <div className="flex gap-3">
                  <a
                    href={REDES_SOCIALES.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={REDES_SOCIALES.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={REDES_SOCIALES.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600 hover:bg-secondary-800 hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </a>
                </div>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card>
                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                  Envíanos un mensaje
                </h2>
                <ContactForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
