import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import {Route,Routes} from 'react-router-dom';
import GamePlay from "./pages/GamePlay/GamePlay";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Games from "./pages/Games/Games";
import Footer from "./components/Footer/Footer";
import Profile from "./pages/Profile/Profile";
import DeveloperProfile from "./pages/DeveloperProfile/DeveloperProfile";

const App = ()=>{
  return(
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element= {<Home/>}/>
      <Route path="/games/:slug" element={<GamePlay/>} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/games" element={<Games/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/developer" element={<DeveloperProfile/>} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App;