const express = require('express');
const app = express();
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// serve swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fake DB (in-memory)
let users = [
  { id: 1, name: "Alice", kidneys: [{ healthy: true }, { healthy: false }] },
  { id: 2, name: "Bob", kidneys: [{ healthy: true }, { healthy: true }] }
];

// ----------------------------------------------------
// Routes with Swagger Docs
// ----------------------------------------------------

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users with kidneys
 */
app.get('/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add a kidney to a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               healthy:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Kidney added successfully
 */
app.post('/add', (req, res) => {
  const { userId, healthy } = req.body;
  if (typeof healthy !== 'boolean') {
    return res.status(400).json({ message: "healthy must be boolean" });
  }
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.kidneys.push({ healthy });
  res.status(201).json({ message: "Kidney added", user });
});

/**
 * @swagger
 * /donate:
 *   post:
 *     summary: Donate a kidney from one user to another
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorId:
 *                 type: integer
 *               recipientId:
 *                 type: integer
 *               healthy:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Donation successful
 */
app.post('/donate', (req, res) => {
  const { donorId, recipientId, healthy } = req.body;
  const donor = users.find(u => u.id === donorId);
  const recipient = users.find(u => u.id === recipientId);

  if (!donor || !recipient) return res.status(404).json({ message: "Donor or recipient not found" });
  if (donor.kidneys.length === 0) return res.status(400).json({ message: "Donor has no kidneys left" });

  donor.kidneys.pop();
  recipient.kidneys.push({ healthy });
  res.status(201).json({ message: "Donation successful", donor, recipient });
});

/**
 * @swagger
 * /replace:
 *   put:
 *     summary: Replace all kidneys of a user with healthy ones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: All kidneys replaced
 */
app.put('/replace', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.kidneys = user.kidneys.map(() => ({ healthy: true }));
  res.status(200).json({ message: "All kidneys replaced", user });
});

/**
 * @swagger
 * /remove:
 *   delete:
 *     summary: Remove one kidney from a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kidney removed
 */
app.delete('/remove', (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.kidneys.length === 0) return res.status(400).json({ message: "User has no kidneys left" });

  user.kidneys.pop();
  res.status(200).json({ message: "Kidney removed", user });
});

// ----------------------------------------------------
app.listen(3000, () => {
  console.log("🏥 Hospital API running at http://localhost:3000");
  console.log("📘 Swagger docs at http://localhost:3000/api-docs");
});