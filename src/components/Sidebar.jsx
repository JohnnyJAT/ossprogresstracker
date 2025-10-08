import React from 'react';

function Sidebar({ profiles, activeProfileId, onSwitchProfile, onManageProfiles, onManageExercises }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <h1>Gym Tracker</h1>
        </div>
        <nav aria-label="User Profiles">
          <ul className="profile-list">
            {profiles.map(profile => (
              <li
                key={profile.id}
                className={`profile-list-item ${profile.id === activeProfileId ? 'active' : ''}`}
                onClick={() => onSwitchProfile(profile.id)}
                role="button"
                tabIndex="0"
                aria-pressed={profile.id === activeProfileId}
              >
                {profile.name}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="sidebar-actions">
        <button onClick={onManageExercises} className="manage-btn">
          Manage Exercises
        </button>
        <button onClick={onManageProfiles} className="manage-btn">
          Manage Profiles
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
