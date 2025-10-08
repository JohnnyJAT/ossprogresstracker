import React, { useState } from 'react';

function ProfileManager({ profiles, avatars, onAddProfile, onUpdateProfile, onDeleteProfile, onClose }) {
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState(avatars[0]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingProfileName, setEditingProfileName] = useState('');
  const [editingProfileAvatar, setEditingProfileAvatar] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onAddProfile(newProfileName.trim(), newProfileAvatar);
      setNewProfileName('');
      setNewProfileAvatar(avatars[0]);
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfileId(profile.id);
    setEditingProfileName(profile.name);
    setEditingProfileAvatar(profile.avatar);
  };

  const handleCancelEdit = () => {
    setEditingProfileId(null);
    setEditingProfileName('');
    setEditingProfileAvatar('');
  };

  const handleSaveEdit = (profileId) => {
    if (editingProfileName.trim()) {
      onUpdateProfile(profileId, editingProfileName.trim(), editingProfileAvatar);
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      onDeleteProfile(profileId);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Manage Profiles</h2>

        <div className="current-profiles-list" aria-label="Current profiles">
          <h4>Existing Profiles</h4>
          <ul>
            {profiles.map(p => (
              <li key={p.id}>
                {editingProfileId === p.id ? (
                  <div className="edit-profile-form">
                    <div className="avatar-picker">
                      {avatars.map(avatar => (
                        <img
                          key={avatar}
                          src={avatar}
                          alt="Avatar option"
                          className={`avatar-picker-item ${editingProfileAvatar === avatar ? 'selected' : ''}`}
                          onClick={() => setEditingProfileAvatar(avatar)}
                        />
                      ))}
                    </div>
                    <input
                      type="text"
                      value={editingProfileName}
                      onChange={(e) => setEditingProfileName(e.target.value)}
                      aria-label={`Edit name for ${p.name}`}
                    />
                    <button onClick={() => handleSaveEdit(p.id)} className="save-btn">Save</button>
                    <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                ) : (
                  <>
                    <img src={p.avatar} alt={`${p.name}'s avatar`} className="avatar-small" />
                    <span>{p.name}</span>
                    <div className="profile-actions">
                      <button onClick={() => handleEditClick(p)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteClick(p.id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleAdd} className="add-profile-form">
          <h4>Add New Profile</h4>
          <div className="form-group">
            <label htmlFor="new-profile-name">Profile Name</label>
            <input
              id="new-profile-name"
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter name"
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-picker">
              {avatars.map(avatar => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Avatar option"
                  className={`avatar-picker-item ${newProfileAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setNewProfileAvatar(avatar)}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="submit-btn">Add Profile</button>
        </form>

        <button onClick={onClose} className="close-btn" aria-label="Close profile manager">Close</button>
      </div>
    </div>
  );
}

export default ProfileManager;
