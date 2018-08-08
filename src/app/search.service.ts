import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResult } from './search/search-result';
import { GCSResponse } from './search/gcs-response';
import { RestURLBuilder } from 'rest-url-builder';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults: SearchResult[] = [];

  constructor(private httpClient: HttpClient) { }

  search(query: string): SearchResult[] {
    this.searchResults = [];
    let urlBuilder = new RestURLBuilder();

    let url = "https://www.googleapis.com/customsearch/v1?key=:key&cx=:cx&q=:q" //Format for REST URL
    let key = "AIzaSyDkGQ2TErpTl--zkgGErCh0_XhUFIWQC54"; //Google API key
    let cx = "014722161919417917553:vmkwzgw4l5u"; //Google search engine ID

    let builder = urlBuilder.buildRestURL(url);
    builder.setQueryParameter('key', key);
    builder.setQueryParameter('cx', cx);
    builder.setQueryParameter('q', query);
    let finalURL = builder.get();
    
    this.httpClient.get<GCSResponse>(finalURL)
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
