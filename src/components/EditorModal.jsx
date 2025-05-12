import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { stripHtml } from 'string-strip-html';

// Quill configuration
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

const quillFormats = ['bold', 'italic', 'underline'];

const EditorModal = ({ article, onClose, onSave }) => {
    const [editedArticle, setEditedArticle] = useState({
        ...article,
        content: article.content.map(block => ({
          ...block,
          // Convert array values to single string
          value: Array.isArray(block.value) 
            ? block.value.join('\n\n') 
            : block.value || ''
        }))
      });
  const handleChange = (path, value) => {
    setEditedArticle(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = clone;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }
      
      current[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const addContentBlock = () => {
    handleChange('content', [
      ...editedArticle.content,
      { type: 'text', value: '' } // Keep empty string, not <p></p>
    ]);
  };

  const handleSave = () => {
    const cleanedArticle = {
      ...editedArticle,
      content: editedArticle.content.map(contentBlock => {
        if (contentBlock.type === 'text') {
          // Ensure we're working with a string
          const rawValue = Array.isArray(contentBlock.value)
            ? contentBlock.value.join('\n\n')
            : contentBlock.value;
  
          const cleaned = stripHtml(rawValue).result.trim();
          return {
            ...contentBlock,
            value: cleaned
          };
        }
        return contentBlock;
      })
    };
    onSave(cleanedArticle);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl mb-4 text-white">Επεξεργασία Άρθρου</h2>

        {/* Main Fields */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-white">Τίτλος</label>
            <input
              type="text"
              value={editedArticle.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-white">Περίληψη</label>
            <textarea
              value={editedArticle.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white h-32"
            />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="mt-6">
          <h3 className="text-xl mb-4 text-white">Περιεχόμενο</h3>
          {editedArticle.content.map((block, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-700 rounded">
              <div className="flex justify-between mb-2">
                <label className="text-white">Τύπος Περιεχομένου</label>
                <select
                  value={block.type}
                  onChange={(e) => handleChange(`content.${index}.type`, e.target.value)}
                  className="bg-gray-600 text-white p-1 rounded"
                >
                  <option value="text">Κείμενο</option>
                  <option value="image">Εικόνα</option>
                  <option value="quote">Παράθεση</option>
                </select>
              </div>

              {block.type === 'text' && (
  <ReactQuill
    theme="snow"
    value={Array.isArray(block.value) ? block.value.join('\n') : block.value}
    onChange={(value) => handleChange(`content.${index}.value`, value)}
    modules={quillModules}
    formats={quillFormats}
    className="bg-gray-600 text-white rounded"
  />
)}

              {block.type === 'image' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={block.value?.src || ''}
                    onChange={(e) => handleChange(`content.${index}.value.src`, e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Alternative Text"
                    value={block.value?.alt || ''}
                    onChange={(e) => handleChange(`content.${index}.value.alt`, e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                </div>
              )}

              {block.type === 'quote' && (
                <textarea
                  value={block.value}
                  onChange={(e) => handleChange(`content.${index}.value`, e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded text-white h-32"
                />
              )}
            </div>
          ))}
          <button 
            onClick={addContentBlock}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Προσθήκη Περιεχομένου
          </button>
        </div>

        {/* Sources Editor */}
        <div className="mt-8">
          <h3 className="text-xl mb-4 text-white">Πηγές</h3>
          {editedArticle.sources?.map((source, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-700 rounded">
              <div className="flex gap-4 mb-2">
                <select
                  value={source.type}
                  onChange={(e) => handleChange(`sources.${index}.type`, e.target.value)}
                  className="bg-gray-600 text-white p-1 rounded"
                >
                  <option value="book">Βιβλίο</option>
                  <option value="newspaper">Εφημερίδα</option>
                  <option value="journal">Επιστημονικό Περιοδικό</option>
                </select>
              </div>

              {source.type === 'book' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Συγγραφέας"
                    value={source.name || ''}
                    onChange={(e) => handleChange(`sources.${index}.name`, e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Τίτλος Βιβλίου"
                    value={source.title || ''}
                    onChange={(e) => handleChange(`sources.${index}.title`, e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Έτος"
                      value={source.year || ''}
                      onChange={(e) => handleChange(`sources.${index}.year`, e.target.value)}
                      className="p-2 bg-gray-600 rounded text-white"
                    />
                    <input
                      type="text"
                      placeholder="Σελίδες"
                      value={source.pages || ''}
                      onChange={(e) => handleChange(`sources.${index}.pages`, e.target.value)}
                      className="p-2 bg-gray-600 rounded text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Ακύρωση
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Αποθήκευση
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;