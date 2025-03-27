import React, { useState } from 'react';
import { Upload, Copy } from 'lucide-react';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

interface GeneratedContent {
  caption: string;
  hashtags: string[];
}

const ImageCaptioning: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const generateHashtags = (caption: string): string[] => {
    const words = caption.toLowerCase().split(' ');
    const hashtags = words
      .filter((word: string) => word.length > 3)
      .map((word: string) => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`)
      .slice(0, 5);
    return [...new Set(hashtags)];
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError('No image selected');
      return;
    }

    if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      setError('Hugging Face API key is missing. Add it to your .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await selectedImage.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: selectedImage.type });

      // Hugging Face API call
      const response = await hf.imageToText({
        model: 'Salesforce/blip-image-captioning-base',
        data: blob,
      });

      // Ensure correct extraction of generated text
      const caption: string = (response as any)?.generated_text || 'No caption generated';
      const hashtags: string[] = generateHashtags(caption);

      setGeneratedContent({
        caption,
        hashtags: [...hashtags, '#photography', '#ai'],
      });
    } catch (err: any) {
      if (!navigator.onLine) {
        setError('Please check your internet connection and try again.');
      } else if (err.message?.includes('API key')) {
        setError('Invalid API key. Please check your Hugging Face API key.');
      } else {
        setError('Failed to generate caption. Please try again.');
        console.error('Error generating caption:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreview(null);
                  setGeneratedContent(null);
                  setError(null);
                }}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {preview && (
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedImage}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Image...' : 'Generate Caption & Hashtags'}
          </button>
        )}
      </div>

      {generatedContent && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Caption</h3>
              <div className="bg-white rounded-lg p-4 relative group">
                <p className="text-gray-700">{generatedContent.caption}</p>
                <button
                  onClick={() => handleCopy(generatedContent.caption)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                  title="Copy caption"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Suggested Hashtags</h3>
              <div className="bg-white rounded-lg p-4 relative group">
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleCopy(generatedContent.hashtags.join(' '))}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                  title="Copy hashtags"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCaptioning;
