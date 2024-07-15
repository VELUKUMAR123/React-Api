 import React, { useState, useEffect } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core'; //editable for edit purpose //Tnputgroup for grouping //Toaster for display congtent
import './App.css';

const AppToaster = Toaster.create({
  position: "top"
});

function App() {
  const [Users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())  // Invoke .json() as a function
      .then((json) => setUsers(json));
  }, []);

  function addUser() {
    const name = newName.trim();  //trim to structured clear
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {     //put method bod headers
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json())
        .then(data => {
          setUsers([...Users, data]);
          AppToaster.show({
            message: "User added successfully!!",
            timeout: 5000,  //seconds
            intent: 'success'   //for green colour
          })
          setNewName("");
          setNewEmail("");
          setNewWebsite("");             //for empty purpose
        });
    }
  }

  function onChangeHandler(id, key, value) {
    setUsers((Users) =>
      Users.map(user => {
        return user.id === id ? { ...user, [key]: value } : user;
      })
    );
  }

  function updateUser(id) {
    const user = Users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {     //put method bod headers
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json())
      .then(data => {
        setUsers(Users.map(u => u.id === id ? data : u));
        AppToaster.show({
          message: "User updated successfully!!",
          timeout: 5000,  //seconds
          intent: 'success'   //for green colour
        })
      });
  }

  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {     //put method bod headers
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setUsers(Users.filter(u => u.id !== id));
        AppToaster.show({
          message: "User deleted successfully!!",
          timeout: 5000,  //seconds
          intent: 'success'   //for green colour
        });
      }
    });
  }

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>WEBSITE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {Users.map(user =>
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email} /></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website} /></td>
              <td>
                <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Enter name..'
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='Enter email..'
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder='Enter website..'
              />
            </td>
            <td>
              <Button intent='success' onClick={addUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
