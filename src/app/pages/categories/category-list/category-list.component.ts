import { Component } from '@angular/core';
import { Category } from '../shared/category.model';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseResourceListComponent<Category> {

  constructor(private categoryService: CategoryService) {
    super(categoryService);
  }

}
