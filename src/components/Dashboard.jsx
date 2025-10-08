import React from 'react';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';

function Dashboard({ profile, exerciseCategories, onAddExerciseLog, onAddCategory, onAddExerciseToCategory, onUpdateExerciseLog, onDeleteExerciseLog }) {
  if (!profile) {
    return <div className="app-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <img src={profile.avatar} alt={`${profile.name}'s avatar`} className="avatar" />
        <h2>Welcome, {profile.name}</h2>
      </header>
      <main>
        <ExerciseForm
          exerciseCategories={exerciseCategories}
          onAddExerciseLog={onAddExerciseLog}
          onAddCategory={onAddCategory}
          onAddExerciseToCategory={onAddExerciseToCategory}
        />
        <ExerciseList
          exercises={profile.exercises}
          onUpdateExerciseLog={onUpdateExerciseLog}
          onDeleteExerciseLog={onDeleteExerciseLog}
        />
      </main>
    </div>
  );
}

export default Dashboard;