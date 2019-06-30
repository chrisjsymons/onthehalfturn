import { Component, OnInit, OnDestroy } from '@angular/core';
import { SlidesService } from '../services/slides/slides.service';
import { Slide } from '../services/slides/slide.model';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../services/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { Post } from '../services/posts/post.model';
import { PostsService } from '../services/posts/posts.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  slides: Slide[] = [];
  posts: Post[] = [];
  isLoading = false;
  private slideSub: Subscription;
  private postSub: Subscription;

  constructor(private slidesService: SlidesService, private postService: PostsService, public dialog: MatDialog) {}

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
      this.posts = postData.posts;
      this.isLoading = false;
    });
  }

  onDelete(type: string, id: string) {
    const newDialog = this.dialog.open(DialogComponent, {
      data: { type: type }
    });

    newDialog.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'slide') {
          this.slidesService.deleteSlide(id).subscribe(() => {
            this.slidesService.getSlides();
          }, () => {
            this.isLoading = false;
          });
        } else {
          this.postService.deletePost(id).subscribe(() => {
            this.postService.getPosts();
          }, () => {
            this.isLoading = false;
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.slideSub.unsubscribe();
    this.postSub.unsubscribe();
  }
}
