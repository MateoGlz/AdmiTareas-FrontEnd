import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Login from './Modules/Login/login';
import Home from './Modules/Home/home';
import CreateTask from './Modules/Task/create_task';
import EditTask from './Modules/Task/edit_task';
import "./Styles/index.scss";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route  path ='/' element ={<Login/>}/>
          <Route  path ='/home' element ={<Home/>}/>
          <Route path="/create-tarea" element={<CreateTask />} /> 
          <Route path="/editar-tarea/:id" element={<EditTask />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
