import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CATEGORY_CONFIG, SUBCATEGORY_MAP } from "../constants/categories";
import RandomArticles from "./RandomArticles";
import RelatedArticles from "./RelatedArticles";
import SameAreaArticles from "./SameAreaArticles";

import EditorModal from './EditorModal';

// Preload JSON files using Vite's glob import
const jsonModules = import.meta.glob("/data/**/*.json", {
  eager: true,
  import: "default",
});

export default function ArticlePage() {
  const { category, subcategory, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editedArticle, setEditedArticle] = useState(null);


  useEffect(() => {
  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get category configuration
      const config = SUBCATEGORY_MAP[subcategory || category];
      if (!config) throw new Error("Δεν βρέθηκε η κατηγορία");

      // Get category base path from CATEGORY_CONFIG
      const categoryConfig = CATEGORY_CONFIG[config.category];
      if (!categoryConfig) throw new Error("Δεν βρέθηκε ρύθμιση κατηγορίας");

      // Build correct data path
      const jsonUrl = `${categoryConfig.dataPath}${config.slug}.json`;
      
      // Fetch from public directory
      const response = await fetch(jsonUrl);
      if (!response.ok) throw new Error(`HTTP σφάλμα ${response.status}`);
      
      const data = await response.json();

      // Find article by slug
      const foundArticle = data.articles.find((a) => a.slug === slug);
      if (!foundArticle) throw new Error("Δεν βρέθηκε το άρθρο");

      setArticle(foundArticle);
      setCategoryData(data);
    } catch (error) {
      console.error('Σφάλμα φόρτωσης:', error);
      setError(`Πρόβλημα φόρτωσης: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  loadArticle();
}, [category, subcategory, slug]);
  // Add this scroll effect
  useEffect(() => {
    // Smooth scroll to top when article changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [article?.id]); // Trigger when article ID changes
  // Add this useEffect at the top of your component, after the other effects
  useEffect(() => {
    // Scroll to top when component mounts or article changes
    window.scrollTo(0, 0);
  }, [category, subcategory, slug]); // Add all route parameters as dependencies

  // Add this utility function inside the ArticlePage component

  const renderContent = (content, index) => {
    switch (content.type) {
     // In your renderContent function
case 'text':
  return (
    <div 
      key={index} 
      className="mb-4 text-lg leading-relaxed text-gray-200 whitespace-pre-line"
    >
      {Array.isArray(content.value) 
        ? content.value.join('\n\n') 
        : content.value}
    </div>
  );

      case "image":
        return content.value?.src ? (
          <figure key={index} className="my-8">
            <LazyLoadImage
              src={content.value.src}
              alt={content.value.alt}
              effect="opacity"
              className="rounded-lg w-full max-w-full shadow-lg"
              placeholderSrc="/placeholder.jpg"
            />
            {content.value.caption && (
              <figcaption className="text-center mt-2 text-sm italic text-gray-600">
                {content.value.caption}
              </figcaption>
            )}
          </figure>
        ) : null;

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-amber-600 pl-4 my-6 italic text-gray-200 bg-amber-50 p-4 rounded-r"
          >
            {content.value}
          </blockquote>
        );

      default:
        console.warn("Unknown content type:", content.type);
        return null;
    }
  };

  const normalizeSourceValue = (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : null;
    }
    return value ?? null;
  };

  const renderSourceText = (label, value) => {
    const normalized = normalizeSourceValue(value);
    if (!normalized) return null;

    return (
      <p className="text-gray-300">
        <span className="font-semibold">{label}:</span>{' '}
        {normalized}
      </p>
    );
  };

  const renderSourceLink = (label, url, key) => {
    const normalized = normalizeSourceValue(url);
    if (!normalized) return null;

    return (
      <a
        key={key}
        href={normalized}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-400 hover:underline"
      >
        {label}
      </a>
    );
  };

  const renderPeriodicalSource = (source, heading = 'Εφημερίδα') => {
    const providerValues = Array.from(
      new Set(
        [source.provider, source.archive?.provider]
          .map(normalizeSourceValue)
          .filter(Boolean)
      )
    );

    const linkValues = Array.from(
      new Set(
        [source.archive?.url, source.url, source.link]
          .map(normalizeSourceValue)
          .filter(Boolean)
      )
    );

    return (
      <div>
        <p className="font-medium text-gray-300">{heading}</p>
        <div className="mt-2 space-y-1">
          {renderSourceText(source.name)}
          {source.title && (
            <p className="text-gray-300 italic">
              "{source.title}"
            </p>
          )}
          {renderSourceText('Συγγραφέας', source.author)}
          {renderSourceText('Ημερομηνία', source.date)}
          {renderSourceText('Έτος', source.year)}
          {renderSourceText('Τεύχος', source.issue)}
          {renderSourceText('Σελίδες', source.pages || source.page)}
          {providerValues.map((value, idx) => (
            <p key={`provider-${idx}`} className="text-gray-300">
              <span className="font-semibold">Αρχείο:</span> {value}
            </p>
          ))}
          {linkValues.map((value, idx) =>
            renderSourceLink('Δείτε το αρχείο', value, `periodical-link-${idx}`)
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <span className="ml-2">Φόρτωση άρθρου...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">Σφάλμα</h2>
        <p>{error}</p>
        <Link to="/" className="text-blue-600 underline">
          Επιστροφή στην αρχική
        </Link>
      </div>
    );
  }

  if (!article || !categoryData) {
    return null;
  }

  const pathSegments = [category, subcategory, slug].filter(Boolean);
  const canonicalPath = pathSegments.join('/');
  const canonicalUrl = `https://haunted.gr/${canonicalPath}`;
  const pageTitle = `${article.title} | haunted.gr`;
  const metaDescription = article.excerpt || 'Ανακαλύψτε λαογραφικές και παραφυσικές ιστορίες στο haunted.gr.';
  const ogImage = article.image?.src
    ? `https://haunted.gr${article.image.src}`
    : 'https://haunted.gr/images/og-default-image.webp';

  const handleSaveArticle = async (updatedArticle) => {
    try {
      const response = await fetch(`http://localhost:3001/api/article/${category}/${subcategory}/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Dev-Mode': 'true'
        },
        body: JSON.stringify(updatedArticle),
      });
  
      if (!response.ok) throw new Error('Failed to save article');
      
      setArticle(updatedArticle);
      setShowEditor(false);
      alert('Article saved successfully!');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl mt-5">
     <Helmet>
  {/* Primary Meta Tags */}
  <title>{pageTitle}</title>
  <meta name="description" content={metaDescription} />
  
  {/* Location Meta Tags */}
  <meta name="geo.region" content="GR" />
  <meta name="geo.placename" content={article.mainArea} />
  {article.lat && article.lng && (
    <meta name="geo.position" content={`${article.lat};${article.lng}`} />
  )}
  {article.lat && article.lng && (
    <meta name="ICBM" content={`${article.lat}, ${article.lng}`} />
  )}

  {/* Canonical URL */}
  <link rel="canonical" href={canonicalUrl} />

  {/* Open Graph / Facebook */}
  <meta property="og:type" content="article" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="haunted.gr" />
  <meta property="og:locale" content="el_GR" />
  <meta property="article:published_time" content={article.date} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={metaDescription} />
  <meta name="twitter:image" content={ogImage} />

  {/* Schema.org Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "datePublished": article.date,
      "author": article.author ? {
        "@type": "Person",
        "name": article.author
      } : undefined,
      "publisher": {
        "@type": "Organization",
        "name": "haunted.gr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://haunted.gr/logo.png",
          "width": 300,
          "height": 60
        }
      },
      "image": ogImage,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      // Location schema
      "spatialCoverage": {
        "@type": "Place",
        "name": article.mainArea,
        "geo": article.lat && article.lng ? {
          "@type": "GeoCoordinates",
          "latitude": article.lat,
          "longitude": article.lng
        } : undefined
      }
    })}
  </script>

  {/* Breadcrumb Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Αρχική",
          "item": "https://haunted.gr/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryData?.title || "",
          "item": `https://haunted.gr/${category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": canonicalUrl
        }
      ]
    })}
  </script>

  {/* Preconnect for faster image loading */}
  <link rel="preconnect" href="https://images.haunted.gr" />
</Helmet>

      <div className="container mx-auto p-4 max-w-3xl mt-5">
      {import.meta.env.DEV && (
 <button 
 onClick={() => setShowEditor(false)}
 style={{ display: 'none' }}
 className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 z-50"
>
 Επεξεργασία Άρθρου
</button>
)}

      <article className="mb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-4 border-b-2 border-gray-300 pb-2">
            {article.title}
          </h1>

          {article.image?.src && (
            <figure className="my-6">
              <LazyLoadImage
                src={article.image.src}
                alt={article.image.alt}
                effect="opacity"
                className="rounded-lg w-full max-w-full shadow-md"
                placeholderSrc="/placeholder.jpg"
              />
              {article.image.alt && (
                <figcaption className="text-center mt-2 text-sm italic text-gray-200">
                  {article.image.alt}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        <div className="prose max-w-none">
          {article.content?.map(renderContent)}
        </div>

        <div className="bg-transparent p-4 rounded-lg border-l-4  mt-8 border  border-gray-700">
          <div className="flex flex-col space-y-2 text-sm text-gray-200">
            <div className="flex items-center">
              <span className="font-semibold w-24">Τοποθεσία:</span>
              <span className="italic-text-white">
                {article.mainArea}
                {(article.subLocation || article.subLocation2) && (
                  <span className="text-white">
                    {" - "}
                    {[article.subLocation, article.subLocation2]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {(article.sources || article.source) && (
          <div className="mt-8 pt-6 border-t-2 border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Πηγές</h3>
            <div className="space-y-4">
              {(article.sources || [article.source]).map((source, index) => {
                if (typeof source === "string") {
                  return (
                    <div key={index} className="bg-transparent p-4 rounded-lg">
                      <p className="text-gray-300">
                        Δημοσίευση:{" "}
                        <span className="font-medium">{source}</span>
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="bg-transparent p-4 rounded-lg border-l-4  mt-8 border  border-gray-700"
                  >
                    {source.type === "newspaper" && renderPeriodicalSource(source, 'Εφημερίδα')}

                    {source.type === "contributor" && (
                      <div>
                        <p className="font-medium text-gray-300">
                          {source.name} - {source.role}
                        </p>
                        <div className="mt-2 space-y-2">
                          {source.links?.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.link}
                              className="flex items-center text-blue-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="mr-2">
                                {link.type === "book" ? "📚" : "🌐"}
                              </span>
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Navigation Arrows - Add this section */}

                    {source.type === "efimerida" && renderPeriodicalSource(source, 'Εφημερίδα')}

                    {source.type === "journal" && (
                      <div>
                        <p className="font-medium text-gray-300">
                          Επιστημονικό Περιοδικό
                        </p>
                        <div className="mt-2 space-y-1">
                          {source.author && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Συγγραφέας:</span>{" "}
                              {source.author}
                            </p>
                          )}
                          {source.year && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Έτος:</span>{" "}
                              {source.year}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {source.type === "manuscript" && (
                      <div>
                        <p className="font-medium text-gray-300">Χειρόγραφο</p>
                        <div className="mt-2 space-y-1">
                          {source.codex && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Κώδικας:</span>{" "}
                              {source.codex}
                            </p>
                          )}
                          {source.library && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Βιβλιοθήκη:</span>{" "}
                              {source.library}
                            </p>
                          )}
                          {source.folio && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Φύλλο:</span>{" "}
                              {source.folio}
                            </p>
                          )}
                          {source.year && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Έτος:</span>{" "}
                              {source.year}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {source.type === "book" && (
                      <div>
                        <p className="font-medium text-gray-300">
                          Βιβλιογραφική Αναφορά
                        </p>
                        <div className="mt-2 space-y-1">
                          {source.name && (
                            <p className="text-gray-300">
                              <span className="font-semibold">Συγγραφέας:</span>{" "}
                              {source.name}
                            </p>
                          )}
                          {source.title && (
                            <p className="text-gray-300 italic">
                              "{source.title}"
                            </p>
                          )}
                          <div className="flex gap-4">
                            {source.year && (
                              <p className="text-gray-300">
                                <span className="font-semibold">Έτος:</span>{" "}
                                {source.year}
                              </p>
                            )}
                            {source.pages && (
                              <p className="text-gray-300">
                                <span className="font-semibold">Σελίδες:</span>{" "}
                                {source.pages}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>

       {showEditor && (
    <EditorModal
      article={article}
      onClose={() => setShowEditor(false)}
      onSave={handleSaveArticle}
    />
  )}
</div>  {/* This is your existing closing div */}

      <div className="mt-12 border-t-2 border-gray-800 pt-12">
        <h2 className="text-2xl font-bold mb-6 text-white"></h2>

        <RelatedArticles
          currentSubcategory={subcategory || category}
          currentArticleId={article.id}
        />

        <SameAreaArticles
          currentMainArea={article.mainArea}
          currentArticleId={article.id}
        />

        <RandomArticles currentArticleId={article.id} />
      </div>
    </div>
  );
}
