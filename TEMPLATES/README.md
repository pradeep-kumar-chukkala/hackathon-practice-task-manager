# Code Templates for Hackathon

Quick-start templates to copy, paste, and adapt for any domain model on hackathon day.

## How to Use These Templates

1. **Identify your domain** (e.g., Book, Restaurant, Order, Appointment)
2. **Copy the template file** you need
3. **Find and replace** `Entity` with your domain name
4. **Adapt fields** to match your requirements
5. **Add custom logic** as needed

## Template Files

### Backend (Java/Spring Boot)

#### `EntityTemplate.java`
- **What**: JPA Entity with Lombok annotations
- **When**: Creating any database table/object
- **Adapt**: Rename class, change table name, update fields, add relationships
- **Example**: Book, Restaurant, Reservation, Order

#### `RepositoryTemplate.java`
- **What**: JPA Repository with common query methods
- **When**: Need database operations
- **Adapt**: Rename interface, update entity type, add custom queries
- **Contains**: CRUD, filters, search, date range, relationships

#### `ServiceTemplate.java`
- **What**: Service layer with business logic
- **When**: Processing data, validation, business rules
- **Adapt**: Rename class, update entity type, add custom logic
- **Contains**: CRUD operations, validation, filtering, bulk operations

#### `ControllerTemplate.java`
- **What**: REST Controller with all CRUD endpoints
- **When**: Creating API endpoints
- **Adapt**: Rename class, update @RequestMapping path, change entity type
- **Contains**: GET/POST/PUT/PATCH/DELETE, filtering, custom queries

### Frontend (React/TypeScript)

#### `ComponentTemplate.tsx`
- **What**: Complete React component with CRUD operations
- **When**: Creating any UI view/page
- **Adapt**: Rename component, update types, change form fields
- **Contains**: State management, API calls, modals, filters, list rendering

#### `ApiServiceTemplate.ts`
- **What**: API service layer with axios
- **When**: Connecting frontend to backend
- **Adapt**: Update endpoint paths, add custom methods
- **Contains**: HTTP client, interceptors, error handling, CRUD methods

## Quick Workflow

### Creating a New Feature (e.g., Book Management)

**Backend (5 steps):**
1. Copy `EntityTemplate.java` → `Book.java`
   - Add fields: title, author, isbn, publicationDate
   - Update table name: `@Table(name = "books")`

2. Copy `RepositoryTemplate.java` → `BookRepository.java`
   - Change: `JpaRepository<Book, Long>`
   - Add: `findByAuthor(String author)`, `findByIsbn(String isbn)`

3. Copy `ServiceTemplate.java` → `BookService.java`
   - Inject `BookRepository`
   - Add validation: check ISBN format, author not empty

4. Copy `ControllerTemplate.java` → `BookController.java`
   - Change: `@RequestMapping("/api/books")`
   - Add custom endpoint: `@GetMapping("/author/{authorName}")`

5. Run: `mvn spring-boot:run` or from IntelliJ

**Frontend (3 steps):**
1. Create types in `types/index.ts`:
   ```typescript
   export interface Book {
     id?: number;
     title: string;
     author: string;
     isbn: string;
     publicationDate?: string;
   }
   ```

2. Copy `ApiServiceTemplate.ts` → `api.ts`
   - Create: `export const bookApi = new ApiService<Book>('/books')`

3. Copy `ComponentTemplate.tsx` → `BookList.tsx`
   - Update: type references, form fields
   - Customize: display author, title, ISBN in cards

4. Run: `npm run dev` or Docker

**Total time: 15-20 minutes** for basic CRUD on both ends!

## Find and Replace Shortcuts

Use your IDE's "Replace in File" feature:

### Backend
```
EntityTemplate    → YourEntityName
entities          → your_table_name
EntityRepository  → YourEntityRepository
EntityService     → YourEntityService
```

### Frontend
```
Entity            → YourType
entityApi         → yourApi
entities          → yourEntities
/entities         → /your-endpoint
```

## Common Customizations

### Adding Relationships (Backend)

**One-to-Many** (e.g., Author has many Books):
```java
@Entity
public class Author {
    @OneToMany(mappedBy = "author")
    private List<Book> books;
}

@Entity
public class Book {
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;
}
```

**Many-to-Many** (e.g., Book has many Categories):
```java
@Entity
public class Book {
    @ManyToMany
    @JoinTable(
        name = "book_category",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;
}
```

### Adding Validation

```java
@NotNull(message = "Title is required")
@Size(min = 1, max = 200)
private String title;

@Email(message = "Invalid email format")
private String email;

@Pattern(regexp = "^[0-9]{3}-[0-9]{10}$", message = "Invalid ISBN format")
private String isbn;
```

### Adding Custom Queries

**Repository:**
```java
List<Book> findByAuthorContainingIgnoreCase(String author);
List<Book> findByPublicationDateBetween(LocalDate start, LocalDate end);

@Query("SELECT b FROM Book b WHERE b.title LIKE %:keyword% OR b.author LIKE %:keyword%")
List<Book> search(@Param("keyword") String keyword);
```

## Time-Saving Tips

1. **Start with Entity** - Get your data model right first
2. **Copy liberally** - These templates are meant to be copied
3. **Test as you go** - Test each layer before moving to next
4. **Use Postman/curl** - Test backend before building frontend
5. **Keep it simple** - Add features iteratively, MVP first

## Entity Field Ideas by Domain

**E-commerce:**
- Product: name, price, stock, category, imageUrl
- Order: orderNumber, totalAmount, status, orderDate
- Customer: name, email, address, phone

**Restaurant:**
- Restaurant: name, cuisine, address, rating, priceRange
- Reservation: customerName, dateTime, partySize, status
- MenuItem: name, description, price, category

**Healthcare:**
- Patient: name, dob, email, phone, medicalHistory
- Appointment: dateTime, doctorName, reason, status
- Prescription: medication, dosage, startDate, endDate

**Education:**
- Course: title, instructor, credits, schedule
- Student: name, email, enrollmentDate, gpa
- Enrollment: studentId, courseId, grade, semester

**Task/Project Management:**
- Task: title, description, status, priority, dueDate
- Project: name, description, startDate, budget
- User: name, email, role, department

## Common Status Enums

```java
// Generic
ACTIVE, INACTIVE, PENDING, COMPLETED, CANCELLED

// Orders
DRAFT, SUBMITTED, PROCESSING, SHIPPED, DELIVERED, CANCELLED

// Reservations
REQUESTED, CONFIRMED, SEATED, COMPLETED, NO_SHOW, CANCELLED

// Tasks
TODO, IN_PROGRESS, REVIEW, DONE, BLOCKED

// Approvals
PENDING_REVIEW, APPROVED, REJECTED, NEEDS_CHANGES
```

## Quick Checklist

Before hackathon:
- [ ] Read all templates once
- [ ] Practice with one domain (10 min exercise)
- [ ] Set up IDE with backend/frontend projects
- [ ] Test Docker builds work
- [ ] Have Maven cache populated
- [ ] Bookmark this README

During hackathon:
- [ ] Identify 2-3 main entities from requirements
- [ ] Start with backend entities
- [ ] Create repositories → services → controllers
- [ ] Test with Postman/curl
- [ ] Create frontend types
- [ ] Build API service
- [ ] Create main component
- [ ] Test end-to-end
- [ ] Add styling/polish
- [ ] Prepare demo

## Remember

**These templates give you:**
- ✅ 80% of boilerplate done
- ✅ Best practices baked in
- ✅ Common patterns ready to use
- ✅ Consistent structure

**You focus on:**
- 🎯 Understanding requirements
- 🎯 Domain-specific fields
- 🎯 Business logic
- 🎯 UI/UX polish
- 🎯 Demo preparation

Good luck! 🚀