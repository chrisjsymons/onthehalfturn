import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../services/posts/post.model';
import { Subscription } from 'rxjs';
import { PostsService } from '../services/posts/posts.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService
    .getPostsUpdateListener()
    .subscribe((postData: { posts: Post[]}) => {
      this.posts = postData.posts.reverse();
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
