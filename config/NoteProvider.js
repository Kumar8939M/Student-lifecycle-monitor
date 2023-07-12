import React, { createContext, useContext, useEffect, useState } from 'react';
import { getNote } from '../database/sqlite/notepad';

const NoteContext = createContext();
const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const findNotes = async () => {
    getNote(setNotes)
  };

  useEffect(() => {
    findNotes();
  }, []);

  return (
    <NoteContext.Provider value={{ notes, setNotes, findNotes }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);

export default NoteProvider;