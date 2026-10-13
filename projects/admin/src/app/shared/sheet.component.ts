import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'adm-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog class="sheet" aria-labelledby="sheet-title" (close)="closed.emit()">
      <header>
        <h2 id="sheet-title">{{ heading() }}</h2>
        <button type="button" class="close" (click)="dialog.close()">Fechar</button>
      </header>
      <ng-content />
    </dialog>
  `,
  styles: `
    .sheet {
      margin: 0 0 0 auto;
      width: min(480px, 100vw);
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      padding: 24px;
      border: 0;
      background: var(--surface);
      color: var(--ink);
      box-shadow: -12px 0 32px rgba(42, 23, 18, .18);
    }
    .sheet::backdrop { background: rgba(42, 23, 18, .35); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
    h2 { font-size: 22px; font-weight: 800; }
    .close { border: 0; background: none; font-weight: 800; color: var(--ink-2); padding: 8px; }
  `,
})
export class SheetComponent {
  readonly heading = input.required<string>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }
}
