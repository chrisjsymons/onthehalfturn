import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SlidesCreateComponent } from './admin/slides-create/slides-create.component';
import { PostsCreateComponent } from './admin/post-create/post-create.component';
import { AuthInterceptor } from './services/auth/auth-interceptor';
import { DialogComponent } from './services/dialog/dialog.component';
import { BlogComponent } from './blog/blog.component';
import { SingleBlogComponent } from './blog/single-blog/single-blog.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdminComponent,
    SlidesCreateComponent,
    PostsCreateComponent,
    DialogComponent,
    BlogComponent,
    SingleBlogComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
