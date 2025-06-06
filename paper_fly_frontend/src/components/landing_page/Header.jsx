import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="backdrop-blur-md bg-slate-900/70 text-white sticky top-0 z-50 border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Ajith Hotel
          </h1>
        </div>
        <button className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        <nav className="hidden md:flex space-x-8 text-lg">
          {['Home', 'Menu', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="relative text-gray-300 hover:text-white transition-colors group">
              {item}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </a>)}
        </nav>
        {isMenuOpen && <div className="absolute top-full left-0 right-0 backdrop-blur-md bg-slate-900/90 p-4 md:hidden border-b border-purple-500/20">
            <nav className="flex flex-col space-y-4">
              {['Home', 'Menu', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-cyan-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item}
                </a>)}
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;