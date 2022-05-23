import React, {useEffect, useState} from "react";

import { useParams } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";

import "./PlaceForm.css"

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

const UpdatePlace = () =>{
    const [isLoading, setIsLoading] = useState(true);

    const placeId = useParams().placeId;

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    const [formState, inputHandler, setFormData] = useForm({
        title:{
            value:'',
            isValid: false
        },
        description:{
            value:'',
            isValid: false
        }
    }, 
    false
)

useEffect(() =>{
    if(identifiedPlace){
        setFormData(
            {
                title:{
                    value: identifiedPlace.title,
                    isValid: true
                },
                description:{
                    value:identifiedPlace.description,
                    isValid: true
                }
            }, 
            true
        );
    }
    
    setIsLoading(false);
}, [setFormData, identifiedPlace]);

    

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    if(!identifiedPlace){
        return (
            <div className="center" style={{textAlign: "center"}}>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    if(isLoading) {
        return (
            <div className="center" style={{textAlign: "center"}}>
                <Card>
                    <h2>Loading...</h2>
                </Card>
            </div>
        );
    };

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input 
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description, (minimum 5 characters)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>    
    </form>
    );
};
export default UpdatePlace;