import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
//import { ModalHelpComponent } from './components/modal-help/modal-help.component';
import { ChatbotWidgetComponent } from './chatbot-widget/chatbot-widget.component';

@NgModule({
  declarations: [ChatbotWidgetComponent],
  imports: [
    CommonModule,
    MaterialModule,    
  ],
  exports: [
    MaterialModule,
    ChatbotWidgetComponent
  ]
})
export class SharedModule { }
