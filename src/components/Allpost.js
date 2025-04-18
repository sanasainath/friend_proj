import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './Allpost.css'; // Import the CSS file

const Allpost = () => {
  const [uploads, setUploads] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [editPostId, setEditPostId] = useState(null); // For tracking which post is being edited
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const MAX_LENGTH = 1000;

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await axios.get('https://friend-proj-3.onrender.com/api/alluploads');
      const sortedUploads = response.data;
      setUploads(sortedUploads);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`https://friend-proj-3.onrender.com/api/deleteuploads/${id}`);
        // After delete, re-fetch uploads
        fetchUploads();
      } catch (error) {
        console.error('Error deleting upload:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const post = uploads.find(upload => upload._id === id);
      setEditPostId(id);
      setEditDescription(post.description); // Load the current description
      setEditImage(null); // Reset image
    } catch (error) {
      console.error('Error loading post for editing:', error);
    }
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append('description', editDescription);
    formData.append('token',localStorage.getItem("token"));
    if (editImage) formData.append('image', editImage);
    console.log("edit image,",editImage);
    console.log("formmmmmmmmmmmmm",...formData)
  
    try {
      // Do not set the Content-Type header manually
      await axios.put(`https://friend-proj-3.onrender.com/api/editUpload/${editPostId}`, formData);
  
      // Close edit mode and re-fetch uploads
      setEditPostId(null);
      fetchUploads();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };
  

  return (
    <div className="allpost-container">
      <h1>All Uploads</h1>
      {uploads.length === 0 ? (
        <p>No uploads found</p>
      ) : (
        <ul className="allpost-upload-list">
          {uploads.map((upload) => (
            <li key={upload._id} className="allpost-item">
              <div className='allpost-item-left'>
                <Link to={`/getprofile/${upload.rollNo}`} className="allpost-profile-link">
                  <p className="allpost-name">{upload.name}</p>
                </Link>
                <p>
                  {upload.description.length > MAX_LENGTH
                    ? (expandedItems[upload._id] ? upload.description : upload.description.substring(0, MAX_LENGTH) + '...')
                    : upload.description}
                </p>
                {upload.description.length > MAX_LENGTH && (
                  <button onClick={() => toggleExpand(upload._id)}>
                    {expandedItems[upload._id] ? 'Read Less' : 'Read More'}
                  </button>
                )}
                <p className="allpost-timestamp">{moment(upload.createdAt).fromNow()}</p>
                <button className="allpost-delete-button" style={{cursor:'pointer', color:'red'}} onClick={() => handleDelete(upload._id)}>
                  Delete
                </button>
                <button className="allpost-edit-button" style={{cursor: 'pointer'}} onClick={() => handleEdit(upload._id)}>
                  Edit
                </button>
              </div>
              <div className='allpost-item-right'>
                <img
                  src={`https://friend-proj-3.onrender.com/uploads/${upload.image}`}
                  alt={upload.description}
                  width="200"
                  className="allpost-image"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Post Modal */}
      {editPostId && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Post</h3>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Update description"
              rows="5"
              className="edit-description-input"
            />
            <input
              type="file"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="edit-image-input"
            />
            <div className="edit-modal-buttons">
              <button onClick={() => setEditPostId(null)}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allpost;
