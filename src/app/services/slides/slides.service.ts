import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Slide } from './slide.model';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';

const SLIDES_URL = environment.apiUrl + 'slides/';

@Injectable({ providedIn: 'root' })
export class SlidesService {
  private slides: Slide[] = [];
  private slidesUpdated = new Subject<{ slides: Slide[] }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog) {}

  getSlides() {
    this.http.get<{ message: string, slides: any[] }>(SLIDES_URL)
    .pipe(
      map(slideData => {
        return {
          message: slideData.message,
          slides: slideData.slides.map(slide => {
            return {
              title: slide.title,
              content: slide.content,
              imagePath: slide.imagePath,
              id: slide._id
            };
          }),
        };
      })
    )
    .subscribe(transformedSlideData => {
      this.slides = transformedSlideData.slides;
      this.slidesUpdated.next({
        slides: [...this.slides]
      });
    });
  }

  getSlide(slideId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(SLIDES_URL + slideId);
  }

  getSlidesUpdateListener() {
    return this.slidesUpdated.asObservable();
  }

  addSlide(title: string, content: string, image: File) {
    const slideData = new FormData();
    slideData.append('title', title);
    slideData.append('content', content);
    slideData.append('image', image);
    this.http.post<{ message: string; slide: Slide }>(SLIDES_URL, slideData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateSlide(id: string, title: string, content: string, imagePath: File) {
    let slideData: Slide | FormData;
    if (typeof imagePath === 'object') {
      slideData = new FormData();
      slideData.append('id', id);
      slideData.append('title', title);
      slideData.append('content', content);
      slideData.append('image', imagePath, title);
    } else {
      slideData = {
        id: id,
        title: title,
        content: content,
        imagePath: imagePath
      };
    }
    this.http
      .put(SLIDES_URL + id, slideData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteSlide(slideId: string) {
    return this.http.delete<{ message: string }>(SLIDES_URL + slideId);
  }
}
