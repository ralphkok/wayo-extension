define(['handlebars.runtime'], function(Handlebars) {

return Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "class=\"unseen\"";
  },"3":function(depth0,helpers,partials,data) {
  return "        <div class=\"unseen-indicator\"></div>\n";
  },"5":function(depth0,helpers,partials,data) {
  return "<hr/>";
  },"7":function(depth0,helpers,partials,data) {
  return "selected";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "<li data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.date_seen : depth0), {"name":"unless","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " alt=\""
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.incoming : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n    <div class=\"img\" style=\"background-image:url('"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.image : stack1), depth0))
    + "');\"/>\n\n    <div class=\"info\">\n        <p class=\"mate\">from: "
    + escapeExpression(((helper = (helper = helpers.sender || (depth0 != null ? depth0.sender : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sender","hash":{},"data":data}) : helper)))
    + "</p>\n        <p class=\"date\">"
    + escapeExpression(((helper = (helper = helpers.date_sent || (depth0 != null ? depth0.date_sent : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"date_sent","hash":{},"data":data}) : helper)))
    + "</p>\n        <p class=\"comment\">"
    + escapeExpression(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"comment","hash":{},"data":data}) : helper)))
    + "</p>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.comment : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n        <p class=\"title\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n        <p class=\"description\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\n    </div>\n\n    <button class=\"fav ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.is_fav : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"></button>\n    <button class=\"remove\">X</button>\n\n</li>";
},"useData":true})

});