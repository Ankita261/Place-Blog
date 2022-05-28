import React from "react";

import UserItem from "./UserItem";
import './UsersList.css';
import Card from "../../shared/components/UIElements/Card";

const UsersList = props =>{
    if(props.items.length === 0){
        return (
          <Card>
            <div className="center">
                <h2>No Users Found !</h2>
            </div>
        </Card>
        );
    }

    return (
    <ul className="users-list">
        {props.items.map(user => (
            <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
            />
        ))}
    </ul> 
    );
};

export default UsersList;

