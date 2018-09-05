import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from './../search-results/search-results';

@Component({
  selector: 'app-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.css']
})
export class BasicSearchComponent implements OnInit {

  searchResults: SearchResults = null;

  constructor(private searchService: SearchService) { }

  onSearch(searchQueryInput: HTMLInputElement, pageNum: number = 1) {
    this.searchResults = this.searchService.basicSearch(searchQueryInput.value);
  }

  ngOnInit() {

  }

}
