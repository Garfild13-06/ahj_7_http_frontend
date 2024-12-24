const API_URL = 'http://localhost:7070'; // Backend URL

document.addEventListener('DOMContentLoaded', () => {
  const ticketList = document.querySelector('.ticket-list');
  const addTicketBtn = document.getElementById('add-ticket-btn');
  const ticketModal = document.getElementById('ticket-modal');
  const modalTitle = document.getElementById('modal-title');
  const ticketForm = document.getElementById('ticket-form');
  const ticketTitleField = document.getElementById('ticket-title');
  const ticketDescriptionField = document.getElementById('ticket-description');
  const cancelModalBtn = document.querySelector('.cancel-btn');
  const deleteModal = document.getElementById('delete-modal');
  const cancelDeleteBtn = deleteModal.querySelector('.cancel');
  const confirmDeleteBtn = deleteModal.querySelector('.delete');

  let currentTicketId = null;
  let ticketToDelete = null;

  // Load tickets
  async function loadTickets() {
    const response = await fetch(`${API_URL}/?method=allTickets`);
    const tickets = await response.json();
    ticketList.innerHTML = '';
    tickets.forEach(ticket => renderTicket(ticket));
  }

  // Render a single ticket
  function renderTicket(ticket) {
    const li = document.createElement('li');
    li.className = `ticket ${ticket.status === 'resolved' ? 'completed' : ''}`;
    li.dataset.id = ticket.id;
    li.innerHTML = `
      <div class="title-row">
        <div class="left-section">
          <input type="checkbox" ${ticket.status === 'resolved' ? 'checked' : ''} data-id="${ticket.id}" class="toggle-status">
          <span class="title" data-id="${ticket.id}">${ticket.title}</span>
        </div>
        <div class="right-section">
          <span>${new Date(ticket.createdAt).toLocaleString()}</span>
          <div class="actions">
            <button data-id="${ticket.id}" class="edit-btn">✏️</button>
            <button data-id="${ticket.id}" class="delete-btn">❌</button>
          </div>
        </div>
      </div>
      <div class="description"></div>
    `;
    ticketList.appendChild(li);
  }

  // Update a single ticket in the DOM
  async function updateTicketInDOM(id) {
    const ticketDetails = await fetchTicketDetails(id);
    const ticketElement = document.querySelector(`.ticket[data-id="${id}"]`);
    if (ticketElement) {
      const wasExpanded = ticketElement.classList.contains('open');
      ticketElement.className = `ticket ${ticketDetails.status === 'resolved' ? 'completed' : ''}`;
      ticketElement.innerHTML = `
        <div class="title-row">
          <div class="left-section">
            <input type="checkbox" ${ticketDetails.status === 'resolved' ? 'checked' : ''} data-id="${id}" class="toggle-status">
            <span class="title" data-id="${id}">${ticketDetails.title}</span>
          </div>
          <div class="right-section">
            <span>${new Date(ticketDetails.createdAt).toLocaleString()}</span>
            <div class="actions">
              <button data-id="${id}" class="edit-btn">✏️</button>
              <button data-id="${id}" class="delete-btn">❌</button>
            </div>
          </div>
        </div>
        <div class="description">${wasExpanded ? ticketDetails.description || 'Нет описания.' : ''}</div>
      `;
      if (wasExpanded) {
        ticketElement.classList.add('open');
      }
    }
  }

  // Delete a ticket from the DOM
  function removeTicketFromDOM(id) {
    const ticketElement = document.querySelector(`.ticket[data-id="${id}"]`);
    if (ticketElement) {
      ticketElement.remove();
    }
  }

  // Toggle ticket status
  async function toggleStatus(id, isChecked) {
    const status = isChecked ? 'resolved' : 'open';
    await fetch(`${API_URL}/?method=editTicketStatus`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id, status}),
    });
    updateTicketInDOM(id); // Обновляем только изменённый тикет
  }

  // Show modal for adding/editing ticket
  function showModal(isEdit = false, ticket = {}) {
    modalTitle.textContent = isEdit ? 'Изменить тикет' : 'Добавить тикет';
    ticketTitleField.value = isEdit ? ticket.title : '';
    ticketDescriptionField.value = isEdit ? ticket.description : '';
    currentTicketId = isEdit ? ticket.id : null;
    ticketModal.classList.add('active');
  }

  // Hide modal
  function hideModal() {
    ticketModal.classList.remove('active');
  }

  // Save ticket (create or edit)
  async function saveTicket(event) {
    event.preventDefault();
    const title = ticketTitleField.value;
    const description = ticketDescriptionField.value;

    const method = currentTicketId ? 'editTicket' : 'createTicket';
    const httpMethod = currentTicketId ? 'PUT' : 'POST';

    const response = await fetch(`${API_URL}/?method=${method}`, {
      method: httpMethod,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: currentTicketId,
        name: title,
        description,
        status: 'open',
      }),
    });

    const newTicket = await response.json();
    hideModal();
    if (currentTicketId) {
      updateTicketInDOM(currentTicketId); // Обновляем только изменённый тикет
    } else {
      renderTicket(newTicket); // Добавляем новый тикет в конец списка
    }
  }

  // Show delete confirmation modal
  function showDeleteModal(id) {
    ticketToDelete = id;
    deleteModal.classList.add('active');
  }

  // Hide delete confirmation modal
  function hideDeleteModal() {
    ticketToDelete = null;
    deleteModal.classList.remove('active');
  }

  // Delete ticket
  async function deleteTicket() {
    if (!ticketToDelete) return;
    const response = await fetch(`${API_URL}/?method=deleteTicket&id=${ticketToDelete}`, {method: 'DELETE'});
    if (response.ok) {
      removeTicketFromDOM(ticketToDelete); // Удаляем тикет из DOM сразу после успешного ответа
    }
    hideDeleteModal();
  }

  // Fetch full ticket details by ID
  async function fetchTicketDetails(id) {
    const response = await fetch(`${API_URL}/?method=ticketById&id=${id}`);
    return await response.json();
  }

  // Expand ticket description
  async function expandTicket(ticketElement, id) {
    const descriptionElement = ticketElement.querySelector('.description');
    if (!ticketElement.classList.contains('open')) {
      const ticketDetails = await fetchTicketDetails(id);
      descriptionElement.innerText = ticketDetails.description || 'Нет описания.';
    }
    ticketElement.classList.toggle('open');
  }

  // Event delegation for ticket actions
  ticketList.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    const ticketElement = event.target.closest('.ticket');

    if (event.target.classList.contains('toggle-status')) {
      toggleStatus(id, event.target.checked);
    } else if (event.target.classList.contains('edit-btn')) {
      const ticketDetails = await fetchTicketDetails(id);
      showModal(true, ticketDetails);
    } else if (event.target.classList.contains('delete-btn')) {
      showDeleteModal(id);
    } else if (event.target.classList.contains('title')) {
      if (ticketElement) expandTicket(ticketElement, id);
    }
  });

  // Show form for adding a new ticket
  addTicketBtn.addEventListener('click', () => {
    showModal(false);
  });

  // Form submission
  ticketForm.addEventListener('submit', saveTicket);

  // Modal actions
  cancelModalBtn.addEventListener('click', hideModal);
  cancelDeleteBtn.addEventListener('click', hideDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteTicket);

  // Initial load
  loadTickets();
});
