import { CheckCircle, Circle, Trash2, Edit2, Calendar, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isPast, isToday } from 'date-fns';

const TaskCard = ({ task, onToggle, onDelete, onEdit, isKanban = false }) => {
  const isCompleted = task.status === 'Completed';

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDueDateColor = (date) => {
    if (!date) return 'text-gray-500';
    if (isCompleted) return 'text-gray-400';
    if (isPast(new Date(date)) && !isToday(new Date(date))) return 'text-red-600 font-medium';
    if (isToday(new Date(date))) return 'text-amber-600 font-medium';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      initial={!isKanban ? { opacity: 0, y: 15 } : false}
      animate={!isKanban ? { opacity: 1, y: 0 } : false}
      exit={!isKanban ? { opacity: 0, scale: 0.95 } : false}
      transition={{ duration: 0.3 }}
      layout={!isKanban}
      className={`p-4 rounded-xl transition-colors transition-shadow duration-200 bg-white shadow-sm hover:shadow border-y border-r border-gray-200 ${isCompleted ? 'opacity-60 grayscale border-l border-l-gray-300' : 
        task.priority === 'High' ? 'border-l-[4px] border-l-red-500' :
        task.priority === 'Low' ? 'border-l-[4px] border-l-blue-500' :
        'border-l-[4px] border-l-amber-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={() => onToggle(task._id)}
          className={`flex-shrink-0 mt-1 transition-colors ${isCompleted ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
        >
          {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
        </button>
        
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
            <h3 className={`text-lg font-semibold truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-slate-900'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3" />
                {task.priority || 'Medium'}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-gray-400' : 'text-slate-600'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {task.dueDate && (
                <div className={`flex items-center gap-1.5 text-xs ${getDueDateColor(task.dueDate)}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDelete(task._id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
