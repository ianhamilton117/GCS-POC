import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchResult } from './search/search-result';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults: SearchResult[] = [];

  constructor(private httpClient: HttpClient) { }

  search(query: String): SearchResult[] {
    let url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDkGQ2TErpTl--zkgGErCh0_XhUFIWQC54&cx=014722161919417917553:vmkwzgw4l5u&q=";
    // let key = 
    this.httpClient.get(url + query)
    .subscribe(
      (response) => {
        for (var i = 0; i < response.items.length; i++) {
          var item = response.items[i];
          let searchResult = new SearchResult(item.title, item.snippet, item.link, item.displayLink);
          this.searchResults.push(searchResult);
        }
      },
      (error) => console.log(error)
    );
    return this.searchResults;
}
}
