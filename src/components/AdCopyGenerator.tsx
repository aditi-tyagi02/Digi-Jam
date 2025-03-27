import React, { useState } from "react";
import { Copy } from "lucide-react";

const HF_API_KEY: string | undefined = import.meta.env.VITE_HF_API_KEY;
const MODEL_NAME = "google/gemma-2-2b-it";

interface ToneOption {
  id: string;
  name: string;
  description: string;
}

const toneOptions: ToneOption[] = [
  { id: "professional", name: "Professional", description: "Formal and business-oriented tone" },
  { id: "casual", name: "Casual", description: "Friendly and conversational style" },
  { id: "humorous", name: "Humorous", description: "Light-hearted and entertaining approach" },
  { id: "persuasive", name: "Persuasive", description: "Compelling and action-oriented messaging" },
];

const AdCopyGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCopy, setGeneratedCopy] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!HF_API_KEY) {
      setError("Hugging Face API key is not configured. Please add VITE_HF_API_KEY to your .env file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Write a compelling ad copy in a ${selectedTone} tone for:\n"${topic}".\nKeep it engaging, concise, and well-structured.`,
        }),
      });

      const data = await response.json();
      let rawOutput = data.generated_text?.trim() || (data[0]?.generated_text?.trim());

      // **Remove unnecessary formatting** (like "**Headline:**", asterisks, extra labels)
      const cleanedOutput = rawOutput
        .replace(/\*\*(.*?)\*\*/g, "") // Removes markdown-style bold text (**text**)
        .replace(/Headline:\s*/i, "") // Removes "Headline:" label
        .replace(/Body Copy:\s*/i, "") // Removes "Body Copy:" label
        .replace(/Call to Action:\s*/i, "") // Removes "Call to Action:" label
        .trim();

      if (cleanedOutput) {
        setGeneratedCopy(cleanedOutput);
      } else {
        throw new Error("No content generated");
      }
    } catch (err) {
      setError("Failed to generate ad copy. Please try again.");
      console.error("Error generating ad copy:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to create ad copy for?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your product, service, or topic"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select the tone for your ad copy
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toneOptions.map((tone) => (
              <div
                key={tone.id}
                className={`${
                  selectedTone === tone.id ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-300"
                } relative border rounded-lg p-4 cursor-pointer hover:border-indigo-400`}
                onClick={() => setSelectedTone(tone.id)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{tone.name}</span>
                  <span className="text-sm text-gray-500">{tone.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Ad Copy"}
        </button>
      </div>

      {generatedCopy && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Ad Copy</h3>
          <div className="bg-white rounded-lg p-4 relative group">
            <p className="text-gray-700 whitespace-pre-wrap">{generatedCopy}</p>
            <button
              onClick={() => handleCopy(generatedCopy)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
              title="Copy ad copy"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdCopyGenerator;
