const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', filter = 'All', priority = 'All', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = { userId: req.user.id };

    // Filter by status
    if (filter !== 'All') {
      query.status = filter;
    }

    // Filter by priority
    if (priority !== 'All') {
      query.priority = priority;
    }

    // Search
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Sorting logic
    const sortParams = {};
    if (sortBy === 'dueDate') {
      sortParams.dueDate = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'priority') {
      // Priority sorting is tricky with enums, but we can do it client-side or stick to simple sorting. 
      // Let's stick to createdAt or dueDate for DB sort.
      sortParams.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'order') {
      sortParams.order = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortParams.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const tasks = await Task.find(query)
      .sort(sortParams)
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Assign an order value (put at the end of 'To Do' column)
    const lastTask = await Task.findOne({ userId: req.user.id, status: 'To Do' }).sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      subtasks: subtasks || [],
      userId: req.user.id,
      status: 'To Do',
      order: newOrder
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Toggle between 'Completed' and 'To Do'
    if (task.status !== 'Completed') {
      task.status = 'Completed';
    } else {
      task.status = 'To Do';
    }
    
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
