'use strict';
/*eslint no-sync:0*/
import * as fs from 'fs';
import path from 'path';
import _ from 'lodash';

export default class TemplateMail {
  constructor() {
    this.attachments = [];
    this.templates = {
      defaultTemplate: this.getTemplate()
    };
    this.templateOptions = {
      interpolate: /{{([\s\S]+?)}}/g
    };
    this.defaultTemplate = this.getTemplate();
    this.data = {};
    this.from = '';
    this.subject = '';
    this.to = '';
  }
  getTemplate() {
    return this.pathResolve('./template.default.html');
  }
  getHead() {
    return fs.readFileSync(this.pathResolve('./head.html'), 'utf8');
  }
  pathResolve(template) {
    return path.resolve(__dirname, template);
  }
  bindDataHtml() {
    this.data.head = this.getHead();
    //Get required data to generate HTML
    var templateName = this.defaultTemplate;
    //Resolve our template path using the path of a template given in options,
    //or if the path is the template name itself
    var templatePath = this.templates[templateName] || templateName;
    var templateContent = fs.readFileSync(templatePath, 'utf8');
    //Return the rendered version of our template via lodash template method.
    return _.template(templateContent, this.templateOptions)(this.data);
  }
}
