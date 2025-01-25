import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
 const [isLogin, setIsLogin] = useState(true);
 const [name, setName] = useState(''); 
 const [email, setEmail] = useState('demo0@demo.com');
 const [password, setPassword] = useState('demo');
 const [error, setError] = useState('');
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');

   const requestBody = isLogin ? { email, password } : { name, email, password };
   const endpoint = isLogin
     ? 'https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/users/authenticate/'
     : 'https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/users/';

   try {
     const response = await axios.post(endpoint, requestBody, {
       headers: { 'Content-Type': 'application/json' },
     });

     if (response.data?.user) {
       sessionStorage.setItem('user', JSON.stringify(response.data.user.user));
       navigate('/dashboard');
     } else {
       setError('Authentication failed');
     }
   } catch (err) {
     setError(isLogin ? 'Invalid credentials' : 'Sign up failed');
   }
 };

 return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
     <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
       <h1 className="text-4xl font-bold text-center text-white mb-8">NyxAPI</h1>

       {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded">{error}</div>}

       <form onSubmit={handleSubmit} className="space-y-5">
         {!isLogin && (
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
               required
             />
           </div>
         )}

         <div>
           <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
             required
           />
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
             required
           />
         </div>

         <button
           type="submit"
           className="w-full py-3 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
         >
           {isLogin ? 'Sign In' : 'Create Account'}
         </button>
       </form>

       <p className="text-center text-gray-400">
         {isLogin ? 'New to NyxAPI? ' : 'Already have an account? '}
         <button
           onClick={() => setIsLogin(!isLogin)}
           className="text-indigo-400 hover:text-indigo-300 font-medium"
         >
           {isLogin ? 'Create Account' : 'Sign In'}
         </button>
       </p>
     </div>
   </div>
 );
};

export default Auth;