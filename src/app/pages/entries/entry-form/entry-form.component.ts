import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageFile: string;
  serverErrorMessages: string[] = null;
  entry: Entry = new Entry();
  pageTitle: string = null;
  submitingForm: boolean = false;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  categories: Array<Category>;

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.

    this.setPageTitle();

  }

  submitForm() {
    this.submitingForm = true;

    if (this.currentAction == "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group(
      {
        id: [null],
        name: [null, [Validators.required, Validators.minLength(2)]],
        description: [null],
        type: ["expense", [Validators.required]],
        amount: [null, [Validators.required]],
        date: [null, [Validators.required]],
        paid: [true, [Validators.required]],
        categoryId: [null, [Validators.required]]
      }
    )
  }

  private loadEntry() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(switchMap(params =>
        this.entryService.getById(+params.get("id")))
      ).subscribe(entry => {
        this.entry = entry;
        this.entryForm.patchValue(entry);
      }, (error) => {
        alert("Erro: " + error);
      })
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de novo lançamneto";
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando lançamento " + entryName;
    };
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )

  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      entry => this.actionsForSuccess(entry),
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

  private actionsForSuccess(entry: Entry): void {
    toastr.success("Criação lançamento com sucesso!");
    this.router.navigateByUrl("entries", { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    );
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(categories =>
      this.categories = categories
    );
  }
}
