import mongoose from "mongoose";

const voiceNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: function () {
      return `Voice Note ${new Date().toLocaleDateString()}`;
    },
  },
  transcript: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    default: "",
  },
  hasSummary: {
    type: Boolean,
    default: false,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 0,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on each save
voiceNoteSchema.pre("save", function (next) {
  this.updatedAt = Date.now;
  next();
});

// Add indexes for better performance
voiceNoteSchema.index({ createdAt: -1 });
voiceNoteSchema.index({ hasSummary: 1 });

export default mongoose.model("VoiceNote", voiceNoteSchema);
