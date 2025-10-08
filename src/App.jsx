import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileManager from './components/ProfileManager';
import ExerciseManager from './components/ExerciseManager';
import LoginPage from './components/LoginPage'; // Import the new LoginPage
import { exerciseCategories as initialExerciseCategories } from './data';
import { avatars, defaultAvatar } from './avatars';

const getInitialData = () => {
  try {
    const savedData = localStorage.getItem('gymTrackerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (!parsedData.exerciseCategories) {
        parsedData.exerciseCategories = initialExerciseCategories;
      }
      return parsedData;
    }
  } catch (error) {
    console.error("Could not parse data from localStorage", error);
  }
  return {
    profiles: [{ id: 1, name: 'User 1', avatar: defaultAvatar, exercises: [] }],
    exerciseCategories: initialExerciseCategories,
    activeProfileId: 1,
  };
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [appData, setAppData] = useState(getInitialData);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('gymTrackerData', JSON.stringify(appData));
    } catch (error) {
      console.error("Could not save data to localStorage", error);
    }
  }, [appData]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleSwitchProfile = (profileId) => {
    setAppData(prevData => ({ ...prevData, activeProfileId: profileId }));
  };

  const handleAddProfile = (profileName, avatar) => {
    const newProfile = {
      id: Date.now(),
      name: profileName,
      avatar: avatar || defaultAvatar,
      exercises: [],
    };
    setAppData(prevData => ({
      ...prevData,
      profiles: [...prevData.profiles, newProfile],
    }));
  };

  const handleUpdateProfile = (profileId, newName, newAvatar) => {
    setAppData(prevData => ({
      ...prevData,
      profiles: prevData.profiles.map(p =>
        p.id === profileId ? { ...p, name: newName, avatar: newAvatar } : p
      ),
    }));
  };

  const handleDeleteProfile = (profileIdToDelete) => {
    setAppData(prevData => {
      if (prevData.profiles.length <= 1) {
        alert("Cannot delete the last profile.");
        return prevData;
      }
      const remainingProfiles = prevData.profiles.filter(p => p.id !== profileIdToDelete);
      let newActiveProfileId = prevData.activeProfileId;
      if (prevData.activeProfileId === profileIdToDelete) {
        newActiveProfileId = remainingProfiles[0].id;
      }
      return {
        ...prevData,
        profiles: remainingProfiles,
        activeProfileId: newActiveProfileId,
      };
    });
  };

  const handleAddExerciseLog = (exercise) => {
    const newExercise = {
      ...exercise,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setAppData(prevData => {
      const updatedProfiles = prevData.profiles.map(p => {
        if (p.id === prevData.activeProfileId) {
          return { ...p, exercises: [newExercise, ...p.exercises] };
        }
        return p;
      });
      return { ...prevData, profiles: updatedProfiles };
    });
  };

  const handleUpdateExerciseLog = (exerciseId, updatedLog) => {
    setAppData(prevData => ({
      ...prevData,
      profiles: prevData.profiles.map(p => {
        if (p.id === prevData.activeProfileId) {
          return {
            ...p,
            exercises: p.exercises.map(ex =>
              ex.id === exerciseId ? { ...ex, ...updatedLog } : ex
            )
          };
        }
        return p;
      })
    }));
  };

  const handleDeleteExerciseLog = (exerciseId) => {
    setAppData(prevData => ({
      ...prevData,
      profiles: prevData.profiles.map(p => {
        if (p.id === prevData.activeProfileId) {
          return { ...p, exercises: p.exercises.filter(ex => ex.id !== exerciseId) };
        }
        return p;
      })
    }));
  };

  const handleAddCategory = (categoryName) => {
    setAppData(prevData => ({
      ...prevData,
      exerciseCategories: {
        ...prevData.exerciseCategories,
        [categoryName]: []
      }
    }));
  };

  const handleAddExerciseToCategory = (exerciseName, category) => {
    setAppData(prevData => {
      const newCategories = { ...prevData.exerciseCategories };
      if (newCategories[category] && !newCategories[category].includes(exerciseName)) {
        newCategories[category] = [...newCategories[category], exerciseName];
      }
      return { ...prevData, exerciseCategories: newCategories };
    });
  };

  const handleUpdateCategory = (oldName, newName) => {
    setAppData(prevData => {
      const newCategories = { ...prevData.exerciseCategories };
      if (oldName !== newName && !newCategories[newName]) {
        newCategories[newName] = newCategories[oldName];
        delete newCategories[oldName];
        return { ...prevData, exerciseCategories: newCategories };
      }
      return prevData;
    });
  };

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`Are you sure you want to delete the "${categoryName}" category and all its exercises? This cannot be undone.`)) {
      setAppData(prevData => {
        const newCategories = { ...prevData.exerciseCategories };
        delete newCategories[categoryName];
        return { ...prevData, exerciseCategories: newCategories };
      });
    }
  };

  const handleUpdateExercise = (category, oldName, newName) => {
    setAppData(prevData => {
      const newCategories = { ...prevData.exerciseCategories };
      const exercises = newCategories[category];
      const index = exercises.indexOf(oldName);
      if (index !== -1 && !exercises.includes(newName)) {
        exercises[index] = newName;
        return { ...prevData, exerciseCategories: newCategories };
      }
      return prevData;
    });
  };

  const handleDeleteExercise = (category, exerciseName) => {
    if (window.confirm(`Are you sure you want to delete the exercise "${exerciseName}"?`)) {
        setAppData(prevData => {
            const newCategories = { ...prevData.exerciseCategories };
            newCategories[category] = newCategories[category].filter(ex => ex !== exerciseName);
            return { ...prevData, exerciseCategories: newCategories };
        });
    }
  };

  const activeProfile = appData.profiles.find(p => p.id === appData.activeProfileId) || appData.profiles[0];

  return (
    <div className="app-layout">
      <Sidebar
        profiles={appData.profiles}
        activeProfileId={appData.activeProfileId}
        onSwitchProfile={handleSwitchProfile}
        onManageProfiles={() => setProfileModalOpen(true)}
        onManageExercises={() => setExerciseModalOpen(true)}
      />
      <Dashboard
        profile={activeProfile}
        exerciseCategories={appData.exerciseCategories}
        onAddExerciseLog={handleAddExerciseLog}
        onAddCategory={handleAddCategory}
        onAddExerciseToCategory={handleAddExerciseToCategory}
        onUpdateExerciseLog={handleUpdateExerciseLog}
        onDeleteExerciseLog={handleDeleteExerciseLog}
      />
      {isProfileModalOpen && (
        <ProfileManager
          profiles={appData.profiles}
          avatars={avatars}
          onAddProfile={handleAddProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
      {isExerciseModalOpen && (
        <ExerciseManager
          exerciseCategories={appData.exerciseCategories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddExercise={handleAddExerciseToCategory}
          onUpdateExercise={handleUpdateExercise}
          onDeleteExercise={handleDeleteExercise}
          onClose={() => setExerciseModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;