# Task Manager - Full Stack Application

A full-featured task management system built with Spring Boot, React, TypeScript, and Docker.

## Features

- **Task Management**: Create, update, delete, and filter tasks by status and priority
- **User Management**: Create and manage users who can be assigned to tasks
- **Project Management**: Organize tasks into projects
- **Modern UI**: Responsive design with smooth animations and hover effects
- **Statistics Dashboard**: View task counts by status (TODO, IN_PROGRESS, DONE)
- **Docker Support**: Fully containerized application for easy deployment

## Tech Stack

### Backend
- **Spring Boot 3.2.2** - Java framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server and reverse proxy

## Project Structure

```
hackathon-practice/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskmanager/app/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── domain/        # Entity classes
│   │   │   │   ├── repository/    # JPA repositories
│   │   │   │   ├── service/       # Business logic
│   │   │   │   └── config/        # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React application
│   ├── src/
│   │   ├── services/           # API integration
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Main component
│   │   └── App.css             # Styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml          # Container orchestration
```

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   cd hackathon-practice
   ```

2. **Build and start containers**
   ```bash
   docker compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - H2 Console: http://localhost:8080/h2-console

4. **Stop containers**
   ```bash
   docker compose down
   ```

### Option 2: Local Development

#### Backend
```bash
cd backend

# Using Maven
mvn clean install
mvn spring-boot:run

# Or using IDE
# Open backend folder in IntelliJ/Eclipse and run TaskManagerApplication.java
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:5173
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports query params: ?status=TODO&priority=HIGH)
- `GET /api/tasks/{id}` - Get task by ID
- `GET /api/tasks/user/{userId}` - Get tasks by user
- `GET /api/tasks/project/{projectId}` - Get tasks by project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete task

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/user/{userId}` - Get projects by creator
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

## Usage Guide

### Creating a Task
1. Click the "+ Task" button in the header
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Status: TODO, IN_PROGRESS, or DONE
   - Priority: LOW, MEDIUM, or HIGH
   - Assign to a user (optional)
   - Assign to a project (optional)
3. Click "Create"

### Managing Tasks
- **Filter**: Use the dropdown filters to show tasks by status or priority
- **Update Status**: Click the status dropdown on any task card
- **Delete**: Click the trash icon to delete a task
- **View Stats**: Dashboard shows total, todo, in-progress, and done counts

### Creating Users & Projects
1. Click "+ User" or "+ Project" buttons
2. Fill in the required information
3. Users and projects can then be assigned to tasks

## Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:h2:mem:taskdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
server.port=8080
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=/api
```

## Docker Configuration

### Backend Dockerfile Highlights
- Multi-stage build for optimized image size
- Maven dependency caching
- SSL bypass for corporate networks
- Java 21 runtime

### Frontend Dockerfile Highlights
- Multi-stage build (Node.js build + Nginx runtime)
- Nginx reverse proxy to backend
- Gzip compression enabled
- Security headers configured
- Cache optimization for static assets

### Docker Compose
- Isolated network for services
- Health checks for both containers
- Automatic dependency management (frontend depends on backend)
- Port mappings: 80 (frontend), 8080 (backend)

## Troubleshooting

### Docker Build Issues

**SSL Certificate Errors**:
The Dockerfiles include SSL bypass configurations for corporate networks. If you still encounter issues:
- Backend: Check line 8-9 in `backend/Dockerfile`
- Frontend: Check line 8-9 in `frontend/Dockerfile`

**Container Not Starting**:
```bash
# Check logs
docker compose logs backend
docker compose logs frontend

# Restart containers
docker compose restart
```

### Local Development Issues

**Backend won't start**:
- Ensure Java 21 is installed
- Check port 8080 is not in use
- Verify H2 database configuration

**Frontend build errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

**CORS Errors**:
- Backend includes CORS configuration in `WebConfig.java`
- Allowed origins: http://localhost:5173, http://localhost

## Development Notes

### Database
- H2 in-memory database (data resets on restart)
- For persistent data, configure MySQL/PostgreSQL in application.properties

### Adding New Features
1. **Backend**: Create entity → repository → service → controller
2. **Frontend**: Add types → API methods → UI components
3. **Test**: Update tests and documentation

## Performance Considerations

- Frontend uses React.memo and useCallback for optimization
- Backend uses JPA query optimization
- Nginx gzip compression reduces transfer size
- Docker multi-stage builds minimize image size

## Security Notes

⚠️ **For Development Only**:
- SSL verification disabled for corporate network compatibility
- H2 console exposed for debugging
- No authentication/authorization implemented
- Suitable for hackathons and local development

**For Production**:
- Enable SSL/TLS
- Implement Spring Security
- Use production database
- Add authentication (JWT/OAuth)
- Remove H2 console
- Configure proper CORS

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Task comments and attachments
- [ ] Email notifications
- [ ] Task search functionality
- [ ] Due date reminders
- [ ] Task history/audit log
- [ ] Export tasks to CSV/PDF
- [ ] Dark mode toggle
- [ ] Mobile app

## License

MIT License - Feel free to use for hackathons and learning!

## Contributing

This is a hackathon practice project. Feel free to fork and modify for your needs.

## Contact

For questions or feedback, please open an issue in the repository.

---

**Built for Hackathon Practice** | Spring Boot + React + Docker | 2026