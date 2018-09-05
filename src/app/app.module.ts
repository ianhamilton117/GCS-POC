import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BasicSearchComponent } from './search/basic-search/basic-search.component';
import { SearchService } from './search/search.service';
import { AdvancedSearchComponent } from './search/advanced-search/advanced-search.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';

const appRoutes: Routes = [
  { path: '', component: BasicSearchComponent },
  { path: 'advancedSearch', component: AdvancedSearchComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BasicSearchComponent,
    AdvancedSearchComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
