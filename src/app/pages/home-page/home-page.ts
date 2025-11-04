import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  NgZone,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full overflow-y-visible',
  },
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('lineCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('step1') step1Ref!: ElementRef<HTMLElement>;
  @ViewChild('step2') step2Ref!: ElementRef<HTMLElement>;
  @ViewChild('step3') step3Ref!: ElementRef<HTMLElement>;
  @ViewChild('step4') step4Ref!: ElementRef<HTMLElement>;
  @ViewChild('step5') step5Ref!: ElementRef<HTMLElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private resizeObserver?: ResizeObserver;

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.startLinesProcess();
  }

  startLinesProcess() {
    this.ngZone.runOutsideAngular(() => {
      this.initCanvas();
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(document.body);
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    });
  }


  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.drawLines();
  }

  private drawLine(fromEl: HTMLElement, toEl: HTMLElement) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    const offset = this.canvasRef.nativeElement.getBoundingClientRect();
    if (!offset) return;

    ctx.beginPath();
    ctx.moveTo(from.x + from.width / 2 - offset.x, from.y + from.height / 2 - offset.y);
    ctx.lineTo(to.x + to.width / 2 - offset.x, to.y + to.height / 2 - offset.y);
    ctx.strokeStyle = 'rgba(56,189,248,0.6)'; // color Tailwind cyan-400
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  private drawLines() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    const steps = [
      this.step1Ref.nativeElement,
      this.step2Ref.nativeElement,
      this.step3Ref.nativeElement,
      this.step4Ref.nativeElement,
      this.step5Ref.nativeElement,
    ];
    if (!steps.length) return;

    for (let i = 0; i < steps.length - 1; i++) {
      this.drawLine(steps[i], steps[i + 1]);
    }
  }
}
