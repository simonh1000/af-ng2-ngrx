import { Injectable } from '@angular/core';

const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsmFxJXA-eYrp0u0q0fTY_nXD8vVrsKR0&callback=__onGoogleLoaded';

@Injectable()
export class GoogleMapsLoader {
    private static promise;

    public static load() {
        // First time 'load' is called?
        if (!GoogleMapsLoader.promise) {

            // Make promise to load
            GoogleMapsLoader.promise = new Promise( (resolve, reject) => {

                // Set callback for when google maps is loaded.
                window['__onGoogleLoaded'] = (ev) => {
                    resolve('google maps api loaded');
                };

                // Add script tag to load google maps, which then triggers the callback, which resolves the promise with windows.google.maps.
                console.log('[GoogleMapsLoader] Inserting script');
                let node = document.createElement('script');
                node.src = url;
                node.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
        }

        // Always return promise. When 'load' is called many times, the promise is already resolved.
        return GoogleMapsLoader.promise;
    }
}
