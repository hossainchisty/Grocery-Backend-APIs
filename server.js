var cors = require('cors');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
