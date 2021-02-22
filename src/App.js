
import React from 'react';
import Payment from './components/p2p/Payment';
import { ToastContainer } from 'react-toastify';
import './assets/scss/style.scss'
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export default function App() {
  return (
    <>
      <Router>
        <Payment />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}
