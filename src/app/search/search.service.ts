import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResult, SearchResults, SearchStatus } from './search-results';
import { GCSResponse } from './gcs-response';
import { RestURLBuilder } from 'rest-url-builder';
import { takeWhile, expand, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  //The search request is being stored as a property so that it persists after search results are returned.
  //This way, when the user navigates to a different page of the search results, the search service
  //remembers the original query rather than pulling it off of the form on the page again.
  searchRequest: SearchRequest;

  //10 is the default number of results per page returned by the Google API. It is also the maximum.
  resultsPerPage: number = 10; 

  advancedSearch(reqWords?: string, reqPhrase?: string, exclWords?: string, orTerms?: string, fileType?: string): SearchResults {
    //Passes reqWords in place of the query to get around an apparent bug where Google doesn't return any results if only required words are sent
    this.searchRequest = new SearchRequest(reqWords, 1, reqWords, reqPhrase, exclWords, orTerms, fileType);
    return this.executeSearch(this.searchRequest);
  }

  basicSearch(query: string): SearchResults {
    this.searchRequest = new SearchRequest(query, 1);
    return this.executeSearch(this.searchRequest);
  }

  pageNav(pageNum: number): SearchResults {
    if (this.searchRequest === undefined) return null;

    this.searchRequest.pageNum = pageNum;
    return this.executeSearch(this.searchRequest);
  }

  executeSearch(req: SearchRequest): SearchResults {
    let searchResults = new SearchResults([], 0, 0, SearchStatus.resultsLoading);

    this.callAPI(req)
      .subscribe(
        (response) => {
          const numResults = response.queries.request[0].totalResults;

          searchResults.currentPage = req.pageNum;
          if (numResults == 0) {
            //Search returned no results only if the current page is 1, otherwise callAPI() is 
            //still making calls to previous pages looking for results, and we just need to wait.
            if (searchResults.currentPage == 1) {
              searchResults.status = SearchStatus.emptyResults;
            }
            //Do nothing
          } else {
            //Calculate the number of pages required to fit all results, with a max of 100 results (Google won't return any results past 100)
            const numPages = Math.floor((Math.min(numResults, 100) - 1) / this.resultsPerPage) + 1;

            response.items.forEach(item => {
              const searchResult = new SearchResult(item.htmlTitle, item.htmlSnippet, item.link, item.displayLink);
              searchResults.results.push(searchResult);
            });

            searchResults.numPages = numPages;
            searchResults.status = SearchStatus.resultsPresent;
          }
        },
        (error) => console.log(error)
      );
    return searchResults;
  }

  callAPI(req: SearchRequest): Observable<GCSResponse> {
    let foundResults = false;
    return this.httpClient.get<GCSResponse>(this.buildURL(req))
      .pipe(
        expand(res => {
          //If the page requested doesn't have any results, we try again with the previous page. 
          //This is neccessary because Google's API sometimes promises more results than it actually has.
          if (res.queries.request[0].totalResults == 0 && req.pageNum > 1) {
            req.pageNum--;
            return this.httpClient.get<GCSResponse>(this.buildURL(req));
          } else {
            foundResults = true;
            return [];
          }
        }),
        takeWhile(() => foundResults == false)
      )
  }

  buildURL(req: SearchRequest): string {
    const urlBuilder = new RestURLBuilder();

    const url = "https://www.googleapis.com/customsearch/v1?key=:key&cx=:cx&q=:q&hq=:hq&exactTerms=:exactTerms&excludeTerms=:excludeTerms&orTerms=:orTerms&fileType=:fileType&start=:start" //Blueprint for REST URL
    // const key = "AIzaSyBlPeSIOgT_wPjyjWFnqTW3l9L2A3ZY9GA"; //Google API key
    // const cx = "001477481991178287809:r-wouyqyxew"; //Google search engine ID
    const key = "AIzaSyBqcrX7zwelHrLUsH0R8KOI-aMCTlnrp3g"; //Google API key
    const cx = "014722161919417917553:vmkwzgw4l5u"; //Google search engine ID

    //Calculate which result will be the first result on a given page. 1 for page 1, 11 for page 2, 22 for page 3, etc.
    const startIndex = String(this.resultsPerPage * (req.pageNum - 1) + 1)

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

    return finalURL;
  }
  
}

class SearchRequest {
  constructor(
    readonly query: string,
    public pageNum: number,
    readonly reqWords?: string,
    readonly reqPhrase?: string,
    readonly exclWords?: string,
    readonly orTerms?: string,
    readonly fileType?: string
  ) { }
}