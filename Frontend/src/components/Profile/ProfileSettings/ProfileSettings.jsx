import "./ProfileSettings.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../../config/api";
import axios from "axios";
import { CDN_BASE_URL } from "../../../utils/constants";

const ProfileSettings = () => {
  const { authData, setAuthData } = useContext(AuthContext);

  const [fullName, setFullName] = useState(authData.user.fullName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [preview, setPreview] = useState(
    authData.user.profilepic.startsWith("users/")
      ? `${CDN_BASE_URL}/${authData.user.profilepic}`
      : authData.user.profilepic,
  );
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      let updatedProfilePic = authData.user.profilepic;

      // 🔥 If new image selected
      if (selectedFile) {
        // Step 1: Get signed URL
        const { data } = await API.post("/user/profile-pic/get-upload-url", {
          fileType: selectedFile.type,
        });

        // Step 2: Upload to R2
        await axios.put(data.uploadUrl, selectedFile, {
          headers: { "Content-Type": selectedFile.type },
        });

        // Step 3: Confirm upload
        const confirmRes = await API.post("/user/profile-pic/confirm-upload", {
          fileKey: data.fileKey,
        });

        updatedProfilePic = confirmRes.data.profilepic;
      }

      // 🔥 Update full name
      const res = await API.put("/user/profile/update", {
        fullName,
      });

      // 🔥 Update AuthContext
      setAuthData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          fullName: res.data.user.fullName,
          profilepic: updatedProfilePic,
        },
      }));

      alert("Profile updated successfully!");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.put("/user/password/update", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete("/user/delete-account", {
        data: { password: deletePassword },
      });

      alert("Account deleted successfully");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Profile Information</h2>

        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            <img src={preview} alt="Profile" />
          </div>

          <label className="change-photo-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>

        <div className="settings-input-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <button
          className="save-btn"
          onClick={handleSaveChanges}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Security Section */}
      <div className="settings-section">
        <h2>Security</h2>

        <div className="settings-input-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="settings-input-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="settings-input-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="save-btn" onClick={handlePasswordUpdate}>
          Update Password
        </button>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger-zone">
        <h2>Danger Zone</h2>

        <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h3>Confirm Account Deletion</h3>
              <p>This action cannot be undone.</p>

              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={handleDeleteAccount}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
