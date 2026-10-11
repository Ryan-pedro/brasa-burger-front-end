import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div role="status" aria-live="polite">
      @if (toast.message(); as msg) {
        @for (n of [toast.id()]; track n) {
          <div class="toast">
            <span class="check"><app-icon name="check" [size]="16" [stroke]="3.2" /></span>
            {{ msg }}
          </div>
        }
      }
    </div>
  `,
  styles: `
    .toast { position: fixed; left: 50%; top: 86px; z-index: 120; display: flex; align-items: center; gap: 10px;
      background: var(--success); color: var(--white); padding: 12px 18px 12px 12px; border-radius: 16px; white-space: nowrap;
      box-shadow: 0 12px 28px rgba(0, 0, 0, .25); font-size: 15px; font-weight: 900;
      animation: toastIn .4s cubic-bezier(.2, .9, .3, 1.3) both; }
    .check { width: 28px; height: 28px; border-radius: 50%; background: var(--white); color: var(--success);
      display: flex; align-items: center; justify-content: center; }
    @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -16px) scale(.9); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
