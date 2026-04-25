import React, { useEffect, useRef, useState } from 'react';
import LogoWhite from './assets/NewLogo.png';
import Login from './Users.jsx';

const Navbar = ({ inputUser, user, onUserInputChange, onLoginClick, onUserID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <nav className="ml-[calc(50%-50vw)] w-screen bg-[#390e59] px-4 py-5 md:px-6 border-b-2 border-[#FFFFFF]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <a href="/" className="inline-flex items-center -ml-30" aria-label="Home">
          <img src={LogoWhite} alt="TourFinder logo" className="h-16 w-auto md:h-20" />
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-lg border border-[#8694ff] bg-[#CF68E8] px-6 py-3 text-base font-semibold text-[#e4e8ff] hover:border-white"
            aria-expanded={isOpen}
            aria-controls="navbar-login-panel"
          >
            Account
          </button>

          {isOpen && (
            <div
              id="navbar-login-panel"
              className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-[#FFFFFF] bg-[#390E59] p-4 text-left shadow-2xl"
            >
              <h3 className="mb-2 text-base font-semibold text-[#FFFFFF]">Login</h3>
              <div className="flex gap-2">
                <input
                  id="user"
                  name="user"
                  type="text"
                  value={inputUser}
                  onChange={onUserInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onLoginClick?.();
                    }
                  }}
                  className="w-full rounded-lg border border-[#FFFFFF] bg-[#141b48] px-3 py-2 text-sm text-white placeholder-[#90a0ff] outline-none focus:border-[#aeb8ff]"
                  placeholder="Username"
                />
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="rounded-lg bg-[#cf68e8] px-3 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:border-white"
                >
                  Login
                </button>
              </div>

              <div className="mt-3 rounded-lg border border-[#FFFFFF] bg-[#141e56] p-3">
                <Login inputUser={user} onUserID={onUserID} />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;