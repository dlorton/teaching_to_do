# Design Notes & Future Improvements

**Last Updated:** November 5, 2025  
**Purpose:** Track UX observations, technical debt, and improvement ideas

---

## 📱 Mobile Testing Feedback - November 5, 2025

### **Android Testing Results:**

**✅ Working Well:**
- Todo list functionality solid
- Firebase sync working
- Visual design translates well to mobile

**❌ Issues Identified:**
1. **Drag-and-drop scroll conflict** - Major UX problem
   - Attempting to scroll page accidentally triggers task dragging
   - Makes list unusable on touch devices
   - **Priority:** HIGH - must fix before Phase 1 complete

2. **Button size/spacing** - Not yet tested thoroughly
   - May need larger touch targets
   - May need more spacing between interactive elements

**Decisions Made:**
- Implement **Option A (Sidebar navigation)** for desktop
- Mobile will have **collapsible hamburger menu**
- Implement **hover-reveal controls** for desktop
- Mobile will need **alternative interaction pattern** (swipe or long-press)
- **Strategy:** Desktop-first development, then mobile-specific adaptations

---

## 🎨 UI/UX Concerns

### **Issue #1: Navigation Menu for Multiple Tools** ✅ *In Progress*
**Status:** Approved and ready to implement  
**Decision Date:** November 5, 2025  
**Approved Solution:** Option A (Sidebar)

**Current State:**
- Single-page app with only todo list functionality
- No navigation structure

**Problem:**
As we add Phase 1 features (Google Calendar, Supply Tracker, Resource Database, Lesson Planner), users need a way to navigate between tools.

**Requirements:**
- **Overarching menu system** to switch between:
  - 📋 Todo List (current page)
  - 📅 Calendar (Phase 1)
  - 🛒 Supply Tracker (Phase 1)
  - 📚 Resource Database (Phase 1)
  - 📖 Lesson Planner (Phase 1)
  - ⚙️ Settings (future)

**Proposed Solutions:**

#### **Option A: Side Navigation (Sidebar)** ⭐ *Recommended*
Left-side navigation panel with icons and labels
- **Pros:** Common pattern, easy to understand, always visible
- **Cons:** Takes horizontal space on small screens
- **Examples:** Gmail, Notion, Todoist
- **Mobile behavior:** Collapsible hamburger menu

#### **Option B: Top Navigation Bar**
Horizontal menu at the top with tabs/buttons
- **Pros:** Familiar pattern, good for desktop
- **Cons:** Limited space for many tools, scrolls away on mobile
- **Examples:** Google Calendar, Trello

#### **Option C: Bottom Navigation (Mobile-First)**
Bottom navigation bar (iOS/Android style)
- **Pros:** Thumb-friendly on mobile
- **Cons:** Unusual for desktop web apps
- **Examples:** Instagram, TikTok (mobile apps)

#### **Option D: Command Palette**
Keyboard shortcut to open tool switcher (Cmd/Ctrl + K)
- **Pros:** Power user friendly, no UI space needed
- **Cons:** Not discoverable for new users
- **Examples:** VS Code, Linear
- **Use as:** Secondary navigation, not primary

**Recommendation:**
- **Desktop:** Option A (Sidebar) - collapsible on mobile ✅ **APPROVED**
- **Mobile:** Hamburger menu with gesture support (avoid drag conflicts)
- **Secondary:** Option D (Command Palette) - for power users (Phase 2)
- **Implementation:** In progress - November 5, 2025

**Mobile-Specific Considerations:**
- Hamburger icon should be large and easily tappable (44x44px minimum)
- Swipe from left edge to open menu (common mobile pattern)
- Backdrop overlay when menu is open (tap outside to close)
- Smooth animation (300ms) for open/close
- Menu should overlay content, not push it (performance)

**Next Steps:**
1. Implement desktop sidebar (always visible)
2. Add mobile hamburger toggle and collapse logic
3. Test on Android (primary test device)
4. Test on iOS Safari (secondary)
5. Adjust based on feedback before moving to Calendar integration

**Design Considerations:**
```html
<nav class="sidebar">
  <div class="sidebar-header">
    <h2>Teacher Companion</h2>
  </div>
  <ul class="nav-menu">
    <li class="nav-item active">
      <span class="nav-icon">📋</span>
      <span class="nav-label">Todo List</span>
    </li>
    <li class="nav-item">
      <span class="nav-icon">📅</span>
      <span class="nav-label">Calendar</span>
    </li>
    <!-- More items... -->
  </ul>
  <div class="sidebar-footer">
    <div class="user-info">[User profile]</div>
  </div>
</nav>
```

---

### **Issue #2: Calendar-Todo Integration** ✅ *Decisions Finalized*
**Status:** Specification complete - ready for implementation  
**Date Added:** November 2, 2025  
**Date Finalized:** November 5, 2025

**Goal:**
Seamless bi-directional integration between todo list and calendar.

---

## ✅ **FINALIZED DECISIONS - Calendar Integration MVP**

### **Decision 1: Sync Method**
**Chosen:** Manual "Add to Calendar" Button (Option B)

- Tasks will have an optional "� Add to Calendar" button
- User explicitly chooses which tasks become calendar events
- Provides user control and predictable behavior
- Simple to implement and test

### **Decision 2: Calendar Event Type**
**Chosen:** Time-Block Events (Option B)

- User can select specific time when adding to calendar
- Default: All-day event (can optionally add specific times)
- Allows for better time management and scheduling
- More flexible than all-day only

**Implementation:**
- Show time picker when "Add to Calendar" clicked
- Default to all-day (checkboxes: "All day" checked by default)
- If unchecked, show start/end time inputs

### **Decision 3: Calendar → Todo Sync**
**Chosen:** "Today's Schedule" Widget (Option D) - *with enhancement option*

- Display read-only widget showing upcoming calendar events
- Shows next 5-10 events in sidebar or dashboard
- Does NOT automatically create tasks from calendar events
- Clean separation: calendar for viewing, tasks for action items

**Future Enhancement (Phase 2):**
- Option to manually create task from calendar event
- Button: "Create Task" on calendar event in widget
- Addresses concern: "may have to manually push calendar events to create tasks"

### **Decision 4: Task Completion Behavior**
**Chosen:** Do Nothing (Option D) - *with future enhancement note*

- Completing a task does NOT affect the linked calendar event
- User manages calendar separately
- Simple, predictable, no surprises

**Future Enhancement (Phase 2 or 3):**
- Option C consideration: "Completed Tasks" calendar
- Move completed task events to separate calendar
- Good for review and reflection
- **Note:** "Idea of a completed calendar would be nice for review and such"

### **Decision 5: Which Google Calendar**
**Chosen:** User Selects in Settings (Option B) - *with prominent UI*

- Settings page: "Default calendar for tasks"
- Dropdown showing all user's Google Calendars
- **Critical:** Make this SUPER APPARENT to user
  - Show selected calendar name in "Add to Calendar" confirmation
  - Display calendar indicator in settings and when adding events
  - Warning if no calendar selected
  
**UI Requirements:**
- Settings: Large, clear "📅 Default Calendar: [School Calendar]"
- Add to Calendar dialog: "This will add to: [School Calendar]"
- Visual indicator (color dot matching calendar color)
- **Goal:** User never wonders which calendar is being used/modified

---

## 📋 **Implementation Specification - MVP**

### **Phase 1: Core Features**

#### **1. Settings Page**
```
📅 Calendar Settings
├── Default Calendar: [Dropdown: Select calendar...]
├── Calendar color indicator: ● Green (School Calendar)
└── Note: "Tasks will be added to this calendar"
```

#### **2. "Add to Calendar" Button**
Location: On each task (when task has a due date)

```html
<button class="btn calendar-btn">📅 Add to Calendar</button>
```

Clicking opens modal:
```
Add to Calendar
─────────────────
Task: Grade homework
Due: November 8, 2025

☑ All day event
☐ Set specific time
   Start: [3:00 PM]
   End:   [4:00 PM]

Calendar: ● School Calendar

[Cancel] [Add Event]
```

#### **3. "Today's Schedule" Widget**
Location: Sidebar (below navigation menu)

```
📅 Today's Schedule
─────────────────
9:00 AM  Faculty Meeting
10:30 AM  3rd Grade Math
1:00 PM  Parent Conference
3:00 PM  Planning Period

[View Full Calendar →]
```

### **Phase 2: Enhancements**
- Button to create task from calendar event
- Mark calendar events as done when task completed
- "Completed Tasks" calendar (separate view)

---

### **Issue #3: Button Clutter** ✅ *Implementation Approved*

**Option A: Automatic Sync** (Aggressive)
- Every task with a due date automatically creates a calendar event
- Completing a task automatically updates the calendar event
- Deleting a task automatically removes the calendar event
- **Pros:** Seamless, no extra clicks
- **Cons:** Could clutter calendar with many tasks, less user control

**Option B: Manual "Add to Calendar" Button** (Conservative) ⭐ *Recommended for MVP*
- Tasks have an optional "📅 Add to Calendar" button
- User decides which tasks become calendar events
- **Pros:** User control, cleaner calendar
- **Cons:** Extra step, might forget to add important tasks

**Option C: Hybrid** (Smart)
- Auto-sync tasks tagged with specific category (e.g., "Important" or "Scheduled")
- Manual button for others
- **Pros:** Balance of automation and control
- **Cons:** More complex to implement and explain

**👉 Which approach do you prefer?**

---

### **Question 2: What Type of Calendar Events?**

When a task becomes a calendar event, what should it look like?

**Option A: All-Day Events**
- Task due date becomes an all-day event
- Example: "Grade homework" on Friday (all day)
- **Pros:** Simple, doesn't require time selection
- **Cons:** Doesn't help with time management

**Option B: Time-Block Events** (Requires time input)
- User selects specific time when adding to calendar
- Example: "Grade homework" on Friday 3:00 PM - 4:00 PM
- **Pros:** Better for time management and scheduling
- **Cons:** Extra input field, more complexity

**Option C: Reminders (Not Events)**
- Use Google Calendar "reminders" feature instead of events
- Appears in calendar but doesn't block time
- **Pros:** Clean, doesn't clutter schedule
- **Cons:** Different UI treatment, might be less visible

**👉 Which type makes most sense for teachers?**

---

### **Question 3: Which Calendar Events Sync Back to Tasks?**

When looking at Google Calendar, which events should appear in the todo list?

**Option A: Only Events Created from Tasks**
- One-way: tasks → calendar
- Calendar events don't create tasks automatically
- **Pros:** Simple, no clutter
- **Cons:** Missing integration opportunity

**Option B: All Events**
- Every calendar event appears as a task in todo list
- **Pros:** Complete visibility
- **Cons:** Too much clutter (meetings, lunch, etc. become tasks)

**Option C: Events with Specific Tag/Keyword**
- Only events marked "TODO" or in a specific calendar become tasks
- **Pros:** User control over what syncs
- **Cons:** Requires user to remember tagging convention

**Option D: Today's Events Widget (Read-Only)**
- Show "Today's Schedule" section in todo list sidebar
- Display next 5 events from calendar (read-only)
- Don't create actual tasks from calendar events
- **Pros:** Awareness without clutter
- **Cons:** One-way visibility, can't act on events from todo list

**👉 What level of calendar-to-todo sync do you want?**

---

### **Question 4: Task Completion Behavior**

When you complete a task that has a linked calendar event:

**Option A: Mark Calendar Event as Done**
- Event stays on calendar with a "✓" or strikethrough
- **Pros:** Historical record visible
- **Cons:** Clutters calendar view

**Option B: Delete Calendar Event**
- Completed task removes the event entirely
- **Pros:** Clean calendar
- **Cons:** No record it was completed

**Option C: Move to "Completed Tasks" Calendar**
- Events move to a separate calendar (can hide/show)
- **Pros:** Historical record, but can hide clutter
- **Cons:** Requires separate calendar setup

**Option D: Do Nothing**
- Task completion doesn't affect calendar
- User manually manages calendar separately
- **Pros:** Simple, predictable
- **Cons:** Duplicate work, events become stale

**👉 What feels right for your workflow?**

---

### **Question 5: Multiple Google Calendars**

Most users have multiple calendars (Personal, Work, School, etc.). Which should we use?

**Option A: Primary Calendar Only**
- All task events go to user's primary Google Calendar
- **Pros:** Simple, one place
- **Cons:** Mixes teaching tasks with personal events

**Option B: User Selects Calendar**
- Settings option: "Which calendar for todo tasks?"
- **Pros:** Flexibility, can separate work/personal
- **Cons:** Extra setup step

**Option C: Create "Teaching Tasks" Calendar**
- App auto-creates a dedicated calendar on first sync
- User can hide/show this calendar in Google Calendar
- **Pros:** Clean separation, easy to manage
- **Cons:** Another calendar to manage

**👉 What calendar setup makes sense?**

---

### **Summary: Recommended Starting Point (MVP)**

Based on simplicity and iterative development:

1. **Sync:** Manual "Add to Calendar" button *(Option B)*
2. **Event Type:** Time-block with optional time *(Option B, default to all-day)*
3. **Calendar → Todo:** Today's Events Widget only *(Option D)*
4. **Completion:** Do nothing to calendar event *(Option D - user manages)*
5. **Calendar:** User selects in settings *(Option B)*

**This gives us:**
- Simple first implementation
- User control and predictability
- Easy to test and iterate
- Can enhance with auto-sync in Phase 2

**👉 Does this MVP sound good, or do you want to adjust any of these decisions?**

---

### **Issue #3: Button Clutter** ✅ *Implementation Approved*
**Status:** Identified, not yet addressed  
**Severity:** Medium (will worsen as features grow)

**Current State:**
Each task currently displays 2-3 buttons:
- Edit button (gray)
- Delete button (red)
- *(Future: More actions like duplicate, move, archive, etc.)*

Each category displays 2 buttons:
- Edit button
- Delete button

**Problem:**
- Visual clutter increases with more buttons
- Buttons take up horizontal space (especially on mobile)
- Important content (task text) gets overshadowed by controls
- Cognitive load: too many visible options at once

**User Testing Observations:**
- *"The interface feels busy with all the buttons"*
- *"On mobile, there's not much room for task text"*

**Proposed Solutions:**

#### **Option A: Hover-Reveal Controls** ⭐ *Recommended*
Show buttons only when hovering over a task/category
- **Pros:** Clean default view, reduces visual noise
- **Cons:** Not great for touch devices (no hover state)
- **Implementation:** CSS `:hover` to show `.button-container`

```css
.task-list li .button-container {
    opacity: 0;
    transition: opacity 0.2s;
}
.task-list li:hover .button-container {
    opacity: 1;
}
```

#### **Option B: Icon-Only Buttons**
Replace text buttons with icons (✏️ Edit, 🗑️ Delete)
- **Pros:** Takes less space, modern look
- **Cons:** Requires icon library, might be less clear
- **Implementation:** Use emoji or icon font (Feather Icons, Lucide)

#### **Option C: Dropdown Menu (Ellipsis "⋯")**
Single "⋯" button that opens a menu with all actions
- **Pros:** Scales well with many actions, very clean
- **Cons:** Extra click required, more complex to implement
- **Implementation:** Custom dropdown or use `<details>` element
- **Examples:** Gmail, Trello, Notion

#### **Option D: Swipe Actions (Mobile-First)**
Swipe left to reveal delete, swipe right to reveal edit
- **Pros:** Native mobile feel, very clean default view
- **Cons:** Desktop users might not discover it, requires JS
- **Implementation:** Touch event listeners
- **Examples:** iOS Mail, Todoist mobile

#### **Option E: Compact Mode Toggle**
Button to toggle between "Normal" and "Compact" view
- **Pros:** User choice, accommodates different preferences
- **Cons:** Adds another control, doesn't solve core issue
- **Implementation:** Settings stored in Firestore user preferences

**Recommendation for Phase 1:**
- Implement **Option A (Hover-Reveal)** for desktop
- Add **Option D (Swipe Actions)** in Phase 2 when focusing on mobile

**References for Inspiration:**
- [Todoist](https://todoist.com) - Minimal, hover-reveal controls
- [Things 3](https://culturedcode.com/things/) - Clean, gesture-based
- [TickTick](https://ticktick.com) - Icon buttons, dropdown menus
- [Linear](https://linear.app) - Keyboard shortcuts, minimal UI

---

**Note:** This is part of larger mobile UX strategy (see Mobile Testing Feedback section).

---

### **Issue #4: Mobile Drag-and-Drop Conflicts** 🚨 *Critical - High Priority*
**Status:** Identified, needs immediate fix  
**Date Identified:** November 5, 2025 (Android testing)  
**Severity:** Critical (makes mobile unusable)

**Problem:**
SortableJS drag-and-drop interferes with normal scrolling on Android:
- Attempting to scroll causes accidental task dragging
- Makes the todo list frustrating to use on touch devices
- Prevents users from navigating their task lists

**Root Cause:**
SortableJS treats touch events as drag initiators, conflicts with native scroll behavior.

**Proposed Solutions:**

#### **Option A: Disable Drag-and-Drop on Mobile** (Quick fix)
- Detect mobile devices and disable SortableJS
- **Pros:** Immediate fix, scroll works normally
- **Cons:** Lose reordering functionality on mobile
- **Implementation:** Check `window.innerWidth` or user agent

```javascript
const isMobile = window.innerWidth <= 768;
if (!isMobile) {
    new Sortable(taskList, { /* ... */ });
}
```

#### **Option B: Long-Press to Activate Drag Mode** ⭐ *Recommended*
- Require long-press (500ms) before drag begins
- Visual feedback: task highlights when drag mode active
- **Pros:** Keeps functionality, prevents accidents
- **Cons:** Requires SortableJS configuration or custom implementation

```javascript
new Sortable(taskList, {
    delay: 500, // 500ms delay before drag starts
    delayOnTouchOnly: true, // Only delay on touch devices
    // ...
});
```

#### **Option C: Dedicated "Reorder Mode"**
- Add "Reorder Tasks" button (like category reordering)
- When active: show drag handles, disable other interactions
- When inactive: normal scrolling and interactions
- **Pros:** Clear, intentional, no conflicts
- **Cons:** Extra step, mode switching

#### **Option D: Up/Down Arrow Buttons (Mobile-Only)**
- Replace drag-and-drop with arrow buttons on each task
- Click ↑ to move up, ↓ to move down
- **Pros:** Simple, clear, no gesture conflicts
- **Cons:** Tedious for long lists, many taps for big moves

**Recommended Implementation:**
1. **Phase 1:** Option B (Long-press) - balances UX and functionality
2. **Test:** Verify 500ms delay feels natural on Android
3. **Fallback:** Option A (disable) if long-press doesn't work well
4. **Phase 2:** Consider Option C (Reorder Mode) for power users

**Testing Checklist:**
- [ ] Test scroll behavior on Android Chrome
- [ ] Test long-press drag initiation
- [ ] Verify visual feedback when drag mode activates
- [ ] Test on iOS Safari (behavior may differ)
- [ ] Confirm desktop drag-and-drop still works normally

---

### **Issue #5: Date Input Clarity** ✅ *Addressed*
**Status:** Partially resolved  
**Date Fixed:** November 2, 2025

**Original Problem:**
Users didn't know what the empty date input was for when creating tasks.

**Solution Implemented:**
Added `title` attribute with tooltip:
```html
<input type="date" class="task-due-date-input" 
       title="Optional: Set a due date for this task">
```

**Remaining Improvement:**
Consider adding a small label above or icon next to the date input:
```html
<label class="input-label">📅 Due date (optional)</label>
<input type="date" class="task-due-date-input">
```

---

### **Issue #3: Category Visual Distinction** ✅ *Implemented*
**Status:** Completed  
**Date Fixed:** November 2, 2025

**Original Request:**
Make categories visually distinct with alternating backgrounds for better UI aesthetics.

**Solution Implemented:**
Added alternating background colors to categories:
- Even categories: `#1E1E1E` (default `--bg-secondary`)
- Odd categories: `#252525` (slightly lighter)

**CSS Added:**
```css
.category-block.alternate { 
    background: #252525; /* Slightly lighter than bg-secondary */
}
```

**JavaScript Logic:**
```javascript
categories.forEach((category, index) => {
    const categoryBlock = document.createElement('div');
    categoryBlock.className = 'category-block';
    if (index % 2 === 1) {
        categoryBlock.classList.add('alternate');
    }
    // ...
});
```

**Result:**
Subtle visual separation between categories without being too pronounced. Creates a more polished, organized appearance.

---

### **Issue #4: Edit Mode Clarity**
**Status:** Working, could be improved  
**Severity:** Low

**Current Behavior:**
When editing a task:
- Text input appears
- Date input appears
- Save and Cancel buttons appear

**Potential Improvements:**
- Add visual indicator that you're in "edit mode" (e.g., border color change)
- Show hint text: *"Editing task - press Enter to save, Esc to cancel"*
- Support keyboard shortcuts (Enter = save, Esc = cancel)

**Future Enhancement:**
```javascript
// Add keyboard support in edit mode
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveBtn.click();
    } else if (e.key === 'Escape') {
        cancelBtn.click();
    }
});
```

---

## 🔧 Technical Debt

### **Code Organization**
**Status:** Low priority, future refactor

**Current State:**
- Single `index.html` file with inline CSS and JavaScript
- ~676 lines (growing)

**When to Refactor:**
- When file exceeds ~1000 lines
- When adding multiple new features in Phase 1
- Before introducing a team member

**Proposed Structure:**
```
/src
  /css
    styles.css
    components.css
  /js
    app.js
    firebase-config.js
    ui-handlers.js
    task-manager.js
  /components (if using web components)
index.html
```

---

### **Firestore Security Rules**
**Status:** Basic rules in place, needs enhancement

**Current Rules:**
Users can only read/write their own data.

**Future Enhancements (Phase 2-3):**
- Add validation rules (e.g., task text max length)
- Rate limiting to prevent abuse
- Shared resource permissions for public features

---

## 📱 Mobile Responsiveness

### **Current State:** ⚠️ Needs Testing
**Last Mobile Test:** Not yet tested on real devices

**Known Issues:**
- Date inputs might be hard to tap on small screens
- Multiple buttons might wrap awkwardly
- Drag-and-drop might not work on touch devices (SortableJS should handle this)

**Phase 2 Checklist:**
- [ ] Test on iOS Safari (iPhone SE, iPhone 14)
- [ ] Test on Android Chrome (various screen sizes)
- [ ] Ensure all buttons are at least 44x44px (Apple HIG recommendation)
- [ ] Test drag-and-drop on touch screens
- [ ] Add viewport meta tag optimizations
- [ ] Consider bottom navigation for mobile (common pattern)

---

## ⌨️ Keyboard Shortcuts (Future)

**Why:** Power users love keyboard shortcuts for speed

**Proposed Shortcuts:**
- `N` - New task in current category
- `C` - New category
- `E` - Edit selected task
- `Delete/Backspace` - Delete selected task
- `Cmd/Ctrl + Enter` - Complete task
- `Cmd/Ctrl + K` - Focus search (when we add search)
- `Esc` - Cancel current action
- `?` - Show keyboard shortcuts help

**Implementation Priority:** Phase 2 (after core features stable)

---

## 🎨 Theming & Customization (Future)

### **Current State:**
- Dark mode only (well-designed!)
- Fixed color scheme

### **Future Options:**
1. **Light Mode Toggle**
   - Store preference in Firestore user settings
   - Use CSS custom properties for easy switching

2. **Custom Color Themes**
   - Predefined themes (Forest, Ocean, Sunset)
   - Or: Custom color picker for accent color

3. **Font Size Settings**
   - Small, Medium, Large options
   - Accessibility consideration

**Priority:** Phase 2 or 3 (after core features)

---

## 🔔 Notification Strategy (Future)

### **Task Reminders**
When we add notifications in Phase 2:

**Options:**
1. **Web Push Notifications**
   - Browser notifications (requires user permission)
   - Works even when tab is closed
   - Implementation: Firebase Cloud Messaging

2. **In-App Reminders**
   - Toast/banner notifications when app is open
   - Less intrusive

3. **Email Reminders**
   - Daily digest of upcoming tasks
   - Requires email integration

**Considerations:**
- Don't be annoying (user controls frequency)
- Smart defaults (reminders at 9 AM, day before deadline)
- Snooze functionality

---

## 📊 Analytics & Insights (Future)

### **Privacy-First Analytics**
NO third-party tracking (Google Analytics, etc.)

**What to Track (Ethically):**
- Personal productivity metrics (stored in user's own Firestore)
  - Tasks completed per day/week
  - Average time to complete tasks
  - Most productive day of week
  - Task completion streaks

**What NOT to Track:**
- No user behavior tracking for ads
- No selling data to third parties
- No cross-site tracking

**Implementation:**
- Store metrics in user's own document
- User owns and can export their data
- Optional feature (can be disabled)

---

## 🎯 Feature Prioritization Framework

When deciding what to build next, evaluate features on:

1. **User Value** (1-10): How much does this help teachers?
2. **Development Time** (1-10): How long to implement? (1 = quick)
3. **Maintenance Burden** (1-10): How much ongoing work? (1 = minimal)
4. **Learning Value** (1-10): How much will you learn building this?

**Priority Score:** `(User Value × 2) + (10 - Dev Time) + (10 - Maintenance) + Learning Value`

Higher score = higher priority

**Example:**
- **Google Calendar Integration**
  - User Value: 9 (teachers need calendar)
  - Dev Time: 6 (moderate - OAuth + API calls)
  - Maintenance: 3 (minimal - stable API)
  - Learning: 9 (OAuth, REST APIs)
  - **Score:** 9×2 + 4 + 7 + 9 = **38** ⭐ High Priority!

- **Custom Color Themes**
  - User Value: 4 (nice to have)
  - Dev Time: 3 (quick - CSS variables)
  - Maintenance: 2 (very low)
  - Learning: 3 (CSS, user preferences)
  - **Score:** 4×2 + 7 + 8 + 3 = **26** → Lower Priority

---

## 🐛 Known Minor Issues

### **Low Priority Bugs:**

1. **Timestamp formatting edge cases**
   - Doesn't account for timezones (uses local time)
   - "Just now" might show for tasks created in future (unlikely but possible)
   - **Fix when:** Phase 1 polish pass

2. **Drag-and-drop visual feedback**
   - Ghost element could be styled better
   - No visual indicator of drop zones
   - **Fix when:** Phase 2 (mobile optimization)

3. **Long task names overflow**
   - Very long task text might break layout
   - No character limit enforced
   - **Fix when:** Phase 1 polish pass
   - **Solution:** Add `text-overflow: ellipsis` or character limit

4. **No loading states**
   - When saving to Firebase, no visual feedback
   - Could add spinner or "Saving..." indicator
   - **Fix when:** Phase 2 (UX polish)

---

## 💡 Wild Ideas (Backlog)

Random feature ideas to explore later:

- **Voice Input** - "Add task: Grade homework by Friday"
- **Task Templates** - "Weekly lesson plan" auto-creates 5 tasks
- **Pomodoro Timer** - Built-in focus timer for tasks
- **Task Dependencies** - "Can't start B until A is done"
- **Habit Tracking** - Daily recurring tasks with streaks
- **Collaboration** - Share categories with co-teachers
- **Dark Mode Schedule** - Auto-switch based on time
- **Task Import/Export** - CSV, JSON, or from other apps
- **Browser Extension** - Quick-add tasks from any webpage
- **Siri/Alexa Integration** - "Hey Siri, add task..."

---

## 📚 Learning Resources for Future Features

### **Google Calendar API**
- [Official Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 for Client-side Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Tutorial: Building a Calendar App](https://web.dev/articles/calendar-integration)

### **Progressive Web Apps (PWA)**
- [web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Service Workers: An Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
- [PWA Checklist](https://web.dev/pwa-checklist/)

### **UI/UX for Task Managers**
- [Laws of UX](https://lawsofux.com/) - Psychology principles
- [Refactoring UI](https://www.refactoringui.com/) - Design tips
- [Material Design](https://material.io/design) - Google's design system
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### **Firebase Advanced**
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Security Rules Guide](https://firebase.google.com/docs/rules/get-started)
- [Cloud Functions](https://firebase.google.com/docs/functions) - For backend logic

---

## 🔄 Document Version History

- **v1.0** - November 2, 2025 - Initial design notes created
  - Documented button clutter concern
  - Added date input clarity improvement
  - Listed technical debt items
  - Created feature prioritization framework

- **v1.1** - November 2, 2025 - Evening update
  - ✅ Added Issue #1: Navigation menu requirement for multi-tool app
  - ✅ Added Issue #2: Calendar-Todo integration specifications
  - ✅ Documented Issue #3: Alternating category backgrounds (implemented)
  - Reorganized issue numbering
  - Added sidebar navigation mockup and recommendations

- **v2.0** - November 5, 2025 - Major update after Android testing
  - 📱 Added Mobile Testing Feedback section
  - ✅ Issue #1: Approved Option A (Sidebar) - implementation in progress
  - 🚧 Issue #2: Expanded into discussion questions - awaiting user decisions
  - ✅ Issue #3: Approved hover-reveal controls for desktop
  - 🚨 Issue #4: Added critical drag-and-drop mobile conflict
  - ✅ Issue #5: Renamed from Issue #2 (Date Input Clarity)
  - Updated Issue #6: Category backgrounds (formerly #3)
  - Documented mobile-first strategy and divergent UX patterns
  - Updated all statuses based on decisions and testing feedback
