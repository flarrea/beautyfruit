import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
      {
        path: 'products',
        loadChildren: () => import('../../pages/products/products.module').then( m => m.ProductsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('../../pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
      },
      {
        path: 'cartview',
        loadChildren: () => import('../../pages/cartview/cartview.module').then( m => m.CartviewPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/products',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
