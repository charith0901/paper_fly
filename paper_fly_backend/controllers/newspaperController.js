import NewsPaper from '../models/NewsPaper.js';

// Get all newspapers
export const getAllNewspapers = async (req, res) => {
  try {
    const newspapers = await NewsPaper.findAll();
    res.status(200).json(newspapers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch newspapers", error: error.message });
  }
};

// Add a new newspaper
export const addNewspaper = async (req, res) => {
  try {
    const { newspaper_name, type, price } = req.body;
    
    const newNewspaper = await NewsPaper.create({
      newspaper_name,
      type,
      price
    });
    
    res.status(201).json(newNewspaper);
  } catch (error) {
    res.status(400).json({ message: "Failed to add newspaper", error: error.message });
  }
};

// Update newspaper price
export const updateNewspaperPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    const newspaper = await NewsPaper.findByPk(id);
    
    if (!newspaper) {
      return res.status(404).json({ message: "Newspaper not found" });
    }
    
    newspaper.price = price;
    await newspaper.save();
    
    res.status(200).json(newspaper);
  } catch (error) {
    res.status(400).json({ message: "Failed to update newspaper price", error: error.message });
  }
};

// Delete newspaper
export const deleteNewspaper = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newspaper = await NewsPaper.findByPk(id);
    
    if (!newspaper) {
      return res.status(404).json({ message: "Newspaper not found" });
    }
    
    await newspaper.destroy();
    
    res.status(200).json({ message: "Newspaper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete newspaper", error: error.message });
  }
};
