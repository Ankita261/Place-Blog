import React, {useState, useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData]= useForm({
        email:{
            value: '',
            isValid: false
        },
        password:{
            value: '',
            isValid: false
        }
    },
    false
);

const switchModeHandler = () =>{ 
    if(!isLoginMode){

        setFormData(
            {
                ...formState.inputs,
                name:undefined
            },
        formState.inputs.email.isValid && formState.inputs.password.isValid
        );
    } else{
        setFormData({
            ...formState.inputs,
            name:{
                value: '',
                isValid: false
            }
        },
        false
    );
    }
    setIsLoginMode(prevMode => !prevMode);
};

const authSubmitHandler = async event => {
    event.preventDefault();
    
    if(isLoginMode){
        try{
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/login', 
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
            auth.login(responseData.user.id);
        } catch (err) {}
        
    } else {
        try{
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/signup',
                'POST',
                JSON.stringify({
                    name: formState.inputs.name.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
            auth.login(responseData.user.id)   
        }
         catch (err) {}    
    }
};


    return (
        <React.Fragment>
            <ErrorModal error ={error} onClear={clearError} />
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>LOGIN REQUIRED!</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input 
                        element="input" 
                        id="name" 
                        type="text" 
                        label="Your Name" 
                        validators={[VALIDATOR_REQUIRE()]} 
                        errorText="Please enter a name."
                        onInput={inputHandler}
                    />
                )}
                <Input 
                    id="email"
                    element="input"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Not a valid email id"
                    onInput={inputHandler}
                    // initialValue={}
                    // initialValid={}
                />
                <Input 
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(8)]}
                    errorText="Please enter a valid Password, atleast 8 characters"
                    onInput={inputHandler}
                    // initialValue={}
                    // initialValid={}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
            </form>
            <Button inverse 
                onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN' }
            </Button>
            
        </Card>
        </React.Fragment>
    );
};

export default Auth;
