(function () {
  let tasks = Storage.load();
  let currentFilter = 'all';
  let searchQuery = '';

  const taskForm = document.getElementById('taskForm');
  const titleInput = document.getElementById('taskTitleInput');
  const categorySelect = document.getElementById('taskCategorySelect');
  const dueDateInput = document.getElementById('taskDueDate');
  const listContainer = document.getElementById('taskListContainer');
  const filterContainer = document.getElementById('filterContainer');
  const searchInput = document.getElementById('searchInput');

  const uid = () => Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  const persist = () => Storage.save(tasks);
  const escapeHtml = (s) => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function render() {
    const filtered = tasks.filter(t => {
      if (currentFilter === 'active' && t.completed) return false;
      if (currentFilter === 'completed' && !t.completed) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery) 
          && !t.category.toLowerCase().includes(searchQuery)) return false;
      return true;
    });

    if (!filtered.length) {
      listContainer.innerHTML = `<div class="empty-state">📭 No tasks found.</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
        <div class="task-check ${t.completed ? 'completed' : ''}" data-toggle="${t.id}"></div>
        <div class="task-content">
          <div class="task-title">${escapeHtml(t.title)}</div>
          <div class="task-meta">
            <span class="task-category">${t.category}</span>
            <span class="task-due">📅 ${t.dueDate || 'No date'}</span>
          </div>
        </div>
        <button class="icon-btn delete" data-delete="${t.id}">🗑️</button>
      </div>
    `).join('');

    listContainer.querySelectorAll('[data-toggle]').forEach(el =>
      el.addEventListener('click', () => toggleTask(el.dataset.toggle)));
    listContainer.querySelectorAll('[data-delete]').forEach(el =>
      el.addEventListener('click', () => deleteTask(el.dataset.delete)));
  }

  function addTask(title, category, dueDate) {
    if (!title.trim()) return;
    tasks.push({ id: uid(), title: title.trim(), category, dueDate, completed: false });
    persist(); render();
  }
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    persist(); render();
  }
  function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (t) { t.completed = !t.completed; persist(); render(); }
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(titleInput.value, categorySelect.value, dueDateInput.value);
    titleInput.value = ''; dueDateInput.value = '';
  });

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  render();
})();