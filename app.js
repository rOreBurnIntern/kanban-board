const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage
let tasks = [];
let nextId = 1;

// GET /api/tasks - List all tasks
app.get('/api/tasks', (req, res) => {
    const { search } = req.query;
    if (search) {
        const filtered = tasks.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(filtered);
    }
    res.json(tasks);
});

// GET /api/tasks/:id - Get single task
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

// POST /api/tasks - Create task
app.post('/api/tasks', (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = {
        id: nextId++,
        title,
        description: description || '',
        status: status || 'todo'
    };
    
    tasks.push(task);
    res.status(201).json(task);
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, status } = req.body;
    
    if (title) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
        tasks[taskIndex].status = status;
    }
    
    res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Kanban board running at http://localhost:${PORT}`);
});
