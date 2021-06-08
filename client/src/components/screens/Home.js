import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from "../../App";
import M from "materialize-css";
import {Link} from "react-router-dom";
const Home = () => {

    const [commentText, setCommentText] = useState("");
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch("http://localhost:5000/allposts", {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            
            setData(result.posts)
            //console.log(result)
        })
    },[])

    const likePost = (id) => {
        fetch('http://localhost:5000/like', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            //console.log(result)
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else {
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('http://localhost:5000/unlike', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('http://localhost:5000/comment', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            //console.log(result)
            const newData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    const deletePost = (postid) => { 
        fetch(`http://localhost:5000/deletepost/${postid}`, {
            method:"delete",
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            //console.log(result)
            M.toast({ html: "Post Deleted Successfully", classes: "z-depth-5" });
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }


    return (
        <div className="home">
            {
                data.map(item => {
                    return(
                        <div className="card home-card" key={item._id}>
                            <div className="flex justify-between">
                                <h5 className="pa2 ph3">
                                    <Link to={item.postedBy._id === state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                        {item.postedBy.name}
                                    </Link>
                                </h5>
                                {
                                    item.postedBy._id === state._id && <i
                                                                        onClick={() => deletePost(item._id)}
                                                                        className="material-icons pointer grow pa2 pv4">delete
                                                                        </i>
                                }
                                
                            </div>
                            
                            <div className="card-image shadow-3">
                                <img alt="" src={item.photo} />
                            </div>

                            <div className="card-conrent">
                                <div className="pt2 ph2" style={{display: "flex"}}>
                                    <div>
                                        {
                                            item.likes.includes(state._id)
                                                ? <i
                                                    onClick={() => unlikePost(item._id)}
                                                    className="material-icons pointer grow pa2">thumb_down
                                      </i>
                                                : <i
                                                    onClick={() => likePost(item._id)}
                                                    className="material-icons pointer grow pa2">thumb_up
                                      </i>
                                        }
                                    </div>
                                    <h6 className="b dim">{item.likes.length} Likes</h6>
                                </div>
                                
                                <h6 className="b ph3">{item.title}</h6>
                                <p className="ph3">{item.body}</p>

                                {
                                    item.comments.map(record => {
                                        return(
                                            <h6 className="ph3">
                                                <span style={{fontWeight:"bold"}}>{record.postedBy.name}</span> > {record.text}
                                            </h6>
                                        )
                                    })
                                }

                                <div className="ph3 pb2">
                                    <form className="black-80"
                                    >
                                        <label for="comment" className="pv2 f6 b db mb2">Add Comment...</label>
                                        <div style={{display:"flex"}}>
                                            <textarea 
                                                onChange={(e) => setCommentText(e.target.value)}
                                                id="comment" 
                                                name="comment" 
                                                className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" 
                                                aria-describedby="comment-desc"
                                            ></textarea>
                                            <div
                                                onClick={() => makeComment(commentText, item._id) }
                                                className="pointer f6 grow no-underline br2 ph3 pv2 mb2 dib bg-light-purple">Add</div>
                                        </div>
                                    </form>
                                </div>
                                
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;