export const SUPPLEMENTED_SYMBOLS = {
    SUPPLEMENTATION_COMPLETED: Symbol('SUPPLEMENTATION_COMPLETED'),

    SUPPLEMENTATION_STARTED_SINGLE: Symbol('SUPPLEMENTATION_STARTED_SINGLE'),
    SUPPLEMENTATION_ENDED_SINGLE: Symbol('SUPPLEMENTATION_ENDED_SINGLE'),

    SUPPLEMENTATION_COUNT: Symbol('SUPPLEMENTATION_COUNT'),

    SUPPLEMENTATION_RESOLVE: Symbol('SUPPLEMENTATION_RESOLVE'),
  };
  
export const addSupplementationMetadata = (mainClass) => {
    if (!mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED]) {
        mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COUNT] = 0;
        mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED] = new Promise((resolve, reject) => {
            mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_RESOLVE] = resolve;
            mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_STARTED_SINGLE] = () => {
                mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COUNT]++;
            };
            mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_ENDED_SINGLE] = () => {
                mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COUNT]--;
                if (mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COUNT] === 0) {
                    mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_RESOLVE]();
                }
            };
        });
    }
};

export const getSupplementationMetadata = (mainClass) => {
    return mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETE];
};

export const isSupplementationComplete = (mainClass) => {
    return mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETE];
};