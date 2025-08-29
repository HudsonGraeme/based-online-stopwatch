import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
}

const SEOHead = ({ title, description, keywords, path }: SEOHeadProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const currentPath = path || location.pathname;
  const baseUrl = "https://based-online-stopwatch.com";
  const fullUrl = `${baseUrl}${currentPath}`;

  const defaultTitle = t(
    "Based Online Stopwatch - Free Online Timer & Stopwatch Tools"
  );
  const defaultDescription = t(
    "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity. No ads, no downloads required."
  );
  const defaultKeywords =
    "online stopwatch, free timer, countdown timer, online timer, web stopwatch, classroom timer, exam timer, presentation timer, race timer, productivity timer";

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = pageDescription;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", pageKeywords);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = pageKeywords;
      document.head.appendChild(meta);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", fullUrl);
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = fullUrl;
      document.head.appendChild(link);
    }

    // Update language meta
    const htmlLang = document.querySelector("html");
    if (htmlLang) {
      htmlLang.setAttribute("lang", i18n.language);
    }

    // Open Graph meta tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta("og:title", pageTitle);
    updateOrCreateMeta("og:description", pageDescription);
    updateOrCreateMeta("og:url", fullUrl);
    updateOrCreateMeta("og:type", "website");
    updateOrCreateMeta("og:site_name", "Based Online Stopwatch");
    updateOrCreateMeta("og:locale", i18n.language);

    // Twitter Card meta tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateTwitterMeta("twitter:card", "summary");
    updateOrCreateTwitterMeta("twitter:title", pageTitle);
    updateOrCreateTwitterMeta("twitter:description", pageDescription);
  }, [pageTitle, pageDescription, pageKeywords, fullUrl, i18n.language]);

  return null;
};

export default SEOHead;
