import React, { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string; // path relative to site root, e.g. /splash.png
  canonical?: string;
  url?: string;
}

const upsertMeta = (selector: string, attr: string, value: string) => {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (selector.startsWith('meta[name')) el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
    if (selector.startsWith('meta[property')) el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setOrCreateLink = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const Seo: React.FC<SeoProps> = ({ title, description, image = '/splash.png', canonical, url }) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      upsertMeta('meta[name="description"]', 'content', description);
      upsertMeta('meta[property="og:description"]', 'content', description);
      upsertMeta('meta[name="twitter:description"]', 'content', description);
    }

    if (title) {
      upsertMeta('meta[property="og:title"]', 'content', title);
      upsertMeta('meta[name="twitter:title"]', 'content', title);
    }

    if (image) {
      upsertMeta('meta[property="og:image"]', 'content', image);
      upsertMeta('meta[name="twitter:image"]', 'content', image);
      upsertMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    }

    if (canonical) {
      setOrCreateLink('canonical', canonical);
    }

    // JSON-LD structured data (basic) - replace existing if present
    const ldId = 'seo-jsonld';
    let existing = document.getElementById(ldId);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: title || document.title,
      description: description || '',
      url: url || (canonical || window.location.href),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical || (url || window.location.href)
      }
    };

    if (existing) {
      existing.textContent = JSON.stringify(jsonLd);
    } else {
      const s = document.createElement('script');
      s.id = ldId;
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }

    return () => {
      // don't aggressively remove tags on unmount to preserve other pages' SEO; keep canonical and meta updated by next renders
    };
  }, [title, description, image, canonical, url]);

  return null;
};

export default Seo;
