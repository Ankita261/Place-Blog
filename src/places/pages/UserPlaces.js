import React from "react";
import {useParams} from "react-router-dom"
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES =[
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://media.istockphoto.com/photos/dramatic-sunset-view-highlighting-the-empire-state-building-picture-id178735930?k=20&m=178735930&s=612x612&w=0&h=QVBpiszkUAs-m6wTF8BuJ4Qgv5s54KIapbkBOeCoZH8=',
        address: '350 Fifth Avenue Manhattan, New York 10118',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building NY',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://media.istockphoto.com/photos/new-york-city-skyline-picture-id486334510?k=20&m=486334510&s=612x612&w=0&h=OsShL4aTYo7udJodSNXoU_3anIdIG57WyIGuwW2_tvA=',
        address: '350 Fifth Avenue Manhattan, New York 10118',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UserPlaces = () =>{
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;