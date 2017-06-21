/**
 * See http://usejsdoc.org/tags-inline-link.html for how to use inline links.
 * These links {@link http://usejsdoc.org/tags-inline-link.html Odecee} also work.
 * Also part of the description: This class requires the modules {@link module:xyzcorp/helper} and
 * {@link module:xyzcorp/helper.ShinyWidget#polish ShinyWidget}.
 *
 * Nunjucks converts full URLs automatically.
 *
 * @ngdoc directive
 *
 * @name MyButton
 *
 * @description
 * A description.
 *
 * @example
 * <button>Submit</button>
 * <label>Submit button</label>
 *
 * @deprecated Since 1976
 *
 * @requires module:xyzcorp/helper
 * @requires xyzcorp/helper.ShinyWidget#polish
 *
 * @param {string} colour1 - The first color, in hexadecimal format
 * @param {string=} colour2  Optional second colour (Google closure syntax)
 * @param {Object} [manager=John Wayne] - Optional manager with a default value
 * @param {string} manager.name - The name of the employee.
 * @param {string} manager.department - The employee's department.
 * @param {Object[]} employees - The employees who are responsible for the project.
 * @param {string} employees[].name - The name of an employee.
 * @param {string} employees[].department - The employee's department.
 *
 */


class MyButton {

  // The parent#member syntax is necessary to group the documentation
  /**
   * @ngdoc method
   * @name  MyButton#foo
   * @param {string} [argName=carValue] - arg for foo
   * @fires MyButton#$routeChangeSuccess
   * @this MyButton
   */
  foo(argName = 'fooValue') {
    this.emit('snowball', {
      isPacked: this._snowball.isPacked
    });
    return 'bar' + argName;
  };

  /**
   * @ngdoc function
   * @name MyButton#chocolate
   * @returns {string} - Return value
   */
  chocolate(argName = 'crumble') {
    return argName;
  }

  /*
   * Not supported (requires a template called method.template.html, which
   * implies that the method is a top-level thing we wish to document
   * (which is not the case. A method belongs to a module or class or object).
   * @kind method
   */
  truffle(argName = 'crumble') {
    return argName;
  }

  // Preferred syntax:
  /**
   * Some function description
   * @ngdoc method
   * @name MyButton#candy
   * @param {string} [argName] - a brilliant description of the argument
   * @param {string} [argNum2] - a second argument
   */
  candy(argName = 'pippa') {
    return argName;
  }
}


// The @name value (e.g. MyButton...) MUST match the name of another item in the documentation
/**
 * @ngdoc event
 *
 * @name MyButton#$routeChangeSuccess
 * @eventOf ng.$route
 * @eventType broadcast on root scope
 * @description
 * Broadcasted after a route dependencies are resolved.
 * {@link ng.directive:ngView ngView} listens for the directive
 * to instantiate the controller and render the view.
 *
 * @param {Object} angularEvent Synthetic event object.
 * @param {Route} current Current route information.
 * @param {Route|Undefined} previous Previous route information, or undefined if current is first route entered.
 */
