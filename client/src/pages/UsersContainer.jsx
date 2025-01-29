import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";

const UsersContainer = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Users</h1>

      <div style={styles.formContainer}>
        <AddUserForm setUsers={setUsers} />
      </div>

      {users.length === 0 ? (
        <p style={styles.noUsers}>No users available. Add one below!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// **Inline CSS Styles**
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  heading: {
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
  },
  formContainer: {
    marginBottom: "30px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  noUsers: {
    fontSize: "1.2em",
    color: "#555",
    marginTop: "20px",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    fontSize: "1.1em",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    fontSize: "1em",
    color: "#333",
  },
};

export default UsersContainer;
