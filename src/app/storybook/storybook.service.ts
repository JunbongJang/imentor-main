import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorybookService {

  storybookAudioInitialize = new Subject<string>();
  storybookSceneComplete = new Subject<boolean>();

  constructor() { }
}
