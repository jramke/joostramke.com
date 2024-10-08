import type { Action } from 'svelte/action';

import { ElasticDiv } from './elastic-div';

export const elasticDiv: Action<HTMLElement> = (node) => {
    let elasticDiv: ElasticDiv;

    const initializeElasticDiv = () => {
        if (elasticDiv) {
            elasticDiv.kill();
        }
        elasticDiv = new ElasticDiv(node);
    };

    initializeElasticDiv();

    return {
        update() {
            initializeElasticDiv();
        },
        destroy() {
            elasticDiv?.kill();
        }
    };
};
