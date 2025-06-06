const Footer = () => {
  return <footer className="bg-slate-900 border-t border-purple-500/20 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Ajith Hotel
          </h3>
          <p className="text-gray-300 mb-4">Future of Sri Lankan Cuisine</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Ajith Hotel. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Made with ❤️ by <a href="https://github.com/Charith0901" target='_blank' className='text-purple-500'>Charith Jayasankha</a>
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;