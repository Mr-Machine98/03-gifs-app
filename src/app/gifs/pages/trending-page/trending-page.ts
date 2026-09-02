import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifService } from '../../services/gifs.service';
@Component({
  selector: 'app-trending-page',
  // imports: [GifList],
  templateUrl: './trending-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPage {

  gifService = inject(GifService);
  gifs = computed( () => this.gifService.trendingGifs() );
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll(event: Event) {
    // scrollDiv es el div que tiene el scroll, es decir, el div que tiene la referencia #groupDiv
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    // scrollTop es la cantidad de pixeles que se ha scrolleado desde el top del div
    const scrollTop = scrollDiv.scrollTop;
    // clientHeight es la altura del div que tiene el scroll
    const clientHeight = scrollDiv.clientHeight;
    // scrollHeight es la altura total del contenido del div
    const scrollHeight = scrollDiv.scrollHeight;
    // si scrollTop + clientHeight es igual a scrollHeight, significa que se ha llegado al final del scroll
    //console.log({scrollTotal: scrollTop + clientHeight, scrollHeight});
    // isAtBottom es true si se ha llegado al final del scroll
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }

}
