import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorybookService {

  storybookAudioInitialize = new Subject<string>();
  storybookSceneChange = new Subject<boolean>();
  storybookSceneComplete = new Subject<boolean>();

  constructor() { }
}
