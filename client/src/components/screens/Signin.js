import React, {useState, useContext} from 'react';
import { Link, useHistory } from "react-router-dom";
import {UserContext} from "../../App"
import M from "materialize-css";

const Signin = () => {

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const postData = () => {
        if (/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {

            fetch("http://localhost:5000/signin", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.err) {
                        M.toast({ html: data.err, classes: "z-depth-5" })
                    }
                    else {
                        //console.log(data);
                        localStorage.setItem("jwt", data.token)
                        localStorage.setItem("user", JSON.stringify(data.user))
                        dispatch({type:"USER", payload:data.user})
                        M.toast({ html: "LoggedIn Successfully", classes: "z-depth-5" });
                        history.push('/')
                    }
                })
                .catch(err => {
                    console.log("Error: " + err);
                })

        }
        else {
            M.toast({ html: "Invalid Email Address", classes: "#c62828 red lighten-3 black-text text-darken-5 z-depth-5" })
            return;
        }

    }

    return(
        <div>
            <div className="mycard input-field">

                <div className="card auth-card shadow-2">

                    <h4>Instagram</h4>

                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <button 
                        className="grow btn waves-effect waves-light #ba68c8 purple lighten-2"
                        onClick={()=>postData()}    
                    >
                        Login
                    </button>
                    
                    <p>Don't Have An Account?</p>
                    
                    <p>
                        <Link to='/signup' className="dim fw6">SignUp Here</Link>
                    </p>

                </div>

            </div>
        </div>
    )
}    
export default Signin;