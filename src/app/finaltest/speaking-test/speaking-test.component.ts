import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinaltestService} from '../finaltest.service';
import {UserService} from '../../core/user.service';
import {ServerService} from '../../core/server.service';
import {Subscription} from 'rxjs';
declare var VoiceRecorder: any;
declare var AndroidJJ: any;
declare var mobile_app_bool: boolean;

@Component({
  selector: 'speaking-test',
  templateUrl: './speaking-test.component.html',
  styleUrls: ['./speaking-test.component.css']
})
export class SpeakingTestComponent implements OnInit, OnDestroy {

  nextQuestionCalledSubs: Subscription;
  prepDoneSubs: Subscription;
  global_stream: MediaStream;
  audio_context: AudioContext;
  voice_recorder;

  recording_bool = false;  // used to display record or stop record buttons
  recorded_bool = false;
  listening_voice_bool = false;
  listened_voice_bool = false;
  prep_done_bool = false;

  local_blob;

  constructor(public finalTestService: FinaltestService,
              private userService: UserService,
              private serverService: ServerService) { }

  ngOnInit() {
    this.nextQuestionCalledSubs = this.finalTestService.nextQuestionCalled.subscribe((called_bool: boolean) => {
      this.stopRecordVoice();
      this.saveCurrentVoice();
      this.recorded_bool = false;
      this.prep_done_bool = false;
      this.listened_voice_bool = false;

      if (this.finalTestService.current_question_index >= 3) {
        this.serverService.postTestAnswerToServer(this.buildQuestString(),
          this.userService.kind, this.userService.user.uid,
          this.userService.user.user_id, this.userService.step, this.userService.ho).subscribe(
          (post_reply) => {
            console.log('postTestAnswerToServer: ' + post_reply);
          }, (error) => {
            console.log('Error: postTestAnswerToServer');
            console.log(error);
          });
      }
    }, (error) => {
      console.log(error);
    });

    this.initializeRecorder();

    this.prepDoneSubs = this.finalTestService.prepDoneCalled.subscribe((called_bool: boolean) => {
        this.prep_done_bool = true;
        this.recordVoice();
    }, (error) => {
      console.log(error);
    });

    AndroidJJ.respondToJavascript(); // this should be at the end just in case on pc browser AndroidJJ causes error
  }

  ngOnDestroy() {
    this.nextQuestionCalledSubs.unsubscribe();
    this.prepDoneSubs.unsubscribe();
  }

  buildQuestString() {
    let start_index = 1;
    let quest_string = '';
    // e.g. 5^[@@]6^dsfdsfsdgfdg[@@]7^dsfdsfdsfddsfsd[@@]8^sdfdsfdsdfdssdf
    for (const an_answer of this.finalTestService.answer_list) {
      quest_string += start_index + '^' + an_answer + '[@@]';
      start_index += 1;
    }
    return quest_string;
  }

  initializeRecorder() {
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      alert('This browser doesn\'t implement mediaDevices.getUserMedia');
      navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        navigator.getUserMedia = (navigator.webkitGetUserMedia ||
          navigator.getUserMedia ||
          navigator.mozGetUserMedia);

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!navigator.getUserMedia) {
          alert('This browser doesn\'t implement getUserMedia');
          return Promise.reject(new Error('getUserMedia is not implemented in this browser!'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          alert('promise returns');
          navigator.getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    try {
      window.URL = window.URL || window.webkitURL;
      this.audio_context = new AudioContext();
    } catch (err) {
      alert('Error initializing Web Audio browser, ' + err.name + ' : ' + err.message);
    }
  }

  recordVoice() {
    this.recording_bool = true;
    if (mobile_app_bool) {
      AndroidJJ.startRecording();
    } else {
      const that = this;
      navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
        that.recordVoiceHelper(stream); // record user's voice for playing later
      }).catch(function(err) {
        // If the user denies permission, or matching media is not available,
        // the promise is rejected with PermissionDeniedError
        that.recording_bool = false;
        alert('현재 브라우저로는 녹음장치가 작동되지 않습니다, ' + err.name + ' : ' + err.message);
      });
    }
  }

  recordVoiceHelper(stream) {
    this.global_stream = stream;
    const audio_input = this.audio_context.createMediaStreamSource(stream);
    const that = this;

    const audioRecorderConfig = {errorCallback: function(x) {
        alert('Problem with recorder occurred: ' + x);
        that.stopRecordVoice();
      }};
    this.voice_recorder = new VoiceRecorder(audio_input, audioRecorderConfig );

    this.voice_recorder.clear();
    this.voice_recorder.record();
  }

  stopRecordVoice() {
    this.recorded_bool = true;
    this.recording_bool = false;

    if (mobile_app_bool) {
      AndroidJJ.stopRecording();
    } else {
      if (this.voice_recorder !== undefined) {
        if (this.voice_recorder.state !== 'inactive') {
          this.voice_recorder.stop();
          this.voice_recorder.getBuffers( this.gotBuffers.bind(this) );
          this.global_stream.getTracks().forEach(track => track.stop()); // ******very important fix for ipad*****
        } else {
          console.log('voice_recorder\'s state: ' + this.voice_recorder.state);
        }
      } else {
        alert('Error: voice recorder not created!!!');
      }
    }
  }

  gotBuffers( buffers ) {
    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    this.voice_recorder.exportWAV( this.doneEncoding.bind(this) );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
  }

  doneEncoding( blob ) {
    this.local_blob = blob;
    VoiceRecorder.setupDownload( blob, 'IMENTOR_voice.mp3' );
  }

  listenVoice() {
    this.listening_voice_bool = true;
    if (mobile_app_bool) {
      AndroidJJ.startPlaying();
    } else {
      const recorded_voice_audio: HTMLAudioElement = <HTMLAudioElement>document.getElementById('recorded_voice_audio');
      recorded_voice_audio.volume = 1.0;
      recorded_voice_audio.play(); // play the sound
    }
  }

  stopListenVoice() {
    this.listening_voice_bool = false;
    this.listened_voice_bool = true;
    if (mobile_app_bool) {
      AndroidJJ.stopPlaying();
    } else {
      const recorded_voice_audio: HTMLAudioElement = <HTMLAudioElement>document.getElementById('recorded_voice_audio');
      recorded_voice_audio.pause(); // play the sound
      recorded_voice_audio.currentTime = 0;
    }

    this.finalTestService.listenedVoice.next(true);
  }

  saveCurrentVoice() {
    if (mobile_app_bool) {

      const dateObj = new Date();
      const filename = this.userService.user.uid + '_' +
        this.userService.ho + '_' +
        dateObj.getFullYear() + (dateObj.getMonth() + 1) + dateObj.getDate() + dateObj.getHours() + dateObj.getMinutes() + dateObj.getSeconds() + '.mp4';

      this.finalTestService.answer_list[this.finalTestService.current_question_index] = filename;

      AndroidJJ.submitMyVoiceWithName(filename);

    } else {
      const file = this.local_blob; // obtained from recorder.js

      const dateObj = new Date();
      const filename = this.userService.user.uid + '_' +
        this.userService.ho + '_' +
        dateObj.getFullYear() + (dateObj.getMonth() + 1) + dateObj.getDate() + dateObj.getHours() + dateObj.getMinutes() + dateObj.getSeconds() + '.mp4';

      this.finalTestService.answer_list[this.finalTestService.current_question_index] = filename;

      this.serverService.postRecordedVoiceToServer(file, filename).subscribe(
        (post_reply: String) => {
          if (post_reply.includes('ERROR')) {
            alert('Upload Failed!');
          }
          console.log('postRecordedVoiceToServer: ' + post_reply);
        }, (error) => {
          alert('Error in postRecordedVoiceToServer');
          console.log(error);
        });
    }
  }

  redoRecordVoice() {
    const recorded_voice_audio: HTMLAudioElement = <HTMLAudioElement>document.getElementById('recorded_voice_audio');
    recorded_voice_audio.src = '';
    this.recorded_bool = false;
    this.listened_voice_bool = false;
    this.finalTestService.listenedVoice.next(false);
  }

  isRecordButtonDisabled() {
    return this.recorded_bool || !this.prep_done_bool;
  }

}
