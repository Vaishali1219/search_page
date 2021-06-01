import { Component, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { MoviesService } from '../movies.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, AfterContentChecked, OnDestroy {
  //searchHistory: string;
  searchItems: any[] = [];
  typeWord: string = "";
  showAlpha: boolean = true;
  private recentSubs: Subscription;
  
  constructor(private moviesService: MoviesService, private router: Router) { }

  ngOnInit(): void {
	  this.moviesService.refershRecentSearchs();
	  this.recentSubs = this.moviesService.getRecentItems().subscribe((it: {items: string[]}) => {
		  this.searchItems = it.items;
	  });
  }
  
  ngAfterContentChecked(){
	  this.moviesService.refershRecentSearchs();
	  this.moviesService.getRecentItems().subscribe((it: {items: string[]}) => {
		  this.searchItems = it.items;
	  });
  }
  
  fetchMovie(){
	  this.router.navigate(['search-results/', this.typeWord]);
  }
  
  ngOnDestroy(){
	  if(this.recentSubs){
		  this.recentSubs.unsubscribe();
	  }
  }
  
  addAlpha(w: string){
	  this.typeWord = this.typeWord + w;
  }
  
  spliceAlpha(){
	  this.typeWord = this.typeWord.slice(0, this.typeWord.length - 1);
  }
  
  clearAlpha(){
	  this.typeWord = "";
  }
  
  setAlpha(){
	  if(this.showAlpha){
		  this.showAlpha = false;
	  }else{
		  this.showAlpha = true;
	  }
  }

}
