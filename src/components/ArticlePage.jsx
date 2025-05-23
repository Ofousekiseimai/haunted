import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CATEGORY_CONFIG, SUBCATEGORY_MAP } from "../constants/categories";
import RandomArticles from "./RandomArticles";
import RelatedArticles from "./RelatedArticles";
import SameAreaArticles from "./SameAreaArticles";

import EditorModal from './EditorModal';

// Preload JSON files using Vite's glob import
const jsonModules = import.meta.glob("../data/**/*.json", {
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

        // Fix parameter priority and config lookup
        const config = SUBCATEGORY_MAP[subcategory || category];
        if (!config) throw new Error("Category configuration not found");

        // Get category configuration
        const categoryConfig = CATEGORY_CONFIG[config.category];
        if (!categoryConfig) throw new Error("Category config not found");

        // Build JSON path
        const jsonPath = `../data/${config.category}/${config.slug}.json`;
        const data = jsonModules[jsonPath];

        if (!data) {
          throw new Error(`Data file not found: ${jsonPath}`);
        }

        // Find the article
        const foundArticle = data.articles.find((a) => a.slug === slug);
        if (!foundArticle) throw new Error("Article not found");

        setArticle(foundArticle);
        setCategoryData(data);
      } catch (error) {
        setError(error.message);
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
        <title>{`${article.title} | haunted.gr`}</title>
        <meta name="description" content={article.excerpt} />

        <meta
          name="keywords"
          content={[
            article.mainArea,
            article.subLocation,
            category,
            subcategory,
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <link
          rel="canonical"
          href={`https://haunted.gr/${category}/${subcategory}/${slug}`}
        />

        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            datePublished: article.date,
            author: article.author
              ? {
                  "@type": "Person",
                  name: article.author,
                }
              : undefined,
            publisher: {
              "@type": "Organization",
              name: "haunted.gr",
              logo: {
                "@type": "ImageObject",
                url: "https://haunted.gr/logo.png",
              },
            },
            image: article.image?.src
              ? `https://haunted.gr${article.image.src}`
              : "https://haunted.gr/default-article.jpg",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": typeof window !== "undefined" ? window.location.href : "",
            },
          })}
        </script>
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
                    {source.type === "newspaper" && (
                      <div>
                        <p className="text-gray-300">
                          Δημοσιεύθηκε στο:{" "}
                          <span className="font-medium">{source.name}</span> (
                          {source.date})
                        </p>
                        {source.archive?.provider && (
                          <p className="text-sm text-gray-400 mt-1">
                            Αρχείο: {source.archive.provider}
                          </p>
                        )}
                      </div>
                    )}

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

                    {source.type === "efimerida" && (
                      <div>
                        <p className="text-gray-300">
                          Εφημερίδα:{" "}
                          <span className="font-medium">{source.name}</span> (
                          {source.date})
                        </p>
                        {source.provider && (
                          <p className="text-sm text-gray-400 mt-1">
                            Πηγή: {source.provider}
                          </p>
                        )}
                      </div>
                    )}

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
