// import Complex from "./Complex";
// import Complex from "./Complex";
import * as _ from 'lodash';
import { complex, cos, sin, sqrt } from 'mathjs';

interface Point {
  readonly x: number;
  readonly y: number;
  readonly t?: number;
}

export default class Photon {
  public static horizontal(): Photon {
    return new Photon(complex(1, 0), complex(0, 0));
  }
  public static vertical(): Photon {
    return new Photon(complex(0, 0), complex(1, 0));
  }
  public static diagonal(): Photon {
    return new Photon(complex(1 / sqrt(2), 0), complex(1 / sqrt(2), 0));
  }
  public static antidiagonal(): Photon {
    return new Photon(complex(1 / sqrt(2), 0), complex(-1 / sqrt(2), 0));
  }
  public static circularCW(): Photon {
    return new Photon(complex(1 / sqrt(2), 0), complex(0, 1 / sqrt(2)));
  }
  public static circularCCW(): Photon {
    return new Photon(complex(1 / sqrt(2), 0), complex(0, -1 / sqrt(2)));
  }

  public static toPath(points: readonly Point[], center: Point): string {
    let svgPath: string = `M ${center.x},${center.y} `;
    points.forEach(point => {
      svgPath += `L ${center.x + point.x},${center.y + point.y} `;
    });
    return svgPath;
  }

  public readonly a: math.Complex;
  public readonly b: math.Complex;

  constructor(a: math.Complex, b: math.Complex) {
    this.a = a;
    this.b = b;
  }

  // Compute points of the electric field from its complex numbers
  public electric(z = 1, k = 1): Point {
    const Ex: number = this.a.re * cos(k * z) + this.a.im * sin(k * z);
    const Ey: number = this.b.re * cos(k * z) + this.b.im * sin(k * z);
    return { x: Ex, y: Ey, t: z };
  }

  // Electric field in the X field
  public Ex(z: number, k = 20): number {
    return this.a.re * Math.cos(k * z) + this.a.im * Math.sin(k * z);
  }
  // Electric field in the Y field
  public Ey(z: number, k = 20): number {
    return this.b.re * Math.cos(k * z) + this.b.im * Math.sin(k * z);
  }

  // Gaussian scaling
  public gaussianEx(z: number, sigma = 0.3): number {
    return this.Ex(z) * Math.exp((-z * z) / (2 * sigma * sigma));
  };
  // Gaussian scaling
  public gaussianEy(z: number, sigma = 0.3): number {
    return this.Ey(z) * Math.exp((-z * z) / (2 * sigma * sigma));
  };

  // Compute path for range
  public electric_points(steps = 0.1): readonly Point[] {
    // tslint:disable-next-line: readonly-array
    const points: Point[] = [];
    _.range(-1, 1, steps).map(step => {
      points.push(this.electric(step));
    });
    return points;
  }

  public display(): void {
    // tslint:disable-next-line: no-console
    console.log(`A: ${this.a.format(3)} - radius: ${this.a.toPolar().r}, phi: ${this.a.toPolar().phi}`);
    // tslint:disable-next-line: no-console
    console.log(`B: ${this.b.format(3)} - radius: ${this.b.toPolar().r}, phi: ${this.b.toPolar().phi}`);
  }
}
