import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  customerCenterLink() {
    if (environment.chinese) {
      return 'https://www.welleastern.cn/chn/cs/cs04.php';
    } else {
      return 'https://www.welleastern.co.kr/pc/cs/cs04.php';
    }
  }

}
