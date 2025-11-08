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

## 🎯 Major Decisions

### **1. Technology Stack**
**Decision:** Vanilla JavaScript (no framework)  
**Date:** November 2, 2025  
**Rationale:**
- Better for learning fundamentals
- No build tool complexity
- Easy to refactor to React/Vue later (Phase 2-3)
- Lightweight and fast

**When to Reconsider:** If UI state becomes too complex (many interdependent components)

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

## 🚀 Current Status (November 5, 2025 - End of Day)

### **What's Working:**
- ✅ Google Sign-In (Firebase Auth)
- ✅ Todo list (create, edit, delete, complete)
- ✅ Categories (create, edit, delete, reorder)
- ✅ Due dates (set, edit, remove, smart overdue highlighting)
- ✅ Timestamps (relative time display)
- ✅ Subtasks (add, delete, complete, Enter key support)
- ✅ Navigation sidebar (desktop - mobile needs debugging)
- ✅ Firebase real-time sync
- ✅ Dark mode design
- ✅ Task completion cascades to subtasks
- ✅ Trash can icons for delete buttons
- ✅ Completed tasks don't show red dates

### **Critical Issues (Release Blockers):**
- ❌ Mobile navigation not visible (hamburger menu)
- ❌ Mobile drag-and-drop prevents scrolling

### **High Priority Bugs:**
- ❌ Task reordering broken (snaps back after drag)
- ❌ Subtask editing not implemented

### **Medium Priority:**
- ❌ Subtask reordering not implemented
- ❌ Category reordering blocks mouse wheel scroll

**Next Session Priority:** Fix the 2 critical mobile issues first, then tackle high-priority bugs.

---

## 📚 Code Architecture

### **File Structure:**
```
index.html              Main app (HTML + CSS + JavaScript inline)
design_plan.md          Phase 0-3 roadmap and technical decisions
design_notes.md         UX observations, bug tracking, feature ideas
TESTING_SUMMARY.md      Detailed test results (Nov 5)
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

### **Key Functions:**
- `renderCategories()` - Displays all categories
- `renderTasks()` - Displays tasks within a category
- `toggleTaskEditMode()` - Switches between view/edit mode
- `addTask()` - Creates new task in Firestore
- `updateTask()` - Updates task text and due date
- `deleteTask()` - Removes task from Firestore
- `toggleTaskComplete()` - Marks task complete/incomplete
- `addSubtask()` - Adds subtask to task.subtasks array
- `toggleSubtaskComplete()` - Marks subtask complete/incomplete
- `deleteSubtask()` - Removes subtask from array
- `formatTimestamp()` - Converts to relative time ("5 mins ago")
- `formatDate()` - Formats due date display
- `initializeSortables()` - Sets up drag-and-drop with SortableJS

---

## 🎓 Lessons Learned

### **Development Process:**
1. **Test both platforms immediately** - Don't wait until "mobile day"
2. **Keyboard interactions matter** - Always add Enter key support for inputs
3. **Mobile != Desktop** - Touch devices need different UX patterns
4. **Edge cases need specs** - Cascading behavior, empty states, long content
5. **Documentation helps** - Clear design docs prevent confusion later

### **Technical Insights:**
1. **SortableJS on mobile** - Requires `delay: 500, delayOnTouchOnly: true`
2. **Firebase real-time listeners** - Use `onSnapshot()` for live updates
3. **Data attributes** - Perfect for storing metadata (taskId, categoryId)
4. **Toggle patterns** - Essential for edit modes and UI state
5. **Relative time** - More user-friendly than ISO timestamps

### **UX Principles:**
1. **Visual hierarchy** - Alternating backgrounds improve scannability
2. **Predictable behavior** - Users shouldn't be surprised by auto-actions
3. **User control** - Manual buttons > automatic sync (for MVP)
4. **Feedback matters** - Red dates draw attention (good for overdue, bad for completed)
5. **Keyboard users exist** - Support Enter, Escape, Tab navigation

---

## 🔮 Next Steps

### **Immediate (Next Session - November 6):**
1. 🔴 Fix mobile navigation visibility (debug CSS, hamburger button)
2. 🔴 Add SortableJS delay for mobile touch (delay: 500, delayOnTouchOnly: true)
3. 🔴 Fix task reordering (add Firebase order update on drag end)
4. 🔴 Implement subtask editing (toggleSubtaskEditMode function)

### **Short Term (This Week):**
5. 🟡 Add subtask reordering with SortableJS
6. 🟡 Fix category reordering scroll issue
7. Test all fixes thoroughly on desktop and mobile
8. Update documentation with solutions

### **Medium Term (Next Week):**
9. Begin Google Calendar API integration
10. Implement Settings page for calendar selection
11. Create "Add to Calendar" button on tasks
12. Build "Today's Schedule" widget

### **Long Term (Phase 1):**
13. Complete Calendar integration MVP
14. Supply tracker
15. Resource database
16. Lesson planner
10. Replace delete buttons with icons
11. Implement hover-reveal controls (desktop)
12. Fix category reordering scroll issue
13. Polish empty space issues

### **Long Term (Phase 1):**
14. Google Calendar API integration
15. Supply tracker
16. Resource database
17. Lesson planner

---

## 📞 Open Questions

1. **Mobile Navigation:** Should we switch to bottom nav bar if sidebar feels awkward?
2. **Drag-and-Drop:** If 500ms delay feels sluggish, disable entirely on mobile?
3. **Subtask Depth:** Should we allow subtasks of subtasks (4 levels)?
4. **Keyboard Shortcuts:** Add power-user shortcuts (Cmd+K for command palette)?
5. **Export/Import:** Should users be able to backup their data?

---

**Last Updated:** November 5, 2025 (Post-Testing)  
**Status:** Active Development - Fixing critical mobile issues  
**Next Milestone:** Mobile-ready MVP (no critical bugs)
