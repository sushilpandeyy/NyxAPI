async function GEMINIDATA({ numEntries, object }) {
    const prompt = `Create ${numEntries} more similar data in JSON format specific to: ${JSON.stringify(object)} include this prompt object as first element`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD8ZBJkzUkpC46RmH6D84K8R9XwzwSAbSU`;
  
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
  
      if (generatedContent) {
        // Split the generated content by line breaks and parse each line into a JSON object
        const generatedData = generatedContent
          .split('\n')
          .map(line => {
            try {
              return JSON.parse(line.match(/{.*}/)[0]); // Extract and parse JSON from each line
            } catch {
              return null; // Ignore lines that cannot be parsed
            }
          })
          .filter(Boolean); // Remove any null values
  
        console.log(generatedData);
       return generatedContent
      } else {
        onFetchComplete([]); // Return empty array if no content generated
      }
    } catch (error) {
      console.error('Failed to generate data:', error);
      onFetchComplete([]); // Return an empty array on error
    }
  }
  