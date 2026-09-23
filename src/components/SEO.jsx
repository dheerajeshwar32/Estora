import { useEffect } from 'react';

const SEO = ({ title, description, url, image }) => {
  useEffect(() => {
    // Basic Meta
    document.title = title || 'Estora | Premium Real Estate';
    
    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'Discover premium real estate, luxury villas, and commercial properties with Estora.';

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;

    // Open Graph
    const updateOG = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateOG('og:title', title || 'Estora | Premium Real Estate');
    updateOG('og:description', description || 'Discover premium real estate properties.');
    if (image) updateOG('og:image', image);
    updateOG('og:url', url || window.location.href);
    updateOG('og:type', 'website');

  }, [title, description, url, image]);

  return null;
};

export default SEO;

