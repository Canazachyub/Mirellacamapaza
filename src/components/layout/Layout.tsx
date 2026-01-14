import { type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { ToastContainer } from '@/components/common';
import { CANDIDATA } from '@/utils/constants';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showWhatsApp?: boolean;
}

const Layout = ({
  children,
  title,
  description,
  showHeader = true,
  showFooter = true,
  showWhatsApp = true,
}: LayoutProps) => {
  const pageTitle = title
    ? `${title} | ${CANDIDATA.nombreCompleto}`
    : `${CANDIDATA.nombreCompleto} | ${CANDIDATA.cargo} N° ${CANDIDATA.numeroLista}`;

  const pageDescription =
    description ||
    `Página oficial de ${CANDIDATA.nombreCompleto}, ${CANDIDATA.cargo} N° ${CANDIDATA.numeroLista} por ${CANDIDATA.partido}. Únete al cambio que Puno necesita.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {showHeader && <Header />}

        <main className="flex-1">{children}</main>

        {showFooter && <Footer />}

        {showWhatsApp && <WhatsAppButton />}

        <ToastContainer />
      </div>
    </>
  );
};

export default Layout;
