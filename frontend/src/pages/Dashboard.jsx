import { useState, useEffect, useCallback } from 'react';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import KanbanBoard from '../components/KanbanBoard';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
  
  // Filters & Pagination state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce just the search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const limitToFetch = viewMode === 'board' ? 50 : 5;
      const res = await api.get('/tasks', {
        params: { page, limit: limitToFetch, search: debouncedSearch, filter }
      });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filter, viewMode]);

  // Single effect to trigger fetch when dependencies change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdateTask = async (taskData) => {
    const isEdit = !!taskData._id;
    const toastId = toast.loading(isEdit ? 'Updating task...' : 'Creating task...');
    try {
      if (isEdit) {
        const res = await api.put(`/tasks/${taskData._id}`, taskData);
        setTasks(tasks.map(t => t._id === taskData._id ? res.data : t));
        toast.success('Task updated successfully', { id: toastId });
      } else {
        const res = await api.post('/tasks', taskData);
        setTasks([res.data, ...tasks]);
        toast.success('Task created successfully', { id: toastId });
        if (page !== 1) setPage(1);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed', { id: toastId });
    }
  };

  const handleDeleteTask = (id) => {
    setTaskToDelete(id);
  };

  const executeDeleteTask = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete;
    const toastId = toast.loading('Deleting task...');
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted successfully', { id: toastId });
      
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to delete task', { id: toastId });
    }
    setTaskToDelete(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
      
      // Optimistic update
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
      
      await api.patch(`/tasks/${id}/status`);
      
      if (filter !== 'All') {
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to update task status');
      fetchTasks(); // revert
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId;
      
      // Optimistic UI update
      setTasks(tasks.map(t => 
        t._id === draggableId ? { ...t, status: newStatus } : t
      ));

      try {
        await api.put(`/tasks/${draggableId}`, { status: newStatus });
      } catch (error) {
        toast.error('Failed to update task status');
        fetchTasks(); // Revert on fail
      }
    }
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track your daily activities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <Filters 
                  search={search} 
                  onSearchChange={(val) => { setSearch(val); setPage(1); }} 
                  filter={filter} 
                  onFilterChange={(val) => { setFilter(val); setPage(1); }} 
                />

                {loading && tasks.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className={`space-y-4 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    <AnimatePresence mode="popLayout">
                      {tasks.map(task => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onToggle={handleToggleStatus}
                          onDelete={handleDeleteTask}
                          onEdit={openEditForm}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
                      <LayoutList className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      {search || filter !== 'All' 
                        ? "Try adjusting your search or filters to find what you're looking for." 
                        : "You have a clean slate! Get started by creating a new task."}
                    </p>
                  </div>
                )}
              </div>
              
              {!loading && tasks.length > 0 && <Pagination pagination={pagination} onPageChange={setPage} />}
            </motion.div>
          ) : (
            <motion.div
              key="board-view"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {loading && tasks.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : tasks.length > 0 ? (
                <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                  <KanbanBoard 
                    tasks={tasks}
                    onDragEnd={handleDragEnd}
                    onToggle={handleToggleStatus}
                    onDelete={handleDeleteTask}
                    onEdit={openEditForm}
                  />
                </div>
              ) : (
                <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
                    <LayoutGrid className="w-10 h-10 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {search || filter !== 'All' 
                      ? "Try adjusting your search or filters to find what you're looking for." 
                      : "You have a clean slate! Get started by creating a new task."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={executeDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isDanger={true}
      />
    </div>
  );
};

export default Dashboard;
