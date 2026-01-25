// App state
const appState = {
    lists: [],
    nextListId: 1,
    nextItemId: 1,
    darkTheme: false
};

// DOM elements
const listsContainer = document.getElementById('listsContainer');
const addListBtn = document.getElementById('addListBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const clearBtn = document.getElementById('clearBtn');
const themeToggle = document.getElementById('themeToggle');
const importExportModal = document.getElementById('importExportModal');
const clearModal = document.getElementById('clearModal');
const notification = document.getElementById('notification');

// Initialize the app
function initApp() {
    loadFromLocalStorage();
    setupTheme();
    renderLists();
    setupEventListeners();
}

// Setup theme from localStorage
function setupTheme() {
    const savedTheme = localStorage.getItem('multiListManagerTheme');
    appState.darkTheme = savedTheme === 'dark';
    
    if (appState.darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Toggle theme
function toggleTheme() {
    appState.darkTheme = !appState.darkTheme;
    
    if (appState.darkTheme) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('multiListManagerTheme', 'dark');
        showNotification('Dark theme enabled', 'success');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('multiListManagerTheme', 'light');
        showNotification('Light theme enabled', 'success');
    }
}

// Load data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('multiListManager');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState.lists = parsedData.lists || [];
            appState.nextListId = parsedData.nextListId || 1;
            appState.nextItemId = parsedData.nextItemId || 1;
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            showNotification('Error loading saved data', 'error');
        }
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    const dataToSave = {
        lists: appState.lists,
        nextListId: appState.nextListId,
        nextItemId: appState.nextItemId
    };
    localStorage.setItem('multiListManager', JSON.stringify(dataToSave));
}

// Render all lists
function renderLists() {
    listsContainer.innerHTML = '';
    
    if (appState.lists.length === 0) {
        listsContainer.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 40px; color: var(--gray-color);">
                <i class="fas fa-clipboard-list" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h2 style="margin-bottom: 15px;">No Lists Yet</h2>
                <p style="max-width: 500px; margin: 0 auto 25px;">Create your first list to get started! Click the "Add New List" button above.</p>
                <button class="btn btn-primary" id="addFirstListBtn">
                    <i class="fas fa-plus"></i> Create Your First List
                </button>
            </div>
        `;
        
        // Add event listener to the "Create Your First List" button
        document.getElementById('addFirstListBtn')?.addEventListener('click', () => {
            addNewList();
        });
        return;
    }
    
    appState.lists.forEach(list => {
        const listElement = createListElement(list);
        listsContainer.appendChild(listElement);
    });
}

// Create a list element
function createListElement(list) {
    const listElement = document.createElement('div');
    listElement.className = 'list-card';
    listElement.dataset.listId = list.id;
    
    // Create list header with title and actions
    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';
    
    const listTitle = document.createElement('div');
    listTitle.className = 'list-title';
    listTitle.textContent = list.name;
    listTitle.addEventListener('click', () => {
        enableListTitleEditing(list.id);
    });
    
    const listTitleInput = document.createElement('input');
    listTitleInput.className = 'list-title-input';
    listTitleInput.value = list.name;
    listTitleInput.style.display = 'none';
    listTitleInput.addEventListener('blur', () => {
        updateListTitle(list.id, listTitleInput.value);
    });
    listTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            listTitleInput.blur();
        }
    });
    
    const listActions = document.createElement('div');
    listActions.className = 'list-actions';
    
    const deleteListBtn = document.createElement('button');
    deleteListBtn.className = 'icon-btn delete-list-btn';
    deleteListBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteListBtn.title = 'Delete List';
    deleteListBtn.addEventListener('click', () => {
        deleteList(list.id);
    });
    
    listActions.appendChild(deleteListBtn);
    listHeader.appendChild(listTitle);
    listHeader.appendChild(listTitleInput);
    listHeader.appendChild(listActions);
    
    // Create add item form
    const addItemForm = document.createElement('form');
    addItemForm.className = 'add-item-form';
    
    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.className = 'item-input';
    itemInput.placeholder = 'Add a new item...';
    
    const addItemBtn = document.createElement('button');
    addItemBtn.type = 'submit';
    addItemBtn.className = 'btn btn-primary';
    addItemBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    
    addItemForm.appendChild(itemInput);
    addItemForm.appendChild(addItemBtn);
    
    // Create items list
    const itemsList = document.createElement('ul');
    itemsList.className = 'items-list';
    
    if (list.items.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-list-message';
        emptyMessage.textContent = 'No items in this list yet. Add some above!';
        itemsList.appendChild(emptyMessage);
    } else {
        list.items.forEach(item => {
            const listItem = createListItemElement(list.id, item);
            itemsList.appendChild(listItem);
        });
    }
    
    // Create list stats
    const listStats = document.createElement('div');
    listStats.className = 'list-stats';
    
    const completeCount = list.items.filter(item => item.complete).length;
    const totalCount = list.items.length;
    
    listStats.innerHTML = `
        <span>Complete: <span class="complete-count">${completeCount}</span></span>
        <span>Total: <span class="total-count">${totalCount}</span></span>
    `;
    
    // Add event listeners
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (itemInput.value.trim()) {
            addListItem(list.id, itemInput.value.trim());
            itemInput.value = '';
            itemInput.focus();
        }
    });
    
    // Assemble the list element
    listElement.appendChild(listHeader);
    listElement.appendChild(addItemForm);
    listElement.appendChild(itemsList);
    listElement.appendChild(listStats);
    
    return listElement;
}

// Create a list item element
function createListItemElement(listId, item) {
    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    if (item.complete) {
        listItem.classList.add('complete');
    }
    listItem.dataset.itemId = item.id;
    
    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    
    const itemCheckbox = document.createElement('input');
    itemCheckbox.type = 'checkbox';
    itemCheckbox.className = 'item-checkbox';
    itemCheckbox.checked = item.complete || false;
    itemCheckbox.addEventListener('change', () => {
        toggleItemComplete(listId, item.id, itemCheckbox.checked);
    });
    
    const itemText = document.createElement('span');
    itemText.className = 'item-text';
    if (item.complete) {
        itemText.classList.add('complete');
    }
    itemText.textContent = item.text;
    itemText.addEventListener('click', () => {
        enableListItemEditing(listId, item.id);
    });
    
    const itemTextInput = document.createElement('input');
    itemTextInput.type = 'text';
    itemTextInput.className = 'item-text-input';
    itemTextInput.value = item.text;
    itemTextInput.style.display = 'none';
    itemTextInput.addEventListener('blur', () => {
        updateListItemText(listId, item.id, itemTextInput.value);
    });
    itemTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            itemTextInput.blur();
        }
    });
    
    const itemActions = document.createElement('div');
    itemActions.className = 'item-actions';
    
    // Create complete/incomplete button
    const toggleCompleteBtn = document.createElement('button');
    toggleCompleteBtn.className = `icon-btn ${item.complete ? 'incomplete-btn' : 'complete-btn'}`;
    toggleCompleteBtn.innerHTML = item.complete ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
    toggleCompleteBtn.title = item.complete ? 'Mark as Incomplete' : 'Mark as Complete';
    toggleCompleteBtn.addEventListener('click', () => {
        toggleItemComplete(listId, item.id, !item.complete);
    });
    
    const deleteItemBtn = document.createElement('button');
    deleteItemBtn.className = 'icon-btn delete-list-btn';
    deleteItemBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteItemBtn.title = 'Delete Item';
    deleteItemBtn.addEventListener('click', () => {
        deleteListItem(listId, item.id);
    });
    
    itemContent.appendChild(itemCheckbox);
    itemContent.appendChild(itemText);
    itemContent.appendChild(itemTextInput);
    itemActions.appendChild(toggleCompleteBtn);
    itemActions.appendChild(deleteItemBtn);
    
    listItem.appendChild(itemContent);
    listItem.appendChild(itemActions);
    
    return listItem;
}

// Add a new list
function addNewList() {
    const listName = `List ${appState.nextListId}`;
    const newList = {
        id: appState.nextListId++,
        name: listName,
        items: []
    };
    
    appState.lists.push(newList);
    saveToLocalStorage();
    renderLists();
    showNotification('New list created successfully');
    
    // Focus on the new list's title for editing
    setTimeout(() => {
        const newListElement = document.querySelector(`[data-list-id="${newList.id}"]`);
        if (newListElement) {
            const listTitle = newListElement.querySelector('.list-title');
            if (listTitle) {
                listTitle.click();
            }
        }
    }, 100);
}

// Enable list title editing
function enableListTitleEditing(listId) {
    const listElement = document.querySelector(`[data-list-id="${listId}"]`);
    if (!listElement) return;
    
    const listTitle = listElement.querySelector('.list-title');
    const listTitleInput = listElement.querySelector('.list-title-input');
    
    if (listTitle && listTitleInput) {
        listTitle.style.display = 'none';
        listTitleInput.style.display = 'block';
        listTitleInput.focus();
        listTitleInput.select();
    }
}

// Update list title
function updateListTitle(listId, newTitle) {
    if (!newTitle.trim()) {
        newTitle = `List ${listId}`;
    }
    
    const list = appState.lists.find(l => l.id === listId);
    if (list) {
        list.name = newTitle.trim();
        saveToLocalStorage();
        
        const listElement = document.querySelector(`[data-list-id="${listId}"]`);
        if (listElement) {
            const listTitle = listElement.querySelector('.list-title');
            const listTitleInput = listElement.querySelector('.list-title-input');
            
            if (listTitle && listTitleInput) {
                listTitle.textContent = newTitle.trim();
                listTitle.style.display = 'block';
                listTitleInput.style.display = 'none';
            }
        }
        
        showNotification('List title updated');
    }
}

// Delete a list
function deleteList(listId) {
    appState.lists = appState.lists.filter(list => list.id !== listId);
    saveToLocalStorage();
    renderLists();
    showNotification('List deleted successfully');
}

// Add a list item
function addListItem(listId, itemText) {
    const list = appState.lists.find(l => l.id === listId);
    if (list) {
        const newItem = {
            id: appState.nextItemId++,
            text: itemText,
            complete: false
        };
        
        list.items.push(newItem);
        saveToLocalStorage();
        
        // Update the list's items list
        const listElement = document.querySelector(`[data-list-id="${listId}"]`);
        if (listElement) {
            const itemsList = listElement.querySelector('.items-list');
            const emptyMessage = listElement.querySelector('.empty-list-message');
            const listStats = listElement.querySelector('.list-stats');
            
            if (emptyMessage) {
                itemsList.removeChild(emptyMessage);
            }
            
            const listItem = createListItemElement(listId, newItem);
            itemsList.appendChild(listItem);
            
            // Update list stats
            updateListStats(listElement, list);
        }
        
        showNotification('Item added to list');
    }
}

// Toggle item complete status
function toggleItemComplete(listId, itemId, isComplete) {
    const list = appState.lists.find(l => l.id === listId);
    if (list) {
        const item = list.items.find(i => i.id === itemId);
        if (item) {
            item.complete = isComplete;
            saveToLocalStorage();
            
            // Update the item in the DOM
            const listItem = document.querySelector(`[data-list-id="${listId}"] [data-item-id="${itemId}"]`);
            if (listItem) {
                const itemText = listItem.querySelector('.item-text');
                const itemCheckbox = listItem.querySelector('.item-checkbox');
                const toggleCompleteBtn = listItem.querySelector('.complete-btn, .incomplete-btn');
                
                if (isComplete) {
                    listItem.classList.add('complete');
                    itemText.classList.add('complete');
                    toggleCompleteBtn.className = 'icon-btn incomplete-btn';
                    toggleCompleteBtn.innerHTML = '<i class="fas fa-undo"></i>';
                    toggleCompleteBtn.title = 'Mark as Incomplete';
                } else {
                    listItem.classList.remove('complete');
                    itemText.classList.remove('complete');
                    toggleCompleteBtn.className = 'icon-btn complete-btn';
                    toggleCompleteBtn.innerHTML = '<i class="fas fa-check"></i>';
                    toggleCompleteBtn.title = 'Mark as Complete';
                }
                
                itemCheckbox.checked = isComplete;
                
                // Update list stats
                const listElement = document.querySelector(`[data-list-id="${listId}"]`);
                if (listElement) {
                    updateListStats(listElement, list);
                }
            }
            
            showNotification(`Item marked as ${isComplete ? 'complete' : 'incomplete'}`, isComplete ? 'complete' : 'success');
        }
    }
}

// Update list stats
function updateListStats(listElement, list) {
    const listStats = listElement.querySelector('.list-stats');
    if (listStats) {
        const completeCount = list.items.filter(item => item.complete).length;
        const totalCount = list.items.length;
        
        listStats.innerHTML = `
            <span>Complete: <span class="complete-count">${completeCount}</span></span>
            <span>Total: <span class="total-count">${totalCount}</span></span>
        `;
    }
}

// Enable list item editing
function enableListItemEditing(listId, itemId) {
    const listItem = document.querySelector(`[data-list-id="${listId}"] [data-item-id="${itemId}"]`);
    if (!listItem) return;
    
    const itemText = listItem.querySelector('.item-text');
    const itemTextInput = listItem.querySelector('.item-text-input');
    
    if (itemText && itemTextInput) {
        itemText.style.display = 'none';
        itemTextInput.style.display = 'block';
        itemTextInput.focus();
        itemTextInput.select();
    }
}

// Update list item text
function updateListItemText(listId, itemId, newText) {
    if (!newText.trim()) {
        deleteListItem(listId, itemId);
        return;
    }
    
    const list = appState.lists.find(l => l.id === listId);
    if (list) {
        const item = list.items.find(i => i.id === itemId);
        if (item) {
            item.text = newText.trim();
            saveToLocalStorage();
            
            const listItem = document.querySelector(`[data-list-id="${listId}"] [data-item-id="${itemId}"]`);
            if (listItem) {
                const itemText = listItem.querySelector('.item-text');
                const itemTextInput = listItem.querySelector('.item-text-input');
                
                if (itemText && itemTextInput) {
                    itemText.textContent = newText.trim();
                    itemText.style.display = 'block';
                    itemTextInput.style.display = 'none';
                }
            }
            
            showNotification('Item updated');
        }
    }
}

// Delete a list item
function deleteListItem(listId, itemId) {
    const list = appState.lists.find(l => l.id === listId);
    if (list) {
        list.items = list.items.filter(item => item.id !== itemId);
        saveToLocalStorage();
        
        // Remove the item from the DOM
        const listItem = document.querySelector(`[data-list-id="${listId}"] [data-item-id="${itemId}"]`);
        if (listItem) {
            const itemsList = listItem.parentElement;
            itemsList.removeChild(listItem);
            
            // Show empty message if no items left
            if (list.items.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'empty-list-message';
                emptyMessage.textContent = 'No items in this list yet. Add some above!';
                itemsList.appendChild(emptyMessage);
            }
            
            // Update list stats
            const listElement = document.querySelector(`[data-list-id="${listId}"]`);
            if (listElement) {
                updateListStats(listElement, list);
            }
        }
        
        showNotification('Item deleted');
    }
}

// Export data to JSON
function exportData() {
    const exportData = {
        lists: appState.lists,
        exportedAt: new Date().toISOString()
    };
    
    const jsonData = JSON.stringify(exportData, null, 2);
    
    document.getElementById('modalTitle').textContent = 'Export Data';
    document.getElementById('modalDescription').textContent = 'Copy the JSON data below to export your lists:';
    document.getElementById('jsonData').value = jsonData;
    document.getElementById('jsonData').readOnly = true;
    document.getElementById('importConfirmBtn').style.display = 'none';
    document.getElementById('copyBtn').style.display = 'inline-flex';
    
    importExportModal.classList.add('active');
}

// Import data from JSON
function importData() {
    document.getElementById('modalTitle').textContent = 'Import Data';
    document.getElementById('modalDescription').textContent = 'Paste your JSON data below to import lists:';
    document.getElementById('jsonData').value = '';
    document.getElementById('jsonData').readOnly = false;
    document.getElementById('importConfirmBtn').style.display = 'inline-flex';
    document.getElementById('copyBtn').style.display = 'none';
    
    importExportModal.classList.add('active');
}

// Handle import confirmation
function handleImport() {
    const jsonData = document.getElementById('jsonData').value;
    
    try {
        const parsedData = JSON.parse(jsonData);
        
        if (!parsedData.lists || !Array.isArray(parsedData.lists)) {
            throw new Error('Invalid data format: missing lists array');
        }
        
        // Validate each list
        parsedData.lists.forEach(list => {
            if (!list.id || !list.name || !Array.isArray(list.items)) {
                throw new Error('Invalid list structure');
            }
            
            // Validate each item
            list.items.forEach(item => {
                if (!item.id || !item.text) {
                    throw new Error('Invalid item structure');
                }
                // Ensure complete property exists
                if (item.complete === undefined) {
                    item.complete = false;
                }
            });
        });
        
        // Find the highest IDs
        let maxListId = 0;
        let maxItemId = 0;
        
        parsedData.lists.forEach(list => {
            if (list.id > maxListId) maxListId = list.id;
            list.items.forEach(item => {
                if (item.id > maxItemId) maxItemId = item.id;
            });
        });
        
        // Update app state
        appState.lists = parsedData.lists;
        appState.nextListId = maxListId + 1;
        appState.nextItemId = maxItemId + 1;
        
        saveToLocalStorage();
        renderLists();
        
        importExportModal.classList.remove('active');
        showNotification('Data imported successfully', 'success');
    } catch (error) {
        showNotification('Error importing data: ' + error.message, 'error');
    }
}

// Clear all data
function clearAllData() {
    appState.lists = [];
    appState.nextListId = 1;
    appState.nextItemId = 1;
    
    localStorage.removeItem('multiListManager');
    renderLists();
    
    clearModal.classList.remove('active');
    showNotification('All data cleared successfully', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Copy JSON to clipboard
function copyToClipboard() {
    const jsonData = document.getElementById('jsonData');
    jsonData.select();
    jsonData.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        navigator.clipboard.writeText(jsonData.value);
        showNotification('JSON copied to clipboard');
    } catch (error) {
        // Fallback for older browsers
        document.execCommand('copy');
        showNotification('JSON copied to clipboard');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add list button
    addListBtn.addEventListener('click', addNewList);
    
    // Export button
    exportBtn.addEventListener('click', exportData);
    
    // Import button
    importBtn.addEventListener('click', importData);
    
    // Clear button
    clearBtn.addEventListener('click', () => {
        clearModal.classList.add('active');
    });
    
    // Modal close buttons
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        importExportModal.classList.remove('active');
    });
    
    document.getElementById('closeClearModalBtn').addEventListener('click', () => {
        clearModal.classList.remove('active');
    });
    
    document.getElementById('cancelClearBtn').addEventListener('click', () => {
        clearModal.classList.remove('active');
    });
    
    // Modal confirm buttons
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    
    document.getElementById('importConfirmBtn').addEventListener('click', handleImport);
    
    document.getElementById('confirmClearBtn').addEventListener('click', clearAllData);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === importExportModal) {
            importExportModal.classList.remove('active');
        }
        if (e.target === clearModal) {
            clearModal.classList.remove('active');
        }
    });
    
    // Allow Enter key to submit import
    document.getElementById('jsonData').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleImport();
        }
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);

// PWA support
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then((reg) => console.log("Service Worker registered", reg))
            .catch((err) => console.error("Service Worker registration failed", err));
    });
}