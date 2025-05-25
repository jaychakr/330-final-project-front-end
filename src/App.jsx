import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import Header from './Header/Header';
import NewsFeed from './NewsFeed/NewsFeed';
import SignUp from './SignUp/SignUp';
import LoginPage from './LoginPage/LoginPage';
import Post from './Post/Post';
import Profile from './Profile/Profile';
import Footer from './Footer/Footer';
import AddPost from './AddPost/AddPost';
import Inbox from './Inbox/Inbox';
import ChatRoom from './ChatRoom/ChatRoom';
import Chat from './Chat/Chat';
import './App.css';

function App() {
  const location = useLocation();
  const noFooterRoutes = ['/login', '/signUp', '/addPost', '/messages', '/inbox', '/chat/:conversationId'];
  const hideFooter = noFooterRoutes.some(route =>
    matchPath({ path: route, end: true }, location.pathname)
  );
  return (
    <div className="app">
      <Header/>
      <div className="content">
        <Routes>
          <Route path="/" element={<NewsFeed/>}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/profile/:userId" element={<Profile/>}/>
          <Route path="/post/:postId" element={<Post/>}/>
          <Route path="/addPost" element={<AddPost/>}/>
          <Route path="/inbox" element={<Inbox/>}/>
          <Route path="/messages" element={<ChatRoom/>}/>
          <Route path="/chat/:conversationId" element={<Chat/>}/>
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
