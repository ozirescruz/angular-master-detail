import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Moradia", description: "Contas de casa" },
            { id: 2, name: "Saúde", description: "Plano de saúde" },
            { id: 3, name: "Lazer", description: "Cinema..." },
            { id: 4, name: "Salário", description: "Salário" },
            { id: 5, name: "Freelas", description: "Freelancer" },
            { id: 6, name: "Esporte", description: "Esporte" },
        ];

        const entries: Entry[] = [
            { id: 1, name: 'Gás de cozinha', categoryId: categories[1].id, category: categories[1], paid: true, date: "01/01/2020", amount: "970,85", type: "expense", description: "Contas de casa" } as unknown as Entry,
            { id: 2, name: 'Aluguel', categoryId: categories[2].id, category: categories[2], paid: false, date: "01/01/2020", amount: "666,80", type: "expense", description: "Contas de casa" } as unknown as Entry,
            { id: 3, name: 'Plano de saúde', categoryId: categories[5].id, category: categories[5], paid: true, date: "01/01/2020", amount: "2.500,56", type: "revenue", description: "Contas de casa" } as unknown as Entry,
            { id: 4, name: 'Comida', categoryId: categories[4].id, category: categories[4], paid: false, date: "01/01/2020", amount: "70,80", type: "expense", description: "Contas de casa" } as unknown as Entry,
            { id: 5, name: 'Luz', categoryId: categories[3].id, category: categories[3], paid: true, date: "01/01/2020", amount: "120,52", type: "revenue", description: "Contas de casa" } as unknown as Entry
        ];

        return { categories, entries };
    }

}