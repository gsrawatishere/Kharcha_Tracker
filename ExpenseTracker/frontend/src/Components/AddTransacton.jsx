import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TransactionForm = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
   const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/api/v1/user/transaction',
        {
          title,
          amount: Number(amount),
          type
        },
        {
          headers: {
            authorization: localStorage.getItem('token')
          }
        }
      );

      if(res.status==200){
        toast.success('Transaction Success!');
        navigate("/dashboard")
      }
      

      setTitle('');
      setAmount('');
      setType('expense');
    } catch (err) {
      const message = err?.response?.data?.msg || 'Error adding transaction';
      toast.error(message);
    }
  };

  return (
     <div className='h-full p-10'>
       <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow ">
      
      <div className='flex justify-between'>
      <h2 className="text-xl font-bold mb-4 text-center">Add New Transaction</h2>
      <button
        onClick={() => navigate('/dashboard')}
        className=" text-gray-500 hover:bg-slate-100 hover:p-1 hover:rounded-full text-xl font-bold"
      >
        ✖
      </button>
      </div>
      
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="e.g. Grocery"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Transaction
        </button>
      </form>
    </div>
     </div>
  );
};

export default TransactionForm;