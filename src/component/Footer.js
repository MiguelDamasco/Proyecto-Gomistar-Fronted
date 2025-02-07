import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Gomistar S.A. | Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="/privacy-policy">Política de privacidad</a>
          <a href="/terms-of-service">Términos de servicio</a>
          <a href="/contact">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;