import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchPage {

  private service = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string): void {
    this.service
      .searchGifs(query)
      .subscribe(resp => this.gifs.set(resp));
  }
}
