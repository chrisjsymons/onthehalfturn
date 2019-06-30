import { OnInit, OnDestroy, Component } from '@angular/core';
import { PostsService } from 'src/app/services/posts/posts.service';
import { Post } from 'src/app/services/posts/post.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss']
})
export class SingleBlogComponent implements OnInit {
  post: Post;
  isLoading = false;
  private postId: string;

  constructor(
    private postService: PostsService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isLoading = true;
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content.replace(/\n/g, '<br>'),
            imagePath: postData.imagePath
          };
        });
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }
}
