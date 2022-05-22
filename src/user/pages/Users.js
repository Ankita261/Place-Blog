import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
     const USERS=[
        {
            id:'u1',
            name:'Ankita', 
            image:'https://img.traveltriangle.com/blog/wp-content/uploads/2014/11/cover-for-Places-To-Visit-In-August-In-The-World.jpg', 
            placeCount:3
        }
    ];

    return <UsersList items={USERS} />;
};

export default Users;