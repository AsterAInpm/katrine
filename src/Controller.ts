const pug = require('pug');

export default class Controller {

  protected cachedViews: Map<string, any> = new Map<string, any>();
  protected cachedLayoutViews: Map<string, any> = new Map<string, any>();

  public getLayout(): string {
    return '';
  }

  protected getPugViewTemplate(viewPath) {
    if (!this.cachedViews.has(viewPath)) {
      const view = pug.compileFile(viewPath);
      this.cachedViews.set(viewPath, view);
    }

    return this.cachedViews.get(viewPath);
  }


  protected getPugLayoutTemplate(layoutName) {
    if (!this.cachedLayoutViews.has(layoutName)) {
      const view = pug.compileFile(layoutName);
      this.cachedLayoutViews.set(layoutName, view);
    }

    return this.cachedLayoutViews.get(layoutName);
  }

  protected render(viewPath, params) {
    const template = this.getPugViewTemplate(viewPath);

    const renderedActionContent = template(params);

    const layout = this.getLayout();
    if (layout) {
      return this.finallRender(renderedActionContent, layout, params);
    }

    return renderedActionContent;
  }

  protected renderLyout(viewPath: string, layoutPath: string, params) {
    const template = this.getPugViewTemplate(viewPath);

    const renderedActionContent = template(params);

    return this.finallRender(renderedActionContent, layoutPath, params);
  }


  private finallRender(content, layout: string, params = {}) {
    const template = this.getPugLayoutTemplate(layout);

    return template({ content, ...params });
  }

}
