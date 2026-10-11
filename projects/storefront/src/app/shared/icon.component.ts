import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'home' | 'burger' | 'cup' | 'tag' | 'bag' | 'plus' | 'minus' | 'close' | 'check' | 'back'
  | 'arrow-right' | 'trash' | 'edit' | 'clock' | 'pin' | 'flame' | 'at' | 'chat' | 'printer'
  | 'utensils' | 'scooter' | 'search' | 'medal' | 'leaf';

/** Ícones de traço (stroke) desenhados em SVG inline, herdam a cor do texto. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display:inline-flex' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('home') { <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/> }
        @case ('burger') { <path d="M4 11h16M4 11a8 5 0 0 1 16 0M4 15h16M5 15v2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2"/> }
        @case ('cup') { <path d="M6 7h12l-1.5 13.2a1 1 0 0 1-1 .8h-7a1 1 0 0 1-1-.8zM5 7h14M12 7l2-5"/> }
        @case ('tag') { <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/> }
        @case ('bag') { <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/> }
        @case ('plus') { <path d="M12 5v14M5 12h14"/> }
        @case ('minus') { <path d="M5 12h14"/> }
        @case ('close') { <path d="M6 6l12 12M18 6 6 18"/> }
        @case ('check') { <path d="m5 12.5 4.5 4.5L19 7.5"/> }
        @case ('back') { <path d="M15 5l-7 7 7 7"/> }
        @case ('arrow-right') { <path d="M5 12h14M13 6l6 6-6 6"/> }
        @case ('trash') { <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/> }
        @case ('edit') { <path d="M4 20h4L19 9l-4-4L4 16z"/> }
        @case ('clock') { <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/> }
        @case ('pin') { <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/> }
        @case ('flame') { <path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.5 3 2.5 3-1-3 0-6 0-8z"/> }
        @case ('at') { <circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/> }
        @case ('chat') { <path d="M4 5h16v11H8l-4 4z"/> }
        @case ('printer') { <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/> }
        @case ('utensils') { <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9"/> }
        @case ('scooter') { <circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l3-7h-4M14 6h3l1 4M4 13h6l2 4"/> }
        @case ('search') { <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/> }
        @case ('medal') { <circle cx="12" cy="9" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/> }
        @case ('leaf') { <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l7-7"/> }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(22);
  readonly stroke = input(2);
}
