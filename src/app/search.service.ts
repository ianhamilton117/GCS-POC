import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResult, SearchResults } from './search/search-results';
import { GCSResponse } from './search/gcs-response';
import { RestURLBuilder } from 'rest-url-builder';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  search(query: string, pageNum: number, reqWords?: string, reqPhrase?: string, exclWords?: string, orTerms?: string, fileType?: string): SearchResults {
    const SEARCH_RESULTS_PER_PAGE = 10; //10 is the default number of results per page. It is also the maximum.
    let searchResults = new SearchResults([], 0, 0);
    let urlBuilder = new RestURLBuilder();

    let url = "https://www.googleapis.com/customsearch/v1?key=:key&cx=:cx&q=:q&hq=:hq&exactTerms=:exactTerms&excludeTerms=:excludeTerms&orTerms=:orTerms&fileType=:fileType&start=:start" //Format for REST URL
    let key = "AIzaSyBlPeSIOgT_wPjyjWFnqTW3l9L2A3ZY9GA"; //Google API key
    let cx = "001477481991178287809:r-wouyqyxew"; //Google search engine ID
    let startIndex = String(SEARCH_RESULTS_PER_PAGE * (pageNum - 1) + 1) //This calculates which result will be the first result on a given page. 
                                                                         // 1 for page 1, 11 for page 2, 22 for page 3, etc.

    let builder = urlBuilder.buildRestURL(url);
    builder.setQueryParameter('key', key);
    builder.setQueryParameter('cx', cx);
    builder.setQueryParameter('q', query);
    builder.setQueryParameter('hq', reqWords);
    builder.setQueryParameter('exactTerms', reqPhrase);
    builder.setQueryParameter('excludeTerms', exclWords);
    builder.setQueryParameter('orTerms', orTerms);
    builder.setQueryParameter('fileType', fileType);
    builder.setQueryParameter('start', startIndex);

    let finalURL = builder.get();
    //If the search query was empty, add it in the url anyway so that the API is happy
    //This is a valid situation when using Advanced Search
    if (!query) {
      finalURL += "&q=";
    }
    
    this.httpClient.get<GCSResponse>(finalURL)
    .subscribe(
      (response) => {
        let numResults = response.queries.request[0].totalResults;
        if (numResults == 0) return searchResults;

        //Calculate the number of pages required to fit all results, with a max of 100 results (Google won't return any results past 100)
        let numPages = Math.floor((Math.min(numResults, 100) - 1) / SEARCH_RESULTS_PER_PAGE) + 1;

        response.items.forEach(item => {
          let searchResult = new SearchResult(item.htmlTitle, item.htmlSnippet, item.link, item.displayLink);
          searchResults.results.push(searchResult);
        });

        searchResults.numPages = numPages;
        searchResults.currentPage = pageNum;
      },
      (error) => console.log(error)
    );
    return searchResults;
  }
}
