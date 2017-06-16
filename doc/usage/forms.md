# Forms

## How-to

### Create a Form

```html
<div>
  <form id="myForm"></form>
</div>
```

```javascript
let formElementId = "myForm";
let myForm = new Form(formElementId);
```

### Add *onSubmit* callback

```javascript
myForm.onSubmit((ev, data) => {
  console.log("== FORM SUBMISSION ==");
  console.log(data); // Submission data (field key=>value pairs)
  console.log(ev); // The browser event
});
```

### Add a submit button

```javascript
myForm.addSubmitButton({
  label: "Submit My Form",
});
```

### Add a text input form field

```javascript
myForm.addField(new InputFormField({
  label: "My Text Input",
  name: "myTextInput",
  type: "text",
}));
```

### Add a select form field

```javascript
myForm.addField(new SelectFormField({
  label: "Choose an option",
  name: "selectedOption",
  type: "select",
  options: [
    { label: "Option #1", value: "OPTION_1" },
    { label: "Option #2", value: "OPTION_2" },
  ],
}));
```

### Disable all fields

```javascript
myForm.fields.disableAll();
```

## Examples

### Example 1.

#### HTML

```html
<div>
  <form id="myForm"></form>
</div>
```

#### JavaScript

```javascript
let formElementId = "myForm";
let myForm = new Form(formElementId);

myForm.onSubmit((ev, data) => {
  console.log("== FORM SUBMISSION ==");
  console.log(data); // Submission data (field key=>value pairs)
  console.log(ev); // The browser event
});

myForm.addField(new InputFormField({
  label: "My Text Input",
  name: "myTextInput",
  type: "text",
}));

myForm.addField(new SelectFormField({
  label: "Choose an option",
  name: "selectedOption",
  type: "select",
  options: [
    { label: "Option #1", value: "OPTION_1" },
    { label: "Option #2", value: "OPTION_2" },
  ],
}));

myForm.addSubmitButton({
  label: "Submit My Form",
});
```