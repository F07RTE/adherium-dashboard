import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniqueRating } from '../../pipes/technique-rating.pipe';

@Component({
  selector: 'app-metric-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="metric-badge" [ngClass]="rating">{{ rating }}</span>
  `,
  styles: [`
    .metric-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .good        { background: #e6f4ea; color: #1e7e34; }
    .acceptable  { background: #fff8e1; color: #a16200; }
    .poor        { background: #fce8e6; color: #c5221f; }
  `],
})
export class MetricBadgeComponent {
  @Input() rating: TechniqueRating = 'poor';
}
