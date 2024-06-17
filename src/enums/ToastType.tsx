/**
 * Enum to be used with Toast and ToastViewModel.
 * 
 * Each value corresponds to a type of toast (passive alert)
 * that a user would potentially see.
 * 
 * eg. Error messages, success messages, etc.
 */
export enum ToastType{
    DEFAULT = 'default',
    ERROR = 'error',
    SUCCESS = 'success'
}