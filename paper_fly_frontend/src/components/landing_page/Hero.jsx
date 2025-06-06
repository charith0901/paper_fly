import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-[70vh] bg-cover bg-center flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1606491048802-8342506d6471?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
      <div className="container mx-auto px-4 text-center relative">
        <div className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-lg max-w-2xl mx-auto border border-white/10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Future of Sri Lankan Cuisine
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience traditional flavors reimagined through modern culinary
            innovation
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Explore Menu
            </a>
            <Link
              to="/newspapers"
              className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Explore Paper Fly
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;