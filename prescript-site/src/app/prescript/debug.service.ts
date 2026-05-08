import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService implements OnDestroy {

  private pCount = 0;
  private pTimer: ReturnType<typeof setTimeout> | null = null;
  private keydownListener!: (e: KeyboardEvent) => void;

  constructor() {
    this.initDebug();
  }

  private initDebug(): void {
    this.keydownListener = (e: KeyboardEvent) => {
      if (e.key !== '.') return;

      this.pCount++;
      if (this.pTimer) clearTimeout(this.pTimer);
      this.pTimer = setTimeout(() => { this.pCount = 0; }, 2000);

      if (this.pCount >= 5) {
        this.pCount = 0;
        this.showDebugPanel();
        console.log('funciona el puntp');
      }
    };

    document.addEventListener('keydown', this.keydownListener);
  }

  private showDebugPanel(): void {
    if (document.getElementById('debug-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: #080808; border: 1px solid #2a2a2a; padding: 15px;
      display: flex; flex-direction: column; gap: 10px; z-index: 10000;
      font-family: 'Georgia', serif; box-shadow: 0 0 20px rgba(0,0,0,0.8);
    `;

    const btnStyle = `
      background: transparent; border: 1px solid #444; color: #888;
      font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 5px 10px; cursor: pointer; transition: all 0.2s;
    `;

    const createBtn = (text: string, onClick: () => void, color = '#888'): HTMLButtonElement => {
      const b = document.createElement('button');
      b.style.cssText = btnStyle;
      b.textContent = text;
      b.addEventListener('click', onClick);
      b.addEventListener('mouseenter', () => { b.style.borderColor = color; b.style.color = '#eee'; });
      b.addEventListener('mouseleave', () => { b.style.borderColor = '#444'; b.style.color = '#888'; });
      return b;
    };

    // Activar Misión 1 (Hoja)
    panel.appendChild(createBtn('Activar Misión 1', () => {
      localStorage.setItem('ai_chat_done', '1');
      alert('Misión 1 activada.');
      setTimeout(() => location.reload(), 800);
    }, '#6a8a5a'));

    // Activar Misión 2 (Manivela)
    panel.appendChild(createBtn('Activar Misión 2', () => {
      localStorage.setItem('lucky_clicks', '30');
      localStorage.setItem('mision2_started', '1');
      localStorage.setItem('mision2_intro_done', '1');
      localStorage.setItem('mision2_progress', '0');
      alert('Mision 2 - manivela - report.');
    }, '#a09880'));

    // Borrar Todo y Recargar
    const deleteBtn = createBtn('Borrar Datos y Reiniciar', () => {
      localStorage.clear();
      deleteBtn.textContent = 'Borrando...';
      setTimeout(() => location.reload(), 800);
    }, '#883333');
    deleteBtn.style.marginTop = '5px';
    deleteBtn.style.borderColor = '#550000';
    panel.appendChild(deleteBtn);

    // Cerrar Panel
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute; top: 2px; right: 5px; color: #444;
      cursor: pointer; font-size: 12px;
    `;
    closeBtn.onclick = () => panel.remove();
    panel.appendChild(closeBtn);

    document.body.appendChild(panel);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keydownListener);
    if (this.pTimer) clearTimeout(this.pTimer);
  }
}
