import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
