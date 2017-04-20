export function makeString(val) {
  return typeof val === 'string' ? val : JSON.stringify(val);
}

export function makeObject(val) {
  return val instanceof Object ? val : JSON.parse(val);
}

export function byString(str) {
  str = str.replace(/\[(\w+)\]/, '.$1');
  str = str.replace(/^\./, '');
  let self = this;
  let a = str.split('.');
  for (let i = 0; i < a.length; i++) {
    let k = a[i];
    if (k in self) {
      self = self[k];
    } else {
      return;
    }
  }
  return self;
}

export function error(message = 'unknown error') {
  console.error(new Error(message));
}
