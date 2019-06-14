import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, retry, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class ServerService {

  constructor(private httpClient: HttpClient) { }

  // function obtained from https://angular.io/guide/http
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getUserFromServer() {
    return this.httpClient.get<string>('/IMENTOR/get-member.php')
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getCalendarFromServer(a_ho: string, a_month: string, a_year: string) {
    return this.httpClient.get<string>(`/IMENTOR/get-calendar-json.php?month=${a_month}&ho=${a_ho}&year=${a_year}`)
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getQuestionFromServer(a_step: string | null, a_ho: string | null, a_section: string | null, a_kind = 'speaking') {
    if (a_step === 'finaltest') {
      return this.httpClient.get<string>(
        '/IMENTOR/get-question-json.php?step=' + a_step + '&ho=' + a_ho + '&kind=' + a_kind)
        .pipe(
          retry(2), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    } else {
      return this.httpClient.get<string>(
        '/IMENTOR/get-question-utf8.php?step=' + a_step + '&ho=' + a_ho + '&section=' + a_section)
        .pipe(
          retry(2), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }
  }

  getJindoFromServer(a_step: string | null, a_ho: string | null) {
    return this.httpClient.get<string>('/IMENTOR/get-jindo.php?step=' + a_step + '&ho=' + a_ho)
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getResultFromServer(a_step: string | null, a_ho: string | null, a_uid: string | null) {
    return this.httpClient.get<string>('/IMENTOR/my-result-seq.php?step=' + 'grammer5' + '&ho=' + a_ho + '&uid=' + a_uid)
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  // $uid."','".$user_id."','".$ho."','".$group_name."','".$step."','".$section."','".$x_count."','".$point."','".$dt."'
  // quest	문제일련번호[!!]나의답변[!!]정답여부[@@]문제일련번호…..
  // 정오표 저장
  postUserScoreToServer(quest: string, x_count: string, point: string, is_pass: string, uid: string, user_id: string, ho: string, step: string, section: string) {
    const body = {
      'quest': quest,
      'x_count': x_count,
      'point': point,
      'is_pass': is_pass,
      'uid': uid,
      'user_id': user_id,
      'ho': ho,
      'step': step,
      'section': section
    };

    return this.httpClient.post<string>('/IMENTOR/save_json.php', body, {headers: {'Content-Type': 'application/json'}})
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  postTestAnswerToServer(quest: string, kind: string, uid: string, user_id: string, step: string, ho: string) {
    const body = {
      'quest': quest,
      'kind': kind,
      'uid': uid,
      'user_id': user_id,
      'ho': ho,
      'step': step
    };

    return this.httpClient.post<string>('/IMENTOR/save_json.php', body, {headers: {'Content-Type': 'application/json'}})
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  postRecordedVoiceToServer(file_content, filename: string) {
    const uploadData = new FormData();
    uploadData.append('recorded_voice_blob', file_content, filename);

    // how to replace FormData
    // https://github.com/angular/angular/issues/13241
    // const fileFormData: Object = {file: file_content, filename: filename};
    // const formBody = [];
    // for (const key of Object.keys(fileFormData)) {
    //   const encodedKey = encodeURIComponent(key);
    //   const encodedValue = encodeURIComponent(fileFormData[key]);
    //   formBody.push(encodedKey + '=' + encodedValue);
    // }
    // const encoded_form = formBody.join('&');

    // https://gist.github.com/joyrexus/524c7e811e4abf9afe56
    // application/x-www-form-urlencoded vs  multipart/form-data


    return this.httpClient.post<string>('/IMENTOR/recorded-voice-upload.php', uploadData)
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }


  logoutUser() {
    return this.httpClient.get<string>('/IMENTOR/log-out.php')
      .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
}
