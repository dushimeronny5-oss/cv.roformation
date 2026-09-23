/**
 * CV EN LIGNE - RONNY JAS
 * Style Nike Luxury : Noir & Or Métallique
 * Logique Interactive : Filtres, Mode Édition & Copie Rapide
 */

document.addEventListener('DOMContentLoaded', () => {
  initSkillsFilter();
  initCopyEmail();
  initPrintPdf();
  initLiveEditor();
  restoreSavedEdits();
});

/* --------------------------------------------------------------------------
   1. Filtrage Épuré des Compétences
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const skillCards = document.querySelectorAll('.skill-minimal-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Copie de l'Email en 1 Clic
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.js-copy-email');
  const email = 'dushimeronny5@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(email)
        .then(() => {
          showToast(`📋 Email copié : ${email}`);
        })
        .catch(() => {
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast(`📋 Email copié : ${email}`);
        });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Téléchargement en PDF / Impression Haute Définition
   -------------------------------------------------------------------------- */
function initPrintPdf() {
  const printBtns = document.querySelectorAll('.js-download-pdf');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const editorToolbar = document.getElementById('editor-toolbar');
      if (editorToolbar && editorToolbar.classList.contains('active')) {
        toggleLiveEdit(false);
      }
      showToast('📄 Préparation de votre CV PDF...');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  });
}

/* --------------------------------------------------------------------------
   4. Mode Édition Directe (In-Place Live Edit)
   -------------------------------------------------------------------------- */
let isEditMode = false;

function initLiveEditor() {
  const toggleEditBtn = document.getElementById('toggle-edit-mode');
  const editorToolbar = document.getElementById('editor-toolbar');
  const saveBtn = document.getElementById('editor-save-btn');
  const resetBtn = document.getElementById('editor-reset-btn');
  const closeBtn = document.getElementById('editor-close-btn');

  if (toggleEditBtn) {
    toggleEditBtn.addEventListener('click', () => {
      toggleLiveEdit(!isEditMode);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toggleLiveEdit(false);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveEdits();
      showToast('💾 Modifications enregistrées avec succès !');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Rétablir les textes originaux du CV ?')) {
        localStorage.removeItem('ronny_nike_cv_content');
        location.reload();
      }
    });
  }
}

function toggleLiveEdit(enable) {
  isEditMode = enable;
  const editorToolbar = document.getElementById('editor-toolbar');
  const editableElements = document.querySelectorAll('[data-editable]');

  editableElements.forEach(el => {
    el.contentEditable = isEditMode ? 'true' : 'false';
    if (isEditMode) {
      el.style.outline = '1px dashed #d4af37';
      el.style.borderRadius = '4px';
      el.style.padding = '2px 4px';
    } else {
      el.style.outline = 'none';
      el.style.padding = '0';
    }
  });

  if (editorToolbar) {
    if (isEditMode) {
      editorToolbar.classList.add('active');
      showToast('✏️ Mode Édition activé : modifiez les textes directement !');
    } else {
      editorToolbar.classList.remove('active');
      showToast('🔒 Mode Édition désactivé');
    }
  }
}

function saveEdits() {
  const editableElements = document.querySelectorAll('[data-editable]');
  const savedData = {};

  editableElements.forEach(el => {
    const id = el.getAttribute('data-editable');
    if (id) {
      savedData[id] = el.innerHTML;
    }
  });

  localStorage.setItem('ronny_nike_cv_content', JSON.stringify(savedData));
}

function restoreSavedEdits() {
  const savedDataStr = localStorage.getItem('ronny_nike_cv_content');
  if (!savedDataStr) return;

  try {
    const savedData = JSON.parse(savedDataStr);
    Object.keys(savedData).forEach(id => {
      const el = document.querySelector(`[data-editable="${id}"]`);
      if (el) {
        el.innerHTML = savedData[id];
      }
    });
  } catch (e) {
    console.error('Erreur restauration éditions:', e);
  }
}

/* --------------------------------------------------------------------------
   5. Notification Toast Stylée Bleu & Noir
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('cv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cv-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: var(--gold-primary);">⚜️</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
