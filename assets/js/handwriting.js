import { registerTegakiElement, TegakiEngine } from "https://esm.sh/tegaki@0.17.1/wc";
import caveat from "https://esm.sh/tegaki@0.17.1/fonts/caveat";

TegakiEngine.registerBundle(caveat);
registerTegakiElement();

const accent = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--color-orange").trim() || "#DA702C";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeTegaki(slot) {
  const text = slot.dataset.handwriting || slot.textContent.trim();
  const suffix = slot.dataset.handwritingSuffix || "";
  const fontSize = slot.dataset.handwritingSize || getComputedStyle(slot).fontSize;
  const duration = Number(slot.dataset.handwritingDuration) ||
                   clamp(text.length * 0.035, 0.6, 1.4);

  slot.textContent = "";

  const el = document.createElement("tegaki-renderer");
  el.setAttribute("text", text);
  el.setAttribute("duration", String(duration));
  el.style.fontSize = fontSize;
  el.style.color = accent();
  el.font = caveat;
  slot.appendChild(el);

  if (suffix) {
    const s = document.createElement("span");
    s.textContent = suffix;
    s.style.marginLeft = "0.3em";
    s.style.display = "inline-block";
    slot.appendChild(s);
  }
}

const targets = document.querySelectorAll("[data-handwriting]");
if (targets.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        makeTegaki(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4, rootMargin: "0px 0px -5% 0px" });

  targets.forEach((el) => io.observe(el));
}

const inkTargets = document.querySelectorAll(
  ".bento-label-dot, .wr-year-label, .til-month-label"
);
if (inkTargets.length) {
  const inkIo = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 50}ms`;
        entry.target.classList.add("is-in-view");
        inkIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5, rootMargin: "0px 0px -8% 0px" });

  inkTargets.forEach((el) => inkIo.observe(el));
}
