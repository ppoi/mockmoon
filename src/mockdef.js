'use strict';

import { match } from 'path-to-regexp';

/**
 * Definition of Mock Responses
 */
class MockDef {
  constructor(path) {
    this.path = path;
    this.match = match(path);
    this.responses = [];
  }

  process(path, req, res) {
    var result = match(path);
    if(!result) {
      return false;
    } else {
    }  
  }
}


/**
 * Definition of Mock Response
 */
class MockResponseDef {
  constructor() {
    this.status = 200;
    this._content = DEFAULT_TEMPLATE;
    this._condition = DEFAULT_EVALUATOR;
  }

  /**
   * properties: content
   * set source as text or filePath, get template processor
   */
  set content(source) {
    var content;
    if(typeof source == "function") {
      content = (path, params, settings)=>(template(source()))(path, params, settings);
    } else {
      content = template(source);
    }
    this._content = content;
  }
  get content() {
    return this._content;
  }

  /**
   * properties: condition
   * set condition as string, get condition evaluator
   */
  set condition(condition) {
    this._condition = evaluator(condition);
  }
  get condition() {
    return this._condition;
  }
}

const DEFAULT_TEMPLATE = ()=>{};
const DEFAULT_EVALUATOR = ()=>true;

const file = (source)=>()=>readFileSync(source).toString();
const evaluator = (condition)=>new Function('path', 'params', 'settigs', 'return (' + condition + ');');
const template = (template)=>new Function('path', 'params', 'settigs', 'return (`' + template + '`);');



import { readFileSync } from 'fs';
import { parseDocument } from 'yaml';
var loadMockDef = (filePath)=>{
  var doc = parseDocument(readFileSync(filePath));
  if(doc.errors || doc.errors.length) {
    //TODO: error handling
  } else {
    var defs = doc.contents.items.reduce((acc, item)=>{
      var mockdef = new MockDef(item.key.value);
      var def = item.value.toJSON();
      if(Array.isArray(def)) {
      } else {
      }
      acc.push(mockdef);
      return acc;
    }, []);
  }
}

export {
  MockDef,
  MockResponseDef,
  file,
  evaluator,
  template
};