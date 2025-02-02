const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`📡 [${req.method}] ${req.url} - Body:`, req.body);
    next();
  });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  description: String
});

const Event = mongoose.model('Event', EventSchema);

// Routes CRUD
app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/events', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

app.put('/events/:id', async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedEvent);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));