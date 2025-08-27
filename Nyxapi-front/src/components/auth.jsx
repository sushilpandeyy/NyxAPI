import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Auth = () => {
 const [isLogin, setIsLogin] = useState(true);
 const [name, setName] = useState(''); 
 const [email, setEmail] = useState('demo@nyxapi.com');
 const [password, setPassword] = useState('demo123456');
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
   setLoading(true);

   const requestBody = isLogin ? { email, password } : { name, email, password };
   const endpoint = isLogin ? API_ENDPOINTS.USER_LOGIN : API_ENDPOINTS.USER_REGISTER;

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
     console.error('Auth error:', err);
     if (err.response?.status === 401) {
       setError('Invalid email or password');
     } else if (err.response?.status === 409) {
       setError('Account already exists with this email');
     } else if (err.response?.data?.message) {
       setError(err.response.data.message);
     } else {
       setError(isLogin ? 'Sign in failed. Please try again.' : 'Sign up failed. Please try again.');
     }
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="min-h-screen bg-dark-950 flex items-center justify-center relative">
     {/* Background decoration */}
     <div className="absolute inset-0 bg-gradient-to-br from-primary-950/20 via-transparent to-dark-950"></div>
     
     <div className="relative w-full max-w-md p-8">
       {/* Back to home link */}
       <Link 
         to="/" 
         className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
       >
         <ArrowLeft size={16} />
         Back to Home
       </Link>

       <div className="card">
         <div className="text-center mb-8">
           <h1 className="heading-2 mb-2">
             Nyx<span className="text-primary-500">API</span>
           </h1>
           <p className="text-body">
             {isLogin ? 'Welcome back! Sign in to your account.' : 'Create your account to get started.'}
           </p>
         </div>

         {error && (
           <div className="status-error p-4 rounded-lg mb-6">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
           {!isLogin && (
             <div>
               <label className="form-label">Full Name</label>
               <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="form-input"
                 placeholder="Enter your full name"
                 required
               />
             </div>
           )}

           <div>
             <label className="form-label">Email Address</label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="form-input"
               placeholder="Enter your email"
               required
             />
           </div>

           <div>
             <label className="form-label">Password</label>
             <div className="relative">
               <input
                 type={showPassword ? "text" : "password"}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="form-input pr-12"
                 placeholder="Enter your password"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
               >
                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
             </div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="btn-primary w-full flex items-center justify-center gap-2"
           >
             {loading && <div className="spinner"></div>}
             {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
           </button>
         </form>

         <div className="mt-8 pt-6 border-t border-dark-700 text-center">
           <p className="text-body">
             {isLogin ? "Don't have an account? " : 'Already have an account? '}
             <button
               onClick={() => {
                 setIsLogin(!isLogin);
                 setError('');
               }}
               className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
             >
               {isLogin ? 'Create one now' : 'Sign in instead'}
             </button>
           </p>
         </div>

         {/* Demo credentials info */}
         {isLogin && (
           <div className="mt-6 p-4 bg-primary-950/30 rounded-lg border border-primary-700/50">
             <div className="flex items-center justify-between mb-2">
               <p className="text-primary-300 font-medium">Demo Account</p>
               <button
                 type="button"
                 onClick={() => {
                   setEmail('demo@nyxapi.com');
                   setPassword('demo123456');
                 }}
                 className="text-xs px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
               >
                 Quick Fill
               </button>
             </div>
             <p className="text-dark-300 text-sm">
               Email: <code className="bg-dark-700 px-2 py-1 rounded">demo@nyxapi.com</code><br />
               Password: <code className="bg-dark-700 px-2 py-1 rounded">demo123456</code>
             </p>
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default Auth;