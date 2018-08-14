import { Injectable } from '@angular/core';

@Injectable()
export class QuestionSoundService {

  private mp3_asset_path = 'assets/mp3/';
  // private mp3_path = '/IMENTOR/mp3/vocabulary/';
  private _feedbackAudioClosure = this.getFeedbackAudioGroup();

  constructor() { }

  private getFeedbackAudioGroup() {
    console.log('get Feedback Audio Group called');
    const correct_audio: HTMLAudioElement = new Audio(this.mp3_asset_path + 'feedback_correct.mp3');
    const wrong_audio: HTMLAudioElement = new Audio(this.mp3_asset_path + 'feedback_wrong.mp3');

    const initializeFeedback = () => {
      console.log('get Feedback Audio Group initialized');

      const playCorrectPromise = correct_audio.play();
      if (typeof playCorrectPromise !== undefined) {
        playCorrectPromise.then(() => {
          // correct_audio.pause();
        })
          .catch(error => {
            alert('error initialize feedback');
          });
      }

      const playWrongPromise = correct_audio.play();
      if (typeof playWrongPromise !== undefined) {
        playWrongPromise.then(_ => {
          // wrong_audio.pause();
        })
          .catch(error => {
            alert('error initialize feedback');
          });
      }
    };
    const playFeedbackCorrect = () => {
      correct_audio.load();
      return correct_audio.play();
    };
    const playFeedbackWrong = () => {
      wrong_audio.load();
      return wrong_audio.play();
    };

    return {
      correct: playFeedbackCorrect,
      wrong: playFeedbackWrong,
      initialize: initializeFeedback
    };
  }


  get feedbackAudioClosure(): { correct: () => Promise<void>; wrong: () => Promise<void>; initialize: () => void } {
    return this._feedbackAudioClosure;
  }
}
