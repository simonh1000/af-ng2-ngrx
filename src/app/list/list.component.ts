import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Resto } from '../reducers/resto';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() restos: Observable<Resto[]>

  constructor() { }

  ngOnInit() {
  }

}
