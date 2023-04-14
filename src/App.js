import './App.css';
import Header from './components/Header';
import FourOhFour from './pageComponents/FourOhFour';
import MainPage from './pageComponents/MainPage';
import Login from './pageComponents/Login';
import Signup from './pageComponents/Signup';
import Profile from './pageComponents/Profile';
import NewGame from './pageComponents/NewGame';
import Game from './pageComponents/Game';
import {Routes, Route} from "react-router-dom";

function App() {
  const userName = localStorage.getItem('userName');

  return (
    <div className="App">
      <Header user={userName}/>
      <Routes>
      <Route path='/' element={<MainPage/>} exact />
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/newgame' element={<NewGame/>}/>
      <Route path='/game' element={<Game/>}/>
      <Route path='/404' element={<FourOhFour/>} />
      </Routes>
    </div>
  );
}

export default App;
