import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResult } from './search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query = "";
  searchResults: SearchResult[] = [];

  constructor(private searchService: SearchService) { }

  onUpdateSearchQuery(event: Event) {
    this.query = (<HTMLInputElement>event.target).value;
  }

  onSearch() {
    this.searchResults = this.searchService.search(this.query);
  }

  ngOnInit() {

  }

}
