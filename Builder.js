export class Builder {

  static build(...args) {
    return new this(...args);
  }

}
