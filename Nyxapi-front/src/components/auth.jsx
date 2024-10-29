import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const requestBody = isLogin ? { email, password } : { name, email, password };
      const endpoint = isLogin ? 'http://api.nyxapi.com/users/authenticate/' : 'http://api.nyxapi.com/users/';
      const response = await axios.post(endpoint, requestBody);

      if (response.data && response.data.user) {
        const { access_token, user } = response.data.user;
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(isLogin ? 'Login failed. Please check your credentials and try again.' : 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative p-1 bg-transparent rounded-lg shadow-lg">
        <div className="relative w-full max-w-lg p-8 mx-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl bg-opacity-70 backdrop-blur-md">
          <h1 className="mb-6 text-3xl font-semibold text-center text-gray-100">Welcome to NyxAPI</h1>

          {error && <p className="text-center text-red-500">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Login' : 'Sign up'}
            </button>
          </form>

          <div className="w-full mt-6 space-y-4">
            <button className="flex items-center justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub logo"
                className="w-5 h-5 mr-2"
              />
              Continue with GitHub
            </button>
          </div>

          <p className="mt-4 text-center text-gray-400">
            {isLogin ? (
              <>
                Don’t have an account?{' '}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-400 cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-400 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
