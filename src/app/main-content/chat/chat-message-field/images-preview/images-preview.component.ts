import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-images-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './images-preview.component.html',
  styleUrl: './images-preview.component.scss'
})
export class ImagesPreviewComponent {
  @Input() imagePreviews: any
  
  deleteImage(i: any) {
    this.imagePreviews.splice(i, 1);
  }
}
