
export const last = (arr:any[]) => arr[arr.length -1];

export function replaceLastOccuranceOfString(text:string, oldWord:string, newWord:string) {
  var idx = text.lastIndexOf(oldWord);

  // slice the string in 2, one from the start to the lastIndexOf
  // and then replace the word in the rest
  if(idx !== -1) {
    text = text.slice(0, idx) + text.slice(idx).replace(oldWord, newWord);
  }

  return text;
}
