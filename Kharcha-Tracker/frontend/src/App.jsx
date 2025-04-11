import React from 'react'
import Signup from './Components/Signup'
import Signin from './Components/Signin'
import Dashboard from './Components/Dashboard'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import TransactionForm from './Components/AddTransacton'
import Budget from './Components/Budget';

const App = () => {
  return (
    <div>
        <Toaster position="top-center" reverseOrder={false} />
   <BrowserRouter>
    <Routes>
          <Route path='/' element={<Signup/>} />
          <Route path='/signin' element={<Signin/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
           <Route path='/addtransaction' element={< TransactionForm/>}/>
           <Route path='/budget' element={<Budget/>} />
          
    </Routes>
    </BrowserRouter>
           
    </div>
  )
}

export default App