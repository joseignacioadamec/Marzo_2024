import React from "react";
import { Table, Button, Form } from "react-bootstrap";
import { handleSort } from "../utils/sort";
import { handleUserClick } from "../utils/modalEdition";

export const UserTable = ({
  currentUsers,
  sortedField,
  setSortedField,
  sortDirection,
  setSortDirection,
  handleEdit,
  setSelectedUser,
  setEditMode,
  setEditedValue,
  editMode,
  setShowModal,
  selectedUser,
  editedValue,
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <Button
              variant="link"
              onClick={() =>
                handleSort(
                  "name",
                  sortedField,
                  setSortedField,
                  sortDirection,
                  setSortDirection
                )
              }
            >
              Name{" "}
              {sortedField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </Button>
          </th>
          <th>
            <Button
              variant="link"
              onClick={() =>
                handleSort(
                  "email",
                  sortedField,
                  setSortedField,
                  sortDirection,
                  setSortDirection
                )
              }
            >
              Email{" "}
              {sortedField === "email" && (sortDirection === "asc" ? "▲" : "▼")}
            </Button>
          </th>
          <th>
            <Button
              variant="link"
              onClick={() =>
                handleSort(
                  "phone",
                  sortedField,
                  setSortedField,
                  sortDirection,
                  setSortDirection
                )
              }
            >
              Phone{" "}
              {sortedField === "phone" && (sortDirection === "asc" ? "▲" : "▼")}
            </Button>
          </th>
          <th>Website</th>
          <th>Company Name</th>
          <th>Address</th>
          <th>Birthday</th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user) => (
          <tr
            key={user.id}
            onClick={() => handleUserClick(user, setSelectedUser, setShowModal)}
          >
            <td>
              {editMode === "name" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "name",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user.name}
                </span>
              )}
            </td>
            <td>
              {editMode === "email" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "email",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user.email}
                </span>
              )}
            </td>
            <td>
              {editMode === "phone" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "phone",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user.phone}
                </span>
              )}
            </td>
            <td>
              {editMode === "website" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "website",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user.website}
                </span>
              )}
            </td>

            <td>
              {editMode === "company" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "company",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user?.company && user?.company?.name}
                </span>
              )}
            </td>

            <td>
              {editMode === "address" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "address",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >{`${user?.address?.street}, ${user?.address?.suite} - ${user?.address?.zipcode} (${user?.address?.city})`}</span>
              )}
            </td>

            <td>
              {editMode === "birthday" &&
              selectedUser &&
              selectedUser.id === user.id ? (
                <Form.Control type="text" value={editedValue} />
              ) : (
                <span
                  onClick={() =>
                    handleEdit(
                      "birthday",
                      user,
                      setEditMode,
                      setSelectedUser,
                      setEditedValue
                    )
                  }
                >
                  {user.birthday}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
