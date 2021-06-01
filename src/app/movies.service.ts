import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
	
  itemsSearched = new Subject<{items: string[]}>();
  moviesFetched = new Subject<{ allMovies: Movie[] }>();
  private allMovies: Movie[] = [];
  private recentSearches: string[] = [];

  constructor(private http: HttpClient, private router: Router) { }
  
  getSearchResults() {
    return this.moviesFetched.asObservable();
  }
  
  getRecentItems() {
	  return this.itemsSearched.asObservable();
  }
  
  fetchSearchResults(m: string){
	  const movie = m;
	  this.recentSearches.push(movie);
	  this.http.get<{page: number, results: any[], total_pages: number, total_results: number}>("https://api.themoviedb.org/3/search/multi?api_key=841e56b1fb18a4758fddc2c49326c7e3&language=en-US&page=1&include_adult=false&query=" + movie).pipe(map(movieData => {
      var movie_name;
	  var movie_path;
	  var movie_lang;
	  
	  return {
        movies: movieData.results.map(mov => {
		
		  if (mov.title){
			  movie_name = mov.title
		  } else if (mov.original_name){
			  movie_name = mov.original_name;
		  } else {
			  movie_name = mov.original_title;
		  } 
		  if(mov.backdrop_path == null){
			  movie_path = null;
		  } else{
			  movie_path = "https://image.tmdb.org/t/p/w500" + mov.backdrop_path;
		  }
		  
		  var movie_lang = mov.original_language;
         
		  
          let movieInfo = {
            movie_name: movie_name,
			movie_path: movie_path,
			movie_lang: movie_lang
          }
          
          return movieInfo;
        })
      };
    })).subscribe(res => {
		//console.log(this.recentSearches);
		this.allMovies = res.movies;
		this.moviesFetched.next({ allMovies: [...this.allMovies] });
		this.itemsSearched.next({ items: [...this.recentSearches] });
	  });
  }
  
  refershRecentSearchs() {
	  this.itemsSearched.next({ items: [...this.recentSearches] });
  }
}
