import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
    
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if(url){
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            }).then(res => res.json())
                .then(data => { //console.log(data)
                    if (data.error) {
                        M.toast({ html: data.error, classes: "z-depth-5" })
                    }
                    else {
                        //console.log(data.user);
                        M.toast({ html: "Created Post Successfully", classes: "z-depth-5" });
                        history.push('/')
                    }
                })
                .catch(err => {
                    console.log("Error: " + err);
                })
        }
    }, [url])

    const postDetails = ()=> {
        const imagedata = new FormData()
        imagedata.append("file", image);
        imagedata.append("upload_preset", "insta-clone");
        imagedata.append("cloud_name", "dyjm7aofi");

        fetch("https://api.cloudinary.com/v1_1/dyjm7aofi/image/upload", {
            method:"post",
            body:imagedata
        })
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            setUrl(data.url);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return(
        <div className="card input-filed shadow-1"
             style={{
                 margin:"60px auto",
                 padding:"20px",
                 maxWidth:"500px",
                 textAlign:"center"
                 
             }}>


            <input 
                type='text' 
                placeholder="Title"
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
            ></input>

            <input 
                type='text' 
                placeholder="Body"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            ></input>


            <div className="file-field input-field">
                <div className="btn #ba68c8 purple lighten-2">
                    <span>Upload Image</span>
                    <input 
                        type="file"
                        //value={image}
                        onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>

            <button 
                className="grow btn waves-effect waves-light #ba68c8 purple lighten-2"
                onClick={()=>postDetails()}    
            >
                Submit Post
             </button>
        </div>
    );
}

export default CreatePost;