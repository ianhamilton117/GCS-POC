import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from '../search-results';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  searchResults: SearchResults = null;

  constructor(private searchService: SearchService) { }

  onSearch(reqWords: string, exactPhrase: string, anyWords: string, withoutWords: string, fileFormat: string) {
    this.searchResults = this.searchService.advancedSearch(reqWords, exactPhrase, withoutWords, anyWords, fileFormat);
  }

  ngOnInit() {
  }

}
