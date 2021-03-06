import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import Noprofile from "../../assets/noprofile.png";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollowButton, setShowFollowButton] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  console.log(userProfile);

  const followUser = () => {
    fetch("/api/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollowButton(false);
      });
  };

  const unfollowUser = () => {
    fetch("/api/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollowButton(true);
      });
  };

  return (
    <div>
      {userProfile ? (
        <div
          style={{
            maxWidth: "700px",
            margin: "auto",
            justifyContent: "centre",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={Noprofile}
                alt=""
              />
            </div>

            <div>
              <h5>{userProfile.user.name}</h5>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length} Followers</h6>
                <h6>{userProfile.user.following.length} Following</h6>
              </div>

              {showFollowButton ? (
                <button
                  className="pointer btn waves-effect waves-light #ba68c8 blue lighten-2"
                  onClick={() => followUser()}
                  style={{ marginTop: "7px" }}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="pointer btn waves-effect waves-light #ba68c8 blue lighten-2"
                  onClick={() => unfollowUser()}
                  style={{ marginTop: "7px" }}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  alt={item.title}
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h4>Loading...!</h4>
      )}
    </div>
  );
};

export default Profile;
