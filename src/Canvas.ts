import throttle from 'lodash.throttle';

type Renderer = (canvas: Canvas) => void;

export default class Canvas {
  public element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public dpr: number;
  public width: number;
  public height: number;
  private renderers: Renderer[];

  constructor({ selector, renderers }: { selector: string; renderers: Renderer[] }) {
    this.element = <HTMLCanvasElement>document.querySelector(selector);
    this.ctx = <CanvasRenderingContext2D>this.element.getContext('2d');
    this.renderers = renderers;
    this.dpr = window.devicePixelRatio || 1;

    // do not render until it is really necessary
    this.fitToWindow({ render: false });

    const rect = this.element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // we need to render on resize to make sure we do not break anything
    window.addEventListener(
      'resize',
      throttle(() => this.fitToWindow({ render: true }), 200)
    );
  }

  public render = () => {
    this.renderers.forEach((renderer) => renderer(this));
    return this;
  };

  private fitToWindow = ({ render }: { render: boolean }) => {
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;

    const rect = this.element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.element.width = rect.width * this.dpr;
    this.element.height = rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    render && this.render();
    return this;
  };
}
