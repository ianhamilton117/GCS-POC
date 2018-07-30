import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../node_modules/rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  search(query: String): Observable<any> {
    let url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDkGQ2TErpTl--zkgGErCh0_XhUFIWQC54&cx=014722161919417917553:vmkwzgw4l5u&q=";
    // let key = 
    return this.httpClient.get(url + query);
      // .pipe(
      //   map(

      //   )
      // );
      
    // .subscribe(
    //   (items) => {
    //     console.log(items);
    //     // return [];
    //   }
    // );
  }
}
