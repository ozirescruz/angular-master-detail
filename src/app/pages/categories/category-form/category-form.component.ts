import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

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
  submitingForm: boolean = false;

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


  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.

    this.setPageTitle();

  }

  submitForm() {
    this.submitingForm = true;

    if (this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  private buildCategporyForm() {
    this.categoryForm = this.formBuilder.group(
      {
        id: [null],
        name: [null, [Validators.required, Validators.minLength(2)]],
        description: [null]
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

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de nova categoria";
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando categoria " + categoryName;
    };
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )

  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )
  }

  private actionsForError(error: any): void {
    toastr.error("Erro ao processar solicitação!");
    this.submitingForm = false;

    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha no servidor!!"];
    }
  }

  private actionsForSuccess(category: Category): void {
    toastr.success("Criação categoria com sucesso!");
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    );
  }

}
