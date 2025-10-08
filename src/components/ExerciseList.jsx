import React, { useState } from 'react';
import ExerciseItem from './ExerciseItem';

function ExerciseList({ exercises, onUpdateExerciseLog, onDeleteExerciseLog }) {
  const [view, setView] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  const getMonthKey = (date) => date.substring(0, 7); // YYYY-MM
  const getYearKey = (date) => date.substring(0, 4); // YYYY

  const groupedExercises = exercises.reduce((acc, exercise) => {
    let key;
    switch (view) {
      case 'weekly': key = getStartOfWeek(exercise.date); break;
      case 'monthly': key = getMonthKey(exercise.date); break;
      case 'yearly': key = getYearKey(exercise.date); break;
      default: key = exercise.date;
    }

    if (!acc[key]) acc[key] = {};
    if (!acc[key][exercise.name]) {
      acc[key][exercise.name] = { category: exercise.category, sets: [] };
    }
    acc[key][exercise.name].sets.push(exercise);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedExercises).sort((a, b) => new Date(b) - new Date(a));

  const getGroupTitle = (groupKey) => {
    switch (view) {
      case 'daily': return new Date(groupKey).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'weekly': return `Week of ${new Date(groupKey).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
      case 'monthly': return new Date(`${groupKey}-02`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      case 'yearly': return `Year ${groupKey}`;
      default: return groupKey;
    }
  };

  return (
    <section className="list-container" aria-labelledby="list-heading">
      <h3 id="list-heading">Your Progress</h3>
      <div className="view-toggle">
        <button onClick={() => setView('daily')} className={view === 'daily' ? 'active' : ''}>Daily</button>
        <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'active' : ''}>Weekly</button>
        <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'active' : ''}>Monthly</button>
        <button onClick={() => setView('yearly')} className={view === 'yearly' ? 'active' : ''}>Yearly</button>
      </div>
      {sortedGroupKeys.length === 0 ? (
        <p>No exercises tracked yet. Add one to get started!</p>
      ) : (
        sortedGroupKeys.map(groupKey => (
          <div key={groupKey} className="exercise-date-group">
            <h4>{getGroupTitle(groupKey)}</h4>
            {Object.keys(groupedExercises[groupKey]).map(exerciseName => {
              const { category, sets } = groupedExercises[groupKey][exerciseName];
              return (
                <div key={exerciseName} className="logged-exercise-group">
                  <h5 className="logged-exercise-name">{exerciseName} <span className="logged-exercise-category">({category})</span></h5>
                  {sets.sort((a, b) => b.id - a.id).map((exerciseSet, index) => (
                    <ExerciseItem
                      key={exerciseSet.id}
                      exercise={exerciseSet}
                      setNumber={sets.length - index}
                      onUpdate={onUpdateExerciseLog}
                      onDelete={onDeleteExerciseLog}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))
      )}
    </section>
  );
}

export default ExerciseList;