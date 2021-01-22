/**
 * Configuration for opening a modal dialog.
 * 設定打開 Dialog 時要帶入的參數、資料等組態。
 *
 * 目前僅帶入資料，也可以在這裡設定要開啟的 Dialog 的尺寸等設定。
 */
export class DialogConfig {
    /**
     * 開啟 Dialog 時要傳入的資料。
     */
    data?: any;

    /**
     * Close all
     */
    closeAll?: boolean;

    /**
     * 當用戶在背景上按一下時關閉 Dialog 視窗。
     */
    closeDialogWhenClickBackdrop?: boolean = true;

    /**
     * 當用戶按了 ESC 鍵時是否關閉 Dialog 視窗。
     */
    closeDialogWhenTriggerESC?: boolean = true;

    /**
     * 開啟的 Dialog 最大的高度。(ex: 450px)
     *
     * 若沒有指定會自動計算出目前的解析度下所允許的最大高度，超出高度的話會出現垂直捲軸。
     */
    maxHeight?: string;

    /**
     * 開啟的 Dialog 最大的寬度。(ex: 650px, 65%)
     */
    maxWidth?: string;

    /**
     * dialog 開啟時要自動 focus 的元素
     * css selector
     */
    focus?: string = 'input, textarea';
}
