document.addEventListener("DOMContentLoaded", () => {
  /* ---------- storage ---------- */
  const KEY = "baskettalk_aac_v1";

  const defaultData = {
    categories: [
      { id: "needs", name: "Needs", emoji: "🧃" },
      { id: "feelings", name: "Feelings", emoji: "💗" },
      { id: "pain", name: "Body / Pain", emoji: "🩹" },
      { id: "boundaries", name: "Boundaries", emoji: "🛑" },
      { id: "social", name: "Social", emoji: "👋" },
      { id: "emergency", name: "Emergency", emoji: "🚨" }
    ],
    activeCategoryId: "needs",
    editMode: false,
    catEditEnabled: false,
catDeleteEnabled: false,
    voiceURI: "",
    rate: 1,
    pitch: 1,
    quick: [
      { id: "q1", emoji: "🧺", text: "I need a minute." },
      { id: "q2", emoji: "🛑", text: "Please stop." },
      { id: "q3", emoji: "🧠", text: "I can’t speak right now." },
      { id: "q4", emoji: "✅", text: "Yes." },
      { id: "q5", emoji: "❌", text: "No." },
      { id: "q6", emoji: "🔁", text: "Can you repeat that?" }
    ],
    phrasesByCategory: {
      needs: [
        { id: "n1", emoji: "💧", text: "Water please." },
        { id: "n2", emoji: "🍲", text: "Food please." },
        { id: "n3", emoji: "🚽", text: "Bathroom." },
        { id: "n4", emoji: "🪑", text: "I need to sit down." },
        { id: "n5", emoji: "🏠", text: "Can we go home?" },
        { id: "n6", emoji: "🆘", text: "I need help." },
        { id: "n7", emoji: "🏛️", text: "Let me discuss with the council." },
        { id: "n8", emoji: "🧠", text: "The council is my autistic brain." },
        { id: "n9", emoji: "⏳", text: "I’ll respond in a moment." },
        { id: "n10", emoji: "🗣️", text: "Can you rephrase that please?" },
        { id: "n11", emoji: "🧩", text: "My brain couldn’t process that." },
        { id: "n12", emoji: "💭", text: "I forgot what we were talking about." },
        { id: "n13", emoji: "💭", text: "I forgot what I was saying." },
        { id: "n14", emoji: "💭", text: "I forgot." },
        { id: "n15", emoji: "🔎", text: "Can’t find…" },
        { id: "n16", emoji: "📱", text: "Phone." },
        { id: "n17", emoji: "⌚", text: "Watch." },
        { id: "n18", emoji: "💻", text: "iPad." },
        { id: "n19", emoji: "📚", text: "Kindle." },
        { id: "n20", emoji: "💨", text: "Vape." },
        { id: "n21", emoji: "🥤", text: "Drink." }
      ],
      feelings: [
        { id: "f1", emoji: "😔", text: "I feel sad." },
        { id: "f2", emoji: "😡", text: "I feel angry." },
        { id: "f3", emoji: "😰", text: "I feel anxious." },
        { id: "f4", emoji: "😴", text: "I’m tired." },
        { id: "f5", emoji: "😊", text: "I feel okay." },
        { id: "f6", emoji: "✨", text: "I feel excited." }
      ],
      pain: [
        { id: "p1", emoji: "🤕", text: "My head hurts." },
        { id: "p2", emoji: "🩹", text: "I’m in pain." },
        { id: "p3", emoji: "🦴", text: "My joints hurt." },
        { id: "p4", emoji: "💤", text: "I need rest." },
        { id: "p5", emoji: "🫁", text: "Breathing is hard." },
        { id: "p6", emoji: "🤢", text: "I feel sick." }
      ],
      boundaries: [
        { id: "b1", emoji: "🛑", text: "Stop please." },
        { id: "b2", emoji: "🙅", text: "No." },
        { id: "b3", emoji: "🫶", text: "Be gentle with me." },
        { id: "b4", emoji: "🧍", text: "Please give me space." },
        { id: "b5", emoji: "🔕", text: "Quiet please." },
        { id: "b6", emoji: "🕐", text: "I need time." }
      ],
      social: [
        { id: "s1", emoji: "👋", text: "Hello." },
        { id: "s2", emoji: "🙏", text: "Thank you." },
        { id: "s3", emoji: "🤝", text: "Nice to meet you." },
        { id: "s4", emoji: "✅", text: "That works." },
        { id: "s5", emoji: "❌", text: "That doesn’t work." },
        { id: "s6", emoji: "💬", text: "Can we talk later?" }
      ],
      emergency: [
        { id: "e1", emoji: "🚨", text: "Emergency." },
        { id: "e2", emoji: "📞", text: "Call an ambulance." },
        { id: "e3", emoji: "🧑‍⚕️", text: "I need a doctor." },
        { id: "e4", emoji: "🆘", text: "Help me." },
        { id: "e5", emoji: "🫥", text: "I can’t speak." },
        { id: "e6", emoji: "🏥", text: "I need medical help." }
      ]
    }
    ,
    profile: {
      photoDataUrl: "",
      preferredName: "",
      dob: "",
      publicMedical: "",
      publicNote: "",
      pinHash: "",
      private: {
        legalName: "",
        address: "",
        nhsNumber: "",
        contacts: "",
        privateNote: ""
      }
    }
  };

  function loadData(){
    const raw = localStorage.getItem(KEY);
    if(raw){
      try{
        const parsed = JSON.parse(raw);

        // Merge with defaults so new fields appear without wiping old data
        const merged = structuredClone(defaultData);
        Object.assign(merged, parsed);
        merged.categories = parsed.categories || structuredClone(defaultData.categories);
        merged.quick = parsed.quick || structuredClone(defaultData.quick);
        merged.phrasesByCategory = parsed.phrasesByCategory || structuredClone(defaultData.phrasesByCategory);

        merged.profile = {
          ...structuredClone(defaultData.profile),
          ...(parsed.profile || {}),
          private: { ...structuredClone(defaultData.profile.private), ...((parsed.profile || {}).private || {}) }
        };
        // Settings defaults (so older saves don't break)
        merged.catEditEnabled = Boolean(parsed.catEditEnabled);
        merged.catDeleteEnabled = Boolean(parsed.catDeleteEnabled);

        return merged;
      }catch(e){
        console.warn("Bad storage, resetting", e);
        return structuredClone(defaultData);
      }
    }else{
      return structuredClone(defaultData);
    }
  }

  function saveData(){
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  const state = loadData();

  /* ---------- elements ---------- */
  const quickGrid = document.getElementById("quick-grid");
  const tabs = document.getElementById("tabs");
  const phraseGrid = document.getElementById("phrase-grid");
  const catTitle = document.getElementById("cat-title");
  const catSubtitle = document.getElementById("cat-subtitle");

  const btnEdit = document.getElementById("btn-edit");
  const btnAdd = document.getElementById("btn-add");
  const btnReset = document.getElementById("btn-reset");
  // Settings + categories
const btnSettings = document.getElementById("btn-settings");
const settingsOverlay = document.getElementById("settings");
const btnSettingsClose = document.getElementById("btn-settings-close");
const toggleCatEdit = document.getElementById("toggle-cat-edit");
const toggleCatDelete = document.getElementById("toggle-cat-delete");
const newCatEmoji = document.getElementById("new-cat-emoji");
const newCatName = document.getElementById("new-cat-name");
const btnAddCategory = document.getElementById("btn-add-category");

// Type to speak
const ttsInput = document.getElementById("tts-input");
const ttsSpeak = document.getElementById("tts-speak");
const ttsClear = document.getElementById("tts-clear");


  const voiceSelect = document.getElementById("voice-select");
  const rateRange = document.getElementById("rate");
  const pitchRange = document.getElementById("pitch");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalEmoji = document.getElementById("modal-emoji");
  const modalText = document.getElementById("modal-text");
  const modalCategory = document.getElementById("modal-category");
  const modalCategoryWrap = document.getElementById("modal-category-wrap");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");

  /* ---------- profile (emergency card) ---------- */
  const profileOverlay = document.getElementById("profile");
  const btnProfile = document.getElementById("btn-profile");
  const btnProfileClose = document.getElementById("btn-profile-close");

  const photoPreview = document.getElementById("profile-photo-preview");
  const photoInput = document.getElementById("profile-photo-input");
  const photoClear = document.getElementById("profile-photo-clear");

  const prefNameEl = document.getElementById("profile-pref-name");
  const dobEl = document.getElementById("profile-dob");
  const publicMedEl = document.getElementById("profile-public-med");
  const publicNoteEl = document.getElementById("profile-public-note");
  const savePublicBtn = document.getElementById("profile-save-public");

  const lockPill = document.getElementById("profile-lock-pill");
  const lockedView = document.getElementById("profile-locked-view");
  const unlockedView = document.getElementById("profile-unlocked-view");

  const pinEl = document.getElementById("profile-pin");
  const unlockBtn = document.getElementById("profile-unlock");
  const setPinBtn = document.getElementById("profile-set-pin");
  const lockBtn = document.getElementById("profile-lock");
  const savePrivateBtn = document.getElementById("profile-save-private");

  const legalNameEl = document.getElementById("profile-legal-name");
  const addressEl = document.getElementById("profile-address");
  const nhsEl = document.getElementById("profile-nhs");
  const contactsEl = document.getElementById("profile-contacts");
  const privateNoteEl = document.getElementById("profile-private-note");

  let profileUnlocked = false;

  function ensureProfile(){
    if(!state.profile){
      state.profile = structuredClone(defaultData.profile);
      saveData();
    } else {
      state.profile = {
        ...structuredClone(defaultData.profile),
        ...state.profile,
        private: { ...structuredClone(defaultData.profile.private), ...(state.profile.private || {}) }
      };
    }
  }

  async function hashPin(pin){
    const data = new TextEncoder().encode(String(pin));
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
  }

  function setLockUI(){
    if(!lockPill || !lockedView || !unlockedView) return;
    if(profileUnlocked){
      lockPill.textContent = "Unlocked 🔓";
      lockedView.classList.add("hidden");
      unlockedView.classList.remove("hidden");
    }else{
      lockPill.textContent = "Locked 🔒";
      lockedView.classList.remove("hidden");
      unlockedView.classList.add("hidden");
      if(pinEl) pinEl.value = "";
    }
  }

  function renderPhoto(){
    if(!photoPreview) return;
    const url = state.profile?.photoDataUrl;
    if(url){
      photoPreview.classList.add("has-img");
      photoPreview.style.backgroundImage = `url(${url})`;
      photoPreview.textContent = "📷";
    }else{
      photoPreview.classList.remove("has-img");
      photoPreview.style.backgroundImage = "";
      photoPreview.textContent = "📷";
    }
  }

  function fillProfileFields(){
    ensureProfile();

    if(prefNameEl) prefNameEl.value = state.profile.preferredName || "";
    if(dobEl) dobEl.value = state.profile.dob || "";
    if(publicMedEl) publicMedEl.value = state.profile.publicMedical || "";
    if(publicNoteEl) publicNoteEl.value = state.profile.publicNote || "";

    if(legalNameEl) legalNameEl.value = state.profile.private.legalName || "";
    if(addressEl) addressEl.value = state.profile.private.address || "";
    if(nhsEl) nhsEl.value = state.profile.private.nhsNumber || "";
    if(contactsEl) contactsEl.value = state.profile.private.contacts || "";
    if(privateNoteEl) privateNoteEl.value = state.profile.private.privateNote || "";

    renderPhoto();
    setLockUI();
  }

  function openProfile(){
    fillProfileFields();
    profileOverlay?.classList.remove("hidden");
    profileOverlay?.setAttribute("aria-hidden", "false");
  }

  function closeProfile(){
    profileOverlay?.classList.add("hidden");
    profileOverlay?.setAttribute("aria-hidden", "true");
    profileUnlocked = false;
    setLockUI();
  }

  /* ---------- speech ---------- */
  let voices = [];
  function refreshVoices(){
    voices = speechSynthesis.getVoices() || [];
    voiceSelect.innerHTML = "";
    voices.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });

    if(state.voiceURI){
      voiceSelect.value = state.voiceURI;
    }
  }

  function speak(text){
    if(!text) return;

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find(x => x.voiceURI === state.voiceURI);
    if(v) u.voice = v;

    u.rate = state.rate;
    u.pitch = state.pitch;

    speechSynthesis.speak(u);
  }

  /* ---------- render ---------- */
 function renderTabs(){
  tabs.innerHTML = "";

  state.categories.forEach(cat => {
    const wrap = document.createElement("div");
    wrap.className = "tab-wrap";

    const btn = document.createElement("button");
    btn.className = "tab" + (cat.id === state.activeCategoryId ? " active" : "");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", cat.id === state.activeCategoryId ? "true" : "false");
    btn.textContent = `${cat.emoji} ${cat.name}`;

    btn.addEventListener("click", () => {
      state.activeCategoryId = cat.id;
      saveData();
      renderAll();
    });

    wrap.appendChild(btn);

    // Only show category actions if enabled in Settings
    if(state.catEditEnabled){
      const actions = document.createElement("div");
      actions.className = "tab-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.type = "button";
      editBtn.textContent = "✏️";
      editBtn.title = "Edit category";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const emoji = prompt("Category emoji:", cat.emoji);
        if(emoji === null) return;

        const name = prompt("Category name:", cat.name);
        if(name === null) return;

        const cleanEmoji = (emoji || cat.emoji).trim().slice(0, 4) || cat.emoji;
        const cleanName = (name || cat.name).trim().slice(0, 40) || cat.name;

        cat.emoji = cleanEmoji;
        cat.name = cleanName;

        saveData();
        renderAll();
      });

      actions.appendChild(editBtn);

      if(state.catDeleteEnabled){
        const delBtn = document.createElement("button");
        delBtn.className = "icon-btn";
        delBtn.type = "button";
        delBtn.textContent = "🗑️";
        delBtn.title = "Delete category";

        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();

          if(state.categories.length <= 1){
            alert("You can’t delete the last category.");
            return;
          }

          const typed = prompt(`Type DELETE to remove "${cat.name}".\nThis also deletes its phrases.`);
          if(typed !== "DELETE") return;

          // remove category
          state.categories = state.categories.filter(c => c.id !== cat.id);

          // remove phrases bucket
          delete state.phrasesByCategory[cat.id];

          // fix active category if needed
          if(state.activeCategoryId === cat.id){
            state.activeCategoryId = state.categories[0].id;
          }

          saveData();
          renderAll();
        });

        actions.appendChild(delBtn);
      }

      wrap.appendChild(actions);
    }

    tabs.appendChild(wrap);
  });
}

//the edit buttons!!!!!!//
  function phraseCard(item, { onTap, onEdit, onPin, onDelete }){
  const card = document.createElement("div");
  card.className = "phrase";
  card.tabIndex = 0;

  const emoji = document.createElement("div");
  emoji.className = "emoji";
  emoji.textContent = item.emoji || "💬";

  const text = document.createElement("div");
  text.className = "text";
  text.textContent = item.text;

  card.appendChild(emoji);
  card.appendChild(text);

  // meta actions (always visible)
  const meta = document.createElement("div");
  meta.className = "meta";

  const btnEditOne = document.createElement("button");
  btnEditOne.className = "icon-btn";
  btnEditOne.type = "button";
  btnEditOne.textContent = "✏️";
  btnEditOne.title = "Edit";
  btnEditOne.addEventListener("click", (e) => { e.stopPropagation(); onEdit?.(); });

  const btnPin = document.createElement("button");
  btnPin.className = "icon-btn";
  btnPin.type = "button";
  btnPin.textContent = "📌";
  btnPin.title = "Pin to Quick";
  btnPin.addEventListener("click", (e) => { e.stopPropagation(); onPin?.(); });

  const btnDel = document.createElement("button");
  btnDel.className = "icon-btn";
  btnDel.type = "button";
  btnDel.textContent = "🗑️";
  btnDel.title = "Delete";
  btnDel.addEventListener("click", (e) => { e.stopPropagation(); onDelete?.(); });

  meta.appendChild(btnEditOne);
  meta.appendChild(btnPin);
  meta.appendChild(btnDel);

  card.appendChild(meta);

  card.addEventListener("click", () => onTap?.());
  card.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      onTap?.();
    }
  });

  return card;
}


  function renderQuick(){
    quickGrid.innerHTML = "";
    state.quick.forEach(item => {
      quickGrid.appendChild(
        phraseCard(item, {
          onTap: () => speak(item.text),
          onEdit: () => openModal("editQuick", item),
          onPin: () => {},
          onDelete: () => {
            if(!confirm("Delete this Quick phrase?")) return;
            state.quick = state.quick.filter(x => x.id !== item.id);
            saveData();
            renderAll();
          }
        })
      );
    });
  }

  function renderPhrases(){
    const cat = state.categories.find(c => c.id === state.activeCategoryId);
    catTitle.textContent = cat ? `${cat.emoji} ${cat.name}` : "Phrases";
    catSubtitle.textContent = state.editMode ? "Edit mode is ON" : "Tap to speak";

    const list = state.phrasesByCategory[state.activeCategoryId] || [];
    phraseGrid.innerHTML = "";

    list.forEach(item => {
      phraseGrid.appendChild(
        phraseCard(item, {
          onTap: () => speak(item.text),
          onEdit: () => openModal("editCat", item, state.activeCategoryId),
          onPin: () => {
            if(state.quick.some(q => q.text === item.text)) return;
            state.quick.unshift({ id: "q" + Date.now(), emoji: item.emoji, text: item.text });
            state.quick = state.quick.slice(0, 12);
            saveData();
            renderAll();
          },
          onDelete: () => {
            if(!confirm("Delete this phrase?")) return;
            state.phrasesByCategory[state.activeCategoryId] =
              list.filter(x => x.id !== item.id);
            saveData();
            renderAll();
          }
        })
      );
    });
  }

  function renderAll(){
    renderTabs();
    renderQuick();
    renderPhrases();
    btnEdit.textContent = state.editMode ? "✅ Done" : "✏️ Edit";
  }

  /* ---------- modal ---------- */
  let modalMode = "addCat";
  let modalEditingId = null;
  let modalCategoryId = null;

  function openModal(mode, item=null, catId=null){
    modalMode = mode;
    modalEditingId = item ? item.id : null;
    modalCategoryId = catId;

    modalEmoji.value = item?.emoji || "";
    modalText.value = item?.text || "";

    // populate category select
    modalCategory.innerHTML = "";
    state.categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = `${cat.emoji} ${cat.name}`;
      modalCategory.appendChild(opt);
    });

    if(mode === "addCat"){
      modalTitle.textContent = "Add phrase";
      modalSubtitle.textContent = "Adds to current category";
      modalCategoryWrap.classList.add("hidden");
    }else if(mode === "addAny"){
      modalTitle.textContent = "Add phrase";
      modalSubtitle.textContent = "Pick a category";
      modalCategoryWrap.classList.remove("hidden");
      modalCategory.value = state.activeCategoryId;
    }else if(mode === "editCat"){
      modalTitle.textContent = "Edit phrase";
      modalSubtitle.textContent = "Updates this category phrase";
      modalCategoryWrap.classList.add("hidden");
    }else if(mode === "editQuick"){
      modalTitle.textContent = "Edit Quick phrase";
      modalSubtitle.textContent = "Updates this Quick phrase";
      modalCategoryWrap.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modalText.focus();
  }

  function closeModal(){
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  modalCancel.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if(e.target === modal) closeModal();
  });

  modalSave.addEventListener("click", () => {
    const emoji = (modalEmoji.value || "").trim();
    const text = (modalText.value || "").trim();
    if(!text){
      alert("Text is required.");
      return;
    }

    if(modalMode === "addCat"){
      const id = "c" + Date.now();
      const catId = state.activeCategoryId;
      state.phrasesByCategory[catId].unshift({ id, emoji, text });
    }

    if(modalMode === "addAny"){
      const id = "c" + Date.now();
      const catId = modalCategory.value;
      state.phrasesByCategory[catId].unshift({ id, emoji, text });
    }

    if(modalMode === "editCat"){
      const catId = modalCategoryId || state.activeCategoryId;
      const list = state.phrasesByCategory[catId] || [];
      const idx = list.findIndex(x => x.id === modalEditingId);
      if(idx >= 0){
        list[idx].emoji = emoji;
        list[idx].text = text;
      }
    }

    if(modalMode === "editQuick"){
      const idx = state.quick.findIndex(x => x.id === modalEditingId);
      if(idx >= 0){
        state.quick[idx].emoji = emoji;
        state.quick[idx].text = text;
      }
    }

    saveData();
    closeModal();
    renderAll();
  });

  /* ---------- controls ---------- */
  btnEdit.addEventListener("click", () => {
    state.editMode = !state.editMode;
    saveData();
    renderAll();
  });

  btnAdd.addEventListener("click", () => {
    if(state.editMode){
      openModal("addAny");
    }else{
      openModal("addCat");
    }
  });

  btnReset.addEventListener("click", () => {
    if(!confirm("Reset to defaults? This will erase your saved phrases.")) return;
    localStorage.removeItem(KEY);
    location.reload();
  });

  voiceSelect.addEventListener("change", () => {
    state.voiceURI = voiceSelect.value;
    saveData();
  });

  rateRange.addEventListener("input", () => {
    state.rate = Number(rateRange.value);
    saveData();
  });

  pitchRange.addEventListener("input", () => {
    state.pitch = Number(pitchRange.value);
    saveData();
  });

  // ---------- Settings (categories) ----------
function openSettings(){
  if(!settingsOverlay) return;
  if(toggleCatEdit) toggleCatEdit.checked = Boolean(state.catEditEnabled);
  if(toggleCatDelete) toggleCatDelete.checked = Boolean(state.catDeleteEnabled);
  settingsOverlay.classList.remove("hidden");
  settingsOverlay.setAttribute("aria-hidden", "false");
}

function closeSettings(){
  if(!settingsOverlay) return;
  settingsOverlay.classList.add("hidden");
  settingsOverlay.setAttribute("aria-hidden", "true");
}

btnSettings?.addEventListener("click", openSettings);
btnSettingsClose?.addEventListener("click", closeSettings);

settingsOverlay?.addEventListener("click", (e) => {
  if(e.target === settingsOverlay) closeSettings();
});

toggleCatEdit?.addEventListener("change", () => {
  state.catEditEnabled = toggleCatEdit.checked;
  saveData();
  renderAll();
});

toggleCatDelete?.addEventListener("change", () => {
  if(toggleCatDelete.checked){
    const ok = confirm("Delete mode is dangerous. Turn it on?");
    if(!ok){
      toggleCatDelete.checked = false;
      return;
    }
  }
  state.catDeleteEnabled = toggleCatDelete.checked;
  saveData();
  renderAll();
});

btnAddCategory?.addEventListener("click", () => {
  const emoji = (newCatEmoji?.value || "🧺").trim().slice(0, 4) || "🧺";
  const name = (newCatName?.value || "").trim().slice(0, 40);

  if(!name){
    alert("Give the category a name.");
    return;
  }

  const id = "cat_" + Date.now();
  state.categories.push({ id, name, emoji });
  state.phrasesByCategory[id] = [];

  if(newCatEmoji) newCatEmoji.value = "";
  if(newCatName) newCatName.value = "";

  saveData();
  renderAll();
});

// ---------- Type to speak ----------
ttsSpeak?.addEventListener("click", () => {
  const text = (ttsInput?.value || "").trim();
  if(!text) return;
  speak(text);
});

ttsClear?.addEventListener("click", () => {
  if(ttsInput) ttsInput.value = "";
});

ttsInput?.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    e.preventDefault();
    const text = (ttsInput?.value || "").trim();
    if(!text) return;
    speak(text);
  }
});

  /* ---------- profile controls ---------- */
  btnProfile?.addEventListener("click", openProfile);
  btnProfileClose?.addEventListener("click", closeProfile);

  profileOverlay?.addEventListener("click", (e) => {
    if(e.target === profileOverlay) closeProfile();
  });

  savePublicBtn?.addEventListener("click", () => {
    ensureProfile();
    state.profile.preferredName = (prefNameEl?.value || "").trim();
    state.profile.dob = (dobEl?.value || "").trim();
    state.profile.publicMedical = (publicMedEl?.value || "").trim();
    state.profile.publicNote = (publicNoteEl?.value || "").trim();
    saveData();
    alert("Saved ✅");
  });

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      ensureProfile();
      state.profile.photoDataUrl = String(reader.result || "");
      saveData();
      renderPhoto();
    };
    reader.readAsDataURL(file);
  });

  photoClear?.addEventListener("click", () => {
    ensureProfile();
    state.profile.photoDataUrl = "";
    saveData();
    renderPhoto();
  });

  setPinBtn?.addEventListener("click", async () => {
    ensureProfile();

    if(state.profile.pinHash){
      const current = prompt("Enter current 4-digit PIN:");
      if(!current || !/^\d{4}$/.test(current)){
        alert("PIN must be 4 digits.");
        return;
      }
      const currentHash = await hashPin(current);
      if(currentHash !== state.profile.pinHash){
        alert("Wrong PIN.");
        return;
      }
    }

    const pin1 = prompt("Set a new 4-digit PIN:");
    if(!pin1 || !/^\d{4}$/.test(pin1)){
      alert("PIN must be 4 digits.");
      return;
    }
    const pin2 = prompt("Re-enter the new PIN:");
    if(pin1 !== pin2){
      alert("Pins didn’t match.");
      return;
    }

    state.profile.pinHash = await hashPin(pin1);
    saveData();
    alert("PIN set ✅");
  });

  unlockBtn?.addEventListener("click", async () => {
    ensureProfile();

    if(!state.profile.pinHash){
      alert("No PIN set yet. Tap “Set / Change PIN” first.");
      return;
    }

    const pin = (pinEl?.value || "").trim();
    if(!/^\d{4}$/.test(pin)){
      alert("PIN must be 4 digits.");
      return;
    }

    const h = await hashPin(pin);
    if(h !== state.profile.pinHash){
      alert("Wrong PIN.");
      return;
    }

    profileUnlocked = true;
    setLockUI();
  });

  lockBtn?.addEventListener("click", () => {
    profileUnlocked = false;
    setLockUI();
  });

  savePrivateBtn?.addEventListener("click", () => {
    if(!profileUnlocked){
      alert("Unlock first.");
      return;
    }

    ensureProfile();
    state.profile.private.legalName = (legalNameEl?.value || "").trim();
    state.profile.private.address = (addressEl?.value || "").trim();
    state.profile.private.nhsNumber = (nhsEl?.value || "").trim();
    state.profile.private.contacts = (contactsEl?.value || "").trim();
    state.profile.private.privateNote = (privateNoteEl?.value || "").trim();

    saveData();
    alert("Saved ✅");
  });

  /* ---------- initial render ---------- */
  refreshVoices();
  speechSynthesis.onvoiceschanged = refreshVoices;

  // set ranges from state
  rateRange.value = String(state.rate);
  pitchRange.value = String(state.pitch);

  renderAll();

  // service worker (offline)
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});

