import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResizableGridModule } from 'ngx-resizable-grid';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxResizableGridModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
