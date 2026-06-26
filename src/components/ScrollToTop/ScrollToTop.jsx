import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Al cambiar de ruta, sube la página al inicio con scroll suave.
 * Si la URL trae un #ancla (ej. "/#contacto"), hace scroll hasta
 * ese elemento en vez de ir al inicio.
 *
 * Nota: si confirmas que ya no usas ningún Link con #ancla en el
 * proyecto, esta rama del hash se puede eliminar y dejar solo el
 * scrollTo({ top: 0 }) del bloque "else".
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Esperar a que el DOM esté listo
      setTimeout(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
