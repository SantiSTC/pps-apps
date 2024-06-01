import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  redirectTo(url: string){
    this.router.navigateByUrl(url);
  }

}
