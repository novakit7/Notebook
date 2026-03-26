import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const [currentNote, setCurrentNote] = useState({
    _id: null,
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  // ================= FETCH NOTES =================

  useEffect(() => {
  fetchNotes();
}, []);

const fetchNotes = async () => {
  try {
    setLoading(true);

    const res = await API.get("/note");
    setNotes(res.data);

  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    alert("Failed to load notes");

  } finally {
    setLoading(false);
  }
};

  // ================= OPEN MODALS =================
  const handleOpenAdd = () => {
    setCurrentNote({ _id: null, title: "", description: "" });
    setErrors({ title: false, description: false });
    setShowModal(true);
  };

  const handleOpenEdit = (note) => {
    setCurrentNote(note);
    setShowViewer(false);
    setShowModal(true);
  };

  const handleOpenViewer = (note) => {
    setCurrentNote(note);
    setShowViewer(true);
  };

  // ================= SAVE NOTE =================
  const handleSaveNote = async () => {
    const titleEmpty = !currentNote.title.trim();
    const descEmpty = !currentNote.description.trim();

    setErrors({ title: titleEmpty, description: descEmpty });
    if (titleEmpty || descEmpty) return;

    try {
      setLoading(true);

      if (currentNote._id) {
        const res = await API.put(`/note/${currentNote._id}`, {
          title: currentNote.title,
          description: currentNote.description,
        });

        setNotes((prev) =>
          prev.map((n) =>
            n._id === currentNote._id ? res.data : n
          )
        );
      } else {
        const res = await API.post("/note", {
          title: currentNote.title,
          description: currentNote.description,
        });

        setNotes((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
    } catch {
      alert("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE NOTE =================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/note/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setShowViewer(false);
    } catch {
      alert("Failed to delete note");
    }
  };

  return (
    <div
      className="container py-5"
      style={{ maxWidth: "1100px" }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Your Notes</h2>
          <p className="text-muted mb-0 small">
            Organize your ideas. Stay focused.
          </p>
        </div>

        <button
          className="btn btn-dark px-4 py-2 rounded-3 shadow-sm"
          onClick={handleOpenAdd}
        >
          <i className="fa-solid fa-circle-plus"></i> New Note
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-dark"></div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && notes.length === 0 && (
        <div className="text-center mt-5">
          <div className="py-5">
            <h5 className="fw-semibold">No notes yet</h5>
            <p className="text-muted">
              Click “New Note” to create your first one.
            </p>
          </div>
        </div>
      )}

      {/* NOTES GRID */}
      {!loading && notes.length > 0 && (
        <div className="row g-4">
          {notes.map((n) => {
            const preview =
              n.description.length > 140
                ? n.description.substring(0, 140) + "..."
                : n.description;

            return (
              <div key={n._id} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenViewer(n)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0px)")
                  }
                >
                  <h5 className="fw-semibold mb-3">{n.title}</h5>

                  <p className="text-muted small flex-grow-1">
                    {preview}
                  </p>

                  <div className="small text-primary mt-3">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  {currentNote._id ? "Edit Note" : "Create Note"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <input
                type="text"
                className={`form-control mb-3 ${
                  errors.title ? "is-invalid" : ""
                }`}
                placeholder="Title"
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({
                    ...currentNote,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                rows="7"
                placeholder="Write your note..."
                value={currentNote.description}
                onChange={(e) =>
                  setCurrentNote({
                    ...currentNote,
                    description: e.target.value,
                  })
                }
              ></textarea>

              <div className="text-end mt-4">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                 <i className="fa-solid fa-xmark"></i> Cancel
                </button>

                <button
                  className="btn btn-dark px-4"
                  onClick={handleSaveNote}
                >
                 <i className="fa-solid fa-floppy-disk"></i> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWER MODAL */}
{showViewer && (
  <div
    className="modal d-block"
    style={{
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(8px)",
    }}
  >
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div
        className="modal-content border-0 rounded-4 shadow-lg p-5"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* TITLE */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">
            <i>{currentNote.title}</i>
          </h2>

          <small className="text-primary">
            {new Date(currentNote.createdAt).toLocaleDateString()}
          </small>
        </div>

        {/* LARGE READER AREA */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "900px",
            fontSize: "1.15rem",
            lineHeight: "2",
            color: "#333",
            whiteSpace: "pre-line",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {currentNote.description}
        </div>

        {/* CENTERED BUTTONS */}
        <div className="d-flex justify-content-center gap-3 mt-5">

          <button
            className="btn btn-outline-primary px-4 rounded-pill"
            onClick={() => handleOpenEdit(currentNote)}
          >
            <i className="fa-solid fa-pen-to-square"></i> Edit
          </button>

          <button
            className="btn btn-outline-danger px-4 rounded-pill"
            onClick={() => handleDelete(currentNote._id)}
          >
           <i className="fa-solid fa-trash-can"></i> Delete
          </button>

          <button
            className="btn btn-dark px-4 rounded-pill"
            onClick={() => setShowViewer(false)}
          >
           <i className="fa-solid fa-xmark"></i> Close
          </button>

        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}
