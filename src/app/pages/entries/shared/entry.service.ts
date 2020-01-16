import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entry } from './entry.model';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({

    providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{
    constructor(protected injector: Injector) {
        super('api/entries', injector);
    }

}
