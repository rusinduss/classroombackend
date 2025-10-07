import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "text", "quiz"], default: "text" },
  content: { type: String, required: true }, // could be URL or text
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    description: { type: String, required: true, text: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    content: [moduleSchema],
    published: { type: Boolean, default: false },
    studentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search index
courseSchema.index({ title: "text", description: "text" });

export default mongoose.model("Course", courseSchema);
