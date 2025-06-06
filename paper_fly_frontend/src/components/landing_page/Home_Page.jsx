import Header from './Header';
import Hero from './Hero';
import FoodMenu from './FoodMenu';
import ContactInfo from './ContactInfo';
import Footer from './Footer';

const HomePage = () => {
    return (
        <div className="font-sans bg-slate-900 min-h-screen text-white">
            <div className="fixed inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <Header />
            <main>
                <Hero />
                <FoodMenu />
                <ContactInfo />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;