const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/admin', adminRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/excel', require('./routes/fileRoutes')); //? this is we use regularly
// app.use('/api/upload', require('./routes/uploadRoutes'));//! this is also temporary
app.use('/api/excel', require('./routes/uploadRoutes'));//! this is temporary
app.use('/api/insight', require('./routes/insightRoutes'));


mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});