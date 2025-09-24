import React, { useState, useEffect } from "react";
import "./App.css";
import VoiceRecorder from "./components/VoiceRecorder";
import NotesList from "./components/NotesList";
import EditNote from "./components/EditNote";
import {
  getAllNotes,
  deleteNote,
  updateNote,
  generateSummary,
} from "./services/api";

function App() {
  const [notes, setNotes] = useState([]); // FIXED: Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getAllNotes();
      // FIXED: Ensure notes is always an array
      setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]); // FIXED: Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Delete this note?")) {
      try {
        await deleteNote(noteId);
        setNotes((prev) => prev.filter((note) => note._id !== noteId));
        if (editingNote && editingNote._id === noteId) {
          setEditingNote(null);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const handleSaveNote = async (noteId, updatedData) => {
    try {
      const updatedNote = await updateNote(noteId, updatedData);
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleGenerateSummary = async (noteId) => {
    try {
      const updatedNote = await generateSummary(noteId);
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div className="app">
      <h1>Voice Notes</h1>

      {editingNote ? (
        <EditNote
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <>
          <VoiceRecorder onNoteCreated={handleNoteCreated} />
          <NotesList
            notes={notes}
            loading={loading}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
            onGenerateSummary={handleGenerateSummary}
          />
        </>
      )}
    </div>
  );
}

export default App;
