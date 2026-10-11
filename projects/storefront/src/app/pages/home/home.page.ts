import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RESTAURANT } from '../../core/data/menu.data';
import { CategoryId } from '../../core/models/menu.model';
import { MenuService } from '../../core/services/menu.service';
import { ProductSheetService } from '../../core/services/product-sheet.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { IconComponent, IconName } from '../../shared/icon.component';
import { LogoMarkComponent } from '../../shared/logo.component';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrlPipe, IconComponent, LogoMarkComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly router = inject(Router);
  readonly menu = inject(MenuService);
  readonly sheet = inject(ProductSheetService);

  readonly restaurant = RESTAURANT;
  readonly categories = this.menu.categories;
  readonly bestSellers = this.menu.bestSellers();
  readonly highlightCategory: CategoryId = 'burgers';

  readonly features: { icon: IconName; label: string }[] = [
    { icon: 'medal', label: 'Carne do dia' },
    { icon: 'leaf', label: 'Ingredientes frescos' },
    { icon: 'flame', label: 'Grelha a carvão' },
    { icon: 'scooter', label: 'Delivery rápido' },
  ];

  goToCategory(id: CategoryId): void {
    this.router.navigate(['/cardapio'], { queryParams: { categoria: id } });
  }

  openWeeklyCombo(): void {
    this.sheet.open(this.menu.getById('c1'));
  }
}
