// utils.js — Shared helper functions for StackIt Mini

/**
 * Shortcut for document.querySelector
 * @param {string} sel - CSS selector
 * @returns {Element}
 */
function $(sel) {
  return document.querySelector(sel);
}

/**
 * Shortcut for document.querySelectorAll
 * @param {string} sel - CSS selector
 * @returns {NodeListOf<Element>}
 */
function $$(sel) {
  return document.querySelectorAll(sel);
}

/**
 * Sanitize input to prevent basic HTML injection
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format timestamp to readable date (optional use)
 * @param {number} ts - timestamp
 * @returns {string}
 */
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

/**
 * Show a toast message
 * @param {string} msg
 */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.className =
    'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow z-50 animate-fade';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}