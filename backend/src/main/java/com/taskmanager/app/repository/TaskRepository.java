package com.taskmanager.app.repository;

import com.taskmanager.app.domain.Priority;
import com.taskmanager.app.domain.Task;
import com.taskmanager.app.domain.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(Priority priority);
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByStatusAndPriority(TaskStatus status, Priority priority);
}