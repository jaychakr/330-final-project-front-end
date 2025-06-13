import './NewsFeed.css'
import { useState, useEffect } from "react";
import Post from '../Post/Post';
function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 3;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const downloadPosts = async() => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const newPosts = await response.json();
        setPosts(newPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    downloadPosts();
    setLoading(false);
  }, []);
  const searchByKeyword = async () => {
    try {
      const response = keyword ? await fetch(`${import.meta.env.VITE_API_URL}/posts/search/${keyword}`) : await fetch(`${import.meta.env.VITE_API_URL}/posts?skip=0&limit=3`);
      if (!keyword) {
        setSkip(0);
      }
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const newPosts = await response.json();
      setPosts(newPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
  const loadMorePosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts?skip=${skip + 3}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const newPosts = await response.json();
      setPosts([...posts, ...newPosts]);
      setSkip(skip + 3);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } 
  }
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="newsFeed">
      <div className="search">
        Find a post by keyword:
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
        <button onClick={searchByKeyword}>Search</button>
      </div>
      {posts.map((post) => (
        <Post key={post._id} post={post} posts={posts} setPosts={setPosts}/>
      ))}
      <button onClick={loadMorePosts} className='loadMore'><b>Load More Posts</b></button>
    </div>
  );
}

export default NewsFeed;