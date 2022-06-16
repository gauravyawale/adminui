import React, { useState, useEffect } from "react";
import UserData from "./UserData";
import Pagination from "./Pagination";
import "./UserList.css";
import axios from "axios";
import Header from "./Header";

// add the isChecked and isEdited to perfrom action on checkbox and edit user
const addIsCheckEdit = (users) => {
  const addedIscheckedEdited = users.map((user) => {
    return { ...user, isChecked: false, isEdited: false };
  });

  return addedIscheckedEdited;
};

const isValidInput = (editObject) => {
  if (
    editObject.name !== "" &&
    editObject.email !== "" &&
    editObject.role !== ""
  ) {
    if (editObject.name.length < 5) {
      alert("Name must be at least 5 characters long");
    } else if (!editObject.email.match(/.+@+.+\.[com|in|org]+$/)) {
      alert("Enter a valid email id. Ex: 'example@xmail.com'");
    } else if (
      editObject.role.toLowerCase() === "member" ||
      editObject.role.toLowerCase() === "admin"
    ) {
      return true;
    } else {
      alert(`Role must be "Admin" or "Member"`);
    }
  } else {
    alert("Input fields must be filled out");
  }
  return false;
};

export default function UserList() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [userPerPage, setUserPerPage] = useState(10);
  const [debounceTimer, setDebounceTimer] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editObject, setEditObject] = useState({});
  const [seachText, setSearchText] = useState("");
  const [editFlag, setEditFlag] = useState(false);
  let persistedUserData;

  //Fetch the given Api
  const fetchApi = async () => {
    try {
      let response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const postUserData = addIsCheckEdit(response.data);
      setUserData(postUserData);
      localStorage.setItem("userData", JSON.stringify(postUserData));
      localStorage.setItem("currentPage", JSON.stringify(currentPage));
    } catch (error) {
      console.log();
    }
  };

  //Initially to execute the the fetch Api call
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line
  }, []);

  // handle restore data by calling the api whenever user clicks on restore button
  const handleRestore = () => {
    fetchApi();
    setIsAllChecked(false);
    setSearchText("");
  };

  //handle page number whenever user clicks on page number

  const handlePageNumber = (number) => {
    if (editObject.isEdited) {
      handleCancelEdited(editObject.id);
    }
    setCurrentPage(number);
    localStorage.setItem("currentPage", JSON.stringify(number));
  };

  //paginatiuon logic to get the 10 users per page
  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUserList = userData.slice(indexOfFirstUser, indexOfLastUser);

  //handle delete user by removing the user from user list
  const handleDelete = (userId) => {
    persistedUserData = JSON.parse(localStorage.getItem("userData"));
    const updatedUserData = persistedUserData.filter(
      (user) => user.id !== userId
    );
    setCurrentPage(JSON.parse(localStorage.getItem("currentPage")));
    setUserData(updatedUserData);
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setSearchText("");
    setEditFlag(false);
  };

  //handle user edit click and set the clicked user data to individual user object

  const handleIsEdited = (userId) => {
    if (!editFlag) {
      const upadatedUserData = userData.map((user) => {
        if (user.id === userId) {
          setEditObject({ ...user, isEdited: true });
          return { ...user, isEdited: true };
        }
        return user;
      });
      setEditFlag(true);
      setUserData(upadatedUserData);
    }
  };

  //handle save to get edited data saved to the actual user data
  const handleSaveEdited = (userId) => {
    if (isValidInput(editObject)) {
      persistedUserData = JSON.parse(localStorage.getItem("userData"));
      const editedUserData = persistedUserData.map((user) => {
        if (user.id === userId) {
          return { ...editObject, isEdited: false };
        }
        return user;
      });
      setCurrentPage(JSON.parse(localStorage.getItem("currentPage")));
      setUserData(editedUserData);
      localStorage.setItem("userData", JSON.stringify(editedUserData));
      setEditObject({});
      setEditFlag(false);
      alert("Saved successfully");
    }
  };

  //handle cancel to store unEdited data
  const handleCancelEdited = (userId) => {
    const unEditedUserData = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, isEdited: false };
      }
      return user;
    });
    setUserData(unEditedUserData);
    setEditObject({});
    setEditFlag(false);
  };

  //search the input text entered by user
  const searchInputText = (text) => {
    if (text.length) {
      const searchedUserData = userData.filter((user) => {
        return (
          user.name.toLowerCase() === text.toLowerCase() ||
          user.name.split(" ")[0].toLowerCase() === text.toLowerCase() ||
          user.name.split(" ")[1].toLowerCase() === text.toLowerCase() ||
          user.email.toLowerCase() === text.toLowerCase() ||
          user.email.split("@")[0].toLowerCase() === text.toLowerCase() ||
          user.role.toLowerCase() === text.toLowerCase()
        );
      });

      if (searchedUserData.length) {
        setCurrentPage(1);
        setUserData(searchedUserData);
      } else {
        alert("No user found");
        setSearchText("");
        setUserData(JSON.parse(localStorage.getItem("userData")));
      }
    } else {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  };

  //debounce search to optimize perfromance

  const debounceSearch = (eventInput, debounceTimeOut) => {
    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }

    const timerId = setTimeout(
      () => searchInputText(eventInput),
      debounceTimeOut
    );
    setDebounceTimer(timerId);
  };

  //handle input text search using debouncing
  const handleSearchChange = (inputText) => {
    if (editObject.isEdited === true) {
      alert(
        "Can not search while editing. Please save or cancel the edited changes!"
      );
    } else {
      setSearchText(inputText);
      debounceSearch(inputText, 1000);
    }
  };

  //single checkbox selection to select and unselect the user
  const handleIsCheckedSingle = (userId) => {
    const updateIsChecked = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, isChecked: !user.isChecked };
      }
      return user;
    });

    let checkStatus = true;
    for (let check = indexOfFirstUser; check < indexOfLastUser; check++) {
      if (updateIsChecked[check].isChecked !== true) {
        checkStatus = false;
        break;
      }
    }

    setUserData(updateIsChecked);
    setIsAllChecked(checkStatus);
  };

  //handle selection of all checkboxes
  const handleIsAllChecked = () => {
    setIsAllChecked(!isAllChecked);
    let updateAllIsChecked;
    if (!isAllChecked) {
      updateAllIsChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: true };
        }
        return { ...user, isChecked: false };
      });
    } else {
      updateAllIsChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: false };
        }
        return user;
      });
    }
    setUserData(updateAllIsChecked);
  };

  //delete the all selected checkbox on the displyed page only
  const handleDeleteSeleceted = () => {
    if (editObject.isEdited === true) {
      alert("Plase save or cancel the edited changes!");
    } else {
      const afterDeletedUser = userData.filter((user) => {
        return user.isChecked === false;
      });

      setUserData(afterDeletedUser);
      localStorage.setItem("userData", JSON.stringify(afterDeletedUser));
      setIsAllChecked(false);
    }
  };

  return (
    <div>
      <Header
        handleRestore={handleRestore}
        seachText={seachText}
        handleSearchChange={handleSearchChange}
      />
      <div className="table-container">
        <table className="user-list">
          <thead className="table-head">
            <tr>
              <th>
                <div className="inputCheck-container">
                  <input
                    type="checkbox"
                    id="checkAll"
                    // style={{ width: "1.5em", height: "1.5em" }}
                    value={isAllChecked}
                    checked={isAllChecked}
                    onChange={handleIsAllChecked}
                  />
                  <label htmlFor="checkAll"></label>
                </div>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <UserData
              userData={currentUserList}
              handleDelete={handleDelete}
              handleIsEdited={handleIsEdited}
              handleIsCheckedSingle={handleIsCheckedSingle}
              editObject={editObject}
              handleEditObject={setEditObject}
              handleSaveEdited={handleSaveEdited}
              handleCancelEdited={handleCancelEdited}
            />
          </tbody>
        </table>
      </div>
      <div className="selection-row">
        <button
          type="button"
          className="delete-button"
          onClick={handleDeleteSeleceted}
        >
          Delete Selected
        </button>
        <Pagination
          userPerPage={userPerPage}
          totalUser={userData.length}
          handlePageNumber={handlePageNumber}
        />
        <div>
          {currentPage} of {Math.ceil(userData.length / userPerPage)}
        </div>
      </div>
    </div>
  );
}
