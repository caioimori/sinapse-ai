/* global document:readonly, matchMedia:readonly, window:readonly */
'use strict';
const steps = [
  { title: 'Planejar', copy: 'Dê nome à ideia. Escolha o que importa e desenhe o próximo passo.' },
  { title: 'Produzir', copy: 'Transforme a intenção em forma. Construa uma versão que possa ser vista e compartilhada.' },
  { title: 'Revisar', copy: 'Olhe para o conjunto. Confira a mensagem, ajuste os detalhes e reconheça o que está pronto.' },
];
const media = matchMedia('(prefers-reduced-motion: reduce)');
const get = (id) => document.getElementById(id);
let current = 0; let target = 0; let generation = 0; let mounted = false; let animation = null; let paused = false;
const listeners = [];
function listen(element, event, callback) { element.addEventListener(event, callback); listeners.push(() => element.removeEventListener(event, callback)); }
function cancel() { generation += 1; if (animation) animation.cancel(); animation = null; paused = false; get('scene').style.removeProperty('will-change'); }
function paint(step) {
  current = step; target = step;
  get('scene-number').textContent = `0${step + 1}`;
  get('scene-title').textContent = steps[step].title; get('scene-copy').textContent = steps[step].copy;
  document.querySelectorAll('[data-step]').forEach((item, index) => { if (index === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
  get('next').disabled = step === 2; get('pause').disabled = true; get('pause').textContent = 'Pausar';
  get('motion-state').textContent = `Etapa ${step + 1} de 3 · ${steps[step].title}${media.matches ? ' · Movimento reduzido' : ''}`;
}
async function transition(step) {
  cancel(); target = step; const token = generation;
  if (media.matches) { paint(step); return; }
  get('pause').disabled = false; get('scene').style.willChange = 'transform, opacity';
  get('motion-state').textContent = `Avançando para ${steps[step].title}`;
  animation = get('scene').animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-12px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
  try {
    await animation.finished;
    if (token !== generation || !mounted) return;
    animation.cancel(); animation = null; paint(step); get('pause').disabled = false;
    animation = get('scene').animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    await animation.finished;
    if (token !== generation || !mounted) return;
    cancel(); paint(step);
  } catch (error) { if (error.name !== 'AbortError') throw error; }
}
function preferenceChanged() { const end = target; cancel(); paint(end); }
function mount() {
  if (mounted) return; mounted = true;
  listen(get('next'), 'click', () => transition(Math.min(target + 1, 2)));
  listen(get('reset'), 'click', () => { cancel(); paint(0); });
  listen(get('pause'), 'click', () => {
    if (!animation) return;
    paused = !paused; paused ? animation.pause() : animation.play();
    get('pause').textContent = paused ? 'Continuar' : 'Pausar'; get('motion-state').textContent = paused ? 'Transição pausada. Continue ou reinicie quando quiser.' : `Avançando para ${steps[target].title}`;
  });
  listen(media, 'change', preferenceChanged); paint(current);
}
function unmount() { if (!mounted) return; mounted = false; cancel(); for (const remove of listeners.splice(0)) remove(); paint(current); }
window.fixtureMotion = { mount, unmount, inspect: () => ({ current, target, mounted, listenerCount: listeners.length, activeAnimations: get('scene').getAnimations().length, paused, reduced: media.matches, willChange: get('scene').style.willChange }) };
mount();
