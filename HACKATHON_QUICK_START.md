# 🏆 Hackathon Quick Start Guide - Feb 20, 2026

**Prize: £500** | **Time: 3-4 hours** | **Goal: Working Full-Stack App**

---

## ⚡ FASTEST PATH TO SUCCESS

### ✅ DO THIS (Recommended)
1. **Run Backend from IDE** (IntelliJ/Eclipse) - No SSL issues!
2. **Run Frontend with Vite** (`npm run dev`) - Fast hot reload
3. **Dockerize LAST** (optional, only if time permits)

### ❌ AVOID THESE TIME WASTERS
- Fighting with Docker during development
- SSL certificate debugging
- Perfect code/architecture
- Over-engineering features

---

## 📅 Pre-Hackathon Setup (Do Tonight/Tomorrow)

### Option A: Bring Pre-built Docker Images

```bash
# At home - build and save Docker images
cd /Users/kumarc/projects/sage-integration/hackathon-practice
docker compose build

# Save to file (~500MB)
docker save hackathon-practice-backend:latest hackathon-practice-frontend:latest | gzip > ~/Desktop/hackathon-images.tar.gz

# Copy to USB drive or upload to cloud
# On Friday: docker load < hackathon-images.tar.gz
```

### Option B: Backup Maven Dependencies

```bash
# Copy your local Maven repository (if at THG venue)
cd ~/.m2
tar -czf ~/Desktop/maven-backup.tar.gz repository/

# Restore on Friday: tar -xzf maven-backup.tar.gz -C ~/.m2/
```

### What to Bring
- ✅ USB drive with pre-built Docker images
- ✅ This practice project as reference
- ✅ IntelliJ IDEA or Eclipse installed
- ✅ VS Code installed
- ✅ Node.js (v20+) and npm installed
- ✅ Java 21 JDK installed
- ✅ Postman for API testing
- ✅ Water bottle and snacks!

---

## 🚀 Hackathon Day - Time-Boxed Schedule

### Hour 1: Foundation (10:00 - 11:00)
**Goal: Basic app structure running locally**

**Backend (20 mins):**
```bash
# Option 1: Copy from practice project
cp -r ~/hackathon-practice/backend ~/hackathon-day/backend

# Option 2: Spring Initializr
# Visit https://start.spring.io
# - Spring Boot 3.2.2
# - Java 21
# - Dependencies: Web, JPA, H2, Lombok
```

**Frontend (15 mins):**
```bash
cd ~/hackathon-day
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install axios
```

**First Integration (25 mins):**
- Create one Entity (e.g., Task)
- Create one Repository
- Create one Controller with GET endpoint
- Test with Postman: http://localhost:8080/api/tasks
- Create basic React component that fetches data
- **CHECKPOINT: Frontend shows backend data ✅**

### Hour 2: Core Features (11:00 - 12:00)
**Goal: CRUD operations working**

- ✅ POST - Create new items
- ✅ GET - List all items
- ✅ PUT/PATCH - Update items
- ✅ DELETE - Remove items
- ✅ Basic UI with forms and list

**CHECKPOINT: Can create, view, update, delete via UI ✅**

### Hour 3: Essential Features (12:00 - 13:00)
**Goal: Hackathon-specific requirements**

- ✅ Implement 2-3 main features from problem statement
- ✅ Add filtering/search if relevant
- ✅ Add basic validation
- ✅ Handle errors gracefully

**CHECKPOINT: Core functionality complete ✅**

### Hour 4: Polish & Deploy (13:00 - 14:00)
**Goal: Demo-ready application**

**First 30 mins: Polish**
- Fix obvious bugs
- Improve UI styling
- Add loading states
- Test all features

**Last 30 mins: Deployment (Optional)**
- Create Dockerfiles
- Test `docker compose up -d`
- If issues: stick with local demo!
- Prepare 2-minute demo script

---

## 💻 Development Commands

### Backend (IntelliJ IDEA)

**Import Project:**
1. File → Open → Select backend folder
2. Trust the project
3. Wait for Maven to download dependencies
4. Find `Application.java` (main class)
5. Right-click → Run

**Or via Command Line:**
```bash
cd backend

# If Maven works:
./mvnw spring-boot:run

# If SSL issues, run from IDE instead!
```

**Backend runs at:** http://localhost:8080

### Frontend (Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Runs at http://localhost:5173
```

### Both Together
```bash
# Terminal 1 - Backend (if not using IDE)
cd backend && ./mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend && npm run dev

# Access frontend at: http://localhost:5173
# API available at: http://localhost:8080/api
```

---

## 🛠️ Quick Code Templates

### Spring Boot Entity
```java
@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Spring Boot Controller
```java
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAll() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.create(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.update(id, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### React API Service
```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const taskApi = {
  getAll: () => api.get('/tasks'),
  create: (task: Task) => api.post('/tasks', task),
  update: (id: number, task: Task) => api.put(`/tasks/${id}`, task),
  delete: (id: number) => api.delete(`/tasks/${id}`)
};
```

### React Component with State
```typescript
import { useState, useEffect } from 'react';
import { taskApi } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskApi.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (task) => {
    await taskApi.create(task);
    loadTasks();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Task Manager</h1>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

---

## 🚨 Common Issues & Instant Fixes

### Issue 1: Backend SSL Certificate Error

**Error:**
```
unable to find valid certification path to requested target
```

**Fix Option A - Run from IDE:**
✅ Just run from IntelliJ - IDE handles SSL automatically

**Fix Option B - HTTP Maven Repository:**
Add to `pom.xml`:
```xml
<repositories>
  <repository>
    <id>central-http</id>
    <url>http://insecure.repo1.maven.org/maven2</url>
  </repository>
</repositories>
```

**Fix Option C - Skip SSL Verification:**
Add to Dockerfile:
```dockerfile
RUN mkdir -p ~/.m2 && \
    echo '<settings><mirrors><mirror><id>insecure</id><url>http://insecure.repo1.maven.org/maven2</url><mirrorOf>central</mirrorOf></mirror></mirrors></settings>' > ~/.m2/settings.xml
```

### Issue 2: Port Already in Use

**Error:**
```
Port 8080 is already in use
```

**Fix:**
```bash
# Find what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Issue 3: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix - Add to Controller:**
```java
@CrossOrigin(origins = "*")
```

**Or add WebConfig:**
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}
```

### Issue 4: npm install Fails

**Fix:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, disable SSL
npm config set strict-ssl false
npm install
```

### Issue 5: Frontend Can't Reach Backend

**Check:**
1. Backend is running: http://localhost:8080/api/tasks
2. CORS is enabled (see Issue 3)
3. API URL is correct in frontend

**Quick test:**
```bash
curl http://localhost:8080/api/tasks
```

---

## 🐳 Docker Commands (Use Last!)

### If Pre-built Images Available

```bash
# Load images you built at home
docker load < hackathon-images.tar.gz

# Start immediately
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### If Building Fresh (Risk: SSL issues!)

```bash
# Build and start
docker compose up -d --build

# If SSL errors: ABORT and run locally instead!
```

### Quick Dockerfile (Backend)

```dockerfile
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Quick Dockerfile (Frontend)

```dockerfile
FROM node:20-slim AS build
WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:mem:hackathondb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## 🎯 Demo Preparation (Last 15 Minutes)

### Demo Script Template

**1. Introduction (15 seconds)**
- "Hi, I'm [name] and I built [app name]"
- "It solves [problem] by [solution]"

**2. Live Demo (1.5 minutes)**
- Show main feature working
- Create something
- Show it updates in real-time
- Show one unique/cool feature

**3. Tech Stack (15 seconds)**
- "Built with Spring Boot backend and React frontend"
- "Deployed with Docker" (if you got it working)

**4. Challenges Overcome (15 seconds)**
- "The biggest challenge was [X], solved by [Y]"

**5. Future Plans (15 seconds)**
- "Next I would add [feature 1], [feature 2]"

### Pre-Demo Checklist

```bash
# 5 minutes before demo

# 1. Restart everything fresh
docker compose down  # or kill IDE processes
docker compose up -d  # or restart from IDE

# 2. Create sample data
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo Task","status":"TODO"}'

# 3. Open browser to http://localhost:3000
# 4. Test all features once
# 5. Close unnecessary browser tabs
# 6. Increase browser zoom for visibility
# 7. Take a deep breath!
```

---

## 📊 Project Structure Reference

```
hackathon-project/
├── backend/
│   ├── src/main/java/com/app/
│   │   ├── domain/           # Entities
│   │   ├── repository/       # JPA Repositories
│   │   ├── service/          # Business Logic
│   │   ├── controller/       # REST Controllers
│   │   └── config/           # CORS, etc.
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React Components
│   │   ├── services/         # API calls
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main component
│   │   └── App.css           # Styles
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## 🎓 Judging Criteria Tips

**What Judges Look For:**
1. ✅ **Does it work?** (Most important!)
2. ✅ **Does it solve the problem?**
3. ✅ **Is it innovative/creative?**
4. ✅ **Is the demo clear?**
5. ✅ **Code quality** (nice to have, not critical)

**What Judges DON'T Care About:**
- ❌ Perfect code architecture
- ❌ Comprehensive testing
- ❌ Production-ready deployment
- ❌ Perfect UI design (functional is enough)

**Winning Strategy:**
- Focus on ONE core feature that works really well
- Make it obvious how it solves the problem
- Have a clear, confident demo
- Smile and show enthusiasm!

---

## ⏰ Time Management Rules

### The 15-Minute Rule
**If stuck on something for >15 minutes → SKIP IT and move on**

Examples:
- Can't get Docker working? → Run locally
- SSL errors? → Use IDE
- Complex feature not working? → Simplify or skip
- UI perfect alignment? → Good enough is fine

### Priority Order
1. **P0 (Must Have):** Basic CRUD working
2. **P1 (Should Have):** 2-3 hackathon-specific features
3. **P2 (Nice to Have):** Polish, styling, Docker
4. **P3 (Skip):** Perfect code, comprehensive tests

### Checkpoint Times
- **11:00** - First API call working
- **12:00** - CRUD complete
- **13:00** - Main features done
- **13:30** - Start preparing demo
- **14:00** - Demo time!

---

## 🆘 Emergency Contacts & Resources

### Quick References
- **Spring Boot Docs:** https://spring.io/guides
- **React Docs:** https://react.dev
- **This Practice Project:** /Users/kumarc/projects/sage-integration/hackathon-practice/

### When Things Go Wrong

**Scenario: Everything is broken with 30 minutes left**

1. Don't panic!
2. Copy working code from practice project
3. Focus on getting ONE thing to work
4. Demo that one thing really well
5. Explain what you WOULD have done with more time

**Scenario: Docker won't work**

1. Stop trying!
2. Run backend from IDE
3. Run frontend with `npm run dev`
4. Demo locally - this is 100% fine!

**Scenario: Feature too complex**

1. Simplify immediately
2. MVP version is better than broken complex version
3. Judges prefer simple & working over complex & broken

---

## 🎁 Bonus Tips from Practice Session

### What Worked Well Today
✅ Running backend from IDE (no SSL issues)
✅ Vite dev server for frontend (super fast)
✅ Docker for final deployment (when it worked)
✅ Having practice project as reference

### What Caused Problems
❌ SSL certificates in Docker
❌ Trying to make everything perfect
❌ Browser caching issues (use incognito for testing)

### Lessons Learned
1. Start simple, add complexity later
2. Test integration early
3. Don't fight tools - use what works
4. Keep reference code handy
5. Commit often (every 30 mins)

---

## ✅ Final Checklist - Day Before Hackathon

**Technical Setup:**
- [ ] IntelliJ IDEA installed and working
- [ ] VS Code installed
- [ ] Java 21 JDK installed (`java -version`)
- [ ] Node.js 20+ installed (`node -version`)
- [ ] Docker Desktop installed (optional)
- [ ] Practice project on USB drive
- [ ] Pre-built Docker images saved (optional)

**Knowledge:**
- [ ] Reviewed practice project code
- [ ] Know how to create Spring Boot entity
- [ ] Know how to create REST controller
- [ ] Know how to create React component
- [ ] Know how to call API from React
- [ ] Practiced 2-minute demo

**Physical Items:**
- [ ] Laptop fully charged
- [ ] Charger
- [ ] USB drive with backups
- [ ] Water bottle
- [ ] Snacks
- [ ] Notebook and pen
- [ ] This guide (printed or on phone)

---

## 💪 Mindset for Success

**Remember:**
- Hackathons are about learning and having fun
- Working MVP beats perfect broken code
- Everyone faces technical issues
- Judges are supportive, not critical
- You've practiced and you're ready!

**If You Get Stressed:**
1. Take 2-minute break
2. Walk around
3. Drink water
4. Come back fresh
5. Focus on what works, not what's broken

---

## 🏆 You've Got This!

You've already built a full-stack app with Docker today. You know the patterns, you know the pitfalls, and you have this guide.

**On Friday:**
- Trust your practice
- Start simple
- Build incrementally
- Test frequently
- Demo confidently

**Good luck and have fun! 🚀**

---

*Created: Feb 18, 2026*
*For: Hackathon - Feb 20, 2026*
*Prize: £500*
*Location: [Venue TBD]*