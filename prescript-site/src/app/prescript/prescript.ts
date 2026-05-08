import { Component, AfterViewInit } from '@angular/core';
import { DebugService } from './debug.service';
import { PrescriptService } from './prescript.service';

@Component({
  selector: 'app-prescript',
  standalone: true,
  templateUrl: './prescript.html',
  styleUrls: ['./prescript.css']
})
export class Prescript implements AfterViewInit {

  constructor(private debug: DebugService, public ps: PrescriptService) {}

  ngAfterViewInit(): void {
    this.ps.initIntro();
  }
}