import React, {useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import {UserContext} from "../App"

const NavBar = () => {

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory();

    const renderList = () => {
        if(state)
        {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost">CreatePost</Link></li>,
                <li>
                    <button
                        className="shadow-1 btn waves-effect waves-light #ba68c8 purple lighten-2"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({type:"CLEAR"});
                            history.push("/signin");
                        }}
                    >
                        Logout
                    </button>
                </li>
            ]
        }
        else
        {
            return [
                <li><Link to="/signin">SignIn</Link></li>,
                <li><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    return(
        <nav>
            <div className="nav-wrapper white mv0">
                <p className='pl4'>
                    <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                </p>
                
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;