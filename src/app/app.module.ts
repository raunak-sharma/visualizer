import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import 'hammerjs';

//Components
import { AppComponent } from './app.component';
import { BfsComponent } from './bfs/bfs.component';
import { DfsComponent } from './dfs/dfs.component';
//Importing the router
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    BfsComponent,
    DfsComponent,
    FooterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatToolbarModule,
    BrowserModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }