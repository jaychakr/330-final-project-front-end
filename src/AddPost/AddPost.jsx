import './AddPost.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { ref, uploadBytes } from "firebase/storage";
import storage from "../db.js"
function AddPost() {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileType = file.type.substring(0, 5);
        const data = { 
            description,
            fileType
        };
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            const storageRef = ref(storage, result._id);
            await uploadBytes(storageRef, file);
            const decoded = jwtDecode(token);
            navigate(`/profile/${decoded.userId}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div className="addPost">
            <form onSubmit={handleSubmit}>
                <label htmlFor="description">Description:</label><br/>
                <textarea rows="6" cols="35" type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)} required/><br/><br/>
                <input type="file" id="photo" name="photo" onChange={(e) => setFile(e.target.files[0])} className="file" required/><br/><br/><br/>
                <input type="submit" value="Submit" className="submit"></input><br/><br/>
            </form>  
        </div>
    );
}
  
export default AddPost;