import express from "express";
import VoiceNote from "../models/voiceNoteModel.js";
import aiService from "../services/aiService.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Input validation middleware
const validateNoteInput = (req, res, next) => {
  const { transcript, title } = req.body;

  if (
    !transcript ||
    typeof transcript !== "string" ||
    transcript.trim().length === 0
  ) {
    return res.status(400).json({ error: "Valid transcript is required" });
  }

  if (transcript.trim().length > 10000) {
    return res
      .status(400)
      .json({ error: "Transcript too long (max 10,000 characters)" });
  }

  if (title && (typeof title !== "string" || title.length > 200)) {
    return res.status(400).json({ error: "Invalid title format or too long" });
  }

  next();
};

// ID validation middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }
  next();
};

// Get all voice notes
router.get("/", async (req, res) => {
  try {
    const notes = await VoiceNote.find().sort({ createdAt: -1 }).select("-__v");

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ success: false, error: "Failed to fetch notes" });
  }
});

// Get a single voice note
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.params.id).select("-__v");
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ success: false, error: "Failed to fetch note" });
  }
});

// Create a new voice note
router.post(
  "/",
  upload.single("audio"),
  validateNoteInput,
  async (req, res) => {
    try {
      const { transcript, title, duration } = req.body;

      const note = new VoiceNote({
        title: title?.trim() || `Note ${new Date().toLocaleDateString()}`,
        transcript: transcript.trim(),
        duration: Math.max(0, parseInt(duration) || 0),
      });

      await note.save();

      console.log(` Note created: ${note._id}`);
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      console.error("Error creating note:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.message,
        });
      }

      res.status(500).json({ success: false, error: "Failed to create note" });
    }
  }
);

// Update a voice note
router.put("/:id", validateObjectId, validateNoteInput, async (req, res) => {
  try {
    const { transcript, title } = req.body;

    const note = await VoiceNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    // Check if transcript was edited
    const transcriptEdited = transcript.trim() !== note.transcript;

    // Update fields
    if (title !== undefined) note.title = title.trim() || note.title;
    if (transcript) note.transcript = transcript.trim();

    // If transcript was edited, clear summary and mark as edited
    if (transcriptEdited) {
      note.summary = "";
      note.hasSummary = false;
      note.isEdited = true;
      console.log(`Note ${note._id}: Transcript edited, summary cleared`);
    }

    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    console.error("Error updating note:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({ success: false, error: "Failed to update note" });
  }
});

// Delete a voice note
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    await VoiceNote.findByIdAndDelete(req.params.id);
    console.log(`Note deleted: ${req.params.id}`);
    res.json({
      success: true,
      message: "Note deleted successfully",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, error: "Failed to delete note" });
  }
});

// Generate summary for a voice note
router.post("/:id/summary", validateObjectId, async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    // Once summary is generated, button should be disabled until edited
    if (note.hasSummary && !note.isEdited) {
      return res.status(400).json({
        success: false,
        error:
          "Summary already generated. Edit the note to generate a new summary.",
      });
    }

    if (note.transcript.length < 20) {
      return res.status(400).json({
        success: false,
        error: "Note too short to summarize (minimum 20 characters)",
      });
    }

    // Generate summary using AI service
    let summary;
    try {
      summary = await aiService.generateSummary(note.transcript);
    } catch (aiError) {
      console.log("AI summarization failed:", aiError.message);
      return res.status(500).json({
        success: false,
        error: "Failed to generate summary. Please try again later.",
      });
    }

    // Update note with summary
    note.summary = summary;
    note.hasSummary = true;
    note.isEdited = false; // Reset edit flag

    await note.save();

    console.log(` Summary generated for note ${note._id}`);
    res.json({ success: true, data: note });
  } catch (error) {
    console.error("Error generating summary:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate summary" });
  }
});

export default router;
