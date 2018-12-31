export class Complex {
  real: number;
  imaginary: number;

  constructor(real = 0, imaginary = 0) {
    this.real = real;
    this.imaginary = imaginary;
  }

  mult(b: Complex) {
    return new Complex(
      this.real * b.real - this.imaginary * b.imaginary,
      this.real * b.imaginary + this.imaginary * b.real
    );
  }

  rmult(r: number) {
    return new Complex(this.real * r, this.imaginary * r);
  }

  imult(i: number) {
    return new Complex(-i * this.imaginary, i * this.real);
  }

  add(b: Complex) {
    return new Complex(this.real + b.real, this.imaginary + b.imaginary);
  }

  abs() {
    return Math.sqrt(this.real ** 2 + this.imaginary ** 2);
  }

  conj() {
    return new Complex(this.real, -this.imaginary);
  }

  neg() {
    return new Complex(-this.real, -this.imaginary);
  }
}

export const c = (real: number, imaginary: number) =>
  new Complex(real, imaginary);
