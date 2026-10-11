import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Selo da marca: círculo com chama. */
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display:inline-flex' },
  template: `
    <span class="mark" [class.inverted]="inverted()" [style.width.px]="size()" [style.height.px]="size()">
      <svg [attr.width]="size() * 0.56" [attr.height]="size() * 0.56" viewBox="0 0 24 24">
        <path d="M12 2c1.2 4.6 6 6.4 6 11.6A6 6 0 0 1 6 13.6c0-2.9 1.7-4.6 2.9-5.8.3 2.3 1.7 3.5 2.9 3.5C10.6 7.8 11.8 4.3 12 2z"/>
      </svg>
    </span>
  `,
  styles: `
    .mark { border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px var(--yellow); }
    .mark svg { fill: var(--yellow); }
    .mark.inverted { background: var(--white); }
    .mark.inverted svg { fill: var(--red); }
  `,
})
export class LogoMarkComponent {
  readonly size = input(40);
  readonly inverted = input(false);
}
