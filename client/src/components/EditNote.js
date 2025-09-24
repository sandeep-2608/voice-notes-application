import React, { useState } from "react";

const EditNote = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title || "");
  const [transcript, setTranscript] = useState(note.transcript || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    setIsSaving(true);
    try {
      await onSave(note._id, {
        title: title.trim() || `Note ${new Date().toLocaleDateString()}`,
        transcript: transcript.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Edit Note</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Enter content..."
            required
          />
        </div>

        <div>
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
