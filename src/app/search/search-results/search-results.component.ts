import { Component, OnInit, Input } from '@angular/core';
import { SearchResults } from '../search-results';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  @Input() searchResults: SearchResults;

  constructor(private searchService: SearchService) { }

  onPageNav(pageNum: number) {
    this.searchResults = this.searchService.pageNav(pageNum);
  }

  status() {
    if (this.searchResults === null) return null;
    else return this.searchResults.status;
  }

  // This is to make the Array constructor visible for use within search-results.component.html
  Array(num) {
    return Array(num);
  }

  ngOnInit() {
  }

}
