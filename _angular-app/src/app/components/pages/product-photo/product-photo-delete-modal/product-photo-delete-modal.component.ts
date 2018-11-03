import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ProductPhotoHttpService } from '../../../../services/http/product-photo-http.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from '../../../bootstrap/modal/modal.component';

@Component({
  selector: 'product-photo-delete-modal',
  templateUrl: './product-photo-delete-modal.component.html',
  styleUrls: ['./product-photo-delete-modal.component.css']
})
export class ProductPhotoDeleteModalComponent implements OnInit {

  productId: number; 
  @Input()
  photoId: number;

  @ViewChild(ModalComponent) modal: ModalComponent;

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onError: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();

  constructor(public productPhotoHttp: ProductPhotoHttpService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.productId = params.product;
    });
  }

  destroy(){
    this.productPhotoHttp
      .destroy(this.productId, this.photoId)
      .subscribe( () => this.onSuccess.emit(true));
  }

  showModal(){
    this.modal.show();
  }

  hideModal(){
    this.modal.hide();
  }

}
