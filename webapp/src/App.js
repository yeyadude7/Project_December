import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import EventsList from "./components/EventsList/EventsList";
import Events from "./pages/Events/events";
import ProfileEditor from "./pages/ProfileEditor/profileEditor";
import Profile from "./pages/Profile/profile";
import AboutMe from "./pages/AboutMe/aboutme";
import Friends from "./pages/Friends/friends";
import SignUp from "./pages/Signup/signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/signup" element = {<SignUp/>}/>
        <Route path = "/editprofile" element = {<ProfileEditor/>}/>
        <Route path = "/events" element = {<Events/>}/>
        <Route path = "/friends" element = {<Friends/>}/>
        <Route path = "/aboutme" element = {<AboutMe/>}/>
        <Route path = "/mainprofile" element = {<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
