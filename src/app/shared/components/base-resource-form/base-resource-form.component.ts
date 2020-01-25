import { OnInit, AfterContentChecked, Injector } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import toastr from "toastr";
import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel>
  implements OnInit, AfterContentChecked {
  currentAction: string;
  resourceForm: FormGroup;
  pageFile: string;
  serverErrorMessages: string[] = null;
  pageTitle: string = null;
  submitingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.

    this.setPageTitle();
  }

  submitForm() {
    this.submitingForm = true;

    if (this.currentAction == "new") {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  protected setCurrentAction() {
    this.currentAction =
      this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  protected loadResource() {
    if (this.currentAction == "edit") {
      this.route.paramMap
        .pipe(
          switchMap(params => this.resourceService.getById(+params.get("id")))
        )
        .subscribe(
          resource => {
            this.resource = resource;
            this.resourceForm.patchValue(resource);
          },
          error => {
            alert("Erro: " + error);
          }
        );
    }
  }

  protected setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected editionPageTitle(): string {
    return "Editando";
  }

  protected creationPageTitle(): string {
    return "Novo";
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    );
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    );
  }

  protected actionsForError(error: any): void {
    toastr.error("Erro ao processar solicitação!");
    this.submitingForm = false;

    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha no servidor!!"];
    }
  }

  protected actionsForSuccess(resource: T): void {
    toastr.success("Criação categoria com sucesso!");

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router
      .navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() =>
        this.router.navigate([baseComponentPath, resource.id, "edit"])
      );
  }

  protected abstract buildResourceForm(): void;
}
