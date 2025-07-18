import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ auth, logout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          CarbonTracker
        </Link>
        <div>
          {auth.isAuthenticated ? (
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-800 hover:text-green-600">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;