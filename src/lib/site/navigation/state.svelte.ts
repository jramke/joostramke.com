import { browser } from "$app/environment";
import { getContext, setContext } from "svelte";

type OffcanvasState = 'closed' | 'open' | 'closing' | 'opening';

class NavigationState {
    breakpoint = 622;

    showToggle = $state(false);
    offcanvasState = $state<OffcanvasState>('closed');
    transitioning = $derived.by(() => {
        return this.offcanvasState === 'closing' || this.offcanvasState === 'opening';
    });
    openOrOpening = $derived.by(() => {
        return this.offcanvasState === 'open' || this.offcanvasState === 'opening';
    });

    constructor() {
        
        $effect(() => {
            const abortController = new AbortController();

            this.handleResize();
            this.handleScroll();
            
            window.addEventListener('scroll', this.handleScroll, { signal: abortController.signal });
            window.addEventListener('resize', this.handleResize, { signal: abortController.signal });

            if (this.openOrOpening) {
                this.showToggle = true;
            }
            
            if (this.offcanvasState === 'closed') {
                document.body.style.overflow = '';
            } else {
                document.body.style.overflow = 'hidden';
            }

            return () => {               
                abortController.abort();
            }
        });
    }

    setOffcanvasState = (state: OffcanvasState) => {
        this.offcanvasState = state;
    }

    handleResize = () => {
        if (this.offcanvasState === 'open') return;

        if (window.innerWidth > this.breakpoint) {
            this.showToggle = false;
        } else {
            this.showToggle = true;
        }
    }

    handleScroll = () => {       
        if (window.innerWidth <= this.breakpoint) return;
        
        if (window.scrollY > 100) {
            this.showToggle = true;
        } else {
            this.showToggle = false;
        }
    }
}

const NAV_KEY = Symbol('navigation');

export function setNavigationState() {
    return setContext(NAV_KEY, new NavigationState());
}

export function getNavigationState() {
    return getContext<NavigationState>(NAV_KEY);
}