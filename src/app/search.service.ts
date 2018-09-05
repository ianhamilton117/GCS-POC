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

  //The search request is being stored as a property so that it persists after search results are returned.
  //This way, when the user navigates to a different page of the search results, the search service
  //remembers the original query rather than pulling it off of the form on the page again.
  searchRequest: SearchRequest;

  search(query: string, reqWords?: string, reqPhrase?: string, exclWords?: string, orTerms?: string, fileType?: string): SearchResults {
    this.searchRequest = new SearchRequest(query, reqWords, reqPhrase, exclWords, orTerms, fileType);
    return this.executeSearch(this.searchRequest, 1);
  }

  executeSearch(req: SearchRequest, pageNum): SearchResults {
    const resultsPerPage = 10; //10 is the default number of results per page returned by the Google API. It is also the maximum.
    const searchResults = new SearchResults([], 0, 0);
    const urlBuilder = new RestURLBuilder();

    const url = "https://www.googleapis.com/customsearch/v1?key=:key&cx=:cx&q=:q&hq=:hq&exactTerms=:exactTerms&excludeTerms=:excludeTerms&orTerms=:orTerms&fileType=:fileType&start=:start" //Format for REST URL
    const key = "AIzaSyBlPeSIOgT_wPjyjWFnqTW3l9L2A3ZY9GA"; //Google API key
    const cx = "001477481991178287809:r-wouyqyxew"; //Google search engine ID

    //Calculate which result will be the first result on a given page. 1 for page 1, 11 for page 2, 22 for page 3, etc.
    const startIndex = String(resultsPerPage * (pageNum - 1) + 1)

    const builder = urlBuilder.buildRestURL(url);
    builder.setQueryParameter('key', key);
    builder.setQueryParameter('cx', cx);
    builder.setQueryParameter('q', req.query);
    builder.setQueryParameter('hq', req.reqWords);
    builder.setQueryParameter('exactTerms', req.reqPhrase);
    builder.setQueryParameter('excludeTerms', req.exclWords);
    builder.setQueryParameter('orTerms', req.orTerms);
    builder.setQueryParameter('fileType', req.fileType);
    builder.setQueryParameter('start', startIndex);

    let finalURL = builder.get();
    //If the search query was empty, add it in the url anyway so that the API is happy
    //This is a valid situation when using Advanced Search
    if (!req.query) {
      finalURL += "&q=";
    }

    this.httpClient.get<GCSResponse>(finalURL)
      .subscribe(
        (response) => {
          const numResults = response.queries.request[0].totalResults;
          if (numResults == 0) {
            searchResults.numPages = -1; //Signifys a response with no results
            return searchResults;
          }

          //Calculate the number of pages required to fit all results, with a max of 100 results (Google won't return any results past 100)
          const numPages = Math.floor((Math.min(numResults, 100) - 1) / resultsPerPage) + 1;

          response.items.forEach(item => {
            const searchResult = new SearchResult(item.htmlTitle, item.htmlSnippet, item.link, item.displayLink);
            searchResults.results.push(searchResult);
          });

          searchResults.numPages = numPages;
          searchResults.currentPage = pageNum;
        },
        (error) => console.log(error)
      );
    return searchResults;
  }

  pageNav(pageNum: number): SearchResults {
    return this.executeSearch(this.searchRequest, pageNum);
  }
}

class SearchRequest {
  constructor(
    public query: string,
    public reqWords?: string,
    public reqPhrase?: string,
    public exclWords?: string,
    public orTerms?: string,
    public fileType?: string
  ) {}
}