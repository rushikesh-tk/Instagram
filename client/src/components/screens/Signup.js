import React,{useState} from 'react';
import { Link, useHistory} from "react-router-dom";
import M from "materialize-css";

const Signup = () => {


    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    
    const postData = () => {
        if ( /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ){

            fetch("http://localhost:5000/signup",{
                method: "post",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "z-depth-5"})
                    }
                    else {
                        M.toast({ html: data.Msg, classes:"z-depth-5"});
                        history.push('/signin')
                    }
                })
                .catch(err => {
                    console.log("Error: "+ err);
                })

        } 
        else
        {
            M.toast({ html: "Invalid Email Address", classes:"#c62828 red lighten-3 black-text text-darken-5 z-depth-5"})
            return;
        }
        
    }

    return (
        <div>
            <div className="mycard input-field">

                <div className="card auth-card shadow-2">

                    <h4>Instagram</h4>

                    <input 
                        type='text' 
                        placeholder='Name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}    
                    />

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
                        SignUp
                    </button>
                    
                    <p>Already Have An Account?</p>
                    
                    <p>
                        <Link to='/signin' className="dim fw6">SignIn Here</Link>
                    </p>

                </div>

            </div>
        </div>
    )
}
export default Signup;