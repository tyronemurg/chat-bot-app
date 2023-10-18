const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
//const OpenAI = require('openai');
const ChatMessage = require('./models/ChatMessage'); 
const app = express();
const port = 3000;

// const openai = new OpenAI({
//     apiKey: 'your_key', // Replace with your actual API key
//   });


mongoose.connect('mongodb://localhost:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// const responses = {
//     'javascript': 'JavaScript is a high-level, interpreted programming language that is widely used for building web applications.',
//     'python': 'Python is an interpreted, high-level, general-purpose programming language known for its readability and versatility.',
//     'java': 'Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.',
//     'typescript': 'TypeScript is a strict syntactical superset of JavaScript that adds optional static typing.',
//     'ruby': 'Ruby is an interpreted, high-level, general-purpose programming language known for its simplicity and productivity.',
//     'c#': 'C# is a modern, general-purpose programming language developed by Microsoft. It is widely used for building Windows applications.',
//     // Add more responses based on programming languages...
//
//   };

app.post('/api/chatgpt', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful knowledge base.' },
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer your_key', // Replace with your actual API key
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content;

    // Save messages to MongoDB
    const newMessage = new ChatMessage({ content: userMessage, role: 'user' });
    const botReply = new ChatMessage({ content: botMessage, role: 'bot' });
    await Promise.all([newMessage.save(), botReply.save()]);

    res.json({ message: botMessage });
  } catch (error) {
    console.error(error);
    res.json({ message: "I'm sorry, I couldn't retrieve any information at the moment." });
  }
});
 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
