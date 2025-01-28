"use server"

import axios from "axios";

export const sendPromptToGemini = async ({prompt}: {prompt: string}) => {
    const request = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [{
                    "parts": [{ "text": prompt }]
                }]
        });
    try {
       let response: string = await request.data.candidates[0].content.parts[0].text
       response = response.replace("```json","").replace("```","")
       return JSON.parse(response)
    } catch (error) {
        return {
            error: "Failed to generate content"
        }
    }
}