import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryNewModalComponent } from '../category-new-modal/category-new-modal.component';
import { CategoryEditModalComponent } from '../category-edit-modal/category-edit-modal.component';
import { CategoryDeleteModalComponent } from '../category-delete-modal/category-delete-modal.component';
import {CategoryHttpService} from '../../../../services/http/category-http.service';
import { Category } from '../../../../model';
import { CategoryInsertService } from './category-insert.service';
import { CategoryEditService } from './category-edit.service';
import { CategoryDeleteService } from './category-delete.service';

declare let $;

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent implements OnInit {

    categories: Array<Category> = [];
    //categories: Array<{id: number, name: string, active: boolean, created_at: {date:string}}> = []; // definição opcional (ajuda no auto complete)
    
    pagination = {
        page: 1,
        totalItems: 0,
        itemsPerPage: 15
    };

    sortColumn = {column: '', sort:''};

    @ViewChild(CategoryNewModalComponent)
    categoryNewModal: CategoryNewModalComponent;

    @ViewChild(CategoryEditModalComponent)
    categoryEditModal: CategoryEditModalComponent;

    @ViewChild(CategoryDeleteModalComponent)
    categoryDeleteModal: CategoryDeleteModalComponent;

    categoryId: number;

    searchText: string;

    constructor(private categoryHttp: CategoryHttpService, 
                protected categoryInsertService: CategoryInsertService,
                protected categoryEditService: CategoryEditService,
                protected categoryDeleteService: CategoryDeleteService) {
        this.categoryInsertService.CategoryListComponent = this;
        this.categoryEditService.CategoryListComponent = this;
        this.categoryDeleteService.CategoryListComponent = this;
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.getCategories();
    }

    getCategories(){
        this.categoryHttp.list({
            page: this.pagination.page,
            sort: this.sortColumn.column === '' ? null: this.sortColumn,
            search: this.searchText
        })
            .subscribe(response => { 
                this.categories = response.data;
                this.pagination.totalItems = response.meta.total;
                this.pagination.itemsPerPage = response.meta.per_page;
            })
    }

    pageChanged(page) {
        this.pagination.page = page;
        this.getCategories();
    }

    sort(sortColumn){
        this.getCategories();
    }

    search(search){
        this.searchText = search;
        this.getCategories();
    }

}
