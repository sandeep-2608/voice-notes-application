import React from "react";
import NoteItem from "./NoteItem";

const NotesList = ({
  notes = [],
  loading,
  onDelete,
  onEdit,
  onGenerateSummary,
}) => {
  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  if (!notes.length) {
    return <div>No notes yet.</div>;
  }

  return (
    <div>
      {notes?.map((note) => (
        <NoteItem
          key={note._id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
          onGenerateSummary={onGenerateSummary}
        />
      ))}
    </div>
  );
};

export default NotesList;
