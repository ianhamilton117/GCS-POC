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

  search(query: string, reqWords?: string, reqPhrase?: string, exclWords?: string, orTerms?: string): SearchResult[] {
    this.searchResults = [];
    let urlBuilder = new RestURLBuilder();

    let url = "https://www.googleapis.com/customsearch/v1?key=:key&cx=:cx&q=:q&hq=:hq&exactTerms=:exactTerms&excludeTerms=:excludeTerms&orTerms=:orTerms" //Format for REST URL
    let key = "AIzaSyDkGQ2TErpTl--zkgGErCh0_XhUFIWQC54"; //Google API key
    let cx = "014722161919417917553:vmkwzgw4l5u"; //Google search engine ID

    let builder = urlBuilder.buildRestURL(url);
    builder.setQueryParameter('key', key);
    builder.setQueryParameter('cx', cx);
    builder.setQueryParameter('q', query);
    builder.setQueryParameter('hq', reqWords);
    builder.setQueryParameter('exactTerms', reqPhrase);
    builder.setQueryParameter('excludeTerms', exclWords);
    builder.setQueryParameter('orTerms', orTerms);

    let finalURL = builder.get();
    //If the search query was empty, add it in the url anyway so that the API is happy
    //This is a valid situation when using Advanced Search
    if (!query) {
      finalURL += "&q=";
    }
    
    this.httpClient.get<GCSResponse>(finalURL)
    .subscribe(
      (response) => {
        if (response.queries.request[0].totalResults == 0) return this.searchResults;
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
