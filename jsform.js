/**
Copyright 2017 Callan Peter Milne

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

(function (w) {
  
  /** not related */
  
  "use strict";

  class Thing {
    constructor (name) {
      this.name = name;
    }
  }
  class Module extends Thing {
    constructor () {
      super(...arguments);
    }
  }
  class Package extends Thing {
    constructor () {
      super(...arguments);
    }
  }
  class ListItem {
    constructor (item) {
      this.item = item;
      this.itemType = item.constructor.name;
    }
  }
  class List {
    constructor (items) {
      this.items = items || [];
    }
  }
  console.log(new List([
    new ListItem(new Module("anotherModule")),
    new ListItem(new Package("eviratec/mypkg")),
    new ListItem(new Package("eviratec/anotherpkg")),
    new ListItem(new Module("someModule")),
  ]));
  
})(window);

(function (w) {
  
  "use strict";
  
  class FieldLabel {
    constructor (formField) {
      this.el = createElement("label", "");
      this.el.innerHTML = formField.opt.label;
    }
  }
  
  class FieldInput {
    constructor (formField) {
      this.el = createElement("input", `${formField.name}-input`);
      this.el.setAttribute("type", formField.type);
      this.el.setAttribute("name", formField.name);
    }
  }
  
  class SelectOption {
    constructor (fieldSelect, option) {
      this.el = createElement("option", "");
      this.el.setAttribute("value", option.value);
      this.el.innerHTML = option.label;
    }
  }
  
  class FieldSelect {
    constructor (formField) {
      console.log(formField.opt.options);
      this.el = createElement("select", "");
      this.el.setAttribute("name", formField.name);
      this.options = [];
      formField.opt.options.forEach(option => {
        this.addOption(option);
      });
    }
    addOption (o) {
      let option = new SelectOption(this, o);
      this.options.push(option);
      this.el.appendChild(option.el);
      return this;
    }
  }
  
  class AbstractFormField {
    constructor (opt) {
      this.opt = opt || {};
      
      this.el = createElement("div", `form-field ${this.opt.name}-field`);
      
      this.label = new FieldLabel(this);
      this.el.appendChild(this.label.el);
    }
    get name () {
      return this.opt.name || "";
    }
    get value () {
      return this.input.el.value || "";
    }
    disable () {
      this.input.el.setAttribute("disabled", "");
    }
    enable () {
      this.input.el.removeAttribute("disabled");
    }
  }
  
  class InputFormField extends AbstractFormField {
    constructor (opt) {
      super(opt);
      
      this.input = new FieldInput(this);
      this.el.appendChild(this.input.el);
      
      this.opt.placeholder &&
        this.setPlaceholder(this.opt.placeholder);
    }
    get type () {
      return this.opt.type || "text";
    }
    setPlaceholder (newValue) {
      this.input.el.setAttribute("placeholder", newValue);
    }
  }
  
  class SelectFormField extends AbstractFormField {
    constructor (opt) {
      super(opt);
      
      this.input = new FieldSelect(this);
      this.el.appendChild(this.input.el);
    }
  }
  
  class Button {
    constructor (opt) {
      this.opt = opt || {};
      this.el = createElement("button", "");
    }
    disable () {
      this.el.setAttribute("disabled", "");
    }
    enable () {
      this.el.removeAttribute("disabled");
    }
  }
  
  class SubmitButton extends Button {
    constructor (opt) {
      super(opt);
      this.el.setAttribute("type", "submit");
      this.el.innerHTML = this.opt.label || "Submit";
    }
  }
  
  function createElement (tagName, classAttr) {
    let el = w.document.createElement(tagName);
    el.setAttribute("class", classAttr);
    return el;
  }
  
  class FieldList extends Set {
    constructor () {
      super();
    }
    disableAll () {
      this.forEach(field => {
        field.disable();
      });
    }
    enableAll () {
      this.forEach(field => {
        field.enable();
      });
    }
  }
  
  class ButtonList extends Set {
    constructor () {
      super();
    }
  }
  
  class Form {
    constructor (id) {
      this.fields = new FieldList();
      this.buttons = new ButtonList();
      this.el = w.document.getElementById(id);
    }
    addField (f) {
      this.fields.add(f);
      this.el.appendChild(f.el);
      return f;
    }
    addSubmitButton (opt) {
      let submitButton = new SubmitButton(opt);
      this.buttons.add(submitButton);
      this.el.appendChild(submitButton.el);
      return submitButton;
    }
    onSubmit (fn) {
      this.el.addEventListener("submit", ev => {
        ev.preventDefault();
        fn(ev, this.serialize());
      });
      return this;
    }
    serialize () {
      let d = {};
      this.fields.forEach(field => {
        d[field.name] = field.value;
      });
      return d;
    }
  }
  
  w.InputFormField = InputFormField;
  w.SelectFormField = SelectFormField;
  w.Form = Form;
  
})(window);

(function (w) {
  
  "use strict";
  
  const InputFormField = w.InputFormField;
  const SelectFormField = w.SelectFormField;
  const Form = w.Form;
  
  let createPackageForm = new Form("createPackageForm");
  
  createPackageForm.onSubmit((ev, data) => {
    console.log("== CREATE PACKAGE FORM SUBMISSION ==");
    console.log(data);
  });
  
  createPackageForm.addField(new InputFormField({
    label: "Name",
    name: "packageName",
    type: "text",
  }));
  
  createPackageForm.addField(new InputFormField({
    label: "Version",
    name: "packageVersion",
    type: "text",
  }));
  
  createPackageForm.addSubmitButton({
    label: "Create Package",
  });
  
  let createModuleForm = new Form("createModuleForm");
  
  createModuleForm.onSubmit((ev, data) => {
    console.log("== CREATE MODULE FORM SUBMISSION ==");
    console.log(data);
  });
  
  createModuleForm.addField(new SelectFormField({
    label: "Package",
    name: "package",
    type: "select",
    options: [
      { label: "Test Package", value: "PACKAGE<123>" },
      { label: "Different Package", value: "PACKAGE<456>" },
    ],
  }));
  
  createModuleForm.addField(new InputFormField({
    label: "Name",
    name: "moduleName",
    type: "text",
  }));
  
  createModuleForm.addField(new InputFormField({
    label: "Version",
    name: "moduleVersion",
    type: "text",
  }));
  
  createModuleForm.addSubmitButton({
    label: "Create Module",
  });
  
  let createRouteForm = new Form("createRouteForm");
  
  createRouteForm.onSubmit((ev, data) => {
    console.log("== CREATE SOMETHING ELSE FORM SUBMISSION ==");
    console.log(data);
  });
  
  createRouteForm.addField(new InputFormField({
    label: "Path",
    name: "routePath",
    placeholder: "e.g. /cat/:catId",
    type: "text",
  }));
  
  let routeSubmitButton = createRouteForm.addSubmitButton({
    label: "Create Route",
  });
  
  createRouteForm.onSubmit((ev, data) => {
    console.log("== CREATE SOMETHING ELSE FORM SUBMISSION ==");
    console.log(data);
    createRouteForm.fields.disableAll();
    routeSubmitButton.disable();
  });
  
})(window);
