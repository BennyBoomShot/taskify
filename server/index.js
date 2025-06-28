const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/boards', require('./routes/board.routes'));
app.use('/api/tasks', require('./routes/task.routes'));

app.get( '/', (req, res) => res.send('API Running'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));