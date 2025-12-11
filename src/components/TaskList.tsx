import { useState, useEffect } from "react";
import { apiClient } from "../clients/api";

// Define Task interface here
interface Task {
  _id: string;
  title: string;
  description?: string;
  projectId: string;
  status: string; // "To Do", "In Progress", "Done"
}

interface TaskListProps {
  projectId: string;
}

function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [editedTaskStatus, setEditedTaskStatus] = useState("To Do");


  // GET - Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/projects/${projectId}/tasks`);
        setTasks(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // POST - Create new task
  const handleAddTask = async () => {
    // if there is no title filled->alert
    if (!newTaskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      // loading = a state variable(line19)
      // setLoading = the function that updates that state(line19)
      setLoading(true); //start the loading spinner(we are loading something)
      const res = await apiClient.post(`/api/projects/${projectId}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
      });
      setTasks([...tasks, res.data]); //makes new array: **tasks(old array)** + **res.data(the task you just created (from backend))**
      setNewTaskTitle(""); //after saving, the input becomes empty again
      setNewTaskDescription(""); //clears the description input
      setShowAddTask(false); //done adding, hide the form
      setError(""); //clears any error message you were showing
    } catch (error) {
      console.error(error);
      setError("Failed to create task");
    } finally {
      setLoading(false); //stop the spinner(Loading finished)
    }
  };

  // PUT - start editing task
  const handleEditTask = (task: Task) => {
    // when you click edit, show the exiting task values in the input field
    setEditingTaskId(task._id); //if true->show editing inputs
    setEditedTaskTitle(task.title); //load the current title into the text field-user ees the title already wrote
    setEditedTaskDescription(task.description || ""); //load the current description into the edit form
    setEditedTaskStatus(task.status || "To Do");
  };

  // PUT Cancel editing
  //stop showing the edit form
  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditedTaskTitle("");
    setEditedTaskDescription("");
  };

  // PUT - Save edited task
  const handleSaveTaskEdit = async (taskId: string) => {
    if (!editedTaskTitle.trim()) {
      //if nothing type-> alert
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true); //start loading
      const res = await apiClient.put(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          title: editedTaskTitle,
          description: editedTaskDescription,
           status: editedTaskStatus,
        }
      );

      // Go through every task. If this is the task I just edited, replace it with the updated version. Otherwise keep it. Then close edit mode and clear errors.”
      // only the task edited will replace and other tasks are remain same
      //map tasks array and creating new array. if task matches the one you are editing replace it, if not keep it as is
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t))); //t._id === taskId(task we just crated) ***if task's id === edited task ID, replace it with res.data***  . ---res.data(new updated task returned from your backend(afterPUT)---(t)->original task
      setEditingTaskId(null); //done with editing--shows normal view again
      setError(""); //clear any error message form before
    } catch (error) {
      console.error(error);
      setError("Failed to update task");
    } finally {
      setLoading(false); //stop loading
    }
  };

  // DELETE - DELETE task
  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true); //start loading
      await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId)); //filter the ids does not match
      setError(""); //clear any error message from before
    } catch (error) {
      console.error(error);
      setError("Failed to delete task");
    } finally {
      setLoading(false); //stop loading
    }
  };

  return (
    <div className="mt-10 border-t border-gray-700 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl text-white">Tasks</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          // If showAddTask is true, then !showAddTask becomes false
          // If showAddTask is false, then !showAddTask becomes true
          // It flips value(true-form open, false->form close)
          onClick={() => setShowAddTask(!showAddTask)}
        >
          {/* if showAddTask is true, display "Cancel", if false, display "+ Add Task" */}
          {showAddTask ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Add Task Form */}
      {showAddTask && (
        <div className="bg-gray-800 p-4 rounded mb-4">
          <input
            className="text-white border-2 border-gray-400 p-2 rounded w-full mb-3"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            // The user can start typing without clicking
            autoFocus
          />

          <select
            className="text-white border-2 border-gray-400 p-2 rounded w-full mb-3"
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <textarea
            className="text-white border-2 border-gray-400 p-2 rounded w-full mb-3 min-h-[80px]"
            //value shows the current state in the input/whatever is inside newTaskDescription appears in the text box
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
          />

          <select
            className="text-white border-2 border-gray-400 p-2 rounded w-full mb-3"
            value={editedTaskStatus}
            onChange={(e) => setEditedTaskStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <div className="flex gap-2">
            <button
              className="bg-blue-600 hover:bg-blue-70 text-white px-4 py-2 rounded transition"
              onClick={handleAddTask}
              // If loading is true → the button becomes disabled(unclickable)/shows "Creating..."/user can not click again(prevent multiple submission)
              // If loading is false → the button becomes active(clickable)/shows "Create Task"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
            <button
              // transition = “Make changes happen smoothly instead of instantly.
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {/* loading must be true/ tasks.length === 0 must be true*/}
      {/* ?: (ternary operator) if the condition before ? is true, render the first part, if else, render the 2nd part ? ():()*/}
      {/* if loading is true and tasks is empty, show loading message */}
      {loading && tasks.length === 0 ? (
        <div className="text-xl text-gray-400">Loading tasks</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No tasks yet. Click "+ Add Task" to create one!"
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 p-4 rounded hover:bg-gray-750 transition"
            >
              {editingTaskId === task._id ? (
                // Edit mode
                <div>
                  <input
                    className="text-white border-2 border-gray-400 p-2 rounded w-full mb-2"
                    type="text" //type is text
                    value={editedTaskTitle}
                    onChange={(e) => setEditedTaskTitle(e.target.value)}
                    placeholder="Task Title"
                  />
                  <textarea
                    className="text-white border-2 border-gray-400 p-2 rounded w-full mb-3 min-h-[80px]"
                    value={editedTaskDescription}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                    placeholder="Task description"
                  />

                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
                      onClick={() => handleSaveTaskEdit(task._id)}
                      disabled={loading} // If loading is true → the button becomes disabled(unclickable)
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
                      onClick={handleCancelTaskEdit}
                      disabled={loading} // If loading is true → the button becomes disabled(unclickable)
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                //  View mode
                <div className="flex justify-between items-start">
                  <div className="text-white flex-1">
                    <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                    <span className="text-sm px-2 py-1 rounded bg-gray-700 text-green-300 block w-fit mb-2">
    {task.status}
  </span>
                    {task.description && (
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={loading}  // If loading is true → the button becomes disabled(unclickable)
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
