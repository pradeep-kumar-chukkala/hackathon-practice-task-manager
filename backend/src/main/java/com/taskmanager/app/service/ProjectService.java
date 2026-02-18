package com.taskmanager.app.service;

import com.taskmanager.app.domain.Project;
import com.taskmanager.app.domain.User;
import com.taskmanager.app.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByCreatedById(userId);
    }

    public Project createProject(Project project) {
        if (project.getCreatedBy() != null && project.getCreatedBy().getId() != null) {
            User user = userService.getUserById(project.getCreatedBy().getId());
            project.setCreatedBy(user);
        }
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}