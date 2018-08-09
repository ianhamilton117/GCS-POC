import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResult } from './search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResults: SearchResult[] = null;

  constructor(private searchService: SearchService) { }

  onSearch(searchQueryInput: HTMLInputElement) {
    this.searchResults = this.searchService.search(searchQueryInput.value);
  }

  resultsPresent() {
    return this.searchResults !== null && this.searchResults.length > 0;
  }

  ngOnInit() {

  }

}
