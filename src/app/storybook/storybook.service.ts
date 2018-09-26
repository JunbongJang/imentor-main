import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorybookService {

  storybookSceneAudioInitialize = new Subject<string>();
  storybookSceneComplete = new Subject<boolean>();
  storybookSetBomb = new Subject<number>(); // only for storybook four!

  constructor() { }
}
