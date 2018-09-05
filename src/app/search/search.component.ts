import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from './search-results';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResults: SearchResults = null;

  constructor(private searchService: SearchService) { }

  onSearch(searchQueryInput: HTMLInputElement, pageNum: number = 1) {
    this.searchResults = this.searchService.basicSearch(searchQueryInput.value);
  }

  onPageNav(pageNum: number) {
    this.searchResults = this.searchService.pageNav(pageNum);
  }

  resultsPresent() {
    return this.searchResults !== null && this.searchResults.results.length > 0;
  }

  emptyResults() {
    return this.searchResults !== null && this.searchResults.numPages == -1;
  }

  // This is to make the Array constructor visible for use within search.component.html
  Array(num) {
    return Array(num);
  }

  ngOnInit() {

  }

}
