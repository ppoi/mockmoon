'use strict';

import { match } from 'path-to-regexp';
import iconv from 'iconv-lite';

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
      return true;
    }
  }
}


/**
 * Definition of Mock Response
 */
class MockResponseDef {
  constructor() {
    this.method = null;
    this.status = 200;
    this.contentType = "application/octet-stream"
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
      content = (path, headers, cookies, params, query, data)=>(template(source()))(path, headers, cookies, params, query, data);
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


class MockResponseContent {
  constructor(source, filtering=false) {
    this.source = (typeof source == 'function') ? source : text(source);
    this.filtering = filtering;
  }

  send(resp) {
    if(this.filtering) {
      var encoding = (typeof this.filtering == 'string') ? this.filtering : null;
    } else {
    }
  }
}



const DEFAULT_TEMPLATE = ()=>{};
const DEFAULT_EVALUATOR = ()=>true;

const file = (source)=>(alt)=>(alt || readFileSync)(source);
const text = (source)=>(alt)=>(alt ? alt(source) : source);
const evaluator = (condition)=>new Function('path', 'headers', 'cookies', 'params', 'query', 'data', 'return (' + condition + ');');
const template = (template)=>new Function('path', 'headers', 'cookies', 'params', 'query', 'data', 'return (`' + template + '`);');

const sendText = (resp, text, encoding)=>resp.send(iconv.encode(text, encoding));


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
  file
};