import React from "react";

// interface Admin {
//   id: number;
//   name: string;
//   email: string;
// }

const AdminProfile = async () => {
  // const res = await fetch("https://jsonplaceholder.typicode.com/users");
  // const users: Admin[] = await res.json();
  return (
    <div>
      <h1>Admin Profile</h1>
      <ul>
        {/* <li>{users.map((user) => user.email)}</li> */}
      </ul>
    </div>
  );
};

export default AdminProfile;
