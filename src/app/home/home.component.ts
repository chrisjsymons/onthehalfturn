import { Component, OnInit, OnDestroy } from '@angular/core';
import { SlidesService } from '../services/slides/slides.service';
import { Slide } from '../services/slides/slide.model';
import { Subscription } from 'rxjs';
import { Post } from '../services/posts/post.model';
import { PostsService } from '../services/posts/posts.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  slides: Slide[] = [];
  posts: Post[] = [];
  private slideSub: Subscription;
  private postSub: Subscription;
  isLoading = false;

  constructor(
    public slidesService: SlidesService,
    public postService: PostsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.slidesService.getSlides();
    this.slideSub = this.slidesService
      .getSlidesUpdateListener()
      .subscribe((slideData: { slides: Slide[]}) => {
        this.slides = slideData.slides;
        this.isLoading = false;
      });
    this.postService.getPosts();
    this.postSub = this.postService
      .getPostsUpdateListener()
      .subscribe((postData: { posts: Post[]}) => {
        this.posts = postData.posts.reverse().slice(0, 3);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.slideSub.unsubscribe();
  }

}
