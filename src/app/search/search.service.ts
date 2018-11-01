import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResult, SearchResults, SearchStatus } from './search-results';
import { GCSResponse } from './gcs-response';
import { takeWhile, expand } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  url = "https://www.googleapis.com/customsearch/v1";

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
    return this.httpClient.get<GCSResponse>(this.url, {params: this.buildParams(req)})
      .pipe(
        expand(res => {
          //If the page requested doesn't have any results, we try again with the previous page. 
          //This is neccessary because Google's API sometimes promises more results than it actually has.
          if (res.queries.request[0].totalResults == 0 && req.pageNum > 1) {
            req.pageNum--;
            return this.httpClient.get<GCSResponse>(this.url, {params: this.buildParams(req)});
          } else {
            foundResults = true;
            return [];
          }
        }),
        takeWhile(() => foundResults == false)
      )
  }

  buildParams(req: SearchRequest): HttpParams {
    // const key = "AIzaSyBlPeSIOgT_wPjyjWFnqTW3l9L2A3ZY9GA"; //Google API key
    // const cx = "001477481991178287809:r-wouyqyxew"; //Google search engine ID
    const key = "AIzaSyBqcrX7zwelHrLUsH0R8KOI-aMCTlnrp3g"; //Google API key
    const cx = "014722161919417917553:vmkwzgw4l5u"; //Google search engine ID

    // Calculate which result will be the first result on a given page. 1 for page 1, 11 for page 2, 22 for page 3, etc.
    const startIndex = String(this.resultsPerPage * (req.pageNum - 1) + 1)

    let params = new HttpParams();
    params = params.set('key', key);
    params = params.set('cx', cx);
    // If the search query was empty, add it as a parameter anyway with an empty string so that the API is happy
    // This is a valid situation when using Advanced Search
    params = req.query ? params.set('q', req.query) : params.set('q', '');
    // Set the rest of the parameters only if they were provided
    params = req.reqWords ? params.set('hq', req.reqWords) : params;
    params = req.reqPhrase ? params.set('exactTerms', req.reqPhrase) : params;
    params = req.exclWords ? params.set('excludeTerms', req.exclWords) : params;
    params = req.orTerms ? params.set('orTerms', req.orTerms) : params;
    params = req.fileType ? params.set('fileType', req.fileType) : params;
    params = startIndex ? params.set('start', startIndex) : params;

    return params;
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