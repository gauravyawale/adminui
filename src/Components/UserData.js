import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./UserData.css";

const UserData = ({
  userData,
  handleDelete,
  handleIsEdited,
  handleIsCheckedSingle,
  editObject,
  handleEditObject,
  handleSaveEdited,
  handleCancelEdited,
}) => {
  return userData.map((user) => {
    return (
      <tr
        key={user.id}
        style={{
          height: "44px",
          backgroundColor: user.isChecked ? "#f0f0f5" : "",
        }}
      >
        {user.isEdited ? (
          <>
            <td>
              <div className="inputCheck-container">
                <input
                  type="checkbox"
                  id={`edit-checkbox${user.id}`}
                  style={{ width: "16px", height: "16px" }}
                  className="checkbox-input"
                />
                <label htmlFor={`edit-checkbox${user.id}`}></label>
              </div>
            </td>
            <td>
              <input
                type="text"
                value={editObject.name}
                onChange={(event) =>
                  handleEditObject({ ...editObject, name: event.target.value })
                }
                placeholder="Enter your name"
                className="edit-name"
              />
            </td>
            <td>
              <input
                type="email"
                value={editObject.email}
                onChange={(event) =>
                  handleEditObject({ ...editObject, email: event.target.value })
                }
                placeholder="Enter your email"
                className="edit-email"
              />
            </td>
            <td>
              <input
                type="text"
                value={editObject.role}
                onChange={(event) =>
                  handleEditObject({ ...editObject, role: event.target.value })
                }
                placeholder="Enter your role"
                className="edit-role"
              />
            </td>
            <td>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleSaveEdited(user.id)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => handleCancelEdited(user.id)}
                >
                  Cancel
                </button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td>
              <div className="inputCheck-container">
                <input
                  type="checkbox"
                  id={`checkbox${user.id}`}
                  className="check-box"
                  value={user.isChecked}
                  checked={user.isChecked}
                  onChange={() => handleIsCheckedSingle(user.id)}
                />
                <label htmlFor={`checkbox${user.id}`}></label>
              </div>
            </td>
            <td style={{ textTransform: "capitalize" }}>{user.name}</td>
            <td>{user.email}</td>
            <td style={{ textTransform: "capitalize" }}>{user.role}</td>
            <td className="mobile-action">
              <EditOutlinedIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleIsEdited(user.id)}
              />
              <DeleteOutlineIcon
                variant="outlined"
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(user.id)}
              />
            </td>
          </>
        )}
      </tr>
    );
  });
};

export default UserData;
