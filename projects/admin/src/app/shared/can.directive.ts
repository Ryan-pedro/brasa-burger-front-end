import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AdminSession } from '../core/session/admin-session.service';

@Directive({ selector: '[admCan]' })
export class CanDirective {
  readonly admCan = input.required<string>();
  readonly admCanElse = input<TemplateRef<unknown> | null>(null);

  private readonly session = inject(AdminSession);
  private readonly template = inject(TemplateRef);
  private readonly container = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const allowed = this.session.can(this.admCan());
      const fallback = this.admCanElse();
      this.container.clear();
      if (allowed) {
        this.container.createEmbeddedView(this.template);
      } else if (fallback) {
        this.container.createEmbeddedView(fallback);
      }
    });
  }
}
