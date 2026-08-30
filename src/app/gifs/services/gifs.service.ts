import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEYS = 'gifs';

const loadFromLocalStorage = () => {
    const gifsFromLocalStorage = localStorage.getItem(GIF_KEYS) ?? '{}';
    const gifs = JSON.parse(gifsFromLocalStorage);
    console.log(gifs);
    return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    isTrendingGifsLoading = signal(true);
    searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

    constructor() {
        this.loadTrendingGifs();
    }

    saveGifsToLocalStorage = effect(() => {
        localStorage.setItem(GIF_KEYS, JSON.stringify(this.searchHistory()));
    });

    loadTrendingGifs(): void {
        this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
            params: {
                api_key: environment.giphyApiKey,
                limit: 20,
            }
        }).subscribe( (resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
            this.trendingGifs.set(gifs);
            this.isTrendingGifsLoading.set(false)
            console.log({gifs})
        });
    }

    searchGifs(query: string): Observable<Gif[]> {
        return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
            params: {
                api_key: environment.giphyApiKey,
                q: query,
                limit: 20,
            }
        }).pipe(// Los rxjs nos permiten transformar emisiones de datos, 
            // en este caso la respuesta de la API
            // Componentes de rjxs nos permiten transformar emisiones
            // proposito de que la data quede lo mas procesada posible
            map((res) => GifMapper.mapGiphyItemsToGifArray(res.data)),
            // TODO: Historial
            tap(items => {
                this.searchHistory.update( history => ({
                    ...history,
                    [query.toLocaleLowerCase()]: items
                }))
            })
        );
    }

    getHistoryGifs(query: string): Gif[] {
        return this.searchHistory()[query] ?? [];
    }
    
}