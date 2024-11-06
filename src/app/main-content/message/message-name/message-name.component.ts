import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TestJasonsService } from '../../../../services/test-jsons.service';


@Component({
  selector: 'app-message-name',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './message-name.component.html',
  styleUrl: './message-name.component.scss'
})
export class MessageNameComponent {
  @Input() message: any;

  constructor(public object: TestJasonsService) { }


}
