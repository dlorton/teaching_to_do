# Quick Start Guide - Tomorrow's Session

**Date:** Tomorrow (after November 2, 2025)  
**Goal:** Build navigation menu + start Google Calendar integration

---

## 🎯 Today's Top Priority

### **Task #1: Build Navigation Menu** (Estimated: 1-2 hours)

This is a **prerequisite** for adding Calendar. We need navigation before we have multiple tools!

---

## 📋 Step-by-Step Checklist

### **Part 1: Navigation Menu Structure**

**What to build:**
- Left sidebar (~250px wide)
- Collapsible on mobile
- Menu items for each tool
- Active state highlighting

**Add this HTML** (inside `<body>`, before `.container`):

```html
<nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h2 class="app-title">Teacher Companion</h2>
        <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
    </div>
    
    <ul class="nav-menu">
        <li class="nav-item active" data-tool="todo">
            <span class="nav-icon">📋</span>
            <span class="nav-label">Todo List</span>
        </li>
        <li class="nav-item" data-tool="calendar">
            <span class="nav-icon">📅</span>
            <span class="nav-label">Calendar</span>
        </li>
        <li class="nav-item disabled" data-tool="supplies">
            <span class="nav-icon">🛒</span>
            <span class="nav-label">Supplies</span>
            <span class="coming-soon">Soon</span>
        </li>
        <li class="nav-item disabled" data-tool="resources">
            <span class="nav-icon">📚</span>
            <span class="nav-label">Resources</span>
            <span class="coming-soon">Soon</span>
        </li>
        <li class="nav-item disabled" data-tool="lessons">
            <span class="nav-icon">📖</span>
            <span class="nav-label">Lessons</span>
            <span class="coming-soon">Soon</span>
        </li>
    </ul>
    
    <div class="sidebar-footer">
        <div class="user-profile">
            <div class="user-avatar">👤</div>
            <div class="user-info">
                <div class="user-name" id="user-name">Loading...</div>
                <div class="user-email" id="user-email"></div>
            </div>
        </div>
    </div>
</nav>

<main class="main-content">
    <!-- Your existing .container goes here -->
</main>
```

---

### **Part 2: CSS for Sidebar**

**Add this CSS** (in `<style>` section):

```css
/* --- LAYOUT: SIDEBAR + MAIN CONTENT --- */
body {
    display: flex;
    margin: 0;
    padding: 0;
}

.sidebar {
    width: 250px;
    height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
}

.sidebar.collapsed {
    transform: translateX(-250px);
}

.main-content {
    margin-left: 250px;
    width: calc(100% - 250px);
    transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .main-content {
    margin-left: 0;
    width: 100%;
}

/* Sidebar Header */
.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.app-title {
    font-size: 1.3em;
    margin: 0;
    color: var(--accent-primary);
}

.sidebar-toggle {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.5em;
    cursor: pointer;
    padding: 5px;
    display: none; /* Show on mobile */
}

/* Navigation Menu */
.nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
    overflow-y: auto;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    transition: background 0.2s ease;
    color: var(--text-secondary);
}

.nav-item:hover:not(.disabled) {
    background: rgba(77, 182, 172, 0.1);
    color: var(--text-primary);
}

.nav-item.active {
    background: rgba(77, 182, 172, 0.2);
    color: var(--accent-primary);
    border-left: 3px solid var(--accent-primary);
}

.nav-item.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.nav-icon {
    font-size: 1.2em;
    margin-right: 12px;
}

.nav-label {
    flex-grow: 1;
}

.coming-soon {
    font-size: 0.7em;
    background: var(--border-color);
    padding: 2px 6px;
    border-radius: 3px;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 15px;
    border-top: 1px solid var(--border-color);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
}

.user-info {
    flex-grow: 1;
    overflow: hidden;
}

.user-name {
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    font-size: 0.8em;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Mobile: Show toggle, hide sidebar by default */
@media (max-width: 768px) {
    .sidebar-toggle {
        display: block;
    }
    
    .sidebar {
        transform: translateX(-250px);
    }
    
    .sidebar.open {
        transform: translateX(0);
    }
    
    .main-content {
        margin-left: 0;
        width: 100%;
    }
}
```

---

### **Part 3: JavaScript for Navigation**

**Add this JavaScript** (in `<script>` section):

```javascript
// --- NAVIGATION ---
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const navItems = document.querySelectorAll('.nav-item:not(.disabled)');

// Toggle sidebar on mobile
sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Handle navigation clicks
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.dataset.tool;
        
        // Update active state
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Switch tools
        switchTool(tool);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });
});

function switchTool(toolName) {
    // Hide all tool sections
    document.querySelectorAll('.tool-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected tool
    const toolSection = document.getElementById(`${toolName}-section`);
    if (toolSection) {
        toolSection.classList.remove('hidden');
    }
    
    console.log(`Switched to: ${toolName}`);
}

// Display user info in sidebar
auth.onAuthStateChanged(user => {
    if (user) {
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        
        if (userName) userName.textContent = user.displayName || 'Teacher';
        if (userEmail) userEmail.textContent = user.email;
        
        // Rest of your existing auth code...
    }
});
```

---

### **Part 4: Wrap Existing Todo List**

**Change your existing `.container` to:**

```html
<main class="main-content">
    <div id="todo-section" class="tool-section">
        <div class="container">
            <!-- All your existing todo list HTML -->
        </div>
    </div>
    
    <div id="calendar-section" class="tool-section hidden">
        <div class="container">
            <h1>📅 Calendar</h1>
            <p>Coming soon! We'll build this next.</p>
        </div>
    </div>
</main>
```

---

## ✅ Testing Checklist

After implementing navigation:

- [ ] Sidebar appears on left side
- [ ] "Todo List" is active (highlighted)
- [ ] Clicking "Calendar" switches active state
- [ ] On mobile (resize browser), sidebar collapses
- [ ] Toggle button (☰) shows on mobile
- [ ] Clicking toggle opens/closes sidebar on mobile
- [ ] User name/email appears in sidebar footer
- [ ] Desktop: sidebar always visible
- [ ] Mobile: sidebar slides in/out smoothly

---

## 🐛 Common Issues & Fixes

### **Issue: Sidebar overlaps todo list**
**Fix:** Make sure `.main-content` has `margin-left: 250px`

### **Issue: Mobile toggle doesn't work**
**Fix:** Check that `sidebarToggle` element exists (console.log it)

### **Issue: Active state doesn't change**
**Fix:** Verify `data-tool` attributes match function parameter

### **Issue: User info shows "Loading..." forever**
**Fix:** Make sure `auth.onAuthStateChanged` code runs after sidebar HTML loads

---

## 📚 After Navigation is Working

### **Next: Google Calendar API Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable "Google Calendar API"
4. No new credentials needed (you already have OAuth from Firebase Auth)
5. Update Firebase Auth scopes to include calendar access

**We'll tackle this together once navigation is done!**

---

## 💡 Tips

- Test on desktop first, then mobile
- Use browser DevTools (F12) to resize and test responsive behavior
- Console.log() is your friend for debugging
- Take breaks! This is a significant UI change
- If stuck, we'll debug together tomorrow

---

## 🎯 Success Criteria

You'll know it's working when:
1. ✅ Sidebar appears with all menu items
2. ✅ "Todo List" is active and highlighted
3. ✅ Your todo list still works perfectly
4. ✅ Clicking "Calendar" shows placeholder page
5. ✅ Mobile: Sidebar collapses and toggle button appears
6. ✅ User name shows in sidebar footer

Once these work, we're ready for Google Calendar! 🚀

---

Good luck, and see you tomorrow! Remember: small steps, test often, and don't hesitate to ask questions. 🎓
