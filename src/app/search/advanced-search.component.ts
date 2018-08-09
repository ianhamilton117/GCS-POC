import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResult } from './search-result';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  searchResults: SearchResult[] = null;

  constructor(private searchService: SearchService) { }

  onSearch(reqWords: HTMLInputElement, exactPhrase: HTMLInputElement, anyWords: HTMLInputElement, withoutWords: HTMLInputElement, ) {
    //Passes reqWords in place of the query to get around an apparent bug where Google doesn't return any results if only required words are sent
    this.searchResults = this.searchService.search(reqWords.value, reqWords.value, exactPhrase.value, withoutWords.value, anyWords.value);
  }

  resultsPresent() {
    return this.searchResults !== null && this.searchResults.length > 0;
  }

  emptyResults() {
    return this.searchResults !== null && this.searchResults.length == 0;
  }

  ngOnInit() {
  }

}
