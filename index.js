require('dotenv').config();

const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

webpush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

// subscribe route
app.post('/subscribe', (req, res) => {
  // get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: 'Push test' });

  // Pass the object into sendNotification function
  webpush
    .sendNotification(subscription, payload)
    .catch((e) => console.error(e));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
