import React, { useState } from 'react';
import axios from 'axios';
import { 
  Save, 
  RotateCcw, 
  Code, 
  Wand2, 
  Copy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

// Utility Functions: Encode and Decode JSON
const encodeObject = (obj) => {
  try {
    return JSON.stringify(obj)
      .replace(/"/g, '[[DQ]]')
      .replace(/:/g, '[[COLON]]')
      .replace(/,/g, '[[COMMA]]');
  } catch (error) {
    console.error("Encoding failed:", error);
    return '';
  }
};

const decodeObject = (codedString) => {
  try {
    return JSON.parse(
      codedString
        .replace(/\[\[DQ\]\]/g, '"')
        .replace(/\[\[COLON\]\]/g, ':')
        .replace(/\[\[COMMA\]\]/g, ',')
    );
  } catch (error) {
    console.error("Failed to decode object:", error);
    return null;
  }
};

const EndpointJsonEditor = ({ Projectid, endpointId, initialPayload = '{}' }) => {
  const [jsonData, setJsonData] = useState(() => {
    const decoded = decodeObject(initialPayload);
    return JSON.stringify(decoded || {}, null, 2);
  });
  const [originalJson, setOriginalJson] = useState(() => {
    const decoded = decodeObject(initialPayload);
    return JSON.stringify(decoded || {}, null, 2);
  });
  
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [numEntries, setNumEntries] = useState(5);
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleJsonChange = (e) => {
    const newJsonData = e.target.value;
    setJsonData(newJsonData);
    setError('');
    setSaveStatus('');
    setHasUnsavedChanges(newJsonData !== originalJson);

    try {
      JSON.parse(newJsonData);
    } catch {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const parsedData = JSON.parse(jsonData);
      const payload = { payload: encodeObject(parsedData) };

      await axios.put(
        `${API_ENDPOINTS.ENDPOINTS}/update_payload/${parseInt(endpointId)}`,
        payload
      );
      
      setSaveStatus('✅ Data saved successfully!');
      setOriginalJson(jsonData);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setError('❌ Failed to save data. Please check your input and try again.');
      setSaveStatus('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setJsonData(originalJson);
    setError('');
    setSaveStatus('');
    setHasUnsavedChanges(false);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonData);
    setSaveStatus('📋 JSON copied to clipboard!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleGeneratedData = async () => {
    try {
      setIsGenerating(true);
      const prompt = `Create ${numEntries} more similar data entries in JSON format based on this example: ${jsonData}. Return only valid JSON array format without any explanations or markdown.`;
      
      const apiKey = 'AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const response = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      const generatedContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      
      // Clean up the response to extract JSON
      const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
      const cleanJson = jsonMatch ? jsonMatch[0] : generatedContent;
      
      try {
        const generatedData = JSON.parse(cleanJson);
        const currentData = JSON.parse(jsonData);
        
        let combinedData;
        if (Array.isArray(currentData) && Array.isArray(generatedData)) {
          combinedData = [...currentData, ...generatedData];
        } else if (Array.isArray(generatedData)) {
          combinedData = [currentData, ...generatedData];
        } else {
          combinedData = [currentData, generatedData];
        }

        const formattedJson = JSON.stringify(combinedData, null, 2);
        setJsonData(formattedJson);
        setHasUnsavedChanges(true);
        setIsPopupOpen(false);
        setSaveStatus('✨ AI-generated data added successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch {
        setError('❌ Generated data is not valid JSON format.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError('❌ Failed to generate data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
      setHasUnsavedChanges(jsonData !== originalJson);
    } catch {
      setError("Cannot format invalid JSON.");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed));
      setHasUnsavedChanges(jsonData !== originalJson);
    } catch {
      setError("Cannot minify invalid JSON.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">JSON Response Editor</h3>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 text-xs bg-orange-600 text-white rounded-full">
              Unsaved Changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors"
          >
            {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
          >
            <Sparkles size={12} />
            AI Generate
          </button>
        </div>
      </div>

      {/* Editor and Preview Layout */}
      <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* JSON Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-primary-300">JSON Data</label>
            <div className="flex items-center gap-2">
              <button
                onClick={formatJson}
                className="px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors"
                title="Format JSON"
              >
                Format
              </button>
              <button
                onClick={minifyJson}
                className="px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors"
                title="Minify JSON"
              >
                Minify
              </button>
              <button
                onClick={handleCopyJson}
                className="px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors"
                title="Copy JSON"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              className={`w-full h-96 p-4 bg-dark-800 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-500 text-red-300 focus:ring-red-500' 
                  : 'border-dark-600 text-green-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              value={jsonData}
              onChange={handleJsonChange}
              placeholder="Enter your JSON response data..."
              spellCheck="false"
            />
            <div className="absolute bottom-2 right-2 text-xs text-dark-400">
              Lines: {jsonData.split('\n').length} | Characters: {jsonData.length}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary-300">Preview</label>
            <div className="h-96 p-4 bg-dark-800 border border-dark-600 rounded-lg overflow-auto">
              {error ? (
                <div className="text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Invalid JSON format
                </div>
              ) : (
                <pre className="text-sm text-dark-200 whitespace-pre-wrap">
                  {jsonData}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !!error || !hasUnsavedChanges}
            className="btn-primary transform hover:scale-105 disabled:transform-none flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Status Messages */}
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {saveStatus && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              {saveStatus.includes('✅') && <CheckCircle size={16} />}
              {saveStatus}
            </div>
          )}
        </div>
      </div>

      {/* AI Generation Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-dark-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Data Generator</h3>
              </div>
              <p className="text-dark-400 text-sm">
                Generate similar data entries based on your current JSON structure
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-300 mb-2">
                  Number of entries to generate
                </label>
                <input
                  type="number"
                  value={numEntries}
                  onChange={(e) => setNumEntries(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="50"
                />
                <p className="text-xs text-dark-400 mt-1">Maximum 50 entries</p>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratedData}
                  disabled={isGenerating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointJsonEditor;