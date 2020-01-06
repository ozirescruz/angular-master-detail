import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageFile: string;
  serverErrorMessages: string[] = null;
  category: Category = new Category();
  pageTitle: string = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategporyForm();
    this.loadCategory();
  }

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  private buildCategporyForm() {
    this.categoryForm = this.formBuilder.group(
      {
        id: [null],
        name: [null, [Validators.required, Validators.minLength(2)]],
        descripion: [null]
      }
    )
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(switchMap(params =>
        this.categoryService.getById(+params.get("id")))
      ).subscribe(category => {
        this.category = category;
        this.categoryForm.patchValue(category);
      }, (error) => {
        alert("Erro: " + error);
      })
    }
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.

    this.setPageTitle();

  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de nova categoria";
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando categoria " + categoryName;
    };
  }

}
