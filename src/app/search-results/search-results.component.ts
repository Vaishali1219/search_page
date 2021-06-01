import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoviesService } from '../movies.service';
import { Movie } from '../movie.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  
  searchItem: string;
  searchedMovies: any[] = [];
  private searchSubs: Subscription;
  
  constructor(private moviesService: MoviesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
	  this.route.paramMap.subscribe((paramMap: ParamMap) => {
          this.searchItem = paramMap.get('s');
          this.moviesService.fetchSearchResults(this.searchItem);
        });
	  this.searchSubs = this.moviesService.getSearchResults().subscribe((movData: {allMovies: Movie[]}) => {
		  this.searchedMovies = movData.allMovies;
	  });
  }
  
  ngOnDestroy(){
	  if(this.searchSubs){
		  this.searchSubs.unsubscribe();
	  }
  }
  
}
