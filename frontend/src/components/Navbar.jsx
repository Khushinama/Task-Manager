import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckCircle2 } from 'lucide-react'; // Let's use lucide-react for icons

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <CheckCircle2 className="h-6 w-6 text-slate-900" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">TaskFlow</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:block text-sm font-medium text-slate-200 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800 font-medium"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
