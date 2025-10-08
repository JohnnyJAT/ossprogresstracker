import React, { useState } from 'react';

function ExerciseItem({ exercise, setNumber, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState(exercise.weight);
  const [editedReps, setEditedReps] = useState(exercise.reps);
  const [editedNote, setEditedNote] = useState(exercise.note);

  const handleSave = () => {
    onUpdate(exercise.id, { weight: editedWeight, reps: editedReps, note: editedNote });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this set?')) {
      onDelete(exercise.id);
    }
  };

  if (isEditing) {
    return (
      <article className="exercise-item editing" aria-label={`Editing set ${setNumber} of ${exercise.name}`}>
        <div className="set-details">
          <strong>Set {setNumber}:</strong>
          <div className="form-group-inline">
            <label htmlFor={`edit-weight-${exercise.id}`}>Weight</label>
            <input id={`edit-weight-${exercise.id}`} type="number" value={editedWeight} onChange={e => setEditedWeight(e.target.value)} min="0" max="1000" step="0.01" />
          </div>
          <div className="form-group-inline">
            <label htmlFor={`edit-reps-${exercise.id}`}>Reps</label>
            <input id={`edit-reps-${exercise.id}`} type="number" value={editedReps} onChange={e => setEditedReps(e.target.value)} min="1" />
          </div>
        </div>
        <div className="form-group-inline form-group-full-width">
            <label htmlFor={`edit-note-${exercise.id}`}>Note</label>
            <input id={`edit-note-${exercise.id}`} type="text" value={editedNote} onChange={e => setEditedNote(e.target.value)} />
        </div>
        <div className="item-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
        </div>
      </article>
    );
  }

  return (
    <article className="exercise-item" aria-label={`Set ${setNumber} of ${exercise.name}`}>
      <div className="set-details">
        <span><strong>Set {setNumber}:</strong> {exercise.weight} kg × {exercise.reps} reps</span>
        <div className="item-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>
      {exercise.note && <p className="exercise-note">Note: {exercise.note}</p>}
    </article>
  );
}

export default ExerciseItem;