import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { SERVER_URL } from '../constants'

const Dashboard = () => {
  return (
    <div>
        <div>
               <Header/>
               <Balance/>
               <InEx/>
               <TransactionBox/>
              
        </div>
    </div>
  )
}

export default Dashboard




const Header = () => {
    const navigate = useNavigate()
     const handlelogout = ()=>{
        localStorage.removeItem("token")
        navigate("/signin")
     }
  return (
    <div>
        <div className='flex justify-between px-2 shadow-xs py-3'>
             <div className='font-semibold' ><img className="w-10 h-10 inline  " src="https://i.pinimg.com/736x/84/b4/a3/84b4a39b4cb1c2a9ab754406e56ef76a.jpg" alt="logo"/>KharchaTracker</div>
             <div className='flex' >
             <div className='text-l font-semibold mx-3' >Hello, User</div>
             <div><button onClick={handlelogout} className='bg-slate-200 rounded-lg px-2 py-0.5 hover:bg-red-300'>Log out</button></div>
             </div>
             
        </div>
    </div>
  )
}

const Balance =() =>{
    const [balance, setBalance] = useState("")
    const navigate = useNavigate();
   
   useEffect(()=>{
            async function fetchbalance() {
                const response = await axios.get(SERVER_URL+"/api/v1/user/amountdetails",{
                    headers : {
                        authorization : localStorage.getItem("token")
                    }
                })
                setBalance(response.data.amount) 
            }
            fetchbalance()
   },[])

    return(
        <div className='border border-slate-100 shadow-xs m-4 rounded-xl'>
              <div className='flex flex-col items-center justify-center bg-slate-50 w-full h-[150px]'>
                <div className='text-l text-slate-700' >Total Balance</div>
                <div className='text-4xl font-bold pt-3'>₹{balance}</div>
                 <div onClick={()=>{navigate('/budget')}} className='pt-2'><button className='bg-green-400 hover:bg-green-500 text-white text-sm font-medium rounded px-2 py-1 border-none'>
                       Add Budget
                     </button></div>    
              </div>
        </div>
    )
}

const InEx = ()=>{
    const [income, setIncome] = useState("")
    const [expense, setExpense] = useState("")

    useEffect(()=>{
        async function fetchbalance() {
            const response = await axios.get("http://localhost:4000/api/v1/user/amountdetails",{
                headers : {
                    authorization : localStorage.getItem("token")
                }
            })
            setIncome(response.data.income)
            setExpense(response.data.expense)
            
        }
        fetchbalance()
},[])


    return(
        <div className='flex w-full px-3'>
        <div className='border border-slate-100 shadow-xs m-2 rounded-xl w-full'>
        <div className='flex flex-col items-center justify-center bg-slate-50 w-full h-[150px]'>
    
          <div> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 bg-green-300 rounded-full p-2 h-12 w-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>
          </div> 
          <div className='text-l text-slate-700' >Income</div>
          <div className='text-3xl font-bold pt-2'>₹{income}</div>

        </div>
  </div>
  <div className='border border-slate-100 shadow-xs m-2 rounded-xl w-full'>
        <div className='flex flex-col items-center justify-center bg-slate-50 w-full h-[150px]'>
    
          <div> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" bg-red-300 rounded-full p-2 h-12 w-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
</svg>

          </div> 
          <div className='text-l text-slate-700' >Expense</div>
          <div className='text-3xl font-bold pt-2'>₹{expense}</div>

        </div>
  </div>

  </div>
    )
}

const TransactionBox = ()=>{
    const [transaction,setTransaction] = useState([])
   const navigate = useNavigate();
  
    useEffect(()=>{
            async function transactions(){
                const response = await axios.get("http://localhost:4000/api/v1/user/alltransactions",{
                    headers : {
                           authorization : localStorage.getItem("token")
                    } 
                })
                console.log(response.data)
                setTransaction(response.data.data)
            }
            transactions()
    },[])
  

    return (
        <div>
              <div className=' h-screen flex flex-col ' >
                    <div className='p-2'> 
                         <div className='text-xl font-bold'>Transactions</div>
                    </div>

                    
                <div className=' flex-grow overflow-y-auto px-4 space-y-2' >
                {transaction.map((t,index) => <Transactions t={t} key={index}/>)}
                </div >
                
                <div className='text-center'>
                <button onClick={()=>{navigate("/addtransaction")}} type="button" class="fixed bottom-12 left-1/2 text-white text-center bg-green-700 rounded-full text-3xl h-12 w-12 focus:outline-none hover:bg-green-500">+</button>

                </div>
                  
              </div>
        </div>
    )
}

const Transactions = ({t})=>{

    return (
       <div className='px-3 py-1'>
         <div className='flex justify-between px-5 py-2 rounded-2xl shadow-sm bg-blue-50' >
             <div>
                   <div className='font-bold text-lg'>{t.title}</div>
                   <div className='text-slate-600 text-xs'>{new Date(t.date).toLocaleString()}</div>
             </div>
             <div>
             <div className={ `px-2 text-xs uppercase ${t.type === "expense" ? 'text-red-400' : 'text-green-400'}`}>
            {t.type}
          </div>
                     <div className='font-semibold text-lg'>
                       {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                     </div>
             </div>
        </div>
       </div>
    )
}