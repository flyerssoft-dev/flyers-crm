import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Paperclip,
  Plus,
  Save,
  X,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import "./../styles.scss";
import { Button } from "antd";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { useDispatch } from "react-redux";
import moment from "moment";
import { putApi } from "redux/sagas/putApiSaga";
import { useSelector } from "react-redux";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { deleteApi } from "redux/sagas/deleteApiSaga";

function NotesList({ contactId, contactName, data, refreshList }) {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeNoteMenu, setActiveNoteMenu] = useState(null);
  const dispatch = useDispatch();
  const globalRedux = useSelector((state) => state.globalRedux);

  useEffect(() => {
    if (data) {
      setNotes(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_NOTES === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_NOTES === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editingNote ? "EDIT_NOTES" : "ADD_NOTES"));
      refreshList?.();
    }
  }, [globalRedux.apiStatus]);

  useEffect(() => {
    let doIt = false;
    if (globalRedux.apiStatus.DELETE_NOTES === "SUCCESS") {
      dispatch(resetApiStatus("DELETE_NOTES"));
      doIt = true;
    }
    if (doIt) {
      refreshList?.();
    }
  }, [globalRedux.apiStatus, dispatch, refreshList]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const newNote = {
      title: currentTitle,
      content: currentNote,
      contactId: contactId,
      contactName: contactName,
    };

    if (editingNote) {
      let url = `${SERVER_IP}call-notes/${editingNote}`;
      dispatch(putApi(newNote, "EDIT_NOTES", url));
    } else {
      let url = `${SERVER_IP}call-notes`;
      dispatch(postApi(newNote, "ADD_NOTES", url));
    }
    setCurrentNote("");
    setCurrentTitle("");
    setIsCreating(false);
  };

  const handleCancelNote = () => {
    setCurrentNote("");
    setCurrentTitle("");
    setIsCreating(false);
    setEditingNote(null);
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.content);
      setCurrentTitle(noteToEdit.title);
      setIsCreating(true);
      setEditingNote(noteId);
    }
    setActiveNoteMenu(null);
  };

  const handleDeleteNote = (noteId) => {
    let url = `${SERVER_IP}call-notes/${noteId}`;
    dispatch(deleteApi("DELETE_NOTES", url));
    refreshList?.();
    setActiveNoteMenu(null);
  };

  const handleStartCreating = () => {
    setIsCreating(true);
    setCurrentNote("");
    setCurrentTitle("");
    setEditingNote(null);
  };

  //   const handleAttachFile = () => {
  //     // Simulate file attachment
  //     alert("File attachment feature would be implemented here");
  //   };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInHours =
      (now?.getTime() - timestamp?.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return timestamp?.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return timestamp?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="notes-app">
      <div className="notes-container">
        {/* Header */}
        <div className="notes-header">
          {/* <div className="header-left">
            <button 
              className="dropdown-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              All Notes
              <ChevronDown className="dropdown-icon" />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item active">All Notes</div>
                <div className="dropdown-item">Recent</div>
                <div className="dropdown-item">Favorites</div>
                <div className="dropdown-item">Archive</div>
              </div>
            )}
          </div> */}
          <Button
            type="primary"
            className="new-note-btn"
            onClick={handleStartCreating}
          >
            <Plus size={16} />
            New Note
          </Button>
        </div>

        {/* Note Creation Area */}
        {isCreating && (
          <div className="note-creator">
            <div className="note-input-container">
              <input
                type="text"
                className="note-title-input"
                placeholder="Add a title..."
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
              />
              <textarea
                className="note-textarea"
                placeholder="What's this note about?"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={6}
              />
            </div>
            <div className="note-actions">
              <div className="action-buttons">
                <Button
                  onClick={handleSaveNote}
                  type="primary"
                  disabled={!currentNote.trim()}
                >
                  <Save size={16} />
                  {editingNote ? "Update" : "Save"}
                </Button>
                <Button
                  className="action-btn cancel-btn"
                  onClick={handleCancelNote}
                  type="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-header">
                  <div className="note-author-info">
                    <div className="author-avatar">
                      {getInitials(note.createrName)}
                    </div>
                    <div className="author-details">
                      <span className="author-name">{note.createrName}</span>
                      <span className="note-timestamp">
                        {moment(note?.createdAt).format("MMM DD, hh:mm A")}
                      </span>
                    </div>
                  </div>
                  <div className="note-menu">
                    <button
                      className="menu-trigger"
                      onClick={() =>
                        setActiveNoteMenu(
                          activeNoteMenu === note.id ? null : note.id
                        )
                      }
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {activeNoteMenu === note.id && (
                      <div className="menu-dropdown">
                        <button
                          className="menu-item"
                          onClick={() => handleEditNote(note.id)}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          className="menu-item delete"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="note-content">
                  {note.title !== "Untitled Note" && (
                    <h3 className="note-title">{note.title}</h3>
                  )}
                  <p className="note-text">{note.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesList;
