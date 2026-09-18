/* =========================================================
   BIRTHDAY ADVENTURE — SCRIPT
   Semua bagian yang butuh data personal diambil dari
   `birthdayConfig` di bawah ini. Ganti nilainya, selesai.
   ========================================================= */

const birthdayConfig = {
  name: "Hurin'in sophia",              // Nama yang tampil di seluruh halaman
  secretCode: "0607",                 // Kode 4 digit untuk Level 1
  greeting: "Selamat ulang tahun!",   // Cadangan teks sapaan (opsional dipakai)
  birthYear: 2000,                    // Dipakai untuk menghitung usia otomatis (opsional)
  ageOverride: null,                  // Set angka di sini (misal 25) untuk memaksa usia tertentu

  // Playlist musik: isi 1 lagu saja kalau mau diulang terus (looping),
  // atau beberapa lagu kalau mau otomatis ganti setelah lagu sebelumnya selesai.
  // Urutan pemutaran mengikuti urutan array ini, lalu kembali ke awal lagi.
  songs: [
    "assets/birthday-song.mp3"
    // , "assets/birthday-song-2.mp3"
    // , "assets/birthday-song-3.mp3"
  ],

  typingLines: [
    "Semoga di usia yang baru ini,",
    "semakin banyak hal baik yang datang,",
    "semakin banyak alasan untuk tersenyum,",
    "dan setiap langkah yang kamu pilih",
    "membawamu menuju hal-hal yang kamu impikan."
  ],

  wishCards: {
    1: {
      icon: "'🙏",
      title: "THANKS YOU",
      text: "Terimakasih atas kehadiran mu di kehidupanku, mungkin kehadiran ku dihidup seperti parasit.Namun kehadiran mu ku anggap bagaikan bunga sakura yang sedang bermekaran ."
    },
    2: {
      icon: "🤍",
      title: "A LITTLE PRAYER",
      text: "semoga tercapai semua cita-citanya, dipermudah jalan hidup nya dan dikelilingi oleh orang baik."
    },
    3: {
      icon: "🌙",
      title: "FOR YOUR FUTURE",
      text: "Semoga semua impian yang pernah kamu terbangkan pada doa mu terwujud, jangan lupa untuk berseyukur, dan ingat tujuan mu."
    }
  }
};

/* =========================================================
   SMALL UTILITIES
   ========================================================= */

// Aman dipanggil kapan saja: play audio effect tanpa pernah melempar error ke user
function playSfx(el){
  try{
    if(!el) return;
    el.currentTime = 0;
    const p = el.play();
    if(p && typeof p.catch === "function") p.catch(()=>{ /* diabaikan: file tidak ada / autoplay diblokir */ });
  }catch(e){ /* tidak apa-apa, website tetap jalan tanpa suara */ }
}

function qs(sel, ctx=document){ return ctx.querySelector(sel); }
function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */
const screens = qsa(".screen");
const hud = qs("#hud");

function goToScreen(screenName){
  const current = qs(".screen.active");
  const next = qs(`.screen[data-screen="${screenName}"]`);
  if(!next || next === current) return;

  if(current){
    current.classList.add("leaving");
    setTimeout(()=>{
      current.classList.remove("active", "leaving");
      next.classList.add("active");
      window.scrollTo({ top:0, behavior:"auto" });
    }, 420);
  }else{
    next.classList.add("active");
  }

  // HUD hanya muncul mulai level 1 dan seterusnya
  if(screenName === "splash"){
    hud.classList.add("hidden");
  }else{
    hud.classList.remove("hidden");
  }
}

function markProgress(step){
  qsa(".prog-item").forEach(item=>{
    if(Number(item.dataset.step) <= step) item.classList.add("done");
    else item.classList.remove("done");
  });
}

/* =========================================================
   NIGHT SKY BACKGROUND (stars + drifting particles)
   ========================================================= */
(function initSky(){
  const canvas = qs("#sky-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.6 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      driftY: Math.random() * 0.05 + 0.01
    }));
  }

  function tick(t){
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s=>{
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(247,245,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y -= s.driftY;
      if(s.y < -5){ s.y = h + 5; s.x = Math.random() * w; }
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();

/* =========================================================
   CURSOR SPARKLE TRAIL
   ========================================================= */
(function initSparkle(){
  const canvas = qs("#sparkle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize);
  resize();

  function spawn(x, y){
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.3,
      life: 1,
      size: Math.random() * 2.5 + 1.2,
      hue: Math.random() > 0.5 ? "243,201,105" : "240,163,196"
    });
    if(particles.length > 120) particles.shift();
  }

  let lastSpawn = 0;
  function onMove(e){
    const now = performance.now();
    if(now - lastSpawn < 30) return;
    lastSpawn = now;
    const point = e.touches ? e.touches[0] : e;
    if(!point) return;
    spawn(point.clientX, point.clientY);
  }
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive:true });

  function tick(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},${Math.max(0,p.life)})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* =========================================================
   CONFETTI + FLOATING HEARTS/STARS
   ========================================================= */
const confettiCanvas = qs("#confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
function resizeConfettiCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

function fireConfetti(amount = 90, duration = 2600){
  const colors = ["#f3c969", "#f0a3c4", "#a992e8", "#ffffff"];
  const pieces = Array.from({ length: amount }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * 200,
    r: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: Math.random() * 2 + 2,
    vx: (Math.random() - 0.5) * 2,
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.2
  }));

  const start = performance.now();
  function frame(now){
    const elapsed = now - start;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.6);
      confettiCtx.restore();
    });
    if(elapsed < duration){
      requestAnimationFrame(frame);
    }else{
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  requestAnimationFrame(frame);
}

// Floating hearts / stars / balloons naik dari bawah layar (dekorasi final surprise)
function spawnFloaty(emoji, count = 14, spread = 6000){
  for(let i = 0; i < count; i++){
    setTimeout(()=>{
      const el = document.createElement("div");
      el.className = "floaty";
      el.textContent = emoji;
      el.style.left = Math.random() * 100 + "vw";
      el.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      el.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
      el.style.animationDuration = (5 + Math.random() * 4) + "s";
      document.body.appendChild(el);
      setTimeout(()=> el.remove(), 10000);
    }, Math.random() * spread);
  }
}

/* =========================================================
   SPLASH SCREEN
   ========================================================= */
qs("#btn-start").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  tryStartMusic();     // interaksi pertama pengguna -> boleh coba nyalakan musik
  goToScreen("level1");
  markProgress(0);
});

/* =========================================================
   LEVEL 1 — TEBAK KODE
   ========================================================= */
(function initLevel1(){
  const digits = qsa(".code-digit");
  const row = qs("#code-input-row");
  const feedback = qs("#level1-feedback");
  const unlockBtn = qs("#btn-unlock");
  const successPanel = qs("#level1-success");

  // auto-advance antar kotak digit
  digits.forEach((input, idx)=>{
    input.addEventListener("input", ()=>{
      input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);
      if(input.value && digits[idx + 1]) digits[idx + 1].focus();
    });
    input.addEventListener("keydown", (e)=>{
      if(e.key === "Backspace" && !input.value && digits[idx - 1]) digits[idx - 1].focus();
      if(e.key === "Enter") unlockBtn.click();
    });
  });

  unlockBtn.addEventListener("click", ()=>{
    const entered = digits.map(d => d.value).join("");
    playSfx(qs("#sfx-click"));

    if(entered.length < 4){
      feedback.textContent = "Isi dulu ke-4 kotaknya ya 🙂";
      return;
    }

    if(entered === birthdayConfig.secretCode){
      feedback.textContent = "";
      unlockBtn.classList.add("hidden");
      successPanel.classList.remove("hidden");
      playSfx(qs("#sfx-success"));
      fireConfetti(60, 1800);
      markProgress(1);
    }else{
      feedback.textContent = "Hmm... belum tepat 😄";
      row.classList.remove("shake");
      void row.offsetWidth; // restart animasi
      row.classList.add("shake");
      digits.forEach(d => d.value = "");
      digits[0].focus();
    }
  });

  qs("#btn-to-level2").addEventListener("click", ()=>{
    playSfx(qs("#sfx-click"));
    goToScreen("level2");
    initStarLevel();
  });
})();

/* =========================================================
   LEVEL 2 — PILIH BINTANG
   ========================================================= */
function initStarLevel(){
  const field = qs("#star-field");
  const feedback = qs("#level2-feedback");
  const successPanel = qs("#level2-success");

  field.innerHTML = "";
  successPanel.classList.add("hidden");
  feedback.textContent = "";

  const totalStars = 8;
  const targetIndex = Math.floor(Math.random() * totalStars);
  const fieldWidth = field.clientWidth || 300;
  const fieldHeight = field.clientHeight || 260;

  for(let i = 0; i < totalStars; i++){
    const btn = document.createElement("button");
    btn.className = "game-star" + (i === targetIndex ? " target" : "");
    btn.textContent = i === targetIndex ? "✨" : "⭐";
    btn.style.left = Math.random() * (fieldWidth - 40) + "px";
    btn.style.top = Math.random() * (fieldHeight - 40) + "px";
    btn.style.animationDelay = (Math.random() * 2) + "s";
    btn.setAttribute("aria-label", "bintang");

    btn.addEventListener("click", ()=>{
      playSfx(qs("#sfx-click"));
      if(i === targetIndex){
        btn.classList.add("sparkle-pop");
        feedback.textContent = "";
        successPanel.classList.remove("hidden");
        playSfx(qs("#sfx-success"));
        markProgress(2);
        qsa(".game-star", field).forEach(s => s.style.pointerEvents = "none");
      }else{
        feedback.textContent = "Bukan yang itu, coba lagi ✨";
        btn.style.transform = "scale(0.85)";
        setTimeout(()=>{ btn.style.transform = ""; }, 200);
      }
    });

    field.appendChild(btn);
  }
}

qs("#btn-to-level3").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  goToScreen("level3");
});

/* =========================================================
   LEVEL 3 — PESAN TERSEMBUNYI (flip card)
   ========================================================= */
qs("#btn-open-secret").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  qs("#flip-card").classList.add("flipped");
});

qs("#btn-open-wish").addEventListener("click", ()=>{
  playSfx(qs("#sfx-success"));
  markProgress(4);
  goToScreen("main");
  startMainPageAnimations();
});

/* =========================================================
   MAIN BIRTHDAY PAGE
   ========================================================= */
function setStaticText(){
  qs("#recipient-name").textContent = birthdayConfig.name;
  qsa(".wish-textarea").forEach(t => t.placeholder = `Tulis doa atau ucapan untuk ${birthdayConfig.name}...`);
}
setStaticText();

let typingTimeoutId = null;

function typeLines(lines, targetEl, onDone){
  targetEl.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor-blink";

  let lineIndex = 0;
  let charIndex = 0;

  function typeStep(){
    if(lineIndex >= lines.length){
      cursor.remove();
      if(onDone) onDone();
      return;
    }
    const currentLine = lines[lineIndex];
    if(charIndex === 0){
      targetEl.appendChild(document.createTextNode(""));
    }
    targetEl.textContent = lines.slice(0, lineIndex).join("\n") +
      (lineIndex > 0 ? "\n" : "") + currentLine.slice(0, charIndex + 1);
    targetEl.appendChild(cursor);

    charIndex++;
    if(charIndex >= currentLine.length){
      lineIndex++;
      charIndex = 0;
      typingTimeoutId = setTimeout(typeStep, 420);
    }else{
      typingTimeoutId = setTimeout(typeStep, 28);
    }
  }
  clearTimeout(typingTimeoutId);
  typeStep();
}

function animateAgeCounter(){
  const el = qs("#age-counter");
  const target = birthdayConfig.ageOverride !== null
    ? birthdayConfig.ageOverride
    : (new Date().getFullYear() - birthdayConfig.birthYear);

  if(!Number.isFinite(target) || target <= 0){
    qs("#age-counter-widget").classList.add("hidden");
    return;
  }
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(()=>{
    current += step;
    if(current >= target){ current = target; clearInterval(timer); }
    el.textContent = current;
  }, 35);
}

function startMainPageAnimations(){
  typeLines(birthdayConfig.typingLines, qs("#hero-typing"));
  animateAgeCounter();
}

qs("#btn-replay-anim").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  qs("#age-counter").textContent = "0";
  startMainPageAnimations();
});

/* ---------- digital clock ---------- */
(function initClock(){
  const el = qs("#digital-clock");
  function tick(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 1000 * 15);
})();

/* ---------- wish card modal ---------- */
const wishModalOverlay = qs("#wish-modal-overlay");
qsa(".wish-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    playSfx(qs("#sfx-click"));
    const id = card.dataset.card;
    const data = birthdayConfig.wishCards[id];
    if(!data) return;
    qs("#wish-modal-icon").textContent = data.icon;
    qs("#wish-modal-title").textContent = data.title;
    qs("#wish-modal-text").textContent = data.text;
    wishModalOverlay.classList.add("open");
    card.classList.add("opened");
  });
});
qs("#wish-modal-close").addEventListener("click", ()=> wishModalOverlay.classList.remove("open"));
wishModalOverlay.addEventListener("click", (e)=>{ if(e.target === wishModalOverlay) wishModalOverlay.classList.remove("open"); });

/* ---------- write your own wish (localStorage) ---------- */
const WISH_STORAGE_KEY = "birthdayAdventure_ownWishes";

function loadSavedWishes(){
  try{
    const raw = localStorage.getItem(WISH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveSavedWishes(list){
  try{ localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(list)); }
  catch(e){ /* localStorage tidak tersedia, cukup lewati */ }
}
function renderSavedWishes(){
  const list = loadSavedWishes();
  const container = qs("#saved-wishes-list");
  container.innerHTML = "";
  list.forEach(text=>{
    const div = document.createElement("div");
    div.className = "saved-wish-item";
    div.textContent = text;
    container.appendChild(div);
  });
}
renderSavedWishes();

qs("#btn-save-wish").addEventListener("click", ()=>{
  const textarea = qs("#own-wish-input");
  const value = textarea.value.trim();
  if(!value) return;
  playSfx(qs("#sfx-success"));
  const list = loadSavedWishes();
  list.push(value);
  saveSavedWishes(list);
  renderSavedWishes();
  textarea.value = "";
});

qs("#btn-clear-wish").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  saveSavedWishes([]);
  renderSavedWishes();
  qs("#own-wish-input").value = "";
});

/* ---------- scroll reveal (timeline & sections) ---------- */
(function initScrollReveal(){
  qsa(".section-heading, .section-caption, .wish-cards-grid, .write-wish-card, .timeline-item")
    .forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  qsa(".reveal").forEach(el => observer.observe(el));
})();

/* =========================================================
   FINAL SURPRISE
   ========================================================= */
const giftOverlay = qs("#gift-modal-overlay");
const giftBox = qs("#gift-box");
const giftHint = qs("#gift-hint");
const finalMessage = qs("#final-message");

qs("#btn-final-surprise").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  giftOverlay.classList.add("open");
  giftBox.classList.remove("opened");
  finalMessage.classList.add("hidden");
  giftHint.classList.remove("hidden");
  giftHint.textContent = "Ketuk kotaknya...";
});

function openGift(){
  if(giftBox.classList.contains("opened")) return;
  giftBox.classList.add("opened");
  giftHint.classList.add("hidden");
  playSfx(qs("#sfx-gift"));
  fireConfetti(140, 3200);
  spawnFloaty("🎈", 8);
  spawnFloaty("💛", 8);
  spawnFloaty("⭐", 8);

  setTimeout(()=>{
    qs("#final-title").textContent = `🎉 HAPPY BIRTHDAY, ${birthdayConfig.name.toUpperCase()}! 🎉`;
    finalMessage.classList.remove("hidden");
  }, 500);
}
giftBox.addEventListener("click", openGift);
giftBox.addEventListener("keydown", (e)=>{ if(e.key === "Enter" || e.key === " ") openGift(); });

qs("#btn-play-again").addEventListener("click", ()=>{
  playSfx(qs("#sfx-click"));
  giftOverlay.classList.remove("open");

  // reset semua state game supaya bisa dimainkan ulang dari awal
  qsa(".code-digit").forEach(d => d.value = "");
  qs("#level1-feedback").textContent = "";
  qs("#level1-success").classList.add("hidden");
  qs("#btn-unlock").classList.remove("hidden");
  qs("#level2-success").classList.add("hidden");
  qs("#flip-card").classList.remove("flipped");
  markProgress(0);

  goToScreen("splash");
});

/* =========================================================
   BACKGROUND MUSIC (dengan penanganan autoplay policy)
   ========================================================= */
const bgAudio = qs("#bg-audio");
bgAudio.volume = 0.35;

// Playlist: jika hanya 1 lagu, diulang terus. Jika lebih dari 1, otomatis
// lanjut ke lagu berikutnya setelah lagu yang sedang main selesai.
const playlist = (birthdayConfig.songs && birthdayConfig.songs.length)
  ? birthdayConfig.songs
  : ["assets/birthday-song.mp3"];
let currentSongIndex = 0;

function loadSong(index){
  currentSongIndex = ((index % playlist.length) + playlist.length) % playlist.length;
  bgAudio.src = playlist[currentSongIndex];
}
loadSong(0);
bgAudio.loop = playlist.length <= 1; // satu lagu -> diulang; banyak lagu -> lanjut manual lewat "ended"

bgAudio.addEventListener("ended", ()=>{
  if(playlist.length <= 1) return; // sudah ditangani oleh loop=true
  loadSong(currentSongIndex + 1);
  const p = bgAudio.play();
  if(p && typeof p.catch === "function") p.catch(()=>{ /* diabaikan, akan dicoba lagi lewat tombol musik */ });
});

const musicToggle = qs("#music-toggle");
const musicToast = qs("#music-toast");
let musicStartedByUser = false;

function showMusicToast(message){
  musicToast.textContent = message;
  musicToast.classList.remove("hidden");
  setTimeout(()=> musicToast.classList.add("hidden"), 3500);
}

function tryStartMusic(){
  if(musicStartedByUser) return;
  const playPromise = bgAudio.play();
  if(playPromise && typeof playPromise.then === "function"){
    playPromise.then(()=>{
      musicStartedByUser = true;
      musicToggle.classList.add("playing");
    }).catch(()=>{
      // Diblokir autoplay policy browser, atau file belum ada — tetap ramah, tidak error ke user
      showMusicToast("Musik diblokir browser — tap 🎵 untuk memutar");
    });
  }
}

musicToggle.addEventListener("click", ()=>{
  if(bgAudio.paused){
    const p = bgAudio.play();
    if(p && typeof p.catch === "function"){
      p.then(()=>{
        musicStartedByUser = true;
        musicToggle.classList.add("playing");
      }).catch(()=>{
        showMusicToast("File musik belum ditemukan di assets/birthday-song.mp3");
      });
    }
  }else{
    bgAudio.pause();
    musicToggle.classList.remove("playing");
  }
});

// Jika file musik gagal dimuat sama sekali, jangan biarkan error mengganggu pengalaman
bgAudio.addEventListener("error", ()=>{
  musicToggle.title = "File musik belum ditemukan di folder assets";
});

/* =========================================================
   INIT
   ========================================================= */
markProgress(0);
