import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-thread-images-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './thread-images-preview.component.html',
  styleUrl: './thread-images-preview.component.scss'
})
export class ThreadImagesPreviewComponent {
  @Input() imagePreviews: any
  
  deleteImage(i: any) {
    this.imagePreviews.splice(i, 1);
  }
}
