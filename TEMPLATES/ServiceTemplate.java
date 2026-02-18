package com.yourapp.service;

import com.yourapp.domain.EntityTemplate;
import com.yourapp.repository.EntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * TEMPLATE: Service Layer
 *
 * ADAPT THIS:
 * 1. Rename class (e.g., BookService, RestaurantService)
 * 2. Update EntityTemplate references
 * 3. Update repository reference
 * 4. Add custom business logic methods
 */

@Service
@Transactional
public class ServiceTemplate {

    @Autowired
    private EntityRepository repository;  // CHANGE THIS

    // CREATE
    public EntityTemplate save(EntityTemplate entity) {
        // Add business logic here (validation, enrichment, etc.)
        return repository.save(entity);
    }

    // READ - All
    public List<EntityTemplate> findAll() {
        return repository.findAll();
    }

    // READ - By ID
    public Optional<EntityTemplate> findById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public EntityTemplate update(Long id, EntityTemplate entity) {
        return repository.findById(id)
                .map(existing -> {
                    // Update fields
                    // existing.setName(entity.getName());
                    // existing.setDescription(entity.getDescription());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Entity not found: " + id));
    }

    // DELETE
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    // CUSTOM BUSINESS LOGIC EXAMPLES - ADAPT AS NEEDED

    // Filter by status
    public List<EntityTemplate> findByStatus(String status) {
        return repository.findAll().stream()
                .filter(e -> e.getStatus().toString().equals(status))
                .collect(Collectors.toList());
    }

    // Filter by multiple criteria
    public List<EntityTemplate> findByStatusAndPriority(String status, String priority) {
        return repository.findAll().stream()
                .filter(e -> status == null || e.getStatus().toString().equals(status))
                // .filter(e -> priority == null || e.getPriority().toString().equals(priority))
                .collect(Collectors.toList());
    }

    // Validate business rules
    private void validateEntity(EntityTemplate entity) {
        if (entity.getName() == null || entity.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }

        // Add more validation rules
    }

    // Complex operations
    public EntityTemplate processEntity(Long id) {
        EntityTemplate entity = findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found: " + id));

        // Add complex business logic here
        // - Send notifications
        // - Update related entities
        // - Calculate derived values
        // - Call external services

        return repository.save(entity);
    }

    // Bulk operations
    public List<EntityTemplate> saveAll(List<EntityTemplate> entities) {
        // Validate all entities
        entities.forEach(this::validateEntity);

        // Save all
        return repository.saveAll(entities);
    }

    // Search/filter operations
    public List<EntityTemplate> searchByKeyword(String keyword) {
        return repository.findAll().stream()
                .filter(e -> e.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                           (e.getDescription() != null &&
                            e.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }

    // Statistics/aggregation
    public long countByStatus(String status) {
        return repository.findAll().stream()
                .filter(e -> e.getStatus().toString().equals(status))
                .count();
    }

    // Relationship handling
    public List<EntityTemplate> findByRelatedEntity(Long relatedId) {
        // return repository.findByRelatedEntityId(relatedId);
        return List.of();
    }
}