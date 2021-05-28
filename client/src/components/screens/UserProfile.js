import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App"
import {useParams} from "react-router-dom"

const Profile = () => {

    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const {userid} = useParams();
    //console.log(userid);
    
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setProfile(result);
            })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }

    return (
        <div>
            {userProfile ? 
                <div style={{ maxWidth: "700px", margin: "auto", justifyContent: "centre" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>

                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src="https://images.unsplash.com/photo-1582533552406-234434284c17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                alt=""
                            />
                        </div>

                        <div>
                            <h5>{userProfile.user.name}</h5>
                            <h5>{userProfile.user.email}</h5>

                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6>300 Followers</h6>
                                <h6>250 Following</h6>
                            </div>

                            <button
                                className="pointer btn waves-effect waves-light #ba68c8 purple lighten-2"
                                onClick={() => followUser()}
                            >
                                Follow
                            </button>
                        </div>

                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" alt={item.title} src={item.photo} />
                                )
                            })
                        }
                    </div>
                </div>
            :   <h4>Loading...!</h4>}
        </div>
      )
}

export default Profile;