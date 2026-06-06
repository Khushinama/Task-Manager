import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onDragEnd, onToggle, onDelete, onEdit }) => {
  const columns = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed'),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-6 items-start h-full pb-8">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="flex-1 w-full md:w-1/3 min-w-[300px]">
            <div className="bg-slate-50 rounded-2xl p-5 flex flex-col h-full border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  {columnId === 'To Do' && <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>}
                  {columnId === 'In Progress' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>}
                  {columnId === 'Completed' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>}
                  {columnId}
                </h3>
                <span className="bg-white text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  {columnTasks.length}
                </span>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 min-h-[500px] transition-colors rounded-xl p-1 ${snapshot.isDraggingOver ? 'bg-slate-200/50 border border-dashed border-gray-300' : ''}`}
                  >
                    <div className="space-y-3">
                      {columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <TaskCard 
                                task={task} 
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                isKanban={true}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
