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
    //Passes an empty string for the query since the advanced search page doesn't allow a general query
    this.searchResults = this.searchService.search("", reqWords.value, exactPhrase.value, withoutWords.value, anyWords.value);
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
