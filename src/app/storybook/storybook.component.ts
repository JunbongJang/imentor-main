import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-storybook',
  templateUrl: './storybook.component.html',
  styleUrls: ['./storybook.component.css']
})
export class StorybookComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    document.body.style.backgroundColor = 'rgb(88, 73, 53)';
    this.titleService.setTitle( 'i-MENTOR Storybook' );
  }

}
