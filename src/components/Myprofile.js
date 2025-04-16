import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myprofile.css'; 
import Popup from './Messages';
import { Link,useNavigate } from 'react-router-dom';


// Function to group messages by 'id'
const groupMessagesById = (messages) => {
    const grouped = messages.reduce((acc, message) => {
        if (!acc[message.id]) {
            acc[message.id] = [];
        }
        acc[message.id].push(message);
        return acc;
    }, {});
    return grouped;
};

export const Myprofile = () => {
    const [token, setToken] = useState('');
    const [profile, setProfile] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (token === '') {
            setToken(storedToken);
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://friend-proj-3.onrender.com/api/myprofile', { token });
                console.log("response ", response);
                setProfile(response.data.uploads || {});
                setLoading(false);
            } catch (error) {
                console.log("Error fetching profile", error.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);
      useEffect(()=>{
        const storedToken = localStorage.getItem('token');
        if(!storedToken)
        {
          navigate("/");
        }
      },[]);

    // Group messages by their 'id'
    const groupedMessages = profile.messages ? groupMessagesById(profile.messages) : {};

    const toggleGroup = (id) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }
  

    return (
        <div className="myprofilecontainer">

            <div className="myprofile-info">

                <div className="myprofile-header">
                    {/* Uncomment and adjust image path as necessary */}
                    {profile.image && <img  src={`https://friend-proj-3.onrender.com/uploads/${profile.image}`} alt="Profile" />}
                    <div>
                        <h1 className="capitalize">{profile.name || 'N/A'}</h1>
                        <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                        <p className="capitalize"><strong>Roll No:</strong> {profile.rollNo || 'N/A'}</p>
                        <p><strong>Year:</strong> {profile.year || 'N/A'}</p>
                        <p className="capitalize"><strong>Branch:</strong> {profile.branch || 'N/A'}</p>
                    </div>
                </div>
                <div className="myprofile-posts">
                    <strong>Posts:</strong>
                    <ul>
                        {profile.posts && profile.posts.length > 0 ? (
                            profile.posts.map((post, index) => (
                                
                                <div key={index}>
                                    <div className='singlepost'>
                                    <div>{post.description}</div>
                                    <img
                                        src={`https://friend-proj-3.onrender.com/uploads/${post.image}`}
                                        alt={post.description}
                                        width="200"
                                        className="allpost-image"
                                    />
                                    </div>
                                </div>
                                
                            ))
                        ) : (
                            <li>No posts available</li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="myprofile-messages">
                <strong>Messages:</strong>
                {Object.keys(groupedMessages).length > 0 ? (
                    Object.keys(groupedMessages).map((id) => (
                        <div key={id}>
                            <h4 onClick={() => toggleGroup(id)}>
                                Group {id} {expandedGroups[id] ? '-' : '+'}
                            </h4>
                            {expandedGroups[id] && (
                                <ul>
                                    {groupedMessages[id].map((msg) => (
                                           <div>
                                        <li key={msg._id}>
                                            <div><strong>Name:</strong> {msg.name}</div>
                                            <div><strong>Email:</strong> {msg.email}</div>
                                            <div><strong>Branch:</strong> {msg.branch}</div>
                                            <div><strong>Roll No:</strong> {id}</div>
                                            <div><strong>Description:</strong> {msg.description}</div>
                                            <Link  to={`/profile/${id}`}>Message Him</Link>
                                            
                                        </li>
                                     
                                       
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No messages available</div>
                )}
            </div>
           
        </div>
    );
};
