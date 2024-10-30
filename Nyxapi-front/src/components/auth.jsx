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
      const requestBody = isLogin
        ? { email, password }
        : { name, email, password };

      const endpoint = isLogin
        ? 'https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/users/authenticate/'
        : 'https://afmtaryv91.execute-api.ap-south-1.amazonaws.com/users/';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative p-1 bg-transparent rounded-lg shadow-lg">
        <div className="absolute inset-0 "></div>
        <div className="relative grid w-full max-w-5xl grid-cols-1 p-10 mx-4 bg-gray-800 border border-transparent rounded-lg bg-opacity-60 backdrop-blur-lg md:grid-cols-2">
          <div className="flex items-center justify-center bg-fixed">
            <div className="bg-white bg-opacity-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[0.5px] rounded-lg border border-white border-opacity-20 h-[400px] w-[550px] flex flex-col justify-center items-center">
              <h1 className="p-6 px-10 mb-4 text-3xl font-semibold text-center text-white">
                Maximize your productivity with NyxAPI
              </h1>
              <p className="text-lg text-center text-gray-300">
                Use our powerful API platform to supercharge your daily workflows and achieve more.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-10">
            <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}

              {!isLogin && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isLogin ? 'Login' : 'Sign up'}
              </button>
            </form>

            <div className="w-full max-w-md mt-6 space-y-4">
              <button className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google logo"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </button>
              <button className="flex items-center justify-center w-full px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800">
                <img
                  src="https://iconscout.com/icons/github"
                  alt="GitHub logo"
                  className="w-5 h-5 mr-2"
                />
                Continue with GitHub
              </button>
            </div>

            <p className="mt-4 text-center text-white">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
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
    </div>
  );
};

export default Auth;
