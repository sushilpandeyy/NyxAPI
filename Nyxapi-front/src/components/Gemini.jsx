import axios from 'axios';

const GeminiDataFetcher = ({ apiKey, numEntries, object, onFetchComplete }) => {
  const generateFakeData = async () => {
    const prompt = `Create ${numEntries} more similar data in JSON format specific to: ${JSON.stringify(object)} include this prompt object as first element`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const generatedContent = response.data?.candidates[0]?.content?.parts[0].text;
      console.log(generatedContent)
      const generatedData = JSON.parse(generatedContent || '[]');
      onFetchComplete(generatedData);
    } catch (error) {
      console.error('Failed to generate data:', error);
      onFetchComplete([]); // Return an empty array on error
    }
  };

  return (
    <button
      onClick={generateFakeData}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Generate
    </button>
  );
};

export default GeminiDataFetcher;
