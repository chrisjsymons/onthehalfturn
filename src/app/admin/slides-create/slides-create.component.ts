import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SlidesService } from '../../services/slides/slides.service';
import { mimeType } from '../mime-type.validator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Slide } from '../../services/slides/slide.model';

@Component({
  selector: 'app-slides-create',
  templateUrl: './slides-create.component.html',
  styleUrls: ['./slides-create.component.scss']
})
export class SlidesCreateComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  private mode = 'create';
  imagePreview: any;
  private slideId: string;
  slide: Slide;

  constructor(
    public slidesService: SlidesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('slideId')) {
        this.mode = 'edit';
        this.slideId = paramMap.get('slideId');
        this.isLoading = true;
        this.slidesService.getSlide(this.slideId).subscribe(slideData => {
          this.isLoading = false;
          this.slide = {
            id: slideData._id,
            title: slideData.title,
            content: slideData.content,
            imagePath: slideData.imagePath
          };
          this.form.setValue({
            title: this.slide.title,
            content: this.slide.content,
            image: this.slide.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.slideId = null;
      }
    });
  }

  onSaveSlide() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.slidesService.addSlide(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.slidesService.updateSlide(
        this.slideId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
