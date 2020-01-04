import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from './pages/categories/shared/category.model';

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Moradia", description: "Contas de casa" },
            { id: 2, name: "Saúde", description: "Plano de saúde" },
            { id: 3, name: "Lazer", description: "Cinema..." },
            { id: 4, name: "Salário", description: "Salário" },
            { id: 5, name: "Freelas", description: "Freelancer" }
        ];

        return { categories };
    }

}