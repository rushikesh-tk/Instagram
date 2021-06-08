import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [myPics, setPics] = useState([]);
  const { state } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setPics(result.MyPosts);
      });
  }, []);
  console.log(state);
  return (
    <div
      style={{ maxWidth: "700px", margin: "auto", justifyContent: "centre" }}
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
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://images.unsplash.com/photo-1582533552406-234434284c17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
        </div>

        <div>
          <h5>{state ? state.name : "Loading"}</h5>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{myPics.length} Posts</h6>
            <h6>{state ? state.followers.length : 0} Followers</h6>
            <h6>{state ? state.followers.length : 0} Following</h6>
          </div>
        </div>
      </div>

      <div className="gallery">
        {myPics.map((item) => {
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
  );
};

export default Profile;
