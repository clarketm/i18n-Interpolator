import {byString, error, makeObject, makeString} from './helpers';
import {Builder} from './Builder';


export class Interpolator extends Builder {
  static prefix = '{{';
  static suffix = '}}';
  static escape = '%';

  Type = {
    REPLACE: 'REPLACE',
    ESCAPE: 'ESCAPE'
  };

  constructor(base) {
    super();
    this.base = makeString(base);
  }

  resetRegExp(type) {
    const {prefix, suffix, escape} = Interpolator;
    const {Type} = this;
    let regexpStr;

    switch (type) {
      case Type.REPLACE:
      default:
        regexpStr = `[^${escape}](${prefix}(.+?)${suffix})`;
        break;
      case Type.ESCAPE:
        regexpStr = `[${escape}](${prefix}(.+?)${suffix})`;
        break;
    }
    this.regexp = new RegExp(regexpStr, 'g');
  }

  interpolate(override) {
    let {base, Type} = this;
    let match, target, replacement;

    override = makeObject(override);

    this.resetRegExp(Type.REPLACE);
    while (match = this.regexp.exec(base)) {
      target = match[2].trim();
      target = makeString(target);
      replacement =
        byString.bind(override)(target) ||
        byString.bind(makeObject(base))(target) ||
        error(`no variable ${match[1]} for interpolating ${base}`);
      base = base.replace(match[1], replacement);
      this.regexp.lastIndex = match.index;
    }
    this.resetRegExp(Type.ESCAPE);
    while (match = this.regexp.exec(base)) {
      replacement = match[1];
      base = base.replace(match[0], replacement);
    }
    return makeObject(base);
  }
}
