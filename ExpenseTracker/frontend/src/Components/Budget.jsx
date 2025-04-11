import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Budget() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Crediting amount...");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/budget",
        { amount: Number(amount) },
        {
          headers: {
            authorization: localStorage.getItem("token")
          },
        }
      );
      toast.success(res.data.msg || "Amount Credited!", { id: loadingToast });
      setAmount("");
    } catch (err) {
      const errors = err?.response?.data?.errors;
      toast.error(errors ? errors.join(", ") : "Something went wrong!", { id: loadingToast });
    }
  };

  return (
<div className="p-12" >
<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl">
    <div className="flex justify-between mb-4 " >
    <h2 className="text-xl font-semibold text-center">Add Budget</h2>
      <button
        onClick={() => navigate('/dashboard')}
        className=" text-gray-500 hover:bg-slate-100 hover:p-1 hover:rounded-full text-xl font-bold"
      >
        ✖
      </button>
    </div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Credit Amount
        </button>
      </form>
    </div>
</div>
  );
}