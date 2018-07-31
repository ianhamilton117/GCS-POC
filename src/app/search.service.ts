import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResult } from './search/search-result';
import { GCSResponse } from './search/gcs-response';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults: SearchResult[] = [];

  constructor(private httpClient: HttpClient) { }

  search(query: String): SearchResult[] {
    this.searchResults = [];
    let url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDkGQ2TErpTl--zkgGErCh0_XhUFIWQC54&cx=014722161919417917553:vmkwzgw4l5u&q=";
    // let key = 
    this.httpClient.get<GCSResponse>(url + query)
    .subscribe(
      (response) => {
        for (var i = 0; i < response.items.length; i++) {
          var item = response.items[i];
          let searchResult = new SearchResult(item.htmlTitle, item.htmlSnippet, item.link, item.displayLink);
          this.searchResults.push(searchResult);
        }
      },
      (error) => console.log(error)
    );
    return this.searchResults;
}
}
