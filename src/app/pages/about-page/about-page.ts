import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  imports: [],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage { }
