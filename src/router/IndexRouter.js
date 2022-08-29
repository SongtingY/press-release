import React from 'react'
import { HashRouter, Route, Routes, Navigate} from 'react-router-dom'
import Login from "../views/login/Login.js"
import NewsSandBox from "../views/newssandbox/NewsSandBox.js"

function IndexRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={localStorage.getItem("token")?<NewsSandBox/>:<Navigate to="/Login"/>}/>
      </Routes>
    </HashRouter>
  )
};
export default IndexRouter;
