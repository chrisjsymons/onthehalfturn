import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SlidesCreateComponent } from './admin/slides-create/slides-create.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './services/auth/auth-guard';
import { PostsCreateComponent } from './admin/post-create/post-create.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogComponent } from './blog/single-blog/single-blog.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/createSlide', component: SlidesCreateComponent, canActivate: [AuthGuard] },
  { path: 'admin/createSlide/:slideId', component: SlidesCreateComponent, canActivate: [AuthGuard] },
  { path: 'admin/createPost', component: PostsCreateComponent, canActivate: [AuthGuard] },
  { path: 'admin/createPost/:postId', component: PostsCreateComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './services/auth/auth.module#AuthModule' },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:postId', component: SingleBlogComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
