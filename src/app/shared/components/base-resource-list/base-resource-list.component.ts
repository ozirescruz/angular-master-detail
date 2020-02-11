import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private baseResourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.baseResourceService.getAll().subscribe(
      resource => this.resources = this.resources.sort((a, b) => b.id - a.id),
      error => console.log("ERRO NO GET ALL")
    )

  }

  deleteResource(resource: T) {
    const mustDelete = confirm("Confirma exclusão?");

    if (mustDelete) {
      this.baseResourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element.id !== resource.id),
        () => console.log("ERRO AO EXCLUIR RESOURCE!")
      )
    }

  }
}
