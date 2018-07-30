import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query = "";
  searchResults: string[] = [];

  constructor(private searchService: SearchService) { }

  onUpdateSearchQuery(event: Event) {
    this.query = (<HTMLInputElement>event.target).value;
  }

  onSearch() {
    this.searchService.search(this.query)
      .subscribe(
        (response) => {
          // for (var item in response.items) {
          //   this.searchResults.push(item.htmlTitle);
          // }
          for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            this.searchResults.push(item.htmlTitle);
          }
        },
        (error) => console.log(error)
      );
  }

  ngOnInit() {

  }

}
