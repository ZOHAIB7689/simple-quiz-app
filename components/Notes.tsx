"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FilePenIcon, Ghost, icons, TrashIcon } from "lucide-react";
import { title } from "process";
import { Content } from "next/font/google";

export default function Notes() {
  type Note = {
    id: number;
    title: string;
    content: string;
  };

  const defaultNotes: Note[] = [
    {
      id: 1,
      title: "Grocery List",
      content: "Milk , Eggs , Bread , Appples",
    },
    {
      id: 2,
      title: "Meeting Notes",
      content: "Discuss new project timeline , assign atsks to team",
    },
    {
      id: 3,
      title: "Idea for App",
      content: "Develope a note-taking app with a clean and minimalist Design",
    },
  ];

  const [notes, setNotes] = useLocalStorage<Note[]>("notes", defaultNotes);
  const [newNote, setNewNote] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
      if (typeof window !== "undefined") {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            setStoredValue(JSON.parse(item));
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, [key]);

    const setValue = (value: T | ((value: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      setIsMounted(true);
    });

    return [storedValue, setValue] as const;
  }

  const handleAddNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const newNoteWithId = { id: Date.now(), ...newNote };
      setNotes([...notes, newNoteWithId]);
      setNewNote({ title: "", content: "" });
    }
  };

  const handleEditNote = (id: number): void => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNewNote({ title: noteToEdit.title, content: noteToEdit.content });
      setEditingNoteId(id);
    }
  };

  const handleUpdateNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { id: note.id, title: newNote.title, content: newNote.content }
            : note
        )
      );
    }
  };

  const handleDeleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  if (!isMounted) {
    return null;
  }
  // JSX return statement rendering the Notes App UI
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-muted p-4 shadow">
        <h1 className="text-2xl font-bold">Note Taker</h1>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          {/* Input for note title */}
          <input
            type="text"
            placeholder="Title"
            value={newNote.title || ""}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {/* Textarea for note content */}
          <textarea
            placeholder="Content"
            value={newNote.content || ""}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            className="mt-2 w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={4}
          />
          {/* Button to add or update note */}
          {editingNoteId === null ? (
            <Button onClick={handleAddNote} className="mt-2">
              Add Note
            </Button>
          ) : (
            <Button onClick={handleUpdateNote} className="mt-2">
              Update Note
            </Button>
          )}
        </div>
        {/* Display list of notes */}
        <div className="grid gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{note.title}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNote(note.id)}
                  >
                    <FilePenIcon className="h-4 w-4 text-cyan-500 "  />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <TrashIcon className="text-red-500 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">{note.content}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
