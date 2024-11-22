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
  @Input() imagePreviewsThread: (string | ArrayBuffer | null)[] = [];
  @Input() imageUploadsThread: any;
  
  deleteImage(i: any) {
    this.imagePreviewsThread.splice(i, 1);
    this.imageUploadsThread.splice(i, 1);
  }
}
