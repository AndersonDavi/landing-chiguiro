import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-footer',
  imports: [IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Footer { }
