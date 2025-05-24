import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">PaperFly</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-green-500 border-b-2 border-green-500 font-semibold">Home</Link>
              <Link href="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">About</Link>
              <Link href="/services" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Services</Link>
              <Link href="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Contact</Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-gray-500 hover:text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={isOpen ? "mobile-menu md:hidden" : "hidden mobile-menu"}>
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <li><Link href="/" className="block py-2 px-4 text-sm text-green-500 font-semibold">Home</Link></li>
          <li><Link href="/about" className="block py-2 px-4 text-sm text-gray-500 hover:text-green-500">About</Link></li>
          <li><Link href="/services" className="block py-2 px-4 text-sm text-gray-500 hover:text-green-500">Services</Link></li>
          <li><Link href="/contact" className="block py-2 px-4 text-sm text-gray-500 hover:text-green-500">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
