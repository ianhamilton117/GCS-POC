import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResults } from '../search-results/search-results';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  searchResults: SearchResults = null;

  constructor(private searchService: SearchService) { }

  onSearch(reqWords: HTMLInputElement, exactPhrase: HTMLInputElement, anyWords: HTMLInputElement, withoutWords: HTMLInputElement, fileFormat: HTMLSelectElement) {
    this.searchResults = this.searchService.advancedSearch(reqWords.value, exactPhrase.value, withoutWords.value, anyWords.value, fileFormat.value);
  }

  ngOnInit() {
  }

}
