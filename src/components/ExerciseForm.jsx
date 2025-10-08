import React, { useState } from 'react';

const CUSTOM_EXERCISE_VALUE = 'add-new-exercise';
const CUSTOM_CATEGORY_VALUE = 'add-new-category';

function ExerciseForm({ exerciseCategories, onAddExerciseLog, onAddCategory, onAddExerciseToCategory }) {
  const [name, setName] = useState('');
  const [customName, setCustomName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [note, setNote] = useState('');

  const findCategoryForExercise = (exerciseName) => {
    for (const cat in exerciseCategories) {
      if (exerciseCategories[cat].includes(exerciseName)) {
        return cat;
      }
    }
    return '';
  };

  // CHANGE: Added a handler for weight input to enforce validation rules.
  const handleWeightChange = (e) => {
    let value = e.target.value;

    // Disallow non-numeric characters, except for a single decimal point.
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    // Enforce the maximum value of 1000.
    if (parseFloat(value) > 1000) {
      value = '1000';
    }

    // Enforce a maximum of two decimal places.
    const decimalParts = value.split('.');
    if (decimalParts[1] && decimalParts[1].length > 2) {
      value = `${decimalParts[0]}.${decimalParts[1].substring(0, 2)}`;
    }

    setWeight(value);
  };

  // CHANGE: Added a handler for note input to sanitize the value.
  const handleNoteChange = (e) => {
    // Basic sanitization to prevent XSS.
    // React's JSX rendering already escapes content, making it safe against XSS by default.
    // This is an extra layer of defense-in-depth.
    // SQL injection is a server-side concern and not applicable here as data is stored in localStorage.
    const sanitizedValue = e.target.value.replace(/[&<>"'/`|;*?()$:,~]/g, '');
    setNote(sanitizedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCustomExercise = name === CUSTOM_EXERCISE_VALUE;
    const isCustomCategory = category === CUSTOM_CATEGORY_VALUE;

    const finalExerciseName = isCustomExercise ? customName.trim() : name;
    let finalCategoryName = isCustomCategory ? customCategory.trim() : category;

    if (isCustomExercise && !finalCategoryName) {
      alert('Please select a category for the new exercise.');
      return;
    }

    if (!finalExerciseName || !weight || !reps) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!isCustomExercise) {
      finalCategoryName = findCategoryForExercise(finalExerciseName);
    }

    if (isCustomCategory) {
      onAddCategory(finalCategoryName);
    }

    if (isCustomExercise) {
      onAddExerciseToCategory(finalExerciseName, finalCategoryName);
    }

    onAddExerciseLog({ name: finalExerciseName, category: finalCategoryName, weight, reps, note });

    // Reset form
    setName('');
    setCustomName('');
    setCategory('');
    setCustomCategory('');
    setWeight('');
    setReps('');
    setNote('');
  };

  return (
    <section className="form-container" aria-labelledby="form-heading">
      <h3 id="form-heading">Add Today's Exercise</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exercise-name">Exercise</label>
          <select id="exercise-name" value={name} onChange={(e) => setName(e.target.value)} required>
            <option value="" disabled>Select an exercise</option>
            {Object.entries(exerciseCategories).map(([cat, exercises]) => (
              <optgroup label={cat} key={cat}>
                {exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </optgroup>
            ))}
            <option value={CUSTOM_EXERCISE_VALUE}>Add new exercise...</option>
          </select>
        </div>

        {name === CUSTOM_EXERCISE_VALUE && (
          <>
            <div className="form-group">
              <label htmlFor="custom-exercise-name">New Exercise Name</label>
              <input id="custom-exercise-name" type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g., Cable Crossovers" required />
            </div>
            <div className="form-group">
              <label htmlFor="exercise-category">Category</label>
              <select id="exercise-category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" disabled>Select a category</option>
                {Object.keys(exerciseCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value={CUSTOM_CATEGORY_VALUE}>Add new category...</option>
              </select>
            </div>
          </>
        )}

        {category === CUSTOM_CATEGORY_VALUE && (
          <div className="form-group">
            <label htmlFor="custom-category-name">New Category Name</label>
            <input id="custom-category-name" type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="e.g., Cardio" required />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="exercise-weight">Weight (kg)</label>
          {/* CHANGE: Updated input to use the new handler and corrected max value. */}
          <input id="exercise-weight" type="number" value={weight} onChange={handleWeightChange} placeholder="e.g., 60" required min="0" max="100" step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="exercise-reps">Reps</label>
          <input id="exercise-reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g., 10" required min="1" />
        </div>
        <div className="form-group">
          <label htmlFor="exercise-note">Note (optional)</label>
          {/* CHANGE: Updated input to use the new sanitizing handler. */}
          <input id="exercise-note" type="text" value={note} onChange={handleNoteChange} placeholder="e.g., Good form" />
        </div>
        <button type="submit" className="submit-btn">Log Exercise</button>
      </form>
    </section>
  );
}

export default ExerciseForm;