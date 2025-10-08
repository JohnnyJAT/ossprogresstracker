import React, { useState } from 'react';

function ExerciseManager({
  exerciseCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onClose
}) {
  const [newCategory, setNewCategory] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [selectedCategoryForNewExercise, setSelectedCategoryForNewExercise] = useState('');

  const [editingCategory, setEditingCategory] = useState(null); // { oldName, newName }
  const [editingExercise, setEditingExercise] = useState(null); // { category, oldName, newName }

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !exerciseCategories[newCategory.trim()]) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    } else {
      alert('Category name cannot be empty or already exist.');
    }
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExerciseName.trim() && selectedCategoryForNewExercise) {
      onAddExercise(newExerciseName.trim(), selectedCategoryForNewExercise);
      setNewExerciseName('');
    } else {
      alert('Exercise name and category are required.');
    }
  };

  const handleSaveCategoryEdit = () => {
    if (editingCategory.newName.trim() && editingCategory.newName !== editingCategory.oldName) {
      onUpdateCategory(editingCategory.oldName, editingCategory.newName);
      setEditingCategory(null);
    } else {
      alert('New category name cannot be empty or the same as the old one.');
    }
  };

  const handleSaveExerciseEdit = () => {
    if (editingExercise.newName.trim() && editingExercise.newName !== editingExercise.oldName) {
      onUpdateExercise(editingExercise.category, editingExercise.oldName, editingExercise.newName);
      setEditingExercise(null);
    } else {
      alert('New exercise name cannot be empty or the same as the old one.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Manage Exercises & Categories</h2>

        <div className="manager-section">
          <h4>Categories & Exercises</h4>
          <ul className="category-management-list">
            {Object.keys(exerciseCategories).map(cat => (
              <li key={cat} className="category-item">
                {editingCategory?.oldName === cat ? (
                  <div className="edit-form">
                    <input type="text" value={editingCategory.newName} onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})} />
                    <button onClick={handleSaveCategoryEdit} className="save-btn">Save</button>
                    <button onClick={() => setEditingCategory(null)} className="cancel-btn">Cancel</button>
                  </div>
                ) : (
                  <div className="item-view">
                    <span>{cat}</span>
                    <div className="item-actions">
                      <button onClick={() => setEditingCategory({ oldName: cat, newName: cat })} className="edit-btn">Edit</button>
                      <button onClick={() => onDeleteCategory(cat)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                )}
                <ul className="exercise-management-list">
                  {exerciseCategories[cat].map(ex => (
                    <li key={ex}>
                      {editingExercise?.oldName === ex && editingExercise?.category === cat ? (
                        <div className="edit-form">
                          <input type="text" value={editingExercise.newName} onChange={(e) => setEditingExercise({...editingExercise, newName: e.target.value})} />
                          <button onClick={handleSaveExerciseEdit} className="save-btn">Save</button>
                          <button onClick={() => setEditingExercise(null)} className="cancel-btn">Cancel</button>
                        </div>
                      ) : (
                        <div className="item-view">
                          <span>{ex}</span>
                          <div className="item-actions">
                            <button onClick={() => setEditingExercise({ category: cat, oldName: ex, newName: ex })} className="edit-btn">Edit</button>
                            <button onClick={() => onDeleteExercise(cat, ex)} className="delete-btn">Delete</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="manager-section">
          <form onSubmit={handleAddCategory}>
            <h4>Add New Category</h4>
            <div className="form-group">
              <label htmlFor="new-category-name">Category Name</label>
              <input id="new-category-name" type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g., Cardio" />
            </div>
            <button type="submit" className="submit-btn-small">Add Category</button>
          </form>
        </div>

        <div className="manager-section">
          <form onSubmit={handleAddExercise}>
            <h4>Add New Exercise</h4>
            <div className="form-group">
              <label htmlFor="new-exercise-name">Exercise Name</label>
              <input id="new-exercise-name" type="text" value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} placeholder="e.g., Rowing" />
            </div>
            <div className="form-group">
              <label htmlFor="new-exercise-category-select">Category</label>
              <select id="new-exercise-category-select" value={selectedCategoryForNewExercise} onChange={(e) => setSelectedCategoryForNewExercise(e.target.value)} required>
                <option value="" disabled>Select a category</option>
                {Object.keys(exerciseCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button type="submit" className="submit-btn-small">Add Exercise</button>
          </form>
        </div>

        <button onClick={onClose} className="close-btn" aria-label="Close manager">Close</button>
      </div>
    </div>
  );
}

export default ExerciseManager;
