/**
 * Constructor function component
 *
 * @kind component
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

 */
export default function MyButton() {

  /**
   * Returns foo bar
   * @param {string} [argName=carValue] - arg for foo
   */
  this.foo = function(argName = 'fooValue') {
    return 'bar' + argName;
  };

  /**
   * @function
   */
  function chocolate(argName = 'crumble') {
    return argName;
  }
}


/**
 * @param {string} [argName=carValue] - arg for foo
 */
MyButton.prototype.bar = function(argName = 'carValue') {
  return argName;
};
