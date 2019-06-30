import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';

const POSTS_URL = environment.apiUrl + 'post/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[] }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog) {}

  getPosts() {
    this.http.get<{ message: string, posts: any[] }>(POSTS_URL)
    .pipe(
      map(postData => {
        return {
          message: postData.message,
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              id: post._id
            };
          }),
        };
      })
    )
    .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts]
      });
    });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(POSTS_URL + postId);
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    this.http.post<{ message: string; post: Post }>(POSTS_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, imagePath: File) {
    let postData: Post | FormData;
    if (typeof imagePath === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', imagePath, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: imagePath
      };
    }
    this.http
      .put(POSTS_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(POSTS_URL + postId);
  }
}
