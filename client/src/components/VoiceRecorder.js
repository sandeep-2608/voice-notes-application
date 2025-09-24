import React, { useState, useRef, useEffect } from "react";
import { createNote } from "../services/api";

const VoiceRecorder = ({ onNoteCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSave = async () => {
    if (!transcript.trim()) return;

    try {
      const newNote = await createNote({
        transcript: transcript.trim(),
        title: `Note ${new Date().toLocaleDateString()}`,
      });
      onNoteCreated(newNote);
      setTranscript("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  if (!isSupported) {
    return (
      <div>
        <p>Speech recognition not supported. Use manual input:</p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your note here..."
        />
        <br />
        <button onClick={handleSave}>Save Note</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="primary-btn"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {transcript && (
        <div>
          <div className="transcript">{transcript}</div>
          <button onClick={handleSave}>Save Note</button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
