import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'custom-icon',
  imports: [CommonModule],
  template: `
  <svg class="icon" [attr.aria-label]="icon" preserveAspectRatio="none" width="100%" height="100%">
    <use [attr.xlink:href]="spritePath + '#' + icon"></use>
  </svg>
  `,
  styles: [
    `
      .icon {
        display: inline-block;
        fill: currentColor;
        vertical-align: middle;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full w-full flex items-center justify-center',
  },
})
export class IconComponent {
  @Input() icon: string = 'user';
  @Input() size: string = '1';
  @Input() color: string = 'currentColor';
  @Input() spritePath: string = 'icons/sprite.svg';
}
