import { ChangeDetectionStrategy,ChangeDetectorRef, ElementRef,Input, ViewChild,OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs'
import { merge,Notification,Observable,observable,of,Subject} from 'rxjs';
import { map,mergeAll,tap} from 'rxjs/operators';
import { defaultLanguage,languages} from '../model/languages';
import { SpeechError} from '../model/speech-error';
import { SpeechEvent} from '../model/speech-event';
import { SpeechNotification} from '../model/speech-notification';
import { Component } from '@angular/core';
import { SpeechRecognizerService } from '../services/web-apis/speech-recognizer.service';
import { ActionContext } from '../services/actions/action-context';
import { Injectable, NgZone } from '@angular/core';
import { HttpHandler,HttpRequest,HttpClientModule, HttpHeaders } from '@angular/common/http'


@Component({
  selector: 'app-chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotWidgetComponent implements OnInit{
  AudioOutput:any="sample"
  languages:string[]=languages;
  currentLanguage:string =defaultLanguage;
  totalTranscript?:string;

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$?: any;
 Message:any='';
 form:any;
 container:any;

 title = 'chatGTPClient';
 loadinterval: any;
 bot = '../../assets/images/bot.svg';
 user = '../../../assets/user.svg';
 close='../../../close.png';
 waiting_texting='../../../assets/bot.svg';

 @ViewChild('res') resRef:any;
 @ViewChild('msgpage') msgpage:any;

  @Input() type:any='rag';
  @Input() chat_title:any;

  tab_index:number=0;
  open_chat:boolean=false;
  parseDataLen:number=0;

  chat_records:any=[];
  currect_search_index:any;

  
  constructor(private elementref: ElementRef,private speechRecognizer:SpeechRecognizerService,private cd:ChangeDetectorRef,private actionContext:ActionContext) {}

  ngOnInit():void{

    const webSpeechReady=this.speechRecognizer.initialize(this.currentLanguage)
    if(webSpeechReady)
    {
      this.initRecognition();
    }
    else
    {
      this.errorMessage$=of('Your Browser is not supported.please try Google Chrome');
    }
  } 

  start():void
{
  // alert("1");
      if(this.speechRecognizer.isListening)
      {
        this.stop();
        return;
      }
      else
      {
        this.speechRecognizer.start();
      }
      //this.defaultError$.next(undefined);
     
}

stop():void
{
  this.speechRecognizer.stop();
}

selectLanguage(language:string):void
{
    if(this.speechRecognizer.isListening)
    {
      this.stop();
    }
    this.currentLanguage=language;
    this.speechRecognizer.setLanguage(this.currentLanguage);

}

private initRecognition():void
{
  // alert("2")
  this.speechRecognizer.onResult().pipe(
   tap((notification)=>
   {
    this.processNotification(notification);
   }),
  map((Notification) => Notification.content||'')
    ).subscribe((evt:any)=>{

  })

  this.listening$ = merge(
    this.speechRecognizer.onStart(),
    this.speechRecognizer.onEnd(),
  ).pipe(map((notification)=> notification.event === SpeechEvent.Start));

    this.errorMessage$ = merge(
    this.speechRecognizer.onError(),
    this.defaultError$
  ).pipe(
    map((data:any) => {
      if(data === undefined){
        return'';
      }
      if(typeof data === 'string')
      {
        return data;
      }
      let message;

      switch(data?.error){
        case SpeechError.NotAllowed:
           message='canot not run demo';
           break;
        case SpeechError.NoSpeech:
           message='No Speech has been detected.please try agian';
           break;
        case SpeechError.AudioCapture:
           message='Microphone is not available , please verify the connection of your microphone';
           break;
        default:
        message='';
      }
      return message;
    })
  );    
}



private processNotification(notification:SpeechNotification<string>):void{
console.log("notification",notification);
if(notification.event==2)
{
  var index=0;
  var content_txt:any =notification.content;
  var vText:string='';
  this.AudioOutput=content_txt;
  this.resRef.nativeElement.value=content_txt;
  this.cd.detectChanges();

  
}

if (notification.event === SpeechEvent.FinalContent)
      {
        const message =notification.content?.trim() ||'';
        this.actionContext.processMessage(message,this.currentLanguage);
        this.totalTranscript =this.totalTranscript
        ? '${this.totalTranscript}\n${message}'
        :notification.content;
        console.log("totalTransscript",this.totalTranscript);
      }
}
  
async promptInput(prompt:string)
{
       
           console.log("resRef",this.resRef.nativeElement.value);
           this.resRef.nativeElement.value=""
           console.log("from search",prompt);
            try
            {
              this.chat_records.push({'agent_prompt': prompt, 'bot_prompt': ''});
              this.currect_search_index = this.chat_records.length - 1;
              this.cd.detectChanges();

              setTimeout(() => {
                this.msgpage.nativeElement.scrollTop = this.msgpage.nativeElement?.scrollHeight;
                console.log("messagepage", this.msgpage.nativeElement?.scrollHeight);
              }, 10);
                    const message=                      
                    {
                      'model': 'llama2:latest',
                      'prompt': 'What is the capital of France?'
                  }
                     
                    
                    // const formData =new FormData();
                    // formData.append('question',prompt);
                    // formData.append('username','ashish')
                    // const formData=new FormData();
                    // let headers = new HttpHeaders();
                    // headers.append('Content-Type','multipart/form-data');

                    // this.post("http://127.0.0.1:11434/api/generate",formData,{ headers : headers,observe:'response'}).subscribe((response)=>{


                      const response = await fetch("http://localhost:11434/api/generate", {
    
                         method: 'POST',
                         headers:{
                           'Content-Type': 'application/json',    
                          //  'model': 'llama2:latest',                        
                         },
                         body: JSON.stringify({message})
                        })

                    

                      //  const response = await fetch("https://api.restful-api.dev/objects/7",
                      //   {    
                      //   method: 'GET',
                      //   headers:{  
                      //     'Content-Type': 'application/json',                        
                      //   },
                      //   body: JSON.stringify({})
                      //  })

                      //  const url = 'https://api.restful-api.dev/objects/7';

    
                      //  const response = await fetch(url);

                       
                      var response2:any=response
                      console.log(response)
                               
                        if(response.ok)
                        {
                          
                          const data =await response.json();
                          console.log('chatbot',this.chat_records.length);

                          const parseddata=data;
                          //const parseddata=data.name;
                          

                          let index=0;
                          let vText='';

                          let interval = setInterval(() => {
                            if (index < parseddata.length) {
                              
                              vText += parseddata.charAt(index);
                              this.chat_records[this.chat_records.length - 1]['bot_prompt'] = vText;
                              this.cd.detectChanges();
                              index++;
                              this.msgpage.nativeElement.scrollTop = this.msgpage.nativeElement?.scrollHeight;
                            } else {
                              this.currect_search_index = undefined;
                              this.cd.detectChanges();
                              clearInterval(interval);
                            }
                          }, 20);
                        }
                        else
                        {
                          const err='Something went wrong';
                          console.log("err data",err);
                          this.chat_records[this.chat_records.length-1]['bot_prompt']=err
                        }

                        setTimeout(() => {
                        
                          this.msgpage.nativeElement.scrollTop=this.msgpage.nativeElement?.scrollHeight;
                          console.log("messagepage",this.msgpage.nativeElement?.scrollHeight);
                          },10);
                      
                      this.cd.detectChanges()

            }
             catch(error)
             {
               alert("catch")
              console.log("error",error);
             }

}
  

  tabChanged(TabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangedEvent=>', TabChangeEvent);
    console.log('index=>', TabChangeEvent.index);
    this.tab_index = TabChangeEvent.index;
  }
  


  toggleDiv()
  {
    console.log("gg");
    this.open_chat=!this.open_chat;
  }

  // ***CHANGE***

  SpeakText: string = '';
  speaking = false;

  onInputChange(event: any): void {
    this.SpeakText = event.target.value;
  }
  speakText(speakt:string): void {
 
    window.speechSynthesis.cancel();
    console.log('Starting speech...');
    this.speaking = true;
    const speech = new SpeechSynthesisUtterance(speakt);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);

    speech.onend = () => {
      this.speaking = false;
    };

  
   if (!this.speaking) {
    this.speaking = false;
    }
  }

  speakStop(): void {
    if(window.speechSynthesis.speaking)
    {
      console.log('Stopping speech...');
      window.speechSynthesis.cancel()
    }  

    this.speaking = false;
  }

             



 
  // handlesubmit = async(e: any) => {
  //   e.preventDefault();

  //   const data = new FormData(this.form ?? undefined);
    
  //   // user stripes
  //   if (this.container != null) {
  //     this.container.innerHTML += this.stripes(false, data.get('prompt'), null)
  //   }
  //   // bot stripes
  //   const uniqueId = this.generateUniqueId();
  //   if (this.container != null){
  //     this.container.innerHTML += this.stripes(true, " ", uniqueId);
  //     this.container.scrollTop = this.container?.scrollHeight;
  //   }

  //   const messageDiv = document.getElementById(uniqueId);
  //   this.loader(messageDiv);

  //   // fetch the data from serve

    

  //   const response = await fetch("http://127.0.0.1:11434/api/generate", {
      
  //     method: 'POST',
  //     headers:{
  //       'Content-Type': 'application/json',
  //       'model':'llama3.2:latest',
  //       'stream':'false'
  //     },
  //     body: JSON.stringify({
  //       prompt: data.get('prompt')
  //       //"data_string":"John Doe started working at Acme Corp from January to March 15, 2022"
  //     })
  //   })


  //   clearInterval(this.loadinterval);
  //   if (messageDiv != null){
  //     messageDiv.innerHTML = '';
  //   }

  //   if (response.ok){
  //     const data = await response.json();
  //     //const parseddata = data.bot.trim();
  //     const parseddata = data.PERSON??'not found';

  //     this.typetext(messageDiv, parseddata);
  //   }
  //   else {
  //     const err = await response.text();
  //     if (messageDiv != null){
  //       messageDiv.innerHTML = 'Something went wrong';
  //       alert(err);
  //     }
  //   }
  // }
}
