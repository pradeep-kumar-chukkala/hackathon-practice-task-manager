package com.yourapp.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * TEMPLATE: Basic Entity
 *
 * ADAPT THIS:
 * 1. Rename class (e.g., Book, Restaurant, Reservation)
 * 2. Change fields to match your domain
 * 3. Add relationships (@ManyToOne, @OneToMany)
 * 4. Update table name
 */

@Entity
@Table(name = "entities")  // CHANGE THIS
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntityTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;  // ADAPT: your main field

    private String description;  // ADAPT: your text field

    @Enumerated(EnumType.STRING)
    private Status status;  // ADAPT: your enum field

    // RELATIONSHIPS - ADAPT AS NEEDED
    // @ManyToOne
    // @JoinColumn(name = "user_id")
    // private User user;

    // @OneToMany(mappedBy = "parent")
    // private List<Child> children;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // COMMON ENUMS TO COPY
    public enum Status {
        ACTIVE, INACTIVE, PENDING, COMPLETED
    }
}