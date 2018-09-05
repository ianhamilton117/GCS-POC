import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from './search-results/search-results';

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

  ngOnInit() {

  }

}
