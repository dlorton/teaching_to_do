# Project History & Decisions

**Project:** Teacher Companion App  
**Started:** November 2, 2025  
**Purpose:** Track major decisions, milestones, and development history

---

## 📅 Development Timeline

### **November 2, 2025 - Initial Session**
**Focus:** Bug fixes and project planning

**Completed:**
- ✅ Fixed 3 core bugs:
  1. Edit feature cleanup (toggle mode, cancel button)
  2. Timestamp display (relative time formatting)
  3. Deadline editing (date input in edit mode)
- ✅ Implemented alternating category backgrounds
- ✅ Created comprehensive roadmap (design_plan.md)
- ✅ Documented UX concerns (design_notes.md)

**Key Learnings:**
- Toggle patterns for UI state
- Data attributes for metadata storage
- Relative time calculations
- Firebase Timestamp handling

**Documentation Created:**
- `design_plan.md` - Full Phase 0-3 roadmap
- `design_notes.md` - UX issues and improvements
- `SESSION_SUMMARY.md` - Nov 2 recap

---

### **November 5, 2025 - Navigation & Subtasks**
**Focus:** Multi-tool navigation, subtask hierarchy, mobile testing

**Morning Session - Planning:**
- Discussed navigation menu options (sidebar vs. top nav vs. bottom nav)
- Finalized calendar integration decisions (5 key questions answered)
- Documented mobile UX strategy (desktop-first, then mobile adaptations)
- **Decision:** Implement sidebar navigation (Option A)

**Afternoon Session - Implementation:**
- ✅ Built sidebar navigation system:
  - Desktop: Always-visible 250px sidebar
  - Mobile: Collapsible hamburger menu (intended)
  - User profile in footer with Firebase Auth data
  - 5 tool placeholders (Todo active, Calendar/Supplies/Resources/Lessons coming soon)
- ✅ Implemented 3-level task hierarchy:
  - Category > Task > Subtask
  - Collapsible subtask lists with toggle button (▼/▶)
  - Add, delete, complete subtasks
  - Subtasks stored in `task.subtasks` array in Firestore
  - Styled with darker background, 30px indent

**Evening Session - Testing:**
- Desktop testing revealed 10 issues (5 bugs, 5 design improvements)
- Android mobile testing revealed 2 **critical** issues
- Created `TESTING_SUMMARY.md` with detailed bug reports

**Night Session - Quick Wins:**
- ✅ Fixed 6 issues (all low/medium priority):
  1. Replaced delete buttons with trash icons 🗑️
  2. Moved "Reorder Categories" button to category area
  3. Fixed empty space below tasks (CSS min-height)
  4. Added Enter key support for subtask input
  5. Task completion cascades to all subtasks
  6. Removed red overdue styling from completed tasks
- **Status at end of day:** 6 remaining (2 critical, 2 high, 2 medium)

**Key Learnings:**
- Mobile requires fundamentally different UX patterns
- Drag-and-drop conflicts with scrolling on touch devices
- Edge cases need explicit testing (keyboard shortcuts, cascading actions)
- Test both platforms immediately after implementing features

**Documentation Created:**
- `DISCUSSION_NOV_5.md` - Calendar and navigation decisions
- `QUICK_START.md` - Navigation implementation guide (now outdated)
- `TESTING_SUMMARY.md` - Comprehensive test results

---

### **November 8, 2025 - React Migration**
**Focus:** Complete architectural rewrite to React + Vite + Tailwind CSS

**Completed:**
- ✅ Migrated from vanilla JavaScript to React 19.1.1
- ✅ Set up Vite build system with hot module replacement
- ✅ Integrated Tailwind CSS v4 for styling
- ✅ Componentized architecture with proper separation of concerns
- ✅ Maintained all existing features (auth, categories, tasks, subtasks, sidebar)
- ✅ Improved code organization with component-based structure
- ✅ SortableJS still working for drag-and-drop functionality

**Tech Stack Changes:**
- **Build Tool:** None → Vite 7.1.7
- **Framework:** Vanilla JS → React 19.1.1
- **Styling:** Inline CSS → Tailwind CSS v4 + PostCSS
- **Package Manager:** CDN scripts → npm/Node.js
- **Dev Environment:** Live Server → Vite dev server

**Component Architecture:**
```
src/
  App.jsx                    # Main app, auth, routing logic
  main.jsx                   # React entry point
  components/
    Sidebar.jsx              # Navigation menu, user profile
    ToDoBoard/
      TodoBoard.jsx          # Board container, category management
      CategoryCard.jsx       # Individual category with tasks
      TaskItem.jsx           # Individual task with subtasks
      Subtasks.jsx           # Subtask list component
      AddCategory.jsx        # New category input
      AddTask.jsx            # New task input
  lib/
    firebase.js              # Firebase configuration
```

**Rationale:**
- Better code organization with component reusability
- Improved developer experience (hot reload, type checking)
- Modern tooling for future scaling (TypeScript, linting, testing)
- Tailwind CSS for consistent, maintainable styling
- Easier to add new features with component architecture
- Preparation for Phase 2 (PWA, advanced features)

**What's Working:**
- ✅ All features from vanilla JS version preserved
- ✅ Google Sign-In authentication
- ✅ Category and task CRUD operations
- ✅ Drag-and-drop reordering (categories and tasks)
- ✅ Subtask management
- ✅ Due date handling
- ✅ Sidebar navigation (desktop and mobile)
- ✅ Real-time Firestore sync
- ✅ Responsive design with Tailwind

**Next Steps:**
- Test all features thoroughly (especially mobile)
- Verify bug fixes from November 5 still apply
- Consider TypeScript migration for type safety
- Prepare for Calendar integration (next Phase 1 feature)

---

### **November 16, 2025 - User Testing & Feature Enhancements**
**Focus:** User-driven improvements based on testing feedback

**Completed:**
- ✅ **Category Collapse/Expand**: Added toggle button (▼/▶) to collapse task lists per category
  - Shows task count when collapsed
  - Reduces visual clutter for better navigation
- ✅ **Conditional Due Date Input**: Date picker only appears after user starts typing task text
  - Cleaner default interface
  - Automatically shows/hides based on user input
- ✅ **Subtask Editing in Task Edit Mode**: When editing a task, subtasks become editable inline
  - Click subtask text or edit icon (✏️) to edit
  - Checkmark (✓) to save, X to cancel
  - No separate edit button needed
- ✅ **Drag-and-Drop Handles**: Added visible `⋮⋮` handles for reordering
  - Categories: Handle before collapse button
  - Tasks: Handle before checkbox
  - Subtasks: Handle at start of each subtask
  - Consistent design across all three levels
- ✅ **Multiple Todo Lists Feature**: Complete data model restructure
  - New Firestore structure: `users/{userId}/lists/{listId}/categories/{catId}/tasks/{taskId}`
  - List selector dropdown (larger, emphasized font)
  - New List, Rename List, Delete List buttons
  - Auto-creates "My Tasks" default list
  - Cannot delete last remaining list
- ✅ **List Management UI**: Reorganized header layout
  - All list controls grouped on left side
  - Larger dropdown with `text-lg` and `font-medium`
  - Delete button with red border styling
  - Sign Out moved to right side

**Technical Fixes:**
- ✅ Fixed drag-and-drop functionality issues:
  - Removed `className="contents"` which broke Sortable tracking
  - Changed category layout from CSS Grid to Flex column (Grid broke SortableJS)
  - Fixed `ghostClass` error (must be single class, not space-separated)
  - Added `sortable-ghost` CSS class in index.css
  - Added `forceFallback: true` for consistent browser behavior
  - Added mobile touch support (`delay: 100, delayOnTouchOnly: true`)
  - Removed item count restrictions (changed from `< 2` to `=== 0`)
  - Fixed dependencies in useEffect hooks
- ✅ Updated Firestore security rules for new lists structure
- ✅ Renamed `TodoBoard.jsx` to `ListName.jsx` (user preference)

**What's Working:**
- ✅ All drag-and-drop (categories, tasks, subtasks) working smoothly
- ✅ Multiple lists with full CRUD operations
- ✅ Category collapse/expand reducing clutter
- ✅ Subtask editing integrated into task edit mode
- ✅ Clean, progressive UI (date picker on demand)
- ✅ Consistent drag handles across all levels

**Key Learning:**
- SortableJS `ghostClass` must be a single class name (not space-separated Tailwind classes)
- CSS Grid breaks SortableJS multi-column layouts; use Flex layouts instead
- `className="contents"` removes wrapper from DOM, breaking Sortable element tracking
- Touch delay prevents scroll conflicts on mobile devices

**Next Steps:**
- Begin Google Calendar integration planning (Phase 1.1)
- Mobile testing on actual devices
- Consider TypeScript migration for type safety

---

## 🎯 Major Decisions

### **1. Technology Stack**
**Initial Decision:** Vanilla JavaScript (no framework)  
**Date:** November 2, 2025  
**Rationale:**
- Better for learning fundamentals
- No build tool complexity
- Easy to refactor to React/Vue later (Phase 2-3)
- Lightweight and fast

**UPDATED DECISION:** React + Vite + Tailwind CSS ⭐ **ACTIVE**  
**Date:** November 8, 2025  
**Rationale:**
- Component architecture improves code organization
- Better scalability for upcoming features (Calendar, etc.)
- Modern developer experience (hot reload, npm ecosystem)
- Tailwind CSS provides consistent, maintainable styling
- Vite offers fast builds and excellent DX
- Easier team collaboration with standard tooling

**Result:** Successfully migrated, all features working, ready for Phase 1 expansion

---

### **2. Navigation Pattern**
**Decision:** Sidebar Navigation (Option A)  
**Date:** November 5, 2025  
**Desktop:** Always-visible 250px sidebar on left  
**Mobile:** Collapsible hamburger menu  

**Rejected Alternatives:**
- Option B: Top navigation bar (limited space)
- Option C: Bottom navigation (mobile-first, unusual for desktop)
- Option D: Command palette only (not discoverable)

**Implementation Status:** Desktop complete, mobile needs debugging

---

### **3. Calendar Integration Approach**
**Decision:** Manual sync with user control (MVP)  
**Date:** November 5, 2025

**Five Key Decisions:**
1. **Sync Method:** Manual "Add to Calendar" button (Option B)
2. **Event Type:** Time-block events with all-day default (Option B)
3. **Calendar → Todo:** "Today's Schedule" widget only (Option D)
4. **Task Completion:** Do nothing to calendar event (Option D)
5. **Calendar Selection:** User selects in Settings (Option B)

**Rationale:** User control, predictable behavior, simple to implement and test

**Future Enhancements (Phase 2):**
- Manual task creation from calendar events
- "Completed Tasks" calendar for review
- Auto-sync toggle option

**Documentation:** See design_notes.md Issue #2 for complete specifications

---

### **4. Mobile UX Strategy**
**Decision:** Desktop-first with mobile-specific adaptations  
**Date:** November 5, 2025

**Approach:**
- Phase 1: Desktop-first responsive design
- Phase 1.5: Mobile-specific interaction patterns
- Phase 2: PWA conversion with offline support
- Phase 3: Native app (if PWA limitations emerge)

**Mobile Will Diverge:**
- Drag-and-drop: Long-press delay (500ms) to prevent scroll conflicts
- Button controls: Swipe actions or long-press menus (not hover)
- Navigation: Testing sidebar first, may switch to bottom nav

**Rationale:** User testing revealed mobile needs fundamentally different UX

---

### **5. Subtask Hierarchy**
**Decision:** 3-level hierarchy (Category > Task > Subtask)  
**Date:** November 5, 2025  
**Implementation:** Subtasks stored in `task.subtasks` array

**Features:**
- Collapsible lists with toggle button
- Add, delete, complete operations
- Visual separation (darker background, indented)
- Count display in toggle button

**Not Yet Implemented:**
- Subtask editing
- Subtask reordering
- Cascade completion (parent → children)

---

## 🚀 Current Status (November 16, 2025 - User Testing & Enhancements Complete)

### **What's Working:**
- ✅ **React Architecture:** Full migration to component-based structure
- ✅ **Build System:** Vite dev server with hot module replacement
- ✅ **Styling:** Tailwind CSS v4 for all UI components
- ✅ **Multiple Todo Lists:** Full CRUD operations for separate lists
- ✅ Google Sign-In (Firebase Auth)
- ✅ Todo list (create, edit, delete, complete)
- ✅ Categories (create, edit, delete, reorder with drag handles)
- ✅ Category collapse/expand with task counts
- ✅ Due dates (set, edit, remove, smart overdue highlighting, conditional display)
- ✅ Timestamps (relative time display)
- ✅ Subtasks (add, delete, complete, **edit inline**, **reorder with drag-and-drop**, Enter key support)
- ✅ Navigation sidebar (desktop - mobile needs testing)
- ✅ Firebase real-time sync with new lists-based data model
- ✅ Dark mode design (Tailwind dark colors)
- ✅ Task completion cascades to subtasks
- ✅ Trash can icons for delete buttons
- ✅ Completed tasks don't show red dates
- ✅ **Drag-and-drop:** Categories, tasks, and subtasks all reorderable with visible handles

### **Resolved Issues (November 16):**
- ✅ ~~Mobile drag-and-drop~~ - Configured with delay/forceFallback
- ✅ ~~Task reordering~~ - Working with SortableJS and drag handles
- ✅ ~~Subtask editing~~ - Implemented inline editing in task edit mode
- ✅ ~~Subtask reordering~~ - Working with SortableJS and drag handles
- ✅ ~~Category reordering scroll~~ - Working smoothly with Flex layout
- ✅ ~~CSS Grid breaking drag-and-drop~~ - Switched to Flex column layout
- ✅ ~~ghostClass InvalidCharacterError~~ - Fixed with single CSS class

### **Known Issues (Need Testing):**
- ⚠️ Mobile navigation - needs testing on Android/iOS
- ⚠️ Mobile drag-and-drop - needs testing on actual devices

**Next Session Priority:** 
1. Begin Google Calendar integration planning (Phase 1.1)
2. Test on mobile devices (Android/iOS)
3. Consider TypeScript migration for enhanced type safety

---

## 📚 Code Architecture

### **File Structure (Current - React):**
```
teacher-companion/
  package.json              Dependencies and scripts
  vite.config.js            Vite build configuration
  postcss.config.js         PostCSS + Tailwind config
  eslint.config.js          ESLint configuration
  index.html                HTML entry point
  src/
    main.jsx                React entry point
    App.jsx                 Root component (auth, routing)
    App.css                 Global styles
    index.css               Tailwind directives
    components/
      Sidebar.jsx           Navigation menu
      ToDoBoard/
        TodoBoard.jsx       Board container
        CategoryCard.jsx    Category component
        TaskItem.jsx        Task component
        Subtasks.jsx        Subtask list
        AddCategory.jsx     New category input
        AddTask.jsx         New task input
    lib/
      firebase.js           Firebase config
  notes/                    Documentation
    design_plan.md          Roadmap and technical decisions
    design_notes.md         UX observations and bug tracking
    PROJECT_HISTORY.md      This file - decisions and milestones
```

### **Data Model (Firestore):**
```
users/
  {userId}/
    title: "My To-Do List"
    categories/
      {categoryId}/
        name: "School Work"
        order: 0
        tasks/
          {taskId}/
            text: "Grade homework"
            order: 0
            isComplete: false
            createdAt: Timestamp
            dueDate: Date (nullable)
            subtasks: [
              {
                text: "Grade math tests"
                isComplete: false
                createdAt: Date
              }
            ]
```

### **Key Functions (React Components & Hooks):**
- **App.jsx** - Main component with auth state and routing
- **TodoBoard.jsx** - Category management, Sortable initialization
- **CategoryCard.jsx** - Task list, task Sortable, CRUD operations
- **TaskItem.jsx** - Task display/edit, subtask management
- **Subtasks.jsx** - Subtask list with add/toggle/delete
- **Sidebar.jsx** - Navigation menu with mobile hamburger
- **useEffect** - Real-time Firestore listeners, Sortable cleanup
- **useMemo** - Memoized Firestore references for performance
- **useState** - Local component state management

---

## 🎓 Lessons Learned

### **Development Process:**
1. **Test both platforms immediately** - Don't wait until "mobile day"
2. **Keyboard interactions matter** - Always add Enter key support for inputs
3. **Mobile != Desktop** - Touch devices need different UX patterns
4. **Edge cases need specs** - Cascading behavior, empty states, long content
5. **Documentation helps** - Clear design docs prevent confusion later
6. **Component architecture pays off** - React migration made code more maintainable
7. **Modern tooling improves DX** - Vite hot reload and Tailwind save development time

### **Technical Insights:**
1. **SortableJS on mobile** - Requires `delay: 500, delayOnTouchOnly: true`
2. **Firebase real-time listeners** - Use `onSnapshot()` for live updates
3. **React component lifecycle** - useEffect cleanup prevents memory leaks
4. **Sortable cleanup critical** - Must destroy instances before recreating
5. **Relative time** - More user-friendly than ISO timestamps
6. **Tailwind utility-first** - Faster styling, consistent design system
7. **Component composition** - Breaking down UI into small pieces improves reusability

### **UX Principles:**
1. **Visual hierarchy** - Alternating backgrounds improve scannability
2. **Predictable behavior** - Users shouldn't be surprised by auto-actions
3. **User control** - Manual buttons > automatic sync (for MVP)
4. **Feedback matters** - Red dates draw attention (good for overdue, bad for completed)
5. **Keyboard users exist** - Support Enter, Escape, Tab navigation

---

## 🔮 Next Steps

### **Immediate (Next Session - November 9+):**
1. � **Test React implementation thoroughly**
   - Desktop: Chrome, Firefox, Safari
   - Mobile: Android Chrome, iOS Safari
   - Verify all November 5 bugs are resolved
2. 🔴 Implement subtask editing (inline edit mode like tasks)
3. 🟡 Add subtask reordering with SortableJS
4. 🟡 Verify mobile drag-and-drop with delay works smoothly
5. 🟡 Test category reordering scroll behavior

### **Short Term (This Week):**
6. Consider TypeScript migration for type safety
7. Add ESLint rules for code quality
8. Set up proper error boundaries in React
9. Optimize Firestore queries and listeners
10. Update all documentation with React patterns

### **Medium Term (Next 1-2 Weeks):**
11. Begin Google Calendar API integration
12. Implement Settings page for calendar selection
13. Create "Add to Calendar" button on tasks
14. Build "Today's Schedule" widget
15. Add Calendar tool to sidebar navigation

### **Long Term (Phase 1 - 2026):**
16. Complete Calendar integration MVP
17. Supply tracker tool
18. Resource database tool
19. Lesson planner tool
20. Settings page (preferences, calendar selection)

---

## 📞 Open Questions

1. **TypeScript:** Should we add TypeScript now or wait until Phase 2?
2. **Testing:** Add unit tests (Jest/Vitest) and e2e tests (Playwright)?
3. **Mobile Navigation:** Is the current hamburger menu working well enough?
4. **State Management:** Need Redux/Zustand for Calendar integration, or keep local state?
5. **PWA Timing:** When should we convert to Progressive Web App?

---

**Last Updated:** November 8, 2025 (React Migration Complete)  
**Status:** Active Development - Testing new React implementation  
**Next Milestone:** Calendar integration (Phase 1.1)
