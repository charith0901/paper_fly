import React from 'react';
const foods = [{
  name: 'Kottu',
  description: 'A spicy dish made with chopped roti, vegetables, egg and your choice of meat',
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Chicken_Kottu.jpg/800px-Chicken_Kottu.jpg'
}, {
  name: 'Fried Rice',
  description: 'Sri Lankan style fried rice with vegetables and your choice of chicken, seafood or vegetarian',
  image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}, {
  name: 'Hoppers',
  description: 'Bowl-shaped pancakes made from fermented rice flour, traditionally served with sambal',
  image: 'https://www.hungrylankan.com/wp-content/uploads/2024/06/PXL_20230907_022830223.PORTRAIT-2-768x1024.jpg.webp'
}, {
  name: 'String Hoppers',
  description: 'Steamed rice noodles pressed into flat spirals, served with curry and coconut sambal',
  image: 'https://harischandramills.com/wp-content/uploads/2018/06/3-2.jpg'
}];
const FoodMenu = () => {
  return <section id="menu" className="py-16 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Our Specialties
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Discover our authentic Sri Lankan dishes, reimagined with modern
            culinary techniques
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {foods.map((food, index) => <div key={index} className="group backdrop-blur-sm bg-slate-800/50 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="h-60 overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  {food.name}
                </h3>
                <p className="text-gray-300">{food.description}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};

export default FoodMenu;