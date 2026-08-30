import { Component, input } from '@angular/core';
import { GiftListItem } from "./gift-list-item/gift-list-item";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gif-list',
  imports: [GiftListItem],
  templateUrl: './gif-list.html'
})
export class GifList {
  gifs = input.required<Gif[]>();
}
