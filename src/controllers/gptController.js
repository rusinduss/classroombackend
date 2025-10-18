import openai from "../config/openai.js";
import Course from "../models/Course.js";

let requestCount = 0;

// Reset limit every 24h
setInterval(() => {
  requestCount = 0;
}, 24 * 60 * 60 * 1000);

export const getRecommendations = async (req, res) => {
  try {
    if (requestCount >= process.env.GPT_REQUEST_LIMIT) {
      return res.status(429).json({ message: "GPT request limit reached" });
    }

    const { prompt, limit = 5 } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: gptPrompt }],
      temperature: 0.7,
    });

    requestCount++;

 const content = completion?.choices?.[0]?.message?.content?.trim();

let cleanedContent = content;
if (cleanedContent.startsWith("```")) {
  cleanedContent = cleanedContent.replace(/```json|```/g, "").trim();
}

let recommendations;
try {
  recommendations = JSON.parse(cleanedContent);
} catch {
  recommendations = [
    { title: "Invalid GPT Response", reason: cleanedContent || "No valid JSON returned" },
  ];
}


    res.json({
      model: completion.model,
      recommendations,
      requestsUsed: requestCount,
    });
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ message: "GPT request failed", error: error.message });
  }
};
