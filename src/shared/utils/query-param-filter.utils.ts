export function removeQueryParameters(inputString: string): string {
    const questionMarkIndex = inputString.indexOf('?');
    
    if (questionMarkIndex !== -1) {
      return inputString.substring(0, questionMarkIndex);
    }
    
    return inputString;
  }