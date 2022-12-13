import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResizableGridModule } from 'ngx-resizable-grid';

import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [BrowserModule, NgxResizableGridModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
