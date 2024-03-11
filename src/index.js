import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Components/Header';
import Footer from './Footer';
import Dashboard from './dashboard';
import Report from './report';
import File from './file';
import Login from './Login';
import MISUPDC from './mis_updc';
import MIS_Form from './MIS_Form';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/report" element={<Report />} />
        <Route path="/file" element={<File />} />
        <Route path="/MIS_Form" element={<MIS_Form/>}/>
        <Route path="/mis_updc" element={<MISUPDC/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
