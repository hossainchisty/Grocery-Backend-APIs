const { Sequelize } = require('sequelize');
const { Product } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  if (!req.body.name) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  try {
    const newProduct = await Product.create({ name, price, quantity });
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    await product.update({ name, price, quantity });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter is required for searching products.' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${query}%`,
        },
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found matching the search criteria.' });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const filterProductsByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    if (!minPrice || !maxPrice || isNaN(minPrice) || isNaN(maxPrice)) {
      return res
        .status(400)
        .json({ error: 'Invalid or missing price range parameters.' });
    }

    const products = await Product.findAll({
      where: {
        price: {
          [Sequelize.Op.between]: [minPrice, maxPrice],
        },
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({
          message: 'No products found within the specified price range.',
        });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProductsByPrice,
};
