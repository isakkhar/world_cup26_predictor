import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

export const useSEO = ({ title, description, keywords }: SEOProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = '2026 World Cup Predictor';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Open Graph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', description);
      
      // Twitter Description
      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDesc) {
        twitterDesc = document.createElement('meta');
        twitterDesc.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDesc);
      }
      twitterDesc.setAttribute('content', description);
    }

    // 3. Update Meta Keywords
    if (keywords) {
      let metaKeys = document.querySelector('meta[name="keywords"]');
      if (!metaKeys) {
        metaKeys = document.createElement('meta');
        metaKeys.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeys);
      }
      metaKeys.setAttribute('content', keywords);
    }

    // 4. Update Open Graph & Twitter Titles
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    // 5. Dynamic URL & Canonical tags (Works automatically on any domain)
    const currentURL = window.location.href;
    const currentOrigin = window.location.origin + window.location.pathname;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentOrigin);

    let ogURL = document.querySelector('meta[property="og:url"]');
    if (!ogURL) {
      ogURL = document.createElement('meta');
      ogURL.setAttribute('property', 'og:url');
      document.head.appendChild(ogURL);
    }
    ogURL.setAttribute('content', currentURL);

    let twitterURL = document.querySelector('meta[name="twitter:url"]');
    if (!twitterURL) {
      twitterURL = document.createElement('meta');
      twitterURL.setAttribute('name', 'twitter:url');
      document.head.appendChild(twitterURL);
    }
    twitterURL.setAttribute('content', currentURL);

  }, [title, description, keywords]);
};
