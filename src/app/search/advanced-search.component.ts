import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from './search-results';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  searchResults: SearchResults = null;

  constructor(private searchService: SearchService) { }

  onSearch(reqWords: HTMLInputElement, exactPhrase: HTMLInputElement, anyWords: HTMLInputElement, withoutWords: HTMLInputElement, fileFormat: HTMLSelectElement, pageNum: number) {
    //Passes reqWords in place of the query to get around an apparent bug where Google doesn't return any results if only required words are sent
    this.searchResults = this.searchService.search(reqWords.value, pageNum, reqWords.value, exactPhrase.value, withoutWords.value, anyWords.value, fileFormat.value);
  }

  resultsPresent() {
    return this.searchResults !== null && this.searchResults.results.length > 0;
  }

  emptyResults() {
    return this.searchResults !== null && this.searchResults.results.length == 0;
  }

  // This is to make the Array constructor visible for use within advanced-search.component.html
  Array(num) {
    return Array(num);
  }

  ngOnInit() {
  }

}
