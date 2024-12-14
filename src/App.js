import './App.css';
import './styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, {  useState } from 'react';
import NavigationBar from './components/Navbar';
import Home from "./Pages/Home/Home";
import CostEstimation from "./Pages/CostEstimation/CostEstimation";
import ValveTrim from "./Pages/ValveTrim/ValveTrim";
import Settings from './Pages/Settings/Settings';
import Login from "./Pages/Login/Login";
import RegistrationForm from "./Pages/Login/RegistrationForm";
  
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Component1 from './A Temp/Experiment';


function App() {
  const [role, setRole] = useState('');
  const isLogin = localStorage.getItem('isLogin');
  const isRole = localStorage.getItem('role');
  
  return (
    <Router>
      <div className="App">
        <NavigationBar role= {role}/>
        <Routes>
          {/* <Route path="/register" element={<RegistrationForm />} /> */}

            <Route
              path="/login"
              element={<Login setRole={setRole} role={role}/>}
           />

           <Route path="/" element={<Home />} />
           <Route
              path="/CostEstimation"
              element={isLogin && isRole === 'admin' ? <CostEstimation /> : <Navigate to="/login" />}
            />

           <Route
              path="/valvetrim"
              element={isLogin && isRole === 'admin' ? <ValveTrim /> : <Navigate to="/login" />}
            />

           <Route
              path="/settings"
              element={isLogin && isRole === 'admin' ? <Settings /> : <Navigate to="/login" />}
            />

            <Route
              path="/exp"
              element={ <Component1 />}
            />

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
