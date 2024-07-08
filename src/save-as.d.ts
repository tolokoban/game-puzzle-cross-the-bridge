declare module 'save-as' {
  function saveAs(content: Blob, filename: string): void
  export = saveAs    
}