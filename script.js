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
        { id: "n6", emoji: "🆘", text: "I need help." }
      ],
      feelings: [
        { id: "f1", emoji: "😵‍💫", text: "I’m overwhelmed." },
        { id: "f2", emoji: "😟", text: "I’m anxious." },
        { id: "f3", emoji: "😔", text: "I’m low." },
        { id: "f4", emoji: "🥱", text: "I’m exhausted." },
        { id: "f5", emoji: "🫧", text: "I need calm/quiet." }
      ],
      pain: [
        { id: "p1", emoji: "💢", text: "I’m in pain." },
        { id: "p2", emoji: "😵", text: "I feel dizzy." },
        { id: "p3", emoji: "🤢", text: "I feel sick." },
        { id: "p4", emoji: "🔆", text: "Too bright." },
        { id: "p5", emoji: "🔊", text: "Too loud." }
      ],
      boundaries: [
        { id: "b1", emoji: "🛑", text: "Please don’t rush me." },
        { id: "b2", emoji: "⏸️", text: "Pause. Give me a second." },
        { id: "b3", emoji: "🙅", text: "No thank you." },
        { id: "b4", emoji: "✋", text: "I can’t do that." }
      ],
      social: [
        { id: "s1", emoji: "👋", text: "Hi." },
        { id: "s2", emoji: "🙏", text: "Thank you." },
        { id: "s3", emoji: "🙂", text: "I’m trying." },
        { id: "s4", emoji: "🧾", text: "Can you explain it simply?" }
      ],
      emergency: [
        { id: "e1", emoji: "🚨", text: "I need urgent help." },
        { id: "e2", emoji: "📞", text: "Please call my emergency contact." },
        { id: "e3", emoji: "🏥", text: "I need medical help." }
      ]
    }
  };

  function loadData(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY));
      if(!saved) return structuredClone(defaultData);

      return {
        ...structuredClone(defaultData),
        ...saved,
        phrasesByCategory: { ...structuredClone(defaultData.phrasesByCategory), ...(saved.phrasesByCategory || {}) },
        categories: Array.isArray(saved.categories) ? saved.categories : structuredClone(defaultData.categories),
        quick: Array.isArray(saved.quick) ? saved.quick : structuredClone(defaultData.quick),
      };
    }catch{
      return structuredClone(defaultData);
    }
  }

  function saveData(){
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  const state = loadData();

  /* ---------- elements ---------- */
  const quickGrid = document.getElementById("quick-grid");
  const categoryGrid = document.getElementById("category-grid");
  const categoryTabs = document.getElementById("category-tabs");
  const categoryTitle = document.getElementById("category-title");

  const editBtn = document.getElementById("btn-edit-mode");
  const stopBtn = document.getElementById("btn-stop");
  const testBtn = document.getElementById("btn-test");

  const voiceSelect = document.getElementById("voice-select");
  const rateRange = document.getElementById("rate");
  const pitchRange = document.getElementById("pitch");

  const ttsInput = document.getElementById("tts-input");
  const ttsSayBtn = document.getElementById("tts-say");

  const addQuickBtn = document.getElementById("btn-add-quick");
  const addPhraseBtn = document.getElementById("btn-add-phrase");
  const addToCategoryBtn = document.getElementById("btn-add-to-category");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalEmoji = document.getElementById("modal-emoji");
  const modalText = document.getElementById("modal-text");
  const modalCategoryWrap = document.getElementById("modal-category-wrap");
  const modalCategory = document.getElementById("modal-category");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");

  /* ---------- ids ---------- */
  function uid(){
    return Math.random().toString(36).slice(2, 9);
  }

  /* ---------- speech ---------- */
  function stopSpeaking(){
    try{
      window.speechSynthesis.cancel();
    }catch{}
  }

  function speak(text){
    if(!text || !text.trim()) return;

    stopSpeaking();

    const utter = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const chosen = voices.find(v => v.voiceURI === state.voiceURI) || voices[0];

    if(chosen) utter.voice = chosen;

    utter.rate = Number(state.rate) || 1;
    utter.pitch = Number(state.pitch) || 1;

    window.speechSynthesis.speak(utter);
  }

  function populateVoices(){
    const voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    if(!voices || voices.length === 0){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No voices found (try again)";
      voiceSelect.appendChild(opt);
      return;
    }

    voices.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });

    if(state.voiceURI && voices.some(v => v.voiceURI === state.voiceURI)){
      voiceSelect.value = state.voiceURI;
    } else {
      state.voiceURI = voiceSelect.value;
      saveData();
    }
  }

  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;

  /* ---------- render helpers ---------- */
  function getActiveCategory(){
    return state.categories.find(c => c.id === state.activeCategoryId) || state.categories[0];
  }

  function phrasesForCategory(catId){
    return state.phrasesByCategory[catId] || [];
  }

  function renderTabs(){
    categoryTabs.innerHTML = "";

    state.categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab" + (cat.id === state.activeCategoryId ? " active" : "");
      btn.textContent = `${cat.emoji} ${cat.name}`;

      btn.onclick = () => {
        state.activeCategoryId = cat.id;
        saveData();
        renderAll();
      };

      categoryTabs.appendChild(btn);
    });
  }

  function escapeHtml(str){
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* ---------- THIS IS THE FIXED TILE ---------- */
  function makePhraseTile(item, context){
    const div = document.createElement("div");
    div.className = "phrase";
    div.setAttribute("role", "button");
    div.tabIndex = 0;

    div.style.cursor = "pointer";
    div.style.userSelect = "none";

    const emoji = item.emoji ? `<div class="emoji">${item.emoji}</div>` : `<div class="emoji">🧺</div>`;
    div.innerHTML = `
      ${emoji}
      <div class="text">${escapeHtml(item.text)}</div>
      <div class="meta ${state.editMode ? "" : "hidden"}">
        <button class="icon-btn pin" type="button" title="Pin to Quick bar">📌</button>
        <button class="icon-btn edit" type="button" title="Edit">✏️</button>
        <button class="icon-btn del" type="button" title="Delete">🗑️</button>
      </div>
    `;

    // Tap/click anywhere on tile speaks (except the small buttons)
    div.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      speak(item.text);
    });

    div.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        speak(item.text);
      }
    });

    if(state.editMode){
      const pinBtn = div.querySelector(".pin");
      const editBtn2 = div.querySelector(".edit");
      const delBtn = div.querySelector(".del");

      pinBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(!state.quick.some(q => q.text === item.text)){
          state.quick.unshift({ id: uid(), emoji: item.emoji || "🧺", text: item.text });
          saveData();
          renderQuick();
        }
      };

      editBtn2.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal({ mode: "edit", context, item });
      };

      delBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!confirm("Delete this phrase? (No shame.)")) return;

        if(context.type === "quick"){
          state.quick = state.quick.filter(q => q.id !== item.id);
        } else if(context.type === "category"){
          const list = phrasesForCategory(context.categoryId);
          state.phrasesByCategory[context.categoryId] = list.filter(p => p.id !== item.id);
        }
        saveData();
        renderAll();
      };
    }

    return div;
  }

  function renderQuick(){
    quickGrid.innerHTML = "";
    if(!state.quick || state.quick.length === 0){
      quickGrid.innerHTML = `<div class="muted small">Quick bar is empty. That’s allowed.</div>`;
      return;
    }

    state.quick.forEach(item => {
      quickGrid.appendChild(makePhraseTile(item, { type: "quick" }));
    });
  }

  function renderCategory(){
    const active = getActiveCategory();
    categoryTitle.textContent = `${active.emoji} ${active.name}`;

    const list = phrasesForCategory(active.id);
    categoryGrid.innerHTML = "";

    if(list.length === 0){
      categoryGrid.innerHTML = `<div class="muted small">No phrases here yet. Add one if you want.</div>`;
      return;
    }

    list.forEach(item => {
      categoryGrid.appendChild(makePhraseTile(item, { type: "category", categoryId: active.id }));
    });
  }

  function renderAll(){
    renderTabs();
    renderQuick();
    renderCategory();

    editBtn.textContent = state.editMode ? "✅ Done" : "✏️ Edit";
    rateRange.value = String(state.rate ?? 1);
    pitchRange.value = String(state.pitch ?? 1);
    if(state.voiceURI) voiceSelect.value = state.voiceURI;
  }

  /* ---------- modal ---------- */
  let modalState = null;

  function openModal(opts){
    modalState = opts;

    modal.classList.remove("hidden");
    const active = getActiveCategory();

    // Fill category dropdown
    modalCategory.innerHTML = "";
    state.categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = `${cat.emoji} ${cat.name}`;
      modalCategory.appendChild(opt);
    });

    modalCategory.value = active.id;

    if(opts.mode === "add"){
      modalTitle.textContent = "Add phrase";
      modalSubtitle.textContent = "Make it short and easy to tap.";
      modalEmoji.value = "";
      modalText.value = "";

      if(opts.context?.type === "quick"){
        modalCategoryWrap.classList.add("hidden");
      } else {
        modalCategoryWrap.classList.remove("hidden");
        modalCategory.value = opts.context?.categoryId || active.id;
      }
    }

    if(opts.mode === "edit"){
      modalTitle.textContent = "Edit phrase";
      modalSubtitle.textContent = "Change emoji or text. Keep it comfy.";
      modalEmoji.value = opts.item?.emoji || "";
      modalText.value = opts.item?.text || "";

      if(opts.context?.type === "quick"){
        modalCategoryWrap.classList.add("hidden");
      } else {
        modalCategoryWrap.classList.remove("hidden");
        modalCategory.value = opts.context?.categoryId || active.id;
      }
    }

    setTimeout(() => modalText.focus(), 0);
  }

  function closeModal(){
    modal.classList.add("hidden");
    modalState = null;
  }

  modal.addEventListener("click", (e) => {
    if(e.target === modal) closeModal();
  });

  modalCancel.onclick = closeModal;

  modalSave.onclick = () => {
    const emoji = (modalEmoji.value || "").trim();
    const text = (modalText.value || "").trim();
    const chosenCategoryId = modalCategory.value;

    if(!text){
      alert("Add some text first 🙂");
      return;
    }

    if(!modalState) return;

    if(modalState.mode === "add"){
      const newItem = { id: uid(), emoji: emoji || "🧺", text };

      if(modalState.context?.type === "quick"){
        state.quick.unshift(newItem);
      } else {
        const catId = chosenCategoryId || getActiveCategory().id;
        const list = phrasesForCategory(catId);
        state.phrasesByCategory[catId] = [newItem, ...list];
        state.activeCategoryId = catId;
      }
    }

    if(modalState.mode === "edit"){
      const item = modalState.item;
      if(!item) return;

      item.emoji = emoji || "🧺";
      item.text = text;

      if(modalState.context?.type === "category"){
        const oldCat = modalState.context.categoryId;
        const newCat = chosenCategoryId || oldCat;

        if(newCat !== oldCat){
          state.phrasesByCategory[oldCat] = phrasesForCategory(oldCat).filter(p => p.id !== item.id);
          state.phrasesByCategory[newCat] = [item, ...phrasesForCategory(newCat)];
          state.activeCategoryId = newCat;
        }
      }
    }

    saveData();
    closeModal();
    renderAll();
  };

  /* ---------- controls ---------- */
  editBtn.onclick = () => {
    state.editMode = !state.editMode;
    saveData();
    renderAll();
  };

  stopBtn.onclick = stopSpeaking;

  testBtn.onclick = () => {
    speak("BasketTalk is ready.");
  };

  voiceSelect.onchange = () => {
    state.voiceURI = voiceSelect.value;
    saveData();
  };

  rateRange.oninput = () => {
    state.rate = Number(rateRange.value);
    saveData();
  };

  pitchRange.oninput = () => {
    state.pitch = Number(pitchRange.value);
    saveData();
  };

  ttsSayBtn.onclick = () => {
    speak(ttsInput.value);
    ttsInput.value = "";
    ttsInput.focus();
  };

  ttsInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      ttsSayBtn.click();
    }
  });

  addQuickBtn.onclick = () => {
    openModal({ mode: "add", context: { type: "quick" } });
  };

  addPhraseBtn.onclick = () => {
    openModal({ mode: "add", context: { type: "category", categoryId: getActiveCategory().id } });
  };

  addToCategoryBtn.onclick = () => {
    openModal({ mode: "add", context: { type: "category", categoryId: getActiveCategory().id } });
  };

  /* ---------- service worker ---------- */
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  /* ---------- initial render ---------- */
  renderAll();
});
