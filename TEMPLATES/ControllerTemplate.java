package com.yourapp.controller;

import com.yourapp.domain.EntityTemplate;
import com.yourapp.service.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * TEMPLATE: REST Controller
 *
 * ADAPT THIS:
 * 1. Rename class (e.g., BookController, RestaurantController)
 * 2. Update @RequestMapping path
 * 3. Change EntityTemplate to your entity
 * 4. Update service reference
 * 5. Add custom query methods as needed
 */

@RestController
@RequestMapping("/api/entities")  // CHANGE THIS
@CrossOrigin(origins = "*")
public class ControllerTemplate {

    @Autowired
    private EntityService service;  // CHANGE THIS

    // GET ALL
    @GetMapping
    public ResponseEntity<List<EntityTemplate>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {

        // Add filtering logic if needed
        List<EntityTemplate> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<EntityTemplate> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public ResponseEntity<EntityTemplate> create(@RequestBody EntityTemplate entity) {
        EntityTemplate created = service.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<EntityTemplate> update(
            @PathVariable Long id,
            @RequestBody EntityTemplate entity) {

        return service.findById(id)
                .map(existing -> {
                    entity.setId(id);
                    EntityTemplate updated = service.save(entity);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PARTIAL UPDATE (PATCH)
    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityTemplate> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {

        return service.findById(id)
                .map(entity -> {
                    String newStatus = updates.get("status");
                    // entity.setStatus(Status.valueOf(newStatus));
                    EntityTemplate updated = service.save(entity);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id)
                .map(entity -> {
                    service.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // CUSTOM QUERY EXAMPLES - ADAPT AS NEEDED

    // By user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EntityTemplate>> getByUser(@PathVariable Long userId) {
        // List<EntityTemplate> entities = service.findByUserId(userId);
        // return ResponseEntity.ok(entities);
        return ResponseEntity.ok(List.of());
    }

    // By date range
    @GetMapping("/date-range")
    public ResponseEntity<List<EntityTemplate>> getByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        // List<EntityTemplate> entities = service.findByDateRange(startDate, endDate);
        // return ResponseEntity.ok(entities);
        return ResponseEntity.ok(List.of());
    }

    // Search by name/description
    @GetMapping("/search")
    public ResponseEntity<List<EntityTemplate>> search(@RequestParam String query) {
        // List<EntityTemplate> entities = service.searchByKeyword(query);
        // return ResponseEntity.ok(entities);
        return ResponseEntity.ok(List.of());
    }
}
