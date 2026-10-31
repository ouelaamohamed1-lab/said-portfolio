// ===== Animated network background =====
const cv = document.getElementById("bg"), cx = cv.getContext("2d");
let W, H, pts = [], mouse = { x: -999, y: -999 };
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(90, Math.floor(W / 16)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
addEventListener("resize", resize); resize();
addEventListener("mousemove", e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  const g = document.getElementById("glow");
  g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px";
});
function draw() {
  cx.clearRect(0, 0, W, H);
  const light = document.documentElement.classList.contains("light");
  const col = light ? "60,80,200" : "100,160,255";
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    cx.fillStyle = `rgba(${col},.8)`;
    cx.beginPath(); cx.arc(p.x, p.y, 2, 0, 7); cx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        cx.strokeStyle = `rgba(${col},${.25 * (1 - d / 130)})`;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke();
      }
    }
    const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (dm < 160) {
      cx.strokeStyle = `rgba(34,227,196,${.5 * (1 - dm / 160)})`;
      cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke();
    }
  });
  requestAnimationFrame(draw);
}
draw();

// ===== Typing effect =====
const roles = ["Web Developer", "C Programmer", "Electronics Student", "Future Robotics Engineer"];
const typeEl = document.getElementById("type");
let ri = 0, ci = 0, del = false;
(function type() {
  const w = roles[ri];
  typeEl.textContent = w.slice(0, del ? --ci : ++ci);
  let delay = del ? 40 : 90;
  if (!del && ci === w.length) { del = true; delay = 1400; }
  else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; delay = 400; }
  setTimeout(type, delay);
})();

// ===== Nav, progress, back-to-top, active link =====
const nav = document.querySelector("nav"), up = document.getElementById("up");
const links = document.querySelectorAll(".menu a[href^='#']");
addEventListener("scroll", () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  document.getElementById("progress").style.width = (y / h * 100) + "%";
  nav.classList.toggle("scrolled", y > 50);
  up.classList.toggle("show", y > 500);
  document.querySelectorAll("main section[id]").forEach(s => {
    if (y + 200 >= s.offsetTop && y + 200 < s.offsetTop + s.offsetHeight)
      links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + s.id));
  });
});
up.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

// ===== Scroll reveal + counters + skill bars =====
function count(el) {
  const target = +el.dataset.n, suf = el.dataset.s || "+";
  let n = 0;
  const step = setInterval(() => {
    n += Math.max(1, Math.ceil(target / 40));
    if (n >= target) { n = target; clearInterval(step); }
    el.textContent = n + suf;
  }, 35);
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-n]").forEach(count);
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ===== Skill tabs =====
const sks = document.querySelectorAll(".sk"), cells = document.querySelectorAll(".cell");
function filter(f) {
  sks.forEach(s => {
    const show = s.dataset.c === f;
    s.classList.toggle("hide", !show);
    if (show) { s.style.animation = "none"; s.offsetHeight; s.style.animation = ""; }
  });
}
function filterCells(f) {
  cells.forEach(c => {
    const show = c.dataset.c === f;
    c.classList.toggle("hide", !show);
    if (show) { c.style.animation = "none"; c.offsetHeight; c.style.animation = ""; }
  });
}
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => {
  document.querySelector(".tabs .active").classList.remove("active");
  b.classList.add("active"); filter(b.dataset.f); filterCells(b.dataset.f);
});
filter("web"); filterCells("web");

// ===== 3D tilt on project cards =====
document.querySelectorAll(".tilt").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
  });
  c.addEventListener("mouseleave", () => c.style.transform = "");
});

// ===== Theme toggle (remembered) =====
const root = document.documentElement, tbtn = document.getElementById("theme");
function setTheme(l) {
  root.classList.toggle("light", l);
  tbtn.innerHTML = `<i class="fa-solid fa-${l ? "sun" : "moon"}"></i>`;
  try { localStorage.setItem("light", l ? "1" : "0"); } catch (e) {}
}
try { setTheme(localStorage.getItem("light") === "1"); } catch (e) {}
tbtn.onclick = () => setTheme(!root.classList.contains("light"));

console.log("Welcome to Said's Portfolio 🚀");