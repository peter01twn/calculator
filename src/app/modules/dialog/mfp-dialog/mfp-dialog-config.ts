export const MfpConfig = {
    // from plugin.js
    fixedContentPos: true,
    fixedBgPos: true,

    // custom
    enableEscapeKey: false,
    showCloseBtn: false,
    autoFocusLast: true,
};

export const enum DialogState {
    BEFORE_OPEN,
    OPENED,
    BEFORE_CLOSE,
    CLOSED,
}

export const enum DialogSize {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    STATE = 'state',
}
