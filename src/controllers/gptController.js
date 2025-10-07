import openai from "../config/openai.js";
import Course from "../models/Course.js";

let requestCount = 0; // Simple in-memory counter 

export const getRecommendations = async (req, res) => {
  try {
    if (requestCount >= process.env.GPT_REQUEST_LIMIT) {
      return res.status(429).json({ message: "GPT request limit reached" });
    }

    const { prompt, limit = 5 } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    // Fetch available courses (limit to 10–20 for efficiency)
    const courses = await Course.find().limit(10).select("title description");

    const courseList = courses
      .map((c, i) => `${i + 1}. ${c.title}: ${c.description}`)
      .join("\n");

    const gptPrompt = `
You are a course recommendation assistant.
Student request: "${prompt}"

Here are some available courses:
${courseList}

From the above courses, recommend up to ${limit} that best match the student’s request.
Return them in JSON format like:
[
  { "title": "Course Title", "reason": "Why it’s a good match" }
]
`;

    // Make GPT API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // lightweight and cost-efficient
      messages: [{ role: "user", content: gptPrompt }],
      temperature: 0.7,
    });

    requestCount++;

    let recommendations;
    try {
      recommendations = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      recommendations = [{ error: "Could not parse GPT response" }];
    }

    res.json({ recommendations, requestsUsed: requestCount });
  } catch (error) {
    res.status(500).json({ message: "GPT request failed", error: error.message });
  }
};
