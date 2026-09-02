import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';
@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPage implements AfterViewInit {

  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  gifs = computed( () => this.gifService.trendingGifs() );
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

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
    
    this.scrollStateService.trendingScrollState.set(scrollTop);
    
    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }

}
