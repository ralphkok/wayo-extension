define(['handlebars.runtime'], function(Handlebars) {

return Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Please login</h2>\n<form method=\"POST\">\n    <input name=\"email\" type=\"email\" placeholder=\"E-mail address\" required autofocus/>\n    <input name=\"pass\" type=\"password\" placeholder=\"Password\" required/>\n    <input type=\"submit\" value=\"Login\"/>\n</form>";
  },"useData":true})

});