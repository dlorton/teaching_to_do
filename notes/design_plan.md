# Teacher Companion App - Design Plan

**Last Updated:** November 8, 2025  
**Vision:** A one-stop teaching logistics companion for K-12 educators

---

## 🎯 Project Goals

- Create a comprehensive teaching PDA (Personal Digital Assistant)
- Support any teacher with a Google account (public tool)
- NO student data storage (privacy-first approach)
- Progressive enhancement: web → mobile-friendly → PWA → native app
- Built with modern React architecture for scalability and maintainability

---

## 📊 Current Status

### ✅ Working Features (React Implementation)
- **Architecture:** React 19.1.1 + Vite + Tailwind CSS v4
- Google Sign-In authentication (Firebase Auth)
- Multi-category todo lists with drag-and-drop reordering
- Task completion checkboxes with subtask support
- Firebase Firestore real-time sync
- Due date input and display with overdue/today highlighting
- Sidebar navigation (desktop and mobile)
- Component-based architecture with proper separation of concerns
- Dark mode design system (Tailwind)

### � Migration Complete (November 8, 2025)
- ✅ Migrated from vanilla JavaScript to React
- ✅ Set up Vite build system with hot module replacement
- ✅ Integrated Tailwind CSS for consistent styling
- ✅ Componentized all UI elements
- ✅ Maintained feature parity with vanilla version
- ✅ Improved code organization and maintainability

### 🐛 Known Issues (Needs Testing)
- Mobile drag-and-drop delay implementation needs verification
- Subtask editing feature not yet implemented
- Subtask reordering not yet implemented

---

## 🗺️ Development Roadmap

### **Phase 0: Foundation & Migration** ✅ *Complete*
**Timeline:** November 2-8, 2025  
**Status:** React migration complete

**Completed Tasks:**
- [x] Audit current codebase
- [x] Fix task edit feature (save/cancel, proper cleanup)
- [x] Add timestamp display to tasks
- [x] Enable due date editing in edit mode
- [x] Test all fixes with real Firebase data
- [x] **Migrate to React + Vite + Tailwind CSS**
- [x] **Componentize all UI elements**
- [x] **Set up modern build tooling**

**Learning Focus:**
- DOM manipulation best practices → React component patterns
- Firebase Timestamp handling
- Event delegation patterns → React event handling
- Modern build tools (Vite, npm, PostCSS)
- Tailwind CSS utility-first approach

---

### **Phase 1: Core Teacher Features** 📅 *In Progress*
**Timeline:** November 2025 - May 2026  
**Goal:** Add 5 essential teaching tools

**COMPLETED: Navigation System** ✅
- ✅ Sidebar navigation with icons (📋 Todo, 📅 Calendar, 🛒 Supplies, etc.)
- ✅ Desktop: Always visible sidebar
- ✅ Mobile: Collapsible hamburger menu
- ✅ Active tool highlighting
- ✅ User profile section in sidebar footer
- ✅ React component with responsive design

**COMPLETED: Todo List Tool** ✅
- ✅ Full React implementation
- ✅ Category and task management
- ✅ Subtasks with add/delete/complete
- ✅ Drag-and-drop reordering
- ✅ Due dates with smart highlighting
- ✅ Real-time Firebase sync

**TODO: Remaining Phase 1 Features**
- [ ] Subtask editing (inline edit mode)
- [ ] Subtask reordering (drag-and-drop)
- [ ] Mobile interaction optimization
- [ ] Google Calendar integration (Phase 1.1)
- [ ] Supply tracker (Phase 1.2)
- [ ] Resource database (Phase 1.3)
- [ ] Lesson planner (Phase 1.4)

**Mobile Strategy - Unique UX Patterns:**
Based on Android testing feedback (Nov 5, 2025), mobile version will diverge from desktop:
- **Drag-and-drop:** Disabled on mobile due to scrolling conflicts
  - Alternative: Long-press to activate "reorder mode" with up/down arrows
  - Or: Separate "Reorder" view with handle icons
- **Button controls:** Hover-reveal doesn't work on touch devices
  - Alternative: Swipe actions (swipe left = delete, swipe right = edit)
  - Or: Long-press context menu
- **Navigation:** Collapsible sidebar vs. bottom navigation bar (TBD)
  - Test collapsible sidebar first
  - If too cluttered, switch to bottom nav (iOS/Android pattern)

**Progressive Mobile Enhancement Timeline:**
1. **Phase 1:** Desktop-first with responsive layout
2. **Phase 1.5:** Mobile-specific interaction patterns (swipe, long-press)
3. **Phase 2:** Convert to PWA with offline support
4. **Phase 3:** Consider native app if PWA limitations emerge

---

#### 1.1 Google Calendar Integration ⭐ *Next Priority*
**Why:** Teachers need to see all events (classes, meetings, PD) in one place  
**Features:**
- OAuth integration with Google Calendar API
- Display upcoming events in dashboard
- Create/edit calendar events from app
- Color-coding by event type
- **🔗 Bi-directional sync with Todo List:**
  - Create calendar events from tasks with deadlines
  - Show today's calendar events in todo list sidebar
  - Link tasks to calendar events
  - Optional auto-sync toggle

**Tech Stack:**
- Google Calendar API v3
- OAuth 2.0 flow (already have Google Sign-In)
- Firestore cache for offline access

**Integration with Todo List:**
See design_notes.md Issue #2 for complete calendar-todo integration specifications:
- Manual "Add to Calendar" button on tasks (Phase 1)
- Display today's events in sidebar widget (Phase 1)
- Full auto-sync in Phase 2
- Task completion updates calendar events

**Learning Topics:**
- REST APIs and HTTP requests
- OAuth 2.0 authentication flow
- API rate limiting and quotas
- Async/await patterns
- Data synchronization patterns

---

#### 1.2 Supply Ordering Tracker
**Why:** Track classroom supplies, simplify purchase order creation  
**Features:**
- Add supplies with: name, quantity, price, website/SKU ID
- Categories (instructional, cleaning, technology, etc.)
- Generate printable purchase orders (PDF)
- Mark items as "ordered" or "received"
- Budget tracking per category

**Tech Stack:**
- Firestore collections: `supplies` with subcollections per user
- jsPDF or html2pdf.js for PDF generation
- Simple calculation logic (totals, budget remaining)

**Data Model:**
```javascript
supplies: {
  supplyId: {
    name: "Whiteboard Markers",
    quantity: 24,
    pricePerUnit: 1.50,
    websiteId: "AMZ-B0001234",
    url: "https://amazon.com/...",
    category: "instructional",
    status: "needed", // needed, ordered, received
    orderedDate: timestamp,
    receivedDate: timestamp,
    createdAt: timestamp
  }
}
```

**Learning Topics:**
- Database schema design
- PDF generation in browser
- Forms and validation
- CSS for print media

---

#### 1.3 Resource Database
**Why:** Centralize teaching resources (worksheets, videos, articles, lesson plans)  
**Features:**
- Add resources: title, URL, description, tags, subject, grade level
- Search by keyword, filter by subject/grade/tag
- Star/favorite resources
- Optional: Share resources publicly (anonymous, no teacher data)

**Tech Stack:**
- Firestore collection: `resources`
- Client-side search (Firestore queries) OR Algolia (free tier) for advanced search
- Tagging system with predefined + custom tags

**Data Model:**
```javascript
resources: {
  resourceId: {
    title: "Fractions Visual Guide",
    url: "https://example.com/fractions.pdf",
    description: "Visual representation of fractions...",
    tags: ["math", "fractions", "visual-aid"],
    subject: "math",
    gradeLevel: "3-5",
    isFavorite: true,
    createdAt: timestamp
  }
}
```

**Learning Topics:**
- Full-text search strategies
- Tag-based filtering
- UI patterns for search/filter
- External API integration (Algolia)

---

#### 1.4 Lesson Planner
**Why:** Plan weekly/daily lessons with curriculum standards alignment  
**Features:**
- Create lesson plans with: date, subject, objectives, activities, materials, standards
- Weekly view calendar grid
- Duplicate lessons for easy planning
- Link to resources from resource database
- Export/print lesson plans

**Tech Stack:**
- Firestore collection: `lessonPlans`
- Calendar grid UI (CSS Grid)
- Rich text editing (contentEditable or simple textarea)

**Data Model:**
```javascript
lessonPlans: {
  lessonId: {
    date: timestamp,
    subject: "Mathematics",
    gradeLevel: "4th Grade",
    title: "Introduction to Fractions",
    objectives: ["Students will identify fractions...", "..."],
    activities: ["Warm-up: Fraction circles", "..."],
    materials: ["Fraction manipulatives", "..."],
    standards: ["CCSS.MATH.4.NF.A.1", "..."],
    linkedResources: ["resourceId1", "resourceId2"],
    reflections: "Students struggled with...",
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

**Learning Topics:**
- Complex forms and data structures
- Calendar/date manipulation in JavaScript
- Template systems
- Data relationships (linking resources)

---

#### 1.5 AI Assistant (Experimental)
**Why:** Help teachers generate lesson ideas, rubrics, parent emails  
**Features:**
- Generate lesson plan ideas by topic
- Create grading rubrics
- Draft parent communication emails
- Suggest differentiation strategies
- **User controls when to use** (opt-in, not always-on)

**Tech Stack:**
- OpenAI API OR Google Gemini API
- API key management (environment variables)
- Cost tracking (rate limiting to prevent overuse)
- Clear UI indicating AI-generated content

**Implementation Notes:**
- Start with simple prompts (lesson ideas)
- User edits AI output before saving
- Privacy: NO student names/data in prompts
- Consider cost: OpenAI charges per token

**Learning Topics:**
- API integration with external services
- Prompt engineering basics
- Rate limiting and cost management
- Ethical AI use in education

---

### **Phase 2: Enhanced UX & Mobile** 📱 *Future*
**Timeline:** June 2026 - December 2026  
**Goal:** Professional polish, mobile-optimized experience

**Mobile-Specific Features (High Priority):**
Based on Android testing feedback (Nov 5, 2025):

1. **Touch-Optimized Interactions**
   - Swipe actions for task management (left = delete, right = edit)
   - Long-press context menu as alternative to hover controls
   - Large touch targets (min 44x44px)
   - Bottom sheet modals instead of inline editing on mobile

2. **Drag-and-Drop Alternatives**
   - "Reorder Mode" with drag handles and visual feedback
   - Up/down arrow buttons for fine control
   - Disable automatic drag on touch (prevents scroll conflicts)

3. **Navigation Optimization**
   - Test collapsible sidebar vs. bottom navigation bar
   - Gesture navigation (swipe from edge to open menu)
   - Persistent quick-add FAB (Floating Action Button) on mobile

**Desktop-Specific Features:**
1. **Hover-Reveal Controls** ✅ *Approved Nov 5, 2025*
   - Hide task buttons by default
   - Show on hover for clean interface
   - Keyboard shortcuts for power users

**Cross-Platform Features:**
- Progressive Web App (PWA) conversion
  - Offline functionality with Service Workers
  - "Add to Home Screen" on mobile
  - App-like experience
- Push notifications (task reminders, upcoming events)
- Dark/light mode toggle (currently dark-only)
- Drag-and-drop file uploads (for resources)
- Print-optimized views (lesson plans, supply orders)
- Accessibility improvements (WCAG AA compliance)
- Onboarding tour for new users

**Tech Additions:**
- Service Workers (caching, offline mode)
- Web Push API + Firebase Cloud Messaging
- Firebase Cloud Storage (file uploads)
- CSS media queries for mobile responsiveness

**Learning Topics:**
- Progressive Web Apps (PWA)
- Service Workers and caching strategies
- Web Push notifications
- Mobile-first design principles
- Accessibility standards

---

### **Phase 3: Community & Scaling** 🌐 *Future*
**Timeline:** 2027+  
**Goal:** Support thousands of teachers, community features

**Features:**
- Public resource sharing marketplace
  - Teachers share/discover lesson plans
  - Rating and review system
  - Curated collections
- School/district team features
  - Shared calendars for team planning
  - Collaborative lesson planning
  - Resource libraries per school
- Analytics dashboard
  - Task completion trends
  - Productivity insights
  - Time tracking for tasks
- Mobile native app (if PWA insufficient)
  - React Native or Flutter
  - App store distribution

**Tech Changes:**
- Firebase Cloud Functions (server-side logic)
- Firestore security rules (complex multi-user permissions)
- Consider React/Vue for complex UI state
- CDN for static assets
- Monitoring and analytics (Firebase Analytics)

**Scaling Considerations:**
- Cost optimization (Firebase usage)
- Database indexing for performance
- Image optimization and CDN
- User support system

---

## 🛠️ Technology Stack

### **Current Stack (Phase 1)**
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Styling:** Tailwind CSS v4 + PostCSS + Autoprefixer
- **Authentication:** Firebase Auth (Google Sign-In)
- **Database:** Firebase Firestore (NoSQL, real-time)
- **Hosting:** Firebase Hosting (free tier)
- **Libraries:** 
  - SortableJS (drag-and-drop)
  - React hooks (useState, useEffect, useMemo)
  
### **Development Tools:**
- **Linting:** ESLint with React plugins
- **Package Manager:** npm
- **Dev Server:** Vite dev server with HMR

### **Why React?**
- **Component Architecture:** Reusable, maintainable UI components
- **Developer Experience:** Hot module replacement, fast refresh
- **Ecosystem:** Rich library support for future features
- **Scalability:** Easy to add TypeScript, testing, state management
- **Modern Patterns:** Hooks, functional components, composition

### **Migration Journey:**
**November 2-7, 2025:** Vanilla JavaScript (learning phase)
- Taught fundamental DOM manipulation
- No build tools or framework abstractions
- Direct Firebase integration

**November 8, 2025:** React Migration
- Recognized need for better code organization
- Componentized architecture for upcoming features
- Modern tooling for better DX
- **Decision:** Migrate now before Calendar integration adds complexity

### **Future Tech Considerations:**
- **TypeScript:** Add for type safety (Phase 2?)
- **State Management:** Consider Zustand/Jotai if needed (Phase 2)
- **Testing:** Vitest + React Testing Library (Phase 2)
- **PWA:** Service Workers for offline support (Phase 2)

---

## 🔐 Security & Privacy

### **Privacy Principles**
1. **No student data** - App is for teacher logistics only
2. **Teacher data isolation** - Each user sees only their own data
3. **Google-only authentication** - No password management needed
4. **No third-party tracking** - No Google Analytics, ad trackers, etc.

### **Firestore Security Rules** (Current)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Future Security Considerations**
- API key protection (use Firebase Cloud Functions as proxy)
- Rate limiting to prevent abuse
- Content moderation if public sharing enabled
- FERPA compliance documentation (even without student data)

---

## 📚 Learning Resources

### **JavaScript Fundamentals**
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/) - Modern JS tutorial
- [Eloquent JavaScript](https://eloquentjavascript.net/) - Free book

### **Firebase**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Auth Guides](https://firebase.google.com/docs/auth)

### **Web APIs**
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Web APIs on MDN](https://developer.mozilla.org/en-US/docs/Web/API)

### **Design & UX**
- [Web.dev Learn](https://web.dev/learn/) - Modern web best practices
- [CSS-Tricks](https://css-tricks.com/) - CSS guides and patterns

---

## 🧪 Testing Strategy

### **Manual Testing (Current)**
- Test each feature in Firebase console
- Verify real-time sync across browser tabs
- Test Google Sign-In flow
- Mobile browser testing (iOS Safari, Android Chrome)

### **Future Testing**
- Unit tests for database logic (Jest)
- End-to-end tests (Playwright or Cypress)
- Accessibility testing (axe DevTools)
- Performance testing (Lighthouse)

---

## 📈 Success Metrics

### **Phase 0 (Current)**
- ✅ All 3 bugs fixed and tested
- ✅ Code is readable and well-commented
- ✅ No console errors

### **Phase 1**
- 5 core features implemented and stable
- App usable daily by creator (dogfooding)
- 10+ beta testers (fellow teachers)
- Load time < 2 seconds on mobile

### **Phase 2**
- PWA installable and works offline
- Mobile-friendly (responsive design)
- 100+ active users
- Lighthouse score > 90

### **Phase 3**
- 1000+ registered teachers
- Public resource library with 500+ resources
- Positive user feedback and testimonials
- Sustainable (free tier or monetization plan)

---

## 💡 Future Ideas (Backlog)

- **Attendance Tracker** (without student names—just counts/patterns)
- **Professional Development Log** (PD hours, certificates)
- **Duty Schedule** (hall monitor, lunch duty rotation)
- **Reflection Journal** (daily teaching notes)
- **Time Blocking Tool** (plan prep periods, grading sessions)
- **Substitute Plans Generator** (quick sub plan templates)
- **Parent Conference Scheduler** (booking system)
- **Classroom Seating Chart** (visual seating arrangements)
- **Standard-based Report Card Builder**

---

## 🤝 Collaboration & Contribution

**Current:** Solo project (learning-focused)  
**Future:** Potential for open-source community contributions

If this project goes public:
- Create contribution guidelines
- Set up GitHub issues for feature requests
- Establish code review process
- Build documentation for contributors

---

## 📝 Notes & Decisions

### **Why Firebase?**
- Free tier generous (50k reads/day, plenty for early users)
- No backend server to maintain
- Real-time sync out of the box
- Google Sign-In integration seamless
- Scales automatically

### **Why No Framework (Yet)?**
- Learning fundamentals first
- Faster iteration without build tools
- Can always refactor later when patterns emerge

### **Design Philosophy**
- **Progressive enhancement:** Build core features first, enhance later
- **Mobile-second:** Desktop-first for development, responsive for Phase 2
- **Privacy-first:** No student data, minimal teacher data
- **Learning-focused:** Every feature is a learning opportunity

---

## 🔄 Document Version History

- **v1.0** - November 2, 2025 - Initial roadmap created
