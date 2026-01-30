import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Youtube,
  Twitter,
} from 'lucide-react';
import { CANDIDATA, CONTACTO, REDES_SOCIALES, NAV_ITEMS } from '@/utils/constants';
import { getWhatsAppUrl } from '@/utils/helpers';

// Icono de TikTok personalizado
const TikTokIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center font-display font-bold text-2xl">
                {CANDIDATA.numeroLista}
              </div>
              <div>
                <p className="font-display font-bold text-lg">
                  {CANDIDATA.titulo} {CANDIDATA.nombre}
                </p>
                <p className="text-sm text-secondary-400">{CANDIDATA.partido}</p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm mb-4">
              {CANDIDATA.cargo} N° {CANDIDATA.numeroLista}
            </p>
            <p className="text-secondary-400 text-sm italic">
              "{CANDIDATA.slogan}"
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/afiliate"
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  ¡Afíliate!
                </Link>
              </li>
              <li>
                <Link
                  to="/voluntariado"
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Sé Voluntario
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{CONTACTO.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTO.email}`}
                  className="flex items-center gap-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{CONTACTO.email}</span>
                </a>
              </li>
              <li>
                <Link
                  to="/sedes"
                  className="flex items-start gap-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="text-sm">
                    Parque Industrial Salcedo, Puno
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
            <div className="flex gap-3">
              <a
                href={REDES_SOCIALES.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-secondary-300 hover:bg-primary-600 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={REDES_SOCIALES.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-secondary-300 hover:bg-primary-600 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={REDES_SOCIALES.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-secondary-300 hover:bg-primary-600 hover:text-white transition-all"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.youtube.com/@MirellaCamapazaQuispe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-secondary-300 hover:bg-red-600 hover:text-white transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/QuispeDra86276"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-secondary-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-6">
              <a
                href={REDES_SOCIALES.whatsappGrupo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Únete al grupo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-400 text-sm text-center md:text-left">
            © {currentYear} {CANDIDATA.nombreCompleto}. Todos los derechos reservados.
          </p>
          <p className="text-secondary-500 text-sm">
            {CANDIDATA.partido} - Elecciones 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
