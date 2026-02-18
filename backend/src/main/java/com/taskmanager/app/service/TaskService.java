package com.taskmanager.app.service;

import com.taskmanager.app.domain.Priority;
import com.taskmanager.app.domain.Project;
import com.taskmanager.app.domain.Task;
import com.taskmanager.app.domain.TaskStatus;
import com.taskmanager.app.domain.User;
import com.taskmanager.app.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final ProjectService projectService;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByStatusAndPriority(TaskStatus status, Priority priority) {
        return taskRepository.findByStatusAndPriority(status, priority);
    }

    public Task createTask(Task task) {
        // Set assigned user if provided
        if (task.getAssignedTo() != null && task.getAssignedTo().getId() != null) {
            User user = userService.getUserById(task.getAssignedTo().getId());
            task.setAssignedTo(user);
        }

        // Set project if provided
        if (task.getProject() != null && task.getProject().getId() != null) {
            Project project = projectService.getProjectById(task.getProject().getId());
            task.setProject(project);
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());

        // Update assigned user if provided
        if (taskDetails.getAssignedTo() != null && taskDetails.getAssignedTo().getId() != null) {
            User user = userService.getUserById(taskDetails.getAssignedTo().getId());
            task.setAssignedTo(user);
        } else {
            task.setAssignedTo(null);
        }

        // Update project if provided
        if (taskDetails.getProject() != null && taskDetails.getProject().getId() != null) {
            Project project = projectService.getProjectById(taskDetails.getProject().getId());
            task.setProject(project);
        } else {
            task.setProject(null);
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, TaskStatus status) {
        Task task = getTaskById(id);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}