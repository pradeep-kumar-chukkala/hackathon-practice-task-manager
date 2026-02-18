import { useState, useEffect } from 'react';
import type { Task, User, Project } from './types';
import { TaskStatus, Priority } from './types';
import { taskApi, userApi, projectApi } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
  });
  const [newUser, setNewUser] = useState<User>({ name: '', email: '' });
  const [newProject, setNewProject] = useState<Project>({ name: '', description: '' });
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes, projectsRes] = await Promise.all([
        taskApi.getAll(),
        userApi.getAll(),
        projectApi.getAll(),
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running on port 8080.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskApi.create(newTask);
      setNewTask({ title: '', description: '', status: TaskStatus.TODO, priority: Priority.MEDIUM });
      setShowTaskForm(false);
      loadData();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.create(newUser);
      setNewUser({ name: '', email: '' });
      setShowUserForm(false);
      loadData();
    } catch (err) {
      alert('Failed to create user');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectApi.create(newProject);
      setNewProject({ name: '', description: '' });
      setShowProjectForm(false);
      loadData();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await taskApi.updateStatus(taskId, newStatus);
      loadData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskApi.delete(taskId);
        loadData();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Task Manager</h1>
        <div className="header-actions">
          <button onClick={() => setShowTaskForm(!showTaskForm)}>+ Task</button>
          <button onClick={() => setShowUserForm(!showUserForm)}>+ User</button>
          <button onClick={() => setShowProjectForm(!showProjectForm)}>+ Project</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="stats">
        <div className="stat-card"><h3>{stats.total}</h3><p>Total</p></div>
        <div className="stat-card todo"><h3>{stats.todo}</h3><p>To Do</p></div>
        <div className="stat-card in-progress"><h3>{stats.inProgress}</h3><p>In Progress</p></div>
        <div className="stat-card done"><h3>{stats.done}</h3><p>Done</p></div>
      </div>

      {showTaskForm && (
        <div className="modal" onClick={() => setShowTaskForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value as TaskStatus})}>
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
              </select>
              <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}>
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
              </select>
              <select onChange={e => setNewTask({...newTask, assignedTo: e.target.value ? users.find(u => u.id === Number(e.target.value)) : undefined})}>
                <option value="">No assignee</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <select onChange={e => setNewTask({...newTask, project: e.target.value ? projects.find(p => p.id === Number(e.target.value)) : undefined})}>
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <div className="form-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowTaskForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserForm && (
        <div className="modal" onClick={() => setShowUserForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>New User</h2>
            <form onSubmit={handleCreateUser}>
              <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              <div className="form-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowUserForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="modal" onClick={() => setShowProjectForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>New Project</h2>
            <form onSubmit={handleCreateProject}>
              <input type="text" placeholder="Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              <select onChange={e => setNewProject({...newProject, createdBy: e.target.value ? users.find(u => u.id === Number(e.target.value)) : undefined})}>
                <option value="">Select Creator</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <div className="form-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowProjectForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filters">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | '')}>
          <option value="">All Statuses</option>
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.DONE}>Done</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as Priority | '')}>
          <option value="">All Priorities</option>
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found. Create one!</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.status.toLowerCase()}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
              {task.description && <p>{task.description}</p>}
              <div className="task-meta">
                {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                {task.project && <span>📁 {task.project.name}</span>}
              </div>
              <div className="task-actions">
                <select value={task.status} onChange={e => handleStatusChange(task.id!, e.target.value as TaskStatus)}>
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.DONE}>Done</option>
                </select>
                <button onClick={() => handleDeleteTask(task.id!)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
