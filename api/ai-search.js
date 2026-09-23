import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt, listings } = req.body;
    
    if (!prompt || !listings) {
      return res.status(400).json({ message: 'Missing prompt or listings data' });
    }

    // Access the key securely from the server environment (Notice: No VITE_ prefix!)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const systemInstruction = `
      You are a real estate AI assistant. 
      I will give you a list of available properties in JSON format, and a user's search prompt.
      Your job is to find the properties that best match the user's request.
      
      Properties: ${JSON.stringify(listings)}
      User Request: "${prompt}"

      Return ONLY a JSON array containing the string IDs of the matching properties. Do not use markdown blocks, just the raw array. Example: ["id1", "id2"]
    `;

    let result;
    const MAX_RETRIES = 3;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        result = await model.generateContent(systemInstruction);
        break; // Success, break out of retry loop
      } catch (error) {
        if (attempt === MAX_RETRIES - 1) throw error; // Re-throw if out of retries
        console.warn(`Gemini API error (Attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${1000 * Math.pow(2, attempt)}ms...`);
        // Wait with exponential backoff: 1s, 2s
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }

    const responseText = result.response.text().trim();
    
    // Parse the JSON array of IDs returned by Gemini
    const matchedIds = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));

    // Send the IDs back to the frontend
    return res.status(200).json({ matchedIds });

  } catch (error) {
    console.error("Serverless AI Search failed:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}