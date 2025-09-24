import React, { useState } from "react";

const NoteItem = ({ note, onDelete, onEdit, onGenerateSummary }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      await onGenerateSummary(note._id);
    } finally {
      setIsGenerating(false);
    }
  };

  // FIXED: Add safety checks for undefined properties
  if (!note) return null;

  const transcript = note.transcript || "";
  const canGenerateSummary = !note.hasSummary || note.isEdited;

  return (
    <div className="note-item">
      <div className="transcript">{transcript}</div>

      {note.summary && note.hasSummary && (
        <div className="summary">
          <strong>Summary:</strong> {note.summary}
        </div>
      )}

      <div>
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onDelete(note._id)}>Delete</button>

        {transcript.length > 20 && (
          <button
            onClick={handleGenerateSummary}
            disabled={!canGenerateSummary || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Summary"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteItem;
