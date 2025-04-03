import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { SpeechNotification } from '../../model/speech-notification';
import { SpeechError } from '../../model/speech-error';
import { SpeechEvent } from '../../model/speech-event';

// Declare global types for SpeechRecognition and webkitSpeechRecognition

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognizerService {
  private recognition!: SpeechRecognition 
  private language!: string;
  isListening: boolean = false;

  constructor(private readonly ngZone: NgZone) {}

  initialize(language: string): boolean {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.setLanguage(language);
      return true;
    }

    console.error('SpeechRecognition is not supported in this browser.');
    return false;
  }

  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  start(): void {
    if (!this.recognition) {
      console.error('SpeechRecognition is not initialized.');
      return;
    }

    this.recognition.start();
    this.isListening = true;
  }

  onStart(): Observable<SpeechNotification<never>> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => {
        this.ngZone.run(() => {
          observer.next({
            event: SpeechEvent.Start,
          });
        });
      };
    });
  }

  onEnd(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        this.ngZone.run(() => {
          observer.next({
            event: SpeechEvent.End,
          });
          this.isListening = false;
        });
      };
    });
  }

  onResult(): Observable<SpeechNotification<string>> {
    return new Observable(observer => {
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimContent = '';
        let finalContent = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalContent += event.results[i][0].transcript;
            this.ngZone.run(() => {
              observer.next({
                event: SpeechEvent.FinalContent,
                content: finalContent,
              });
            });
          } else {
            interimContent += event.results[i][0].transcript;
            this.ngZone.run(() => {
              observer.next({
                event: SpeechEvent.InterimContent,
                content: interimContent,
              });
            });
          }
        }
      };
    });
  }

  onError(): Observable<SpeechNotification<never>> {
    return new Observable(observer => {
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const eventError: string = event.error;
        console.error('SpeechRecognition error:', eventError);

        let error: SpeechError;
        switch (eventError) {
          case 'no-speech':
            error = SpeechError.NoSpeech;
            break;
          case 'audio-capture':
            error = SpeechError.AudioCapture;
            break;
          case 'not-allowed':
            error = SpeechError.NotAllowed;
            break;
          default:
            error = SpeechError.Unknown;
            break;
        }

        this.ngZone.run(() => {
          observer.next({
            error,
          });
        });
      };
    });
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
