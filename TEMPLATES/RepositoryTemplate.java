package com.yourapp.repository;

import com.yourapp.domain.EntityTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * TEMPLATE: JPA Repository
 *
 * ADAPT THIS:
 * 1. Rename interface (e.g., BookRepository, RestaurantRepository)
 * 2. Change EntityTemplate to your entity
 * 3. Add custom query methods
 * 4. Spring Data JPA auto-generates implementations
 */

@Repository
public interface RepositoryTemplate extends JpaRepository<EntityTemplate, Long> {

    // COMMON QUERY METHOD PATTERNS

    // Find by single field
    List<EntityTemplate> findByName(String name);
    Optional<EntityTemplate> findByNameIgnoreCase(String name);

    // Find by status/enum
    List<EntityTemplate> findByStatus(EntityTemplate.Status status);

    // Find by multiple fields (AND)
    List<EntityTemplate> findByStatusAndName(EntityTemplate.Status status, String name);

    // Find with OR condition
    @Query("SELECT e FROM EntityTemplate e WHERE e.status = :status OR e.name = :name")
    List<EntityTemplate> findByStatusOrName(
        @Param("status") EntityTemplate.Status status,
        @Param("name") String name);

    // Find with LIKE/contains
    List<EntityTemplate> findByNameContaining(String keyword);
    List<EntityTemplate> findByNameContainingIgnoreCase(String keyword);

    // Find by date range
    List<EntityTemplate> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<EntityTemplate> findByCreatedAtAfter(LocalDateTime date);
    List<EntityTemplate> findByCreatedAtBefore(LocalDateTime date);

    // Find with ordering
    List<EntityTemplate> findAllByOrderByCreatedAtDesc();
    List<EntityTemplate> findByStatusOrderByNameAsc(EntityTemplate.Status status);

    // Find top/first N results
    List<EntityTemplate> findTop10ByOrderByCreatedAtDesc();
    Optional<EntityTemplate> findFirstByOrderByCreatedAtDesc();

    // EXISTS queries
    boolean existsByName(String name);
    boolean existsByNameAndStatus(String name, EntityTemplate.Status status);

    // COUNT queries
    long countByStatus(EntityTemplate.Status status);

    // DELETE queries
    void deleteByStatus(EntityTemplate.Status status);
    long deleteByCreatedAtBefore(LocalDateTime date);

    // RELATIONSHIP QUERIES (if you have @ManyToOne/@OneToMany)

    // Find by related entity ID
    // List<EntityTemplate> findByUserId(Long userId);
    // List<EntityTemplate> findByProjectId(Long projectId);

    // Find by related entity field
    // List<EntityTemplate> findByUserEmail(String email);
    // List<EntityTemplate> findByProjectName(String projectName);

    // CUSTOM JPQL QUERIES

    @Query("SELECT e FROM EntityTemplate e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<EntityTemplate> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT e FROM EntityTemplate e WHERE e.status = :status " +
           "AND e.createdAt >= :startDate ORDER BY e.createdAt DESC")
    List<EntityTemplate> findRecentByStatus(
        @Param("status") EntityTemplate.Status status,
        @Param("startDate") LocalDateTime startDate);

    // Join queries with relationships
    // @Query("SELECT e FROM EntityTemplate e JOIN e.user u WHERE u.id = :userId")
    // List<EntityTemplate> findByUserIdWithJoin(@Param("userId") Long userId);

    // Aggregation queries
    @Query("SELECT e.status, COUNT(e) FROM EntityTemplate e GROUP BY e.status")
    List<Object[]> countByStatusGrouped();

    // Native SQL query (use sparingly)
    @Query(value = "SELECT * FROM entities WHERE name = :name", nativeQuery = true)
    List<EntityTemplate> findByNameNative(@Param("name") String name);

    // Update query
    // @Modifying
    // @Query("UPDATE EntityTemplate e SET e.status = :newStatus WHERE e.status = :oldStatus")
    // int bulkUpdateStatus(@Param("oldStatus") Status oldStatus, @Param("newStatus") Status newStatus);
}

/**
 * QUICK REFERENCE - Spring Data JPA Query Keywords:
 *
 * findBy...          - Basic query
 * And, Or            - Combine conditions
 * Containing, Like   - Text search
 * Between            - Range query
 * LessThan, GreaterThan, Before, After - Comparison
 * OrderBy...Asc/Desc - Sorting
 * Top, First         - Limit results
 * Distinct           - Unique results
 * IgnoreCase         - Case-insensitive
 * Not, IsNull, IsNotNull - Negation/null checks
 *
 * Examples:
 * - findByNameAndStatusOrderByCreatedAtDesc
 * - findTop5ByStatusOrderByPriorityDesc
 * - findByNameContainingIgnoreCaseAndStatusNot
 * - findDistinctByCreatedAtBetweenOrderByNameAsc
 */