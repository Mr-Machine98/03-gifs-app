import { ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'app-gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GifHistory {

  private gifService = inject(GifService);

  query = toSignal(inject(ActivatedRoute).params.pipe(
    map(params => params['query'])
  ));

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));
  
  
}
